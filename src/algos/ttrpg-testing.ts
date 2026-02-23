import { createHandler } from './createHandler'
import { shortname as ttrpgShortname } from './ttrpg'

export const shortname = 'ttrpgfolkstest'

// Test feed: reads from the same posts as the main ttrpg feed
export const handler = createHandler(ttrpgShortname)
