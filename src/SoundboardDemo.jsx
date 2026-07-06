import React, { useState, useMemo, useEffect, useRef } from "react";

// Spindex logo -- embedded as base64 so it works inside a single-file artifact
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiIAAAHJCAYAAAC431L2AABOkUlEQVR4nO3dd5xdVbn/8c+ZmfQQUugJnU3ZNEVEmnBFBFEUUdGNFcu9PwtXr10v99rLVWzYBfUqtm1HwQsWBEGkGqmbsiGEThJCEkJ6Muf3x7OHDCGTzFln7Xq+79drXkTkrFmZOWfvZ6/1rOcBERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER8ahV9gREpB6CKOkD+rOvFjCQ/XPoC6C9kZcO/bvB7GstsDaNw8FcJywitaBARKSHBVEyAMzIvrYEpgATgfHAFtmfx2X/e+ifY7FgZHz2zz6efC1p89SAZCgAWQOsBJYDq7P/vQJ4PPv3y7L/vQx4BJgHLE7jcK2/v7WIVIkCEZEGCqKkxfrgYRywM7ATsB2wKzATmIYFH5Oz/2Zs9jWABRjD/9yfDe3zmtHGApR1WECydoOvlVhQMhSgLADmYMHJHOAOLFhZDqxUsCJSTwpERGouCzomAdtmX1OBWcCRwMFY8LEFFlQ0SRsLVK4BLgNuwQKTBcBDaCVFpBYUiIjUUBAluwJ7AwcAIba1snX2NSX7GlPaBIs3FJQsBhZiqyaPArcDCTAXmJ3G4eqS5iciI1AgIlJBWWLodGx1Yzq2rbI3cDiwP7atMnzbRJ/lpxq+9bMOC1TmAP8EZgM3A/OBpcAjaRyuKWmeIj1NFy+RCgmiZDJwFHAIcCAWgOyGrXD0lTi1phlkfWDyIHA9cCNwaRqHD5Y4L5Geo0BEpCRBlIxlfaLo0cBzsJyOHbEVD610FGctdnLnAeAK4OLsn8uBZdrSEcmP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ag7JUCDR2sh/MzzYgI2/luz17ex/t7GAY/h/OxSoDAUpa9I4XOvw1xEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREZES/H9YZ99HPLn1BQAAAABJRU5ErkJggg==";
import { Search, Heart, Plus, X, ChevronLeft, User, ListMusic, Check, Settings, Pencil, Bell, Frown, Share2 } from "lucide-react";

// ---------------------------------------------------------------------------
// REAL BACKEND CONNECTION
// This is the one piece of this file that's no longer a mock -- login and
// signup call your actual server. Everything else below (albums, reviews,
// lists, etc.) is still fake data, to be converted the same way later.
//
// DEV-ONLY: this points at your backend running on your own machine. Your
// server needs to actually be running (see RUN_SERVER_README.md) for this
// screen to work. Once the backend is deployed somewhere real, this URL
// changes to that live address instead of localhost.
// ---------------------------------------------------------------------------
const BACKEND_URL = "https://spindex-backend.onrender.com";

// JWT token helpers -- stored in localStorage so it survives page refresh.
// apiFetch wraps fetch to automatically attach the Authorization header.
const getToken = () => localStorage.getItem("spindex_token");
const setToken = (t) => t ? localStorage.setItem("spindex_token", t) : localStorage.removeItem("spindex_token");

function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && typeof options.body === "string") headers["Content-Type"] = "application/json";
  return fetch(url, { ...options, headers });
}

function nowTimestamp() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10);
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  const mins = m.toString().padStart(2, "0");
  return `${date} · ${h}:${mins}${ampm}`;
}

// ---------------------------------------------------------------------------
// MOCK DATA
// In Phase 2 (the real backend), this data comes from your database instead
// of being hardcoded here. The shape mirrors the SCHEMA_NOTES.md tables on
// purpose: albums, reviews, listenStatus, lists, favorites.
// ---------------------------------------------------------------------------

const INITIAL_ALBUMS = [
  { id: "a1", title: "In Rainbows", artist: "Radiohead", year: 2007, tags: ["alternative", "art-rock", "2000s"] },
  { id: "a2", title: "Blonde", artist: "Frank Ocean", year: 2016, tags: ["r-and-b", "soul", "2010s"] },
  { id: "a3", title: "Rumours", artist: "Fleetwood Mac", year: 1977, tags: ["rock", "pop", "70s"] },
  { id: "a4", title: "good kid, m.A.A.d city", artist: "Kendrick Lamar", year: 2012, tags: ["rap", "hip-hop", "2010s", "concept-album"] },
  { id: "a5", title: "Tapestry", artist: "Carole King", year: 1971, tags: ["singer-songwriter", "folk", "70s"] },
  { id: "a6", title: "Currents", artist: "Tame Impala", year: 2015, tags: ["indie", "psychedelic", "2010s"] },
  { id: "a7", title: "Channel Orange", artist: "Frank Ocean", year: 2012, tags: ["r-and-b", "soul", "2010s"] },
  { id: "a8", title: "Songs in the Key of Life", artist: "Stevie Wonder", year: 1976, tags: ["soul", "funk", "70s"] },
  { id: "a9", title: "OK Computer", artist: "Radiohead", year: 1997, tags: ["alternative", "art-rock", "90s"] },
  { id: "a10", title: "To Pimp a Butterfly", artist: "Kendrick Lamar", year: 2015, tags: ["rap", "hip-hop", "jazz", "2010s", "concept-album"] },
  { id: "a11", title: "Blue", artist: "Joni Mitchell", year: 1971, tags: ["singer-songwriter", "folk", "70s"] },
  { id: "a12", title: "Norman Fucking Rockwell!", artist: "Lana Del Rey", year: 2019, tags: ["indie", "art-pop", "2010s"] },
];

// Keep ALBUMS as a reference to the static data for all non-tag lookups --
// tags are tracked separately in `albumTags` state so only that piece
// needs to be mutable, not the whole album array.
const ALBUMS = INITIAL_ALBUMS;

// Initial tag map: { albumId -> string[] }
const INITIAL_ALBUM_TAGS = Object.fromEntries(INITIAL_ALBUMS.map((a) => [a.id, a.tags]));

const INITIAL_REVIEWS = [];

const INITIAL_REVIEW_COMMENTS = {};

const INITIAL_NOTIFICATIONS = [];

const INITIAL_REVIEW_REACTIONS = {};

const QOTD_BANK = [
  "what's the best album of the 90s?",
  "what album would you want on a desert island?",
  "what's the most underrated record of all time?",
  "what album changed how you listen to music?",
  "what's the best closing track on any album?",
  "what album do you pretend to like more than you do?",
];

const TODAYS_QUESTION = QOTD_BANK[0];

const INITIAL_QOTD_RESPONSES = [];

const INITIAL_LISTEN_STATUS = {};

const INITIAL_FAVORITES = [];

// Album mixes group whole albums together around a theme (e.g. "saddest
// albums ever"). Each album in the mix can optionally have a short note
// explaining why it's included -- `note` is always optional.
const INITIAL_ALBUM_MIXES = [
  { id: "l1", title: "Rainy day spins", description: "For when the weather matches the mood.", tags: ["slowcore", "indie", "folk"], albums: [{ albumId: "a1", note: "" }, { albumId: "a11", note: "Blue is basically the genre." }, { albumId: "a12", note: "" }] },
  { id: "l2", title: "Albums that changed how I hear production", description: "", tags: ["production", "alternative", "r-and-b"], albums: [{ albumId: "a2", note: "Pink Matter still blows my mind." }, { albumId: "a9", note: "" }, { albumId: "a7", note: "" }] },
];

const INITIAL_SAVED_ALBUM_MIXES = [
  { id: "s1", title: "Essential 70s singer-songwriter", description: "The records that started it all.", tags: ["singer-songwriter", "folk", "70s"], albums: [{ albumId: "a3", note: "" }, { albumId: "a5", note: "" }, { albumId: "a11", note: "" }], owner: "m.delacroix" },
  { id: "s2", title: "Late night production masterclass", description: "", tags: ["production", "r-and-b", "soul"], albums: [{ albumId: "a2", note: "" }, { albumId: "a7", note: "" }, { albumId: "a6", note: "" }], owner: "kev_listens" },
];

const INITIAL_SONG_MIXES = [
  {
    id: "sm1",
    title: "Sunday morning, slow coffee",
    description: "Nothing past 80 bpm.",
    tags: ["slowcore", "folk", "ambient"],
    coverImageUrl: null,
    tracks: [
      { id: "t1", trackTitle: "Pyramids", albumId: "a2" },
      { id: "t2", trackTitle: "Big Yellow Taxi", albumId: "a11" },
      { id: "t3", trackTitle: "Weird Fishes/Arpeggi", albumId: "a1" },
    ],
  },
];

const INITIAL_SAVED_SONG_MIXES = [
  {
    id: "ssm1",
    title: "Late night drive",
    description: "",
    tags: ["indie", "alternative"],
    coverImageUrl: null,
    owner: "noisefloor",
    tracks: [
      { id: "t4", trackTitle: "Let's Spend the Night Together", albumId: "a6" },
      { id: "t5", trackTitle: "Sweetest Devotion", albumId: "a7" },
    ],
  },
];

const PROFILE = { username: "", displayName: "", bio: "", followers: 0, following: 0 };

// ---------------------------------------------------------------------------
// EDITORIAL / STAFF CONTENT
// In the real app these would be CMS-authored and stored in the database.
// Here they're hardcoded to demonstrate the full layout.
// ---------------------------------------------------------------------------

// Each entry in the bank has everything needed to render the full album-of-
// the-day editorial: write-up, pull quote, staff rating, and a display date.
// TODAYS_ALBUM_OF_THE_DAY picks from this bank using the current date so it
// rotates automatically every day -- same pick all day, new pick tomorrow.
const ALBUM_OF_THE_DAY_BANK = [
  {
    albumId: "a10",
    staffRating: 10,
    pullQuote: "A record that refuses to sit still — and that's exactly the point.",
    body: `Fourteen months after its release, To Pimp a Butterfly still sounds like nothing else in the canon. Kendrick Lamar assembled a sprawling cast of jazz and funk musicians — Thundercat, Terrace Martin, Kamasi Washington — and built something that sounds less like a rap album and more like a live argument between Parliament-Funkadelic and a university seminar on Black identity in America.\n\nWhat makes it extraordinary isn't just the ambition, or the politics, or the musicianship — it's the way it holds all of those things in the same breath without any of them collapsing. "u" is the most uncomfortable seven minutes of self-directed anguish put to record. "Alright" became a protest anthem before the album had a chance to breathe.\n\nPut headphones on and go start to finish. It will earn every minute.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a1",
    staffRating: 10,
    pullQuote: "Radiohead made a record that sounds like missing someone you haven't lost yet.",
    body: `In Rainbows arrived after four years of silence and landed like a held breath finally released. Where OK Computer was anxious and Kid A was deliberately alienating, this one is nakedly, almost embarrassingly intimate. Thom Yorke had never sounded this exposed, and the band had never played with this much warmth.\n\n"Weird Fishes/Arpeggi" builds for five minutes and then dissolves into something you can't name. "House of Cards" is the quietest song Radiohead had made to that point. "Reckoner" shouldn't work but does, completely.\n\nThe pay-what-you-want release was the story at the time. A decade and a half later, that's a footnote. The music is the story.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a2",
    staffRating: 9,
    pullQuote: "Frank Ocean made a breakup album where no one is entirely wrong.",
    body: `Blonde is the kind of record that resists being written about, which is partly why people keep writing about it. There's no obvious hit, no structural hook to grab. It just drifts — from Beyoncé sample to Beach Boys reference to a voicemail from Ocean's mother — and somehow coheres into something that feels more complete than most tightly sequenced albums.\n\n"Nikes" opens it sideways. "Ivy" is a wound. "Nights" breaks in half at its midpoint and becomes a different song. "Siegfried" shouldn't work at all and is among the most affecting things he's ever recorded.\n\nThe production is spacious in a way that rewards headphones specifically. Give it the full listen it asks for.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a9",
    staffRating: 10,
    pullQuote: "The sound of a band realizing what technology might cost us — before most of us were paying attention.",
    body: `OK Computer turned 29 this year and remains the most prescient rock record of its era. Radiohead in 1997 were describing a feeling that most people wouldn't have words for until 2010, 2015, 2020 — that low-grade static of being connected to everything and comforted by nothing.\n\n"Paranoid Android" is six minutes of mood changes that shouldn't cohere and does. "Exit Music (For a Film)" is the most romantic and most bleak song on the same listen. "No Surprises" puts a political protest inside a music box lullaby.\n\nIt's the rare album that aged into relevance rather than out of it.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a11",
    staffRating: 10,
    pullQuote: "Joni Mitchell stripped everything back and what remained was unbearable and beautiful.",
    body: `Blue is 35 minutes. It has ten songs. Almost nothing on it is longer than four minutes. And it contains more emotional truth than most artists manage across an entire career.\n\nMitchell wrote it at a moment of near-total vulnerability — end of a long relationship, mid-twenties, no protective irony anywhere in sight. The result is a record where you can hear her not trying to protect herself. "River" is still the best Christmas-adjacent song ever recorded. "A Case of You" still does what it does.\n\nIf you've never listened to this properly, start today. If you have, you know why we keep coming back to it.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a3",
    staffRating: 9,
    pullQuote: "Rumours is proof that great art can come entirely from people being awful to each other.",
    body: `Fleetwood Mac were falling apart when they made Rumours. Lindsey Buckingham and Stevie Nicks had just broken up. John and Christine McVie were divorcing. Mick Fleetwood was watching his marriage dissolve. They recorded it anyway, channeling the wreckage into eleven songs of almost painful commercial perfection.\n\n"The Chain" built from individual grievances into something that sounds like it always existed. "Go Your Own Way" is one person's anger given a melody the other had to sing every night on tour. "Dreams" is calm on the surface and grief underneath.\n\nThe drama makes it hit harder once you know it. But it hits hard before you do, too.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a4",
    staffRating: 9,
    pullQuote: "Kendrick turned a city into a character and a character into a mirror.",
    body: `Good Kid, m.A.A.d City is a concept album that doesn't announce itself as one. It follows a single day — or a few days — in Compton through Kendrick's teenage eyes, and it builds its world so precisely that by the end you know the streets, the voices, the stakes.\n\n"Money Trees" is the clearest expression of what it feels like to want out of a place while still loving it. "Swimming Pools" sounds like a party and reads like a warning. "Sing About Me, I'm Dying of Thirst" is the emotional center that everything else orbits.\n\nA decade after its release it still sounds like a document, not just a record.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a5",
    staffRating: 9,
    pullQuote: "Carole King wrote half of pop music's songbook. Then she made her own record.",
    body: `Tapestry spent 302 weeks on the Billboard 200. That statistic doesn't tell you much. What tells you something is putting it on and recognizing, within the first four bars of "I Feel the Earth Move," why.\n\nKing had spent the previous decade writing songs for other people — "Will You Love Me Tomorrow," "Up on the Roof," "(You Make Me Feel Like) A Natural Woman." Tapestry was the moment she stopped giving them away. The results included some of the most durable songs of the 20th century, played with a looseness that studio polish would have ruined.\n\nIt still sounds like someone playing in their living room. That's the whole secret.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a6",
    staffRating: 8,
    pullQuote: "Kevin Parker made a breakup album that sounds like the inside of a very expensive daydream.",
    body: `Currents arrived in 2015 with Tame Impala fully committed to the pivot from guitar band to synthesizer project, and it worked better than almost anyone predicted. Parker produced, recorded, and played essentially everything himself, layering sounds that feel vintage and futuristic in the same breath.\n\n"Let It Happen" is nine minutes that earns every one of them. "The Less I Know the Better" is a perfect pop song wearing a disco costume. "New Person, Same Old Mistakes" closes the record with the kind of ambivalence that's hard to write toward and harder to land.\n\nLush, warm, and longer than it needs to be in the best possible way.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a7",
    staffRating: 9,
    pullQuote: "Channel Orange is the sound of someone figuring out they can say anything.",
    body: `Frank Ocean's debut proper arrived with an open letter on Tumblr that changed the conversation before anyone had heard a note. Then people heard the notes, and the letter became a footnote to something much larger.\n\nChannel Orange is an R&B record that keeps escaping R&B. "Pyramids" is ten minutes long and earns them. "Bad Religion" is a taxi confessional that shouldn't work as a song and is somehow one of the most affecting things on the record. "Pink Matter" closes side A with a question it doesn't answer.\n\nOcean sounded, on this record, like someone who had just realized they could say anything. The result was one of the most complete debut statements in recent memory.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a8",
    staffRating: 10,
    pullQuote: "Stevie Wonder spent two years making this and it shows, in the best possible way.",
    body: `Songs in the Key of Life is a double album plus a four-song EP, and the ambition is not incidental to the achievement. Stevie Wonder in 1976 was at the peak of a creative run that has few parallels in pop music, and this was the culmination.\n\n"Sir Duke" is pure joy. "Isn't She Lovely" is exactly what it says. "Pastime Paradise" built the loop that "Gangsta's Paradise" would eventually borrow. "As" is nine and a half minutes of the most sincere thing he ever recorded.\n\nIt's long. It earns the length. One of the handful of records from that era that still sounds like the future.`,
    staffName: "Editorial Team",
  },
  {
    albumId: "a12",
    staffRating: 9,
    pullQuote: "Lana Del Rey made a California record for people who find California unbearable.",
    body: `Norman Fucking Rockwell! arrived in 2019 and announced itself as the best thing Lana Del Rey had made, which surprised people who hadn't been paying attention and no one who had. Jack Antonoff's production strips away the melodrama of the earlier records and lets the songwriting breathe.\n\n"Mariners Apartment Complex" opens it with one of her finest melodies. "Venice Bitch" is ten minutes of guitar haze that justifies every second. The title track is an ex-boyfriend takedown dressed as a piano ballad, and it's sharper than it has any right to be.\n\nBeautiful, sad, funnier than it gets credit for, and more substantial than the aesthetic suggests.`,
    staffName: "Editorial Team",
  },
];

// Picks today's entry using the current date so it rotates daily --
// same album all day, different one tomorrow, no server required.
const todayDayIndex = Math.floor(Date.now() / 86400000);
const STAFF_ALBUM_OF_THE_DAY = {
  ...ALBUM_OF_THE_DAY_BANK[todayDayIndex % ALBUM_OF_THE_DAY_BANK.length],
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
};

const STAFF_SONG_MIX = {
  id: "staff-sm1",
  title: "Staff picks: what we've had on repeat",
  description: "Six tracks the Spindex team couldn't stop playing this month.",
  tags: ["staff-picks", "june-2026"],
  coverImageUrl: null,
  tracks: [
    { id: "sp1", trackTitle: "Alright", albumId: "a10" },
    { id: "sp2", trackTitle: "Pyramids", albumId: "a2" },
    { id: "sp3", trackTitle: "Exit Music (For a Film)", albumId: "a9" },
    { id: "sp4", trackTitle: "The Greatest", albumId: "a12" },
    { id: "sp5", trackTitle: "Big Yellow Taxi", albumId: "a11" },
    { id: "sp6", trackTitle: "Let Me Love You (Until You Learn to Love Yourself)", albumId: "a7" },
  ],
};

