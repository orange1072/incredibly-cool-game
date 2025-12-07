import 'reflect-metadata' // Должен быть импортирован первым для работы декораторов
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import { connectDatabase } from './db'

const app = express()
app.use(cors())
app.use(express.json())

const port = Number(process.env.SERVER_PORT) || 3001

// Подключаемся к БД через Sequelize
connectDatabase().catch(error => {
  console.error('Failed to connect to database:', error)
  process.exit(1)
})

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

app.get('/user', (_, res) => {
  res.json({ name: '</script>Степа', secondName: 'Степанов' })
})

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)')
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
