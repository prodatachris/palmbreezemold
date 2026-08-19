# Palm Breeze Mold — Broward & Palm Beach County

A 37-page static local-SEO site for **Palm Breeze Mold**, a South Florida mold
remediation company, built around one specialty: **HVAC / air handler / duct
mold**.

No framework, no dependencies, no build toolchain. `node build.mjs` reads `src/`
and writes plain HTML to `dist/`. It will run on any static host.

```bash
npm run build     # -> dist/
npm run serve     # build + serve on http://127.0.0.1:8099
npm run audit     # every page through headless Chrome at 3 widths
npm run assets    # re-encode raw-assets/ -> public/assets/ (needs cwebp + ffmpeg)
npm run vitals    # measured LCP + CLS per page under Slow 4G + 4x CPU
```

> **Before this goes live**, work through [`LAUNCH.md`](LAUNCH.md). Every business
> detail on the site is a placeholder and the contact form has no backend.
>
> Deploying early is safe: until those details are confirmed in `site.verified`,
> every build marks all 37 pages `noindex` and ships an empty sitemap, and says
> so. Indexing switches on by itself once the claims are confirmed.

---

## What's here

| | |
|---|---|
| **37 pages** | home, services hub + 6 service pages, areas hub + 18 city pages, guides hub + 4 guides, process, FAQ, about, contact, 404 |
| **Weight** | 145 KB on a first mobile visit at 390px, measured — 9 requests, of which 74 KB is the four self-hosted font files — see below. ~22 KB of that is gzipped HTML+CSS+JS; the rest is fonts and images, cached after |
| **External requests** | zero. No CDN, no Google Fonts, no analytics unless you add it |
| **Media** | 17 stills self-hosted as WebP/JPEG, plus 9 hero clips as all-keyframe MP4 that are scrubbed by scroll rather than played |
| **Structured data** | LocalBusiness, WebSite, WebPage (with `primaryImageOfPage`), BreadcrumbList, Service, FAQPage, HowTo |
| **JavaScript** | one file: mobile menu, FAQ deep-links, and the scroll-scrubbed hero video. Every page is complete and navigable without it — verified by `npm run nojs`, not asserted. The nav collapse is scoped to a `js` class set before first paint, so a scriptless phone gets the links in flow instead of a Menu button that does nothing |

### Page map

```
/                                              home
/services/                                     hub
  /services/hvac-air-conditioner-mold-remediation/   ← the specialty page
  /services/mold-remediation/
  /services/mold-inspection-testing/
  /services/air-duct-cleaning-sanitizing/
  /services/black-mold-removal/
  /services/water-damage-mold-cleanup/
/service-areas/                                hub
  Broward:     fort-lauderdale · pompano-beach · coral-springs ·
               hollywood · pembroke-pines · deerfield-beach ·
               miramar · plantation · weston
  Palm Beach:  west-palm-beach · boca-raton · delray-beach ·
               boynton-beach · jupiter · lake-worth-beach ·
               palm-beach-gardens · riviera-beach · wellington
/guides/    guides hub + 4 long-form guides
/process/   /faq/   /about/   /contact/   /404.html
robots.txt  sitemap.xml
```

---

## Where to edit things

Everything is data. You should rarely need to touch a template.

| File | What lives there |
|---|---|
| `src/site.config.js` | **All business details.** Name, phone, address, license, hours, domain, analytics ID. Every ⚠️ PLACEHOLDER is in this one file. |
| `src/data/services.js` | The 6 service pages — copy, findings lists, process steps, FAQs |
| `src/data/areas.js` | The 18 city pages, plus the county coverage lists |
| `src/data/content.js` | Homepage, /process/, /faq/, /about/, /contact/, and the diagram annotations |
| `src/lib/ui.js` | Page shell, header, footer, components, the air-path diagram SVG |
| `src/lib/schema.js` | JSON-LD |
| `public/styles.css` | All styling. Design tokens are at the top under `:root` |
| `raw-assets/` | Image and video masters. `npm run assets` re-encodes them into `public/assets/` |
| `build.mjs` | Page assembly, sitemap, robots. Sitemap `lastmod` is **declared**, not taken from file mtimes: guides use their own `updated` field, everything else uses `site.contentUpdated`. It used to read mtimes, which meant four data files backed thirty-six URLs and any edit to one restamped every page it fed — producing exactly the sitemap-where-every-date-moves that a crawler learns to disregard. Dates are also clamped so clock skew cannot publish a future one. The build also refuses to write a site where two pages share a `<title>`, a meta description, or an FAQ question — the cheapest way to add a city page is to copy one, and that is exactly what turns a local site into a doorway build |

