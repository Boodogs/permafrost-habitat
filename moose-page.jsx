// Moose Habitat Change — Logan McLeod PhD Chapter 02
// Built from the proposed-research one-pager (Nov 24, 2025).
// Uses BvHeader / BvHeroPhoto from beaver-variants.jsx.

const MS_TITLE = <>Habitat selection of Yukon&rsquo;s <em>Arctic moose</em></>;
const MS_DECK = "Two neighbouring moose populations — one tripling in size, one stable. Using high-resolution GPS telemetry and the new generation of remote-sensing layers for shrubs and snow, this chapter quantifies how seasonal habitat selection differs between Richardson Mountains and North Slope moose, and how it tracks the landscape's accelerating change.";

const MS_CONTEXT_PARAS = [
"The Western Canadian Arctic is warming at roughly 0.73 °C per decade. Shrubification, accelerating permafrost thaw, shifts in precipitation and snow depth, changing fire regimes, and lake drainage and expansion are all reshaping the surface that wildlife depends on. The implications for habitat are everywhere, but rigorous studies that connect specific landscape changes to specific habitat decisions are still rare.",
"Moose are an obvious place to look. They are large, highly mobile, an important resource for co-management partners, and tightly coupled to two of the variables that are changing fastest — upright shrub cover, which supports forage and thermal cover, and snowpack, which structures winter movement and energy budgets."];

const MS_QUESTION = "How do the biophysical determinants of habitat selection — vegetation, terrain, snow — differ between the Richardson Mountains and North Slope moose populations?";

const MS_OBJECTIVES = [
{ n: 1, label: "Quantify seasonal habitat selection",
  body: "Use a Resource Selection and Step Selection framework to estimate selection and avoidance across the seasons that matter — winter, summer, calving, and rut." },
{ n: 2, label: "Test the role of landscape change",
  body: "Specifically assess how variables associated with a changing Arctic — shrub abundance, snow characteristics, terrain — drive seasonal selection." },
{ n: 3, label: "Map important habitats",
  body: "Produce seasonal habitat-suitability surfaces and migration corridors that can feed directly into land-use planning and conservation strategies." }];


const MS_METHODS = [
{ tag: "A", title: "Telemetry",
  body: "Satellite GPS collars (Vertex Plus 4D) deployed by Yukon Environment and partners on cow moose in both populations. Locations, temperature, and elevation every 3 hours. Three years of data, active collars still reporting." },
{ tag: "B", title: "Modeling",
  body: "Resource Selection Functions for broad-scale preferences, integrated Step Selection Functions and Behavioural State Space approaches for site-level decisions (3rd / 4th order selection — within home range, between successive locations)." },
{ tag: "C", title: "Covariates",
  body: "New high-quality spatial layers known to influence moose ecology: shrub cover, Yukon snow models, satellite-derived seasonal metrics. Focus on climate-driven change, forage, and biophysical conditions." }];


const MS_PARTNERS = "Yukon Environment · Gwich\u2019in Renewable Resources Board · Vuntut Gwitchin · Aklavik HTC";

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
      <div className="bv-embed-cap">
        <span className="label">Fig. 1</span>
        <span>The Richardson Mountains population has grown from ~266 to ~965 animals in the last 35 years; the neighbouring North Slope population has held roughly steady. The contrast is the puzzle this chapter starts from.</span>
        <span className="arrow">↳ Trajectory shape is illustrative — published counts pending re-analysis.</span>
      </div>
    </div>);

}

function MooseHeroPlaceholder({ height = 320 }) {
  return (
    <figure className="bv-hero-photo" style={{ height, marginTop: 36 }}>
      <div style={{
        width: '100%', height: '100%',
        background: 'repeating-linear-gradient(45deg, #ece2cb, #ece2cb 14px, #e6dcc6 14px, #e6dcc6 28px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: '#7a6e54', letterSpacing: 1.2, textTransform: 'uppercase'
      }}>
        photo · cow moose, Richardson Mountains [placeholder]
      </div>
      <figcaption className="cap">Cow moose, Richardson Mountains — collar deployment site</figcaption>
    </figure>);

}

