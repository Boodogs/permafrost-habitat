// Songbird chapter — "Listening to a changing tundra"
// Production page (V1 layout). Uses BvHeader from beaver-variants.jsx.

const SB_TITLE = <>Listening to a changing <em>tundra</em></>;
const SB_DECK = "Permafrost disturbances, in the form of thaw slumps, drained lakes, and tundra fires, are reshaping bird habitat in the tundra of the Inuvialuit Settlement Region. Vegetation changes as permafrost degrades and the habitat available to birds shifts too. This can favour some species over others and change the relative abundance of species in the community. This chapter investigates bird community composition and abundance at tundra sites spanning a range of disturbance types and ages.";

const SB_PARAS = [
"This chapter asks: what happens to the birds when their habitat is affected by tundra landscape change? We deployed bird recorders at disturbance sites — slumps, drained-lake basins, recent burns — paired with undisturbed controls. From the recordings, we estimate how species' relative abundances shift, whether community composition changes, and — combined with the mapped footprint of disturbance across the region — what those shifts add up to at landscape scale.",
"The pattern emerging is consistent with what the vegetation predicts. Open-tundra specialists — Lapland Longspur, Snow Bunting, American Pipit — are detected less often at disturbed sites; shrub-associated species — White-crowned Sparrow, Common Redpoll, American Tree Sparrow — more often."];

const SB_PARTNERS = "WMAC-NWT · Environment and Climate Change Canada (Canadian Wildlife Service)";

function SbMetaBar() {
  return (
    <div className="bv-meta" style={{ marginTop: 24 }}>
      <span className="chip"><span className="dot"></span>PhD chapter 03</span>
      <span>INUVIK – TUKTOYAKTUK</span>
      <span>ACOUSTIC MONITORING</span>
      <span>LANDSCAPE CHANGE</span>
    </div>);

}

function SbHeroPhoto({ caption = "Retrogressive thaw slump draining into a tundra lake, Inuvialuit Settlement Region", style = {}, imgStyle = {}, src = "images/thaw-slump.jpg" }) {
  return (
    <figure className="bv-hero-photo" style={style}>
      <img src={src} alt={caption} style={imgStyle} />
      <figcaption className="cap">{caption}</figcaption>
    </figure>);

}

