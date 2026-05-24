// ============================================================================
//  Yukon Alpine Birds — Habitat Suitability Comparison Tool
//  Earth Engine app: dual-map side-by-side species comparison
//  Author: Logan McLeod · Arctic Landscape Ecology Lab
//
//  Built on: Sentinel-2 SR (cloud-masked summer composite, 10 m)
//            SRTM elevation, MODIS snow persistence, ESA WorldCover
//  Modeling: MaxEnt-style logistic envelope.  When presence points are
//            supplied (USER_ASSETS.presence.*), the script swaps the
//            hand-curated weights for a real ee.Classifier.smileMaxEnt fit.
//  Sentinel-2 lineage: adapted from Evan DeLancey's ABMI workflow
//            (ualberta · 2018) — same index set, simpler cloud mask.
//
//  HOW TO PUBLISH
//  1. Paste into a new script at code.earthengine.google.com
//  2. (Optional) Upload point CSVs and 5-km hex grid to your assets,
//     then update USER_ASSETS paths below.
//  3. Run.  Tweak weights / study area.  Save.
//  4. Apps → New App → publish.  Paste the resulting URL into Tweaks
//     on alpine-birds-app.html.
// ============================================================================

// ---- 1. CONFIG --------------------------------------------------------------

var USER_ASSETS = {
  // Per-species presence point FeatureCollections — upload the CSVs from
  // data/HEMP_presence_<CODE>.csv via Assets > New > Table upload (CSV).
  // Earth Engine will auto-detect the longitude/latitude columns.
  presence: {
    BRSP: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_BRSP',  // 29 pts
    DUFL: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_DUFL',  // 102 pts
    GCSP: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_GCSP',  // 150 pts
    HOLA: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_HOLA',  // 83 pts
    TOSO: 'projects/ee-ljmcleod/assets/HEMP/HEMP_presence_TOSO'   // 152 pts
  },
  // 5-km hex grid w/ per-species counts (BRSP_n, DUFL_n, GCSP_n, HOLA_n, TOSO_n)
  // upload data/HEMP_hex5km_counts.csv (WKT polygons) via Assets > New >
  // Table upload, geometry column = 'WKT'.
  hex_counts: 'projects/ee-ljmcleod/assets/HEMP_hex5km_counts'
};

// HEMP study area — southern Yukon ranges (Kluane / Pelly / South Canol)
var STUDY_AREA = ee.Geometry.Rectangle([-141, 59.0, -132, 63.0]);
var CENTER = [-136.5, 60.6];
var ZOOM = 7;

// Project palette — matches the embedding page
var PALETTE = {
  ink:'#1a1a1a', paper:'#f7f1e6', accent:'#b77735', sub:'#555555',
  phd:'#2f7d4f', hatch:'#e6dcc6'
};
var SUIT_RAMP = ['f7f1e6','e6dcc6','c9a47a','b77735','7e4a1d','3d2410'];
var HEX_RAMP  = ['f7f1e6','cfd9b3','7a9a3a','2f7d4f','143d24'];

// ---- 2. SPECIES PROFILES ----------------------------------------------------
// Hand-curated logistic-envelope weights — replace with MaxEnt coefficients
// once presence points are loaded.  Standardised features in [-1, 1] are
// multiplied by these weights and summed; result is squashed to [0, 1].

