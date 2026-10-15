/* The eight residential services. Copy carried forward from the previous
 * build (already reviewed for honesty) and extended with a spec layer drawn
 * from the education-centre research. */
export const SERVICES = [
  {
    id: 'roof', slug: 'roof-cleaning', n: '01', icon: 'roof',
    name: 'Roof cleaning', short: 'Roofs',
    surfaces: 'Tile · Colorbond', method: 'Soft wash', pressure: 'Low',
    render: 'focus-roof', photo: 'svc-roof',
    title: 'Roof Cleaning in the Redlands & Brisbane',
    metaDesc: 'Low-pressure roof cleaning for tile and Colorbond roofs across the Redlands and Greater Brisbane. Lichen, moss and black streaks removed without blasting.',
    lede: 'A roof is the largest surface on the property and the least forgiving of a heavy hand. Pressure that suits a driveway will strip a tile.',
    body: [
      'Roofs carry lichen, moss and the black streaking that comes from airborne growth settling on porous surfaces. On tile it holds in the texture; on Colorbond it sits in the pan and around fixings. Left long enough, growth lifts and holds moisture against the surface.',
      'The method is decided by the material and its age. Concrete tile that has lost its glaze behaves nothing like a coated steel sheet, and a brittle terracotta roof may not be safe to walk at all. Where a roof cannot be worked safely, we say so rather than improvising.'
    ],
    spec: [['Method', 'Soft wash: apply, dwell, gentle rinse'], ['Pressure', 'Low — never a blaster'], ['Suits', 'Concrete & terracotta tile, Colorbond'], ['Typical time', 'Half to full day']],
    included: ['Roof material, age and condition assessed before any method is chosen', 'Controlled low-pressure application rather than blasting', 'Gutters and downpipes checked for displaced debris afterwards', 'Surrounding surfaces, plants and paths protected and rinsed', 'Anything we find — cracked tiles, rust, failed pointing — reported to you'],
    handles: ['Concrete and terracotta tile', 'Colorbond and Zincalume sheet', 'Ridge capping and valleys', 'Fascia, barge boards and roof edges', 'Whirlybirds and penetrations, worked around'],
    limits: 'Roof cleaning removes growth and staining from the surface. It does not repair the roof. Cracked or slipped tiles, failed pointing, rusted sheeting and deteriorated coatings are identified and reported, but they need a roofer. Roofs that cannot be accessed safely, or that are too brittle to work, are declined rather than attempted.',
    why: 'Monier, one of Australia’s largest roof-tile makers, “strongly advises against the use of pressure washers for roof cleaning.”',
    faqs: [
      ['Can you pressure wash roof tiles?', 'We don’t. Major tile manufacturers advise against pressure washers on roofs because high pressure can damage the tile surface, ridge pointing and coatings, and push water under laps and flashings. A low-pressure soft wash removes the growth without that risk.'],
      ['How often does a roof need cleaning in South-East Queensland?', 'There’s no fixed interval. Shade, overhanging trees, roof material and distance from the bay all change it. Many roofs only need attention every few years, when streaking or lichen becomes obvious or gutters keep filling with grit.'],
      ['Will the black streaks come back?', 'Eventually, yes — it’s airborne growth and the climate here suits it. A thorough clean resets the clock, and keeping overhanging branches trimmed and gutters clear slows the return.']
    ],
    articles: ['roof-cleaning-south-east-queensland', 'pressure-washing-vs-soft-washing', 'gutters-storm-season-seq'],
    upsell: 'gutter-cleaning'
  },
  {
    id: 'house', slug: 'house-washing', n: '02', icon: 'house',
    name: 'House washing', short: 'House washing',
    surfaces: 'Render · cladding · brick', method: 'Soft wash', pressure: 'Low',
    render: 'focus-house', photo: 'svc-house',
    title: 'House Washing in the Redlands & Brisbane',
    metaDesc: 'Soft-wash house exterior cleaning for render, weatherboard, fibre cement and brick across the Redlands and Greater Brisbane. Low pressure, no damage.',
    lede: 'Most house exteriors should never see high pressure. The job is to lift the growth off the surface, not force water behind it.',
    body: [
      'Walls, eaves, soffits and cladding collect a fine layer of airborne dirt, cobwebs and organic growth — usually worst on the shaded southern side. High pressure on these surfaces risks driving water into joints, lifting paint and damaging render.',
      'We use a low-pressure soft-wash approach instead: the surface is treated, given time to work, then rinsed at a pressure the material can take. It’s slower, and it’s the right way to do it.'
    ],
    spec: [['Method', 'Soft wash, then controlled rinse'], ['Pressure', 'Low — fan tip only'], ['Suits', 'Render, weatherboard, fibre cement, brick'], ['Typical time', 'About a day']],
    included: ['Assessment of the wall material and its condition', 'Plants, outdoor furniture and fittings considered before we start', 'Low-pressure application, dwell time, then a controlled rinse', 'Cobweb and nest removal from eaves and corners', 'A walk-around with you at the end'],
    handles: ['Painted weatherboard and fibre cement', 'Rendered and bagged walls', 'Face brick and blockwork', 'Eaves, soffits, fascia and barge boards', 'Garage doors, downpipes and exterior trims'],
    limits: 'Existing damage doesn’t get better under water. Flaking paint, failed sealant, perished render and rotted timber are noted before work starts and may limit what’s possible. Where we think a surface shouldn’t be washed, we’ll say so.',
    why: 'Render maker Rockcote specifies about 500 psi through a fan tip for its systems — and warns that a direct needlepoint jet “may lift the sturdiest finish.”',
    faqs: [
      ['Will soft washing hurt my garden or pets?', 'Plants near the work are wetted down before and rinsed after, run-off is directed away from beds where practical, and pets should be inside while we work. Tell us about anything you’re especially attached to and we’ll plan around it.'],
      ['Can you pressure wash render?', 'Only gently, and only if it’s sound. Render manufacturers specify low pressure through a fan tip; a concentrated jet can lift the finish or drive water into cracks. Soft washing does the cleaning chemically, so force isn’t needed.'],
      ['How often should a house be washed?', 'Manufacturers of render and paint systems suggest light maintenance washes every one to two years. In practice the shaded, humid sides of a Redlands home usually show growth first, and that’s what sets the timing.']
    ],
    articles: ['house-washing-seq-humidity', 'pressure-washing-vs-soft-washing', 'seasonal-exterior-care-calendar-seq'],
    upsell: 'window-cleaning'
  },
  {
    id: 'driveway', slug: 'driveway-cleaning', n: '03', icon: 'grid',
    name: 'Driveways & concrete', short: 'Driveways',
    surfaces: 'Plain · aggregate · pavers', method: 'Rotary surface clean', pressure: 'Set to the slab',
    render: 'focus-driveway', photo: 'svc-driveway', ba: 'driveway',
    title: 'Driveway & Concrete Cleaning in the Redlands & Brisbane',
    metaDesc: 'Driveway and concrete cleaning across the Redlands and Greater Brisbane. Rotary surface cleaning for an even finish on plain, aggregate and paved driveways.',
    lede: 'Driveways take everything the weather and the week can throw at them. A surface cleaner and the right pressure for the slab bring the colour back without chewing up the finish.',
    body: [
      'Concrete is porous. Over a few Queensland summers it collects a film of dirt, organic growth and traffic residue that a hose won’t shift. The result creeps up so slowly that most people stop noticing it — until one section gets cleaned and the difference is obvious.',
      'We use a rotary surface cleaner for open concrete so the pass is even, then detail the edges, expansion joints and awkward corners by hand. Pressure is set to the condition of the slab, not to whatever the machine will do.'
    ],
    spec: [['Method', 'Rotary surface cleaner + hand detailing'], ['Pressure', 'Set to the slab’s condition'], ['Suits', 'Plain, broom, aggregate, pavers'], ['Typical time', 'Around half a day']],
    included: ['Walk-through of the area and an agreed scope before we start', 'Surface-appropriate pressure, set after checking the slab', 'Rotary surface cleaning for even coverage on open concrete', 'Hand detailing of edges, joints and tight corners', 'Rinse-down of the surrounding area once we’re finished'],
    handles: ['Plain and broom-finished concrete', 'Exposed aggregate', 'Concrete pavers and brick paving', 'Stencilled and coloured concrete (assessed first)', 'Garage aprons, kerbs and crossovers'],
    limits: 'Some marks are in the concrete rather than on it. Oil that has soaked in, rust, paint, efflorescence and permanent discolouration may only lighten, and badly deteriorated or previously sealed surfaces can behave unpredictably. We’ll tell you what we expect to achieve before we start rather than after.',
    why: 'A wand held close to concrete can etch visible stripes into the surface. A rotary cleaner spreads the force evenly — which is why big slabs look uniform afterwards.',
    faqs: [
      ['Will pressure cleaning damage my driveway?', 'Not when the pressure matches the surface. Sound concrete handles a surface cleaner well. Older, flaking or poorly finished slabs need less pressure and a slower approach, and we assess that before starting.'],
      ['Can you remove oil stains?', 'Sometimes. Fresh surface oil often lifts with a degreaser and detailing. Oil that has soaked deep into porous concrete usually lightens rather than disappears. We’ll give you a realistic expectation up front.'],
      ['Should I seal my driveway afterwards?', 'It’s optional. A sealer can make future cleaning easier and, on exposed aggregate, help hold stones in place, but it needs reapplying and the wrong product can go patchy. We’ll explain the trade-offs for your surface.']
    ],
    articles: ['driveway-concrete-stains-and-sealing', 'pressure-washing-vs-soft-washing', 'what-affects-the-cost-of-exterior-cleaning'],
    upsell: 'path-patio-cleaning'
  },
  {
    id: 'gutter', slug: 'gutter-cleaning', n: '04', icon: 'gutter',
    name: 'Gutter cleaning', short: 'Gutters',
    surfaces: 'Quad · half-round · box', method: 'Cleared by hand', pressure: 'Flush only',
    render: 'focus-gutter', photo: 'svc-gutter',
    title: 'Gutter Cleaning in the Redlands & Brisbane',
    metaDesc: 'Gutter cleaning across the Redlands and Greater Brisbane before storm season. Debris cleared by hand, downpipes flushed, problems photographed and reported.',
    lede: 'Gutters only matter when it rains — which in South-East Queensland means they matter a lot, very suddenly.',
    body: [
      'Leaves, seed pods, roof grit and nesting material build up quietly through the dry months. The first serious downpour then finds the water going over the edge, back under the fascia, or straight into a blocked downpipe.',
      'We clear the run by hand where access allows, flush the line, and check that downpipes are actually taking water away. You get told what we found — including anything that looks like it needs a plumber or roofer rather than a cleaner.'
    ],
    spec: [['Method', 'Hand clearing, then flush'], ['Best timing', 'Before storm season (Oct–Apr)'], ['Suits', 'Fascia, quad, half-round, box'], ['Typical time', '1–3 hours']],
    included: ['Removal of leaf litter and debris from accessible runs', 'Downpipe outlets checked and flushed', 'Debris bagged and taken away', 'Photos of anything we think you should see', 'A note of any damage, rust or fall issues we spot'],
    handles: ['Standard fascia gutters', 'Half-round and quad profiles', 'Box gutters where safely accessible', 'Downpipe outlets and leaf guards', 'Valley gutters, subject to access'],
    limits: 'Access decides a lot. Single-storey homes with reasonable ground access are straightforward. Two-storey, steep-pitch, tile-edge or hard-to-reach sections are assessed first, and we’ll decline anything that can’t be done safely rather than improvising.',
    why: 'Get Ready Queensland lists clearing gutters, downpipes and drains as a core step in preparing a home for storm season.',
    faqs: [
      ['When should gutters be cleaned in South-East Queensland?', 'Before the storm season — the Bureau of Meteorology treats October to April as the severe-weather season, with southern Queensland’s thunderstorm peak in October to December. Homes under heavy tree cover may need a second clean.'],
      ['Do gutter guards mean I never need cleaning?', 'They reduce it rather than end it. Fine debris, roof grit and seed pods still collect on and under guards, and they need checking — especially before storm season.'],
      ['Will insurance cover damage from blocked gutters?', 'Often not. Many home policies exclude damage caused by poor maintenance, and blocked gutters are a common example. Check your own policy wording.']
    ],
    articles: ['gutters-storm-season-seq', 'seasonal-exterior-care-calendar-seq', 'roof-cleaning-south-east-queensland'],
    upsell: 'roof-cleaning'
  },
  {
    id: 'window', slug: 'window-cleaning', n: '05', icon: 'window',
    name: 'Window cleaning', short: 'Windows',
    surfaces: 'Glass · frames · tracks', method: 'Pure water + hand detail', pressure: 'None',
    render: 'focus-window', photo: 'svc-window',
    title: 'Exterior Window Cleaning in the Redlands & Brisbane',
    metaDesc: 'Exterior window cleaning across the Redlands and Greater Brisbane: glass, frames, sills and tracks, including salt film near the bay.',
    lede: 'Glass is the one exterior surface people look through rather than at, which is why it shows neglect faster than anything else on the house.',
    body: [
      'Exterior glass collects the same airborne film as the walls around it, plus salt closer to the bay and mineral deposit from sprinklers and run-off. Frames and tracks hold grit that scratches the glass if it is dragged across during cleaning.',
      'Glass is cleaned with the frames and tracks, not around them. Where the exterior is being washed at the same time, windows are done after the walls so nothing settles back onto clean glass.'
    ],
    spec: [['Method', 'Pure-water pole + hand detailing'], ['Pressure', 'None'], ['Suits', 'Glass, frames, tracks, balustrades'], ['Typical time', '2–4 hours']],
    included: ['Frames, sills and tracks cleaned, not just the glass', 'Sequenced after house washing where both are in scope', 'Screens handled carefully and refitted', 'Water-fed pole for upper-level glass where access allows', 'A check over the finished glass in daylight before we leave'],
    handles: ['Exterior glass, ground and upper level within safe reach', 'Frames, sills and sliding tracks', 'Security screens, removed where practical', 'Glass balustrades and pool fencing', 'Louvres and awning windows'],
    limits: 'Cleaning removes what is on the glass. It does not remove what is in it. Mineral etching from long-term sprinkler contact, scratches, and the fine pitting that comes from age or salt exposure will not lift. Those are identified at the assessment so you know before rather than after.',
    why: 'Glass maker Pilkington warns that sprinkler water left to dry on glass repeatedly can go beyond a surface deposit and etch the glass itself.',
    faqs: [
      ['Why do my windows have white spots that won’t come off?', 'Usually mineral deposits from sprinkler or bore water. Fresh deposits clean off; long-standing ones can etch into the glass and become permanent. Redirecting sprinklers is the best prevention.'],
      ['Are water-fed poles as good as traditional cleaning?', 'For exterior glass, yes, when done properly. Purified water dries without leaving mineral spots, and it lets upper-storey glass be cleaned from the ground. Frames and tracks are still detailed by hand.'],
      ['Do you clean inside windows?', 'Our focus is exterior surfaces. If you need interior glass too, mention it in your quote request and we’ll tell you what’s possible.']
    ],
    articles: ['window-cleaning-streak-free-bayside', 'house-washing-seq-humidity'],
    upsell: 'house-washing'
  },
  {
    id: 'patio', slug: 'path-patio-cleaning', n: '06', icon: 'path',
    name: 'Paths, patios & outdoor areas', short: 'Paths & patios',
    surfaces: 'Tile · stone · pavers', method: 'Matched to material', pressure: 'Low to moderate',
    render: 'focus-paths', photo: 'svc-paths', ba: 'pavers',
    title: 'Path, Patio & Paver Cleaning in the Redlands & Brisbane',
    metaDesc: 'Paver, tile and natural stone cleaning for paths, patios and alfresco areas across the Redlands and Greater Brisbane. Method matched to the material.',
    lede: 'Outdoor areas don’t usually get dirty in one go. They get darker by a fraction each season until nobody sits out there any more.',
    body: [
      'Paths, courtyards, alfresco areas and pool-adjacent paving hold moisture, especially anywhere shaded or under cover. That’s where organic growth settles in, and it’s also what makes tiles and smooth pavers slippery.',
      'Different materials want different treatment. Tile, travertine, sandstone, timber decking and pavers all behave differently under pressure, so the method is chosen for what’s actually there.'
    ],
    spec: [['Method', 'Chosen per material'], ['Pressure', 'Low (stone) to moderate (pavers)'], ['Suits', 'Tile, travertine, sandstone, pavers'], ['Aftercare', 'Joint sand topped up where needed']],
    included: ['Material identified and a method chosen to suit it', 'Furniture moved where practical and replaced afterwards', 'Even coverage across the area, not just the middle', 'Edges, steps and grout lines detailed by hand', 'Surrounding areas rinsed down'],
    handles: ['Outdoor tiles and porcelain paving', 'Travertine, sandstone and natural stone', 'Concrete and clay pavers', 'Stamped and stencilled concrete', 'Steps, courtyards and covered alfresco areas'],
    limits: 'Natural stone and some tiles are softer than people expect, and older grout can wash out. Where a surface is delicate or already failing, we use a gentler method and set expectations accordingly. Some staining in porous stone is permanent.',
    why: 'On travertine and limestone, acid cleaners dissolve the stone itself — and sealing doesn’t prevent it. Getting the chemistry right matters more than the pressure.',
    faqs: [
      ['What’s the white powder on my pavers?', 'Usually efflorescence — soluble salts carried to the surface as moisture evaporates. Hosing re-dissolves it and it returns as the paving dries; a dry stiff brush is the first step. It generally fades over time.'],
      ['Will cleaning wash out the joint sand?', 'Some, on paved areas. We keep it to a minimum and recommend re-sanding joints where it’s needed, which also helps keep weeds and ants out.'],
      ['Is it safe to use acid on stone?', 'Not on calcareous stone such as travertine or limestone — acids etch it. Sandstone also reacts badly to many acid and alkaline cleaners. We identify the stone before choosing any product.']
    ],
    articles: ['pavers-natural-stone-pool-surrounds', 'timber-decks-fences-cleaning-oiling', 'pressure-washing-vs-soft-washing'],
    upsell: 'pool-surround-cleaning'
  },
  {
    id: 'pool', slug: 'pool-surround-cleaning', n: '07', icon: 'pool',
    name: 'Pool surrounds', short: 'Pool surrounds',
    surfaces: 'Coping · travertine · pavers', method: 'Stone-safe clean', pressure: 'Low to moderate',
    render: 'focus-pool', photo: 'svc-pool', ba: 'poolside',
    title: 'Pool Surround Cleaning in the Redlands & Brisbane',
    metaDesc: 'Pool coping and surround cleaning across the Redlands and Greater Brisbane. Slippery growth removed with a method matched to the stone, run-off managed.',
    lede: 'Pool surrounds are wet, shaded in patches and walked on barefoot. They’re the surfaces where organic growth matters most.',
    body: [
      'Coping, surrounds and the paving that runs back to the house collect a slick film that’s easy to miss when it’s wet and obvious when it dries. It’s also a genuine slip risk in an area where people are barefoot and moving quickly.',
      'The care here is as much about what we protect as what we clean: keeping run-off out of the pool where practical, working around equipment and fencing, and using a method suited to the coping material.'
    ],
    spec: [['Method', 'Matched to the coping material'], ['Pressure', 'Low to moderate'], ['Protects', 'Pool water, equipment, fencing'], ['Typical time', '2–4 hours']],
    included: ['Coping material identified and matched to a method', 'Run-off managed away from the pool where practical', 'Pool equipment and fencing worked around, not over', 'Even coverage across the full surround', 'Edges and steps detailed by hand'],
    handles: ['Pool coping and bullnose edging', 'Travertine and stone surrounds', 'Concrete and paver pool decks', 'Adjoining paths and alfresco areas', 'Fence lines and equipment surrounds'],
    limits: 'We’re exterior cleaners, not pool technicians — we don’t service, drain or chemically balance pools. Some run-off is unavoidable on a tight surround; where that’s the case we’ll flag it before starting so you can plan a filter run.',
    why: 'Salt-water pools splash salt onto surrounding stone. Rinsing coping regularly reduces the salt crystallisation that can make some stone spall.',
    faqs: [
      ['Will cleaning affect my pool water?', 'We keep run-off away from the pool where practical. On tight surrounds some is unavoidable, so we’ll flag it beforehand and you may want to run the filter or check the chemistry afterwards.'],
      ['Can you make my pool surround less slippery?', 'Removing the organic film is the biggest single improvement. Slip resistance also depends on the material and finish itself, which cleaning can’t change.'],
      ['Do you service pools?', 'No. We clean the surrounds, coping and paving — pool equipment and water chemistry are for a pool technician.']
    ],
    articles: ['pavers-natural-stone-pool-surrounds', 'pressure-washing-vs-soft-washing'],
    upsell: 'path-patio-cleaning'
  },
  {
    id: 'solar', slug: 'solar-panel-cleaning', n: '08', icon: 'solar',
    name: 'Solar panel cleaning', short: 'Solar panels',
    surfaces: 'Panel glass · frames', method: 'Deionised water, soft brush', pressure: 'None',
    render: 'focus-solar', photo: null,
    title: 'Solar Panel Cleaning in the Redlands & Brisbane',
    metaDesc: 'Solar panel cleaning across the Redlands and Greater Brisbane with deionised water and a soft brush. No pressure, no detergent, no thermal shock.',
    lede: 'Panels are glass over an electrical system on a roof. That combination sets the method before anything else is considered.',
    body: [
      'Dust, pollen, salt and bird droppings settle on panel glass and reduce the light reaching the cells. In South-East Queensland the dry months do most of the depositing and the first storm rarely clears it evenly, leaving streaks that shade the array.',
      'Panels are cleaned with deionised water and a soft brush — no detergent, no pressure and nothing abrasive. Deionised water dries without leaving the mineral spotting that tap water leaves behind, which matters on a surface whose whole job is letting light through.'
    ],
    spec: [['Method', 'Deionised water + soft brush'], ['Pressure', 'None'], ['Never', 'Detergent, abrasives, hot glass'], ['Typical time', '1–2 hours']],
    included: ['Deionised water and soft-brush method only', 'No detergent, no pressure, nothing abrasive on the glass', 'Array checked for obvious debris, nesting and shading', 'Anything visibly amiss reported to you, not touched', 'Work declined where the roof cannot be accessed safely'],
    handles: ['Panel glass and frames', 'Array edges where debris collects', 'Roof surface immediately around the array', 'Accessible mounting rails'],
    limits: 'This is cleaning, not electrical work. Wiring, isolators, inverters, mounting integrity and anything under the panels are outside scope — if something looks wrong it is reported for your solar installer. Panels are never pressure washed and never cleaned in the heat of the day, when cold water on hot glass risks thermal shock.',
    why: 'Panel manufacturers’ manuals generally call for soft water and gentle cleaning, and warn that pressure washing or harsh chemicals can damage modules — and the warranty.',
    faqs: [
      ['Doesn’t rain clean solar panels?', 'Partly. Steady rain rinses loose dust, but light showers can leave residue, and bird droppings and lichen don’t wash off. Flat-mounted panels self-clean less well than steeply tilted ones.'],
      ['How much output do dirty panels lose?', 'It varies widely with location, tilt and what’s on the glass. International research puts typical annual losses from soiling at a few per cent, with bird droppings causing bigger local losses because they shade whole cells.'],
      ['Can I clean panels myself with a hose?', 'From the ground, a gentle hose rinse in the cool of the morning is generally fine. Avoid detergents, abrasive brushes and pressure washers, and don’t go on the roof — that’s where most of the risk is.']
    ],
    articles: ['solar-panel-cleaning-does-it-matter', 'roof-cleaning-south-east-queensland'],
    upsell: 'roof-cleaning'
  }
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

/* Quote-flow configuration (ids match the previous build so qualify.js is unchanged). */
export const FLOW = {
  services: {
    primary: [
      { id: 'house', label: 'House washing', icon: 'house', remoteQuotable: true },
      { id: 'roof', label: 'Roof', icon: 'roof', remoteQuotable: false },
      { id: 'driveway', label: 'Driveway & concrete', icon: 'grid', remoteQuotable: true },
      { id: 'gutter', label: 'Gutters', icon: 'gutter', remoteQuotable: true },
      { id: 'window', label: 'Windows', icon: 'window', remoteQuotable: true },
      { id: 'patio', label: 'Paths & patios', icon: 'path', remoteQuotable: true }
    ],
    more: [
      { id: 'pool', label: 'Pool surrounds', remoteQuotable: true },
      { id: 'solar', label: 'Solar panels', remoteQuotable: false },
      { id: 'fence', label: 'Fences', remoteQuotable: true },
      { id: 'retaining', label: 'Retaining walls', remoteQuotable: true },
      { id: 'deck', label: 'Decks', remoteQuotable: false },
      { id: 'commercial', label: 'Commercial / body corporate', remoteQuotable: false },
      { id: 'other', label: 'Something else', remoteQuotable: false }
    ]
  },
  timing: [
    { id: 'asap', label: 'As soon as possible', score: 3 },
    { id: '2weeks', label: 'Within 2 weeks', score: 3 },
    { id: 'month', label: 'Within a month', score: 0 },
    { id: 'quarter', label: 'In the next few months', score: -1 },
    { id: 'pricing', label: 'Just getting prices', score: -2 }
  ],
  upsells: {
    house: { prompt: 'Anything else while we’re looking at the exterior?', suggest: ['window', 'gutter', 'roof'] },
    roof: { prompt: 'Also check the gutters while we’re up there?', suggest: ['gutter'] },
    driveway: { prompt: 'Include the adjoining areas?', suggest: ['patio'] },
    window: { prompt: 'Worth doing at the same time?', suggest: ['house', 'gutter'] },
    gutter: { prompt: 'Worth doing at the same time?', suggest: ['roof', 'house'] }
  }
};
