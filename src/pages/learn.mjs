import { u, abs, esc, arr, icon, pic } from '../lib/html.mjs';
import { layout } from '../templates/layout.mjs';
import { sectionHead, cta, faqList, crumbs, resetFigures } from '../templates/parts.mjs';
import { SERVICES } from '../content/services.mjs';
import { GUIDES } from '../content/guides.mjs';
import { BUSINESS_FAQS } from '../content/faqs.mjs';
import { articleRow, guideCard, coverPic } from './home.mjs';

const CATS = ['Methods', 'Surfaces', 'Roofs & gutters', 'Seasonal care', 'Hiring & costs', 'Local knowledge'];
const catSlug = (c) => c.toLowerCase().replace(/[^a-z]+/g, '-');

/* Which render illustrates an article, and which service it leads to. */
const ARTICLE_META = {
  'pressure-washing-vs-soft-washing': { img: 'focus-house', svc: 'house-washing', guide: 'surface-guide' },
  'driveway-concrete-stains-and-sealing': { img: 'focus-driveway', svc: 'driveway-cleaning', guide: 'surface-guide' },
  'house-washing-seq-humidity': { img: 'story-vision', svc: 'house-washing', guide: 'exterior-care-calendar' },
  'pavers-natural-stone-pool-surrounds': { img: 'focus-pool', svc: 'pool-surround-cleaning', guide: 'surface-guide' },
  'timber-decks-fences-cleaning-oiling': { img: 'focus-paths', svc: 'path-patio-cleaning', guide: 'surface-guide' },
  'roof-cleaning-south-east-queensland': { img: 'focus-roof', svc: 'roof-cleaning', guide: 'storm-season-ready' },
  'gutters-storm-season-seq': { img: 'focus-gutter', svc: 'gutter-cleaning', guide: 'storm-season-ready' },
  'solar-panel-cleaning-does-it-matter': { img: 'focus-solar', svc: 'solar-panel-cleaning', guide: 'storm-season-ready' },
  'window-cleaning-streak-free-bayside': { img: 'focus-window', svc: 'window-cleaning', guide: 'exterior-care-calendar' },
  'seasonal-exterior-care-calendar-seq': { img: 'story-done', svc: null, guide: 'exterior-care-calendar' },
  'how-to-choose-an-exterior-cleaner-in-queensland': { img: 'story-layers', svc: null, guide: 'before-you-book' },
  'what-affects-the-cost-of-exterior-cleaning': { img: 'model-clean', svc: null, guide: 'before-you-book' },
  'wastewater-run-off-and-the-environment': { img: 'story-drive', svc: null, guide: 'before-you-book' },
  'getting-your-home-ready-for-sale-or-rental-inspection': { img: 'story-clean', svc: null, guide: 'exterior-care-calendar' }
};
export const articleMeta = (slug) => ARTICLE_META[slug] || { img: 'model-clean', svc: null, guide: 'surface-guide' };

