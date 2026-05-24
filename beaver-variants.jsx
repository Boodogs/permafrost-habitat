// Beaver Expansion — three layout variants of the same content.
// Embeds widgets/beaver-forecast-viewer.html via iframe.

const BV_TITLE = <>Beaver Expansion onto the <em style={{ color: 'var(--phd)' }}>North Slope</em></>;
const BV_DECK = "Mapping beaver dams across the Yukon North Slope, and modelling where they are likely to go from here.";

const BV_TLDR_PARAS = [
"Beavers were not on the North Slope. The first dams here appeared in the late 2000s — Inuvialuit hunters reported seeing them in 2008. We've now mapped 138 across 3,282 km² of Yukon coast, between the Babbage and the western Mackenzie Delta. Last summer one was spotted swimming in the Arctic Ocean, off Shingle Point.",
"Dams were found by working through the high-resolution satellite archive year by year. For each one we logged when it first appeared and when (if ever) it failed. In summer 2024 we ground-truthed the inventory by helicopter and worked six dams on foot — pond bathymetry, vegetation, and drone orthomosaics.",
"The inventory feeds three models. A habitat-suitability surface asks where the landscape is best for beaver dams. A survival model asks which physical settings hold dams over time. A spatial simulation, calibrated against the inventory, runs the pattern forward to 2050. The forecast viewer below is one window onto that simulation."];


function BvHeader({ activeTab = 'research' }) {
  const tabs = [
  ['Research', 'research', 'index.html'],
  ['Publications', 'publications', 'publications.html'],
  ['Field Notes', 'fieldnotes', 'field-notes.html']];

  return (
    <header className="bv-header">
      <div className="bv-wordmark">Logan McLeod<span className="dot"></span></div>
      <nav className="bv-nav">
        {tabs.map(([label, key, href]) =>
        <a key={key} href={href} className={key === activeTab ? 'on' : ''}>{label}</a>
        )}
      </nav>
    </header>);

}

function BvMetaBar() {
  return (
    <div className="bv-meta" style={{ marginTop: 24 }}>
      <span className="chip"><span className="dot"></span>PhD chapter 01</span>
      <span>Yukon North Slope</span>
      <span>REMOTE SENSING</span>
      <span>BAYESIAN COMPUTATION</span>
    </div>);

}

function BvCiteContact() {
  return (
    <div className="bv-foot">
      <div>
        <h3>Companion tool</h3>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          <a href="beaver-habitat-app.html">Beaver habitat &amp; dam persistence — Earth Engine app →</a>
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

function BvCompanionLink() {
  return (
    <a href="beaver-habitat-app.html" className="bv-companion-link">
      <div className="bv-companion-body">
        <div className="bv-companion-kicker mono">Interactive companion tool · separate page</div>
        <div className="bv-companion-title">Beaver habitat & dam persistence</div>
        <div className="bv-companion-desc">
          Explore the models in my Earth Engine app <i></i>
        </div>
      </div>
      <div className="bv-companion-cta mono">Open the app <span className="arrow">→</span></div>
    </a>);

}

function BvEmbed({ caption = true }) {
  return (
    <div className="bv-embed-wrap">
      <iframe
        className="bv-embed-frame"
        src="widgets/beaver-forecast-viewer.html"
        title="Beaver Expansion Forecast Viewer"
        loading="lazy" />
      
      {caption &&
      <div className="bv-embed-cap">
          <span className="label"></span>
          <span>Press <b>play</b> to watch dams spread; drag the year slider to jump to a specific point.</span>
          <span className="arrow">↳ pan & zoom the map; the side panel summarizes detected dams.</span>
        </div>
      }
    </div>);

}

function BvHeroPhoto({ caption = "Tundra stream, Yukon North Slope", style = {}, imgStyle = {}, src = "images/shingle-point-stream.jpg" }) {
  return (
    <figure className="bv-hero-photo" style={style}>
      <img src={src} alt={caption} style={imgStyle} />
      <figcaption className="cap">{caption}</figcaption>
    </figure>);

}

/* ============================================================
   V1 — Embed-first
   ============================================================ */
function BeaverV1() {
  return (
    <div className="bv" style={{ minHeight: 1700 }}>
      <BvHeader />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>
        <BvMetaBar />
        <h1 className="bv-title">{BV_TITLE}</h1>
        <p className="bv-deck">{BV_DECK}</p>

        <BvHeroPhoto style={{ height: 280, marginTop: 36 }} />

        <div className="bv-prose" style={{ maxWidth: 760, marginTop: 36 }}>
          <span className="small-cap">In short</span>
          <p className="lead">{BV_TLDR_PARAS[0]}</p>
        </div>

        <div className="bv-prose" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 36 }}>
          <div>
            <span className="small-cap">Study area &amp; inventory</span>
            <p>{BV_TLDR_PARAS[1]}</p>
          </div>
          <div>
            <span className="small-cap">Models</span>
            <p>{BV_TLDR_PARAS[2]}</p>
          </div>
        </div>

        <BvCompanionLink />

        <div style={{ marginTop: 36 }}>
          <div className="bv-prose" style={{ marginBottom: 16 }}>
            <span className="small-cap">Forecast viewer</span>
            <h2 className="bv-section-h" style={{ marginTop: 6 }}>Beaver expansion to 2050.</h2>
            <p style={{ color: 'var(--sub)', margin: '6px 0 0', maxWidth: '68ch' }}>An interactive forecast of where simulated dams are likely to appear and persist across the Yukon North Slope. Press play or drag the year slider to step through time.</p>
          </div>
          <BvEmbed />
        </div>

        <BvCiteContact />
      </main>
    </div>);

}

