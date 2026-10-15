/* Service areas. Profiles are drawn from the local-area research (ABS 2021
 * Census QuickStats, Redland City Council, Queensland Places, Queensland
 * Heritage Register). Figures should be spot-checked against the linked
 * sources before launch — see docs/LAUNCH-CHECKLIST.md. Housing materials are
 * deliberately not claimed: no authoritative source was found for them. */

export const AREAS = [
  {
    slug: 'redland-bay', name: 'Redland Bay', postcode: '4165', ll: [-27.611, 153.300], home: true,
    intro: 'Stride is based in Redland Bay, so this is the area we know best — and the one we can usually get to quickest.',
    profile: [
      'Redland Bay sits on the shore of southern Moreton Bay. It was farming country for a long time before suburban development, and today it is overwhelmingly a suburb of family homes: separate houses made up 94.3% of occupied dwellings at the 2021 Census, well above the Queensland figure.',
      'Being close to the water changes what happens to a property. Salt-laden air settles on everything, and on sheltered surfaces that rain doesn’t reach — eaves, the undersides of gutters, window frames — it isn’t washed off. Combine that with summer humidity and the shaded southern side of a house, and organic growth gets a strong start.'
    ],
    watch: ['Salt film on sheltered surfaces close to the bay', 'Growth on the shaded southern side of the house', 'Large driveways that need an even pass, not a hard one'],
    facts: [['Postcode', '4165'], ['Private dwellings (2021)', '6,268'], ['Separate houses', '94.3%'], ['Bay frontage', 'Southern Moreton Bay']],
    sources: [['2021 Census QuickStats: Redland Bay — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/SAL32410'], ['Redland Bay — Redland City Council', 'https://www.redland.qld.gov.au/info/20125/our_suburbs_and_islands/171/redland_bay']],
    nearby: ['victoria-point', 'mount-cotton', 'thornlands'], focus: ['house', 'driveway', 'window', 'roof']
  },
  {
    slug: 'victoria-point', name: 'Victoria Point', postcode: '4165', ll: [-27.583, 153.300],
    intro: 'Victoria Point faces Coochiemudlo Island across the bay, and a lot of its housing is built around outdoor living.',
    profile: [
      'Victoria Point grew from a farming district on fertile red soil into a bayside suburb, with conservation land on Point Halloran and wetlands nearby. At the 2021 Census there were 5,802 occupied private dwellings, about four in five of them separate houses.',
      'Pools, covered alfresco areas and paved surrounds are the surfaces that matter most here, because they are the ones people walk on barefoot and the ones that go slippery first. Waterfront homes carry the same salt-air load as Redland Bay.'
    ],
    watch: ['Pool coping and surrounds going slippery', 'Salt film on glass and frames near the water', 'Covered alfresco areas that stay damp'],
    facts: [['Postcode', '4165'], ['Occupied dwellings (2021)', '5,802'], ['Separate houses', '80.8%'], ['Faces', 'Coochiemudlo Island']],
    sources: [['2021 Census QuickStats: Victoria Point — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/SAL32943'], ['Victoria Point — Queensland Places', 'https://www.queenslandplaces.com.au/victoria-point']],
    nearby: ['redland-bay', 'thornlands', 'cleveland'], focus: ['pool', 'patio', 'window', 'house']
  },
  {
    slug: 'cleveland', name: 'Cleveland', postcode: '4163', ll: [-27.527, 153.265],
    intro: 'Cleveland has more varied housing than most of the Redlands — and so more varied surfaces.',
    profile: [
      'Cleveland sits on a headland in Moreton Bay, with the 1864 lighthouse at Cleveland Point and the Raby Bay canal estate built on reclaimed foreshore between 1984 and 1997. In 2021, separate houses made up 60.4% of occupied dwellings and flats or apartments 19.5% — a far more mixed picture than the surrounding suburbs.',
      'That mix is the interesting part. An established home with a painted exterior and mature trees in the gutters needs genuinely different treatment from a newer townhouse with rendered walls and a porcelain alfresco. Canal-front and waterfront homes sit right in the salt air.'
    ],
    watch: ['Leaf litter in gutters from established trees', 'Growth on shaded paths and paving', 'Older painted exteriors that want soft washing, not pressure'],
    facts: [['Postcode', '4163'], ['Private dwellings (2021)', '7,260'], ['Separate houses', '60.4%'], ['Canal estate', 'Raby Bay']],
    sources: [['2021 Census QuickStats: Cleveland — ABS', 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/SAL30622'], ['Cleveland — Redland City Council', 'https://www.redland.qld.gov.au/info/20125/our_suburbs_and_islands/164/cleveland']],
    nearby: ['ormiston', 'thornlands', 'alexandra-hills'], focus: ['house', 'gutter', 'patio', 'window']
  },
  {
    slug: 'thornlands', name: 'Thornlands', postcode: '4164', ll: [-27.558, 153.264],
    intro: 'Thornlands has grown quickly, and its newer estates come with a particular set of surfaces.',
    profile: [
      'Once pineapple and strawberry country, Thornlands is one of the fastest-growing suburbs on the Redlands Coast. It is younger than the Redlands average (median age 36 in 2021) with larger households, and separate houses make up close to nine in ten homes.',
      'Newer doesn’t mean immune. Large driveways, wide entry paths and big alfresco slabs show unevenness clearly, and a five-year-old slab in this climate has already collected enough to be a few shades off where it started.'
    ],
    watch: ['Large plain and exposed-aggregate driveways', 'Wide alfresco slabs and entry paths', 'Newer render that shows uneven cleaning immediately'],
    facts: [['Postcode', '4164'], ['Private dwellings (2021)', '6,779'], ['Median age', '36'], ['Separate houses', '87.3% (SA2)']],
    sources: [['2021 Census QuickStats: Thornlands (SA2) — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/301021012'], ['Thornlands — Redland City Council', 'https://www.redland.qld.gov.au/info/20125/our_suburbs_and_islands/180/thornlands']],
    nearby: ['cleveland', 'victoria-point', 'redland-bay'], focus: ['driveway', 'house', 'patio', 'window']
  },
  {
    slug: 'capalaba', name: 'Capalaba', postcode: '4157', ll: [-27.523, 153.193],
    intro: 'Capalaba sits back from the bay, and the tree cover is heavier than it is closer to the water.',
    profile: [
      'Capalaba is the western gateway to the Redlands, on Tingalpa Creek near the Leslie Harrison Dam. Bushland corridors and designated koala areas run through it, and at the 2021 Census it had about 18,000 residents in 7,221 private dwellings.',
      'More trees means two things for an exterior. Gutters fill faster, particularly under gums and overhanging cover. And large parts of a property stay in shade for most of the day, so paths, patios and the southern wall hold moisture and go green well before the sunny side does.'
    ],
    watch: ['Gutters filling from heavy tree cover', 'Shaded side paths going green early', 'Long driveways with more surface than they look'],
    facts: [['Postcode', '4157'], ['Residents (2021)', '18,002'], ['Private dwellings', '7,221'], ['Waterway', 'Tingalpa Creek']],
    sources: [['2021 Census QuickStats: Capalaba — ABS', 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/SAL30524'], ['Capalaba — Queensland Places', 'https://www.queenslandplaces.com.au/capalaba']],
    nearby: ['alexandra-hills', 'birkdale', 'brisbane'], focus: ['gutter', 'patio', 'driveway', 'roof']
  },
  {
    slug: 'alexandra-hills', name: 'Alexandra Hills', postcode: '4161', ll: [-27.532, 153.223],
    intro: 'Alexandra Hills is a settled suburb, and most of its homes have been there long enough for the exterior to tell you about it.',
    profile: [
      'Planned in the 1960s as a satellite town, Alexandra Hills was the fastest-growing area in the shire by 1976, so much of its housing dates from the late 1960s onwards. It remains strongly detached — 93.5% separate houses in 2021 — with pockets of bushland such as the Windemere Road Bushland Refuge.',
      'Gardens here have had decades to mature, which is lovely and also means overhanging growth against walls, damp corners that never fully dry, and paths that stay slippery through the wetter months.'
    ],
    watch: ['Streaking under gutter joins and window sills', 'Growth in shaded lower walls and joints', 'Slippery paths under mature garden cover'],
    facts: [['Postcode', '4161'], ['Private dwellings (2021)', '6,303'], ['Separate houses', '93.5% (SA2)'], ['Developed', 'Late 1960s onwards']],
    sources: [['2021 Census QuickStats: Alexandra Hills (SA2) — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/301011001'], ['Alexandra Hills timeline — Redland City Council', 'https://www.redland.qld.gov.au/download/downloads/id/3973/alexandra_hills_timeline.pdf']],
    nearby: ['capalaba', 'cleveland', 'birkdale'], focus: ['house', 'roof', 'patio', 'gutter']
  },
  {
    slug: 'wellington-point', name: 'Wellington Point', postcode: '4160', ll: [-27.484, 153.240],
    intro: 'Wellington Point runs out into Moreton Bay, and homes near the point live with bay wind and salt air.',
    profile: [
      'For decades a holiday and recreation area linked by rail, Wellington Point grew into a suburb from the 1970s. It ends in the point where a sand causeway reaches King Island at low tide. In 2021 separate houses made up 88.6% of occupied dwellings, and the median age (43) was older than the state’s.',
      'Bay-facing glass, frames and sheltered surfaces collect a salt film that rain doesn’t shift, and established gardens keep paths and the shaded side of the house damp.'
    ],
    watch: ['Salt film on bay-facing glass and frames', 'Sheltered eaves and gutter undersides', 'Shaded paths under established gardens'],
    facts: [['Postcode', '4160'], ['Private dwellings (2021)', '4,450'], ['Separate houses', '88.6% (SA2)'], ['Landmark', 'King Island causeway']],
    sources: [['2021 Census QuickStats: Wellington Point (SA2) — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/301011006'], ['Wellington Point — Queensland Places', 'https://queenslandplaces.com.au/node/892']],
    nearby: ['ormiston', 'birkdale', 'cleveland'], focus: ['window', 'house', 'patio', 'gutter']
  },
  {
    slug: 'ormiston', name: 'Ormiston', postcode: '4160', ll: [-27.517, 153.257],
    intro: 'Ormiston sits on the bay between Wellington Point and Cleveland, mostly residential and edged with conservation land.',
    profile: [
      'Named after Captain Louis Hope’s 1860s estate — where Queensland’s first commercially milled sugar was produced — Ormiston is mainly residential, with significant open space bordering Moreton Bay. Its median age in 2021 was 47, and about three in four homes were separate houses.',
      'Bay-side homes and those backing onto bushland both see the same thing: surfaces that stay damp and shaded for longer, and gutters that collect more than you’d expect.'
    ],
    watch: ['Gutters near bushland and mature trees', 'Damp, shaded paving and walls', 'Salt film on glass near the foreshore'],
    facts: [['Postcode', '4160'], ['Private dwellings (2021)', '2,565'], ['Median age', '47 (SA2)'], ['Heritage', 'Ormiston House, c.1860s']],
    sources: [['2021 Census QuickStats: Ormiston (SA2) — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/301021008'], ['Ormiston House Estate — Queensland Heritage Register', 'https://apps.des.qld.gov.au/heritage-register/detail/?id=600775']],
    nearby: ['wellington-point', 'cleveland', 'alexandra-hills'], focus: ['gutter', 'house', 'patio', 'window']
  },
  {
    slug: 'birkdale', name: 'Birkdale', postcode: '4159', ll: [-27.497, 153.215],
    intro: 'Birkdale runs from Tingalpa Creek to Wellington Point and fronts Waterloo Bay.',
    profile: [
      'Largely rural until the 1960s, Birkdale grew quickly into a suburb and includes the Aquatic Paradise canal estate, begun in 1986. The Birkdale Community Precinct keeps around 40 hectares of protected bushland. In 2021 it had about 15,200 residents, with separate houses making up 84.8% of homes.',
      'Canal and bay-front homes sit in the salt air; homes near the bushland and creek corridors deal with leaf litter and shade.'
    ],
    watch: ['Salt film on canal and bay-front homes', 'Leaf litter near bushland and creeks', 'Driveways and paths in shade'],
    facts: [['Postcode', '4159'], ['Residents (2021)', '15,230'], ['Separate houses', '84.8% (SA2)'], ['Canal estate', 'Aquatic Paradise']],
    sources: [['2021 Census QuickStats: Birkdale (SA2) — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/301011003'], ['Birkdale — Redland City Council', 'https://www.redland.qld.gov.au/info/20125/our_suburbs_and_islands/154/birkdale']],
    nearby: ['wellington-point', 'capalaba', 'alexandra-hills'], focus: ['house', 'driveway', 'gutter', 'window']
  },
  {
    slug: 'mount-cotton', name: 'Mount Cotton', postcode: '4165', ll: [-27.618, 153.222],
    intro: 'Mount Cotton is inland, hilly and heavily treed — a different exterior climate from the bayside suburbs.',
    profile: [
      'Redland City Council describes Mount Cotton as rural-lifestyle country, with residential pockets set among native bush including Venman Bushland National Park. It is almost entirely detached housing (99.6% separate houses in 2021) and young, with a median age of 34.',
      'Away from the bay there’s less salt, but far more leaf litter and shade. Gutters, roofs under overhanging branches and long shaded driveways are where the work usually is.'
    ],
    watch: ['Gutters and roofs under heavy tree cover', 'Long, shaded driveways', 'Moss and lichen on shaded roof faces'],
    facts: [['Postcode', '4165'], ['Residents (2021)', '7,302'], ['Separate houses', '99.6%'], ['Bushland', 'Venman Bushland NP']],
    sources: [['2021 Census QuickStats: Mount Cotton — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/SAL31952'], ['Mount Cotton — Redland City Council', 'https://redland.qld.gov.au/info/20125/our_suburbs_and_islands/168/mount_cotton']],
    nearby: ['redland-bay', 'capalaba', 'thornlands'], focus: ['gutter', 'roof', 'driveway', 'house']
  },
  {
    slug: 'brisbane', name: 'Greater Brisbane', postcode: '41xx', ll: [-27.47, 153.10], wide: true,
    intro: 'Stride is based in the Redlands and takes selected work across Greater Brisbane, particularly the bayside and south-east.',
    profile: [
      'Brisbane’s housing is far more varied than any one suburb. Wynnum and Manly grew as bayside resorts and face straight onto Moreton Bay, with a mix of houses, townhouses and apartments; Carindale, inland on Bulimba Creek, is largely detached housing from the 1970s onwards.',
      'Because we’re travelling from the Redlands, Brisbane work depends on the size of the job and how it fits the run. Send the address and what you’d like cleaned and we’ll tell you honestly whether we’re the right people for it.'
    ],
    watch: ['Timber and painted exteriors that need low pressure', 'Bayside salt film in Wynnum and Manly', 'Shared driveways and small courtyards in townhouses'],
    facts: [['Postcodes', '4152–4179 (selected)'], ['Bayside', 'Wynnum, Manly, Lota'], ['Inland', 'Carindale, Belmont'], ['Booking', 'By arrangement']],
    sources: [['2021 Census QuickStats: Manly — ABS', 'https://abs.gov.au/census/find-census-data/quickstats/2021/SAL31748'], ['2021 Census QuickStats: Carindale — ABS', 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/SAL30540'], ['Wynnum/Manly/Lota Foreshores — Brisbane Heritage Register', 'https://heritage.brisbane.qld.gov.au/heritage-places/2041']],
    nearby: ['capalaba', 'birkdale', 'wellington-point'], focus: ['house', 'driveway', 'window', 'gutter']
  }
];
export const AREA_BY_SLUG = Object.fromEntries(AREAS.map((a) => [a.slug, a]));

/* Map markers that aren't full area pages. */
export const MAP_EXTRAS = [
  { name: 'Brisbane CBD', ll: [-27.468, 153.024], muted: true },
  { name: 'Wynnum', ll: [-27.443, 153.173], muted: true },
  { name: 'Carindale', ll: [-27.503, 153.102], muted: true },
  { name: 'Sheldon', ll: [-27.585, 153.208], muted: true }
];

/* Postcode gating for the quote flow (unchanged from the previous build, which
 * flagged it as NOT YET CONFIRMED BY THE OWNER). */
export const POSTCODES = {
  core: { '4157': 'Capalaba, Sheldon', '4158': 'Thorneside', '4159': 'Birkdale', '4160': 'Ormiston, Wellington Point', '4161': 'Alexandra Hills', '4163': 'Cleveland', '4164': 'Thornlands', '4165': 'Redland Bay, Victoria Point, Mount Cotton' },
  discretionary: { '4127': 'Springwood, Daisy Hill, Rochedale South', '4128': 'Shailer Park', '4129': 'Loganholme, Tanah Merah', '4130': 'Carbrook, Cornubia', '4152': 'Camp Hill, Carina', '4153': 'Carindale', '4154': 'Belmont, Chandler, Gumdale', '4155': 'Burbank', '4156': 'Mackenzie', '4170': 'Cannon Hill, Morningside, Seven Hills', '4171': 'Balmoral, Bulimba, Hawthorne', '4172': 'Murarrie', '4173': 'Tingalpa', '4174': 'Hemmant', '4178': 'Wynnum, Manly, Lota', '4179': 'Manly West, Wakerley' },
  excluded: { '4183': 'North Stradbroke Island', '4184': 'Southern Moreton Bay Islands' },
  messages: {
    core: 'We service this area.',
    discretionary: 'You’re just outside our usual run. Send the details and we’ll confirm whether we can get to you.',
    excluded: 'We don’t service this area regularly yet. Leave your details and we’ll be in touch if that changes.',
    unknown: 'We don’t service this area regularly yet. Leave your details and we’ll be in touch if that changes.'
  }
};
