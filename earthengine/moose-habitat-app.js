// ============================================================================
//  Moose Habitat Suitability — Interactive Explorer
//  Yukon North Slope & Richardson Mountains
//  Author: Logan McLeod · Arctic Landscape Ecology Lab
//  Built with: Google Earth Engine ui.* API
// ============================================================================
//
//  HOW TO USE
//  ----------
//  1. Open https://code.earthengine.google.com
//  2. Sign in with a Google account that has Earth Engine access.
//  3. Create a new script, paste this entire file in, and Save.
//  4. (Optional) Upload your habitat suitability rasters and collar
//     telemetry to your assets folder, then update USER_ASSETS below.
//  5. Hit Run. The interactive app should appear in the right panel.
//  6. To publish: Apps > New App > pick this script > Publish.
//     You'll get a URL like:
//        https://YOURNAME.users.earthengine.app/view/moose-habitat
//     Paste that URL into moose-habitat-app.html (Tweaks > GEE App URL).
//
// ============================================================================

// ---- 1. CONFIG --------------------------------------------------------------

var USER_ASSETS = {
  // Replace these with your own GEE asset paths once uploaded.
  // Leave as null to fall back to computed-on-the-fly layers below.
  summer_suitability: null,  // e.g. 'users/loganmcleod/moose_summer_2024'
  winter_suitability: null,  // e.g. 'users/loganmcleod/moose_winter_2024'
  calving_suitability: null,
  rut_suitability: null,
  collar_tracks: null        // e.g. 'users/loganmcleod/itk_collar_tracks'
};

var STUDY_AREA = ee.Geometry.Rectangle([-141, 67, -132, 70.5]);
var CENTER = [-136.5, 68.5];
var ZOOM = 7;

// Palette — matches the project site (rust on cream)
var PALETTE = {
  ink:    '#1a1a1a',
  paper:  '#f7f1e6',
  accent: '#b77735',
  phd:    '#2f7d4f',
  sub:    '#555555',
  hatch:  '#e6dcc6'
};

// Suitability ramp — paper-tone to rust
var SUIT_RAMP = ['#f7f1e6', '#e6dcc6', '#c9a47a', '#b77735', '#7e4a1d', '#3d2410'];

// ---- 2. DATASETS ------------------------------------------------------------

// ESA WorldCover 2021 — 10 m global land cover
var worldcover = ee.Image('ESA/WorldCover/v200/2021').clip(STUDY_AREA);
var shrub      = worldcover.eq(20);   // Shrubland
var grassland  = worldcover.eq(30);   // Grassland / herbaceous
var trees      = worldcover.eq(10);
var water      = worldcover.eq(80);
var wetland    = worldcover.eq(90);

// MODIS Vegetation Indices — 16-day, 250 m
var ndviIC = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterDate('2020-01-01', '2024-12-31')
  .filterBounds(STUDY_AREA)
  .select('NDVI');
var ndviSummer = ndviIC.filter(ee.Filter.calendarRange(6, 8, 'month'))
                       .mean().multiply(0.0001).clip(STUDY_AREA);

// MODIS Snow Cover Daily — 500 m
var snowIC = ee.ImageCollection('MODIS/061/MOD10A1')
  .filterDate('2020-12-01', '2024-04-30')
  .filterBounds(STUDY_AREA)
  .select('NDSI_Snow_Cover');
var snowWinter = snowIC.mean().clip(STUDY_AREA);

// SRTM 30 m — elevation & terrain
var dem   = ee.Image('USGS/SRTMGL1_003').clip(STUDY_AREA);
var slope = ee.Terrain.slope(dem);
var ruggedness = dem.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.square(3)
}).rename('rugged');

// Distance to surface water (km)
var distToWater = water.fastDistanceTransform(100).sqrt()
                       .multiply(30).divide(1000)
                       .rename('distkm');

// Fire history — MODIS Burned Area
var fire = ee.ImageCollection('MODIS/061/MCD64A1')
  .filterDate('2015-01-01', '2024-12-31')
  .select('BurnDate').max().gt(0).unmask(0)
  .rename('burned');

// ---- 3. SUITABILITY MODELS (multi-criteria weighted) ------------------------
// If user-provided rasters are configured above we use those instead.

function loadOrCompute(assetKey, computeFn) {
  if (USER_ASSETS[assetKey]) {
    return ee.Image(USER_ASSETS[assetKey]).rename('suit').clip(STUDY_AREA);
  }
  return computeFn().rename('suit').clip(STUDY_AREA);
}

var summerSuit = loadOrCompute('summer_suitability', function () {
  // Summer moose habitat: high NDVI, shrubs, near water, gentle slope,
  // unburned in last 10 years.
  var s = ndviSummer.multiply(0.45)
    .add(shrub.multiply(0.25))
    .add(wetland.multiply(0.15))
    .add(distToWater.lt(2).multiply(0.10))
    .subtract(slope.divide(45).multiply(0.15))
    .subtract(fire.multiply(0.10));
  return s.unitScale(-0.1, 0.9).clamp(0, 1);
});

