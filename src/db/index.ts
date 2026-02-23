import dotenv from 'dotenv'
import { Kysely, Migrator, SqliteDialect } from 'kysely'
import { DatabaseSchema } from './schema'
import { migrationProvider } from './migrations'
import SqliteDatabase from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const envPath = path.resolve(__dirname, '../../.env.local')
dotenv.config({ path: envPath })

export const createDb = async (): Promise<Database> => {
  const dbPath =
    process.env.DATABASE_PATH ??
    path.resolve(__dirname, '../../data/feed.db')
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const sqlite = new SqliteDatabase(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({ database: sqlite }),
  })
}

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider })
  const { error } = await migrator.migrateToLatest()
  if (error) throw error
}

export type Database = Kysely<DatabaseSchema>
