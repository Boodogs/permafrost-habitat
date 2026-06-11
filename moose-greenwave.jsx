// Moose chapter — "Resource tracking"
// Preliminary results section. Figures extracted from Logan's R Markdown
// analysis (moose_prelim_analysis). Uses site classes from beaver-shared.css.
// Loaded before moose-page.jsx; rendered inside MoosePage.

const GW_FIG_DIR = 'images/moose-green-wave/';

// Small figure wrapper matching the site's .bv-embed-wrap / .bv-embed-cap pattern.
// Flush 1.5px ink frame on the plate, caption below — same treatment as the maps.
function MsFig({ src, alt, fig, children, note, maxWidth = 640 }) {
  return (
    <figure className="bv-embed-wrap" style={{ margin: '22px auto 0', maxWidth }}>
      <img src={GW_FIG_DIR + src} alt={alt} loading="lazy"
        style={{ display: 'block', width: '100%', height: 'auto', border: '1.5px solid var(--ink)' }} />
      <figcaption className="bv-embed-cap">
        <span>{children}</span>
        {note && <span className="arrow">↳ {note}</span>}
      </figcaption>
    </figure>);
}

function MooseGreenWave() {
  return (
    <section style={{ paddingBottom: 64 }}>
      <hr className="bv-divider" />

      <span className="small-cap">Preliminary results · 2023–2024</span>
      <h2 className="bv-section-h" style={{ fontSize: 34, marginTop: 10 }}>
        Resource tracking
      </h2>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p className="lead">
          We compare Richardson Mountains (migratory) and North Slope (resident) moose,
          Yukon–NWT, across two years, testing whether each population tracks moving resource
          waves: in spring, the <strong>green wave</strong> of emerging vegetation; in autumn,
          the <strong>frost wave</strong> governing residual forage. The patterns differ by
          <em> migration strategy</em>.
        </p>
      </div>

      {/* THE TWO POPULATIONS */}
      <h3 className="bv-subhead">The two populations</h3>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p>
          A typical Richardson Mountains moose migrates ~80–125 km between seasonal ranges;
          North Slope moose are typically residents. Whether an animal relocates shapes how
          its habitat use is interpreted.
        </p>
      </div>
      <div className="ms-maps" style={{ marginTop: 18 }}>
        <figure>
          <img src={GW_FIG_DIR + 'richardson-tracks.gif'} alt="Richardson Mountains moose spring tracks animated over terrain" loading="lazy" />
          <figcaption><b>Richardson Mountains</b> · migratory · spring 2023</figcaption>
        </figure>
        <figure>
          <img src={GW_FIG_DIR + 'north-slope-tracks.gif'} alt="North Slope resident moose spring tracks animated over terrain" loading="lazy" />
          <figcaption><b>North Slope</b> · resident · spring 2023</figcaption>
        </figure>
      </div>
      <div className="bv-embed-cap" style={{ marginTop: 10 }}>
        <span>GPS tracks animated over the season. The migratory herd sweeps across the
        Richardson range; the resident herd stays put on the Slope.</span>
      </div>

      {/* SPRING */}
      <div className="bv-season-h" style={{ marginTop: 44 }}>
        <h2>Spring — the green wave</h2>
      </div>
      <div className="bv-prose" style={{ maxWidth: '68ch', marginTop: 14 }}>
        <p>
          During green-up, Richardson Mountains moose encounter a <strong>higher
          instantaneous green-up rate (IRG)</strong> at the locations they use than North
          Slope moose do. Per-animal means separate between the populations. (IRG is the first
          derivative of the NDVI curve, indexing the leading edge of green-up.)
        </p>
      </div>
      <MsFig src="spring-exposure-selection.png" fig="Fig. 2"
        alt="Two panels: per-animal mean IRG at used points, and step-scale IRG selection coefficient">
        <strong>Exposure differs; step-scale selection does not.</strong> Panel A — Richardson
        moose use locations with higher mean green-up rate. Panel B — the step-scale IRG
        selection coefficient sits at or just below neutral for both populations.
      </MsFig>

      <h3 className="bv-subhead">Selection is neutral at the step scale</h3>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p>
          At the <strong>movement-step scale</strong>, neither population selected for
          green-up rate — the IRG coefficient sits at or just below neutral for both. The
          exposure gap in Panel A is therefore not produced by moose choosing higher-IRG
          steps; it reflects the <em>geography of the route</em>, with Richardson moose moving
          through more productive, faster-greening terrain between ranges. The covariate that
          drives movement in both populations is <strong>willow</strong>.
        </p>
      </div>
      <MsFig src="spring-issf.png" fig="Fig. 3" maxWidth={600}
        alt="Integrated step-selection forest plot for spring, by forage type and population">
        <strong>Spring step-selection.</strong> Relative selection strength exp(β) by forage
        type. Willow and forb are selected by both populations; IRG (green-up) falls on the
        neutral line.
      </MsFig>

      <h3 className="bv-subhead">Position on the green-up curve</h3>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p>
          Referenced to each location&rsquo;s own green-up curve, Richardson moose concentrate
          ahead of the peak, on the rising limb; North Slope moose sit further back. The
          left-shift is consistent with use of the high-quality leading edge, but given the
          neutral step-scale selection it is more consistent with the migration route than
          with active selection.
        </p>
      </div>
      <MsFig src="spring-surfing.png" fig="Fig. 4" maxWidth={540}
        alt="Density of days from peak green-up at used locations, by population">
        <strong>Days from peak green-up.</strong> Zero marks the peak; negative is ahead of
        it. Richardson (teal) is shifted onto the rising limb relative to North Slope (salmon).
      </MsFig>

      {/* FALL */}
      <div className="bv-season-h" style={{ marginTop: 44 }}>
        <h2>Fall — the frost wave</h2>
      </div>
      <div className="bv-prose" style={{ maxWidth: '68ch', marginTop: 14 }}>
        <p>
          In autumn, senescence and advancing snow reshape forage distribution. We measured
          residual forage as NDVI level relative to end-of-season — a state (how much green
          remains), not a rate.
        </p>
      </div>

      <h3 className="bv-subhead">Exposure is similar, but selection diverges</h3>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p>
          The spring pattern inverts. The two populations encounter similar mean residual
          forage (Panel A — the means nearly coincide), but at the step scale they select in
          <strong> opposite directions</strong> (Panel B): Richardson moose select locations
          retaining green forage (β = +0.10, <em>p</em> = 0.001); North Slope moose use more
          senescent areas than expected (β = −0.17, <em>p</em> = 0.005). The migrants can
          relocate to track residual forage; the residents, confined to a fixed range, cannot.
        </p>
      </div>
      <MsFig src="autumn-exposure-selection.png" fig="Fig. 5"
        alt="Two panels: mean residual forage at used points, and residual-forage selection coefficient">
        <strong>Similar exposure, opposite choice.</strong> Panel A — population means nearly
        coincide. Panel B — Richardson selects residual forage (+); North Slope uses senescing
        areas (−).
      </MsFig>

      <h3 className="bv-subhead">The full fall picture</h3>
      <div className="bv-prose" style={{ maxWidth: '68ch' }}>
        <p>
          Willow and forb dominate selection in both populations, as in spring. Residual
          forage is what separates them. Snow and frost effects are weak and stay provisional:
          the current snow layer is coarse (3 km ERA5) and awaits a finer 240 m SnowModel
          product.
        </p>
      </div>
      <MsFig src="autumn-issf.png" fig="Fig. 6" maxWidth={600}
        alt="Integrated step-selection forest plot for autumn, by covariate and population">
        <strong>Autumn step-selection.</strong> Willow and forb are selected by both
        populations; residual forage is the covariate on which migrants and residents diverge.
      </MsFig>

      {/* THE COMPARISON */}
      <div className="bv-season-h" style={{ marginTop: 44 }}>
        <h2>The comparison</h2>
      </div>
      <table className="ms-compare" style={{ marginTop: 18 }}>
        <thead>
          <tr>
            <th></th>
            <th>Spring · green wave</th>
            <th>Fall · frost wave</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Exposure</th>
            <td><strong className="green">Differs</strong> — Richardson higher</td>
            <td><strong>Similar</strong> — both populations alike</td>
          </tr>
          <tr>
            <th>Selection</th>
            <td><strong>Neutral</strong> — no step-scale IRG selection</td>
            <td><strong className="rust">Differs</strong> — migrants +, residents −</td>
          </tr>
          <tr className="meaning">
            <th>What it means</th>
            <td>The difference is <em>availability</em></td>
            <td>The difference is <em>behaviour</em></td>
          </tr>
        </tbody>
      </table>
      <div className="bv-prose" style={{ maxWidth: '68ch', marginTop: 18 }}>
        <p>
          In spring, migration coincides with phenology so that Richardson moose occupy a
          greener landscape without selecting for it at the step scale. In autumn, the
          migratory strategy allows active selection of retained forage that residents,
          confined to a fixed range, cannot reach.
        </p>
      </div>

      {/* DATA SOURCE */}
      <div className="ms-datanote" style={{ margin: '38px 0 0' }}>
        <span className="small-cap">Data &amp; acknowledgements</span>
        GPS collar data are from the <b>Yukon–NWT moose &amp; wolves study</b> (Government of
        Yukon; PI Mike Suitor). With thanks to Environment Yukon, McGill University, WMAC-NS,
        the Inuvialuit Game Council, the Gwich&rsquo;in Renewable Resources Board, Vuntut
        Gwitchin First Nation, and the Aklavik Hunters &amp; Trappers Committee.
      </div>
    </section>);
}

Object.assign(window, { MooseGreenWave });
