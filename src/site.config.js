/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the only file you need to edit to make this site real.
 *
 *  Every value marked  ⚠️ PLACEHOLDER  is fake. Replace it before launch.
 *  Nothing else in the codebase hardcodes business details; change it here and
 *  re-run `node build.mjs` and it updates across all 24 pages, the sitemap,
 *  the structured data, and the schema markup.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  // ── Identity ───────────────────────────────────────────────────────────────
  /** Real brand, supplied by the owner. Contact details below are still placeholders. */
  name: 'Palm Breeze Mold',
  /** Short form used in tight UI (header, footer, breadcrumbs). */
  shortName: 'Palm Breeze',
  /** Used in <title> tags after the page name. Keep it under ~28 chars. */
  titleSuffix: 'Palm Breeze Mold',
  tagline: 'Clean Air Specialists & Remediation',

  /** ⚠️ PLACEHOLDER — the live domain, no trailing slash. Canonicals, OG tags,
   *  and sitemap.xml are all built from this. */
  origin: 'https://palmbreezemold.com',

  // ── Contact ────────────────────────────────────────────────────────────────
  /** REAL — supplied by the owner. 561 is Palm Beach County.
   *  Both fields must be changed together: phoneHref is the tel: target and
   *  the telephone value in the LocalBusiness schema. */
  phoneDisplay: '(561) 680-3584',
  phoneHref: '+15616803584',
  /* Removed 2026-08-19: no mailbox on the domain yet. The phone is the only
   * contact route the site publishes until one exists, which is honest and
   * also avoids printing an address that would bounce. */
  email: null,

  /** ⚠️ PLACEHOLDER — a real street address is required for Google Business
   *  Profile and for the LocalBusiness schema to do anything for you. If you
   *  run service-area-only with no storefront, set `hideAddress: true` and
   *  Google will suppress the address on your profile — but you still need a
   *  verifiable one on file. */
  address: {
    /* No premises. This is a service-area business and the owner has no address
     * to publish yet (2026-08-19), so the street line is null and hideAddress
     * is true. A null street is also what drops the 'address' claim entirely,
     * rather than leaving Example Boulevard on 37 pages. */
    street: null,
    city: 'Fort Lauderdale',
    region: 'FL',
    regionName: 'Florida',
    postalCode: '33301',
    country: 'US',
    /** ⚠️ PLACEHOLDER — approximate Fort Lauderdale coordinates. These are
     *  deliberately NOT emitted in the structured data: schema.js includes geo
     *  only once 'address' is listed in `verified` above. Replace both numbers
     *  with the real location before adding that key — unlike the street line,
     *  a wrong coordinate pair does not look wrong to the crawler reading it. */
    lat: 26.1224,
    lng: -80.1373,
  },
  hideAddress: true,
  /** Real: Broward and Palm Beach County are both America/New_York. Used to
   *  date the sitemap — see the note on lastmodFor in build.mjs. */
  timezone: 'America/New_York',
  /**
   * When the body of the site's content was last substantively revised.
   *
   * Declared, not derived. The sitemap used to take lastmod from the mtime of
   * the data file behind each page, which meant four files backed thirty-six
   * URLs and any edit to one of them — a punctuation fix, a link — restamped
   * every page it fed as modified that day. That is the exact pattern the
   * README warns about: a sitemap whose dates always move is one a crawler
   * learns to disregard.
   *
   * Move this when the content genuinely changes. Guides carry their own
   * `updated` field and take precedence over it.
   */
  contentUpdated: '2026-08-15',

  /**
   * Claims confirmed as true by the owner. `node tools/preflight.mjs` lists
   * every claim this file makes about the business, shows where it has reached
   * the built site, and fails until each one appears here. Add a key only once
   * you can produce the document behind it — a license certificate, a
   * certificate of insurance, the certification card.
   *
   * The key list lives in `claimKeys` below rather than in this comment, so
   * preflight and the indexing gate read the same one.
   */
  /*
   * phone            supplied by the owner
   * yearsInBusiness  founded 2026, confirmed by the owner 2026-08-19. The
   *                  about page prints the year alone now: a company in its
   *                  first year saying "0 years" was worse than saying nothing.
   * origin           palmbreezemold.com, the owner's own domain, which is the
   *                  one this build is being hosted on.
   *
   * Everything else on claimKeys is null or empty, so the site makes no claim
   * to confirm. Put a key here only when the document behind it exists.
   */
  verified: ['phone', 'yearsInBusiness', 'origin'],

  /**
   * Every claim the site makes that a customer could check. preflight builds
   * its table from this, and `launchReady` measures `verified` against it.
   */
  claimKeys: [
    'license', 'certifications', 'insurance', 'yearsInBusiness',
    'address', 'email', 'origin', 'phone', 'emergency', 'freeWalkthrough', 'sameDayScope', 'clearanceRework',
  ],

  /**
   * False until every claim above is confirmed, and while it is false every
   * page carries `noindex` and the sitemap goes out empty.
   *
   * The reason this exists: robots.txt said `Allow: /` with a live sitemap, so
   * the moment the site reached a real domain it would be crawled and indexed
   * with a pending license number, an Example Boulevard address and a 24/7
   * line nobody had confirmed — and getting eight false claims *out* of an
   * index is far harder than keeping them out. noindex rather than
   * `Disallow: /` on purpose: a disallowed URL can still be indexed from
   * external links, and a crawler has to be allowed to fetch the page before
   * it can read the tag telling it not to index.
   */
  get launchReady() {
    const done = new Set(this.verified || []);
    // A claim the site does not make needs no confirming. emergencyText: null
    // means there is no after-hours promise on any page, so requiring someone
    // to tick it off would block launch on a claim that no longer exists.
    // preflight applies the same rule from the other direction — it only counts
    // a claim as unconfirmed if it actually reached the built HTML.
    const claimed = {
      license: this.license,
      certifications: this.certifications?.length,
      insurance: this.insurance,
      yearsInBusiness: this.foundingYear,
      address: this.address?.street,
      email: this.email,
      origin: this.origin,
      phone: this.phoneDisplay,
      emergency: this.emergencyText,
      freeWalkthrough: this.copyClaims.freeWalkthrough.live,
      sameDayScope: this.copyClaims.sameDayScope.live,
      clearanceRework: this.copyClaims.clearanceRework.live,
    };
    // Without this, adding a key to claimKeys and forgetting it here would
    // make `!claimed[k]` true and silently auto-pass the claim.
    const missing = this.claimKeys.filter((k) => !(k in claimed));
    if (missing.length) throw new Error(`site.config: claimKeys not mapped in launchReady: ${missing.join(', ')}`);
    return this.claimKeys.every((k) => done.has(k) || !claimed[k]);
  },

  /**
   * Claims the site makes in page copy rather than in this file, so there is no
   * field whose value is the claim. `live` says whether the copy is currently
   * on the site; build.mjs cross-checks each one against the built HTML and
   * fails if a declaration and the copy disagree.
   *
   * This exists because hardcoding `freeWalkthrough: true` and then deleting the
   * copy behind it left `launchReady` permanently false — every page would have
   * stayed noindex forever, waiting for someone to confirm an offer that no
   * longer existed. A declaration nothing verifies is a declaration that rots.
   */
  copyClaims: {
    freeWalkthrough: {
      live: false, // removed 2026-08-16, owner confirmed nothing is offered free
      // A bare '$0' is not enough on its own: /guides/mold-on-the-outside-of-your-house/
      // legitimately uses it for what a homeowner spends fixing exterior algae with a
      // pruning saw. Only a price figure sitting near our own offer is the claim.
      // 'whether or not you use us' promised a full written scope to people who
      // do not hire — unpaid work by another name. Removed 2026-08-16.
      needles: ['cost you nothing', 'costs you nothing', 'a written scope for free',
        'whether or not you use us',
        { text: '>$0<', within: ['walkthrough', 'written scope'], window: 260 },
        // 'cost nothing from us' slipped past the three literal needles above
        // and sat on the first-48-hours guide. Context-matched rather than
        // literal, because a homeowner action that costs them nothing (closing
        // blinds, turning the AC off) is a legitimate and different sentence.
        { text: 'cost nothing', within: ['assessment', 'walkthrough', 'written scope', 'inspection'], window: 220 },
        { text: 'costs nothing', within: ['assessment', 'walkthrough', 'written scope', 'inspection'], window: 220 }],
    },
    sameDayScope: {
      live: false, // removed 2026-08-19, owner confirmed they do not work same day
      needles: ['Same day'],
    },
    /**
     * A workmanship guarantee: if third-party clearance fails, the crew
     * returns at the company's expense. Plausibly standard practice, which is
     * exactly why it was never questioned — it is also the largest open-ended
     * financial commitment on the site, and the two pages that make it do not
     * agree: /process/ says "at our cost", /services/mold-remediation/ just
     * says "we go back in".
     */
    clearanceRework: {
      live: false, // removed 2026-08-19, owner makes no workmanship guarantee yet
      needles: ['we go back in'],
    },
  },

  // ── Credentials ────────────────────────────────────────────────────────────
  /** ⚠️ PLACEHOLDER — Florida licenses mold remediators at the state level.
   *  A Mold Remediator license is MRSR#####; a Mold Assessor is MRSA#####.
   *  Put your real number here — it is a ranking and conversion factor, and
   *  advertising remediation in Florida without one is a violation. */
  /* Removed 2026-08-19 on the owner's instruction: no Florida license number
   * to publish yet. null means the site makes no licensing claim at all, which
   * is what launchReady then stops asking about. Put the real MRSR number here
   * the day it exists -- it is a ranking and conversion factor, and the copy on
   * /faq/ that explains Florida's assessor/remediator split still stands. */
  license: null,
  licenseLabel: 'FL Mold Remediator Lic.',
  /* Emptied 2026-08-19 on the owner's instruction: none held yet. Add each
   * one only when the certification card exists. */
  certifications: [],
  /* Removed 2026-08-19 on the owner's instruction: not yet carried, so the
   * site does not say it is. */
  insurance: null,
  /* Real, confirmed by the owner 2026-08-19. yearsInBusiness is derived from
   * this, so a new company reads as new rather than claiming twelve years. */
  foundingYear: 2026,
  /**
   * Derived, never stored. This used to sit beside foundingYear as a literal
   * 12, which is correct for exactly one calendar year and then quietly wrong —
   * the site would still have claimed twelve years in 2030. Anything computable
   * from another field should be computed, or the two drift apart with nobody
   * noticing.
   */
  get yearsInBusiness() {
    const here = new Intl.DateTimeFormat('en-CA', { timeZone: this.timezone, year: 'numeric' });
    return Number(here.format(new Date())) - this.foundingYear;
  },

  // ── Hours & response ───────────────────────────────────────────────────────
  /**
   * ⚠️ PLACEHOLDER — an after-hours commitment is the most checkable promise on
   * the site, and it is tested at the worst possible moment: a burst pipe at
   * 2am. Set to null if there is no genuine 24/7 line, and it disappears from
   * every page. Whatever is here has to be confirmed before launch — preflight
   * lists it alongside the license and the insurance line.
   */
  emergencyText: null,
  /**
   * Derived from openingHours, for the same reason yearsInBusiness is derived.
   * This was stored separately and read 'Mon–Sat 7:00am – 7:00pm' while the
   * machine-readable version below said Saturday 08:00–16:00 — so the page told
   * a customer 7am and the knowledge panel told them 8am, on all 37 pages. Two
   * copies of one fact is one copy too many.
   */
  get hoursText() {
    const ABBR = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
                   Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
    const clock = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
    };
    const spans = this.openingHours.map((h) => {
      const days = h.days.length > 1
        ? `${ABBR[h.days[0]]}–${ABBR[h.days[h.days.length - 1]]}`
        : ABBR[h.days[0]];
      return `${days} ${clock(h.opens)} – ${clock(h.closes)}`;
    });
    if (this.emergencyText) spans.push(this.emergencyText);
    return spans.join(' · ');
  },
  /** The single source for opening hours — both the schema and hoursText read this. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '19:00' },
    { days: ['Saturday'], opens: '08:00', closes: '16:00' },
  ],
  /** Deliberately not a timing promise. This said 'Same-day inspection in most
   *  of Broward and Palm Beach' and the company does not offer same-day
   *  testing, so it was a promise the phone could not keep. If a real window
   *  is ever committed to, put it here — it reaches the header of every page,
   *  the CTA band, and the contact page. */
  responseWindow: 'By appointment — call and we will tell you the soonest we can be there',

  // ── Proof (⚠️ ALL PLACEHOLDER — replace or delete; never invent reviews) ────
  /** Set `reviews.show: false` until you have real, verifiable review counts.
   *  Marking up fake review data is a manual-action risk with Google and it
   *  will get your rich results pulled. */
  reviews: {
    show: false,
    ratingValue: '4.9',
    reviewCount: '187',
    source: 'Google',
  },

  // ── Social / profiles (⚠️ EMPTY ON PURPOSE — see the note below) ───────────
  /** Empty until real profile URLs exist, and it ships empty rather than
   *  plausible. This held 'https://www.google.com/maps', 'https://www.facebook.com/'
   *  and 'https://www.yelp.com/' — bare platform roots, which as sameAs assert
   *  that this business *is* those pages. Unlike the address and the domain,
   *  that placeholder is not obviously fake to the only audience that reads it:
   *  a crawler consumes it literally, and schema.js omits the property entirely
   *  when this is empty, which is the correct state for a business with no
   *  profiles yet. Add full profile URLs — the ones with a path, e.g.
   *  https://www.google.com/maps/place/... — and the build guard will accept
   *  them. It rejects bare roots so this cannot regress. */
  sameAs: [],

  // ── Analytics ──────────────────────────────────────────────────────────────
  /** Leave null to ship no third-party scripts at all. Set to a GA4 ID like
   *  'G-XXXXXXXXXX' to inject the tag. Anything you add here costs you
   *  Core Web Vitals, so add it deliberately. */
  ga4Id: null,

  // ── Content knobs ──────────────────────────────────────────────────────────
  /** Shown in the footer and on /about/. */
  serviceRadiusNote:
    'We cover all of Broward County and Palm Beach County, from Hallandale Beach to Jupiter.',
};

/** Convenience: full postal address on one line. */
export const addressLine = [
  site.address.street,
  site.address.street
    ? `${site.address.city}, ${site.address.region} ${site.address.postalCode}`
    : `${site.address.city}, ${site.address.region}`,
]
  .filter(Boolean)
  .join(', ');

export default site;
