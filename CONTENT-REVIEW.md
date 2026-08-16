# Content review

Read this before the site goes public. It takes about twenty minutes and it is
the difference between a site that reads as yours and one that reads as generic.

## What the copy is, and what it isn't

The technical content is accurate. Coil temperatures, the relationship between
run time and dehumidification, why fiberglass duct board cannot be cleaned once
colonized, the 24–48 hour window after a water loss, IICRC S520 and NADCA ACR as
the standards the trade works to, the split between Florida's assessor and
remediator licenses — all of that describes how mold actually behaves in South
Florida buildings, and it will hold up to a knowledgeable reader.

What it is **not** is a description of your company. It was written from industry
knowledge, not from your job history. So there are three categories of thing to
check.

---

## 1. Claims you need to be able to back up

These are stated as fact about how you work. If any are not true, change them —
they appear in multiple places and they are the most persuasive part of the site
precisely because they are specific.

**This list is generated from the site, not from memory.** A first-person
commitment appears in 46 prose blocks across 24 pages. Everything material is
below; re-run the extraction in this file's git history if you add pages.

### Availability and price

| Claim | Where |
|---|---|
| Same-day inspection across most of both counties | Homepage, every service, city and guide hero; `site.responseWindow` |
| Emergency line 24/7 | Footer and `/contact/` on every page, via `site.hoursText` |
| A visual assessment and written scope from us costs nothing | Homepage FAQ, `/faq/`, quotes guide |
| We will not quote a number over the phone without readings | `/guides/comparing-mold-remediation-quotes/` |
| Written scopes detailed enough for a competitor to bid from | `/process/`, `/about/`, quotes guide |

### How the work is done

| Claim | Where |
|---|---|
| Independent third-party clearance testing on every job | Everywhere. This is the site's central promise |
| "If it does not pass, we go back in at our cost" | `/process/` step 9 |
| You do not assess properties you remediate | Inspection page, remediation page, `/faq/`, homepage, quotes guide |
| Daily documented moisture logs on drying jobs | Water damage page, `/process/` |
| Blower wheels are pulled and cleaned off the equipment | HVAC page |
| Duct cleaning is source removal to NADCA ACR, whole-system | Duct cleaning page |
| Before-and-after camera footage of the runs is provided | Duct cleaning page |
| Three to five hours for a typical single-family duct clean | Duct cleaning page |
| Certificates of insurance provided to HOAs before scheduling | Boca, Coral Springs, Pompano, Boynton, Deerfield, Weston |

### Things you say you will NOT do

These are the most differentiating statements on the site and the easiest to be
caught out on. Each one is a standing commitment.

| Claim | Where |
|---|---|
| You do not use ozone generators | Duct cleaning page ("The upsells you will be offered") |
| You turn down duct cleaning on systems that do not need it | Duct cleaning page, `/about/` |
| You do not sell HVAC equipment | Boynton FAQ, duct cleaning FAQ |
| You will tell a caller their exterior growth is algae and not schedule anything | `/guides/mold-on-the-outside-of-your-house/` — stated twice, including "we would rather tell you that than sell you an inspection" |
| You will say plainly when a duct clean will not help their allergies | Duct cleaning FAQ |
| You will refer out rather than stretch outside Broward/Palm Beach | Miramar FAQ |
| You will not take a referral fee for sending assessment work out | `/services/mold-inspection-testing/` |
| You will not tell anyone mold is making them sick | Black mold page, `/faq/` |

### Guides (added after this checklist was first written)

The four guides carry commitments in their own right, and they read as advice
rather than marketing — which makes them more persuasive and therefore more
important to be able to stand behind.

| Claim | Where |
|---|---|
| A homeowner can hand your scope to a competitor and get a comparable bid | Quotes guide — this is offered as the test of whether a scope is real |
| A free visual walkthrough from a remediation company is normal; a free "inspection" presented as an assessment is not | Quotes guide |
| You want to hear about exterior growth only when paired with an interior symptom | Exterior guide |
| Guidance to leave the AC off and call before running a system after a summer closure | Summer guide, first-48-hours guide |

### Numbers

Every figure on the site was checked against whether it describes the trade or
describes this company. Trade figures stay: the 24–48 hour window before growth
starts, 40–45°F coil surface temperature, 45–55% target indoor humidity, ≥ 4 air
changes per hour inside containment, 2–5 day lab turnaround, 60% RH as the line
above which mold does not need a leak, 100,000+ described species. Those are
physics, standards, or published fact, and a knowledgeable reader can check them.

