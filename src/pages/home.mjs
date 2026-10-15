import fs from 'node:fs';
import path from 'node:path';
import { u, esc, arr, icon, pic } from '../lib/html.mjs';
import { MEDIA } from '../lib/media.mjs';
import { layout } from '../templates/layout.mjs';
import { figure, beforeAfter, sectionHead, surfaceIndex, cta, areaMap, faqList, WORK } from '../templates/parts.mjs';
import { CHAPTERS, STORY_HOTSPOTS, LAYER_LABELS } from '../content/story.mjs';
import { AREAS } from '../content/areas.mjs';
import { SITE } from '../content/site.mjs';
import { GUIDES } from '../content/guides.mjs';
import { BUSINESS_FAQS } from '../content/faqs.mjs';

export function home({ SRC, articles }) {
  const hot = JSON.parse(fs.readFileSync(path.join(SRC, 'media/renders/hotspots.json'), 'utf8'))['story-arrive'];
  const hotPos = Object.fromEntries(hot.map((h) => [h.id, h]));
  const story = () => storyMarkup(hotPos);
  const featured = ['pressure-washing-vs-soft-washing', 'roof-cleaning-south-east-queensland', 'how-to-choose-an-exterior-cleaner-in-queensland', 'seasonal-exterior-care-calendar-seq']
    .map((s) => articles.find((a) => a.slug === s)).filter(Boolean);

  const body = `
${story()}

<span id="after-story"></span>
<section class="section" aria-labelledby="idx-h">
  <div class="wrap">
    ${sectionHead('<span id="idx-h">Eight surfaces.<br>Eight different methods.</span>', 'Concrete can take a rotary surface cleaner. Render, tile, timber, stone and glass cannot. Choosing correctly is the actual skill — pick the surface that’s bothering you.')}
    ${surfaceIndex()}
  </div>
</section>

<section class="section section--paper" aria-labelledby="std-h">
  <div class="wrap">
    <div class="statement" data-reveal>
      <h2 id="std-h">Cleaning is the job. <span class="soft">Not damaging the property is the standard.</span></h2>
      <div class="body">
        <p class="lede">Concrete takes pressure. Render, weatherboard, fibre cement and natural stone do not — force drives water behind the surface, lifts coatings and etches soft stone, and none of that is undone by cleaning it again.</p>
        <p class="mt-2">So every job starts with the surface: what it is, how old it is, what condition it’s in. Then the method follows — soft wash, surface cleaner, pure water or hand work — and you’re told what will lift and what will only lighten before anything is booked.</p>
        <a class="textlink mt-2" href="${u('/why-stride/')}">The Stride standard ${arr()}</a>
      </div>
    </div>
    <div class="grid mt-4">
      <div style="grid-column:1 / span 7">${figure('work-steam', { caption: 'Rotary surface cleaning spreads force evenly across a slab', alt: 'A worker using a rotary surface cleaner on paving', ratio: 'ratio-photo', sizes: '(min-width: 1000px) 55vw, 100vw' })}</div>
      <div style="grid-column:9 / span 4;align-self:end">${figure('focus-house', { caption: 'Soft wash: the same wall, before and after the pass', alt: 'The model house wall with the dirty and cleaned halves side by side', ratio: 'ratio-tall', sizes: '(min-width: 1000px) 30vw, 100vw' })}</div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ba-h">
  <div class="wrap">
    ${sectionHead('<span id="ba-h">See the difference<br>a pass makes.</span>', 'Drag the line. These are demonstration photographs — genuine Stride job documentation replaces them as work is completed and customers agree to share it.')}
    <div class="grid">
      <div style="grid-column:1 / span 8" data-ba-group>
        ${WORK.map((w, i) => `<div data-ba-panel="${w.id}"${i ? ' hidden' : ''}>${beforeAfter(w.id)}</div>`).join('')}
      </div>
      <div style="grid-column:9 / -1;align-self:end">
        <div class="chips mb-2" role="group" aria-label="Choose a surface">${WORK.map((w, i) => `<button type="button" aria-pressed="${i === 0}" data-ba-tab="${w.id}">${esc(w.title)}</button>`).join('')}</div>
        ${WORK.map((w, i) => `<dl class="summary" data-ba-meta="${w.id}"${i ? ' hidden' : ''}><div><dt class="spec">Surface</dt><dd>${esc(w.surface)}</dd></div><div><dt class="spec">Method</dt><dd>${esc(w.method)}</dd></div><div><dt class="spec">Images</dt><dd>Demonstration</dd></div></dl>`).join('')}
        <a class="textlink mt-2" href="${u('/our-work/')}">All before &amp; after ${arr()}</a>
      </div>
    </div>
  </div>
</section>

<section class="section band" aria-labelledby="proc-h">
  <svg class="band-mark" viewBox="0 0 89 135" aria-hidden="true"><path fill="#fff" d="M88.59,16.08 L63.82,24.6 C62.33,17.34 55.32,13.21 47.52,14.99 C39.72,16.77 33.59,23.9 33.27,31.58 C32.96,39.26 38.54,45.04 46.27,45.04 C66.64,45.04 81.37,60.3 80.53,80.54 C79.69,100.77 63.55,119.57 42.98,124.27 C22.41,128.97 3.94,118.08 0,98.93 L24.77,90.41 C26.26,97.67 33.27,101.8 41.08,100.02 C48.88,98.24 55,91.11 55.32,83.43 C55.64,75.76 50.05,69.97 42.32,69.97 C21.95,69.97 7.22,54.71 8.06,34.47 C8.9,14.24 25.04,-4.56 45.61,-9.26 C66.18,-13.96 84.66,-3.07 88.59,16.08 Z" transform="translate(0,10)"/></svg>
  <div class="wrap">
    ${sectionHead('<span id="proc-h">Quoted, scoped,<br>cleaned, checked.</span>', 'Four steps, no surprises. Most homes can be quoted from photos — if yours needs a look in person, we’ll say so and book a free visit.')}
    <div class="process" data-process>
      <span class="process-line" aria-hidden="true"></span>
      <div class="step"><h3>Send photos</h3><p>Two minutes: tick what needs cleaning, add your postcode and a few phone photos.</p></div>
      <div class="step"><h3>Get a written scope</h3><p>A fixed price, each surface and its method, and what will lift versus only lighten.</p></div>
      <div class="step"><h3>We clean, surface by surface</h3><p>Plants protected, run-off managed, the right method on every material.</p></div>
      <div class="step"><h3>Walk-around &amp; photos</h3><p>We check it with you, and you get before-and-after photos from the same positions.</p></div>
    </div>
    <div class="btn-row mt-4"><a class="btn btn--white btn--lg" href="${u('/quote/')}">Start with photos ${arr()}</a><a class="btn btn--line-white btn--lg" href="${u('/book/')}">Request a booking</a></div>
  </div>
</section>

<section class="section" aria-labelledby="learn-h">
  <div class="wrap">
    ${sectionHead('<span id="learn-h">Know your surfaces<br>before you book.</span>', 'Plain-English guides to what’s on your roof, why render shouldn’t be blasted, and how to compare quotes — researched, sourced, and free.')}
    <div class="alist">
      ${featured.map((a) => articleRow(a)).join('')}
    </div>
    <div class="flex wrap-any between mt-3"><a class="textlink" href="${u('/learn/')}">All ${articles.length} articles ${arr()}</a></div>
    <div class="guides mt-4">
      ${GUIDES.slice(0, 2).map((g) => guideCard(g)).join('')}
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="area-h">
  <div class="wrap">
    <div class="grid">
      <div style="grid-column:1 / span 5">
        <h2 id="area-h" class="h2">Redlands first.</h2>
        <p class="lede mt-2">Based in Redland Bay, working across the Redlands every week, and taking selected work through bayside and south-east Brisbane.</p>
        <ul class="area-list mt-3">${AREAS.map((a) => `<li><a href="${u(`/service-areas/${a.slug}/`)}"><span>${esc(a.name)}</span><span class="spec">${esc(a.postcode)}</span></a></li>`).join('')}</ul>
      </div>
      <div style="grid-column:7 / -1">${areaMap()}</div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap">
    ${sectionHead('<span id="faq-h">Before you book.</span>', 'The questions people ask most. There are more in the <a class="link" href="' + u('/faqs/') + '">full FAQ</a>.')}
    ${faqList(BUSINESS_FAQS.slice(0, 6))}
  </div>
</section>

${cta()}
`;
  return layout({
    path: '/',
    title: 'Exterior Cleaning Redlands & Brisbane | Stride Exterior Cleaning',
    description: SITE.description,
    body,
    image: '/assets/img/story-arrive-1280.webp',
    head: `<link rel="preload" as="image" type="image/avif" imagesrcset="${['640', '960', '1280', '1600'].map((w) => `${u(`/assets/img/story-arrive-${w}.avif`)} ${w}w`).join(', ')}" imagesizes="(min-width: 960px) 62vw, 100vw" fetchpriority="high">`,
    bodyClass: 'is-home',
    ld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: BUSINESS_FAQS.slice(0, 6).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }]
  });
}

