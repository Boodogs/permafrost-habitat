// Grey-headed Chickadee project page
// "A failed search, new perspectives" — COSEWIC → Endangered, May 2024.
// Uses BvHeader from beaver-variants.jsx.

const GH_TITLE = <>Grey-headed <em>Chickadee</em></>;
const GH_DECK = "The Grey-headed Chickadee (Poecile cinctus) is a Boreal-Arctic resident that occurs in Canada only in the Yukon and Northwest Territories. Historical records date back to 1864, but there have been few recent observations and only one sighting in Canada in the last fifteen years. In 2019, we returned to every location with a historical record in the Yukon to conduct a targeted acoustic search. However, we found none. Here's what that absence can teach us.";

const GH_PARAS = [
"We revisited every historical observation and collection locality for Grey-headed Chickadee in the Yukon — seventeen sites spanning the Ogilvie Mountains, the Richardson Mountains, and the Old Crow Flats. At each, we deployed autonomous recording units and processed the audio with a species-specific call recognizer, subsampled human listening, and BirdNET. Sixty-two additional sites were selected randomly with spatial balance and habitat weighting within the species' historical range.",
"Across all sites we detected 394 chickadee calls. Every one was Boreal Chickadee. No Grey-headed Chickadees were detected. This result matters — it's not just absence of evidence but evidence used to estimate just how few birds remain.",
"Using a Bayesian framework based on assumed aural detection distances, an assessment of available habitat, and simulations across a range of possible abundances, we estimated the Canadian population. A result of zero detections occurred in half of simulations when there were 159 individuals — meaning there is a 50% probability that fewer than 150 mature individuals remain. With 99% probability, fewer than 1,000 remain, and with 68% probability, 250 or fewer.",
"The COSEWIC status report drew on this work. In May 2024, Grey-headed Chickadee was designated Endangered in Canada. Causes for the apparent decline are not well understood, but climate change and competition or hybridization with Boreal Chickadee, which appears to be expanding into Grey-headed Chickadee habitat, are leading hypotheses."];


const GH_PARTNERS = "Environment and Climate Change Canada (Canadian Wildlife Service) · Alaska Department of Fish and Game · Vuntut Gwitchin";

/* Posterior distribution chart — approximate the exponential-decay shape
   from the poster (abundance of males, x-axis 0–2000). */
