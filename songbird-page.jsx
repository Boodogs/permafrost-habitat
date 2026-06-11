// Songbird chapter — "Listening to a changing tundra"
// Production page (V1 layout). Uses BvHeader from beaver-variants.jsx.

const SB_TITLE = <>Listening to a changing <em style={{ color: 'var(--phd)' }}>tundra</em></>;
const SB_DECK = "Permafrost disturbances, in the form of thaw slumps, drained lakes, and tundra fires, are reshaping bird habitat in the tundra of the Inuvialuit Settlement Region. Vegetation changes as permafrost degrades and the habitat available to birds shifts too. This can favour some species over others and change the relative abundance of species in the community. This chapter investigates bird community composition and abundance at tundra sites spanning a range of disturbance types and ages.";

const SB_PARAS = [
"This chapter asks: what happens to the birds when their habitat is affected by tundra landscape change? We deployed bird recorders at disturbance sites — slumps, drained-lake basins, recent burns — paired with undisturbed controls. From the recordings, we estimate how species' relative abundances shift, whether community composition changes, and — combined with the mapped footprint of disturbance across the region — what those shifts add up to at landscape scale.",
"The pattern emerging is consistent with what the vegetation predicts. Open-tundra specialists — Lapland Longspur, Snow Bunting, American Pipit — are detected less often at disturbed sites; shrub-associated species — White-crowned Sparrow, Common Redpoll, American Tree Sparrow — more often."];

const SB_PARTNERS = "ECCC \u2013 Canadian Wildlife Service · Wildlife Management Advisory Council \u2013 NWT";

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
  const POS = 'var(--accent)'; // rust for shrub/increase (more at disturbed)
  const NEG = 'var(--phd)';    // green for tundra/decrease (more at controls)

  const increases = SB_SHIFTS.filter((d) => d.d > 0).sort((a, b) => b.d - a.d);
  const decreases = SB_SHIFTS.filter((d) => d.d < 0).sort((a, b) => a.d - b.d);
  const maxAbs = Math.max(...SB_SHIFTS.map((d) => Math.abs(d.d)));
  const domain = Math.ceil(maxAbs * 10) / 10; // shared scale across both columns

  const Column = ({ rows, color, sign }) => (
    <div className="sb-shifts-col">
      {rows.map((d) => {
        const w = (Math.abs(d.d) / domain) * 100;
        return (
          <div className="sb-shifts-row" key={d.sp}>
            <div className="sb-shifts-sp">{d.sp}</div>
            <div className="sb-shifts-track">
              <div className="sb-shifts-bar" style={{ background: color, width: `${w}%` }}></div>
            </div>
            <div className="sb-shifts-val" style={{ color }}>
              {Math.abs(d.d).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <figure className="bv-embed-wrap" style={{ margin: '0 auto', maxWidth: 720 }}>
      <div className="sb-shifts-chart">
        <div className="sb-shifts-head">
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
        </div>

        <div className="sb-shifts-grid">
          <div className="sb-shifts-colhead" style={{ color: POS, gridArea: 'h1' }}>
            <span className="sb-shifts-dot" style={{ background: POS }}></span>
            More at disturbed
          </div>
          <div style={{ gridArea: 'c1' }}><Column rows={increases} color={POS} sign="+" /></div>
          <div className="sb-shifts-colhead" style={{ color: NEG, gridArea: 'h2' }}>
            <span className="sb-shifts-dot" style={{ background: NEG }}></span>
            More at controls
          </div>
          <div style={{ gridArea: 'c2' }}><Column rows={decreases} color={NEG} sign="-" /></div>
        </div>

        <div className="sb-shifts-axis-title">
          Bar length = |Δ detection rate (disturbed − control)|, shared scale (max {domain.toFixed(1)})
        </div>
      </div>
      <figcaption className="bv-embed-cap">
        <span>Per-species change in detection rate between disturbed and paired control sites. Rusts were heard more often at disturbed sites; greens, more often at controls.</span>
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
          <span className="mono" style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6, padding: '2px 8px', border: '1px solid var(--sub)', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'inline-block' }}>private — request access</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>
          <a href="https://portal.wildtrax.ca/aru/3371" target="_blank" rel="noopener">WildTrax · bird recorder project 3371</a>
          {' '}
          <span className="mono" style={{ fontSize: 11, color: 'var(--sub)', marginLeft: 6, padding: '2px 8px', border: '1px solid var(--sub)', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'inline-block' }}>private — request access</span>
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