function MsCiteContact() {
  return (
    <div className="bv-foot">
      <div>
        <h3>Co-management priorities</h3>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
          Addresses Gwich&rsquo;in Renewable Resources Board research priorities <span className="mono" style={{ fontSize: 12 }}>WI-17-099</span> and <span className="mono" style={{ fontSize: 12 }}>WI-17-100</span> — mapping important habitats and habitat / range use studies for moose.
        </div>
        <h3 style={{ marginTop: 18 }}>Partners</h3>
        <div style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.5 }}>{MS_PARTNERS}</div>
      </div>
      <div>
        <h3>Contact</h3>
        <div className="bv-contact">
          <div>Logan McLeod</div>
          <div style={{ color: 'var(--sub)' }}>PhD candidate · Arctic Landscape Ecology Lab</div>
          <div style={{ marginTop: 8 }}><a href="mailto:loganmcleod@uvic.ca">loganmcleod@uvic.ca</a></div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--sub)', marginTop: 4 }}>
            <a href="https://orcid.org/0000-0003-4528-1523" target="_blank" rel="noopener">orcid.org/0000-0003-4528-1523</a>
          </div>
        </div>
      </div>
    </div>);

}

const MOOSE_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroH": 320
} /*EDITMODE-END*/;

function MoosePage() {
  const [t, setTweak] = useTweaks(MOOSE_TWEAK_DEFAULTS);
  return (
    <div className="bv" style={{ minHeight: 1700 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 24 }}>
          <span className="chip"><span className="dot"></span>PhD chapter 02</span>
          <span>RICHARDSON MOUNTAINS · YT/NT</span>
          <span>GPS TELEMETRY</span>
          <span>HABITAT SELECTION</span>
          <span style={{ color: 'var(--accent, #b77735)' }}></span>
        </div>

        <h1 className="bv-title">{MS_TITLE}</h1>
        <p className="bv-deck" style={{ maxWidth: 820 }}>{MS_DECK}</p>

        <MooseHeroPlaceholder height={t.heroH} />

        <hr className="bv-divider" />

        <div className="bv-prose" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <span className="small-cap">A changing surface</span>
            <p className="lead">{MS_CONTEXT_PARAS[0]}</p>
          </div>
          <div>
            <span className="small-cap">Why moose</span>
            <p>{MS_CONTEXT_PARAS[1]}</p>
            <p style={{ color: 'var(--sub)', fontSize: 14, marginTop: 14 }}>
              Summer habitat — strongly tied to aquatic resources — is critical for building fat reserves, ensuring winter survival, and rearing young. Winter snow accumulation and spring melt likely have strong impacts on movement and use.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <PopulationContrast />
        </div>

        <hr className="bv-divider" />

        {/* Research question — pull-quote */}
        <blockquote style={{
          margin: '0 auto',
          maxWidth: 820,
          padding: '24px 0',
          borderTop: '1px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          fontFamily: "'Source Serif 4', serif",
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.4,
          textAlign: 'center'
        }}>
          <span className="small-cap" style={{ display: 'block', marginBottom: 10 }}>Research question</span>
          {MS_QUESTION}
        </blockquote>

        <hr className="bv-divider" />

        {/* Objectives — three columns */}
        <div>
          <span className="small-cap">Objectives</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 16 }}>
            {MS_OBJECTIVES.map((obj) =>
            <div key={obj.n} style={{
              borderTop: '1.5px solid var(--ink)',
              paddingTop: 14
            }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--sub)', letterSpacing: 1.4 }}>
                  OBJ · 0{obj.n}
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

        {/* Methods — three labeled blocks */}
        <div>
          <span className="small-cap">Methods · habitat selection modeling</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 16 }}>
            {MS_METHODS.map((m) =>
            <div key={m.tag} style={{
              background: 'var(--paper, #fff)',
              border: '1.25px solid var(--ink)',
              padding: '16px 18px'
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                  <span className="mono" style={{
                  fontSize: 11,
                  background: 'var(--ink)',
                  color: 'var(--paper, #fff)',
                  padding: '2px 6px',
                  letterSpacing: 1
                }}>{m.tag}</span>
                  <h3 style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontWeight: 500,
                  fontSize: 16,
                  margin: 0
                }}>{m.title}</h3>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{m.body}</p>
              </div>
            )}
          </div>
        </div>

        <hr className="bv-divider" />

        <div className="bv-prose" style={{ maxWidth: 720 }}>
          <span className="small-cap">Why it matters</span>
          <p>
            Moose are an important resource. Mapping important habitats and habitat / range-use studies are recognised priorities for co-management partners. An improved understanding of habitat preferences and responses to environmental change is essential for sustainable wildlife management — and for predicting shifts in distribution and abundance as the Arctic continues to change.
          </p>
        </div>

        <hr className="bv-divider" />
        <MsCiteContact />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero photo">
          <TweakSlider label="Height" value={t.heroH} min={200} max={520} step={10} unit="px" onChange={(v) => setTweak('heroH', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

Object.assign(window, { MoosePage });