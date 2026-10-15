import { u, abs, esc, arr, icon, pic } from '../lib/html.mjs';
import { layout } from '../templates/layout.mjs';
import { figure, beforeAfter, sectionHead, surfaceIndex, cta, areaMap, faqList, crumbs, specsheet, ticks, WORK, resetFigures } from '../templates/parts.mjs';
import { SERVICES, SERVICE_BY_ID, SERVICE_BY_SLUG } from '../content/services.mjs';
import { AREAS, AREA_BY_SLUG } from '../content/areas.mjs';
import { BUSINESS, SITE } from '../content/site.mjs';
import { articleRow } from './home.mjs';

const pageHero = ({ crumbList, kicker, title, lede, aside = '', ctas = true }) => `
<section class="phero">
  <div class="wrap">
    ${crumbs(crumbList)}
    <div class="phero-grid">
      <div>
        ${kicker ? `<p class="spec spec--ink">${kicker}</p>` : ''}
        <h1 class="display">${title}</h1>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
        ${ctas ? `<div class="btn-row mt-3"><a class="btn btn--lg" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost btn--lg" href="${u('/book/')}">Request a booking</a></div>` : ''}
      </div>
      <div class="phero-aside">${aside}</div>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ services */
export function servicesHub() {
  resetFigures();
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Services', '/services/']], kicker: 'Services', title: 'Eight surfaces. <span class="soft">Eight methods.</span>', lede: 'Every exterior surface on a home has its own tolerance for water, pressure and chemistry. These are the eight we clean — and how each one is done properly.' })}
<section class="section"><div class="wrap">${surfaceIndex()}</div></section>
<section class="section section--paper"><div class="wrap">
  ${sectionHead('Not sure which<br>you need?', 'Most homes need two or three services, and some are best done together — gutters after the roof, windows after the house wash. Tick what you can see in the quote form and we’ll tell you what actually needs doing.')}
  <div class="cols-2">
    ${figure('story-layers', { caption: 'One house, five layers, eight surfaces', alt: 'The model house separated into layers: site, ground floor, upper floor, roof and solar', ratio: 'ratio-photo' })}
    <div class="stack" style="--s:20px;align-self:end">
      <h3 class="h3">Good combinations</h3>
      <ul class="ticks">
        <li>Roof + gutters — debris dislodged from the roof is cleared the same day</li>
        <li>House wash + windows — glass is done last so nothing settles back on it</li>
        <li>Driveway + paths & patio — one even finish across connected concrete</li>
        <li>Pool surround + patio — one method plan for all the stone and pavers</li>
      </ul>
      <a class="btn mt-2" href="${u('/quote/')}">Start a quote ${arr()}</a>
    </div>
  </div>
</div></section>
${cta()}`;
  return layout({ path: '/services/', title: 'Exterior Cleaning Services | Redlands & Brisbane', description: 'Roof cleaning, house washing, driveway and concrete cleaning, gutters, windows, paths and patios, pool surrounds and solar panels across the Redlands and Greater Brisbane.', body, crumbs: [['Home', '/'], ['Services', '/services/']] });
}

export function servicePage(s, articles) {
  resetFigures();
  const others = SERVICES.filter((x) => x.id !== s.id);
  const pair = SERVICE_BY_SLUG[s.upsell];
  const related = s.articles.map((slug) => articles.find((a) => a.slug === slug)).filter(Boolean);
  const path = `/services/${s.slug}/`;
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Services', '/services/'], [s.name, path]], kicker: `Service ${s.n} · ${esc(s.surfaces)}`, title: esc(s.name), lede: esc(s.lede) })}
<section class="section section--tight"><div class="wrap">
  ${specsheet(s.spec)}
  <div class="grid mt-4">
    <div style="grid-column:1 / span ${s.photo ? 8 : 12}">${figure(s.render, { caption: `The clean pass on ${s.short.toLowerCase()} — before on one side, after on the other`, alt: `3D study of ${s.name.toLowerCase()}, half cleaned`, ratio: 'ratio-photo', sizes: '(min-width: 1000px) 62vw, 100vw', eager: true })}</div>
    ${s.photo ? `<div style="grid-column:9 / -1;align-self:end">${figure(s.photo, { caption: s.short, alt: `${s.name} — demonstration photograph`, ratio: 'ratio-tall', sizes: '(min-width: 1000px) 30vw, 100vw' })}</div>` : ''}
  </div>
</div></section>
<section class="section section--line"><div class="wrap">
  <div class="grid">
    <div style="grid-column:1 / span 6" data-reveal>
      <h2 class="h2">How it’s done.</h2>
      <div class="mt-3">${s.body.map((p) => `<p class="lede">${esc(p)}</p>`).join('')}</div>
      <p class="note mt-3"><span class="spec spec--blue">Why it matters</span><br>${esc(s.why)}</p>
    </div>
    <div style="grid-column:8 / -1" data-reveal>
      <h3 class="h4 mb-1">What’s included</h3>${ticks(s.included)}
      <h3 class="h4 mb-1 mt-3">Surfaces we handle</h3>${ticks(s.handles)}
    </div>
  </div>
</div></section>
<section class="section section--paper"><div class="wrap wrap--narrow">
  <span class="spec">Honest limits</span>
  <p class="h3 mt-1" style="font-weight:520;line-height:1.3">${esc(s.limits)}</p>
</div></section>
${s.ba ? `<section class="section"><div class="wrap">
  ${sectionHead('What a pass<br>looks like.', 'Drag the line. Demonstration photographs — genuine Stride job documentation replaces them as work is completed.')}
  ${beforeAfter(s.ba)}
</div></section>` : ''}
<section class="section section--line"><div class="wrap">
  ${sectionHead(`${esc(s.short)}, answered.`, `Common questions about ${esc(s.name.toLowerCase())}. More in the <a class="link" href="${u('/faqs/')}">full FAQ</a>.`)}
  ${faqList(s.faqs, { idPrefix: s.id })}
</div></section>
${related.length ? `<section class="section section--line"><div class="wrap">
  ${sectionHead('Read before<br>you book.', 'Researched, sourced articles from the Stride education centre.')}
  <div class="alist">${related.map(articleRow).join('')}</div>
</div></section>` : ''}
<section class="section section--paper"><div class="wrap">
  ${pair ? `<div class="panel panel--wash flex wrap-any between mb-3"><div><span class="spec spec--blue">Pairs well with</span><p class="h3 mt-1">${esc(pair.name)}</p></div><a class="btn btn--ink" href="${u(`/services/${pair.slug}/`)}">See ${esc(pair.short.toLowerCase())} ${arr()}</a></div>` : ''}
  <h2 class="h3 mb-2">Other services</h2>
  ${surfaceIndex(others)}
</div></section>
${cta({ title: `Get a price for <span class="blue">${esc(s.short.toLowerCase())}</span>.` })}`;
  return layout({
    path, title: s.title, description: s.metaDesc, body, image: `/assets/img/${s.render}-1400.webp`,
    crumbs: [['Home', '/'], ['Services', '/services/'], [s.name, path]],
    ld: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, description: s.metaDesc, url: abs(path), provider: { '@id': abs('/') + '#business' }, areaServed: ['Redland City', 'Brisbane'].map((n) => ({ '@type': 'Place', name: n })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  });
}

/* --------------------------------------------------------------- areas */
export function areasHub() {
  resetFigures();
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Service areas', '/service-areas/']], kicker: 'Service areas', title: 'Redlands first.', lede: 'Based in Redland Bay, working across the Redlands every week, and taking selected work through bayside and south-east Brisbane. Your postcode is checked instantly in the quote form.' })}
<section class="section"><div class="wrap">
  <div class="grid">
    <div style="grid-column:1 / span 7">${areaMap()}</div>
    <div style="grid-column:9 / -1">
      <ul class="area-list" style="columns:1">${AREAS.map((a) => `<li><a href="${u(`/service-areas/${a.slug}/`)}"><span>${esc(a.name)}</span><span class="spec">${esc(a.postcode)}</span></a></li>`).join('')}</ul>
    </div>
  </div>
</div></section>
<section class="section section--paper"><div class="wrap wrap--narrow">
  <h2 class="h2">Why location changes the job.</h2>
  <div class="cols-2 mt-3">
    <div><h3 class="h4">Close to the bay</h3><p class="mt-1">Salt settles on sheltered surfaces that rain never reaches — eaves, gutter undersides, window frames. It needs washing off rather than waiting for the weather.</p></div>
    <div><h3 class="h4">Under trees</h3><p class="mt-1">Inland, bushland suburbs trade salt for leaf litter and shade: gutters fill faster and shaded paths and roof faces grow moss and lichen sooner.</p></div>
  </div>
</div></section>
${cta()}`;
  return layout({ path: '/service-areas/', title: 'Service Areas | Exterior Cleaning Redlands & Brisbane', description: 'Stride services Redland Bay, Victoria Point, Cleveland, Thornlands, Capalaba, Alexandra Hills, Wellington Point, Ormiston, Birkdale, Mount Cotton and selected Brisbane suburbs.', body, crumbs: [['Home', '/'], ['Service areas', '/service-areas/']] });
}

export function areaPage(a) {
  resetFigures();
  const path = `/service-areas/${a.slug}/`;
  const focus = a.focus.map((id) => SERVICE_BY_ID[id]).filter(Boolean);
  const nearby = a.nearby.map((s) => AREA_BY_SLUG[s]).filter(Boolean);
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Service areas', '/service-areas/'], [a.name, path]], kicker: `Exterior cleaning · ${esc(a.name)}${a.wide ? '' : ' QLD ' + a.postcode}`, title: `Exterior cleaning in ${esc(a.name)}.`, lede: esc(a.intro) })}
<section class="section section--tight"><div class="wrap">
  ${specsheet(a.facts)}
  <div class="grid mt-4">
    <div style="grid-column:1 / span 6" data-reveal>
      ${a.profile.map((p) => `<p class="lede">${esc(p)}</p>`).join('')}
      <p class="small mt-2">Sources: ${a.sources.map(([t, href]) => `<a class="link" href="${href}" rel="noopener" target="_blank">${esc(t)}</a>`).join('; ')}</p>
    </div>
    <div style="grid-column:8 / -1">${areaMap({ highlight: a.slug })}</div>
  </div>
</div></section>
<section class="section section--paper"><div class="wrap">
  ${sectionHead(`What weathers homes<br>in ${esc(a.name)}.`, 'What we usually look at first here — and the services that deal with it.')}
  <ul class="ticks" style="max-width:720px">${a.watch.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
  <div class="mt-4">${surfaceIndex(focus)}</div>
</div></section>
<section class="section"><div class="wrap">
  <h2 class="h3 mb-2">Nearby</h2>
  <ul class="area-list">${nearby.map((n) => `<li><a href="${u(`/service-areas/${n.slug}/`)}"><span>${esc(n.name)}</span><span class="spec">${esc(n.postcode)}</span></a></li>`).join('')}</ul>
</div></section>
${cta({ title: `A free quote in <span class="blue">${esc(a.name)}</span>.`, text: `Send the address and a few photos. ${a.home ? 'We’re local, so we can usually get to you quickly.' : 'We’ll confirm the scope, price and arrival window in writing.'}` })}`;
  return layout({
    path, title: `Exterior Cleaning ${a.name}${a.wide ? '' : ' QLD ' + a.postcode} | Stride`, description: `House washing, roof, driveway, gutter and window cleaning in ${a.name}. ${a.intro}`.slice(0, 158), body,
    crumbs: [['Home', '/'], ['Service areas', '/service-areas/'], [a.name, path]],
    ld: [{ '@context': 'https://schema.org', '@type': 'Service', name: `Exterior cleaning in ${a.name}`, provider: { '@id': abs('/') + '#business' }, areaServed: { '@type': 'Place', name: `${a.name}, Queensland` } }]
  });
}

/* ------------------------------------------------------------ our work */
export function ourWork() {
  resetFigures();
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Our work', '/our-work/']], kicker: 'Before & after', title: 'See what a pass <span class="soft">changes.</span>', lede: 'Drag each line to compare. Honesty first: these are licensed demonstration photographs, clearly labelled. Genuine Stride job documentation — shot from the same position before and after — replaces them as work is completed and customers agree to share it.' })}
<section class="section"><div class="wrap">
  ${WORK.map((w, i) => `<div class="grid${i ? ' mt-4' : ''}" style="align-items:end">
    <div style="grid-column:${i % 2 ? '5 / -1' : '1 / span 8'};${i % 2 ? 'order:2' : ''}">${beforeAfter(w.id, { eager: i === 0 })}</div>
    <div style="grid-column:${i % 2 ? '1 / span 4' : '9 / -1'}">
      <span class="spec">Set ${String(i + 1).padStart(2, '0')} · Demonstration</span>
      <h2 class="h3 mt-1">${esc(w.title)}</h2>
      <dl class="summary mt-2"><div><dt class="spec">Surface</dt><dd>${esc(w.surface)}</dd></div><div><dt class="spec">Method</dt><dd>${esc(w.method)}</dd></div></dl>
      <a class="textlink mt-2" href="${u(`/services/${SERVICE_BY_ID[w.service].slug}/`)}">${esc(SERVICE_BY_ID[w.service].name)} ${arr()}</a>
    </div>
  </div>`).join('')}
</div></section>
<section class="section section--paper"><div class="wrap">
  ${sectionHead('The same clean,<br>surface by surface.', 'Original 3D studies of the Stride model home, each showing the clean pass halfway across one surface.')}
  <div class="tiles">
    ${SERVICES.map((s) => `<a class="tile" href="${u(`/services/${s.slug}/`)}"><div class="fig-frame ratio-photo">${pic(s.render, { alt: `${s.name}: half-cleaned 3D study`, sizes: '(min-width: 1000px) 30vw, (min-width: 640px) 45vw, 100vw' })}</div><div class="meta"><span class="spec">${s.n}</span><span class="spec">${esc(s.method)}</span></div><h3 class="h4">${esc(s.name)}</h3></a>`).join('')}
  </div>
</div></section>
<section class="section"><div class="wrap wrap--narrow">
  <h2 class="h3">How we document real jobs</h2>
  <p class="lede mt-2">Where it’s practical, each surface is photographed before and after from the same position, so the comparison is fair — showing what improved and, just as importantly, what didn’t. House numbers and number plates are kept out of frame, and nothing is published without your agreement.</p>
</div></section>
${cta()}`;
  return layout({ path: '/our-work/', title: 'Before & After | Our Work', description: 'Before-and-after comparisons of driveway, paver and pool surround cleaning, plus 3D studies of every Stride service. Demonstration imagery clearly labelled.', body, crumbs: [['Home', '/'], ['Our work', '/our-work/']] });
}

/* ------------------------------------------------------- the standard */
export function standard() {
  resetFigures();
  const items = [
    ['Surface-appropriate cleaning', 'Concrete can take a rotary surface cleaner at pressure. Render, weatherboard, natural stone and painted walls generally cannot. Using the wrong method forces water into joints, lifts paint and etches soft stone — damage that cleaning cannot undo. Working out which is which is the actual skill.'],
    ['Insured, and happy to show it', '$10 million public liability cover, with the certificate of currency available on request. Body corporates and property managers usually ask for it before work starts, and we’d rather you asked too.'],
    ['Clear communication', 'A written scope, an arrival window rather than a vague day, and a message if anything changes. If we find something on site that changes the job, you hear about it then — not on the invoice.'],
    ['Run-off taken seriously', 'In Queensland, outdoor cleaning water must not reach gutters or stormwater drains. We plan where water goes before we start, protect drains, and use only the chemistry a surface actually needs.'],
    ['Before-and-after documentation', 'Where practical, surfaces are photographed before and after from the same position. It shows what improved and, just as importantly, what didn’t.'],
    ['Respect for the property', 'Plants get considered, fittings get worked around, and the surrounding area gets rinsed down at the end. A clean driveway and a silt-covered garden bed is not a finished job.']
  ];
  const body = `${pageHero({ crumbList: [['Home', '/'], ['The Stride standard', '/why-stride/']], kicker: 'The Stride standard', title: 'The details <span class="soft">matter.</span>', lede: 'Anyone can point a lance at a driveway. The difference is in the decisions made before the trigger is pulled — and in what happens when something doesn’t go to plan.' })}
<section class="section"><div class="wrap">
  <div class="grid">
    ${items.map(([t, d], i) => `<div style="grid-column:${i % 2 ? '7 / -1' : '1 / span 5'};margin-top:${i > 1 ? '56px' : '0'}" data-reveal><span class="spec spec--blue">0${i + 1}</span><h2 class="h3 mt-1">${t}</h2><p class="mt-1">${d}</p></div>`).join('')}
  </div>
</div></section>
<section class="section band"><div class="wrap">
  ${sectionHead('Established before<br>you commit.', 'At the quote stage, not on the day.')}
  <div class="cols-2">
    <div><h3 class="h4">What will lift — and what will only lighten</h3><p class="mt-1">Oil that has penetrated porous concrete, rust bleed, efflorescence and UV fade are identified as such, with an expected outcome rather than a hope.</p></div>
    <div><h3 class="h4">Which surfaces take pressure</h3><p class="mt-1">And where a coating has already failed — so you know the cleaning revealed it rather than caused it.</p></div>
  </div>
</div></section>
<section class="section"><div class="wrap">${figure('story-vision', { caption: 'Grime vision: where growth takes hold first on a typical home', alt: 'The model house with a thermal-style lens showing growth concentrated low on the walls', ratio: 'ratio-wide', sizes: '100vw' })}</div></section>
${cta()}`;
  return layout({ path: '/why-stride/', title: 'The Stride Standard | Why Stride', description: 'Surface-appropriate methods, $10m public liability, run-off managed, written scopes and before-and-after documentation. The Stride standard for exterior cleaning.', body, crumbs: [['Home', '/'], ['The Stride standard', '/why-stride/']] });
}

/* --------------------------------------------------------------- about */
export function about() {
  resetFigures();
  const body = `${pageHero({ crumbList: [['Home', '/'], ['About', '/about/']], kicker: 'About Stride', title: 'Local service. <span class="soft">Personal accountability.</span>', lede: 'Stride Exterior Cleaning is a local business working out of Redland Bay, servicing the Redlands and selected parts of Greater Brisbane.' })}
<section class="section"><div class="wrap">
  <div class="grid">
    <div style="grid-column:1 / span 6" data-reveal>
      <p class="lede">It isn’t a franchise, and it isn’t a call centre. The person who quotes your job is the person who turns up and does it, which means there’s nobody to pass the blame to if it isn’t right.</p>
      <p class="mt-2">Stride was started to do exterior cleaning the way it should be done: assess the surface first, choose a method that suits it, communicate clearly, and document the result. That sounds obvious. It’s also noticeably not the industry standard.</p>
      <p>There are no review counts or job numbers on this site because they would not yet mean anything. What stands behind the work is $10 million public liability cover, commercial equipment, and a written scope on every job.</p>
    </div>
    <div style="grid-column:8 / -1">
      <div class="panel" style="aspect-ratio:4/5;display:grid;place-items:center;text-align:center">
        <div><span class="spec">Owner photograph</span><p class="small mt-1" style="max-width:20em">A genuine photo of the owner and equipment will go here — not a stock stand-in.</p></div>
      </div>
    </div>
  </div>
</div></section>
<section class="section section--paper"><div class="wrap">
  <h2 class="h3 mb-2">Business facts, on the record.</h2>
  ${specsheet([['Based in', BUSINESS.base + ', QLD'], ['Public liability', '$10 million'], ['ABN', BUSINESS.abn], ['Hours', 'Mon–Fri, 9am – 5pm']])}
</div></section>
${cta()}`;
  return layout({ path: '/about/', title: 'About Stride Exterior Cleaning', description: 'Stride Exterior Cleaning is an owner-operated exterior cleaning business based in Redland Bay, servicing the Redlands and Greater Brisbane.', body, crumbs: [['Home', '/'], ['About', '/about/']] });
}

/* ------------------------------------------------------------- contact */
export function contact() {
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Contact', '/contact/']], kicker: 'Contact', title: 'Talk to Stride.', lede: 'The fastest way to a price is the quote form — it takes about two minutes and photos are optional. For anything else, use the form below or email us directly.', ctas: false })}
<section class="section"><div class="wrap">
  <div class="form-shell">
    <form class="form-card" data-lead-form="contact" novalidate>
      <div class="row-2">
        <div class="field"><label class="flabel" for="c-name">Your name</label><input class="input" id="c-name" name="name" autocomplete="name" required data-error="Please tell us your name."></div>
        <div class="field"><label class="flabel" for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required data-error="Please enter a valid email address."></div>
      </div>
      <div class="field"><label class="flabel" for="c-phone">Phone <span class="opt">optional</span></label><input class="input" id="c-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field"><label class="flabel" for="c-msg">Message</label><textarea class="textarea" id="c-msg" name="message" required data-error="Please add a short message."></textarea></div>
      <div class="hp" aria-hidden="true"><label>Leave this empty<input name="company_website" tabindex="-1" autocomplete="off"></label></div>
      <label class="consent"><input type="checkbox" name="consent" required data-error="Please agree so we can reply."><span>I agree to Stride using these details to reply to me, as described in the <a class="link" href="${u('/privacy/')}">privacy policy</a>.</span></label>
      <div class="form-nav"><span class="small">Replies within one business day.</span><button class="btn btn--lg" type="submit">Send message ${arr()}</button></div>
      <div data-form-status hidden></div>
    </form>
    <aside class="form-aside">
      <ul class="aside-list">
        <li>${icon('mail')}<span><b>Email</b><a class="link" href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></span></li>
        <li>${icon('clock')}<span><b>Hours</b>${BUSINESS.hours}</span></li>
        <li>${icon('pin')}<span><b>Based in</b>${BUSINESS.base}, QLD — servicing the Redlands &amp; Greater Brisbane</span></li>
        <li>${icon('camera')}<span><b>Need a price?</b><a class="link" href="${u('/quote/')}">Use the quote form</a> — photos help us quote without a visit.</span></li>
      </ul>
    </aside>
  </div>
</div></section>`;
  return layout({ path: '/contact/', title: 'Contact Stride Exterior Cleaning', description: 'Contact Stride Exterior Cleaning in Redland Bay. Get a free quote, request a booking or send a message.', body, crumbs: [['Home', '/'], ['Contact', '/contact/']], scripts: ['/assets/js/forms.js'] });
}

/* --------------------------------------------------------------- legal */
export function privacy() {
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Privacy', '/privacy/']], kicker: 'Legal', title: 'Privacy policy', lede: 'Stride Exterior Cleaning collects the minimum it needs to quote and carry out work, and doesn’t do anything else with it.', ctas: false })}
<section class="section"><div class="wrap"><div class="prose">
<p class="small">Last updated October 2026.</p>
<h2>What we collect</h2>
<ul><li>Details you send us through the quote, booking, contact and guide forms: name, phone, email, property address or postcode, the services you’re interested in, preferred dates, notes, and any photos you choose to upload.</li><li>Basic technical information your browser sends when you visit, such as the pages requested. This site does not run advertising trackers.</li></ul>
<h2>Photos you upload</h2>
<p>Photos are used only to understand and quote your job. They’re resized in your browser before upload and stored with your enquiry. Tell us if you’d like them deleted once the job is quoted or completed.</p>
<h2>How we use it</h2>
<ul><li>To prepare and send you a quote, and to confirm bookings.</li><li>To carry out and record work you’ve booked (for warranty, insurance and tax purposes).</li><li>If you ask for them, to send the seasonal reminders you signed up for — every email has an unsubscribe link.</li></ul>
<h2>If an enquiry can’t be sent</h2>
<p>If your connection drops while sending, a copy of the enquiry is kept on your own device (in your browser’s storage) so it can be retried. It is deleted once sent, or you can clear it with your browser’s site data.</p>
<h2>Photographs of our work</h2>
<p>Where practical we photograph surfaces before and after work. We may use these to show the standard of our work, with identifying details such as house numbers and number plates kept out of frame or removed. If you’d prefer your property wasn’t photographed or shown, tell us and we won’t — it’s never a condition of the work.</p>
<h2>Who we share it with</h2>
<p>We don’t sell your information and we don’t share it for marketing. It’s stored with the service providers we use to receive and manage enquiries, and shared otherwise only where necessary — for example with our insurer if a claim arises, or where the law requires it.</p>
<h2>How long we keep it</h2>
<p>Enquiries that don’t become jobs are kept for a reasonable period and then deleted. Records of completed work are kept as long as tax and insurance obligations require.</p>
<h2>Your choices</h2>
<p>You can ask what we hold about you, ask us to correct it, or ask us to delete it where we’re not required to keep it. Email <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.</p>
<h2>Contact</h2>
<p>Stride Exterior Cleaning · ABN ${BUSINESS.abn} · Redland Bay, QLD 4165 · ${BUSINESS.email}</p>
</div></div></section>`;
  return layout({ path: '/privacy/', title: 'Privacy Policy', description: 'How Stride Exterior Cleaning collects, uses and protects your information.', body });
}

export function terms() {
  const body = `${pageHero({ crumbList: [['Home', '/'], ['Terms', '/terms/']], kicker: 'Legal', title: 'Terms of use', lede: 'The short version: information on this site is general, quotes are confirmed in writing, and nothing here replaces advice about your specific property.', ctas: false })}
<section class="section"><div class="wrap"><div class="prose">
<p class="small">Last updated October 2026.</p>
<h2>General information</h2><p>Articles, guides and downloadable packs are general information for South-East Queensland homeowners. They are researched and sourced, but they are not advice about your particular property. Always follow the manufacturer’s instructions for your materials.</p>
<h2>Quotes and bookings</h2><p>A quote request or booking request is an enquiry, not a contract. Prices, scope and arrival times are confirmed in writing before work is booked. Booking requests are confirmed by a person; a preferred date is not guaranteed until confirmed.</p>
<h2>Imagery</h2><p>Photographs labelled “demonstration” are licensed stock and are not photographs of Stride’s work. 3D renders are original illustrations of a model home.</p>
<h2>Downloads</h2><p>Free guides may be printed and shared for personal, non-commercial use with attribution to Stride Exterior Cleaning.</p>
<h2>Contact</h2><p>Questions about these terms: <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.</p>
</div></div></section>`;
  return layout({ path: '/terms/', title: 'Terms of Use', description: 'Terms of use for the Stride Exterior Cleaning website, quotes, bookings and free guides.', body });
}

export function thankYou() {
  const body = `<section class="phero"><div class="wrap"><div class="phero-grid">
  <div>
    <p class="spec spec--blue" data-ty-kicker>Enquiry received</p>
    <h1 class="display" data-ty-title>Thanks — that’s with us.</h1>
    <p class="lede" data-ty-lede>A real person reads every enquiry. You’ll hear back within one business day with a scope and price, or a time for a quick free visit if your home needs one.</p>
    <p class="ref mt-2" data-ty-ref hidden><span class="spec">Reference</span><b class="num" data-ty-refnum></b></p>
  </div>
  <div class="phero-aside">${pic('story-done', { alt: 'The model house, fully clean', sizes: '(min-width: 900px) 40vw, 90vw', eager: true })}</div>
</div></div></section>
<section class="section"><div class="wrap">
  <div class="grid">
    <div style="grid-column:1 / span 5">
      <h2 class="h3 mb-2">What happens next</h2>
      <ol class="timeline">
        <li class="is-done"><b>Enquiry received</b>Your details and any photos are with us.</li>
        <li><b>We review it</b>Within one business day, usually sooner.</li>
        <li><b>Scope &amp; price, in writing</b>Each surface, its method, and what will lift versus lighten.</li>
        <li><b>You choose a date</b>Confirmed with an arrival window — no obligation until then.</li>
      </ol>
    </div>
    <div style="grid-column:7 / -1">
      <h2 class="h3 mb-2">While you wait</h2>
      <p class="mb-2">A free guide worth reading before the day:</p>
      <a class="btn btn--ink" href="${u('/guides/files/stride-before-you-book.pdf')}" download data-guide="before-you-book">${icon('download', 'arr')} Before You Book (PDF)</a>
      <p class="mt-3"><a class="textlink" href="${u('/learn/')}">Browse the education centre ${arr()}</a></p>
    </div>
  </div>
</div></section>`;
  return layout({ path: '/thank-you/', title: 'Thank You', description: 'Your enquiry has been received by Stride Exterior Cleaning.', body, noindex: true, scripts: ['/assets/js/forms.js'] });
}

export function notFound() {
  const body = `<section class="phero"><div class="wrap"><div class="phero-grid">
  <div><p class="spec">404</p><h1 class="display">This page has been <span class="soft">washed away.</span></h1><p class="lede">The address may have changed. These are the places most people are looking for:</p>
  <div class="btn-row mt-3"><a class="btn" href="${u('/')}">Home ${arr()}</a><a class="btn btn--ghost" href="${u('/services/')}">Services</a><a class="btn btn--ghost" href="${u('/quote/')}">Free quote</a><a class="btn btn--ghost" href="${u('/learn/')}">Learn</a></div></div>
  <div class="phero-aside">${pic('story-clean', { alt: '', sizes: '40vw', eager: true })}</div>
</div></div></section>`;
  return layout({ path: '/404.html', title: 'Page Not Found', description: 'This page could not be found.', body, noindex: true });
}
