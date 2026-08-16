/**
 * SERVICE AREA PAGES
 *
 * One entry per /service-areas/<slug>/ page.
 *
 * The single biggest mistake in local SEO builds is generating ten city pages
 * from one template with the city name swapped in. Google has been discounting
 * that pattern for years, and more importantly it does not convert — a Boca
 * homeowner can tell within one paragraph whether you have actually worked in
 * Boca.
 *
 * So every entry below has genuinely different content: different housing
 * stock, different failure modes, different neighborhoods, different FAQs.
 * Keep it that way when you add cities. If you cannot write three specific
 * paragraphs about a city, do not make a page for it — add it to the coverage
 * list on /service-areas/ instead.
 */

export const areas = [
  // ══ BROWARD COUNTY ═════════════════════════════════════════════════════════
  {
    slug: 'fort-lauderdale',
    media: { image: 'broward-street' },
    name: 'Fort Lauderdale',
    county: 'Broward',
    title: 'Mold Remediation Fort Lauderdale FL | AC & Air Handler',
    description:
      'Mold remediation and HVAC mold removal in Fort Lauderdale. Victoria Park, Rio Vista, Coral Ridge, Las Olas Isles, Sailboat Bend.',
    lede:
      'Fort Lauderdale has two mold problems and they are not the same problem: the water table east of Federal, and mid-century houses running modern air conditioning through undersized returns.',
    short: 'Two problems, not one: the water table east of Federal, and mid-century houses on undersized returns.',
    intro: [
      'The housing stock east of US-1 is largely concrete block and stucco built between the late 1940s and the mid 1960s — terrazzo floors, low slabs, and originally no central air at all. Those houses were designed to breathe. Jalousie windows, cross ventilation, and high ceilings did the humidity management, and they did it reasonably well.',
      'Then the jalousies got replaced with impact glass, the house got tightened up, and central air went in wherever there was room for it. What you end up with in Victoria Park or Poinciana Park is a sealed envelope, a slab that was never vapor-sealed sitting a few feet above the water table, and an [air handler](/services/hvac-air-conditioner-mold-remediation/) in an interior closet with a return that is undersized for the equipment.',
      'On the Isles and along the New River the water table story gets more direct. Slab moisture, seawall-adjacent capillary action, and salt air corroding coils on the beach side of Coral Ridge and Lauderdale Beach. We do a lot of work between Sunrise and Oakland Park east of Federal, and it is rarely a dramatic leak — it is a house sitting at 66% relative humidity for eight months.',
    ],
    watchHeadline: 'What we see most often in Fort Lauderdale',
    watch: [
      { term: 'Short-cycling oversized systems', text: 'A four-ton replacement in a house that needed three. The thermostat is satisfied in six minutes, the coil never runs long enough to pull latent heat, and the house is cold and damp at the same time.' },
      { term: 'Interior-closet air handlers with platform returns', text: 'Very common in the 1950s and 60s stock. If the platform cavity is unsealed it draws air from under the house or out of the wall assembly on every cycle.' },
      { term: 'Slab wicking in the bottom of exterior walls', text: 'The lower four inches of drywall on a block wall, especially on the north and east elevations and in closets on exterior corners.' },
      { term: 'Coil corrosion on the beach side', text: 'Salt air east of the Intracoastal eats aluminum fins. A pitted, corroded coil holds moisture and debris differently than a clean one.' },
      { term: 'Terrazzo and tile trapping moisture', text: 'A vapor-open slab under a vapor-closed floor covering added in a 2010s renovation pushes the moisture sideways into the wall base.' },
          { term: 'Short-term rental turnover', text: 'A large share of the east-side housing stock is rented by the week. Between guests the air conditioning gets set high or switched off, and wet towels and linens are frequently left in a closed house. It is seasonal vacancy compressed into a three-day cycle.' },
    ],
    neighborhoods: [
      'Victoria Park', 'Rio Vista', 'Coral Ridge', 'Las Olas Isles', 'Sailboat Bend',
      'Poinciana Park', 'Colee Hammock', 'Harbordale', 'Lauderdale Beach', 'Croissant Park',
      'Riverside Park', 'Tarpon River', 'Dorsey-Riverbend', 'Melrose Park', 'Edgewood',
    ],
    zips: ['33301', '33304', '33305', '33306', '33308', '33311', '33312', '33315', '33316'],
    nearby: ['pompano-beach', 'hollywood', 'pembroke-pines'],
    faqs: [
      {
        q: 'Why is my Fort Lauderdale house humid even with the AC running constantly?',
        a: 'Running constantly is usually the tell that something else is wrong, but the classic version of this is the opposite: a system that is too large, satisfies the thermostat fast, and shuts off. Dehumidification is a function of run time. A correctly sized system running longer cycles at lower capacity removes far more water than an oversized one blasting for six minutes. In older east-side houses we also frequently find an unsealed return pulling humid air into the system from outside the conditioned envelope.',
      },
      {
        q: 'Do waterfront homes on the Isles have worse mold problems?',
        a: 'Different, not automatically worse. The water table is high enough that slab moisture is a real factor, and salt air is hard on equipment. But the finger-isle homes are also frequently well maintained and heavily renovated. What we see there is more often a renovation detail — a vapor-closed floor over a vapor-open slab, or an impact window retrofit with a sealant failure — than general neglect.',
      },
      {
        q: 'Can you work in a Victoria Park historic home without tearing it apart?',
        a: 'Yes. Containment is designed to be surgical, and on plaster and original millwork the approach is different than on modern drywall — more cleaning of semi-porous material, less demolition. We will tell you before we start what has to come out and what can be saved, and we would rather over-communicate on a house somebody has spent years restoring.',
      },
          {
        q: 'We rent the house out short-term. What should the air conditioning be left at between guests?',
        a: 'Set a humidity target rather than a temperature — around 55% RH — and leave it there permanently rather than adjusting it per booking. The turnover gap is short but it repeats fifty times a year, and a house that spends every changeover at 70% humidity accumulates the same result as one closed for a season. Also worth telling your cleaner to run the bath fans and not to leave linens in a closed washer.',
      },
    ],
  },

  {
    slug: 'plantation',
    /** Shares `country-club` with Boca Raton — the two sit in different county
     *  grids, and `focus` shifts the crop so they do not read as one photo
     *  used twice. Replace with real Plantation photography when you have it. */
    media: { image: 'country-club', focus: '30% 60%' },
    name: 'Plantation',
    county: 'Broward',
    title: 'Mold Remediation Plantation FL | Acres & Jacaranda',
    description:
      'Mold remediation in Plantation FL. Plantation Acres, Jacaranda, Hawaiian Gardens, Historic District. Well-water properties and 1970s golf-community ductwork.',
    lede:
      'Plantation is really three towns. A 1960s CBS grid on the east side, a 1970s golf community in the middle, and one-acre well-and-septic properties out past Flamingo — and they fail in three different ways.',
    short: 'Three towns in one — a 1960s CBS grid, a 1970s golf community, and well-and-septic acreage out west.',
    intro: [
      'Plantation was one of the first master-planned communities in west Broward, and you can still read that history in the housing. East of University Drive the stock is 1950s and 60s concrete block on a conventional grid — terrazzo floors, low slabs, jalousies long since replaced with impact glass, and air handlers wedged into interior closets that were never designed to hold one.',
      'The middle of the city is Jacaranda: a 1970s and 80s golf-course community of two-story homes with mature landscaping and, in a great many cases, the original fiberglass [duct board](/services/air-duct-cleaning-sanitizing/) plenum still in service. Forty-plus years is a long time for a porous material in this climate, and it is the single most common thing we end up replacing here.',
      'Then there is Plantation Acres, west of Flamingo Road — one-acre-plus lots, horse-friendly zoning, and a large number of properties on well water and septic rather than city utilities. That last detail changes the problem enough that it gets its own answers below.',
    ],
    watchHeadline: 'What we see most often in Plantation',
    watch: [
      { term: 'Original duct board in Jacaranda', text: 'Homes that have never had the plenum replaced are running porous fiberglass that went in during the Carter administration. Once the mat is colonized there is no cleaning process that restores it.' },
      { term: 'Sweating supply lines in Acres wall cavities', text: 'Well water comes out of the ground cold. An uninsulated cold line running through a warm wall cavity condenses on itself, and the first sign is usually a damp baseboard with no visible leak anywhere.' },
      { term: 'Iron and sulfur staining mistaken for mold', text: 'Well water high in iron leaves orange-brown staining on fixtures, in toilet tanks, and around any slow drip. It is not growth, it does not need remediation, and we would rather tell you that than sell you something.' },
      { term: 'Multi-zone systems with a dead zone', text: 'The larger Acres houses often run two or three systems. A wing that rarely calls for cooling never dehumidifies, no matter what the hallway thermostat says.' },
      { term: 'Added-on Florida rooms and carport enclosures', text: 'Very common on the east-side stock. The flashing where a later addition meets the original roofline is where the water gets in.' },
      { term: 'Interior-closet air handlers on the 1960s grid', text: 'Undersized returns, high static pressure, and a coil sitting in a sealed closet inches from a bedroom wall.' },
    ],
    neighborhoods: [
      'Plantation Acres', 'Jacaranda', 'Jacaranda Lakes', 'Plantation Isles', 'Hawaiian Gardens',
      'Lauderdale West', 'Plantation Gardens', 'Central Park', 'Historic District', 'Sunset Strip',
      'Melaleuca Gardens', 'Rolling Oaks', 'Plantation Park',
    ],
    zips: ['33313', '33317', '33322', '33323', '33324', '33325', '33388'],
    nearby: ['fort-lauderdale', 'coral-springs', 'pembroke-pines'],
    faqs: [
      {
        q: 'We are on well water in Plantation Acres. Does that change anything?',
        a: 'It changes two things. Well water is cold coming out of the ground, so uninsulated supply lines running through warm wall cavities sweat — we find damp wall bases in Acres homes with no leak anywhere in the plumbing. And high iron content leaves orange-brown staining that gets mistaken for mold constantly. Neither is a remediation job. Both are worth identifying correctly before anyone quotes you.',
      },
      {
        q: 'The stain in our house is orange-brown, not black. Is it mold?',
        a: 'On a well-water property, probably not. Iron staining is orange to rust-brown, it appears around fixtures, drips and drains rather than on cool exterior wall surfaces, and it does not have an odor. Growth is more often dark gray, olive or black, follows moisture rather than plumbing, and usually smells. If you cannot tell, send a photo before you pay anyone to look at it.',
      },
      {
        q: 'Our Jacaranda house still has the original ductwork. Should we be worried?',
        a: 'Worth having looked at, yes. Duct board from that era is bonded fiberglass with an exposed interior fiber mat — porous by construction, so dust and moisture get into it rather than sitting on it. Plenty of them are still sound. But forty years is a long service life for a porous material in a subtropical attic, and it is the component we most often find is the actual source when a Jacaranda homeowner calls about a smell.',
      },
      {
        q: 'Do you work on barns and outbuildings out in the Acres?',
        a: 'Yes. Detached structures with their own small air conditioning, tack and feed storage, and guest or staff quarters over a garage are all things we deal with regularly. They tend to be the least monitored buildings on a property, which is usually why they are the ones with the problem.',
      },
    ],
  },

  {
    slug: 'miramar',
    /** Shares `lake-lot-homes` with Pembroke Pines. Those two cities genuinely
     *  are the same housing profile — adjacent, both drained wetland, both
     *  1990s+ lake-lot master-planned — so the photo is honest for each.
     *  Placed early in the array so the two never land adjacent in the grid. */
    media: { image: 'lake-lot-homes', focus: '20% 65%' },
    name: 'Miramar',
    county: 'Broward',
    title: 'Mold Remediation Miramar FL | East & West Miramar',
    description:
      'Mold remediation in Miramar FL. Miramar Lakes, Sunset Lakes, Monarch Lakes, Historic Miramar. Attached townhomes, high water table and 1950s east-side stock.',
    lede:
      'Miramar is two cities laid end to end. A 1950s postwar grid at the Miami-Dade line, and fifteen miles west of it, lake-lot subdivisions that were wetland thirty years ago.',
    short: 'Two cities end to end: a 1950s postwar grid, and lake-lot subdivisions built on former wetland.',
    intro: [
      'The original Miramar sits east of Palm Avenue and dates from the mid 1950s — modest concrete block ranches on a conventional grid, some of the earliest postwar development in south Broward, and the only part of our service area that runs right up against the Miami-Dade line. Terrazzo, low slabs, jalousies replaced with impact glass decades later, and central air added to houses that were never designed around it.',
      'West of Flamingo Road the city is barely thirty years old. Miramar Lakes, Sunset Lakes, Monarch Lakes, Riviera Isles and Silver Shores were built on drained wetland from the 1990s onward, on a water table high enough to matter at the slab edge, with the tight modern envelopes that make dehumidification a mechanical problem rather than an accidental one.',
      'The west side also carries more attached housing than anywhere else we work — townhome and villa product at real density. A shared wall assembly means a leak is rarely a private matter: water entering at one unit’s window or roofline travels along the assembly, and the household that finds the stain is often not the household with the problem.',
    ],
    watchHeadline: 'What we see most often in Miramar',
    watch: [
      { term: 'Shared wall assemblies in townhomes and villas', text: 'Water entering at one unit tracks along the party wall or the shared roofline. Scoping this properly means looking at both sides, which is a conversation with a neighbor before it is a conversation with a contractor.' },
      { term: 'Tight west-side envelopes with oversized equipment', text: 'The standard newer-construction problem: the house cannot leak its moisture out, and a short-cycling system never runs long enough to remove it.' },
      { term: 'Higher occupancy, higher moisture load', text: 'Cooking, showering and simply breathing put water into the air. A full household generates measurably more of it than an empty one, and a house that was marginal on dehumidification will show it first.' },
      { term: 'Slab-edge moisture on lake lots', text: 'Drained wetland with a shallow water table. It shows at the base of exterior walls, and under vinyl plank laid over the original tile.' },
      { term: 'East-side interior closet air handlers', text: 'The 1950s and 60s grid has the same profile as east Fort Lauderdale — undersized returns, high static pressure, a coil in a sealed closet.' },
      { term: 'Flat and low-slope additions', text: 'Carport enclosures and Florida rooms added to the original stock over sixty years. The flashing where the addition meets the original roofline is where it gets in.' },
    ],
    neighborhoods: [
      'Historic Miramar', 'Miramar Lakes', 'Sunset Lakes', 'Monarch Lakes', 'Riviera Isles',
      'Silver Shores', 'Vizcaya', 'Huntington', 'Country Club Ranches', 'Sunset Falls',
      'Bass Creek', 'Palm Lake', 'Miramar Park',
    ],
    zips: ['33023', '33025', '33027', '33029'],
    nearby: ['pembroke-pines', 'hollywood', 'plantation'],
    faqs: [
      {
        q: 'We are in a townhome and the stain is on the shared wall. Whose problem is it?',
        a: 'Possibly neither of yours alone. Water entering at a roofline or a window on one side travels inside the assembly, so the unit that finds the stain is frequently not the unit where the water is getting in. The useful first step is a moisture map on both sides of the wall before anyone opens anything — and if there is an association, before anyone assumes it is a private repair.',
      },
      {
        q: 'Does having a full house make mold more likely?',
        a: 'It raises the moisture load, which matters if the house was already marginal. Cooking, showering, laundry and respiration all put water into the air, and a home with six people in it generates substantially more than the same home with two. It does not cause mold on its own — but it is often the difference between a house that copes with an undersized dehumidification setup and one that does not.',
      },
      {
        q: 'Our house in Historic Miramar is from the 1950s. Is it different from the west side?',
        a: 'Completely. The east-side stock is concrete block on a low slab with central air retrofitted long after it was built — undersized returns, closet air handlers, and often an addition or two with a flashing detail nobody has looked at in decades. The west-side houses have the opposite problem: they are sealed tight and depend entirely on the equipment.',
      },
      {
        q: 'Do you cover the Miami-Dade side of the line?',
        a: 'Our service area is Broward and Palm Beach. If you are just over the county line we will tell you plainly rather than stretch — and we would rather refer you to somebody licensed and working there every day than take the job because the address is close.',
      },
    ],
  },

  {
    slug: 'pompano-beach',
    media: { image: 'coastal-condo' },
    name: 'Pompano Beach',
    county: 'Broward',
    title: 'Mold Remediation Pompano Beach FL | Condo & AC Mold',
    description:
      'Mold remediation in Pompano Beach, including condo and seasonal-unit AC mold. Palm Aire, Cypress Bend, Hillsboro Shores, Cresthaven. Licensed and insured.',
    lede:
      'Pompano is a condo town, and condo mold has its own physics: shared corridors, individual air handlers in hallway closets, and units that sit closed up all summer.',
    short: 'A condo town, and condo mold has its own physics — hallway air handlers, units closed all summer.',
    intro: [
      'The dense mid-rise and garden-apartment stock through Palm Aire, Cypress Bend, and the Cresthaven corridor was largely built between the late 1960s and the mid 1980s. Most of those buildings put a small [air handler](/services/hvac-air-conditioner-mold-remediation/) in a hallway or bedroom closet, run supply through a [duct board](/services/air-duct-cleaning-sanitizing/) plenum into a short trunk, and use a single return grille on the closet door.',
      'That configuration is fine until the building is pressurized differently than it was designed to be — a corridor makeup air unit that has been off for two years, say — and then units start drawing air through the front door frame and the window wall instead. Combine that with a coil in a closet and you have a reliable growth condition.',
      'The seasonal occupancy pattern is the other half of it. A unit closed in May with the thermostat set to 80 or switched off entirely will sit at 70 to 80% relative humidity for five months. The owner opens the door in November and the smell is the first thing that greets them. We get a lot of those calls between Thanksgiving and January.',
    ],
    watchHeadline: 'What we see most often in Pompano Beach',
    watch: [
      { term: 'Summer-vacant units', text: 'The single most preventable mold problem in this market. A thermostat at 80 does not dehumidify. A unit needs either a low set point with a long-run system or a standalone dehumidifier.' },
      { term: 'Original duct board plenums', text: 'The 1970s and 80s buildings almost universally used fiberglass duct board. Once colonized it comes out — cleaning does not restore a fiber mat.' },
      { term: 'Closet air handlers with door-grille returns', text: 'Undersized return path, high static pressure, and a coil sitting in a dark closet inches from a bedroom wall.' },
      { term: 'Corridor pressurization failures', text: 'A building-level issue that shows up as a unit-level mold problem. Worth raising with the association rather than fixing five times in five units.' },
      { term: 'Window wall and slider sealant', text: 'The older beachfront mid-rises leak at the window wall in wind-driven rain long before anyone calls it a roof problem.' },
          { term: 'Blocked slider tracks on balconies', text: 'The bottom track of a balcony slider has weep holes that drain wind-driven rain back outside. Once they silt up — which takes a few years — the track fills and water goes over the inner lip onto the floor inside.' },
    ],
    neighborhoods: [
      'Palm Aire', 'Cypress Bend', 'Old Pompano', 'Hillsboro Shores', 'Cresthaven',
      'Garden Isles', 'Harbor Village', 'Leisureville', 'Kendall Green', 'Pompano Beach Highlands',
      'Avondale', 'Collier City',
    ],
    zips: ['33060', '33061', '33062', '33063', '33064', '33065', '33069', '33073'],
    nearby: ['fort-lauderdale', 'coral-springs', 'boca-raton'],
    faqs: [
      {
        q: 'My condo was closed all summer and now it smells. What do I do first?',
        a: 'Do not run the air handler yet. If there is growth in the system, turning it on distributes it through the whole unit before anyone has looked at it. Open windows if the weather allows, get a dehumidifier running, and have the air handler and plenum inspected before the system goes back into service. This is the most common call we take in December and it is very fixable.',
      },
      {
        q: 'Who pays for mold remediation in a condo — me or the association?',
        a: 'It depends on where the water came from and what your declaration says, and we are not in a position to interpret your association documents. The general shape in Florida is that the association is responsible for common elements and the unit owner for what is inside the unit boundary, but a leak originating in a common-element pipe or roof changes that analysis. Get the documentation from us, then have your association manager or an attorney read it against the declaration.',
      },
      {
        q: 'Can you get equipment into a mid-rise unit?',
        a: 'Yes — most of our containment and negative air equipment is portable specifically because a large share of our work is in buildings with elevators, service corridors, and association rules about work hours. We coordinate with building management up front, including certificates of insurance, which most associations here require before anyone starts.',
      },
          {
        q: 'Water comes in at the balcony slider when it rains hard. Is that a building problem or ours?',
        a: 'Usually it is a maintenance one, and often yours. The slider track is designed to hold water briefly and drain it through small weep holes at the outer edge; when those block with sand and debris the track overflows inward. Clearing them is a ten-minute job. If they are clear and water still comes in, then it is a sealant or a building-envelope question and worth raising with the association.',
      },
    ],
  },

  {
    slug: 'deerfield-beach',
    /** Shares `villa-community` with Delray Beach — both pages are about
     *  low-rise association-managed 55+ stock, which is genuinely what the
     *  photo shows. Different county grids; `focus` varies the crop. */
    media: { image: 'villa-community', focus: '25% 55%' },
    name: 'Deerfield Beach',
    county: 'Broward',
    title: 'Mold Remediation Deerfield Beach FL | Condo & Century Village',
    description:
      'Mold remediation in Deerfield Beach. Century Village East, The Cove, Hillsboro Blvd. Association buildings, seasonal units and salt-air coils.',
    lede:
      'Deerfield has more association-managed housing per square mile than almost anywhere else we work, and that changes the question from what is wrong with your unit to what is wrong with your building.',
    short: 'Association-managed housing changes the question from what is wrong with your unit to your building.',
    intro: [
      'Century Village East alone is roughly eight and a half thousand units across a few hundred two- and three-story buildings, most of it built through the 1970s and early 80s. Add the garden apartments along the Hillsboro corridor, the oceanfront mid-rises on the barrier island, and the villa communities west of Powerline, and a great deal of what we are called to in this city turns out to be somebody else’s common element as much as it is your living room.',
      'The buildings themselves share a pattern: a small [air handler](/services/hvac-air-conditioner-mold-remediation/) in a hallway or bedroom closet, a short [duct board](/services/air-duct-cleaning-sanitizing/) plenum, a single return grille on the closet door, and no elevator. Individually each one is unremarkable. Collectively it means that when three units in the same building call us in the same month, the answer is almost never three separate unit problems.',
      'East of the Intracoastal the story changes to salt. The Cove and the oceanfront stock sit close enough to the water that condenser and coil corrosion is a genuine maintenance factor, and the canal lots in the Cove add a high water table at the slab edge on top of it.',
    ],
    watchHeadline: 'What we see most often in Deerfield Beach',
    watch: [
      { term: 'Building-level causes presenting as unit-level problems', text: 'A corridor makeup air unit that has been off for years, a roof at end of life, or a common-element riser leak. Remediating five units without addressing it means remediating them again.' },
      { term: 'Closet air handlers with door-grille returns', text: 'The standard configuration in the 1970s and 80s low-rise stock. Undersized return path, high static pressure, and a wet coil in a sealed closet against a bedroom wall.' },
      { term: 'Seasonal units closed through the wet season', text: 'Same physics as Boynton and Pompano. A unit shut in May at 80°F on the thermostat sits near outdoor humidity until November.' },
      { term: 'Original duct board in the Century Village stock', text: 'Porous fiberglass approaching or past a fifty-year service life in a subtropical climate.' },
      { term: 'Salt corrosion east of the Intracoastal', text: 'Pitted aluminium fins hold debris and moisture differently than clean ones, and a corroded coil is harder to clean to a verifiable standard.' },
      { term: 'Canal-lot slab edges in The Cove', text: 'A high water table under 1950s and 60s waterfront single-family stock, showing at the base of exterior walls.' },
    ],
    neighborhoods: [
      'Century Village East', 'The Cove', 'Deerfield Beach Island', 'Crystal Lake', 'Independence Bay',
      'The Waterways', 'Tivoli', 'Starlight Cove', 'Deer Creek', 'Palm Trail',
      'Century Plaza', 'Natura', 'Villages of Hillsboro',
    ],
    zips: ['33064', '33441', '33442', '33443'],
    nearby: ['pompano-beach', 'boca-raton', 'coral-springs'],
    faqs: [
      {
        q: 'Three units in our Century Village building have the same smell. Is that a coincidence?',
        a: 'Almost certainly not. When several units in one building report the same thing, the cause is usually shared — the roof, a common-element riser, or corridor pressurisation that stopped working. It is worth getting the association to look at the building before five owners each pay for their own unit, because the unit-level work will not hold if the building-level cause is still there.',
      },
      {
        q: 'Who is responsible, me or the association?',
        a: 'It turns on where the water came from and what your declaration says, and we are not in a position to interpret your documents. The general shape in Florida is that the association covers common elements and the owner covers what is inside the unit boundary — but a leak originating in a common-element pipe or the roof changes that analysis considerably. Get the documentation from us, then have your manager or an attorney read it against the declaration.',
      },
      {
        q: 'Our building has no elevator. Can you still work on a third-floor unit?',
        a: 'Yes. Most of our containment and negative air equipment is portable specifically because a large share of our work is in walk-up buildings. We will need to run exhaust ducting to a window rather than a corridor, and we coordinate hours and certificates of insurance with the association before the crew arrives.',
      },
      {
        q: 'Does being a block from the ocean make it worse?',
        a: 'It is hard on equipment rather than on the building. Salt air east of the Intracoastal corrodes condenser and evaporator fins, and a pitted coil holds moisture and debris in a way a clean one does not. It does not raise your indoor humidity by itself — that is still the envelope and the run time.',
      },
    ],
  },

  {
    slug: 'coral-springs',
    media: { image: 'tract-homes' },
    name: 'Coral Springs',
    county: 'Broward',
    title: 'Mold Remediation Coral Springs FL | Garage Air Handlers',
    description:
      'Mold remediation and HVAC mold removal in Coral Springs. Eagle Trace, Ramblewood, Turtle Run, Cypress Run. Garage air handler specialists.',
    lede:
      'Coral Springs is 1980s and 90s master-planned housing, and a lot of it put the air handler in the garage. That single decision drives most of what we find here.',
    short: '1980s and 90s master-planned housing that put the air handler in the garage. That drives most of it.',
    intro: [
      'The build-out through Ramblewood, Cypress Run, Eagle Trace, Maplewood, and later Turtle Run and the Heron Bay edge produced tens of thousands of two-story tract homes on a handful of floor plans. Those plans put the air handler either in the garage or in a second-floor closet, and both locations have a characteristic failure.',
      'A garage air handler sits in an unconditioned space that runs hot and humid. If the return plenum or the cabinet is not sealed — and after thirty years of service calls, filter changes, and a coil replacement, it usually is not — the system pulls garage air into the return on every cycle. That air is warm, humid, and carrying whatever is in the garage. It hits a 42°F coil.',
      'Second-floor closet units have a different problem: they sit next to an attic that reaches 130°F in August, and the supply plenum and the first several feet of trunk are frequently in that attic with degraded insulation. Cold duct plus hot humid attic equals sweating duct, and the drywall below it stains.',
    ],
    watchHeadline: 'What we see most often in Coral Springs',
    watch: [
      { term: 'Unsealed garage return plenums', text: 'The signature Coral Springs finding. Mastic and mechanical fastening at every joint of the return, plus a sealed cabinet, is usually a same-day correction with a large payoff.' },
      { term: 'Bath fans discharging into the attic', text: 'Extremely common in this era of construction. The fan runs, the moisture goes into the attic instead of outside, and the sheathing above the bathroom is the first thing to grow.' },
      { term: 'Attic supply plenums with failed insulation', text: 'Sweating ducts above the second-floor ceiling. The stain shows up ten feet from the actual problem.' },
      { term: 'Original 1980s [duct board](/services/air-duct-cleaning-sanitizing/)', text: 'Homes that have never had the plenum replaced are approaching forty years on a porous material in a humid attic.' },
      { term: 'Barrel tile valley leaks', text: 'The tile roofs on the western communities leak at valleys and penetrations. Underlayment is what actually keeps water out and it is at end of life across a lot of this stock.' },
          { term: 'Skylights and solar tubes', text: 'Very common in the 1980s and 90s stock here. Two different things go wrong: the curb flashing fails and lets rain in, or the glazing itself sweats in humid weather and drips onto the ceiling below. They look identical from the room.' },
    ],
    neighborhoods: [
      'Eagle Trace', 'Ramblewood', 'Cypress Run', 'Turtle Run', 'Maplewood',
      'Coral Creek', 'Westchester', 'Wyndham Lakes', 'The Greens', 'Heron Bay edge',
      'Forest Hills', 'Riverside', 'Kensington',
    ],
    zips: ['33065', '33067', '33071', '33075', '33076', '33077'],
    nearby: ['pompano-beach', 'fort-lauderdale', 'boca-raton'],
    faqs: [
      {
        q: 'My air handler is in the garage. Is that a problem by itself?',
        a: 'Not inherently — it is a legitimate location and millions of Florida homes do it. The problem is leakage. A sealed cabinet and a sealed return plenum in a garage works fine. An unsealed one turns your garage into a supplementary return, and garages are hot, humid, dusty, and connected to the outdoors every time the door opens. We test it rather than guess, and sealing it is usually inexpensive relative to what it prevents.',
      },
      {
        q: 'There is a brown ring on my second-floor ceiling near a vent. Roof or AC?',
        a: 'In Coral Springs, more often AC than roof — specifically a sweating supply duct or a register boot with failed insulation. The way to tell without opening the ceiling is timing: roof leaks track with rain, condensation tracks with humid weather and long AC run times. We check both, because it is also possible to have a roof leak wetting duct insulation and get to the same stain by a different route.',
      },
      {
        q: 'Do you work in the gated communities out west?',
        a: 'Yes, including Heron Bay, Eagle Trace, and the Parkland-border communities. Most of them require contractor registration and a certificate of insurance at the gate, which we handle before the crew arrives rather than at 8am with a truck idling at the guardhouse.',
      },
          {
        q: 'There is a stain around our skylight. Is that the roof or condensation?',
        a: 'It can genuinely be either, and they are told apart by timing rather than by appearance. Flashing failure tracks with rain; condensation tracks with humid weather and long air conditioning run times, and is often worst on cool mornings. We check both, because a skylight that sweats and a skylight that leaks produce the same brown ring on the same drywall.',
      },
    ],
  },

  {
    slug: 'weston',
    /** Shares `neotraditional` with Jupiter — both are newer planned
     *  communities, which is what the photo shows. Different county grids. */
    media: { image: 'neotraditional', focus: '35% 55%' },
    name: 'Weston',
    county: 'Broward',
    title: 'Mold Remediation Weston FL | Newer Homes & Lake Lots',
    description:
      'Mold remediation in Weston FL. Weston Hills, The Ridges, Savanna, Windmill Ranch, Bonaventure. Tight post-1996 construction, lake lots and second-home vacancy.',
    lede:
      'Weston is the newest housing we work in and the most uniform. Whole villages went up in the same few years to the same handful of plans — which means when we find something here, we usually find it up the street too.',
    short: 'The newest, most uniform housing we work in. Find something here and it is usually up the street too.',
    intro: [
      'Almost all of Weston was built between the late 1980s and the early 2000s on drained land at the edge of the water conservation areas, and it incorporated as a city only in 1996. The construction is post-Andrew and code-current: tight envelopes, good windows, real insulation, barrel tile on nearly everything, and very little of the accidental ventilation that makes older South Florida housing forgiving.',
      'That produces the newer-construction problem in its purest form. A sealed house has no passive way to shed interior moisture, so the air conditioner is the only mechanism — and if it is oversized, which is still the default in residential installs, it satisfies the thermostat before it has run long enough to pull latent heat. We measure 65% relative humidity in Weston houses that read 73°F on the wall.',
      'The uniformity cuts both ways. Because the villages were built by the same developer to the same plans in the same window, a construction detail that failed in one house tends to have failed in a few hundred. The exception is Bonaventure, which predates all of it — 1970s and 80s stock, including mid-rise condominium buildings, with the original [duct board](/services/air-duct-cleaning-sanitizing/) and the failure modes to match.',
    ],
    watchHeadline: 'What we see most often in Weston',
    watch: [
      { term: 'Tight envelopes with no dehumidification strategy', text: 'The house does not leak, so run time is the only moisture removal there is. Where the equipment is oversized, a whole-house dehumidifier is frequently the actual fix rather than any demolition.' },
      { term: 'Second-floor [air handler](/services/hvac-air-conditioner-mold-remediation/) closets', text: 'Standard in the two-story plans. A pan overflow here lands in the ceiling of the room below, and it is usually the ceiling that gets discovered rather than the pan.' },
      { term: 'Properties held as second homes', text: 'A great deal of Weston is owned by people who are not here continuously. Unlike the snowbird pattern further north, the vacancies are irregular rather than seasonal, which means nobody has a May routine to forget.' },
      { term: 'Lake-lot slab edges', text: 'A high water table on lots backing onto the lake and canal network. Shows at the base of exterior walls, and under vinyl plank laid over original tile.' },
      { term: 'Systemic, builder-era problems', text: 'Same developer, same plan, same year. If a neighbor has had a bath fan discharging into the attic or a return that was never sealed, it is worth checking whether yours matches.' },
      { term: 'Bonaventure’s older stock', text: 'The one part of the city with 1970s and 80s construction, mid-rise buildings and original fiberglass duct board. It behaves like Pompano, not like the rest of Weston.' },
    ],
    neighborhoods: [
      'Weston Hills Country Club', 'The Ridges', 'Savanna', 'Windmill Ranch Estates',
      'Country Isles', 'Emerald Estates', 'Indian Trace', 'Bonaventure', 'The Lakes',
      'Tequesta Trace', 'Racquet Club Estates', 'Sector 7', 'Isles at Weston',
    ],
    zips: ['33326', '33327', '33331', '33332'],
    nearby: ['pembroke-pines', 'plantation', 'coral-springs'],
    faqs: [
      {
        q: 'Our house is barely twenty years old. How do we have mold?',
        a: 'Because it was built well. A tight, code-current house has very little uncontrolled air exchange, so the air conditioning is the only thing removing interior moisture — and an oversized system satisfies the thermostat before it has run long enough to do that. High indoor humidity in newer Weston homes is routine, and the fix is often a dehumidifier and a fan-profile change rather than anything invasive.',
      },
      {
        q: 'Our neighbor just had work done and their house is the same model. Should we check ours?',
        a: 'Yes, and this is genuinely more useful advice in Weston than almost anywhere else we work. The villages were built to a small number of plans in a short window, so a detail that failed in one house — a bath fan vented into the attic, an unsealed return plenum, a shower pan detail — is likely to be identical in yours. Ask them what was found; it is a free head start.',
      },
      {
        q: 'The house is empty for months at a time but not on a set schedule. What do we do?',
        a: 'Set a humidity target rather than relying on remembering. A thermostat holding around 55% RH, or a standalone dehumidifier with a drain, works whether the house is empty for three weeks or five months and does not depend on anyone thinking about it before they leave. Irregular vacancy is harder than seasonal vacancy precisely because there is no routine attached to it.',
      },
      {
        q: 'Do the HOAs here make this complicated?',
        a: 'They make it slower, not harder. Most Weston villages require contractor registration and a certificate of insurance, and some want architectural review for anything affecting the exterior. We handle that paperwork before scheduling rather than at the gate on the morning of.',
      },
    ],
  },

  {
    slug: 'hollywood',
    media: { image: 'historic-bungalow' },
    name: 'Hollywood',
    county: 'Broward',
    title: 'Mold Remediation Hollywood FL | Historic Homes & Condos',
    description:
      'Mold remediation in Hollywood FL. Hollywood Lakes, Emerald Hills, Hillcrest, Beverly Hills. Wood-frame historic homes and 1960s co-op buildings.',
    lede:
      'Hollywood is unusual in Broward: it has real wood-frame housing stock. That changes what mold does to a building here.',
    short: 'Unusual in Broward: real wood-frame housing stock, which changes what mold does to a building.',
    intro: [
      'Almost everything in South Florida is concrete block. Hollywood Lakes is not. The 1920s boom-era houses between Hollywood Boulevard and the beach include genuine wood-framed construction with lath and plaster, and in a few cases raised floors — which is close to nonexistent elsewhere in the county.',
      'That matters because block does not feed mold and wood does. On a CBS house, a chronic moisture problem produces surface growth on the drywall face and the paint. On a wood-framed house it produces growth in the framing, the sheathing, and the sill, and after enough decades of it, rot. The remediation scope is deeper and the inspection has to go further into the assembly.',
      'The other half of Hollywood is the enormous 1960s and 70s co-op and condo belt through Hillcrest and Beverly Hills — low-rise buildings with aging central systems, flat roofs, and a lot of original ductwork. That work looks much more like our Pompano condo work than like Hollywood Lakes.',
    ],
    watchHeadline: 'What we see most often in Hollywood',
    watch: [
      { term: 'Growth inside wood-frame wall assemblies', text: 'In the Lakes and Beverly Hills historic stock. Surface treatment is meaningless here — the assessment has to open the assembly.' },
      { term: 'Original plaster over wood lath', text: 'Semi-porous, historically significant, and worth saving. Requires cleaning rather than demolition where the substrate is sound.' },
      { term: 'Flat roof ponding on the co-op stock', text: 'Low-slope roofs at end of life over units with no attic buffer. The ceiling is the roof deck.' },
      { term: 'Aging central systems in low-rise buildings', text: 'Some Hillcrest buildings still run original configurations with [duct board](/services/air-duct-cleaning-sanitizing/) and minimal filtration.' },
      { term: 'Salt exposure east of Ocean Drive', text: 'Equipment corrosion and window wall sealant failure in the beachfront buildings.' },
          { term: 'Co-op ownership rather than condominium', text: 'A good deal of the Hillcrest and Beverly Hills stock is held as co-ops, not condominiums. You own shares in a corporation rather than real property, which changes who can authorize work inside a unit and who carries the insurance.' },
    ],
    neighborhoods: [
      'Hollywood Lakes', 'Emerald Hills', 'Hillcrest', 'Beverly Hills', 'Liberia',
      'North Central', 'Royal Poinciana', 'Hollywood Hills', 'Playa del Mar', 'Boulevard Heights',
      'Driftwood', 'Oakwood Hills',
    ],
    zips: ['33019', '33020', '33021', '33023', '33024', '33025', '33026', '33027'],
    nearby: ['fort-lauderdale', 'pembroke-pines', 'pompano-beach'],
    faqs: [
      {
        q: 'My Hollywood Lakes house is wood-framed. Does that change the remediation?',
        a: 'Significantly. Wood is a food source and block is not, so the growth is in the structure rather than on it. We open the assembly, assess the framing and sheathing, and clean semi-porous wood mechanically rather than removing it wherever the material is structurally sound. It also means the inspection has to be more thorough — a moisture meter reading on the drywall face tells you very little about what the stud bay is doing.',
      },
      {
        q: 'Is remediation different in a historic home?',
        a: 'The standard is the same but the judgment calls are different. Original plaster, heart pine, and period millwork are worth cleaning rather than replacing when the substrate is sound, and that takes more labor hours and more care than cutting out drywall. If the property is in a designated district, exterior repairs to the moisture source may also need review, which is worth knowing before you schedule.',
      },
      {
        q: 'Our co-op building has a mold complaint in several units. Where do we start?',
        a: 'Almost certainly with the building, not the units. When several units in one building report the same thing, the common cause is usually the roof, the corridor pressurization, or a common-element plumbing failure. Remediating five units without addressing that means remediating them again. We are happy to walk it with the board and the property manager before anyone commits to unit-level work.',
      },
          {
        q: 'We are in a co-op rather than a condo. Does that change anything?',
        a: 'It changes the paperwork more than the work. In a co-op the corporation owns the building and you hold shares with a proprietary lease, so approval for work inside the unit — and the question of whose insurance responds — runs through the board rather than through a condominium declaration. Practically, it means we get authorization in writing before starting rather than after, and we would rather establish that on day one than halfway through a containment.',
      },
    ],
  },

  {
    slug: 'pembroke-pines',
    media: { image: 'lake-lot-homes' },
    name: 'Pembroke Pines',
    county: 'Broward',
    title: 'Mold Remediation Pembroke Pines FL | High Water Table',
    description:
      'Mold remediation in Pembroke Pines. Chapel Trail, Silver Lakes, Pembroke Falls, Century Village. Tight-envelope homes on a high water table.',
    lede:
      'West of Flamingo Road, Pembroke Pines is built on drained wetland. Tight modern houses on a high water table is a specific combination and it behaves in a specific way.',
    short: 'Built on drained wetland. Tight modern houses on a high water table behave in a specific way.',
    intro: [
      'The build-out through Chapel Trail, Silver Lakes, Pembroke Falls, and Grand Palms happened largely between the late 1980s and the mid 2000s, on land at the eastern edge of the Everglades that was drained and filled. The water table out there is shallow, the communities are laced with retention lakes, and a large share of homes sit on lake lots.',
      'The houses themselves are the opposite of the old east-side stock: post-Andrew construction codes, tight envelopes, better windows, and considerably less accidental ventilation. A tight house is more efficient and it is also less forgiving, because a tight house has no mechanism to shed interior moisture except the air conditioner.',
      'Put a tight envelope on a high water table and add an oversized system and you get a house that holds humidity. The failures we find here are rarely dramatic leaks. They are closets on exterior corners, the base of garage-adjacent walls, and air handlers that have never run a long enough cycle to do their second job.',
    ],
    watchHeadline: 'What we see most often in Pembroke Pines',
    watch: [
      { term: 'Tight envelopes with no dehumidification strategy', text: 'The house does not leak, which means the only moisture removal is AC run time. Where run time is short, a dedicated whole-house dehumidifier is often the actual fix.' },
      { term: 'Slab edge moisture on lake lots', text: 'A shallow water table and a slab that was poured on fill. Shows up at the bottom of exterior walls and under vinyl plank installed over the original tile.' },
      { term: 'Second-floor AC closets', text: 'Common in the two-story plans through Chapel Trail and Silver Lakes. A pan overflow here lands in the ceiling of the room below.' },
      { term: 'Century Village equipment age', text: 'A very large 55+ community with a lot of original and near-original air handlers and [duct board](/services/air-duct-cleaning-sanitizing/).' },
      { term: 'Vinyl plank over original tile', text: 'A popular 2015-onward renovation that adds a vapor barrier where the slab was previously able to dry upward. The moisture goes into the wall base instead.' },
          { term: 'Accordion and roll-down shutters left closed', text: 'Shutters closed between trips block solar drying on that elevation entirely, and they hide everything behind them. We have opened shutters that had not moved in two years to find growth on the wall and the window frame underneath.' },
    ],
    neighborhoods: [
      'Chapel Trail', 'Silver Lakes', 'Pembroke Falls', 'Grand Palms', 'Towngate',
      'Century Village', 'Pembroke Isles', 'Walnut Creek', 'Spring Valley', 'Raintree',
      'Pasadena Lakes', 'Flamingo Lakes',
    ],
    zips: ['33023', '33024', '33025', '33026', '33027', '33028', '33029', '33082'],
    nearby: ['hollywood', 'fort-lauderdale', 'coral-springs'],
    faqs: [
      {
        q: 'My house is only fifteen years old. How do I have mold?',
        a: 'Newer houses in this market get mold for the opposite reason older ones do. An old CBS house leaks air constantly, which is inefficient but self-correcting for humidity. A post-2000 house is sealed, so if the air conditioner is oversized and short-cycles, there is no other path for interior moisture to leave. We find high indoor humidity in newer Pembroke Pines homes routinely, and the fix is often a dehumidifier and a fan-speed adjustment rather than demolition.',
      },
      {
        q: 'Does living on a lake lot make it worse?',
        a: 'It raises the water table at the slab edge, which matters for the bottom of exterior walls and for anything installed over the slab that blocks upward drying. It does not meaningfully raise your indoor humidity by itself — that comes from the air conditioning and the envelope. Lake lots are not a reason to avoid the neighborhood; they are a reason to be careful about vapor-closed flooring.',
      },
      {
        q: 'We put in vinyl plank over the tile and now the baseboards are damp. Related?',
        a: 'Very likely, for the reason set out above. The detail worth knowing is where it shows: the moisture surfaces at the wall base and behind the baseboard rather than on the floor, so a meter on the plank can read dry while the bottom plate behind the trim is not. We ask about flooring changes on every intake call in this part of Broward because of how consistently it turns up.',
      },
          {
        q: 'We leave the hurricane shutters closed when we travel. Any harm in that?',
        a: 'Two things. The wall behind a closed shutter gets no sun and very little air movement, so an elevation that would normally dry after rain simply stays damp. And you cannot see any of it — a window seal that starts leaking in June is not discovered until the shutters come off. If you are leaving them closed, that is fine, but have whoever checks the house open one or two of them each visit.',
      },
    ],
  },

  // ══ PALM BEACH COUNTY ══════════════════════════════════════════════════════
  {
    slug: 'west-palm-beach',
    media: { image: 'historic-street' },
    name: 'West Palm Beach',
    county: 'Palm Beach',
    title: 'Mold Remediation West Palm Beach FL | Attic Duct Sweat',
    description:
      'Mold remediation in West Palm Beach. El Cid, Flamingo Park, Northwood, SoSo, Grandview Heights. 1920s homes with retrofitted attic ductwork.',
    lede:
      'West Palm has the oldest intact historic housing in the two counties, and almost all of it had air conditioning added long after it was built. The ductwork went into the attic because there was nowhere else to put it.',
    short: 'The oldest intact historic housing in the two counties, with air conditioning added long afterward.',
    intro: [
      'El Cid, Flamingo Park, Grandview Heights, and Northwood Shores are full of 1920s Mediterranean Revival and mission bungalows — stucco over hollow tile or wood frame, original plaster, wood floors, and no ducts anywhere in the original design.',
      'When central air went in during the 1970s through the 2000s, the ducts had to go somewhere. That somewhere was the attic, occasionally a soffit chase, and in a few unfortunate cases a crawl area. An attic in West Palm reaches 130 to 140°F in July with humidity to match, and a supply duct in it is carrying 55°F air. Every failure of that duct insulation produces condensation, and the condensation lands on the plaster ceiling below.',
      'The historic stock also has the general problem of age: original windows retrofitted with modern glass, stucco that has been patched over eight decades, and roof assemblies that have been replaced enough times that nobody knows what is under the current layer.',
    ],
    watchHeadline: 'What we see most often in West Palm Beach',
    watch: [
      { term: 'Sweating attic ductwork', text: 'The dominant finding in the historic neighborhoods. A compressed, torn, or wet duct wrap in a 135°F attic condenses continuously through the summer.' },
      { term: 'Register boots on plaster ceilings', text: 'The dark halo around a ceiling register. On plaster it is more salvageable than on drywall, which is worth knowing before someone quotes you a demo.' },
      { term: 'Stucco cracking on hollow tile walls', text: 'Water enters at hairline cracks and travels inside the tile cavity, appearing at the interior surface well away from the entry point.' },
      { term: 'Retrofitted returns in interior hallways', text: 'Undersized single returns serving whole houses, producing high static pressure and poor dehumidification.' },
      { term: 'Original plaster worth saving', text: 'Semi-porous, and where the substrate and the lath are sound, cleanable. We would rather clean it than replace it with drywall.' },
          { term: 'Additions built over former porches', text: 'Extremely common across the historic districts: a screened porch enclosed in the 1980s or 90s and turned into conditioned space. The junction where the addition roof meets the original roofline is where water gets in, and it is almost never the part anyone looks at.' },
    ],
    neighborhoods: [
      'El Cid', 'Flamingo Park', 'Grandview Heights', 'Northwood Shores', 'SoSo (South of Southern)',
      'Prospect Park', 'Old Northwood', 'Downtown / Clematis', 'Ibis', 'Andros Isle',
      'Southland Park', 'Pineapple Park', 'Vedado',
    ],
    zips: ['33401', '33403', '33405', '33406', '33407', '33409', '33411', '33413', '33415', '33417'],
    nearby: ['boca-raton', 'delray-beach', 'jupiter'],
    faqs: [
      {
        q: 'There is a dark ring around my ceiling vent. What causes that?',
        a: 'Condensation at the register boot, nearly every time. The boot is a metal box carrying 55°F air, sitting in a 130°F attic. If the insulation around it has compressed, torn, or gotten wet, the outside of the boot drops below the dew point of the attic air and water forms on it. That water wicks into the ceiling material at the perimeter of the register, which is exactly where the ring appears.',
      },
      {
        q: 'Can original plaster be saved, or does it all have to come out?',
        a: 'Often it can be saved. Plaster over wood lath is semi-porous, and where the plaster is sound and keyed to the lath, mechanical cleaning is a legitimate approach under the standard. What forces removal is plaster that has lost its key, is friable, or has growth into the lath behind it. We assess it rather than defaulting to demolition, because replacing 1925 plaster with drywall is not a repair, it is a downgrade.',
      },
      {
        q: 'Do you serve the western communities out toward Royal Palm and Wellington?',
        a: 'Yes — our Palm Beach County coverage runs from the Broward line to Jupiter and west past the Turnpike, including Royal Palm Beach, Wellington, and Loxahatchee. The housing out there is much newer and the failure modes look more like our Pembroke Pines work than like El Cid.',
      },
          {
        q: 'Our house has a later addition on the back and that is exactly where the problem is. Why?',
        a: 'Because the roofline junction between an addition and an original structure is the hardest detail on the building to get right, and on a house where the addition went on sixty years after the original it was frequently got wrong. Add that many of these enclosures sit on a slab poured over what used to be an open porch, with no vapour barrier under it, and you have two moisture routes in the one part of the house nobody inspects.',
      },
    ],
  },

  {
    slug: 'lake-worth-beach',
    /** Shares `historic-bungalow` with Hollywood — both pages are about 1920s
     *  stucco-and-wood-frame historic stock, which is what the photo is.
     *  Different county grids; `focus` varies the crop. */
    media: { image: 'historic-bungalow', focus: '70% 50%' },
    name: 'Lake Worth Beach',
    county: 'Palm Beach',
    title: 'Mold Remediation Lake Worth Beach FL | Historic Homes',
    description:
      'Mold remediation in Lake Worth Beach. Old Town, Parrot Cove, College Park, South Palm Park. 1920s wood-frame bungalows, duplex conversions and window units.',
    lede:
      'Lake Worth Beach has one of the largest historic districts in Florida, and a great deal of it is genuinely wood-framed. In this climate that changes what mold does to a building rather than just where it sits.',
    short: 'One of Florida\'s largest historic districts, and a great deal of it is genuinely wood-framed.',
    intro: [
      'The city renamed itself Lake Worth Beach in 2019, but the housing has not changed: a dense grid of 1920s Mission and Mediterranean Revival cottages and wood-frame bungalows on small lots, most of it inside a designated historic district, much of it on original framing with plaster interiors.',
      'Almost everything else we work on in these two counties is concrete block. Block does not feed mold; wood does. On a CBS house a chronic moisture problem produces surface growth on the drywall face. On a wood-framed 1925 bungalow it produces growth in the studs, the sheathing and the sill, and eventually rot — so the assessment has to open the assembly rather than read the wall face, and a meter reading on the plaster tells you very little about what the stud bay is doing.',
      'The other thing that makes this city distinct is how much of that stock has been split. A large share of the older single-family housing here operates as duplexes, triplexes and seasonal rentals, and a lot of those units are cooled by window shakers and retrofit mini-splits rather than a central system. That is a different set of failure modes from anything else on this site.',
    ],
    watchHeadline: 'What we see most often in Lake Worth Beach',
    watch: [
      { term: 'Growth inside wood-frame wall assemblies', text: 'Surface treatment is meaningless on this stock. Where the framing itself is affected the work is deeper, and the inspection has to open the wall rather than read its face.' },
      { term: 'Window units and retrofit mini-splits', text: 'A window shaker drains to the outside and is generally fine. What fails is the sleeve and the wall opening around it, and mini-split wall cassettes grow inside the blower wheel and the drain pan where nobody ever looks.' },
      { term: 'Original plaster over wood lath', text: 'Semi-porous, historically significant, and worth cleaning rather than replacing where the plaster is sound and still keyed to the lath.' },
      { term: 'Duplex and triplex conversions', text: 'Units carved out of a single-family house often share a wall cavity, an attic, or a plumbing chase. A leak in one unit becomes a problem in the other, and neither tenant knows the other has it.' },
      { term: 'Deferred maintenance on rental stock', text: 'Roof and window repairs that were postponed a season too long. It is the most common underlying cause here and it is a landlord conversation, not a remediation one.' },
      { term: 'Small lots and low crawl clearances', text: 'Some of the oldest stock sits on piers rather than a slab, which is close to unheard of elsewhere in the county and changes where moisture enters.' },
    ],
    neighborhoods: [
      'Old Town', 'Parrot Cove', 'College Park', 'Mango Groves', 'South Palm Park',
      'North Lake Worth', 'Tropical Ridge', 'Bryant Park', 'Downtown', 'Sunset Ridge',
      'Lake Osborne Heights', 'Eden Place', 'Hypoluxo Park',
    ],
    zips: ['33460', '33461', '33462', '33463', '33465'],
    nearby: ['west-palm-beach', 'boynton-beach', 'wellington'],
    faqs: [
      {
        q: 'Our house is wood-framed. Does that change the remediation?',
        a: 'Substantially. Wood is a food source and concrete block is not, so growth is in the structure rather than on it. We open the assembly, assess the framing and sheathing, and clean semi-porous wood mechanically wherever it is structurally sound rather than removing it. It also means a moisture reading taken on the plaster face tells you almost nothing about the stud bay behind it.',
      },
      {
        q: 'Can original plaster be saved?',
        a: 'Usually, yes. Plaster over wood lath is semi-porous, and where it is sound and still keyed to the lath, mechanical cleaning is a legitimate approach under the standard. Removal becomes the answer when the plaster has pulled away from the lath, crumbles under a fingernail, or the growth has gone through into the wood behind it. Short of that, putting drywall into a 1920s wall is a downgrade dressed up as a repair, and it is worth the extra labor hours to avoid.',
      },
      {
        q: 'The unit only has a window air conditioner. Is that a problem?',
        a: 'The unit itself is usually not. Window shakers drain to the outside and are relatively self-managing. What we find failing is the sleeve and the wall opening around it — water tracking back into the wall assembly at a poorly sealed penetration. On retrofit mini-splits the failure is different: the wall cassette grows inside the blower wheel and the condensate pan, and almost nobody opens one to look.',
      },
      {
        q: 'I rent here and my landlord says it is not mold. What can I do?',
        a: 'Get it documented independently. A [licensed mold assessor](/services/mold-inspection-testing/) produces a report that is a neutral record, which is a very different thing from either party asserting something. That is a separate license from ours — Florida restricts one company from both assessing and remediating the same property — so we would refer you out rather than test it ourselves, and we would tell you the same thing if you were the landlord.',
      },
    ],
  },

  {
    slug: 'boca-raton',
    media: { image: 'country-club' },
    name: 'Boca Raton',
    county: 'Palm Beach',
    title: 'Mold Remediation Boca Raton FL | Country Club & Condo',
    description:
      'Mold remediation in Boca Raton. Boca Del Mar, Broken Sound, Woodfield, Boca Pointe. Seasonal homes, zoned systems, second-floor AC closets.',
    lede:
      'Boca has more seasonally occupied housing than anywhere else we work, and more zoned multi-system homes. Both produce mold problems that have nothing to do with a leak.',
    short: 'More seasonally occupied housing, and more zoned multi-system homes, than anywhere else we work.',
    intro: [
      'The country-club build-out — Boca Del Mar, Broken Sound, Woodfield, Boca West, Boca Bath & Tennis — runs from the mid 1970s through the 1990s and includes an enormous volume of condominium, villa, and townhome stock alongside the single-family homes. A large share of it is occupied from November through April and closed the rest of the year.',
      'The closed-up-for-summer problem is the same one we see in Pompano, but Boca adds a wrinkle: the homes are larger, they frequently run two or three zoned systems, and the zoning itself creates dead spots. A zone that is calling for cooling rarely because nobody is in that wing of the house is a zone that is not dehumidifying, and the guest suite that gets opened in December is the one with the smell.',
      'At the higher end, the systems are often sophisticated and badly commissioned. Variable-speed equipment with a properly configured dehumidification mode is genuinely excellent at this. The same equipment installed with default settings and no humidistat is an expensive short-cycling machine.',
    ],
    watchHeadline: 'What we see most often in Boca Raton',
    watch: [
      { term: 'Seasonal vacancy at 80°F', text: 'The most common single cause of Boca mold calls. A house needs a humidistat-controlled strategy while it is empty, not a thermostat set high.' },
      { term: 'Zoned systems with dead zones', text: 'A wing that rarely calls for cooling is a wing that never dehumidifies, regardless of what the main thermostat reads.' },
      { term: 'Second-floor and attic-adjacent AC closets', text: 'Standard in the two-story country-club plans. A pan overflow drops into the ceiling below.' },
      { term: 'Barrel tile roof underlayment at end of life', text: 'The 1980s tile roofs are on their second or third underlayment cycle. The tile is fine; the membrane under it is what leaks.' },
      { term: 'Uncommissioned variable-speed equipment', text: 'Excellent hardware running default settings. Adding a humidistat and correcting the fan profile can resolve a chronic humidity complaint without any demolition.' },
          { term: 'Screened pool enclosures against the rear elevation', text: 'A cage traps humid air against the back of the house and shades the wall, and the screen holds leaf litter above the slab edge. The rear elevation of a Boca house with a cage on it is frequently the one wall that never dries.' },
    ],
    neighborhoods: [
      'Boca Del Mar', 'Broken Sound', 'Woodfield Country Club', 'Royal Palm Yacht & Country Club',
      'Boca Bath & Tennis', 'Sandalfoot Cove', 'Boca Pointe', 'Les Jardins', 'The Oaks',
      'Old Floresta', 'Boca Islands', 'Millpond', 'Boca Raton Square',
    ],
    zips: ['33427', '33428', '33431', '33432', '33433', '33434', '33486', '33487', '33496', '33498'],
    nearby: ['delray-beach', 'boynton-beach', 'coral-springs'],
    faqs: [
      {
        q: 'What should I set the thermostat to when I close the house for the summer?',
        a: 'Not 80. A thermostat at 80 in a Boca summer produces almost no run time, which means almost no dehumidification, which is how you come back to a smell in November. The reliable approach is either a thermostat with a true humidity set point holding around 55%, or a standalone whole-house dehumidifier with the thermostat set to a moderate temperature. This is the cheapest mold prevention available to a seasonal owner and very few people are told about it.',
      },
      {
        q: 'One wing of the house smells and the rest is fine. Why?',
        a: 'That is the classic zoned-system pattern. If that zone rarely calls for cooling — a guest wing, an office nobody uses — its [air handler](/services/hvac-air-conditioner-mold-remediation/) barely runs, so that part of the house never gets dehumidified even though the main living area reads perfectly comfortable. We measure humidity zone by zone rather than at the hallway thermostat, and the fix is frequently a controls change rather than remediation.',
      },
      {
        q: 'Our HOA requires approval before contractors start. Can you handle that?',
        a: 'Yes, and we expect it in most of the Boca communities. We provide certificates of insurance, license documentation, and a written scope for architectural review or management approval before scheduling. We would rather spend a week on paperwork than have a crew turned away at Broken Sound on a Monday morning.',
      },
          {
        q: 'Does the pool enclosure make it worse?',
        a: 'On the rear wall, yes — it cuts air movement and sun on that elevation and holds debris against the base of the wall. That is usually a cleaning and clearance question rather than a remediation one; our guide on exterior growth covers what is worth doing. Where it becomes an interior problem is when the cage gutter or the enclosure footing directs water back toward the slab rather than away from it.',
      },
    ],
  },

  {
    slug: 'delray-beach',
    media: { image: 'villa-community' },
    name: 'Delray Beach',
    county: 'Palm Beach',
    title: 'Mold Remediation Delray Beach FL | Duct Board Plenums',
    description:
      'Mold remediation in Delray Beach. Lake Ida, Del-Ida Park, Tropic Isle, Pineapple Grove, Kings Point. Historic bungalows and original 1970s duct board systems.',
    lede:
      'Delray splits cleanly in two: historic bungalows near Atlantic Avenue, and one of the largest 55+ condo communities in Florida west of I-95. They fail in completely different ways.',
    short: 'Historic bungalows near Atlantic Avenue, and a very large 55+ condo community west of I-95.',
    intro: [
      'East of Swinton, Del-Ida Park and Lake Ida hold 1920s through 1950s bungalows — smaller than the West Palm historic stock, frequently renovated, and mostly on modest lots close to the water table. The renovation wave through Pineapple Grove and the Atlantic Avenue corridor has been aggressive, and renovation is its own mold risk: new impact windows sealed imperfectly, new flooring over old slabs, and new HVAC squeezed into spaces that were not designed for it.',
      'West of the interstate, Kings Point is a different universe. Thousands of units built from the 1970s into the 1980s, most with original or lightly updated air handlers, and — the recurring theme — fiberglass duct board supply plenums that are now forty-plus years old in a subtropical climate.',
      'Duct board is the single most consequential material in this market. It is porous, it holds dust and moisture in its fiber mat, and once it is colonized there is no cleaning process that restores it. When we tell a Kings Point owner the plenum has to be replaced, that is why.',
    ],
    watchHeadline: 'What we see most often in Delray Beach',
    watch: [
      { term: 'Forty-year-old duct board plenums', text: 'Endemic in the western condo stock. Replacement in sheet metal or new board is the only real remedy once the mat is colonized.' },
      { term: 'Renovation-driven moisture in the historic district', text: 'Impact window retrofits with sealant failures, and vapor-closed flooring installed over slabs that were drying upward.' },
      { term: 'Seasonal vacancy in the 55+ communities', text: 'Same physics as Boca and Pompano — units closed May through November with no humidity control.' },
      { term: 'Undersized returns in renovated bungalows', text: 'Modern equipment installed into a 1940s floor plan with one small hallway return.' },
      { term: 'Flat and low-slope roofs on the condo stock', text: 'No attic buffer between the roof membrane and the unit ceiling.' },
          { term: 'Renovated bathrooms with no real exhaust', text: 'The Atlantic Avenue renovation wave produced a lot of beautiful bathrooms venting into a soffit, into an attic, or through a recirculating fan that vents nowhere at all. The moisture from every shower has to go somewhere, and it goes into the assembly.' },
    ],
    neighborhoods: [
      'Lake Ida', 'Del-Ida Park', 'Osceola Park', 'Tropic Isle', 'Seagate',
      'Pineapple Grove', 'Kings Point', 'Marina Historic District', 'Sherwood Park',
      'Rainberry Bay', 'Hamlet', 'Villages of Oriole', 'Lakeview',
    ],
    zips: ['33444', '33445', '33446', '33482', '33483', '33484'],
    nearby: ['boca-raton', 'boynton-beach', 'west-palm-beach'],
    faqs: [
      {
        q: 'What is duct board and why does it have to be replaced?',
        a: 'Duct board is rigid bonded fiberglass with a foil facing, used to build supply plenums and sometimes whole trunk lines. It was standard in Florida construction for decades because it insulates and ducts in one product. The interior face is an exposed fiber mat, which means it is porous — dust and moisture get into it rather than sitting on it, and growth extends into the fiber. There is no cleaning method that removes growth from inside a fiber mat, and coating over it seals the growth in rather than removing it. That is why replacement is the answer.',
      },
      {
        q: 'I own a Kings Point unit and I only use it in the winter. What should I do differently?',
        a: 'Two things, and they are inexpensive relative to a remediation. First, control humidity while you are gone — a humidistat-controlled thermostat holding around 55% RH, or a standalone dehumidifier with a drain line. Second, have the [air handler](/services/hvac-air-conditioner-mold-remediation/) and plenum looked at before you turn the system back on in the fall rather than after. Running a colonized system for a week distributes it through the whole unit.',
      },
      {
        q: 'We just renovated a Lake Ida bungalow and now there is a smell. Is that normal?',
        a: 'It is common, which is not the same as normal. Renovations change how a building handles moisture, usually by tightening it, and the changes that most often cause problems are new flooring over an old slab, impact window retrofits, and HVAC that is oversized for a now-tighter house. We start by measuring indoor humidity and looking at what changed, because in a recently renovated house the cause is usually something in the renovation.',
      },
          {
        q: 'We renovated the bathroom and now the ceiling is spotting. What happened?',
        a: "Almost always the exhaust. A fan that discharges into the attic rather than through the roof, or one that was never ducted at all, puts every shower’s worth of moisture directly above the ceiling it is meant to protect. It is a quick thing to verify — go into the attic and confirm the duct actually leaves the building — and it is one of the more common things we find behind a recently renovated room.",
      },
    ],
  },

  {
    slug: 'boynton-beach',
    media: { image: 'flat-roof-villa' },
    name: 'Boynton Beach',
    county: 'Palm Beach',
    title: 'Mold Remediation Boynton Beach FL | 55+ Communities',
    description:
      'Mold remediation in Boynton Beach. Leisureville, Hunters Run, Valencia communities, Renaissance Commons. Seasonal units, aging equipment, and flat-roof villas.',
    lede:
      'Boynton is where Palm Beach County put most of its 55+ housing, and a very large share of it sits empty for six months a year with the AC turned off.',
    short: 'Where Palm Beach County put most of its 55+ housing — much of it empty six months a year.',
    intro: [
      'From Leisureville and Hunters Run through the Valencia communities west of the Turnpike, Boynton has an unusually high concentration of active-adult housing spanning fifty years of construction. The 1970s villas have flat or low-slope roofs, original [duct board](/services/air-duct-cleaning-sanitizing/), and small closet air handlers. The 2000s Valencia homes are tight, modern, and have exactly the opposite problem.',
      'What unites them is occupancy pattern. Seasonal residency at this scale means thousands of units sitting closed from May through October in the wettest, hottest part of the year, and the standard advice people give each other at the clubhouse — set it to 80 and turn off the water — is precisely the advice that produces mold.',
      'The other Boynton pattern is deferred equipment replacement. An [air handler](/services/hvac-air-conditioner-mold-remediation/) that is twenty-five years old in a unit used four months a year has technically low run hours and technically works, so it does not get replaced. It also has an original duct board plenum, a corroded pan, and a coil nobody has cleaned in a decade.',
    ],
    watchHeadline: 'What we see most often in Boynton Beach',
    watch: [
      { term: 'The set-it-to-80 summer strategy', text: 'Very little run time, very little dehumidification, five months of 75% indoor RH. This is the leading cause of mold calls in Boynton and it is entirely preventable.' },
      { term: 'Very old equipment with low run hours', text: 'A twenty-five-year-old air handler in a seasonal unit does not feel old because it still cools. The pan, the coil, and the plenum tell a different story.' },
      { term: 'Flat-roof villas with no attic buffer', text: 'A roof leak in a 1970s villa is a ceiling problem immediately, with no attic to absorb it first.' },
      { term: 'Original duct board in the 1970s stock', text: 'Same story as Kings Point. Porous material at the end of a very long service life.' },
      { term: 'Tight Valencia-era homes with oversized systems', text: 'The newer western communities have the modern problem: sealed envelope, short cycles, no dehumidification path.' },
          { term: 'Enclosed Florida rooms with no conditioning', text: 'A glassed-in porch off a conditioned house, with no air conditioning of its own, is a humidity reservoir sitting against a cooled wall. Condensation forms at the junction between the two, on the conditioned side.' },
    ],
    neighborhoods: [
      'Leisureville', 'Hunters Run', 'Valencia Isles', 'Valencia Lakes', 'Valencia Reserve',
      'Renaissance Commons', 'Sterling Village', 'Boynton Lakes', 'Quantum Village',
      'Meadows 300', 'Indian Spring', 'Aberdeen', 'Sunny South Estates',
    ],
    zips: ['33424', '33425', '33426', '33435', '33436', '33437', '33472', '33473'],
    nearby: ['delray-beach', 'west-palm-beach', 'boca-raton'],
    faqs: [
      {
        q: 'Everyone in my community says to set the AC to 80 for the summer. Is that wrong?',
        a: 'For humidity control, yes, and it is the most widespread piece of bad advice in South Florida. Air conditioners dehumidify as a function of run time. At 80°F set point in a July Boynton summer, a unit runs very little, so it removes very little moisture, and interior humidity climbs into the seventies. Set a humidity target instead — around 55% RH — or run a standalone dehumidifier. The electricity difference is far smaller than a remediation.',
      },
      {
        q: 'My air handler is old but it still works. Does it need replacing?',
        a: 'Not necessarily, and we do not sell equipment, so we have no reason to push you toward one. What we assess is the condition of the components: whether the coil can be cleaned, whether the pan and drain are sound, whether the cabinet insulation is intact, and whether the plenum is porous material at end of life. Frequently the equipment is fine and the plenum is the problem. Occasionally the cabinet insulation itself is colonized, and then replacement is the honest answer.',
      },
      {
        q: 'Do you work with community associations and property managers?',
        a: 'Regularly. We provide certificates of insurance, licensing documentation, written scopes suitable for board review, and we work within community contractor hours. When several units in one building report the same problem, we will also tell the board when we think it is a building-level cause rather than five separate unit problems.',
      },
          {
        q: 'Our Florida room is not air conditioned. Is that a problem?',
        a: 'It can be, and it is a common one in this housing stock. An unconditioned enclosed room sits near outdoor humidity while the wall it shares with the house is being cooled from the other side — which puts a cool surface in contact with very humid air, which is the definition of a condensation plane. Either condition the room, ventilate it properly to the outside, or make sure the shared wall is genuinely sealed and insulated.',
      },
    ],
  },

  {
    slug: 'wellington',
    /** Shares `lake-lot-homes` with Pembroke Pines — both are drained-wetland
     *  lake-lot housing, which is genuinely what the copy describes on each.
     *  `focus` shifts the crop so they do not read as the same photo twice. */
    media: { image: 'lake-lot-homes', focus: '70% 45%' },
    name: 'Wellington',
    county: 'Palm Beach',
    title: 'Mold Remediation Wellington FL | Equestrian Properties',
    description:
      'Mold remediation in Wellington FL. Palm Beach Polo, Grand Prix Village, Binks Forest. Eight-month seasonal vacancy, barns, tack rooms and staff quarters.',
    lede:
      'Wellington runs on an inverted calendar. The season is January through April, and a great many houses, barns and staff apartments here sit closed for the other eight months — which happen to be the wet ones.',
    short: 'An inverted calendar: the season is January to April, and the empty months are the wet ones.',
    intro: [
      'Everywhere else we work, the seasonal pattern is a snowbird condo empty from May to October. Wellington is the same problem stretched longer and applied to more buildings. The Winter Equestrian Festival brings the population in around January and it leaves again in April, which means the typical property here is shut through the entire wet season rather than most of it.',
      'The ground does not help. Wellington was built on the former Flying Cow Ranch — drained wetland threaded with an extensive canal network, with a water table high enough that it is a genuine factor at the slab edge on canal-adjacent lots. The housing on top of it is mostly 1990s and 2000s: tight, code-current, well built, and completely dependent on mechanical dehumidification because the envelope gives interior moisture no other way out.',
      'And Wellington has a building type nobody else on this site has. Barns, tack rooms, feed rooms, and grooms’ apartments are small conditioned spaces packed with leather, blankets, feed and bedding — highly organic contents, modest air conditioning, and almost no one checking them in July.',
    ],
    watchHeadline: 'What we see most often in Wellington',
    watch: [
      { term: 'Eight-month vacancy through the wet season', text: 'The defining Wellington problem. A property closed in April and reopened in December has sat through the entire hot, wet half of the year. A humidity setpoint is not optional here — it is the whole game.' },
      { term: 'Tack rooms and feed storage', text: 'Leather, wool coolers, blankets, grain and bedding in a small conditioned room. If that room’s air conditioning is switched off with the main house, it is the first thing on the property to grow.' },
      { term: 'Staff and guest apartments over barns', text: 'Usually served by a single mini-split that gets turned off when the apartment is empty. Small sealed volume, no dehumidification, five months.' },
      { term: 'Tight 1990s and 2000s envelopes with oversized systems', text: 'Same physics as the newer west-county housing: the house does not leak, so short cycles mean the air conditioner never runs long enough to pull latent heat.' },
      { term: 'Canal-adjacent slab edges', text: 'A high water table on lots that back onto the canal network. Shows up at the base of exterior walls and under any flooring installed over the slab that blocks upward drying.' },
      { term: 'Multiple structures, one thermostat strategy', text: 'A main house, a guest house, a barn and an apartment often get managed as if they were one building. They have four different loads and four different risks.' },
    ],
    neighborhoods: [
      'Palm Beach Polo', 'Grand Prix Village', 'Olympia', 'Binks Forest', 'Black Diamond',
      'Versailles', 'Isles at Wellington', 'Sugar Pond Manor', 'Wellington Trace',
      'Paddock Park', 'Little Ranches', 'Southfields', 'Saddle Trail Park',
    ],
    zips: ['33414', '33449', '33467', '33470'],
    nearby: ['west-palm-beach', 'boynton-beach', 'boca-raton'],
    faqs: [
      {
        q: 'The place is only used for the season. What should we do when we leave in April?',
        a: 'Set a humidity target rather than a temperature — around 55% RH — and make sure every conditioned structure on the property has one, not just the main house. Service the air conditioning on the way out rather than on the way back, and have somebody physically inside monthly reading the humidity. Eight months is long enough that a small drift becomes a large problem, and this is almost entirely preventable.',
      },
      {
        q: 'Does the tack room really need the same attention as the house?',
        a: 'Arguably more. It is a small sealed volume full of leather, wool and feed — about as organic as building contents get — usually with the least capable air conditioning on the property and nobody opening the door for months. When we get called out to a Wellington barn, the tack room is where we start.',
      },
      {
        q: 'We have a barn apartment with its own mini-split. Can we just switch it off?',
        a: 'Not for the summer. A mini-split serving an empty apartment costs very little to run at a humidity setpoint, and switching it off entirely in May is the most reliable way to have a remediation quote waiting for you in December. If the unit cannot hold a humidity setpoint, a small standalone dehumidifier with a drain line does the job.',
      },
      {
        q: 'Our lot backs onto a canal. Is that a problem?',
        a: 'It raises the water table at the slab edge, which matters for the base of exterior walls and for anything installed over the slab that stops it drying upward — vinyl plank over original tile is the usual culprit. It does not meaningfully change your indoor humidity by itself. That is still the envelope and the air conditioning.',
      },
    ],
  },

  {
    slug: 'riviera-beach',
    /** Shares `coastal-condo` with Pompano Beach — both pages lead on oceanfront
     *  condominium stock. Different county grids. */
    media: { image: 'coastal-condo', focus: '65% 40%' },
    name: 'Riviera Beach',
    county: 'Palm Beach',
    title: 'Mold Remediation Riviera Beach FL | Singer Island Towers',
    description:
      'Mold remediation in Riviera Beach and Singer Island. High-rise fan coil units, ceiling-plenum condensate, window wall leaks and 1950s mainland CBS stock.',
    lede:
      'Singer Island is the tallest housing we work in, and above about eight stories the mechanical system stops looking like a house and starts looking like a building. That changes where the water is.',
    short: 'The tallest housing we work in. Above about eight stories the water is somewhere else entirely.',
    intro: [
      'Everywhere else in these two counties, an air conditioner is a split system: an [air handler](/services/hvac-air-conditioner-mold-remediation/) in a closet and a condenser outside. In the Singer Island towers a large share of units are served by fan coil units instead — a compact coil-and-blower assembly fed with chilled water from central plant, often tucked above a ceiling in a hallway soffit or into a narrow mechanical closet, with a condensate pan that drains to a shared riser or to a small pump.',
      'That arrangement moves the risk. A pan above a ceiling that overflows does not stain a closet floor, it comes through the ceiling — sometimes into the unit below rather than your own. Condensate pumps fail quietly and nobody hears them. And the pan and coil are behind drywall rather than behind an access panel, so nothing about them gets looked at until something drips.',
      'The mainland is a different city. West of the Intracoastal the stock is largely 1950s through 70s concrete block single-family — modest, low slabs, retrofitted central air — and it behaves much like east Fort Lauderdale. We work both sides, but the questions people ask are not the same on each.',
    ],
    watchHeadline: 'What we see most often in Riviera Beach',
    watch: [
      { term: 'Fan coil pans above ceilings', text: 'A pan in a soffit or a ceiling plenum that overflows drains into the drywall rather than onto a floor. The first symptom is frequently a stain in a neighbor’s unit, not yours.' },
      { term: 'Condensate pumps that fail silently', text: 'Where gravity drainage is not available, a small pump moves the condensate. When it stops there is no noise and no alarm — just a pan filling up.' },
      { term: 'Window wall and slider sealant at height', text: 'Wind-driven rain at fifteen stories behaves nothing like it does at ground level. Failed sealant on a window wall shows up at the base of the interior wall several feet away.' },
      { term: 'Stack effect in tall buildings', text: 'A tall building moves air vertically through its own pressure gradient. Corridors, elevator shafts and stairwells drive humid air into units in ways a single-family house never does, and it is a building-level problem rather than a unit one.' },
      { term: 'Salt corrosion at elevation', text: 'Oceanfront exposure on the upper floors is harder on equipment than it is at street level. Pitted coils hold moisture and debris that clean fins do not.' },
      { term: 'Mainland 1950s–70s CBS stock', text: 'West of the Intracoastal it is a conventional split-system story: low slabs, interior-closet air handlers, undersized returns.' },
    ],
    neighborhoods: [
      'Singer Island', 'Ocean Walk', 'Riviera Beach Marina District', 'Monroe Heights',
      'Inlet Cove', 'Newcomb Hall', 'Lakeshore', 'Cypress Village', 'Port District',
      'Blue Heron Corridor', 'Ibis Isle', 'Peanut Island area',
    ],
    zips: ['33403', '33404', '33407', '33410', '33419'],
    nearby: ['west-palm-beach', 'jupiter', 'lake-worth-beach'],
    faqs: [
      {
        q: 'The stain is in my ceiling but the unit above says they have no leak. Who is right?',
        a: 'Both of you might be. In a tower with fan coil units above the ceilings, the pan that overflowed may sit in the plenum between your two units and belong to neither of you — it can be a common element. That is worth establishing before either owner starts paying for anything, because it changes who is responsible and who their insurer is.',
      },
      {
        q: 'What is a fan coil unit and why does it matter?',
        a: 'It is a coil and blower fed with chilled water from the building’s central plant rather than by its own refrigerant loop. It matters here for two practical reasons: it is usually mounted above a ceiling or in a sealed soffit rather than behind an access panel, so nobody inspects it; and its condensate often depends on a small pump rather than gravity. Both mean problems are found late.',
      },
      {
        q: 'Our building has had several units report the same smell. Is that the building?',
        a: 'In a tall building, very likely. Stack effect moves air vertically through corridors and shafts, so a source in a mechanical space or a wet riser can present in units that are nowhere near it. When several units report the same thing, the useful next step is a building-level look rather than several owners each remediating separately.',
      },
      {
        q: 'Do you work on the mainland side as well as Singer Island?',
        a: 'Both sides, and they are close to separate trades. Practically it changes who we talk to before anything starts: on Singer Island the building has a manager, a declaration, and rules about access and hours, so the first conversation is rarely with the person who owns the unit. On the mainland it is a homeowner and a driveway. Same standard, same clearance requirement, quite different first phone call.',
      },
    ],
  },

  {
    slug: 'palm-beach-gardens',
    /** `broward-street` is 1960s CBS ranch under mature canopy, which is exactly
     *  the original MacArthur Plat housing this page leads on. Not used
     *  anywhere in the Palm Beach grid. */
    media: { image: 'broward-street', focus: '45% 55%' },
    name: 'Palm Beach Gardens',
    county: 'Palm Beach',
    title: 'Mold Remediation Palm Beach Gardens FL | Preserve Lots',
    description:
      'Mold remediation in Palm Beach Gardens. PGA National, BallenIsles, Mirasol, Evergrene and the original MacArthur Plats. Preserve-edge and shaded-wall growth.',
    lede:
      'The recurring problem in Palm Beach Gardens is an exterior wall that has not seen direct sun in twenty years — because of what the house backs onto, or because of what was planted around it and then left to fill in.',
    short: 'Exterior walls that have not seen direct sun in twenty years, by aspect or by what was planted.',
    intro: [
      'The city was developed by the MacArthur Foundation starting in 1959, and the original Plats still read that way: modest concrete block ranches on generous lots, laid out with a lot of tree planting. Sixty years on, that planting is a mature canopy, and a north or east elevation under heavy shade never gets the solar drying that keeps a South Florida wall surface in check.',
      'Layered on top is the 1980s-onward gated build-out — PGA National, BallenIsles, Frenchman’s Reserve, Mirasol, Evergrene, Old Palm — much of it backing onto preserve. A lot on a preserve edge has dense vegetation growing right up against the building, no air movement at the wall, continuous leaf litter at the base, and irrigation running into all of it.',
      'That combination produces something we see here more than anywhere else in the two counties: growth that starts on the outside of the building and works in, rather than starting at the [air handler](/services/hvac-air-conditioner-mold-remediation/) and working out. It is a genuinely different diagnosis, and it gets misread as an interior problem regularly.',
    ],
    watchHeadline: 'What we see most often in Palm Beach Gardens',
    watch: [
      { term: 'Preserve-edge exterior walls', text: 'Dense vegetation against the building, no air movement, leaf litter held at the slab edge. The wall stays damp and the stucco surface never dries.' },
      { term: 'Mature canopy over the older Plats', text: 'Sixty years of tree growth on a lot laid out in 1962. Shade that was pleasant in 1985 is a permanently wet north elevation now.' },
      { term: 'Irrigation overspray onto stucco', text: 'Heads adjusted years ago and never revisited, wetting a wall two or three times a week indefinitely. It is the cheapest fix on this list and almost nobody checks it.' },
      { term: 'Seasonal vacancy in the gated communities', text: 'Same physics as Boca and Wellington — a house closed May to November without a humidity setpoint.' },
      { term: 'Northern-county water table', text: 'Closer to the Loxahatchee slough than most of our service area, and it shows at the slab edge on the western communities.' },
      { term: 'Second-floor and attic-adjacent air handlers', text: 'Standard in the two-story gated stock. A pan overflow lands in the ceiling below rather than on a floor.' },
    ],
    neighborhoods: [
      'PGA National', 'BallenIsles', 'Mirasol', 'Frenchman’s Reserve', 'Frenchman’s Creek',
      'Evergrene', 'Old Palm', 'Garden Lakes', 'Steeplechase', 'Eastpointe',
      'Sandalwood', 'The Oaks', 'Gardens of Woodberry',
    ],
    zips: ['33403', '33408', '33410', '33412', '33418', '33420'],
    nearby: ['jupiter', 'riviera-beach', 'west-palm-beach'],
    faqs: [
      {
        q: 'The growth is on the outside of the house. Is that still a problem?',
        a: 'It is a different problem, and often a cheaper one. Surface growth on shaded stucco is largely a drying and cleaning question rather than a remediation question — the fix is usually cutting vegetation back, correcting irrigation, and washing the surface, not opening a wall. What matters is establishing that it has stayed outside, because a wall that is permanently damp on one face will eventually be a problem on the other.',
      },
      {
        q: 'Our lot backs onto preserve. Should we cut everything back?',
        a: 'Not everything, and much of it you cannot — preserve areas are typically protected and the association or the city will have rules about what can be touched. What you can usually do is keep your own planting off the building, clear leaf litter from the slab edge, and get irrigation heads pointed at the ground rather than at the stucco. That is most of the benefit.',
      },
      {
        q: 'We are in one of the original Plat neighborhoods. Does the age matter?',
        a: 'The houses are sound — 1960s concrete block is durable and the lots are generous. What has changed is everything planted around them. A canopy that took sixty years to fill in has quietly turned a couple of elevations into permanently shaded surfaces, and that is a landscaping conversation before it is a building one.',
      },
      {
        q: 'Is this the same problem as mold in the air handler?',
        a: 'No, and it is worth separating them because the diagnosis and the cost are different. Preserve-edge and shaded-wall growth starts outside and works in. Air handler growth starts at the coil and gets distributed through the ducts to every room. A musty smell that tracks with the air conditioning cycle points at the second one regardless of what the exterior wall looks like.',
      },
    ],
  },

  {
    slug: 'jupiter',
    media: { image: 'neotraditional' },
    name: 'Jupiter',
    county: 'Palm Beach',
    title: 'Mold Remediation Jupiter FL | Tight New Construction',
    description:
      'Mold remediation in Jupiter FL. Abacoa, Jupiter Farms, Admirals Cove, Egret Landing. Tight modern envelopes, coastal salt exposure, and well-water properties.',
    lede:
      'Jupiter is the newest housing stock we work in, and new construction has its own mold profile. Tight houses do not forgive an oversized air conditioner.',
    short: 'The newest housing stock we work in. Tight houses do not forgive an oversized air conditioner.',
    intro: [
      'Abacoa came out of the ground starting in 1998, Egret Landing and the Central Boulevard corridor filled in around the same era, and much of what is east of Alternate A1A has been rebuilt or heavily renovated since. This is post-Andrew, post-2001-code construction: tight envelopes, good windows, better insulation, and substantially less accidental air exchange than anything in the older markets to the south.',
      'That is a good thing for energy and a demanding thing for moisture. A tight house has no passive way to shed interior humidity. If the air conditioner is correctly sized and running long cycles, the house stays at 50% RH and everything is fine. If it is oversized — and oversizing is still the default in new residential installs — the house runs cold and damp, and the mold shows up in closets, behind furniture on exterior walls, and around the AC registers.',
      'Jupiter Farms is a separate case entirely: large lots, well water, septic, and a fair amount of modular and manufactured housing. Well water with high iron and sulfur, condensation on uninsulated supply piping, and crawl-adjacent construction produce problems that do not exist five miles east.',
    ],
    watchHeadline: 'What we see most often in Jupiter',
    watch: [
      { term: 'Oversized equipment in tight houses', text: 'Short cycles, cold clammy interiors, and 65% RH at a 73°F thermostat reading. Extremely common in the Abacoa-era stock.' },
      { term: 'Closets and furniture-backed exterior walls', text: 'The first surfaces to go in a high-humidity house, because they have poor air circulation and sit slightly cooler than the room.' },
      { term: 'Coastal salt corrosion near the Inlet', text: 'Condenser and coil degradation east of A1A, in Jupiter Inlet Colony, and along the waterfront in Admirals Cove.' },
      { term: 'Jupiter Farms well-water and septic conditions', text: 'Uninsulated supply piping sweating in wall cavities, and a different construction vocabulary from the planned communities.' },
      { term: 'Missing whole-house dehumidification', text: 'The single most under-installed piece of equipment in new Florida construction, and often the actual solution.' },
          { term: 'Second-floor laundry rooms', text: 'Standard in the newer two-story plans. A braided supply hose that fails upstairs discharges into the ceiling of whatever is below it, and unlike a ground-floor failure there is no floor drain and nothing to contain it.' },
    ],
    neighborhoods: [
      'Abacoa', 'Jupiter Farms', 'Admirals Cove', 'Jupiter Inlet Colony', 'Egret Landing',
      'Jupiter Country Club', 'Maplewood', 'Indian Creek', 'The Bluffs', 'Jonathan’s Landing',
      'Ocean Walk', 'Pennock Point',
    ],
    zips: ['33458', '33468', '33469', '33477', '33478'],
    nearby: ['west-palm-beach', 'boca-raton', 'delray-beach'],
    faqs: [
      {
        q: 'My house was built in 2015. Why is the humidity so high?',
        a: 'Because it was built well. A tight, code-current house has very little uncontrolled air exchange, so the air conditioner is the only mechanism removing interior moisture — and an oversized system satisfies the thermostat before it has run long enough to do that. We measure indoor RH and dew point over a full day rather than taking a spot reading, and the fix in newer Jupiter homes is frequently a whole-house dehumidifier and a fan-profile change rather than any remediation at all.',
      },
      {
        q: 'Does being near the Inlet or the ocean cause mold?',
        a: 'Salt air is hard on equipment — condenser coils, fin packs, and any exposed metal degrade faster east of A1A. A corroded coil holds debris and moisture differently and is harder to clean effectively. But proximity to the water does not raise your indoor humidity on its own. That is still a function of the envelope and the air conditioning.',
      },
      {
        q: 'Do you cover Jupiter Farms and Tequesta?',
        a: 'Yes. Jupiter Farms takes a bit longer to reach and the construction out there is genuinely different from Abacoa, so we schedule accordingly. Tequesta, Juno Beach, Palm Beach Gardens, and North Palm Beach are all inside our normal service area.',
      },
          {
        q: 'Our washing machine is upstairs. Should we be doing anything about that?',
        a: 'Three cheap things. Replace braided stainless supply hoses on a schedule rather than waiting — they fail without warning and they are the most common sudden [water loss](/services/water-damage-mold-cleanup/) we see. Put the machine in a drain pan that is actually plumbed to a drain rather than one that just sits there. And if the house is ever empty for more than a few days, shut the laundry valves; a quarter turn costs nothing and removes the whole category of risk.',
      },
    ],
  },
];