const STAFF_INTERVIEWS = [
  {
    id: "int1",
    month: "June 2026",
    artistName: "Aroha Ngata",
    artistBio: "Auckland-based composer and vocalist known for blending Māori chant traditions with contemporary electronic production.",
    relatedAlbumId: null,
    coverPhrase: "On making music for people who feel like they don't belong anywhere.",
    qa: [
      { q: "Your last record was described as 'neo-traditional' — a term you've pushed back on. What would you call it instead?", a: "Honestly? I'd just call it mine. The 'neo' prefix implies there's something being updated or modernized, as if the tradition itself isn't still alive. What I make doesn't update anything. It just adds to it." },
      { q: "There's a lot of silence on the record — deliberate space between sounds. Is that a production choice or something that comes from the compositions themselves?", a: "Both, but originally the compositions. I grew up singing in large groups, and when you're in a group, silence is a collective act. You all breathe before a phrase. That stillness isn't empty — it's weight. I wanted to put that on record." },
      { q: "What are you listening to right now that's inspiring you?", a: "I've been going back to Joni Mitchell a lot. Blue specifically. There's something about the way her voice sits so exposed in the mix — no shelter from the production. I want to make something that brave eventually." },
      { q: "What does a Spindex profile say about a person, do you think?", a: "What they're willing to admit moved them. Anyone can list what they think is impressive. But a 10/10 rating on something embarrassing — that's interesting." },
    ],
  },
  {
    id: "int2",
    month: "May 2026",
    artistName: "Dean Morricone",
    artistBio: "Rome-born, London-based producer and multi-instrumentalist. His 2024 album 'Strade' was named one of the year's best by several outlets.",
    relatedAlbumId: "a9",
    coverPhrase: "Why he still makes music on broken equipment — on purpose.",
    qa: [
      { q: "You've talked about using gear that's 'past its useful life' intentionally. Can you explain what that means in practice?", a: "I have a DAT recorder that chews tape slightly — it introduces this faint warble into anything I run through it. At first I tried to fix it. Then I realized the warble was doing something to the midrange that I couldn't replicate any other way. So I stopped trying to fix it." },
      { q: "There's a real lineage in your work to what Radiohead were doing in the late 90s — the anxiety, the beauty underneath the noise. Was that conscious?", a: "OK Computer was the first record that made me feel like something serious was possible. I was fourteen. Before that I thought music was either entertainment or classical. That album was neither." },
      { q: "What's the most overrated thing in production right now?", a: "Loudness. Everyone's maximizing everything. There's no room to breathe. A quiet record in 2026 is an act of resistance." },
    ],
  },
  {
    id: "int3",
    month: "April 2026",
    artistName: "Simone Adeyemi",
    artistBio: "Lagos-born, New York-based saxophonist and composer. A key collaborator on several celebrated records of the last decade.",
    relatedAlbumId: "a2",
    coverPhrase: "On what happens when jazz and R&B stop pretending they're different things.",
    qa: [
      { q: "You've played on records by artists from very different worlds — jazz, R&B, hip-hop. Does your approach change between them?", a: "The notes change. The feeling doesn't. I'm always listening for where the hole is — the space in the arrangement that wants something. Sometimes that's a two-bar solo. Sometimes it's just a breath." },
      { q: "What did you think the first time you heard Blonde?", a: "I thought: this is what happens when someone stops caring whether critics understand it. There's a freedom on that record that you can only get by not asking permission." },
      { q: "If you could tag your own music in the Spindex system, what genres would you use?", a: "I'd use 'jazz' so people find it, and then I'd immediately want to remove 'jazz' because it sets expectations I don't want to set." },
    ],
  },
];

// ---------------------------------------------------------------------------
// END EDITORIAL CONTENT
// ---------------------------------------------------------------------------

// Everyone searchable in the app -- combines the people you follow
// (FRIENDS, defined below) with everyone else who's shown up reviewing
// something (COMMUNITY_REVIEWS, also below). `isFollowing` seeds initial
// follow state; the user can change it from here once they search someone
// up. This is a flat directory for the demo -- the real backend would
// answer this with a `GET /api/users?search=` query instead.
const ALL_USERS = [
  {
    username: "kev_listens", displayName: "Kevin Liu", isFollowing: true,
    favoriteAlbumIds: ["a9", "a2", "a1"], followerCount: 64, followingCount: 112,
    inRotationAlbumId: "a9",
    albumMixes: [
      { id: "u-km1", title: "late night headphones", description: "", tags: ["ambient", "electronic", "slowcore"], albums: [{ albumId: "a9", note: "" }, { albumId: "a2", note: "" }, { albumId: "a6", note: "" }] },
    ],
    songMixes: [
      { id: "u-ksm1", title: "3am things", description: "", tags: ["indie", "slowcore"], coverImageUrl: null, tracks: [{ id: "ut1", trackTitle: "Exit Music (For a Film)", albumId: "a9" }, { id: "ut2", trackTitle: "Self Control", albumId: "a2" }] },
    ],
  },
  {
    username: "m.delacroix", displayName: "Marguerite Delacroix", isFollowing: true,
    favoriteAlbumIds: ["a1", "a11", "a3"], followerCount: 203, followingCount: 58,
    inRotationAlbumId: "a11",
    albumMixes: [
      { id: "u-mm1", title: "essential singer-songwriter", description: "The records that started it all.", tags: ["singer-songwriter", "folk", "70s"], albums: [{ albumId: "a11", note: "Joni at her most unguarded." }, { albumId: "a3", note: "" }, { albumId: "a5", note: "" }] },
      { id: "u-mm2", title: "rainy afternoon listening", description: "", tags: ["slowcore", "folk"], albums: [{ albumId: "a1", note: "" }, { albumId: "a11", note: "" }] },
    ],
    songMixes: [],
  },
  {
    username: "sara.spins", displayName: "Sara Pinsky", isFollowing: true,
    favoriteAlbumIds: ["a4", "a2", "a9"], followerCount: 41, followingCount: 76,
    inRotationAlbumId: "a4",
    albumMixes: [
      { id: "u-sm1", title: "narrative rap essentials", description: "", tags: ["rap", "hip-hop", "concept-album"], albums: [{ albumId: "a4", note: "" }, { albumId: "a10", note: "" }] },
    ],
    songMixes: [
      { id: "u-ssm1", title: "gym but make it emotional", description: "", tags: ["rap", "r-and-b", "workout"], coverImageUrl: null, tracks: [{ id: "ut3", trackTitle: "Money Trees", albumId: "a4" }, { id: "ut4", trackTitle: "Alright", albumId: "a10" }, { id: "ut5", trackTitle: "Pyramids", albumId: "a2" }] },
    ],
  },
  { username: "vinylvane", displayName: "Vane Ortiz", isFollowing: false, favoriteAlbumIds: ["a1", "a8"], followerCount: 312, followingCount: 19, albumMixes: [], songMixes: [] },
  { username: "_vinylhead", displayName: "Devon Cole", isFollowing: false, favoriteAlbumIds: ["a1"], followerCount: 12, followingCount: 88, albumMixes: [], songMixes: [] },
  { username: "marcoeq", displayName: "Marco Esposito", isFollowing: false, favoriteAlbumIds: ["a2", "a7"], followerCount: 97, followingCount: 140, albumMixes: [], songMixes: [] },
  { username: "noisefloor", displayName: "Priya Nair", isFollowing: false, favoriteAlbumIds: ["a9", "a4"], followerCount: 55, followingCount: 61, albumMixes: [], songMixes: [] },
  { username: "lp_lena", displayName: "Lena Park", isFollowing: false, favoriteAlbumIds: ["a5", "a11"], followerCount: 29, followingCount: 33, albumMixes: [], songMixes: [] },
  { username: "thinwhiteduke", displayName: "Callum Reyes", isFollowing: false, favoriteAlbumIds: ["a3"], followerCount: 18, followingCount: 24, albumMixes: [], songMixes: [] },
];

// People the user follows, each with their own album reviews.
// "Listened by" sections on an album page, and the home feed, both pull
// from here.
const FRIENDS = [];

const COMMUNITY_REVIEWS = [];

const COMMUNITY_ALBUM_MIXES = [];

// ---------------------------------------------------------------------------
// THEMING
// Five curated accent colors, and full light/dark surface palettes. Every
// component reads colors via useTheme() instead of fixed constants, so
// changing accent or mode anywhere updates the whole app at once.
// ---------------------------------------------------------------------------

const ACCENTS = {
  blue: { name: "blue", value: "#0159DE" },
  skyblue: { name: "sky", value: "#3676C2" },
  green: { name: "jade", value: "#1E8E5A" },
  teal: { name: "teal", value: "#1A8A8A" },
  pink: { name: "watermelon", value: "#E0537A" },
};

const SURFACES = {
  light: { bg: "#FFFFFF", ink: "#0A0A0A", line: "#E3E3E3", mute: "#7A7A7A" },
  dark: { bg: "#121212", ink: "#F0F0F0", line: "#2A2A2A", mute: "#8A8A8A" },
};

const ThemeContext = React.createContext(null);
const AvatarContext = React.createContext({});

function useTheme() {
  return React.useContext(ThemeContext);
}

// ---------------------------------------------------------------------------
// SMALL HELPERS
// ---------------------------------------------------------------------------

function albumById(id) {
  return ALBUMS.find((a) => a.id === id) || { id, title: "Unknown Album", artist: "", artistName: "", year: null, releaseYear: null };
}
function HeadphoneMark({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M22 55 V46 C22 26 36 12 50 12 C64 12 78 26 78 46 V55" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <rect x="14" y="50" width="16" height="26" rx="8" fill={color} />
      <rect x="70" y="50" width="16" height="26" rx="8" fill={color} />
    </svg>
  );
}

