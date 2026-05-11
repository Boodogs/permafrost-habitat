// Songbird chapter — "Listening to a changing tundra"
// Production page (V1 layout). Uses BvHeader from beaver-variants.jsx.

const SB_TITLE = <>Listening to a changing <em>tundra</em></>;
const SB_DECK = "Permafrost disturbances, in the form of thaw slumps, drained lakes, and tundra fires, are reshaping bird habitat in the tundra of the Inuvialuit Settlement Region. Vegetation changes as permafrost degrades and the habitat available to birds shifts too. This can favour some species over others and change the relative abundance of species in the community. This chapter investigates bird community composition and abundance at tundra sites spanning a range of disturbance types and ages.";

const SB_PARAS = [
"The tundra is rearranging itself faster than the songbirds can. As ground ice thaws, retrogressive slumps tear open hillslopes; lakes drain through new outlets in days; fires burn deeper into peat than they used to. What grows back is rarely tundra — it's shrub.",
"This chapter asks a community-level question: who responds, who disappears, and who arrives, when a patch of tundra becomes something else. We deployed bird recorders at disturbance sites — slumps, drained-lake basins, recent burns — and at paired undisturbed controls, then estimated species-level relative abundance from the recordings.",
"The pattern emerging is consistent with what the vegetation predicts. Open-tundra specialists — Lapland Longspur, Snow Bunting, American Pipit — are detected less often at disturbed sites; shrub-associated species — White-crowned Sparrow, Common Redpoll, American Tree Sparrow — more often. The interesting cases are the ones in between, where it's not clear whether the change is permanent."];

const SB_PARTNERS = "WMAC-NWT · Environment and Climate Change Canada (Canadian Wildlife Service)";

function SbMetaBar() {
  return (
    <div className="bv-meta" style={{ marginTop: 24 }}>
      <span className="chip"><span className="dot"></span>PhD chapter 03</span>
      <span>INUVIK – TUKTOYAKTUK</span>
      <span>ACOUSTIC MONITORING</span>
      <span>LANDSCAPE CHANGE</span>
    </div>
  );
}

function SbHeroPhoto({ caption = "Retrogressive thaw slump draining into a tundra lake, Inuvialuit Settlement Region", style = {}, imgStyle = {}, src = "images/thaw-slump.jpg" }) {
  return (
    <figure className="bv-hero-photo" style={style}>
      <img src={src} alt={caption} style={imgStyle} />
      <figcaption className="cap">{caption}</figcaption>
    </figure>
  );
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
    </div>
  );
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
    </div>
  );
}

const SONGBIRD_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroY": 50,
  "heroH": 320
}/*EDITMODE-END*/;

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
            <p>{SB_PARAS[1]}</p>
          </div>
          <div>
            <span className="small-cap">What we're seeing</span>
            <p>{SB_PARAS[2]}</p>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <SbEmbedPlaceholder />
        </div>

        <hr className="bv-divider" />
        <SbCiteContact />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero photo">
          <TweakSlider label="Crop · vertical" value={t.heroY} min={0} max={100} step={1} unit="%" onChange={(v) => setTweak('heroY', v)} />
          <TweakSlider label="Height" value={t.heroH} min={200} max={520} step={10} unit="px" onChange={(v) => setTweak('heroH', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { SongbirdPage });
