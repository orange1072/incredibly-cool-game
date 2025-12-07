import { Request, Response } from 'express'
import { getDbPool } from '../db'
import {
  CreateReactionRequest,
  ReactionResponse,
  ReactionStats,
} from '../types/Reaction'

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

// Add reaction to topic
export const addReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params
    const { user_id, emoji }: CreateReactionRequest = req.body

    // Validate topic ID
    const topicIdNum = parseInt(topicId, 10)
    if (isNaN(topicIdNum) || topicIdNum <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
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

    // Check if topic exists
    const topicResult = await pool.query(
      'SELECT id FROM topics WHERE id = $1',
      [topicIdNum]
    )

    if (topicResult.rows.length === 0) {
      res.status(404).json({ error: 'Topic not found' })
      return
    }

    // Try to insert or update reaction
    // Use ON CONFLICT to handle duplicate reactions (same user, same topic, same emoji)
    const result = await pool.query(
      `INSERT INTO reactions (topic_id, user_id, emoji)
       VALUES ($1, $2, $3)
       ON CONFLICT (topic_id, user_id, emoji) DO NOTHING
       RETURNING id, topic_id, user_id, emoji, created_at`,
      [topicIdNum, user_id, emoji]
    )

    if (result.rows.length === 0) {
      // Reaction already exists
      res.status(409).json({ error: 'Reaction already exists' })
      return
    }

    const reaction: ReactionResponse = {
      id: result.rows[0].id,
      topic_id: result.rows[0].topic_id,
      user_id: result.rows[0].user_id,
      emoji: result.rows[0].emoji,
      created_at: result.rows[0].created_at.toISOString(),
    }

    res.status(201).json(reaction)
  } catch (error) {
    console.error('Error adding reaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all reactions for a topic with statistics
export const getReactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params

    // Validate topic ID
    const topicIdNum = parseInt(topicId, 10)
    if (isNaN(topicIdNum) || topicIdNum <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
      return
    }

    const pool = getDbPool()

    // Check if topic exists
    const topicResult = await pool.query(
      'SELECT id FROM topics WHERE id = $1',
      [topicIdNum]
    )

    if (topicResult.rows.length === 0) {
      res.status(404).json({ error: 'Topic not found' })
      return
    }

    // Get all reactions for the topic grouped by emoji
    const statsResult = await pool.query(
      `SELECT 
        emoji,
        COUNT(*) as count,
        ARRAY_AGG(DISTINCT user_id) as users
      FROM reactions
      WHERE topic_id = $1
      GROUP BY emoji
      ORDER BY count DESC, emoji ASC`,
      [topicIdNum]
    )

    const stats: ReactionStats[] = statsResult.rows.map(
      (row: { emoji: string; count: string; users: number[] }) => ({
        emoji: row.emoji,
        count: parseInt(row.count, 10),
        users: row.users,
      })
    )

    // Get all individual reactions (optional - for detailed view)
    const reactionsResult = await pool.query(
      `SELECT id, topic_id, user_id, emoji, created_at
       FROM reactions
       WHERE topic_id = $1
       ORDER BY created_at DESC`,
      [topicIdNum]
    )

    const reactions: ReactionResponse[] = reactionsResult.rows.map(
      (row: {
        id: number
        topic_id: number
        user_id: number
        emoji: string
        created_at: Date
      }) => ({
        id: row.id,
        topic_id: row.topic_id,
        user_id: row.user_id,
        emoji: row.emoji,
        created_at: row.created_at.toISOString(),
      })
    )

    res.status(200).json({
      topic_id: topicIdNum,
      stats,
      reactions,
    })
  } catch (error) {
    console.error('Error getting reactions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Remove reaction (optional endpoint)
export const removeReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params
    const { user_id, emoji } = req.body

    // Validate topic ID
    const topicIdNum = parseInt(topicId, 10)
    if (isNaN(topicIdNum) || topicIdNum <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
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

    const result = await pool.query(
      `DELETE FROM reactions
       WHERE topic_id = $1 AND user_id = $2 AND emoji = $3
       RETURNING id`,
      [topicIdNum, user_id, emoji]
    )

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
