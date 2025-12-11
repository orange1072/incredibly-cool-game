import type { Request, Response } from 'express'
import { getDbPool } from '../db'
import {
  CreateReactionRequest,
  ReactionResponse,
  ReactionStats,
  ReactionTargetType,
} from '../types/Reaction'
import { formatDate } from '../helpers'

type ReactionRouteParams = Record<string, string | undefined>

type TargetResolution =
  | {
      ok: true
      targetType: ReactionTargetType
      targetIdValue: string
    }
  | { ok: false; error: string }

const normalizeTargetType = (value?: string): ReactionTargetType | null => {
  if (!value) {
    return null
  }

  if (value === 'topic' || value === 'topics') {
    return 'topic'
  }

  if (value === 'post' || value === 'posts') {
    return 'post'
  }

  return null
}

const resolveTargetFromParams = (
  params: ReactionRouteParams
): TargetResolution => {
  const { topicId, postId, target_type, target_id } = params

  if (topicId) {
    return { ok: true, targetType: 'topic', targetIdValue: topicId }
  }

  if (postId) {
    return { ok: true, targetType: 'post', targetIdValue: postId }
  }

  const normalizedType = normalizeTargetType(target_type)

  if (normalizedType && target_id) {
    return { ok: true, targetType: normalizedType, targetIdValue: target_id }
  }

  if (target_type && !normalizedType) {
    return {
      ok: false,
      error: 'Invalid target type. Must be "topic" or "post"',
    }
  }

  return {
    ok: false,
    error: 'Target type and ID are required',
  }
}

// Validate emoji - basic validation (should be 1-10 characters, Unicode emoji)
const isValidEmoji = (emoji: string): boolean => {
  if (!emoji || emoji.length === 0 || emoji.length > 10) {
    return false
  }
  // Basic emoji validation - Unicode emoji pattern
  const emojiRegex =
    /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}]$/u
  return emojiRegex.test(emoji)
}

