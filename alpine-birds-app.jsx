// =====================================================================
//  Yukon Alpine Birds — Earth Engine app page
//  Story-led layout. Embeds widgets/alpine-birds-viewer.html, or a
//  published GEE App URL.
// =====================================================================

const AB_TITLE = <>Comparing alpine bird habitat with <em>Google Earth Engine</em></>;
const AB_DECK  = "Five Yukon alpine songbirds. One Sentinel-2 stack. A dual-map Earth Engine app for side-by-side habitat suitability comparison — built to ask which open-data layer is doing the work for each species.";

const AB_INTRO = [
"Yukon's southern alpine zone runs through the Kluane, Pelly, and South Canol ranges — a thin, hard-to-survey band of country where the Canadian Wildlife Service deployed acoustic recorders at 411 sites between 2019 and 2024 under the High Elevation Monitoring Program (HEMP). Five songbirds make up the bulk of the alpine detections: Brewer's Sparrow, Dusky Flycatcher, Golden-crowned Sparrow, Horned Lark, Townsend's Solitaire. They sort along gradients of elevation, dwarf-shrub cover, and snow that look subtle on the ground but show up cleanly in 10 m Sentinel-2 imagery.",
"This app puts those gradients on screen, two species at a time, and lets you swap the comparison freely. The compute lives in Earth Engine; the modelling is a MaxEnt-style logistic envelope across a Sentinel-2 vegetation stack plus SRTM terrain and MODIS snow persistence. The dual-map UI is the point: side-by-side, you can see why Brewer's lives where Horned Lark does not."
];

const AB_DATASETS = [
  { tag:'A', src:'Sentinel-2 SR · summer composite', detail:'10 m · 2022–24 cloud-masked median · QA60 + TDOM',
    use:'NDVI · NDVI705 · NDWI · EVI · IRECI' },
  { tag:'B', src:'USGS SRTM v3',                      detail:'30 m global elevation',
    use:'Elevation · slope · aspect · ruggedness' },
  { tag:'C', src:'ESA WorldCover v200 (2021)',       detail:'10 m global land cover',
    use:'Shrubland · graminoid · barren masks' },
  { tag:'D', src:'MODIS MOD10A1 Snow Cover',          detail:'Daily 500 m NDSI · April–June',
    use:'Snow persistence · timing of melt' },
  { tag:'E', src:'HEMP · CWS Northern Region',        detail:'411 acoustic stations · 2019–24 · 2,580 detections',
    use:'Per-species presence · 5 km hex counts' }
];

const AB_SPECIES = [
  { code:'BRSP', name:"Brewer's Sparrow",       sci:"Spizella breweri",        n: 29,
    drivers:['NDVI705 ↑','Shrub ↑','Snow ↓'],
    note:"Northern range limit on dry, dwarf-birch slopes." },
  { code:'DUFL', name:"Dusky Flycatcher",       sci:"Empidonax oberholseri",   n: 102,
    drivers:['NDVI ↑','NDWI ↑'],
    note:"Riparian shrub and treeline open forest." },
  { code:'GCSP', name:"Golden-crowned Sparrow", sci:"Zonotrichia atricapilla", n: 150,
    drivers:['Elev ↑','Shrub ↑','Snow ↑'],
    note:"Treeline willow patches against persistent snow." },
  { code:'HOLA', name:"Horned Lark",            sci:"Eremophila alpestris",    n: 83,
    drivers:['Elev ↑','NDVI ↓','Shrub ↓'],
    note:"Open fellfield and gravel barrens." },
  { code:'TOSO', name:"Townsend's Solitaire",   sci:"Myadestes townsendi",     n: 152,
    drivers:['Slope ↑','Rugged ↑'],
    note:"Cliff bands, rocky open conifer." }
];

const AB_LINEAGE = "Sentinel-2 indices follow the workflow developed by Evan DeLancey (ABMI · University of Alberta, 2018). Cloud masking and red-edge index choices are inherited; classification and species envelopes are new.";