/* Widget placeholder — species × disturbance heatmap with spectrogram strip. */
function SbEmbedPlaceholder() {
  const species = [
  'Lapland Longspur', 'Snow Bunting', 'American Pipit',
  'Savannah Sparrow', 'White-crowned Sparrow', 'American Tree Sparrow',
  'Common Redpoll', 'Yellow Warbler'];
  const sites = ['Slump', 'Drained lake', 'Burn', 'Control'];
  const seed = (i, j) => (Math.sin(i * 13.3 + j * 7.1) + 1) / 2;

  return (
    <div className="bv-embed-wrap">
      <div className="sb-widget">
        <div className="sb-widget-bar">
          <div className="sb-widget-title">Acoustic widget · placeholder</div>
          <div className="sb-widget-controls">
            <span className="sb-pill">▶ play</span>
            <span className="sb-pill">site filter</span>
            <span className="sb-pill">2021 → 2026</span>
          </div>
        </div>
        <div className="sb-widget-body">
          <div className="sb-spec">
            {Array.from({ length: 80 }).map((_, i) => {
              const h = 18 + Math.abs(Math.sin(i * 0.31 + 1.7) * 28) + Math.abs(Math.cos(i * 0.13) * 18);
              return <div key={i} className="sb-spec-bar" style={{ height: `${h}px` }} />;
            })}
          </div>
          <div className="sb-heat">
            <div className="sb-heat-corner"></div>
            {sites.map((s) => <div key={s} className="sb-heat-col-h">{s}</div>)}
            {species.map((sp, i) =>
            <React.Fragment key={sp}>
                <div className="sb-heat-row-h">{sp}</div>
                {sites.map((site, j) => {
                const v = seed(i, j);
                const op = 0.08 + v * 0.85;
                return <div key={site} className="sb-heat-cell" style={{ background: `rgba(47,125,79,${op.toFixed(3)})` }} />;
              })}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <div className="bv-embed-cap">
        <span className="label">Fig. 1 (planned)</span>
        <span>Acoustic explorer — relative abundance of detected species across disturbance types, with a hover-to-play spectrogram strip of representative recordings.</span>
        <span className="arrow">↳ widget in development; the placeholder shows the intended shape.</span>
      </div>
    </div>);

}

/* Species shifts under disturbance — the headline result.
   Top 10 species with the largest positive and negative deltas in
   detection rate (disturbed minus control). */
const SB_SHIFTS = [
// INCREASES (more often at disturbed sites)
{ sp: "Yellow Warbler", d: 0.52, kind: 'shrub' },
{ sp: "Northern Waterthrush", d: 0.36, kind: 'shrub' },
{ sp: "Fox Sparrow", d: 0.27, kind: 'shrub' },
{ sp: "Alder Flycatcher", d: 0.22, kind: 'shrub' },
{ sp: "Least Sandpiper", d: 0.20, kind: 'shrub' },
{ sp: "Orange-crowned Warbler", d: 0.18, kind: 'shrub' },
{ sp: "White-crowned Sparrow", d: 0.15, kind: 'shrub' },
{ sp: "Red-throated Loon", d: 0.13, kind: 'shrub' },
{ sp: "Wilson's Snipe", d: 0.10, kind: 'shrub' },
{ sp: "Common Loon", d: 0.06, kind: 'shrub' },
// DECREASES (less often at disturbed sites)
{ sp: "American Golden-Plover", d: -0.04, kind: 'tundra' },
{ sp: "Lapland Longspur", d: -0.05, kind: 'tundra' },
{ sp: "Bonaparte's Gull", d: -0.08, kind: 'tundra' },
{ sp: "Long-tailed Jaeger", d: -0.10, kind: 'tundra' },
{ sp: "Canada Goose", d: -0.12, kind: 'tundra' },
{ sp: "Harris's Sparrow", d: -0.13, kind: 'tundra' },
{ sp: "Rock Ptarmigan", d: -0.15, kind: 'tundra' },
{ sp: "Long-tailed Duck", d: -0.18, kind: 'tundra' },
{ sp: "Whimbrel", d: -0.22, kind: 'tundra' },
{ sp: "Savannah Sparrow", d: -0.30, kind: 'tundra' }];


// Species detected at our sites — image as CSS sprite, labels in HTML.
// 8 cols × 3 rows of 120px tiles; positions index into images/species-montage.png
const SB_CAST = [
  ["Long-tailed Jaeger",          0, 0],
  ["American Golden-Plover",      0, 1],
  ["Savannah Sparrow",            0, 2],
  ["Smith's Longspur",            0, 3],
  ["Willow Ptarmigan",            0, 4],
  ["Whimbrel",                    0, 5],
  ["Short-eared Owl",             0, 6],
  ["Sandhill Crane",              0, 7],
  ["Common Redpoll",              1, 0],
  ["American Tree Sparrow",       1, 1],
  ["Northern Waterthrush",        1, 2],
  ["Yellow Warbler",              1, 3],
  ["White-crowned Sparrow",       1, 4],
  ["Fox Sparrow",                 1, 5],
  ["Orange-crowned Warbler",      1, 6],
  ["American Robin",              1, 7],
  ["Red-throated Loon",           2, 0],
  ["Long-tailed Duck",            2, 1],
  ["Pacific Loon",                2, 2],
  ["Tundra Swan",                 2, 3],
  ["Red-necked Phalarope",        2, 4],
  ["Greater White-fronted Goose", 2, 5],
  ["American Wigeon",             2, 6],
  ["Wilson's Snipe",              2, 7]
];

function SbSpeciesMontage() {
  // Source PNG is 1600×800, 8×3 grid of 200×266.67 cells.
  // Display scale: 60% (one cell = 120 wide × 160 tall scaled).
  // We render a 120×120 tile per bird, clipping off the bottom of each
  // scaled row (where the baked-in labels live) and replacing with HTML.
  const TILE = 120;
  return (
    <figure className="bv-embed-wrap" style={{ margin: 0 }}>
      <div className="mono" style={{
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--sub)', marginBottom: 18
      }}>The cast</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))',
        gap: '22px 10px',
        padding: '8px 0'
      }}>
        {SB_CAST.map(([name, r, c]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div style={{
              width: TILE,
              height: TILE,
              margin: '0 auto',
              backgroundImage: 'url(images/species-montage.png)',
              backgroundSize: '960px 480px',
              backgroundPosition: `${-c * 120}px ${-r * 160}px`,
              backgroundRepeat: 'no-repeat'
            }}></div>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 12, lineHeight: 1.3,
              marginTop: 8, color: 'var(--ink)',
              textWrap: 'balance'
            }}>{name}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function SbShiftsChart() {
  const data = SB_SHIFTS;
  const W = 880;
  const ROW = 18;
  const PAD = { top: 48, right: 48, bottom: 28, left: 200 };
  const H = PAD.top + data.length * ROW + PAD.bottom;
  const innerW = W - PAD.left - PAD.right;

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.d)));
  const domain = Math.ceil(maxAbs * 10) / 10; // round up to nearest 0.1
  const x0 = PAD.left + innerW / 2; // x of zero
  const xScale = (v) => x0 + v / domain * (innerW / 2);

  // Tick stops every 0.1 across the domain
  const ticks = [];
  for (let v = -domain; v <= domain + 0.0001; v += 0.1) {
    ticks.push(Math.round(v * 10) / 10);
  }

  const POS = 'var(--phd)'; // green for shrub/increase
  const NEG = 'var(--accent)'; // rust for tundra/decrease

  return (
    <figure className="bv-embed-wrap" style={{ margin: '0 auto', maxWidth: 720 }}>
      <div style={{
        border: '1.5px solid var(--ink)',
        background: 'var(--paper)',
        padding: '20px 22px 6px'
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 18, marginBottom: 14, flexWrap: 'wrap'
        }}>
          <div>
            <div className="mono" style={{
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--accent)', fontWeight: 600
            }}>Top 10 increases · Top 10 decreases</div>
            <div style={{
              fontFamily: "'Source Serif 4', serif", fontSize: 17,
              fontWeight: 500, marginTop: 4
            }}>Species shifts under disturbance</div>
          </div>
          <div style={{ display: 'flex', gap: 18, fontSize: 12, color: 'var(--sub)' }}>
            <span><span style={{
                display: 'inline-block', width: 12, height: 12, background: POS,
                verticalAlign: 'middle', marginRight: 6
              }}></span>more at disturbed</span>
            <span><span style={{
                display: 'inline-block', width: 12, height: 12, background: NEG,
                verticalAlign: 'middle', marginRight: 6
              }}></span>more at control</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}
        role="img" aria-label="Bar chart of species detection-rate shifts under permafrost disturbance">
          {/* Vertical gridlines on tick stops */}
          {ticks.map((t, i) =>
          <line key={`g${i}`} x1={xScale(t)} x2={xScale(t)}
          y1={PAD.top - 12} y2={H - PAD.bottom + 4}
          stroke={t === 0 ? 'var(--ink)' : 'var(--hatch)'}
          strokeWidth={t === 0 ? 1.2 : 0.6} />
          )}

          {/* Tick labels (top + bottom) */}
          {ticks.map((t, i) =>
          <text key={`tt${i}`} x={xScale(t)} y={PAD.top - 18}
          textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
          fontSize={10} fill="var(--sub)">{t > 0 ? `+${t.toFixed(1)}` : t.toFixed(1)}</text>
          )}

          {/* Axis title */}
          <text x={x0} y={H - 6} textAnchor="middle"
          fontFamily="'Source Serif 4', serif" fontStyle="italic"
          fontSize={12} fill="var(--sub)">
            Δ detection rate (disturbed − control)
          </text>

          {/* Bars + labels */}
          {data.map((d, i) => {
            const y = PAD.top + i * ROW + 4;
            const bw = Math.abs(d.d) / domain * (innerW / 2);
            const bx = d.d >= 0 ? x0 : x0 - bw;
            const fill = d.d >= 0 ? POS : NEG;
            return (
              <g key={d.sp}>
                {/* Species label */}
                <text x={PAD.left - 12} y={y + ROW * 0.6}
                textAnchor="end" fontFamily="'Source Serif 4', serif"
                fontSize={12.5} fill="var(--ink)">
                  {d.sp}
                </text>
                {/* Bar */}
                <rect x={bx} y={y} width={bw} height={ROW - 6}
                fill={fill} opacity={0.92} />
                {/* Value annotation */}
                <text x={d.d >= 0 ? bx + bw + 6 : bx - 6}
                y={y + ROW * 0.6}
                textAnchor={d.d >= 0 ? 'start' : 'end'}
                fontFamily="'JetBrains Mono', monospace"
                fontSize={10} fill="var(--sub)">
                  {d.d > 0 ? `+${d.d.toFixed(2)}` : d.d.toFixed(2)}
                </text>
              </g>);

          })}
        </svg>
      </div>
      <figcaption className="bv-embed-cap">
        <span className="label"></span>
        <span>Per-species change in detection rate between disturbed and paired control sites. Positive values mean the species was heard more often at disturbed sites; negative, more often at controls.</span>
      </figcaption>
    </figure>);

}

