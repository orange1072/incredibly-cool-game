import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { getDbPool } from '../db'

const MIGRATIONS_TABLE = 'schema_migrations'

type Migration = {
  name: string
  path: string
  sql: string
}

const getMigrationsDir = () => __dirname

const loadMigrations = (): Migration[] => {
  const migrationsDir = getMigrationsDir()
  const migrations: Migration[] = []
  const migrationFiles = [{ name: 'schema', path: 'schema.sql' }]

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

export const runMigrations = async () => {
  const pool = getDbPool()
  const migrations = loadMigrations()

  if (migrations.length === 0) {
    console.warn('No migrations found to run')
    return
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const appliedMigrationsResult = await pool.query(
      `SELECT name FROM ${MIGRATIONS_TABLE}`
    )
    const appliedMigrations = new Set<string>(
      appliedMigrationsResult.rows.map((row: { name: string }) => row.name)
    )

    for (const migration of migrations) {
      if (appliedMigrations.has(migration.name)) {
        console.log(`✓ Migration ${migration.name} already applied`)
        continue
      }

      console.log(`Running migration: ${migration.name}...`)
      const migrationSQL = migration.sql
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
