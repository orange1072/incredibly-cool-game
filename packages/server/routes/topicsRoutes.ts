import { Router } from 'express'
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../controllers/topicsController'
import { getPostsByTopic, createPost } from '../controllers/postsController'

const router = Router()

// GET /api/topics - Get all topics
router.get('/', getTopics)

// GET /api/topics/:id - Get topic by ID
router.get('/:id', getTopicById)

// POST /api/topics - Create new topic
router.post('/', createTopic)

// PUT /api/topics/:id - Update topic by ID
router.put('/:id', updateTopic)

// DELETE /api/topics/:id - Delete topic by ID
router.delete('/:id', deleteTopic)

// GET /api/topics/:topicId/posts - Get all posts for a topic
router.get('/:topicId/posts', getPostsByTopic)

// POST /api/topics/:topicId/posts - Create new post in a topic
router.post('/:topicId/posts', createPost)

export default router