function SbCiteContact() {
  return (
    <div className="bv-foot">
      <div>
        <h3>Partners</h3>
        <div style={{ fontSize: 14, color: 'var(--sub)' }}>{SB_PARTNERS}</div>
        <h3 style={{ marginTop: 18 }}>Data</h3>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          <a href="https://portal.wildtrax.ca/aru/4090" target="_blank" rel="noopener">WildTrax · bird recorder project 4090</a>
          {' '}
          <span className="mono" style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6, padding: '2px 8px', border: '1px solid var(--sub)', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase' }}>private — request access</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>
          <a href="https://portal.wildtrax.ca/aru/3371" target="_blank" rel="noopener">WildTrax · bird recorder project 3371</a>
          {' '}
          <span className="mono" style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6, padding: '2px 8px', border: '1px solid var(--sub)', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase' }}>private — request access</span>
        </div>
      </div>
      <div>
        <h3>Contact</h3>
        <div className="bv-contact">
          <div>Logan McLeod</div>
          <div style={{ color: 'var(--sub)' }}>PhD candidate · Arctic Landscape Ecology Lab</div>
          <div style={{ marginTop: 8 }}><a href="mailto:loganmcleod@uvic.ca">loganmcleod@uvic.ca</a></div>
        </div>
      </div>
    </div>);

}

