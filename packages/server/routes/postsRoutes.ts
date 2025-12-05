import { Router } from 'express'
import {
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postsController'

const router = Router()

// GET /api/posts/:id - Get post by ID
router.get('/:id', getPostById)

// PUT /api/posts/:id - Update post by ID
router.put('/:id', updatePost)

// DELETE /api/posts/:id - Delete post by ID
router.delete('/:id', deletePost)

export default router
