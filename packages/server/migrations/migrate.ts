import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getDbPool } from '../db'

interface Migration {
  name: string
  path: string
  sql: string
}

const MIGRATIONS_TABLE = 'schema_migrations'

// Get migrations directory path
const getMigrationsDir = (): string => {
  // For ES modules
  if (typeof __dirname === 'undefined') {
    const __filename = fileURLToPath(import.meta.url)
    return join(dirname(__filename), '..', 'migrations')
  }
  // For CommonJS
  return join(__dirname, '..', 'migrations')
}

// Load migration SQL files
const loadMigrations = (): Migration[] => {
  const migrationsDir = getMigrationsDir()
  const migrations: Migration[] = []

  const migrationFiles = [
    { name: '001_create_topics_table', path: '001_create_topics_table.sql' },
    {
      name: '002_create_reactions_table',
      path: '002_create_reactions_table.sql',
    },
  ]

  for (const migration of migrationFiles) {
    const filePath = join(migrationsDir, migration.path)
    if (existsSync(filePath)) {
      const sql = readFileSync(filePath, 'utf-8')
      migrations.push({ ...migration, sql })
    } else {
      console.warn(`Warning: Migration file not found: ${filePath}`)
    }
  }

  return migrations
}

export const runMigrations = async (): Promise<void> => {
  const pool = getDbPool()
  const migrations = loadMigrations()

  if (migrations.length === 0) {
    console.warn('No migrations found to run')
    return
  }

  try {
    // Create migrations table to track applied migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Get already applied migrations
    const appliedMigrationsResult = await pool.query(
      `SELECT name FROM ${MIGRATIONS_TABLE}`
    )
    const appliedMigrations = new Set(
      appliedMigrationsResult.rows.map(row => row.name)
    )

    // Run pending migrations
    for (const migration of migrations) {
      if (appliedMigrations.has(migration.name)) {
        console.log(`✓ Migration ${migration.name} already applied`)
        continue
      }

      console.log(`Running migration: ${migration.name}...`)

      const migrationSQL = migration.sql

      // Run migration in a transaction
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(migrationSQL)
        await client.query(
          `INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`,
          [migration.name]
        )
        await client.query('COMMIT')
        console.log(`✓ Migration ${migration.name} applied successfully`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    }

    console.log('✓ All migrations completed')
  } catch (error) {
    console.error('Migration error:', error)
    throw error
  }
}