export function learnHub(articles, facts) {
  resetFigures();
  const sorted = [...articles].sort((a, b) => CATS.indexOf(a.category) - CATS.indexOf(b.category));
  const body = `<section class="phero"><div class="wrap">
  ${crumbs([['Home', '/'], ['Learn', '/learn/']])}
  <div class="phero-grid">
    <div><p class="spec spec--ink">Homeowner education centre</p><h1 class="display">Know your surfaces <span class="soft">before you book.</span></h1>
    <p class="lede">Plain-English, researched guides to what’s growing on your roof, why render shouldn’t be blasted, what the rules are on run-off, and how to compare quotes. Every article lists its sources.</p></div>
    <div class="phero-aside">${pic('story-layers', { alt: 'The model house separated into its layers', sizes: '(min-width: 900px) 40vw, 90vw', eager: true })}</div>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="chips mb-3" role="group" aria-label="Filter by topic" data-filter>
    <button type="button" aria-pressed="true" data-cat="all">All topics</button>
    ${CATS.filter((c) => articles.some((a) => a.category === c)).map((c) => `<button type="button" aria-pressed="false" data-cat="${catSlug(c)}">${esc(c)}</button>`).join('')}
  </div>
  <div class="alist" data-filter-list>
    ${sorted.map((a) => articleRow(a).replace('<a class="arow"', `<a class="arow" data-cat="${catSlug(a.category)}"`)).join('')}
  </div>
</div></section>
${facts.length ? `<section class="section band"><div class="wrap">
  ${sectionHead('Worth knowing.', 'Short facts from the research behind these articles — each with its source.')}
  <div class="tiles" data-stagger>
    ${facts.slice(0, 6).map((f) => `<figure class="fact" style="margin:0;border-top:1px solid rgba(255,255,255,.18);padding-top:20px"><blockquote style="margin:0;color:#fff;font-size:19px;line-height:1.45">${f.html}</blockquote>${f.source ? `<figcaption class="spec mt-1"><a href="${esc(f.source.url)}" rel="noopener" target="_blank" style="color:#8ea2b8">${esc(f.source.title)}</a></figcaption>` : ''}</figure>`).join('')}
  </div>
</div></section>` : ''}
<section class="section"><div class="wrap">
  ${sectionHead('Free guides<br>to keep.', 'Designed to print. No email wall — just download.')}
  <div class="guides">${GUIDES.map(guideCard).join('')}</div>
</div></section>
${cta()}`;
  return layout({ path: '/learn/', title: 'Homeowner Education Centre | Exterior Care in South-East Queensland', description: 'Researched, sourced guides to roof, render, driveway, gutter, window and solar cleaning in South-East Queensland — plus hiring, cost and run-off rules.', body, crumbs: [['Home', '/'], ['Learn', '/learn/']], scripts: ['/assets/js/forms.js'] });
}

