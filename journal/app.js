/* Articulate — read, write, speak.
   A daily practice app for becoming a clearer communicator.
   Plain JavaScript, no build step. Everything is stored in this browser
   (localStorage); use Log → Export backup to keep a copy. */
(() => {
'use strict';

/* =========================================================
   Utilities
   ========================================================= */
const KEY = 'articulate.v1';
const THEME_KEY = 'articulate.theme';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const isoDate = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return isoDate(d); };
const fmtDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => new Date(iso + 'T12:00:00').toLocaleDateString(undefined, opts);
const plural = (n, w, p = w + 's') => `${n} ${n === 1 ? w : p}`;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wordCount = t => (String(t || '').match(/[A-Za-z0-9’']+/g) || []).length;
const view = $('#view');

/* =========================================================
   Icons (24px stroke icons)
   ========================================================= */
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  check: 'M20 6 9 17l-5-5',
  arrowR: 'M5 12h14M12 5l7 7-7 7',
  arrowL: 'M19 12H5M12 19l-7-7 7-7',
  x: 'M18 6 6 18M6 6l12 12',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z',
  brain: 'M12 5a3 3 0 0 0-5.9-.8A3 3 0 0 0 4 9.5a3 3 0 0 0 .5 5.4A3 3 0 0 0 8 19.5 3 3 0 0 0 12 19zM12 5a3 3 0 0 1 5.9-.8A3 3 0 0 1 20 9.5a3 3 0 0 1-.5 5.4A3 3 0 0 1 16 19.5 3 3 0 0 1 12 19zM12 5v14',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  down: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  up: 'M12 15V3M7 8l5-5 5 5M5 21h14',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  play: 'M7 4v16l13-8z',
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;

/* =========================================================
   Storage
   ========================================================= */
const blank = () => ({ v: 1, journal: [], reading: [], reviews: [], recallLog: [], speakSeconds: 0, drafts: {}, settings: {} });
let S = load();
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(blank(), JSON.parse(raw));
  } catch (e) { /* storage unavailable or corrupt: start fresh in memory */ }
  return blank();
}
let warnedStorage = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) {
    if (!warnedStorage) { warnedStorage = true; toast('This browser is not saving data. Export a backup from the Log tab.'); }
  }
}
let saveTimer = null;
const saveSoon = () => { clearTimeout(saveTimer); saveTimer = setTimeout(save, 350); };
window.addEventListener('pagehide', save);

/* =========================================================
   Teaching content
   ========================================================= */

// The 7-part Story Arc. One running example shows how the parts stack up.
const ARC = [
  { key: 'hook', name: 'Hook', tag: 'Open with the moment',
    focus: 'Start where the interest is. Drop the listener into the moment just before something changed — a line someone said, a surprise, a problem.',
    ask: ['What is the one moment from today worth telling?', 'What first line would make a friend lean in and ask “what happened?”'],
    avoid: 'Starting with the alarm clock. “Today I woke up and…” makes people tune out before the good part.',
    ex: 'I had about thirty seconds to come up with a toast, and every face at the table was turned towards me.' },
  { key: 'scene', name: 'Scene', tag: 'Who, where, when',
    focus: 'Give just enough for the listener to picture it: who was there, where you were, when it happened — plus one detail they could see, hear or smell.',
    ask: ['Where were you, and who was with you?', 'What one detail would help someone see it?'],
    avoid: 'Listing everything. Keep only details that matter to this story.',
    ex: 'It was Sam’s 30th at a small Italian place — twelve of us squeezed around two pushed-together tables, candles burning low.' },
  { key: 'stakes', name: 'Stakes', tag: 'What you wanted',
    focus: 'Say what you wanted, expected or were worried about — and why it mattered. Stakes are what make people care how it ends.',
    ask: ['What were you hoping for?', 'What could have gone wrong?'],
    avoid: 'Skipping this. Without stakes, events are just events.',
    ex: 'I’d known Sam for fifteen years, so everyone expected something good. I didn’t want to mumble “happy birthday” and sit straight back down.' },
  { key: 'build', name: 'Build-up', tag: 'But… so…',
    focus: 'Tell 2–3 beats that move the story forward. Link them with “but” or “so” instead of “and then” — each beat should cause or complicate the next.',
    ask: ['What did you try first?', 'What got in the way — and what did you do about it?'],
    avoid: '“And then… and then… and then.” That is a list, not a story.',
    ex: 'I stood up and opened with a joke, but it landed flat. So I dropped the jokes and tried to remember how we met — but my mind went completely blank.' },
  { key: 'turn', name: 'Turning point', tag: 'Slow down here',
    focus: 'The moment things changed: a decision, a surprise, a realisation. It is the most important part, so slow down — what did you see, think and feel right then?',
    ask: ['What was the exact moment it changed?', 'What went through your head?'],
    avoid: 'Rushing past it in one short line. This is where the detail belongs.',
    ex: 'Then I noticed the little scar on Sam’s chin, and it all came back: Year 7, a bike, a ramp built far too high, and me running two kilometres to get help.' },
  { key: 'outcome', name: 'Outcome', tag: 'How it ended',
    focus: 'Show how it ended — what actually happened and how people reacted. Concrete results beat summaries.',
    ask: ['What was the result?', 'How did you, or the people around you, react?'],
    avoid: '“It went well.” Show what “well” looked like.',
    ex: 'I told that story. The table went quiet, then Sam laughed so hard there were tears. Afterwards, three people asked how long I’d prepared it.' },
  { key: 'meaning', name: 'Meaning', tag: 'Why it matters',
    focus: 'Say what it taught you or what you will do differently. If you can, tie it back to your hook so the story feels complete.',
    ask: ['What did you learn?', 'What will you do differently next time?'],
    avoid: 'A vague moral like “everything happens for a reason”. Make it specific and useful.',
    ex: 'I didn’t need a clever speech — I needed one true, specific story. Next time I’m put on the spot, I’ll reach for a moment, not a joke.' },
];

const FRAMEWORKS = {
  process: {
    name: 'Explain a process', short: 'Process', sub: 'The Signpost method — for explaining how something works or how you did it.',
    parts: [
      { name: 'Point', tag: 'What and why, in one line', focus: 'Say what it is and why it is useful before any detail.', ex: 'Planning my week on Sunday night saves me about five hours of scrambling.' },
      { name: 'Map', tag: 'Tell them the shape', focus: 'Say how many parts are coming. Listeners relax when they know the shape.', ex: 'It takes three steps and about fifteen minutes.' },
      { name: 'Steps', tag: 'First… next… finally…', focus: 'One action per step, in order. Use signpost words, and say why each step matters.', ex: 'First, I dump every task onto one list. Next, I circle the three that would make the week a win. Finally, I block time for those three before anything else.' },
      { name: 'Example', tag: 'Show it working once', focus: 'One real example with real details makes the steps believable.', ex: 'Last week that meant blocking Tuesday morning for quotes — and I sent eleven, my best week yet.' },
      { name: 'Recap', tag: 'Say it again, shorter', focus: 'Repeat the steps in one line so they stick.', ex: 'So: dump, circle, block. Fifteen minutes on Sunday, and the week runs itself.' },
    ],
  },
  describe: {
    name: 'Describe a place or event', short: 'Describe', sub: 'The Zoom Lens — move from the wide shot to one sharp detail, then to the feeling.',
    parts: [
      { name: 'Wide shot', tag: 'Where and when', focus: 'Set the overall picture in one sentence.', ex: 'The beach was almost empty at 6 a.m., the sky still pink.' },
      { name: 'Mid shot', tag: 'People and action', focus: 'Who is there and what are they doing?', ex: 'A man was walking his dog along the waterline, throwing a stick into the waves.' },
      { name: 'Close-up', tag: 'One specific detail', focus: 'Pick one small, specific thing. Specific details make scenes real.', ex: 'The dog came back every time with the stick held sideways, far too wide to carry straight.' },
      { name: 'Senses', tag: 'Sound, smell, touch', focus: 'Add one or two senses other than sight.', ex: 'The sand was cold, and all I could hear was the waves and the jingle of the dog’s tags.' },
      { name: 'Feeling', tag: 'Show, don’t tell', focus: 'Show the feeling through what you did, instead of naming it.', ex: 'I stood there for ten minutes with my coffee going cold, not thinking about work once.' },
    ],
  },
  opinion: {
    name: 'Make your point', short: 'Opinion', sub: 'PREP — for giving an opinion or answering a question on the spot.',
    parts: [
      { name: 'Point', tag: 'Say it straight', focus: 'Lead with your answer. No warm-up.', ex: 'Reading before bed beats scrolling.' },
      { name: 'Reason', tag: 'Because…', focus: 'Give the single strongest reason.', ex: 'A book has an ending; a feed never does.' },
      { name: 'Example', tag: 'For instance…', focus: 'Prove it with something real.', ex: 'On nights I read, I’m asleep by eleven. On nights I scroll, it’s one a.m. before I notice.' },
      { name: 'Point', tag: 'So…', focus: 'Repeat your point, now with the weight of the example behind it.', ex: 'So the book wins — it’s the only one that lets me stop.' },
    ],
  },
};

// Sentence Gym techniques. Examples are generic on purpose — the app never rewrites your sentences for you.
const TECHNIQUES = [
  { key: 'verb', name: 'Stronger verb', how: 'Swap a weak verb + “really/very” for one precise verb.', before: 'Jake really loves Jessica.', after: 'Jake adores Jessica.' },
  { key: 'show', name: 'Show, don’t tell', how: 'Instead of naming the feeling, show something that proves it.', before: 'Jake really loves Jessica.', after: 'Jake still keeps the ticket from their first movie in his wallet.' },
  { key: 'detail', name: 'Add a specific detail', how: 'Replace a general word with a number, a name or a concrete thing.', before: 'The meeting was long.', after: 'The meeting ran three hours, and we argued about one slide for forty minutes.' },
  { key: 'feeling', name: 'Name the feeling exactly', how: 'Find the precise emotion, not just “good” or “bad”.', before: 'I was sad.', after: 'I felt let down — not angry, just tired of hoping.' },
  { key: 'cut', name: 'Cut the filler', how: 'Delete words that add nothing: just, really, basically, kind of, actually.', before: 'I just really kind of wanted to basically leave.', after: 'I wanted to leave.' },
  { key: 'rhythm', name: 'Vary the rhythm', how: 'Mix a short sentence with a longer one. Short sentences hit; long ones carry.', before: 'It rained. I waited. The bus was late. I was cold.', after: 'It rained. I waited forty minutes, watching every set of headlights, until the bus finally crawled round the corner.' },
  { key: 'compare', name: 'Use a comparison', how: 'Compare it to something the listener already knows.', before: 'He was nervous.', after: 'He held the microphone like it might bite him.' },
  { key: 'lead', name: 'Lead with the interesting part', how: 'Move the most surprising part to the front of the sentence.', before: 'I went to the shop and on the way I saw a car upside down.', after: 'A car was lying upside down on the road to the shop.' },
];

