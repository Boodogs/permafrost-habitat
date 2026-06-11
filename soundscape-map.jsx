// Soundscape map — Inuvik–Tuktoyaktuk corridor.
// Real basemap-feeling background, hand-curated pins focused on character sites.
// Top-species data extracted from the WildTrax tag export.

// 4-letter alpha codes → common names
const SPP_NAMES = {
  WCSP: 'White-crowned Sparrow',
  ATSP: 'American Tree Sparrow',
  WIPT: 'Willow Ptarmigan',
  ROPT: 'Rock Ptarmigan',
  SAVS: 'Savannah Sparrow',
  REDP: 'Common Redpoll',
  WHIM: 'Whimbrel',
  AMRO: 'American Robin',
  LALO: 'Lapland Longspur',
  LTDU: 'Long-tailed Duck',
  WISN: "Wilson's Snipe",
  WIWA: "Wilson's Warbler",
  FOSP: 'Fox Sparrow',
  YEWA: 'Yellow Warbler',
  PALO: 'Pacific Loon',
  YRWA: 'Yellow-rumped Warbler',
  OCWA: 'Orange-crowned Warbler',
  NOWA: 'Northern Waterthrush',
  CORA: 'Common Raven',
  CANG: 'Canada Goose',
  GWFG: 'Greater White-fronted Goose',
  SACR: 'Sandhill Crane',
  NOPI: 'Northern Pintail',
  AMWI: 'American Wigeon',
  GWTE: 'Green-winged Teal',
  LESA: 'Least Sandpiper',
  LISP: 'Lincoln\'s Sparrow',
  ARTE: 'Arctic Tern',
  UNDU: 'Unknown Duck',
  LTJA: 'Long-tailed Jaeger',
  TUSW: 'Tundra Swan',
  RTLO: 'Red-throated Loon',
  COLO: 'Common Loon',
  UNLO: 'Unknown Loon',
  LIWI: 'Little Wigeon',
  SUSC: 'Surf Scoter',
  ALFL: 'Alder Flycatcher',
  SBIG: 'Short-billed Dowitcher',
  AMGP: 'American Golden-Plover',
  HASP: "Harris's Sparrow",
  SMLO: "Smith's Longspur",
  LEYE: 'Lesser Yellowlegs',
  WHIM: 'Whimbrel',
  LTJA: 'Long-tailed Jaeger',
};

