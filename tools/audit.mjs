#!/usr/bin/env node
/**
 * Site audit — runs every built page through headless Chrome and checks the
 * things that are easy to break and invisible in a screenshot.
 *
 *   node tools/audit.mjs [--base http://127.0.0.1:8099] [--width 390]
 *
 * Checks per page:
 *   • horizontal overflow (and names the offending elements)
 *   • console errors
 *   • exactly one <h1>, no skipped heading levels
 *   • title and meta description present and within length budgets
 *   • canonical present and self-referential
 *   • every <img> has alt, every link has an accessible name
 *   • JSON-LD parses
 *
 * Zero dependencies: talks the Chrome DevTools Protocol over Node's built-in
 * WebSocket.
 */

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../src/site.config.js';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = flag('base', 'http://127.0.0.1:8099').replace(/\/$/, '');
const WIDTH = Number(flag('width', 1440));
const HEIGHT = Number(flag('height', 900));
const PORT = 9333;

/**
 * Walked from dist/, never listed by hand. This was a literal array of 36
 * paths, and adding /privacy/ to the site did not add it here — so the new
 * page went unaudited while the footer link to it was reported as broken,
 * which reads as the page being missing rather than the list being stale.
 * A hardcoded ORIGIN a few hundred lines down had failed the same way.
 *
 * 404.html is appended separately: it is a real page with no index.html, so
 * the walk cannot see it.
 */
const ROUTES = (() => {
  const found = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === 'index.html') found.push('/' + (dir === 'dist' ? '' : dir.slice(5) + '/'));
    }
  })('dist');
  return ['/404.html', ...found.sort()];
})();

/* ── The script evaluated inside each page ─────────────────────────────────── */
/**
 * The in-page probe.
 *
 * Written as a real function and stringified, NOT as a template literal. It was
 * a template literal for a long time and that cost four separate silent
 * failures: an escape written once as \\s arrives as s, a regex stops matching,
 * and the check it belongs to reports clean forever. Backticks in a comment
 * terminate the literal outright. As a function the escapes are real, backticks
 * are harmless, and `node --check` parses this body instead of treating 400
 * lines of logic as an opaque string.
 *
 * It must stay self-contained: it is serialised and evaluated in the page, so it
 * can close over nothing from this file.
 */