const DIMENSIONS = [
  { key: 'clarity', name: 'Clarity', desc: 'Could a stranger follow it on the first read?', low: 'hard to follow', high: 'crystal clear' },
  { key: 'structure', name: 'Structure', desc: 'Is there a clear start, build-up, turn and ending?', low: 'jumps around', high: 'flows in order' },
  { key: 'detail', name: 'Detail', desc: 'Specific names, numbers and senses — not “stuff” and “things”.', low: 'vague', high: 'vivid' },
  { key: 'words', name: 'Word choice', desc: 'Precise words and strong verbs, little filler.', low: 'filler-heavy', high: 'precise' },
  { key: 'flow', name: 'Flow', desc: 'Sentences vary in length and link with but / so / because.', low: 'choppy', high: 'smooth' },
];

const MOODS = [
  { v: 1, e: '😞', l: 'Rough' }, { v: 2, e: '😕', l: 'Meh' }, { v: 3, e: '😐', l: 'Okay' }, { v: 4, e: '🙂', l: 'Good' }, { v: 5, e: '😄', l: 'Great' },
];

const FILLERS = ['really', 'very', 'just', 'basically', 'literally', 'actually', 'kind of', 'sort of', 'like', 'stuff', 'things', 'pretty', 'totally', 'a lot'];
const VAGUE = ['good', 'nice', 'bad', 'great', 'amazing', 'fine', 'okay', 'awesome', 'interesting'];

/* =========================================================
   Wizard step definitions
   ========================================================= */
const J_STEPS = {
  checkin: { kind: 'checkin', eyebrow: 'Check-in', title: 'How was your day?',
    focus: 'Give your day a headline — one sentence that captures it. Not “it was good”: what made it good?',
    ask: ['If today were a news story, what would the headline be?'],
    ex: 'A slow start, but one phone call turned the whole week around.',
    avoid: '“It was fine.” A headline names the thing that made the day what it was.' },
  day: { kind: 'text', field: 'day', eyebrow: 'Your day', title: 'Walk me through your day',
    focus: 'Tell your day in 3–5 sentences, in order. Use signposts so it is easy to follow: “It started with… Then… The best part was… By the evening…”',
    ask: ['What were the 2–3 moments that actually mattered?', 'How did the day end?'],
    ex: 'It started badly — I overslept and missed the gym. Then a client called to move their job forward, so I spent the morning rearranging everything. The best part was finishing early and getting a walk in before dark.',
    avoid: 'Listing every hour. Pick the moments that mattered.', ph: 'It started with… Then… The best part was… By the evening…' },
  good: { kind: 'pair' },
  lesson: { kind: 'text', field: 'lesson', eyebrow: 'Lesson', title: 'What did today teach you?',
    focus: 'One lesson, stated clearly, plus what you will do differently because of it.',
    ask: ['What would you tell yourself this morning, knowing what you know now?'],
    ex: 'Saying no to the extra job felt bad in the moment, but it gave me the evening back. Next time, I’ll decide before I answer the phone.',
    avoid: 'Vague lessons like “be more positive”. Make it something you could actually do tomorrow.', short: true },
  tomorrow: { kind: 'text', field: 'tomorrow', eyebrow: 'Tomorrow', title: 'What are you looking forward to tomorrow?',
    focus: 'Name one thing you are looking forward to and one focus. Make it concrete: what, when, and the very first step.',
    ask: ['What would make tomorrow a win?', 'What is the first small step?'],
    ex: 'I’m looking forward to dinner with Mum. My focus is finishing chapter 4 before lunch — first step: phone in the other room at 9.',
    avoid: '“Be productive.” A focus you can’t picture is a focus you won’t do.', short: true },
  gym: { kind: 'gym', eyebrow: 'Sentence Gym', title: 'Upgrade one sentence' },
  speak: { kind: 'speak', eyebrow: 'Say it out loud', title: 'Tell it in 60 seconds',
    prompt: 'Without looking at your screen, tell today’s story out loud. Start with your hook, end with what it meant.' },
  score: { kind: 'score', eyebrow: 'Self-check', title: 'How did you do?' },
};
ARC.forEach((a, n) => {
  J_STEPS[a.key] = { kind: 'text', field: a.key, arc: n, eyebrow: `Story · part ${n + 1} of 7`, title: `${a.name}: ${a.tag.toLowerCase()}`,
    focus: a.focus, ask: a.ask, ex: a.ex, avoid: a.avoid, short: a.key !== 'build' && a.key !== 'turn' };
});

const J_MODES = {
  full: { name: 'Full story', time: '~20 min', steps: ['checkin', ...ARC.map(a => a.key), 'good', 'tomorrow', 'gym', 'speak', 'score'],
    desc: 'Pick one moment from today and tell it with the 7-part Story Arc. This is the deep practice.' },
  quick: { name: 'Quick', time: '~8 min', steps: ['checkin', 'day', 'good', 'lesson', 'tomorrow', 'gym', 'score'],
    desc: 'Day, good, hard, lesson, tomorrow — plus one sentence upgrade. For busy days; still keeps your streak.' },
};

const R_STEPS = {
  book: { kind: 'book', eyebrow: 'Set up', title: 'What are you reading?' },
  reading: { kind: 'reading', eyebrow: 'Read', title: 'Read the chapter' },
  recall: { kind: 'text', field: 'summary', eyebrow: 'Recall', title: 'Summarise it — without looking',
    focus: 'Close the book. In three sentences: what happened (or the main idea), why it matters, and what changes or comes next.',
    ask: ['What was the chapter really about?', 'If you only remembered one thing, what would it be?'],
    ex: 'The chapter argues that habits are built by making the first step tiny. It matters because most people quit when the goal feels heavy. Next, the author shows how to stack a new habit onto an old one.',
    avoid: 'Opening the book to check. The struggle to remember is what makes it stick.' },
  explain: { kind: 'text', field: 'explain', eyebrow: 'Explain it simply', title: 'Explain it to a 12-year-old',
    focus: 'Use short, everyday words and one example. If you get stuck, you have found the part you don’t fully understand yet — reread just that bit.',
    ask: ['How would you explain this to a kid who has never heard of it?', 'What everyday example shows the idea?'],
    ex: 'If you want to start running, don’t try to run 5 km on day one. Just put your shoes on every morning. Once that’s easy, walk to the corner. Small wins make you want to keep going.',
    avoid: 'Copying the book’s words. Use your own.' },
  collect: { kind: 'collect', eyebrow: 'Collect', title: 'Steal like a writer' },
  quiz: { kind: 'quiz', eyebrow: 'Test yourself', title: 'Write two questions for future you' },
  speak: { kind: 'speak', eyebrow: 'Say it out loud', title: 'Retell it in 60 seconds',
    prompt: 'Retell the chapter out loud as if you were telling a friend over coffee. Main idea first, then your favourite part.' },
};
const R_ORDER = ['book', 'reading', 'recall', 'explain', 'collect', 'quiz', 'speak'];

const LABELS = {
  headline: 'Headline', day: 'My day', hook: 'Hook', scene: 'Scene', stakes: 'Stakes', build: 'Build-up', turn: 'Turning point',
  outcome: 'Outcome', meaning: 'Meaning', good: 'Something good', hard: 'Something hard', lesson: 'Lesson', tomorrow: 'Tomorrow',
  summary: 'Summary', explain: 'Explained simply', word: 'New word', wordMeaning: 'Meaning', wordSentence: 'My sentence with it',
  line: 'A line I loved', lineWhy: 'Why it works',
};
const J_TEXT_FIELDS = ['headline', 'day', ...ARC.map(a => a.key), 'good', 'hard', 'lesson', 'tomorrow'];

/* =========================================================
   Derived stats
   ========================================================= */