**Adding a city page**: add an entry to `src/data/areas.js` and rebuild. It picks
up nav, footer, sitemap, schema, and the coverage grids automatically. Read the
comment at the top of that file first — the rule about not templating city pages
is the whole reason these rank.

**Adding a service**: same, in `src/data/services.js`.

---

## Design

The direction is **HVAC service documentation** — hairline rules, monospace
labels, measured numbers, schematic linework. It is deliberately not the
restoration-contractor default (blue-to-green gradient, hazmat stock photo, red
24/7 EMERGENCY banner), because that look is indistinguishable across every
competitor in the market.

- **Palette** is sampled directly from the brand logo: navy `#051F46`/`#000F32`
  (the frond and the "Palm"/"Mold" wordmark), sky `#7BB8C4` (the "Breeze"
  wordmark and the wave), on the logo's cool near-white ground. Tokens are
  `--ink`, `--brand`, `--sky`, `--haze`.
- **`--flag` (burnt amber) is the one colour not in the logo**, and it is
  deliberate. It appears nowhere except where something is being marked as a
  risk or an action: the five hotspots on the air-path diagram, the specialty
  card, and the call button. Blue-on-blue destroys the diagram's entire
  semantic, and a single warm accent against navy is what makes the call button
  the loudest thing on the page. Delete it if you want a strictly two-colour
  site — it is isolated to three tokens.
- **Type**: Archivo (display/UI), Source Serif 4 (body), IBM Plex Mono
  (labels, data, phone numbers). Self-hosted, latin subset, preloaded. The serif
  ships as a pinned static instance rather than the variable font — see below.
- **Logo**: the owner-supplied lockup, composited from two measured crops of the
  source artwork. The icon is taller than the wordmark, so a single crop tall
  enough to include the wave also swallows the "Clean Air Specialists &
  Remediation" line — that line is carried as real text instead.
  `lockup-reversed` is a white silhouette for dark grounds. Masters live in
  `raw-assets/brand/`.
- **The signature** is the air-path diagram: a cutaway of a South Florida house
  tracing return → coil → pan → plenum → trunk → registers, with the five places
  growth is actually found numbered in the order the air reaches them. It is the
  page's thesis in one image, and the numbers are driven from `airPathPoints` in
  `content.js` so the SVG and its legend cannot drift apart.

Accessibility floor: single `h1` per page, no skipped heading levels, visible
focus rings, `prefers-reduced-motion` respected, informative SVGs named, all
interactive elements reachable by keyboard, and every piece of text at WCAG AA
contrast. `npm run audit` checks all of these — including measuring contrast on
the rendered page rather than trusting the palette.

---

## Imagery and hero video

Seventeen stills and three looping clips, generated with Higgsfield and committed
as masters in `raw-assets/`. `npm run assets` re-encodes them into
`public/assets/`: WebP at 640/960/1376 plus a JPEG fallback for stills, and a
silent H.264 MP4 + VP9 WebM for clips.

**These are illustrative, not documentary.** They show a homeowner what a coil,
a containment, or a stained register looks like. None is captioned as a specific
job, address, or result, and there are no before/afters in the set — a
fabricated before/after is a fabricated result claim. Replace them with real job
photography anywhere you want to say "our work." See `CONTENT-REVIEW.md`.

Alt text lives once, in the `media` registry in `src/data/content.js`, so a
given photograph is described identically everywhere it appears.

### Photo cards

The service and city card grids are photographic. Each card's background is the
same image the page it links to leads with, so a grid reads as a set of doors
rather than as decoration — and all eighteen city cards are distinct, each showing
the housing stock that page's own copy describes.

Two constraints make them work:

- **The scrim holds ~0.9 through the bottom 45%, then opens up fast.** Type only
  ever sits in the opaque band, which is what lets the top half of each
  photograph actually read instead of being flattened to protect text that was
  never going to be there.
- **Card descriptions clamp to three lines.** A long city lede would otherwise
  push the text block up out of the scrim and fail contrast, and it keeps a grid
  of cards scannable. The full sentence is one click away.

Card backgrounds carry `alt=""` deliberately: the link text already names the
destination, so an alt string would just be announced twice.

The six card images a phone actually fetches come to about 148 KB, all lazy and
all below the fold.

### How the video hero behaves

The still is always real markup and always paints first; the clip layers over it
at `opacity: 0` and fades in only once it is genuinely playing. So the LCP
element is a ~14 KB responsive WebP on mobile, not a video file — and the hero
is complete and correct with JavaScript off, on a slow link, and in every case
below where we decline to load the video at all:

- `prefers-reduced-motion: reduce`
- `Save-Data`
- viewports under 700px — most traffic here is a phone on cell data, and the
  still already carries the message
- no `<video>` support

