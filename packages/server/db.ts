import { Sequelize } from 'sequelize-typescript'
import path from 'path'
import { Pool } from 'pg'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

// Определяем хост в зависимости от окружения
// Если POSTGRES_HOST указан явно - используем его, иначе определяем автоматически
const host =
  POSTGRES_HOST ||
  (process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV === 'true'
    ? 'postgres'
    : 'localhost')

// Создаем экземпляр Sequelize
export const sequelize = new Sequelize({
  database: POSTGRES_DB || 'forum_db',
  dialect: 'postgres',
  host: host,
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER || 'postgres',
  password: POSTGRES_PASSWORD || 'postgres',
  models: [path.join(__dirname, 'models')], // Путь к моделям
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

// Функция для подключения к БД
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('  ➜ 🎸 Connected to the database via Sequelize')

    // Синхронизация моделей с БД (в продакшене лучше использовать миграции)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }) // alter: true для автоматического обновления схемы
      console.log('  ➜ 📊 Database models synchronized')
    }
  } catch (error) {
    console.error('  ➜ ❌ Unable to connect to the database:', error)
    console.error(
      `  ➜ 💡 Trying to connect to: ${host}:${Number(POSTGRES_PORT) || 5432}`
    )
    console.error('  ➜ 💡 Make sure PostgreSQL is running:')
    console.error('     - For Docker: docker compose up postgres')
    console.error(
      '     - For local: ensure PostgreSQL is installed and running'
    )
    throw error
  }
}

// Создаем пул соединений PostgreSQL для прямых SQL запросов
let dbPool: Pool | null = null

export const getDbPool = (): Pool => {
  if (!dbPool) {
    dbPool = new Pool({
      host: host,
      port: Number(POSTGRES_PORT) || 5432,
      user: POSTGRES_USER || 'postgres',
      password: POSTGRES_PASSWORD || 'postgres',
      database: POSTGRES_DB || 'forum_db',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return dbPool
}

// Экспортируем для обратной совместимости (если где-то используется)
export const createClientAndConnect = async () => {
  await connectDatabase()
  return sequelize
}