// Coordinates are CENTROIDS computed from the WildTrax location exports
// (2024 + 2025 seasons combined).
const SOUNDSCAPE_CLUSTERS = [
  // Marquee sites (named features)
  { id: 'parsons',  name: 'Parsons Lake',         type: 'slump',
    sub: 'Slump areas near Parsons Lake',
    lat: 68.9861, lon: -133.8379, n: 3,
    audio: 'audio/ITH-2-APA-3_20250617_063000.wav', recDate: '2025-06-17 · 06:30',
    over: [['AMWI', 5.4], ['NOPI', 5.1], ['LTDU', 3.1], ['WISN', 2.9], ['TUSW', 2.1]] },
  { id: 'drained',  name: 'Drained Lakes',        type: 'drained',
    sub: 'Area of thermokarst lake drainages',
    lat: 69.0512, lon: -134.1313, n: 3, labelSide: 'left',
    audio: 'audio/ITH-2-DLA-3_20250622_040000.wav', recDate: '2025-06-22 · 04:00',
    over: [['NOPI', 5.3], ['LISP', 4.4], ['GWTE', 4.3], ['LESA', 3.5], ['WISN', 2.9]] },
  { id: 'pullen',   name: 'Pullen Lake',          type: 'slump',
    sub: 'Slump complex near Pullen Lake',
    lat: 69.2597, lon: -134.6536, n: 5,
    audio: 'audio/ITH-2-APU-4_20250616_024500.mp3', recDate: '2025-06-16 · 02:45',
    over: [['CANG', 3.6], ['GWFG', 3.1], ['SACR', 2.8], ['RTLO', 1.8], ['TUSW', 1.7]] },
  { id: 'at7',      name: "Richards Island",      type: 'slump',
    sub: 'Slump complex on Richards Island',
    lat: 69.3146, lon: -134.5049, n: 6, audio: null,
    over: [['LALO', 4.8], ['GWFG', 4.0], ['CANG', 3.0], ['TUSW', 2.1], ['RTLO', 2.0]] },
  { id: 'tvs',      name: 'TVS slump',            type: 'slump',
    sub: 'Slump face above Trail Valley',
    lat: 68.648, lon: -133.763, n: 5, subtle: true, audio: null, over: [] },
  { id: 'jimmy',    name: 'Jimmy Lake',           type: 'control',
    sub: 'Tundra controls near to Jimmy Lake',
    lat: 68.6720, lon: -133.5586, n: 4, labelSide: 'right', audio: null,
    over: [['HASP', 12.5], ['REDP', 1.8], ['WCSP', 1.6], ['AMRO', 1.5], ['WIPT', 1.0]] },
  { id: 'husky',    name: 'Husky Lake',          type: 'fire',
    sub: 'Recent tundra fire near Husky Lake',
    lat: 69.0554, lon: -133.1302, n: 5, labelSide: 'right',
    audio: 'audio/ITH-1-10-1_20240623_054500.mp3', recDate: '2024-06-23 · 05:45',
    over: [['LESA', 4.8], ['LEYE', 4.0], ['PALO', 3.7], ['LISP', 2.8], ['AMRO', 1.5]] },

  // Highway transects (rendered as subtle, unlabeled dots)
  { id: 't1', name: 'Transect 1', type: 'control', sub: 'Highway transect',
    lat: 68.5941, lon: -133.7191, n: 4, subtle: true, audio: null, over: [], under: [] },
  { id: 't2', name: 'Active Slumps', type: 'slump', sub: 'Active, stabilized, and ancient slumps between Noell and Jimmy Lake',
    lat: 68.5931, lon: -133.6033, n: 4, audio: null,
    over: [['SUSC', 6.3], ['YEWA', 2.4], ['NOWA', 2.3], ['OCWA', 2.2], ['ATSP', 1.5]] },
  { id: 't3', name: 'Transect 3', type: 'control', sub: 'Highway transect',
    lat: 68.6075, lon: -133.5970, n: 8, subtle: true, audio: null, over: [], under: [] },
  { id: 't4', name: 'Transect 4', type: 'control', sub: 'Highway transect',
    lat: 68.6342, lon: -133.6197, n: 3, subtle: true, audio: null, over: [], under: [] },
  { id: 't5', name: 'Transect 5', type: 'control', sub: 'Highway transect',
    lat: 68.6731, lon: -133.6041, n: 2, subtle: true, audio: null, over: [] },
  { id: 't6', name: 'Trail Valley', type: 'control', sub: 'Tundra controls near to Trail Valley',
    lat: 68.7100, lon: -133.5411, n: 8,
    audio: 'audio/ITH-1-6-8_20240620_044500.mp3', recDate: '2024-06-20 · 04:45',
    over: [['AMGP', 4.3], ['ROPT', 4.3], ['WHIM', 3.7], ['YRWA', 2.9], ['LTJA', 3.5]] },
  { id: 't7', name: 'Transect 7', type: 'control', sub: 'Highway transect',
    lat: 68.7646, lon: -133.5552, n: 4, subtle: true, audio: null, over: [], under: [] },
  { id: 't8', name: 'Transect 8', type: 'control', sub: 'Highway transect',
    lat: 68.8396, lon: -133.5814, n: 4, subtle: true, audio: null, over: [], under: [] },
  { id: 't9', name: 'Transect 9', type: 'control', sub: 'Highway transect',
    lat: 68.8800, lon: -133.5612, n: 4, subtle: true, audio: null, over: [], under: [] },
];

