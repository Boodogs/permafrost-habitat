# Logan McLeod — personal site

Static site, no build step. HTML + CSS + Babel-in-browser JSX.

## Pages

- `index.html` — map-first landing
- `beaver-expansion.html` — PhD chapter 1
- `moose-habitat-change.html` — PhD chapter 2
- `listening-to-a-changing-tundra.html` — PhD chapter 3 (songbird soundscape)
- `grey-headed-chickadee.html` — completed project page
- `publications.html` — full publication list
- `field-notes.html` — photo log + iNat / xeno-canto feeds

## Shared sources (edit these, not per-page copies)

- `tokens.css` — design tokens (palette). Every page and widget loads it; `beaver-shared.css` imports it.
- `site-nav.js` — nav tab list. Consumed by `BvHeader` (content pages) and the index nameplate menu.
- `beaver-shared.css` — shared layout/type styles for content pages.

## Local preview

Any static server works. Easiest: `python3 -m http.server` from the repo root, then open <http://localhost:8000>.

## Deploy

Hosted on GitHub Pages from the `main` branch. Pushes auto-deploy in ~2 min.

URL: <https://boodogs.github.io/permafrost-habitat/>
