/**
 * Cross-page prose duplication.
 *
 * The per-page audit cannot see this class of problem: every page is fine on
 * its own, and the defect only exists in the relationship between them. For a
 * site with 18 city pages that is the failure mode that matters most — a
 * sentence written once in a build.mjs template renders as body copy on all 18
 * and reads exactly like the doorway pattern the page count is meant to avoid.
 *
 * Two earlier attempts at this measurement were wrong in instructive ways.
 * Reading the authored data files missed everything that lives in a template,
 * which is where the worst repetition was. Reading rendered pages and filtering
 * chrome with a regex denylist of phrases was guesswork that needed updating
 * every time a component changed. So chrome is excluded structurally here, by
 * selector, in the browser — a call-to-action band repeats by design and should
 * not be counted; a section note should not repeat at all.
 *
 *   node tools/prose.mjs [--max-pages 3] [--quiet]
 */
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const MAX_PAGES = Number(flag('max-pages', 3));   // a prose sentence on more than this many pages is a finding
const MAX_OVERLAP = Number(flag('max-overlap', 0.28)); // two blocks on ONE page sharing more content words than this

/**
 * Restatement within a single page.
 *
 * The duplicate-sentence check above only sees text repeated verbatim across
 * pages. It is blind to the more common editorial failure, which is one page
 * making the same point twice in different words — a section explaining
 * something and then an FAQ answer below it explaining the same thing again.
 * Four of those were found by reading pages by hand; this is here so the next
 * one does not depend on somebody happening to read that far down.
 *
 * Content-word Jaccard, not string similarity: the pairs that matter share
 * their nouns and verbs while sharing almost no phrasing.
 */
/**
 * Claims shaped like measurements.
 *
 * Two invented statistics shipped and survived several passes: a "~2%" stat
 * callout for the share of dark growth this company finds to be Stachybotrys,
 * and "Two thirds of the mold we find in Palm Beach Gardens…" as the opening
 * line of a city page. Both read as data from a job history that does not
 * exist, and a customer or a competitor can fairly ask where the number came
 * from.
 *
 * The pairing is what makes it a finding: a quantity that implies counting, in
 * a sentence that also says "we". Trade figures stay silent here because they
 * do not claim to be this company's results — 24–48 hours before growth starts,
 * ≥ 4 air changes per hour, 60% RH. Qualitative judgements stay silent too:
 * "the most common thing we find" is a practitioner's opinion and is fine.
 * Matching on "most" as well took this from 0 findings to 68.
 */
/**
 * Typewriter marks in body prose.
 *
 * The site sets its own apostrophes and quotes typographically, and the data
 * files use U+2019 rather than ASCII throughout — partly for the typography and
 * partly because these are single-quoted string literals, so an ASCII
 * apostrophe breaks the build. The output had drifted anyway: 22 straight
 * quotation marks against 8 typographic across seven pages. Binary and
 * unambiguous, so it is worth failing on rather than reporting.
 *
 * Code spans are excluded above, because a straight quote inside one is right.
 */
const TYPEWRITER = /['"]/;

const MEASURED = /\b(?:\d{1,3}\s?%|\d{1,3}\s?percent|two[- ]thirds|one[- ]third|three[- ]quarters|four[- ]fifths|nine (?:in|out of) ten|eight (?:in|out of) ten|half (?:of )?(?:the |our |what )?(?:jobs|calls|time|houses|what we))\b/i;
const FIRST_PERSON = /\b(?:we|our|us)\b/i;

const STOP = new Set(('the a an and or but if of to in on at for with is are was were be been it its that this ' +
  'those these you your we our they their as by from not no than then so can could would should may might will ' +
  'do does did have has had what which who how when where why more most other another same each any all some').split(' '));
const contentWords = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
  .filter((w) => w.length > 3 && !STOP.has(w));
const jaccard = (a, b) => {
  const A = new Set(a); const B = new Set(b);
  const shared = [...A].filter((x) => B.has(x)).length;
  return shared / (A.size + B.size - shared);
};
const BASE = flag('base', 'http://127.0.0.1:8099');
const CHROME_URL = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9342;

/**
 * Components that repeat by design. Only the repeating component is removed —
 * NOT the section around it. An earlier version stripped whole sections and
 * that silently defeated the tool: the note introducing the service grid on a
 * city page is authored copy that must be unique per city, and removing its
 * section meant an identical string on 18 pages went unreported. The sentinel
 * for this file is exactly that case.
 */
/* noscript is here for a reason that is not obvious. With scripting enabled —
   which it is, this runs in Chrome — a noscript element's children are never
   parsed. Its whole content stays a single text node holding the literal
   markup, so the contact form's fallback reached this checker as the string
   `<p class="notice">This form needs JavaScript…` and was reported as prose
   using a straight quote. The .notice selector below cannot help: there is no
   element there to match. Nobody ever reads that string — with scripting off
   it parses as real markup instead — so the element goes, not the quotes. */
const CHROME = ['header', 'footer', 'nav', 'svg', 'code', 'kbd', 'samp', 'pre',
                'noscript', '.skip', '.notice', '.crumbs',
                '.jump-nav', '.signals', '.assure', '.card', '.see-also',
                '.cta-band', '.related', '.grid--services'];

/**
 * Prose is read per block element, never as one textContent string. Reading the
 * whole subtree glues adjacent blocks together with no separator, so an eyebrow,
 * a heading and a note concatenate into a sentence nobody wrote — which is what
 * produced this tool's first three findings, all of them phantoms.
 */
const PROSE = 'p, li, dd, dt, figcaption, blockquote';

/**
 * Sentences that are meant to be identical everywhere they appear: navigational
 * one-liners and standing section notes. Each is here because somebody decided
 * it should repeat, which is the point of an explicit list — a new repeat has
 * to be argued for and added by hand rather than quietly tolerated.
 */
const BY_DESIGN = new Set([
  'See every city in Broward and Palm Beach County \u2192',
  'Serving Broward County and Palm Beach County \u2014 see every city we cover.',
  'Written to be useful whether or not you hire us.',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.p = new Map(); this.handlers = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      const r = this.p.get(m.id);
      if (r) { this.p.delete(m.id); m.error ? r.rej(new Error(m.error.message)) : r.res(m.result); return; }
      const h = this.handlers.get(m.method);
      if (h) h(m.params);
    }); }
  on(method, fn) { this.handlers.set(method, fn); }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.p.set(id, { res, rej })); }
}

