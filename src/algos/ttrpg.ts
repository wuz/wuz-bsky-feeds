import buildRegex from "./buildRegex";
import { CreateOp } from "../subscription";
import { createHandler } from "./createHandler";

export const shortname = "aaabotewjkiv4";

const terms = [
  // general
  "ttrpgs?",
  "tabletop rpg",
  "tabletop roleplaying",
  "tabletop game",
  "tabletop gaming",
  "game master",
  "dungeon master",
  "character art",

  // promo stuff
  "self(-\\s)promo saturday",
  "wip wednesday",
  "ttrpg rising",

  // events
  "gen con (2023)?",
  "big bad con",

  // shows
  "critical role",
  "dimension 20",
  "dungeons and daddies",
  "dungeons & daddies",
  "glass cannon pod",
  "the adventure zone",
  "not another d&d pod",
  "nadp pod",

  // publishers
  "free league",
  "wotc",
  "wizards of the coast",
  "paizo",
  "limithron",
  "evil genius games",
  "evil hat productions",
  "r.? talsorian",
  "darrington press",
  "free league",
  "infinite citadel",

  // creators
  "bob the world builder",
  "matt(hew)? colville",
  "mcdm",
  "ginny di",
  "dungeon dudes",
  "pointy hat",
  "jp coovert",
  "the dm lair",
  "bonus action",
  "map crow",
  "arcane anthems",
  "griffon'?s saddlebag",

  // D&D
  "dungeons and dragons",
  "dungeons & dragons",
  "d&d",
  "dnd",
  "d&d beyond",
  "dndbeyond",
  "dnd beyond",

  // paizo
  "pathfinder",
  "starfinder",

  // Free League
  "mork borg",
  "pirate borg",
  "death in space",
  "the one ring",
  "cy_borg",
  "mutant year zero",
  "tales from the loop",
  "vaesen",

  // Infinite citadel
  "mork sol",
  "gentlemages",
  "before the bog god",
  "the beckoning dream",

  // other games
  "tormenta",
  "das schwarze auge",
  "apocalypse world",
  "mutants and masterminds",
  "shadowrun",
  "savage worlds",
  "vampire: the masquerade",
  "lancer",
  "dungeon world",
  "transformers rpg",
  "warhammer",
  "wrath and glory",
  "wrath & glory",
  "mutant:? year zero",
  "alien rpg",
  "fate system",
  "gurps",
  "cyberpunk red",
  "blades in the dark",
  "urban shadows",
  "symbaroum",
  "shadowdark",
  "call of cthulhu",
  "dish pit witches",
  "liminal horror",
  "into the cess & citadel",
  "into the wyrd & wild",
  "thirsty swords lesbians",
  "quest rpg",
  "coyote & crow",
  "coyote and crow",
  "troika",
  "mothership rpg",
  "mother lands rpg",
  "witcher rpg",
  "powered by the apocalypse",
  "pbta",
  "forged in the dark",
  "candela obscura",
  "daggerheart",
  "monster hearts",
  "eco mofos",
  "monsters and counselors",
  "(Æ|æ|ae)lf",
  "triangle agency",
  "kill engn",
  "old school essentials",
  "dungeon crawl classics",
  "vast grimm",

  // looser terms
  "worldbuilding",
  "worldanvil",
  "role20",
  "foundry vtt",
  "alchemy rpg",

  // awards
  "ennies",
  "crit awards",
];

const excludeTerms = ["crit(ical)? role spoilers?", "nofeed", "nottrpgfeed"];

const emojis = ["🎲"];

export const matchRegex = buildRegex(terms);
const excludeRegex = buildRegex(excludeTerms);

export const matcher = (post: CreateOp) => {
  const matchTerms = matchRegex.test(post.record.text.toLowerCase());
  const matchEmoji = emojis.some((emoji) => post.record.text.includes(emoji));
  const optout = excludeRegex.test(post.record.text.toLowerCase());
  return !optout && (matchTerms || matchEmoji);
};

export const filterAndMap = (posts: CreateOp[]) =>
  posts.filter(matcher).map((create) => ({
    uri: create.uri,
    cid: create.cid,
    replyParent: create.record?.reply?.parent.uri ?? null,
    replyRoot: create.record?.reply?.root.uri ?? null,
    indexedAt: new Date().toISOString(),
    hasVideo: create.record.embed?.$type === "app.bsky.embed.video",
  }));

/* Support message */
// const pinnedMessage =
//   'at://did:plc:iuk433sj23ncu2oo2pfnw7fw/app.bsky.feed.post/3m6ib5jhxrs2m'

const pinnedMessage = "";

export const handler = createHandler(shortname, pinnedMessage);
