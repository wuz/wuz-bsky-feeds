import { CreateOp } from '../subscription'
import { createHandler } from './createHandler'

export const shortname = 'ttrpg-intro'

const matcher = (post: CreateOp) =>
  post.record.text.toLowerCase().includes('#ttrpgintro')

export const filterAndMap = (posts: CreateOp[]) =>
  posts.filter(matcher).map((create) => ({
    uri: create.uri,
    cid: create.cid,
    replyParent: create.record?.reply?.parent.uri ?? null,
    replyRoot: create.record?.reply?.root.uri ?? null,
    indexedAt: new Date().toISOString(),
  }))

export const handler = createHandler(shortname)
