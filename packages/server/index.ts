import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import { createClientAndConnect } from './db'
import { runMigrations } from './migrations/migrate'
import topicsRoutes from './routes/topicsRoutes'
import postsRoutes from './routes/postsRoutes'
import reactionsRoutes from './routes/reactionsRoutes'
import authorizedRoutes from './routes/authorizedRoutes'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 204,
  })
)

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, OPTIONS, DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
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

const yaApiProxy = createProxyMiddleware({
  target: 'https://ya-praktikum.tech/api/v2',
  changeOrigin: true,
  cookieDomainRewrite: {
    '*': '',
  },
  pathRewrite: {
    '^/ya-api': '',
  },
  on: {
    proxyReq: (proxyReq, req: express.Request) => {
      const targetUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
      console.log('Full Target URL:', targetUrl)
      console.log('Request Method:', req.method)
      console.log('Proxying request body:', req.body)
    },
    proxyRes: proxyRes => {
      console.log('status: ', proxyRes.statusCode)
      const setCookies = proxyRes.headers['set-cookie']
      console.log('RAW Response from the target', setCookies)
    },
    error: err => {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.log('ERROR: ', errorMessage)
    },
  },
})

app.use('/ya-api', yaApiProxy)

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