function probeBody() {
  const de = document.documentElement;
  const out = { overflow: null, offenders: [], headings: [], issues: [] };

  if (de.scrollWidth > de.clientWidth + 1) {
    out.overflow = { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };
    const limit = de.clientWidth + 1;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > limit) {   // right edge only: scrollWidth measures LTR overflow, and off-canvas skip links legitimately sit at negative left
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && r.width <= de.clientWidth + 1) continue;
        out.offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '',
          left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
        });
      }
    }
    out.offenders = out.offenders.slice(0, 8);
  }

  // ── Colour contrast (WCAG 1.4.3) ────────────────────────────────────────
  // Measured, not asserted. The whole palette was swapped in one pass; the
  // only way to know nothing fell under threshold is to compute it on the
  // rendered page.
  const srgb = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  const parse = (str) => {
    const m = (str || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const n = m[1].split(/[,\s\/]+/).filter(Boolean).map(Number);
    return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
  };
  const over = (fg, bg) => ({           // composite fg (with alpha) onto bg
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  // Walk up compositing background layers until an opaque one is reached.
  // A background-image anywhere in the chain makes the backdrop unknowable
  // from computed style, so those are reported separately rather than guessed.
  function backdrop(el) {
    let node = el, acc = null, overImage = false;
    while (node && node !== document.documentElement.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') overImage = true;
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        acc = acc === null ? bg : over(acc, bg);
        if (acc.a >= 0.999) return { colour: [acc.r, acc.g, acc.b], overImage };
      }
      node = node.parentElement;
    }
    const c = acc ? over(acc, { r: 255, g: 255, b: 255, a: 1 }) : { r: 255, g: 255, b: 255 };
    return { colour: [c.r, c.g, c.b], overImage };
  }

  const lowContrast = [], overImageText = [];
  out.overImageBoxes = [];
  for (const el of document.querySelectorAll('body *')) {
    // only elements holding their own visible text
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.right < 0) continue;   // off-canvas skip link etc.

    // SVG text takes its colour from the fill property, not from color.
    const isSvgText = el.namespaceURI === 'http://www.w3.org/2000/svg';
    const fg = parse(isSvgText ? cs.fill : cs.color);
    if (!fg) continue;
    const { colour: bgc, overImage } = backdrop(el);
    const fgc = fg.a < 1 ? (() => { const c = over(fg, { r: bgc[0], g: bgc[1], b: bgc[2], a: 1 }); return [c.r, c.g, c.b]; })() : [fg.r, fg.g, fg.b];

    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const got = ratio(fgc, bgc);

    const label = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '')
      + ' "' + el.textContent.trim().slice(0, 28) + '"';

    // A photograph behind the text is very often NOT an ancestor background —
    // on the cards here it is an <img> in a sibling div, so the walk above sees
    // only the card's opaque colour and returns a confident 8.9:1 for a label
    // that measured 2.0:1 over the bright part of the photo. Anything painted
    // under the text counts, whoever owns it.
    let overMedia = overImage;
    if (!overMedia) {
      for (const m of document.querySelectorAll('img, video, canvas, picture, svg')) {
        if (el.contains(m) || m.contains(el)) continue;
        const mr = m.getBoundingClientRect();
        if (mr.width === 0 || mr.height === 0) continue;
        if (mr.left < r.right && mr.right > r.left && mr.top < r.bottom && mr.bottom > r.top) { overMedia = true; break; }
      }
    }
    if (overMedia) {
      overImageText.push(label);
      // Handed to the Node side, which screenshots this exact box with the text
      // hidden and measures the pixels actually painted behind it.
      out.overImageBoxes.push({
        x: Math.round(r.x), y: Math.round(r.y + window.scrollY),
        w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)),
        fg: fgc.map(Math.round), need, size: Math.round(size), label,
      });
      continue;
    }
    if (got < need) lowContrast.push(label + ' — ' + got.toFixed(2) + ':1, needs ' + need + ':1 (' + Math.round(size) + 'px/' + weight + ')');
  }
  if (lowContrast.length) {
    out.issues.push('contrast below WCAG AA (' + lowContrast.length + '):');
    [...new Set(lowContrast)].slice(0, 6).forEach((c) => out.issues.push('    ↳ ' + c));
  }
  out.overImageText = [...new Set(overImageText)].length;

  // Content clipped off the right edge.
  //
  // Separate from the overflow check above, and it has to be: an ancestor with
  // overflow:hidden swallows the overflow, so document.scrollWidth stays equal
  // to clientWidth while the text is still cut off and unreadable. That is a
  // worse bug than page overflow, and invisible to the scrollWidth test.
  // Genuinely scrollable ancestors (overflow-x auto/scroll) are exempt — there
  // the content is reachable by design.
  const clipped = [];
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,a,span,dd,dt,button,figcaption')) {
    if (!(el.textContent || '').trim()) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= de.clientWidth + 1) continue;
    let scrollable = false, node = el.parentElement;
    while (node && node !== document.body) {
      const ox = getComputedStyle(node).overflowX;
      if (ox === 'auto' || ox === 'scroll') { scrollable = true; break; }
      node = node.parentElement;
    }
    if (scrollable) continue;
    clipped.push(el.tagName.toLowerCase() + ' "' + el.textContent.trim().slice(0, 45) + '" right=' + Math.round(r.right));
  }
  if (clipped.length) {
    out.issues.push('content cut off past the right edge (' + clipped.length + '):');
    clipped.slice(0, 5).forEach(c => out.issues.push('    ↳ ' + c));
  }

  // Painted dead space.
  //
  // A grid that draws hairline dividers by showing its own background through a
  // 1px gap has a property most grids do not: an empty track is not empty, it
  // paints. A three-column .related holding one card rendered two columns of
  // solid grey for ten pages and neither the overflow, contrast, nor clipping
  // check could see it, because nothing was overflowing, unreadable, or absent.
  // It was found by looking at a screenshot, which does not scale.
  //
  // Measured geometrically rather than by counting children against track
  // count: the first version of this check did the arithmetic and reported
  // .legend on the home page, which was wrong, because that grid already
  // stretches a lone final item with grid-column 1 / -1 and an item that spans
  // two tracks still counts as one child. Area cannot be fooled that way.
  const slabs = [];
  for (const el of document.querySelectorAll('div,ul,ol,section,nav')) {
    const cs = getComputedStyle(el);
    if (cs.display !== 'grid') continue;
    const bg = cs.backgroundColor;
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') continue;
    const parent = el.parentElement;
    if (parent && getComputedStyle(parent).backgroundColor === bg) continue;

    const r = el.getBoundingClientRect();
    const inner = {
      w: r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) -
         parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth),
      h: r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) -
         parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth),
    };
    if (inner.w <= 0 || inner.h <= 0) continue;

    const kids = [...el.children].filter(c => getComputedStyle(c).display !== 'none');
    if (kids.length === 0) continue;
    let covered = 0;
    for (const c of kids) {
      const cr = c.getBoundingClientRect();
      covered += cr.width * cr.height;
    }
    // The gaps are meant to show background — that is the divider. Allow for
    // them so an ordinary gapped grid does not read as dead space.
    const cols = cs.gridTemplateColumns.split(' ').filter(t => t.endsWith('px')).length || 1;
    const rows = cs.gridTemplateRows.split(' ').filter(t => t.endsWith('px')).length || 1;
    const gapArea = (parseFloat(cs.columnGap) || 0) * (cols - 1) * inner.h +
                    (parseFloat(cs.rowGap) || 0) * (rows - 1) * inner.w;
    const dead = inner.w * inner.h - covered - gapArea;
    if (dead < 10000) continue;
    slabs.push('.' + (el.className || el.tagName.toLowerCase()).split(' ')[0] +
      ' leaves about ' + Math.round(dead) + 'px2 of its own background uncovered (' +
      kids.length + ' children, ' + cols + ' tracks)');
  }
  if (slabs.length) {
    out.issues.push('grid paints dead space (' + slabs.length + '):');
    slabs.slice(0, 5).forEach(c => out.issues.push('    \u21b3 ' + c));
  }

  // Focus indicator contrast (WCAG 2.4.11).
  //
  // The audit already proves every control is keyboard reachable. It said
  // nothing about whether you can see where you are once you arrive, and the
  // answer was no across every dark section of the site: the flag-orange ring
  // measured 2.66:1 against the navy behind the hero, the CTA band, the footer
  // and the service cards. Thirty footer links per page sat on that ground.
  //
  // Read from the CSSOM rather than by focusing anything. Calling el.focus()
  // from script does not reliably match :focus-visible in Chrome, and a probe
  // that did exactly that reported every link on the site as unringed — a false
  // positive that would have sent someone rewriting working CSS.
  const rootStyle = getComputedStyle(document.documentElement);
  // No regex in here. This probe is a template literal, so a backslash escape
  // is eaten before the browser ever sees it: /var\(/ arrives as /var(/, which
  // stops matching, resolveVar returned the whole shorthand instead of a colour,
  // every element failed to parse and the entire check reported clean. That is
  // the fourth time this file has lost an escape that way.
  const resolveVar = (v) => {
    const i = v.indexOf('var(');
    if (i < 0) return v;
    const j = v.indexOf(')', i);
    if (j < 0) return v;
    return rootStyle.getPropertyValue(v.slice(i + 4, j).trim()).trim();
  };
  const hexToRgb = (h) => {
    const x = h.replace('#', '');
    if (x.length !== 6) return null;
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
  };
  const focusRules = [];
  const focusSkips = [];
  for (const sheet of document.styleSheets) {
    let rules;
    // A stylesheet this page cannot read is a stylesheet whose focus rules are
    // invisible to the check below. Everything here is same-origin so it should
    // never happen — which is exactly why it needs to be said out loud if it
    // does, rather than quietly shrinking what the check covers.
    try { rules = sheet.cssRules; } catch { focusSkips.push('unreadable stylesheet ' + (sheet.href || 'inline')); continue; }
    for (const rule of rules) {
      if (!rule.selectorText || !rule.selectorText.includes(':focus-visible')) continue;
      // The base rule writes the outline shorthand, and a longhand reads back
      // empty from a shorthand, so collecting only outline-color left the
      // site-wide ring unexamined and the whole check silently inert — it
      // reported clean with the fix deliberately removed. No backticks in this
      // comment: the probe is a template literal and they terminate it.
      const colour = rule.style.getPropertyValue('outline-color')
        || rule.style.getPropertyValue('outline')
        || rule.cssText.split('outline:')[1];
      if (!colour) continue;
      // Removing the pseudo-class can leave a dangling combinator: the rule
      // ".mhero :focus-visible" becomes ".mhero " which is not a valid selector,
      // so matches() throws, the rule is skipped, and every element inside the
      // hero appears to carry only the site-wide ring. Put a universal selector
      // back where the descendant combinator was.
      const sel = rule.selectorText.split(',').map((part) => {
        let piece = part.split(':focus-visible').join('');
        const last = piece[piece.length - 1];
        if (last === ' ' || last === '>' || last === '+' || last === '~') piece += '*';
        return piece.trim();
      }).filter(Boolean).join(',');
      focusRules.push({ sel, colour });
    }
  }
  const dimRings = [];
  if (focusRules.length) {
    for (const el of document.querySelectorAll('a[href],button,summary,input,select,textarea')) {
      if (el.tabIndex < 0 || !el.checkVisibility({ checkVisibilityCSS: true })) continue;
      let ring = null;
      for (const r of focusRules) {
        let hit = false;
        // A selector that throws is reported rather than silently treated as
        // "does not match". Note this would NOT have caught the original
        // dark-ground bug, and it is worth knowing why: stripping
        // :focus-visible from ".mhero :focus-visible" leaves ".mhero ", and the
        // browser trims the trailing space rather than rejecting it. Measured:
        // ".mhero " matches the hero element itself and none of its
        // descendants, where ".mhero *" does the opposite. No exception, no
        // skip — just the rule quietly applied to the wrong elements, which is
        // the worse failure of the two.
        try { hit = el.matches(r.sel); } catch { focusSkips.push('invalid selector ' + r.sel); }
        if (hit) ring = r.colour;   // later rules win, matching document order
      }
      if (!ring) continue;
      const words = resolveVar(ring).trim().split(' ').filter(Boolean);
      const token = words[words.length - 1];
      const rgb = token.startsWith('#') ? hexToRgb(token) : (parse(token) ? [parse(token).r, parse(token).g, parse(token).b] : null);
      if (!rgb) continue;
      const { colour: ground, overImage } = backdrop(el);
      if (overImage) continue;
      const cr = ratio(rgb, ground);
      if (cr < 3) {
        dimRings.push(el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] +
          ' ring ' + cr.toFixed(2) + ':1 against its background');
      }
    }
  }
  if (focusSkips.length) {
    out.issues.push('focus rules skipped, so some rings went unchecked (' + [...new Set(focusSkips)].length + '):');
    [...new Set(focusSkips)].slice(0, 3).forEach((f) => out.issues.push('    \u21b3 ' + f));
  }
  if (dimRings.length) {
    out.issues.push('focus ring under 3:1 (' + [...new Set(dimRings)].length + '):');
    [...new Set(dimRings)].slice(0, 4).forEach((d) => out.issues.push('    \u21b3 ' + d));
  }

  // List semantics under list-style: none.
  //
  // WebKit drops the list role when list-style is none, so VoiceOver stops
  // announcing "list, N items" and the item counts with it. This site sets
  // list-style: none on nine components, including the ten-step process where
  // the sequence is the entire point, and none of them declared role="list".
  // Most of the traffic here is an iPhone.
  const rolelessLists = [];
  for (const el of document.querySelectorAll('ul,ol')) {
    if (!el.checkVisibility({ checkVisibilityCSS: true })) continue;
    if (getComputedStyle(el).listStyleType !== 'none') continue;
    if (el.getAttribute('role') === 'list') continue;
    rolelessLists.push((el.className || el.tagName).toString().split(' ')[0] +
      ' has list-style none and no role=list');
  }
  if (rolelessLists.length) {
    out.issues.push('list semantics lost to list-style:none (' + [...new Set(rolelessLists)].length + '):');
    [...new Set(rolelessLists)].slice(0, 4).forEach((r) => out.issues.push('    \u21b3 ' + r));
  }

  // Text clipped by an ellipsis.
  //
  // Invisible to the overflow check above, and necessarily so: an element with
  // text-overflow: ellipsis reports itself as fitting, because the truncation is
  // the styling working. The sticky call bar rendered its second button as
  // "Get inspec…" at 320px and nothing anywhere reported a problem — it took
  // looking at a 320px screen to see it.
  //
  // SVG is excluded. Its text nodes do not clip through CSS overflow and report
  // scroll/client widths that are not comparable, which produced the only
  // finding this check had before the exclusion.
  const clipped2 = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.namespaceURI === 'http://www.w3.org/2000/svg') continue;
    if (!el.textContent || !el.textContent.trim()) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!el.checkVisibility({ checkVisibilityCSS: true })) continue;
    const cs = getComputedStyle(el);
    const clips = cs.textOverflow === 'ellipsis' || cs.whiteSpace === 'nowrap'
      || cs.overflow === 'hidden' || cs.overflowX === 'hidden';
    if (!clips) continue;
    if (el.scrollWidth > el.clientWidth + 1) {
      clipped2.push(el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] +
        ' "' + el.textContent.trim().slice(0, 26) + '" needs ' + el.scrollWidth + 'px in ' + el.clientWidth + 'px');
    }
  }
  if (clipped2.length) {
    out.issues.push('text truncated by an ellipsis (' + [...new Set(clipped2)].length + '):');
    [...new Set(clipped2)].slice(0, 4).forEach((c) => out.issues.push('    \u21b3 ' + c));
  }

  // Orphaned column.
  //
  // Sibling sections in a grid — each with its own heading — where the final row
  // holds exactly one, leaving empty tracks beside it. The footer did this
  // between 560 and 1000px for a long time: four link columns in three tracks,
  // Company alone on the last row. It painted no dead space because the columns
  // are the same colour as the footer, so the check above could not see it.
  //
  // Restricted to children carrying headings on purpose. Applied to any grid it
  // reports about forty list layouts whose item count simply is not a multiple
  // of the column count, which is normal and not a defect — a list with a short
  // final row reads as a list. A column of headings with an empty neighbour
  // reads as broken.
  const orphans = [];
  for (const g of document.querySelectorAll('div,ul,ol,section,nav,footer')) {
    const cs = getComputedStyle(g);
    if (cs.display !== 'grid') continue;
    const tracks = cs.gridTemplateColumns.split(' ').filter((t) => t.endsWith('px')).length;
    if (tracks < 2) continue;
    const gw = g.getBoundingClientRect().width;
    // A child spanning every track is not part of the column flow. Leaving it in
    // was enough to make this check silently pass on the very case it exists for.
    const kids = [...g.children]
      .filter((c) => getComputedStyle(c).display !== 'none')
      .filter((c) => c.getBoundingClientRect().width < gw * 0.9);
    if (kids.length <= tracks) continue;
    if (!kids.every((k) => k.querySelector('h2,h3,h4'))) continue;
    const tops = [...new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top)))];
    if (tops.length < 2) continue;
    const last = tops[tops.length - 1];
    if (kids.filter((k) => Math.round(k.getBoundingClientRect().top) === last).length !== 1) continue;
    orphans.push('.' + (g.className || g.tagName).toString().split(' ')[0] +
      ' has ' + kids.length + ' sections in ' + tracks + ' tracks, last row holds one');
  }
  if (orphans.length) {
    out.issues.push('orphaned column in a grid (' + orphans.length + '):');
    orphans.slice(0, 4).forEach((o) => out.issues.push('    \u21b3 ' + o));
  }

  // Headings
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  out.headings = hs.map(h => Number(h.tagName[1]));
  const h1s = hs.filter(h => h.tagName === 'H1').length;
  if (h1s !== 1) out.issues.push('h1 count = ' + h1s);
  let prev = 0;
  for (const h of hs) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) { out.issues.push('heading jump h' + prev + ' -> h' + lvl + ': "' + h.textContent.trim().slice(0, 40) + '"'); break; }
    prev = lvl;
  }

  // Meta
  const title = document.title || '';
  const desc = (document.querySelector('meta[name="description"]') || {}).content || '';
  const canon = (document.querySelector('link[rel="canonical"]') || {}).href || '';
  out.meta = { title, titleLen: title.length, desc, descLen: desc.length, canon };
  if (!title) out.issues.push('no <title>');
  if (title.length > 62) out.issues.push('title ' + title.length + ' chars (>62, will truncate in SERP)');
  if (!desc) out.issues.push('no meta description');
  if (desc.length > 160) out.issues.push('description ' + desc.length + ' chars (>160)');
  if (!canon) out.issues.push('no canonical');
  else if (canon.replace(/^https?:\/\/[^/]+/, '') !== location.pathname) out.issues.push('canonical path mismatch: ' + canon);

  // Social share image must exist and be described.
  const ogImg = (document.querySelector('meta[property="og:image"]') || {}).content || '';
  const ogAlt = (document.querySelector('meta[property="og:image:alt"]') || {}).content || '';
  if (!ogImg) out.issues.push('no og:image');
  if (!ogAlt) out.issues.push('og:image has no og:image:alt');

  // ── Keyboard reachability ───────────────────────────────────────────────
  // Element.checkVisibility walks ancestors, so a link inside a collapsed nav
  // or a hidden call bar is correctly excluded — those are not in the tab
  // order and flagging them is noise. tabindex="-1" is likewise excluded:
  // programmatically focusable is not the same as keyboard reachable.
  const focusSel = 'a[href],button,input,select,textarea,summary,[tabindex]';
  for (const el of document.querySelectorAll(focusSel)) {
    const ti = el.getAttribute('tabindex');
    if (ti !== null && Number(ti) < 0) continue;
    if (Number(ti) > 0) out.issues.push('positive tabindex (breaks focus order): ' + el.tagName.toLowerCase() + ' tabindex=' + ti);
    if (!el.checkVisibility || !el.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) continue;
    if (el.classList.contains('skip')) continue;   // off-canvas by design until focused
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) {
      out.issues.push('zero-size but keyboard reachable: ' + el.tagName.toLowerCase() + ' "' + (el.textContent || '').trim().slice(0, 30) + '"');
      continue;
    }
    const name = (el.textContent || '').trim()
      || el.getAttribute('aria-label') || el.getAttribute('title')
      || (el.labels && el.labels[0] && el.labels[0].textContent.trim()) || '';
    if (!name) out.issues.push('focusable with no accessible name: ' + el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.split(' ')[0] : ''));
  }

  // Exactly one nav item may claim to be the current page
  const cur = document.querySelectorAll('nav[aria-label="Main"] [aria-current]');
  if (cur.length > 1) out.issues.push(cur.length + ' nav items marked aria-current: ' + [...cur].map(a => a.textContent.trim()).join(', '));

  // Images and links
  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) out.issues.push('img without alt: ' + (img.getAttribute('src') || ''));
  }
  let namelessLinks = 0;
  for (const a of document.querySelectorAll('a[href]')) {
    const name = (a.textContent || '').trim() || a.getAttribute('aria-label') || a.getAttribute('title') || '';
    if (!name) namelessLinks++;
  }
  if (namelessLinks) out.issues.push(namelessLinks + ' link(s) with no accessible name');

  // Informative SVG needs a name
  for (const svg of document.querySelectorAll('svg[role="img"]')) {
    const labelled = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
    if (!labelled) out.issues.push('svg[role=img] without accessible name');
  }

  // JSON-LD
  out.jsonld = [];
  out.schemaFragments = [];
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(s.textContent);
      const nodes = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
      out.jsonld.push(...nodes.map(n => Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']));
      // Any url in the graph that carries a fragment. Structured data pointing
      // at an anchor that does not exist is worse than omitting the url — the
      // markup builds these ids from the question text and the schema builds
      // them from a stripped copy of it, so the two can drift apart silently.
      const collect = (n) => {
        if (Array.isArray(n)) return n.forEach(collect);
        if (!n || typeof n !== 'object') return;
        for (const [k, v] of Object.entries(n)) {
          if (k === 'url' && typeof v === 'string' && v.includes('#')) out.schemaFragments.push(v);
          else collect(v);
        }
      };
      collect(parsed);
    } catch (e) { out.issues.push('JSON-LD parse error: ' + e.message); }
  }
  if (!out.jsonld.length) out.issues.push('no JSON-LD');

  out.links = [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href'));
  // Every id on the page, so a fragment link can be checked against the page it
  // actually points at rather than merely against the path.
  out.ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  return out;
}