function PosteriorChart() {
  const W = 560,H = 220,PAD = { top: 16, right: 20, bottom: 40, left: 50 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;
  const maxX = 2000;

  // Approximate posterior: gamma-like shape, mode near 60, long tail
  const rate = 0.012;
  const points = [];
  const N = 100;
  for (let i = 0; i <= N; i++) {
    const x = i / N * maxX;
    // shape similar to x * exp(-rate * x) — peaked near 80, decaying
    const y = x * Math.exp(-rate * x);
    points.push([x, y]);
  }
  const maxY = Math.max(...points.map((p) => p[1]));

  const toSvg = ([x, y]) => [
  PAD.left + x / maxX * pw,
  PAD.top + ph - y / maxY * ph];


  // Build area path
  const pathPts = points.map((p) => toSvg(p));
  const areaD = `M ${PAD.left} ${PAD.top + ph} ` +
  pathPts.map(([x, y]) => `L ${x} ${y}`).join(' ') +
  ` L ${PAD.left + pw} ${PAD.top + ph} Z`;

  // Shaded region: P < 250
  const cutoff = 250;
  const shadePts = points.filter((p) => p[0] <= cutoff).map((p) => toSvg(p));
  const shadeD = `M ${PAD.left} ${PAD.top + ph} ` +
  shadePts.map(([x, y]) => `L ${x} ${y}`).join(' ') +
  ` L ${toSvg([cutoff, 0])[0]} ${PAD.top + ph} Z`;

  // Tick marks
  const xTicks = [0, 250, 500, 1000, 1500, 2000];

  return (
    <div className="bv-embed-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: "'JetBrains Mono', monospace" }}>
        {/* Grid lines */}
        {xTicks.map((v) => {
          const x = PAD.left + v / maxX * pw;
          return <line key={v} x1={x} y1={PAD.top} x2={x} y2={PAD.top + ph} stroke="#e6dcc6" strokeWidth="0.5" />;
        })}

        {/* Shaded area: ≤250 */}
        <path d={shadeD} fill="rgba(47,125,79,0.2)" />

        {/* Full distribution */}
        <path d={areaD} fill="none" stroke="#2f7d4f" strokeWidth="1.5" />

        {/* 250 annotation */}
        <line x1={toSvg([250, 0])[0]} y1={PAD.top} x2={toSvg([250, 0])[0]} y2={PAD.top + ph} stroke="#2f7d4f" strokeWidth="1" strokeDasharray="4,3" />
        <text x={toSvg([250, 0])[0]} y={PAD.top - 4} textAnchor="middle" fill="#2f7d4f" fontSize="9" fontWeight="500">≤ 250 (68%)</text>

        {/* 1000 annotation */}
        <line x1={toSvg([1000, 0])[0]} y1={PAD.top + 10} x2={toSvg([1000, 0])[0]} y2={PAD.top + ph} stroke="#b77735" strokeWidth="1" strokeDasharray="4,3" />
        <text x={toSvg([1000, 0])[0]} y={PAD.top + 6} textAnchor="middle" fill="#b77735" fontSize="9" fontWeight="500">≤ 1,000 (99%)</text>

        {/* X axis */}
        <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph} stroke="#1a1a1a" strokeWidth="1" />
        {xTicks.map((v) => {
          const x = PAD.left + v / maxX * pw;
          return (
            <g key={`t${v}`}>
              <line x1={x} y1={PAD.top + ph} x2={x} y2={PAD.top + ph + 4} stroke="#1a1a1a" strokeWidth="1" />
              <text x={x} y={PAD.top + ph + 16} textAnchor="middle" fill="#555" fontSize="9">{v.toLocaleString()}</text>
            </g>);

        })}
        <text x={PAD.left + pw / 2} y={H - 4} textAnchor="middle" fill="#555" fontSize="9">Abundance of mature individuals</text>

        {/* Y axis label */}
        <text x={12} y={PAD.top + ph / 2} textAnchor="middle" fill="#555" fontSize="9" transform={`rotate(-90, 12, ${PAD.top + ph / 2})`}>Posterior density</text>
      </svg>
      <div className="bv-embed-cap">
        <span className="label">Fig. 1</span>
        <span>Posterior estimate of Grey-headed Chickadee abundance in Canada. The shaded region shows the 68% probability that ≤ 250 mature individuals remain.</span>
      </div>
    </div>);

}

function GhCiteContact() {
  return (
    <div className="bv-foot">
      <div>
        <h3>Related</h3>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
          COSEWIC (2024). <a href="https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/gray-headed-chickadee-2024.html" target="_blank" rel="noopener">COSEWIC assessment and status report on the Gray-headed Chickadee <i>Poecile cinctus</i> in Canada</a>. Committee on the Status of Endangered Wildlife in Canada, Ottawa. Prepared by C.L. Mahon and L.J.T. McLeod. <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}></span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
          Booms TL, DeCicco LH, Barger CP, & Johnson JA (2020). <a href="https://doi.org/10.3996/082019-JFWM-072" target="_blank" rel="noopener">Current knowledge and conservation status of the gray-headed chickadee in North America</a>. <i>Journal of Fish and Wildlife Management</i> 11(2):654–664.
        </div>
        <h3 style={{ marginTop: 18 }}>Partners</h3>
        <div style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.5 }}>{GH_PARTNERS}</div>
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

const INAT_API = 'https://api.inaturalist.org/v1/observations?nelat=69.66321463306379&nelng=-136.1775139913562&swlat=67.45641707832806&swlng=-141.0993889913562&taxon_id=144821&per_page=12&order=desc&order_by=observed_on';
const INAT_BROWSE = 'https://www.inaturalist.org/observations?nelat=69.66321463306379&nelng=-136.1775139913562&swlat=67.45641707832806&swlng=-141.0993889913562&taxon_id=144821';