function journalDates() { return new Set(S.journal.map(e => e.date)); }
function readingDates() { return new Set(S.reading.map(e => e.date)); }
function streak() {
  const set = journalDates();
  let d = isoDate();
  if (!set.has(d)) d = addDays(d, -1); // today not done yet: the streak is still alive
  let n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
function bestStreak() {
  const dates = [...journalDates()].sort();
  let best = 0, run = 0, prev = null;
  for (const d of dates) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
  return best;
}
function practiceMinutes() {
  const j = S.journal.reduce((a, e) => a + (e.minutes || 0), 0);
  const r = S.reading.reduce((a, e) => a + (e.minutes || 0), 0);
  const rc = S.recallLog.reduce((a, e) => a + (e.minutes || 0), 0);
  return j + r + rc + (S.speakSeconds || 0) / 60;
}
function entryText(e) { return J_TEXT_FIELDS.map(f => e.fields?.[f]).filter(Boolean).join('\n') + (e.gym?.rewrite ? '\n' + e.gym.rewrite : ''); }
function wordsThisWeek() {
  const from = addDays(isoDate(), -6);
  return S.journal.filter(e => e.date >= from).reduce((a, e) => a + wordCount(entryText(e)), 0)
    + S.reading.filter(e => e.date >= from).reduce((a, e) => a + wordCount(Object.values(e.fields || {}).join(' ')), 0);
}
function lastReview() { return S.reviews.length ? S.reviews[S.reviews.length - 1] : null; }
function currentFocus() { const r = [...S.reviews].reverse().find(r => r.focus); return r ? r.focus : null; }
function entriesSinceReview() {
  const r = lastReview();
  return r ? S.journal.filter(e => e.createdAt > r.createdAt).length : S.journal.length;
}
function dueQuestions() {
  const today = isoDate(), out = [];
  for (const r of S.reading) for (const q of r.questions || []) if (q.due <= today) out.push({ r, q });
  return out.sort((a, b) => a.q.due.localeCompare(b.q.due));
}

function analyse(text) {
  text = String(text || '');
  const words = wordCount(text);
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => wordCount(s) >= 2);
  const lower = ' ' + text.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z'\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const count = w => (lower.match(new RegExp(`\\s${w.replace(/ /g, '\\s')}(?=\\s)`, 'g')) || []).length;
  const fillers = FILLERS.map(w => [w, count(w)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  const vague = VAGUE.map(w => [w, count(w)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  const andThen = count('and then');
  const lens = sentences.map(wordCount);
  const avg = lens.length ? Math.round(words / lens.length) : 0;
  const longest = lens.length ? Math.max(...lens) : 0;
  const fillerTotal = fillers.reduce((a, x) => a + x[1], 0);
  const vagueTotal = vague.reduce((a, x) => a + x[1], 0);
  const hints = [];
  if (words < 40) hints.push('Short entry today. Pick one part and add the detail only you would know — a name, a number, a sound.');
  if (andThen) hints.push(`“and then” appears ${plural(andThen, 'time')}. Can one of them become “but” or “so”?`);
  if (fillerTotal >= 3) hints.push(`Filler words showed up ${plural(fillerTotal, 'time')} (${fillers.slice(0, 3).map(x => '“' + x[0] + '”').join(', ')}). Delete one — does the sentence get stronger?`);
  if (vagueTotal >= 2) hints.push(`Words like ${vague.slice(0, 3).map(x => '“' + x[0] + '”').join(', ')} tell the reader little. Choose one and show what you actually mean.`);
  if (avg > 24) hints.push(`Your sentences average ${avg} words. Find your longest one and split it in two.`);
  if (sentences.length >= 5 && avg && avg < 9) hints.push(`Your sentences average ${avg} words — quite choppy. Try joining two with “but”, “so” or “because”.`);
  if (longest > 40) hints.push(`One sentence runs ${longest} words. Read it out loud — where do you run out of breath?`);
  if (!hints.length && words) hints.push('Clean entry. Read it out loud once — anywhere you stumble is a sentence to tighten.');
  return { words, sentences, avg, longest, fillers, vague, andThen, fillerTotal, vagueTotal, hints };
}

/* =========================================================
   Router
   ========================================================= */
let cleanups = [];
const onCleanup = fn => cleanups.push(fn);
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, q] = h.split('?');
  const parts = path.split('/');
  return { name: parts[0] || '', arg: parts[1], query: new URLSearchParams(q || '') };
}
const ROUTES = {
  '': renderHome, journal: renderJournalStart, write: () => renderWizard('journal'), read: renderReadStart, reading: () => renderWizard('reading'),
  recall: renderRecall, toolkit: renderToolkit, log: renderLog, review: renderReview, done: renderDone,
};
const FOCUS_ROUTES = ['write', 'reading', 'recall'];
function router() {
  cleanups.forEach(fn => { try { fn(); } catch (e) {} });
  cleanups = [];
  const r = parseHash();
  const fn = ROUTES[r.name] || renderHome;
  document.body.classList.toggle('focus-mode', FOCUS_ROUTES.includes(r.name));
  $$('.tabbar a').forEach(a => {
    const tab = a.dataset.tab;
    const active = tab === r.name || (tab === '' && ['journal', 'read', 'done'].includes(r.name));
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  fn(r);
  window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}
window.addEventListener('hashchange', router);
const go = h => { if (location.hash === h) router(); else location.hash = h; };

function mount(html) {
  view.innerHTML = `<div class="page">${html}</div>`;
  $$('.stagger', view).forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));
}

/* =========================================================
   Home
   ========================================================= */
function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
function renderHome() {
  const today = isoDate();
  const st = streak();
  const jSet = journalDates(), rSet = readingDates();
  const jToday = S.journal.filter(e => e.date === today);
  const rToday = S.reading.filter(e => e.date === today);
  const due = dueQuestions();
  const mins = practiceMinutes();
  const hours = mins / 60;
  const pct = Math.min(1, hours / 20);
  const C = 2 * Math.PI * 40;
  const focus = currentFocus();
  const since = entriesSinceReview();
  const dJ = S.drafts.journal, dR = S.drafts.reading;

  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const cls = [jSet.has(d) ? 'j' : '', rSet.has(d) ? 'r' : '', d === today ? 'today' : ''].join(' ');
    week.push(`<div class="day ${cls}" style="--i:${6 - i}"><i>${jSet.has(d) ? icon('check') : ''}</i>${fmtDate(d, { weekday: 'narrow' })}</div>`);
  }

  const readSub = rToday.length ? `Done · ${esc(rToday[rToday.length - 1].book)}${rToday[rToday.length - 1].chapter ? ', ch. ' + esc(rToday[rToday.length - 1].chapter) : ''}`
    : dR ? 'Continue your reading session' : 'Timer → recall → explain it simply';
  const writeSub = jToday.length ? `Done · ${plural(wordCount(entryText(jToday[jToday.length - 1])), 'word')}` : dJ ? `Continue — step ${dJ.i + 1} of ${J_MODES[dJ.mode].steps.length}` : 'Tell one moment with the Story Arc';

  mount(`
    <div class="hello stagger">
      <p class="date">${fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1>${greeting()}. <span class="grad-text">${st ? 'Keep the fire going.' : 'Let’s start today.'}</span></h1>
    </div>

    <div class="stagger">
      <div class="card hero">
        <div class="streak">
          <div class="flame ${st ? '' : 'cold'}">${icon('flame')}</div>
          <div><div class="streak-num">${st}</div><div class="streak-label">day streak · best ${bestStreak()}</div></div>
        </div>
        <div class="ring" title="${hours.toFixed(1)} of 20 practice hours">
          <svg viewBox="0 0 96 96"><circle class="track" cx="48" cy="48" r="40"/><circle class="val" cx="48" cy="48" r="40" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-target="${C * (1 - pct)}"/></svg>
          <div class="ring-label"><div><b>${hours < 10 ? hours.toFixed(1) : Math.round(hours)}</b><small>of 20 hrs</small></div></div>
        </div>
        <div class="week">${week.join('')}</div>
      </div>
    </div>

    ${since >= 7 ? `<div class="stagger" style="margin-top:12px"><a class="card banner" href="#/review">${icon('send')}<div><h3>Review time — ${plural(since, 'entry', 'entries')} since your last check</h3><p>Send them for a score and pick next week’s focus.</p></div></a></div>` : ''}

    <h2 class="section-title">Today’s path</h2>
    <div class="path stagger">
      <a class="card path-item ${rToday.length ? 'done' : ''}" href="#/read">
        <div class="path-icon">${icon('book')}</div>
        <div><div class="path-step">Step 1 · Read</div><h3>Read one chapter</h3><p>${readSub}</p></div>
        <div class="go">${icon(rToday.length ? 'check' : 'arrowR')}</div>
      </a>
      <a class="card path-item ${jToday.length ? 'done' : ''}" href="#/journal">
        <div class="path-icon coral">${icon('pen')}</div>
        <div><div class="path-step">Step 2 · Write &amp; speak</div><h3>Journal</h3><p>${writeSub}</p></div>
        <div class="go">${icon(jToday.length ? 'check' : 'arrowR')}</div>
      </a>
      <a class="card path-item ${due.length ? '' : 'idle'}" href="#/recall">
        <div class="path-icon mint">${icon('brain')}</div>
        <div><div class="path-step">Step 3 · Remember</div><h3>Recall test</h3><p>${due.length ? `${plural(due.length, 'question')} waiting from past chapters` : 'Nothing due — your reading questions come back after 2 days'}</p></div>
        <div class="go">${icon('arrowR')}</div>
      </a>
    </div>

    ${focus ? `<h2 class="section-title">This week’s focus</h2><div class="stagger"><div class="card focus-card"><p class="label">${icon('target')} Practise this in every entry</p><p style="margin-top:6px;font-size:17px">${esc(focus)}</p></div></div>` : ''}

    <h2 class="section-title">Your numbers</h2>
    <div class="stats stagger">
      <div class="stat"><b data-count="${S.journal.length}">0</b><span>entries</span></div>
      <div class="stat"><b data-count="${wordsThisWeek()}">0</b><span>words this week</span></div>
      <div class="stat"><b data-count="${S.reading.length}">0</b><span>chapters read</span></div>
    </div>

    <p class="footer-note">20 hours of focused practice ≈ 30 days at 40 minutes. That’s the challenge.</p>
  `);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const ring = $('.ring .val', view);
    if (ring) ring.style.strokeDashoffset = ring.dataset.target;
    countUp($$('[data-count]', view));
  }));
}
function countUp(els) {
  els.forEach(el => {
    const target = +el.dataset.count;
    if (reduceMotion() || target === 0) { el.textContent = target.toLocaleString(); return; }
    const t0 = performance.now(), dur = 900;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* =========================================================
   Start screens
   ========================================================= */
function renderJournalStart() {
  const d = S.drafts.journal;
  const doneToday = S.journal.some(e => e.date === isoDate());
  const modeCard = key => {
    const m = J_MODES[key];
    return `<button class="card choice" data-mode="${key}">
      <h2>${m.name}</h2><p class="lede" style="margin-top:6px">${m.desc}</p>
      <div class="meta"><span class="pill accent">${plural(m.steps.length, 'step')}</span><span class="pill">${m.time}</span></div>
      <div class="steps-preview">${m.steps.map(s => `<span>${esc(stepShortName(J_STEPS[s]))}</span>`).join('')}</div>
    </button>`;
  };
  mount(`
    <div class="hello stagger"><p class="date">Step 2 · Write &amp; speak</p><h1>Today’s <span class="grad-text">journal</span></h1>
      <p class="lede" style="margin-top:8px">${doneToday ? 'You’ve already journalled today — another entry is extra practice.' : 'One screen at a time. Each step tells you what to focus on, with an example if you get stuck.'}</p></div>
    ${d ? `<div class="stagger"><div class="card focus-card"><p class="label">In progress</p><h3 style="margin:6px 0 2px">${J_MODES[d.mode].name} — step ${d.i + 1} of ${J_MODES[d.mode].steps.length}</h3><p class="lede">Started ${fmtDate(d.date)}</p>
      <div class="btn-row"><a class="btn primary" href="#/write">Continue ${icon('arrowR')}</a><button class="btn ghost" id="discard">Start over</button></div></div></div>` : ''}
    <h2 class="section-title">${d ? 'Or start fresh' : 'Choose your session'}</h2>
    <div class="stagger" style="display:grid;gap:12px">${modeCard('full')}${modeCard('quick')}</div>
  `);
  $$('[data-mode]', view).forEach(b => b.onclick = () => {
    if (S.drafts.journal && !confirm('Start over? Your unfinished entry will be cleared.')) return;
    S.drafts.journal = { mode: b.dataset.mode, i: 0, data: {}, date: isoDate(), activeMs: 0 };
    save(); go('#/write');
  });
  const disc = $('#discard', view);
  if (disc) disc.onclick = () => { if (confirm('Clear your unfinished entry?')) { delete S.drafts.journal; save(); router(); } };
}
function stepShortName(def) {
  if (def.arc !== undefined) return ARC[def.arc].name;
  return { checkin: 'Check-in', pair: 'Good & hard', gym: 'Sentence gym', speak: 'Speak', score: 'Self-check' }[def.kind] || def.eyebrow;
}

function renderReadStart() {
  const d = S.drafts.reading;
  if (d) { go('#/reading'); return; }
  S.drafts.reading = { i: 0, data: { book: S.settings.lastBook || '', author: S.settings.lastAuthor || '', chapter: nextChapter() }, date: isoDate(), activeMs: 0, readMs: 0 };
  save(); go('#/reading');
}
function nextChapter() {
  const last = [...S.reading].reverse().find(r => r.book === S.settings.lastBook);
  const n = last && parseInt(last.chapter, 10);
  return Number.isFinite(n) ? String(n + 1) : '';
}

/* =========================================================
   Wizard engine
   ========================================================= */
let lastInput = Date.now();
['input', 'pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { lastInput = Date.now(); }, true));
let lastPct = 0;

function wizardConfig(type) {
  const d = S.drafts[type];
  if (type === 'journal') return { d, ids: J_MODES[d.mode].steps, defs: J_STEPS, exit: '#/journal', label: `${J_MODES[d.mode].name} journal` };
  return { d, ids: R_ORDER, defs: R_STEPS, exit: '#/', label: 'Reading session' };
}

function renderWizard(type) {
  if (!S.drafts[type]) { go(type === 'journal' ? '#/journal' : '#/'); return; }
  // Count active practice time: only while visible and touched in the last 3 minutes.
  const t = setInterval(() => {
    const d = S.drafts[type];
    if (d && document.visibilityState === 'visible' && Date.now() - lastInput < 180000) { d.activeMs = (d.activeMs || 0) + 5000; saveSoon(); }
  }, 5000);
  onCleanup(() => clearInterval(t));
  lastPct = 0;
  drawStep(type, 'fade');
}

let stepCleanup = null;
function drawStep(type, dir) {
  if (stepCleanup) { stepCleanup(); stepCleanup = null; }
  const { d, ids, defs, exit, label } = wizardConfig(type);
  d.i = Math.max(0, Math.min(d.i, ids.length - 1));
  const def = defs[ids[d.i]];
  const kind = KINDS[def.kind];
  const last = d.i === ids.length - 1;
  const pct = ((d.i + 1) / ids.length) * 100;

  view.innerHTML = `<div class="wizard">
    <div class="wiz-top">
      <a class="icon-btn" href="${exit}" aria-label="Save and exit">${icon('x')}</a>
      <div class="wiz-progress">
        <div class="wiz-meta"><span>${esc(label)}</span><span>${d.i + 1} / ${ids.length}</span></div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${ids.length}" aria-valuenow="${d.i + 1}"><span style="width:${lastPct}%"></span></div>
      </div>
    </div>
    <section class="step in-${dir}">${kind.html(def, d, type)}</section>
    <div class="wiz-nav">
      <button class="btn ghost" data-act="back" ${d.i === 0 ? 'disabled' : ''} aria-label="Back">${icon('arrowL')}</button>
      <button class="btn primary" data-act="next">${last ? 'Finish' : 'Next'} ${icon(last ? 'check' : 'arrowR')}</button>
    </div>
  </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { const b = $('.bar span', view); if (b) b.style.width = pct + '%'; lastPct = pct; }));

  // Generic text binding
  $$('[data-field]', view).forEach(el => {
    const f = el.dataset.field;
    const wc = $(`[data-wc-for="${f}"]`, view);
    const upd = () => {
      d.data[f] = el.value; saveSoon();
      if (el.tagName === 'TEXTAREA') autosize(el);
      if (wc) { const n = wordCount(el.value); wc.textContent = n ? plural(n, 'word') : ''; wc.classList.toggle('good', n >= 25); }
    };
    el.addEventListener('input', upd);
    if (el.tagName === 'TEXTAREA') autosize(el);
    if (wc) { const n = wordCount(el.value); wc.textContent = n ? plural(n, 'word') : ''; wc.classList.toggle('good', n >= 25); }
  });
  stepCleanup = kind.bind ? kind.bind(def, d, type) : null;

  $('[data-act="back"]', view).onclick = () => { d.i--; save(); drawStep(type, 'back'); window.scrollTo(0, 0); };
  $('[data-act="next"]', view).onclick = () => {
    if (last) { if (stepCleanup) { stepCleanup(); stepCleanup = null; } finish(type); return; }
    d.i++; save(); drawStep(type, 'next'); window.scrollTo(0, 0);
  };
  onCleanup(() => { if (stepCleanup) { stepCleanup(); stepCleanup = null; } save(); });
}

function autosize(el) { el.style.height = 'auto'; el.style.height = Math.max(el.scrollHeight + 2, 0) + 'px'; }

function guide(def) {
  return `<div class="guide">
    <div class="guide-row"><span class="g-label">Focus on</span><p>${esc(def.focus)}</p></div>
    ${def.ask ? `<div class="guide-row"><span class="g-label">Ask yourself</span><ul>${def.ask.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
    ${def.ex ? `<details class="g-more"><summary>See an example</summary><blockquote>${esc(def.ex)}</blockquote>${def.avoid ? `<p class="avoid"><b>Avoid:</b> ${esc(def.avoid)}</p>` : ''}</details>` : ''}
  </div>`;
}
function focusReminder() {
  const f = currentFocus();
  return f ? `<div class="reminder">${icon('target')}<span><b>Your focus:</b> ${esc(f)}</span></div>` : '';
}
function textarea(field, d, ph, short) {
  return `<label class="field"><span class="sr-only">${esc(LABELS[field] || field)}</span><textarea class="${short ? 'short' : ''}" data-field="${field}" placeholder="${esc(ph || 'Write here…')}">${esc(d.data[field] || '')}</textarea><span class="wc" data-wc-for="${field}"></span></label>`;
}

const KINDS = {
  text: {
    html(def, d) {
      let sofar = '';
      if (def.arc !== undefined && def.arc > 0) {
        const prev = ARC.slice(0, def.arc).filter(a => d.data[a.key]);
        if (prev.length) sofar = `<details class="sofar"><summary>Your story so far</summary>${prev.map(a => `<p><b>${a.name}</b>${esc(d.data[a.key])}</p>`).join('')}</details>`;
      }
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>${guide(def)}${sofar}${focusReminder()}${textarea(def.field, d, def.ph, def.short)}`;
    },
  },

  checkin: {
    html(def, d) {
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <div class="moods" role="group" aria-label="Mood">${MOODS.map(m => `<button type="button" class="mood" data-mood="${m.v}" aria-pressed="${d.data.mood === m.v}"><span>${m.e}</span>${m.l}</button>`).join('')}</div>
        <span class="field-label">Today’s headline</span>${guide(def)}${textarea('headline', d, 'One sentence that captures today…', true)}`;
    },
    bind(def, d) {
      $$('[data-mood]', view).forEach(b => b.onclick = () => {
        d.data.mood = +b.dataset.mood; saveSoon();
        $$('[data-mood]', view).forEach(x => x.setAttribute('aria-pressed', x === b));
      });
    },
  },

  pair: {
    html(def, d) {
      return `<p class="eyebrow">Good &amp; hard</p><h1 class="step-title">The best and the hardest part</h1>
        <div class="guide"><div class="guide-row"><span class="g-label">Focus on</span><p>For each one, say <b>what</b> happened and <b>why it mattered</b>. The “why” is where your thinking gets sharper.</p></div>
        <details class="g-more"><summary>See an example</summary><blockquote>Good: My neighbour waved me over to show me the garden she’d finally finished — it mattered because we hadn’t spoken properly in months.</blockquote><blockquote>Hard: I snapped at my brother over something small. It wasn’t about him — I was tired and hadn’t eaten since breakfast.</blockquote></details></div>
        <span class="field-label">Something good that happened</span><span class="field-hint">What happened, and why did it matter?</span>${textarea('good', d, 'Something good was…', true)}
        <span class="field-label">Something hard or bad</span><span class="field-hint">What happened, and how did you handle it?</span>${textarea('hard', d, 'Something hard was…', true)}`;
    },
  },

  gym: {
    html(def, d) {
      const g = d.data.gym || {};
      const sentences = [];
      J_TEXT_FIELDS.forEach(f => String(d.data[f] || '').split(/(?<=[.!?])\s+|\n+/).forEach(s => { s = s.trim(); if (wordCount(s) >= 4 && wordCount(s) <= 40) sentences.push(s); }));
      const list = [...new Set(sentences)].slice(0, 12);
      const t = TECHNIQUES.find(x => x.key === g.tech);
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <p class="step-sub">Pick your flattest sentence from today, choose one technique, and rewrite it yourself. One sentence, done well, every day.</p>
        ${focusReminder()}
        <span class="field-label">1 · Pick a sentence</span>
        ${list.length ? `<div class="chips" id="sentChips">${list.map((s, i) => `<button type="button" class="chip sentence" data-s="${i}" aria-pressed="${g.original === s}">${esc(s)}</button>`).join('')}</div><span class="field-hint" style="margin-top:8px">…or type one:</span>` : '<span class="field-hint">Type a plain sentence from today:</span>'}
        <input type="text" id="gymOriginal" value="${esc(g.original || '')}" placeholder="e.g. The day was really good.">
        <span class="field-label">2 · Choose a technique</span>
        <div class="chips" id="techChips">${TECHNIQUES.map(x => `<button type="button" class="chip" data-t="${x.key}" aria-pressed="${g.tech === x.key}">${esc(x.name)}</button>`).join('')}</div>
        <div class="tech-detail" id="techDetail">${t ? techCard(t) : ''}</div>
        <span class="field-label">3 · Your rewrite</span>
        <label class="field"><textarea class="short" id="gymRewrite" placeholder="Rewrite it your way…">${esc(g.rewrite || '')}</textarea></label>`;
    },
    bind(def, d) {
      d.data.gym = d.data.gym || {};
      const g = d.data.gym;
      const sentences = $$('[data-s]', view);
      const orig = $('#gymOriginal', view), rw = $('#gymRewrite', view);
      sentences.forEach(b => b.onclick = () => {
        g.original = b.textContent; orig.value = g.original; saveSoon();
        sentences.forEach(x => x.setAttribute('aria-pressed', x === b));
      });
      orig.oninput = () => { g.original = orig.value; saveSoon(); sentences.forEach(x => x.setAttribute('aria-pressed', x.textContent === orig.value)); };
      rw.oninput = () => { g.rewrite = rw.value; saveSoon(); autosize(rw); };
      autosize(rw);
      $$('[data-t]', view).forEach(b => b.onclick = () => {
        g.tech = b.dataset.t; saveSoon();
        $$('[data-t]', view).forEach(x => x.setAttribute('aria-pressed', x === b));
        $('#techDetail', view).innerHTML = techCard(TECHNIQUES.find(x => x.key === g.tech));
      });
    },
  },

  speak: {
    html(def, d) {
      const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
      const C = 2 * Math.PI * 90;
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <div class="card speak">
          <p>${esc(def.prompt)}</p>
          <div class="timer" id="timer"><svg viewBox="0 0 210 210"><circle class="track" cx="105" cy="105" r="90"/><circle class="val" cx="105" cy="105" r="90" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><div class="t-label"><b id="tLeft">60</b></div></div>
          <div class="btn-row" style="justify-content:center"><button class="btn primary" id="tGo">${icon('mic')} Start speaking</button><button class="btn ghost" id="tReset" aria-label="Reset timer">${icon('refresh')}</button></div>
          ${canRec ? `<label class="toggle"><input type="checkbox" id="recOn"> Record myself so I can listen back</label><div id="recOut"></div>` : ''}
        </div>
        <div class="guide" style="margin-top:14px"><div class="guide-row"><span class="g-label">While you speak</span><ul><li>Pause instead of saying “um” or “like”. Silence sounds confident.</li><li>Slow down at the turning point.</li><li>End on purpose — say your last line, then stop.</li></ul></div></div>
        ${d.data.spoke ? `<p class="pill ok" style="margin-top:8px">${icon('check')} Done for today</p>` : ''}`;
    },
    bind(def, d) {
      const C = 2 * Math.PI * 90;
      const ring = $('#timer .val', view), left = $('#tLeft', view), btn = $('#tGo', view), tWrap = $('#timer', view);
      let t = null, start = 0, rec = null, stream = null, chunks = [];
      const stopRec = () => {
        if (rec && rec.state !== 'inactive') rec.stop();
        if (stream) stream.getTracks().forEach(tr => tr.stop());
        stream = null;
      };
      const stop = (completed) => {
        clearInterval(t); t = null; tWrap.classList.remove('running');
        const secs = Math.min(60, Math.round((Date.now() - start) / 1000));
        if (start && secs > 5) { S.speakSeconds = (S.speakSeconds || 0) + secs; d.data.spoke = true; saveSoon(); }
        start = 0;
        stopRec();
        btn.innerHTML = `${icon('mic')} ${completed ? 'Go again' : 'Start speaking'}`;
        if (completed) { left.textContent = '✓'; toast('Time! Nice work.'); burst(60); }
      };
      const tick = () => {
        const el = (Date.now() - start) / 1000, rem = Math.max(0, 60 - el);
        left.textContent = Math.ceil(rem);
        ring.style.strokeDashoffset = C * (1 - rem / 60);
        if (rem <= 0) stop(true);
      };
      btn.onclick = async () => {
        if (t) { stop(false); return; }
        const recOn = $('#recOn', view);
        if (recOn && recOn.checked) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            chunks = []; rec = new MediaRecorder(stream);
            rec.ondataavailable = e => e.data.size && chunks.push(e.data);
            rec.onstop = () => {
              const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
              const out = $('#recOut', view);
              if (out) out.innerHTML = `<audio controls src="${url}"></audio><p class="field-hint" style="margin-top:6px">Listen once. Count your “ums”. Not saved anywhere.</p>`;
            };
            rec.start();
          } catch (e) { toast('Microphone not available — timer only.'); stream = null; rec = null; }
        }
        start = Date.now(); ring.style.transition = 'none'; ring.style.strokeDashoffset = 0;
        requestAnimationFrame(() => { ring.style.transition = ''; });
        tWrap.classList.add('running');
        btn.innerHTML = `${rec ? '<span class="rec-dot"></span>' : icon('pause')} Stop`;
        t = setInterval(tick, 200); tick();
      };
      $('#tReset', view).onclick = () => { if (t) stop(false); left.textContent = '60'; ring.style.strokeDashoffset = 0; btn.innerHTML = `${icon('mic')} Start speaking`; };
      return () => { if (t) stop(false); else stopRec(); };
    },
  },

  score: {
    html(def, d) {
      const a = analyse(J_TEXT_FIELDS.map(f => d.data[f]).filter(Boolean).join('\n'));
      const self = d.data.self || {};
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <div class="stat-grid">
          <div class="stat"><b>${a.words}</b><span>words</span></div>
          <div class="stat"><b>${a.avg || '–'}</b><span>words / sentence</span></div>
          <div class="stat ${a.fillerTotal >= 3 ? 'warn' : ''}"><b>${a.fillerTotal}</b><span>filler words</span></div>
          <div class="stat ${a.andThen ? 'warn' : ''}"><b>${a.andThen}</b><span>“and then”</span></div>
        </div>
        <span class="field-label">Hints — you make the fix</span>
        <div class="hints">${a.hints.map(h => `<div class="hint">${icon('bulb')}<span>${esc(h)}</span></div>`).join('')}</div>
        <p class="field-hint" style="margin-top:8px">Want to fix something? Use Back — your answers are saved.</p>
        <span class="field-label" style="margin-top:20px">Score yourself, honestly</span>
        <div class="card">${DIMENSIONS.map(dim => `<div class="dim"><div class="dim-head"><b>${dim.name}</b><small>1 ${dim.low} · 5 ${dim.high}</small></div><p>${dim.desc}</p>
          <div class="seg" role="group" aria-label="${dim.name}">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-dim="${dim.key}" data-v="${n}" aria-pressed="${self[dim.key] === n}">${n}</button>`).join('')}</div></div>`).join('')}</div>`;
    },
    bind(def, d) {
      d.data.self = d.data.self || {};
      $$('[data-dim]', view).forEach(b => b.onclick = () => {
        d.data.self[b.dataset.dim] = +b.dataset.v; saveSoon();
        $$(`[data-dim="${b.dataset.dim}"]`, view).forEach(x => x.setAttribute('aria-pressed', x === b));
      });
    },
  },

  book: {
    html(def, d) {
      const books = [...new Set(S.reading.map(r => r.book).filter(Boolean))].slice(-6).reverse();
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <p class="step-sub">Goal for this session: finish one chapter, then prove to yourself you understood it.</p>
        ${books.length ? `<div class="chips" style="margin-bottom:6px">${books.map(b => `<button type="button" class="chip" data-book="${esc(b)}">${esc(b)}</button>`).join('')}</div>` : ''}
        <span class="field-label">Book title</span><input type="text" data-field="book" value="${esc(d.data.book || '')}" placeholder="e.g. Atomic Habits">
        <div class="grid-2">
          <div><span class="field-label">Author</span><input type="text" data-field="author" value="${esc(d.data.author || '')}" placeholder="Optional"></div>
          <div><span class="field-label">Chapter</span><input type="text" data-field="chapter" value="${esc(d.data.chapter || '')}" placeholder="e.g. 4"></div>
        </div>
        <div class="guide" style="margin-top:16px"><div class="guide-row"><span class="g-label">How to read for speaking</span><ul>
          <li>Read with a pen (or your phone notes). Mark <b>one word</b> you would steal and <b>one line</b> you love.</li>
          <li>Notice <i>how</i> the author opens the chapter. That’s a hook you can learn from.</li>
          <li>Phone on silent. One chapter, one sitting.</li></ul></div></div>`;
    },
    bind(def, d) {
      $$('[data-book]', view).forEach(b => b.onclick = () => {
        const last = [...S.reading].reverse().find(r => r.book === b.dataset.book);
        d.data.book = b.dataset.book; d.data.author = last?.author || '';
        const n = last && parseInt(last.chapter, 10); d.data.chapter = Number.isFinite(n) ? String(n + 1) : '';
        $('[data-field="book"]', view).value = d.data.book; $('[data-field="author"]', view).value = d.data.author; $('[data-field="chapter"]', view).value = d.data.chapter;
        saveSoon();
      });
    },
  },

  reading: {
    html(def, d) {
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(d.data.book || 'Your book')}${d.data.chapter ? ` <span class="grad-text">· ch. ${esc(d.data.chapter)}</span>` : ''}</h1>
        <div class="card" style="text-align:center">
          <div class="book-anim paused-anim" id="bookAnim"><div class="cover"></div><div class="page-still"></div><div class="page-flip"></div><div class="page-flip"></div><div class="spine"></div></div>
          <div class="stopwatch paused" id="sw">00:00</div>
          <div class="btn-row" style="justify-content:center"><button class="btn primary" id="swGo">${icon('play')} Start reading</button></div>
          <p class="field-hint" style="margin-top:12px">Press Next when you’ve finished the chapter. The timer pauses on its own when you leave this screen.</p>
        </div>
        <div class="guide" style="margin-top:14px"><div class="guide-row"><span class="g-label">While you read</span><ul>
          <li>Every few pages, pause and say the main point to yourself in one sentence.</li>
          <li>Spot the author’s structure: how do they hook, build, turn and land?</li></ul></div></div>`;
    },
    bind(def, d) {
      const sw = $('#sw', view), btn = $('#swGo', view), anim = $('#bookAnim', view);
      let running = false, since = 0, t = null;
      const fmt = ms => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor(s / 60) % 60; return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
      const total = () => (d.readMs || 0) + (running ? Date.now() - since : 0);
      const render = () => { sw.textContent = fmt(total()); };
      const pause = () => {
        if (!running) return;
        d.readMs = total(); running = false; clearInterval(t); save();
        sw.classList.add('paused'); anim.classList.add('paused-anim'); btn.innerHTML = `${icon('play')} Resume`;
      };
      btn.onclick = () => {
        if (running) { pause(); return; }
        running = true; since = Date.now(); t = setInterval(render, 500);
        sw.classList.remove('paused'); anim.classList.remove('paused-anim'); btn.innerHTML = `${icon('pause')} Pause`;
      };
      if (d.readMs) btn.innerHTML = `${icon('play')} Resume`;
      render();
      return pause;
    },
  },

  collect: {
    html(def, d) {
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <p class="step-sub">Good speakers borrow from good writers. Collect one word and one line, then make them yours.</p>
        <div class="card soft"><span class="g-label">A new word</span>
          <div class="grid-2"><div><span class="field-label">Word</span><input type="text" data-field="word" value="${esc(d.data.word || '')}" placeholder="e.g. relentless"></div>
          <div><span class="field-label">What it means</span><input type="text" data-field="wordMeaning" value="${esc(d.data.wordMeaning || '')}" placeholder="In your own words"></div></div>
          <span class="field-label">Use it in a sentence about your own life</span>${textarea('wordSentence', d, 'My sentence…', true)}
        </div>
        <div class="card soft"><span class="g-label">A line you loved</span>
          <span class="field-label">The line</span>${textarea('line', d, 'Copy it exactly…', true)}
          <span class="field-label">Why does it work?</span><span class="field-hint">Is it the rhythm? A comparison? A specific detail? A surprising word? Name the technique.</span>${textarea('lineWhy', d, 'It works because…', true)}
        </div>`;
    },
  },

  quiz: {
    html(def, d) {
      return `<p class="eyebrow">${esc(def.eyebrow)}</p><h1 class="step-title">${esc(def.title)}</h1>
        <p class="step-sub">You’ll be asked these again in 2 days, then less often as you get them right. Testing yourself beats rereading.</p>
        <div class="guide"><div class="guide-row"><span class="g-label">Good questions</span><ul><li>Ask about the big idea, not trivia: “What are the 3 steps the author gives for…?”</li><li>Ask why: “Why does the author say willpower is the wrong tool?”</li></ul></div></div>
        ${[1, 2].map(n => `<div class="card soft"><span class="g-label">Question ${n}</span>
          <span class="field-label">Question</span><input type="text" data-field="q${n}" value="${esc(d.data['q' + n] || '')}" placeholder="What / why / how…?">
          <span class="field-label">Answer</span>${textarea('a' + n, d, 'The answer, in your words…', true)}</div>`).join('')}`;
    },
  },
};

function techCard(t) {
  return `<div class="card soft"><p><b>${esc(t.name)}.</b> ${esc(t.how)}</p><div class="ba"><div class="before">${esc(t.before)}</div><div class="after">${esc(t.after)}</div></div></div>`;
}

/* =========================================================
   Finishing sessions
   ========================================================= */
function finish(type) {
  const d = S.drafts[type];
  if (type === 'journal') {
    const data = d.data;
    const fields = {};
    J_TEXT_FIELDS.forEach(f => { if (data[f] && data[f].trim()) fields[f] = data[f].trim(); });
    if (!Object.keys(fields).length && !(data.gym && data.gym.rewrite)) { toast('Write at least one answer before finishing.'); return; }
    const entry = {
      id: uid(), date: d.date || isoDate(), createdAt: Date.now(), mode: d.mode, mood: data.mood || null,
      fields, gym: data.gym && (data.gym.original || data.gym.rewrite) ? data.gym : null,
      spoke: !!data.spoke, self: data.self || {}, minutes: Math.round((d.activeMs || 0) / 60000),
    };
    S.journal.push(entry);
    delete S.drafts.journal;
    save();
    go('#/done/journal');
  } else {
    const data = d.data;
    if (!data.book || !data.book.trim()) { toast('Add the book title on step 1 first.'); d.i = 0; drawStep(type, 'back'); return; }
    const fields = {};
    ['summary', 'explain', 'word', 'wordMeaning', 'wordSentence', 'line', 'lineWhy'].forEach(f => { if (data[f] && data[f].trim()) fields[f] = data[f].trim(); });
    const questions = [1, 2].filter(n => data['q' + n] && data['q' + n].trim()).map(n => ({ id: uid(), q: data['q' + n].trim(), a: (data['a' + n] || '').trim(), due: addDays(isoDate(), 2), reps: 0, history: [] }));
    S.reading.push({
      id: uid(), date: d.date || isoDate(), createdAt: Date.now(), book: data.book.trim(), author: (data.author || '').trim(), chapter: (data.chapter || '').trim(),
      fields, questions, spoke: !!data.spoke, minutes: Math.round(((d.readMs || 0) + (d.activeMs || 0)) / 60000),
    });
    S.settings.lastBook = data.book.trim(); S.settings.lastAuthor = (data.author || '').trim();
    delete S.drafts.reading;
    save();
    go('#/done/reading');
  }
}

function renderDone(r) {
  const kind = r.arg;
  let title, lede, extra = '';
  if (kind === 'journal') {
    const e = S.journal[S.journal.length - 1];
    const a = analyse(e ? entryText(e) : '');
    const st = streak();
    title = st > 1 ? `${st}-day streak!` : 'Entry saved.';
    lede = `${plural(a.words, 'word')} written${e?.minutes ? ` in ${plural(e.minutes, 'minute')}` : ''}. ${st >= 7 ? 'A full week of showing up — that’s how this works.' : 'Showing up is the skill. See you tomorrow.'}`;
    const since = entriesSinceReview();
    extra = since >= 7
      ? `<a class="btn primary block" href="#/review">${icon('send')} Get this week reviewed</a>`
      : `<p class="field-hint" style="text-align:center">${7 - since} more ${7 - since === 1 ? 'entry' : 'entries'} until your next review.</p>`;
  } else if (kind === 'reading') {
    const e = S.reading[S.reading.length - 1];
    title = 'Chapter done.';
    lede = e ? `${esc(e.book)}${e.chapter ? ', chapter ' + esc(e.chapter) : ''} · ${plural(e.minutes, 'minute')}. ${e.questions.length ? `Your ${plural(e.questions.length, 'question')} will come back on ${fmtDate(e.questions[0].due)}.` : ''}` : '';
    extra = S.journal.some(j => j.date === isoDate()) ? '' : `<a class="btn primary block" href="#/journal">${icon('pen')} Now journal</a>`;
  } else {
    title = 'Recall done.'; lede = 'Pulling it from memory is what makes it stick.';
  }
  mount(`<div class="celebrate"><div class="badge"><svg class="i" viewBox="0 0 24 24"><path d="${ICONS.check}"/></svg></div>
    <h1>${title}</h1><p class="lede">${lede}</p></div>
    <div class="stagger" style="display:grid;gap:10px;margin-top:22px">${extra}<a class="btn ghost block" href="#/">Back to today</a></div>`);
  setTimeout(() => burst(160), 250);
}

/* =========================================================
   Recall test (spaced repetition on your own questions)
   ========================================================= */
function renderRecall() {
  const due = dueQuestions();
  if (!due.length) {
    mount(`<div class="wizard"><div class="wiz-top"><a class="icon-btn" href="#/" aria-label="Back">${icon('x')}</a><div class="wiz-progress"><div class="wiz-meta"><span>Recall test</span></div></div></div>
      <div class="card empty">${icon('brain')}<h2>Nothing due yet</h2><p style="margin-top:6px">When you finish a reading session, your two questions come back here after 2 days. Get them right and they space out to a week, then longer.</p>
      <div class="btn-row" style="justify-content:center"><a class="btn primary" href="#/read">${icon('book')} Read a chapter</a></div></div></div>`);
    return;
  }
  const total = due.length;
  const t0 = Date.now();
  let idx = 0;
  const draw = (dir) => {
    const { r, q } = due[idx];
    view.innerHTML = `<div class="wizard">
      <div class="wiz-top"><a class="icon-btn" href="#/" aria-label="Exit">${icon('x')}</a>
        <div class="wiz-progress"><div class="wiz-meta"><span>Recall test</span><span>${idx + 1} / ${total}</span></div><div class="bar"><span style="width:${((idx + 1) / total) * 100}%"></span></div></div></div>
      <section class="step in-${dir}">
        <div class="card qcard"><p class="book-tag">${icon('book')} ${esc(r.book)}${r.chapter ? ' · ch. ' + esc(r.chapter) : ''} · read ${fmtDate(r.date)}</p><h2>${esc(q.q)}</h2>
          <label class="field"><span class="sr-only">Your answer</span><textarea class="short" id="ans" placeholder="Answer from memory — no peeking…"></textarea></label>
          <div class="btn-row"><button class="btn primary block" id="reveal">Check my answer</button></div>
          <div id="revealOut"></div>
        </div>
      </section></div>`;
    const ans = $('#ans', view); ans.oninput = () => autosize(ans);
    $('#reveal', view).onclick = () => {
      $('#reveal', view).remove();
      $('#revealOut', view).innerHTML = `<div class="reveal">
        <span class="field-label">What you wrote back then</span><blockquote>${esc(q.a || '(no answer saved)')}</blockquote>
        ${r.fields?.summary ? `<details class="g-more" style="border:0;padding-top:12px"><summary>Your chapter summary</summary><blockquote>${esc(r.fields.summary)}</blockquote></details>` : ''}
        <span class="field-label">How did you do?</span>
        <div class="seg" style="grid-template-columns:repeat(3,1fr)"><button data-g="0">Missed</button><button data-g="1">Partly</button><button data-g="2">Got it</button></div></div>`;
      $$('[data-g]', view).forEach(b => b.onclick = () => {
        const g = +b.dataset.g;
        q.reps = g === 2 ? (q.reps || 0) + 1 : g === 1 ? q.reps || 0 : 0;
        const gap = g === 0 ? 1 : g === 1 ? 3 : Math.min(60, 7 * Math.pow(2, Math.max(0, q.reps - 1)));
        q.due = addDays(isoDate(), gap);
        q.history = [...(q.history || []), { date: isoDate(), grade: g, answer: ans.value.trim() }];
        save();
        idx++;
        if (idx < total) draw('next');
        else { S.recallLog.push({ date: isoDate(), count: total, minutes: Math.round((Date.now() - t0) / 60000) }); save(); go('#/done/recall'); }
      });
    };
  };
  draw('fade');
}

/* =========================================================
   Toolkit
   ========================================================= */
let toolkitTab = 'story';
function renderToolkit(r) {
  if (r.arg) toolkitTab = r.arg;
  const tabs = [['story', 'Story Arc'], ['process', 'Process'], ['describe', 'Describe'], ['opinion', 'Opinion'], ['gym', 'Sentence Gym'], ['method', 'The Method']];
  mount(`<div class="hello stagger"><p class="date">Toolkit</p><h1>Structures that make you <span class="grad-text">easy to follow</span></h1>
      <p class="lede" style="margin-top:8px">Beginning, middle and end isn’t enough. These break each kind of talk into parts, and tell you what to focus on in each one.</p></div>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${toolkitTab === k}">${l}</button>`).join('')}</div>
    <div id="tk"></div>`);
  const draw = () => { $('#tk', view).innerHTML = `<div class="page">${toolkitContent(toolkitTab)}</div>`; $$('.stagger', view).forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i))); };
  $$('[data-tab]', view).forEach(b => b.onclick = () => {
    toolkitTab = b.dataset.tab;
    $$('[role="tab"]', view).forEach(x => x.setAttribute('aria-selected', x === b));
    draw();
  });
  draw();
}
function toolkitContent(tab) {
  if (tab === 'story') {
    return `<div class="card soft" style="margin-bottom:14px"><p><b>Use it for:</b> telling a story, how your day went, something that happened at work. Seven parts, each with one job. Your Full Story journal walks you through them one screen at a time.</p></div>
      <div class="timeline stagger">${ARC.map((a, i) => `<div class="tl-item"><div class="tl-num">${i + 1}</div><div class="card"><h3>${a.name}</h3><p class="tag">${a.tag}</p>
        <div class="body"><p>${esc(a.focus)}</p><ul>${a.ask.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
        <details class="g-more" style="margin-top:8px"><summary>Example &amp; trap</summary><blockquote>${esc(a.ex)}</blockquote><p class="avoid"><b>Avoid:</b> ${esc(a.avoid)}</p></details></div></div></div>`).join('')}</div>
      <h2 class="section-title">All seven parts, put together</h2>
      <div class="card full-story">${ARC.map(a => `<p><mark>${a.name}</mark>${esc(a.ex)}</p>`).join('')}</div>`;
  }
  if (FRAMEWORKS[tab]) {
    const f = FRAMEWORKS[tab];
    return `<div class="card soft" style="margin-bottom:14px"><p><b>${f.name}.</b> ${f.sub}</p></div>
      <div class="timeline stagger">${f.parts.map((p, i) => `<div class="tl-item"><div class="tl-num">${i + 1}</div><div class="card"><h3>${p.name}</h3><p class="tag">${p.tag}</p><div class="body"><p>${esc(p.focus)}</p><blockquote>${esc(p.ex)}</blockquote></div></div></div>`).join('')}</div>
      <h2 class="section-title">Put together</h2><div class="card full-story"><p>${f.parts.map(p => esc(p.ex)).join(' ')}</p></div>`;
  }
  if (tab === 'gym') {
    return `<div class="card soft" style="margin-bottom:14px"><p>Simple and clear beats fancy. Each technique below makes a plain sentence more interesting <b>without</b> big words. Every journal ends with you upgrading one of your own sentences using one of these.</p></div>
      <div class="stagger" style="display:grid;gap:12px">${TECHNIQUES.map((t, i) => `<div class="card"><p class="eyebrow">Technique ${i + 1}</p><h3 style="margin-top:4px">${esc(t.name)}</h3><p style="margin-top:6px">${esc(t.how)}</p><div class="ba"><div class="before">${esc(t.before)}</div><div class="after">${esc(t.after)}</div></div></div>`).join('')}</div>`;
  }
  // method
  const steps = [
    ['Break the skill into parts', 'Communication isn’t one skill. Here it is four: <b>structure</b> (the frameworks), <b>detail</b> (specifics and senses), <b>word choice</b> (the Sentence Gym) and <b>delivery</b> (the 60-second speak). You practise all four every day, in small pieces.'],
    ['Learn just enough to self-correct', 'You don’t need a course first. The step guides, the hints on your self-check (filler words, “and then”, sentence length) and the 1–5 self-score let you notice your own mistakes while you write.'],
    ['Remove the friction', 'One tap opens today’s path. Every step is one screen. Drafts save as you type, so you can stop and come back. On a busy day, Quick mode still counts.'],
    ['Practise for 20 focused hours', 'The ring on your Today screen tracks real practice time — reading, writing and speaking. 20 hours is about 30 days at 40 minutes. That’s where you start to feel the difference.'],
  ];
  const extras = [
    ['Write it, then say it', 'Writing organises your thinking; speaking it out loud turns it into a habit of the mouth. That’s why every journal and reading session ends with a 60-second retell.'],
    ['Explain it simply', 'If you can explain a chapter to a 12-year-old, you understand it. If you can’t, you’ve found exactly what to reread.'],
    ['Test, don’t reread', 'Answering your own questions from memory a few days later is far more effective than reading notes again. The Recall test does the scheduling for you.'],
    ['One focus at a time', 'Each review ends with one habit to practise next week. It shows up on every journal screen until your next review.'],
  ];
  return `<div class="card soft" style="margin-bottom:14px"><p>This app is built on the idea that you can get good at a skill fast by practising the right parts on purpose — popularised in Josh Kaufman’s TED talk on learning any skill in about 20 hours.</p></div>
    <div class="stagger" style="display:grid;gap:12px">${steps.map((s, i) => `<div class="card method-step"><div class="n">${i + 1}</div><div><h3>${s[0]}</h3><p style="margin-top:4px">${s[1]}</p></div></div>`).join('')}</div>
    <h2 class="section-title">Why each piece is here</h2>
    <div class="stagger" style="display:grid;gap:12px">${extras.map(s => `<div class="card"><h3>${s[0]}</h3><p style="margin-top:4px">${s[1]}</p></div>`).join('')}</div>
    <h2 class="section-title">Your weekly rhythm</h2>
    <div class="card"><ul style="margin:0;padding-left:18px"><li><b>Daily:</b> read one chapter → journal (Full or Quick) → speak it for 60 seconds.</li><li><b>When due:</b> answer your recall questions.</li><li><b>Every 7 entries:</b> send them for review, log the score, and set one focus for the next week.</li></ul></div>`;
}

/* =========================================================
   Log
   ========================================================= */
let logTab = 'journal';
function renderLog(r) {
  if (r.arg) logTab = r.arg;
  mount(`<div class="hello stagger"><p class="date">Log</p><h1>Everything you’ve <span class="grad-text">written</span></h1></div>
    <div class="tabs" role="tablist">${[['journal', `Journal (${S.journal.length})`], ['reading', `Reading (${S.reading.length})`]].map(([k, l]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${logTab === k}">${l}</button>`).join('')}</div>
    <div id="logList"></div>
    <h2 class="section-title">Your data</h2>
    <div class="card"><p class="lede">Everything is stored in this browser only. Export a backup now and then — and to move to another device.</p>
      <div class="btn-row"><button class="btn ghost small" id="exp">${icon('down')} Export backup</button><label class="btn ghost small" style="cursor:pointer">${icon('up')} Import<input type="file" id="imp" accept="application/json,.json" hidden></label></div></div>`);
  const draw = () => {
    const list = $('#logList', view);
    const items = (logTab === 'journal' ? S.journal : S.reading).slice().reverse();
    if (!items.length) {
      list.innerHTML = `<div class="card empty">${icon(logTab === 'journal' ? 'pen' : 'book')}<p>Nothing here yet.</p><div class="btn-row" style="justify-content:center"><a class="btn primary small" href="${logTab === 'journal' ? '#/journal' : '#/read'}">Start one</a></div></div>`;
      return;
    }
    list.innerHTML = `<div class="stagger">${items.map(e => logTab === 'journal' ? journalCard(e) : readingCard(e)).join('')}</div>`;
    $$('.stagger > *', list).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 8)));
    $$('.entry', list).forEach(c => c.addEventListener('click', ev => {
      if (ev.target.closest('button, a')) return;
      c.classList.toggle('open');
    }));
    $$('[data-del]', list).forEach(b => b.onclick = () => {
      if (!confirm('Delete this entry for good?')) return;
      const arr = logTab === 'journal' ? S.journal : S.reading;
      const i = arr.findIndex(x => x.id === b.dataset.del);
      if (i >= 0) arr.splice(i, 1);
      save(); draw();
    });
  };
  $$('[data-tab]', view).forEach(b => b.onclick = () => { logTab = b.dataset.tab; $$('[role="tab"]', view).forEach(x => x.setAttribute('aria-selected', x === b)); draw(); });
  draw();
  $('#exp', view).onclick = exportData;
  $('#imp', view).onchange = importData;
}
function journalCard(e) {
  const mood = MOODS.find(m => m.v === e.mood);
  const title = e.fields.headline || e.fields.hook || e.fields.day || 'Journal entry';
  const secs = Object.entries(e.fields).filter(([k]) => k !== 'headline').map(([k, v]) => `<div class="sec"><b>${LABELS[k] || k}</b><p>${esc(v)}</p></div>`).join('');
  const gym = e.gym ? `<div class="sec"><b>Sentence Gym${e.gym.tech ? ' · ' + esc(TECHNIQUES.find(t => t.key === e.gym.tech)?.name || '') : ''}</b><div class="ba"><div class="before">${esc(e.gym.original || '')}</div><div class="after">${esc(e.gym.rewrite || '')}</div></div></div>` : '';
  const selfVals = Object.values(e.self || {});
  const selfAvg = selfVals.length ? (selfVals.reduce((a, b) => a + b, 0) / selfVals.length).toFixed(1) : null;
  return `<div class="card entry"><div class="entry-head"><div><p class="date">${fmtDate(e.date)} · ${J_MODES[e.mode]?.name || ''}${mood ? ' · ' + mood.e : ''}</p><h3>${esc(title.length > 90 ? title.slice(0, 88) + '…' : title)}</h3></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${selfAvg ? `<span class="pill accent">${selfAvg}/5</span>` : ''}${e.spoke ? `<span class="pill ok">${icon('mic')}</span>` : ''}</div></div>
    <div class="entry-body">${e.fields.headline ? `<div class="sec"><b>Headline</b><p>${esc(e.fields.headline)}</p></div>` : ''}${secs}${gym}
      <div class="btn-row"><a class="btn ghost small" href="#/review?ids=${e.id}">${icon('send')} Get this reviewed</a><button class="btn danger small" data-del="${e.id}">${icon('trash')} Delete</button></div></div></div>`;
}
function readingCard(e) {
  const secs = Object.entries(e.fields || {}).map(([k, v]) => `<div class="sec"><b>${LABELS[k] || k}</b><p>${esc(v)}</p></div>`).join('');
  const qs = (e.questions || []).map(q => `<div class="sec"><b>Question · next due ${fmtDate(q.due)}</b><p>${esc(q.q)}</p></div>`).join('');
  return `<div class="card entry"><div class="entry-head"><div><p class="date">${fmtDate(e.date)} · ${plural(e.minutes || 0, 'min')}</p><h3>${esc(e.book)}${e.chapter ? ' · ch. ' + esc(e.chapter) : ''}</h3></div>${e.spoke ? `<span class="pill ok">${icon('mic')}</span>` : ''}</div>
    <div class="entry-body">${secs}${qs}<div class="btn-row"><button class="btn danger small" data-del="${e.id}">${icon('trash')} Delete</button></div></div></div>`;
}
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `articulate-backup-${isoDate()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Backup downloaded.');
}
function importData(ev) {
  const file = ev.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.journal) || !Array.isArray(data.reading)) throw new Error('bad');
      if (!confirm(`Replace what’s here with this backup (${plural(data.journal.length, 'journal entry', 'journal entries')}, ${plural(data.reading.length, 'chapter')})?`)) return;
      S = Object.assign(blank(), data); save(); toast('Backup restored.'); router();
    } catch (e) { toast('That file isn’t an Articulate backup.'); }
  };
  reader.readAsText(file);
}

/* =========================================================
   Review
   ========================================================= */
function reviewPrompt(entries) {
  const fmt = e => {
    const lines = [`### ${fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long' })} (${J_MODES[e.mode]?.name || ''} entry)`];
    Object.entries(e.fields).forEach(([k, v]) => lines.push(`[${LABELS[k] || k}] ${v}`));
    if (e.gym && (e.gym.original || e.gym.rewrite)) {
      lines.push(`[Sentence upgrade practice${e.gym.tech ? ' — technique: ' + (TECHNIQUES.find(t => t.key === e.gym.tech)?.name || '') : ''}]`);
      lines.push(`Original: ${e.gym.original || ''}`); lines.push(`My rewrite: ${e.gym.rewrite || ''}`);
    }
    const s = e.self || {};
    if (Object.keys(s).length) lines.push(`(My self-score 1–5: ${DIMENSIONS.map(d => `${d.name} ${s[d.key] ?? '-'}`).join(', ')})`);
    return lines.join('\n');
  };
  const focus = currentFocus();
  return `I'm doing a daily reading and journaling challenge to become a clearer, more interesting communicator — in writing and when I speak. I don't want fancy vocabulary; I want to explain things clearly, in a good structure, with enough detail to be interesting.

Please act as my writing coach and review the journal entries below.

How I'd like you to coach me:
1. Do NOT rewrite my sentences or hand me finished answers. Quote the exact sentence, name the problem, and give me a hint or a question so I can fix it myself.
2. Score each entry out of 10 on: Clarity, Structure, Detail, Word choice, Flow — plus an overall score. Be honest, not generous.
3. Story entries are labelled with the parts of a 7-part story arc (Hook, Scene, Stakes, Build-up, Turning point, Outcome, Meaning). Tell me which part is my weakest across the entries.
4. Look at my "Sentence upgrade practice" and tell me whether the rewrite is actually better, and why — without writing your own version.
5. Name my single biggest strength, and the ONE habit I should focus on next week.
6. Give me one small exercise (5 minutes) to practise that habit, then give me a sentence of mine to try it on.
${focus ? `\nLast week my focus was: "${focus}". Tell me whether you can see progress on it.\n` : ''}
After I try the exercise, I'll send my attempt back for feedback.

---

${entries.map(fmt).join('\n\n')}`;
}
function renderReview(r) {
  const pre = (r.query.get('ids') || '').split(',').filter(Boolean);
  const recent = S.journal.slice(-21).reverse();
  const lr = lastReview();
  const defaultIds = pre.length ? pre : recent.filter(e => !lr || e.createdAt > lr.createdAt).slice(0, 7).map(e => e.id);
  mount(`<div class="hello stagger"><p class="date">Review</p><h1>Get feedback, <span class="grad-text">not answers</span></h1>
      <p class="lede" style="margin-top:8px">Every 7 entries, send them to Claude. You’ll get a score, hints and one focus for the week — but you make the fixes.</p></div>

    <h2 class="section-title">1 · Pick entries</h2>
    ${recent.length ? `<div class="card"><div class="check-list">${recent.map(e => `<label class="check-row"><input type="checkbox" value="${e.id}" ${defaultIds.includes(e.id) ? 'checked' : ''}><span>${esc((e.fields.headline || e.fields.hook || e.fields.day || 'Entry').slice(0, 80))}<small>${fmtDate(e.date)} · ${J_MODES[e.mode]?.name || ''} · ${plural(wordCount(entryText(e)), 'word')}</small></span></label>`).join('')}</div>
      <div class="btn-row"><button class="btn primary block" id="build">${icon('spark')} Build my review request</button></div><div id="promptOut"></div></div>`
    : `<div class="card empty">${icon('pen')}<p>Write a few journal entries first.</p><div class="btn-row" style="justify-content:center"><a class="btn primary small" href="#/journal">Start journaling</a></div></div>`}

    <h2 class="section-title">2 · Log the score you got</h2>
    <div class="card">
      <div class="score-form">
        <label>Overall /10<input type="number" min="1" max="10" step="0.5" id="sOverall" inputmode="decimal"></label>
        ${DIMENSIONS.map(d => `<label>${d.name}<input type="number" min="1" max="10" step="0.5" data-sd="${d.key}" inputmode="decimal"></label>`).join('')}
        <label class="wide">Focus for next week<input type="text" id="sFocus" placeholder="e.g. Slow down at the turning point and add one sensory detail" value=""></label>
      </div>
      <div class="btn-row"><button class="btn primary" id="saveScore">${icon('check')} Save review</button></div>
    </div>

    <h2 class="section-title">3 · Progress</h2>
    <div class="card chart">${progressChart()}</div>
    ${S.reviews.length ? `<div class="stagger" style="margin-top:12px">${S.reviews.slice().reverse().slice(0, 6).map(v => `<div class="card"><div class="entry-head"><div><p class="date">${fmtDate(v.date)}</p><h3>Overall ${v.overall}/10</h3></div></div>${v.focus ? `<p style="margin-top:6px"><b>Focus:</b> ${esc(v.focus)}</p>` : ''}</div>`).join('')}</div>` : ''}
  `);
  const b = $('#build', view);
  if (b) b.onclick = () => {
    const ids = $$('.check-list input:checked', view).map(i => i.value);
    const entries = S.journal.filter(e => ids.includes(e.id));
    if (!entries.length) { toast('Tick at least one entry.'); return; }
    const text = reviewPrompt(entries);
    $('#promptOut', view).innerHTML = `<div class="reveal"><textarea class="prompt-out" readonly>${esc(text)}</textarea>
      <div class="btn-row"><button class="btn primary" id="copy">${icon('copy')} Copy</button></div>
      <p class="field-hint" style="margin-top:8px">Paste it into a chat with Claude. When you get scores back, log them below.</p></div>`;
    $('#copy', view).onclick = async () => {
      const ta = $('.prompt-out', view);
      try { await navigator.clipboard.writeText(text); toast('Copied — paste it into Claude.'); }
      catch (e) { ta.removeAttribute('readonly'); ta.select(); document.execCommand('copy'); ta.setAttribute('readonly', ''); toast('Copied.'); }
    };
  };
  $('#saveScore', view).onclick = () => {
    const overall = parseFloat($('#sOverall', view).value);
    if (!(overall >= 1 && overall <= 10)) { toast('Enter an overall score from 1 to 10.'); return; }
    const scores = {};
    $$('[data-sd]', view).forEach(i => { const v = parseFloat(i.value); if (v >= 1 && v <= 10) scores[i.dataset.sd] = v; });
    S.reviews.push({ id: uid(), date: isoDate(), createdAt: Date.now(), overall, scores, focus: $('#sFocus', view).value.trim() });
    save(); toast('Review saved. New focus is on your Today screen.'); burst(80); router();
  };
}
function progressChart() {
  // Claude's overall score (/10) per review, and your own self-score average (/5 → doubled to /10) per entry.
  const rv = S.reviews.map(r => ({ t: r.createdAt, v: r.overall }));
  const se = S.journal.filter(e => Object.keys(e.self || {}).length).map(e => { const v = Object.values(e.self); return { t: e.createdAt, v: (v.reduce((a, b) => a + b, 0) / v.length) * 2 }; });
  if (rv.length + se.length < 2) return `<div class="empty" style="padding:18px">${icon('chart')}<p>Your scores will chart here after a couple of entries.</p></div>`;
  const W = 320, H = 150, P = { l: 26, r: 10, t: 10, b: 20 };
  const all = [...rv, ...se];
  const t0 = Math.min(...all.map(p => p.t)), t1 = Math.max(...all.map(p => p.t));
  const x = t => P.l + (t1 === t0 ? (W - P.l - P.r) / 2 : ((t - t0) / (t1 - t0)) * (W - P.l - P.r));
  const y = v => P.t + (1 - v / 10) * (H - P.t - P.b);
  const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const grid = [0, 5, 10].map(v => `<line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${P.l - 6}" y="${y(v) + 3}" text-anchor="end">${v}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Score history chart">${grid}
    ${se.length > 1 ? `<path class="l2" d="${path(se)}"/>` : ''}${se.map(p => `<circle class="p2" cx="${x(p.t)}" cy="${y(p.v)}" r="2.5"/>`).join('')}
    ${rv.length > 1 ? `<path class="l1" d="${path(rv)}"/>` : ''}${rv.map(p => `<circle class="p1" cx="${x(p.t)}" cy="${y(p.v)}" r="4"/>`).join('')}
  </svg><div class="legend"><span><i style="background:var(--accent)"></i>Claude’s overall score</span><span><i style="background:var(--accent-2)"></i>Your self-score (×2)</span></div>`;
}

/* =========================================================
   Theme, toast, confetti
   ========================================================= */
const themeBtn = $('#themeBtn');
function currentTheme() { return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
function paintThemeBtn() { themeBtn.innerHTML = icon(currentTheme() === 'dark' ? 'sun' : 'moon'); }
themeBtn.onclick = () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  paintThemeBtn();
};
paintThemeBtn();

let toastT = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
}

const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], raf = null;
function burst(n = 120) {
  if (reduceMotion()) return;
  const dpr = window.devicePixelRatio || 1;
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cs = getComputedStyle(document.documentElement);
  const colors = [cs.getPropertyValue('--accent'), cs.getPropertyValue('--accent-2'), cs.getPropertyValue('--gold'), cs.getPropertyValue('--ok')].map(s => s.trim());
  for (let i = 0; i < n; i++) {
    parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .38, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4,
      s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length], life: 0 });
  }
  if (!raf) raf = requestAnimationFrame(step);
}
function step() {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts.forEach(p => { p.vy += .38; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.max(0, 1 - p.life / 140); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
  parts = parts.filter(p => p.y < innerHeight + 40 && p.life < 140);
  raf = parts.length ? requestAnimationFrame(step) : (cx.clearRect(0, 0, innerWidth, innerHeight), null);
}

/* Tab bar icons */
const TAB_ICONS = { '': 'home', toolkit: 'layers', log: 'list', review: 'chart' };
$$('.tabbar a').forEach(a => { a.insertAdjacentHTML('afterbegin', icon(TAB_ICONS[a.dataset.tab])); });

router();
})();
