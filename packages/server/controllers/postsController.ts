import type { Request, Response } from 'express'
import { getDbPool } from '../db'

export interface CreatePostRequest {
  content: string
  author: string
  author_id?: number
  parent_id?: number // ID родительского комментария (для ответов)
}

export interface PostResponse {
  id: number
  text: string
  author: string
  date: string
  avatar?: string
  author_id?: number
  topic_id: number
  parent_id?: number // ID родительского комментария
  replies?: PostResponse[] // Вложенные ответы
  replies_count?: number // Количество ответов
}

// Тип для строки результата запроса из БД
interface PostRow {
  id: number
  content: string
  author: string | null
  author_id: number | null
  topic_id: number
  parent_id: number | null
  created_at: Date
  replies_count?: string | number // Может быть строкой из COUNT()
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

    // Get all posts for the topic (only top-level comments, not replies)
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.content, 
        p.author, 
        p.author_id, 
        p.topic_id, 
        p.parent_id,
        p.created_at,
        COUNT(r.id) as replies_count
       FROM posts p
       LEFT JOIN posts r ON r.parent_id = p.id
       WHERE p.topic_id = $1 AND p.parent_id IS NULL
       GROUP BY p.id, p.content, p.author, p.author_id, p.topic_id, p.parent_id, p.created_at
       ORDER BY p.created_at ASC`,
      [topicIdNum]
    )

    // Get all replies
    const repliesResult = await pool.query(
      `SELECT id, content, author, author_id, topic_id, parent_id, created_at
       FROM posts
       WHERE topic_id = $1 AND parent_id IS NOT NULL
       ORDER BY created_at ASC`,
      [topicIdNum]
    )

    // Format replies
    const formatPost = (row: PostRow): PostResponse => {
      const date = new Date(row.created_at)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

      const repliesCount =
        typeof row.replies_count === 'string'
          ? parseInt(row.replies_count, 10)
          : row.replies_count || 0

      return {
        id: row.id,
        text: row.content,
        author: row.author || 'Anonymous',
        date: formattedDate,
        avatar: undefined,
        author_id: row.author_id || undefined,
        topic_id: row.topic_id,
        parent_id: row.parent_id || undefined,
        replies_count: repliesCount,
      }
    }

    const posts: PostResponse[] = result.rows.map(formatPost)

    // Group replies by parent_id
    const repliesByParent = new Map<number, PostResponse[]>()
    repliesResult.rows.forEach(row => {
      const reply = formatPost(row)
      const parentId = row.parent_id
      if (!repliesByParent.has(parentId)) {
        repliesByParent.set(parentId, [])
      }
      repliesByParent.get(parentId)!.push(reply)
    })

    // Attach replies to their parent posts
    posts.forEach(post => {
      const replies = repliesByParent.get(post.id)
      if (replies && replies.length > 0) {
        post.replies = replies
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
      `SELECT id, content, author, author_id, topic_id, parent_id, created_at
       FROM posts
       WHERE id = $1`,
      [postId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    const row = result.rows[0] as PostRow
    const date = new Date(row.created_at)
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    // Get replies count
    const repliesCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE parent_id = $1',
      [postId]
    )
    const repliesCount = parseInt(repliesCountResult.rows[0]?.count || '0', 10)

    const post: PostResponse = {
      id: row.id,
      text: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      author_id: row.author_id || undefined,
      topic_id: row.topic_id,
      parent_id: row.parent_id || undefined,
      replies_count: repliesCount,
    }

    res.status(200).json(post)
  } catch (error) {
    console.error('Error getting post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Create new post in a topic (comment or reply)
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topicId } = req.params
    const topicIdNum = parseInt(topicId, 10)
    const { content, author, author_id, parent_id }: CreatePostRequest =
      req.body

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

    // If parent_id is provided, validate that parent post exists and belongs to the same topic
    if (parent_id !== undefined && parent_id !== null) {
      const parentIdNum = parseInt(String(parent_id), 10)
      if (isNaN(parentIdNum) || parentIdNum <= 0) {
        res.status(400).json({ error: 'Invalid parent_id' })
        return
      }

      const parentResult = await pool.query(
        'SELECT id, topic_id FROM posts WHERE id = $1',
        [parentIdNum]
      )

      if (parentResult.rows.length === 0) {
        res.status(404).json({ error: 'Parent post not found' })
        return
      }

      const parentRow = parentResult.rows[0] as { id: number; topic_id: number }
      if (parentRow.topic_id !== topicIdNum) {
        res.status(400).json({
          error: 'Parent post does not belong to the same topic',
        })
        return
      }
    }

    // Insert post
    const result = await pool.query(
      `INSERT INTO posts (content, author, author_id, topic_id, parent_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, content, author, author_id, topic_id, parent_id, created_at`,
      [
        content.trim(),
        author || 'Anonymous',
        author_id || null,
        topicIdNum,
        parent_id || null,
      ]
    )

    const row = result.rows[0] as PostRow
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
      author_id: row.author_id || undefined,
      topic_id: row.topic_id,
      parent_id: row.parent_id || undefined,
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
       RETURNING id, content, author, author_id, topic_id, parent_id, created_at`,
      [content.trim(), postId]
    )

    const row = result.rows[0] as PostRow
    const date = new Date(row.created_at)
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear().toString().slice(2)} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    // Get replies count
    const repliesCountResult = await pool.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM posts WHERE parent_id = $1',
      [postId]
    )
    const repliesCount = parseInt(repliesCountResult.rows[0]?.count || '0', 10)

    const post: PostResponse = {
      id: row.id,
      text: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      author_id: row.author_id || undefined,
      topic_id: row.topic_id,
      parent_id: row.parent_id || undefined,
      replies_count: repliesCount,
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

// Get replies for a specific post (comment)
export const getRepliesByPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params
    const postIdNum = parseInt(postId, 10)

    if (isNaN(postIdNum) || postIdNum <= 0) {
      res.status(400).json({ error: 'Invalid post ID' })
      return
    }

    const pool = getDbPool()

    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [
      postIdNum,
    ])

    if (postResult.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    // Get all replies for the post
    const result = await pool.query(
      `SELECT id, content, author, author_id, topic_id, parent_id, created_at
       FROM posts
       WHERE parent_id = $1
       ORDER BY created_at ASC`,
      [postIdNum]
    )

    const formatPost = (row: PostRow): PostResponse => {
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
        author_id: row.author_id || undefined,
        topic_id: row.topic_id,
        parent_id: row.parent_id || undefined,
      }
    }

    const replies: PostResponse[] = result.rows.map(formatPost)

    res.status(200).json(replies)
  } catch (error) {
    console.error('Error getting replies:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