export const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]));

export const counties = [
  {
    name: 'Broward County',
    short: 'Broward',
    blurb:
      'Our densest coverage area, from Hallandale Beach up to the Palm Beach line and west to the Sawgrass. Older CBS housing on the east side, 1980s and 90s tract housing west of the Turnpike.',
    areas: areas.filter((a) => a.county === 'Broward'),
    /** Cities we cover that do not have their own page yet. */
    alsoServing: [
      'Sunrise', 'Davie', 'Tamarac', 'Margate',
      'Coconut Creek', 'Oakland Park', 'Wilton Manors', 'Lauderhill',
      'Lauderdale Lakes', 'North Lauderdale', 'Dania Beach', 'Hallandale Beach',
      'Cooper City', 'Parkland', 'Southwest Ranches', 'Lighthouse Point', 'Sea Ranch Lakes',
    ],
  },
  {
    name: 'Palm Beach County',
    short: 'Palm Beach',
    blurb:
      'From the Broward line north to Jupiter and west past the Turnpike. A wide spread of building ages — 1920s historic in West Palm, 1970s condo belt through the middle, and post-1998 construction in the north.',
    areas: areas.filter((a) => a.county === 'Palm Beach'),
    alsoServing: [
      'Royal Palm Beach', 'North Palm Beach', 'Greenacres', 'Palm Springs', 'Tequesta', 'Juno Beach', 'Lantana',
      'Highland Beach', 'Ocean Ridge', 'Gulf Stream', 'Manalapan', 'Loxahatchee',
      'Palm Beach', 'Atlantis', 'Haverhill', 'Jupiter Farms',
    ],
  },
];

export default areas;
