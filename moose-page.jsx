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

/* Population trajectory chart removed — illustrative/placeholder data.
   (Was PopulationContrast; deleted as part of the live-readiness pass.) */

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
                <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontWeight: 500,
                fontSize: 17,
                margin: '0 0 10px',
                lineHeight: 1.3
              }}>{obj.label}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: 'var(--ink)' }}>{obj.body}</p>
              </div>
            )}
          </div>
        </div>

        <MooseGreenWave />

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