var winterSuit = loadOrCompute('winter_suitability', function () {
  // Winter: shrub cover above snow, low elevation, sheltered slopes,
  // less snow accumulation.
  var s = shrub.multiply(0.30)
    .add(trees.multiply(0.20))
    .add(dem.lt(800).multiply(0.20))
    .subtract(snowWinter.divide(100).multiply(0.25))
    .subtract(ruggedness.divide(80).multiply(0.10));
  return s.unitScale(-0.2, 0.8).clamp(0, 1);
});

var calvingSuit = loadOrCompute('calving_suitability', function () {
  // Calving: sheltered, low predation risk (rugged but not too rugged),
  // proximity to forage and water.
  var s = ruggedness.divide(120).multiply(0.30)
    .add(shrub.multiply(0.20))
    .add(wetland.multiply(0.20))
    .add(distToWater.lt(1).multiply(0.20))
    .subtract(slope.gt(30).multiply(0.15));
  return s.unitScale(-0.1, 0.8).clamp(0, 1);
});

var rutSuit = loadOrCompute('rut_suitability', function () {
  // Rut: open shrubland, visibility, gentle terrain.
  var s = shrub.multiply(0.35)
    .add(grassland.multiply(0.20))
    .add(slope.lt(15).multiply(0.20))
    .add(ndviSummer.multiply(0.25));
  return s.unitScale(-0.1, 0.9).clamp(0, 1);
});

// Collar tracks (optional) ----------------------------------------------------
var collarTracks = USER_ASSETS.collar_tracks
  ? ee.FeatureCollection(USER_ASSETS.collar_tracks)
  : ee.FeatureCollection([]);  // empty placeholder

// ---- 4. UI ------------------------------------------------------------------

ui.root.clear();
Map.setOptions('TERRAIN', {
  TERRAIN: [
    { featureType: 'all',    elementType: 'labels.text.fill',   stylers: [{ color: PALETTE.ink }] },
    { featureType: 'water',  elementType: 'geometry',           stylers: [{ color: '#d8cdb3' }] },
    { featureType: 'landscape', elementType: 'geometry',         stylers: [{ color: PALETTE.paper }] }
  ]
});
Map.setCenter(CENTER[0], CENTER[1], ZOOM);
Map.style().set('cursor', 'crosshair');

// Layer definitions ----------------------------------------------------------
var LAYERS = [
  { key: 'summer',  label: 'Summer suitability',  img: summerSuit,  shown: true,  opacity: 0.85 },
  { key: 'winter',  label: 'Winter suitability',  img: winterSuit,  shown: false, opacity: 0.85 },
  { key: 'calving', label: 'Calving suitability', img: calvingSuit, shown: false, opacity: 0.85 },
  { key: 'rut',     label: 'Rut suitability',     img: rutSuit,     shown: false, opacity: 0.85 },
  { key: 'ndvi',    label: 'NDVI (summer mean)',  img: ndviSummer,
      shown: false, opacity: 0.7,
      vis: { min: 0, max: 0.8, palette: ['#f7f1e6','#cfd9b3','#7a9a3a','#2f7d4f','#143d24'] } },
  { key: 'snow',    label: 'Snow cover (winter)', img: snowWinter,
      shown: false, opacity: 0.7,
      vis: { min: 0, max: 100, palette: ['#f7f1e6','#cfd6df','#7896b8','#2c4f78'] } },
  { key: 'shrub',   label: 'Shrubland (WorldCover)', img: shrub.selfMask(),
      shown: false, opacity: 0.6,
      vis: { palette: [PALETTE.accent] } }
];

var mapLayers = {};

function suitVis(opacity) {
  return { min: 0, max: 1, palette: SUIT_RAMP, opacity: opacity };
}

function refreshLayer(L) {
  if (mapLayers[L.key]) { Map.layers().remove(mapLayers[L.key]); }
  if (!L.shown) return;
  var vis = L.vis ? Object.assign({}, L.vis, { opacity: L.opacity }) : suitVis(L.opacity);
  mapLayers[L.key] = ui.Map.Layer(L.img, vis, L.label);
  Map.layers().add(mapLayers[L.key]);
}

LAYERS.forEach(refreshLayer);

// Add collar tracks on top if present
if (USER_ASSETS.collar_tracks) {
  Map.addLayer(collarTracks.style({ color: PALETTE.ink, width: 1.5 }),
               {}, 'Collar GPS tracks');
}

// Side panel ----------------------------------------------------------------
var panel = ui.Panel({
  style: {
    width: '340px',
    padding: '20px 22px',
    backgroundColor: PALETTE.paper
  }
});

panel.add(ui.Label('MOOSE · HABITAT EXPLORER', {
  fontSize: '11px', color: PALETTE.sub, padding: '0 0 4px 0',
  fontWeight: 'bold'
}));
panel.add(ui.Label('Yukon North Slope', {
  fontSize: '24px', fontWeight: '500', color: PALETTE.ink, padding: '0'
}));
panel.add(ui.Label('Richardson Mountains · Western Arctic', {
  fontSize: '12px', color: PALETTE.sub, padding: '0 0 12px 0'
}));

