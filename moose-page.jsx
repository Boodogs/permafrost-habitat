// Moose Habitat Change — Logan McLeod PhD Chapter 02
// Built from the proposed-research one-pager (Nov 24, 2025).
// Uses BvHeader / BvHeroPhoto from beaver-variants.jsx.

const MS_TITLE = <>Habitat selection of Yukon&rsquo;s <em style={{ color: 'var(--phd)' }}>Arctic moose</em></>;
const MS_DECK = "Examining habitat selection of moose in northwestern Canada using satellite telemetry and remote-sensing for vegetation and snow.";

const MS_CONTEXT_PARAS = [
"The Western Canadian Arctic is warming at roughly 0.73 °C per decade. Shrubification, accelerating permafrost thaw, shifts in precipitation and snow depth, changing fire regimes, and lake drainage and expansion are all reshaping the surface that wildlife depends on. The implications for habitat are everywhere, but rigorous studies that connect specific landscape changes to specific habitat decisions are still rare.",
"Moose are an obvious place to look. They are large, highly mobile, an important resource for co-management partners, and tightly coupled to two of the variables that are changing fastest — upright shrub cover, which supports forage and thermal cover, and snowpack, which structures winter movement and energy budgets."];

const MS_QUESTION = "How do the biophysical determinants of habitat selection — vegetation, terrain, snow — differ between the Richardson Mountains and North Slope moose populations?";

const MS_OBJECTIVES = [
{ n: 1, label: "What are moose picking and avoiding through the year?",
  body: "Quantify seasonal habitat selection — winter, summer, calving, rut — using resource and step selection models." },
{ n: 2, label: "What's driving those choices in a changing Arctic?",
  body: "Test the relationship between selection patterns and biophysical covariates such as shrub cover, snow, and terrain." },
{ n: 3, label: "Where are the important places, season by season?",
  body: "Turn the results into seasonal suitability maps and migration corridors that can feed land-use planning and co-management." }];


const MS_METHODS = [
{ tag: "A", title: "Telemetry",
  body: "Satellite GPS collars (Vertex Plus 4D) deployed by Yukon Environment and partners on cow moose in both populations. Locations, temperature, and elevation every 3 hours. Three years of data, active collars still reporting." },
{ tag: "B", title: "Modeling",
  body: "Resource Selection Functions for broad-scale preferences, integrated Step Selection Functions and Behavioural State Space approaches for site-level decisions (3rd / 4th order selection — within home range, between successive locations)." },
{ tag: "C", title: "Covariates",
  body: "New high-quality spatial layers known to influence moose ecology: shrub cover, Yukon snow models, satellite-derived seasonal metrics. Focus on climate-driven change, forage, and biophysical conditions." }];


const MS_PARTNERS = "Yukon Environment · Gwich\u2019in Renewable Resources Board · Vuntut Gwitchin";

/* Population contrast — Richardsons (266 → 965 over 35 yrs) vs North Slope (stable).
   Simple animated bar comparison with a hand-drawn feel that matches the rest of the site. */
