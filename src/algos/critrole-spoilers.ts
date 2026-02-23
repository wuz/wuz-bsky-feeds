import buildRegex from './buildRegex'
import { CreateOp } from '../subscription'
import { createHandler } from './createHandler'

export const shortname = 'critrolespoiler'

const terms = ['crit(ical)? role spoilers?']

const matchRegex = buildRegex(terms)

const matcher = (post: CreateOp) =>
  matchRegex.test(post.record.text.toLowerCase())

export const filterAndMap = (posts: CreateOp[]) =>
  posts.filter(matcher).map((create) => ({
    uri: create.uri,
    cid: create.cid,
    replyParent: create.record?.reply?.parent.uri ?? null,
    replyRoot: create.record?.reply?.root.uri ?? null,
    indexedAt: new Date().toISOString(),
  }))

export const handler = createHandler(shortname)
