/**
 * SERVICE PAGES
 *
 * One entry per /services/<slug>/ page. Order controls nav + hub-page order.
 * `featured: true` promotes the page into the hero rail and the header nav.
 *
 * ── A note on the copy ───────────────────────────────────────────────────────
 * The technical content here (coil temperatures, RH thresholds, duct board
 * behavior, IICRC S520 / NADCA ACR references, the Florida assessor-remediator
 * separation) is accurate as written, but it describes an industry, not your
 * company. Before launch, have someone on your side read every page for two
 * things: claims you cannot back up, and anything your licensing attorney
 * would want worded differently. See CONTENT-REVIEW.md.
 */

export const services = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'hvac-air-conditioner-mold-remediation',
    cta: {
      h2: 'Does the smell arrive in the first thirty seconds of a cycle?',
      body: 'That timing is the most useful thing you can tell us, because it separates the equipment from the ductwork before anyone opens a cabinet. Switch the system off and ring us.',
    },
    media: { image: 'evaporator-coil', video: 'hero-coil', caption: 'Evaporator coil and fin pack: the wettest surface in a South Florida house, and where growth usually starts.' },
    featured: true,
    nav: 'HVAC & AC Mold',
    navLong: 'HVAC / AC Mold Remediation',
    h1: 'HVAC and AC Mold Remediation in Broward & Palm Beach County',
    title: 'AC & HVAC Mold Remediation | Broward & Palm Beach FL',
    description:
      'Air handler, evaporator coil, and duct mold remediation across Broward and Palm Beach County. Source removal, not fogging, and a written scope you can compare.',
    eyebrow: 'Our specialty',
    short: 'Air handlers, coils, plenums, and ductwork: the place South Florida mold almost always starts.',
    lede:
      'Down here the air conditioner runs eleven months a year, and the evaporator coil is wet the entire time it runs. That makes the air handler the most reliable place to find mold in a South Florida home, and the duct system is what carries it to every room.',

    signals: [
      { value: '40–45°F', label: 'Evaporator coil surface temperature, below the dew point of indoor air in South Florida for most of the calendar year.' },
      { value: 'Under 60%', label: 'The line that matters for indoor humidity. The EPA puts the ideal band at 30 to 50%. We aim for 45 to 55% in occupied South Florida homes, because holding lower than that here means running the equipment almost continuously.' },
      { value: '24–48 hrs', label: 'How long a wet organic surface has before growth begins at our ambient temperatures.' },
    ],

    intro: [
      'Most mold calls in Broward and Palm Beach do not start with a burst pipe. They start with a homeowner who notices the house smells like a basement for the first thirty seconds after the AC kicks on, or who finds dark speckling on the ceiling ring around a supply register, or who gets an air quality result they do not understand.',
      'All three of those point at the same place. The air handler is the wettest thing in a South Florida house, it runs continuously, and everything it grows gets pushed downstream through the ducts under positive pressure.',
    ],

    sections: [
      {
        h2: 'Why the air handler goes first',
        body: [
          'An evaporator coil works by holding a surface below the dew point of the air moving across it. That is not a side effect. That is the mechanism. The coil is supposed to be wet, because condensing moisture out of the air is half of what an air conditioner does.',
          'What turns a wet coil into a mold problem is what lands on it. Household dust is roughly half organic: skin cells, fabric fibers, pet dander, cooking residue. A return filter that is undersized, bypassed at the edges, or three months overdue lets that dust reach the fins, where it packs into a mat and stays soaked. That mat is a substrate. The coil is the incubator.',
          'The second factor is specific to this market: oversized equipment. A system with too much capacity for the house satisfies the thermostat quickly and shuts off before it has run long enough to pull latent heat out of the air. The result is a house that reads 74°F and 65% relative humidity: cold, clammy, and hospitable. We see it constantly in homes where a contractor replaced a failing three-ton system with a four-ton because bigger sounded better.',
        ],
      },
      {
        h2: 'The seven places we find it',
        note: 'Ordered by how often it turns up, not by how bad it is.',
        list: [
          { term: 'Evaporator coil and fin pack', text: 'A visible biofilm mat between the fins, usually on the upstream face. Restricts airflow, drops capacity, and sits directly in the supply air stream.' },
          { term: 'Drain pan and condensate trap', text: 'A clogged or dry P-trap backs water into the pan. Standing water in a dark cabinet at 75°F is the easiest growth you will ever find. This is also the failure that floods ceilings.' },
          { term: 'Blower wheel', text: 'Dust cakes into the individual blades and holds humidity between cycles. A caked wheel also moves measurably less air, which makes every other problem worse.' },
          { term: 'Fiberglass duct board plenum', text: 'The single worst offender in pre-2000 Florida housing stock. Duct board is porous. Once the mat is colonized it cannot be cleaned, only replaced.' },
          { term: 'Flex duct interior liner', text: 'Compressed, kinked, or sagging runs collect dust and condensate. Whether a run can be cleaned or has to be replaced is a judgment call we make in person, not over the phone.' },
          { term: 'Supply register boots', text: 'Where a cold metal boot meets a 130°F attic with failed insulation, it sweats. The drywall ring around the register goes first: that dark halo people photograph and send us.' },
          { term: 'Return plenum and platform returns', text: 'Many South Florida homes use a framed closet or a platform under the air handler as the return. If that cavity is unsealed, the system pulls hot, humid, unconditioned air out of the garage or attic on every cycle.' },
        ],
      },
      {
        h2: 'Fogging is not remediation',
        flag: true,
        body: [
          'This is worth saying plainly, because it is the most common thing done to South Florida homeowners on this problem: a company arrives, sprays a biocide into the return, runs the blower, charges a few hundred dollars, and leaves. The smell goes away for a few weeks.',
          'Nothing was remediated. Antimicrobials work on non-porous surfaces you can physically reach and wipe. They do not restore porous material. Spraying a colonized fiberglass duct board plenum kills what is on the surface and leaves the mat intact, and the mat is the problem. When the smell returns, and it does, the homeowner concludes that mold remediation does not work.',
          'The standard the industry actually operates under, IICRC S520, is built around source removal: physically remove the contaminated material, clean what can be cleaned to a verifiable standard, and replace what cannot. Chemicals are a supporting step at the end, never the job.',
        ],
      },
      {
        h2: 'How we remediate an HVAC system',
        steps: [
          { title: 'Shut the system down and contain it', text: 'The air handler stops before anything else happens. A running system during remediation is a distribution network. We build containment at the equipment and, where the ducts are involved, at the affected registers.' },
          { title: 'Put the work area under negative pressure', text: 'HEPA-filtered negative air machines exhausted outside, so the pressure differential runs into the containment rather than out of it into your living space.' },
          { title: 'Pull and clean the blower assembly', text: 'The blower wheel comes out. It is cleaned off the equipment, not sprayed in place. You cannot reach the inside faces of the blades any other way.' },
          { title: 'Clean the coil for real', text: 'Fin-safe cleaner, mechanical agitation, and a rinse that carries the debris into the pan and out the drain. A coil that has been chemically fogged and not rinsed is a coil that still has the mat on it.' },
          { title: 'Service the pan, trap, and drain line', text: 'Clear the line, verify the trap holds a seal, confirm the pan drains and the safety switch works. Skipping this guarantees a repeat visit.' },
          { title: 'Replace what cannot be cleaned', text: 'Colonized duct board plenums come out and are rebuilt in sheet metal with an appropriate liner, or in new board where that is the right call. Flex runs that are contaminated through the liner get replaced, not scrubbed.' },
          { title: 'Clean the duct system to a source-removal standard', text: 'NADCA ACR: mechanical agitation with the system under continuous negative pressure, working run by run, so the debris that gets loosened ends up in the collection unit rather than redistributed through the rest of the system. We duct that unit to the exterior, which is our practice on top of what the standard asks for.' },
          { title: 'Correct the condition that caused it', text: 'Sealing a leaking return, correcting filter bypass, adding a dedicated dehumidifier, or telling you the equipment is oversized. Remediation without this step is a subscription.' },
          { title: 'Independent clearance testing', text: 'A third-party licensed mold assessor verifies the work. Florida requires that separation, and it is the right way to do it anyway: the person who did the work should not be the person who grades it.' },
        ],
      },
      {
        h2: 'If your building uses fan coil units',
        body: [
          'Everything above assumes a split system: an air handler in a closet, a condenser outside, refrigerant between them. That covers almost every house and most low-rise condominiums in Broward and Palm Beach, but it does not cover the towers.',
          'Above roughly eight stories a great many units are served by a fan coil unit instead: a compact coil and blower fed with chilled water from the building’s central plant. The growth conditions are identical: a coil held below the dew point, dust, and a condensate pan. But the access is not. Fan coils are typically mounted above a ceiling or inside a sealed soffit rather than behind an access panel, and their condensate often depends on a small pump rather than gravity drainage. Both mean the problem is found late, and a pan that overflows above a ceiling can present in the unit below rather than in yours.',
          'It also makes more of the answer a building question than a unit question. If you are in a tower, read the Riviera Beach page, which goes into the tall-building version of this in detail.',
        ],
      },
      {
        h2: 'When the duct board has to go',
        body: [
          'A large share of Broward and Palm Beach housing built before roughly 2000 uses fiberglass duct board for the supply plenum and sometimes for the entire trunk. It was cheap, it insulated and ducted in one product, and it works fine dry.',
          'The problem is what it is. Duct board is bonded fiberglass with a foil facing on the outside and an exposed mat on the inside. That interior surface is porous and fibrous, which means it holds dust, holds moisture, and gives hyphae something to grow into rather than merely onto. There is no cleaning process that removes growth from inside a fiber mat, and there is no coating that makes a colonized one safe by sealing it in.',
          'If we tell you the plenum has to be replaced, that is why. If a company tells you they can clean it and encapsulate it, ask them what standard they are working to.',
        ],
      },
    ],

    faqs: [
      {
        q: 'My AC smells musty for the first minute after it turns on. Is that mold?',
        a: 'Usually, yes, but not always. That specific pattern, strong at startup and fading as the cycle runs, points at the coil or the pan. There is also a milder condition the trade calls dirty sock syndrome, which is a bacterial film on the coil rather than mold and produces a distinctly different smell. Either way the fix starts in the same place, and either way it is coming from the equipment, not from the room.',
      },
      {
        q: 'Can you clean the mold out of my air conditioner, or do I need a new system?',
        a: 'In most cases the equipment itself is salvageable. Coils, blower wheels, cabinets, and drain pans are non-porous and can be cleaned to a verifiable standard. What frequently does need replacing is the porous material attached to the system: fiberglass duct board plenums, contaminated flex duct, and saturated insulation. Full system replacement is a fair conversation when the equipment is already near end of life or when the cabinet insulation itself is colonized.',
      },
      {
        q: 'Does duct cleaning fix a mold problem?',
        a: 'Only if the ducts are the whole problem, which is rare. Cleaning the ducts and leaving a colonized coil upstream means you have cleaned the delivery pipes and left the source running. We assess the whole air path (return, coil, pan, blower, plenum, trunk, branches, boots) and scope the work from that, which sometimes means we tell you your ducts are fine.',
      },
      {
        q: 'How long does HVAC mold remediation take?',
        a: 'A contained air handler with a coil, blower, pan, and plenum is typically one full day. Add full duct system cleaning and it is one to two days. Plenum fabrication or a substantial flex duct replacement can push it to three. Independent clearance testing adds a day or two on the back end because the lab turnaround is not ours to control.',
      },
      {
        q: 'Will homeowners insurance cover this?',
        a: 'Be prepared for the answer to be partly. Florida policies commonly carry a mold sublimit ($10,000 is typical), and coverage generally depends on the mold stemming from a sudden, accidental, covered water event, like a supply line failure or a condensate overflow that flooded a ceiling. Gradual humidity and deferred maintenance are excluded in most policies. We document conditions thoroughly so you have what you need to file, but we will not tell you a claim is covered when we do not know that.',
      },
    ],
    related: ['air-duct-cleaning-sanitizing', 'mold-remediation', 'mold-inspection-testing'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'mold-remediation',
    cta: {
      h2: 'Ask for the scope before you ask for the price',
      body: 'Materials, square footage, what comes out against what gets cleaned, containment, equipment, exclusions, and who performs the clearance. We will write ours that way whether or not you use it to hire somebody else.',
    },
    media: { image: 'containment', video: 'hero-containment', caption: 'Containment under negative pressure. The sheeting pulls inward, which is how you know the machine is doing its job.' },
    featured: true,
    nav: 'Mold Remediation',
    navLong: 'Mold Remediation',
    h1: 'Mold Remediation in Broward and Palm Beach County',
    title: 'Mold Remediation Broward & Palm Beach County FL',
    description:
      'Licensed mold remediation across Broward and Palm Beach County. Containment, negative air, HEPA source removal, and independent clearance testing to IICRC S520.',
    eyebrow: 'Core service',
    short: 'Containment, negative air, source removal, and a third-party clearance test that closes the file.',
    lede:
      'Remediation is a physical process with a defined endpoint, not a treatment you apply. The material comes out, the space gets cleaned to a standard, and somebody independent verifies it.',

    signals: [
      { value: 'S520', label: 'The IICRC standard our scopes are written against, the reference document for microbial remediation.' },
      { value: '3 zones', label: 'Containment, decontamination chamber, and clean side. Air moves in one direction only.' },
      { value: '≥ 4 ACH', label: 'Air changes per hour we hold inside containment with HEPA-filtered negative air.' },
    ],

    intro: [
      'Mold remediation has a bad reputation in South Florida, and a lot of that is earned. The work is easy to fake, the results are invisible, and the customer is usually anxious enough to accept whatever they are told. A crew can spray something, run a fan, hand over an invoice, and be gone in two hours.',
      'What separates real remediation from that is not equipment or chemicals. It is a defined scope, physical removal of contaminated material, and verification by somebody who does not work for us.',
    ],

    sections: [
      {
        h2: 'What the job actually consists of',
        steps: [
          { title: 'Assessment and scope', text: 'Moisture mapping with a meter and, where the situation calls for it, thermal imaging. We are looking for the water first. Growth is a symptom; the moisture source is the disease.' },
          { title: 'Containment', text: 'Six-mil poly, zippered entry, and a decontamination chamber for anything beyond a small isolated area. The point is that nothing crosses out of the work zone on a boot or a sleeve.' },
          { title: 'Negative pressure', text: 'HEPA-filtered negative air machines ducted to the exterior, holding the containment under negative pressure relative to the rest of the house so any leakage runs inward.' },
          { title: 'Source removal', text: 'Colonized porous material is cut out and bagged inside containment: drywall, insulation, carpet pad, duct board, ceiling tile. Semi-porous framing is cleaned mechanically, typically by HEPA vacuum and abrasion.' },
          { title: 'Detail cleaning', text: 'HEPA vacuum and damp wipe every surface in the containment, top down, including the ones that look clean. Settled spores do not respect the boundary of the visible growth.' },
          { title: 'Drying to standard', text: 'If the material is still wet, we dry it to a documented moisture content before anything gets closed up. Rebuilding over wet framing restarts the clock.' },
          { title: 'Clearance', text: 'An independent licensed mold assessor tests. That is the entire point of having someone else hold the meter.' },
        ],
      },
      {
        h2: 'Why the moisture source comes first',
        body: [
          'Every remediation scope we write starts with a question that has nothing to do with mold: where is the water coming from, and has it stopped?',
          'In this market the answer is usually one of six things: a roof or window penetration, a plumbing supply or drain failure, an AC condensate overflow, a stucco or seawall-adjacent moisture path through the slab, chronically high indoor humidity from an oversized or short-cycling system, or an unsealed return pulling humid air out of an attic or garage.',
          'We are not roofers or plumbers, and we will tell you when you need one. What we will not do is remediate a wall cavity while water is still entering it and call that a completed job.',
        ],
      },
      {
        h2: 'What comes out and what gets cleaned',
        note: 'This single decision drives most of what a job costs. It is worth understanding before you read a quote.',
        list: [
          {
            term: 'Porous: it comes out',
            text: 'Drywall, batt and blown insulation, carpet pad, ceiling tile, [fiberglass duct board](/services/air-duct-cleaning-sanitizing/), particle board. Growth extends into the material rather than sitting on it, so there is no cleaning process that restores it and no coating that makes a colonized one safe.',
          },
          {
            term: 'Semi-porous: usually cleaned, sometimes removed',
            text: 'Framing lumber, plywood, concrete block, plaster, unfinished wood. Cleaned mechanically, by HEPA vacuum and abrasion, where the material is structurally sound. Removed where growth has gone deep or the member has lost integrity. This is the judgment call, and it is where two honest quotes can legitimately differ.',
          },
          {
            term: 'Non-porous: cleaned',
            text: 'Metal, glass, tile, sealed surfaces, the inside of an air handler cabinet. HEPA vacuum and damp wipe. Almost nothing in this category needs replacing, which is why an equipment cabinet is usually salvageable even when the plenum attached to it is not.',
          },
          {
            term: 'Contents',
            text: 'Hard goods clean. Upholstery, mattresses and anything with foam or batting are judged on how wet, how long, and what category of water. Documents and photographs are recoverable and time-critical. Say so on the first call.',
          },
          {
            term: 'The margin matters as much as the category',
            text: 'Removal is cut back to a defined distance past the visible growth, because the edge of what you can see is not the edge of what is there. A quote that removes exactly the stained area is a quote that will be back.',
          },
        ],
      },
      {
        h2: 'What happens after we leave',
        body: [
          'Remediation ends with an empty, clean, dry cavity and a passing clearance test. It does not end with a finished room, and that gap surprises people often enough to be worth stating plainly here rather than in a conversation on day four.',
          'Nothing gets closed up before clearance passes: not drywall, not trim, not flooring. That sequencing is not bureaucracy: sealing a cavity before it has been verified means that if the test fails, the repair comes back out. So reconstruction is scoped and priced separately, and on our estimates it is a distinct line rather than folded into a single number, so you can see what you are paying for and compare it honestly against anyone else. [How to compare three quotes](/guides/comparing-mold-remediation-quotes/) covers why that separation matters when the bids do not resemble each other.',
          'Some people have us handle the rebuild, some have their own contractor, and some do the painting themselves once the drywall is back. All three are fine. What is not fine is discovering on the last day that nobody had priced it.',
        ],
      },
      {
        h2: 'What we do not do',
        flag: true,
        body: [
          'We do not perform the mold assessment on a property we remediate. Florida separates those two licenses deliberately, and the separation exists so that the company being paid to remove mold is not also the company deciding how much mold there is. If you called us first, we will refer you to independent assessors and step out of that part.',
          'We also do not sell air scrubber rentals as remediation, encapsulate porous material that should be removed, or produce a mold report with a remediation quote stapled to the back of it.',
        ],
      },
    ],

    faqs: [
      {
        q: 'How much does mold remediation cost in South Florida?',
        a: 'Honest answer: it depends almost entirely on square footage of affected material and how much of it is porous. A contained bathroom wall is a different job from a whole-house condition after a roof failure. Anyone who quotes you a firm number over the phone without seeing the moisture readings is guessing, and the guess will be revised. We give you a written scope after an in-person inspection and we hold that number.',
      },
      {
        q: 'Do I need to move out during remediation?',
        a: 'For most jobs, no. Proper containment and negative air exist so that the rest of the house stays livable. You should plan to be out of the containment area entirely, and if the work involves the only air handler in the house in August, you will want a plan for that. If anyone in the home is immunocompromised, has asthma, or is undergoing treatment, we will recommend relocating for the duration and we will say so plainly.',
      },
      {
        q: 'How long does it take?',
        a: 'A single contained room is commonly one to three days of remediation, plus one to two days waiting on clearance lab results, plus reconstruction if material was removed. Larger losses scale from there. The unpredictable part is usually clearance turnaround and rebuild scheduling, not the remediation itself.',
      },
      {
        q: 'Will it come back?',
        a: 'Only if the water does. That is the honest answer and it is the reason we name a moisture source in every scope: remediation removes what grew, it does not change the conditions that let it grow. Where we see repeats, it is almost never a failure of the cleaning: it is a leak nobody fixed, a short-cycling system that keeps the house at 65% humidity, or an unsealed return pulling attic air across a cold coil. If a company cannot tell you why it happened, they have not finished the assessment, and you should expect to see them again.',
      },
      {
        q: 'Do you do the reconstruction as well?',
        a: 'We can, and plenty of people use their own contractor instead. Both are normal. What matters is that it gets scoped. Remediation ends with a clean, dry, verified cavity, not a finished room, and nothing gets closed up until clearance passes. We price the rebuild as a separate line rather than burying it in one number, so you can see it and compare it. The failure mode to avoid is finding out on the last day that nobody quoted it.',
      },
      {
        q: 'Can I just clean it myself with bleach?',
        a: 'For a small patch of surface growth on non-porous tile or a shower surround, cleaning it yourself is reasonable, though [soap and water outperforms bleach on most surfaces](/faq/#is-bleach-useful), and bleach does essentially nothing on porous material because the water carries the chlorine away from where it needs to be. Once growth is on drywall, inside insulation, or in an air system, or once you are past roughly ten square feet, it is a containment problem and cleaning it yourself spreads it.',
      },
    ],
    related: ['hvac-air-conditioner-mold-remediation', 'black-mold-removal', 'water-damage-mold-cleanup'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'mold-inspection-testing',
    cta: {
      h2: 'If you need testing, we are the wrong company on purpose',
      body: 'We will tell you whether a sample is worth paying for and refer you to a licensed assessor to take it, because Florida does not let the firm that would remediate be the firm that measures.',
    },
    media: { image: 'moisture-meter', video: 'hero-moisture-meter', caption: 'A moisture reading means nothing without a reference reading from unaffected material of the same type.' },
    featured: true,
    nav: 'Inspection & Testing',
    navLong: 'Mold Inspection & Testing',
    h1: 'Mold Inspection and Testing in Broward & Palm Beach County',
    title: 'Mold Inspection & Testing | Broward & Palm Beach FL',
    description:
      'Mold inspection, moisture mapping, and air sampling for Broward and Palm Beach homes. Why Florida separates assessment from remediation to protect you.',
    eyebrow: 'Before the work',
    short: 'Moisture mapping, air and surface sampling, and a report that says what to do, not just what was found.',
    lede:
      'A useful mold inspection answers three questions: is there growth, where is the water coming from, and what specifically has to be done about it. A report that stops at the first question is not worth what you paid for it.',

    signals: [
      { value: '2 licenses', label: 'Florida licenses mold assessors and mold remediators separately. One company should not do both on the same property.' },
      { value: '2–5 days', label: 'Typical lab turnaround on spore trap and surface samples. Nobody can compress this.' },
      { value: '< 60% RH', label: 'The condition an inspection is really checking for. Sustained humidity above this line is the underlying problem in most South Florida homes.' },
    ],

    intro: [
      'Most people call for a mold test when what they actually need is a moisture investigation. Testing tells you what is in the air right now. It does not tell you where it came from, and it is the source that determines what the repair costs.',
      'So we lead with the building. Where is the water, how long has it been there, and what material did it reach. Sampling supports that picture, confirms a suspicion, or establishes a baseline for a clearance test later.',
    ],

    sections: [
      {
        h2: 'How Florida separates assessment from remediation',
        flag: true,
        body: [
          'Florida licenses mold assessors and mold remediators under two separate credentials, and it restricts the same company from doing both on the same structure. A remediator cannot write the assessment that scopes their own job, and an assessor cannot remediate a property they assessed.',
          'This is one of the more genuinely consumer-protective rules in the trade, because the conflict it prevents is obvious: a company that both diagnoses and treats has a financial reason to find more. When your clearance test comes from an independent assessor, the passing result actually means something.',
          'In practice it means that if we are going to remediate your home, we will refer you to independent assessors for the assessment and the clearance, and we will not take a referral fee for it. The assessment role is not ours to offer, and on a property we were remediating it could not be ours anyway.',
        ],
      },
      {
        h2: 'What a real inspection includes',
        list: [
          { term: 'Visual assessment of the whole envelope', text: 'Roof penetrations, window and door flashing, stucco cracking, plumbing walls, under-sink cabinets, the water heater, the washer box, and the AC closet. Growth follows water, so we look where water goes.' },
          { term: 'Moisture meter readings', text: 'Pin and pinless readings on suspect materials, compared against unaffected reference areas of the same material. A number without a baseline is not a finding.' },
          { term: 'Thermal imaging where it helps', text: 'Infrared does not see moisture. It sees temperature difference. Used correctly it finds evaporative cooling behind a wall in seconds. Used as a party trick it produces a colorful image and no information.' },
          { term: 'Humidity and dew point logging', text: 'A single spot reading tells you about that moment. In a house with a short-cycling AC, the interesting number is what the humidity does at 3am in August.' },
          { term: 'Air sampling with outdoor controls', text: 'Spore trap samples indoors are meaningless without a simultaneous outdoor control, because outdoor air is full of spores by design. The comparison is the data.' },
          { term: 'Surface and tape-lift sampling', text: 'For confirming that a visible stain is growth and identifying what it is, where that changes the approach.' },
          { term: 'A written scope', text: 'Findings, photographs, moisture readings, lab results, the probable moisture source, and a specific remediation protocol somebody else could bid from.' },
        ],
      },
      {
        h2: 'How to read the report you get back',
        note: 'Lab reports are written for the assessor, not for you. Here is what the numbers do and do not mean.',
        list: [
          {
            term: 'No result will say pass or fail',
            text: 'There is no federal or Florida legal threshold for airborne mold spores, so no laboratory can declare a number safe or unsafe. Anyone quoting you a limit is quoting a house rule, not a standard. What gets interpreted is a comparison, not an absolute.',
          },
          {
            term: 'The outdoor control is the whole point',
            text: 'Outdoor air is full of spores by design. That is normal and healthy. A useful indoor sample is always paired with a simultaneous outdoor one taken the same day in the same weather. Indoor counts meaningfully above that control, or a species mix that does not match it, is what indicates an interior source.',
          },
          {
            term: 'Species mix matters more than total count',
            text: 'A high total that mirrors the outdoor profile usually means somebody left a door open. A modest total dominated by a genus that is scarce outside is far more interesting, because something indoors is producing it.',
          },
          {
            term: 'Aspergillus/Penicillium is reported as one thing on purpose',
            text: 'Their spores are effectively indistinguishable under the light microscopy used on a spore trap, so labs report them together as a group. Seeing that name is not a finding in itself: it is among the most common groups in ordinary indoor and outdoor air.',
          },
          {
            term: 'A clean air sample does not rule out Stachybotrys',
            text: 'This one is counterintuitive and worth knowing. Stachybotrys spores are produced in a wet, sticky mass and do not aerosolize readily, so they frequently do not show up in air sampling even when there is growth on a surface a few feet away. A negative air result is not evidence that it is absent. Surface sampling is how that question gets answered.',
          },
          {
            term: 'Hyphal fragments and the raw-count column',
            text: 'Hyphal fragments indicate physically disturbed growth rather than the spores a colony released normally. And most reports show both a raw count and a calculated spores-per-cubic-meter; compare like with like across samples, because the two columns are not interchangeable.',
          },
        ],
      },
      {
        h2: 'Buying, selling, or renting',
        body: [
          'Transactions are the one situation where testing is almost always worth the cost, because the value is not the reading. It is having an independent document that neither party wrote.',
          'If you are buying: a standard home inspection is not a mold assessment, and most home inspectors say so in their own report. Worth commissioning separately on anything over roughly twenty years old, anything vacant or seasonally occupied, anything with a flat or low-slope roof, and anything showing staining at the air conditioning registers. The [dark ring around a ceiling vent](/services/black-mold-removal/) is the single most common thing we are asked to look at during a due-diligence window.',
          'If you are selling: knowing before the buyer does is strictly better. A finding you disclose and price is a negotiation; the same finding surfaced by their inspector three days before closing is a renegotiation, and it rarely goes your way.',
          'If you are a landlord or a tenant: get it documented by someone with no financial interest in the outcome. A licensed assessor produces a neutral record, which is a categorically different thing from either party asserting something. We would give both sides that same advice, and because Florida separates the two licenses we would refer the assessment out rather than perform it ourselves.',
        ],
      },
      {
        h2: 'When testing is worth it and when it is not',
        body: [
          'It is worth it when you have symptoms and no visible growth, when you need documentation for an insurance claim or a real estate transaction, when you are buying a house and want to know what you are buying, when a tenant or landlord dispute needs a neutral record, and always at clearance.',
          'It is generally not worth it when you can already see a large area of growth and know where the leak is. At that point the sample confirms something you already know and delays the work by a week. Spend the money on the remediation instead.',
        ],
      },
    ],

    faqs: [
      {
        q: 'Can you inspect and then remediate the same house?',
        a: 'No, and neither can anyone else in Florida. Assessment and remediation are separately licensed and the same company is restricted from performing both on the same structure. The distinction worth holding onto is what is being offered. A remediation company looking at your problem and writing you a scope is a sales call, and a normal one: it is what our own “request an inspection” button means. What should stop you is the other thing wearing the same word, a free mold assessment: sampling, a lab report, a written determination of how much there is, and then quoting to remove what it just determined. That is the conflict the two licenses exist to prevent.',
      },
      {
        q: 'Is a free mold inspection worth taking?',
        a: 'A free visual walkthrough from a remediation company is a sales call, and that is not automatically a bad thing. We do not do ours free. Ask what it costs when you call, and you will have the number before anyone books anything. What matters more is the difference between any walkthrough and a paid assessment from a licensed assessor, which is an independent document with sampling behind it.',
      },
      {
        q: 'What do the air sample numbers mean?',
        a: 'There is no federal or Florida legal threshold for airborne mold spores, so no lab result will say pass or fail on its own. What an assessor interprets is the relationship between indoor and outdoor counts and the species mix. Indoor counts substantially above the outdoor control, or indoor-dominant species that are not represented outside, is what indicates an interior source.',
      },
      {
        q: 'Should I test before buying a house in South Florida?',
        a: 'On anything matching the list above, yes. What that section does not say is when in the process to do it: before the inspection period closes, not after, because a finding during the window is a negotiating position and the same finding a month later is your problem. Sellers are usually better off commissioning it themselves first: it is the difference between disclosing a known condition with a scope attached and having a buyer discover an unknown one.',
      },
      {
        q: 'How long do lab results take?',
        a: 'Two to five business days for spore trap and surface samples, and nobody can compress it. The samples are cultured or read by a laboratory on their schedule, not ours. Anyone promising same-day results from a lab is either using a field screening device, which is a different and much less definitive thing, or they are not sending it to a lab. Budget for that gap if you are working to a due-diligence deadline.',
      },
      {
        q: 'The report says Aspergillus/Penicillium. Should I be worried?',
        a: 'Not by itself. As described above, that group is among the most common in ordinary air, indoors and out. What makes a spore trap result mean anything is the comparison: how the indoor count sits against an outdoor control taken the same day, and whether the indoor mix resembles the outdoor mix. A number with no same-day control beside it cannot be interpreted, and a report that does not include one is not finished.',
      },
    ],
    related: ['mold-remediation', 'hvac-air-conditioner-mold-remediation', 'black-mold-removal'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'air-duct-cleaning-sanitizing',
    cta: {
      h2: 'Not convinced the ducts are the problem?',
      body: 'Neither are we, most of the time. Describe the smell and when it happens and we will tell you whether this is a duct job, a coil job, or nothing at all.',
    },
    media: { image: 'duct-board-plenum', video: 'hero-duct-plenum', caption: 'The interior face of a fiberglass duct board plenum. Porous, fibrous, and not restorable by cleaning.' },
    featured: true,
    nav: 'Duct Cleaning',
    navLong: 'Air Duct Cleaning & Sanitizing',
    h1: 'Air Duct Cleaning and Sanitizing in Broward & Palm Beach County',
    title: 'Air Duct Cleaning & Sanitizing | Broward & Palm Beach',
    description:
      'NADCA source-removal air duct cleaning for Broward and Palm Beach homes. When it solves a mold problem, when it does not, and how to tell the difference.',
    eyebrow: 'System hygiene',
    short: 'Source removal to the NADCA standard, with an honest read on whether your ducts are actually the problem.',
    lede:
      'Duct cleaning is one of the most oversold services in this market. Done properly on a system that needs it, it makes a measurable difference. Sold as a $79 coupon and performed with a shop vac at the register, it is theater.',

    signals: [
      { value: 'ACR', label: 'The NADCA Assessment, Cleaning & Restoration standard. Source removal under continuous negative pressure.' },
      { value: 'Every run', label: 'Branch by branch, not just the trunk and the first few feet visible from the register.' },
      { value: '0 ozone', label: 'We do not use ozone generators in occupied buildings. They are a respiratory irritant and they do not remediate.' },
    ],

    intro: [
      'The honest version of this service starts with when not to buy it. If your ducts are clean, cleaning them again will not improve your air, will not lower your power bill by a meaningful amount, and will not fix a mold problem that lives at the coil.',
      'What duct cleaning does do, on a system that genuinely needs it, is remove the accumulated reservoir of dust, debris, construction residue, and microbial growth that the blower is otherwise recirculating through the house every cycle.',
    ],

    sections: [
      {
        h2: 'What source removal actually means',
        body: [
          'The NADCA standard is built on a simple principle: the entire system is held under continuous negative pressure while the interior surfaces are mechanically agitated, so the debris that gets loosened has nowhere to go except into the collection unit. We duct that unit to the exterior as well, which is a step beyond what the standard asks for.',
          'That is the whole distinction. Agitation without negative pressure moves the debris somewhere else in the system. Negative pressure without agitation collects only what was already loose. Doing both, run by run, is the job.',
        ],
        list: [
          { term: 'Whole-system containment', text: 'Registers sealed, collection unit connected at the plenum, system held under negative pressure for the duration.' },
          { term: 'Mechanical agitation', text: 'Rotary brushes and compressed-air whips sized to the duct, chosen for the material: a flex duct liner and a sheet metal trunk do not get the same tool.' },
          { term: 'Coil, blower, and cabinet', text: 'Included, because cleaning the ducts and skipping the equipment they connect to is the most common shortcut in the trade.' },
          { term: 'Register and grille cleaning', text: 'Removed and cleaned off the wall, not wiped in place.' },
          { term: 'Before and after documentation', text: 'Camera footage inside the runs. You should not have to take our word for it.' },
        ],
      },
      {
        h2: 'When your ducts are not the problem',
        flag: true,
        body: [
          'We turn down duct cleaning work regularly, and it is usually for one of these reasons.',
        ],
        list: [
          { term: 'The growth is at the coil', text: 'Cleaning the ducts leaves the source running upstream of everything you just paid to clean.' },
          { term: 'The plenum is colonized duct board', text: 'It has to be replaced. Cleaning porous fiberglass does not restore it, so a clean is money spent on a component that is coming out anyway.' },
          { term: 'The flex duct liner has growth through the interior surface', text: 'That run gets replaced rather than scrubbed. Agitating a colonized liner sheds it into the airstream.' },
          { term: 'There is simply nothing in the ducts', text: 'Some systems are genuinely clean, particularly newer construction with good filtration. We will tell you so, and charge you for the inspection rather than the cleaning.' },
        ],
      },
      {
        h2: 'What the day actually looks like',
        note: 'Nobody publishes this, and it is most of what people want to know before they book.',
        steps: [
          {
            title: 'We need access to every register in the house',
            text: 'Supply and return, including the ones behind furniture, inside closets, and in the garage. Moving a sofa is fine; what slows a job down is a bedroom nobody can get into or a register under a fitted wardrobe.',
            check: 'Walk the house the night before and count your vents. If you cannot reach one, we cannot either.',
          },
          {
            title: 'Three to five hours for a typical single-family house',
            text: 'Longer for a larger house, a second system, or a plenum that has to come apart. A crew promising ninety minutes is doing a register-level vacuum, not a source-removal clean.',
          },
          {
            title: 'It is loud, and the system is off',
            text: 'The collection unit runs continuously for the duration. The air conditioning is off while we work, which in August is worth planning around. Most people go out.',
          },
          {
            title: 'Pets somewhere else',
            text: 'Doors open, hoses running through the house, and a compressor. It is not dangerous, it is just a bad afternoon for an anxious animal.',
          },
          {
            title: 'Drop cloths, and registers cleaned off the wall',
            text: 'Grilles come off and get washed rather than wiped in place. The mess is contained but it is not invisible. There will be equipment through your hallway for the afternoon.',
          },
          {
            title: 'Before and after footage of the runs',
            text: 'Camera into the ducts at the start and at the end. You should not have to take anyone’s word for what was in there, and you should ask for it if it is not offered.',
            check: 'Ask which specific runs the footage is from. Two clips of the easiest branch is not documentation of a whole system.',
          },
        ],
      },
      {
        h2: 'The upsells you will be offered',
        flag: true,
        body: [
          'Duct cleaning is sold with a menu attached, and the honest position on each item is different. Here is ours.',
        ],
        list: [
          {
            term: 'A UV-C lamp at the coil: sometimes worth it',
            text: 'A correctly placed, correctly sized lamp aimed at the coil surface does inhibit growth on that coil, and there is real evidence behind it. It does not clean a coil that is already colonized, it does not sterilize ductwork, and the lamps need replacing annually to do anything at all. Reasonable as maintenance after remediation; not a substitute for it.',
          },
          {
            term: 'Electrostatic or high-MERV filters: depends on the system',
            text: 'A better filter catches more, and also restricts more airflow. Fitted to a system that was already marginal on static pressure, it makes the coil colder and the run times worse. Worth doing on equipment that can take it, worth checking first.',
          },
          {
            term: 'Antimicrobial fogging as an add-on: usually not',
            text: 'On porous [duct board](/services/hvac-air-conditioner-mold-remediation/), it is a deodorizer rather than a remediation.',
          },
          {
            term: 'Ozone generators: no',
            text: 'They will remove an odor. Ozone is also a lung irritant, is not approved for use in occupied spaces, and degrades rubber and elastomeric components in the system while it works. We do not use them and we would question anyone who does.',
          },
          {
            term: 'Dryer vent cleaning: yes, but for a different reason',
            text: 'Not an air quality measure. A lint-packed dryer duct is a genuine fire risk and it is cheap to clear while a crew is already in the house with the equipment. Worth taking; just understand what you are buying.',
          },
        ],
      },
      {
        h2: 'On sanitizing and antimicrobial fogging',
        body: [
          'We apply EPA-registered antimicrobials in ductwork only after cleaning, only on non-porous surfaces, and only when there is a reason to. Applied to a clean metal duct as a final step, it is a reasonable belt-and-suspenders measure. Applied to a dirty duct as the whole service, it is a deodorizer.',
        ],
      },
    ],

    faqs: [
      {
        q: 'How often should air ducts be cleaned in South Florida?',
        a: 'There is no calendar answer, and any company that gives you one is selling a schedule rather than assessing a system. The honest triggers are: visible debris or growth at the registers or in the plenum, a musty smell that tracks with the AC cycle, after a renovation or a re-roof, after a water loss involving the system, and when you move into a house whose history you do not know. In our climate, a system that has never been cleaned in fifteen years is usually worth looking at.',
      },
      {
        q: 'Will duct cleaning help my allergies?',
        a: 'It can, if there is a genuine reservoir in the system that the blower is recirculating. It will not help if your issue is outdoor pollen, dust mites in bedding, or a pet. We would rather tell you that up front than take the job and have you conclude that duct cleaning is a scam.',
      },
      {
        q: 'How long does it take, and do I need to be home?',
        a: 'Three to five hours for a typical single-family house with one system, longer for a second system or a plenum that has to come apart. Somebody needs to let us in and be reachable, but most people go out. The collection unit runs the whole time and the air conditioning is off while we work, which in summer is worth planning around. We need access to every supply and return register, including the awkward ones.',
      },
      {
        q: 'Should we add a UV light while you are in there?',
        a: 'A fair thing to consider and a poor thing to be sold in a panic. The limits are set out above; what decides it for you is sequence. A lamp is maintenance for a coil that is already clean, so on a coil that is currently colonized it is the last step rather than the first, and anyone offering one instead of the cleaning has the order backwards. Budget for the annual lamp replacement or do not fit it at all.',
      },
      {
        q: 'Why are the $99 duct cleaning coupons so cheap?',
        a: 'Because the price is a lead cost, not a service cost. Real source-removal cleaning takes a crew several hours with a truck-mounted or portable negative-air collection unit and per-run agitation. The coupon version is a register-level vacuum and an upsell conversation in your living room. Neither of those is a moral judgment. Just know which one you are buying.',
      },
    ],
    related: ['hvac-air-conditioner-mold-remediation', 'mold-remediation', 'mold-inspection-testing'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'black-mold-removal',
    cta: {
      h2: 'Send a photograph before you assume the worst',
      body: 'Color tells you very little and nobody can identify a species by eye, ourselves included. What we can tell you from a photograph and a few questions is whether what you are looking at needs containment or a cloth.',
    },
    media: { image: 'register-stain', video: 'hero-register-stain', caption: 'The stained ring around a ceiling register, the single most photographed thing homeowners send us.' },
    featured: false,
    nav: 'Black Mold',
    navLong: 'Black Mold Removal',
    h1: 'Black Mold Removal in Broward and Palm Beach County',
    title: 'Black Mold Removal | Broward & Palm Beach County FL',
    description:
      'Black mold removal across Broward and Palm Beach County. What black mold actually is, why the color does not identify the species, and how the removal is done.',
    eyebrow: 'The one everybody searches for',
    short: 'What people call black mold, what it usually is, and why the protocol is the same either way.',
    lede:
      'Black mold is a phrase people search when they are frightened, and the industry has not been especially responsible about that. Here is the straight version.',

    signals: [
      { value: '100k+', label: 'Described mold species. Roughly a few dozen turn up routinely in South Florida buildings.' },
      { value: 'Not by eye', label: 'Whether dark growth is Stachybotrys. Color and pattern do not identify species. That takes a sample and a lab. Cladosporium and Aspergillus are far more common findings.' },
      { value: 'Same', label: 'The remediation protocol, regardless of species. Colonized porous material comes out either way.' },
    ],

    intro: [
      'Toxic black mold is not a scientific category. The term usually points at Stachybotrys chartarum, a genuinely unpleasant species that produces mycotoxins and needs sustained wetting (days of it, on cellulose) to establish.',
      'The trouble is that color does not identify species. Cladosporium is often black or very dark olive. Several Aspergillus species look black. Even ordinary shower mildew reads black to the eye. You cannot look at a stain, including in a photograph, and know what it is.',
    ],

    sections: [
      {
        h2: 'Why the species usually does not change the job',
        body: [
          'This is the part that surprises people. Whether a lab comes back with Stachybotrys or Cladosporium, the remediation protocol is substantially the same: contain the area, put it under negative pressure, remove the colonized porous material, clean the semi-porous and non-porous surfaces, fix the water, verify with an independent clearance test.',
          'The reason is that the standard treats mold as mold. You are not supposed to be breathing any of it in quantity, the removal method for colonized drywall does not vary by genus, and no responsible remediator handles a Cladosporium job with less containment because it scored lower on a fear scale.',
          'Where species does matter is in medical conversations, in litigation, and occasionally in scoping: a Stachybotrys finding tells you the material was wet for a long time, which changes where you look for the leak.',
        ],
      },
      {
        h2: 'Where dark growth shows up in South Florida homes',
        list: [
          { term: 'Ceiling rings around AC supply registers', text: 'Condensation at the boot. Extremely common here and one of the top reasons people call us.' },
          { term: 'Drywall behind and under bathroom vanities', text: 'Slow supply-line or drain weeping that nobody sees for two years.' },
          { term: 'The bottom four inches of exterior walls', text: 'Wicking through the slab or stucco, particularly in older CBS construction east of US-1 and on waterfront lots.' },
          { term: 'Window and slider surrounds', text: 'Failed sealant on an impact-window retrofit is a leading cause in post-2005 renovations.' },
          { term: 'Closet walls sharing a wet wall or an AC chase', text: 'Poor air circulation plus a cool surface. Closets on exterior corners are the classic.' },
          { term: 'Under the air handler platform', text: 'A pan that has overflowed repeatedly. Often discovered only when the ceiling below it stains.' },
        ],
      },
      {
        h2: 'What to do between finding it and getting it looked at',
        note: 'Usually a day or two. What you do in it matters more than people expect.',
        steps: [
          {
            title: 'Do not disturb it',
            text: 'No scrubbing, no wire brush, no sanding, no vacuuming with a household vacuum. Every one of those aerosolizes far more spore material than leaving it alone does, and a household vacuum without a HEPA filter takes it in one side and distributes it out the other.',
            check: 'If you have already scrubbed at it, say so when you call. It changes what we expect to find in the air, not just on the wall.',
          },
          {
            title: 'If it is near an air conditioning vent, switch the system off',
            text: 'A running blower turns a contained problem into a distributed one. This is the single most consequential thing on the list, and it is free. See [HVAC and AC mold remediation](/services/hvac-air-conditioner-mold-remediation/) for why the equipment is usually where this starts.',
            check: 'Off at the thermostat is enough. You do not need to kill the breaker.',
          },
          {
            title: 'Photograph it before anything changes',
            text: 'Wide shot of the room, then close-ups, then anything wet nearby. If an insurance claim is even possible, this is what it will be built on, and it cannot be recreated after cleanup.',
          },
          {
            title: 'Spotting a paint-over somebody already did',
        text: 'Look for a patch of newer, flatter paint on one wall of an older room, often just above the baseboard, or ringing a supply register. In raking light the seam between the old and new coats usually shows, and the newer patch is often slightly proud of the wall where it was rolled over a repair. The FAQ below spends a whole answer on why primers get used this way.',
          },
          {
            title: 'Find the water, if you can do it without opening anything',
            text: 'Look directly above and behind. A supply line, a window, a roof penetration, a condensate line, an AC closet. You do not need to fix it yet, but knowing where it came from changes the scope more than knowing what species it is.',
          },
          {
            title: 'Keep people out of the room if anyone is vulnerable',
            text: 'Close the door and stop using the room if someone in the house is immunocompromised, pregnant, undergoing treatment, or has significant asthma. For everyone else, a couple of days in a house with a contained patch of growth is not the emergency the internet will tell you it is.',
          },
        ],
      },
      {
        h2: 'What the removal actually involves',
        body: [
          'Since the protocol does not vary by species, what happens next is ordinary mold remediation:',
          'The full sequence, with what to check at each stage so you can verify somebody is actually doing it, is on [our process page](/process/). If you are holding several quotes and they do not resemble each other, [how to compare three mold remediation quotes](/guides/comparing-mold-remediation-quotes/) explains why that happens and what a comparable scope has to state.',
          'What does change with a Stachybotrys finding is not the method but the investigation. That organism needs sustained wetting on cellulose (days of it, not hours), so finding it tells you the material was wet for a long time, and that sends us looking harder for a slow, chronic water source rather than a recent event.',
        ],
        list: [
          { term: 'Containment', text: 'Sealed to floor, walls and ceiling, with a decontamination chamber on anything beyond a small isolated area.' },
          { term: 'Negative pressure', text: 'HEPA-filtered air machines holding the work zone below the pressure of the rest of the house, so leakage runs inward.' },
          { term: 'Source removal', text: 'Colonized porous material cut out and bagged inside the containment.' },
          { term: 'Detail cleaning', text: 'HEPA vacuum and damp wipe of every surface inside the containment, including the ones that look clean.' },
          { term: 'Drying to standard', text: 'Where anything is still wet, to a documented moisture content rather than to a number of days.' },
          { term: 'Independent clearance', text: 'A third-party licensed assessor tests before the plastic comes down.' },
        ],
      },
      {
        h2: 'What we will not tell you',
        flag: true,
        body: [
          'We will not tell you black mold is making you sick, because we are a remediation company and that is a medical determination. The published research on mold and health is genuinely mixed outside of a few well-established effects: allergic response, asthma exacerbation, and serious risk to immunocompromised people. If you have symptoms, that is a conversation with a physician, ideally one who will look at your specific history rather than a lab report.',
          'What we can tell you is what is growing in your building, where the water is coming from, and what it takes to remove it. That part is a building science question, and it is ours.',
        ],
      },
    ],

    faqs: [
      {
        q: 'How do I know if it is black mold?',
        a: 'You do not, by looking. Neither do we, and neither does anyone who tells you otherwise from a photo. Identification requires a sample and a lab. What we can tell from a visual is whether the growth pattern and the moisture readings indicate a long-term wetting condition, which is the circumstance Stachybotrys needs.',
      },
      {
        q: 'Is black mold more dangerous than other mold?',
        a: 'Stachybotrys and a handful of other species produce mycotoxins, which most common indoor molds do not, and that is a real biological difference. Whether it translates into meaningfully different risk at the exposure levels found in a house is genuinely debated in the literature, and anyone in our trade who tells you they know the answer with certainty has gone past what they know. The practical guidance from the CDC and EPA does not vary by species: do not live with indoor mold, remove it properly, and fix the water.',
      },
      {
        q: 'Can I paint over it or use a mold-killing primer?',
        a: 'No. Encapsulating primers exist and have legitimate uses on cleaned, dried, non-porous or structurally sound semi-porous surfaces after remediation. Painting over active growth on drywall traps it, keeps the moisture in, and hides the evidence until it comes through the new paint. It is the single most common thing we find during pre-purchase inspections.',
      },
      {
        q: 'Should I pay to have it tested to find out whether it is Stachybotrys?',
        a: 'Usually not, if the goal is deciding what work to do. The remediation protocol does not change by species, so a lab result naming something frightening should not change your scope or your price. Where testing genuinely earns its cost is when you need an independent record: an insurance claim, a real estate transaction, a landlord or association dispute, or a medical conversation where a physician has asked for it. In Florida that testing comes from an independent mold assessor rather than from the company doing the removal. See [mold inspection and testing](/services/mold-inspection-testing/) for how that separation works and why it protects you.',
      },
      {
        q: 'What about mycotoxins?',
        a: 'Not something we test for, and not something we would take your money to test for. Air and surface sampling identifies what is growing in a building; it does not measure what anyone in that building has been exposed to, and those two get conflated in a lot of marketing. If the real question is medical (somebody in the house is unwell and you want to know whether the building is the reason), that belongs with a physician, and if it goes further, with an industrial hygienist. It does not belong with the contractor who stands to be paid for the removal. Our part is the building: find the water, take out the material, and have somebody independent confirm it is done.',
      },
      {
        q: 'It is in a rental. What are my options?',
        a: 'Get it documented by someone with no financial interest in the outcome: a licensed mold assessor produces a neutral report, which is a different thing from either you or your landlord asserting something. Photograph it and put your notice to the landlord in writing with a date, because a paper trail is what makes anything else possible later. We would give a landlord the same advice; an independent assessment protects whichever side is telling the truth.',
      },
    ],
    related: ['mold-remediation', 'mold-inspection-testing', 'water-damage-mold-cleanup'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'water-damage-mold-cleanup',
    cta: {
      h2: 'How long has it been wet?',
      body: 'That answer decides whether this is drying or removal, and it changes by the day rather than the week. If it is still wet, call rather than write.',
    },
    media: { image: 'structural-drying', video: 'hero-drying', caption: 'Drying to a documented standard: equipment running, material opened, readings logged daily.' },
    featured: false,
    nav: 'Water Damage',
    navLong: 'Water Damage & Mold Cleanup',
    h1: 'Water Damage and Mold Cleanup in Broward & Palm Beach County',
    title: 'Water Damage & Mold Cleanup | Broward & Palm Beach FL',
    description:
      'Emergency water extraction, structural drying, and mold cleanup for Broward and Palm Beach County. The 24 to 48 hour window and why drying to standard matters.',
    eyebrow: 'Time-sensitive',
    short: 'Extraction, structural drying to a documented standard, and cleanup once the window has closed.',
    lede:
      'The gap between a water loss and a mold job is about two days. What happens in those two days decides which one you are paying for.',

    signals: [
      { value: '24–48 hrs', label: 'From wetting to the start of growth on organic material at South Florida temperatures.' },
      { value: '3 categories', label: 'Clean, gray, and black water. The category sets what can be dried and what has to be removed.' },
      { value: 'Documented', label: 'Daily moisture content readings until the material reaches a dry standard, not until the fans have been out for three days.' },
    ],

    intro: [
      'Water damage in this climate behaves differently than it does anywhere north of here. Ambient humidity is already high, so the drying gradient is weak, and ambient temperature is high, so biological activity starts fast. A wall cavity that would take a week to become a mold problem in a dry climate becomes one here over a long weekend.',
      'That is why response time genuinely matters on these calls, and it is why we are honest about it when it is already too late for drying alone. The two-day figure is not ours either: [the EPA puts the same window on drying out a flooded house](https://www.epa.gov/indoor-air-quality-iaq/flood-cleanup-protect-indoor-air-quality), and says plainly that things left wet beyond it usually get moldy.',
    ],

    sections: [
      {
        h2: 'What causes it here',
        list: [
          { term: 'AC condensate overflow', text: 'A clogged drain line backs up, the pan overflows, and it comes through the ceiling below. The most common water loss we see in South Florida, and it connects directly to the HVAC mold work we specialize in.' },
          { term: 'Supply line and water heater failures', text: 'Braided supply lines under sinks and at toilets fail without warning. A water heater at end of life will empty its tank into the floor it sits on.' },
          { term: 'Roof intrusion after a storm', text: 'Flat and low-slope roofs on the older condo and commercial stock, tile roof valley failures, and lifted underlayment after a tropical system.' },
          { term: 'Window and slider failures', text: 'Wind-driven rain finding a path through failed sealant. It rarely shows at the window. It shows at the base of the wall six feet away.' },
          { term: 'Washer and dishwasher supply failures', text: 'Usually discovered late because the cabinet or the pan hides the first several days of it.' },
          { term: 'Sewage backups', text: 'Category 3 water. Nothing porous that it touched gets dried and kept. This is not negotiable and it is not us upselling.' },
        ],
      },
      {
        h2: 'Extraction and structural drying',
        steps: [
          { title: 'Stop the source and make it safe', text: 'Water off, power evaluated, and a decision on whether the material is Category 1, 2, or 3 before anyone starts moving equipment.' },
          { title: 'Extract standing water', text: 'Every gallon removed mechanically is a gallon you are not paying to evaporate. Weighted extraction on carpet and pad, where the pad is salvageable at all.' },
          { title: 'Open what has to be opened', text: 'Baseboard removal, controlled wall cavity ventilation, and cabinet toe-kick access. Wall cavities do not dry through drywall in this humidity.' },
          { title: 'Set the drying system', text: 'Air movers for evaporation, LGR dehumidifiers for capacity, sized to the affected cubic footage. In our climate the dehumidification side is what does the work, not the fans.' },
          { title: 'Monitor and document daily', text: 'Moisture content readings on affected materials and on unaffected reference material, recorded every day, until the numbers meet a defined dry standard.' },
          { title: 'Reassess for growth', text: 'If the loss is older than about two days, or if it was Category 2 or 3, we assess for microbial growth before we close anything up, and we scope remediation rather than pretending drying was enough.' },
        ],
      },
      {
        h2: 'What happens to your things',
        note: 'The question people ask second, after “is my house alright”.',
        list: [
          {
            term: 'Upholstered furniture and mattresses',
            text: 'Salvageable from clean water if it is dried quickly. From gray or black water, a mattress goes and upholstery usually does too: the foam and batting cannot be cleaned through, and drying contaminated padding just locks it in.',
          },
          {
            term: 'Rugs and carpet pad',
            text: 'Area rugs can often be taken out, dried flat and cleaned off site. The pad under fitted carpet is cheap and holds water like a sponge; it is nearly always replaced even when the carpet above it is kept.',
          },
          {
            term: 'Wood furniture',
            text: 'Get the legs up off wet flooring within the first hour. That is where the permanent damage happens, and it happens to the floor as much as the furniture. Solid wood usually survives; particle board and MDF swell and do not come back.',
          },
          {
            term: 'Documents, photographs and books',
            text: 'Time-critical and genuinely recoverable. Paper can be frozen to stop the clock, which buys weeks to decide. If something is irreplaceable, bag it and freeze it before you deal with anything else in the room.',
          },
          {
            term: 'Electronics',
            text: 'Do not power anything on to test it. Corrosion from a wetting event develops over days, so a device that works on day one can fail on day ten, and turning it on wet is how you turn a maybe into a certainty.',
          },
          {
            term: 'Anything you cannot replace',
            text: 'Tell us on the first call, before the crew arrives. Priorities change what gets moved first, and there is no way to reconstruct that decision afterwards.',
          },
        ],
      },
      {
        h2: 'Living with the equipment',
        note: 'Three to five days in most houses. It is not a quiet process.',
        steps: [
          {
            title: 'The equipment runs continuously, including overnight',
            text: 'Air movers and dehumidifiers work by maintaining a constant gradient. Switching them off at night does not pause the drying. It lets the material re-absorb moisture from the air, and the next day is spent recovering ground you already paid for.',
            check: 'If the noise is genuinely unbearable in a bedroom, ask us to re-position rather than switching anything off.',
          },
          {
            title: 'The house will be warm',
            text: 'Refrigerant dehumidifiers put heat back into the space. That is how they work. Expect the affected rooms to run several degrees warmer than usual for the duration.',
          },
          {
            title: 'It uses meaningful electricity',
            text: 'A drying setup is one of the larger loads you will ever run at home. It is a real cost, it is usually a claimable one, and it is far smaller than the cost of an incomplete dry.',
            check: 'Photograph the equipment and note the days it ran. Adjusters ask, and it is easier to record than reconstruct.',
          },
          {
            title: 'We come back and read the materials, not the calendar',
      text: 'The log is the deliverable, not paperwork around the deliverable. An adjuster reads it, a buyer inspector may ask for it years afterwards, and it is the only thing that demonstrates the material actually reached a dry standard instead of simply having had equipment running near it for a while.',
            check: 'Ask for the daily log. If nobody is taking readings, nobody knows whether it is dry.',
          },
        ],
      },
      {
        h2: 'Drying to standard versus running fans',
        flag: true,
        body: [
          'There is a version of this service where a company drops six air movers in a room, comes back in three days, picks them up, and invoices. The floor feels dry. The wall cavity is not.',
          'Drying to standard means a documented moisture content target for each material, verified against unaffected reference readings in the same building, with daily logs. It is the difference between a claim that closes and a mold remediation six weeks later that the insurer denies because the drying was never documented.',
        ],
      },
    ],

    faqs: [
      {
        q: 'It has been a week since the leak. Is it too late to just dry it?',
        a: 'Usually, yes. In South Florida conditions, a week of wet organic material almost always means growth has started, whether or not you can see it. Drying it at that point locks the growth in behind a dry surface. We will take moisture readings and look before we tell you that, but you should expect the answer.',
      },
      {
        q: 'My ceiling stained from the AC overflowing. Do I need remediation or just a repair?',
        a: 'That depends on how long the pan was overflowing and what the material above the ceiling is. A single recent overflow onto drywall that is still stiff and reads dry may just be a repair. Repeated overflow, sagging drywall, or wet insulation is a remediation. We also want to look at the air handler while we are there, because a pan that overflowed usually means a clogged drain line, and a clogged drain line often means a coil that needs attention.',
      },
      {
        q: 'Should I file an insurance claim?',
        a: 'For a sudden, accidental discharge (a supply line, a water heater, a condensate overflow), usually yes, and the documentation from day one is what determines how it goes. For gradual seepage or long-term humidity, most Florida policies exclude it and filing may cost you more in the long run than it recovers. We document conditions either way and we will not pressure you toward a claim to make our invoice easier.',
      },
      {
        q: 'Can I turn the fans off at night?',
        a: 'We would rather you did not, and it is worth understanding why. Drying works by holding a constant gradient between wet material and drier air. Switch the equipment off for eight hours and the material re-absorbs moisture from the room, so the following day is spent recovering ground you already paid for. It genuinely extends the job rather than pausing it. If the noise is unbearable in a bedroom, call us and we will re-position rather than shut down.',
      },
      {
        q: 'What does it cost to run all that equipment?',
        a: 'It is one of the larger electrical loads you will ever run at home, and for three to five days that is a real number. It is also usually claimable, and it is a fraction of what an incomplete dry costs: a wall cavity that was never brought to a dry standard becomes a remediation six weeks later, which is a different order of expense. Photograph the equipment and note the days it ran; adjusters ask.',
      },
      {
        q: 'It is 9pm and water is coming in right now. What do I do first?',
        a: 'Stop the source if you can reach it, kill power to any area with standing water near outlets, and stay out from under a bulging ceiling: saturated drywall comes down as a sheet and without warning. Then photograph everything before you move anything, because that is what a claim gets built on and it cannot be recreated once cleanup starts. [The first 48 hours after water gets into your house](/guides/first-48-hours-after-water-damage/) is the full version, written to be read while it is happening.',
      },
    ],
    related: ['mold-remediation', 'hvac-air-conditioner-mold-remediation', 'black-mold-removal'],
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
export const featuredServices = services.filter((s) => s.featured);

export default services;