const TYPE_META = {
  control:  { label: 'Tundra control', color: '#2f7d4f', shape: 'circle' },
  slump:    { label: 'Slump',          color: '#b85c3a', shape: 'triangle' },
  drained:  { label: 'Drained lake',   color: '#b85c3a', shape: 'square' },
  fire:     { label: 'Tundra fire',    color: '#d4781e', shape: 'flame' },
};

/* Map projection */
const MAP_BBOX = { minLat: 68.55, maxLat: 69.42, minLon: -134.95, maxLon: -133.20 };
function project(lat, lon, w, h) {
  const x = ((lon - MAP_BBOX.minLon) / (MAP_BBOX.maxLon - MAP_BBOX.minLon)) * w;
  const y = ((MAP_BBOX.maxLat - lat) / (MAP_BBOX.maxLat - MAP_BBOX.minLat)) * h;
  return [x, y];
}

function PinShape({ type, size = 18 }) {
  const meta = TYPE_META[type] || TYPE_META.control;
  const c = meta.color;
  const s = size;
  const stroke = '#1a1a1a';
  const sw = 1.2;
  let shape;
  switch (meta.shape) {
    case 'triangle':
      shape = <polygon points={`${s/2},2 ${s-2},${s-3} 2,${s-3}`} fill={c} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>;
      break;
    case 'square':
      shape = <rect x="3" y="3" width={s-6} height={s-6} fill={c} stroke={stroke} strokeWidth={sw}/>;
      break;
    case 'flame':
      shape = <path d={`M ${s/2} 2 C ${s*0.78} ${s*0.35} ${s*0.85} ${s*0.55} ${s*0.72} ${s*0.75} C ${s*0.62} ${s*0.9} ${s*0.38} ${s*0.9} ${s*0.28} ${s*0.75} C ${s*0.15} ${s*0.55} ${s*0.22} ${s*0.35} ${s/2} 2 Z`} fill={c} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>;
      break;
    default:
      shape = <circle cx={s/2} cy={s/2} r={s/2 - 2} fill={c} stroke={stroke} strokeWidth={sw}/>;
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>{shape}</svg>
  );
}

/* CORRIDOR MAP — Leaflet (CARTO Voyager + sepia tint).
   Real coastline, real Richards Island, real Husky Lakes.
   Pins are DivIcons so the color/shape encoding stays distinctive. */