// Add reaction to topic or post
export const addReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const targetResolution = resolveTargetFromParams(
      req.params as ReactionRouteParams
    )

    if (!targetResolution.ok) {
      res.status(400).json({ error: targetResolution.error })
      return
    }

    const { targetType, targetIdValue } = targetResolution
    const { user_id, emoji }: CreateReactionRequest = req.body

    // Validate target ID
    const targetIdNum = parseInt(targetIdValue, 10)
    if (isNaN(targetIdNum) || targetIdNum <= 0) {
      res.status(400).json({ error: `Invalid ${targetType} ID` })
      return
    }

    // Validate user_id
    if (!user_id || typeof user_id !== 'number' || user_id <= 0) {
      res.status(400).json({ error: 'Invalid user_id' })
      return
    }

    // Validate emoji
    if (!isValidEmoji(emoji)) {
      res.status(400).json({ error: 'Invalid emoji' })
      return
    }

    const pool = getDbPool()

    // Check if target exists
    let targetExists = false
    if (targetType === 'topic') {
      const topicResult = await pool.query(
        'SELECT id FROM topics WHERE id = $1',
        [targetIdNum]
      )
      targetExists = topicResult.rows.length > 0
    } else {
      const postResult = await pool.query(
        'SELECT id FROM posts WHERE id = $1',
        [targetIdNum]
      )
      targetExists = postResult.rows.length > 0
    }

    if (!targetExists) {
      res
        .status(404)
        .json({
          error: `${targetType === 'topic' ? 'Topic' : 'Post'} not found`,
        })
      return
    }

    // Try to insert reaction
    let result
    if (targetType === 'topic') {
      result = await pool.query(
        `INSERT INTO reactions (topic_id, user_id, emoji)
         VALUES ($1, $2, $3)
         ON CONFLICT (topic_id, user_id, emoji) DO NOTHING
         RETURNING id, topic_id as target_id, user_id, emoji, created_at`,
        [targetIdNum, user_id, emoji]
      )
    } else {
      result = await pool.query(
        `INSERT INTO reactions (post_id, user_id, emoji)
         VALUES ($1, $2, $3)
         ON CONFLICT (post_id, user_id, emoji) DO NOTHING
         RETURNING id, post_id as target_id, user_id, emoji, created_at`,
        [targetIdNum, user_id, emoji]
      )
    }

    if (result.rows.length === 0) {
      // Reaction already exists
      res.status(409).json({ error: 'Reaction already exists' })
      return
    }

    const row = result.rows[0]
    const reaction: ReactionResponse = {
      id: row.id,
      target_type: targetType,
      target_id: row.target_id,
      user_id: row.user_id,
      emoji: row.emoji,
      created_at: formatDate(row.created_at),
    }

    res.status(201).json(reaction)
  } catch (error) {
    console.error('Error adding reaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all reactions for a topic or post with statistics
export const getReactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const targetResolution = resolveTargetFromParams(
      req.params as ReactionRouteParams
    )

    if (!targetResolution.ok) {
      res.status(400).json({ error: targetResolution.error })
      return
    }

    const { targetType, targetIdValue } = targetResolution

    // Validate target ID
    const targetIdNum = parseInt(targetIdValue, 10)
    if (isNaN(targetIdNum) || targetIdNum <= 0) {
      res.status(400).json({ error: `Invalid ${targetType} ID` })
      return
    }

    const pool = getDbPool()

    // Check if target exists
    let targetExists = false
    if (targetType === 'topic') {
      const topicResult = await pool.query(
        'SELECT id FROM topics WHERE id = $1',
        [targetIdNum]
      )
      targetExists = topicResult.rows.length > 0
    } else {
      const postResult = await pool.query(
        'SELECT id FROM posts WHERE id = $1',
        [targetIdNum]
      )
      targetExists = postResult.rows.length > 0
    }

    if (!targetExists) {
      res
        .status(404)
        .json({
          error: `${targetType === 'topic' ? 'Topic' : 'Post'} not found`,
        })
      return
    }

    // Get reactions statistics
    let statsResult
    if (targetType === 'topic') {
      statsResult = await pool.query(
        `SELECT
          emoji,
          COUNT(*) as count,
          ARRAY_AGG(DISTINCT user_id) as users
        FROM reactions
        WHERE topic_id = $1
        GROUP BY emoji
        ORDER BY count DESC, emoji ASC`,
        [targetIdNum]
      )
    } else {
      statsResult = await pool.query(
        `SELECT
          emoji,
          COUNT(*) as count,
          ARRAY_AGG(DISTINCT user_id) as users
        FROM reactions
        WHERE post_id = $1
        GROUP BY emoji
        ORDER BY count DESC, emoji ASC`,
        [targetIdNum]
      )
    }

    const stats: ReactionStats[] = statsResult.rows.map(
      (row: { emoji: string; count: string; users: number[] }) => ({
        emoji: row.emoji,
        count: parseInt(row.count, 10),
        users: row.users,
      })
    )

    // Get all individual reactions
    let reactionsResult
    if (targetType === 'topic') {
      reactionsResult = await pool.query(
        `SELECT id, topic_id as target_id, user_id, emoji, created_at
         FROM reactions
         WHERE topic_id = $1
         ORDER BY created_at DESC`,
        [targetIdNum]
      )
    } else {
      reactionsResult = await pool.query(
        `SELECT id, post_id as target_id, user_id, emoji, created_at
         FROM reactions
         WHERE post_id = $1
         ORDER BY created_at DESC`,
        [targetIdNum]
      )
    }

    const reactions: ReactionResponse[] = reactionsResult.rows.map(
      (row: {
        id: number
        target_id: number
        user_id: number
        emoji: string
        created_at: Date
      }) => ({
        id: row.id,
        target_type: targetType,
        target_id: row.target_id,
        user_id: row.user_id,
        emoji: row.emoji,
        created_at: formatDate(row.created_at),
      })
    )

    res.status(200).json({
      target_type: targetType,
      target_id: targetIdNum,
      stats,
      reactions,
    })
  } catch (error) {
    console.error('Error getting reactions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Remove reaction
export const removeReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const targetResolution = resolveTargetFromParams(
      req.params as ReactionRouteParams
    )

    if (!targetResolution.ok) {
      res.status(400).json({ error: targetResolution.error })
      return
    }

    const { targetType, targetIdValue } = targetResolution
    const { user_id, emoji } = req.body

    // Validate target ID
    const targetIdNum = parseInt(targetIdValue, 10)
    if (isNaN(targetIdNum) || targetIdNum <= 0) {
      res.status(400).json({ error: `Invalid ${targetType} ID` })
      return
    }

    // Validate user_id
    if (!user_id || typeof user_id !== 'number' || user_id <= 0) {
      res.status(400).json({ error: 'Invalid user_id' })
      return
    }

    // Validate emoji
    if (!isValidEmoji(emoji)) {
      res.status(400).json({ error: 'Invalid emoji' })
      return
    }

    const pool = getDbPool()

    let result
    if (targetType === 'topic') {
      result = await pool.query(
        `DELETE FROM reactions
         WHERE topic_id = $1 AND user_id = $2 AND emoji = $3
         RETURNING id`,
        [targetIdNum, user_id, emoji]
      )
    } else {
      result = await pool.query(
        `DELETE FROM reactions
         WHERE post_id = $1 AND user_id = $2 AND emoji = $3
         RETURNING id`,
        [targetIdNum, user_id, emoji]
      )
    }

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Reaction not found' })
      return
    }

    res.status(200).json({ message: 'Reaction removed successfully' })
  } catch (error) {
    console.error('Error removing reaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