The clips ping-pong (forward then reverse) rather than cutting back to frame
one. Every clip is a slow one-directional push, and a hard loop point on that is
the single thing that makes a background video read as cheap.

There is a visible **Pause** control on every video hero. That is not
decoration: WCAG 2.2.2 requires a mechanism to stop motion that starts
automatically and runs longer than five seconds. It stays hidden until the
script has actually attached and started a clip.

### Measured, not estimated

`npm run vitals` reports real numbers under Slow 4G + 4x CPU throttling:

| | |
|---|---|
| **CLS** | **0.000** on every page type — home, service, city, guide, contact |
| **LCP** | **~440 ms** (home), 330–940 ms across page types, against a 2500 ms "good" threshold |
| **LCP element** | the hero still, as designed — never the video, never a font-blocked heading |

Homepage transfer on a 390px phone at DPR 3 is **~193 KB** with text gzipped:
roughly 77 KB fonts, 56 KB hero image, 28 KB brand lockup, 22 KB gzipped
HTML+CSS+JS. Note that a DPR-3 phone correctly picks the **1376px** hero
rendition, not the 640px one — 390 CSS px at DPR 3 is 1170 device px. An earlier
version of this README claimed ~186 KB on the assumption the 640px rendition was
served; that was wrong, and measuring is what caught it.

The video is desktop-only and loads after `window.load`, so it is not in any of
the numbers above.

## The audit script

`tools/audit.mjs` drives headless Chrome over the CDP (Node's built-in
WebSocket, no dependencies) and checks every page for:

- horizontal overflow — and names the offending elements
- console errors
- one `h1`, no skipped heading levels
- title / meta description present and within SERP length budgets
- canonical present and self-referential
- `alt` on every image, an accessible name on every link
- content clipped past the right edge — a separate check from overflow, because
  an ancestor with `overflow: hidden` swallows the overflow and leaves
  `scrollWidth` equal to `clientWidth` while the text is still cut off. That is
  the worse bug and the scrollWidth test cannot see it. Genuinely scrollable
  ancestors are exempt.
- exactly one nav item marked `aria-current`
- an `og:image` is present and has an `og:image:alt`
- **colour contrast against WCAG AA**, computed on the rendered page: every
  element holding its own text, with background layers composited up the tree
  and alpha accounted for, against 4.5:1 for normal text and 3:1 for large.
  SVG text is read from `fill` rather than `color`
- JSON-LD parses
- every internal link resolves to a page that was actually built

```bash
node tools/audit.mjs --width 390    # mobile
node tools/audit.mjs --width 1440   # desktop
```

`tools/shots.mjs` takes screenshots with real device-metrics emulation:

```bash
node tools/shots.mjs --route /services/mold-remediation/ --width 390 --slices 5
```

> Use this rather than `chrome --headless --screenshot --window-size=390,844`.
> macOS clamps the browser window to about 400px wide, so a narrower
> `--window-size` still lays out at ~400px and just crops the image — which looks
> exactly like a horizontal-overflow bug that isn't there. Both tools set the
> viewport through `Emulation.setDeviceMetricsOverride` instead, and disable
> smooth scrolling before capturing.

---

## Checking your work

`npm run check` runs everything that should pass on every commit — the build,
the rendered-page audit at three widths, and the prose checks — and exits
non-zero if any of it fails. It starts a dev server if one is not already up.

| Command | What it actually checks |
| --- | --- |
| `npm run check` | All of the below except preflight and vitals. Start here |
| `npm run audit` | Loads every page in headless Chrome at 1440/768/390 and measures rather than asserts: horizontal overflow, content clipped past the right edge, WCAG AA contrast computed from rendered pixels, keyboard reachability, heading order, meta lengths, canonicals, `og:image` and its alt, JSON-LD parsing, internal links, `#fragment` targets **and every fragment-bearing url inside the JSON-LD**, grids that paint dead space, list semantics lost to `list-style: none`, focus-ring contrast, text truncated by an ellipsis (which the overflow check cannot see, because a clipped element reports itself as fitting), and whether anything becomes unreadable when printed |
| `npm run prose` | Cross-page and within-page repetition. A sentence appearing on more than three pages fails unless it is listed as deliberate in `BY_DESIGN`; so does one page making the same point twice in different words |
| `npm run preflight` | **Launch gate.** Every claim the site makes about the business, and where each one has reached the built pages. Fails until each is confirmed in `site.verified`. Deliberately excluded from `check`, because it is red by design until launch and a permanently red check is one nobody reads |
| `npm run zoom` | WCAG 1.4.4 — every page with text forced to 200%. Reports clipped text and horizontal overflow. Both pass on all 36 pages at 320px and 390px; the tool's header records the two causes and how to trace a regression |
| `npm run targets` | WCAG 2.5.8 — every tap target measured at 390px. Fails under 24x24; also lists anything under the 44px Apple/Material comfort line, and reports how many were exempt as inline in a sentence |
| `npm run nojs` | Every page with JavaScript disabled. Fails if the nav is unreachable, if a menu toggle is on screen that nothing can open, or if a page loses its content. The claim below used to be untested, and was false on phones |
| `npm run vitals` | LCP, CLS and FCP per page under Slow 4G with 4x CPU throttling, on a cold cache against a brotli-serving host — the combination a first-time mobile visitor actually gets |
| `npm run shots` | Screenshots at a given width — `--route`, `--width`, `--slices`, `--at "<selector>"` |

