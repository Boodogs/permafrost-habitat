// =====================================================================
//  Moose Habitat App — Page variants
//  Embeds the Earth Engine viewer (widgets/moose-habitat-viewer.html
//  or a published GEE App URL via Tweaks).
// =====================================================================

const MHA_TITLE = <>Mapping moose habitat with <em>Google Earth Engine</em></>;
const MHA_DECK  = "An interactive multi-criteria suitability explorer for moose in the Yukon North Slope — built on Earth Engine's open archive of WorldCover, MODIS NDVI, MODIS Snow, and SRTM terrain, fused with three years of GPS collar telemetry.";

const MHA_INTRO_PARAS = [
"Mapping where moose can live, and where they will be able to live, is a basic input to land-use planning across the western Arctic. The data exists — ESA WorldCover at ten metres, daily MODIS snow, decades of NDVI, SRTM terrain — but it sits in archives, in formats and projections that nobody outside remote sensing can touch.",
"Google Earth Engine is the part of the answer that nobody built before. It puts those archives behind a single API, and lets a small lab publish a server-side application that anyone with a browser can use. This is that application — the moose-habitat outputs from my PhD chapter, exposed as a layered interactive viewer."
];

const MHA_DATASETS = [
  { tag: 'A', src: 'ESA WorldCover v200 (2021)', detail: '10 m global land cover · shrubland, wetland, water, forest masks',
    use: 'Forage cover · shelter · distance-to-water' },
  { tag: 'B', src: 'MODIS MOD13Q1 NDVI',           detail: '16-day vegetation index, 250 m, 2000–present',
    use: 'Summer productivity · forage biomass proxy' },
  { tag: 'C', src: 'MODIS MOD10A1 Snow Cover',     detail: 'Daily snow cover & NDSI, 500 m',
    use: 'Winter movement constraint · snow refugia' },
  { tag: 'D', src: 'USGS SRTM',                    detail: '30 m global elevation',
    use: 'Slope · ruggedness · calving terrain' },
  { tag: 'E', src: 'MODIS MCD64A1 Burned Area',    detail: 'Monthly burn dates, 500 m',
    use: 'Fire history · forage recovery age' },
  { tag: 'F', src: 'Collar telemetry (user asset)', detail: 'Vertex Plus 4D · 3-hr GPS fixes · 3 yr',
    use: 'Validation · resource-selection scoring' }
];

const MHA_OBJECTIVES = [
  { n: 1, label: 'Open the model',
    body: 'Move the habitat-suitability outputs from a desktop GIS into a public, citable, browser-accessible Earth Engine app.' },
  { n: 2, label: 'Layer the seasons',
    body: 'Expose summer, winter, calving, and rut suitability as toggleable layers so users can see the same animal under four very different landscapes.' },
  { n: 3, label: 'Connect compute to landscape',
    body: 'Show the underlying Earth Engine inputs — NDVI, snow, shrub — alongside the outputs, so the model is auditable.' }
];

const MHA_USAGE = [
  { step: '01', title: 'Pick a season', body: 'Toggle Summer · Winter · Calving · Rut from the layer panel. Each is a multi-criteria suitability raster, normalised 0–1.' },
  { step: '02', title: 'Stack the drivers', body: 'Bring up NDVI or Snow Cover under the suitability surface to see which Earth Engine input is driving the prediction.' },
  { step: '03', title: 'Inspect a pixel', body: 'Click anywhere in the study area. The right panel returns suitability, NDVI, and snow values at 250 m resolution.' }
];

const MHA_PARTNERS = "Yukon Environment · Gwich\u2019in Renewable Resources Board · Vuntut Gwitchin · Aklavik HTC";

