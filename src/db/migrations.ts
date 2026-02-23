import { Kysely, Migration, MigrationProvider } from 'kysely'

const migrations: Record<string, Migration> = {}

export const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations
  },
}

// Consolidated schema for SQLite.
// SQLite does not support ALTER COLUMN or adding a PK via ALTER TABLE,
// so the incremental Postgres migrations are combined here into the final schema.
migrations['001'] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable('post')
      .addColumn('uri', 'varchar(255)', (col) => col.primaryKey())
      .addColumn('cid', 'varchar(255)', (col) => col.notNull())
      .addColumn('replyParent', 'varchar(255)')
      .addColumn('replyRoot', 'varchar(255)')
      .addColumn('indexedAt', 'varchar(255)', (col) => col.notNull())
      .execute()
    await db.schema
      .createTable('sub_state')
      .addColumn('service', 'varchar(255)', (col) => col.primaryKey())
      .addColumn('cursor', 'integer', (col) => col.notNull())
      .execute()
    await db.schema
      .createTable('post_tag')
      .addColumn('id', 'integer', (col) => col.primaryKey())
      .addColumn('post_uri', 'varchar(255)', (col) =>
        col.references('post.uri').onDelete('no action').notNull(),
      )
      .addColumn('tag', 'varchar(255)', (col) => col.notNull())
      .addColumn('indexedAt', 'varchar(255)', (col) => col.notNull())
      .execute()
    await db.schema
      .createIndex('post_tag_id_index')
      .on('post_tag')
      .column('post_uri')
      .execute()
    await db.schema
      .createIndex('post_tag_feed_index')
      .on('post_tag')
      .columns(['tag', 'indexedAt desc'])
      .execute()
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropIndex('post_tag_feed_index').execute()
    await db.schema.dropIndex('post_tag_id_index').execute()
    await db.schema.dropTable('post_tag').execute()
    await db.schema.dropTable('sub_state').execute()
    await db.schema.dropTable('post').execute()
  },
}
