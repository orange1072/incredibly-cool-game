import type { Request, Response } from 'express'
import { getDbPool } from '../db'
import { formatDate } from '../helpers'

export interface CreatePostRequest {
  content: string
  author: string
  user_id?: number
  parent_id?: number // ID родительского комментария (для ответов)
}

export interface PostResponse {
  id: number
  content: string
  author: string
  date: string
  avatar?: string
  user_id?: number
  topic_id: number
  parent_id?: number
  replies?: PostResponse[]
  replies_count?: number
  reactions_count?: number
}

// Тип для строки результата запроса из БД
interface PostRow {
  id: number
  content: string
  author: string | null
  user_id: number | null
  topic_id: number
  parent_id: number | null
  created_at: Date
  replies_count?: number
  reactions_count?: number
}

// Рекурсивная функция для построения дерева комментариев
const buildCommentTree = (
  posts: PostRow[],
  parentId: number | null = null,
  maxDepth = 3,
  currentDepth = 0
): PostResponse[] => {
  if (currentDepth >= maxDepth) return []

  return posts
    .filter(post => post.parent_id === parentId)
    .map(post => {
      const replies = buildCommentTree(
        posts,
        post.id,
        maxDepth,
        currentDepth + 1
      )

      return {
        id: post.id,
        content: post.content,
        author: post.author || 'Anonymous',
        date: formatDate(post.created_at),
        avatar: undefined,
        user_id: post.user_id || undefined,
        topic_id: post.topic_id,
        parent_id: post.parent_id || undefined,
        replies: replies.length > 0 ? replies : undefined,
        replies_count: replies.length,
        reactions_count: post.reactions_count || 0,
      }
    })
}

// Get all posts for a topic with tree structure
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

    // Get all posts for the topic with reactions count
    const result = await pool.query(
      `SELECT 
         p.id, 
         p.content, 
         p.author, 
         p.user_id, 
         p.topic_id, 
         p.parent_id,
         p.created_at,
         COALESCE(r.reactions_count, 0) as reactions_count
       FROM posts p
       LEFT JOIN (
         SELECT post_id, COUNT(*) AS reactions_count
         FROM reactions
         WHERE post_id IS NOT NULL
         GROUP BY post_id
       ) r ON p.id = r.post_id
       WHERE p.topic_id = $1
       ORDER BY p.created_at ASC`,
      [topicIdNum]
    )

    // Build comment tree
    const postsTree = buildCommentTree(result.rows)

    // Return only top-level posts
    const topLevelPosts = postsTree.filter(post => post.parent_id === undefined)

    res.status(200).json(topLevelPosts)
  } catch (error) {
    console.error('Error getting posts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get post by ID with replies
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

    // Get post with reactions count
    const postResult = await pool.query(
      `SELECT 
         p.id, p.content, p.author, p.user_id, p.topic_id, 
         p.parent_id, p.created_at,
         COALESCE(r.reactions_count, 0) as reactions_count
       FROM posts p
       LEFT JOIN (
         SELECT post_id, COUNT(*) AS reactions_count
         FROM reactions
         WHERE post_id IS NOT NULL
         GROUP BY post_id
       ) r ON p.id = r.post_id
       WHERE p.id = $1`,
      [postId]
    )

    if (postResult.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    const row = postResult.rows[0] as PostRow

    // Get all replies with their replies (up to 2 levels deep)
    const repliesResult = await pool.query(
      `SELECT 
         p.id, p.content, p.author, p.user_id, p.topic_id, 
         p.parent_id, p.created_at,
         COALESCE(r.reactions_count, 0) as reactions_count
       FROM posts p
       LEFT JOIN (
         SELECT post_id, COUNT(*) AS reactions_count
         FROM reactions
         WHERE post_id IS NOT NULL
         GROUP BY post_id
       ) r ON p.id = r.post_id
       WHERE p.parent_id = $1
       ORDER BY p.created_at ASC`,
      [postId]
    )

    // Get direct replies count
    const repliesCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE parent_id = $1',
      [postId]
    )
    const repliesCount = parseInt(repliesCountResult.rows[0].count, 10)

    // Build replies tree (only 1 level deep for this endpoint)
    const replies = repliesResult.rows.map((replyRow: PostRow) => ({
      id: replyRow.id,
      content: replyRow.content,
      author: replyRow.author || 'Anonymous',
      date: formatDate(replyRow.created_at),
      avatar: undefined,
      user_id: replyRow.user_id || undefined,
      topic_id: replyRow.topic_id,
      parent_id: replyRow.parent_id || undefined,
      replies_count: 0, // Not including nested replies in this endpoint
      reactions_count: replyRow.reactions_count || 0,
    }))

    const post: PostResponse = {
      id: row.id,
      content: row.content,
      author: row.author || 'Anonymous',
      date: formatDate(row.created_at),
      avatar: undefined,
      user_id: row.user_id || undefined,
      topic_id: row.topic_id,
      parent_id: row.parent_id || undefined,
      replies: replies.length > 0 ? replies : undefined,
      replies_count: repliesCount,
      reactions_count: row.reactions_count || 0,
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
    const { content, author, user_id, parent_id }: CreatePostRequest = req.body

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
    let parentPostTopicId: number | null = null
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

      parentPostTopicId = parentResult.rows[0].topic_id
      if (parentPostTopicId !== topicIdNum) {
        res.status(400).json({
          error: 'Parent post does not belong to the same topic',
        })
        return
      }
    }

    // Insert post
    const result = await pool.query(
      `INSERT INTO posts (content, author, user_id, topic_id, parent_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, content, author, user_id, topic_id, parent_id, created_at`,
      [
        content.trim(),
        author || 'Anonymous',
        user_id || null,
        topicIdNum,
        parent_id || null,
      ]
    )

    const row = result.rows[0] as PostRow
    const post: PostResponse = {
      id: row.id,
      content: row.content,
      author: row.author || 'Anonymous',
      date: formatDate(row.created_at),
      avatar: undefined,
      user_id: row.user_id || undefined,
      topic_id: row.topic_id,
      parent_id: row.parent_id || undefined,
      replies_count: 0,
      reactions_count: 0,
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
       RETURNING id, content, author, user_id, topic_id, parent_id, created_at`,
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
      content: row.content,
      author: row.author || 'Anonymous',
      date: formattedDate,
      avatar: undefined,
      user_id: row.user_id || undefined,
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
      `SELECT id, content, author, user_id, topic_id, parent_id, created_at
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
        content: row.content,
        author: row.author || 'Anonymous',
        date: formattedDate,
        avatar: undefined,
        user_id: row.user_id || undefined,
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
