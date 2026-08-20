/**
 * GUIDES
 *
 * Long-form pages that answer a question a homeowner actually types, rather
 * than describing a service we sell. They exist for two reasons: they rank for
 * query clusters the service pages cannot reach, and they are the only pages on
 * this site somebody would voluntarily send to a neighbor.
 *
 * The bar for adding one: it has to be useful enough that a reader who never
 * calls us still got their money's worth. If a draft reads like a service page
 * with a question for a title, it is not a guide.
 */

export const guides = [
  {
    slug: 'closing-a-florida-home-for-the-summer',
  cta: {
    h2: 'Opening the house back up and not sure what you are smelling?',
    body: 'Leave the system off at the thermostat and call before you run it. We can usually tell from a description whether what you are describing is the coil or the house.',
  },
  areasNote: 'Seasonal occupancy is concentrated in a handful of places down here, and these are the pages that go into the housing stock in detail.',
    published: '2026-08-15',
    /* Bump this only when the substance changes. It used to come from the mtime
       of this file, which meant a punctuation fix restamped all four guides as
       revised that day — a freshness signal the edit had not earned. */
    updated: '2026-08-15',
    nav: 'Summer closing guide',
    title: 'Closing a Florida Home for the Summer Without Mold',
    description:
      'How to shut a South Florida home for the summer without coming back to mold: humidity targets, what to do with the AC, and the full pre-departure checklist.',
    h1: 'How to close a South Florida home for the summer without coming back to mold',
    eyebrow: 'Guide',
    media: { image: 'flat-roof-villa', video: 'hero-villa', caption: 'Seasonal housing, Palm Beach County. Five months closed is the whole problem.' },
    lede:
      'The advice people give each other at the clubhouse (set it to 80, shut off the water, see you in November) is the single most reliable way to produce a mold problem in this market. Here is what actually works, and why.',
    short: 'Set it to 80 and shut off the water is the most reliable way to come back to mold. What works instead.',

    signals: [
      { value: '55%', label: 'Relative humidity to hold while the house is empty. Not a temperature target, a humidity target.' },
      { value: '5 months', label: 'Typical May-to-October vacancy, which is also the hottest and wettest part of the year.' },
      { value: 'Tens vs thousands', label: 'What holding humidity costs each month against what remediating the result costs. We are not going to invent a figure for your power bill: it depends on the equipment, the house and the rate you pay. But the two numbers are not in the same range, and that is the whole argument.' },
    ],

    intro: [
      'Every year between Thanksgiving and January we take a run of calls that all start the same way: the owner opened the door for the first time since spring, and the smell hit them before they got their bag inside. Almost none of those houses had a leak. They had five months of unmanaged humidity.',
      'This page is the whole answer, and it is deliberately written so you can act on it without calling anybody.',
    'One number to set expectations before the detail. [The EPA puts indoor humidity below 60 per cent, ideally between 30 and 50](https://www.epa.gov/mold/mold-course-chapter-2). The figure recommended below for a closed-up Florida house is 55 per cent, which sits above that ideal band on purpose. Chasing 45 in August means an air conditioner running almost continuously in an empty building. And the failure we actually get called to is never the house held at 55. It is the house left at 80 degrees with no dehumidification at all. Under 60 is the line that matters. Lower is better if your equipment can hold it without running itself into the ground.',
    ],

    sections: [
      {
        h2: 'Why “set it to 80” fails',
        body: [
          'An air conditioner removes moisture as a side effect of running. The coil sits below the dew point, water condenses on it, and that water leaves through the drain. No run time, no dehumidification. It is that direct.',
          'Set the thermostat to 80°F in a closed South Florida house in July and the system satisfies that setpoint almost immediately, then sits idle for hours. Total run time collapses. Meanwhile moisture keeps entering through the slab, through the envelope, and through every humid air exchange, with nothing removing it. Interior humidity climbs into the seventies and stays there.',
          'At sustained relative humidity above about 60%, mold does not need a leak, a flood, or a plumbing failure. Ordinary house dust on ordinary surfaces is enough. That is the entire mechanism, and it is why the houses we open in November are usually bone dry and still smell.',
        ],
      },
      {
        h2: 'The three strategies that work',
        note: 'In order of what we would recommend, not in order of cost.',
        list: [
          {
            term: '1. A thermostat with a true humidity setpoint',
            text: 'Not “dry mode” and not a temperature setting you hope produces dehumidification. A thermostat that reads humidity and calls for cooling to hold it, typically around 55%, with the temperature allowed to drift into the high 70s. Many modern thermostats can do this and most owners have never turned it on.',
          },
          {
            term: '2. A standalone whole-house dehumidifier',
            text: 'A ducted or free-standing unit with a hard-piped drain, set to 55%, running independently of the air conditioning. This is the most reliable option because it does not depend on your AC being correctly sized, and it keeps working if the compressor fails in August.',
          },
          {
            term: '3. A humidistat wired to the air handler',
            text: 'The older, cheaper version of option one: a mechanical or digital humidistat that overrides the thermostat and calls for cooling when humidity rises. Common in Florida condos and still perfectly effective.',
          },
          {
            term: 'What is not a strategy',
            text: 'Turning the system off entirely. Setting the thermostat to 80 and nothing else. Leaving buckets of desiccant in the closets. Asking a neighbor to “run the AC now and then.” None of these hold a humidity ceiling for five months.',
          },
        ],
      },
      {
        h2: 'The pre-departure checklist',
        note: 'Roughly an hour of work, most of it the week before you leave.',
        steps: [
          {
            title: 'Service the air conditioning before you go, not after',
            text: 'Coil condition, drain pan, condensate line, and the float safety switch. The system is about to run unattended through the worst five months of the year, and a clogged drain line in July is how a ceiling comes down in a house nobody is in.',
            check: 'Ask specifically whether the safety switch was tested, not just whether the line was cleared.',
          },
          {
            title: 'Put in a fresh filter',
            text: 'A new filter on the way out, sized correctly and seated without gaps at the edges. Filter bypass is how dust reaches a wet coil, and a wet coil with a dust mat on it is the most common growth we find.',
          },
          {
            title: 'Set a humidity target, not just a temperature',
            text: 'Around 55% RH, with the temperature allowed to sit at 78 to 80°F. If your equipment cannot hold a humidity setpoint, this is the thing to fix before you leave. It matters more than any other item on this list.',
            check: 'After you set it, watch the reading for a full day before you travel. It should settle, not climb.',
          },
          {
            title: 'Open the house up internally',
            text: 'Interior doors open, closet doors open, and furniture pulled a few inches off exterior walls. Air has to reach the surfaces that go first, and closets on exterior corners are almost always the first thing to grow.',
          },
          {
            title: 'Take the organic material out of the closets',
            text: 'Cardboard boxes, stacks of paper, leather goods, and anything upholstered that is stored against an exterior wall. These are food sources sitting in the least ventilated part of the house.',
          },
          {
            title: 'Deal with the water main deliberately',
            text: 'Shutting the main off protects you from a supply-line failure, which is a real risk. But if you have an irrigation system, an ice maker, or a leak-detection valve, decide consciously rather than flipping one handle on the way out. A whole-house leak detection shutoff is worth the money on a seasonal property.',
          },
          {
            title: 'Empty and prop the refrigerator, or leave it running',
            text: 'A closed, unpowered, empty refrigerator grows mold on its own door gasket in this climate. Either leave it running with the doors closed, or empty it, clean it, and prop both doors open.',
          },
          {
            title: 'Close the blinds on the sun side',
            text: 'Solar gain through west and south glass drives the cooling load and shortens equipment life. It is a small thing that costs nothing.',
          },
          {
            title: 'Arrange a real monthly check, and tell them what to look at',
            text: 'Somebody physically inside the house once a month. Not a drive-by. Give them three things: read the humidity, look at the ceiling around every air conditioning register, and put a hand on the floor at the base of exterior walls and in the AC closet.',
            check: 'Ask them to text you the humidity reading each visit. A trend is worth far more than a single number.',
          },
        ],
      },
      {
        h2: 'Coming back in the fall',
        flag: true,
        body: [
          'If you open the door and the house smells musty, do not turn the air conditioning on. That is the one instruction on this page we would ask you to take literally.',
          'A system that has grown something over the summer is a distribution network. Running the blower pushes it out of the air handler and into every room in the house before anyone has looked at anything, and it turns a contained equipment problem into a whole-house one. We have seen the difference between a one-day job and a one-week job come down to whether somebody flipped the thermostat on before calling.',
          'Instead: open the windows if the weather allows it, get a portable dehumidifier running, and have the air handler, drain pan, and plenum looked at before the system goes back into service.',
        ],
      },
      {
        h2: 'What this costs versus what it prevents',
        body: [
          'Holding 55% relative humidity in a closed house for five months costs meaningfully less than most owners assume: the equipment runs in longer, lower-load cycles rather than short hard ones, and you are cooling an empty building with the blinds shut.',
          'The comparison that matters is not electricity against zero. It is electricity against remediating an air handler, replacing a colonized duct board plenum, and cleaning a duct system, in a unit you cannot use until it is finished, during the season you actually came down here for.',
        ],
      },
    ],

    faqs: [
      {
        q: 'What temperature should I leave my Florida house at for the summer?',
        a: 'The temperature is the wrong dial to be thinking about. Set a humidity target of around 55% and let the temperature land wherever it needs to, usually 78 to 80°F. If your thermostat cannot hold a humidity setpoint, a temperature around 76 to 78 will produce more run time and better dehumidification than 80, but it is a workaround rather than a solution.',
      },
      {
        q: 'Is it cheaper to just turn the AC off completely?',
        a: 'It is cheaper in electricity and considerably more expensive in every other way. An unconditioned closed house in a South Florida summer will sit near outdoor humidity for months. This is the single most common cause of the seasonal mold calls we take, and remediation costs multiples of a summer of run time.',
      },
      {
        q: 'Do I need a dehumidifier if my AC is new?',
        a: 'Maybe not. A correctly sized modern system with a working humidity setpoint can hold the house on its own. Where a dehumidifier earns its keep is on oversized equipment that short-cycles, on zoned systems where a wing rarely calls for cooling, and as insurance on a property you cannot check for months. It also keeps working if the compressor fails while you are away, which the air conditioner obviously does not.',
      },
      {
        q: 'Should I have someone check the house while I am gone?',
        a: 'Yes, physically inside, monthly. The value is not that they will spot mold. By the time it is visible you already have a job. The value is the humidity reading. A house that reads 52% in June and 68% in August has told you something is wrong while it is still cheap to fix.',
      },
      {
        q: 'The house already smells and I just got back. What now?',
        a: 'Follow the steps above before you touch the thermostat: the order matters more than the speed. Beyond that, this is the most common call we take in December, and it is usually very fixable: a coil and plenum that have grown something over a closed-up summer are a contained equipment problem. What decides how big the job gets is whether the blower has already run. If it has, the same growth is now distributed through every room it serves, and we are pricing a house instead of a machine.',
      },
    ],

    /** Cities where this guide is most relevant — cross-linked both ways. */
    relevantAreas: ['wellington', 'boca-raton', 'boynton-beach', 'delray-beach', 'pompano-beach'],
    relatedServices: ['hvac-air-conditioner-mold-remediation', 'mold-inspection-testing', 'mold-remediation'],
  },
];

