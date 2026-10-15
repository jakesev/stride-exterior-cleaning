# Handoff: where the rebuild stands

**Branch:** `ccr-8c4edb8e-ceio4v`. The source is in `src/`. Build with `cd src && npm install && node build.mjs`; output is written to the repo root for GitHub Pages.

## Done

- **Creative direction** (`docs/creative-direction/`): brand analysis, research, three concepts, scoring, and the design system.
- **Build pipeline** (`src/build.mjs`):
  - images to AVIF/WebP at several widths;
  - bundled JS/CSS with cache-busting;
  - sitemap, robots and manifest;
  - stale-file cleanup.
- **Pages (49):**
  - home with the scroll-story structure;
  - 8 services and 11 service areas, with ABS-sourced profiles and a map;
  - our work (before/after sliders);
  - the Stride standard, about, contact, privacy, terms, thank-you, 404.
- **Education centre:** 14 researched articles with sources, a category filter, a table of contents and key takeaways.
- **FAQ hub:** 76 answers with search, and sources on the research answers.
- **Quote flow** (3 steps):
  - service cards with upsells and an instant postcode check;
  - property details;
  - photo upload, resized in the browser with GPS stripped;
  - qualification and lead scoring (`qualify.js`), then contact details.
- **Booking flow:** services, a weekday calendar (pick up to 3 dates), time window, then contact details.
- **Lead layer** (`src/scripts/leads.js`):
  - endpoint and webhook transports;
  - an offline outbox with retry;
  - an honest prefilled-email fallback when delivery isn't configured.

## Rejected

- The white-clay WebGL house (`src/scripts/maquette.js`). The owner judged it low quality.
- It is replaced by Higgsfield photoreal frame sequences; see `docs/VISUAL-BRIEF.md`.

## Next

1. **Higgsfield visuals:**
   - Generate the plates and films in `docs/VISUAL-BRIEF.md`.
   - Build the frame-sequence player in place of `maquette.js`.
   - Re-test every chapter on desktop and mobile.
2. **PDF guides:** four guides, defined in `src/content/guides.mjs`. Render them with headless Chromium using the site CSS, and use the new photoreal plates as covers.
3. **Lead backend:**
   - Deployable Cloudflare Worker: lead and photo storage, an email to the business, and a write to an Airtable CRM.
   - Then rebuild with `--lead-transport=endpoint --lead-endpoint=…`.
   - Until then, forms fall back to a prefilled email. This is honest, but it is not automated delivery.
4. **QA:**
   - axe accessibility pass;
   - link check;
   - Lighthouse-style performance check;
   - end-to-end form tests.
5. **Launch checklist (owner to confirm):**
   - phone number;
   - business email domain (`strideexteriorcleaning.com.au` is not yet registered);
   - insurance certificate;
   - postcode service list;
   - real job photos and an owner photo;
   - spot-check the article sources (research agents could only read search extracts).
