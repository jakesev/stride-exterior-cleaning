# Stride Exterior Cleaning: design research

Prepared 15 Oct 2026 for the creative director.

**How this was gathered.** The sandbox blocked direct page fetches. WebFetch and curl to awwwards.com, lusion.co, baymard.com and nngroup.com all returned DNS or 403 errors. As a result:
- Site observations come from search-result digests and from my earlier knowledge of these sites. Live sites change, so eyeball each one before quoting a specific detail.
- Bundle sizes are measured, not quoted. I bundled minimal scenes with esbuild from current npm tarballs (see §7).

---

## 0. The big picture

Exterior cleaning websites are visually weak almost everywhere. Roundups from [Zarla](https://www.zarla.com/guides/pressure-washing-website-examples), [Jobber](https://www.getjobber.com/academy/pressure-washing/pressure-washing-websites/), [Nano Globals](https://nanoglobals.com/pressure-washing-websites/) and [CyberOptik](https://cyberoptik.net/blog/best-pressure-washing-website-designs) all praise the same basics: before/after photos, one quote CTA, reviews and service lists. None of the sites they praise looks expensive.

That makes the premium bar easy to clear, as long as Stride borrows its visual language from architecture, landscape and luxury-material brands rather than from its own category. Keep the category's proven conversion mechanics underneath. The working formula: **architect's restraint on the surface, plus a trades business's speed to quote.**

---

## 1. Premium home-service businesses

**Sites to study**
- **Sunday (lawn and pest)**, [getsunday.com](https://www.getsunday.com)
  - Cream, forest-green and clay palette with a custom display face ([ecomm.design teardown](https://ecomm.design/site/sunday/sunday-2)).
  - The funnel is address-first and personalises the plan from the property.
  - It shows an honest 4.3★ from 10k+ reviews.
- **Yardzen**, [yardzen.com](https://yardzen.com)
  - Published price tiers: Essential $995, Classic $1,395, Signature $1,995 ([source](https://project.yardzen.com/back-yard)).
  - Photoreal before/after renders and a named project manager.
- **Tesla Solar Roof**, [tesla.com/solarroof](https://www.tesla.com/solarroof)
  - Full-bleed product-on-house imagery and an address-first instant estimate.
  - The CTA is two words.
- **Peachtree Power Wash**, cited by [Nano Globals](https://nanoglobals.com/pressure-washing-websites/)
  - The rare cleaner that publishes prices, with large service buttons and online booking.
  - It is weakened by having no reviews or team photos.

**Why they work**
- The first interaction is about *your* property (address or suburb) rather than a generic form.
- Prices are shown as tiers or ranges.
- Each page has one primary action.
- Review volume beats review perfection.
- Real people are named.

**What makes them feel expensive:** a restrained palette, custom or uncommon type, and photography of results rather than workers posing.

**Avoid (category clichés):** hero stock photos of a man with a wand, red/yellow "FREE QUOTE!" bursts, and a sticky header carrying five badges.

---

## 2. Luxury home-improvement brands

**Sites to study**
- **Henrybuilt**, [henrybuilt.com](https://henrybuilt.com)
  - Explains its "system" and its materials in calm long-form.
  - Large single images with small, precise captions.
- **deVOL Kitchens**, [devolkitchens.co.uk](https://www.devolkitchens.co.uk)
  - Warm, editorial, almost magazine-like photography.
  - Human copy, named paint colours and visible starting prices.
- **Eco Outdoor (AU)**, [ecooutdoor.com.au](https://www.ecooutdoor.com.au)
  - Natural stone and outdoor living. AKQA rebuilt it around a design system called "EO Materials" so the online experience matches the showroom ([case study](https://creativepool.com/akqa/projects/crafted-with-wonder-for-eco-outdoor/who-pooled)).
  - Material close-ups paired with in-situ landscape shots.
- **Artedomus (AU)**, [artedomus.com](https://www.artedomus.com)
  - A stone and tile library: tight grid, neutral ground, material named under every tile.

**Specifics to borrow**
- **Material macro shots.** Show sandstone grain, terracotta tile and Colorbond texture at 1:1, next to wide in-situ frames. For Stride, this means a "surface library": what each surface is, how it fouls, and how Stride treats it.
- **Captions as credibility.** For example: "Sandstone pavers, Ormiston, soft wash + sealing, Feb 2026."
- **Visible starting prices.** These signal confidence rather than cheapness.

---

## 3. Architecture practices (Australian focus)

**Sites to study**
- [Kennedy Nolan](https://www.kennedynolan.com.au) (Melbourne)
- [John Wardle Architects](https://www.johnwardlearchitects.com)
- [Clare Cousins](https://clarecousins.com.au)
- Brisbane: [Shaun Lockyer Architects](https://shaunlockyer.com), [Vokes and Peters](https://vokesandpeters.com) and [Richards and Spence](https://richardsandspence.com). These are your local visual peers, and Redlands clients read the same magazines.

**Common anatomy**
- **Type and colour:** a single grotesk or neo-grotesk, usually one or two weights, with small UI type (12–14px). Large type appears only for project titles. Colour is near-black on white or warm off-white.
- **Project index:** a text table (name, suburb, year, typology) with a hover image preview. It is highly scannable and doubles as proof of volume.
- **Imagery:** full-bleed or strictly gridded photography, never overlaid with text. Captions credit place and photographer.
- **Motion:** slow cross-fades (400–700ms), image reveals clipped from the edge, and almost no bouncing.
- **Calls to action:** effectively one, "Contact" or "Enquire."

**Translate for Stride**
- Build a **"Recent work" index** by suburb, surface, method and month: Cleveland, Wellington Point, Thornlands, Victoria Point, Capalaba, Birkdale, Ormiston, Redland Bay. It is trust, local SEO and texture in one component.
- Use photo captions with a suburb and date.
- Keep the type small and confident.

---

## 4. Premium landscaping and garden design

**Sites to study**
- [Dan Pearson Studio](https://www.danpearsonstudio.com) (UK)
- [Myles Baldwin Design](https://mylesbaldwin.com) (Sydney)
- [Jack Merlo](https://www.jackmerlo.com) (Melbourne)
- [Secret Gardens](https://www.secretgardens.com.au) (Sydney)

**Why they work**
- **Seasonality and time.** Gardens are shown maturing, and a journal shows process, which signals care over time. Stride's equivalent is a **maintenance calendar**: roofs every 2–3 years, mould flare-ups after the wet season, gutters before storm season.
- **Earthy photography with lots of sky and negative space.** Copy is sparse and philosophy-led ("we design around the architecture, the owners…").
- **Long project pages.** Large images, then a short paragraph, then a materials or plant list. Stride's version is case studies: problem, method (pressure, chemistry, dwell time), result.

---

## 5. Award-winning agencies and interactive sites (WebGL on light grounds)

**Studios to study**
- **Lusion**, [lusion.co](https://lusion.co)
  - Its awards include Site of the Year 2023 for Lusion v3 and Site of the Day wins ([Awwwards profile](https://www.awwwards.com/lusion/)).
  - Its homepage is a bright, light-blue/white real-time scene with a physics-y cursor.
- **Oryzo** (by Lusion), [oryzo.ai](https://oryzo.ai)
  - Awwwards Site of the Month, April 2026.
  - One hero object, rendered with inertia and depth-based scrolling ([Utsubo analysis](https://www.utsubo.com/blog/best-threejs-websites-2026)).
  - This is the best model for Stride: a single object, studio-lit, on a light ground.
- **Locomotive**, [locomotive.ca](https://locomotive.ca)
  - Light ground, oversized grotesk headlines with tight tracking, butter-smooth scroll and disciplined grids.
- **Immersive Garden**, [immersive-g.com](https://immersive-g.com)
  - Luxury-brand WebGL; restraint in colour and transitions.

**Lessons**
- **Commit to one hard idea.** The 2026 SOTD pattern is restraint: one strong concept, scroll-sequenced, rather than stacked effects ([Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026), [Svilenkovic](https://svilenkovic.com/3d/awwwards-2026-3d)).
- **Mind the context.** Awwwards winners can afford 5MB pages; a quote funnel can't. Borrow their composition and motion timing, not their payload.

**Light-background 3D hero references (3–5)**
- [lusion.co](https://lusion.co)
- [oryzo.ai](https://oryzo.ai)
- [messenger.abeto.co](https://messenger.abeto.co): a pastel low-poly planet; Awwwards SOTD "Messenger" ([listing](https://www.awwwards.com/sites/messenger)).
- Apple AirPods/iPhone product pages, e.g. [apple.com/airpods-pro](https://www.apple.com/airpods-pro/): scroll-scrubbed image sequences drawn to a canvas, the "pre-rendered 3D" approach.
- The Shopify Editions microsites (cited alongside Cartier in Utsubo's list).

---

## 6. Modern property-maintenance brands

**Sites to study**
- **Thumbtack**, [thumbtack.com](https://www.thumbtack.com)
  - The 2024 rebrand uses a custom FF Mark derivative in Heavy, Bold and Regular only ([guidelines](https://thumbtack.com/brand/guidelines/typography)).
  - Built on the principles "ease, possibility, accomplishment."
  - Shows cost ranges for each job type.
- **Honey Homes**, [honeyhomes.com](https://www.honeyhomes.com)
  - A membership with a dedicated handyman, booked through an app, plus a **free walk-through** that works as reciprocity ([source](https://communityimpact.com/sponsored/honey-homes-offers-personalized-home-maintenance-with-a-smile/)).
- **Hover**, [hover.to](https://hover.to)
  - Turns phone photos into a 3D exterior model.
  - Points toward "send us photos, get a quote" without a site visit.

**Lessons**
- Sell a **relationship and plan**, not a one-off blast. A "Stride Care Plan" (annual roof, gutter and window rotation) suits this pattern.
- Disclose ranges.
- Make photo upload a first-class quote input.

---

## Avoid: generic AI-template tells

**Typography**
- Avoid Inter, Geist, Space Grotesk, Satoshi and General Sans as display faces. They are the defaults of every generator ([impeccable.style/slop](https://impeccable.style/slop), [noqta](https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026)).
- Avoid the serif + italic accent word, especially Instrument Serif italic. It is now the recognisable "vibe-coded" look ([Vadgama](https://keyavadgama.substack.com/p/the-serif-renaissance-in-ai-branding)).

**Colour and surfaces**
- Purple/blue gradients, radial glows, gradient text and Stripe-style mesh-gradient heroes.
- Glassmorphism cards, giant radii on everything, and "Live"/"New" pill badges.

**Layout and components**
- Rows of three identical cards with Lucide icons.
- Bento grids of feature tiles.
- An uppercase tracked eyebrow above every heading.
- Animated "500+ happy customers" counters.
- Logo marquees.

**Imagery and copy**
- Testimonial carousels with stock avatars and floating abstract 3D blobs.
- Copy like "Elevate your home's curb appeal."

**Do instead**
- **Typography:** one characterful grotesk at 2–3 weights.
  - Licensed options: Söhne, Neue Haas Unica, ABC Diatype.
  - Free options, used with care: Schibsted Grotesk, Familjen Grotesk, Host Grotesk, Onest.
  - Display at −0.02 to −0.035em tracking. Body 17–18px at 1.5–1.6 line-height. Measure 60–72ch.
- **Colour:** navy #061426 for text. Stride Blue #0076D1 reserved for **one** thing, the primary action and its focus state.
- **Imagery and captions:** real photography of Redlands houses, with suburb captions.

---

## 7. 3D hero technology for GitHub Pages

**Measured sizes.** Minified with esbuild, then `gzip -9`, from npm tarballs fetched 15 Oct 2026:

| Option | Minimal scene, min / gzip | Notes |
|---|---|---|
| Raw WebGL (one fullscreen shader) | ~3–8 KB / 2–4 KB | Ideal for a 2D-ish shader effect such as a water sheet, a grime wipe or caustics. No model loading. |
| OGL 1.0.11 | 47 KB / **13 KB** | A tiny three-like API (meshes, cameras). |
| three r186 (renderer, mesh, standard material, lights) | 524 KB / **130 KB** | Tree-shaking is weak, because the renderer pulls in most of the core. |
| three + GLTFLoader + DRACOLoader + RoomEnvironment | 611 KB / **154 KB** | Plus the model: aim for under 300 KB with meshopt/Draco and KTX2 textures. Plus the Draco decoder wasm (~300 KB, lazy). |
| React Three Fiber 9.8 + React 19.3 + three | 1,124 KB / **308 KB** | R3F's catalogue imports all of three, so it barely tree-shakes. Only worth it if the site is already React. |
| Spline runtime 2.0.82 | Standalone WebGL build 2,176 KB / **563 KB**; modular build is 109 chunks (~1.1 MB gz total) | Plus the `.splinecode` scene, usually several hundred KB to MB, plus wasm modules. Heaviest option, with the least control over LCP and INP. |
| Pre-rendered video (AV1/H.264 loop) | ~0 JS; 0.6–2 MB of video | Cheapest runtime. Scroll-scrubbing video is janky because seeking is asynchronous ([discussion](https://dev.to/pratham7711/how-i-made-a-scroll-scrubbed-video-portfolio-fast-nextjs-15-gsap-canvas-1mj6)). |
| Image sequence on canvas (Apple style) | ~2 KB JS; 60–120 AVIF/WebP frames, 1.5–5 MB | Frame-exact scrubbing, but heavy. Lazy-load frames after the first. |

**Recommendation**
- **Default to vanilla three.js** (or raw WebGL/OGL if the concept is a shader), dynamically `import()`ed after first paint. Do not use R3F or Spline for a GitHub Pages marketing site.
- **A concept that fits the brand:** a single surface sample on a white studio ground, such as a terracotta roof tile or sandstone paver. A "clean pass" shader wipes the grime off as the visitor scrolls or drags. That turns the category's strongest trust device, before/after, into the interaction itself.

**Core Web Vitals**
- **LCP**
  - `<canvas>` is **not an LCP candidate**. The eligible types are `img`, an `image` inside `svg`, a video poster, a CSS `url()` background, and block text ([MDN](https://developer.mozilla.org/en-US/docs/Glossary/Contentful_paint), [web.dev](https://web.dev/lcp/)).
  - So LCP will be your H1 or a poster `<img>`.
  - Ship a real `<img fetchpriority="high">` AVIF poster of the scene's first frame, under 120 KB, in the hero. Fade the canvas in over it once the first frame renders.
- **CLS:** reserve the hero's aspect ratio.
- **INP and TBT:** parsing 130 KB of three.js costs roughly 50–150 ms on a mid-range Android phone. Load it in `requestIdleCallback`, or on first interaction or scroll, never in the critical path. Keep shader compilation off the input path (call `renderer.compile` during idle time).
- **GitHub Pages limits:**
  - Pages sets `Cache-Control: max-age=600`, and you cannot set custom headers, so long-lived immutable caching isn't available.
  - Pages serves gzip, not brotli.
  - Therefore keep the total payload small rather than relying on caching.

**Mobile**
- **Resolution and rendering**
  - Cap DPR at `min(devicePixelRatio, 1.5–2)`. DPR 3 renders 9× the pixels.
  - Render on demand: stop the RAF loop when the scene is idle, offscreen (IntersectionObserver) or the tab is hidden (`visibilitychange`). A constant 60 fps loop is what drains batteries ([R3F docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance)).
- **Geometry and textures**
  - Under 50 draw calls; use instancing.
  - Textures at 1K on mobile, KTX2/Basis.
  - No post-processing on mobile.
- **Adaptive quality:** measure frame time over the first second and fall back to the poster if p90 exceeds 25 ms.

**Fallbacks (in order)**
- No WebGL, `navigator.connection.saveData`, or `deviceMemory ≤ 2`: keep the poster image.
- `prefers-reduced-motion: reduce`: render one still frame with no RAF loop, or keep the poster. Turn scroll-driven tweens into plain cross-fades (WCAG 2.3.3; [pattern](https://www.hontran.dev/blog/webgl-image-displacement-hover-effect)).
- Always provide a pause control for any ambient loop longer than 5 s (WCAG 2.2.2).

---

## 8. Conversion and UX-psychology principles for the quote funnel

1. **Suburb- or address-first entry (commitment and personalisation).** The first field is "Your suburb" with autocomplete over the Redlands and Brisbane list. Respond instantly ("Yes, we're in Wellington Point every week"), as Sunday and Tesla do. It removes the biggest uncertainty first, which is whether Stride services that suburb.
2. **Goal-gradient progress** ([Kivetz, Urminsky & Zheng 2006](https://lawsofux.com/goal-gradient-effect/)). Use three labelled steps: Property → Services → Contact. Front-load the easy taps and keep the progress honest; never jump backwards.
3. **Fewer fields beats fewer steps.** Baymard: the average checkout has 11.3 fields, most need only about 8, and field count hurts usability more than step count ([Baymard](https://baymard.com/blog/checkout-flow-average-form-fields)).
   - Target 6–8 inputs: suburb, service chips, approximate size chips, optional photos, name, mobile, preferred contact.
   - Mark optional fields explicitly ([Baymard](https://baymard.com/blog/required-optional-form-fields)).
4. **Inline validation done right.** 31% of sites have none. Do not validate before the user leaves the field, clear the error the moment it is fixed, and show positive ticks ([Baymard](https://baymard.com/blog/inline-form-validation)). Use `inputmode="tel"` and `autocomplete` attributes.
5. **Hick's law in navigation** ([NN/g](https://www.nngroup.com/videos/hicks-law-long-menus/)).
   - Five top-level items at most: Services, Recent work, Pricing, About, Get a quote.
   - Group the seven services under one mega-menu with surface photos.
   - Use multi-select chips in the form rather than separate funnels.
6. **Fitts's law for mobile CTAs** ([NN/g touch targets](https://www.nngroup.com/articles/touch-target-size/)).
   - A sticky bottom bar with "Get a quote" (Stride Blue, about 56px tall) and a "Call" icon button, inside the thumb zone.
   - Targets at least 1cm with gaps.
   - Hide the bar while the form is in view.
7. **Honest social proof.**
   - Purchase likelihood peaks at 4.2–4.5★, ratings near 5.0 read as fake, and 82% of shoppers seek out negative reviews ([Spiegel/Northwestern](https://spiegel.medill.northwestern.edu/star-ratings-and-review-content/)).
   - Show the live Google rating **with its count**, link to the source, and include a thoughtful 4★ review and the owner's reply.
   - Use real first names, suburbs and dates. No stock faces.
8. **Up-front disclosure and the four trust factors** ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)): design quality, up-front disclosure, comprehensive and current content, and links to the rest of the web.
   - Show the ABN, the public liability cover amount and the insurer, and a real phone number.
   - Explain what chemicals are used and whether they are safe for pets and gardens.
   - Show recently dated jobs, and link to the Google Business Profile.
9. **Price anchoring and transparency** (deVOL, Yardzen, Thumbtack). Publish "typical ranges," e.g. "Most single-storey roof soft washes in Redlands: $X–$Y," with what changes the price. This qualifies leads and lowers anxiety.
10. **Reciprocity** (Cialdini). Offer an ungated or lightly gated *Subtropical Exterior Care Calendar* (when to do roofs, render, decks and gutters in SEQ), plus a free "photo check": send three photos and get advice. The Honey Homes free walk-through is the model.
11. **Operational transparency, or the "labor illusion"** (Buell & Norton, *Management Science* 2011). Showing the work behind a service increases perceived value.
    - Show the process: inspect → protect plants and windows → soft wash at the right dilution → rinse → walkthrough.
    - On the quote, say who will prepare it and by when.
12. **Risk reversal.** Use a specific guarantee ("If you're not happy at the walkthrough, we re-clean free"). Specific beats a vague "100% satisfaction."
13. **Von Restorff and one accent.** Stride Blue appears only on the primary action and links. Everything else is navy or grey, so the CTA is always the most distinctive element on screen.
14. **Peak-end rule** ([NN/g](https://www.nngroup.com/videos/peak-end-rule/)). The thank-you page is the "end."
    - Name the person who will call, give a time window ("by 3pm tomorrow"), and show their photo.
    - List what to prepare (photos, gate access), add a small add-to-calendar or SMS confirmation, and link to recent work nearby.
    - Make the "peak" the hero interaction (the clean pass) and the instant suburb confirmation.
15. **Aesthetic-usability effect** ([NN/g](https://www.nngroup.com/articles/aesthetic-usability-effect/)). Polished design raises perceived competence and tolerance for friction. It is the commercial justification for the premium redesign, but only if speed (LCP under 2.5 s on 4G) isn't sacrificed for it.

**Further sources consulted:**
- [Zuko: single-page vs multi-step forms](https://zuko.io/blog/single-page-or-multi-step-form). Multi-step generally wins above about 5 fields, but the evidence is mostly vendor-reported, so A/B test it.
- [Baymard trust-seal surveys (via summary)](https://trustsignals.com/blog/trust-badges-work-and-we-have-the-receipts-to-prove-it). Recognisable badges lift *perceived* security. Use the real insurer and association logos sparingly, near the form.