const PROBE = '(' + probeBody.toString() + ')()';

/**
 * Print contrast, run on the same loaded page with the media type switched.
 *
 * Browsers drop background colours when printing but keep the text colour, so
 * anything designed light-on-dark prints light-on-white. The hero h1 measured
 * 1.00:1 on paper — white on white — and the photo card titles the same, across
 * twenty-three of thirty-six pages, with nothing in the audit able to see it.
 *
 * Only the ratio against white is computed: on paper the background is paper.
 */
function printProbe() {
  const bad = [];
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  for (const el of document.querySelectorAll('main *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.height) continue;
    const nums = (cs.color.match(/[0-9.]+/g) || []).map(Number);
    if (nums.length < 3) continue;
    if (nums.length > 3 && nums[3] === 0) continue;
    const ratio = 1.05 / (lum(nums) + 0.05);
    if (ratio < 4.5) {
      bad.push(el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] +
        ' ' + ratio.toFixed(2) + ':1 on paper');
    }
  }
  return [...new Set(bad)];
}

const PRINT_PROBE = '(' + printProbe.toString() + ')()';

/* ── Minimal CDP client ────────────────────────────────────────────────────── */
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? reject(new Error(m.error.message)) : resolve(m.result);
      } else if (m.method) {
        (this.handlers.get(m.method) || []).forEach((h) => h(m.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
}

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const target = list.find((t) => t.type === 'page');
      if (target) {
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.addEventListener('open', res, { once: true });
          ws.addEventListener('error', rej, { once: true });
        });
        return new CDP(ws);
      }
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Could not connect to Chrome');
}

