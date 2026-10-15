# Visual brief: photoreal scroll visuals (Higgsfield)

**Status (15 Oct 2026):** The owner rejected the white-clay 3D model hero as too low in quality. The new direction is **photoreal, cinematic, product-style visuals on a light background**, in the style of the "mango can" and LAMINA croissant scroll sites. These are generated with the **Higgsfield MCP** (images + AI video), cut into frames and scrubbed with scroll.

**Owner decisions:**
- Higgsfield for generation.
- Light look: warm white/cream ground, a floating photoreal hero object, a soft contact shadow, bold type, and Stride Blue `#0076D1` as the only accent.

## How the site uses the output

The homepage scroll story is already built (`src/content/story.mjs`, `src/scripts/story.js`, `src/pages/home.mjs`):
- six pinned chapters;
- live readouts (coverage %, lane counter, layer counter, surface lens);
- a chapter rail, CTAs, and a static fallback for reduced motion.

**What changes:** the WebGL clay model (`src/scripts/maquette.js`) is replaced by a **frame-sequence player**: one `<canvas>`, frames drawn by scroll progress, and the next chapter's frames preloaded.

**Frame pipeline:**
1. Export each film at 1920 px wide.
2. Slice it to about 120–200 frames.
3. Encode as WebP/AVIF at about 1600 px for desktop and about 900 px for mobile.
4. Store under `src/media/films/<chapter>/`.

The build then writes `assets/films/<chapter>/<n>.webp` plus a manifest.

**Fallbacks:** reduced motion, Data Saver and low memory get each chapter's end-frame still plus the existing text.

## Shot list (Higgsfield)

**Stills:** gpt_image_2_5, 4K, quality high, 16:9.
- **Background:** a seamless warm off-white studio sweep (`#F6F4EF`), soft top-left key light, gentle floor shadow, medium-format product photography, no text, no logos.
- **Edits:** make every plate after the hero an **edit of the hero plate** (pass its job id as the image reference) so position, scale and light stay identical.

| Plate | Description |
|---|---|
| **H0, hero** | A **floating square cut-out section of a Queensland home's exterior**, like a premium architectural specimen. A one-metre slab of grey broom-finished concrete driveway with a strip of rendered wall and a terracotta-tile roof edge with a Colorbond gutter above it, all floating at three-quarter view on the cream sweep. Heavily weathered: black mould on the concrete, green algae climbing the render, lichen and black streaks on the tiles, leaves in the gutter. |
| **H1, edit of H0** | The same specimen **perfectly clean**: bright concrete, crisp white render, rich tile colour, empty gutter, surfaces faintly wet with a few droplets. |
| **H2, edit of H0** | **Exploded view**: the same specimen separated vertically into floating layers (roof tiles, gutter, render wall, concrete slab) with even gaps, all clean. |
| **H3, edit of H0** | **Moisture view**: the dirty specimen rendered as a thermal-style false-colour image (navy → blue → cyan → amber), with the warmest areas where growth is worst (base of the wall, shaded tile overlaps, the concrete). |
| **H4** | A **macro water crown splash** in clear water with a faint blue tint, frozen mid-air on the cream sweep, high-speed photography. |
| **H5** | A **top-down driveway**: a full double concrete driveway, heavily mould-stained, seen straight down, cream border. |
| **H6, edit of H5** | The same driveway half cleaned in **three even lanes** by a rotary surface cleaner. |
| **H7, edit of H5** | The same driveway fully clean. |
| **H8** | A **modern two-storey Redlands home** (render, tile roof, double driveway, pool) as a floating photoreal diorama on the cream sweep, weathered. |
| **H9, edit of H8** | The same home spotless. |

**Films:** kling3_0, 4K, 10 s, sound off, 16:9. **Always pass `start_image` and `end_image`.** Trim the frames Kling holds at the start before slicing.

| # | Film | Start → End | Prompt |
|---|---|---|---|
| 1 | **ARRIVE** (spin) | H0 → H0 | "One smooth, slow 360-degree rotation of the floating specimen, camera locked, seamless loop." |
| 2 | **CLEAN PASS** | H0 → H1 | "A soft-wash mist sweeps across the specimen from left to right; grime, mould and lichen dissolve and rinse away in one continuous pass, water glistening." |
| 3 | **LAYERS** | H1 → H2 | "The specimen separates into its layers, which glide apart vertically like an exploded product diagram." |
| 4 | **VISION** | H0 → H3 | "The image transitions into a thermal moisture scan, colour bleeding in from the edges." |
| 5 | **DRIVEWAY** | H5 → H7 | "Top-down: a rotary surface cleaner moves lane by lane, leaving perfectly even clean stripes, light mist." |
| 6 | **DONE** | H8 → H9 | "The weathered home transforms to spotless as a band of fine mist passes across it; the camera slowly orbits a few degrees." |

**Optional:** fps_boost (topaz, 48) on the short clips for smoother scrubbing.

## Chapter mapping

| Story chapter | Film | Readouts (already built) |
|---|---|---|
| 00 Arrive | 1 ARRIVE (loops; drag = scrub rotation) | Headline, quote/book CTAs |
| 01 The roof → **The clean pass** | 2 CLEAN PASS | "Grime removed 0–100%", surface/method/pressure |
| 02 Every layer | 3 LAYERS | Layer counter 0/5, layer labels |
| 03 Grime vision | 4 VISION + cursor lens over H3 (lens reveals H3 over H0) | Surface/growth/method readout |
| 04 The driveway | 5 DRIVEWAY | Coverage %, lane 1–3 of 3 |
| 05 Done | 6 DONE | Quote/book CTAs |

**Also:**
- Click a plate for a blue water-droplet burst (the "colour fireworks" equivalent).
- Sound toggle, off by default: Web Audio water hiss.
- Use H1, H2, H6 and H9 for the PDF guide covers and the service pages.

## Honesty rule

These are AI-generated illustrations, not photos of Stride jobs. Caption them "Illustration", never "Our work". Real job photos replace the before/after demos as they are collected.
