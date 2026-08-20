/**
 * UI — the page shell and every shared component.
 *
 * Plain template literals returning HTML strings. No framework, no runtime,
 * no hydration. The build script calls these and writes files.
 */

import { readFileSync } from 'node:fs';
import site from '../site.config.js';
import { services, featuredServices } from '../data/services.js';
import { counties } from '../data/areas.js';
import { airPathPoints } from '../data/content.js';

/* ── Escaping ──────────────────────────────────────────────────────────────── */
const AMP = /&/g, LT = /</g, GT = />/g, QUOT = /"/g;

/** Escape for HTML text nodes and double-quoted attributes. */
export const esc = (s) =>
  String(s).replace(AMP, '&amp;').replace(LT, '&lt;').replace(GT, '&gt;').replace(QUOT, '&quot;');

/**
 * Body copy is authored by us, not user input, and uses real typography
 * (curly quotes, em dashes). We still escape the structural characters.
 */
export const text = (s) => String(s).replace(AMP, '&amp;').replace(LT, '&lt;').replace(GT, '&gt;');

/**
 * Inline links in authored copy, written as [label](/path).
 *
 * Body copy is escaped before this runs, so anything an author typed is already
 * inert — this only re-introduces anchors, and only for site-relative paths.
 * No protocol is accepted, so `javascript:` and external hosts cannot be
 * produced by this at all. It exists because contextual links inside prose are
 * worth considerably more than another card at the bottom of the page, and
 * until now the escaper made them impossible to write.
 */
