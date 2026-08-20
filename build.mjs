#!/usr/bin/env node
/**
 * Static site build.
 *
 *   node build.mjs
 *
 * Reads src/, writes dist/. No dependencies, no lockfile, no toolchain.
 * Output is plain HTML that will run on any static host — Netlify, Cloudflare
 * Pages, S3, cPanel, or a Higgsfield deploy — with no server-side anything.
 */

import { mkdir, writeFile, cp, rm, readdir, stat, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import site from './src/site.config.js';
import { services, serviceBySlug } from './src/data/services.js';
import { areas, counties } from './src/data/areas.js';
import { guides } from './src/data/guides.js';
import { home, process as processContent, faqPage, about, contact, privacy, media, servicesHub, guidesHub } from './src/data/content.js';
import {
  page, url, abs, esc, text, paras,
  sectionHead, signals, deflist, stepList, faqList,
  serviceCard, relatedBlock, ctaBand, callBtn,
  airPathDiagram, airPathLegend,
  mediaHero, cardBg,
  jumpNav,
  anchorId,
  plain,
} from './src/lib/ui.js';

import {
  graph, faqNode, serviceNode, howToNode, articleNode,
} from './src/lib/schema.js';

/** Stable anchor ids from a heading, for in-page navigation. */
const slug = anchorId; // single definition lives in ui.js, beside the heading that consumes it

/** Alt text lives once, in the media registry, so it cannot drift per page. */
const altOf = (image) => media[image]?.alt || '';

/** The standard call-to-action pair used in every hero. */
const heroActions = `<div class="btn-row mhero__actions">
    ${callBtn()}
    <a class="btn btn--onink" href="${url.contact}">Request an inspection</a>
  </div>`;

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
/**
 * Per-page <lastmod>, taken from the modification time of the data file that
 * actually produces that page.
 *
 * A sitemap where all 30 URLs share one date is a sitemap Google learns to
 * ignore — uniform lastmod is the classic signal of a date that is generated
 * rather than true. Tying it to the source file means a city page's date moves
 * when you edit areas.js and stays put when you do not, which is the thing
 * lastmod is supposed to mean.
 */
const SRC = (f) => path.join(ROOT, 'src', f);
/**
 * Sitemap dates.
 *
 * Declared rather than taken from file mtimes. Guides state their own revision
 * date; everything else uses site.contentUpdated. Clamped so a clock skew or a
 * copied file cannot publish a date the site could not have been changed on.
 */
const dateFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: site.timezone,
  year: 'numeric', month: '2-digit', day: '2-digit',
});
const localDate = (d) => dateFmt.format(d);

function lastmodFor(route) {
  const today = localDate(new Date());
  const guide = guides.find((g) => route === url.guide(g.slug));
  const declared = guide ? (guide.updated || guide.published) : site.contentUpdated;
  return declared > today ? today : declared;
}

const written = [];

/**
 * The inline-link syntax must never reach the browser unrendered.
 *
 * It leaks in two ways: into a field consumed raw (a meta description, a
 * <title>, a heading), or into a surface that does not run through rich().
 * Both render the markup literally to the reader, and one of them shipped two
 * malformed meta descriptions before this existed.
 *
 * This lives in the build rather than in the browser probe on purpose — it is
 * plain Node, so there is no template-literal escaping to get wrong, and it
 * fails the build instead of failing a page later.
 */
function assertNoLeakedMarkup(route, html) {
  const LEAK = '](' + '/';
  const LEAK_EXT = '](' + 'https://';
  const found = [LEAK, LEAK_EXT].map((m) => html.indexOf(m)).filter((n) => n !== -1);

  /**
   * rich() renders links and nothing else, so every other markdown convention
   * reaches the reader as punctuation. Writing *assessment* for emphasis put
   * literal asterisks on a service page and the build had no opinion about it,
   * because the guard only knew about link syntax.
   *
   * Checked against the rendered body only, and only for patterns that appear
   * nowhere in the current output — measured before adding them, so none of
   * these can fire on prose that is already correct.
   */
  const body = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ');
  const EMPHASIS = [
    [/\*\*[^*\n]+\*\*/, 'bold with **'],
    [/(^|[\s(])\*[^*\s][^*\n]*\*/, 'italic with *'],
    [/(^|[\s(])_[^_\s][^_\n]*_/, 'italic with _'],
    [/`[^`\n]+`/, 'code with backticks'],
    [/(^|\n)#{1,6}\s/, 'a markdown heading'],
  ];
  for (const [re, label] of EMPHASIS) {
    const m = re.exec(body);
    if (!m) continue;
    throw new Error(
      `Unrendered ${label} in ${route}\n  ...${body.slice(Math.max(0, m.index - 50), m.index + 60).replace(/\s+/g, ' ')}...\n` +
      '  rich() renders links only. Use real words, or wrap the emphasis in HTML\n' +
      '  in the template rather than in the copy.',
    );
  }

  if (!found.length) return;
  const i = Math.min(...found);
  const context = html.slice(Math.max(0, i - 60), i + 40).replace(/\s+/g, ' ');
  throw new Error(
    `Unrendered link markup in ${route}\n  ...${context}...\n` +
    '  rich() renders links and nothing else — no bold, no italics, no code\n' +
    '  spans. Those are caught separately and by the same guard.\n' +
    '  Fields that DO render inline links, because they run through rich():\n' +
    '    intro / body paragraphs, section notes, deflist term and text,\n' +
    '    step text and step check, FAQ answers.\n' +
    '  Fields that do NOT, because they are also used as plain text elsewhere:\n' +
    '    title, description, name, h1, lede (feeds the meta description and the\n' +
    '    card), signal labels, captions, eyebrows.\n' +
    '  Move the link into one of the first group, or add rich() to the surface.',
  );
}

async function emit(route, html) {
  assertNoLeakedMarkup(route, html);
  const file = route === '/404.html'
    ? path.join(DIST, '404.html')
    : path.join(DIST, route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  written.push(route);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Home
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildHome() {
  const p = '/';
  const hvac = serviceBySlug['hvac-air-conditioner-mold-remediation'];

  const body = `
${mediaHero({
  eyebrow: home.eyebrow,
  h1: home.h1,
  lede: home.lede,
  image: 'air-handler-closet',
  video: 'hero-air-handler',
  alt: altOf('air-handler-closet'),
  actions: heroActions,
  caption: 'Air handler, evaporator coil and drain pan: the wettest assembly in a South Florida house.',
  extra: `<dl class="assure assure--onink">
      ${home.assurances
        .map(
          (a) => `<div><dt class="assure__label">${text(a.label)}</dt><dd class="assure__val">${text(a.text)}</dd></div>`,
        )
        .join('\n      ')}
    </dl>`,
})}

<section class="section section--ruled defer" id="mechanism">
  <div class="wrap">
    ${sectionHead({ eyebrow: home.thesis.eyebrow, h2: home.thesis.h2, wide: true })}
    <div class="mech">
      <div class="body-block">${paras(home.thesis.body)}</div>
      <div class="dg-runway">
      <figure class="diagram">
        ${airPathDiagram('home')}
        <figcaption>Fig. 1: Air path through a typical Broward or Palm Beach single-story home. Markers 1&ndash;5 are the five commonest places growth turns up, numbered in the order the air reaches them.</figcaption>
      </figure>
      </div>
    </div>
    <div class="mt-lg">${airPathLegend()}</div>
  </div>
</section>

<section class="section section--wash defer">
  <div class="wrap">${signals(hvac.signals)}</div>
</section>

<section class="section defer" id="services">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Services',
      h2: 'What we do, and what we will tell you not to buy',
      note: 'Six services. The first one is where most South Florida mold problems actually live, which is why it is the one we built the company around.',
    })}
    <div class="grid grid--services">
      ${services.map(serviceCard).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: home.whyDifferent.eyebrow, h2: home.whyDifferent.h2, wide: true })}
    ${deflist(home.whyDifferent.items.map((i) => ({ term: i.title, text: i.text })))}
    <p class="mt-lg"><a class="btn btn--ghost" href="${url.process}">See every stage of the process <span class="arr">&rarr;</span></a></p>
  </div>