function PopulationContrast() {
  const W = 560,H = 220,PAD = { top: 20, right: 20, bottom: 50, left: 60 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;

  // Approximate trajectories — actual count data not in one-pager, sketch the shape.
  const years = [];
  for (let y = 1990; y <= 2025; y++) years.push(y);
  const maxYear = 2025,minYear = 1990;
  const maxY = 1100;

  // Richardson: roughly exponential-ish growth 266 → 965
  const richardson = years.map((y) => {
    const t = (y - minYear) / (maxYear - minYear);
    // smooth growth — gentle S
    const eased = Math.pow(t, 1.15);
    return [y, 266 + eased * (965 - 266)];
  });
  // North Slope: stable around ~700 with small fluctuation
  const northSlope = years.map((y, i) => {
    return [y, 700 + Math.sin(i * 0.6) * 35 + (i % 5 - 2) * 12];
  });

  const xs = (v) => PAD.left + (v - minYear) / (maxYear - minYear) * pw;
  const ys = (v) => PAD.top + ph - v / maxY * ph;
  const path = (arr) => arr.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xs(x).toFixed(1)} ${ys(y).toFixed(1)}`).join(' ');

  const yTicks = [0, 250, 500, 750, 1000];

  return (
    <div className="bv-embed-wrap">
      <div className="bv-chart-scroll">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: "'JetBrains Mono', monospace" }}>
        {yTicks.map((v) => {
          const y = ys(v);
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y} stroke="#e6dcc6" strokeWidth="0.5" />
              <text x={PAD.left - 8} y={y + 3} textAnchor="end" fill="#555" fontSize="9">{v}</text>
            </g>);

        })}

        {/* North Slope — flat-ish, neutral */}
        <path d={path(northSlope)} fill="none" stroke="#b77735" strokeWidth="1.5" />
        <circle cx={xs(2025)} cy={ys(northSlope[northSlope.length - 1][1])} r="3" fill="#b77735" />
        <text x={xs(2025) + 8} y={ys(northSlope[northSlope.length - 1][1]) + 3} fill="#b77735" fontSize="10" fontWeight="500">North Slope · stable</text>

        {/* Richardson — growth, accent */}
        <path d={path(richardson)} fill="none" stroke="#2f7d4f" strokeWidth="1.75" />
        <circle cx={xs(2025)} cy={ys(965)} r="3.5" fill="#2f7d4f" />
        <text x={xs(2025) - 4} y={ys(965) - 8} textAnchor="end" fill="#2f7d4f" fontSize="10" fontWeight="500">Richardsons · 266 → 965</text>

        {/* X axis */}
        <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph} stroke="#1a1a1a" strokeWidth="1" />
        {[1990, 2000, 2010, 2020].map((v) =>
        <g key={v}>
            <line x1={xs(v)} y1={PAD.top + ph} x2={xs(v)} y2={PAD.top + ph + 4} stroke="#1a1a1a" strokeWidth="1" />
            <text x={xs(v)} y={PAD.top + ph + 16} textAnchor="middle" fill="#555" fontSize="9">{v}</text>
          </g>
        )}
        <text x={PAD.left + pw / 2} y={H - 6} textAnchor="middle" fill="#555" fontSize="9">Year</text>
        <text x={14} y={PAD.top + ph / 2} textAnchor="middle" fill="#555" fontSize="9" transform={`rotate(-90, 14, ${PAD.top + ph / 2})`}>Estimated population</text>
      </svg>
      </div>
      <div className="bv-embed-cap">
        <span className="label">Fig. 1</span>
        <span>The Richardson Mountains population has grown from ~266 to ~965 animals in the last 35 years; the neighbouring North Slope population has held roughly steady. The contrast is the puzzle this chapter starts from.</span>
        <span className="arrow">↳ Trajectory shape is illustrative — published counts pending re-analysis.</span>
      </div>
    </div>);

}

function MooseHero({ height = 320, objectPosition = 'center 65%' }) {
  return (
    <figure className="bv-hero-photo" style={{ height, marginTop: 36 }}>
      <img src="images/moose-scope.jpg" alt="Moose seen through a spotting scope" style={{ objectPosition }} />
      <figcaption className="cap">Moose · scope view, June 2024</figcaption>
    </figure>);

}

function MsCiteContact() {
  return (
    <div className="bv-foot">
      <div>
        <h3>Partners</h3>
        <div style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.5 }}>{MS_PARTNERS}</div>
        <h3 style={{ marginTop: 18 }}>Companion tool</h3>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          <a href="moose-habitat-app.html">Moose habitat — Earth Engine app →</a>
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

const MOOSE_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroH": 320,
  "heroY": 56
} /*EDITMODE-END*/;

function MoosePage() {
  const [t, setTweak] = useTweaks(MOOSE_TWEAK_DEFAULTS);
  return (
    <div className="bv" style={{ minHeight: 1700 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 24 }}>
          <span className="chip"><span className="dot"></span>PhD chapter 02</span>
          <span></span>
          <span>GPS TELEMETRY</span>
          <span>HABITAT SELECTION</span>
          <span>MOVEMENT MODELS</span>
          <span style={{ color: 'var(--accent, #b77735)' }}></span>
        </div>

        <h1 className="bv-title">{MS_TITLE}</h1>
        <p className="bv-deck" style={{ maxWidth: 820 }}>{MS_DECK}</p>

        <MooseHero height={t.heroH} objectPosition={`center ${t.heroY}%`} />

        <hr className="bv-divider" />

        <div>
          <span className="small-cap">Three questions</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 16 }}>
            {MS_OBJECTIVES.map((obj) =>
            <div key={obj.n}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--sub)', letterSpacing: 1.4 }}>
                  0{obj.n}
                </div>
                <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontWeight: 500,
                fontSize: 17,
                margin: '6px 0 10px',
                lineHeight: 1.3
              }}>{obj.label}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: 'var(--ink)' }}>{obj.body}</p>
              </div>
            )}
          </div>
        </div>

        <hr className="bv-divider" />

        <div style={{
          margin: '0 auto',
          maxWidth: 640,
          padding: '40px 0',
          textAlign: 'center'
        }}>          <div className="mono" style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--accent, #b77735)', marginBottom: 14
          }}>Under construction</div>
          <p style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: 18, lineHeight: 1.55,
            color: 'var(--ink)', margin: 0
          }}>This chapter is still in active development. A more complete writeup and results will be coming soon.

          </p>
        </div>

        <MsCiteContact />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero photo">
          <TweakSlider label="Crop · vertical" value={t.heroY} min={0} max={100} step={1} unit="%" onChange={(v) => setTweak('heroY', v)} />
          <TweakSlider label="Height" value={t.heroH} min={200} max={520} step={10} unit="px" onChange={(v) => setTweak('heroH', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

Object.assign(window, { MoosePage });