function CorridorMap({ activeId, onPick }) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef({});

  // init once
  React.useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    if (typeof L === 'undefined') {
      console.error('Leaflet not loaded');
      return;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
    });
    mapRef.current = map;

    // Basemap presets — all keyless. Each picks a tile URL + a CSS filter
    // applied to .leaflet-tile-pane (set via data-basemap on the container).
    const BASEMAPS = {
      'esri-natgeo': {
        label: 'Nat Geo',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        opts: { maxZoom: 16, attribution: 'Tiles © Esri — National Geographic, DeLorme, NAVTEQ' },
      },
      'voyager': {
        label: 'Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        opts: { subdomains: 'abcd', maxZoom: 18, attribution: '© OpenStreetMap, © CARTO' },
      },
      'esri-imagery': {
        label: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        opts: { maxZoom: 18, attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics' },
      },
    };
    const DEFAULT_BASEMAP = 'voyager';

    let currentLayer = null;
    const setBasemap = (key) => {
      const preset = BASEMAPS[key] || BASEMAPS[DEFAULT_BASEMAP];
      if (currentLayer) map.removeLayer(currentLayer);
      currentLayer = L.tileLayer(preset.url, preset.opts).addTo(map);
      containerRef.current.setAttribute('data-basemap', key);
    };
    setBasemap(DEFAULT_BASEMAP);

    // Small switcher control, bottom-left
    const Switcher = L.Control.extend({
      options: { position: 'bottomleft' },
      onAdd() {
        const div = L.DomUtil.create('div', 'ssm-basemap-switcher');
        div.innerHTML = Object.entries(BASEMAPS).map(([k, v]) =>
          `<button data-key="${k}"${k === DEFAULT_BASEMAP ? ' data-active="true"' : ''}>${v.label}</button>`
        ).join('');
        L.DomEvent.disableClickPropagation(div);
        div.addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-key]');
          if (!btn) return;
          setBasemap(btn.dataset.key);
          div.querySelectorAll('button').forEach(b => b.removeAttribute('data-active'));
          btn.setAttribute('data-active', 'true');
        });
        return div;
      },
    });
    map.addControl(new Switcher());

    // Fit to all cluster pins
    const bounds = L.latLngBounds(SOUNDSCAPE_CLUSTERS.map(c => [c.lat, c.lon]));
    map.fitBounds(bounds, { padding: [40, 40] });

    // (Highway omitted — real ITH track not yet wired in;
    //  approximate polylines mislead in this area. Re-add when GeoJSON is available.)

    // Towns
    const town = (lat, lon, name) => {
      L.circleMarker([lat, lon], {
        radius: 4, color: '#1a1a1a', weight: 1.5, fillColor: '#1a1a1a', fillOpacity: 1,
      }).addTo(map);
      L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'ssm-town-label',
          html: `<div>${name}</div>`,
          iconSize: [80, 16], iconAnchor: [-8, 8],
        }),
        interactive: false,
      }).addTo(map);
    };
    town(68.361, -133.722, 'Inuvik');
    town(69.444, -133.030, 'Tuktoyaktuk');

    // Cluster pins as DivIcons — only render highlighted (non-subtle) ones
    SOUNDSCAPE_CLUSTERS.filter(c => !c.subtle).forEach(c => {
      const meta = TYPE_META[c.type];
      const side = c.labelSide || (c.lon < -133.9 ? 'right' : 'left');
      const icon = L.divIcon({
        className: 'ssm-pin-icon',
        html: pinIconHtml(c.type, false, c.name, side),
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const m = L.marker([c.lat, c.lon], { icon }).addTo(map);
      m.on('click', () => onPick(c.id));
      markersRef.current[c.id] = { marker: m, cluster: c };
    });

    // Disable scroll-wheel zoom unless map is focused
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update active marker styling when activeId changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    Object.entries(markersRef.current).forEach(([id, { marker, cluster }]) => {
      const isActive = id === activeId;
      const side = cluster.labelSide || (cluster.lon < -133.9 ? 'right' : 'left');
      const icon = L.divIcon({
        className: 'ssm-pin-icon',
        html: pinIconHtml(cluster.type, isActive, cluster.name, side),
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      marker.setIcon(icon);
      marker.setZIndexOffset(isActive ? 1000 : 0);
    });
  }, [activeId]);

  return <div ref={containerRef} className="ssm-leaflet"/>;
}

/* Subtle dot for transect points — small grey circle, no label.
   When active, becomes a labeled control pin. */
function subtleDotHtml(isActive, name = '') {
  if (isActive) {
    return pinIconHtml('control', true, name, 'right');
  }
  return `
    <div style="width:10px;height:10px;border-radius:50%;background:#5a5a5a;border:1px solid #1a1a1a;opacity:0.55;"></div>
  `;
}

/* Build a DivIcon HTML string for a pin shape + label backing.
   Active pins show a pulsing ring and bolder label.
   Label flips to the opposite side based on `labelSide`. */
function pinIconHtml(type, isActive, name, labelSide = 'right') {
  const meta = TYPE_META[type] || TYPE_META.control;
  const color = meta.color;
  const size = isActive ? 22 : 18;
  let shape;
  switch (meta.shape) {
    case 'triangle':
      shape = `<polygon points="${size/2},2 ${size-2},${size-3} 2,${size-3}" fill="${color}" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>`;
      break;
    case 'square':
      shape = `<rect x="3" y="3" width="${size-6}" height="${size-6}" fill="${color}" stroke="#1a1a1a" stroke-width="1.2"/>`;
      break;
    case 'flame':
      shape = `<path d="M ${size/2} 2 C ${size*0.78} ${size*0.35} ${size*0.85} ${size*0.55} ${size*0.72} ${size*0.75} C ${size*0.62} ${size*0.9} ${size*0.38} ${size*0.9} ${size*0.28} ${size*0.75} C ${size*0.15} ${size*0.55} ${size*0.22} ${size*0.35} ${size/2} 2 Z" fill="${color}" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>`;
      break;
    default:
      shape = `<circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#1a1a1a" stroke-width="1.2"/>`;
  }
  const ring = isActive ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2 + 5}" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.7"/>` : '';
  const labelStyle = `font-family:'Source Serif 4',Georgia,serif;font-size:12px;color:#1a1a1a;font-weight:${isActive ? 600 : 500};background:#f7f1e6;border:1px solid ${isActive ? color : 'rgba(26,26,26,0.4)'};border-radius:2px;padding:2px 6px;white-space:nowrap;pointer-events:none;`;
  const labelPos = labelSide === 'right'
    ? `position:absolute;left:${size + 6}px;top:50%;transform:translateY(-50%);`
    : `position:absolute;right:${size + 6}px;top:50%;transform:translateY(-50%);`;
  return `
    <div style="position:relative;width:${size}px;height:${size}px;">
      <svg width="${size + 14}" height="${size + 14}" viewBox="-7 -7 ${size+14} ${size+14}" style="position:absolute;left:-7px;top:-7px;overflow:visible;pointer-events:none;">
        ${ring}
      </svg>
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;left:0;top:0;">
        ${shape}
      </svg>
      <span style="${labelStyle}${labelPos}">${name}</span>
    </div>
  `;
}