function RatingBlocks({ value, onChange, size = 14 }) {
  const { BLUE, LINE } = useTheme();
  const [hover, setHover] = useState(null);
  const display = hover ?? value;
  return (
    <div style={{ display: "flex", gap: 3 }} onMouseLeave={() => setHover(null)}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          onMouseEnter={() => onChange && setHover(i)}
          onClick={() => onChange && onChange(i)}
          style={{
            width: size,
            height: size,
            borderRadius: 3,
            background: display >= i ? BLUE : "transparent",
            border: `1.5px solid ${display >= i ? BLUE : LINE}`,
            cursor: onChange ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );
}

function AlbumCover({ album, size = 92 }) {
  const { BLUE } = useTheme();
  const coverUrl = album?.coverArtUrl && album.coverArtUrl !== "none" ? album.coverArtUrl : null;
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={album.title}
        style={{ width: size, height: size, borderRadius: Math.max(8, size * 0.14), objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        background: BLUE,
        borderRadius: Math.max(8, size * 0.14),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <HeadphoneMark size={size * 0.4} color="#fff" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP
// ---------------------------------------------------------------------------

export default function SoundboardDemo() {
  // --------------------------------------------------------------------
  // AUTH -- calls the real backend once deployed. While running locally
  // against localhost the server must be running (npm run dev in the
  // backend folder). Set BACKEND_URL at the top of this file to your
  // deployed server URL before going live.
  // --------------------------------------------------------------------
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    apiFetch(`${BACKEND_URL}/api/auth/me`)
      .then((res) => res.json())
      .then((data) => setAuthUser(data.user || null))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  const [view, setView] = useState({ name: "home" });
  const [homeTab, setHomeTab] = useState("feed");
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [profile, setProfile] = useState(PROFILE);
  const [showSettings, setShowSettings] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState(PROFILE.displayName);
  const [draftUsername, setDraftUsername] = useState(PROFILE.username);
  const [draftBio, setDraftBio] = useState(PROFILE.bio);
  // Avatar is stored as a data URL (the image encoded directly as text) --
  // this only lives in memory for the session, same as everything else in
  // the demo. There's no file storage here, so it won't survive a reload,
  // and the real backend doesn't have an upload endpoint for this yet.
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(null);
  const avatarFileInputRef = useRef(null);

  function handleAvatarFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      flash("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      flash("Image is too large -- try one under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraftAvatarUrl(reader.result);
    reader.onerror = () => flash("Couldn't read that image -- try a different file");
    reader.readAsDataURL(file);
  }
  // Accent + dark mode apply immediately on click rather than needing a
  // "save" -- these are visual preferences, not profile data someone
  // might want to draft and cancel out of.
  const [accentKey, setAccentKey] = useState("blue");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 600);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const theme = useMemo(() => {
    const surfaces = darkMode ? SURFACES.dark : SURFACES.light;
    return {
      BLUE: ACCENTS[accentKey].value,
      INK: surfaces.ink,
      LINE: surfaces.line,
      MUTE: surfaces.mute,
      BG: surfaces.bg,
      darkMode,
    };
  }, [accentKey, darkMode]);
  const [query, setQuery] = useState("");
  const [liveAlbums, setLiveAlbums] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [albumSearchLoading, setAlbumSearchLoading] = useState(false);
  const [albumTags, setAlbumTags] = useState(INITIAL_ALBUM_TAGS);
  const [reviewComments, setReviewComments] = useState(INITIAL_REVIEW_COMMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reviewReactions, setReviewReactions] = useState(INITIAL_REVIEW_REACTIONS);
  const [qotdResponses, setQotdResponses] = useState(INITIAL_QOTD_RESPONSES);
  const [inRotationAlbumId, setInRotationAlbumId] = useState("a2");
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showQotdModal, setShowQotdModal] = useState(false);
  const [showQuickReviewModal, setShowQuickReviewModal] = useState(false);
  const [showShareMixModal, setShowShareMixModal] = useState(false);
  const [mixSharePosts, setMixSharePosts] = useState([
    { id: "msp1", username: "m.delacroix", mixType: "album", mixId: "u-mm1", date: "2026-06-27 · 11:38pm" },
  ]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [followState, setFollowState] = useState(() => {
    const map = {};
    ALL_USERS.forEach((u) => (map[u.username] = u.isFollowing));
    return map;
  });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [listenStatus, setListenStatus] = useState(INITIAL_LISTEN_STATUS);
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [albumMixes, setAlbumMixes] = useState(INITIAL_ALBUM_MIXES);
  const [savedAlbumMixes, setSavedAlbumMixes] = useState(INITIAL_SAVED_ALBUM_MIXES);
  const [songMixes, setSongMixes] = useState(INITIAL_SONG_MIXES);
  const [savedSongMixes, setSavedSongMixes] = useState(INITIAL_SAVED_SONG_MIXES);
  const [draftRating, setDraftRating] = useState(0);
  const [draftText, setDraftText] = useState("");
  const [draftFavTrack, setDraftFavTrack] = useState("");
  const [draftLeastFavTrack, setDraftLeastFavTrack] = useState("");
  const [albumTab, setAlbumTab] = useState("albumMixes");
  const [ownProfileMixTab, setOwnProfileMixTab] = useState("album");
  const [userProfileMixTab, setUserProfileMixTab] = useState("album");
  const [newMixTitle, setNewMixTitle] = useState("");
  const [showNewMix, setShowNewMix] = useState(null); // null | "album" | "song"
  const [toast, setToast] = useState(null);
  const [fetchedAlbums, setFetchedAlbums] = useState({});
  const [userAvatarCache, setUserAvatarCache] = useState({});
  const [profileStats, setProfileStats] = useState({ followers: 0, following: 0 });
  const [showFollowList, setShowFollowList] = useState(null); // null | "followers" | "following"

  // Load real follower/following counts when logged in
  useEffect(() => {
    if (!authUser) return;
    apiFetch(`${BACKEND_URL}/api/users/${authUser.username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfileStats({
            followers: data.user.followerCount || 0,
            following: data.user.followingCount || 0,
          });
        }
      })
      .catch(() => {});
  }, [authUser]);

  // Sync real user data into profile state whenever auth resolves.
  // This replaces the fake j.harlow placeholder with the logged-in user.
  useEffect(() => {
    if (authUser) {
      setProfile((prev) => ({
        ...prev,
        username: authUser.username || prev.username,
        displayName: authUser.displayName || prev.displayName,
        bio: authUser.bio || prev.bio,
      }));
      setDraftDisplayName(authUser.displayName || "");
      setDraftUsername(authUser.username || "");
      setDraftBio(authUser.bio || "");
      if (authUser.avatarUrl) {
        setAvatarUrl(authUser.avatarUrl);
        setDraftAvatarUrl(authUser.avatarUrl);
        // Seed own avatar into the cache
        setUserAvatarCache((prev) => ({ ...prev, [authUser.username]: authUser.avatarUrl }));
      }
    }
  }, [authUser]);

  // Load all real user data from the backend when logged in.
  useEffect(() => {
    if (!authUser) return;
    // Listen status
    apiFetch(`${BACKEND_URL}/api/listen-status/me`)
      .then((r) => r.json())
      .then((data) => {
        if (data.listenStatus) {
          setListenStatus(data.listenStatus);
          // Prefetch album data for each listened/queued album
          Object.keys(data.listenStatus).forEach((id) => {
            apiFetch(`${BACKEND_URL}/api/albums/${id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.album) {
                  const a = d.album;
                  setFetchedAlbums((prev) => ({ ...prev, [id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
    // Reviews
    apiFetch(`${BACKEND_URL}/api/reviews/user/${authUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) {
          const mapped = data.reviews.map((r) => ({
            id: r.id,
            albumId: r.albumId,
            rating: r.rating,
            text: r.reviewText || "",
            favTrack: r.favTrack || "",
            leastFavTrack: r.leastFavTrack || "",
            date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
            username: authUser.username,
          }));
          setReviews(mapped);
          // Prefetch album data for each review
          mapped.forEach((r) => {
            apiFetch(`${BACKEND_URL}/api/albums/${r.albumId}`)
              .then((res) => res.json())
              .then((d) => {
                if (d.album) {
                  const a = d.album;
                  setFetchedAlbums((prev) => ({ ...prev, [r.albumId]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
    // Favorites
    apiFetch(`${BACKEND_URL}/api/favorites/me`)
      .then((r) => r.json())
      .then((data) => {
        if (data.favorites) {
          const ids = data.favorites.map((f) => f.albumId);
          setFavorites(ids);
          // Prefetch album data for each favorite so they show correctly
          ids.forEach((id) => {
            apiFetch(`${BACKEND_URL}/api/albums/${id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.album) {
                  const a = d.album;
                  setFetchedAlbums((prev) => ({ ...prev, [id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
  }, [authUser]);

  // Load curated trending albums on mount for the browse page
  useEffect(() => {
    apiFetch(`${BACKEND_URL}/api/albums/trending`)
      .then((r) => r.json())
      .then((data) => {
        if (data.albums) {
          setTrendingAlbums(data.albums.map((a) => ({
            ...a,
            artist: a.artistName || a.artist || "",
            year: a.releaseYear || a.year || null,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Debounced album search — fires 300ms after the user stops typing.
  // Uses the real backend API if available, falls back to mock ALBUMS.
  useEffect(() => {
    if (!query.trim() || query.trim().length < 3) {
      setLiveAlbums([]);
      return;
    }
    const timer = setTimeout(() => {
      setAlbumSearchLoading(true);
      apiFetch(`${BACKEND_URL}/api/albums?search=${encodeURIComponent(query.trim())}&limit=30`)
        .then((res) => res.json())
        .then((data) => {
          const albums = (data.albums || []).map((a) => ({
            ...a,
            artist: a.artistName || a.artist || "",
            year: a.releaseYear || a.year || null,
          }));
          setLiveAlbums(albums);
        })
        .catch(() => setLiveAlbums([]))
        .finally(() => setAlbumSearchLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function reviewFor(albumId) {
    return reviews.find((r) => r.albumId === albumId);
  }

  const filtered = query.trim().length >= 3
    ? liveAlbums
    : trendingAlbums.length > 0 ? trendingAlbums : ALBUMS;


  function openAlbum(id, albumObj) {
    const existing = reviewFor(id);
    setDraftRating(existing ? existing.rating : 0);
    setDraftText(existing ? existing.text : "");
    setDraftFavTrack(existing ? existing.favTrack || "" : "");
    setDraftLeastFavTrack(existing ? existing.leastFavTrack || "" : "");
    setAlbumTab("albumMixes");
    setView({ name: "album", id });
    // If we already have the album object (e.g. from search results), cache it immediately
    if (albumObj && !fetchedAlbums[id]) {
      const a = albumObj;
      setFetchedAlbums((prev) => ({
        ...prev,
        [id]: { ...a, artist: a.artistName || a.artist || "", year: a.releaseYear || a.year || null },
      }));
    }
    // Fetch from API to get cover art (lazy-loaded on first view)
    if (!fetchedAlbums[id]) {
      apiFetch(`${BACKEND_URL}/api/albums/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.album) {
            const a = data.album;
            const normalized = { ...a, artist: a.artistName || a.artist || "", year: a.releaseYear || a.year || null };
            setFetchedAlbums((prev) => ({ ...prev, [id]: normalized }));
            // Also update liveAlbums so cover shows in search grid
            if (normalized.coverArtUrl && normalized.coverArtUrl !== "none") {
              setLiveAlbums((prev) => prev.map((al) => al.id === id ? { ...al, coverArtUrl: normalized.coverArtUrl } : al));
            }
          }
        })
        .catch(() => {});
    }
  }

  function saveReview(albumId) {
    const now = nowTimestamp();
    // Optimistic update
    setReviews((prev) => {
      const exists = prev.find((r) => r.albumId === albumId);
      if (exists) {
        return prev.map((r) =>
          r.albumId === albumId
            ? { ...r, rating: draftRating, text: draftText, favTrack: draftFavTrack, leastFavTrack: draftLeastFavTrack }
            : r
        );
      }
      return [...prev, { id: "r" + Date.now(), albumId, rating: draftRating, text: draftText, favTrack: draftFavTrack, leastFavTrack: draftLeastFavTrack, date: now, username: profile.username }];
    });
    if (draftRating > 0) setListenStatus((prev) => ({ ...prev, [albumId]: "listened" }));
    flash("Review saved");
    // Persist to backend
    apiFetch(`${BACKEND_URL}/api/reviews/${albumId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: draftRating, reviewText: draftText, favTrack: draftFavTrack, leastFavTrack: draftLeastFavTrack }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.review) {
          // Update with real ID from server
          setReviews((prev) => prev.map((r) =>
            r.albumId === albumId ? { ...r, id: data.review.id } : r
          ));
        }
      })
      .catch(() => {});
  }

  function toggleStatus(albumId, status) {
    const current = listenStatus[albumId];
    const newStatus = current === status ? null : status;
    // Optimistic update
    setListenStatus((prev) => ({ ...prev, [albumId]: newStatus || undefined }));
    // Persist to backend
    apiFetch(`${BACKEND_URL}/api/listen-status/${albumId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {
      // Revert on failure
      setListenStatus((prev) => ({ ...prev, [albumId]: current || undefined }));
    });
  }

  function toggleFavorite(albumId) {
    const isFav = favorites.includes(albumId);
    if (!isFav && favorites.length >= 3) {
      flash("3 favorites max -- remove one first");
      return;
    }
    // Optimistic update
    setFavorites((prev) => isFav ? prev.filter((id) => id !== albumId) : [...prev, albumId]);
    // Persist to backend
    apiFetch(`${BACKEND_URL}/api/favorites/${albumId}`, {
      method: isFav ? "DELETE" : "POST",
    }).catch(() => {
      // Revert on failure
      setFavorites((prev) => isFav ? [...prev, albumId] : prev.filter((id) => id !== albumId));
    });
  }

  function createAlbumMix() {
    if (!newMixTitle.trim()) return;
    const id = "am" + Date.now();
    setAlbumMixes((prev) => [...prev, { id, title: newMixTitle.trim(), description: "", albums: [] }]);
    setNewMixTitle("");
    setShowNewMix(null);
    setView({ name: "albumMixDetail", id });
  }

  function addToAlbumMix(mixId, albumId) {
    setAlbumMixes((prev) =>
      prev.map((m) =>
        m.id === mixId
          ? { ...m, albums: m.albums.some((a) => a.albumId === albumId) ? m.albums : [...m.albums, { albumId, note: "" }] }
          : m
      )
    );
    flash("Added to album mix");
  }

  function removeFromAlbumMix(mixId, albumId) {
    setAlbumMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, albums: m.albums.filter((a) => a.albumId !== albumId) } : m)));
  }

  function updateAlbumMixNote(mixId, albumId, note) {
    setAlbumMixes((prev) =>
      prev.map((m) => (m.id === mixId ? { ...m, albums: m.albums.map((a) => (a.albumId === albumId ? { ...a, note } : a)) } : m))
    );
  }

  function unsaveAlbumMix(mixId) {
    setSavedAlbumMixes((prev) => prev.filter((m) => m.id !== mixId));
    flash("Removed from saved album mixes");
  }

  function createSongMix() {
    if (!newMixTitle.trim()) return;
    const id = "sm" + Date.now();
    setSongMixes((prev) => [...prev, { id, title: newMixTitle.trim(), description: "", coverImageUrl: null, tracks: [] }]);
    setNewMixTitle("");
    setShowNewMix(null);
    setView({ name: "songMixDetail", id });
  }

  function addTrackToSongMix(mixId, trackTitle, albumId) {
    setSongMixes((prev) =>
      prev.map((m) => (m.id === mixId ? { ...m, tracks: [...m.tracks, { id: "t" + Date.now(), trackTitle, albumId }] } : m))
    );
    flash("Track added");
  }

  function removeTrackFromSongMix(mixId, trackId) {
    setSongMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, tracks: m.tracks.filter((t) => t.id !== trackId) } : m)));
  }

  function setSongMixCover(mixId, coverImageUrl) {
    setSongMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, coverImageUrl } : m)));
  }

  function updateSongMixInfo(mixId, title, description) {
    setSongMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, title, description } : m)));
  }

  function submitQuickReview(albumId, rating, text, favTrack, leastFavTrack) {
    if (!rating) return;
    const id = "r" + Date.now();
    const newReview = { id, albumId, rating, text: text.trim(), date: nowTimestamp(), favTrack: favTrack.trim(), leastFavTrack: leastFavTrack.trim(), username: profile.username };
    setReviews((prev) => {
      const without = prev.filter((r) => r.albumId !== albumId);
      return [...without, newReview];
    });
    setListenStatus((prev) => ({ ...prev, [albumId]: "listened" }));
    setShowQuickReviewModal(false);
    flash("Review posted");
    // Persist to backend
    apiFetch(`${BACKEND_URL}/api/reviews/${albumId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, reviewText: text.trim(), favTrack: favTrack.trim(), leastFavTrack: leastFavTrack.trim() }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.review) setReviews((prev) => prev.map((r) => r.albumId === albumId ? { ...r, id: data.review.id } : r));
      })
      .catch(() => {});
  }

  function submitMixShare(mixType, mixId) {
    setMixSharePosts((prev) => [
      { id: "msp" + Date.now(), username: profile.username, mixType, mixId, date: nowTimestamp() },
      ...prev,
    ]);
    setShowShareMixModal(false);
    flash("Mix shared to your feed");
  }

  function submitQotdResponse(albumId) {
    setQotdResponses((prev) => {
      // Replace any existing response from this user to today's question
      // rather than stacking duplicates -- one answer per question per person.
      const withoutMine = prev.filter((r) => !(r.username === profile.username && r.questionText === TODAYS_QUESTION));
      return [...withoutMine, { id: "qotd" + Date.now(), username: profile.username, questionText: TODAYS_QUESTION, albumId, date: nowTimestamp() }];
    });
    setShowQotdModal(false);
    flash("Posted your answer");
  }

  function toggleReaction(reviewId, kind) {
    // kind is "heart" or "frown". Clicking the active one removes it;
    // clicking the other one switches (you can't react both ways at once).
    setReviewReactions((prev) => {
      const current = prev[reviewId] || { heart: [], frown: [] };
      const other = kind === "heart" ? "frown" : "heart";
      const alreadyActive = current[kind].includes(profile.username);
      const next = {
        ...current,
        [kind]: alreadyActive ? current[kind].filter((u) => u !== profile.username) : [...current[kind], profile.username],
        [other]: current[other].filter((u) => u !== profile.username),
      };
      return { ...prev, [reviewId]: next };
    });
  }

  function fetchUserAvatar(username) {
    if (!username || userAvatarCache[username] !== undefined) return;
    // Mark as pending so we don't fire duplicate requests
    setUserAvatarCache((prev) => ({ ...prev, [username]: null }));
    apiFetch(`${BACKEND_URL}/api/users/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserAvatarCache((prev) => ({ ...prev, [username]: data.user.avatarUrl || null }));
        }
      })
      .catch(() => {});
  }

  function pushNotification(notif) {
    setNotifications((prev) => [{ ...notif, id: "n" + Date.now(), date: nowTimestamp(), read: false }, ...prev]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function addComment(reviewId, text, reviewOwnerUsername) {
    if (!text.trim()) return;
    const comment = { id: "cmt" + Date.now(), username: profile.username, text: text.trim(), date: nowTimestamp(), replies: [] };
    setReviewComments((prev) => ({ ...prev, [reviewId]: [...(prev[reviewId] || []), comment] }));
    // Notify review owner
    if (reviewOwnerUsername && reviewOwnerUsername !== profile.username) {
      pushNotification({ type: "comment", fromUsername: profile.username, text: `commented on a review`, reviewId });
    }
    // Notify anyone @tagged in the text
    const tags = [...text.matchAll(/@([\w.]+)/g)].map((m) => m[1]);
    tags.forEach((tag) => {
      if (tag !== profile.username) {
        pushNotification({ type: "tag", fromUsername: profile.username, text: `tagged you in a comment`, reviewId });
      }
    });
  }

  // Recursively inserts a reply under the target comment anywhere in the tree
  function insertReply(comments, targetId, reply) {
    return comments.map((c) => {
      if (c.id === targetId) return { ...c, replies: [...(c.replies || []), reply] };
      if (c.replies && c.replies.length > 0) return { ...c, replies: insertReply(c.replies, targetId, reply) };
      return c;
    });
  }

  function addReply(reviewId, parentCommentId, parentUsername, text) {
    if (!text.trim()) return;
    const reply = { id: "rep" + Date.now(), username: profile.username, text: text.trim(), date: nowTimestamp(), replies: [] };
    setReviewComments((prev) => ({
      ...prev,
      [reviewId]: insertReply(prev[reviewId] || [], parentCommentId, reply),
    }));
    // Notify parent comment author
    if (parentUsername && parentUsername !== profile.username) {
      pushNotification({ type: "reply", fromUsername: profile.username, text: `replied to your comment`, reviewId });
    }
    // Notify anyone @tagged
    const tags = [...text.matchAll(/@([\w.]+)/g)].map((m) => m[1]);
    tags.forEach((tag) => {
      if (tag !== profile.username) {
        pushNotification({ type: "tag", fromUsername: profile.username, text: `tagged you in a reply`, reviewId });
      }
    });
  }

  function updateAlbumTags(albumId, tags) {
    setAlbumTags((prev) => ({ ...prev, [albumId]: tags }));
  }

  function updateAlbumMixTags(mixId, tags) {
    setAlbumMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, tags } : m)));
  }

  function updateSongMixTags(mixId, tags) {
    setSongMixes((prev) => prev.map((m) => (m.id === mixId ? { ...m, tags } : m)));
  }

  function unsaveSongMix(mixId) {
    setSavedSongMixes((prev) => prev.filter((m) => m.id !== mixId));
    flash("Removed from saved song mixes");
  }

  function openSettings() {
    setDraftDisplayName(profile.displayName);
    setDraftUsername(profile.username);
    setDraftBio(profile.bio);
    setDraftAvatarUrl(avatarUrl);
    setShowSettings(true);
  }

  function saveSettings() {
    if (!draftDisplayName.trim() || !draftUsername.trim()) {
      flash("Display name and username can't be empty");
      return;
    }
    setProfile((prev) => ({ ...prev, displayName: draftDisplayName.trim(), username: draftUsername.trim(), bio: draftBio }));
    setAvatarUrl(draftAvatarUrl);
    setShowSettings(false);
    flash("Profile updated");
    // Persist to backend
    apiFetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: draftDisplayName.trim(),
        bio: draftBio,
        avatarUrl: draftAvatarUrl || null,
      }),
    }).catch(() => {});
  }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "--";
  const listenedCount = Object.values(listenStatus).filter((s) => s === "listened").length;
  const wantCount = Object.values(listenStatus).filter((s) => s === "want_to_listen").length;

  // Home feed: posts from people you follow -- a mix of reviews and
  // question-of-the-day answers. Community reviews from strangers stay on
  // individual album pages instead of cluttering this. Posts with several
  const [realFeedItems, setRealFeedItems] = useState([]);

  // Load real feed from backend when logged in
  useEffect(() => {
    if (!authUser) return;
    apiFetch(`${BACKEND_URL}/api/feed`)
      .then((r) => r.json())
      .then((data) => {
        if (data.feed) {
          const items = data.feed.map((item) => ({
            itemType: "review",
            id: item.id,
            username: item.username,
            albumId: item.albumId,
            rating: item.rating,
            text: item.text || "",
            date: item.date ? new Date(item.date).toISOString().slice(0, 10) : "",
          }));
          setRealFeedItems(items);
          // Prefetch album data for all feed items so covers show immediately
          const uniqueAlbumIds = [...new Set(items.map((i) => i.albumId).filter(Boolean))];
          uniqueAlbumIds.forEach((id) => {
            apiFetch(`${BACKEND_URL}/api/albums/${id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.album) {
                  const a = d.album;
                  setFetchedAlbums((prev) => ({ ...prev, [a.id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
  }, [authUser]);

  const HEART_BUMP_THRESHOLD = 3;
  const feed = useMemo(() => {
    const followedUsernames = new Set([...FRIENDS.map((f) => f.username), profile.username]);
    const reviewItems = FRIENDS.flatMap((f) =>
      f.reviews.map((r) => ({ itemType: "review", kind: "following", username: f.username, ...r }))
    );
    const ownReviewItems = reviews.map((r) => ({ itemType: "review", username: profile.username, ...r }));
    const qotdItems = qotdResponses
      .filter((r) => followedUsernames.has(r.username))
      .map((r) => ({ itemType: "qotd", username: r.username, ...r }));
    const mixShareItems = mixSharePosts
      .filter((p) => followedUsernames.has(p.username))
      .map((p) => ({ itemType: "sharemix", ...p }));
    // Merge real feed items — deduplicate by albumId+username to avoid doubles
    const mockIds = new Set(reviewItems.map((r) => `${r.username}-${r.albumId}`));
    const realOnly = realFeedItems.filter((r) => !mockIds.has(`${r.username}-${r.albumId}`));
    const all = [...realOnly, ...reviewItems, ...ownReviewItems, ...qotdItems, ...mixShareItems];
    const heartCount = (item) => (reviewReactions[item.id]?.heart || []).length;
    const popular = all.filter((item) => heartCount(item) >= HEART_BUMP_THRESHOLD).sort((a, b) => heartCount(b) - heartCount(a));
    const rest = all.filter((item) => heartCount(item) < HEART_BUMP_THRESHOLD).sort((a, b) => (a.date < b.date ? 1 : -1));
    return [...popular, ...rest];
  }, [reviewReactions, qotdResponses, mixSharePosts, reviews, realFeedItems]);

  const [liveUserResults, setLiveUserResults] = useState([]);

  useEffect(() => {
    if (!userSearchQuery.trim() || userSearchQuery.trim().length < 2) {
      setLiveUserResults([]);
      return;
    }
    const timer = setTimeout(() => {
      apiFetch(`${BACKEND_URL}/api/users?search=${encodeURIComponent(userSearchQuery.trim())}`)
        .then((r) => r.json())
        .then((data) => setLiveUserResults(data.users || []))
        .catch(() => setLiveUserResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearchQuery]);

  const userSearchResults = liveUserResults.length > 0 ? liveUserResults : (
    userSearchQuery.trim()
      ? ALL_USERS.filter((u) => u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()))
      : []
  );

  function toggleFollow(username) {
    const wasFollowing = followState[username];
    setFollowState((prev) => ({ ...prev, [username]: !prev[username] }));
    if (!wasFollowing) {
      pushNotification({ type: "follow", fromUsername: username, text: "started following you" });
    }
    // Persist to backend — look up user by username first
    apiFetch(`${BACKEND_URL}/api/users/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) return;
        const userId = data.user.id;
        apiFetch(`${BACKEND_URL}/api/follows/${userId}`, {
          method: wasFollowing ? "DELETE" : "POST",
        }).catch(() => {
          // Revert on failure
          setFollowState((prev) => ({ ...prev, [username]: wasFollowing }));
        });
      })
      .catch(() => {
        setFollowState((prev) => ({ ...prev, [username]: wasFollowing }));
      });
  }

  const [viewedUser, setViewedUser] = useState(null);
  const [viewedUserReviews, setViewedUserReviews] = useState([]);

  function openUserProfile(username) {
    setViewedUser(null);
    setViewedUserReviews([]);
    setView({ name: "userProfile", username });
    apiFetch(`${BACKEND_URL}/api/users/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setViewedUser(data.user);
          return apiFetch(`${BACKEND_URL}/api/reviews/user/${data.user.id}`);
        }
      })
      .then((r) => r && r.json())
      .then((data) => {
        if (data && data.reviews) {
          const mapped = data.reviews.map((r) => ({
            id: r.id, albumId: r.albumId, rating: r.rating,
            text: r.reviewText || "", date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
          }));
          setViewedUserReviews(mapped);
          // Prefetch album data for each review so covers show immediately
          mapped.forEach((r) => {
            if (!r.albumId) return;
            apiFetch(`${BACKEND_URL}/api/albums/${r.albumId}`)
              .then((res) => res.json())
              .then((d) => {
                if (d.album) {
                  const a = d.album;
                  setFetchedAlbums((prev) => ({ ...prev, [a.id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
  }

  function logout() {
    apiFetch(`${BACKEND_URL}/api/auth/logout`, { method: "POST" }).catch(() => {});
    setToken(null);
    setAuthUser(null);
    setProfile(PROFILE);
    setView({ name: "home" });
  }

  // Still waiting to hear back from the server about whether someone's
  // already logged in -- show nothing rather than flashing the auth
  // screen and then immediately replacing it.
  if (!authChecked) {
    return <div style={{ minHeight: 200 }} />;
  }

  const { BLUE, INK, LINE, MUTE, BG } = theme;

  if (!authUser) {
    return (
      <ThemeContext.Provider value={theme}>
        <AuthScreen backendUrl={BACKEND_URL} onAuthed={setAuthUser} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
    <AvatarContext.Provider value={{ cache: userAvatarCache, fetch: fetchUserAvatar }}>
    <div style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", background: BG, minHeight: "100%", color: INK, overflowX: "hidden", maxWidth: "100vw" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }
        .ui-sans { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .sb-btn { font-family: inherit; border: 1.5px solid ${INK}; background: transparent; color: ${INK}; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; letter-spacing: 0.01em; transition: background 0.12s, color 0.12s, border-color 0.12s; }
        .sb-btn:hover { background: ${INK}; color: ${BG}; }
        .sb-btn-solid { background: ${BLUE}; color: #fff; border-color: ${BLUE}; }
        .sb-btn-solid:hover { filter: brightness(0.85); }
        .sb-cover-wrap { cursor: pointer; transition: opacity 0.12s; }
        .sb-cover-wrap:hover { opacity: 0.82; }
        .sb-input { font-family: inherit; border: 1.5px solid ${LINE}; background: ${BG}; padding: 9px 12px; font-size: 13px; outline: none; color: ${INK}; border-radius: 6px; width: 100%; }
        .sb-input:focus { border-color: ${BLUE}; }
        .sb-textarea { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1.5px solid ${LINE}; background: ${BG}; padding: 11px 12px; font-size: 13.5px; outline: none; color: ${INK}; width: 100%; border-radius: 6px; resize: vertical; line-height: 1.6; }
        .sb-textarea:focus { border-color: ${BLUE}; }
        .sb-nav-item { cursor: pointer; font-size: 12px; letter-spacing: 0.03em; text-transform: uppercase; font-weight: 500; color: ${MUTE}; padding: 6px 0; border-bottom: 2px solid transparent; }
        .sb-nav-item.active { color: ${INK}; border-bottom-color: ${BLUE}; }
        @media (max-width: 480px) {
          .sb-nav-item { font-size: 10px; letter-spacing: 0.01em; }
          .sb-btn { padding: 7px 10px; font-size: 11px; }
          .sb-rating-row { flex-wrap: wrap; }
        }
      `}</style>

      {/* TOP NAV */}
      <div style={{ borderBottom: `1.5px solid ${INK}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", overflowX: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }} onClick={() => setView({ name: "home" })}>
          <img src={LOGO_DATA_URI} alt="Spindex" style={{ height: 30, width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className={`sb-nav-item ${view.name === "home" ? "active" : ""}`} onClick={() => setView({ name: "home" })}>home</div>
          <div className={`sb-nav-item ${view.name === "browse" || view.name === "tagResults" ? "active" : ""}`} onClick={() => setView({ name: "browse" })}>browse</div>
          <div className={`sb-nav-item ${view.name === "mixes" || view.name === "albumMixDetail" || view.name === "songMixDetail" ? "active" : ""}`} onClick={() => setView({ name: "mixes" })}>mixes</div>
          <div className={`sb-nav-item ${view.name === "profile" ? "active" : ""}`} onClick={() => setView({ name: "profile" })}>profile</div>
          <div
            onClick={() => { setView({ name: "notifications" }); markAllRead(); }}
            style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", color: view.name === "notifications" ? INK : MUTE }}
            title="notifications"
          >
            <Bell size={18} strokeWidth={1.8} />
            {notifications.filter((n) => !n.read).length > 0 && (
              <div style={{ position: "absolute", top: -4, right: -5, background: BLUE, color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {notifications.filter((n) => !n.read).length}
              </div>
            )}
          </div>
          {/* "log out" hidden while auth is disabled */}
        </div>
      </div>

      {showFollowList && (
        <FollowListModal
          kind={showFollowList}
          userId={authUser?.id}
          username={profile.username}
          onClose={() => setShowFollowList(null)}
          onVisitProfile={(u) => { setShowFollowList(null); openUserProfile(u); }}
        />
      )}
      {showQotdModal && (
        <QotdModal question={TODAYS_QUESTION} onSubmit={submitQotdResponse} onClose={() => setShowQotdModal(false)} />
      )}
      {showQuickReviewModal && (
        <QuickReviewModal onSubmit={submitQuickReview} onClose={() => setShowQuickReviewModal(false)} />
      )}
      {showShareMixModal && (
        <ShareMixModal albumMixes={albumMixes} songMixes={songMixes} onSubmit={submitMixShare} onClose={() => setShowShareMixModal(false)} />
      )}

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 16px 64px" }}>
        {/* TOAST */}
        {toast && (
          <div style={{ position: "sticky", top: 8, zIndex: 10, background: INK, color: BG, padding: "8px 14px", borderRadius: 6, fontSize: 12, marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Check size={13} /> {toast}
          </div>
        )}

        {/* ---------------- HOME / FEED ---------------- */}
        {view.name === "home" && (
          <div>
            {/* Tab toggle + people search */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ display: "flex", gap: 0, border: `1.5px solid ${INK}`, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                <button onClick={() => setHomeTab("feed")} style={{ padding: "7px 16px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", background: homeTab === "feed" ? INK : "transparent", color: homeTab === "feed" ? BG : INK }}>feed</button>
                <button onClick={() => setHomeTab("news")} style={{ padding: "7px 16px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", borderLeft: `1.5px solid ${INK}`, background: homeTab === "news" ? INK : "transparent", color: homeTab === "news" ? BG : INK }}>news</button>
              </div>
              {homeTab === "feed" && (
                <>
                  <Search size={15} color={MUTE} style={{ flexShrink: 0 }} />
                  <input
                    className="sb-input ui-sans"
                    style={{ flex: 1 }}
                    placeholder="search for people..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </>
              )}
            </div>

            {/* ---- FEED TAB ---- */}
            {homeTab === "feed" && (
              userSearchQuery.trim() ? (
                <div>
                  <div className="ui-sans" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>
                    {userSearchResults.length} result{userSearchResults.length !== 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {userSearchResults.map((u) => (
                      <div key={u.username} style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "10px 14px" }}>
                        <div onClick={() => openUserProfile(u.username)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" }}>
                          <Avatar username={u.username} size={32} />
                          <div className="ui-sans">
                            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.displayName}</div>
                            <div style={{ fontSize: 11.5, color: MUTE }}>@{u.username}</div>
                          </div>
                        </div>
                        <button className="sb-btn" style={followState[u.username] ? { background: INK, color: BG } : {}} onClick={() => toggleFollow(u.username)}>
                          {followState[u.username] ? "following" : "follow"}
                        </button>
                      </div>
                    ))}
                    {userSearchResults.length === 0 && (
                      <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>no one matches "{userSearchQuery}"</div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600 }}>your feed</div>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowPlusMenu((p) => !p)}
                        className="ui-sans"
                        title="Create a post"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `2px solid ${INK}`, borderRadius: 10, width: 34, height: 34, cursor: "pointer", color: INK, padding: 0 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="7" y="1" width="2" height="14" rx="1" fill={INK} />
                          <rect x="1" y="7" width="14" height="2" rx="1" fill={INK} />
                        </svg>
                      </button>
                      {showPlusMenu && (
                        <>
                          <div onClick={() => setShowPlusMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
                          <div className="ui-sans" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 40, background: BG, border: `1.5px solid ${LINE}`, borderRadius: 8, minWidth: 170, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
                            {[
                              { label: "QOTD", desc: "answer today's question", action: () => { setShowPlusMenu(false); setShowQotdModal(true); } },
                              { label: "Post a review", desc: "review an album", action: () => { setShowPlusMenu(false); setShowQuickReviewModal(true); } },
                              { label: "Share a mix", desc: "post one of your mixes", action: () => { setShowPlusMenu(false); setShowShareMixModal(true); } },
                            ].map((opt) => (
                              <button key={opt.label} onClick={opt.action} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", borderBottom: `1px solid ${LINE}` }}
                                onMouseEnter={(e) => e.currentTarget.style.background = LINE}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{opt.label}</div>
                                <div style={{ fontSize: 11, color: MUTE, marginTop: 1 }}>{opt.desc}</div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ui-sans" style={{ fontSize: 13, color: MUTE, marginBottom: 24, textAlign: "left" }}>
                    posts from people you follow.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {feed.map((c, i) => {
                      if (c.itemType === "sharemix") {
                        const allMixes = [...albumMixes, ...savedAlbumMixes, ...songMixes, ...savedSongMixes, ...ALL_USERS.flatMap((u) => [...(u.albumMixes || []), ...(u.songMixes || [])])];
                        const mix = allMixes.find((m) => m.id === c.mixId);
                        if (!mix) return null;
                        return (
                          <div key={i} style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <Avatar username={c.username} size={26} />
                              <span className="ui-sans" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => openUserProfile(c.username)}>@{c.username}</span>
                              <span className="ui-sans" style={{ fontSize: 11, color: MUTE, marginLeft: "auto" }}>{c.date}</span>
                            </div>
                            <div className="ui-sans" style={{ fontSize: 11, color: MUTE, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>shared a mix</div>
                            <div
                              onClick={() => setView({ name: c.mixType === "song" ? "songMixDetail" : "albumMixDetail", id: mix.id, mix, from: { name: "home" } })}
                              style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer", border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "10px 12px" }}
                            >
                              {c.mixType === "song" ? <SongMixCover mix={mix} size={48} /> : (
                                <div style={{ display: "flex" }}>
                                  {(mix.albums || []).slice(0, 3).map((a, idx) => (
                                    <div key={a.albumId} style={{ marginLeft: idx === 0 ? 0 : -14, zIndex: 3 - idx, border: `2px solid ${BG}`, borderRadius: 7 }}>
                                      <AlbumCover album={albumById(a.albumId)} size={38} />
                                    </div>
                                  ))}
                                  {(mix.albums || []).length === 0 && <ListMusic size={38} color={LINE} strokeWidth={1.4} />}
                                </div>
                              )}
                              <div className="ui-sans">
                                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{mix.title}</div>
                                <div style={{ fontSize: 11.5, color: MUTE }}>{c.mixType === "song" ? `${(mix.tracks || []).length} tracks` : `${(mix.albums || []).length} albums`}</div>
                              </div>
                            </div>
                            {c.id && (
                              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${LINE}` }}>
                                <ReactionBar reactions={reviewReactions[c.id]} onReact={(kind) => toggleReaction(c.id, kind)} currentUsername={profile.username} />
                              </div>
                            )}
                            {c.id && <ReviewComments reviewId={c.id} comments={reviewComments[c.id] || []} onAdd={addComment} onReply={addReply} currentUsername={profile.username} reviewOwnerUsername={c.username} />}
                          </div>
                        );
                      }

                      if (c.itemType === "qotd") {
                        const album = fetchedAlbums[c.albumId] || albumById(c.albumId);
                        return (
                          <div key={i} style={{ border: `1.5px solid ${BLUE}`, borderRadius: 8, padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <Avatar username={c.username} size={26} />
                              <span className="ui-sans" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => openUserProfile(c.username)}>@{c.username}</span>
                              <span className="ui-sans" style={{ fontSize: 11, color: MUTE, marginLeft: "auto" }}>{c.date}</span>
                            </div>
                            <div className="ui-sans" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: BLUE, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                              <Plus size={11} /> QOTD: {c.questionText}
                            </div>
                            <div onClick={() => openAlbum(c.albumId)} style={{ display: "flex", gap: 12, cursor: "pointer" }}>
                              <AlbumCover album={album} size={56} />
                              <div className="ui-sans" style={{ flex: 1, display: "flex", alignItems: "center" }}>
                                <div>
                                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{album.title}</div>
                                  <div style={{ fontSize: 11, color: MUTE }}>{album.artist}</div>
                                </div>
                              </div>
                            </div>
                            {c.id && (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${LINE}` }}>
                                <ReactionBar
                                  reactions={reviewReactions[c.id]}
                                  onReact={(kind) => toggleReaction(c.id, kind)}
                                  currentUsername={profile.username}
                                />
                                <ShareButton kind="qotd" album={album} username={c.username} questionText={c.questionText} />
                              </div>
                            )}
                            {c.id && (
                              <ReviewComments
                                reviewId={c.id}
                                comments={reviewComments[c.id] || []}
                                onAdd={addComment}
                                onReply={addReply}
                                currentUsername={profile.username}
                                reviewOwnerUsername={c.username}
                              />
                            )}
                          </div>
                        );
                      }
                      const album = fetchedAlbums[c.albumId] || albumById(c.albumId);
                      return (
                        <div key={i} style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <Avatar username={c.username} size={26} />
                            <span className="ui-sans" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => openUserProfile(c.username)}>@{c.username}</span>
                            <span className="ui-sans" style={{ fontSize: 11, color: MUTE, marginLeft: "auto" }}>{c.date}</span>
                          </div>
                          <div onClick={() => openAlbum(c.albumId)} style={{ display: "flex", gap: 14, cursor: "pointer" }}>
                            <AlbumCover album={album} size={88} />
                            <div className="ui-sans" style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                              <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, letterSpacing: "-0.01em", lineHeight: 1.1, textAlign: "left" }}>{c.rating}/10</div>
                              <div style={{ marginTop: 1, textAlign: "left" }}>
                                <span style={{ fontSize: 14, fontWeight: 700 }}>{album.title}</span>
                                <span style={{ fontSize: 13, color: MUTE, marginLeft: 6 }}>{album.artist || album.artistName}</span>
                              </div>
                              {c.text && <div style={{ fontSize: 13.5, color: INK, marginTop: 3, lineHeight: 1.5, textAlign: "left" }}>{c.text}</div>}
                            </div>
                          </div>
                          {c.id && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${LINE}` }}>
                              <ReactionBar
                                reactions={reviewReactions[c.id]}
                                onReact={(kind) => toggleReaction(c.id, kind)}
                                currentUsername={profile.username}
                              />
                              <ShareButton kind="review" album={album} username={c.username} rating={c.rating} reviewText={c.text} />
                            </div>
                          )}
                          {c.id && (
                            <ReviewComments
                              reviewId={c.id}
                              comments={reviewComments[c.id] || []}
                              onAdd={addComment}
                              onReply={addReply}
                              currentUsername={profile.username}
                              reviewOwnerUsername={c.username}
                            />
                          )}
                        </div>
                      );
                    })}
                    {feed.length === 0 && (
                      <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5, padding: "20px 0" }}>
                        nothing here yet -- follow people, queue albums, or write a review and this fills in.
                      </div>
                    )}
                  </div>
                </>
              )
            )}

            {/* ---- NEWS TAB ---- */}
            {homeTab === "news" && (() => {
              const aotd = STAFF_ALBUM_OF_THE_DAY;
              const aotdAlbum = albumById(aotd.albumId);
              const activeInterview = activeInterviewId
                ? STAFF_INTERVIEWS.find((i) => i.id === activeInterviewId)
                : null;

              return (
                <div>
                  {/* ALBUM OF THE DAY */}
                  <div style={{ marginBottom: 40 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>album of the day · {aotd.date}</div>
                    <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
                      <div className="sb-cover-wrap" onClick={() => openAlbum(aotd.albumId)} style={{ flexShrink: 0 }}>
                        <AlbumCover album={aotdAlbum} size={120} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="ui-sans" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, cursor: "pointer" }} onClick={() => openAlbum(aotd.albumId)}>{aotdAlbum.title}</div>
                        <div className="ui-sans" style={{ fontSize: 13, color: MUTE, marginTop: 2 }}>{aotdAlbum.artist} · {aotdAlbum.year}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                          <RatingBlocks value={aotd.staffRating} size={13} />
                          <span className="ui-sans" style={{ fontSize: 12, fontWeight: 600, color: BLUE }}>{aotd.staffRating}/10</span>
                          <span className="ui-sans" style={{ fontSize: 11, color: MUTE }}>staff rating</span>
                        </div>
                        <div className="ui-sans" style={{ fontSize: 14, fontStyle: "italic", color: INK, marginTop: 12, lineHeight: 1.5, borderLeft: `3px solid ${BLUE}`, paddingLeft: 12 }}>
                          "{aotd.pullQuote}"
                        </div>
                      </div>
                    </div>
                    <div className="ui-sans" style={{ fontSize: 13.5, lineHeight: 1.75, color: INK, marginTop: 18, whiteSpace: "pre-line" }}>
                      {aotd.body}
                    </div>
                    <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE, marginTop: 10 }}>— {aotd.staffName}</div>
                  </div>

                  {/* STAFF SONG MIX */}
                  <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 32, marginBottom: 40 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>staff song mix</div>
                    <div
                      onClick={() => setView({ name: "songMixDetail", id: STAFF_SONG_MIX.id, mix: STAFF_SONG_MIX, from: { name: "home" } })}
                      style={{ display: "flex", gap: 16, cursor: "pointer", alignItems: "center", border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}
                    >
                      <SongMixCover mix={STAFF_SONG_MIX} size={72} />
                      <div className="ui-sans" style={{ flex: 1 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{STAFF_SONG_MIX.title}</div>
                        <div style={{ fontSize: 12.5, color: MUTE, marginTop: 3 }}>{STAFF_SONG_MIX.description}</div>
                        <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>{STAFF_SONG_MIX.tracks.length} tracks</div>
                      </div>
                    </div>
                  </div>

                  {/* INTERVIEWS */}
                  <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 32 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 20 }}>
                      {activeInterview ? "interview" : "interview of the month"}
                    </div>

                    {activeInterview ? (
                      <div>
                        <button
                          className="sb-btn ui-sans"
                          onClick={() => setActiveInterviewId(null)}
                          style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 12 }}
                        >
                          <ChevronLeft size={13} /> all interviews
                        </button>
                        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 24 }}>
                          <div style={{ width: 80, height: 80, borderRadius: 12, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <User color="#fff" size={32} />
                          </div>
                          <div className="ui-sans">
                            <div style={{ fontSize: 18, fontWeight: 600 }}>{activeInterview.artistName}</div>
                            <div style={{ fontSize: 12.5, color: MUTE, marginTop: 4, lineHeight: 1.5 }}>{activeInterview.artistBio}</div>
                            <div style={{ fontSize: 11.5, color: MUTE, marginTop: 6 }}>{activeInterview.month}</div>
                          </div>
                        </div>
                        <div className="ui-sans" style={{ fontSize: 14, fontStyle: "italic", color: INK, marginBottom: 24, borderLeft: `3px solid ${BLUE}`, paddingLeft: 12, lineHeight: 1.5 }}>
                          "{activeInterview.coverPhrase}"
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                          {activeInterview.qa.map((item, i) => (
                            <div key={i}>
                              <div className="ui-sans" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>
                                {item.q}
                              </div>
                              <div className="ui-sans" style={{ fontSize: 13.5, color: INK, lineHeight: 1.75 }}>
                                {item.a}
                              </div>
                            </div>
                          ))}
                        </div>
                        {activeInterview.relatedAlbumId && (
                          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${LINE}` }}>
                            <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>mentioned in this interview</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => openAlbum(activeInterview.relatedAlbumId)}>
                              <AlbumCover album={albumById(activeInterview.relatedAlbumId)} size={48} />
                              <div className="ui-sans">
                                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{albumById(activeInterview.relatedAlbumId).title}</div>
                                <div style={{ fontSize: 12, color: MUTE }}>{albumById(activeInterview.relatedAlbumId).artist}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {STAFF_INTERVIEWS.map((interview, i) => (
                          <div
                            key={interview.id}
                            onClick={() => setActiveInterviewId(interview.id)}
                            style={{ display: "flex", gap: 14, alignItems: "center", border: `1.5px solid ${i === 0 ? BLUE : LINE}`, borderRadius: 8, padding: "14px 16px", cursor: "pointer" }}
                          >
                            <div style={{ width: 48, height: 48, borderRadius: 8, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: i === 0 ? 1 : 0.6 }}>
                              <User color="#fff" size={22} />
                            </div>
                            <div style={{ flex: 1 }} className="ui-sans">
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 600 }}>{interview.artistName}</span>
                                {i === 0 && <span style={{ fontSize: 10.5, color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 11, padding: "1px 7px" }}>this month</span>}
                              </div>
                              <div style={{ fontSize: 12, color: MUTE, marginTop: 2, fontStyle: "italic" }}>"{interview.coverPhrase}"</div>
                              <div style={{ fontSize: 11, color: MUTE, marginTop: 3 }}>{interview.month}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ---------------- TERMS ---------------- */}
        {view.name === "terms" && (
          <TermsScreen onBack={() => setView({ name: "home" })} inline />
        )}

        {/* ---------------- NOTIFICATIONS ---------------- */}
        {view.name === "notifications" && (
          <div>
            <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>notifications</div>
            <div className="ui-sans" style={{ fontSize: 13, color: MUTE, marginBottom: 22 }}>
              comments, replies, tags, and new followers.
            </div>
            {notifications.length === 0 && (
              <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>nothing yet.</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {notifications.map((n) => {
                const icon = n.type === "follow" ? "👤" : n.type === "tag" ? "@" : n.type === "reply" ? "↩" : "💬";
                return (
                  <div
                    key={n.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: n.read ? "transparent" : darkMode ? "#1a1f2e" : "#EEF3FF", cursor: "pointer" }}
                    onClick={() => n.reviewId && setView({ name: "home" })}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }} className="ui-sans">
                      <span style={{ fontWeight: 600 }}>@{n.fromUsername}</span>
                      <span style={{ color: MUTE }}> {n.text}</span>
                    </div>
                    <span className="ui-sans" style={{ fontSize: 11, color: MUTE, flexShrink: 0 }}>{n.date}</span>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- USER PROFILE (someone else's) ---------------- */}
        {view.name === "userProfile" && (() => {
          const user = viewedUser;
          if (!user) return (
            <div>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView({ name: "home" })}>
                <ChevronLeft size={14} /> back
              </div>
              <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>loading...</div>
            </div>
          );
          const userReviews = [...viewedUserReviews].sort((a, b) => (a.date < b.date ? 1 : -1));
          const userAvgRating = userReviews.length ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1) : "--";
          return (
            <div>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView({ name: "home" })}>
                <ChevronLeft size={14} /> back
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 18 : 24, paddingBottom: 22, borderBottom: `1.5px solid ${INK}` }}>
                <Avatar username={user.username} size={isMobile ? 88 : 120} />
                <div className="ui-sans" style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", textAlign: "left" }}>{user.displayName || user.username}</div>
                  <div style={{ fontSize: isMobile ? 14 : 16, color: MUTE, marginTop: 3, textAlign: "left" }}>@{user.username}</div>
                  {user.bio && <div style={{ fontSize: isMobile ? 14 : 15, color: MUTE, marginTop: 10, maxWidth: 480, lineHeight: 1.5, textAlign: "left" }}>{user.bio}</div>}
                </div>
                <button
                  className="sb-btn"
                  style={followState[user.username] ? { background: INK, color: BG } : {}}
                  onClick={() => toggleFollow(user.username)}
                >
                  {followState[user.username] ? "following" : "follow"}
                </button>
              </div>

              <div style={{ display: "flex", gap: isMobile ? 16 : 28, padding: "20px 0", borderBottom: `1px solid ${LINE}`, overflowX: "auto" }}>
                <Stat label="followers" value={user.followerCount || 0} />
                <Stat label="following" value={user.followingCount || 0} />
                <Stat label="reviews" value={userReviews.length} />
                <Stat label="avg rating" value={userAvgRating} />
              </div>

              <div style={{ marginTop: 30 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 12 }} className="ui-sans">reviews</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {userReviews.map((r, i) => {
                    const album = fetchedAlbums[r.albumId] || albumById(r.albumId);
                    if (!album) return null;
                    return (
                      <div key={i} onClick={() => openAlbum(r.albumId, album)} style={{ display: "flex", gap: 14, cursor: "pointer" }}>
                        <AlbumCover album={album} size={88} />
                        <div className="ui-sans" style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, letterSpacing: "-0.01em", lineHeight: 1.1, textAlign: "left" }}>{r.rating}/10</div>
                          <div style={{ marginTop: 1, textAlign: "left" }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{album.title}</span>
                            <span style={{ fontSize: 13, color: MUTE, marginLeft: 6 }}>{album.artist || album.artistName}</span>
                          </div>
                          <div style={{ fontSize: 11, color: MUTE, marginTop: 4, textAlign: "left" }}>{r.date}</div>
                          {r.text && <div style={{ fontSize: 13.5, color: INK, marginTop: 3, lineHeight: 1.5, textAlign: "left" }}>{r.text}</div>}
                        </div>
                      </div>
                    );
                  })}
                  {userReviews.length === 0 && (
                    <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>no reviews yet.</div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ---------------- TAG RESULTS ---------------- */}
        {view.name === "tagResults" && (() => {
          const tag = view.tag;
          // Albums tagged with this tag
          const matchedAlbums = ALBUMS.filter((a) => (albumTags[a.id] || []).includes(tag));
          // Mixes tagged with this tag (own + saved + all users')
          const allAlbumMixes = [
            ...albumMixes,
            ...savedAlbumMixes,
            ...ALL_USERS.flatMap((u) => u.albumMixes || []),
          ];
          const allSongMixes = [
            ...songMixes,
            ...savedSongMixes,
            ...ALL_USERS.flatMap((u) => u.songMixes || []),
          ];
          const matchedAlbum = allAlbumMixes.filter((m) => (m.tags || []).includes(tag));
          const matchedSong = allSongMixes.filter((m) => (m.tags || []).includes(tag));
          const totalCount = matchedAlbums.length + matchedAlbum.length + matchedSong.length;
          return (
            <div>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView({ name: "browse" })}>
                <ChevronLeft size={14} /> back to browse
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div className="ui-sans" style={{ fontSize: 22, fontWeight: 600 }}>#{tag}</div>
              </div>
              <div className="ui-sans" style={{ fontSize: 13, color: MUTE, marginBottom: 28 }}>
                {matchedAlbums.length} album{matchedAlbums.length !== 1 ? "s" : ""} · {matchedAlbum.length + matchedSong.length} mix{matchedAlbum.length + matchedSong.length !== 1 ? "es" : ""}
              </div>

              {matchedAlbums.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>albums</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "20px 16px" }}>
                    {matchedAlbums.map((album) => {
                      const rev = reviews.find((r) => r.albumId === album.id);
                      return (
                        <div key={album.id} onClick={() => openAlbum(album.id, album)}>
                          <div className="sb-cover-wrap">
                            <AlbumCover album={album} size={140} />
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <div className="ui-sans" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{album.title}</div>
                            <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE, marginTop: 1 }}>{album.artist} · {album.year}</div>
                            {rev && <span className="ui-sans" style={{ fontSize: 11, fontWeight: 600, color: BLUE }}>{rev.rating}/10</span>}
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                              {(albumTags[album.id] || []).map((t) => (
                                <span key={t} className="ui-sans" onClick={(e) => { e.stopPropagation(); setView({ name: "tagResults", tag: t }); }} style={{ fontSize: 10.5, color: BLUE, cursor: "pointer" }}>#{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {matchedAlbum.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>album mixes</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {matchedAlbum.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setView({ name: "albumMixDetail", id: m.id, mix: m, from: { name: "tagResults", tag } })}
                        style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex" }}>
                          {(m.albums || []).slice(0, 3).map((a, i) => (
                            <div key={a.albumId} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 3 - i, border: `2px solid ${BG}`, borderRadius: 7 }}>
                              <AlbumCover album={albumById(a.albumId)} size={38} />
                            </div>
                          ))}
                          {(m.albums || []).length === 0 && <ListMusic size={32} color={LINE} strokeWidth={1.4} />}
                        </div>
                        <div className="ui-sans" style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.title}</div>
                          <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>
                            {m.owner ? `by @${m.owner} · ` : ""}{(m.albums || []).length} album{(m.albums || []).length !== 1 ? "s" : ""}
                          </div>
                          <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                            {(m.tags || []).map((t) => (
                              <span key={t} className="ui-sans" onClick={(e) => { e.stopPropagation(); setView({ name: "tagResults", tag: t }); }} style={{ fontSize: 11, color: BLUE, cursor: "pointer" }}>#{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedSong.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>song mixes</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px 14px" }}>
                    {matchedSong.map((m) => (
                      <div key={m.id} onClick={() => setView({ name: "songMixDetail", id: m.id, mix: m, from: { name: "tagResults", tag } })} className="sb-cover-wrap">
                        <SongMixCover mix={m} size={130} />
                        <div className="ui-sans" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>{m.title}</div>
                        <div className="ui-sans" style={{ fontSize: 11, color: MUTE }}>{m.tracks.length} track{m.tracks.length !== 1 ? "s" : ""}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                          {(m.tags || []).map((t) => (
                            <span key={t} className="ui-sans" onClick={(e) => { e.stopPropagation(); setView({ name: "tagResults", tag: t }); }} style={{ fontSize: 10.5, color: BLUE, cursor: "pointer" }}>#{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedAlbums.length === 0 && matchedAlbum.length === 0 && matchedSong.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>no albums or mixes tagged #{tag} yet.</div>
              )}
            </div>
          );
        })()}

        {/* ---------------- BROWSE ---------------- */}
        {view.name === "browse" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
              <Search size={15} color={MUTE} />
              <input
                className="sb-input ui-sans"
                style={{ flex: 1 }}
                placeholder="search albums or artists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {!query.trim() && (
              <>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 12 }}>browse by tag</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {["rap", "slowcore", "folk", "indie", "r-and-b", "alternative", "production", "singer-songwriter", "ambient", "70s", "80s", "90s", "2000s", "2010s", "hip-hop", "soul", "rock", "jazz", "concept-album", "art-rock", "psychedelic", "electronic"].map((tag) => (
                    <button
                      key={tag}
                      className="ui-sans"
                      onClick={() => setView({ name: "tagResults", tag })}
                      style={{ background: "transparent", border: `1.5px solid ${BLUE}`, borderRadius: 20, padding: "5px 12px", fontSize: 12.5, color: BLUE, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>
                  trending albums
                </div>
              </>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px 16px" }}>
              {albumSearchLoading && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13, gridColumn: "1 / -1", padding: "20px 0" }}>searching...</div>
              )}
              {!albumSearchLoading && filtered.map((album) => {
                const rev = reviewFor(album.id);
                const status = listenStatus[album.id];
                // Use fetchedAlbums version if available (has cover art after first click)
                const displayAlbum = fetchedAlbums[album.id] || album;
                return (
                  <div key={album.id} onClick={() => openAlbum(album.id, album)}>
                    <div className="sb-cover-wrap">
                      <AlbumCover album={displayAlbum} size={150} />
                    </div>
                    <div style={{ marginTop: 9 }}>
                      <div className="ui-sans" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{album.title}</div>
                      <div className="ui-sans" style={{ fontSize: 12, color: MUTE, marginTop: 2, wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{album.artist || album.artistName} · {album.year || album.releaseYear}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, minHeight: 16 }}>
                        {rev && <span style={{ fontSize: 11, fontWeight: 600, color: BLUE }}>{rev.rating}/10</span>}
                        {!rev && status === "listened" && <span style={{ fontSize: 10, color: MUTE, letterSpacing: "0.02em" }}>LISTENED</span>}
                        {!rev && status === "want_to_listen" && <span style={{ fontSize: 10, color: MUTE, letterSpacing: "0.02em" }}>QUEUED</span>}
                        {favorites.includes(album.id) && <Heart size={11} fill={BLUE} color={BLUE} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="ui-sans" style={{ padding: "40px 0", textAlign: "center", color: MUTE, fontSize: 13 }}>
                No albums match "{query}". <span style={{ textDecoration: "underline", cursor: "pointer", color: BLUE }} onClick={() => setQuery("")}>Clear search</span>
              </div>
            )}
          </div>
        )}

        {/* ---------------- ALBUM DETAIL ---------------- */}
        {view.name === "album" && (() => {
          const album = fetchedAlbums[view.id] || albumById(view.id);
          if (!album) return (
            <div className="ui-sans" style={{ color: MUTE, padding: "40px 0" }}>loading...</div>
          );
          const existing = reviewFor(album.id);
          const status = listenStatus[album.id];
          const isFav = favorites.includes(album.id);

          // Community average pulls every rating we have for this album:
          // people you follow, the wider community, and your own review if
          // you've left one -- "everyone who's logged this" rather than a
          // single isolated pool.
          const friendRatings = FRIENDS.flatMap((f) => f.reviews.filter((r) => r.albumId === album.id).map((r) => r.rating));
          const communityRatings = COMMUNITY_REVIEWS.filter((r) => r.albumId === album.id).map((r) => r.rating);
          const allRatings = [...friendRatings, ...communityRatings, ...(existing ? [existing.rating] : [])];
          const communityAvg = allRatings.length ? (allRatings.reduce((s, r) => s + r, 0) / allRatings.length) : null;

          return (
            <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView({ name: "browse" })}>
                <ChevronLeft size={14} /> back
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 26, alignItems: isMobile ? "center" : "flex-start" }}>
                <AlbumCover album={album} size={isMobile ? 140 : 160} />
                <div style={{ flex: 1, width: "100%", textAlign: isMobile ? "center" : "left" }}>
                  <div className="ui-sans" style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600, lineHeight: 1.2, wordBreak: "break-word" }}>{album.title}</div>
                  <div className="ui-sans" style={{ fontSize: 14, color: MUTE, marginTop: 4 }}>{album.artist} · {album.year}</div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: isMobile ? "center" : "flex-start" }}>
                    <button
                      className="sb-btn"
                      style={status === "want_to_listen" ? { background: INK, color: BG } : {}}
                      onClick={() => toggleStatus(album.id, "want_to_listen")}
                    >
                      {status === "want_to_listen" ? "✓ queued" : "queue"}
                    </button>
                    <button
                      className="sb-btn"
                      style={status === "listened" ? { background: INK, color: BG } : {}}
                      onClick={() => toggleStatus(album.id, "listened")}
                    >
                      {status === "listened" ? "✓ listened" : "mark listened"}
                    </button>
                    <button className="sb-btn" onClick={() => toggleFavorite(album.id)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Heart size={13} fill={isFav ? BLUE : "none"} color={isFav ? BLUE : INK} />
                      {isFav ? "favorited" : "favorite"}
                    </button>
                  </div>

                  <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${LINE}`, width: "100%", textAlign: isMobile ? "center" : "left" }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 9 }}>your rating</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: isMobile ? "center" : "flex-start" }}>
                      <RatingBlocks value={draftRating} onChange={setDraftRating} size={isMobile ? 13 : 16} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: draftRating ? BLUE : LINE }}>{draftRating || "--"}/10</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, textAlign: isMobile ? "center" : "left" }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 9 }}>community average</div>
                    {communityAvg ? (
                      <div className="ui-sans" style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>{communityAvg.toFixed(1)}</span>
                        <span style={{ fontSize: 12, color: MUTE }}>/10 · {allRatings.length} rating{allRatings.length !== 1 ? "s" : ""}</span>
                      </div>
                    ) : (
                      <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>no ratings yet -- be the first.</div>
                    )}
                  </div>

                  <div style={{ marginTop: 18, textAlign: isMobile ? "center" : "left" }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 9 }}>your review</div>
                    <textarea
                      className="sb-textarea"
                      rows={4}
                      placeholder="what stood out to you on this one?"
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>favorite track</div>
                        <input
                          className="sb-input ui-sans"
                          style={{ width: "100%" }}
                          placeholder="e.g. track 3"
                          value={draftFavTrack}
                          onChange={(e) => setDraftFavTrack(e.target.value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>least favorite track</div>
                        <input
                          className="sb-input ui-sans"
                          style={{ width: "100%" }}
                          placeholder="e.g. track 7"
                          value={draftLeastFavTrack}
                          onChange={(e) => setDraftLeastFavTrack(e.target.value)}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button className="sb-btn sb-btn-solid" onClick={() => saveReview(album.id)}>save review</button>
                      {existing && <span className="ui-sans" style={{ fontSize: 11.5, color: MUTE }}>last saved {existing.date}</span>}
                    </div>
                  </div>

                  <AddToAlbumMixInline album={album} albumMixes={albumMixes} onAdd={addToAlbumMix} />

                  <MixTagEditor
                    tags={albumTags[album.id] || []}
                    isOwn={true}
                    onUpdateTags={(tags) => updateAlbumTags(album.id, tags)}
                    onTagClick={(tag) => setView({ name: "tagResults", tag })}
                  />
                </div>
              </div>

              <ListenedByFriends albumId={album.id} />
              <AlbumCommunitySection albumId={album.id} albumTab={albumTab} setAlbumTab={setAlbumTab} openAlbum={openAlbum} reviewComments={reviewComments} onAddComment={addComment} onAddReply={addReply} currentUsername={profile.username} reviewReactions={reviewReactions} onReact={toggleReaction} />
            </div>
          );
        })()}

        {/* ---------------- LISTS overview ---------------- */}
        {view.name === "mixes" && (
          <div>
            {/* YOUR ALBUM MIXES */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
              <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600 }}>your album mixes</div>
              <button className="sb-btn" onClick={() => setShowNewMix(showNewMix === "album" ? null : "album")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={13} /> new album mix
              </button>
            </div>
            {showNewMix === "album" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 22, alignItems: "center" }}>
                <input className="sb-input ui-sans" style={{ flex: 1 }} placeholder="album mix title..." value={newMixTitle} onChange={(e) => setNewMixTitle(e.target.value)} autoFocus />
                <button className="sb-btn sb-btn-solid" onClick={createAlbumMix}>create</button>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {albumMixes.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setView({ name: "albumMixDetail", id: m.id })}
                  style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}
                >
                  <div style={{ display: "flex" }}>
                    {m.albums.slice(0, 3).map((a, i) => (
                      <div key={a.albumId} style={{ marginLeft: i === 0 ? 0 : -20, zIndex: 3 - i, border: `2px solid ${BG}`, borderRadius: 9 }}>
                        <AlbumCover album={albumById(a.albumId)} size={44} />
                      </div>
                    ))}
                    {m.albums.length === 0 && <ListMusic size={36} color={LINE} strokeWidth={1.4} />}
                  </div>
                  <div style={{ flex: 1 }} className="ui-sans">
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{m.title}</div>
                    {m.description && <div style={{ fontSize: 12.5, color: MUTE, marginTop: 2 }}>{m.description}</div>}
                    <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>{m.albums.length} album{m.albums.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ))}
              {albumMixes.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>
                  no album mixes yet -- create one above.
                </div>
              )}
            </div>

            {/* YOUR SONG MIXES */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 36, marginBottom: 22 }}>
              <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600 }}>your song mixes</div>
              <button className="sb-btn" onClick={() => setShowNewMix(showNewMix === "song" ? null : "song")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={13} /> new song mix
              </button>
            </div>
            {showNewMix === "song" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 22, alignItems: "center" }}>
                <input className="sb-input ui-sans" style={{ flex: 1 }} placeholder="song mix title..." value={newMixTitle} onChange={(e) => setNewMixTitle(e.target.value)} autoFocus />
                <button className="sb-btn sb-btn-solid" onClick={createSongMix}>create</button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px 16px" }}>
              {songMixes.map((m) => (
                <div key={m.id} onClick={() => setView({ name: "songMixDetail", id: m.id })} className="sb-cover-wrap">
                  <SongMixCover mix={m} size={150} />
                  <div className="ui-sans" style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{m.title}</div>
                  <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE }}>{m.tracks.length} track{m.tracks.length !== 1 ? "s" : ""}</div>
                </div>
              ))}
              {songMixes.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5, gridColumn: "1 / -1" }}>
                  no song mixes yet -- create one above.
                </div>
              )}
            </div>

            {/* SAVED ALBUM MIXES */}
            <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600, marginTop: 36, marginBottom: 16 }}>saved album mixes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedAlbumMixes.map((m) => (
                <div
                  key={m.id}
                  style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}
                >
                  <div onClick={() => setView({ name: "albumMixDetail", id: m.id })} style={{ display: "flex", cursor: "pointer" }}>
                    {m.albums.slice(0, 3).map((a, i) => (
                      <div key={a.albumId} style={{ marginLeft: i === 0 ? 0 : -20, zIndex: 3 - i, border: `2px solid ${BG}`, borderRadius: 9 }}>
                        <AlbumCover album={albumById(a.albumId)} size={44} />
                      </div>
                    ))}
                    {m.albums.length === 0 && <ListMusic size={36} color={LINE} strokeWidth={1.4} />}
                  </div>
                  <div style={{ flex: 1, cursor: "pointer" }} className="ui-sans" onClick={() => setView({ name: "albumMixDetail", id: m.id })}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{m.title}</div>
                    <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>by @{m.owner}</div>
                    {m.description && <div style={{ fontSize: 12.5, color: MUTE, marginTop: 2 }}>{m.description}</div>}
                    <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>{m.albums.length} album{m.albums.length !== 1 ? "s" : ""}</div>
                  </div>
                  <button className="sb-btn" onClick={() => unsaveAlbumMix(m.id)} style={{ padding: "6px 10px", fontSize: 11 }} title="Remove from saved album mixes">
                    unsave
                  </button>
                </div>
              ))}
              {savedAlbumMixes.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>
                  nothing saved yet -- album mixes you save from other people will show up here.
                </div>
              )}
            </div>

            {/* SAVED SONG MIXES */}
            <div className="ui-sans" style={{ fontSize: 20, fontWeight: 600, marginTop: 36, marginBottom: 16 }}>saved song mixes</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px 16px" }}>
              {savedSongMixes.map((m) => (
                <div key={m.id} style={{ position: "relative" }}>
                  <div onClick={() => setView({ name: "songMixDetail", id: m.id })} className="sb-cover-wrap">
                    <SongMixCover mix={m} size={150} />
                  </div>
                  <div className="ui-sans" style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{m.title}</div>
                  <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE }}>by @{m.owner} · {m.tracks.length} track{m.tracks.length !== 1 ? "s" : ""}</div>
                  <button
                    className="sb-btn"
                    onClick={() => unsaveSongMix(m.id)}
                    style={{ padding: "4px 8px", fontSize: 10, marginTop: 6 }}
                    title="Remove from saved song mixes"
                  >
                    unsave
                  </button>
                </div>
              ))}
              {savedSongMixes.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5, gridColumn: "1 / -1" }}>
                  nothing saved yet -- song mixes you save from other people will show up here.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- ALBUM MIX DETAIL ---------------- */}
        {view.name === "albumMixDetail" && (() => {
          const ownMix = albumMixes.find((m) => m.id === view.id);
          const savedMix = savedAlbumMixes.find((m) => m.id === view.id);
          const mix = ownMix || savedMix || view.mix || null;
          if (!mix) return null;
          const isOwn = Boolean(ownMix);
          const backDest = view.from || { name: "mixes" };
          return (
            <div>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView(backDest)}>
                <ChevronLeft size={14} /> back
              </div>
              <div className="ui-sans" style={{ fontSize: 22, fontWeight: 600 }}>{mix.title}</div>
              {!isOwn && <div className="ui-sans" style={{ fontSize: 12, color: MUTE, marginTop: 3 }}>by @{mix.owner}</div>}
              {mix.description && <div className="ui-sans" style={{ fontSize: 13.5, color: MUTE, marginTop: 4 }}>{mix.description}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "26px 16px", marginTop: 24 }}>
                {mix.albums.map((a) => {
                  const album = albumById(a.albumId);
                  return (
                    <div key={a.albumId} style={{ position: "relative" }}>
                      <div className="sb-cover-wrap" onClick={() => openAlbum(a.albumId)}>
                        <AlbumCover album={album} size={150} />
                      </div>
                      {isOwn && (
                        <button
                          onClick={() => removeFromAlbumMix(mix.id, a.albumId)}
                          style={{ position: "absolute", top: 5, right: 5, background: INK, border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          title="Remove from album mix"
                        >
                          <X size={12} color="#fff" />
                        </button>
                      )}
                      <div className="ui-sans" style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{album.title}</div>
                      <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE }}>{album.artist}</div>
                      {isOwn ? (
                        <textarea
                          className="sb-textarea ui-sans"
                          placeholder="why's it on here? (optional)"
                          value={a.note}
                          onChange={(e) => updateAlbumMixNote(mix.id, a.albumId, e.target.value)}
                          rows={2}
                          style={{ width: "100%", marginTop: 6, fontSize: 10.5, padding: "5px 7px", lineHeight: 1.4, resize: "none" }}
                        />
                      ) : (
                        a.note && <div className="ui-sans" style={{ fontSize: 10.5, color: MUTE, marginTop: 6, fontStyle: "italic", lineHeight: 1.4, wordBreak: "break-word" }}>"{a.note}"</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {mix.albums.length === 0 && (
                <div className="ui-sans" style={{ marginTop: 30, color: MUTE, fontSize: 13.5 }}>
                  empty for now -- open any album from browse and use "add to album mix" to fill this in.
                </div>
              )}
              <MixTagEditor
                tags={mix.tags || []}
                isOwn={isOwn}
                onUpdateTags={isOwn ? (tags) => updateAlbumMixTags(mix.id, tags) : null}
                onTagClick={(tag) => setView({ name: "tagResults", tag })}
              />
            </div>
          );
        })()}

        {/* ---------------- SONG MIX DETAIL ---------------- */}
        {view.name === "songMixDetail" && (() => {
          const ownMix = songMixes.find((m) => m.id === view.id);
          const savedMix = savedSongMixes.find((m) => m.id === view.id);
          const mix = ownMix || savedMix || view.mix || null;
          if (!mix) return null;
          const isOwn = Boolean(ownMix);
          const backDest = view.from || { name: "mixes" };
          return (
            <SongMixDetail
              mix={mix}
              isOwn={isOwn}
              onBack={() => setView(backDest)}
              onOpenAlbum={openAlbum}
              onAddTrack={(trackTitle, albumId) => addTrackToSongMix(mix.id, trackTitle, albumId)}
              onRemoveTrack={(trackId) => removeTrackFromSongMix(mix.id, trackId)}
              onSetCover={(url) => setSongMixCover(mix.id, url)}
              onUpdateInfo={(title, description) => updateSongMixInfo(mix.id, title, description)}
              onUpdateTags={(tags) => updateSongMixTags(mix.id, tags)}
              onTagClick={(tag) => setView({ name: "tagResults", tag })}
            />
          );
        })()}

        {/* ---------------- ALBUM LIST (listened / queued) ---------------- */}
        {view.name === "albumList" && (() => {
          const filter = view.filter;
          const label = filter === "listened" ? "listened" : "queued";
          const matchingIds = Object.entries(listenStatus)
            .filter(([, s]) => s === filter)
            .map(([id]) => id);

          // Resolve albums -- prefer fetchedAlbums (real data), fall back to
          // mock ALBUMS, and trigger a fetch for any we don't have yet.
          const matchingAlbums = matchingIds
            .map((id) => {
              const album = fetchedAlbums[id] || albumById(id);
              if (!fetchedAlbums[id] && album.title === "Unknown Album") {
                // Trigger fetch in background
                apiFetch(`${BACKEND_URL}/api/albums/${id}`)
                  .then((r) => r.json())
                  .then((d) => {
                    if (d.album) {
                      const a = d.album;
                      setFetchedAlbums((prev) => ({ ...prev, [id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                    }
                  })
                  .catch(() => {});
              }
              return album;
            })
            .filter((a) => a && a.title !== "Unknown Album")
            .sort((a, b) => (a.year || 0) - (b.year || 0));

          // Group by decade for a nicer chronological layout
          const byDecade = matchingAlbums.reduce((acc, album) => {
            const year = album.year || album.releaseYear || 0;
            const decade = year ? Math.floor(year / 10) * 10 + "s" : "unknown";
            if (!acc[decade]) acc[decade] = [];
            acc[decade].push(album);
            return acc;
          }, {});
          const decades = Object.keys(byDecade).sort();

          return (
            <div>
              <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={() => setView({ name: "profile" })}>
                <ChevronLeft size={14} /> back to profile
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
                <div className="ui-sans" style={{ fontSize: 22, fontWeight: 600 }}>{label}</div>
                <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>{matchingAlbums.length} album{matchingAlbums.length !== 1 ? "s" : ""} · sorted by year</div>
              </div>

              {matchingAlbums.length === 0 && (
                <div className="ui-sans" style={{ color: MUTE, fontSize: 13.5 }}>
                  {filter === "listened" ? "no albums marked as listened yet." : "nothing queued yet."}
                </div>
              )}

              {decades.map((decade) => (
                <div key={decade} style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>{decade}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px 14px" }}>
                    {byDecade[decade].map((album) => {
                      const rev = reviews.find((r) => r.albumId === album.id);
                      return (
                        <div key={album.id} onClick={() => openAlbum(album.id)} className="sb-cover-wrap">
                          <AlbumCover album={album} size={130} />
                          <div style={{ marginTop: 7 }}>
                            <div className="ui-sans" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{album.title}</div>
                            <div className="ui-sans" style={{ fontSize: 11.5, color: MUTE }}>{album.artist} · {album.year}</div>
                            {rev && (
                              <div className="ui-sans" style={{ fontSize: 11, fontWeight: 600, color: BLUE, marginTop: 2 }}>{rev.rating}/10</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ---------------- PROFILE ---------------- */}
        {view.name === "profile" && (
          <div>
            <div style={{ display: "flex", gap: isMobile ? 18 : 24, alignItems: "center", justifyContent: "space-between", paddingBottom: 22, borderBottom: `1.5px solid ${INK}` }}>
              <div style={{ display: "flex", gap: isMobile ? 18 : 24, alignItems: "center" }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    style={{ width: isMobile ? 88 : 120, height: isMobile ? 88 : 120, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: isMobile ? 88 : 120, height: isMobile ? 88 : 120, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User color="#fff" size={isMobile ? 36 : 48} />
                  </div>
                )}
                <div className="ui-sans" style={{ textAlign: "left" }}>
                  <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", textAlign: "left" }}>{profile.displayName}</div>
                  <div style={{ fontSize: isMobile ? 14 : 16, color: MUTE, marginTop: 3, textAlign: "left" }}>@{profile.username}</div>
                  {profile.bio && <div style={{ fontSize: isMobile ? 14 : 15, color: MUTE, marginTop: 10, maxWidth: 480, lineHeight: 1.5, textAlign: "left" }}>{profile.bio}</div>}
                </div>
              </div>
              <button
                onClick={openSettings}
                className="sb-btn"
                style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start", flexShrink: 0 }}
                title="Edit profile"
                aria-label="Edit profile"
              >
                <Settings size={14} /> settings
              </button>
            </div>

            {showSettings && (
              <div style={{ marginTop: 18, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: 18 }} className="ui-sans">
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>edit profile</div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  {draftAvatarUrl ? (
                    <img src={draftAvatarUrl} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User color="#fff" size={24} />
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      style={{ display: "none" }}
                    />
                    <button className="sb-btn" onClick={() => avatarFileInputRef.current && avatarFileInputRef.current.click()}>
                      upload photo
                    </button>
                    {draftAvatarUrl && (
                      <button className="sb-btn" onClick={() => setDraftAvatarUrl(null)}>
                        remove
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>display name</div>
                    <input className="sb-input" style={{ width: "100%" }} value={draftDisplayName} onChange={(e) => setDraftDisplayName(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>username</div>
                    <input className="sb-input" style={{ width: "100%" }} value={draftUsername} onChange={(e) => setDraftUsername(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>bio</div>
                    <textarea className="sb-textarea" rows={3} value={draftBio} onChange={(e) => setDraftBio(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button className="sb-btn sb-btn-solid" onClick={saveSettings}>save changes</button>
                  <button className="sb-btn" onClick={() => setShowSettings(false)}>cancel</button>
                </div>

                <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 20, paddingTop: 18 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>theme</div>

                  <div style={{ fontSize: 11, color: MUTE, marginBottom: 8 }}>accent color</div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                    {Object.entries(ACCENTS).map(([key, a]) => (
                      <button
                        key={key}
                        onClick={() => setAccentKey(key)}
                        title={a.name}
                        aria-label={`Use ${a.name} accent`}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: a.value,
                          border: accentKey === key ? `2px solid ${INK}` : `2px solid transparent`,
                          padding: 0,
                          cursor: "pointer",
                          boxShadow: accentKey === key ? `0 0 0 2px ${BG}` : "none",
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: MUTE, marginBottom: 8 }}>appearance</div>
                  <div style={{ display: "flex", border: `1.5px solid ${INK}`, borderRadius: 6, overflow: "hidden", width: 200 }}>
                    <button
                      onClick={() => setDarkMode(false)}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        fontFamily: "inherit",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        border: "none",
                        background: !darkMode ? INK : "transparent",
                        color: !darkMode ? BG : INK,
                      }}
                    >
                      light
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        fontFamily: "inherit",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        border: "none",
                        borderLeft: `1.5px solid ${INK}`,
                        background: darkMode ? INK : "transparent",
                        color: darkMode ? BG : INK,
                      }}
                    >
                      dark
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: isMobile ? 16 : 40, padding: "20px 0", borderBottom: `1px solid ${LINE}`, overflowX: "auto", justifyContent: "center" }}>
              <Stat label="followers" value={profileStats.followers} onClick={() => setShowFollowList("followers")} />
              <Stat label="following" value={profileStats.following} onClick={() => setShowFollowList("following")} />
              <Stat label="listened" value={listenedCount} onClick={() => setView({ name: "albumList", filter: "listened" })} />
              <Stat label="reviews" value={reviews.length} />
              <Stat label="avg rating" value={avgRating} />
            </div>

            <div style={{ marginTop: 26 }}>
              <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14, textAlign: "center", fontWeight: 600 }}>top 3 albums</div>
              <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                {favorites.map((id) => {
                  const album = fetchedAlbums[id] || albumById(id);
                  // Trigger a fetch if we don't have real data for this album yet
                  if (!fetchedAlbums[id] && album.title === "Unknown Album") {
                    apiFetch(`${BACKEND_URL}/api/albums/${id}`)
                      .then((r) => r.json())
                      .then((data) => {
                        if (data.album) {
                          const a = data.album;
                          setFetchedAlbums((prev) => ({ ...prev, [id]: { ...a, artist: a.artistName || "", year: a.releaseYear || null } }));
                        }
                      })
                      .catch(() => {});
                  }
                  return (
                    <div key={id} onClick={() => openAlbum(id)} className="sb-cover-wrap">
                      <AlbumCover album={album} size={96} />
                      <div className="ui-sans" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 6, maxWidth: 96 }}>{album.title !== "Unknown Album" ? album.title : "..."}</div>
                    </div>
                  );
                })}
                {favorites.length === 0 && <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>no favorites picked yet.</div>}
                {[...Array(Math.max(0, 3 - favorites.length))].map((_, i) => (
                  <div key={i} style={{ width: 96, height: 96, border: `1.5px dashed ${LINE}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: LINE }}>
                    <Plus size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14, textAlign: isMobile ? "center" : "left", fontWeight: 600 }}>recent reviews</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: isMobile ? "center" : "flex-start" }}>
                {[...reviews].sort((a, b) => (a.date < b.date ? 1 : -1)).map((r) => {
                  const album = fetchedAlbums[r.albumId] || albumById(r.albumId);
                  if (!album) return null;
                  return (
                    <div key={r.id} onClick={() => openAlbum(r.albumId)} style={{ display: "flex", gap: 14, cursor: "pointer", width: "100%", maxWidth: isMobile ? 340 : "100%" }}>
                      <AlbumCover album={album} size={88} />
                      <div className="ui-sans" style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, letterSpacing: "-0.01em", lineHeight: 1.1, textAlign: "left" }}>{r.rating}/10</div>
                        <div style={{ marginTop: 1, textAlign: "left" }}>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{album.title}</span>
                          <span style={{ fontSize: 13, color: MUTE, marginLeft: 6 }}>{album.artist || album.artistName}</span>
                        </div>
                        <div style={{ fontSize: 11, color: MUTE, marginTop: 4, textAlign: "left" }}>{r.date}</div>
                        {r.text && <div style={{ fontSize: 13.5, color: INK, marginTop: 3, lineHeight: 1.5, textAlign: "left" }}>{r.text}</div>}
                        {(r.favTrack || r.leastFavTrack) && (
                          <div style={{ fontSize: 11.5, color: MUTE, marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap", textAlign: "left" }}>
                            {r.favTrack && <span>♡ {r.favTrack}</span>}
                            {r.leastFavTrack && <span>✕ {r.leastFavTrack}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {reviews.length === 0 && <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>no reviews yet -- rate something from browse.</div>}
              </div>
            </div>

            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 12 }}>mixes</div>
              <div style={{ display: "flex", border: `1.5px solid ${LINE}`, borderRadius: 6, overflow: "hidden", width: 220, marginBottom: 18 }}>
                <button onClick={() => setOwnProfileMixTab("album")} style={{ flex: 1, padding: "7px 0", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", background: ownProfileMixTab === "album" ? INK : "transparent", color: ownProfileMixTab === "album" ? BG : INK }}>album mixes</button>
                <button onClick={() => setOwnProfileMixTab("song")} style={{ flex: 1, padding: "7px 0", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", borderLeft: `1.5px solid ${LINE}`, background: ownProfileMixTab === "song" ? INK : "transparent", color: ownProfileMixTab === "song" ? BG : INK }}>song mixes</button>
              </div>
              {ownProfileMixTab === "album" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {albumMixes.map((m) => (
                    <div key={m.id} onClick={() => setView({ name: "albumMixDetail", id: m.id })} style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}>
                      <div style={{ display: "flex" }}>
                        {m.albums.slice(0, 3).map((a, i) => (
                          <div key={a.albumId} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 3 - i, border: `2px solid ${BG}`, borderRadius: 7 }}>
                            <AlbumCover album={albumById(a.albumId)} size={38} />
                          </div>
                        ))}
                        {m.albums.length === 0 && <ListMusic size={32} color={LINE} strokeWidth={1.4} />}
                      </div>
                      <div className="ui-sans" style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.title}</div>
                        <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{m.albums.length} album{m.albums.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  ))}
                  {albumMixes.length === 0 && <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>no album mixes yet.</div>}
                </div>
              )}
              {ownProfileMixTab === "song" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px 14px" }}>
                  {songMixes.map((m) => (
                    <div key={m.id} onClick={() => setView({ name: "songMixDetail", id: m.id })} className="sb-cover-wrap">
                      <SongMixCover mix={m} size={130} />
                      <div className="ui-sans" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>{m.title}</div>
                      <div className="ui-sans" style={{ fontSize: 11, color: MUTE }}>{m.tracks.length} track{m.tracks.length !== 1 ? "s" : ""}</div>
                    </div>
                  ))}
                  {songMixes.length === 0 && <div className="ui-sans" style={{ color: MUTE, fontSize: 13, gridColumn: "1/-1" }}>no song mixes yet.</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${LINE}`, padding: "18px 24px", display: "flex", justifyContent: "center", gap: 20 }}>
        <span className="ui-sans" style={{ fontSize: 11, color: MUTE, cursor: "pointer" }} onClick={() => setView({ name: "terms" })}>terms of service</span>
        <span className="ui-sans" style={{ fontSize: 11, color: MUTE, cursor: "pointer" }} onClick={() => setView({ name: "terms" })}>privacy policy</span>
        <span className="ui-sans" style={{ fontSize: 11, color: MUTE }}>© {new Date().getFullYear()} Spindex</span>
      </div>
    </div>
    </AvatarContext.Provider>
    </ThemeContext.Provider>
  );
}

function Stat({ label, value, onClick }) {
  const { MUTE, INK } = useTheme();
  const content = (
    <>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 10, color: MUTE, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{label}</div>
    </>
  );
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="ui-sans"
        style={{ background: "transparent", border: "none", padding: 0, textAlign: "left", cursor: "pointer", color: INK, fontFamily: "inherit", flexShrink: 0 }}
      >
        {content}
      </button>
    );
  }
  return <div className="ui-sans" style={{ flexShrink: 0 }}>{content}</div>;
}

function AddToAlbumMixInline({ album, albumMixes, onAdd }) {
  const { BLUE, INK, LINE, MUTE } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
      <button className="sb-btn" onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ListMusic size={13} /> add to album mix
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {albumMixes.map((m) => {
            const already = m.albums.some((a) => a.albumId === album.id);
            return (
              <div
                key={m.id}
                onClick={() => !already && onAdd(m.id, album.id)}
                className="ui-sans"
                style={{ fontSize: 13, padding: "7px 10px", border: `1.5px solid ${LINE}`, borderRadius: 6, cursor: already ? "default" : "pointer", display: "flex", justifyContent: "space-between", color: already ? MUTE : INK }}
              >
                <span>{m.title}</span>
                {already && <Check size={14} color={BLUE} />}
              </div>
            );
          })}
          {albumMixes.length === 0 && <div className="ui-sans" style={{ fontSize: 12.5, color: MUTE }}>you don't have any album mixes yet.</div>}
        </div>
      )}
    </div>
  );
}

// A song mix's cover: a custom uploaded image if set, otherwise a 2x2
// collage of its tracks' album covers (Spotify/Apple Music both do this
// for auto-generated playlist art), or the plain headphone mark if the
// mix has no tracks yet.
function SongMixCover({ mix, size = 92 }) {
  const { BLUE } = useTheme();
  if (mix.coverImageUrl) {
    return <img src={mix.coverImageUrl} alt="" style={{ width: size, height: size, borderRadius: Math.max(8, size * 0.1), objectFit: "cover", flexShrink: 0 }} />;
  }
  const covers = mix.tracks.slice(0, 4);
  if (covers.length === 0) {
    return (
      <div style={{ width: size, height: size, background: BLUE, borderRadius: Math.max(8, size * 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <HeadphoneMark size={size * 0.4} color="#fff" />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: Math.max(8, size * 0.1), overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", flexShrink: 0 }}>
      {covers.map((t, i) => (
        <div key={t.id} style={{ background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HeadphoneMark size={size * 0.18} color="#fff" />
        </div>
      ))}
      {/* pad to 4 quadrants if fewer than 4 tracks so the grid stays square */}
      {[...Array(Math.max(0, 4 - covers.length))].map((_, i) => (
        <div key={`pad${i}`} style={{ background: BLUE, opacity: 0.6 }} />
      ))}
    </div>
  );
}

// Search-and-pick UI used when adding a track to a song mix. Searches the
// album catalog (mock ALBUMS here -- in the real app this becomes a
// MusicBrainz search, same pattern as everywhere else in this file) so
// the chosen album supplies cover art + artist name for the track.
function AlbumSearchPicker({ onPick, onCancel, placeholder = "search for the album this track is from..." }) {
  const { LINE, MUTE, INK } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced real search against the backend FTS index. Mirrors the
  // browse-page search: 3-char minimum, 500ms debounce, normalize
  // artistName/releaseYear -> artist/year for display.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      apiFetch(`${BACKEND_URL}/api/albums?search=${encodeURIComponent(q)}&limit=30`)
        .then((res) => res.json())
        .then((data) => {
          const albums = (data.albums || []).map((a) => ({
            ...a,
            artist: a.artistName || a.artist || "",
            year: a.releaseYear || a.year || null,
          }));
          setResults(albums);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: 14 }}>
      <input
        className="sb-input ui-sans"
        style={{ width: "100%" }}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4, maxHeight: 220, overflowY: "auto" }}>
        {query.trim().length < 3 && (
          <div className="ui-sans" style={{ fontSize: 12.5, color: MUTE, padding: "6px 8px" }}>type at least 3 characters to search...</div>
        )}
        {query.trim().length >= 3 && loading && (
          <div className="ui-sans" style={{ fontSize: 12.5, color: MUTE, padding: "6px 8px" }}>searching...</div>
        )}
        {query.trim().length >= 3 && !loading && results.map((album) => (
          <div
            key={album.id}
            onClick={() => onPick(album)}
            className="ui-sans"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = LINE)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <AlbumCover album={album} size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{album.title}</div>
              <div style={{ fontSize: 11, color: MUTE }}>{album.artist}</div>
            </div>
          </div>
        ))}
        {query.trim().length >= 3 && !loading && results.length === 0 && (
          <div className="ui-sans" style={{ fontSize: 12.5, color: MUTE, padding: "6px 8px" }}>no albums match "{query}"</div>
        )}
      </div>
      <button className="sb-btn" onClick={onCancel} style={{ marginTop: 10, fontSize: 11 }}>cancel</button>
    </div>
  );
}

// Question-of-the-day popup: shows today's prompt, lets the person search
// and pick an album that answers it, confirms the pick, then posts.
// Draws a shareable image card onto an offscreen canvas and resolves a PNG
// blob. Mirrors the album-cover placeholder style used everywhere else in
// the app (solid blue square + headphone mark) since there's no real cover
// art in this demo -- the real app would draw the actual artwork here.
function generateShareCardBlob({ kind, album, username, rating, reviewText, questionText, accentColor }) {
  return new Promise((resolve) => {
    const W = 1080, H = 1350; // 4:5, the safe aspect ratio for both feed and Stories crops
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // Album cover placeholder block
    const coverSize = 640;
    const coverX = (W - coverSize) / 2;
    const coverY = 180;
    const radius = 36;
    ctx.fillStyle = accentColor;
    roundRect(ctx, coverX, coverY, coverSize, coverSize, radius);
    ctx.fill();

    // Headphone mark, drawn directly since SVG can't be reused on canvas
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.beginPath();
    const cx = coverX + coverSize / 2, cy = coverY + coverSize / 2;
    ctx.arc(cx, cy - 30, 130, Math.PI, 0, false);
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, cx - 160, cy + 40, 60, 110, 28); ctx.fill();
    roundRect(ctx, cx + 100, cy + 40, 60, 110, 28); ctx.fill();

    // Album title / artist
    ctx.fillStyle = "#0A0A0A";
    ctx.textAlign = "center";
    ctx.font = "700 52px Arial, sans-serif";
    wrapText(ctx, album.title, W / 2, coverY + coverSize + 90, 880, 58);
    ctx.font = "400 36px Arial, sans-serif";
    ctx.fillStyle = "#7A7A7A";
    ctx.fillText(album.artist + (album.year ? ` · ${album.year}` : ""), W / 2, coverY + coverSize + 150);

    // Rating or question label
    ctx.font = "700 44px Arial, sans-serif";
    ctx.fillStyle = accentColor;
    if (kind === "qotd") {
      ctx.font = "700 32px Arial, sans-serif";
      wrapText(ctx, `"${questionText}"`, W / 2, coverY + coverSize + 220, 800, 42);
    } else {
      ctx.fillText(`${rating}/10`, W / 2, coverY + coverSize + 225);
    }

    // Username + wordmark footer
    ctx.font = "600 34px Arial, sans-serif";
    ctx.fillStyle = "#0A0A0A";
    ctx.fillText(`@${username}`, W / 2, H - 110);
    ctx.font = "700 38px Arial, sans-serif";
    ctx.fillStyle = accentColor;
    ctx.fillText("spindex", W / 2, H - 55);

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

// Generates SVG polygon points for a comic-style "spikey" action bubble --
// alternating outer/inner radius around a center point, like an explosion
// or starburst shape. Used behind the QOTD button instead of a plain pill.
function starburstPoints(cx, cy, outerRx, outerRy, spikes) {
  const points = [];
  const innerRx = outerRx * 0.78;
  const innerRy = outerRy * 0.78;
  const total = spikes * 2;
  for (let i = 0; i < total; i++) {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const rx = i % 2 === 0 ? outerRx : innerRx;
    const ry = i % 2 === 0 ? outerRy : innerRy;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

// Share button: generates the card image, then tries the native device
// share sheet (where Instagram shows up as a target on supporting mobile
// browsers). Falls back to a plain image download everywhere else --
// there is no web API that posts directly into Instagram Stories, so a
// manual "save then post it yourself" fallback is the honest option.
function ShareButton({ kind, album, username, rating, reviewText, questionText }) {
  const { BLUE, INK, MUTE } = useTheme();
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    setBusy(true);
    try {
      const blob = await generateShareCardBlob({ kind, album, username, rating, reviewText, questionText, accentColor: BLUE });
      const file = new File([blob], "spindex-share.png", { type: "image/png" });
      const shareData = { files: [file], title: "Spindex", text: kind === "qotd" ? questionText : `${album.title} — ${rating}/10` };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: trigger a direct download so the person can post it themselves
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "spindex-share.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) {
      // AbortError just means the person closed the share sheet -- not a real error
      if (err && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={busy}
      className="ui-sans"
      title="Share as image"
      style={{ background: "none", border: "none", cursor: busy ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0, color: MUTE, fontSize: 12, opacity: busy ? 0.5 : 1 }}
    >
      <Share2 size={15} strokeWidth={1.8} />
      {busy ? "..." : "share"}
    </button>
  );
}

function QotdModal({ question, onSubmit, onClose }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [pickedAlbum, setPickedAlbum] = useState(null);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: BG, border: `1.5px solid ${INK}`, borderRadius: 10, padding: 24, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div className="ui-sans" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: BLUE }}>QOTD</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 0 }}>
            <X size={16} />
          </button>
        </div>
        <div className="ui-sans" style={{ fontSize: 18, fontWeight: 600, marginTop: 6, marginBottom: 20, lineHeight: 1.3 }}>
          {question}
        </div>

        {!pickedAlbum ? (
          <AlbumSearchPicker onPick={setPickedAlbum} onCancel={onClose} placeholder="search for an album..." />
        ) : (
          <div>
            <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 8 }}>your answer</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
              <AlbumCover album={pickedAlbum} size={48} />
              <div className="ui-sans" style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{pickedAlbum.title}</div>
                <div style={{ fontSize: 11.5, color: MUTE }}>{pickedAlbum.artist} · {pickedAlbum.year}</div>
              </div>
              <button onClick={() => setPickedAlbum(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 4 }} title="Pick a different album">
                <X size={14} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="sb-btn sb-btn-solid" onClick={() => onSubmit(pickedAlbum.id)}>post answer</button>
              <button className="sb-btn" onClick={onClose}>cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickReviewModal({ onSubmit, onClose }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [pickedAlbum, setPickedAlbum] = useState(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [favTrack, setFavTrack] = useState("");
  const [leastFavTrack, setLeastFavTrack] = useState("");

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: BG, border: `1.5px solid ${INK}`, borderRadius: 10, padding: 24, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="ui-sans" style={{ fontSize: 15, fontWeight: 600 }}>post a review</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 0 }}><X size={16} /></button>
        </div>

        {!pickedAlbum ? (
          <AlbumSearchPicker onPick={setPickedAlbum} onCancel={onClose} placeholder="search for an album..." />
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "10px 12px", marginBottom: 18 }}>
              <AlbumCover album={pickedAlbum} size={48} />
              <div className="ui-sans" style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{pickedAlbum.title}</div>
                <div style={{ fontSize: 11.5, color: MUTE }}>{pickedAlbum.artist} · {pickedAlbum.year}</div>
              </div>
              <button onClick={() => { setPickedAlbum(null); setRating(0); setText(""); setFavTrack(""); setLeastFavTrack(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 4 }}><X size={14} /></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 8 }}>your rating</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <RatingBlocks value={rating} onChange={setRating} size={18} />
                <span className="ui-sans" style={{ fontSize: 13, fontWeight: 600, color: rating ? BLUE : MUTE }}>{rating ? `${rating}/10` : "—"}</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 6 }}>write something (optional)</div>
              <textarea
                className="sb-textarea ui-sans"
                rows={3}
                placeholder="what did you think?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>favorite track (optional)</div>
                <input
                  className="sb-input ui-sans"
                  style={{ width: "100%" }}
                  placeholder="best track"
                  value={favTrack}
                  onChange={(e) => setFavTrack(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>least favorite (optional)</div>
                <input
                  className="sb-input ui-sans"
                  style={{ width: "100%" }}
                  placeholder="weakest track"
                  value={leastFavTrack}
                  onChange={(e) => setLeastFavTrack(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="sb-btn sb-btn-solid" disabled={!rating} onClick={() => onSubmit(pickedAlbum.id, rating, text, favTrack, leastFavTrack)}>post review</button>
              <button className="sb-btn" onClick={onClose}>cancel</button>
            </div>
            {!rating && <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginTop: 8 }}>add a rating to post</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function ShareMixModal({ albumMixes, songMixes, onSubmit, onClose }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [tab, setTab] = useState("album");

  const mixes = tab === "album" ? albumMixes : songMixes;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: BG, border: `1.5px solid ${INK}`, borderRadius: 10, padding: 24, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="ui-sans" style={{ fontSize: 15, fontWeight: 600 }}>share a mix</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 0 }}><X size={16} /></button>
        </div>

        <div style={{ display: "flex", border: `1.5px solid ${INK}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
          <button onClick={() => setTab("album")} style={{ flex: 1, padding: "7px 0", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", background: tab === "album" ? INK : "transparent", color: tab === "album" ? BG : INK }}>album mixes</button>
          <button onClick={() => setTab("song")} style={{ flex: 1, padding: "7px 0", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", borderLeft: `1.5px solid ${INK}`, background: tab === "song" ? INK : "transparent", color: tab === "song" ? BG : INK }}>song mixes</button>
        </div>

        {mixes.length === 0 && (
          <div className="ui-sans" style={{ fontSize: 13, color: MUTE, padding: "12px 0" }}>
            no {tab} mixes yet — create one from the mixes tab.
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {mixes.map((m) => (
            <button
              key={m.id}
              onClick={() => onSubmit(tab, m.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: `1.5px solid ${LINE}`, borderRadius: 8, background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = BLUE}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = LINE}
            >
              {tab === "song" ? (
                <SongMixCover mix={m} size={42} />
              ) : (
                <div style={{ display: "flex" }}>
                  {(m.albums || []).slice(0, 3).map((a, i) => (
                    <div key={a.albumId} style={{ marginLeft: i === 0 ? 0 : -12, zIndex: 3 - i, border: `2px solid ${BG}`, borderRadius: 6 }}>
                      <AlbumCover album={albumById(a.albumId)} size={34} />
                    </div>
                  ))}
                  {(m.albums || []).length === 0 && <ListMusic size={34} color={LINE} strokeWidth={1.4} />}
                </div>
              )}
              <div className="ui-sans">
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{m.title}</div>
                <div style={{ fontSize: 11.5, color: MUTE }}>{tab === "song" ? `${(m.tracks || []).length} tracks` : `${(m.albums || []).length} albums`}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Full song mix detail screen: Spotify/Apple-Music-style sequential
// tracklist, with an "add track" flow (search album -> type track title)
// and a custom cover image upload, both only available to the mix owner.
// Shared tag display + editor used by both album mix and song mix detail
// pages. Owners see an input that adds tags on Enter/comma; everyone sees
// clickable tag pills that navigate to tag results.
// Renders @mentions in comment text as styled blue spans
function CommentText({ text }) {
  const { BLUE } = useTheme();
  const parts = text.split(/(@[\w.]+)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("@")
          ? <span key={i} style={{ color: BLUE, fontWeight: 600 }}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// Input with @mention autocomplete
function CommentInput({ placeholder, onSubmit, currentUsername, initialValue = "" }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [text, setText] = useState(initialValue);
  const [mentionQuery, setMentionQuery] = useState(null); // null | string
  const [mentionStart, setMentionStart] = useState(0);

  const mentionResults = useMemo(() => {
    if (mentionQuery === null) return [];
    return ALL_USERS.filter((u) =>
      u.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);
  }, [mentionQuery]);

  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    // Detect @ pattern at cursor
    const cursor = e.target.selectionStart;
    const before = val.slice(0, cursor);
    const match = before.match(/@([\w.]*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setMentionStart(cursor - match[0].length);
    } else {
      setMentionQuery(null);
    }
  }

  function insertMention(username) {
    const after = text.slice(mentionStart + (mentionQuery !== null ? mentionQuery.length + 1 : 0));
    const newText = text.slice(0, mentionStart) + `@${username} ` + after;
    setText(newText);
    setMentionQuery(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault();
      onSubmit(text.trim());
      setText("");
      setMentionQuery(null);
    }
    if (e.key === "Escape") setMentionQuery(null);
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar username={currentUsername} size={22} />
        <input
          className="sb-input ui-sans"
          style={{ flex: 1, fontSize: 12.5, padding: "5px 10px" }}
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {text.trim() && (
          <button className="sb-btn sb-btn-solid" onClick={() => { onSubmit(text.trim()); setText(""); setMentionQuery(null); }} style={{ padding: "5px 10px", fontSize: 11.5 }}>post</button>
        )}
      </div>
      {mentionQuery !== null && mentionResults.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 30, zIndex: 20, background: BG, border: `1.5px solid ${LINE}`, borderRadius: 8, marginTop: 4, minWidth: 180, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
          {mentionResults.map((u) => (
            <div
              key={u.username}
              onClick={() => insertMention(u.username)}
              className="ui-sans"
              style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
              onMouseEnter={(e) => e.currentTarget.style.background = LINE}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Avatar username={u.username} size={20} />
              <div>
                <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                <div style={{ fontSize: 11, color: MUTE }}>@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Renders a single comment node with its nested replies, recursively
function CommentNode({ comment, depth = 0, reviewId, onReply, currentUsername }) {
  const { BLUE, INK, LINE, MUTE } = useTheme();
  const [replying, setReplying] = useState(false);
  const totalReplies = countReplies(comment);

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0, borderLeft: depth > 0 ? `2px solid ${LINE}` : "none", paddingLeft: depth > 0 ? 10 : 0 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        <Avatar username={comment.username} size={20} />
        <div style={{ flex: 1 }}>
          <div className="ui-sans" style={{ fontSize: 12.5 }}>
            <span style={{ fontWeight: 600 }}>{comment.username === currentUsername ? "you" : `@${comment.username}`}</span>
            <span style={{ color: MUTE, marginLeft: 6, fontSize: 11 }}>{comment.date}</span>
          </div>
          <div className="ui-sans" style={{ fontSize: 12.5, color: INK, marginTop: 2, lineHeight: 1.5 }}>
            <CommentText text={comment.text} />
          </div>
          <button
            onClick={() => setReplying((r) => !r)}
            className="ui-sans"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTE, padding: "3px 0", marginTop: 2 }}
          >
            {replying ? "cancel" : "reply"}
          </button>
        </div>
      </div>

      {/* Nested replies */}
      {(comment.replies || []).map((reply) => (
        <CommentNode key={reply.id} comment={reply} depth={depth + 1} reviewId={reviewId} onReply={onReply} currentUsername={currentUsername} />
      ))}

      {replying && (
        <div style={{ marginLeft: 28, marginBottom: 8 }}>
          <CommentInput
            placeholder={`reply to @${comment.username}...`}
            initialValue={`@${comment.username} `}
            currentUsername={currentUsername}
            onSubmit={(text) => {
              onReply(reviewId, comment.id, comment.username, text);
              setReplying(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function countReplies(comment) {
  if (!comment.replies || comment.replies.length === 0) return 0;
  return comment.replies.length + comment.replies.reduce((s, r) => s + countReplies(r), 0);
}

function countAllComments(comments) {
  return comments.reduce((s, c) => s + 1 + countReplies(c), 0);
}

// Heart / frown reaction buttons shown on a review, with live counts.
// Clicking the active reaction removes it; clicking the other one switches.
// Animated three-bar "now playing" indicator. Each bar bounces at a
// different speed so they feel organic rather than in lockstep.
// Shows the currently-in-rotation album on a profile. Owners get an
// inline "change" button that opens a small album search picker.
function InRotationSection({ albumId, isOwn, onOpenAlbum, onChangeAlbum }) {
  const { BLUE, INK, LINE, MUTE } = useTheme();
  const [picking, setPicking] = useState(false);
  const album = albumId ? albumById(albumId) : null;

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE }}>in rotation</div>
        {isOwn && !picking && (
          <button
            onClick={() => setPicking(true)}
            className="ui-sans"
            style={{ fontSize: 10.5, color: MUTE, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            {album ? "change" : "set album"}
          </button>
        )}
      </div>
      {picking ? (
        <div style={{ maxWidth: 340 }}>
          <AlbumSearchPicker
            placeholder="what are you listening to lately?"
            onPick={(a) => { onChangeAlbum(a.id); setPicking(false); }}
            onCancel={() => setPicking(false)}
          />
        </div>
      ) : album ? (
        <div onClick={() => onOpenAlbum(albumId)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ position: "relative" }}>
            <AlbumCover album={album} size={56} />
            <div style={{ position: "absolute", bottom: -4, right: -4, background: BLUE, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <NowPlayingBars />
            </div>
          </div>
          <div className="ui-sans">
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{album.title}</div>
            <div style={{ fontSize: 11.5, color: MUTE }}>{album.artist} · {album.year}</div>
          </div>
        </div>
      ) : (
        <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>nothing set yet.</div>
      )}
    </div>
  );
}

function NowPlayingBars() {
  const { BLUE } = useTheme();
  return (
    <>
      <style>{`
        @keyframes npBar { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        .np-bar { display: inline-block; width: 3px; border-radius: 2px; transform-origin: bottom; animation: npBar 0.9s ease-in-out infinite; }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
        <span className="np-bar" style={{ height: 10, background: BLUE, animationDelay: "0s" }} />
        <span className="np-bar" style={{ height: 14, background: BLUE, animationDelay: "0.2s" }} />
        <span className="np-bar" style={{ height: 8, background: BLUE, animationDelay: "0.4s" }} />
      </div>
    </>
  );
}

function ReactionBar({ reactions = { heart: [], frown: [] }, onReact, currentUsername }) {
  const { BLUE, MUTE } = useTheme();
  const heartCount = (reactions.heart || []).length;
  const frownCount = (reactions.frown || []).length;
  const youHearted = (reactions.heart || []).includes(currentUsername);
  const youFrowned = (reactions.frown || []).includes(currentUsername);

  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
      <button
        onClick={() => onReact("heart")}
        className="ui-sans"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0, color: youHearted ? "#E0537A" : MUTE, fontSize: 12 }}
      >
        <Heart size={15} fill={youHearted ? "#E0537A" : "none"} strokeWidth={1.8} />
        {heartCount > 0 && heartCount}
      </button>
      <button
        onClick={() => onReact("frown")}
        className="ui-sans"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0, color: youFrowned ? BLUE : MUTE, fontSize: 12 }}
      >
        <Frown size={15} strokeWidth={1.8} />
        {frownCount > 0 && frownCount}
      </button>
    </div>
  );
}

function ReviewComments({ reviewId, comments = [], onAdd, onReply, currentUsername, reviewOwnerUsername }) {
  const { BLUE, INK, LINE, MUTE } = useTheme();
  const [open, setOpen] = useState(false);
  const total = countAllComments(comments);

  return (
    <div style={{ marginTop: 10 }}>
      <button
        className="ui-sans"
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: MUTE, padding: 0, display: "flex", alignItems: "center", gap: 5 }}
      >
        {total > 0 ? `${total} comment${total !== 1 ? "s" : ""}` : "add a comment"}
        {total > 0 && <span style={{ fontSize: 10 }}>{open ? "▲" : "▼"}</span>}
      </button>

      {(open || total === 0) && (
        <div style={{ marginTop: 10 }}>
          {comments.map((c) => (
            <CommentNode key={c.id} comment={c} depth={0} reviewId={reviewId} onReply={onReply} currentUsername={currentUsername} />
          ))}
          <div style={{ marginTop: total > 0 ? 8 : 0 }}>
            <CommentInput
              placeholder="write a comment..."
              currentUsername={currentUsername}
              onSubmit={(text) => onAdd(reviewId, text, reviewOwnerUsername)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MixTagEditor({ tags, isOwn, onUpdateTags, onTagClick }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [input, setInput] = useState("");

  function normalizeTag(raw) {
    return raw.replace(/#/g, "").replace(/\s+/g, "-").toLowerCase().trim();
  }

  function addTag() {
    const tag = normalizeTag(input);
    if (!tag || tags.includes(tag)) { setInput(""); return; }
    onUpdateTags([...tags, tag]);
    setInput("");
  }

  function removeTag(tag) {
    onUpdateTags(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  if (!isOwn && (!tags || tags.length === 0)) return null;

  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 10 }}>tags</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {(tags || []).map((tag) => (
          <div
            key={tag}
            className="ui-sans"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1.5px solid ${BLUE}`, borderRadius: 20, padding: "4px 10px", fontSize: 12.5, color: BLUE, cursor: "pointer" }}
            onClick={() => onTagClick && onTagClick(tag)}
          >
            #{tag}
            {isOwn && (
              <span
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                style={{ fontSize: 11, color: MUTE, lineHeight: 1, cursor: "pointer" }}
              >
                ×
              </span>
            )}
          </div>
        ))}
        {isOwn && (
          <input
            className="sb-input ui-sans"
            placeholder="add tag..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            style={{ width: 110, fontSize: 12.5, padding: "4px 10px", borderRadius: 20 }}
          />
        )}
      </div>
      {isOwn && <div className="ui-sans" style={{ fontSize: 11, color: MUTE, marginTop: 6 }}>press Enter or comma to add · backspace to remove last</div>}
    </div>
  );
}

function SongMixDetail({ mix, isOwn, onBack, onOpenAlbum, onAddTrack, onRemoveTrack, onSetCover, onUpdateInfo, onUpdateTags, onTagClick }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [adding, setAdding] = useState(false);
  const [pickedAlbum, setPickedAlbum] = useState(null);
  const [trackTitleInput, setTrackTitleInput] = useState("");
  const coverFileInputRef = useRef(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [draftTitle, setDraftTitle] = useState(mix.title);
  const [draftDesc, setDraftDesc] = useState(mix.description || "");

  // Keep drafts in sync when the mix prop updates (e.g. after a save)
  React.useEffect(() => { if (!editingTitle) setDraftTitle(mix.title); }, [mix.title]);
  React.useEffect(() => { if (!editingDesc) setDraftDesc(mix.description || ""); }, [mix.description]);

  function commitTitle() {
    setEditingTitle(false);
    if (draftTitle.trim() && draftTitle.trim() !== mix.title) {
      onUpdateInfo(draftTitle.trim(), mix.description || "");
    }
    setDraftTitle(mix.title);
  }

  function commitDesc() {
    setEditingDesc(false);
    if (draftDesc !== (mix.description || "")) {
      onUpdateInfo(mix.title, draftDesc);
    }
  }

  function startAdd() {
    setPickedAlbum(null);
    setTrackTitleInput("");
    setAdding(true);
  }

  function confirmAddTrack() {
    if (!pickedAlbum || !trackTitleInput.trim()) return;
    onAddTrack(trackTitleInput.trim(), pickedAlbum.id);
    setAdding(false);
  }

  function handleCoverFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onSetCover(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="ui-sans" style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 22, cursor: "pointer" }} onClick={onBack}>
        <ChevronLeft size={14} /> back
      </div>

      <div style={{ display: "flex", gap: 22, alignItems: "flex-end" }}>
        <div style={{ position: "relative" }}>
          <SongMixCover mix={mix} size={140} />
          {isOwn && (
            <>
              <input ref={coverFileInputRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display: "none" }} />
              <button
                onClick={() => coverFileInputRef.current && coverFileInputRef.current.click()}
                className="ui-sans"
                style={{ position: "absolute", bottom: 6, right: 6, background: INK, color: BG, border: "none", borderRadius: 6, fontSize: 10, padding: "4px 7px", cursor: "pointer" }}
              >
                {mix.coverImageUrl ? "change cover" : "add cover"}
              </button>
            </>
          )}
        </div>
        <div className="ui-sans" style={{ paddingBottom: 6, flex: 1 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE }}>song mix</div>

          {isOwn && editingTitle ? (
            <input
              className="sb-input"
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => { if (e.key === "Enter") { e.target.blur(); } if (e.key === "Escape") { setDraftTitle(mix.title); setEditingTitle(false); } }}
              style={{ width: "100%", fontSize: 22, fontWeight: 600, marginTop: 4, padding: "4px 8px" }}
            />
          ) : (
            <div
              style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, marginTop: 4, display: "flex", alignItems: "center", gap: 8, cursor: isOwn ? "pointer" : "default" }}
              onClick={() => isOwn && setEditingTitle(true)}
            >
              {mix.title}
              {isOwn && <Pencil size={14} color={MUTE} strokeWidth={1.8} />}
            </div>
          )}

          {!isOwn && <div style={{ fontSize: 12.5, color: MUTE, marginTop: 4 }}>by @{mix.owner}</div>}

          {isOwn && editingDesc ? (
            <textarea
              className="sb-textarea"
              autoFocus
              value={draftDesc}
              onChange={(e) => setDraftDesc(e.target.value)}
              onBlur={commitDesc}
              onKeyDown={(e) => { if (e.key === "Escape") { setDraftDesc(mix.description || ""); setEditingDesc(false); } }}
              rows={2}
              style={{ width: "100%", fontSize: 13, marginTop: 6 }}
            />
          ) : (
            <div
              style={{ fontSize: 13, color: MUTE, marginTop: 6, display: "flex", alignItems: "center", gap: 6, cursor: isOwn ? "pointer" : "default", minHeight: 20 }}
              onClick={() => isOwn && setEditingDesc(true)}
            >
              {mix.description || (isOwn ? <span style={{ color: LINE }}>add a description...</span> : null)}
              {isOwn && <Pencil size={11} color={LINE} strokeWidth={1.8} />}
            </div>
          )}

          <div style={{ fontSize: 12, color: MUTE, marginTop: 6 }}>{mix.tracks.length} track{mix.tracks.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${LINE}` }}>
        {mix.tracks.map((t, i) => {
          const album = albumById(t.albumId);
          return (
            <div
              key={t.id}
              className="ui-sans"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: `1px solid ${LINE}` }}
            >
              <div style={{ width: 22, textAlign: "center", fontSize: 12.5, color: MUTE }}>{i + 1}</div>
              <div className="sb-cover-wrap" onClick={() => onOpenAlbum(t.albumId)}>
                <AlbumCover album={album} size={42} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.trackTitle}</div>
                <div style={{ fontSize: 11.5, color: MUTE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{album.artist} · {album.title}</div>
              </div>
              {isOwn && (
                <button
                  onClick={() => onRemoveTrack(t.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 4, flexShrink: 0 }}
                  title="Remove track"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
        {mix.tracks.length === 0 && (
          <div className="ui-sans" style={{ padding: "24px 4px", color: MUTE, fontSize: 13.5 }}>
            no tracks yet{isOwn ? " -- add your first one below." : "."}
          </div>
        )}
      </div>

      <MixTagEditor
        tags={mix.tags || []}
        isOwn={isOwn}
        onUpdateTags={onUpdateTags}
        onTagClick={onTagClick}
      />

      {isOwn && (
        <div style={{ marginTop: 18 }}>
          {!adding ? (
            <button className="sb-btn" onClick={startAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={13} /> add track
            </button>
          ) : !pickedAlbum ? (
            <AlbumSearchPicker onPick={setPickedAlbum} onCancel={() => setAdding(false)} />
          ) : (
            <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: 14 }} className="ui-sans">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <AlbumCover album={pickedAlbum} size={36} />
                <div>
                  <div style={{ fontSize: 12, color: MUTE }}>from</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{pickedAlbum.title} · {pickedAlbum.artist}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>track title</div>
              <input
                className="sb-input"
                style={{ width: "100%" }}
                placeholder="type the song title..."
                value={trackTitleInput}
                onChange={(e) => setTrackTitleInput(e.target.value)}
                autoFocus
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="sb-btn sb-btn-solid" onClick={confirmAddTrack} disabled={!trackTitleInput.trim()}>add to mix</button>
                <button className="sb-btn" onClick={() => setAdding(false)}>cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Avatar({ username, size = 30 }) {
  const { BLUE } = useTheme();
  const avatarCtx = React.useContext(AvatarContext);
  const initial = (username || "?").replace(/^[._]+/, "").charAt(0).toUpperCase();

  // Trigger a fetch if not cached yet
  React.useEffect(() => {
    if (username && avatarCtx.fetch) avatarCtx.fetch(username);
  }, [username]);

  const avatarUrl = username && avatarCtx.cache ? avatarCtx.cache[username] : null;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: BLUE, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.42, fontWeight: 600, flexShrink: 0,
      }}
      className="ui-sans"
    >
      {initial}
    </div>
  );
}

function ListenedByFriends({ albumId }) {
  const { BLUE, INK, MUTE } = useTheme();
  const entries = FRIENDS.flatMap((f) => f.reviews.filter((r) => r.albumId === albumId).map((r) => ({ username: f.username, rating: r.rating })));
  return (
    <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1.5px solid ${INK}` }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: MUTE, marginBottom: 14 }}>listened by</div>
      {entries.length === 0 ? (
        <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>none of the people you follow have logged this one yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((e) => (
            <div key={e.username} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar username={e.username} />
              <span className="ui-sans" style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>@{e.username}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: BLUE }}>{e.rating}/10</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCommunitySection({ albumId, albumTab, setAlbumTab, openAlbum, reviewComments = {}, onAddComment, onAddReply, currentUsername, reviewReactions = {}, onReact }) {
  const { BLUE, INK, LINE, MUTE } = useTheme();
  const mixes = COMMUNITY_ALBUM_MIXES.filter((l) => l.albumIds.includes(albumId));
  const reviews = COMMUNITY_REVIEWS.filter((r) => r.albumId === albumId).sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${LINE}` }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
        <div className={`sb-nav-item ${albumTab === "albumMixes" ? "active" : ""}`} onClick={() => setAlbumTab("albumMixes")}>album mixes</div>
        <div className={`sb-nav-item ${albumTab === "reviews" ? "active" : ""}`} onClick={() => setAlbumTab("reviews")}>recent reviews</div>
      </div>

      {albumTab === "albumMixes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mixes.length === 0 && <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>no public album mixes include this album yet.</div>}
          {mixes.map((l) => (
            <div key={l.id} className="ui-sans" style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{l.title}</div>
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>by @{l.owner} · {l.albumIds.length} albums</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {albumTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {reviews.length === 0 && <div className="ui-sans" style={{ fontSize: 13, color: MUTE }}>no community reviews yet.</div>}
          {reviews.map((r, i) => (
            <div key={i} style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "12px 14px", marginBottom: 6 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <Avatar username={r.username} />
                  <span className="ui-sans" style={{ fontSize: 14, fontWeight: 700, color: BLUE, letterSpacing: "-0.01em" }}>{r.rating}/10</span>
                </div>
                <div style={{ flex: 1 }} className="ui-sans">
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>@{r.username}</span>
                    <span style={{ fontSize: 11, color: MUTE }}>{r.date}</span>
                  </div>
                  <div style={{ fontSize: 13, color: INK, marginTop: 4, lineHeight: 1.6 }}>{r.text}</div>
                </div>
              </div>
              {r.id && onReact && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${LINE}` }}>
                  <ReactionBar
                    reactions={reviewReactions[r.id]}
                    onReact={(kind) => onReact(r.id, kind)}
                    currentUsername={currentUsername}
                  />
                  <ShareButton kind="review" album={albumById(albumId)} username={r.username} rating={r.rating} reviewText={r.text} />
                </div>
              )}
              {r.id && onAddComment && (
                <ReviewComments
                  reviewId={r.id}
                  comments={reviewComments[r.id] || []}
                  onAdd={onAddComment}
                  onReply={onAddReply}
                  currentUsername={currentUsername}
                  reviewOwnerUsername={r.username}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// TermsScreen is used in two contexts:
// - `inline=true`: rendered inside the main app (navigated to from footer)
// - `inline=false/undefined`: full-page, rendered from AuthScreen
function FollowListModal({ kind, userId, username, onClose, onVisitProfile }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    const endpoint = kind === "followers"
      ? `${BACKEND_URL}/api/follows/${userId}/followers`
      : `${BACKEND_URL}/api/follows/${userId}/following`;
    apiFetch(endpoint)
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [kind, userId]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: BG, border: `1.5px solid ${INK}`, borderRadius: 10, padding: 24, width: "100%", maxWidth: 380, maxHeight: "70vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="ui-sans" style={{ fontSize: 15, fontWeight: 600 }}>{kind}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, padding: 0 }}><X size={16} /></button>
        </div>
        {loading && <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>loading...</div>}
        {!loading && users.length === 0 && (
          <div className="ui-sans" style={{ color: MUTE, fontSize: 13 }}>
            {kind === "followers" ? "no followers yet." : "not following anyone yet."}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map((u) => (
            <div key={u.id} onClick={() => onVisitProfile(u.username)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <Avatar username={u.username} size={38} />
              <div className="ui-sans">
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.displayName || u.username}</div>
                <div style={{ fontSize: 12, color: MUTE }}>@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TermsScreen({ onBack, inline }) {
  const { BLUE, INK, LINE, MUTE, BG } = useTheme();
  const lastUpdated = "July 1, 2026";

  const content = (
    <div className="ui-sans" style={{ maxWidth: 680, margin: "0 auto", lineHeight: 1.75 }}>
      {onBack && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUTE, fontSize: 12.5, marginBottom: 28, cursor: "pointer" }} onClick={onBack}>
          <ChevronLeft size={14} /> back
        </div>
      )}

      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Terms of Service</div>
      <div style={{ fontSize: 12.5, color: MUTE, marginBottom: 28 }}>Last updated: {lastUpdated}</div>

      {[
        {
          title: "1. Acceptance of Terms",
          body: `By creating an account or using Spindex ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.`,
        },
        {
          title: "2. Eligibility",
          body: `You must be at least 13 years of age to use Spindex. By using the Service, you represent that you meet this requirement. If you are under 18, you represent that a parent or guardian has reviewed and agreed to these terms on your behalf.`,
        },
        {
          title: "3. User Accounts",
          body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms or that have been inactive for an extended period.`,
        },
        {
          title: "4. User Content",
          body: `You retain ownership of any reviews, comments, mixes, or other content you submit to Spindex ("User Content"). By submitting User Content, you grant Spindex a worldwide, non-exclusive, royalty-free, sublicensable license to use, reproduce, distribute, display, and create derivative works from your User Content in connection with operating and improving the Service. You represent that you have all rights necessary to grant this license.`,
        },
        {
          title: "5. Prohibited Conduct",
          body: `You agree not to: post content that is defamatory, harassing, obscene, or otherwise objectionable; impersonate any person or entity; use the Service to distribute spam or unsolicited communications; attempt to gain unauthorized access to any part of the Service; or use automated tools to scrape or interact with the Service without our written consent.`,
        },
        {
          title: "6. Data Collection and Privacy",
          body: `By using Spindex you agree to our collection and use of your data as described in our Privacy Policy. We collect information you provide (such as email address, username, and content you post), usage data, and device information. This data is used to operate, maintain, and improve the Service.`,
        },
        {
          title: "7. Data Use and Third-Party Disclosure",
          // ⚠️ FLAGGED FOR LEGAL REVIEW — this clause is intended to permit
          // data use in acquisition/sale scenarios. The specific language here
          // is a placeholder and should be reviewed by a qualified attorney
          // before the app is made public or any acquisition occurs.
          body: `We may share aggregated or de-identified data with third parties for research, analytics, or business purposes. In the event of a merger, acquisition, sale of assets, or other business transaction involving Spindex, your data — including personal information — may be transferred to the acquiring entity as part of that transaction. By using the Service, you consent to such transfer. The acquiring entity will be required to honor the privacy commitments made in this policy or notify you of material changes.`,
          flagged: true,
        },
        {
          title: "8. Intellectual Property",
          body: `The Spindex name, logo, and all associated software, design, and content created by Spindex are owned by Spindex and protected by applicable intellectual property laws. You may not use, copy, or distribute any Spindex intellectual property without our express written permission.`,
        },
        {
          title: "9. Disclaimers",
          body: `The Service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. To the fullest extent permitted by law, we disclaim all warranties, including implied warranties of merchantability and fitness for a particular purpose.`,
        },
        {
          title: "10. Limitation of Liability",
          body: `To the fullest extent permitted by law, Spindex shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if we have been advised of the possibility of such damages. Our total liability to you for any claims arising under these terms shall not exceed the amount you paid us in the twelve months preceding the claim.`,
        },
        {
          title: "11. Governing Law",
          body: `These terms are governed by the laws of the State of California, without regard to its conflict of law principles. Any disputes arising under these terms shall be resolved in the state or federal courts located in Los Angeles County, California.`,
        },
        {
          title: "12. Contact",
          body: `If you have questions about these terms, contact us at legal@spindex.app.`,
        },
      ].map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{section.title}</div>
          {section.flagged && (
            <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 6, padding: "8px 12px", marginBottom: 8, fontSize: 11.5, color: "#92400E" }}>
              ⚠️ <strong>Legal review recommended</strong> — this clause covers data transfer in acquisition scenarios and should be reviewed by a qualified attorney before the app is made public.
            </div>
          )}
          <div style={{ fontSize: 13.5, color: INK }}>{section.body}</div>
        </div>
      ))}
    </div>
  );

  if (inline) {
    return <div style={{ padding: "28px 0" }}>{content}</div>;
  }

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: BG, minHeight: "100vh", color: INK, padding: "40px 24px" }}>
      {content}
    </div>
  );
}

function AuthScreen({ backendUrl, onAuthed }) {
  const theme = useTheme();
  const { BLUE, INK, LINE, MUTE } = theme;
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (showTerms) {
    return <TermsScreen onBack={() => setShowTerms(false)} />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login" ? { email, password } : { email, password, username, displayName };

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      if (data.token) setToken(data.token);
      onAuthed(data.user);
    } catch (err) {
      // Most likely cause during local dev: the backend server isn't
      // running, or CORS is misconfigured -- give a specific hint rather
      // than a generic network error, since that's the actual common case.
      setError("Couldn't reach the server. Is it running? (npm run dev in the backend folder)");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        background: theme.BG,
        minHeight: "100vh",
        color: INK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <style>{`
        .ui-sans { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .sb-btn { font-family: inherit; border: 1.5px solid ${INK}; background: transparent; color: ${INK}; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; letter-spacing: 0.01em; transition: background 0.12s, color 0.12s, border-color 0.12s; }
        .sb-btn:hover { background: ${INK}; color: ${theme.BG}; }
        .sb-btn-solid { background: ${BLUE}; color: #fff; border-color: ${BLUE}; }
        .sb-btn-solid:hover { filter: brightness(0.85); }
        .sb-btn-solid:disabled { opacity: 0.5; cursor: default; }
        .sb-input { font-family: inherit; border: 1.5px solid ${LINE}; background: ${theme.BG}; padding: 9px 12px; font-size: 13px; outline: none; color: ${INK}; border-radius: 6px; width: 100%; }
        .sb-input:focus { border-color: ${BLUE}; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center", marginBottom: 28 }}>
          <img src={LOGO_DATA_URI} alt="Spindex" style={{ height: 40, width: "auto" }} />
        </div>

        <div style={{ display: "flex", border: `1.5px solid ${INK}`, borderRadius: 6, marginBottom: 22, overflow: "hidden" }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "9px 0",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              background: mode === "login" ? INK : "transparent",
              color: mode === "login" ? theme.BG : INK,
            }}
          >
            log in
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "9px 0",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              borderLeft: `1.5px solid ${INK}`,
              background: mode === "signup" ? INK : "transparent",
              color: mode === "signup" ? theme.BG : INK,
            }}
          >
            sign up
          </button>
        </div>

        <form onSubmit={submit} className="ui-sans" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <>
              <div>
                <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>display name</div>
                <input className="sb-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jess Harlow" required />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>username</div>
                <input className="sb-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="j.harlow" required />
              </div>
            </>
          )}
          <div>
            <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>email</div>
            <input className="sb-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <div style={{ fontSize: 11, color: MUTE, marginBottom: 5 }}>password</div>
            <input className="sb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "at least 8 characters" : "••••••••"} required minLength={mode === "signup" ? 8 : undefined} />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: "#A32D2D", background: "#FCEBEB", borderRadius: 6, padding: "8px 10px", lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <button type="submit" className="sb-btn sb-btn-solid" disabled={loading} style={{ marginTop: 4, padding: "10px 0" }}>
            {loading ? "..." : mode === "login" ? "log in" : "create account"}
          </button>

          {mode === "signup" && (
            <div style={{ fontSize: 11, color: MUTE, textAlign: "center", lineHeight: 1.6 }} className="ui-sans">
              by creating an account you agree to our{" "}
              <span style={{ color: BLUE, cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowTerms(true)}>
                terms of service
              </span>
            </div>
          )}
        </form>

        <div style={{ fontSize: 11.5, color: MUTE, textAlign: "center", marginTop: 18 }} className="ui-sans">
          {mode === "login" ? "new here? " : "already have an account? "}
          <span style={{ color: BLUE, cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "sign up" : "log in"}
          </span>
        </div>

        <div style={{ fontSize: 10.5, color: MUTE, textAlign: "center", marginTop: 24 }} className="ui-sans">
          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowTerms(true)}>terms of service</span>
          {" · "}
          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowTerms(true)}>privacy policy</span>
        </div>
      </div>
    </div>
  );
}
