import { exec } from 'child_process'
import { Client } from 'pg'
import { promisify } from 'util'
import * as fs from 'node:fs'
const execAsync = promisify(exec)

// Просто выполняем psql с файлами
const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL не установлен')
  }

  console.log('⚡ Применение миграций через psql...')

  try {
    // Для development: сначала сбрасываем схему
    if (process.env.NODE_ENV !== 'production') {
      await execAsync(
        `psql ${process.env.DATABASE_URL} -f ./migrations/reset.sql`
      )
      console.log('✅ Схема сброшена')
    }

    // Применяем все миграции
    const files = fs
      .readdirSync('./migrations')
      .filter(f => f.endsWith('.sql') && f !== 'reset.sql')
      .sort()

    for (const file of files) {
      await execAsync(
        `psql ${process.env.DATABASE_URL} -f ./migrations/${file}`
      )
      console.log(`✅ ${file} применена`)
    }

    console.log('🎉 Все миграции успешно применены')
  } catch (e) {
    console.error('❌ Ошибка:', e.stderr || e.message)
    process.exit(1)
  }
}

const clearPgCache = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()

    // 1. Сбрасываем кэш типов
    await client.query('DISCARD ALL')

    // 2. Принудительно перечитываем системные каталоги
    await client.query('SELECT pg_reload_conf()')

    // 3. Сбрасываем планы запросов
    await client.query('SELECT * FROM pg_prepared_statements')
    await client.query('DEALLOCATE ALL')

    console.log('🧹 Кэш драйвера pg очищен')
  } finally {
    await client.end()
  }
}
clearPgCache()
runMigrations()