/* Live spectrogram — Web Audio with custom Hann-windowed FFT.
   SoX-style: linear 0–10 kHz, 1024 window, Hann, +20 dB gain, 80 dB range, magma. */

// Cooley-Tukey radix-2 FFT, in-place. n must be power of two.
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      const half = len / 2;
      for (let k = 0; k < half; k++) {
        const tRe = curRe * re[i + k + half] - curIm * im[i + k + half];
        const tIm = curRe * im[i + k + half] + curIm * re[i + k + half];
        re[i + k + half] = re[i + k] - tRe;
        im[i + k + half] = im[i + k] - tIm;
        re[i + k] += tRe;
        im[i + k] += tIm;
        const newRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = newRe;
      }
    }
  }
}

// Magma-style colour ramp; t in [0,1]
function magma(t) {
  const stops = [
    [  0,   0,   4],
    [ 40,  11,  84],
    [140,  41, 129],
    [240,  96, 100],
    [253, 187, 132],
    [252, 253, 191],
  ];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = stops[i], b = stops[Math.min(stops.length - 1, i + 1)];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

const Spectrogram = React.forwardRef(function Spectrogram({ audioRef, audioSrc, playing }, ref) {
  const viewCanvasRef = React.useRef(null);    // visible viewport (320×80)
  const fullCanvasRef = React.useRef(null);    // offscreen, full-recording high-res
  const axisCanvasRef = React.useRef(null);    // time axis below spectrogram
  const rafRef = React.useRef(null);
  const [duration, setDuration] = React.useState(0);
  const [status, setStatus] = React.useState('idle');

  // Non-destructive playback boost. Field ARU recordings sit low with
  // headroom; we route the <audio> element through Web Audio and lift it
  // ~+8 dB, then pass a limiter so the loudest peaks can't clip/distort.
  // The source files are never modified.
  const PLAYBACK_GAIN = 2.5;        // ≈ +8 dB
  const playGraphRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    ensureGraph: () => {
      const audio = audioRef.current;
      if (!audio) return;
      // Already built for this element — just make sure the context is running.
      if (playGraphRef.current) {
        if (playGraphRef.current.ctx.state === 'suspended') playGraphRef.current.ctx.resume();
        return;
      }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        const ctx = new AC();
        const src = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = PLAYBACK_GAIN;
        // Compressor configured as a transparent brick-wall limiter so the
        // boost adds loudness without introducing clipping artifacts.
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -1.5;
        limiter.knee.value = 0;
        limiter.ratio.value = 20;
        limiter.attack.value = 0.002;
        limiter.release.value = 0.2;
        src.connect(gain);
        gain.connect(limiter);
        limiter.connect(ctx.destination);
        ctx.resume();
        playGraphRef.current = { ctx, src, gain, limiter };
      } catch (e) {
        // createMediaElementSource throws if already wired — safe to ignore.
      }
    }
  }), [audioRef]);

  // Tear down the boost graph when the panel unmounts.
  React.useEffect(() => () => {
    const g = playGraphRef.current;
    if (g && g.ctx && g.ctx.state !== 'closed') { try { g.ctx.close(); } catch (e) {} }
  }, []);

  // Cornell-style display constants
  const VIEW_W = 320;
  const VIEW_H = 80;
  const AXIS_H = 16;
  const PX_PER_SEC = 100;          // detail
  const PLAYHEAD_X = VIEW_W * 0.25; // playhead fixed 25% from left

  // Decode + render full spectrogram to offscreen canvas
  React.useEffect(() => {
    if (!audioSrc) return;
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const resp = await fetch(audioSrc);
        const arr = await resp.arrayBuffer();
        const AC = window.AudioContext || window.webkitAudioContext;
        const tmpCtx = new AC();
        const buf = await new Promise((res, rej) => tmpCtx.decodeAudioData(arr.slice(0), res, rej));
        tmpCtx.close();
        if (cancelled) return;

        const samples = buf.getChannelData(0);
        const SR = buf.sampleRate;
        const N = 1024;
        const bins = N / 2;
        const nyquist = SR / 2;

        // Full-canvas width based on duration × PX_PER_SEC
        const FULL_W = Math.max(VIEW_W, Math.ceil(buf.duration * PX_PER_SEC));
        const FULL_H = VIEW_H;

        const off = document.createElement('canvas');
        off.width = FULL_W;
        off.height = FULL_H;
        const ofx = off.getContext('2d');
        ofx.fillStyle = '#000004';
        ofx.fillRect(0, 0, FULL_W, FULL_H);

        const hann = new Float32Array(N);
        for (let i = 0; i < N; i++) hann[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (N - 1)));

        const FMAX = 10000;
        const maxBin = Math.min(bins, Math.ceil(FMAX / nyquist * bins));
        const rowBins = new Array(FULL_H);
        for (let y = 0; y < FULL_H; y++) {
          const norm = 1 - y / (FULL_H - 1);
          const f = norm * FMAX;
          const fNext = (1 - (y - 1) / (FULL_H - 1)) * FMAX;
          const b0 = Math.max(0, Math.floor(f / nyquist * bins));
          const b1 = Math.max(b0 + 1, Math.ceil(fNext / nyquist * bins));
          rowBins[y] = [b0, Math.min(maxBin, b1)];
        }

        const GAIN = Math.pow(10, 20 / 20);
        const RANGE_DB = 80;
        const FLOOR_DB = -RANGE_DB;

        const totalSamples = samples.length;
        const re = new Float64Array(N);
        const im = new Float64Array(N);
        const mag = new Float32Array(bins);
        const imageData = ofx.createImageData(FULL_W, FULL_H);
        const px = imageData.data;

        // Yield to UI every ~200 columns so the page doesn't freeze
        const CHUNK = 200;
        for (let xStart = 0; xStart < FULL_W; xStart += CHUNK) {
          const xEnd = Math.min(FULL_W, xStart + CHUNK);
          for (let x = xStart; x < xEnd; x++) {
            const center = Math.floor((x + 0.5) / FULL_W * totalSamples);
            const start = center - N / 2;
            for (let i = 0; i < N; i++) {
              const s = start + i;
              const sample = (s >= 0 && s < totalSamples) ? samples[s] : 0;
              re[i] = sample * hann[i] * GAIN;
              im[i] = 0;
            }
            fft(re, im);
            for (let i = 0; i < bins; i++) {
              const m = Math.sqrt(re[i] * re[i] + im[i] * im[i]) * 2 / N;
              const db = 20 * Math.log10(m + 1e-12);
              mag[i] = Math.max(0, Math.min(1, (db - FLOOR_DB) / RANGE_DB));
            }
            for (let y = 0; y < FULL_H; y++) {
              const [b0, b1] = rowBins[y];
              let peak = 0;
              for (let b = b0; b < b1; b++) if (mag[b] > peak) peak = mag[b];
              const [r, g, bl] = magma(peak);
              const o = (y * FULL_W + x) * 4;
              px[o] = r; px[o + 1] = g; px[o + 2] = bl; px[o + 3] = 255;
            }
          }
          if (cancelled) return;
          await new Promise(r => setTimeout(r, 0));
        }
        ofx.putImageData(imageData, 0, 0);
        fullCanvasRef.current = off;
        setDuration(buf.duration);
        setStatus('ready');

        // Initial paint of viewport at t=0
        drawViewport(0);
      } catch (e) {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [audioSrc]);

  // Draw the viewport given a current time (in seconds)
  const drawViewport = React.useCallback((t) => {
    const view = viewCanvasRef.current;
    const full = fullCanvasRef.current;
    if (!view || !full) return;
    const vctx = view.getContext('2d');
    vctx.fillStyle = '#000004';
    vctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // x in full = t * PX_PER_SEC, displayed at PLAYHEAD_X
    // → source rect starts at (t * PX_PER_SEC) - PLAYHEAD_X
    const srcX = t * PX_PER_SEC - PLAYHEAD_X;
    vctx.drawImage(full, srcX, 0, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);

    // Playhead line
    vctx.strokeStyle = 'rgba(252, 253, 191, 0.9)';
    vctx.lineWidth = 1;
    vctx.beginPath();
    vctx.moveTo(PLAYHEAD_X + 0.5, 0);
    vctx.lineTo(PLAYHEAD_X + 0.5, VIEW_H);
    vctx.stroke();

    // Time axis
    const axis = axisCanvasRef.current;
    if (axis) {
      const ax = axis.getContext('2d');
      const AW = VIEW_W, AH = AXIS_H;
      ax.fillStyle = '#0e0e12';
      ax.fillRect(0, 0, AW, AH);
      ax.strokeStyle = 'rgba(252, 253, 191, 0.5)';
      ax.fillStyle = 'rgba(252, 253, 191, 0.75)';
      ax.font = '9px ui-monospace, "JetBrains Mono", monospace';
      ax.textAlign = 'center';
      ax.textBaseline = 'top';
      // Visible time range
      const tLeft = t - PLAYHEAD_X / PX_PER_SEC;
      const tRight = tLeft + VIEW_W / PX_PER_SEC;
      const startSec = Math.ceil(tLeft);
      const endSec = Math.floor(tRight);
      ax.lineWidth = 1;
      for (let s = startSec; s <= endSec; s++) {
        if (s < 0 || s > duration) continue;
        const x = (s - tLeft) * PX_PER_SEC;
        const major = (s % 5 === 0);
        ax.beginPath();
        ax.moveTo(x + 0.5, 0);
        ax.lineTo(x + 0.5, major ? 5 : 3);
        ax.stroke();
        if (major) {
          ax.fillText(`${s}s`, x, 6);
        }
      }
      // Playhead marker on axis
      ax.fillStyle = 'rgba(252, 253, 191, 0.95)';
      ax.beginPath();
      ax.moveTo(PLAYHEAD_X - 3, 0);
      ax.lineTo(PLAYHEAD_X + 3, 0);
      ax.lineTo(PLAYHEAD_X, 4);
      ax.closePath();
      ax.fill();
    }
  }, [duration]);

  // Animate during playback
  React.useEffect(() => {
    if (!playing || status !== 'ready') return;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const audio = audioRef.current;
      if (!audio) return;
      drawViewport(audio.currentTime);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, status, drawViewport, audioRef]);

  // Reset viewport to t=0 when not playing
  React.useEffect(() => {
    if (!playing && status === 'ready') {
      const audio = audioRef.current;
      drawViewport(audio ? audio.currentTime : 0);
    }
  }, [playing, status, drawViewport, audioRef]);

  return (
    <div className="ssm-spec-wrap">
      <canvas ref={viewCanvasRef} width={VIEW_W} height={VIEW_H} className="ssm-spec-canvas"/>
      <canvas ref={axisCanvasRef} width={VIEW_W} height={AXIS_H} className="ssm-spec-time-axis"/>
      <div className="ssm-spec-axis">
        <span>10k</span><span>5k</span><span>0 Hz</span>
      </div>
      {status === 'loading' && <div className="ssm-spec-loading">decoding…</div>}
      {status === 'error' && <div className="ssm-spec-loading">audio unavailable</div>}
    </div>
  );
});