Two figures described *your* results and were removed, because there is no job
history behind them and a customer or a competitor could fairly ask where the
number came from:

- A `~2%` stat on `/services/black-mold-removal/` claiming the share of dark
  growth this company finds to be Stachybotrys. Now states that species cannot
  be identified by eye at all, which is true and more useful.
- "About half the time that conversation ends without any demolition" on
  `/about/`, now unquantified.

Two more were caught a pass later, written as words rather than digits, which is
worth knowing if you add copy: a scan for `%` will not find them.

- "Two thirds of the mold we find in Palm Beach Gardens is on an exterior wall
  that has not seen direct sun in twenty years" — the opening line of that city
  page. Now states the pattern without quantifying it.
- "the majority of what we are called to in this city is somebody else's common
  element" on `/service-areas/deerfield-beach/`, now "a great deal of".

If you *do* have the job history to support a rate, putting a real one back is a
genuine differentiator — a remediation company that publishes how often it talks
people out of work is making a claim competitors will not copy. Put back a number
you can evidence, not one that sounds right.

### Standards claims, checked against the publishers

Each of these was verified by reading the source rather than by recall, and the
wording on the site now matches what the publisher actually says:

- **ANSI/IICRC S520** — IICRC publishes it as "ANSI/IICRC S520 Standard for
  Professional Mold Remediation" and describes its standards as ANSI-accredited.
  The site uses the formal designation.
- **NADCA ACR** — NADCA's own material states that source removal "begins with
  the use of one or more agitation devices" and that "the entire HVAC system is
  placed under continuous negative pressure (a vacuum)". Both are on the site as
  written.
- **Exterior venting** — this one was corrected, in three places rather than the
  two found first time. The site described the system as "vented outside" *as
  part of the standard's requirement*. NADCA's published material does not say
  that. Venting the collection unit outside is now presented as our practice and
  a step beyond what the standard asks, which is both accurate and better
  positioning.

  Worth knowing how the third was missed: the original sweep searched for the
  phrase "vented outside" and its near variants. The HVAC page said the same
  thing as "so the debris leaves the building instead of relocating inside it" —
  same claim, no shared words. Search for the claim, not the wording.
- **The ten-square-foot line** — EPA, not "the industry". Linked on the FAQ.
- **Humidity targets** — EPA is "below 60 percent -- ideally between 30 percent
  and 50 percent". The site recommends 55% for a closed-up house, which is above
  EPA's ideal band. That is a defensible number for this climate but it was
  previously stated without reference to the guidance, so a reader who checked
  would have found us recommending the top end. The summer guide now gives EPA's
  range, links it, and says why 55 rather than 45 — the failure we get called to
  is the house left at 80°F with no dehumidification, not the house held at 55.
- **The 24–48 hour window** — EPA's flood-cleanup guidance. Linked in the guide.
- **Money** — every dollar figure on the site was checked. The $10,000 mold
  sublimit is hedged as "a common figure" and is widely cited for Florida
  policies; the $400-vs-$6,000 spread is an illustration, not a quote; the $79
  and $99 duct-cleaning coupons describe advertised market pricing. One was
  removed: a "~$40/mo" stat for the cost of running a dehumidification strategy,
  which was a specific number a reader could check against their own power bill
  and which nothing supported. It now states the comparison it was actually
  making — tens of dollars a month against thousands for remediation — and says
  outright that we are not going to invent a figure for your bill.
- **Chapter 468** — see the licensing section of LAUNCH.md; the twelve-month rule
  is narrower than a blanket ban.

The general point for anyone editing: a claim about what a standard requires is
checkable by a competitor, and the ones worth making are the ones you can point
at. Where our practice exceeds a standard, say that — it is stronger than
implying the standard demanded it.

## 2. Competitor-adjacent statements

Several pages are pointedly critical of common industry practice — fogging sold
as remediation, $79 duct cleaning coupons, companies that test their own work,
encapsulating porous material. This is deliberate: it is the most differentiating
content on the site and it is what earns trust from a homeowner who has already
been quoted by two other companies.

It is also written carefully. Nothing names a competitor, nothing alleges
illegality, and each criticism is tied to a technical reason rather than an
accusation. Keep it that way if you edit it. If you are uncomfortable with any of
it, the sections to look at are:

- "Fogging is not remediation" — `/services/hvac-air-conditioner-mold-remediation/`
- "Why are the $99 duct cleaning coupons so cheap?" — duct cleaning FAQ
- "The two stages that get skipped" — `/process/`
- "What we do not do" — `/services/mold-remediation/`
- "The upsells you will be offered" — duct cleaning page. Gives a different
  verdict on each item (UV lamp *sometimes*, high-MERV filters *depends*,
  fogging *usually not*, ozone *no*, dryer vent *yes but for fire safety*).
  The nuance is what makes it credible; flattening it into "all upsells are a
  scam" would be both less true and less persuasive
