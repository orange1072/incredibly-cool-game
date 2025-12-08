import { Router } from 'express'
import {
  getPostById,
  updatePost,
  deletePost,
  getRepliesByPost,
} from '../controllers/postsController'
import { checkAuth } from '../middlewares/authorization'

const router = Router()

router.use(checkAuth)

// GET /api/posts/:id - Get post by ID
router.get('/:id', getPostById)

// PUT /api/posts/:id - Update post by ID
router.put('/:id', updatePost)

// DELETE /api/posts/:id - Delete post by ID
router.delete('/:id', deletePost)

// GET /api/posts/:postId/replies - Get all replies for a post (comment)
router.get('/:postId/replies', getRepliesByPost)

export default router
