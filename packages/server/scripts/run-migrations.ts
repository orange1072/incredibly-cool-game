import dotenv from 'dotenv'
dotenv.config()

import { getDbPool } from '../db'
import { runMigrations } from '../migrations/migrate'

const run = async () => {
  try {
    console.log('Starting migrations...')
    // Initialize pool
    getDbPool()
    await runMigrations()
    console.log('Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

run()