var SPECIES = {
  BRSP: {
    name: "Brewer's Sparrow",
    sci: "Spizella breweri",
    blurb: "Dwarf shrub & dwarf-birch specialist. Northern range limit in southern Yukon — patchy on dry shrub slopes.",
    weights: { elev:-0.30, ndvi: 0.30, ndvi705: 1.10, ndwi:-0.35,
               slope:-0.40, shrub: 1.20, rugged:-0.20, snow:-0.50 }
  },
  DUFL: {
    name: "Dusky Flycatcher",
    sci: "Empidonax oberholseri",
    blurb: "Subalpine open-forest and riparian shrub at treeline. Mid-elevation, moderate productivity.",
    weights: { elev:-0.20, ndvi: 0.80, ndvi705: 0.55, ndwi: 0.30,
               slope:-0.10, shrub: 0.45, rugged: 0.10, snow:-0.30 }
  },
  GCSP: {
    name: "Golden-crowned Sparrow",
    sci: "Zonotrichia atricapilla",
    blurb: "Alpine willow and dwarf-birch patches near snow. Mid-high elevation treeline ecotone.",
    weights: { elev: 0.55, ndvi: 0.50, ndvi705: 0.90, ndwi: 0.20,
               slope: 0.10, shrub: 0.85, rugged: 0.20, snow: 0.35 }
  },
  HOLA: {
    name: "Horned Lark",
    sci: "Eremophila alpestris",
    blurb: "Open high alpine, fellfield, gravel barrens. Sparse vegetation, near persistent snow.",
    weights: { elev: 1.10, ndvi:-0.60, ndvi705:-0.45, ndwi:-0.40,
               slope:-0.20, shrub:-0.70, rugged: 0.10, snow: 0.55 }
  },
  TOSO: {
    name: "Townsend's Solitaire",
    sci: "Myadestes townsendi",
    blurb: "Rocky open coniferous, cliff bands, alpine clearings.  Mid-elevation, rugged terrain.",
    weights: { elev: 0.10, ndvi: 0.10, ndvi705:-0.10, ndwi:-0.20,
               slope: 0.70, shrub:-0.20, rugged: 0.95, snow:-0.20 }
  }
};

// ---- 3. SENTINEL-2 SUMMER COMPOSITE -----------------------------------------
// Cloud mask via SCL (Scene Classification Layer) — QA60 was deprecated
// in 2024.  We mask defective pixels, cloud shadows, medium/high clouds,
// and thin cirrus; we keep snow/ice (SCL 11) because high-elevation pixels
// would otherwise drop out across the alpine.

function maskS2(img) {
  var scl = img.select('SCL');
  var mask = scl.neq(1)   // defective
        .and(scl.neq(3))  // cloud shadow
        .and(scl.neq(8))  // cloud medium probability
        .and(scl.neq(9))  // cloud high probability
        .and(scl.neq(10));// thin cirrus
  return img.updateMask(mask)
    .select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'],
            ['blue','green','red','re1','re2','re3','nir','nir2','swir1','swir2'])
    .divide(10000)
    .copyProperties(img, ['system:time_start']);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2022-06-15', '2024-08-25')
  .filterBounds(STUDY_AREA)
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 40)
  .map(maskS2)
  .median();

// ---- 4. VEGETATION INDICES (from ABMI lineage) ------------------------------

var ndvi    = s2.normalizedDifference(['nir','red']).rename('ndvi');
var ndvi705 = s2.normalizedDifference(['re2','re1']).rename('ndvi705');  // red-edge
var ndwi    = s2.normalizedDifference(['green','nir']).rename('ndwi');
var evi     = s2.expression(
  '2.5 * (nir - red) / (nir + 6*red - 7.5*blue + 1)',
  { nir: s2.select('nir'), red: s2.select('red'), blue: s2.select('blue') }
).rename('evi');
var ireci   = s2.expression('(re3 - red) / (re1 / re2)', {
  re1: s2.select('re1'), re2: s2.select('re2'),
  re3: s2.select('re3'), red: s2.select('red')
}).rename('ireci');

// ---- 5. TERRAIN, LAND COVER, SNOW -------------------------------------------

var dem = ee.Image('USGS/SRTMGL1_003').clip(STUDY_AREA);
var elev = dem.rename('elev');
var slope = ee.Terrain.slope(dem).rename('slope');
var aspect = ee.Terrain.aspect(dem).rename('aspect');
var rugged = dem.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.square(3)
}).rename('rugged');

var worldcover = ee.Image('ESA/WorldCover/v200/2021').clip(STUDY_AREA);
var shrub = worldcover.eq(20).rename('shrub');             // 20 = Shrubland

// MODIS snow persistence — fraction of days with snow cover in late spring
var snow = ee.ImageCollection('MODIS/061/MOD10A1')
  .filterDate('2022-04-01', '2024-06-30')
  .select('NDSI_Snow_Cover')
  .map(function (i) { return i.gt(20); })
  .mean()
  .rename('snow').clip(STUDY_AREA);

