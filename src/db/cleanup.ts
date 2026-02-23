import { Database } from './index'

export async function deleteOldPosts(
  db: Database,
  retentionDays: number,
): Promise<{ deletedTags: number; deletedPosts: number }> {
  const cutoff = new Date(
    Date.now() - retentionDays * 24 * 60 * 60 * 1000,
  ).toISOString()

  // Delete post_tag rows first (FK references post.uri)
  const tagResult = await db
    .deleteFrom('post_tag')
    .where('indexedAt', '<', cutoff)
    .executeTakeFirst()

  // Delete posts that no longer have any tags and are older than cutoff
  const postResult = await db
    .deleteFrom('post')
    .where('indexedAt', '<', cutoff)
    .where((eb) =>
      eb.not(
        eb.exists(
          eb
            .selectFrom('post_tag')
            .select('post_tag.post_uri')
            .whereRef('post_tag.post_uri', '=', 'post.uri'),
        ),
      ),
    )
    .executeTakeFirst()

  return {
    deletedTags: Number(tagResult.numDeletedRows),
    deletedPosts: Number(postResult.numDeletedRows),
  }
}
