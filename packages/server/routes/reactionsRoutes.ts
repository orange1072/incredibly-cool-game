import { Router } from 'express'
import {
  addReaction,
  getReactions,
  removeReaction,
} from '../controllers/reactionsController'

const router = Router()

// Реакции на ТОПИКИ
router.post('/topics/:topicId/reactions', addReaction)
router.get('/topics/:topicId/reactions', getReactions)
router.delete('/topics/:topicId/reactions', removeReaction)

// Реакции на ПОСТЫ (комментарии)
router.post('/posts/:postId/reactions', addReaction)
router.get('/posts/:postId/reactions', getReactions)
router.delete('/posts/:postId/reactions', removeReaction)

export default router