panel.add(ui.Label(
  'Multi-criteria habitat suitability built from open Earth Engine ' +
  'datasets — ESA WorldCover, MODIS NDVI, MODIS Snow, SRTM. ' +
  'Toggle seasons to see how predicted moose habitat shifts across ' +
  'the annual cycle.',
  { fontSize: '12px', color: PALETTE.ink, whiteSpace: 'pre-wrap', padding: '0 0 14px 0' }
));

panel.add(ui.Label('LAYERS', {
  fontSize: '10px', color: PALETTE.sub, padding: '8px 0 4px 0',
  fontWeight: 'bold'
}));

// Layer rows
LAYERS.forEach(function (L) {
  var row = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal'),
                       style: { padding: '2px 0' } });
  var cb = ui.Checkbox({ label: L.label, value: L.shown,
                         style: { fontSize: '12px', color: PALETTE.ink } });
  cb.onChange(function (v) { L.shown = v; refreshLayer(L); });
  var slider = ui.Slider({ min: 0, max: 1, step: 0.05, value: L.opacity,
                           style: { width: '80px' } });
  slider.onChange(function (v) { L.opacity = v; refreshLayer(L); });
  row.add(cb); row.add(slider);
  panel.add(row);
});

// Legend
panel.add(ui.Label('SUITABILITY', {
  fontSize: '10px', color: PALETTE.sub, padding: '14px 0 4px 0',
  fontWeight: 'bold'
}));
var legendStrip = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select('longitude')
            .multiply(0).add(ee.Image.pixelLonLat().select('longitude')),
  params: { bbox: [0, 0, 1, 0.05], dimensions: '260x12',
            format: 'png', min: -180, max: 180, palette: SUIT_RAMP },
  style: { width: '260px', height: '12px', padding: '0' }
});
panel.add(legendStrip);
var legendRow = ui.Panel({ layout: ui.Panel.Layout.flow('horizontal'),
                           style: { padding: '0' } });
legendRow.add(ui.Label('low', { fontSize: '9px', color: PALETTE.sub }));
legendRow.add(ui.Label('high', { fontSize: '9px', color: PALETTE.sub,
                                   padding: '0 0 0 220px' }));
panel.add(legendRow);

// Data sources
panel.add(ui.Label('DATA SOURCES', {
  fontSize: '10px', color: PALETTE.sub, padding: '20px 0 4px 0',
  fontWeight: 'bold'
}));
[
  'ESA WorldCover v200 (2021) — 10 m',
  'MODIS MOD13Q1 NDVI — 250 m',
  'MODIS MOD10A1 Snow Cover — 500 m',
  'USGS SRTM — 30 m',
  'MODIS MCD64A1 Burned Area — 500 m'
].forEach(function (src) {
  panel.add(ui.Label('· ' + src,
    { fontSize: '11px', color: PALETTE.ink, padding: '1px 0' }));
});

// Click-to-inspect
var inspectLabel = ui.Label('Click the map to inspect pixel values.',
  { fontSize: '11px', color: PALETTE.sub,
    padding: '16px 0 4px 0', fontStyle: 'italic' });
panel.add(inspectLabel);
var inspectOut = ui.Label('', { fontSize: '11px', color: PALETTE.ink,
                                whiteSpace: 'pre-wrap' });
panel.add(inspectOut);

Map.onClick(function (coords) {
  var pt = ee.Geometry.Point([coords.lon, coords.lat]);
  var stack = summerSuit.rename('summer')
    .addBands(winterSuit.rename('winter'))
    .addBands(calvingSuit.rename('calving'))
    .addBands(rutSuit.rename('rut'))
    .addBands(ndviSummer.rename('ndvi'))
    .addBands(snowWinter.rename('snow'));
  stack.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: pt, scale: 250
  }).evaluate(function (v) {
    if (!v) { inspectOut.setValue(''); return; }
    inspectOut.setValue(
      'lat ' + coords.lat.toFixed(3) + '  lon ' + coords.lon.toFixed(3) + '\n' +
      'summer  ' + (v.summer  || 0).toFixed(2) +
      '   winter  ' + (v.winter  || 0).toFixed(2) + '\n' +
      'calving ' + (v.calving || 0).toFixed(2) +
      '   rut     ' + (v.rut     || 0).toFixed(2) + '\n' +
      'ndvi    ' + (v.ndvi    || 0).toFixed(2) +
      '   snow    ' + Math.round(v.snow || 0)
    );
  });
});

// Footer
panel.add(ui.Label('Logan McLeod · loganmcleod@uvic.ca',
  { fontSize: '10px', color: PALETTE.sub, padding: '24px 0 2px 0' }));
panel.add(ui.Label('Arctic Landscape Ecology Lab · University of Victoria',
  { fontSize: '10px', color: PALETTE.sub, padding: '0' }));
panel.add(ui.Label('Built with Google Earth Engine',
  { fontSize: '10px', color: PALETTE.accent, padding: '6px 0 0 0',
    fontWeight: 'bold' }));

ui.root.add(panel);
ui.root.add(Map);
Map.style().set({ cursor: 'crosshair' });
