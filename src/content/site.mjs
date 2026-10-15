/* Site-wide facts and switches. Business facts here are the ONLY place they
 * are written down — templates read from this file. Anything marked
 * `confirm` is unverified and listed in docs/LAUNCH-CHECKLIST.md. */
const argv = process.argv.slice(2);
const flag = (name) => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return undefined;
  return hit.includes('=') ? hit.split('=').slice(1).join('=') : true;
};

const preview = flag('production') ? false : true;

export const SITE = {
  name: 'Stride Exterior Cleaning',
  short: 'Stride',
  preview,                                           // preview build: noindex + robots disallow
  base: flag('base') ?? (preview ? '/stride-exterior-cleaning' : ''),
  origin: flag('origin') ?? (preview ? 'https://jakesev.github.io' : 'https://strideexteriorcleaning.com.au'),
  locale: 'en-AU',
  themeColor: '#FFFFFF',
  tagline: 'Every surface, cleaned the right way.',
  description: 'Exterior cleaning for homes across the Redlands and Greater Brisbane: roofs, house washing, driveways, gutters, windows, paths, pool surrounds and solar. Free photo quotes.'
};

export const BUSINESS = {
  legalName: 'Stride Exterior Cleaning',
  abn: '30 627 254 526',                              // from the previous site build
  base: 'Redland Bay',
  locality: 'Redland Bay',
  region: 'QLD',
  postcode: '4165',
  geo: { lat: -27.611, lng: 153.300 },
  email: 'info@strideexteriorcleaning.com.au',        // confirm: domain not yet registered
  phone: '',                                          // confirm: no number published until confirmed
  phoneDisplay: '',
  hours: 'Monday to Friday, 9am – 5pm',
  hoursSpec: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }],
  insurance: '$10 million public liability',          // confirm: certificate of currency on file
  googleRating: null,                                 // e.g. { value: 4.9, count: 37, url: '…' } once real
  social: []
};

/* Lead delivery. See docs/LEADS.md.
 *   transport: 'endpoint'  — POST multipart to `endpoint` (backend/ Cloudflare Worker)
 *              'webhook'   — POST JSON to an Airtable automation webhook (no photos)
 *              'none'      — nothing configured: the lead is kept on the device
 *                            and the visitor is given an email fallback
 */
export const LEADS = {
  transport: flag('lead-transport') ?? 'none',
  endpoint: flag('lead-endpoint') ?? '',
  webhook: flag('lead-webhook') ?? '',
  maxPhotos: 8,
  maxPhotoMB: 15,
  photoMaxEdge: 1800,      // photos are downsized in the browser before upload
  photoQuality: 0.82
};

export const NAV = [
  { label: 'Services', href: '/services/', match: '/services/' },
  { label: 'Our work', href: '/our-work/', match: '/our-work/' },
  { label: 'Learn', href: '/learn/', match: '/learn/' },
  { label: 'Areas', href: '/service-areas/', match: '/service-areas/' },
  { label: 'About', href: '/about/', match: '/about/' }
];
