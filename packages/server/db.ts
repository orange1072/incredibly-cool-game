import { Client, Pool } from 'pg'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

// Connection pool for reusing connections
let pool: Pool | null = null

export const getDbPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      user: POSTGRES_USER,
      host: POSTGRES_HOST || 'postgres',
      database: POSTGRES_DB,
      password: POSTGRES_PASSWORD,
      port: Number(POSTGRES_PORT) || 5432,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export const createClientAndConnect = async (): Promise<Client | null> => {
  try {
    const client = new Client({
      user: POSTGRES_USER,
      host: POSTGRES_HOST || 'postgres',
      database: POSTGRES_DB,
      password: POSTGRES_PASSWORD,
      port: Number(POSTGRES_PORT) || 5432,
    })

    await client.connect()

    const res = await client.query('SELECT NOW()')
    console.log('  ➜ 🎸 Connected to the database at:', res?.rows?.[0].now)
    client.end()

    // Initialize pool
    getDbPool()

    return client
  } catch (e) {
    console.error(e)
  }

  return null
}