// ---------------------------------------------------------------------
// Reusable viewer embed — points at local mock OR published GEE URL.
// ---------------------------------------------------------------------
function GEEEmbed({ url, height = 640, label = "Fig. 1", legend = true }) {
  const isLocal = !url || url.indexOf('users.earthengine.app') === -1;
  return (
    <div className="bv-embed-wrap">
      <div style={{
        position:'relative',
        border:'1.5px solid var(--ink)',
        background:'var(--paper)'
      }}>
        {/* Window chrome — reads as a real app */}
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
            {isLocal
              ? 'widgets/moose-habitat-viewer.html · (preview)'
              : url.replace(/^https?:\/\//, '')}
          </span>
          <span style={{ color:'var(--accent)', fontWeight:600 }}>⚙ Earth Engine</span>
        </div>
        <iframe
          src={url || "widgets/moose-habitat-viewer.html"}
          title="Moose Habitat Suitability — Earth Engine"
          loading="lazy"
          style={{ width:'100%', height, border:0, display:'block', background:'var(--bg)' }}
        />
      </div>
      {legend && (
        <div className="bv-embed-cap">
          <span className="label">{label}</span>
          <span>{isLocal
            ? <>Local preview. Once your Earth Engine app is published at <span className="mono">users.earthengine.app</span>, paste the URL in <b>Tweaks → GEE App URL</b> to swap it in here.</>
            : <>Live Google Earth Engine app — hosted at <span className="mono">{url.replace(/^https?:\/\//, '').slice(0,48)}…</span></>}
          </span>
          <span className="arrow">↳ toggle layers · slide opacity · click to inspect</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// V1 — Embed-first (wide, app-led)
// ---------------------------------------------------------------------
function MooseHabitatAppV1({ geeUrl, embedHeight = 640 }) {
  return (
    <div className="bv" style={{ minHeight: 1700 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 12 }}>
          <span className="chip" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>
            <span className="dot" style={{ background:'var(--accent)' }}></span>
            Interactive tool
          </span>
          <span>YUKON NORTH SLOPE</span>
          <span>EARTH ENGINE · ui.* API</span>
          <span>MULTI-CRITERIA SUITABILITY</span>
        </div>

        <h1 className="bv-title">{MHA_TITLE}</h1>
        <p className="bv-deck" style={{ maxWidth: 860 }}>{MHA_DECK}</p>

        {/* The app, prominent */}
        <div style={{ marginTop: 28 }}>
          <GEEEmbed url={geeUrl} height={embedHeight} />
        </div>

        <hr className="bv-divider" />

        {/* Intro — two column */}
        <div className="bv-prose" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
          <div>
            <span className="small-cap">Why an app, not a paper</span>
            <p className="lead">{MHA_INTRO_PARAS[0]}</p>
          </div>
          <div>
            <span className="small-cap">What Earth Engine adds</span>
            <p>{MHA_INTRO_PARAS[1]}</p>
            <p style={{ color:'var(--sub)', fontSize:14, marginTop:12 }}>
              The compute lives on Google's infrastructure. The script that
              builds this app is <span className="mono" style={{ fontSize:12 }}>~280 lines</span>
              {' '}— short enough to read, audit, and fork.
            </p>
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Datasets — single most important panel for Geo for Good readers */}
        <div>
          <span className="small-cap">Earth Engine datasets used</span>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(3, 1fr)',
            gap:0,
            marginTop:16,
            border:'1px solid var(--ink)',
            background:'var(--paper)'
          }}>
            {MHA_DATASETS.map((d, i) => (
              <div key={d.tag} style={{
                padding:'14px 16px',
                borderRight: ((i+1) % 3 === 0) ? 'none' : '1px solid var(--hatch)',
                borderBottom: i < 3 ? '1px solid var(--hatch)' : 'none'
              }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
                  <span className="mono" style={{
                    fontSize:10, background:'var(--ink)', color:'var(--paper)',
                    padding:'1px 5px', letterSpacing:'0.08em'
                  }}>{d.tag}</span>
                  <span style={{
                    fontFamily:"'Source Serif 4', serif", fontWeight:500, fontSize:14
                  }}>{d.src}</span>
                </div>
                <div className="mono" style={{ fontSize:10.5, color:'var(--sub)', lineHeight:1.4, marginBottom:4 }}>
                  {d.detail}
                </div>
                <div style={{ fontSize:12.5, color:'var(--ink)', lineHeight:1.45, fontStyle:'italic' }}>
                  {d.use}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Objectives + usage in two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
          <div>
            <span className="small-cap">What the app delivers</span>
            <div style={{ marginTop:14 }}>
              {MHA_OBJECTIVES.map(o => (
                <div key={o.n} style={{
                  display:'grid', gridTemplateColumns:'42px 1fr', gap:12,
                  borderTop:'1px solid var(--ink)', padding:'14px 0'
                }}>
                  <div className="mono" style={{ fontSize:11, color:'var(--accent)', fontWeight:600 }}>
                    OBJ·0{o.n}
                  </div>
                  <div>
                    <div style={{
                      fontFamily:"'Source Serif 4', serif",
                      fontWeight:500, fontSize:16, marginBottom:4
                    }}>{o.label}</div>
                    <div style={{ fontSize:13.5, lineHeight:1.5, color:'var(--ink)' }}>{o.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="small-cap">How to use it</span>
            <div style={{ marginTop:14 }}>
              {MHA_USAGE.map(u => (
                <div key={u.step} style={{
                  borderLeft:'2px solid var(--accent)',
                  padding:'4px 0 4px 16px',
                  marginBottom:18
                }}>
                  <div className="mono" style={{
                    fontSize:10, color:'var(--accent)', letterSpacing:'0.12em',
                    fontWeight:600, marginBottom:4
                  }}>STEP {u.step}</div>
                  <div style={{
                    fontFamily:"'Source Serif 4', serif", fontWeight:500,
                    fontSize:16, marginBottom:4
                  }}>{u.title}</div>
                  <div style={{ fontSize:13.5, lineHeight:1.5 }}>{u.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Geo for Good pitch / Earth Engine credit */}
        <div style={{
          background:'var(--paper)',
          border:'1.5px solid var(--ink)',
          padding:'24px 28px',
          display:'grid', gridTemplateColumns:'1fr 280px', gap:40, alignItems:'center'
        }}>
          <div>
            <span className="small-cap">Built with</span>
            <h3 style={{
              fontFamily:"'Fraunces', serif", fontWeight:500, fontSize:24,
              margin:'6px 0 8px', letterSpacing:'-0.01em'
            }}>Google Earth Engine</h3>
            <p style={{ fontSize:14, lineHeight:1.55, margin:0, color:'var(--ink)', maxWidth:'52ch' }}>
              All raster compute runs on the Earth Engine backend. The app
              itself is ~280 lines of <span className="mono" style={{ fontSize:12 }}>ui.*</span> JavaScript,
              published from the Code Editor. Source is shipped alongside
              this page at <span className="mono" style={{ fontSize:12 }}>earthengine/moose-habitat-app.js</span>.
            </p>
          </div>
          <div className="mono" style={{
            fontSize:10, color:'var(--sub)', letterSpacing:'0.08em',
            textAlign:'right', lineHeight:1.7
          }}>
            <div style={{ color:'var(--accent)', fontWeight:600 }}>⚙ EARTH ENGINE</div>
            <div>code.earthengine.google.com</div>
            <div>users.earthengine.app</div>
            <div style={{ marginTop:8 }}>geoforgood · 2026 candidate</div>
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Partners + contact */}
        <div className="bv-foot">
          <div>
            <h3>Partners</h3>
            <div style={{ fontSize:14, color:'var(--sub)', lineHeight:1.5 }}>{MHA_PARTNERS}</div>
            <h3 style={{ marginTop:18 }}>Companion chapter</h3>
            <div style={{ fontSize:14, lineHeight:1.5 }}>
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
// V2 — Story-led split (narrower column, narrative builds to the app)
// ---------------------------------------------------------------------
function MooseHabitatAppV2({ geeUrl, embedHeight = 580 }) {
  return (
    <div className="bv" style={{ minHeight: 2200 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '52px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 8 }}>
          <span className="chip" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>
            <span className="dot" style={{ background:'var(--accent)' }}></span>
            Interactive tool
          </span>
          <span>YUKON NORTH SLOPE</span>
          <span>EARTH ENGINE</span>
        </div>

        <h1 className="bv-title">{MHA_TITLE}</h1>
        <p className="bv-deck">{MHA_DECK}</p>

        {/* Opening narrative — full prose */}
        <div className="bv-prose" style={{ marginTop: 40 }}>
          <p className="lead">{MHA_INTRO_PARAS[0]}</p>
          <p>{MHA_INTRO_PARAS[1]}</p>
        </div>

        {/* Earth Engine datasets — as a tight stacked list, more editorial */}
        <div style={{ marginTop: 36 }}>
          <span className="small-cap">The Earth Engine layers underneath</span>
          <div style={{ marginTop:12 }}>
            {MHA_DATASETS.map((d, i) => (
              <div key={d.tag} style={{
                display:'grid',
                gridTemplateColumns:'34px 1fr 180px',
                gap:18,
                padding:'12px 0',
                borderTop:'1px solid var(--hatch)',
                borderBottom: i === MHA_DATASETS.length-1 ? '1px solid var(--hatch)' : 'none',
                alignItems:'baseline'
              }}>
                <span className="mono" style={{
                  fontSize:11, color:'var(--accent)', fontWeight:600
                }}>{d.tag}</span>
                <div>
                  <div style={{
                    fontFamily:"'Source Serif 4', serif", fontWeight:500, fontSize:15
                  }}>{d.src}</div>
                  <div className="mono" style={{ fontSize:10.5, color:'var(--sub)', marginTop:2 }}>
                    {d.detail}
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:'var(--sub)', fontStyle:'italic', lineHeight:1.4 }}>
                  {d.use}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead-in to the embed */}
        <div style={{ margin:'40px 0 14px' }}>
          <div className="mono" style={{
            fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--accent)', fontWeight:600, marginBottom:6
          }}>↓ The application</div>
          <h2 className="bv-section-h" style={{ marginBottom:6 }}>Four seasons of a moose.</h2>
          <p style={{ fontSize:15, color:'var(--sub)', margin:0, maxWidth:'62ch' }}>
            Toggle layers · slide opacity · click to inspect. Same animal,
            four landscapes — each rendered from a different stack of
            Earth Engine inputs.
          </p>
        </div>

        <GEEEmbed url={geeUrl} height={embedHeight} />

        {/* How to use — single column under the embed */}
        <div style={{ marginTop: 36 }}>
          <span className="small-cap">How to read it</span>
          <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18 }}>
            {MHA_USAGE.map(u => (
              <div key={u.step} style={{
                borderTop:'1.5px solid var(--ink)',
                paddingTop:12
              }}>
                <div className="mono" style={{
                  fontSize:11, color:'var(--accent)', letterSpacing:'0.12em',
                  fontWeight:600, marginBottom:6
                }}>{u.step}</div>
                <div style={{
                  fontFamily:"'Source Serif 4', serif", fontWeight:500,
                  fontSize:15, marginBottom:6, lineHeight:1.3
                }}>{u.title}</div>
                <div style={{ fontSize:13, lineHeight:1.5, color:'var(--ink)' }}>{u.body}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="bv-divider" />

        {/* What the app delivers — as inline objectives */}
        <div className="bv-prose" style={{ maxWidth:'68ch' }}>
          <span className="small-cap">What the app delivers</span>
          {MHA_OBJECTIVES.map(o => (
            <p key={o.n}>
              <span className="mono" style={{
                fontSize:11, color:'var(--accent)', fontWeight:600,
                marginRight:10
              }}>0{o.n}</span>
              <b style={{ fontWeight:500 }}>{o.label}.</b>{' '}{o.body}
            </p>
          ))}
        </div>

        <hr className="bv-divider" />

        {/* GEE pull-quote — story version of the credit */}
        <blockquote style={{
          margin:'0 auto', maxWidth:760, padding:'22px 0',
          borderTop:'1px solid var(--ink)', borderBottom:'1px solid var(--ink)',
          fontFamily:"'Source Serif 4', serif", fontStyle:'italic',
          fontSize:20, lineHeight:1.45, textAlign:'center', color:'var(--ink)'
        }}>
          <span className="small-cap" style={{ display:'block', marginBottom:10 }}>
            Built with Google Earth Engine
          </span>
          All raster compute lives on Google's backend. The app itself
          is two hundred lines of <span className="mono" style={{ fontSize:14 }}>ui.*</span> JavaScript —
          short enough to read, audit, and fork.
        </blockquote>

        <hr className="bv-divider" />

        <div className="bv-foot">
          <div>
            <h3>Partners</h3>
            <div style={{ fontSize:14, color:'var(--sub)', lineHeight:1.5 }}>{MHA_PARTNERS}</div>
            <h3 style={{ marginTop:18 }}>Companion chapter</h3>
            <div style={{ fontSize:14, lineHeight:1.5 }}>
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
// Top-level page — design-canvas with the two variants
// ---------------------------------------------------------------------
const MHA_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "geeUrl": "",
  "embedHeight": 640
}/*EDITMODE-END*/;

function MooseHabitatAppPage() {
  const [t, setTweak] = useTweaks(MHA_TWEAK_DEFAULTS);
  return (
    <>
      <DesignCanvas>
        <DCSection id="variants" title="Moose habitat — Earth Engine"
                   subtitle="Two ways to introduce a published GEE app on the existing site">
          <DCArtboard id="v1" label="V1 · Embed-first" width={1180} height={2100}>
            <MooseHabitatAppV1 geeUrl={t.geeUrl} embedHeight={t.embedHeight} />
          </DCArtboard>
          <DCArtboard id="v2" label="V2 · Story-led split" width={880} height={2500}>
            <MooseHabitatAppV2 geeUrl={t.geeUrl} embedHeight={t.embedHeight} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="GEE app">
          <TweakText
            label="App URL"
            value={t.geeUrl}
            placeholder="https://yourname.users.earthengine.app/view/moose-habitat"
            onChange={(v) => setTweak('geeUrl', v)}
          />
          <div style={{ fontSize:11, color:'#666', lineHeight:1.5, marginTop:6, fontFamily:'monospace' }}>
            Leave blank to show the local preview widget. Paste your
            published Earth Engine app URL here once it's live.
          </div>
        </TweakSection>
        <TweakSection label="Embed">
          <TweakSlider label="Height" value={t.embedHeight} min={420} max={900} step={10}
                       unit="px" onChange={(v) => setTweak('embedHeight', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

Object.assign(window, { MooseHabitatAppPage, MooseHabitatAppV1, MooseHabitatAppV2 });
