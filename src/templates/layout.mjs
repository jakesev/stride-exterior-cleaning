import { SITE, BUSINESS, NAV } from '../content/site.mjs';
import { SERVICES } from '../content/services.mjs';
import { AREAS } from '../content/areas.mjs';
import { esc, u, abs, icon, arr } from '../lib/html.mjs';

export const ASSET_VERSION = { v: '1' };   // set by build (content hash) for cache-busting

const ldBusiness = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': abs('/') + '#business',
  name: BUSINESS.legalName,
  url: abs('/'),
  logo: abs('/assets/brand/stride-logo-primary.svg'),
  image: abs('/assets/brand/og-default.jpg'),
  description: SITE.description,
  email: BUSINESS.email,
  ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
  address: { '@type': 'PostalAddress', addressLocality: BUSINESS.locality, addressRegion: BUSINESS.region, postalCode: BUSINESS.postcode, addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
  areaServed: AREAS.filter((a) => !a.wide).map((a) => ({ '@type': 'Place', name: `${a.name} QLD ${a.postcode}` })).concat([{ '@type': 'City', name: 'Brisbane' }]),
  openingHoursSpecification: BUSINESS.hoursSpec.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
  ...(BUSINESS.googleRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: BUSINESS.googleRating.value, reviewCount: BUSINESS.googleRating.count } } : {}),
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Exterior cleaning services', itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: abs(`/services/${s.slug}/`) } })) }
});

export function layout({ path, title, description, body, ld = [], image, crumbs, noindex = false, bodyClass = '', scripts = [], head = '', mbar = true }) {
  const canonical = abs(path);
  const fullTitle = title.includes('Stride') ? title : `${title} | Stride Exterior Cleaning`;
  const ogImage = image ? abs(image) : abs('/assets/brand/og-default.jpg');
  const lds = [path === '/' ? ldBusiness() : null, ...ld].filter(Boolean);
  if (crumbs && crumbs.length) {
    lds.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: abs(c[1]) })) });
  }
  const v = ASSET_VERSION.v;
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${SITE.preview || noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="format-detection" content="telephone=no">
<link rel="preload" href="${u('/assets/fonts/archivo-var-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u('/assets/css/stride.css')}?v=${v}">
${head}
<link rel="icon" href="${u('/assets/brand/favicon.ico')}" sizes="any">
<link rel="icon" href="${u('/assets/brand/stride-icon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u('/assets/brand/apple-touch-icon.png')}">
<link rel="manifest" href="${u('/site.webmanifest')}">
<meta property="og:type" content="${path.startsWith('/learn/') && path !== '/learn/' ? 'article' : 'website'}">
<meta property="og:locale" content="en_AU">
<meta property="og:site_name" content="Stride Exterior Cleaning">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
${lds.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script>document.documentElement.classList.add('js');window.STRIDE_BASE=${JSON.stringify(SITE.base)};</script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${mbar ? `<div class="mbar" data-mbar aria-label="Quick actions"><a class="btn btn--ghost" href="${u('/book/')}">Book a time</a><a class="btn" href="${u('/quote/')}">Free quote ${arr()}</a></div>` : ''}
<script src="${u('/assets/js/main.js')}?v=${v}" defer></script>
${scripts.map((s) => `<script src="${u(s)}?v=${v}" defer></script>`).join('\n')}
</body>
</html>
`;
}

function header(path) {
  const cur = (n) => path === n.href ? ' aria-current="page"' : path.startsWith(n.match) ? ' class="is-section"' : '';
  return `<header class="hdr" data-hdr>
  <div class="wrap hdr-in">
    <a class="brand" href="${u('/')}" aria-label="Stride Exterior Cleaning — home"><img src="${u('/assets/brand/stride-logo-primary.svg')}" alt="Stride Exterior Cleaning" width="137" height="34"></a>
    <nav class="nav" aria-label="Main">${NAV.map((n) => `<a href="${u(n.href)}"${cur(n)}>${n.label}</a>`).join('')}</nav>
    <div class="hdr-cta">
      <a class="btn btn--ghost btn--sm" href="${u('/book/')}">Book a time</a>
      <a class="btn btn--sm" href="${u('/quote/')}">Free quote ${arr()}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="sheet" data-menu><span></span><b class="sr">Menu</b></button>
    </div>
  </div>
</header>
<div class="sheet" id="sheet" data-sheet aria-hidden="true">
  <nav aria-label="Mobile">
    ${NAV.map((n, i) => `<a href="${u(n.href)}">${n.label}<span class="spec">0${i + 1}</span></a>`).join('')}
    <a href="${u('/guides/')}">Free guides<span class="spec">PDF</span></a>
    <a href="${u('/faqs/')}">Questions<span class="spec">FAQ</span></a>
  </nav>
  <div class="sheet-cta"><a class="btn btn--lg" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost btn--lg" href="${u('/book/')}">Request a booking</a></div>
</div>`;
}

function footer() {
  const svc = SERVICES.map((s) => `<li><a href="${u(`/services/${s.slug}/`)}">${esc(s.name)}</a></li>`).join('');
  const areas = AREAS.map((a) => `<li><a href="${u(`/service-areas/${a.slug}/`)}">${esc(a.name)}</a></li>`).join('');
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr-top">
      <div class="ftr-brand">
        <img src="${u('/assets/brand/stride-logo-reversed.svg')}" alt="Stride Exterior Cleaning" width="161" height="40" loading="lazy">
        <p style="max-width:26em">Careful exterior cleaning for homes across the Redlands and Greater Brisbane. Every surface, cleaned the right way.</p>
        <div class="btn-row mt-2"><a class="btn btn--white btn--sm" href="${u('/quote/')}">Free quote ${arr()}</a><a class="btn btn--line-white btn--sm" href="${u('/book/')}">Book a time</a></div>
      </div>
      <div><h2>Services</h2><ul>${svc}</ul></div>
      <div><h2>Service areas</h2><ul>${areas}</ul></div>
      <div><h2>Learn</h2><ul>
        <li><a href="${u('/learn/')}">Education centre</a></li>
        <li><a href="${u('/guides/')}">Free guides</a></li>
        <li><a href="${u('/faqs/')}">Questions</a></li>
        <li><a href="${u('/our-work/')}">Before &amp; after</a></li>
        <li><a href="${u('/why-stride/')}">The Stride standard</a></li>
        <li><a href="${u('/about/')}">About</a></li>
      </ul></div>
      <div><h2>Contact</h2><ul>
        <li><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></li>
        ${BUSINESS.phone ? `<li><a href="tel:${BUSINESS.phone}">${esc(BUSINESS.phoneDisplay)}</a></li>` : ''}
        <li>${esc(BUSINESS.hours)}</li>
        <li>Based in ${esc(BUSINESS.base)}, QLD</li>
        <li><a href="${u('/contact/')}">Contact page</a></li>
      </ul></div>
    </div>
    <div class="ftr-word" aria-hidden="true">STRIDE</div>
    <div class="ftr-bottom">
      <span>© ${new Date().getFullYear()} Stride Exterior Cleaning · ABN ${BUSINESS.abn}</span>
      <span><a href="${u('/privacy/')}">Privacy</a> · <a href="${u('/terms/')}">Terms</a> · <a href="${u('/sitemap.xml')}">Sitemap</a></span>
      <span>Photography marked “demonstration” is licensed stock. 3D renders are original to Stride.</span>
    </div>
  </div>
</footer>`;
}