/* ── Run ───────────────────────────────────────────────────────────────────── */
const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/audit-profile-${PORT}`,
  `--window-size=${WIDTH},${HEIGHT}`,
  'about:blank',
], { stdio: 'ignore' });

let failed = 0;
let totalIssues = 0;
const seenInternalLinks = new Set();
/** route -> Set(ids on that page), and every fragment link seen anywhere. */
const idsByRoute = new Map();
const fragmentLinks = new Set();
/** Fragment-bearing urls found inside JSON-LD, checked the same way. */
const schemaFragmentLinks = new Set();
/* Read from the config, never restated here. This was hardcoded with a www.
   that site.config.js later dropped, and the mismatch made
   href.replace(ORIGIN, '') a no-op: every schema url kept its scheme and host,
   matched no route, and landed in the "not crawled" bucket. The check caught
   it — that bucket exists precisely so skipped links are never dropped quietly
   — but it reported 145 uncrawled pages when the real fault was one stale
   string in the checker. Deriving it means the two cannot disagree. */
const ORIGIN = site.origin.replace(/\/$/, '');

try {
  const cdp = await connect();
  await cdp.send('Page.enable');
  // The audit measures the page at rest, not mid-transition. Scroll-driven
  // reveals start every below-fold block at opacity 0 and only complete as it
  // scrolls into view — so a screenshot of a card at the top of a long page
  // captured the photograph and none of the type, and the over-image contrast
  // check reported 1.1:1 on labels that read at 10:1 once revealed. Emulating
  // reduced-motion resolves every animation to its resting state, which is
  // also exactly what a reduced-motion visitor sees, so it is a real state and
  // not a testing fiction. Motion itself is checked separately in motion.mjs.
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp.send('Runtime.enable');
  // Chrome keeps a disk cache in --user-data-dir, and that directory is keyed on
  // a constant port, so it survives between runs. Against a dev server that
  // answers conditional requests, a tool run straight after a rebuild could be
  // served the previous build and report on it. That is how a sentinel holding a
  // known-bad claim passed twice out of three runs.
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Log.enable');

  let consoleErrors = [];
  cdp.on('Runtime.exceptionThrown', (p) =>
    consoleErrors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text));
  cdp.on('Log.entryAdded', (p) => { if (p.entry.level === 'error') consoleErrors.push(p.entry.text); });

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: WIDTH < 700,
  });

  /* One load handler for the whole run, not one per route.
     Registering inside the loop leaked a handler per page — by the last route
     thirty stale callbacks were firing against already-resolved promises — and
     every route paid a fixed 6s ceiling. This resolves as soon as the page
     actually loads and only falls back to the ceiling if it never does. */
  let onLoad = null;
  cdp.on('Page.loadEventFired', () => { if (onLoad) onLoad(); });
  const waitForLoad = () =>
    new Promise((res) => {
      let done = false;
      const finish = () => { if (done) return; done = true; onLoad = null; res(); };
      const ceiling = setTimeout(finish, 8000);
      onLoad = () => { clearTimeout(ceiling); setTimeout(finish, 250); };
    });

  console.log(`\n▸ Auditing ${ROUTES.length} pages at ${WIDTH}px — ${BASE}\n`);

/* The mask hides the GLYPHS, not the element. It used visibility: hidden,
   which also removes the element's own background — and the moment a button
   took a gradient (a background-image, which backdrop() rightly refuses to
   guess at), the pixel path hid the whole button and measured its white label
   against the paper behind it: 1.14:1, on a control that renders at 5:1. A
   state that cannot paint is not a finding. Transparent color/fill keeps every
   layer that really sits under the text — own gradient, scrim, photograph —
   which is also more honest for the photo cases this path was built for.
   The full style attribute is saved and restored because several elements
   carry real inline styles (--i indexes, --lead offsets). */
const MASK_ON = `document.querySelectorAll('body *').forEach((e) => {
  if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
    e.dataset.cmask = e.getAttribute('style') || '';
    e.style.color = 'transparent';
    e.style.fill = 'transparent';
    e.style.textShadow = 'none';
  }
});`;
const MASK_OFF = `document.querySelectorAll('[data-cmask]').forEach((e) => {
  if (e.dataset.cmask) e.setAttribute('style', e.dataset.cmask);
  else e.removeAttribute('style');
  delete e.dataset.cmask;
});`;

  for (const route of ROUTES) {
    consoleErrors = [];
    await cdp.send('Page.navigate', { url: BASE + route });
    await waitForLoad();

    const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
      expression: PROBE, returnByValue: true, awaitPromise: false,
    });
    if (exceptionDetails) {
      console.log(`✗ ${route}\n    probe failed: ${exceptionDetails.text}`);
      failed++;
      continue;
    }
    const r = result.value;

    // Text painted over a photograph cannot be scored from computed style, so
    // it is measured from the pixels instead: hide the labels, screenshot each
    // box, decode it, and compare the foreground against what is actually
    // behind it. This used to be counted and skipped, which is how 15 cards
    // shipped an eyebrow at 2.0:1 while the audit reported them clean.
    const boxes = r.overImageBoxes || [];
    if (boxes.length) {
      // Card photographs are below the fold and lazy; without this the capture
      // lands on the placeholder colour and every box scores a fake pass.
      await cdp.send('Runtime.evaluate', {
        awaitPromise: true, returnByValue: true, expression: `
        (async () => {
          document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
          await Promise.all([...document.querySelectorAll('img')].map((i) => (i.complete ? 0 : i.decode().catch(() => 0))));
          return 1;
        })()`,
      });
      await new Promise((res) => setTimeout(res, 450));
      await cdp.send('Runtime.evaluate', { expression: MASK_ON });
      const overBad = [];
      for (const b of boxes) {
        const shot = await cdp.send('Page.captureScreenshot', {
          format: 'png', captureBeyondViewport: true,
          clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 },
        }).catch(() => null);
        if (!shot) continue;
        const px = await cdp.send('Runtime.evaluate', {
          awaitPromise: true, returnByValue: true, expression: `
          (async () => {
            const im = new Image(); im.src = 'data:image/png;base64,${shot.data}'; await im.decode();
            const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
            const g = c.getContext('2d'); g.drawImage(im, 0, 0);
            const d = g.getImageData(0, 0, c.width, c.height).data;
            let r = 0, gg = 0, bb = 0, n = 0, maxL = -1, worst = [0, 0, 0];
            for (let i = 0; i < d.length; i += 4) {
              r += d[i]; gg += d[i + 1]; bb += d[i + 2]; n++;
              const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
              if (l > maxL) { maxL = l; worst = [d[i], d[i + 1], d[i + 2]]; }
            }
            return JSON.stringify({ mean: [Math.round(r / n), Math.round(gg / n), Math.round(bb / n)], worst });
          })()`,
        }).catch(() => null);
        if (!px?.result?.value) continue;
        const { mean, worst } = JSON.parse(px.result.value);
        const L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
        const CR = (a, c) => { const [hi, lo] = [L(a), L(c)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
        const m = CR(b.fg, mean), w = CR(b.fg, worst);
        if (m < b.need) overBad.push(`${b.label} — ${m.toFixed(2)}:1 over the photo (worst pixel ${w.toFixed(2)}:1), needs ${b.need}:1 (${b.size}px)`);
      }
      await cdp.send('Runtime.evaluate', { expression: MASK_OFF });
      if (overBad.length) {
        r.issues.push('contrast below WCAG AA over an image (' + overBad.length + '):');
        overBad.slice(0, 6).forEach((c) => r.issues.push('    \u21b3 ' + c));
      }
    }

    // Same page, print media. Cheap: one media switch and one evaluate.
    await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
    // Style recalculation after a media switch is not synchronous with the next
    // evaluate. Without this the probe read the screen styles and reported the
    // contact form submit at 1.00:1 on paper when print media resolves it to
    // ink on transparent — a false positive, which is the failure mode that
    // makes a check worse than useless.
    await new Promise((r) => setTimeout(r, 120));
    const printRes = await cdp.send('Runtime.evaluate', {
      expression: PRINT_PROBE, returnByValue: true,
    });
    // Back to screen, keeping the reduced-motion feature set at Page.enable.
    await cdp.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const printBad = printRes.result.value || [];
    if (printBad.length) {
      r.issues.push('unreadable when printed (' + printBad.length + '):');
      printBad.slice(0, 4).forEach((b) => r.issues.push('    \u21b3 ' + b));
    }
    r.links.forEach((l) => {
      seenInternalLinks.add(l.split('#')[0]);
      // The fragment used to be split off and dropped here, which meant a link
      // to /page/#typo passed the integrity check because /page/ existed.
      if (l.includes('#') && !l.endsWith('#')) fragmentLinks.add(`${route}\u0000${l}`);
    });
    idsByRoute.set(route, new Set(r.ids));
    (r.schemaFragments || []).forEach((u) => schemaFragmentLinks.add(`${route}\u0000${u}`));

    const problems = [...r.issues];
    if (r.overflow) {
      problems.push(`horizontal overflow: ${r.overflow.scrollWidth}px in ${r.overflow.clientWidth}px`);
      r.offenders.forEach((o) =>
        problems.push(`    ↳ <${o.tag} class="${String(o.cls).slice(0, 60)}"> right=${o.right} width=${o.width}`));
    }
    consoleErrors.forEach((e) => problems.push(`console error: ${String(e).slice(0, 160)}`));

    totalIssues += problems.length;
    if (problems.length) {
      failed++;
      console.log(`✗ ${route}`);
      problems.forEach((p) => console.log(`    ${p}`));
    } else {
      console.log(`✓ ${route}  ${r.meta.titleLen}c title · ${r.meta.descLen}c desc · ${r.jsonld.join(', ')}`);
    }
  }

  // Internal link integrity
  const known = new Set([...ROUTES, '/sitemap.xml', '/robots.txt']);
  const broken = [...seenInternalLinks].filter(
    (l) => !known.has(l) && !l.startsWith('/fonts') && !l.startsWith('/assets') && l !== '/styles.css' && l !== '/site.js',
  );
  if (broken.length) {
    console.log(`\n✗ internal links with no page: ${broken.join(', ')}`);
    failed++;
  } else {
    console.log(`\n✓ every internal link resolves to a built page (${seenInternalLinks.size} distinct)`);
  }

  // Skipped links are counted, never silently dropped. A checker that reports
  // "81 checked" while quietly verifying none of them is worse than no checker,
  // and a route-key mismatch here would do exactly that.
  const deadFragments = [];
  let verified = 0;
  const unverifiable = [];
  for (const entry of schemaFragmentLinks) {
    const [from, href] = entry.split('\u0000');
    const rel = href.replace(ORIGIN, '');
    const [rawPath, frag] = rel.split('#');
    const ids = idsByRoute.get(rawPath || from);
    if (!ids) { unverifiable.push(`${from} -> schema url ${href}`); continue; }
    verified++;
    if (!ids.has(frag)) deadFragments.push(`${from} -> schema url ${href}`);
  }
  for (const entry of fragmentLinks) {
    const [from, href] = entry.split('\u0000');
    const [rawPath, frag] = href.split('#');
    const target = rawPath === '' ? from : rawPath;
    const ids = idsByRoute.get(target);
    if (!ids) { unverifiable.push(`${from} -> ${href}`); continue; }
    verified++;
    if (!ids.has(frag)) deadFragments.push(`${from} -> ${href}`);
  }
  if (deadFragments.length) {
    console.log(`\n✗ fragment links pointing at an id that does not exist (${deadFragments.length}):`);
    deadFragments.slice(0, 8).forEach((d) => console.log(`    ↳ ${d}`));
    failed++;
  } else {
    console.log(`✓ every #fragment link and schema url resolves to a real id (${verified} verified)`);
  }
  if (unverifiable.length) {
    console.log(`\n✗ fragment links whose target page was not crawled (${unverifiable.length}):`);
    unverifiable.slice(0, 5).forEach((u) => console.log(`    ↳ ${u}`));
    failed++;
  }

  console.log(`\n${failed ? `✗ ${failed} page(s) with findings, ${totalIssues} total` : '✓ all pages clean'}\n`);
} finally {
  chrome.kill();
}

process.exitCode = failed ? 1 : 0;
