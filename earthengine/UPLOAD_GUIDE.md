# HEMP Earth Engine — Data Upload & Publish Guide

This walks you through getting the HEMP point-count data into Earth Engine
and publishing the alpine-birds app at a public URL you can paste into
your Geo for Good application.

## 1. Files prepared for you

In `data/`:

| File | What it is | n |
|---|---|---|
| `HEMP_presence_BRSP.csv` | Brewer's Sparrow presence points (lat/lon + counts) | 29 |
| `HEMP_presence_DUFL.csv` | Dusky Flycatcher presence points | 102 |
| `HEMP_presence_GCSP.csv` | Golden-crowned Sparrow presence points | 150 |
| `HEMP_presence_HOLA.csv` | Horned Lark presence points | 83 |
| `HEMP_presence_TOSO.csv` | Townsend's Solitaire presence points | 152 |
| `HEMP_presence_all.csv` | All five species merged, with `species_code` column | 516 |
| `HEMP_hex5km_counts.csv` | 5 km hex grid with WKT polygons and per-species counts | 37 |
| `HEMP_hex5km_counts.geojson` | Same hex grid as GeoJSON (used by the local preview) | 37 |

All CSVs use **longitude, latitude** columns in **WGS84 (EPSG:4326)**.

## 2. Upload to Earth Engine

Go to <https://code.earthengine.google.com> and sign in.

### Per-species presence CSVs (× 5)

For each species CSV:

1. Open the **Assets** tab in the left sidebar.
2. **New** → **Table upload** → **CSV file**.
3. Source: pick `HEMP_presence_BRSP.csv` (etc.) from your computer.
4. Asset ID: `users/<yourname>/HEMP_presence_BRSP` (use the same `<yourname>`
   for all uploads — that's your username in the URL on the EE main page).
5. Earth Engine will auto-detect `longitude` and `latitude` as the geometry
   columns. Leave the date column blank.
6. Click **Upload**. Wait ~30 seconds; the asset appears in the sidebar.

Repeat for DUFL, GCSP, HOLA, TOSO.

### Hex grid CSV (with WKT polygons)

1. Assets → New → Table upload → CSV file.
2. Source: `HEMP_hex5km_counts.csv`.
3. Asset ID: `users/<yourname>/HEMP_hex5km_counts`.
4. **Important**: set "Advanced options" → geometry column to `WKT`.
5. Upload.

## 3. Plug the assets into the GEE script

Open `earthengine/alpine-birds-app.js`.  Replace the `null` values in
`USER_ASSETS` with the asset paths you just created:

```js
var USER_ASSETS = {
  presence: {
    BRSP: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_BRSP',
    DUFL: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_DUFL',
    GCSP: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_GCSP',
    HOLA: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_HOLA',
    TOSO: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_TOSO'
  },
  hex_counts: 'projects/ee-ljmcleod/assets/HEMP_hex5km_counts'
};
```

- **Modelling**: a real `ee.Classifier.amnhMaxent` fit (the American Museum of Natural History MaxEnt — the original MaxEnt authors, bundled into Earth Engine)
- **Presence**: your uploaded points (with `presence=1`)
- **Background**: 5,000 random points across the study area (with `presence=0`)
- **Output**: the classifier's `probability` band, renamed `suit` for the rest of the pipeline

## 4. Paste the script into Earth Engine and run

1. In the Code Editor, hit the **Scripts** tab → **New file** → name it
   `alpine-birds-app`.
2. Paste the full contents of `earthengine/alpine-birds-app.js`.
3. **Save**.
4. **Run**.

You should see two side-by-side maps appear in the panel.  Pan/zoom — they
stay in sync.  Pick a species in each dropdown.  Toggle the hex bin layer to
overlay your real point counts.

> ⚠️ **First run is slow.**  The `amnhMaxent` classifier samples 5,000
> background points + your presence and fits a model per species, all on
> demand.  Expect ~30 s before each map paints.  Once tiles are cached, it's
> fast.

## 5. Publish as a public app

1. With the script open, click the **Apps** button (top toolbar, near Run).
2. **New App**.
3. Name: `alpine-birds` (or whatever you like — this is the URL slug).
4. Description: short paragraph for the app listing.
5. **Source code**: this script.
6. **Google Cloud project**: pick yours (you may need to create one if it's
   your first app — EE will walk you through it).
7. **Restrict access**: leave as "anyone with the link" for Geo for Good.
8. **Publish**.

You'll get back a URL like:

    https://<yourname>.users.earthengine.app/view/alpine-birds

## 6. Wire the published app into your site

Open `alpine-birds-app.html` in this project, click the **Tweaks** toggle
in the toolbar, paste the published URL into the **GEE App URL** field.
The iframe swaps from the local preview to the live Earth Engine app.

That's the link you put in your Geo for Good application.

## 7. Iteration ideas

- **Tune the model**: real MaxEnt outputs are already 0–1 probability and
  generally look good without re-scaling. If you want sharper contrast,
  apply `.unitScale(min, max)` after the `.rename('suit')` in
  `maxentSuitability()`.
- **Add more species**: just add an entry to `SPECIES` with weights and a
  presence asset path. Dropdowns and panels auto-update.
- **Add covariates**: extend the `stack` variable in `alpine-birds-app.js`
  with more Earth Engine layers (CHILI heat-load, Landsat NDII, etc.) and
  list them in the script's footer panel.
- **Export rasters**: at the bottom of the script, add `Export.image.toDrive`
  calls to save each species' final suitability surface as a GeoTIFF for
  partners.

## Caveats

- **BRSP sample size is small (n = 29).**  amnhMaxent will fit, but the
  result will be unstable — consider it exploratory.  The hand-curated
  envelope (used when the asset is `null`) is actually a fine fallback for
  this species.
- **Acoustic detection ≠ point count.**  Detection probability varies with
  recorder placement, wind, and date.  For a publication you'd want a
  detection-corrected occupancy model — the current app is a useful first
  pass but not a final estimator.
- **Sentinel-2 cloud coverage in southern Yukon alpine is patchy.**  The
  June 15 – Aug 25 window with `CLOUDY_PIXEL_PERCENTAGE < 40` should give
  a reasonable summer composite, but high-elevation cells near the St. Elias
  may have data gaps. Inspect with the "Sentinel-2 RGB" layer (you can add
  this as an extra debug layer in the script).
