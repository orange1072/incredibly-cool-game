import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import { createClientAndConnect } from './db'
import { runMigrations } from './migrations/migrate'
import topicsRoutes from './routes/topicsRoutes'
import postsRoutes from './routes/postsRoutes'
import reactionsRoutes from './routes/reactionsRoutes'
import { yandexProxy } from './middlewares/yandexProxy'

const app = express()

const defaultClientPort = Number(process.env.CLIENT_PORT) || 3000
const corsOriginsFromEnv = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',')
      .map(origin => origin.trim())
      .filter(Boolean)
  : []
const allowedCorsOrigins =
  corsOriginsFromEnv.length > 0
    ? corsOriginsFromEnv
    : [`http://localhost:${defaultClientPort}`]

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedCorsOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`))
      }
    },
  })
)

// proxy requests for yandex api
app.use('/ya-api', yandexProxy)

app.use(express.json())

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