// ---- 6. SUITABILITY (envelope OR MaxEnt) ------------------------------------

// Stack used by both modes
var stack = ndvi
  .addBands(ndvi705).addBands(ndwi).addBands(evi).addBands(ireci)
  .addBands(elev).addBands(slope).addBands(aspect).addBands(rugged)
  .addBands(shrub).addBands(snow);

function envelopeSuitability(code) {
  var w = SPECIES[code].weights;
  var s = elev.unitScale(500, 2200).multiply(w.elev)
    .add(ndvi.unitScale(0.05, 0.7).multiply(w.ndvi))
    .add(ndvi705.unitScale(-0.05, 0.45).multiply(w.ndvi705))
    .add(ndwi.unitScale(-0.4, 0.3).multiply(w.ndwi))
    .add(slope.unitScale(0, 40).multiply(w.slope))
    .add(rugged.unitScale(0, 120).multiply(w.rugged))
    .add(shrub.multiply(w.shrub))
    .add(snow.multiply(w.snow));
  // Logistic squash
  return ee.Image(1).divide(s.multiply(-1).exp().add(1))
                    .rename('suit').clip(STUDY_AREA);
}

function maxentSuitability(code) {
  // Use real MaxEnt only when the presence asset exists.
  // EE's MaxEnt is ee.Classifier.amnhMaxent (American Museum of Natural
  // History — the original MaxEnt authors).  Output band is 'probability'.
  var presencePath = USER_ASSETS.presence[code];
  if (!presencePath) return envelopeSuitability(code);

  var presence = ee.FeatureCollection(presencePath).map(function (f) {
    return f.set('presence', 1);
  });
  var background = ee.FeatureCollection.randomPoints({
    region: STUDY_AREA, points: 5000, seed: 42
  }).map(function (f) { return f.set('presence', 0); });
  var training = presence.merge(background);

  var samples = stack.sampleRegions({
    collection: training,
    properties: ['presence'],
    scale: 30,
    tileScale: 4
  });
  var bands = stack.bandNames();
  var clf = ee.Classifier.amnhMaxent().train({
    features: samples,
    classProperty: 'presence',
    inputProperties: bands
  });
  return stack.classify(clf).select('probability').rename('suit')
              .clip(STUDY_AREA);
}

function suitabilityFor(code) {
  return USER_ASSETS.presence[code]
    ? maxentSuitability(code)
    : envelopeSuitability(code);
}

// ---- 7. HEX-BIN OCCURRENCE OVERLAY ------------------------------------------

function hexLayer(code) {
  if (!USER_ASSETS.hex_counts) return null;
  var hex = ee.FeatureCollection(USER_ASSETS.hex_counts);
  var prop = code + '_n';
  // Visualise count as a graduated fill
  return ui.Map.Layer(
    ee.Image().byte().paint(hex, prop).visualize({
      min: 0, max: 30, palette: HEX_RAMP, opacity: 0.55
    }),
    {}, 'Occurrence — ' + code, false
  );
}

// ---- 8. UI ------------------------------------------------------------------

ui.root.clear();

var leftMap  = ui.Map();
var rightMap = ui.Map();
leftMap.setCenter(CENTER[0], CENTER[1], ZOOM);
rightMap.setCenter(CENTER[0], CENTER[1], ZOOM);
leftMap.setOptions('TERRAIN');
rightMap.setOptions('TERRAIN');
leftMap.style().set({ cursor: 'crosshair' });
rightMap.style().set({ cursor: 'crosshair' });
ui.Map.Linker([leftMap, rightMap]);   // syncs pan + zoom