</section>

<section class="section section--ruled defer" id="areas">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Coverage',
      h2: 'Broward and Palm Beach County, end to end',
      note: 'Housing stock changes every few miles down here, and so do the failure modes. Pick your city for what we actually find there.',
    })}
    ${counties
      .map(
        (c) => `<div class="county">
      <div class="county__head">
        <h3 class="h3">${esc(c.name)}</h3>
        <span class="county__count">${c.areas.length} city pages &middot; ${c.alsoServing.length}+ more served</span>
      </div>
      <ul class="chips" role="list">
        ${c.areas.map((a) => `<li><a href="${url.area(a.slug)}">${esc(a.name)}</a></li>`).join('\n        ')}
      </ul>
    </div>`,
      )
      .join('\n    ')}
    <p class="mt-lg"><a class="btn btn--ghost" href="${url.areas}">Full coverage map <span class="arr">&rarr;</span></a></p>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({ eyebrow: 'Common questions', h2: 'Before you call' })}
    ${faqList(home.faqs)}
    <p class="mt-lg"><a class="btn btn--ghost" href="${url.faq}">All questions <span class="arr">&rarr;</span></a></p>
  </div>
</section>

${ctaBand({
  eyebrow: 'Start here',
  h2: 'Tell us what you are seeing, across Broward and Palm Beach',
  body: 'Most of what we need to know takes about four minutes on the phone. Bring the smell, the stain, or the air quality result you do not understand.',
})}`;

  await emit(p, page({
    path: p,
    title: home.title,
    description: home.description,
    body,
    ogImage: 'air-handler-closet',
    ogImageAlt: altOf('air-handler-closet'),
    schema: [graph({
      path: p,
      title: home.title,
      description: home.description,
      image: 'air-handler-closet',
      imageAlt: altOf('air-handler-closet'),
      extra: [faqNode(home.faqs, '/')],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Services hub + service pages
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildServices() {
  const p = url.services;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Services' }];
  const title = 'Mold Remediation Services | Broward & Palm Beach FL';
  const description =
    'Mold remediation, HVAC and AC mold removal, inspection and testing, duct cleaning, black mold removal, and water damage cleanup across South Florida.';

  const body = `
${mediaHero({
  eyebrow: 'Services',
  h1: 'Six services, and an honest read on which one you need',
  lede: 'Every page below explains the mechanism, not just the offer: what causes the problem in South Florida specifically, what the work involves, and where the industry cuts corners.',
  image: 'duct-board-plenum',
  alt: altOf('duct-board-plenum'),
  caption: 'Fiberglass duct board plenum interior. Cleaning does not restore a colonized fiber mat.',
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap">
    <div class="grid grid--services">
      ${services.map(serviceCard).join('\n      ')}
    </div>
  </div>
</section>

${servicesHub.sections.map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({
      eyebrow: 'Not sure which',
      h2: 'A short way to figure out where to start',
      wide: true,
    })}
    ${deflist([
      { term: 'You can smell it when the AC runs', text: 'Start with HVAC and AC mold remediation. A smell that tracks with the air conditioning cycle is coming from the equipment or the ducts, not from a room.' },
      { term: 'You can see it on a wall or ceiling', text: 'Start with mold remediation. If there is a dark ring specifically around an AC register, read the HVAC page too. That is a condensation pattern, not a roof leak.' },
      { term: 'Something is wet right now', text: 'Water damage and mold cleanup, today. The window between a water loss and a mold job is about two days in this climate.' },
      { term: 'You have symptoms but cannot find anything', text: 'Mold inspection and testing. That is the case where sampling genuinely earns its cost, because you need to know whether there is an interior source at all.' },
      { term: 'You are buying a house', text: 'Mold inspection and testing, from an independent licensed assessor. A standard home inspection is not a mold assessment and most inspectors say so in their own report.' },
      { term: 'Somebody quoted you duct cleaning', text: 'Read the duct cleaning page before you buy it. We turn that work down regularly, and the page explains when it is worth doing and when it is not.' },
    ])}
  </div>
</section>

${ctaBand({})}`;

  await emit(p, page({
    path: p, title, description, body, trail,
    ogImage: 'duct-board-plenum', ogImageAlt: altOf('duct-board-plenum'),
    schema: [graph({ path: p, title, description, trail, pageType: 'CollectionPage',
      image: 'duct-board-plenum', imageAlt: altOf('duct-board-plenum') })],
  }));

  for (const s of services) {
    await buildServicePage(s);
  }
}

function renderSection(sec) {
  const inner = [
    sec.body ? `<div class="body-block">${paras(sec.body)}</div>` : '',
    sec.list ? `<div class="mt-md">${deflist(sec.list)}</div>` : '',
    sec.steps ? `<div class="mt-md">${stepList(sec.steps)}</div>` : '',
  ].filter(Boolean).join('\n      ');

  if (sec.flag) {
    return `<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    <div class="flagbox">
      <h2 class="h3" id="${anchorId(sec.h2)}" tabindex="-1">${text(sec.h2)}</h2>
      ${sec.note ? `<p class="flagbox__note">${text(sec.note)}</p>` : ''}
      ${inner}
    </div>
  </div>
</section>`;
  }

  return `<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ h2: sec.h2, note: sec.note, wide: true })}
    ${inner}
  </div>
</section>`;
}

/** Which FAQ group a service page's readers most likely want next. Rendering
 *  concern, not content — so it lives here rather than in services.js. */
const FAQ_GROUP_FOR = {
  'hvac-air-conditioner-mold-remediation': 'Air conditioning and ductwork',
  'air-duct-cleaning-sanitizing': 'Air conditioning and ductwork',
  'mold-inspection-testing': 'Getting started',
  'mold-remediation': 'Cost and insurance',
  'water-damage-mold-cleanup': 'Cost and insurance',
  'black-mold-removal': 'Health, safety, and living through it',
};

async function buildServicePage(s) {
  const p = url.service(s.slug);
  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: url.services },
    { name: s.nav },
  ];

  const isHvac = s.slug === 'hvac-air-conditioner-mold-remediation';
  // The questions block at the foot is a real destination, so it belongs in the map.
  const nav = jumpNav([...s.sections.map((x) => ({ title: x.h2 })), { title: `${s.navLong}: what people ask` }]);
  // Guides that name this service. The guides already link out to services;
  // this closes the loop so the link graph runs both ways.
  const svcGuides = guides.filter((g) => g.relatedServices.includes(s.slug));

  const body = `
${mediaHero({
  eyebrow: s.eyebrow,
  h1: s.h1,
  lede: s.lede,
  image: s.media.image,
  video: s.media.video || null,
  alt: altOf(s.media.image),
  caption: s.media.caption,
  actions: heroActions,
})}

<section class="section section--wash">
  <div class="wrap">${signals(s.signals)}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="body-block">${paras(s.intro)}</div>
    ${isHvac ? `
    <div class="dg-runway">
    <figure class="diagram mt-lg">
      ${airPathDiagram('svc')}
      <figcaption>Fig. 1: The air path, numbered in the order the air reaches each point. These are five of the seven places listed below; the list is ordered by how often we find each one instead, so the numbers here and the numbers there are answering different questions.</figcaption>
    </figure>
    </div>` : ''}
    ${nav}
  </div>