/* ============================================================
   V2 — Story-first
   ============================================================ */
function BeaverV2() {
  return (
    <div className="bv" style={{ minHeight: 1900 }}>
      <BvHeader />
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '60px 56px 80px' }}>
        <BvMetaBar />
        <h1 className="bv-title">{BV_TITLE}</h1>
        <p className="bv-deck">{BV_DECK}</p>

        <div className="bv-prose" style={{ marginTop: 48 }}>
          <p className="lead">{BV_TLDR_PARAS[0]}</p>
          <p>{BV_TLDR_PARAS[1]}</p>
        </div>

        <BvHeroPhoto style={{ height: 360, margin: '40px 0' }} />

        <div className="bv-prose">
          <p>{BV_TLDR_PARAS[2]}</p>
        </div>

        <div style={{ margin: '36px 0 12px' }}>
          <span className="small-cap" style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: 12 }}>
            ↓ Forecast viewer
          </span>
        </div>
        <BvEmbed />
        <BvCompanionLink />

        <BvCiteContact />
      </main>
    </div>);

}

/* ============================================================
   V3 — Field-notebook
   ============================================================ */
function BeaverV3() {
  return (
    <div className="bv" style={{ minHeight: 2000 }}>
      <BvHeader />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 56px 80px' }}>
        <BvMetaBar />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 40, alignItems: 'start', marginTop: 12 }}>
          <div>
            <h1 className="bv-title">{BV_TITLE}</h1>
            <p className="bv-deck">{BV_DECK}</p>
          </div>
          <BvHeroPhoto style={{ height: 200, marginTop: 24 }} caption="Shingle Pt." />
        </div>

        <hr className="bv-divider" />

        {/* Section 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 40, alignItems: 'start' }}>
          <div className="bv-prose">
            <h2 className="bv-section-h">Where, how fast, into which streams.</h2>
            <p className="lead">{BV_TLDR_PARAS[0]}</p>
            <p>{BV_TLDR_PARAS[1]}</p>
          </div>
          <div className="bv-margin">
            "Across the western Arctic" — confirmed in YT, NWT, and adjacent AK; signal weaker in the Mackenzie Delta proper.
          </div>
        </div>

        <hr className="bv-divider" />

        {/* Section 2 — embed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 40, alignItems: 'start' }}>
          <div>
            <h2 className="bv-section-h">A thinking tool.</h2>
            <div className="bv-prose">
              <p>{BV_TLDR_PARAS[2]}</p>
            </div>
            <BvEmbed />
            <BvCompanionLink />
          </div>
          <div className="bv-margin">
            The model is per-dam, not per-colony. It under-counts dispersal across drainage divides — which I think is exactly what's happening at Shingle Pt.
          </div>
        </div>

        <BvCiteContact />
      </main>
    </div>);

}

function SiteFooter() {return null;}

Object.assign(window, { BeaverV1, BeaverV2, BeaverV3, BvHeader, BvCompanionLink, SiteFooter });