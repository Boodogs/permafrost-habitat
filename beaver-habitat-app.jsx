// =====================================================================
//  Beaver Habitat & Dam Persistence — Earth Engine App
//  Companion page to beaver-expansion.html.
//  Foregrounds the live GEE app; short prose underneath.
// =====================================================================

const BHA_TITLE = <>Beaver habitat &amp; dam persistence,<br /><em>interactive tool</em></>;
const BHA_DECK = "Beaver habitat suitability and dam persistence across the Yukon North Slope, modelled from our beaver dam inventory and served as a Google Earth Engine app.";

const BHA_PARAS = {
  what:
  "Two models, fit on our dam inventory of the Yukon North Slope study area. The first is a Random Forest of habitat suitability. The second is a Random Survival Forest — given a dam at a location, the probability it's still standing at 3, 5, or 10 years.",
  read:
  "Persistence is the default layer. Darker means a new dam there is more likely to still be standing at the chosen horizon; switch the dropdown to compare 3, 5, and 10 years. Toggle habitat suitability on top to see where the landscape most suits beavers. The best areas are where both are high.",
  caveat:
  "A high persistence score on its own doesn't mean beavers would build there. A hydrologically dead upland can score high simply because nothing would wash a dam out. The suitability layer is what separates a dam holding from a beaver bothering.",
  inspectors:
  "Two inspectors in the side panel. Basins summarize a whole drainage at a click — percent suitable, percent suitable-and-likely-to-last. Pixels return the full modelled survival curve at a single point, out to ten years.",
  coverage:
  "Coverage matches the surveyed area, not the whole region — pixels are blank where any model input is missing. Treat the surface as a way to find promising reaches, not a forecast for any one spot."
};

// ---------------------------------------------------------------------
// Embed — points at the published GEE App URL (or local mock).
// ---------------------------------------------------------------------
function BHAEmbed({ url, height = 620, label = "Fig. 1" }) {
  const isLocal = !url || url.indexOf('users.earthengine.app') === -1;
  return (
    <div className="bv-embed-wrap">
      <div style={{
        position: 'relative',
        border: '1.5px solid var(--ink)',
        background: 'var(--paper)'
      }}>
        {/* Window chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px',
          borderBottom: '1px solid var(--ink)',
          background: 'var(--bg)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--sub)'
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d8c39b', border: '1px solid var(--ink)' }}></span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b77735', border: '1px solid var(--ink)' }}></span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2f7d4f', border: '1px solid var(--ink)' }}></span>
          </div>
          <span style={{ flex: 1, color: 'var(--ink)', fontWeight: 500 }}>
            {isLocal ?
            'widgets/beaver-habitat-viewer.html · (local preview)' :
            url.replace(/^https?:\/\//, '')}
          </span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>⚙ Earth Engine</span>
        </div>
        <iframe
          src={url || "widgets/beaver-habitat-viewer.html"}
          title="Beaver Habitat & Dam Persistence — Earth Engine"
          loading="lazy"
          style={{ width: '100%', height, border: 0, display: 'block', background: 'var(--bg)' }} />
        
      </div>
      <div className="bv-embed-cap">
        <span className="label">{label}</span>
        <span>
          {isLocal ?
          <>Local preview. Paste your published Earth Engine URL in <b>Tweaks → GEE App URL</b>.</> :
          <>Google Earth Engine app — <a href={url} target="_blank" rel="noopener">open full-screen ↗</a></>}
        </span>
      </div>
    </div>);

}

// ---------------------------------------------------------------------
// Page — field-notebook style with margin annotations
// ---------------------------------------------------------------------
function BeaverHabitatAppV2({ geeUrl, embedHeight = 620 }) {
  const MAIN = '1fr 240px';
  const GAP = 40;
  return (
    <div className="bv">
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 56px 80px' }}>

        {/* Header row — title + crumb on left, meta chips drift right */}
        <div style={{ display: 'grid', gridTemplateColumns: MAIN, gap: GAP, alignItems: 'start', marginTop: 12 }}>
          <div>
            <div className="bv-meta">
              <span className="chip" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <span className="dot" style={{ background: 'var(--accent)' }}></span>
                Interactive tool
              </span>
              <span>PHD CHAPTER 01</span>
              <span>YUKON NORTH SLOPE</span>
            </div>
            <h1 className="bv-title">{BHA_TITLE}</h1>
            <p className="bv-deck">{BHA_DECK}</p>
            <div style={{
              marginTop: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: 'var(--sub)', letterSpacing: '0.04em'
            }}>
              From the chapter:{' '}
              <a href="beaver-expansion.html" style={{ color: 'var(--accent)' }}>
                Beaver expansion onto the North Slope ↗
              </a>
            </div>
          </div>
          <div className="bv-margin" style={{ marginTop: 36 }}>
            Built in Google Earth Engine — the model rasters live as GEE
            assets, so the app loads in seconds and runs in any browser.
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Embed — spans full width, no margin column to compete with it */}
        <BHAEmbed url={geeUrl} height={embedHeight} />

        <hr className="bv-divider" />

        {/* Section 1 — What it shows */}
        <div className="bv-prose" style={{ maxWidth: '68ch' }}>
          <span className="small-cap">WHAT IT SHOWS</span>
          <p className="lead" style={{ marginTop: 10 }}>{BHA_PARAS.what}</p>
        </div>

        {/* Section 2 — How to read it + margin note */}
        <div style={{ display: 'grid', gridTemplateColumns: MAIN, gap: GAP, alignItems: 'start', marginTop: 36 }}>
          <div className="bv-prose">
            <span className="small-cap">HOW TO READ IT</span>
            <p style={{ marginTop: 10 }}>{BHA_PARAS.read}</p>
          </div>
          <div className="bv-margin">
            Watch for the upland trap — quiet drainages can score high on
            persistence simply because nothing would ever wash a dam out.
          </div>
        </div>

        {/* Section 3 — Inspectors */}
        <div className="bv-prose" style={{ maxWidth: '68ch', marginTop: 36 }}>
          <span className="small-cap">TWO WAYS TO DIG IN</span>
          <p style={{ marginTop: 10 }}>{BHA_PARAS.inspectors}</p>
        </div>

        {/* Companion chapter (left) + contact (right-aligned) */}
        <div className="bv-foot">
          <div>
            <h3>Companion chapter</h3>
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              <a href="beaver-expansion.html">Beaver expansion onto the North Slope →</a>
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
        </div>
      </main>
    </div>);

}

// ---------------------------------------------------------------------
// Top-level page with Tweaks (GEE URL + embed height)
// ---------------------------------------------------------------------
const BHA_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "geeUrl": "https://ljmcleod.users.earthengine.app/view/yukon-beaver-dams",
  "embedHeight": 620
} /*EDITMODE-END*/;

function BeaverHabitatAppPage() {
  const [t, setTweak] = useTweaks(BHA_TWEAK_DEFAULTS);
  return (
    <>
      <BeaverHabitatAppV2 geeUrl={t.geeUrl} embedHeight={t.embedHeight} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="GEE app">
          <TweakText
            label="App URL"
            value={t.geeUrl}
            placeholder="https://yourname.users.earthengine.app/view/beaver-habitat"
            onChange={(v) => setTweak('geeUrl', v)} />
          
        </TweakSection>
        <TweakSection label="Embed">
          <TweakSlider label="Height" value={t.embedHeight} min={420} max={900} step={10}
          unit="px" onChange={(v) => setTweak('embedHeight', v)} />
        </TweakSection>
      </TweaksPanel>
    </>);

}

Object.assign(window, { BeaverHabitatAppPage, BeaverHabitatAppV2 });