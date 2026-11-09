# Stride Exterior Cleaning — published site

This repository holds the **built** website for Stride Exterior Cleaning,
published with GitHub Pages.

**Live preview:** https://jakesev.github.io/stride-exterior-cleaning/

## This is a preview address, not the production site

The business domain (`strideexteriorcleaning.com.au`) is not registered yet.
Until it is, this build is deliberately marked `noindex` and `robots.txt`
disallows crawling, so it can never compete with the real site in search
results for the same content.

## Source

The source — content JSON, templates, design system and the build script —
lives outside this repository, in the project folder under `v2/`. To change
anything, edit there and re-run:

```
node build.mjs --base=/stride-exterior-cleaning --origin=https://jakesev.github.io --preview --out=<this folder>
```

For the real domain, build without any flags and publish `v2/site`.

## Known gaps before this becomes the live business site

- **No phone number.** Not yet confirmed, so none is published.
- **Photography is licensed stock**, clearly labelled as demonstration.
- **No customer reviews** — the site shows an honest empty state rather than
  invented testimonials.

## Results (before & after) — how to publish a job

The Results page (`/our-work/`) and the homepage "The Results Speak for
Themselves." section are built from `<article class="result-card">` blocks.
Everything — filter counts, the full-screen viewer, deep links
(`/our-work/#result-<id>`, `/our-work/?service=driveways`) — reads from each
card's `data-*` attributes, so publishing a job means adding one card.

Per card: `data-result` (id), `data-cats` (any of `house-washing driveways
concrete windows gutters solar-panels`), `data-kind` (`job` or
`illustration`), `data-title`, `data-desc`, `data-place` (suburb, optional),
`data-w`/`data-h`, `data-widths`, `data-before`/`data-after` (image base path,
files named `<base>-<width>.avif|webp`).

**Photo rule:** a `job` card must be a real Stride job, before and after shot
from the same position and never edited to exaggerate the difference. The three
current cards are `illustration` — one stock photo each with the "before"
darkened digitally — and are labelled as not Stride work on every card, in the
viewer and in the disclosure. Replace them as real pairs come in. The homepage
line "Real transformations." only appears once all three featured cards are
real jobs.

**Porting to `v2/` source:** these changes were made in the built output.
Mirror them in the v2 templates before the next build or they will be
overwritten: `assets/js/results.js` (new), the slider block and Results section
in `assets/css/stride.css`, `beforeAfter()` in `assets/js/stride.js`, the
`our-work` and homepage markup, the new handle icon, and the nav label
"Our Work" → "Results".
