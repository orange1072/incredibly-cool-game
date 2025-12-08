import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import { createClientAndConnect } from './db'
import { runMigrations } from './migrations/migrate'
import topicsRoutes from './routes/topicsRoutes'
import postsRoutes from './routes/postsRoutes'
import reactionsRoutes from './routes/reactionsRoutes'
import authorizedRoutes from './routes/AuthorizedRoutes'
import cookieParser from 'cookie-parser'

const app = express()
app.use(
  cors({
    origin: `http://localhost:${process.env.CLIENT_PORT || 3000}`,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

const port = Number(process.env.SERVER_PORT) || 3001

// Initialize database connection and run migrations
const initializeDatabase = async () => {
  await createClientAndConnect()
  try {
    await runMigrations()
  } catch (error) {
    console.error('Failed to run migrations:', error)
    process.exit(1)
  }
}

// roots with authorization check
app.use('/restricted', authorizedRoutes)

// API routes
// Topics API: /api/topics
app.use('/api/topics', topicsRoutes)

// Posts API (comments and replies): /api/posts
app.use('/api/posts', postsRoutes)

// Reactions API: /api/topics/:topicId/reactions
app.use('/api/topics', reactionsRoutes)

// Legacy routes
app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

// Start server after database initialization
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
    })
  })
  .catch(error => {
    console.error('Failed to initialize server:', error)
    process.exit(1)
  })
