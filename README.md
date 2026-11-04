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
