import { Request, Response } from 'express'
import { getDbPool } from '../db'

export interface CreatePostRequest {
  content: string
  author: string
  author_id?: number
}

export interface PostResponse {
  id: number
  text: string
  author: string
  date: string
  avatar?: string
  author_id?: number
  topic_id: number
}

// Get all posts for a topic
export const getPostsByTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params
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

    // Get all posts for the topic
    const result = await pool.query(
      `SELECT id, content, author, author_id, topic_id, created_at
       FROM posts
       WHERE topic_id = $1
       ORDER BY created_at ASC`,
      [topicIdNum]
    )

    const posts: PostResponse[] = result.rows.map(row => {
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
        text: row.content,
        author: row.author || 'Anonymous',
        date: formattedDate,
        avatar: undefined,
        author_id: row.author_id,
        topic_id: row.topic_id,
      }
    })

    res.status(200).json(posts)
  } catch (error) {
    console.error('Error getting posts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get post by ID
export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const postId = parseInt(id, 10)

    if (isNaN(postId) || postId <= 0) {
      res.status(400).json({ error: 'Invalid post ID' })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      `SELECT id, content, author, author_id, topic_id, created_at
       FROM posts
       WHERE id = $1`,
      [postId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
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

    const post: PostResponse = {
      id: row.id,
      text: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      author_id: row.author_id,
      topic_id: row.topic_id,
    }

    res.status(200).json(post)
  } catch (error) {
    console.error('Error getting post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Create new post in a topic
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params
    const topicIdNum = parseInt(topicId, 10)
    const { content, author, author_id }: CreatePostRequest = req.body

    if (isNaN(topicIdNum) || topicIdNum <= 0) {
      res.status(400).json({ error: 'Invalid topic ID' })
      return
    }

    // Validate required fields
    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Content is required' })
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

    // Insert post
    const result = await pool.query(
      `INSERT INTO posts (content, author, author_id, topic_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, content, author, author_id, topic_id, created_at`,
      [content.trim(), author || 'Anonymous', author_id || null, topicIdNum]
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

    const post: PostResponse = {
      id: row.id,
      text: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      author_id: row.author_id,
      topic_id: row.topic_id,
    }

    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update post by ID
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const postId = parseInt(id, 10)
    const { content }: Partial<CreatePostRequest> = req.body

    if (isNaN(postId) || postId <= 0) {
      res.status(400).json({ error: 'Invalid post ID' })
      return
    }

    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Content is required' })
      return
    }

    const pool = getDbPool()

    // Check if post exists
    const checkResult = await pool.query('SELECT id FROM posts WHERE id = $1', [
      postId,
    ])

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    const result = await pool.query(
      `UPDATE posts 
       SET content = $1
       WHERE id = $2
       RETURNING id, content, author, author_id, topic_id, created_at`,
      [content.trim(), postId]
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

    const post: PostResponse = {
      id: row.id,
      text: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      author_id: row.author_id,
      topic_id: row.topic_id,
    }

    res.status(200).json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete post by ID
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const postId = parseInt(id, 10)

    if (isNaN(postId) || postId <= 0) {
      res.status(400).json({ error: 'Invalid post ID' })
      return
    }

    const pool = getDbPool()

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING id',
      [postId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
