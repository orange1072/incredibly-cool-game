import { Request, Response } from 'express'
import { getDbPool } from '../db'

export interface CreateTopicRequest {
  title: string
  author: string
  author_badge: string
  preview: string
  tags?: string[]
}

export interface TopicResponse {
  id: number
  title: string
  author: string
  authorBadge: string
  date: string
  preview: string
  tags?: string[]
  likes?: number
  comments?: number
}

// Get all topics
export const getTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = getDbPool()

    // Get topics with counts of reactions (likes) and posts (comments)
    const result = await pool.query(
      `SELECT 
        t.id,
        t.title,
        t.author,
        t.author_badge,
        t.created_at,
        t.preview,
        t.tags,
        COALESCE(COUNT(DISTINCT r.id), 0) as likes,
        COALESCE(COUNT(DISTINCT p.id), 0) as comments
      FROM topics t
      LEFT JOIN reactions r ON t.id = r.topic_id
      LEFT JOIN posts p ON t.id = p.topic_id
      GROUP BY t.id
      ORDER BY t.created_at DESC`
    )

    const topics: TopicResponse[] = result.rows.map(row => {
      const date = new Date(row.created_at)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

      return {
        id: row.id,
        title: row.title,
        author: row.author,
        authorBadge: row.author_badge,
        date: formattedDate,
        preview: row.preview,
        tags: row.tags || [],
        likes: parseInt(row.likes, 10),
        comments: parseInt(row.comments, 10),
      }
    })

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
        t.author,
        t.author_badge,
        t.created_at,
        t.preview,
        t.tags,
        COALESCE(COUNT(DISTINCT r.id), 0) as likes,
        COALESCE(COUNT(DISTINCT p.id), 0) as comments
      FROM topics t
      LEFT JOIN reactions r ON t.id = r.topic_id
      LEFT JOIN posts p ON t.id = p.topic_id
      WHERE t.id = $1
      GROUP BY t.id`,
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
      author: row.author,
      authorBadge: row.author_badge,
      date: formattedDate,
      preview: row.preview,
      tags: row.tags || [],
      likes: parseInt(row.likes, 10),
      comments: parseInt(row.comments, 10),
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
    const { title, author, author_badge, preview, tags }: CreateTopicRequest =
      req.body

    // Validate required fields
    if (!title || !author || !author_badge || !preview) {
      res.status(400).json({
        error: 'Missing required fields: title, author, author_badge, preview',
      })
      return
    }

    // Validate title length
    if (title.length > 255) {
      res.status(400).json({ error: 'Title too long (max 255 characters)' })
      return
    }

    // Validate author length
    if (author.length > 100) {
      res
        .status(400)
        .json({ error: 'Author name too long (max 100 characters)' })
      return
    }

    // Validate author_badge length
    if (author_badge.length > 50) {
      res.status(400).json({
        error: 'Author badge too long (max 50 characters)',
      })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      `INSERT INTO topics (title, author, author_badge, preview, tags)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, author, author_badge, created_at, preview, tags`,
      [title, author, author_badge, preview, tags || []]
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
      author: row.author,
      authorBadge: row.author_badge,
      date: formattedDate,
      preview: row.preview,
      tags: row.tags || [],
      likes: 0,
      comments: 0,
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
       RETURNING id, title, author, author_badge, created_at, preview, tags`,
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
      author: row.author,
      authorBadge: row.author_badge,
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
