import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { Topic } from '../models/Topic'
import { Post } from '../models/Post'
import { User } from '../models/User'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

const sequelizeOptions: SequelizeOptions = {
  host: POSTGRES_HOST || 'postgres',
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  dialect: 'postgres',
  models: [Topic, User, Post],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
}

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions)

// Инициализируем подключение к БД
export const dbConnect = async (): Promise<void> => {
  try {
    await sequelize.authenticate() // Проверка аутентификации в БД
    console.log(
      '  ➜ 🎸 Sequelize connection has been established successfully.'
    )
    // Не используем sync() в продакшене, используем миграции
    if (process.env.NODE_ENV === 'development') {
      // В development можно использовать sync для быстрой разработки
      // await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}
