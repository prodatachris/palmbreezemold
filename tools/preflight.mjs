/**
 * Pre-launch claim check.
 *
 * LAUNCH.md used to tell you to grep dist/ for "PLACEHOLDER", "Example
 * Boulevard" and "MRSR-PENDING". That check gives false confidence, because it
 * only finds placeholders that announce themselves. The fabricated credentials
 * do not: "General liability & pollution liability insured" is a normal English
 * sentence sitting in the JSON-LD of every page, and "12 years" reads as a fact.
 * Fill in the license number and the address and that grep goes quiet while
 * three unverifiable claims about the business ship to 36 pages.
 *
 * So this checks the config fields themselves, and reports where each one has
 * actually reached the built site. A claim leaves the report by being confirmed
 * in site.config.js (add its key to `verified`), not by being reworded.
 *
 *   node tools/preflight.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '../src/site.config.js';

const CLAIMS = [
  ['license', 'Florida mold remediator license number', [site.license]],
  ['certifications', 'Technician certifications', site.certifications],
  ['insurance', 'Insurance cover', [site.insurance]],
  ['yearsInBusiness', 'Years in business', [`${site.yearsInBusiness} years`, String(site.foundingYear)]],
  ['address', 'Street address', [site.address.street]],
  ['email', 'Contact email address', [site.email]],
  ['origin', 'Domain name', [site.origin.replace('https://', '')]],
  ['phone', 'Phone number', [site.phoneDisplay]],
  // Not a credential, but the same kind of promise: it is checked by a
  // customer at 2am, and it was the one claim on the site with no gate.
  ['emergency', 'After-hours availability', [site.emergencyText]],
  // Made in page copy rather than in the config, so the needles come from
  // site.copyClaims — one list, shared with the build's drift guard, rather
  // than a second copy here that can fall out of step with it. Only the plain
  // string needles: this file does substring matching, and a context needle
  // ('$0' only when it sits near "walkthrough") would false-positive on the
  // exterior-algae guide, which uses $0 for what a homeowner spends on a
  // pruning saw. The build guard evaluates those with their context.
  ['freeWalkthrough', 'Free visual walkthrough and written scope',
    site.copyClaims.freeWalkthrough.needles.filter((n) => typeof n === 'string')],
  ['sameDayScope', 'Written scope delivered same day',
    site.copyClaims.sameDayScope.needles.filter((n) => typeof n === 'string')],
  ['clearanceRework', 'Re-remediation at our cost if clearance fails',
    site.copyClaims.clearanceRework.needles.filter((n) => typeof n === 'string')],
];

// One list, two consumers. If a claim is added to this table but not to
// site.claimKeys, launchReady would go true with that claim unconfirmed and the
// site would index itself while still asserting it.
{
  const table = CLAIMS.map(([k]) => k).sort().join(',');
  const config = [...site.claimKeys].sort().join(',');
  if (table !== config) {
    console.error(`\n✗ CLAIMS and site.claimKeys disagree:\n    preflight: ${table}\n    config:    ${config}\n`);
    process.exit(1);
  }
}

const files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html') || e.name.endsWith('.xml')) files.push(p);
  }
}
await walk('dist');
const pages = await Promise.all(files.map(async (f) => [f, await readFile(f, 'utf8')]));

// A needle taken straight from the config will not match the HTML if it holds
// a character the builder escapes. The insurance line contains an ampersand,
// and the first version of this file reported it absent from a build that had
// it on 36 pages — a false negative, which is the direction that actually
// hurts. Test both forms.
const escaped = (v) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const present = (html, needle) => html.includes(needle) || html.includes(escaped(needle));

const verified = new Set(site.verified || []);
let unconfirmed = 0;

console.log(`\n▸ Pre-launch claim check — ${pages.length} built files\n`);
for (const [key, label, needles] of CLAIMS) {
  const hits = new Map();
  for (const needle of needles.filter(Boolean)) {
    const n = pages.filter(([, html]) => present(html, needle)).length;
    if (n) hits.set(needle, n);
  }
  const live = [...hits.values()].reduce((a, b) => Math.max(a, b), 0);
  const ok = verified.has(key);
  if (!ok && live) unconfirmed++;
  const mark = ok ? '✓' : live ? '✗' : '·';
  console.log(`  ${mark} ${label}${ok ? '  (confirmed)' : ''}`);
  for (const [needle, n] of hits) {
    const shown = needle.length > 52 ? `${needle.slice(0, 52)}…` : needle;
    console.log(`      ${String(n).padStart(3)} file(s)  "${shown}"`);
  }
  if (!live) console.log('      not present in the build');
}

console.log(
  unconfirmed
    ? `\n✗ ${unconfirmed} claim(s) are live on the site and not yet confirmed.\n` +
      '  Confirm each one is true, then add its key to site.verified in src/site.config.js.\n' +
      '  Advertising remediation in Florida without the license is a violation, and the\n' +
      '  certifications and insurance line are equally checkable by a customer.\n'
    : '\n✓ Every claim the site makes about the business is marked confirmed.\n',
);
process.exit(unconfirmed ? 1 : 0);