const SONGBIRD_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroY": 50,
  "heroH": 320
} /*EDITMODE-END*/;

function SongbirdPage() {
  const [t, setTweak] = useTweaks(SONGBIRD_TWEAK_DEFAULTS);
  return (
    <div className="bv" style={{ minHeight: 1850 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>
        <SbMetaBar />
        <h1 className="bv-title">{SB_TITLE}</h1>
        <p className="bv-deck">{SB_DECK}</p>

        <SbHeroPhoto style={{ height: t.heroH, marginTop: 36 }} imgStyle={{ objectPosition: `center ${t.heroY}%` }} />

        <div style={{ marginTop: 36 }}>
          <SoundscapeMap />
        </div>

        <hr className="bv-divider" />

        <div className="bv-prose" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <span className="small-cap">In short</span>
            <p className="lead">{SB_PARAS[0]}</p>
          </div>
          <div>
            <span className="small-cap">What we're seeing</span>
            <p>{SB_PARAS[1]}</p>
          </div>
        </div>

        <hr className="bv-divider" />

        <SbShiftsChart />

        <hr className="bv-divider" />

        <SbSpeciesMontage />

        <div style={{ marginTop: 48 }}>
          <SbCiteContact />
        </div>
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero photo">
          <TweakSlider label="Crop · vertical" value={t.heroY} min={0} max={100} step={1} unit="%" onChange={(v) => setTweak('heroY', v)} />
          <TweakSlider label="Height" value={t.heroH} min={200} max={520} step={10} unit="px" onChange={(v) => setTweak('heroH', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

Object.assign(window, { SongbirdPage });