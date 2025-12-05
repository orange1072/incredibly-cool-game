import { Router } from 'express'
import {
  addReaction,
  getReactions,
  removeReaction,
} from '../controllers/reactionsController'

const router = Router()

// POST /api/topics/:topicId/reactions - Add emoji reaction to topic
router.post('/:topicId/reactions', addReaction)

// GET /api/topics/:topicId/reactions - Get all reactions for topic
router.get('/:topicId/reactions', getReactions)

// DELETE /api/topics/:topicId/reactions - Remove reaction (optional)
router.delete('/:topicId/reactions', removeReaction)

export default router