- "Three quotes that should worry you" — `/guides/comparing-mold-remediation-quotes/`
- "What we would tell you on the phone" — `/guides/mold-on-the-outside-of-your-house/`

## 3. Health claims — deliberately restrained

The site consistently declines to say mold is making anyone sick, and says so
explicitly on `/services/black-mold-removal/` and in the `/faq/` health section.
It states what is well established — allergic response, asthma exacerbation, risk
to immunocompromised people — and stops there.

**Do not loosen this.** Health claims are where mold remediation marketing gets
into genuine legal trouble, and the restraint reads as competence rather than
hedging. If anything, have someone review it to confirm it is restrained enough
for your insurer.

---

## The photography

Every image and every hero clip on this site was generated with an AI model. You
should decide deliberately how long that stays true.

**What is safe about the set as built.** Nothing is presented as a job you did.
There are no before/afters — that is on purpose, because a fabricated
before/after is a fabricated result claim, and it is the one thing in this
category that would genuinely mislead a homeowner. No image carries an address,
a date, a customer, or a named crew member. The captions describe what the
picture shows ("the interior face of a fiberglass duct board plenum") rather
than asserting it happened on one of your jobs. Used this way the images do the
same work a stock photo does: they show an anxious person what the thing you are
talking about actually looks like.

**Where the line is.** The moment a page implies "this is our work, this is our
crew, this is a result we produced," it needs real photography. Do not caption a
generated image with a city, a job, or an outcome.

**Why replacing them is worth doing anyway.** Real job photos are the highest
return asset this business can produce, and not mainly for the website — your
Google Business Profile weights photos heavily, and twenty real ones there will
move the needle more than any copy change on this site. One shoot feeds both.

Worth capturing, roughly in order of usefulness:

- An air handler cabinet open, coil visible, before and after cleaning
- Containment built in a real house — poly, zip door, negative air machine
- A duct board plenum coming out, and the sheet metal replacement going in
- Moisture mapping in progress, with the meter readable
- Drying equipment set, with the drywall cut line visible
- The crew and the truck, in clean uniforms, faces visible

Shoot wide enough to show context, keep the lighting consistent, and photograph
the same angle before and after so the pairs actually line up. If you replace
the files in `raw-assets/` with the same filenames and run `npm run assets`, the
whole site picks them up with no other change — but update the descriptions in
the `media` registry in `src/data/content.js`, because alt text that describes
the old picture is worse than none.

---

## Local detail to verify

The city pages describe housing stock, neighborhoods, and failure modes specific
to each area. This is what makes them rank and what makes them convert. It is
also written from general knowledge of South Florida construction, so a local
technician should read it for anything that is off.

Worth a second look:

- **Neighborhood lists** — spelling, and whether any are outside city limits
- **ZIP codes** — verify against USPS; some cross municipal boundaries
- **Housing-stock generalizations** — "most Kings Point units have original duct
  board," "Coral Springs air handlers are commonly in the garage," "Hollywood
  Lakes has genuine wood framing." These are true as tendencies, but you know
  the actual numbers from having been in these houses
- **Jupiter Farms** — described as well water, septic, larger lots, some modular
  construction
- **Pembroke Pines** — the vinyl-plank-over-tile observation, which is presented
  as something you see routinely

If a claim about a neighborhood is wrong, it is worse than saying nothing —
that is exactly the detail a local homeowner will notice.

---

## How to re-check this after you edit

Two things run automatically and will catch most drift:

- `node build.mjs` fails the build if the inline-link syntax leaks into a field
  that is consumed raw — a meta description, a title, a heading, or structured
  data. That guard exists because it did leak once.
- `node tools/audit.mjs --width 390` and `--width 1440` check every page for
  structure, meta lengths, contrast, keyboard reachability and link integrity.

Neither can tell you whether a sentence is *true*. That is what this document is
for, and it is the one check that cannot be automated.

## Tone

Plain, specific, occasionally willing to say "we do not know." No exclamation
marks, no "trusted partner," no "your satisfaction is our guarantee." Numbers and
mechanism instead of adjectives.

If you add pages later, match it. The voice is the product here — it is what
signals to an anxious homeowner that they are talking to someone who has actually
opened a hundred air handler cabinets, rather than someone who bought a lead-gen
template.