// Internal paths, or an absolute https URL. External links were not expressible
// before, which is why the about page told people to verify a license on the
// state portal and then gave them no way to reach it.
const INLINE_LINK = /\[([^\]\[]+)\]\((\/[A-Za-z0-9\-/._#]*|https:\/\/[^\s)]+)\)/g;
export const rich = (s) =>
  text(s).replace(INLINE_LINK, (_, label, href) =>
    href.startsWith('http')
      // Same tab on purpose: opening a window the reader did not ask for is its
      // own accessibility problem, and the print stylesheet already reveals the
      // destination on paper.
      ? `<a href="${href}" rel="noopener external">${label}</a>`
      : `<a href="${href}">${label}</a>`);

/**
 * Strip the inline-link syntax back to plain text.
 *
 * Authored prose is reused in two places that are not HTML: JSON-LD, and any
 * attribute. Structured data must carry the sentence a human would read, not
 * the markup — an FAQ answer serialized with [label](/path) in it is what
 * Google ingests.
 */
export const plain = (s) => String(s).replace(INLINE_LINK, '$1');

export const paras = (arr, cls = '') =>
  arr.map((p) => `<p${cls ? ` class="${cls}"` : ''}>${rich(p)}</p>`).join('\n');

/* ── URLs ──────────────────────────────────────────────────────────────────── */
export const url = {
  home: '/',
  services: '/services/',
  service: (slug) => `/services/${slug}/`,
  areas: '/service-areas/',
  guides: '/guides/',
  guide: (slug) => `/guides/${slug}/`,
  area: (slug) => `/service-areas/${slug}/`,
  process: '/process/',
  faq: '/faq/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
};

export const abs = (path) => `${site.origin}${path}`;

/* ── Navigation ────────────────────────────────────────────────────────────── */
const NAV = [
  { href: url.services, label: 'Services' },
  { href: url.service('hvac-air-conditioner-mold-remediation'), label: 'HVAC & AC Mold' },
  { href: url.areas, label: 'Service Areas' },
  { href: url.guides, label: 'Guides' },
  { href: url.process, label: 'Process' },
  { href: url.about, label: 'About' },
  { href: url.contact, label: 'Contact' },
];

/**
 * Which nav item, if any, represents the page you are on.
 *
 * A plain prefix test marks both "Services" and "HVAC & AC Mold" on
 * /services/hvac-air-conditioner-mold-remediation/, which puts two
 * aria-current="page" in one nav. Only the most specific match wins.
 */
function currentNavHref(path) {
  const matches = NAV.map((n) => n.href).filter((href) =>
    href === '/' ? path === '/' : path === href || path.startsWith(href),
  );
  return matches.sort((a, b) => b.length - a.length)[0] || null;
}

/* ── Small pieces ──────────────────────────────────────────────────────────── */
export const callBtn = (cls = 'btn btn--call', label = 'Call') =>
  `<a class="${cls}" href="tel:${esc(site.phoneHref)}">${label} <span class="btn__num">${esc(site.phoneDisplay)}</span></a>`;

/**
 * The brand lockup, from the owner-supplied artwork.
 *
 * Composited from two measured crops of the source file — the icon is taller
 * than the wordmark, so a single rectangle tall enough to include the wave also
 * swallows the "Clean Air Specialists & Remediation" line, which is illegible
 * at header size anyway. That line is carried as real text instead.
 *
 * `reversed` swaps in the white silhouette for dark grounds; the navy frond is
 * invisible against the footer.
 */
const brandLockup = ({ reversed = false, cls = '', width = 900, height = 141 } = {}) => {
  const f = reversed ? 'lockup-reversed' : 'lockup';
  // The reversed lockup is the footer one and is never above the fold. It was
  // being fetched eagerly and competing with the LCP image for a 400kbps link:
  // in the waterfall it opened at 565ms, before the hero still had finished.
  const lazy = reversed ? ' loading="lazy"' : '';
  return `<picture>
    <source type="image/webp" srcset="/assets/brand/${f}.webp">
    <img src="/assets/brand/${f}.png" alt="${esc(site.name)}"
         width="${width}" height="${height}"${cls ? ` class="${cls}"` : ''} decoding="async"${lazy}>
  </picture>`;
};

export function header(path) {
  const current = currentNavHref(path);
  return `
<header class="hdr">
  <div class="wrap hdr__bar">
    <a class="brand" href="/" aria-label="${esc(site.name)} &mdash; home">
      ${brandLockup({ cls: 'brand__logo' })}
      <span class="brand__sub">${esc(site.tagline)}</span>
    </a>

    <button class="hdr__toggle" type="button" id="navToggle" aria-expanded="false" aria-controls="siteNav">Menu</button>

    <nav class="nav" id="siteNav" aria-label="Main">
      ${NAV.map(
        (n) =>
          `<a href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`,
      ).join('\n      ')}
    </nav>

    <a class="hdr__call" href="tel:${esc(site.phoneHref)}">
      <span>${esc(site.phoneDisplay)}</span>
    </a>
  </div>
</header>`;
}

export function breadcrumbs(trail) {
  if (!trail || trail.length < 2) return '';
  const items = trail
    .map((c, i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${esc(c.name)}</li>`
        : `<li><a href="${c.href}">${esc(c.name)}</a></li>`,
    )
    .join('');
  return `<nav class="wrap crumbs" aria-label="Breadcrumb"><ol role="list">${items}</ol></nav>`;
}

/* ── Media ─────────────────────────────────────────────────────────────────── */
/**
 * Responsive still. Widths match what tools/optimize-assets.sh emits.
 *
 * `priority` is for an image that is the LCP candidate — it drops the lazy
 * attributes and asks the browser to fetch it early. Use it on exactly one
 * image per page, never more: fetchpriority is zero-sum and marking everything
 * high is the same as marking nothing.
 */
export function picture({ name, alt, sizes = '100vw', cls = '', priority = false }) {
  const b = `/assets/img/${name}`;
  return `<picture>
  <source type="image/webp" srcset="${b}-640.webp 640w, ${b}-960.webp 960w, ${b}-1376.webp 1376w" sizes="${esc(sizes)}">
  <img src="${b}-1376.jpg" alt="${esc(alt)}" width="1376" height="768"${cls ? ` class="${cls}"` : ''}
       ${priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
</picture>`;
}

/**
 * Full-bleed hero with a still or a looping clip behind the type.
 *
 * The still is always rendered and is what paints first — the video layers on
 * top at opacity 0 and fades in only once it is actually playing. That means
 * the LCP element is a ~40KB responsive WebP rather than a video, and the hero
 * is complete and correct with no JavaScript, on a slow connection, on a
 * data-saver connection, and under prefers-reduced-motion.
 *
 * The pause control is not optional decoration: WCAG 2.2.2 requires a way to
 * stop any motion that starts automatically and runs more than five seconds.
 * It stays hidden until site.js has actually attached a video.
 */
export function mediaHero({
  eyebrow, h1, lede, image, alt, video = null, caption = '',
  actions = '', extra = '', crumbs = '',
}) {
  // One MP4, no loop, no WebM.
  //
  // The clip is scrubbed by scroll rather than played, which changes every one
  // of those. It is not a loop — its frame is a function of scroll position, so
  // there is nothing to loop back to. It cannot be VP9 as well: scrubbing needs
  // every frame to be a keyframe, and maintaining two all-keyframe encodes to
  // save bytes on a file that has to be fully buffered before it is smooth is
  // the wrong trade. Dropping WebM also removed 8.2 MB of encodes that lost to
  // their MP4 counterparts on 7 of 9 clips anyway.
  const vid = video
    ? `
    <video class="mhero__video" muted playsinline preload="none" aria-hidden="true" tabindex="-1"
           data-src="/assets/video/${video}.mp4"></video>`
    : '';

  // The runway. The hero is sticky inside a container taller than itself, so it
  // holds in place while the reader scrolls that extra distance — the hero owns
  // the scroll rather than having the next section slide across it. Same shape
  // as rankengineai, breathforrecovery and the fantasticrides scroll-scrub
  // stage: a sticky full-viewport stage with runway beneath it, then the page
  // resumes normally.
  return `
<div class="mhero-runway">
<section class="mhero"${video ? ' data-video' : ''}>
  <div class="mhero__bg">
    ${picture({ name: image, alt, sizes: '100vw', cls: 'mhero__still', priority: true })}${vid}
  </div>

  <div class="wrap mhero__inner">
    ${crumbs}
    <span class="eyebrow eyebrow--onink">${text(eyebrow)}</span>
    <h1 class="h1">${text(h1)}</h1>
    <p class="lede">${text(lede)}</p>
    ${actions}
    ${extra}
  </div>

  <div class="wrap mhero__foot">
    <!-- rich(), not text(): the city captions name the other places sharing the
         same housing stock, and a relationship the page asserts should be one
         the reader can follow. rich() still renders links only, so a caption
         with no link syntax is unchanged. -->
    ${caption ? `<p class="mhero__cap">${rich(caption)}</p>` : '<span></span>'}
    <!-- No pause control. It was here for WCAG 2.2.2, which governs content
         that moves automatically; a scrubbed clip only moves while the reader
         scrolls, so there is nothing running to stop and the button would have
         paused nothing. -->
    <span></span>
  </div>
</section>
</div>`;
}

/* ── The signature: air path diagram ───────────────────────────────────────── */
/**
 * A schematic section through a typical single-story South Florida house,
 * tracing the air path from the return grille through the coil and out to the
 * supply registers. The five numbered markers are the places growth is
 * actually found, in the order the air reaches them.
 *
 * Numbers come from `airPathPoints`, so the SVG and the legend cannot drift.
 */
export function airPathDiagram(idPrefix = 'dg') {
  const t = `${idPrefix}-t`;
  const d = `${idPrefix}-d`;
  // Each marker is grouped and numbered so the stylesheet can light them in
  // airflow order as the reader scrolls — the scroll-driven version of the
  // diagram uses --i to stagger each node along one shared view timeline.
  // `lead` is the scroll offset, as a cover percentage, at which this marker
  // lights. It is paired with the marker's true position along the pulse path
  // — 4.2 / 26.5 / 29.5 / 39.4 / 77.6, measured off the rendered SVG with
  // getPointAtLength, not guessed — and the pulse is keyframed in styles.css
  // to reach each of those positions at the matching lead. The two lists must
  // move together; build.mjs asserts they do.
  //
  // They are deliberately not the same shape. Path position is wildly uneven:
  // 1 to 4 are the air handler and its two plenums, all inside the first 40%
  // of the run, and the register boot is most of the way along. Lighting on
  // that spacing would fire four of five before a reader finished arriving.
  // So the markers keep a readable cadence and the pulse carries the physics,
  // easing through the equipment and running once it is in open duct.
const node = (n, x, y, lead) => `
    <g class="dg-mark" style="--i:${n - 1};--lead:${lead}%">
    <circle class="dg-ring" cx="${x}" cy="${y}" r="14"/>
    <circle class="dg-node" cx="${x}" cy="${y}" r="14"/>
    <text class="dg-node-n" x="${x}" y="${y + 4.2}">${n}</text>
    </g>`;

  return `
<div class="diagram__scroll">
<svg class="diagram__svg" viewBox="0 0 760 442" role="img" aria-labelledby="${t} ${d}" preserveAspectRatio="xMidYMid meet">
  <title id="${t}">Air path through a South Florida home&rsquo;s air conditioning system</title>
  <desc id="${d}">A cutaway schematic. Air enters at a return grille on the left, passes a filter and blower, crosses the evaporator coil, rises through the supply plenum into an attic trunk duct, and drops through three branch ducts to ceiling registers in three rooms. Five numbered markers indicate where mold is found: the return plenum, the evaporator coil, the drain pan, the supply plenum, and the register boot.</desc>

  <!-- Attic -->
  <rect class="dg-zone" x="28" y="34" width="704" height="122"/>
  <text class="dg-label dg-label--faint" x="40" y="58">Attic &#183; 130&#176;F+</text>

  <!-- Ceiling and floor -->
  <line class="dg-shell" x1="28" y1="156" x2="732" y2="156"/>
  <line class="dg-shell" x1="28" y1="414" x2="732" y2="414"/>

  <!-- Room dividers -->
  <line class="dg-room" x1="252" y1="158" x2="252" y2="414"/>
  <line class="dg-room" x1="382" y1="158" x2="382" y2="414"/>
  <line class="dg-room" x1="512" y1="158" x2="512" y2="414"/>
  <line class="dg-room" x1="642" y1="158" x2="642" y2="414"/>

  <!-- Supply trunk -->
  <rect class="dg-duct" x="216" y="92" width="484" height="36" rx="2"/>
  <text class="dg-label dg-label--room" x="458" y="82">Supply trunk</text>

  <!-- Branch drops and ceiling registers -->
  <rect class="dg-duct" x="318" y="128" width="24" height="28"/>
  <rect class="dg-duct" x="448" y="128" width="24" height="28"/>
  <rect class="dg-duct" x="578" y="128" width="24" height="28"/>
  <rect class="dg-part" x="306" y="156" width="48" height="10"/>
  <rect class="dg-part" x="436" y="156" width="48" height="10"/>
  <rect class="dg-part" x="566" y="156" width="48" height="10"/>

  <!-- Supply air entering each room: whatever grew upstream arrives here -->
  <path class="dg-air" style="--i:0" d="M316 182 L330 196 L344 182 M316 204 L330 218 L344 204"/>
  <path class="dg-air" style="--i:1" d="M446 182 L460 196 L474 182 M446 204 L460 218 L474 204"/>
  <path class="dg-air" style="--i:2" d="M576 182 L590 196 L604 182 M576 204 L590 218 L604 204"/>

  <!-- Rooms -->
  <text class="dg-label dg-label--room" x="317" y="404">Bedroom</text>
  <text class="dg-label dg-label--room" x="447" y="404">Living</text>
  <text class="dg-label dg-label--room" x="577" y="404">Kitchen</text>

  <!-- Supply plenum, crossing the ceiling into the closet -->
  <rect class="dg-duct" x="96" y="100" width="120" height="86"/>
  <text class="dg-label" x="98" y="90">Plenum</text>

  <!-- Air handler cabinet -->
  <rect class="dg-body" x="96" y="186" width="120" height="228" rx="2"/>
  <text class="dg-label" x="104" y="208">Air handler</text>

  <!-- Evaporator coil (A-coil) with fin hatching -->
  <path class="dg-part" d="M106 282 L156 218 L206 282"/>
  <path class="dg-hatch" d="M120 282 L156 236 M138 282 L156 258 M174 282 L156 258 M192 282 L156 236"/>

  <!-- Drain pan, condensate line and P-trap -->
  <path class="dg-part" d="M104 286 H208 V302 H104 Z"/>
  <path class="dg-part" d="M208 294 H226 V344 q0 10 10 10 q10 0 10 -10 V330"/>

  <!-- Blower -->
  <circle class="dg-part" cx="156" cy="348" r="29"/>
  <path class="dg-hatch" d="M156 319 V377 M127 348 H185 M136 328 L176 368 M176 328 L136 368"/>
  <text class="dg-label" x="126" y="402">Blower</text>

  <!-- Return duct and filter -->
  <rect class="dg-duct" x="28" y="352" width="68" height="42"/>
  <path class="dg-hatch" d="M102 356 V390 M107 356 V390 M112 356 V390"/>
  <text class="dg-label" x="30" y="344">Return</text>

  <!-- Air path -->
  <path class="dg-flow" pathLength="1" d="M28 373 H156 V110 H660"/>
  <path class="dg-flow dg-flow--b" pathLength="1" d="M330 110 V166"/>
  <path class="dg-flow dg-flow--c" pathLength="1" d="M460 110 V166"/>
  <path class="dg-flow dg-flow--d" pathLength="1" d="M590 110 V166"/>
  <path class="dg-pulse" pathLength="1" d="M28 373 H156 V110 H660"/>

  <!-- Findings, numbered in the order the air reaches them -->
  ${node(1, 66, 373, 40)}
  ${node(2, 156, 250, 46)}
  ${node(3, 156, 294, 49)}
  ${node(4, 156, 148, 54)}
  ${node(5, 460, 142, 61)}
</svg>
</div>`;
}

export function airPathLegend() {
  return `<ol class="legend" role="list">
${airPathPoints
  .map(
    (p) => `  <li style="--i:${p.n - 1}">
    <span class="legend__n" aria-hidden="true">${p.n}</span>
    <span class="legend__t">${text(p.title)}</span>
    <span class="legend__d">${text(p.text)}</span>
  </li>`,
  )
  .join('\n')}
</ol>`;
}

/* ── Reusable blocks ───────────────────────────────────────────────────────── */
/** Stable anchor id from a heading. Must match the one build.mjs uses. */
export const anchorId = (t) =>
  String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * In-page navigation. Rendered only where it earns its place — four or more
 * sections — because on a two-section page it is furniture, not a map.
 */
export const jumpNav = (items, { label = 'On this page', counts = false } = {}) => {
  if (!items || items.length < 4) return '';
  // The visible label and the landmark name are separate on purpose. The FAQ
  // shows "5 sections", which is a useful thing to see and a poor thing to hear:
  // a screen reader listing landmarks announced "5 sections, navigation", which
  // says how many rather than what for. Every one of these is now named the same
  // thing in the landmark list, whatever it displays.
  return `<nav class="jump-nav" aria-label="On this page">
  <p class="jump-nav__label">${esc(label)}</p>
  <ul role="list">
    ${items
      .map(
        (i) => `<li><a href="#${anchorId(i.title)}">${text(i.title)}${
          counts && i.count ? ` <span>${i.count}</span>` : ''
        }</a></li>`,
      )
      .join('\n    ')}
  </ul>
</nav>`;
};

export const sectionHead = ({ eyebrow, h2, note, wide }) => `
<div class="sec-head${wide ? ' sec-head--wide' : ''}">
  ${eyebrow ? `<span class="eyebrow">${text(eyebrow)}</span>` : ''}
  <h2 class="h2" id="${anchorId(h2)}" tabindex="-1">${text(h2)}</h2>
  ${note ? `<p class="sec-head__note">${rich(note)}</p>` : ''}
</div>`;

export const signals = (items) => `
<ul class="signals" role="list">
${items
  .map(
    (s) => `  <li><span class="signals__v">${text(s.value)}</span><span class="signals__l">${text(s.label)}</span></li>`,
  )
  .join('\n')}
</ul>`;

export const deflist = (items) => `
<ul class="deflist" role="list">
${items
  .map(
    (i) => `  <li><span class="deflist__t">${rich(i.term)}</span><span class="deflist__d">${rich(i.text)}</span></li>`,
  )
  .join('\n')}
</ul>`;

export const stepList = (items) => `
<ol class="steps" role="list">
${items
  .map(
    (s) => `  <li>
    <span class="steps__t">${text(s.title)}</span>
    ${s.duration ? `<span class="steps__meta">${text(s.duration)}</span>` : ''}
    <span class="steps__d">${rich(s.text)}</span>
    ${s.check ? `<span class="steps__check"><b>How to check</b>${rich(s.check)}</span>` : ''}
  </li>`,
  )
  .join('\n')}
</ol>`;

/**
 * Each answer gets a stable id from its question, so a single answer can be
 * linked to. Seventeen questions were addressable only by their group, which
 * meant you could not send somebody the licensing answer — and a FAQ answer is
 * exactly the thing people forward. site.js opens the targeted one; without
 * JavaScript the link still scrolls to the right question and you click it.
 */
export const faqList = (faqs) => `
<div class="faq">
${faqs
  .map(
    (f) => `  <details id="${anchorId(f.q)}">
    <summary>${text(f.q)}</summary>
    <div class="faq__a"><p>${rich(f.a)}</p></div>
  </details>`,
  )
  .join('\n')}
</div>`;

/**
 * Card background. Sized for a card, not a hero: at three-up the card is about
 * a third of the container, so 640/960 do the work and 1376 is only ever
 * reached by a single-column phone layout. Always lazy — every card grid on
 * this site sits below the fold.
 */
export const cardBg = (image, alt, focus = '') => `<span class="card__bg"${
  focus ? ` style="--card-focus:${esc(focus)}"` : ''
}>${picture({
  name: image,
  alt,
  sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw',
})}</span>`;

export const serviceCard = (s) => `
<a class="card card--photo${s.slug === 'hvac-air-conditioner-mold-remediation' ? ' card--flag' : ''}" href="${url.service(s.slug)}">
  ${cardBg(s.media.image, '')}
  <span class="card__eyebrow">${text(s.eyebrow)}</span>
  <span class="card__t">${text(s.navLong)}</span>
  <span class="card__d">${text(s.short)}</span>
  <span class="card__more">Read more <span class="arr">&rarr;</span></span>
</a>`;

export const relatedBlock = (slugs, allServices) => {
  const items = slugs.map((sl) => allServices.find((s) => s.slug === sl)).filter(Boolean);
  if (!items.length) return '';
  return `<div class="related">
${items
  .map(
    (s) => `  <a href="${url.service(s.slug)}">
    <span class="related__e">${text(s.eyebrow)}</span>
    <span class="related__t">${text(s.navLong)}</span>
  </a>`,
  )
  .join('\n')}
</div>`;
};

export function ctaBand({ h2, body, eyebrow = 'Next step' } = {}) {
  return `
<section class="section cta-band">
  <div class="wrap cta-band__grid">
    <div>
      <span class="eyebrow">${text(eyebrow)}</span>
      <h2>${text(h2 || 'Tell us what you are seeing and we will tell you what it is')}</h2>
      <p>${text(body || 'We come out, look at what is happening, and write you a scope you could hand to another company. Walkthrough rather than assessment on purpose — assessment is the separately licensed job we refer out. If it turns out you do not need remediation, we will say so — that is the most useful thing we can tell you.')}</p>
    </div>
    <div>
      <a class="cta-band__phone" href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a>
      <p class="cta-band__meta">
        ${text(site.hoursText)}<br>
        ${text(site.responseWindow)}
      </p>
      <p class="mt-md"><a class="btn btn--onink" href="${url.contact}">Request an inspection</a></p>
    </div>
  </div>
</section>`;
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
export function footer() {
  // The build year, in the business's own timezone. This was a literal 2026 with
  // a comment suggesting someone bump it by hand — which is a footer that goes
  // stale on every one of thirty-seven pages at midnight on 1 January, and the
  // kind of thing a visitor reads as an abandoned site.
  const year = new Intl.DateTimeFormat('en-CA', {
    timeZone: site.timezone, year: 'numeric',
  }).format(new Date());
  return `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div class="ftr__brand">
        <p class="ftr__name">${brandLockup({ reversed: true, cls: 'ftr__logo' })}</p>
        <p class="ftr__meta">${text(site.serviceRadiusNote)}</p>
        <dl class="ftr__meta">
          ${site.license ? `<dt>${esc(site.licenseLabel)}</dt><dd>${esc(site.license)}</dd>` : ''}
          <dt>Phone</dt><dd><a href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a></dd>
          <dt>Hours</dt><dd>${text(site.hoursText)}</dd>
        </dl>
      </div>

      <div>
        <h2>Services</h2>
        <ul role="list">
          ${services.map((s) => `<li><a href="${url.service(s.slug)}">${esc(s.navLong)}</a></li>`).join('\n          ')}
        </ul>
      </div>

      ${counties
        .map(
          (c) => `<div>
        <h2>${esc(c.short)} County</h2>
        <ul role="list">
          ${c.areas.map((a) => `<li><a href="${url.area(a.slug)}">${esc(a.name)}</a></li>`).join('\n          ')}
          <!-- Deep-linked: this link says "All Broward areas" and used to land on
               the undifferentiated hub, leaving the reader to find the county
               themselves. It now goes to that county's section. -->
          <li><a href="${url.areas}#${anchorId(c.name)}">All ${esc(c.short)} areas</a></li>
        </ul>
      </div>`,
        )
        .join('\n      ')}

      <div>
        <h2>Company</h2>
        <ul role="list">
          <li><a href="${url.about}">About</a></li>
          <li><a href="${url.process}">Our process</a></li>
          <li><a href="${url.guides}">Guides</a></li>
          <li><a href="${url.faq}">FAQ</a></li>
          <li><a href="${url.contact}">Contact</a></li>
          <li><a href="${url.privacy}">Privacy</a></li>
        </ul>
      </div>
    </div>

    <div class="ftr__bottom">
      ${/*
        The footer is on all 37 pages, which is why an unconditional licence
        line here printed "FL Mold Remediator Lic. null." site-wide. A licence
        and an insurance line are things the footer says only when there is
        something to say.
      */''}
      <span>&copy; ${year} ${esc(site.name)}.${site.license ? ` ${esc(site.licenseLabel)} ${esc(site.license)}.` : ''}</span>
      ${site.insurance ? `<span>${esc(site.insurance)}</span>` : ''}
    </div>

    <!-- Paper only. Printing hides the header, the call bar and the CTA band,
         which between them carry every phone number on the page — a printed
         copy of the process checklist had the license number and no way to
         reach anybody. These pages get printed and handed to a spouse, a board,
         or an adjuster, so the number goes on the sheet. -->
    <p class="print-contact">
      ${esc(site.name)} &middot;
      <a href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a> &middot;
      ${esc(site.hoursText)}
    </p>
  </div>
</footer>`;
}

export const callBar = () => `
<div class="callbar">
  <a class="btn btn--call" href="tel:${esc(site.phoneHref)}">Call ${esc(site.phoneDisplay)}</a>
  <a class="btn btn--onink" href="${url.contact}">Get inspection</a>
</div>`;

/* ── Page shell ────────────────────────────────────────────────────────────── */
/**
 * @param {object} o
 * @param {string} o.path      Absolute site path, used for canonical + nav state
 * @param {string} o.title     Full <title>. Keep to ~60 characters.
 * @param {string} o.description  Meta description. Keep to ~155 characters.
 * @param {string} o.body      Page HTML
 * @param {object[]} o.schema  JSON-LD objects
 * @param {object[]} o.trail   Breadcrumb trail
 */

/**
 * Real pixel dimensions of a built image, read from the file header.
 *
 * These were hardcoded as 1376x768, which was true of all eighteen share images
 * and would have stayed true right up until somebody added one with a different
 * crop — at which point the page would have declared dimensions the file does
 * not have, and the platforms that use them to reserve layout would have been
 * told a lie with nothing to catch it. Build-time only; the result is cached
 * per path.
 */

const sizeCache = new Map();
function imageSize(relPath) {
  if (sizeCache.has(relPath)) return sizeCache.get(relPath);
  let out = null;
  try {
    // public/, not dist/. Pages are rendered before assets are copied, so
    // reading from dist/ gets the previous build's file or nothing at all — and
    // the fallback below hid that completely: the dimensions looked derived and
    // were the hardcoded pair every time.
    const b = readFileSync(`public${relPath}`);
    if (b[0] === 0x89 && b[1] === 0x50) {
      out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };          // PNG IHDR
    } else if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') {
      // WebP. Three container variants, and the dimensions sit in a different
      // place in each. Handled because the reader silently failing on one was
      // how the previous hardcoded values survived looking derived.
      const fmt = b.toString('latin1', 12, 16);
      if (fmt === 'VP8X') {
        out = { w: (b.readUIntLE(24, 3) & 0xffffff) + 1, h: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
      } else if (fmt === 'VP8L') {
        const bits = b.readUInt32LE(21);
        out = { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
      } else if (fmt === 'VP8 ') {
        out = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      }
    } else {
      for (let i = 2; i < b.length - 9;) {                              // JPEG SOF
        if (b[i] !== 0xff) { i += 1; continue; }
        const marker = b[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          out = { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
          break;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch { /* reported below rather than swallowed */ }
  // Say so. A silent fallback is what let the hardcoded 1376x768 masquerade as a
  // measured value through a whole pass of "verification" — the numbers looked
  // right because they were the same numbers either way.
  if (!out) console.warn(`  ! could not measure ${relPath} — og:image dimensions fall back to a default`);
  sizeCache.set(relPath, out);
  return out;
}

export function page({
  // noindex defaults to the inverse of site.launchReady, so an unconfirmed
  // build cannot be indexed by being deployed. Pages that opt in explicitly
  // (the 404) stay noindex either way.
  path, title, description, body, schema = [], trail = [], noindex = !site.launchReady,
  ogImage = null, ogImageAlt = '',
}) {
  const canonical = abs(path);
  /* Social scrapers handle JPEG universally and WebP inconsistently, so the
     share image is the JPEG rendition. Pages with a hero share that hero;
     everything else falls back to the brand card. */
  const sharePath = ogImage ? `/assets/img/${ogImage}-1376.jpg` : '/assets/og-default.png';
  const measured = imageSize(sharePath);
  const share = {
    url: abs(sharePath),
    w: measured ? measured.w : (ogImage ? 1376 : 1200),
    h: measured ? measured.h : (ogImage ? 768 : 630),
    alt: ogImage ? ogImageAlt : `${site.name} — ${site.tagline}`,
  };
  const jsonld = schema.length
    ? `<script type="application/ld+json">${JSON.stringify(schema.length === 1 ? schema[0] : schema).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<!-- Marks the document as scripted before first paint, so the collapsed
     mobile nav is only applied when the toggle that opens it can actually
     run. Without this the Menu button rendered on every phone with
     JavaScript off and did nothing when tapped. -->
<script>document.documentElement.className+=' js'</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta name="theme-color" content="#0a2247">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${esc(share.url)}">
<meta property="og:image:width" content="${share.w}">
<meta property="og:image:height" content="${share.h}">
<meta property="og:image:alt" content="${esc(share.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image:alt" content="${esc(share.alt)}">

<meta name="geo.region" content="US-FL">
<meta name="geo.placename" content="${esc(site.address.city)}, Florida">

<link rel="preload" href="/fonts/archivo-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/sourceserif4-latin-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="/assets/favicon-64.png" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
${jsonld}
${site.analyticsId ? `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(site.analyticsId)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${esc(site.analyticsId)}');
</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
${breadcrumbs(trail)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${callBar()}
<script src="/site.js" defer></script>
${site.ga4Id ? gaSnippet(site.ga4Id) : ''}
</body>
</html>
`;
}

function gaSnippet(id) {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(id)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(id)}');</script>`;
}

export { services, featuredServices, counties, site };
