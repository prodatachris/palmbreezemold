/**
 * SHARED CONTENT
 *
 * Copy that is not tied to one service or one city: the homepage narrative,
 * the /process/ page, the /faq/ page, and the /about/ page.
 *
 * Apostrophes: use the typographic one, ’ (U+2019), never the ASCII '. These
 * strings are single-quoted, so an ASCII apostrophe terminates the string and
 * breaks the build — which is how it announces itself, twice so far. The curly
 * one is also what the prose should be setting anyway.
 */

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA REGISTRY
//
// One entry per image in public/assets/img/. Alt text lives here so a given
// photograph is described identically everywhere it appears, and so there is
// one place to fix a description rather than nine.
//
// ⚠️ These are AI-generated illustrative photographs, not documentation of work
// this company has done. That is fine for what they are doing here — showing a
// homeowner what a coil, a containment, or a stained register looks like — and
// none of them is captioned as a specific job, address, or result. The moment
// you want to say "our work," replace them with real job photography. There are
// no before/afters in this set on purpose: a fabricated before/after is a
// fabricated result claim. See CONTENT-REVIEW.md.
// ─────────────────────────────────────────────────────────────────────────────
export const media = {
  'air-handler-closet': {
    alt: 'An air handler in a hallway closet with its access panel removed, showing a dust-matted evaporator coil above a rusted drain pan and a PVC condensate line.',
  },
  'evaporator-coil': {
    alt: 'Close view of an air conditioner evaporator coil, with gray dust and biofilm packed between the aluminum fins and condensation beading on the metal.',
  },
  containment: {
    alt: 'A bedroom set up for mold remediation: polyethylene sheeting sealed across a doorway, a negative air machine ducted out through a window, and drywall removed at the base of one wall.',
  },
  'moisture-meter': {
    alt: 'A hand holding a pinless moisture meter flat against drywall just above the baseboard, with a thermal imaging camera in its case behind.',
  },
  'duct-board-plenum': {
    alt: 'The interior of an opened fiberglass duct board plenum, its exposed fiber mat gray with dust and patchy dark discoloration.',
  },
  'register-stain': {
    alt: 'A ceiling air conditioning supply register on a popcorn ceiling, ringed by dark staining bleeding into the drywall around it.',
  },
  'structural-drying': {
    alt: 'Structural drying underway in a living room: a dehumidifier and air movers running, baseboard removed and drywall cut in a straight line two feet up.',
  },
  'broward-street': {
    alt: 'A street of single-story concrete block and stucco ranch homes with barrel tile roofs and mature palms, typical of east Broward County.',
  },
  'coastal-condo': {
    alt: 'A 1970s mid-rise coastal condominium building with stacked balconies and a row of through-wall air conditioning units.',
  },
  'tract-homes': {
    alt: 'A 1990s two-story tract-home street in west Broward, with barrel tile roofs, attached garages and exterior condenser units on side-yard slabs.',
  },
  'lake-lot-homes': {
    alt: 'Single-story homes backing onto a man-made retention lake in far west Broward, with screened pool enclosures and a low seawall at the water line.',
  },
  'country-club': {
    alt: 'A large two-story stucco home with a clay barrel tile roof and heavily manicured landscaping in a Boca Raton country-club community.',
  },
  'villa-community': {
    alt: 'A row of joined single-story villas with individual carports and low-slope roofs in an older Delray Beach community.',
  },
  'flat-roof-villa': {
    alt: 'A 1970s single-story Florida villa with a flat low-slope roof, jalousie windows, a screened Florida room and a condenser unit on a side slab.',
  },
  neotraditional: {
    alt: 'A late-1990s neo-traditional Jupiter street of closely spaced two-story homes with front porches, metal roofs and narrow paver streets.',
  },
  'historic-street': {
    alt: 'A historic West Palm Beach street of 1920s stucco houses with barrel tile roofs, under live oaks draped with Spanish moss.',
  },
  'historic-bungalow': {
    alt: 'A 1920s Mediterranean Revival bungalow with textured stucco walls, a clay barrel tile roof and arched window openings.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// The signature diagram's annotations. These drive both the SVG hotspot markers
// and the legend beside it, so the numbering can never drift out of sync.
// ─────────────────────────────────────────────────────────────────────────────
export const airPathPoints = [
  {
    n: 1,
    key: 'return',
    title: 'Return plenum',
    text: 'If the closet, platform, or chase used as a return is unsealed, the system pulls hot, humid, unconditioned air out of a garage or attic on every cycle.',
  },
  {
    n: 2,
    key: 'coil',
    title: 'Evaporator coil',
    text: 'Held below the dew point by design, so it is wet whenever the system runs. Organic dust that gets past the filter packs into the fins and stays soaked.',
  },
  {
    n: 3,
    key: 'pan',
    title: 'Drain pan & condensate trap',
    text: 'A clogged line or a dry trap backs water into the pan. Standing water in a dark cabinet at 75°F is the easiest growth in the building — and the failure that floods ceilings.',
  },
  {
    n: 4,
    key: 'plenum',
    title: 'Supply plenum',
    text: 'In most pre-2000 Florida homes this is fiberglass duct board. Porous, fibrous, and impossible to clean once colonized. It gets replaced, not treated.',
  },
  {
    n: 5,
    key: 'boot',
    title: 'Register boot',
    text: 'Cold metal meeting a 130°F attic through failed insulation. It sweats, and the drywall ring around the vent is what the homeowner photographs.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Homepage
// ─────────────────────────────────────────────────────────────────────────────
export const home = {
  title: 'Mold Remediation Broward & Palm Beach County | AC Specialists',
  description:
    'Licensed mold remediation for Broward and Palm Beach County, specializing in HVAC and air handler mold. Source removal, independent clearance testing.',
  /* Not 'HVAC & air handler specialists' — the brand tagline directly above it
     in the header already reads 'Clean Air Specialists & Remediation', and two
     mono-uppercase 'specialists' lines 200px apart read as a copy mistake. The
     eyebrow's job is to add the thing neither the tagline nor the H1 says: where
     we start. */
  eyebrow: 'We start at the air handler',
  h1: 'Mold remediation for Broward and Palm Beach County homes',
  lede:
    'Run an air conditioner year-round in South Florida and the coil stays wet. Mold takes hold at the equipment first, and then the duct system carries it to every room in the house. We start where it starts.',

  /** Sits directly under the hero — the credibility strip. */
  assurances: [
    { label: 'Licensed', text: 'Florida mold remediator' },
    { label: 'Verified', text: 'Independent clearance testing' },
    { label: 'Standard', text: 'IICRC S520 source removal' },
  ],

  thesis: {
    eyebrow: 'The mechanism',
    h2: 'Down here, mold travels through the ductwork',
    body: [
      'Most people picture mold as something on a wall, spreading outward from a leak. That does happen. But the more common South Florida version is invisible from the room: growth starts at the wettest surface in the house — the evaporator coil — and the blower distributes it under positive pressure to every supply register in the building.',
      'That is why the same house can have a musty smell in four rooms and no visible growth anywhere. It is also why cleaning the visible spot fixes nothing, and why a company that treats one bedroom will be back in your house in six weeks.',
    'Trace the route below and the sequence explains itself: the equipment is wet first, the plenum is downstream of the equipment, and every room is downstream of the plenum.',
    ],
  },

  whyDifferent: {
    eyebrow: 'How we work',
    h2: 'Four things we do differently',
    items: [
      {
        title: 'We assess the whole air path before quoting',
        text: 'Return, coil, pan, blower, plenum, trunk, branches, boots. A scope written from a visual inspection of one stained ceiling is a guess, and the revision comes later at your expense.',
      },
      {
        title: 'We remove material instead of spraying it',
        text: 'Antimicrobials work on non-porous surfaces you can reach. They do not restore colonized fiberglass. If we tell you the plenum has to come out, we will show you why in the cabinet.',
      },
      {
        title: 'We do not grade our own work',
        text: 'Florida licenses assessors and remediators separately, and a company that assessed a property is barred from remediating it — [the specific rule runs twelve months](/faq/#does-florida-license-mold-remediation). Your clearance test comes from an independent assessor. That is what makes the passing result mean anything.',
      },
      {
        title: 'We fix the condition, not just the growth',
        text: 'An unsealed return, a short-cycling oversized system, a bath fan discharging into an attic. Remediation that skips the cause is a subscription, and we would rather not sell you one.',
      },
    ],
  },

  faqs: [
    {
      q: 'How fast can you get out here?',
      a: 'It depends on the week and where you are in the two counties, so the honest answer is that we will give you a real date on the call rather than a booking we then slip. Tell us if there is active water — that changes where you sit in the schedule, because a wet building has a clock on it and a contained patch of growth does not.',
    },
    {
      q: 'What does an inspection cost?',
      a: 'Ask on the call and we will tell you before anyone drives out — it depends on the property and on what you are describing, and a number you get afterwards is worth a lot less than one you get first. What we cannot sell you at any price is a licensed mold assessment with sampling: that is a separate license, a separate company, and an independent document.',
    },
    {
      q: 'Do you handle the repairs after the mold work?',
      a: 'We remove, clean, and dry. Reconstruction — drywall, texture, paint, flooring, and any plenum fabrication — is scoped separately and we are clear about which line items are which so you can compare bids honestly.',
    },
    {
      q: 'Are you licensed?',
      a: 'Florida requires a state mold remediator license to advertise or perform this work, and our number is on every page of this site and on every document we hand you. Ask for it from anyone who quotes you, and check it. It takes two minutes on the [state license portal](https://www.myfloridalicense.com/wl11.asp).',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// /services/ hub. The rest of this hub's copy still lives inline in build.mjs;
// new copy goes here, which is where the README says content belongs.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * The guides index. The four cards carried the whole page for a long time,
 * which left it at a third the length of the other two hubs and gave a reader
 * arriving from search no way to work out which guide was theirs.
 */
export const guidesHub = {
  sections: [
    {
      h2: 'Which one is yours',
      note: 'Four situations that need four different answers. Reading the wrong one costs you an afternoon; reading the right one occasionally saves a rebuild.',
      list: [
        {
          term: 'Water came in and it is still this week',
          text: 'This is the only one of the four with a clock on it. Porous material that stays wet crosses from a drying problem into a removal problem somewhere around the two-day mark, and the difference between those two jobs is measured in thousands of dollars. If anything is wet right now, [the first 48 hours](/guides/first-48-hours-after-water-damage/) is the one to read, and read it before you start pulling carpet.',
        },
        {
          term: 'You have quotes in hand and they do not agree',
          text: 'The useful test is whether the spread is a percentage or a multiple. Quotes within a few hundred dollars of each other are pricing the same job and you can choose on other grounds. Quotes that are several times apart are not, and no amount of staring at the totals will tell you which one is right. [Comparing three quotes](/guides/comparing-mold-remediation-quotes/) sets out what has to be written down — affected square footage, what comes out versus what gets cleaned, who does the clearance — before the numbers can be compared at all.',
        },
        {
          term: 'The dark staining is on the outside of the house',
          text: 'Most of what people photograph on a stucco wall and send us is not a remediation problem at all — it is algae, or it is the shaded north side doing what shaded north sides do in this climate. [The stuff on your stucco](/guides/mold-on-the-outside-of-your-house/) covers how to tell those apart from the pattern that does mean water is getting into the wall, which is the one worth acting on.',
        },
        {
          term: 'The house is about to sit empty for months',
          text: 'A closed-up Florida house with the air conditioning set to a comfortable number is the single most reliable way to come back to growth on every north-facing wall. [Closing a Florida home for the summer](/guides/closing-a-florida-home-for-the-summer/) is about humidity setpoints and what to leave running, and it is worth ten minutes before you drive north.',
        },
      ],
    },
    {
      h2: 'What a guide cannot do',
      flag: true,
      body: [
        'None of these will tell you whether what you are looking at is mold. That takes somebody in the room with a moisture meter, and on a property where remediation is likely it takes a [licensed assessor](/services/mold-inspection-testing/) who is not the company hoping to do the removal.',
        'They also will not size a scope. Square footage, what comes out versus what gets cleaned, and whether the plenum has to be replaced are decisions made against readings, not against a photograph. If a guide leaves you fairly sure you have a problem, the next step is somebody looking at it — ours or anybody else’s.',
        'And there is one situation where reading is the wrong move entirely: standing water that has not been removed, sewage involvement, or somebody in the house with asthma or a compromised immune system. Those are phone calls. [Tell us what you are seeing](/contact/) or ring the number at the top of the page.',
      ],
    },
  ],
};

export const servicesHub = {
  sections: [
    {
      h2: 'What runs through all six',
      body: [
        'The services are separate because the work is, but the method underneath them does not change. Find the water first, because growth is a symptom and the moisture source is what decides the scope and the cost. Contain the area before disturbing anything, because disturbing growth without containment is how one room becomes four. Remove what is porous rather than treating it, because no chemical restores material that growth has gone into. Then have somebody independent confirm it worked.',
        'That last step is the one that makes the rest verifiable, and it is why [mold inspection and testing](/services/mold-inspection-testing/) sits on this list alongside the removal work even though Florida will not let one company do both on the same property.',
      ],
    },
    {
      h2: 'Two pairs people mix up',
      note: 'The first two cost real money to get wrong, and neither is obvious from the names. The third is not a pair at all, and it is the one most likely to save you a call.',
      list: [
        {
          term: 'Air duct cleaning vs. HVAC mold remediation',
          text: 'Duct cleaning is hygiene: removing accumulated dust and debris from a system that is otherwise sound. HVAC mold remediation is removal: the coil, the pan, the blower, and usually a colonized plenum that has to be replaced rather than cleaned. If growth is at the coil, cleaning the ducts leaves the source running upstream of everything you just paid for. The tell is the smell — if it tracks with the air conditioning cycle, start at [the equipment](/services/hvac-air-conditioner-mold-remediation/), not the ductwork.',
        },
        {
          term: 'Inspection and testing vs. remediation',
          text: 'Inspection answers what is happening and why. Remediation removes it. They are separately licensed in Florida and one company is restricted from doing both on the same property, which is not red tape — it is what stops the company being paid to remove mold from also being the one deciding how much there is. If you are being offered both in one quote, that is the thing to ask about. [Why one company cannot do both](/faq/#why-is-one-company-not-allowed-to-inspect-and-remediate) is the shortest version of the reason.',
        },
        {
          term: 'And one that is not a pair at all',
          text: 'Growth on an exterior wall is usually neither. Most of what grows on South Florida stucco and roof tile is algae rather than mold, and the fix is a pruning saw and a sprinkler head. [Read this before booking anything](/guides/mold-on-the-outside-of-your-house/).',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// /process/ — targets "how does mold remediation work" style queries and
// carries HowTo structured data.
// ─────────────────────────────────────────────────────────────────────────────
export const process = {
  title: 'The Mold Remediation Process, Step by Step | South Florida',
  description:
    'What actually happens during mold remediation: assessment, containment, negative air, source removal, drying to standard, and independent clearance.',
  h1: 'What mold remediation actually involves, start to finish',
  eyebrow: 'The process',
  lede:
    'Remediation is easy to fake because the result is invisible. Here is every stage of a real job, what it is for, and what it should look like when someone is doing it properly in your house.',
  intro: [
    'If you have never had this work done before, the hardest part is knowing whether you are getting it. Two companies can quote the same room at wildly different numbers and describe the work in the same three sentences.',
    'So this page is written to be useful even if you hire someone else. Every stage below is something you can ask about, look at, and verify.',
  ],
  steps: [
    {
      title: 'Assessment and moisture mapping',
      duration: '1–2 hours',
      text: 'Before anything else, we find the water. Moisture meter readings on suspect material compared against unaffected reference areas of the same material, humidity and dew point readings, and thermal imaging where the assembly makes it useful. This is the same work described under [mold inspection and testing](/services/mold-inspection-testing/). Growth is the symptom. The moisture source determines the scope and the cost.',
      check: 'Ask to see the readings, and ask what the reference number was. A meter reading with no baseline is not a finding.',
    },
    {
      title: 'A written scope you could hand to someone else',
      duration: 'Before work starts',
      text: 'Affected materials, square footage, what is being removed versus cleaned, containment approach, equipment, and what is excluded. Written so that a second company could bid the identical job from it.',
      check: 'If the quote is a number and a sentence, you cannot compare it to anything. That is usually the point, and [comparing mold remediation quotes](/guides/comparing-mold-remediation-quotes/) walks through what to hold them to.',
    },
    {
      title: 'Containment',
      duration: '1–3 hours',
      text: 'Six-mil polyethylene sealed to floor, walls, and ceiling, with a zippered entry and — for anything beyond a small isolated area — a decontamination chamber. HVAC supply and return registers inside the containment get sealed so the system cannot move air through the work zone.',
      check: 'Walk up to it. You should see sealed edges, a real airlock, and taped-off registers. Plastic hanging loosely in a doorway is not containment.',
    },
    {
      title: 'Negative pressure',
      duration: 'Runs continuously',
      text: 'HEPA-filtered negative air machines ducted to the exterior, holding the containment at lower pressure than the rest of the house so any leakage moves inward. This is what keeps the rest of your home out of the job.',
      check: 'The containment walls should visibly pull inward. If the plastic is bulging outward, the machine is pushing air the wrong way or is not running.',
    },
    {
      title: 'Source removal',
      duration: '1–3 days',
      text: 'Colonized porous material comes out and is bagged inside the containment: drywall, insulation, carpet pad, duct board, ceiling tile. Semi-porous material like framing is cleaned mechanically — HEPA vacuum and abrasion — rather than removed, where it is structurally sound.',
      check: 'Removal is cut back to a defined margin past the visible growth, not to the edge of the stain.',
    },
    {
      title: 'Detail cleaning',
      duration: '2–6 hours',
      text: 'HEPA vacuum and damp wipe of every surface inside the containment, top down, including surfaces that look clean. Settled spores do not stop at the boundary of the visible growth, and this stage is what clearance testing is actually measuring.',
      check: 'This is the stage most often skipped, and it is the stage most often responsible for a failed clearance.',
    },
    {
      title: 'Drying to a documented standard',
      duration: '2–5 days if needed',
      text: 'Where material is still wet, air movers and LGR dehumidifiers run until affected materials reach a defined moisture content, verified daily against unaffected reference readings and logged. In this climate the dehumidification capacity does the work, not the fans. Where the water is recent, [the first 48 hours](/guides/first-48-hours-after-water-damage/) matter more than anything that happens later.',
      check: 'Ask for the daily logs. “We ran fans for three days” is not a dry standard.',
    },
    {
      title: 'Correcting the moisture source',
      duration: 'Varies',
      text: 'Sealing a leaking return, correcting filter bypass, adding dehumidification, replacing a failed condensate trap, or telling you which other trade you need. Most of these sit inside the [air conditioning system](/services/hvac-air-conditioner-mold-remediation/). Remediation without this step guarantees a repeat.',
      check: 'Your scope should name the cause explicitly. If nobody has told you why it happened, nobody has fixed it.',
    },
    {
      title: 'Independent clearance testing',
      duration: '2–5 days for lab results',
      text: 'A third-party licensed mold assessor — not us — inspects and samples the containment before it comes down. Florida separates these two licenses specifically so that this check is real, and [what that means for you](/faq/#licensing-and-standards) is worth reading before you hire anyone.',
      check: 'The company that did the work should never be the company that clears it. If they offer to, that is the whole answer about how they operate.',
    },
    {
      title: 'Teardown and reconstruction',
      duration: '1 day + rebuild',
      text: 'Containment comes down only after clearance passes. Reconstruction — drywall, texture, paint, flooring, plenum fabrication — is scoped and priced as its own line so you can see what you are paying for.',
      check: 'Nothing should be closed up before the clearance result is in hand.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// /faq/
// ─────────────────────────────────────────────────────────────────────────────
export const faqPage = {
  title: 'Mold Remediation FAQ | Broward & Palm Beach County',
  description:
    'Straight answers on mold remediation cost, insurance, Florida licensing, AC and duct mold, and what to do first, for Broward and Palm Beach homeowners.',
  h1: 'Mold questions South Florida homeowners actually ask',
  eyebrow: 'Answers',
  lede:
    'Written to be useful whether or not you hire us. Where the honest answer is “it depends” or “nobody knows,” that is what it says.',
  groups: [
    {
      title: 'Getting started',
      faqs: [
        {
          q: 'I think I have mold. What should I do first?',
          a: 'Stop the water if you can find it, and do not disturb the growth — scrubbing or sanding it aerosolizes far more than leaving it alone. If the smell tracks with your air conditioning, turn the system off rather than running it, because a running system distributes whatever is in it. Then get somebody to look at it. Photograph everything before anything changes, especially if an insurance claim is possible — [the first 48 hours](/guides/first-48-hours-after-water-damage/) sets out the order to do all of this in.',
        },
        {
          q: 'How do I know whether I need remediation or just cleaning?',
          a: 'The dividing line is the EPA guidance — under about ten square feet, roughly a three-foot square, is generally a job you can do yourself, and [the EPA sets it out here](https://www.epa.gov/mold/mold-cleanup-your-home) — but the material matters more than the area. Surface growth on non-porous tile or a shower surround is a cleaning job. Anything on drywall, in insulation, inside a wall cavity, or in an air system is a containment job regardless of size, because those cannot be cleaned in place and disturbing them without containment spreads it.',
        },
        {
          q: 'Should I test first or just have it removed?',
          a: 'If you can see it and you know where the water came from, testing usually just delays the work by a week to confirm what you already know. Test first when you have symptoms and no visible growth, when you need documentation for a claim or a real estate transaction, or when there is a dispute between a landlord and a tenant — [what a real inspection includes](/services/mold-inspection-testing/) covers what you should get back for the money. Always test at clearance, regardless.',
        },
      ],
    },
    {
      title: 'Cost and insurance',
      faqs: [
        {
          q: 'How much does mold remediation cost?',
          a: 'It scales with the square footage of affected material and how much of it is porous. A contained bathroom wall, an air handler and plenum, and a whole-house condition after a roof failure are three different orders of magnitude. What we will not do is quote a firm number over the phone, because that number always gets revised upward once someone actually takes a reading. [Comparing three quotes](/guides/comparing-mold-remediation-quotes/) is the more useful thing to read before you have any of them.',
        },
        {
          q: 'Does homeowners insurance cover mold in Florida?',
          a: 'Partially, usually. Most Florida policies carry a mold sublimit — $10,000 is a common figure — and coverage typically depends on the mold resulting from a sudden, accidental, covered water event. Gradual seepage, deferred maintenance, and chronic humidity are excluded in most policies. Document everything from day one; the documentation is what determines the outcome more than the argument does.',
        },
        {
          q: 'Should I file a claim?',
          a: 'For a sudden discharge — a supply line, a water heater, a condensate overflow into a ceiling — usually yes. For gradual humidity, filing may cost you more in premium and claim history than it recovers against a sublimit. We will document conditions either way and we will not push you toward a claim because it makes our invoice easier to collect.',
        },
        {
          q: 'Why are the quotes I am getting so different from each other?',
          a: 'Almost always because they are for different work. One is source removal with containment and clearance; another is a fogging service. Compare the scopes, not the numbers: what material is being removed, is there containment and negative air, who does the clearance test, and is reconstruction included or separate. [The five things a scope has to state](/guides/comparing-mold-remediation-quotes/) is the checklist version of that.',
        },
      ],
    },
    {
      title: 'Air conditioning and ductwork',
      faqs: [
        {
          q: 'Why does my house smell musty when the AC starts?',
          a: 'Because the source is in the equipment. A smell that is strongest in the first thirty to sixty seconds of a cycle and fades as it runs points at the coil or the drain pan — the blower pushes the accumulated odor down the ducts, then the air behind it is cleaner. A smell that grows as the system runs points more toward the duct system itself, which is [a different job](/services/air-duct-cleaning-sanitizing/) from the equipment.',
        },
        {
          q: 'Is there mold in my ducts?',
          a: 'Maybe, but it is rarely the whole story. Ducts are the delivery system; the coil is where growth almost always starts. If somebody quotes you duct cleaning without opening the air handler cabinet, they have looked at the pipes and not the source — [the seven places we find it](/services/hvac-air-conditioner-mold-remediation/) is where that starts.',
        },
        {
          q: 'What is duct board and why does it matter so much?',
          a: 'Rigid bonded fiberglass with a foil facing, used to build plenums and trunk lines in most Florida construction before roughly 2000. The interior face is an exposed fiber mat, so it is porous — growth extends into the fibers rather than sitting on the surface. No cleaning process removes growth from inside a fiber mat, and coating over it seals it in. That is why colonized duct board is replaced rather than treated.',
        },
        {
          q: 'Will a UV light in my air handler prevent mold?',
          a: 'A properly placed, correctly sized UV-C lamp aimed at the coil surface does inhibit growth on that coil, and there is real evidence behind it. What it does not do is clean a coil that is already colonized, sterilize your ductwork, or fix a humidity problem. It is a maintenance tool after remediation, not a substitute for it, and the lamps need replacing annually to do anything at all.',
        },
      ],
    },
    {
      title: 'Health, safety, and living through it',
      faqs: [
        {
          q: 'Is mold in my house making me sick?',
          a: 'That is a medical question and we are not qualified to answer it about you specifically. What is well established is that indoor mold can trigger allergic responses, worsen asthma, and pose genuine risk to immunocompromised people. Beyond that, the research on broader health effects is genuinely mixed, and anyone in our industry who tells you with certainty that mold is causing a specific symptom is going past what they know.',
        },
        {
          q: 'Do we need to move out?',
          a: 'For most jobs, no — containment and negative air exist so the rest of the house stays usable. Plan to stay out of the containment area entirely — [our process](/process/) sets out what is built and when. We do recommend relocating when the work involves the only air handler in the house in the middle of summer, when the affected area is large, or when someone in the home is immunocompromised, pregnant, or has significant respiratory disease.',
        },
        {
          q: 'Is bleach useful?',
          a: 'Less than its reputation. On non-porous surfaces, soap and water with mechanical scrubbing performs about as well and is safer to use — worth knowing that [the EPA’s own cleanup instruction](https://www.epa.gov/mold/mold-cleanup-your-home) is to scrub hard surfaces with detergent and water, and does not mention bleach at all. On porous material, bleach is mostly water — the chlorine stays at the surface while the water carries into the material, which can leave the substrate wetter than it started. It is not a remediation tool.',
        },
      ],
    },
    {
      title: 'Licensing and standards',
      faqs: [
        {
          q: 'Does Florida license mold remediation?',
          a: 'Yes. Florida licenses mold assessors and mold remediators as two separate credentials under [Chapter 468](https://www.flsenate.gov/Laws/Statutes/2025/468.8419), and performing or advertising this work without the license is a violation. The same section stops an assessor from remediating a structure their company assessed in the previous twelve months — that twelve-month bar is the specific rule, rather than a blanket ban, and it is what makes a clearance test mean anything. Ask for a license number, and verify it — the state maintains a [public license lookup](https://www.myfloridalicense.com/wl11.asp).',
        },
        {
          q: 'Why is one company not allowed to inspect and remediate?',
          a: 'Because the conflict is obvious once you say it out loud: a company that both decides how much mold there is and gets paid to remove it has a financial reason to find more. The separation is what makes a clearance test meaningful. It is also why “free mold inspection, we can start Monday” is a phrase worth being careful around.',
        },
        {
          q: 'What is IICRC S520?',
          a: 'The industry consensus standard for professional mold remediation. It defines the conditions, the containment levels, and the principle the whole trade is supposed to operate on — that remediation means physically removing contamination, not treating it in place. It is not law, but it is the document a competent remediator writes scopes against and the one an expert witness will reference if things go badly. [Every stage of the work](/services/mold-remediation/) is scoped against it, and [what the standard actually requires](/about/#the-standards-we-work-to) is set out in full alongside NADCA ACR.',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// /about/
// ─────────────────────────────────────────────────────────────────────────────
export const about = {
  title: 'About Us | Mold Remediation, Broward & Palm Beach County',
  description:
    'Who we are, how we scope mold remediation work, why we specialize in HVAC and air handler mold, and the standards we hold ourselves to across South Florida.',
  h1: 'A remediation company that started on the HVAC side',
  eyebrow: 'About',
  lede:
    'Most mold companies come out of water restoration. We came out of air conditioning, which is why we look at the equipment before we look at the wall.',
  body: [
    'The pattern that got us here is simple enough to state in one sentence: in South Florida, the air conditioner is the wettest thing in the building and it runs almost every day of the year. Once you have opened enough air handler cabinets, you stop being surprised that the ceiling stain in the guest room started in a closet forty feet away.',
    'That perspective changes how we scope work. A restoration-trained crew called out for a musty smell will look for a leak, and when they do not find one they will look harder for a leak. We start by asking what the indoor humidity is doing, what the return looks like, and whether the plenum is duct board. A good share of the time that conversation ends without any demolition at all.',
    'It also means we say no fairly often. We turn down duct cleaning on systems that do not need it, we tell people their ceiling stain is a repair rather than a remediation, and we refer the assessment side out because Florida requires it and because it is the right structure. None of that is generosity — it is that a remediation company lives on referrals, and the fastest way to lose them is to sell somebody work they did not need.',
  ],
  sections: [
    {
      h2: 'The standards we work to',
      note: 'This site refers to both repeatedly. Here is what they actually are, because almost nobody explains them.',
      list: [
        {
          term: 'IICRC S520 — mold remediation',
          text: 'Formally ANSI/IICRC S520, the Standard for Professional Mold Remediation — an ANSI-accredited consensus standard published by the [IICRC](https://iicrc.org/iicrcstandards/). It defines the conditions a space can be in, the containment levels that correspond to them, and the principle the whole trade is meant to operate on: remediation means physically removing contamination, not treating it in place. It is what our scopes are written against.',
        },
        {
          term: 'NADCA ACR — HVAC system cleaning',
          text: 'The [Assessment, Cleaning and Restoration of HVAC Systems](https://acrstandard.nadca.com/) standard, published by NADCA. Its core requirement is source removal, and NADCA states it plainly: cleaning begins with agitation devices that loosen contaminants from the interior surfaces, and the entire system is held under continuous negative pressure throughout so nothing spreads while that happens. We vent the collection unit outside on top of that, which is our practice rather than something the standard specifies. It is what separates [real duct cleaning](/services/air-duct-cleaning-sanitizing/) from a vacuum at the register.',
        },
        {
          term: 'Neither one is law',
          text: 'Worth being straight about. Florida licenses mold assessors and remediators under Chapter 468, but the statute does not mandate a particular technical standard. S520 and ACR are industry consensus documents. What they are is the reference a competent contractor writes scopes against — and the document an expert witness will hold a job up against if it ends up in front of one.',
        },
        {
          term: 'Which is why naming one matters',
          text: 'A company that cannot tell you what standard it works to is not necessarily doing bad work, but it has given you nothing to measure the work against. Ask. The answer takes four seconds and it is genuinely informative either way.',
        },
      ],
    },
    {
      h2: 'How to check any mold contractor, including us',
      note: 'All five take minutes, none of them require you to know anything about mold, and they apply to our quote as much as anyone else’s.',
      steps: [
        {
          title: 'Verify the license yourself',
          text: 'Florida licenses mold remediators and mold assessors separately, and both are searchable on the state’s public [DBPR license portal](https://www.myfloridalicense.com/wl11.asp). Ask for the number, then look it up rather than taking the number on the van as confirmation that it is current.',
          check: 'A remediator license starts MRSR; an assessor license starts MRSA. If somebody is offering you both services on one property, that is the thing to question.',
        },
        {
          title: 'Ask who performs the clearance test',
          text: 'The answer should be an independent licensed assessor, not the company doing the removal. This is the single most informative question on the list.',
          check: 'If a company offers to test its own work, you have learned everything you need about how it operates.',
        },
        {
          title: 'Ask what standard they work to',
          text: 'S520 for remediation, NADCA ACR for duct work. You are not testing their recall — you are finding out whether there is a defined method behind the price.',
        },
        {
          title: 'Get the scope in writing before the number matters',
          text: 'Materials, square footage, what is removed versus cleaned, containment, equipment, exclusions, and who does the clearance. A number without those is not comparable to anything. [Comparing three quotes](/guides/comparing-mold-remediation-quotes/) goes through this properly.',
        },
        {
          title: 'Confirm insurance, and ask specifically about pollution liability',
          text: 'General liability is standard. Pollution liability is the one that actually responds to a mold claim, and not every contractor carries it. Ask for a certificate rather than a verbal answer.',
        },
      ],
    },
  ],

  principles: [
    {
      title: 'The moisture source is named in every scope',
      text: 'If we cannot tell you why it happened, we have not finished the assessment.',
    },
    {
      title: 'Porous material is removed, not treated',
      text: 'Duct board, saturated insulation, colonized drywall. If it holds moisture in a fiber, no chemical restores it.',
    },
    {
      title: 'Somebody else grades the work',
      text: 'Independent clearance testing, every time, from a licensed assessor with no financial interest in the result.',
    },
    {
      title: 'The scope is written so you can compare it',
      text: 'Materials, square footage, containment, equipment, exclusions. Detailed enough for a competitor to bid from.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// /contact/
// ─────────────────────────────────────────────────────────────────────────────
export const contact = {
  title: 'Contact | Mold Remediation Broward & Palm Beach County',
  description:
    'Call or request an inspection for mold remediation in Broward and Palm Beach County. What to have to hand, and what to do before anyone arrives.',
  h1: 'Tell us what you are seeing',
  eyebrow: 'Contact',
  lede:
    'The fastest path is a phone call — most of what we need to know takes about four minutes to establish. If it is easier to write it down, the form goes to the same place.',

  sections: [
    {
      h2: 'Before you call, depending on what is happening',
      note: 'Two of them have something you can do before anyone arrives that changes what the job turns into: switching the air conditioning off, and photographing the damage before anything gets moved. Both are free, and both stop being possible quickly.',
      list: [
        {
          term: 'Water is coming in right now',
          text: 'Stop the source if you can reach it, kill power to any area with standing water near outlets, and stay out from under a bulging ceiling. Then photograph everything before you move anything — that is what a claim gets built on and it cannot be recreated later. [The first 48 hours](/guides/first-48-hours-after-water-damage/) is written to be read while it is happening.',
        },
        {
          term: 'The smell is worst when the air conditioning kicks on',
          text: 'Switch the system off at the thermostat before you call. A running blower distributes whatever is growing in the equipment to every room in the house, which turns a problem contained to the air handler into one that has to be chased through the whole building.',
        },
        {
          term: 'You have just opened a house that was closed for the season',
          text: 'Same instruction — leave the air conditioning off, open windows if the weather allows, and have the air handler looked at before the system goes back into service.',
        },
        {
          term: 'It is green or black film on an outside wall',
          text: 'It is very likely algae rather than mold, and very likely a landscaping and irrigation fix rather than a job for us. [Read this first](/guides/mold-on-the-outside-of-your-house/) — we would rather you did not pay anyone, including us, to look at it.',
        },
        {
          term: 'You are holding quotes that do not resemble each other',
          text: 'That is normal and it is almost never about price. [Comparing three quotes](/guides/comparing-mold-remediation-quotes/) covers what a scope has to state before the numbers can be compared at all.',
        },
      ],
    },
    {
      h2: 'What is useful to have to hand',
      note: 'None of it is required. It just makes the call shorter and the answer better. If what you actually want to know is what happens after the call, [our process](/process/) sets out all ten steps, and says at each one what to ask us to show you.',
      list: [
        { term: 'Where it is and what it looks like', text: 'Room, surface, roughly how big. A photograph is worth more than any description — you can text it.' },
        { term: 'How long you have known about it', text: 'Two days and two years are genuinely different problems, and the answer changes what we expect to find.' },
        { term: 'Whether anything is wet right now', text: 'This is the question that decides whether you need somebody today or this week.' },
        { term: 'The age of the house and of the air conditioning', text: 'The second one matters more than people expect. A twenty-year-old air handler and a two-year-old one point in different directions before anyone has seen anything.' },
        { term: 'Whether anyone in the house is vulnerable', text: 'Immunocompromised, pregnant, undergoing treatment, or significant asthma. It changes what we recommend about staying in the house, not just how we do the work.' },
      ],
    },
  ],
  /**
   * ⚠️ The contact form has no backend. A static site cannot email anything by
   * itself. Before launch, wire `action` to one of:
   *   • A form service: Formspree, Basin, Web3Forms, Netlify Forms (free tiers)
   *   • Your own endpoint
   * Until then the form is set to `hasBackend: false`, which renders it as a
   * clearly-labelled placeholder rather than a control that silently fails.
   */
  form: {
    hasBackend: true,
    /**
     * Posts to RankEngineAI's lead capture rather than a form service.
     *
     * WHY NOT Formspree or Basin. Those deliver a message to an inbox and stop
     * there. This endpoint stores the enquiry against the client with its
     * first-touch attribution, so the dashboard can answer which marketing
     * produced which job, which is the thing the plan is actually for. It is
     * the same door the other hosted sites use.
     *
     * IT IS NOT A NATIVE FORM POST. The endpoint takes JSON with a client_id,
     * not urlencoded fields, so `action` is deliberately NOT rendered as a form
     * action -- a browser with JavaScript off would otherwise navigate away to
     * a 400. The handler in public/site.js sends it, and without JavaScript the
     * form renders the call-us notice instead. See build.mjs.
     *
     * The client id is public by design: it identifies a tenant, and the
     * endpoint refuses any request whose Origin is not this site's own domain,
     * so it cannot be used to write rows against anybody else.
     */
    endpoint: 'https://rankengineai.com/api/inquiry',
    clientId: '0c31846a-da5a-4301-b6f5-41854433cb27',
    action: '',
  },
};

export default { home, process, faqPage, about, contact, airPathPoints };