</section>

${s.sections.map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({ eyebrow: 'Questions', h2: `${s.navLong}: what people ask` })}
    ${faqList(s.faqs)}
    ${(() => {
      const g = faqPage.groups.find((x) => x.title === FAQ_GROUP_FOR[s.slug]);
      const total = faqPage.groups.reduce((n, x) => n + x.faqs.length, 0);
      return g
        ? `<p class="see-also">The <a href="${url.faq}#${anchorId(g.title)}">${esc(
            g.title.toLowerCase(),
          )}</a> section of our FAQ goes further, and there are ${total} questions answered there in all.</p>`
        : '';
    })()}
  </div>
</section>

${svcGuides.length ? `
<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Worth reading',
      h2: 'Guides that go deeper on this',
      note: 'Written to be useful whether or not you hire us.',
    })}
    <div class="related">
      ${svcGuides
        .map(
          (g) => `<a href="${url.guide(g.slug)}">
        <span class="related__e">${esc(g.eyebrow)}</span>
        <span class="related__t">${esc(g.nav)}</span>
      </a>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>` : ''}

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Related', h2: 'Where people go from here' })}
    ${relatedBlock(s.related, services)}
    <p class="mt-lg muted">Serving ${counties.map((c) => c.name).join(' and ')}. <a href="${url.areas}">See every city we cover</a>.</p>
  </div>
</section>

${ctaBand(s.cta || {})}`;

  await emit(p, page({
    path: p,
    title: s.title,
    description: s.description,
    body,
    trail,
    ogImage: s.media.image,
    ogImageAlt: altOf(s.media.image),
    schema: [graph({
      path: p,
      title: s.title,
      description: s.description,
      trail,
      image: s.media.image,
      imageAlt: altOf(s.media.image),
      extra: [
        serviceNode({
          name: s.navLong,
          description: s.description,
          path: p,
          serviceType: s.navLong,
        }),
        faqNode(s.faqs, p),
      ],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Service areas hub + city pages
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildAreas() {
  const p = url.areas;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Service Areas' }];
  const title = 'Service Areas | Mold Remediation Broward & Palm Beach';
  const description =
    'Every city we cover across Broward and Palm Beach County, from Hallandale Beach to Jupiter, with what the housing stock in each one actually does.';

  const body = `
${mediaHero({
  eyebrow: 'Coverage',
  h1: 'Broward and Palm Beach County, city by city',
  lede: site.serviceRadiusNote + ' Housing stock changes every few miles down here: a 1952 CBS ranch in Victoria Park and a 2004 Valencia home in Boynton fail in completely different ways.',
  image: 'broward-street',
  alt: altOf('broward-street'),
  caption: 'East Broward concrete block and stucco, mid-century. Sealed up decades after it was built to breathe.',
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap">
    ${counties
      .map(
        (c) => `<div class="county">
      <div class="county__head">
        <h2 class="h3" id="${anchorId(c.name)}" tabindex="-1">${esc(c.name)}</h2>
        <span class="county__count">${c.areas.length} detailed pages</span>
      </div>
      <p class="muted maxprose">${text(c.blurb)}</p>

      <div class="grid grid--3 mt-lg">
        ${c.areas
          .map(
            (a) => `<a class="card card--photo" href="${url.area(a.slug)}">
          ${cardBg(a.media.image, '', a.media.focus)}
          <span class="card__eyebrow">${esc(c.short)} County</span>
          <span class="card__t">${esc(a.name)}</span>
          <span class="card__d">${text(a.short)}</span>
          <span class="card__more">What we find here <span class="arr">&rarr;</span></span>
        </a>`,
          )
          .join('\n        ')}
      </div>

      <div class="mt-lg">
        <p class="eyebrow eyebrow--mist">Also serving in ${esc(c.short)}</p>
        <ul class="chips mt-md" role="list">
          ${c.alsoServing.map((n) => `<li><span>${esc(n)}</span></li>`).join('\n          ')}
        </ul>
      </div>
    </div>`,
      )
      .join('\n\n    ')}
  </div>
</section>

${ctaBand({
  h2: 'Not sure if you are in the service area?',
  body: 'If you are between Hallandale Beach and Jupiter, you are. Call and we will tell you the soonest we can be there.',
})}`;

  await emit(p, page({
    path: p, title, description, body, trail,
    ogImage: 'broward-street', ogImageAlt: altOf('broward-street'),
    schema: [graph({ path: p, title, description, trail, pageType: 'CollectionPage',
      image: 'broward-street', imageAlt: altOf('broward-street') })],
  }));

  for (const a of areas) {
    await buildAreaPage(a);
  }
}

async function buildAreaPage(a) {
  const p = url.area(a.slug);
  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Service Areas', href: url.areas },
    { name: a.name },
  ];
  const nearby = a.nearby.map((sl) => areas.find((x) => x.slug === sl)).filter(Boolean);
  // Guides that name this city as one they were written for. Cross-linked both
  // ways so the guide is reachable from the pages whose readers most need it.
  const cityGuides = guides.filter((g) => g.relevantAreas.includes(a.slug));

  const body = `
${mediaHero({
  eyebrow: `${a.county} County`,
  h1: `Mold remediation in ${a.name}, Florida`,
  lede: a.lede,
  image: a.media.image,
  alt: altOf(a.media.image),
  // The hero images are shared between cities on purpose: the lake-lot photo
      // serves Miramar, Pembroke Pines and Wellington because those three are the
      // same drained-wetland stock, and the bungalow serves Hollywood and Lake
      // Worth Beach because both are genuinely wood-framed. The old caption threw
      // that away — it named the city and then said nothing, identically on all
      // eighteen pages. Naming the neighbors makes the shared failure mode the
      // point.
      caption: (() => {
        const kin = areas.filter((x) => x.media.image === a.media.image && x.slug !== a.slug)
          .map((x) => `[${x.name}](${url.area(x.slug)})`);
        if (!kin.length) return `Typical ${a.name} housing stock. The failure modes below follow from how these houses were built.`;
        const list = kin.length === 1 ? kin[0] : `${kin.slice(0, -1).join(', ')} and ${kin[kin.length - 1]}`;
        return `Housing stock ${a.name} shares with ${list}, which is why the failure modes below are the same in all of them.`;
      })(),
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap">
    <div class="body-block">${paras(a.intro)}</div>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Local conditions', h2: a.watchHeadline, wide: true })}
    ${deflist(a.watch)}
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Services',
      h2: `What we do in ${a.name}`,
      // Names the city's own defining condition rather than asserting the same
      // thing eighteen times. The previous version interpolated the city name
      // into an identical claim — "in <city> the air conditioning work is the
      // one we are called for most" — which reads as local and is not, and
      // asserts a per-city call mix nobody has measured.
      // One sentence, not two: splitting it left "The same six services across
      // Palm Beach County." standing alone on nine pages, which the prose check
      // correctly failed. The city-specific half has to be in the same sentence
      // as the shared half for the whole line to be distinct.
      note: `The same six services run across ${a.county} County, and which of them a job turns into depends on what is actually happening: in ${a.name} that usually starts with ${
        a.watch && a.watch[0] ? a.watch[0].term.charAt(0).toLowerCase() + a.watch[0].term.slice(1) : 'the conditions above'
      }.`,
    })}
    <div class="grid grid--services">
      ${services.map(serviceCard).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Where we work', h2: `${a.name} neighborhoods and ZIP codes` })}
    <ul class="chips" role="list">
      ${a.neighborhoods.map((n) => `<li><span>${esc(n)}</span></li>`).join('\n      ')}
    </ul>
    <p class="ziplist mt-lg">ZIP codes served: ${a.zips.map(esc).join(' &middot; ')}</p>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({ eyebrow: 'Questions', h2: `Mold questions from ${a.name} homeowners` })}
    ${faqList(a.faqs)}
  </div>
</section>

${cityGuides.length ? `
<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({
      eyebrow: 'Worth reading',
      h2: `Written for ${a.name} homeowners`,
      // No note here on purpose. It used to carry one generic sentence calling
      // seasonal vacancy "the leading cause of mold calls in this area" — a
      // claim nobody has measured, repeated word for word on all eight cities
      // that get this block. The heading is already city-specific and the cards
      // below name the guides, so the note was adding a weak claim and a
      // templated feel and nothing else.
    })}
    <div class="related">
      ${cityGuides
        .map(
          (g) => `<a href="${url.guide(g.slug)}">
        <span class="related__e">${esc(g.eyebrow)}</span>
        <span class="related__t">${esc(g.nav)}</span>
      </a>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>` : ''}

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Nearby', h2: 'Other areas we cover' })}
    <div class="related">
      ${nearby
        .map(
          (n) => `<a href="${url.area(n.slug)}">
        <span class="related__e">${esc(n.county)} County</span>
        <span class="related__t">Mold remediation in ${esc(n.name)}</span>
      </a>`,
        )
        .join('\n      ')}
    </div>
    <p class="mt-lg muted"><a href="${url.areas}">See every city in Broward and Palm Beach County &rarr;</a></p>
  </div>
</section>

${ctaBand({
  h2: `Serving ${a.name} and the rest of ${a.county} County`,
  // Not site.responseWindow — ctaBand() already prints that under the phone,
  // so echoing it here put the identical sentence twice in one band, about
  // 130px apart on a phone.
  body: `Tell us the neighborhood and what you are seeing. The failure modes in ${a.name} are specific enough that the call usually narrows it before anyone drives out.`,
})}`;

  await emit(p, page({
    path: p,
    title: a.title,
    description: a.description,
    body,
    trail,
    ogImage: a.media.image,
    ogImageAlt: altOf(a.media.image),
    schema: [graph({
      path: p,
      title: a.title,
      description: a.description,
      trail,
      image: a.media.image,
      imageAlt: altOf(a.media.image),
      extra: [
        serviceNode({
          name: `Mold remediation in ${a.name}, Florida`,
          description: a.description,
          path: p,
          serviceType: 'Mold remediation',
          areaName: a.name,
        }),
        faqNode(a.faqs, p),
      ],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Guides
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildGuides() {
  const p = url.guides;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Guides' }];
  const title = 'Guides | Mold and Humidity in South Florida Homes';
  const description =
    'Practical guides for Broward and Palm Beach homeowners on humidity, seasonal vacancy, and keeping mold out of a South Florida house.';

  const body = `
${mediaHero({
  eyebrow: 'Guides',
  h1: 'The questions that do not fit on a service page',
  lede: 'Written to be useful whether or not you ever call us. If a guide here does not tell you something you can act on this week, it should not be here.',
  image: 'broward-street',
  alt: altOf('broward-street'),
  caption: 'Written for the houses we actually work in, not for search engines.',
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap">
    <div class="grid grid--services">
      ${guides
        .map(
          (g) => `<a class="card card--photo" href="${url.guide(g.slug)}">
        ${cardBg(g.media.image, '')}
        <span class="card__eyebrow">${esc(g.eyebrow)}</span>
        <span class="card__t">${text(g.nav)}</span>
        <span class="card__d">${text(g.short)}</span>
        <span class="card__more">Read the guide <span class="arr">&rarr;</span></span>
      </a>`,
        )
        .join('\n      ')}
    </div>
    <p class="mt-lg muted maxprose">More are coming. If there is something you wish somebody had explained to you before you had a mold problem, tell us and we will write it.</p>
  </div>
</section>

${guidesHub.sections.map(renderSection).join('\n\n')}

${ctaBand({})}`;

  await emit(p, page({
    path: p, title, description, body, trail,
    ogImage: 'broward-street', ogImageAlt: altOf('broward-street'),
    schema: [graph({ path: p, title, description, trail, pageType: 'CollectionPage',
      image: 'broward-street', imageAlt: altOf('broward-street') })],
  }));

  for (const g of guides) await buildGuidePage(g);
}

async function buildGuidePage(g) {
  const p = url.guide(g.slug);
  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: url.guides },
    { name: g.nav },
  ];
  const cities = g.relevantAreas.map((sl) => areas.find((a) => a.slug === sl)).filter(Boolean);
  const checklist = g.sections.find((sec) => sec.steps);

  const body = `
${mediaHero({
  eyebrow: g.eyebrow,
  h1: g.h1,
  lede: g.lede,
  image: g.media.image,
  video: g.media.video || null,
  alt: altOf(g.media.image),
  caption: g.media.caption,
  actions: heroActions,
})}

<section class="section section--wash">
  <div class="wrap">${signals(g.signals)}</div>
</section>

<section class="section">
  <div class="wrap">
  ${(() => {
    // Readers were told nothing about how current this is, while the schema
    // asserted two dates to machines. Emergency advice in particular earns the
    // question, so it is answered on the page.
    const fmt = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', {
      timeZone: site.timezone, year: 'numeric', month: 'long', day: 'numeric',
    });
    const up = g.updated && g.updated !== g.published;
    return `<p class="byline">
      <time datetime="${g.published}">Published ${fmt(g.published)}</time>${
      up ? ` &middot; <time datetime="${g.updated}">last revised ${fmt(g.updated)}</time>` : ''
    }</p>`;
  })()}
  <div class="body-block">${paras(g.intro)}</div>
  ${jumpNav([...g.sections, { h2: 'What people ask about this' }].map((x) => ({ title: x.h2 })))}</div>
</section>

${g.sections.map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    ${sectionHead({ eyebrow: 'Questions', h2: 'What people ask about this' })}
    ${faqList(g.faqs)}
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${cities.length ? `${sectionHead({
      eyebrow: 'Where this matters most',
      h2: 'The communities this comes up in',
      // Per guide. This was hardcoded to the seasonal-occupancy line, so the
      // exterior-algae guide told readers its city list was about seasonal vacancy.
      note: g.areasNote || 'These are the pages that go into the local housing stock in detail.',
    })}
    <div class="related">
      ${cities
        .map(
          (a) => `<a href="${url.area(a.slug)}">
        <span class="related__e">${esc(a.county)} County</span>
        <span class="related__t">Mold remediation in ${esc(a.name)}</span>
      </a>`,
        )
        .join('\n      ')}
    </div>
    <div class="mt-lg">${relatedBlock(g.relatedServices, services)}</div>` : `${sectionHead({
      eyebrow: 'Related',
      h2: 'Where people go from here',
    })}
    ${relatedBlock(g.relatedServices, services)}
    <p class="mt-lg muted"><a href="${url.process}">See every stage of a real remediation &rarr;</a>. It is the page this guide is asking you to hold a contractor to.</p>`}
  </div>
</section>

${ctaBand(g.cta || {})}`;

  await emit(p, page({
    path: p,
    title: g.title,
    description: g.description,
    body,
    trail,
    ogImage: g.media.image,
    ogImageAlt: altOf(g.media.image),
    schema: [graph({
      path: p,
      title: g.title,
      description: g.description,
      trail,
      image: g.media.image,
      imageAlt: altOf(g.media.image),
      extra: [
        articleNode({
          path: p,
          headline: g.h1,
          description: g.description,
          image: g.media.image,
          imageAlt: altOf(g.media.image),
          published: g.published,
          modified: g.updated || g.published,
          section: 'Guides',
        }),
        checklist
          ? howToNode({
              // Derived, not hardcoded: this was one guide's title applied to
              // every guide, so three shipped a step list announcing the wrong
              // article.
              name: `${plain(checklist.h2)}: ${plain(g.h1)}`,
              description: g.description,
              steps: checklist.steps,
              path: p,
            })
          : null,
        faqNode(g.faqs, p),
      ],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Process
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildProcess() {
  const p = url.process;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Process' }];

  const body = `
${mediaHero({
  eyebrow: processContent.eyebrow,
  h1: processContent.h1,
  lede: processContent.lede,
  image: 'containment',
  alt: altOf('containment'),
  caption: 'Containment, negative air, and source removal. Every stage on this page is one you can verify yourself.',
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap wrap--mid">
    <div class="body-block">${paras(processContent.intro)}</div>
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Ten stages',
      h2: 'Every stage, and how to verify it is happening',
      note: 'The “how to check” note on each stage is something you can confirm yourself, without any equipment, while the crew is in your house.',
      wide: true,
    })}
    ${stepList(processContent.steps)}
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    <div class="flagbox">
      <h2 class="h3">The two stages that get skipped</h2>
      <p>Detail cleaning and independent clearance. They are skipped for the same reason: they are invisible to the customer and they cost the contractor money.</p>
      <p>Detail cleaning is why a job passes clearance, because settled spores across the containment are what the sampling actually measures. Independent clearance is what makes the pass mean anything at all. If a company offers to test their own work, you have learned everything you need to know about how they operate.</p>
    </div>
  </div>
</section>

${ctaBand({
  h2: 'Ask us to walk you through the scope before you commit',
  body: 'We would rather spend twenty minutes explaining what is on the estimate than have you sign something you cannot evaluate.',
})}`;

  await emit(p, page({
    path: p,
    title: processContent.title,
    description: processContent.description,
    body,
    trail,
    ogImage: 'containment',
    ogImageAlt: altOf('containment'),
    schema: [graph({
      path: p,
      title: processContent.title,
      description: processContent.description,
      trail,
      image: 'containment',
      imageAlt: altOf('containment'),
      extra: [
        howToNode({
          name: 'The mold remediation process',
          description: processContent.description,
          steps: processContent.steps,
          path: p,
        }),
      ],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildFaq() {
  const p = url.faq;
  const trail = [{ name: 'Home', href: '/' }, { name: 'FAQ' }];
  const all = faqPage.groups.flatMap((g) => g.faqs);

  const body = `
<section class="wrap phead">
  <span class="eyebrow">${text(faqPage.eyebrow)}</span>
  <h1>${text(faqPage.h1)}</h1>
  <p class="lede">${text(faqPage.lede)}</p>
</section>

<section class="section section--ruled">
  <div class="wrap wrap--mid">
    ${jumpNav(
      faqPage.groups.map((g) => ({ title: g.title, count: g.faqs.length })),
      { label: `${faqPage.groups.length} sections`, counts: true },
    )}

    ${faqPage.groups
      .map(
        (g) => `<div class="faq-group defer">
      <h2 class="faq-group__t" id="${slug(g.title)}" tabindex="-1">${text(g.title)}</h2>
      ${faqList(g.faqs)}
    </div>`,
      )
      .join('\n    ')}
  </div>
</section>

${ctaBand({
  h2: 'Still not sure what you are looking at?',
  body: 'Send us a photo and a description. We will tell you whether it is a repair, a remediation, or nothing at all.',
})}`;

  await emit(p, page({
    path: p,
    title: faqPage.title,
    description: faqPage.description,
    body,
    trail,
    schema: [graph({
      path: p, title: faqPage.title, description: faqPage.description, trail,
      extra: [faqNode(all, p)],
    })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   About
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildAbout() {
  const p = url.about;
  const trail = [{ name: 'Home', href: '/' }, { name: 'About' }];

  const body = `
${mediaHero({
  eyebrow: about.eyebrow,
  h1: about.h1,
  lede: about.lede,
  image: 'air-handler-closet',
  alt: altOf('air-handler-closet'),
  caption: 'We open the cabinet before we look at the wall. That is the whole difference.',
  actions: heroActions,
})}

<section class="section section--ruled">
  <div class="wrap wrap--mid">
    <div class="body-block">${paras(about.body)}</div>
  </div>
</section>

${(about.sections || []).map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Principles', h2: 'Four things that are true of every job we run', wide: true })}
    ${deflist(about.principles.map((x) => ({ term: x.title, text: x.text })))}
  </div>
</section>

<section class="section section--ruled defer">
  <div class="wrap">
    ${/*
      EVERY ROW IS CONDITIONAL, and the section itself disappears when they all
      are. Nulling site.license without this printed the literal string "null"
      to visitors on 37 pages, next to a label reading "FL Mold Remediator Lic."
      -- a worse statement than the placeholder it replaced, and one the launch
      checks did not catch because preflight only looks for claim VALUES that
      reached the build, and "null" is not one of them.

      An absent credential is not a credential with an empty value. It is a
      thing the site does not say.
    */''}
    ${(() => {
      const rows = [];
      if (site.license) rows.push(`<li><span class="deflist__t">${esc(site.licenseLabel)}</span><span class="deflist__d">${esc(site.license)}</span></li>`);
      if (site.certifications && site.certifications.length) rows.push(`<li><span class="deflist__t">Certifications</span><span class="deflist__d">${site.certifications.map(text).join('<br>')}</span></li>`);
      if (site.insurance) rows.push(`<li><span class="deflist__t">Insurance</span><span class="deflist__d">${text(site.insurance)}</span></li>`);
      rows.push(`<li><span class="deflist__t">In business since</span><span class="deflist__d">${site.foundingYear}${site.yearsInBusiness > 0 ? ` (${site.yearsInBusiness} year${site.yearsInBusiness === 1 ? '' : 's'})` : ''} across Broward and Palm Beach County.</span></li>`);
      return `${sectionHead({ eyebrow: 'The company', h2: 'Who you are hiring' })}
    <ul class="deflist" role="list">
      ${rows.join('\n      ')}
    </ul>`;
    })()}
  </div>
</section>

${ctaBand({})}`;

  await emit(p, page({
    path: p, title: about.title, description: about.description, body, trail,
    ogImage: 'air-handler-closet', ogImageAlt: altOf('air-handler-closet'),
    schema: [graph({ path: p, title: about.title, description: about.description, trail,
      pageType: 'AboutPage',
      image: 'air-handler-closet', imageAlt: altOf('air-handler-closet') })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Contact
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildContact() {
  const p = url.contact;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Contact' }];
  const f = contact.form;

  const formHtml = `
<form class="form" ${f.hasBackend && f.endpoint
    ? `data-endpoint="${esc(f.endpoint)}" data-client-id="${esc(f.clientId)}" onsubmit="return false"`
    : f.hasBackend ? `action="${esc(f.action)}" method="POST"` : 'onsubmit="return false"'}>
  ${f.hasBackend ? '' : `<p class="notice"><b>This form is not taking messages yet</b>Nothing typed here will reach us. Call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a> instead and we will take it from there.</p>`}
  ${f.hasBackend && f.endpoint ? `<noscript><p class="notice"><b>This form needs JavaScript</b>It is switched off in this browser, so nothing typed here can be sent. Call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a> and we will take it from there.</p></noscript>` : ''}
  <p class="form__status" data-form-status hidden></p>
  <div class="field-row">
    <div class="field">
      <label for="name">Your name <span class="field__req">required</span></label>
      <input id="name" name="name" type="text" autocomplete="name" required>
    </div>
    <div class="field">
      <label for="phone">Phone <span class="field__req">required</span></label>
      <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
    </div>
  </div>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" inputmode="email" autocomplete="email">
  </div>
  <div class="field">
    <label for="city">City</label>
    <input id="city" name="city" type="text" autocomplete="address-level2" list="cities" placeholder="Fort Lauderdale">
    <datalist id="cities">
      ${areas.map((a) => `<option value="${esc(a.name)}">`).join('\n      ')}
    </datalist>
  </div>
  <div class="field">
    <label for="issue">What are you seeing?</label>
    <select id="issue" name="issue">
      <option>Musty smell when the AC runs</option>
      <option>Visible growth on a wall or ceiling</option>
      <option>Dark ring around an AC vent</option>
      <option>Active water leak or recent flooding</option>
      <option>Air quality test I do not understand</option>
      <option>Buying or selling a property</option>
      <option>Something else</option>
    </select>
  </div>
  <div class="field">
    <label for="detail">Anything else worth knowing</label>
    <textarea id="detail" name="detail" aria-describedby="detail-hint" placeholder="How long it has been going on, whether anything is wet right now, the age of the house and the AC system."></textarea>
    <p class="field__hint" id="detail-hint">The age of the air handler is genuinely useful. So is whether the smell is worst in the first minute of a cycle.</p>
  </div>
  <div>
    <button class="btn btn--call" type="submit"${f.hasBackend ? '' : ' disabled'}>Send</button>
  </div>
</form>`;

  const body = `
<section class="wrap phead">
  <span class="eyebrow">${text(contact.eyebrow)}</span>
  <h1>${text(contact.h1)}</h1>
  <p class="lede">${text(contact.lede)}</p>
</section>

<section class="section section--ruled">
  <div class="wrap">
    <div class="grid grid--2">
      <div>
        <h2 class="h3">Call</h2>
        <p class="mt-md"><a class="cta-band__phone" style="color:var(--ink)" href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a></p>
        <ul class="deflist mt-lg" role="list">
          <li><span class="deflist__t">Hours</span><span class="deflist__d">${text(site.hoursText)}</span></li>
          <li><span class="deflist__t">Response</span><span class="deflist__d">${text(site.responseWindow)}</span></li>
          ${site.email ? `<li><span class="deflist__t">Email</span><span class="deflist__d"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></span></li>` : ''}
          ${site.hideAddress ? '' : `<li><span class="deflist__t">Office</span><span class="deflist__d">${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postalCode)}</span></li>`}
          ${site.license ? `<li><span class="deflist__t">${esc(site.licenseLabel)}</span><span class="deflist__d">${esc(site.license)}</span></li>` : ''}
        </ul>
      </div>
      <div>
        <h2 class="h3">Or write it down</h2>
        <div class="mt-md">${formHtml}</div>
      </div>
    </div>
  </div>
</section>

${(contact.sections || []).map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Coverage', h2: 'Where we go' })}
    ${counties
      .map(
        (c) => `<div class="county">
      <div class="county__head"><h3 class="h3">${esc(c.name)}</h3></div>
      <ul class="chips" role="list">
        ${c.areas.map((a) => `<li><a href="${url.area(a.slug)}">${esc(a.name)}</a></li>`).join('\n        ')}
        ${c.alsoServing.map((n) => `<li><span>${esc(n)}</span></li>`).join('\n        ')}
      </ul>
    </div>`,
      )
      .join('\n    ')}
  </div>
</section>`;

  await emit(p, page({
    path: p, title: contact.title, description: contact.description, body, trail,
    schema: [graph({ path: p, title: contact.title, description: contact.description, trail,
      pageType: 'ContactPage' })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   404
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   Privacy
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Added 2026-08-20, and it is the only page on this site that exists for a
 * legal reason rather than a reader’s. GA4 and a live form endpoint both went
 * in without one, which leaves visitors giving up a name and a phone number
 * with nothing on the site saying where either goes. Google’s own Analytics
 * terms require a notice disclosing the cookies too.
 *
 * It carries noindex. It is linked from the footer so a reader can always
 * reach it, but it is not a page anybody should arrive at from a search, and
 * leaving it out of the index also keeps it clear of the local-SEO surface
 * the rest of the site is built for. It stays out of sitemap.xml for the same
 * reason — see buildMeta.
 */
async function buildPrivacy() {
  const p = url.privacy;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Privacy' }];

  const body = `
<section class="wrap phead">
  <span class="eyebrow">${text(privacy.eyebrow)}</span>
  <h1>${text(privacy.h1)}</h1>
  <p class="lede">${text(privacy.lede)}</p>
</section>

${/* Everything except the last section, which is "Changes" and belongs after
      the how-to-reach-us box rather than before it — a policy that explains how
      it gets amended before it says who to ask is in the wrong order. */''}
${privacy.sections.slice(0, -1).map(renderSection).join('\n\n')}

<section class="section section--ruled defer">
  <div class="wrap wrap--mid">
    <div class="flagbox">
      <h2 class="h3" id="${anchorId('Asking us about your information')}" tabindex="-1">Asking us about your information</h2>
      <div class="body-block">
        <p>Call <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a> and ask. We can tell you what we hold from an enquiry you sent, and delete it if you want it gone.</p>
        <p>${site.email ? `You can also write to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.` : 'This site does not publish an email address yet, so the phone is the only route, and it is a real one.'}</p>
      </div>
    </div>
  </div>
</section>

${renderSection(privacy.sections.at(-1))}

<section class="section section--ruled">
  <div class="wrap wrap--mid">
    <p class="fineprint">Last updated ${text(privacy.updated)}.</p>
  </div>
</section>`;

  await emit(p, page({
    path: p, title: privacy.title, description: privacy.description, body, trail,
    noindex: true,
    schema: [graph({ path: p, title: privacy.title, description: privacy.description, trail })],
  }));
}

async function build404() {
  const body = `
<section class="wrap phead">
  <span class="eyebrow">404</span>
  <h1>That page is not here</h1>
  <p class="lede">It may have moved. These are the places people are usually looking for.</p>
  <div class="grid grid--3 mt-lg">
    ${services.slice(0, 3).map(serviceCard).join('\n    ')}
  </div>
  <p class="mt-lg btn-row">
    <a class="btn btn--ghost" href="/">Home</a>
    <a class="btn btn--ghost" href="${url.services}">All services</a>
    <a class="btn btn--ghost" href="${url.areas}">Service areas</a>
    ${callBtn()}
  </p>
</section>`;

  const title = 'Page not found';
  const description = 'That page is not here. Links to our services and service areas.';
  await emit('/404.html', page({
    path: '/404.html',
    title,
    description,
    body,
    noindex: true,
    schema: [graph({ path: '/404.html', title, description })],
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   robots.txt + sitemap.xml
   ═══════════════════════════════════════════════════════════════════════════ */
async function buildMeta() {
  await writeFile(
    path.join(DIST, 'robots.txt'),
    site.launchReady
      ? `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`
      : `# Not launched. Every page carries <meta name="robots" content="noindex">
# until every claim in src/site.config.js is confirmed. See site.verified.
# Crawling stays allowed on purpose: a crawler has to fetch the page to read
# the noindex on it, and Disallow alone can still leave the URL indexed.
User-agent: *
Allow: /
`,
    'utf8',
  );

  /** Priority reflects internal importance; Google largely ignores it but other
   *  crawlers and site auditors read it, and it costs nothing. */
  const priority = (r) => {
    if (r === '/') return '1.0';
    if (r === url.service('hvac-air-conditioner-mold-remediation')) return '0.9';
    if (r.startsWith('/services/')) return '0.8';
    if (r.startsWith('/service-areas/')) return '0.7';
    return '0.6';
  };

  /* /privacy/ is excluded alongside the 404 because both are noindex, and a
     sitemap that lists a noindex URL asks Google to crawl a page it is then
     told to drop. The footer link is how readers reach it. */
  const NO_SITEMAP = new Set(['/404.html', url.privacy]);
  const routes = site.launchReady ? written.filter((r) => !NO_SITEMAP.has(r)).sort() : [];
  const urls = (
    await Promise.all(
      routes.map(async (r) => `  <url>
    <loc>${abs(r)}</loc>
    <lastmod>${await lastmodFor(r)}</lastmod>
    <priority>${priority(r)}</priority>
  </url>`),
    )
  ).join('\n');

  const NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="${NS}">
${urls}
</urlset>
`,
    'utf8',
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Run
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Cross-check the routing surfaces against each other.
 *
 * Canonicals, og:url and the sitemap are all built from site.origin, and the
 * launch checklist tells the owner to change that value. One hardcoded URL
 * anywhere would leave the three disagreeing, and nothing else in this project
 * looks at whether they match — the audit checks that a canonical is present,
 * not that it points at the page it is on.
 */
/**
 * sameAs is a claim of identity: it tells a crawler "this business IS these
 * pages." A bare platform root satisfies every naive check — it is a valid,
 * reachable https URL on the right domain — while asserting something false,
 * and unlike the placeholder address or domain it is never read by a human who
 * would notice. This config shipped three of them. A real profile always has a
 * path, so that is what the guard tests.
 */
function assertProfileLinks() {
  const bad = (site.sameAs || []).filter((u) => {
    let url;
    try { url = new URL(u); } catch { return true; }
    return url.protocol !== 'https:' || url.pathname.replace(/\/+$/, '') === '';
  });
  if (!bad.length) return;
  throw new Error(
    `site.sameAs contains ${bad.length} entr${bad.length === 1 ? 'y that names' : 'ies that name'} a platform, not a profile:\n` +
    bad.map((u) => `    ${u}`).join('\n') +
    '\n  sameAs asserts that this business is the page at that URL, so a bare\n' +
    '  root claims the business is Facebook. Use the full profile URL — the one\n' +
    '  with a path — or leave sameAs empty, which omits the property entirely.',
  );
}

/**
 * The three signals that separate this site from a doorway build, checked at
 * build time because all three are invisible in review: a duplicated <title>
 * or meta description reads as one page templated N times, and the same FAQ
 * marked up on several pages is the same claim competing with itself.
 *
 * All three measured clean when this was written — 37 unique titles, 37 unique
 * descriptions, 147 distinct Q&A entities across 30 pages with no overlap. The
 * point is to keep it that way through the next hundred data edits, since the
 * cheapest way to add a city page is to copy one, and copying is exactly what
 * makes this go wrong.
 *
 * If a repeat is ever genuinely right, add the exact string to ALLOW_REPEAT
 * with a comment saying why — the same convention prose.mjs uses.
 */
const ALLOW_REPEAT = new Set([]);

async function assertSignalsUnique() {
  const titles = new Map(), descs = new Map(), questions = new Map();
  const note = (map, key, route) => {
    if (!key || ALLOW_REPEAT.has(key)) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(route);
  };

  for (const route of written) {
    const file = route === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, route, 'index.html');
    const html = await readFile(file, 'utf8');
    note(titles, (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim(), route);
    note(descs, (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]?.trim(), route);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ld) continue;
    const faq = (JSON.parse(ld[1])['@graph'] || []).find((n) => n['@type'] === 'FAQPage');
    for (const e of faq?.mainEntity || []) note(questions, e.name?.trim(), route);
  }

  const problems = [];
  for (const [label, map] of [['title', titles], ['meta description', descs], ['FAQ question', questions]]) {
    for (const [value, routes] of map) {
      if (routes.length > 1) problems.push(`${label} repeated on ${routes.join(', ')}\n      "${value.slice(0, 70)}"`);
    }
  }
  if (problems.length) {
    throw new Error(
      `Duplicate page signals (${problems.length}):\n  ${problems.slice(0, 6).join('\n  ')}\n` +
      '  Each page needs its own title, description and questions — repeats are\n' +
      '  what makes a multi-city site read as templated. Rewrite it, or add the\n' +
      '  string to ALLOW_REPEAT in build.mjs with a reason.',
    );
  }
}

/**
 * A copy-level claim is declared in site.copyClaims but made in page copy, so
 * the two can drift silently — and did: freeWalkthrough stayed declared live
 * after the copy was deleted, which pinned launchReady false and would have
 * kept all 37 pages noindex indefinitely. This compares each declaration
 * against the built HTML in both directions.
 */
async function assertCopyClaimsMatch() {
  const problems = [];
  for (const [key, { live, needles }] of Object.entries(site.copyClaims)) {
    const found = [];
    for (const route of written) {
      const file = route === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, route, 'index.html');
      const html = await readFile(file, 'utf8');
      for (const n of needles) {
        if (typeof n === 'string') {
          if (html.includes(n)) found.push(`${route} ("${n}")`);
          continue;
        }
        // Context needle: the figure only counts as the claim when it sits near
        // the thing being offered, so an unrelated $0 elsewhere does not trip it.
        let i = html.indexOf(n.text);
        while (i !== -1) {
          const w = html.slice(Math.max(0, i - n.window), i + n.window);
          if (n.within.some((t) => w.includes(t))) { found.push(`${route} ("${n.text}" near ${n.within.join('/')})`); break; }
          i = html.indexOf(n.text, i + 1);
        }
      }
    }
    if (live && !found.length) {
      problems.push(`${key}: declared live, but none of its wording is in the build.\n      Set live: false — leaving it true pins launchReady false forever.`);
    }
    if (!live && found.length) {
      problems.push(`${key}: declared removed, but still on ${found.length} page(s): ${found.slice(0, 3).join(', ')}`);
    }
  }
  if (problems.length) {
    throw new Error(`site.copyClaims disagrees with the build (${problems.length}):\n  ${problems.join('\n  ')}`);
  }
}

/**
 * The air-path diagram splits one piece of knowledge across two files: the
 * markers carry the scroll offset at which each lights (src/lib/ui.js), and
 * the pulse keyframes carry where the pulse has to be along the path at that
 * moment (public/styles.css). Neither file can see the other, so an edit to
 * one silently desynchronises the diagram — which is the exact bug this pass
 * fixed, and it went unnoticed for a while because a drifting pulse still
 * looks like a working animation.
 *
 * This re-derives one from the other. Each marker's lead is converted into a
 * fraction of the pulse's own animation-range, and that has to be the offset
 * the keyframe uses. Tolerance is a third of a percent: the numbers are
 * rounded for legibility in the stylesheet, not computed there.
 */
async function assertDiagramPulseSync() {
  const css = await readFile(path.join(ROOT, 'public/styles.css'), 'utf8');
  const ui = await readFile(path.join(ROOT, 'src/lib/ui.js'), 'utf8');

  const leads = [...ui.matchAll(/\$\{node\((\d), \d+, \d+, ([\d.]+)\)\}/g)]
    .map(m => ({ n: +m[1], lead: +m[2] }));
  // Anchored on the scroll-driven rule specifically. A looser /\.dg-pulse \{/
  // starts at the base rule 130 lines earlier and runs forward into the
  // .dg-flow--b range, which reads 18-30% and quietly halves every offset.
  const range = css.match(/figure\.diagram \.dg-pulse \{[\s\S]*?animation-range: cover ([\d.]+)% cover ([\d.]+)%/);
  const stops = [...css.matchAll(/^\s*([\d.]+)%\s*\{ stroke-dashoffset: ([\d.]+); \}\s*\/\* (\d)/gm)]
    .map(m => ({ at: +m[1], off: +m[2], n: +m[3] }));

  if (!range) throw new Error('diagram: could not read the pulse animation-range from styles.css');
  if (leads.length !== 5 || stops.length !== 5)
    throw new Error(`diagram: expected 5 markers and 5 pulse stops, found ${leads.length} and ${stops.length}`);

  const [, from, to] = range.map(Number);
  for (const { n, lead } of leads) {
    const stop = stops.find(s => s.n === n);
    if (!stop) throw new Error(`diagram: marker ${n} lights at cover ${lead}% with no matching pulse stop`);
    const want = ((lead - from) / (to - from)) * 100;
    if (Math.abs(stop.at - want) > 0.34)
      throw new Error(
        `diagram: marker ${n} lights at cover ${lead}%, which is ${want.toFixed(1)}% through the ` +
        `pulse, but its keyframe is at ${stop.at}%. Update the other file to match.`);
  }
  const order = stops.map(s => s.off);
  if (order.some((o, i) => i && o >= order[i - 1]))
    throw new Error('diagram: pulse keyframes must move the dash forward — stroke-dashoffset has to fall monotonically');
}

/**
 * The privacy page describes mechanisms that live in three other files: the
 * GA4 id in site.config.js, the form endpoint in content.js, and the storage
 * key in public/site.js. Prose cannot follow a refactor, so a privacy notice
 * rots into a false statement the moment one of them moves — and unlike most
 * stale copy, that one is a compliance problem rather than an untidy sentence.
 *
 * Each fact is re-read from its real source and looked for on the built page.
 * Deliberately one-directional: this proves the page names what the site does,
 * not that it names everything. Adding a tracker still needs a human to write
 * the paragraph — no assertion can catch a silence.
 */
async function assertPrivacyDescribesReality() {
  /* Scripts stripped first, and that is the whole point of this line. Searching
     the raw html let the GA4 tag satisfy the GA4 assertion — the measurement id
     appears in the gtag src on every page, so changing it kept the check green
     while the disclosure still named the old one. The check has to read what a
     visitor reads. */
  const html = (await readFile(path.join(DIST, url.privacy, 'index.html'), 'utf8'))
    .replace(/<script[\s\S]*?<\/script>/g, '');
  const js = await readFile(path.join(ROOT, 'public/site.js'), 'utf8');
  const endpointHost = contact.form.endpoint ? new URL(contact.form.endpoint).hostname : null;
  const storageKey = (js.match(/var KEY = '([^']+)'/) || [])[1];

  const facts = [
    [site.analyticsId, 'the GA4 measurement id from site.config.js'],
    [endpointHost, 'the form endpoint host from content.js'],
    [storageKey, 'the localStorage key from public/site.js'],
  ];
  for (const [value, what] of facts) {
    if (!value) continue;   // nothing configured is nothing to disclose
    if (!html.includes(value))
      throw new Error(`privacy: the page does not mention ${value} — ${what}. ` +
        'Update /privacy/ to match, or it is describing a site that no longer exists.');
  }
  if (site.analyticsId && !html.includes('noindex'))
    throw new Error('privacy: the page lost its noindex');
}

/**
 * The owner banned em-dashes from the copy (2026-08-20). Every writer on this
 * project since is an ex-user of them, so the ban is enforced where it can be
 * seen: the built pages. Checks the character and the entity, in everything
 * that renders, JSON-LD and attributes included. En-dashes in ranges are
 * allowed. JS comments never reach dist; HTML comments do ship in the page
 * bytes, so they are held to the ban too rather than stripped and excused:
 * a zero nobody can argue with in view-source is the only clean zero.
 */
async function assertNoEmDash() {
  for (const route of written) {
    const file = route === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, route, 'index.html');
    const html = await readFile(file, 'utf8');
    for (const needle of ['\u2014', '&mdash;']) {
      const i = html.indexOf(needle);
      if (i !== -1)
        throw new Error(
          `em-dash on ${route}: "...${html.slice(Math.max(i - 50, 0), i + 50).replace(/\s+/g, ' ')}..." ` +
          '(the owner banned them from the copy; rewrite with a colon, comma, or a new sentence)');
    }
  }
}

async function assertRoutingConsistent() {
  const problems = [];
  const indexable = new Map();
  for (const route of written) {
    const file = route === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, route, 'index.html');
    const html = await readFile(file, 'utf8');
    const expected = site.origin.replace(/\/$/, '') + route;
    const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    const ogUrl = (html.match(/<meta property="og:url" content="([^"]*)"/) || [])[1];
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

    if (!canon) problems.push(`${route}: no canonical`);
    else if (canon !== expected) problems.push(`${route}: canonical is ${canon}, expected ${expected}`);
    if (ogUrl && canon && ogUrl !== canon) problems.push(`${route}: og:url ${ogUrl} does not match canonical ${canon}`);
    if (!noindex) indexable.set(expected, route);
  }

  const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]));
  for (const [url, route] of indexable) {
    if (!listed.has(url)) problems.push(`${route}: indexable but missing from sitemap.xml`);
  }
  for (const url of listed) {
    if (!indexable.has(url)) problems.push(`sitemap.xml lists ${url}, which is not an indexable page`);
  }

  if (problems.length) {
    throw new Error(`Routing inconsistency (${problems.length}):\n  ${problems.slice(0, 8).join('\n  ')}`);
  }
  console.log(`  ✓ ${indexable.size} canonicals, og:urls and sitemap entries agree`);
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  await buildHome();
  await buildServices();
  await buildAreas();
  await buildGuides();
  await buildProcess();
  await buildFaq();
  await buildAbout();
  await buildContact();
  await buildPrivacy();
  await build404();

  // Static assets: fonts, stylesheet, favicon, client script
  await cp(path.join(ROOT, 'public'), DIST, { recursive: true });

  await buildMeta();

  assertProfileLinks();
  await assertRoutingConsistent();
  await assertDiagramPulseSync();
  await assertPrivacyDescribesReality();
  await assertNoEmDash();
  await assertSignalsUnique();
  await assertCopyClaimsMatch();

  const files = await readdir(DIST);
  if (contact.form.hasBackend && !contact.form.endpoint && !contact.form.action) {
    console.log(
      `\n⚠ FORM SAYS IT HAS A BACKEND AND HAS NOWHERE TO SEND. hasBackend is\n` +
      `  true but neither endpoint nor action is set, so the submit button is\n` +
      `  enabled and every message is dropped. Set contact.form.endpoint.\n`,
    );
  }
  if (!contact.form.hasBackend) {
    console.log(
      `\n⚠ CONTACT FORM HAS NO BACKEND — the submit button is disabled and the\n` +
      `  page tells visitors to call instead. To connect it, point\n` +
      `  contact.form.action in src/data/content.js at a form service\n` +
      `  (Formspree, Basin, Web3Forms, Netlify Forms) and set hasBackend: true.\n`,
    );
  }
  if (!site.launchReady) {
    const missing = site.claimKeys.filter((k) => !(site.verified || []).includes(k));
    console.log(
      `\n⚠ NOT INDEXABLE — every page carries noindex and sitemap.xml is empty.\n` +
      `  ${missing.length} unconfirmed claim(s): ${missing.join(', ')}\n` +
      `  Run: node tools/preflight.mjs\n`,
    );
  }
  console.log(`✓ ${written.length} pages → dist/`);
  console.log(`  ${written.sort().join('\n  ')}`);
  console.log(`\n  dist/ contains: ${files.sort().join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