// ---------------------------------------------------------------------
// Reusable GEE embed — local preview or published GEE URL.
// ---------------------------------------------------------------------
function GEEEmbed({ url, height = 640, label = "Fig. 1", caption }) {
  const isLocal = !url || url.indexOf('users.earthengine.app') === -1;
  return (
    <div className="bv-embed-wrap">
      <div style={{
        position:'relative',
        border:'1.5px solid var(--ink)',
        background:'var(--paper)'
      }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'8px 12px',
          borderBottom:'1px solid var(--ink)',
          background:'var(--bg)',
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase',
          color:'var(--sub)'
        }}>
          <div style={{ display:'flex', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#d8c39b', border:'1px solid var(--ink)' }}></span>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#b77735', border:'1px solid var(--ink)' }}></span>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#2f7d4f', border:'1px solid var(--ink)' }}></span>
          </div>
          <span style={{ flex:1, color:'var(--ink)', fontWeight:500 }}>
            {isLocal ? 'widgets/alpine-birds-viewer.html · (preview)' : url.replace(/^https?:\/\//, '')}
          </span>
          <span style={{ color:'var(--accent)', fontWeight:600 }}>⚙ Earth Engine</span>
        </div>
        <iframe
          src={url || "widgets/alpine-birds-viewer.html"}
          title="Yukon Alpine Birds — Earth Engine"
          loading="lazy"
          style={{ width:'100%', height, border:0, display:'block', background:'var(--bg)' }}
        />
      </div>
      <div className="bv-embed-cap">
        <span className="label">{label}</span>
        <span>{caption || (isLocal
          ? <>Local preview. Once the EE app is published, paste the URL into <b>Tweaks → GEE App URL</b>.</>
          : <>Live Earth Engine app — <span className="mono">{(url||'').replace(/^https?:\/\//, '').slice(0, 48)}…</span></>)}
        </span>
        <span className="arrow">↳ pick a species per side · maps stay in sync · click to inspect</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Page — story-led split
// ---------------------------------------------------------------------
function AlpineBirdsApp({ geeUrl, embedHeight = 580 }) {
  return (
    <div className="bv">
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '52px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 8 }}>
          <span className="chip" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>
            <span className="dot" style={{ background:'var(--accent)' }}></span>
            Interactive tool
          </span>
          <span>YUKON ALPINE</span>
          <span>EARTH ENGINE</span>
        </div>

        <h1 className="bv-title">{AB_TITLE}</h1>
        <p className="bv-deck">{AB_DECK}</p>

        {/* Opening narrative */}
        <div className="bv-prose" style={{ marginTop: 40 }}>
          <p className="lead">{AB_INTRO[0]}</p>
          <p>{AB_INTRO[1]}</p>
        </div>

        {/* Species — editorial stack */}
        <div style={{ marginTop: 32 }}>
          <span className="small-cap">The five</span>
          <div style={{ marginTop:12 }}>
            {AB_SPECIES.map((sp, i) => (
              <div key={sp.code} style={{
                display:'grid',
                gridTemplateColumns:'48px 200px 1fr 60px',
                gap:16, padding:'14px 0',
                borderTop:'1px solid var(--hatch)',
                borderBottom: i === AB_SPECIES.length-1 ? '1px solid var(--hatch)' : 'none',
                alignItems:'baseline'
              }}>
                <span className="mono" style={{
                  fontSize:11, color:'var(--accent)', fontWeight:600
                }}>{sp.code}</span>
                <div>
                  <div style={{ fontFamily:"'Source Serif 4', serif",
                    fontWeight:500, fontSize:15 }}>{sp.name}</div>
                  <div style={{ fontStyle:'italic', fontSize:11.5,
                    color:'var(--sub)', marginTop:1 }}>{sp.sci}</div>
                </div>
                <div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 6px',
                    marginBottom:5 }}>
                    {sp.drivers.map(d => (
                      <span key={d} className="mono" style={{
                        fontSize:9.5, padding:'2px 6px',
                        border:'1px solid var(--hatch)', color:'var(--ink)'
                      }}>{d}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:13, color:'var(--ink)', lineHeight:1.5 }}>{sp.note}</div>
                </div>
                <div className="mono" style={{
                  fontSize:10.5, color:'var(--sub)', letterSpacing:'0.06em',
                  textAlign:'right'
                }}>n = {sp.n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead-in */}
        <div style={{ margin:'40px 0 14px' }}>
          <div className="mono" style={{ fontSize:10,
            letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--accent)', fontWeight:600, marginBottom:6 }}>
            ↓ The application
          </div>
          <h2 className="bv-section-h" style={{ marginBottom:6 }}>
            Two species, one synced view.
          </h2>
          <p style={{ fontSize:15, color:'var(--sub)', margin:0, maxWidth:'62ch' }}>
            Pick a species on each side. Pan and zoom — both maps move
            together. The gap between the two suitability surfaces is
            the story.
          </p>
        </div>

        <GEEEmbed url={geeUrl} height={embedHeight} />

        {/* Datasets — editorial list */}
        <div style={{ marginTop: 36 }}>
          <span className="small-cap">The Earth Engine layers underneath</span>
          <div style={{ marginTop:12 }}>
            {AB_DATASETS.map((d, i) => (
              <div key={d.tag} style={{
                display:'grid',
                gridTemplateColumns:'34px 1fr 200px',
                gap:18, padding:'12px 0',
                borderTop:'1px solid var(--hatch)',
                borderBottom: i === AB_DATASETS.length-1 ? '1px solid var(--hatch)' : 'none',
                alignItems:'baseline'
              }}>
                <span className="mono" style={{
                  fontSize:11, color:'var(--accent)', fontWeight:600
                }}>{d.tag}</span>
                <div>
                  <div style={{ fontFamily:"'Source Serif 4', serif",
                    fontWeight:500, fontSize:15 }}>{d.src}</div>
                  <div className="mono" style={{ fontSize:10.5, color:'var(--sub)', marginTop:2 }}>
                    {d.detail}
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:'var(--sub)',
                  fontStyle:'italic', lineHeight:1.4 }}>{d.use}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Method */}
        <div className="bv-prose" style={{ maxWidth:'68ch' }}>
          <span className="small-cap">Modelling</span>
          <p>
            Each species is a weight vector across the standardised stack
            (elevation, NDVI, NDVI705, NDWI, slope, ruggedness, shrub mask,
            snow persistence). The weighted sum is squashed by a logistic
            function — the same functional form as MaxEnt's output, simplified
            for transparency. When real presence points are supplied,
            the script swaps the hand-curated weights for a real{' '}
            <span className="mono" style={{ fontSize:13 }}>ee.Classifier.amnhMaxent</span> fit.
          </p>
          <p style={{ color:'var(--sub)', fontSize:14 }}>
            <b style={{ fontWeight:500, color:'var(--ink)' }}>Sentinel-2 lineage.</b> {AB_LINEAGE}
          </p>
        </div>

        <hr className="bv-divider" />

        <div className="bv-foot">
          <div>
            <h3>Companion tools</h3>
            <div style={{ fontSize:14, lineHeight:1.5 }}>
              <a href="moose-habitat-app.html">Moose habitat — Earth Engine app →</a><br/>
              <a href="moose-habitat-change.html">Habitat selection of Yukon's Arctic moose →</a>
            </div>
          </div>
          <div>
            <h3>Contact</h3>
            <div className="bv-contact">
              <div>Logan McLeod</div>
              <div style={{ color:'var(--sub)' }}>PhD candidate · Arctic Landscape Ecology Lab</div>
              <div style={{ marginTop:8 }}><a href="mailto:loganmcleod@uvic.ca">loganmcleod@uvic.ca</a></div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// ---------------------------------------------------------------------
// Top-level page with Tweaks (GEE URL + embed height)
// ---------------------------------------------------------------------
const AB_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "geeUrl": "",
  "embedHeight": 580
}/*EDITMODE-END*/;

function AlpineBirdsPage() {
  const [t, setTweak] = useTweaks(AB_TWEAK_DEFAULTS);
  return (
    <>
      <AlpineBirdsApp geeUrl={t.geeUrl} embedHeight={t.embedHeight} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="GEE app">
          <TweakText label="App URL" value={t.geeUrl}
            placeholder="https://yourname.users.earthengine.app/view/alpine-birds"
            onChange={(v) => setTweak('geeUrl', v)} />
          <div style={{ fontSize:11, color:'#666', lineHeight:1.5, marginTop:6,
            fontFamily:'monospace' }}>
            Leave blank to show the local dual-map preview. Paste your
            published Earth Engine app URL once it's live.
          </div>
        </TweakSection>
        <TweakSection label="Embed">
          <TweakSlider label="Height" value={t.embedHeight} min={460} max={900}
            step={10} unit="px" onChange={(v) => setTweak('embedHeight', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

Object.assign(window, { AlpineBirdsPage, AlpineBirdsApp });