function ClusterPanel({ cluster }) {
  const audioRef = React.useRef(null);
  const specRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    setPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  }, [cluster.id]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else {
      // Wire up the AudioContext NOW, inside the click gesture,
      // so the browser doesn't suspend it.
      if (specRef.current) specRef.current.ensureGraph();
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const meta = TYPE_META[cluster.type];

  return (
    <div className="ssm-panel">
      <div className="ssm-panel-head">
        <div className="ssm-panel-type" style={{ color: meta.color }}>
          <PinShape type={cluster.type} size={14}/> <span>{meta.label}</span>
        </div>
        <h3 className="ssm-panel-name">{cluster.name}</h3>
        <div className="ssm-panel-sub">{cluster.sub}</div>
        <div className="ssm-panel-meta">{cluster.n} recorders</div>
      </div>

      <div className="ssm-panel-section">
        <div className="ssm-panel-label">Soundscape</div>
        <Spectrogram ref={specRef} audioRef={audioRef} audioSrc={cluster.audio} playing={playing}/>
        {cluster.audio ? (
          <>
            <button className="ssm-play" onClick={toggle}>
              <span className="ssm-play-icon">{playing ? '❚❚' : '▶'}</span>
              <span>{playing ? 'pause' : 'play recording'}</span>
            </button>
            <div className="ssm-rec-meta">{cluster.recDate}</div>
            <audio ref={audioRef} src={cluster.audio} onEnded={() => setPlaying(false)} preload="none"/>
          </>
        ) : (
          <div className="ssm-no-rec">Recording forthcoming.</div>
        )}
      </div>

      <div className="ssm-panel-section">
        <div className="ssm-panel-label">Site signature <span className="ssm-label-sub">vs. regional average</span></div>
        <ul className="ssm-spp-list">
          {cluster.over.map(([code, ratio]) => (
            <li key={`o-${code}`}>
              <span className="ssm-spp-arrow up">↑</span>
              <span className="ssm-spp-name">{SPP_NAMES[code] || code}</span>
              <span className="ssm-spp-ratio">{ratio.toFixed(1)}×</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SoundscapeMap() {
  const [activeId, setActiveId] = React.useState('parsons');
  const active = SOUNDSCAPE_CLUSTERS.find(c => c.id === activeId);

  return (
    <div className="ssm">
      <div className="ssm-bar">
        <div className="ssm-bar-title">Soundscape map · Inuvik–Tuktoyaktuk corridor</div>
        <div className="ssm-bar-legend">
          <span><PinShape type="control" size={12}/> tundra control</span>
          <span><PinShape type="slump" size={12}/> slump</span>
           <span><PinShape type="drained" size={12}/> drained lake</span>
          <span><PinShape type="fire" size={12}/> tundra fire</span>
        </div>
      </div>
      <div className="ssm-body">
        <div className="ssm-map-wrap">
          <CorridorMap activeId={activeId} onPick={setActiveId}/>
        </div>
        <ClusterPanel cluster={active}/>
      </div>
      <div className="ssm-foot">
        <span>8 highlighted sites</span>
        <span>Click a pin to switch the soundscape</span>
      </div>
    </div>
  );
}

window.SoundscapeMap = SoundscapeMap;
window.SOUNDSCAPE_CLUSTERS = SOUNDSCAPE_CLUSTERS;
