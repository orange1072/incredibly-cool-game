import type { Request, Response } from 'express'
import { getDbPool } from '../db'
import { formatDate } from '../helpers'

export interface CreateTopicRequest {
  title: string
  login: string
  preview: string
  tags?: string[]
}

export interface TopicResponse {
  id: number
  title: string
  login: string
  date: string
  preview: string
  tags?: string[]
  reactions_count?: number
  comments_count?: number
}

// Get all topics with statistics
export const getTopics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const pool = getDbPool()

    const result = await pool.query(
      `SELECT
         t.id,
         t.title,
         t.login,
         t.created_at,
         t.preview,
         t.tags,
         COALESCE(r.reactions_count, 0) AS reactions_count,
         COALESCE(p.comments_count, 0) AS comments_count
       FROM topics t
              LEFT JOIN (
         SELECT topic_id, COUNT(*) AS reactions_count
         FROM reactions
         WHERE topic_id IS NOT NULL
         GROUP BY topic_id
       ) r ON t.id = r.topic_id
              LEFT JOIN (
         SELECT topic_id, COUNT(*) AS comments_count
         FROM posts
         WHERE parent_id IS NULL  -- Only top-level comments
         GROUP BY topic_id
       ) p ON t.id = p.topic_id
       ORDER BY t.created_at DESC`
    )

    const topics: TopicResponse[] = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      login: row.login,
      date: formatDate(row.created_at),
      preview: row.preview,
      tags: row.tags || [],
      reactions_count: parseInt(row.reactions_count, 10),
      comments_count: parseInt(row.comments_count, 10),
    }))

    res.status(200).json(topics)
  } catch (error) {
    console.error('Error getting topics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get topic by ID
export const getTopicById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const topicId = parseInt(id, 10)

    if (isNaN(topicId) || topicId <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      `SELECT
         t.id,
         t.title,
         t.login,
         t.created_at,
         t.preview,
         t.tags,
         COALESCE(r.reactions_count, 0) AS reactions_count,
         COALESCE(p.comments_count, 0) AS comments
       FROM topics t
              LEFT JOIN (
         SELECT topic_id, COUNT(*) AS reactions_count
         FROM reactions
         GROUP BY topic_id
       ) r ON t.id = r.topic_id
              LEFT JOIN (
         SELECT topic_id, COUNT(*) AS comments_count
         FROM posts
         GROUP BY topic_id
       ) p ON t.id = p.topic_id
       WHERE t.id = $1`,
      [topicId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Topic not found' })
      return
    }

    const row = result.rows[0]
    const date = new Date(row.created_at)
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    const topic: TopicResponse = {
      id: row.id,
      title: row.title,
      login: row.login,
      date: formattedDate,
      preview: row.preview,
      tags: row.tags || [],
      reactions_count: parseInt(row.reactions_count, 10),
      comments_count: parseInt(row.comments_count, 10),
    }

    res.status(200).json(topic)
  } catch (error) {
    console.error('Error getting topic:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Create new topic
export const createTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, login, preview, tags }: CreateTopicRequest = req.body

    // Validate required fields
    if (!title || !login || !preview) {
      res.status(400).json({
        error: 'Missing required fields: title, login, preview',
      })
      return
    }

    // Validate title length
    if (title.length > 255) {
      res.status(400).json({ error: 'Title too long (max 255 characters)' })
      return
    }

    // Validate login length
    if (!login) {
      res.status(400).json({ error: 'login not defined' })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      `INSERT INTO topics (title, login, preview, tags)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, login,  created_at, preview, tags`,
      [title, login, preview, tags || []]
    )

    const row = result.rows[0]
    const date = formatDate(new Date(row.created_at))

    const topic: TopicResponse = {
      id: row.id,
      title: row.title,
      login: row.login,
      date,
      preview: row.preview,
      tags: row.tags || [],
      reactions_count: 0,
      comments_count: 0,
    }

    res.status(201).json(topic)
  } catch (error) {
    console.error('Error creating topic:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update topic by ID
export const updateTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const topicId = parseInt(id, 10)
    const { title, preview, tags }: Partial<CreateTopicRequest> = req.body

    if (isNaN(topicId) || topicId <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
      return
    }

    const pool = getDbPool()

    // Check if topic exists
    const checkResult = await pool.query(
      'SELECT id FROM topics WHERE id = $1',
      [topicId]
    )

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Topic not found' })
      return
    }

    // Build update query dynamically
    const updates: string[] = []

    const values: unknown[] = []
    let paramCount = 1

    if (title !== undefined) {
      if (title.length > 255) {
        res.status(400).json({ error: 'Title too long (max 255 characters)' })
        return
      }
      updates.push(`title = $${paramCount++}`)
      values.push(title)
    }

    if (preview !== undefined) {
      updates.push(`preview = $${paramCount++}`)
      values.push(preview)
    }

    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`)
      values.push(tags)
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' })
      return
    }

    values.push(topicId)

    const result = await pool.query(
      `UPDATE topics 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, title, login, created_at, preview, tags`,
      values
    )

    const row = result.rows[0]
    const date = new Date(row.created_at)
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    const topic: TopicResponse = {
      id: row.id,
      title: row.title,
      login: row.login,
      date: formattedDate,
      preview: row.preview,
      tags: row.tags || [],
    }

    res.status(200).json(topic)
  } catch (error) {
    console.error('Error updating topic:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete topic by ID
export const deleteTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const topicId = parseInt(id, 10)

    if (isNaN(topicId) || topicId <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      'DELETE FROM topics WHERE id = $1 RETURNING id',
      [topicId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Topic not found' })
      return
    }

    res.status(200).json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