export function articleRow(a) {
  return `<a class="arow" href="${u(`/learn/${a.slug}/`)}">
  <span class="spec cat">${esc(a.category)}</span>
  <div><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p></div>
  <span class="spec rt">${a.readingMinutes} min read</span>
  <span class="go" aria-hidden="true">${icon('arrow')}</span>
</a>`;
}

export function guideCard(g) {
  return `<article class="guide" data-reveal>
  <a class="guide-cover" href="${u(`/guides/#${g.slug}`)}" tabindex="-1" aria-hidden="true">${coverPic(g, { alt: '', sizes: '(min-width: 860px) 18vw, 40vw' })}</a>
  <div>
    <span class="spec">Free guide · ${g.pages} pages · PDF</span>
    <h3 class="h3">${esc(g.title)}</h3>
    <p>${esc(g.summary)}</p>
    <div class="btn-row"><a class="btn btn--ink btn--sm" href="${u(`/guides/files/${g.file}`)}" download data-guide="${g.slug}">${icon('download', 'arr')} Download</a><a class="btn btn--ghost btn--sm" href="${u(`/guides/#${g.slug}`)}">What’s inside</a></div>
  </div>
</article>`;
}


/* ------------------------------------------------------------ the story */
const CH = {
  roof: { kicker: '01 · The roof', title: 'Start at the top.', body: 'Lichen and black streaks hold moisture against your tiles. We lift them with a soft wash — a cleaning solution, time to work, then a gentle rinse. Never a blaster.', spec: [['Surface', 'Concrete tile'], ['Method', 'Soft wash'], ['Pressure', 'Low']], meter: ['roof', 'Lichen removed'], fig: 'Soft wash crossing the roof — clean on the left, weathered on the right' },
  layers: { kicker: '02 · Every layer', title: 'Eight surfaces. Eight methods.', body: 'A home isn’t one surface. Tile, render, glass, steel, concrete and stone each need a different approach — and choosing correctly is the part most cleaners skip.', spec: [['Roof', 'Soft wash'], ['Walls', 'Low pressure'], ['Glass', 'Pure water']], meter: ['layers', 'Layers inspected'], fig: 'The house taken apart: site, ground floor, upper floor, roof, solar' },
  vision: { kicker: '03 · Grime vision', title: 'See where growth takes hold.', body: 'Algae and mould don’t spread evenly. They climb from damp ground, gather on shaded walls and settle under eaves. Move the lens over the house to inspect a surface.', fig: 'Grime vision — warmer colours show where growth takes hold first' },
  drive: { kicker: '04 · The driveway', title: 'Even passes. No stripes.', body: 'A wand held close can etch lines into concrete. A rotary surface cleaner spreads the force evenly, lane by lane, then edges and joints are finished by hand.', spec: [['Pressure', 'Set to the slab'], ['Edges', 'By hand'], ['Run-off', 'Managed']], meter: ['drive', 'Coverage'], fig: 'Rotary surface cleaning, lane by lane' },
  done: { kicker: '05 · Done', title: 'Your home, back to its best.', body: 'That’s the Stride standard on every job: the right method for every surface, run-off managed, a walk-around with you, and before-and-after photos.', fig: 'Every surface clean' }
};

function storyMarkup(hotPos) {
  const chap = (c, i) => {
    if (c.id === 'arrive') return `<article class="chap chap--hero is-active" data-chapter="${i}" id="ch-arrive">
      <div class="chap-text">
        <p class="spec spec--ink">Exterior cleaning · Redlands &amp; Greater Brisbane</p>
        <h1 class="display">Every surface, cleaned the <span class="soft">right&nbsp;way.</span></h1>
        <p class="lede">Roofs, render, driveways, gutters, glass and solar — each cleaned with the method its material needs. Nothing forced, nothing etched, nothing left behind.</p>
        <div class="btn-row"><a class="btn btn--lg" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost btn--lg" href="${u('/book/')}">Book a time</a></div>
        <ul class="hero-proof"><li class="spec spec-dot">Free photo quotes</li><li class="spec spec-dot">$10m public liability</li><li class="spec spec-dot">Based in Redland Bay</li></ul>
        <p class="scroll-cue spec only-live" aria-hidden="true"><span class="cue-line"></span>Scroll to clean the house · drag to scrub it yourself</p>
      </div>
    </article>`;
    const d = CH[c.id];
    return `<article class="chap" data-chapter="${i}" id="ch-${c.id}" aria-labelledby="ch-${c.id}-h">
      <div class="chap-text">
        <p class="spec spec--blue">${d.kicker}</p>
        <h2 id="ch-${c.id}-h" class="h2">${d.title}</h2>
        <p class="chap-body">${d.body}</p>
        ${d.spec ? `<dl class="chap-spec">${d.spec.map(([k, v]) => `<div><dt class="spec">${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        ${d.meter ? `<div class="chap-meter only-live" data-meter="${d.meter[0]}"><span class="spec">${d.meter[1]}</span><span class="cm-track"><span class="cm-fill"></span></span><span class="spec spec--ink num" data-val="${d.meter[0]}">0%</span></div>` : ''}
        ${c.id === 'drive' ? `<p class="spec only-live mt-1">Lane <span class="num" data-val="lane">1 of 3</span></p>` : ''}
        ${c.id === 'vision' ? `<div class="lens-out only-live" data-lens-out aria-live="polite"><div><span class="spec">Surface</span><b data-lens-name>Move the lens over the house</b></div><div><span class="spec">What grows</span><b data-lens-growth>—</b></div><div><span class="spec">How we clean it</span><b data-lens-method>—</b></div></div>` : ''}
        ${c.id === 'done' ? `<div class="btn-row mt-2"><a class="btn btn--lg" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost btn--lg" href="${u('/services/')}">Explore services</a></div>` : ''}
      </div>
      <figure class="chap-still fig only-static">
        <div class="fig-frame">${pic(`story-${c.id}`, { alt: d.fig, sizes: '(min-width: 960px) 55vw, 100vw' })}</div>
        <figcaption><span class="spec spec--ink">${d.fig}</span><span class="spec">Stride 3D study</span></figcaption>
      </figure>
    </article>`;
  };
  return `<section class="story" data-story aria-label="The Clean Pass: how a Stride clean works, surface by surface">
  <div class="story-pin">
    <div class="story-stage" data-story-stage>
      <div class="stage-frame" data-frame>
        <div class="poster">${pic('story-arrive', { alt: 'A white architectural model of a two-storey Redlands home, weathered with roof lichen, wall algae and a mould-blackened driveway; the pool area at left has already been cleaned.', sizes: '(min-width: 960px) 62vw, 100vw', eager: true, priority: true })}</div>
        ${STORY_HOTSPOTS.map((h) => `<a class="hot" href="${u(h.href)}" data-hot="${h.id}" style="left:${(hotPos[h.id].x * 100).toFixed(2)}%;top:${(hotPos[h.id].y * 100).toFixed(2)}%"><span class="hot-dot" aria-hidden="true"></span><span class="hot-label spec">${esc(h.label)}</span><span class="sr">: ${esc(h.label.split(' · ')[0])} cleaning</span></a>`).join('')}
        <div class="lens-ring only-live" data-lens aria-hidden="true"></div>
        ${LAYER_LABELS.map((l) => `<span class="layer-label only-live" data-layer-label aria-hidden="true"><b class="spec">${l.n}</b><span><strong>${esc(l.label)}</strong><span class="spec">${esc(l.method)}</span></span></span>`).join('')}
      </div>
    </div>
    <div class="story-chapters">
      ${CHAPTERS.map(chap).join('')}
    </div>
    <nav class="story-rail only-live" data-rail aria-label="Story chapters">${CHAPTERS.map((c, i) => `<button type="button" aria-current="${i ? 'false' : 'step'}"><span class="spec">${String(i).padStart(2, '0')}</span><span class="rail-name">${c.name}</span></button>`).join('')}</nav>
    <div class="story-tools only-live">
      <button class="chip" type="button" data-sound aria-pressed="false">${icon('drop')}<span>Sound off</span></button>
      <a class="chip" href="#after-story">${icon('down')}<span>Skip</span></a>
    </div>
    <div class="story-progress only-live" aria-hidden="true"><span></span></div>
  </div>
</section>`;
}

export const coverPic = (g, o) => pic(MEDIA[`cover-${g.slug}`] ? `cover-${g.slug}` : g.cover, o);