guides.push({
  slug: 'comparing-mold-remediation-quotes',
  cta: {
    h2: 'Want a scope you can actually hold the other two to?',
    body: 'Our scope states every line this page says a scope has to state, so you can read it against the other two and decide from there. Ask what the visit costs when you call.',
  },
  published: '2026-08-15',
  updated: '2026-08-15',   // bump only when the substance changes
  nav: 'Comparing three quotes',
  title: 'How to Compare Mold Remediation Quotes | South Florida',
  description:
    'Why three mold remediation quotes for the same room come back 5x apart, what a comparable scope has to state, and the questions that tell you which is real.',
  h1: 'How to compare three mold remediation quotes',
  eyebrow: 'Guide',
  media: {
    image: 'moisture-meter',
    video: 'hero-moisture-meter',
    caption: 'A quote written from readings is a different document from a quote written from a glance.',
  },
  lede:
    'Two companies looked at the same bedroom and the numbers came back five times apart. That is normal in this trade, and it is almost never because one of them is greedy. They quoted different work.',
    short: 'Same bedroom, numbers five times apart. That is normal, and it is almost never about greed.',

  signals: [
    { value: '5 items', label: 'What a comparable scope has to state. Missing any one of them and you cannot compare the number to anything.' },
    { value: '2 licenses', label: 'Florida separates assessment from remediation. Whoever writes the clearance should not be whoever did the work.' },
    { value: 'Ask first', label: 'What a walkthrough and a written scope cost. Get the number before anyone drives out, from us or from anyone else.' },
  ],

  intro: [
    'The single most common thing we hear on a first call is that the homeowner has three quotes in front of them, they range from a few hundred dollars to five figures, and none of them explains itself. That spread is real information. It is just not information about price.',
    'This page is how to read them. It is written so it works on our quote too, and you should hold us to it.',
  ],

  sections: [
    {
      h2: 'Why the numbers are so far apart',
      body: [
        'Almost always because the three companies are describing three different jobs under the same two-word heading.',
        'One is quoting a fogging service: a technician arrives, sprays an antimicrobial, runs the blower, and leaves. That is a few hundred dollars because it is a few hundred dollars of work. One is quoting source removal with containment, negative air, physical removal of colonized material, and an independent clearance test. One is quoting something in between, or the same work with reconstruction bundled in, or the same work with reconstruction explicitly excluded and not saying so out loud.',
        'Until the scopes are comparable the prices are not. The rest of this page is how to make them comparable.',
      ],
    },
    {
      h2: 'The five things a scope has to state',
      note: 'If a quote is missing any of these, ask for it in writing before you compare the number to anything.',
      list: [
        {
          term: '1. What material, and how much of it',
          text: 'Named materials and square footage: “removal of 40 sq ft of colonized drywall and batt insulation, north wall, floor to 4 feet.” Not “affected areas.” Square footage of porous material is the single biggest driver of what this costs, so a quote that will not state it has left itself room to move.',
        },
        {
          term: '2. What is removed versus what is cleaned',
          text: 'Porous material comes out. Semi-porous and non-porous material gets cleaned. Which is which on your job is a judgment call that changes the price substantially, and it should be written down rather than decided on the day.',
        },
        {
          term: '3. Containment and equipment',
          text: 'Whether containment is being built, what kind, and how many air scrubbers or negative air machines for how many days. This is the line most commonly missing from a cheap quote, because it is the line the cheap quote is not doing.',
        },
        {
          term: '4. Who performs the clearance test, and what happens if it fails',
          text: 'It should be a third-party licensed assessor, not the remediator. And the quote should say who pays to go back in if it does not pass. If that is unstated, assume it is you.',
        },
        {
          term: '5. What is excluded',
          text: 'Reconstruction, painting, flooring, plenum fabrication, the plumber or roofer who fixes the actual leak. A quote with no exclusions section is not a cheaper quote. It is a quote with the exclusions still ahead of you.',
        },
      ],
    },
    {
      h2: 'The questions worth asking on the phone',
      note: 'Four minutes each, and they separate the three quotes faster than anything else you can do. There are [five more checks that work on any contractor](/about/#how-to-check-any-mold-contractor-including-us), ours included, and not one of them needs you to know anything about mold.',
      steps: [
        {
          title: 'Where is the water coming from?',
          text: 'A company that cannot answer this has not finished assessing. Growth is a symptom; the moisture source determines the scope, the cost, and whether the job stays fixed. The answer should be specific: a failed condensate trap, a window sealant failure, a short-cycling oversized system.',
          check: 'If the answer is “we would have to open it up,” fine. If the answer is a shrug, keep calling.',
        },
        {
          title: 'What did the moisture meter read, and what was the reference?',
          text: 'A reading only means something against unaffected material of the same type in the same building. Someone who took readings will have both numbers and will not mind being asked.',
          check: 'A quote produced without any instrument is a guess, and the revision comes later at your expense.',
        },
        {
          title: 'Who does the clearance test?',
          text: 'The answer you want is the name of an independent assessor, or an offer to refer you to one. Florida licenses assessment and remediation separately and restricts one company from doing both on the same property. [The conflict that rule removes](/faq/#why-is-one-company-not-allowed-to-inspect-and-remediate) is worth a minute before you choose anyone.',
          check: 'If a company offers to test its own work, you have learned everything you need to know about how it operates.',
        },
        {
          title: 'What happens to the duct board plenum?',
          text: 'Only relevant if your system is involved, but in pre-2000 Florida housing it usually is. Colonized fiberglass duct board cannot be cleaned. It is porous and growth extends into the fiber mat. The honest answer is replacement.',
          check: 'If someone offers to clean and encapsulate a colonized plenum, ask what standard they are working to.',
        },
        {
          title: 'Is reconstruction in this number or not?',
          text: 'Removal leaves holes. Somebody has to close them. Whether that is in the quote, quoted separately, or your problem entirely is the most common reason two apparently similar numbers are not similar at all.',          check: 'The quote says which of the three it is in writing. If it does not say, the answer is your problem entirely.'

        },
      ],
    },
    {
      h2: 'Three quotes that should worry you',
      eyebrow: 'The red flags',
      flag: true,
      body: [
        'A free mold inspection followed by that same company’s remediation quote. In Florida those are two separate licenses and [one company is restricted from doing both](/faq/#why-is-one-company-not-allowed-to-inspect-and-remediate) on the same structure. A free visual walkthrough from a remediation company is a normal sales call and is fine. A free “inspection” presented as an assessment is not the same thing.',
        'A number with no scope. One page, one figure, a sentence of description. There is nothing to hold anyone to, and nothing to compare.',
        'Anything built around spraying. Fogging, sanitizing, ozone, or an antimicrobial treatment offered as the remediation rather than as a step at the end of it. Antimicrobials work on non-porous surfaces you can physically reach. They do not restore porous material, and the porous material is the problem.',
      ],
    },
    {
      h2: 'What actually drives the number',
      body: [
        'In rough order: the square footage of porous material that has to come out, whether the HVAC system is involved, how many days of containment and equipment the job needs, whether the affected area is accessible or behind cabinetry and tile, and whether reconstruction is included.',
        'What barely moves it: the species of mold. The remediation protocol for colonized drywall does not change by genus, so a lab result naming something frightening should not change your price. If it does, ask why.',
        'We will not quote a number on this page, and you should be suspicious of any company that quotes one over the phone without readings. What we will do is put all five items above in writing so that you can hand our scope to a competitor and get a genuinely comparable bid. That is the test of whether a scope is real.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Why is one quote $400 and another $6,000 for the same room?',
      a: 'Because they are not for the same work. The low number is almost always a spray-and-go treatment; the high number is containment, negative air, physical removal of colonized material, drying to a documented standard, and an independent clearance test. Compare the scopes line by line and the price gap usually explains itself in about two minutes.',
    },
    {
      q: 'Should I just take the cheapest quote?',
      a: 'Take the cheapest quote that does the actual work, which is a different question. If two scopes genuinely match on material, square footage, containment, equipment, clearance and exclusions, then price is a fair way to choose between them. If they do not match, you are not comparing prices at all.',
    },
    {
      q: 'Is a free inspection a red flag?',
      a: 'Not by itself. Plenty of remediation companies will come out, look at your ceiling and write you a scope without charging for the visit, and that is a normal sales call rather than a trick. What matters is that this is not the same thing as a licensed mold assessment with sampling, which is a separate license, a separate company, and an independent document. Be careful of anyone blurring those two.',
    },
    {
      q: 'Do I need three quotes?',
      a: 'For anything beyond a small contained job, yes. Not mainly for the price, but because the second and third conversations are how you learn what questions to ask. If there is standing water right now, skip this and call somebody, because the window between a water loss and a mold job is about two days in this climate.',
    },
    {
      q: 'Will my insurance decide which company I use?',
      a: 'Usually not: in Florida you generally choose your own contractor, though your carrier may have preferred vendors and may push you toward one. What the carrier does decide is what it will pay, which is a separate question from what the work costs. Document conditions thoroughly from day one either way.',
    },
  ],

  relevantAreas: [],
  relatedServices: ['mold-remediation', 'mold-inspection-testing', 'hvac-air-conditioner-mold-remediation'],
});

guides.push({
  slug: 'first-48-hours-after-water-damage',
  cta: {
    h2: 'Is anything still wet right now?',
    body: 'That is the question that decides whether this is a drying job or a removal job, and the answer changes by the hour. Call rather than write if the water is still there.',
  },
  published: '2026-08-15',
  updated: '2026-08-15',   // bump only when the substance changes
  nav: 'The first 48 hours',
  title: 'First 48 Hours After Water Damage | South Florida',
  description:
    'What to do in the two days between a water loss and a mold problem: what to photograph, what to move, and when running the AC makes it worse.',
  h1: 'What to do in the first 48 hours after water gets into your house',
  eyebrow: 'Guide',
  media: {
    image: 'structural-drying',
    video: 'hero-drying',
    caption: 'Extraction, opened assemblies, dehumidification. What the first two days should end up looking like.',
  },
  lede:
    'The gap between a water loss and a mold job is about two days in this climate. What you do inside that window largely decides which of the two you end up paying for.',
    short: 'About two days separate a water loss from a mold job. What you do inside that window decides which.',

  signals: [
      { value: '24–48 hrs', label: 'From wetting to the start of growth on organic material at South Florida temperatures. This is the whole clock.' },
    { value: '3 categories', label: 'Clean, gray, and black water. The category decides what can be dried and kept, and what has to go regardless.' },
    { value: 'Before you move it', label: 'Photograph everything first. It is the cheapest thing on this page and the one people skip.' },
  ],

  intro: [
    'This is written for the person standing in it right now, so it is ordered by the clock rather than by topic. Skim the headings, do the thing under the one you are in.',
    'The two-day figure is not ours. It is the window [the EPA puts on drying out a flooded house](https://www.epa.gov/indoor-air-quality-iaq/flood-cleanup-protect-indoor-air-quality), and their plainer version of it is that things left wet for more than two days usually get moldy. Everything below is about spending that window well.',
    'It applies to a supply line, a water heater, an air conditioning overflow, and to wind-driven rain and roof intrusion after a tropical system, which in August and September is most of why people call.',
  ],

  sections: [
    {
      h2: 'The first hour',
      note: 'In this order. The photographs genuinely come before the cleanup.',
      steps: [
        {
          title: 'Make it safe before you make it dry',
          text: 'If water is anywhere near outlets, a panel, or a submerged appliance, kill the power to that area at the breaker before you walk in it. If the ceiling is holding water and bulging, stay out from under it: a saturated drywall ceiling comes down as a sheet, and it comes down without warning.',
          check: 'Standing water plus energised circuits is the one hazard on this page that can actually hurt you.',
        },
        {
          title: 'Stop the source',
          text: 'Supply line or water heater: shut the main. Air conditioning overflow: switch the system off at the thermostat and the breaker, and put a container under the drain pan. Roof or window intrusion during a storm: you generally cannot stop it, so move to containing where it lands.',
        },
        {
          title: 'Photograph everything before you move anything',
          text: 'Wide shots of each affected room, then close-ups of the source, the standing water, the wet materials, and every damaged item. Get the water line on the wall while it is still visible. Video walking through, narrating what you are seeing, is even better.',
          check: 'This is what your claim is built on, and it cannot be recreated once you start cleaning up. Five minutes now.',
        },
        {
          title: 'Call your carrier and start a claim file',
          text: 'Even if you are not sure you will file. Note the time, the claim number, and who you spoke to. Most Florida policies impose a duty to mitigate, meaning you are expected to act promptly to limit damage, so starting the clock formally protects you.',
        },
      ],
    },
    {
      h2: 'Hours one to six: get the water out',
      body: [
        'Every gallon you remove mechanically is a gallon nobody has to pay to evaporate later, and evaporation is the expensive half of drying.',
      ],
      list: [
        { term: 'Extract standing water', text: 'A wet/dry shop vacuum, a pump, or a mop and bucket. Do not use a household vacuum cleaner on standing water. It is not rated for it and it is a shock hazard.' },
        { term: 'Get furniture up off wet flooring', text: 'Aluminium foil, plastic blocks, or wood scraps under the legs. Wooden and metal furniture legs will bleed stain and rust into wet carpet within hours, and that transfer is usually permanent.' },
        { term: 'Lift area rugs off wet floors', text: 'They will both stay wetter and mark the floor underneath. Get them out of the room entirely if you can.' },
        { term: 'Take out what is already lost, but photograph it first', text: 'Saturated carpet pad, soaked cardboard, wet paper. Bag it and set it aside rather than binning it immediately. An adjuster may want to see it.' },
        { term: 'Open cabinet doors and drawers, pull toe kicks', text: 'The cavity under a kitchen cabinet run holds water and dries last. It is one of the most common places we find growth six weeks after a “dried” loss.' },
        { term: 'Do not start cutting drywall yet', text: 'Unless water is actively pooling behind it. Where and how high to cut is a decision made from moisture readings, and cutting in the wrong place turns a contained loss into a bigger repair.' },
      ],
    },
    {
      h2: 'Which water you are dealing with',
      note: 'This is the single biggest factor in what can be saved.',
      list: [
        { term: 'Category 1: clean', text: 'A supply line, a water heater, rainwater through a roof. If it is addressed quickly, most materials can be dried in place and kept.' },
        { term: 'Category 2: gray', text: 'Dishwasher or washing machine discharge, toilet overflow with no solids, aquarium water. Some porous material can be saved if it is dried fast; much of it cannot.' },
        { term: 'Category 3: black', text: 'Sewage, a toilet backflow past the trap, ground surface water, and storm surge or flood water. Nothing porous that it touched gets dried and kept. Not carpet, not pad, not drywall, not insulation. This is not an upsell and it is not negotiable.' },
        { term: 'Category degrades with time', text: 'Category 1 water sitting in a warm house for two days with organic material in it is no longer Category 1. The clock changes the answer, which is why the clock is the point of this page.' },
      ],
    },
    {
      h2: 'Should you run the air conditioning?',
      flag: true,
      body: [
        'This is the question we get most often on these calls, and the answer genuinely goes both ways.',
        'Run it if the water did not reach the air handler, the ducts, or the closet the equipment sits in. In South Florida the air conditioner is a dehumidifier, ambient humidity is what makes drying slow here, and a running system meaningfully helps.',
        'Do not run it if water reached the air handler, the return, the plenum, or any part of the duct system, or if the ceiling above the equipment is what got wet. A running blower in a wet system distributes whatever is starting to grow to every room in the house, and it converts a contained equipment problem into a whole-house one before anybody has looked at it.',
        'If you lost power in a storm and the house has been closed and hot for two days, that matters as much as the water did. An unconditioned South Florida house sits near outdoor humidity within hours, and everything in this guide runs faster in those conditions.',
      ],
    },
    {
      h2: 'Hours six to forty-eight: why fans alone are not drying',
      body: [
        'The instinct is to point every fan in the house at the wet spot. Air movement is genuinely half the job: it strips the saturated boundary layer off a wet surface so evaporation can continue. But it is only half.',
        'The other half is taking that moisture out of the air, and in a climate where outdoor air is already at 70 or 80 percent relative humidity, opening windows and running box fans mostly moves wet air around. What actually dries a South Florida house is dehumidification capacity: a refrigerant dehumidifier with a drain, sized to the space, running continuously. Rent one the same day if you are doing this yourself.',
        'Watch the materials, not the surface. A tile floor feels dry long before the slab under it and the drywall behind the baseboard are. If you can borrow or buy a cheap moisture meter, take readings on affected material and on the same material in an unaffected room, and keep going until they match.',
      ],
    },
    {
      h2: 'When to stop and call somebody',
      body: [
        'Any one of these is reason enough to stop and call. You do not need several of them.',
        'Also call if you are simply not sure. Ask what a visit costs when you call. The honest outcome is sometimes that you have already handled it and do not need us, which is a genuinely useful thing to be told on day two rather than discovered on day forty.',
      ],
      list: [
        { term: 'The water was Category 2 or 3', text: 'Anything that is not clean supply-line water: appliance discharge, ground water, or sewage.' },
        { term: 'It has been more than about 48 hours', text: 'Past that window in this climate you are not drying a building any more, you are removing material from it.' },
        { term: 'More than roughly one room is affected', text: 'Scale changes the equipment and the containment, and both of those change what the job is.' },
        { term: 'Water reached wall cavities or ran under cabinetry', text: 'You cannot verify those are dry from the room side, and that is where do-it-yourself drying usually fails.' },
        { term: 'The air handler or the ducts were involved', text: 'A wet air system distributes whatever grows in it to every room the moment it runs again.' },
        { term: 'Someone in the house is vulnerable', text: 'Immunocompromised, pregnant, undergoing treatment, or significant respiratory disease. It changes the advice, not only the work.' },
      ],
    },
  ],

  faqs: [
    {
      q: 'How long before mold starts growing after water damage?',
      a: 'Twenty-four to forty-eight hours on organic material at South Florida temperatures, and faster if the power is out and the house is warm and closed. That window is why response time genuinely matters on these calls rather than being a sales line.',
    },
    {
      q: 'Can I just dry it myself?',
      a: 'For a small Category 1 loss caught within hours (a supply line under a sink, caught the same day), often yes, if you extract properly and run real dehumidification rather than just fans. What you cannot do yourself is verify that a wall cavity or the space under a cabinet run is dry, and that is where these come back.',
    },
    {
      q: 'My ceiling is stained from the storm but everything feels dry now. Do I need anything?',
      a: 'Possibly not, but do not assume. A stain means water passed through and sat somewhere. What matters is whether the insulation above it is still wet and whether the drywall reads dry against an unaffected reference. Both are quick to check and neither is visible from the room.',
    },
    {
      q: 'Should I throw out wet carpet?',
      a: 'Photograph it first, then it depends on the category and the timing. Carpet from Category 1 water caught quickly can often be saved; the pad underneath usually cannot and is cheap to replace. Anything touched by Category 3 water goes, without exception.',
    },
    {
      q: 'Will insurance cover this?',
      a: 'For a sudden, accidental discharge (a supply line, a water heater, an air conditioning overflow), usually yes, subject to your deductible, and mold that results from it is typically covered up to a sublimit ($10,000 is a common Florida figure). Flood and storm surge are a separate policy entirely and are not covered by standard homeowners insurance. Gradual seepage is generally excluded. Document everything from hour one either way.',
    },
  ],

  relevantAreas: [],
  relatedServices: ['water-damage-mold-cleanup', 'mold-remediation', 'hvac-air-conditioner-mold-remediation'],
});

guides.push({
  slug: 'mold-on-the-outside-of-your-house',
  cta: {
    h2: 'Not sure whether what you are looking at is algae or a wall problem?',
    body: 'Send a photograph and say which elevation it is on and what the room behind it is doing. If it is algae we will tell you so and point you at a pressure-washing contractor rather than booking anything.',
  },
  areasNote: 'Shaded elevations and mature landscaping are what drive this, so it turns up hardest in the communities built around preserves, golf courses and old canopy.',
  published: '2026-08-15',
  updated: '2026-08-15',   // bump only when the substance changes
  nav: 'The stuff on your stucco',
  title: 'Is That Mold on the Outside of Your House? | South Florida',
  description:
    'The black streaks on your roof and the green film on your stucco are usually not mold. What they actually are, when they matter, and the cheap fixes that work.',
  h1: 'Is that mold on the outside of your house?',
  eyebrow: 'Guide',
  media: {
    image: 'historic-bungalow',
    video: 'hero-bungalow',
    caption: 'Planting hard against stucco on a shaded elevation. The most common exterior call we get, and usually the cheapest to solve.',
  },
  lede:
    'Probably not, is the short answer. Most of what grows on the outside of a South Florida house is algae or lichen rather than mold, and most of it is a landscaping problem rather than a remediation one.',
    short: 'Most of what grows outside a South Florida house is algae: a landscaping problem, not a remediation one.',

  signals: [
    { value: 'Algae', label: 'What the black streaking on Florida roofs almost always is: a cyanobacteria, not mold.' },
    { value: '18–24 in', label: 'Clearance to keep between planting and the wall. The single most effective thing on this page.' },
    { value: '$0', label: 'What a lot of this costs to fix, because the answer is usually a pruning saw and a sprinkler head.' },
  ],

  intro: [
    'We get called out to exterior growth constantly, and a good share of those visits end with us telling somebody they do not need us. That is a slightly odd thing to publish, so here is the whole explanation instead.',
    'The important distinction is not what it looks like. It is whether what you are seeing is a surface organism living on the outside of a building, or a sign that part of your wall assembly is staying wet.',
  ],

  sections: [
    {
      h2: 'What is actually growing out there',
      note: 'Four things get called mold. Only one of them usually is.',
      list: [
        {
          term: 'Black streaking on the roof: algae',
          text: 'Those dark runs down a roof slope are almost always Gloeocapsa magma, a cyanobacteria that feeds on moisture and the limestone filler in roofing material. It is unsightly, it holds heat, and on tile it is nearly universal in this climate. It is not mold and it is not a building-health problem.',
        },
        {
          term: 'Green or gray film on stucco: algae',
          text: 'A thin uniform film on a shaded elevation, often heaviest near the base and under eaves. Also algae. It tells you the surface stays damp, which is worth knowing, but the film itself is not damaging the stucco.',
        },
        {
          term: 'Crusty gray-green patches: lichen',
          text: 'Raised, circular, and much harder to remove than algae because it is anchored into the surface. Slow-growing and mostly cosmetic on stucco, though on tile it can lift and hold moisture.',
        },
        {
          term: 'Genuine mold and mildew',
          text: 'Darker, patchier, and typically concentrated where something is repeatedly wetted: under a leaking gutter joint, beneath a window that sheds water onto the wall, at a hose bib. Outdoors this is far less common than the other three, and where it turns up it is usually pointing at a specific water source.',
        },
      ],
    },
    {
      h2: 'When exterior growth is actually telling you something',
      body: [
        'The organism is rarely the problem. What matters is whether it is a symptom of a wall that no longer dries.',
      ],
      list: [
        { term: 'Growth at the base of the wall', text: 'A band in the lowest foot or two suggests splash-back, irrigation, or leaf litter holding moisture against the slab edge. That one is worth acting on, because it is the part of the assembly closest to the interior floor.' },
        { term: 'Growth around a crack or a penetration', text: 'Concentrated growth at a stucco crack, a hose bib, a light fixture or a window return means water is being repeatedly delivered there. And stucco cracks let water into the wall, not just onto it.' },
        { term: 'The same location, inside', text: 'The one finding that changes the conversation. Exterior growth plus a damp or stained interior surface at the same spot means it is no longer an exterior question.' },
        { term: 'An elevation that never dries', text: 'A north or east wall under mature canopy, or a preserve-edge lot with vegetation hard against the building. This is chronic rather than acute, and it is the situation most likely to eventually become a real problem.' },
        { term: 'Nothing else', text: 'A uniform film on a shaded wall with a dry interior and no cracking is, genuinely, a cleaning job. We would rather tell you that than sell you an inspection.' },
      ],
    },
    {
      h2: 'The fixes, cheapest first',
      steps: [
        {
          title: 'Cut planting back from the wall',
          text: 'Eighteen to twenty-four inches of clear air between vegetation and stucco. This is the highest-value item on the page by a distance: it restores air movement at the wall, lets sun reach the surface, and stops foliage holding water against the building after every rain.',
          check: 'If you can no longer walk between the shrub and the house, it is too close.',
        },
        {
          title: 'Point the irrigation at the ground',
          text: 'Heads set years ago and never revisited routinely spray stucco two or three times a week, indefinitely. Walk the zones once while they are running and watch where the water actually lands.',
          check: 'Do this at the hour the system runs. Overspray looks completely different at 5am than it does at noon.',
        },
        {
          title: 'Clear leaf litter from the slab edge',
          text: 'A packed band of leaves and mulch against the wall holds water exactly where you least want it. Mulch should sit below the stucco termination, not against it.',
        },
        {
          title: 'Fix what is dripping',
          text: 'A gutter joint, a downspout discharging at the foundation, an air conditioning condensate line ending beside the wall. Concentrated exterior growth usually has a specific source directly above it.',
        },
        {
          title: 'Thin the canopy rather than removing the tree',
          text: 'Raising and thinning a mature tree gets air and light back onto the elevation without losing the shade that keeps your cooling bill down. An arborist is the right call here, not a remediation company.',
        },
        {
          title: 'Soft wash: do not pressure wash',
        text: 'A soft wash: low pressure, a solution that kills the organism, then a rinse. Worth knowing that it removes what is there and does nothing to stop it returning. On a shaded north wall or the north slope of a tile roof in this climate, plan on repeating it every few years rather than treating it as solved.',
          check: 'If a contractor proposes pressure washing your tile roof, get a second quote.',
        },
      ],
    },
    {
      h2: 'What we would tell you on the phone',
      flag: true,
      body: [
        'If you describe uniform green film on a shaded wall with a dry interior, we will tell you it is algae, point you at the list above, and not schedule anything. That is not us being generous: an exterior cleaning is not our trade, and sending a remediation crew to a landscaping problem wastes your money and our day.',
        'What we do want to hear about is exterior growth paired with anything happening inside: a damp baseboard, a stained wall base, a musty smell in the room behind that elevation. That combination is worth a moisture reading, and it is the case where an exterior symptom is genuinely worth acting on.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What are the black streaks on my roof?',
        a: 'Gloeocapsa magma, the organism described above. It reads as streaks because it travels down-slope with rainwater, which is also why it shows worst below vents, in valleys, and anywhere runoff concentrates. The practical point is that this is a roof-cleaning job and not a remediation one. No mold contractor should be quoting you for it, ourselves included.',
    },
    {
      q: 'Will pressure washing get rid of it?',
      a: 'It will remove it and cause other problems. High pressure drives water into stucco and behind roof tile, abrades the surface so the growth returns faster, and on barrel tile it can crack tiles outright. Soft washing, low pressure plus a solution that kills the organism, is the standard for a reason. Be especially careful about anyone offering to pressure wash a tile roof.',
    },
    {
      q: 'Does exterior mold get inside?',
      a: 'Not by growing through a sound wall. Concrete block and intact stucco are not a food source and not a route. What does get inside is water (through a stucco crack, a failed window seal, or a penetration), and where that happens you will usually find growth on the interior surface at the same location. The exterior film is a clue about moisture, not a colonization route.',
    },
    {
      q: 'Should I use bleach on it?',
      a: 'For exterior algae on a hard surface, a diluted solution applied at low pressure is roughly what a soft wash is, so yes in principle. Be careful of the runoff. It will damage planting under the wall, which is the same planting you may want to keep. And it does nothing about the shade and moisture that let it grow, so it will come back on the same schedule.',
    },
    {
      q: 'How often does it come back?',
      a: 'On a shaded elevation with vegetation against it, within a year or two. On a wall that gets air movement and some sun, considerably longer. That difference is the entire argument for fixing the conditions rather than just cleaning the surface, and it is why the pruning saw does more for you than the pressure washer.',
    },
  ],

  relevantAreas: ['palm-beach-gardens', 'jupiter', 'weston'],
  relatedServices: ['mold-inspection-testing', 'mold-remediation', 'black-mold-removal'],
});

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

export default guides;