const routes = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') routes.push(`/${d === 'dist' ? '' : `${d.slice(5)}/`}`);
  }
})('dist');

const chrome = spawn(CHROME_URL, ['--headless', '--disable-gpu', '--no-first-run',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/prose-${PORT}`, 'about:blank'], { stdio: 'ignore' });

let cdp;
for (let i = 0; i < 80; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const t = list.find((x) => x.type === 'page');
    if (t) { const ws = new WebSocket(t.webSocketDebuggerUrl);
      await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', j, { once: true }); });
      cdp = new CDP(ws); break; }
  } catch { /* not up yet */ }
  await sleep(200);
}
await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
// Chrome keeps a disk cache in --user-data-dir, and that directory is keyed on
// a constant port, so it survives between runs. Against a dev server that
// answers conditional requests, a tool run straight after a rebuild could be
// served the previous build and report on it. That is how a sentinel holding a
// known-bad claim passed twice out of three runs.
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

/* A fixed sleep here was wrong, and wrong in the direction that matters: run
   immediately after a rebuild, 300ms was sometimes not enough for the server to
   serve the new file, so the tool read the previous build and reported clean.
   A sentinel that reinstated a known bad claim passed because of it. Wait for
   the load event, with a ceiling so a page that never fires one cannot hang the
   run. One handler, registered once — registering inside the loop leaks a
   handler per route, which is a bug this project has already had once. */
let onLoad = null;
cdp.on('Page.loadEventFired', () => { if (onLoad) onLoad(); });
const waitForLoad = () =>
  new Promise((res) => {
    let done = false;
    const finish = () => { if (done) return; done = true; onLoad = null; res(); };
    const ceiling = setTimeout(finish, 8000);
    onLoad = () => { clearTimeout(ceiling); setTimeout(finish, 200); };
  });

/**
 * Runs in the page, so it closes over nothing here — the chrome selector list
 * is passed in. Returns the page's prose with block boundaries marked by U+0001.
 */
function extractProse(chromeSelectors) {
  const main = document.querySelector('main');
  if (!main) return '';
  chromeSelectors.forEach((sel) => main.querySelectorAll(sel).forEach((n) => n.remove()));
  const SEP = '\u0001';
  for (const el of main.querySelectorAll('*')) {
    if (getComputedStyle(el).display !== 'inline') el.appendChild(document.createTextNode(SEP));
  }
  // Two separate streams, deliberately. Appending headings onto the prose
  // string duplicated every one of them — textContent already contains them —
  // and the restatement check immediately reported five pairs at 1.00.
  // Duplication checks read prose; the typewriter check reads both, unfiltered,
  // because a short quoted heading never reaches the eight-word sentence floor.
  return JSON.stringify({
    prose: main.textContent.replace(/[ \t\n\r]+/g, ' ').trim(),
    headings: [...main.querySelectorAll('h1,h2,h3,h4,summary')]
      .map((h) => h.textContent.replace(/[ \t\n\r]+/g, ' ').trim())
      .filter(Boolean)
      .join(' | '),
  });
}

const sentences = new Map();
/** Route -> every rendered string, unfiltered, for the typography check. */
const rawText = new Map();
const restated = [];
for (const route of routes) {
  await cdp.send('Page.navigate', { url: BASE + route });
  await waitForLoad();
  // Block boundaries come from computed display, not from a list of tag names.
  // The definition lists are built from spans, so a tag-based selector treated a
  // term and its description as one run of text and glued "…original tile" onto
  // "A popular 2015-onward renovation…". getComputedStyle only works on attached
  // nodes, so this mutates the live document rather than a clone — the page is
  // discarded at the next navigation either way.
  // A function, serialised — not a template literal. Every escape below is a
  // real escape rather than one doubled to survive interpolation, and node
  // --check parses it. audit.mjs lost four checks to that difference.
  const expr = '(' + extractProse.toString() + ')(' + JSON.stringify(CHROME) + ')';

  const { result } = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true });
  const parsed = JSON.parse(result.value || '{"prose":"","headings":""}');
  rawText.set(route, parsed.prose + ' | ' + parsed.headings);
  const blocks = String(parsed.prose || '').split('\u0001')
    .map((b) => b.trim())
    .filter((b) => b.split(' ').length >= 18);
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const score = jaccard(contentWords(blocks[i]), contentWords(blocks[j]));
      if (score >= MAX_OVERLAP) restated.push({ route, score, a: blocks[i], b: blocks[j] });
    }
  }

  for (const raw of String(parsed.prose || '').split(/\u0001|(?<=[.?!])\s+/)) {
    const s = raw.trim();
    if (s.split(' ').length < 8) continue;          // fragments and labels are not prose
    if (!sentences.has(s)) sentences.set(s, new Set());
    sentences.get(s).add(route);
  }
}
chrome.kill();

const dups = [...sentences.entries()].filter(([, s]) => s.size > 1).sort((a, b) => b[1].size - a[1].size);
const findings = dups.filter(([s, on]) => on.size > MAX_PAGES && !BY_DESIGN.has(s));

console.log(`\n▸ Prose duplication — ${routes.length} pages, chrome excluded by selector\n`);
console.log(`  ${sentences.size} distinct sentences of 8+ words`);
console.log(`  ${dups.length} appear on more than one page`);
console.log(`  ${findings.length} appear on more than ${MAX_PAGES}\n`);
for (const [s, on] of findings) {
  console.log(`  ✗ ${on.size} pages: "${s.slice(0, 96)}${s.length > 96 ? '…' : ''}"`);
  console.log(`      ${[...on].slice(0, 4).join('  ')}${on.size > 4 ? '  …' : ''}`);
}
if (!args.includes('--quiet')) {
  const near = dups.filter(([, s]) => s.size > 1 && s.size <= MAX_PAGES);
  if (near.length) {
    console.log(`  ${near.length} sentence(s) on 2-${MAX_PAGES} pages (reported, not failed):`);
    near.slice(0, 6).forEach(([s, on]) => console.log(`      ${on.size}x "${s.slice(0, 76)}…"`));
  }
}
const typewriter = [...rawText.entries()]
  .filter(([, t]) => TYPEWRITER.test(t))
  .map(([route, t]) => ({ t, on: [route] }));
if (typewriter.length) {
  console.log(`\n  ${typewriter.length} sentence(s) using a straight quote or apostrophe:`);
  typewriter.slice(0, 6).forEach((m) => {
    const i = m.t.search(TYPEWRITER);
    console.log(`  ✗ ${m.on[0]}`);
    console.log(`      …${m.t.slice(Math.max(0, i - 40), i + 40)}…`);
  });
  console.log('      Use \u2019 \u201c \u201d. The data files are single-quoted, so ASCII breaks the build too.');
} else {
  console.log('  no straight quotes or apostrophes in body prose');
}

const measured = [...sentences.entries()]
  .filter(([t]) => MEASURED.test(t) && FIRST_PERSON.test(t))
  .map(([t, on]) => ({ t, on: [...on] }));
if (measured.length) {
  console.log(`\n  ${measured.length} claim(s) shaped like a measurement of this company's own results:`);
  measured.slice(0, 6).forEach((m) => {
    console.log(`  ✗ ${m.on[0]}`);
    console.log(`      ${m.t.slice(0, 110)}${m.t.length > 110 ? '…' : ''}`);
  });
  console.log('      Either evidence it or reword it. See the Numbers section of CONTENT-REVIEW.md.');
} else {
  console.log('  no claim states a measured share of this company\'s own results');
}

restated.sort((a, b) => b.score - a.score);
if (restated.length) {
  console.log(`\n  ${restated.length} block pair(s) on one page above ${MAX_OVERLAP} content-word overlap:`);
  for (const r of restated.slice(0, 6)) {
    console.log(`  ✗ ${r.score.toFixed(2)}  ${r.route}`);
    console.log(`      A: ${r.a.slice(0, 96)}…`);
    console.log(`      B: ${r.b.slice(0, 96)}…`);
  }
} else {
  console.log(`  no page restates itself above ${MAX_OVERLAP} overlap`);
}

const bad = findings.length + restated.length + measured.length + typewriter.length;
console.log(bad ? '\n✗ prose repeats itself\n' : '\n✓ no prose repeats across or within pages\n');
process.exit(bad ? 1 : 0);
