#!/usr/bin/env node
/**
 * Refuse to ship a build that would quietly go wrong.
 *
 * WHY THIS EXISTS SEPARATELY FROM preflight.mjs. preflight lists unconfirmed
 * claims and exits 0 whether it found any or not: it is a report for a person
 * about to launch, and that is the right shape for a person. Nothing in the
 * build fails on its findings either, because an unconfirmed claim only flips
 * `launchReady` false, and a false launchReady still BUILDS -- it just stamps
 * noindex on all 37 pages and empties the sitemap.
 *
 * That is fine when a human runs the build and reads the output. It is not
 * fine on a push-to-deploy pipeline, where the same condition means the site
 * silently leaves Google's index and nobody is watching the log.
 *
 * THE null CASE IS WHY THIS CHECKS RENDERED OUTPUT RATHER THAN CONFIG. Setting
 * site.license = null satisfied every claim check that existed and printed the
 * literal string "null" onto all 37 pages, in the footer and in the structured
 * data, for hours. The config was right and the pages were wrong, so the only
 * honest place to look is at what a reader would actually receive.
 *
 *   node tools/deploy-gate.mjs        (after a build; reads dist/)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const failures = [];

function pages(dir = DIST, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const html = pages();
if (html.length < 30) {
  failures.push(`only ${html.length} pages built; expected the full site. Did the build finish?`);
}

/** Read once, check many. */
const docs = html.map((p) => ({ path: p, body: readFileSync(p, 'utf8') }));

/* 1. THE SITEMAP AND THE PAGES MUST AGREE.
      The first version of this check failed any page carrying noindex, and it
      was wrong twice on its first real merge: 404.html is noindex on purpose,
      and so is the privacy page, which is also deliberately absent from the
      sitemap. Both are correct and the gate blocked a good deploy.

      The honest invariant is not "nothing is noindex". It is that a page the
      sitemap ASKS Google to index must not also tell Google not to. A page
      that is neither listed nor indexable is consistent, and it is nobody's
      bug. This also still catches the failure the check was written for: an
      unconfirmed claim flips launchReady, which noindexes the real pages AND
      empties the sitemap, so the emptiness is caught below. */
const sitemapRaw = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const listed = new Set(
  [...sitemapRaw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const path = m[1].replace(/^https?:\/\/[^/]+/, '');
    return path === '/' ? 'index.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`;
  }),
);
const contradictory = docs.filter((d) => {
  const rel = d.path.replace(/^dist\//, '');
  if (!listed.has(rel)) return false;
  return /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(d.body);
});
if (contradictory.length) {
  failures.push(
    `${contradictory.length} page(s) are in the sitemap AND carry noindex, which asks Google to ` +
      `index a page that forbids it: ${contradictory.map((d) => d.path).join(', ')}`,
  );
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = (sitemap.match(/<loc>/g) || []).length;
if (locs < 20) failures.push(`sitemap has ${locs} urls; an empty sitemap is the launchReady gate firing.`);

/* 2. THE null CASE, exactly as it shipped. A missing value must remove its row,
      not render its name. */
for (const d of docs) {
  if (/>null<|null&nbsp;|Lic\.\s*null|:\s*null\s*[,}]/.test(d.body)) {
    failures.push(`${d.path} renders the literal string "null" to a reader or to a crawler.`);
    break;
  }
}

/* 3. CREDENTIALS THIS BUSINESS DOES NOT HOLD. Florida licenses the activity,
      not the claim, and these strings were live once already. */
const forbidden = [
  ['MRSR-PENDING', 'a placeholder licence number'],
  ['1234 Example', 'the placeholder street address'],
  ['our number is on every page', 'a claim to publish a licence number'],
  ['We hold the remediator license', 'a claim to hold a state licence'],
];
for (const d of docs) {
  for (const [needle, what] of forbidden) {
    if (d.body.includes(needle)) failures.push(`${d.path} contains ${what} ("${needle}").`);
  }
}

/* 4. THE LEAD FORM. This is a lead-generation site; a contact page that cannot
      capture is the most expensive thing that can break without erroring. */
const contact = docs.find((d) => d.path.includes('contact'));
if (!contact) failures.push('no contact page in the build.');
else {
  if (!contact.body.includes('data-endpoint')) {
    failures.push('the contact form has no endpoint. Every enquiry typed into it would be discarded.');
  }
  if (/type="submit"[^>]*disabled/.test(contact.body)) {
    failures.push('the contact form submit button is disabled.');
  }
}

/* 5. ANALYTICS, once it has been configured. Losing the tag is invisible: the
      site works perfectly and simply stops reporting. */
const configured = readFileSync('src/site.config.js', 'utf8').match(/analyticsId:\s*'([^']+)'/);
if (configured) {
  const missing = docs.filter((d) => !d.body.includes(configured[1]));
  if (missing.length) failures.push(`${missing.length} page(s) are missing the analytics tag ${configured[1]}.`);
}

if (failures.length) {
  console.error(`\n✗ DEPLOY GATE: ${failures.length} problem(s). Nothing was deployed.\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}

console.log(`\n✓ deploy gate: ${html.length} pages, ${locs} sitemap urls, indexable, form live, tag present.\n`);