export function articlePage(a, articles) {
  resetFigures();
  const meta = articleMeta(a.slug);
  const svc = meta.svc ? SERVICES.find((s) => s.slug === meta.svc) : null;
  const guide = GUIDES.find((g) => g.slug === meta.guide);
  const related = articles.filter((x) => x.slug !== a.slug && (x.category === a.category || articleMeta(x.slug).guide === meta.guide)).slice(0, 3);
  const path = `/learn/${a.slug}/`;
  const sourcesCount = (a.html.match(/<div class="sources">[\s\S]*?<\/div>/) || [''])[0].split('<li>').length - 1;
  const body = `<article>
<header class="phero"><div class="wrap">
  ${crumbs([['Home', '/'], ['Learn', '/learn/'], [a.title, path]])}
  <div class="phero-grid">
    <div>
      <p class="spec spec--blue">${esc(a.category)}</p>
      <h1 class="display" style="font-size:clamp(38px,1.4rem + 3.4vw,72px)">${esc(a.title)}</h1>
      <p class="lede">${esc(a.standfirst)}</p>
      <div class="article-meta"><span class="spec">${a.readingMinutes} min read</span><span class="spec">${sourcesCount} sources</span><span class="spec">Reviewed October 2026</span></div>
    </div>
    <div class="phero-aside">${pic(meta.img, { alt: '', sizes: '(min-width: 900px) 40vw, 90vw', eager: true })}</div>
  </div>
</div></header>
<div class="section section--tight"><div class="wrap">
  <div class="article-grid">
    <nav class="toc" aria-label="In this article"><p class="spec mb-1">In this article</p><ol>${a.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}<li><a href="#sources">Sources</a></li></ol></nav>
    <div>
      ${a.keyTakeaways && a.keyTakeaways.length ? `<aside class="takeaways"><span class="spec spec--ink">Key takeaways</span><ul>${a.keyTakeaways.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></aside>` : ''}
      <div class="prose">${a.html}</div>
      <p class="small mt-3" style="max-width:720px">General information for South-East Queensland homeowners, not advice about your specific property. Always follow the manufacturer’s instructions for your materials.</p>
      ${svc ? `<div class="panel panel--wash mt-3" style="max-width:720px"><span class="spec spec--blue">Related service</span><p class="h3 mt-1">${esc(svc.name)}</p><p class="mt-1">${esc(svc.lede)}</p><div class="btn-row mt-2"><a class="btn" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost" href="${u(`/services/${svc.slug}/`)}">About ${esc(svc.short.toLowerCase())}</a></div></div>` : ''}
    </div>
  </div>
</div></div>
</article>
${guide ? `<section class="section section--paper"><div class="wrap"><div class="guides" style="grid-template-columns:1fr;max-width:860px">${guideCard(guide)}</div></div></section>` : ''}
${related.length ? `<section class="section"><div class="wrap">${sectionHead('Keep reading.')}<div class="alist">${related.map(articleRow).join('')}</div></div></section>` : ''}
${cta()}`;
  return layout({
    path, title: a.title, description: a.description, body, image: `/assets/img/${meta.img}-1400.webp`.replace('-1400', meta.img.startsWith('story') ? '-1280' : '-1400'),
    crumbs: [['Home', '/'], ['Learn', '/learn/'], [a.title, path]],
    ld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, articleSection: a.category, dateModified: '2026-10-15', author: { '@type': 'Organization', name: 'Stride Exterior Cleaning', url: abs('/') }, publisher: { '@id': abs('/') + '#business' }, mainEntityOfPage: abs(path), image: abs(`/assets/img/${meta.img}-${meta.img.startsWith('story') ? 1280 : 1400}.webp`) }],
    scripts: ['/assets/js/forms.js']
  });
}

export function faqsPage(groups) {
  const all = [{ title: 'Working with Stride', id: 'stride', items: BUSINESS_FAQS.map(([q, a]) => [q, a]) }, ...groups];
  const total = all.reduce((n, g) => n + g.items.length, 0);
  const body = `<section class="phero"><div class="wrap">
  ${crumbs([['Home', '/'], ['Questions', '/faqs/']])}
  <div class="phero-grid">
    <div><p class="spec spec--ink">Questions</p><h1 class="display">${total} answers, <span class="soft">sourced.</span></h1>
    <p class="lede">How Stride works, plus the questions homeowners ask most about exterior cleaning in Queensland — booking, safety, run-off, roofs, surfaces and cost. Research-based answers list their sources.</p></div>
    <div class="phero-aside">
      <label class="flabel" for="faq-search">Search the questions</label>
      <input class="input" id="faq-search" type="search" placeholder="e.g. render, insurance, gutters" data-faq-search autocomplete="off">
      <p class="small mt-1" data-faq-count aria-live="polite"></p>
    </div>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="chips mb-4" aria-label="Jump to a topic">${all.map((g) => `<a href="#${g.id}">${esc(g.title)}</a>`).join('')}</div>
  ${all.map((g) => `<div class="faq-group" id="${g.id}" data-faq-group><h2 class="h3 mb-2">${esc(g.title)}</h2>${faqList(g.items, { idPrefix: g.id })}</div>`).join('')}
  <p class="small mt-4">Not covered here? <a class="link" href="${u('/contact/')}">Ask us directly</a> and it will be answered by a person.</p>
</div></section>
${cta()}`;
  return layout({
    path: '/faqs/', title: 'Exterior Cleaning Questions & Answers', description: 'Answers to common questions about exterior cleaning in Queensland: pressure vs soft washing, roofs, gutters, run-off rules, insurance, preparation and cost.', body,
    crumbs: [['Home', '/'], ['Questions', '/faqs/']],
    ld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.flatMap((g) => g.items).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: String(a).replace(/<[^>]+>/g, '') } })) }],
    scripts: ['/assets/js/forms.js']
  });
}

export function guidesPage() {
  const body = `<section class="phero"><div class="wrap">
  ${crumbs([['Home', '/'], ['Free guides', '/guides/']])}
  <div class="phero-grid">
    <div><p class="spec spec--ink">Free information packs</p><h1 class="display">Guides worth <span class="soft">keeping.</span></h1>
    <p class="lede">Four illustrated, printable guides for South-East Queensland homeowners — researched, sourced, and designed like publications rather than flyers. Download them free; no email required.</p></div>
    <div class="phero-aside"><div class="guide-cover" style="max-width:260px;margin-left:auto">${coverPic(GUIDES[0], { alt: 'Cover of The Surface Guide', sizes: '260px', eager: true })}</div></div>
  </div>
</div></section>
<section class="section"><div class="wrap">
  ${GUIDES.map((g, i) => `<article class="grid${i ? ' mt-4' : ''}" id="${g.slug}" style="align-items:center;padding-top:${i ? '56px' : '0'};${i ? 'border-top:1px solid var(--line)' : ''}">
    <div style="grid-column:1 / span 4"><div class="guide-cover" style="max-width:320px">${coverPic(g, { alt: `Cover of ${g.title}`, sizes: '(min-width: 900px) 25vw, 70vw' })}</div></div>
    <div style="grid-column:6 / -1">
      <span class="spec">Guide ${String(i + 1).padStart(2, '0')} · ${g.pages} pages · PDF</span>
      <h2 class="h2 mt-1">${esc(g.title)}</h2>
      <p class="lede mt-1">${esc(g.subtitle)}</p>
      <p class="mt-2">${esc(g.summary)}</p>
      <ul class="ticks mt-2" style="max-width:640px">${g.inside.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="btn-row mt-3"><a class="btn btn--lg" href="${u(`/guides/files/${g.file}`)}" download data-guide="${g.slug}">${icon('download', 'arr')} Download free</a><span class="small" style="align-self:center">${'{{size:' + g.file + '}}'}</span></div>
    </div>
  </article>`).join('')}
</div></section>
<section class="section section--paper"><div class="wrap">
  <div class="grid">
    <div style="grid-column:1 / span 5"><h2 class="h2">Seasonal reminders, if you want them.</h2><p class="lede mt-2">Four short emails a year: what to check before storm season, when growth peaks, and when it’s worth booking. Optional — the guides above are yours either way.</p></div>
    <form class="form-card" style="grid-column:7 / -1" data-lead-form="guide" novalidate>
      <div class="row-2">
        <div class="field"><label class="flabel" for="g-name">First name</label><input class="input" id="g-name" name="name" autocomplete="given-name" required data-error="Please tell us your name."></div>
        <div class="field"><label class="flabel" for="g-email">Email</label><input class="input" id="g-email" name="email" type="email" autocomplete="email" required data-error="Please enter a valid email address."></div>
      </div>
      <div class="field"><label class="flabel" for="g-pc">Postcode <span class="opt">optional</span></label><input class="input" id="g-pc" name="postcode" inputmode="numeric" maxlength="4" autocomplete="postal-code" style="max-width:160px"></div>
      <div class="hp" aria-hidden="true"><label>Leave this empty<input name="company_website" tabindex="-1" autocomplete="off"></label></div>
      <label class="consent"><input type="checkbox" name="consent" required data-error="Please agree to receive the reminders."><span>Send me seasonal exterior-care reminders. I can unsubscribe at any time. <a class="link" href="${u('/privacy/')}">Privacy</a></span></label>
      <div class="form-nav"><span class="small">Four emails a year.</span><button class="btn" type="submit">Sign me up ${arr()}</button></div>
      <div data-form-status hidden></div>
    </form>
  </div>
</div></section>
${cta()}`;
  return layout({ path: '/guides/', title: 'Free Exterior Care Guides (PDF)', description: 'Free printable guides for Queensland homeowners: The Surface Guide, the Redlands Exterior Care Calendar, Before You Book, and Storm-Season Ready.', body, crumbs: [['Home', '/'], ['Free guides', '/guides/']], scripts: ['/assets/js/forms.js'] });
}

export { CATS };
