import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/etkinlik_rehberi'

const client = postgres(connectionString, { 
  prepare: false,
  connect_timeout: 10,
  idle_timeout: 30,
  max_lifetime: 60 * 30
})
export const db = drizzle(client, { schema })

export type Database = typeof db