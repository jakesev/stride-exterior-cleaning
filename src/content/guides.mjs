/* Free downloadable guides. Each is rendered to a PDF by tools/render-guides.mjs
 * from templates in guides/, using the site's design system. */
export const GUIDES = [
  {
    slug: 'surface-guide', file: 'stride-surface-guide.pdf', pages: 12,
    title: 'The Surface Guide',
    subtitle: 'How to clean every exterior surface without damaging it',
    summary: 'Sixteen common Queensland surfaces — tile, render, Colorbond, aggregate, sandstone, travertine, timber and more — with the safe method, the risks, the aftercare and what manufacturers actually say.',
    inside: ['Pressure vs soft wash, explained', 'A surface-by-surface method matrix', 'What will lift — and what will only lighten', 'Manufacturer guidance, with sources'],
    cover: 'focus-house'
  },
  {
    slug: 'exterior-care-calendar', file: 'stride-exterior-care-calendar.pdf', pages: 10,
    title: 'The Redlands Exterior Care Calendar',
    subtitle: 'A season-by-season plan for South-East Queensland homes',
    summary: 'What to check and clean each season, built on Bureau of Meteorology climate data for Brisbane and the Redlands — wet-season growth, storm-season prep and the jobs that suit the dry months.',
    inside: ['Month-by-month climate at a glance', 'Season checklists you can tick off', 'Storm-season preparation (Get Ready Queensland)', 'Typical recleaning intervals by surface'],
    cover: 'story-done'
  },
  {
    slug: 'before-you-book', file: 'stride-before-you-book.pdf', pages: 10,
    title: 'Before You Book',
    subtitle: 'A Queensland homeowner’s guide to hiring an exterior cleaner',
    summary: 'The questions to ask, how to compare written quotes, the rules on run-off and door-to-door traders, and a printable preparation checklist for the day.',
    inside: ['10 questions to ask any cleaner', 'Quote comparison worksheet', 'Run-off, insurance and door-knocking rules', 'Day-of preparation checklist'],
    cover: 'story-vision'
  },
  {
    slug: 'storm-season-ready', file: 'stride-storm-season-ready.pdf', pages: 8,
    title: 'Storm-Season Ready',
    subtitle: 'Roof, gutter and solar checklist for South-East Queensland',
    summary: 'A practical pre-storm-season walk-around: gutters and downpipes, roof condition, solar, and the warning signs that need a roofer or plumber rather than a cleaner.',
    inside: ['Gutter and downpipe checklist', 'Roof warning signs to photograph', 'Solar: when cleaning matters', 'Safety: what not to do from a ladder'],
    cover: 'focus-gutter'
  }
];
export const GUIDE_BY_SLUG = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