function InatGallery() {
  const [obs, setObs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    fetch(INAT_API).
    then((r) => r.json()).
    then((data) => {
      setObs(data.results || []);
      setTotal(data.total_results || 0);
      setLoading(false);
    }).
    catch(() => setLoading(false));
  }, []);

  const cardStyle = {
    border: '1.5px solid var(--ink)',
    background: 'var(--paper)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };
  const imgStyle = {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    display: 'block',
    background: 'var(--hatch)'
  };
  const metaStyle = {
    padding: '6px 10px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    color: 'var(--sub)',
    lineHeight: 1.4,
    borderTop: '1px solid var(--hatch)'
  };

  return (
    <div className="bv-embed-wrap" style={{ marginTop: 36 }}>
      {loading ?
      <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>
          Loading observations from iNaturalist…
        </div> :
      obs.length === 0 ?
      <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>
          Could not load observations. <a href={INAT_BROWSE} target="_blank" rel="noopener">View on iNaturalist →</a>
        </div> :

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {obs.slice(0, 8).map((o) => {
          const photo = o.photos?.[0];
          const sound = o.sounds?.[0];
          const thumb = photo ? photo.url?.replace('square', 'small') : null;
          const date = o.observed_on_details ? `${o.observed_on_details.year}-${String(o.observed_on_details.month).padStart(2, '0')}-${String(o.observed_on_details.day).padStart(2, '0')}` : '';
          const place = o.place_guess || '';
          const url = `https://www.inaturalist.org/observations/${o.id}`;
          return (
            <a key={o.id} href={url} target="_blank" rel="noopener" style={{ ...cardStyle, textDecoration: 'none', color: 'inherit' }}>
                {thumb ?
              <img src={thumb} alt="Boreal Chickadee" style={imgStyle} /> :

              <div style={{ ...imgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: 'var(--faint)' }}>
                      {sound ? '♪' : '—'}
                    </span>
                  </div>
              }
                <div style={metaStyle}>
                  <div style={{ fontWeight: 500, color: 'var(--ink)' }}>
                    {sound ? '♪ ' : ''}{o.taxon?.preferred_common_name || 'Boreal Chickadee'}
                  </div>
                  <div>{date}{place ? ` · ${place}` : ''}</div>
                  <div>by {o.user?.login || '—'}</div>
                </div>
              </a>);

        })}
        </div>
      }
      <div className="bv-embed-cap">
        <span className="label">The candidates</span>
        <span>Selected chickadee observations from the Grey-headed Chickadee search area in northern Yukon. We detected 394 chickadee calls across all sites, however, they were all Boreal Chickadee.</span>
        <span className="arrow">↳ <a href={INAT_BROWSE} target="_blank" rel="noopener">view on iNaturalist</a></span>
      </div>
    </div>);

}

const CHICKADEE_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroY": 22,
  "heroH": 320
} /*EDITMODE-END*/;

function ChickadeePage() {
  const [t, setTweak] = useTweaks(CHICKADEE_TWEAK_DEFAULTS);
  return (
    <div className="bv" style={{ minHeight: 1400 }}>
      <BvHeader activeTab="research" />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>

        <div className="bv-meta" style={{ marginTop: 24 }}>
          <span className="chip"><span className="dot"></span>Project</span>
          <span>YUKON · ALASKA</span>
          <span>ACOUSTIC MONITORING</span>
          <span>CONSERVATION</span>
        </div>

        <h1 className="bv-title">{GH_TITLE}</h1>
        <p className="bv-deck" style={{ maxWidth: 780 }}>{GH_DECK}</p>

        <BvHeroPhoto
          style={{ height: t.heroH, marginTop: 36 }}
          imgStyle={{ objectPosition: `center ${t.heroY}%` }}
          src="images/grey-headed-chickadee-hero.png"
          caption={<>Grey-headed Chickadee (<i>Poecile cinctus</i>) · photo by Gerrit Vyn / <a href="https://macaulaylibrary.org/asset/31127091" target="_blank" rel="noopener">Macaulay Library ML31127091</a></>} />
        

        <hr className="bv-divider" />

        <div className="bv-prose" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <span className="small-cap">The search</span>
            <p className="lead">{GH_PARAS[0]}</p>
          </div>
          <div>
            <span className="small-cap">The result</span>
            <p>{GH_PARAS[1]}</p>
            <p>{GH_PARAS[2]}</p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <PosteriorChart />
        </div>

        <hr className="bv-divider" />

        <div className="bv-prose" style={{ maxWidth: 680 }}>
          <span className="small-cap">What it means</span>
          <p>{GH_PARAS[3]}</p>
        </div>

        <InatGallery />

        <hr className="bv-divider" />
        <GhCiteContact />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero photo">
          <TweakSlider label="Crop · vertical" value={t.heroY} min={0} max={100} step={1} unit="%" onChange={(v) => setTweak('heroY', v)} />
          <TweakSlider label="Height" value={t.heroH} min={200} max={520} step={10} unit="px" onChange={(v) => setTweak('heroH', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

Object.assign(window, { ChickadeePage });