Two of these exist because a check that looked fine was not. `preflight` replaced
a grep for placeholder strings that reported "clean" while three fabricated
credentials were live on 37 pages. The fragment check inside `audit` was added
after the link check turned out to be discarding the `#fragment` before
validating it. Both are worth knowing about before trusting a green run.

## Deploying

`dist/` is the whole site. Point any static host at it.

- **Netlify / Cloudflare Pages** — build `node build.mjs`, publish `dist`.
  `public/_headers` is copied through and gives fonts a one-year immutable cache.
- **Google Cloud** — nothing on GCP reads `_headers`, so treat that file as
  documentation of intent rather than as configuration. What you do instead
  depends on the shape:
  - *Storage bucket (+ Cloud CDN)* — upload `dist/`, then run
    `./deploy/gcs-cache-headers.sh gs://your-bucket` after **every** deploy;
    `setmeta` applies to objects that exist at the time it runs. That covers
    caching only. The three security headers cannot be set through object
    metadata and need a Load Balancer custom response-headers policy.
  - *Firebase Hosting* — put the same rules in `firebase.json` under
    `hosting.headers`; it handles caching and security headers together and is
    the shorter path of the two.
- **S3 / CloudFront, cPanel, Nginx** — upload `dist/`. Translate `_headers` by
  hand; the font rules are the ones worth carrying over.
- **Higgsfield** — the output is framework-free HTML, so it ports without a
  rewrite when you move it there.

Set `site.origin` in `src/site.config.js` to the real domain **before** you
deploy. Canonicals, Open Graph URLs, and `sitemap.xml` are all built from it, and
they will point at the wrong host until you do.

### Regenerating the social image

`public/assets/og-default.png` is rendered from `tools/og.html`:

```bash
cp tools/og.html dist/__og.html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --window-size=1200,630 --screenshot=public/assets/og-default.png \
  --virtual-time-budget=3000 "http://127.0.0.1:8099/__og.html"
rm dist/__og.html && node build.mjs
```

---

## Honest notes

A few things worth knowing rather than discovering later:

- **The contact form does not work.** A static site cannot send email. It renders
  as a clearly-labelled placeholder until you wire `contact.form.action` in
  `src/data/content.js` to a form service. See `LAUNCH.md`.
- **FAQPage rich results are mostly gone.** Google restricted FAQ rich snippets
  to government and health sites in 2023. The markup is still correct, still
  helps machines understand the page, and costs nothing — but do not expect the
  expandable SERP result. `HowTo` rich results were retired too. `LocalBusiness`,
  `BreadcrumbList`, and `Service` are the ones still doing work.
- **The imagery is AI-generated.** Fine for what it is doing — none of it
  claims to be a job this company did — but it is the first thing to replace
  with real photography, and doing so also feeds your Google Business Profile.
- **`raw-assets/` is about 25 MB of PNG and MP4 masters.** They are committed on
  purpose: without them you cannot re-encode. If that is a problem for your git
  host, move them to object storage and keep `public/assets/` in the repo.
- **Fonts are down to 54 KB on the critical path.** Source Serif 4 was 122 KB
  because Google serves the full variable face with its optical-size axis
  attached — and this site renders the serif at exactly one weight, so all of
  that was being paid for and none of it used. It now ships as a static instance
  with `opsz` pinned at 16 (body runs 17–19px, the lede 18–22px, so one optical
  size covers the range) at 20 KB. A 600 weight is declared but never referenced,
  so it is never downloaded; it exists so that adding bold body copy later
  degrades visibly rather than silently, since `font-synthesis-weight: none`
  would otherwise render a missing weight identically to regular.
- **`site.reviews.show` is `false` on purpose.** Do not turn it on until you have
  real, verifiable review counts. Marking up review data you cannot substantiate
  is a manual-action risk and it will cost you every rich result on the domain.
- **The technical copy is accurate but generic to the industry.** It describes how
  mold behaves in South Florida buildings, not what your company has done. See
  `CONTENT-REVIEW.md` before publishing.
