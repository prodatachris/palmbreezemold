# Launch checklist

Ordered so that nothing later depends on something earlier being skipped.
Everything in **Part 1** is a blocker — the site should not be publicly indexed
until those are done.

---

## Part 1 — Blockers

Thirty-six tick boxes sit in Part 2 and there were none here, which had it
backwards: the optional SEO setup was the tidy checklist and the things that
actually stop you publishing were paragraphs to extract actions from. Here they
are as a list. Each links to the section that explains it.

- [ ] Real licence number in `site.license` — [why this one is different](#2-florida-licensing)
- [ ] Real address, or set `hideAddress` — [placeholders](#1-replace-every-placeholder)
- [ ] Real domain in `site.origin`, before anything is crawled
- [ ] Real contact email
- [ ] Delete any certification in `site.certifications` you do not hold
- [ ] Confirm or remove the insurance line and the founding year
- [ ] Confirm or remove the **re-remediation guarantee**. `/process/` says "If it does not
      pass, we go back in at our cost"; `/services/mold-remediation/` says only "If it does
      not pass, we go back in". It is the largest open-ended financial commitment on the
      site — decide whether you are making it, then make both pages say the same thing.
      Confirm with `clearanceRework` in `site.verified`
- [ ] Decide whether **"We will write one whether or not you use us"** on
      `/guides/comparing-mold-remediation-quotes/` is compatible with charging for the
      visit. It reads as a scope for people who do not hire you
- [ ] Confirm or remove the **same-day written scope** on `/process/`. It is the last
      same-day promise on the site and it survived the removal of same-day inspection
      because it is a different claim — the scope going out the day of the visit may
      well be true. Confirm with `sameDayScope` in `site.verified`, or change the
      step's `duration` in `src/data/content.js`
- [x] Free walkthrough / free written scope — **removed 2026-08-16, owner confirmed
      nothing is offered free.** The claim is gone from all six pages and preflight
      reports it absent. The `freeWalkthrough` key stays in `claimKeys` as a guard,
      so if the wording ever returns it blocks launch until confirmed
- [ ] `node tools/preflight.mjs` passes — it fails until every claim above is
      confirmed in `site.verified`, and it is the check that catches the ones a
      grep for "PLACEHOLDER" misses
- [ ] Licensing attorney has answered the twelve-month question
      — [section 2](#2-florida-licensing)
- [ ] Licensing attorney has answered the scope-of-work question
      — [section 3](#3-work-the-site-says-you-do-beyond-mold-removal)
- [ ] Contact form points at a real backend, or the phone-only notice stays
      — [section 4](#4-wire-up-the-contact-form)
- [ ] Decision made on the generated imagery — [section 5](#5-decide-about-the-imagery)
- [ ] `CONTENT-REVIEW.md` read end to end — [section 6](#6-read-the-content)
- [ ] `npm run check` passes at the real domain

**The site cannot index itself before you finish this list.** Until every claim
key is in `site.verified`, each build stamps `noindex` on all 37 pages, writes
an empty `sitemap.xml`, and drops the `Sitemap:` line from `robots.txt`; the
build prints which claims are still outstanding. That makes it safe to deploy
early — to a staging host, to the real domain, anywhere — without the
placeholder license number and Example Boulevard address entering an index you
would then have to get them back out of. Confirm the claims and the same build
turns indexing on by itself.

Crawling is still allowed, deliberately: a crawler has to be able to fetch a
page to read the `noindex` on it, and `Disallow: /` alone can leave a URL
indexed from external links.

Everything below is the detail behind those lines.

### 1. Replace every placeholder

All of them live in **`src/site.config.js`**, each marked `⚠️ PLACEHOLDER`.
Nothing else in the codebase hardcodes a business detail.

| Field | Currently | Notes |
|---|---|---|
| `name` / `shortName` / `titleSuffix` | Palm Breeze Mold | Your registered business name, exactly as it appears on the license |
| `origin` | `https://www.palmbreezemold.com` | **Set this first.** Canonicals, OG tags, and sitemap.xml are built from it |
| ~~`phoneDisplay` / `phoneHref`~~ | **(561) 680-3584** | ✅ Done — real number, supplied by the owner |
| `email` | help@coastline… | |
| `address` | 1234 Example Boulevard | Real address + real lat/lng, then add `'address'` to `verified`. `geo` is withheld from the structured data until you do — the placeholder coordinates are a real point in downtown Fort Lauderdale, and unbacked precision reads as fact to a crawler |
| `license` / `licenseLabel` | `MRSR-PENDING` | See below — this one is not optional |
| `insurance`, `yearsInBusiness`, `foundingYear` | placeholder values | Reaches all 37 pages via structured data — see the claim check above |
| `certifications` | 3 invented IICRC/NADCA credentials | Delete any you do not hold; they appear on `/about/` |
| `openingHours` | Mon–Fri 7–7, Sat 8–4 | The single source. `hoursText` is derived from it, so the visible line and the schema can no longer disagree — they did, by three hours each way on Saturday, on all 37 pages |
| `emergencyText` | `null` | Confirmed by the owner 2026-08-16: there is no 24/7 line. Set a string here only if that changes — it appears in the hours on every page |
| `responseWindow` | By appointment | Confirmed by the owner 2026-08-16: no same-day testing. Put a real window here only if one is committed to |
| `sameAs` | empty | Add full profile URLs (the ones with a path). The build rejects bare roots like `facebook.com/` — as `sameAs` those claim the business *is* Facebook. Empty is correct until the profiles exist |

Then rebuild and run the claim check:

```bash
node build.mjs && node tools/preflight.mjs
```

It lists every claim this site makes about the business, shows how many built
files each one has reached, and exits non-zero until you confirm them in
`site.verified`.

Do not substitute a grep for placeholder strings. That was the original advice
here and it was unsafe: it only finds placeholders that announce themselves.
Three of the fabricated details do not. `General liability & pollution liability
insured` is an ordinary sentence sitting in the structured data of all 37 pages,
`12 years` reads as a fact, and the three technician certifications are real
credentials that this company has not been shown to hold. Fill in the licence
number and the address and that grep reports clean while those ship.

### 2. Florida licensing

Florida licenses **mold assessors** and **mold remediators** as two separate
credentials, and performing or advertising this work without one is a violation.
Put your real number in `site.license` — the site displays it in the footer, on
`/about/`, on `/contact/`, and in the LocalBusiness structured data.

The site also states, in several places, that you do **not** perform mold
assessment on properties you remediate, because Florida restricts one company
from doing both on the same structure. That is genuinely good positioning — but
there is a specific thing to check with your licensing attorney rather than a
general one.

The statute is [468.8419](https://www.flsenate.gov/Laws/Statutes/2025/468.8419).
Subsection (1)(d) bars an assessor from remediating a structure that the
assessor or their company assessed **within the previous twelve months**, and
there is an exception for Division I contractors. That is narrower than a
blanket ban. The FAQ states the twelve-month rule precisely and links the
statute, and the home page now scopes its version and links through to it.

Counting these took two attempts and the first was wrong. A grep for the phrase
"restricts one company from doing both" found seven mentions. Searching instead
for *any* statement about what Florida law does — however worded — found
seventeen, of which six still state a blanket prohibition in passing:
`/services/`, `/services/mold-inspection-testing/`, `/services/mold-remediation/`,
`/services/hvac-air-conditioner-mold-remediation/`,
`/guides/comparing-mold-remediation-quotes/` and
`/service-areas/lake-worth-beach/`. They read as lay summaries rather than legal
statements, which is why they were left rather than rewritten. Decide
with your attorney whether you are comfortable with the summary phrasing or want
all of them tightened, and check whether the Division I exception applies to you.
One sentence was removed outright rather than flagged. `/services/mold-inspection-testing/`
offered: "If you want us in the assessment role instead, that is fine too — it
just means a different company does the remediation." That offers a service this
company is not licensed for. `site.license` holds a **remediator** number
(MRSR) and there is no assessor (MRSA) credential anywhere in the config, so the
assessment role was never ours to offer. It now says so explicitly.

If you *do* hold an assessor licence as well, that sentence can come back — but
it needs the second licence number in `site.config.js` first, and preflight will
keep asking about it until you add one.

Pages that assert it:

- `/services/mold-inspection-testing/` — a full section on the separation
- `/services/mold-remediation/` — "What we do not do"
- `/faq/` — "Licensing and standards" group
- the homepage — "We do not grade our own work"

### 3. Work the site says you do, beyond mold removal

Separate from the assessor question, and genuinely a question rather than a
finding — it turns on which licences you hold and on whether you self-perform or
subcontract, neither of which is in this repo.

The site describes two kinds of work that a mold remediator licence may not by
itself cover:

- **Reconstruction.** "Reconstruction — drywall, texture, paint, flooring,
  plenum fabrication — is scoped and priced as its own line" on `/process/`,
  `/` and `/services/mold-remediation/`. It reads as work you perform and
  invoice, not work you refer out.
- **Plenum fabrication and ductwork.** `/services/hvac-air-conditioner-mold-remediation/`
  says colonised duct board plenums "come out and are rebuilt in sheet metal
  with an appropriate liner". In Florida, air conditioning work is its own
  contractor licence class.

Three things to settle with your licensing attorney, in order of how much they
change the copy:

1. Whether removing and replacing contaminated building material sits inside the
   remediation licence, or crosses into construction contracting at some scope.
2. Whether rebuilding a plenum requires an air conditioning contractor licence
   held by you rather than a subcontractor.
3. If either is subcontracted, whether the current wording implies otherwise.
   The process page already gets this right in one place — "or telling you which
   other trade you need" — and that is the phrasing to extend if the answer is
   that these go out to somebody else.

Nothing here was rewritten, because guessing at which side of that line you sit
would be inventing a fact about your business.

### 4. Wire up the contact form

A static site cannot email anything. The form currently renders with a visible
"not connected yet" notice and a disabled submit button, which is deliberate —
better an obvious placeholder than a control that silently drops leads.

In `src/data/content.js`:

```js
form: {
  hasBackend: true,
  action: 'https://formspree.io/f/YOUR_ID',   // or Basin, Web3Forms, Netlify
},
```

Free tiers that work with a plain static POST: **Formspree**, **Basin**,
**Web3Forms**, **Netlify Forms** (if you host there — add `netlify` and
`name="contact"` attributes to the `<form>` in `build.mjs`).

Then actually submit it once and confirm the email arrives. A lead form nobody
tested is the most expensive bug on a site like this.

### 5. Decide about the imagery

Every photograph on the site is AI-generated and illustrative. Nothing is
captioned as a specific job or result, and there are deliberately no
before/afters, so nothing on the site currently misrepresents your work.

You do not have to replace them to launch. But the moment you want a page to say
"this is our work," it needs real photography — and job photos are the single
highest-leverage asset you can produce for this business, because the same
shoot feeds your Google Business Profile, where they matter even more than they
do here. See `CONTENT-REVIEW.md`.

### 6. Read the content

See [`CONTENT-REVIEW.md`](CONTENT-REVIEW.md). Short version: the building-science
copy is accurate, but it describes an industry rather than your company, and a
few pages make commitments about how you operate.

---

## Part 2 — Local SEO setup

This is where the rankings actually come from. The site is the foundation, not
the whole building.

### Google Business Profile — do this first and do it properly

For a local service business, GBP outranks the website as a lead source. It is
free and most contractors fill it out badly.

- [ ] Claim / create the profile and complete **verification** (postcard or video)
- [ ] Primary category: **Water Damage Restoration Service** or
      **Air Duct Cleaning Service** — Google has no "mold remediation" primary
      category, so pick the closest and add the rest as secondary
- [ ] Secondary categories: Air Duct Cleaning Service, HVAC Contractor,
      Building Restoration Service
- [ ] Service areas: list Broward and Palm Beach counties and the individual
      cities. If you have no walk-in storefront, set it service-area-only and
      Google will hide the street address
- [ ] Services list: mirror your six service pages, with descriptions
- [ ] **Photos** — this is the highest-leverage item and the one most people
      skip. Real job photos: air handler cabinets before and after, containment
      set up in a house, negative air machines running, duct board replacement,
      the crew, the truck. Twenty real photos beat any amount of copy
- [ ] Add the license number to the business description
- [ ] Turn on messaging only if someone will actually answer it

### Google Search Console

- [ ] Verify the domain (DNS TXT is the durable method)
- [ ] Submit `https://yourdomain.com/sitemap.xml`
- [ ] Request indexing on the homepage and the HVAC specialty page
- [ ] Check **Page indexing** a week later for anything excluded
- [ ] Set the preferred domain by making sure www and non-www resolve to one
      canonical host with a 301 — `site.origin` must match whichever you pick

Also submit to **Bing Webmaster Tools**. It takes five minutes and Bing feeds
several downstream engines and assistants.

### Citations / NAP consistency

Name, Address, Phone must be byte-identical everywhere. Inconsistent NAP is the
most common reason local rankings stall.

- [ ] Apple Business Connect (Apple Maps — Siri and iPhone Maps use it)
- [ ] Bing Places
- [ ] Yelp
- [ ] Angi, Thumbtack, HomeAdvisor
- [ ] BBB
- [ ] Nextdoor Business — genuinely effective for this trade in South Florida
- [ ] Chambers of commerce: Greater Fort Lauderdale, Boca Raton, Delray, Jupiter
- [ ] Facebook Business Page

### Reviews

- [ ] Build a routine for asking at job completion, while the customer is relieved
- [ ] Send the GBP review short link by text the same day
- [ ] Respond to every review, including the bad ones, in the same plain voice
      as the site
- [ ] Only once you have real numbers: set `site.reviews.show = true` in
      `site.config.js` with the true rating and count. **Do not fabricate this** —
      unsubstantiated review markup risks a manual action against the whole domain

### Analytics

Set `site.ga4Id` to your GA4 measurement ID and rebuild. Leave it `null` and the
site ships with zero third-party scripts.

Track what matters, which for this business is exactly two things:

- `tel:` link clicks — every phone number on the site is a `tel:` link
- contact form submissions

Everything else is vanity. If you would rather not hand data to Google, Plausible
and Fathom are single-script alternatives that need one line in `ui.js`.

---

## Part 3 — Ongoing

The site as built covers the head terms. Ranking growth from here comes from
adding pages that answer real questions, not from tweaking the existing ones.

**Add city pages** as you take work in new areas. `src/data/areas.js` supports
it directly. The rule at the top of that file matters: if you cannot write three
genuinely specific paragraphs about a city's housing stock, do not make a page
for it — add it to the `alsoServing` list instead. Ten real pages outperform
forty templated ones, and Google has been discounting the templated pattern for
years.

Obvious next cities, roughly in order of search volume: Plantation, Sunrise,
Davie, Weston, Miramar, Deerfield Beach, Wellington, Palm Beach Gardens,
Lake Worth Beach, Coconut Creek.

**Seasonal content** is the biggest untapped opportunity in this market:

- Hurricane-season prep and post-storm water intrusion (June–November)
- "Closing your Florida home for the summer" — the single most useful thing you
  could publish for the Boca / Boynton / Delray seasonal audience, and it is
  exactly the advice the site already gives on those pages
- Post-storm roof leak → mold timeline

**Photos.** The site currently uses schematic illustration rather than
photography, which is a deliberate choice and it holds up. But real before/after
job photography on the service pages would add something illustration cannot,
and it feeds GBP at the same time. Shoot it properly: same angle, same lighting,
wide enough to show context.

---

## Pre-flight

```bash
node build.mjs
node tools/audit.mjs --width 390
node tools/audit.mjs --width 1440
grep -rl "PLACEHOLDER\|MRSR-PENDING\|Example Boulevard" dist/ || echo "no placeholders left"
```

- [ ] Audit clean at 390 / 768 / 1440
- [ ] No placeholders in `dist/`
- [ ] `site.origin` matches the live domain, www vs non-www decided and 301'd
- [ ] Contact form submitted once end to end, email received
- [ ] Every `tel:` link dials correctly from a real phone
- [ ] `sitemap.xml` and `robots.txt` load at the live domain
- [ ] Structured data passes <https://validator.schema.org/> and Google's
      Rich Results Test
- [ ] PageSpeed Insights run on the live URL, mobile
- [ ] Social preview checked by pasting a URL into a Slack or iMessage thread
- [ ] Hero video confirmed on a real phone and a real desktop — it should not
      load at all on the phone, and should fade in and loop seamlessly on desktop
- [ ] Pause control on the hero works and is reachable by keyboard