// Per-map species control + layer manager
function makeSide(map, defaultCode, label) {
  var state = { code: defaultCode, suitLayer: null, hexLayer: null,
                showHex: false };

  function refresh() {
    if (state.suitLayer) map.layers().remove(state.suitLayer);
    state.suitLayer = ui.Map.Layer(
      suitabilityFor(state.code),
      { min: 0, max: 1, palette: SUIT_RAMP, opacity: 0.85 },
      SPECIES[state.code].name
    );
    map.layers().add(state.suitLayer);

    if (state.hexLayer) { map.layers().remove(state.hexLayer); state.hexLayer = null; }
    if (state.showHex) {
      var h = hexLayer(state.code);
      if (h) { map.layers().add(h); state.hexLayer = h; }
    }

    speciesLabel.setValue(SPECIES[state.code].name);
    sciLabel.setValue(SPECIES[state.code].sci);
    blurbLabel.setValue(SPECIES[state.code].blurb);
  }

  // Header
  var sideLabel = ui.Label(label, {
    fontSize: '10px', color: PALETTE.sub, fontWeight: 'bold',
    backgroundColor: PALETTE.paper, padding: '4px 8px',
    border: '1px solid ' + PALETTE.ink, position: 'top-left'
  });
  map.add(sideLabel);

  // Floating control panel
  var panel = ui.Panel({
    style: { width: '260px', padding: '12px', backgroundColor: PALETTE.paper,
             position: 'top-right' }
  });

  var speciesLabel = ui.Label('', {
    fontSize: '17px', fontWeight: '500', color: PALETTE.ink, padding: '0' });
  var sciLabel = ui.Label('', {
    fontSize: '11px', color: PALETTE.sub, fontStyle: 'italic',
    padding: '0 0 6px 0' });
  var blurbLabel = ui.Label('', {
    fontSize: '11px', color: PALETTE.ink, padding: '0 0 8px 0',
    whiteSpace: 'pre-wrap' });

  var items = Object.keys(SPECIES).map(function (c) {
    return { label: SPECIES[c].name, value: c };
  });
  var select = ui.Select({
    items: items, value: defaultCode,
    onChange: function (v) { state.code = v; refresh(); }
  });

  var hexCheck = ui.Checkbox({
    label: 'Show point-count hex bins', value: false,
    style: { fontSize: '11px', color: PALETTE.ink, padding: '6px 0 0 0' }
  });
  hexCheck.onChange(function (v) { state.showHex = v; refresh(); });

  panel.add(ui.Label('SPECIES', { fontSize:'9px', color: PALETTE.sub,
                                    fontWeight:'bold' }));
  panel.add(select);
  panel.add(speciesLabel);
  panel.add(sciLabel);
  panel.add(blurbLabel);
  panel.add(hexCheck);

  map.add(panel);

  refresh();
  return state;
}

makeSide(leftMap,  'BRSP', 'A — left');
makeSide(rightMap, 'HOLA', 'B — right');

// Bottom info bar (spans both maps)
var footer = ui.Panel({
  style: { stretch: 'horizontal', backgroundColor: PALETTE.paper,
           padding: '10px 18px', border: '1px solid ' + PALETTE.ink },
  layout: ui.Panel.Layout.flow('horizontal')
});
footer.add(ui.Label('Yukon Alpine Birds · Habitat Comparison',
  { fontSize:'12px', fontWeight:'bold', color: PALETTE.ink, padding:'0 12px 0 0' }));
footer.add(ui.Label('Sentinel-2 SR  ·  SRTM 30 m  ·  ESA WorldCover  ·  MODIS Snow',
  { fontSize:'10px', color: PALETTE.sub, padding:'2px 0 0 0' }));
footer.add(ui.Label('⚙ Built with Google Earth Engine',
  { fontSize:'10px', color: PALETTE.accent, fontWeight:'bold',
    padding:'2px 0 0 24px' }));

// Layout: two maps in a row, footer below
var mapsRow = ui.Panel({
  widgets: [leftMap, rightMap],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: { stretch: 'both' }
});
leftMap.style().set({ stretch: 'both' });
rightMap.style().set({ stretch: 'both' });

var root = ui.Panel({
  widgets: [mapsRow, footer],
  layout: ui.Panel.Layout.flow('vertical'),
  style: { stretch: 'both' }
});
mapsRow.style().set({ stretch: 'both' });

ui.root.add(root);
