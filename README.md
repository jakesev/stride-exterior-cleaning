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

## Door Coach (internal training tool)

`door-coach/` is a self-contained practice app for door-knocking: the sales
process as a staged script, drills, and a daily rep log (20 reps is the
minimum, 100 is an elite day). It is not linked from the site and is marked
`noindex`, but anyone with the address can open it:

https://jakesev.github.io/stride-exterior-cleaning/door-coach/

It installs to a phone home screen from that address (Safari: Share, Add to
Home Screen. Chrome: menu, Install app) and then works offline. The rep log
is kept on the device.

It is hand-written (no build step, no dependencies) and is not produced by
`build.mjs`. If the site build ever clears this folder before writing, keep a
copy of `door-coach/` and restore it afterwards.

- `content.js` holds every stage, line, hold-for-why note, objection, door
  scenario and film-room note. Edit wording there, and add material from
  further coaching videos there.
- `app.js` and `app.css` are the interface.
- `manifest.webmanifest` and `sw.js` make it installable and offline-capable.
  Bump `CACHE` in `sw.js` when you change the files.
