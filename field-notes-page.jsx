// Field Notes — Logan McLeod
// Live iNaturalist observations + Xeno-Canto recordings + photo grid.
// Site-styled (Source Serif 4 / JetBrains Mono / Caveat) — uses BvHeader from beaver-variants.jsx.

const FN_XC_KEY = '1f93e81aef4248db28e6c4047dfecdce59b8dfbd';
const FN_INAT_USER = 'lj_mcleod';
const FN_XC_USER = 'Logan McLeod';

function FnHero() {
  return (
    <div style={{ marginTop: 24 }}>
      <div className="bv-meta">
        <span className="chip"><span className="dot"></span>Field Notes</span>
        <span>PHOTOS</span>
        <span>OBSERVATIONS</span>
        <span>RECORDINGS</span>
      </div>
    </div>);

}

function INatGrid() {
  const [obs, setObs] = React.useState([]);
  const [status, setStatus] = React.useState('loading…');
  const [total, setTotal] = React.useState(0);
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    const url = `https://api.inaturalist.org/v1/observations?user_login=${encodeURIComponent(FN_INAT_USER)}&per_page=12&order_by=observed_on&photos=true`;
    fetch(url).
    then((r) => {if (!r.ok) throw new Error('HTTP ' + r.status);return r.json();}).
    then((j) => {
      const list = (j.results || []).filter((o) => o.photos && o.photos.length);
      setObs(list);
      setTotal(j.total_results || list.length);
      setStatus(`${j.total_results || list.length} total · showing ${list.length}`);
    }).
    catch((e) => {setErr(true);setStatus('iNat error: ' + e.message);});
  }, []);

  return (
    <section style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="small-cap">iNaturalist · recent observations</span>
        <a href={`https://www.inaturalist.org/people/${FN_INAT_USER}`} target="_blank" rel="noopener"
        className="mono" style={{ fontSize: 11, color: 'var(--accent, #2f7d4f)' }}>
          @{FN_INAT_USER} on iNat ↗
        </a>
      </div>
      <div className="mono" style={{ fontSize: 11, color: err ? '#b84a2a' : 'var(--sub)', marginBottom: 10 }}>{status}</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 6,
        border: '1.5px solid var(--ink)',
        background: 'var(--paper, #fff)',
        padding: 6
      }}>
        {obs.length === 0 && !err && Array.from({ length: 12 }).map((_, i) =>
        <div key={i} style={{ aspectRatio: '1', background: 'var(--hatch, #e6dcc6)' }} />
        )}
        {obs.slice(0, 12).map((o) => {
          const photo = o.photos?.[0];
          const sp = o.taxon && (o.taxon.preferred_common_name || o.taxon.name) || 'unknown';
          const place = o.place_guess || '';
          const date = o.observed_on_details ?
          `${o.observed_on_details.year}-${String(o.observed_on_details.month).padStart(2, '0')}-${String(o.observed_on_details.day).padStart(2, '0')}` :
          '';
          const raw = photo?.url || '';
          const img = raw.replace(/\/square\.(jpg|jpeg|png)/i, '/medium.$1');
          return (
            <a key={o.id}
            href={`https://www.inaturalist.org/observations/${o.id}`}
            target="_blank" rel="noopener"
            style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--hatch, #e6dcc6)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src={img}
              onError={(e) => {if (raw && e.target.src !== raw) e.target.src = raw;}}
              alt={sp}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div className="fn-cap" style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(26,26,26,.92), rgba(26,26,26,0))',
                color: '#fff', padding: '18px 8px 6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, lineHeight: 1.3
              }}>
                <div style={{ fontWeight: 500 }}>{sp}</div>
                <div style={{ opacity: 0.75 }}>{date}{place ? ` · ${place.split(',')[0]}` : ''}</div>
              </div>
            </a>);

        })}
      </div>
    </section>);

}

function XcStrip() {
  const [recs, setRecs] = React.useState([]);
  const [status, setStatus] = React.useState('loading…');
  const [playing, setPlaying] = React.useState(null);
  const [err, setErr] = React.useState(false);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    const q = `rec:"${FN_XC_USER}"`;
    const url = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(q)}&key=${FN_XC_KEY}`;
    fetch(url).
    then((r) => {if (!r.ok) throw new Error('HTTP ' + r.status);return r.json();}).
    then((j) => {
      const all = (j.recordings || []).slice().sort((a, b) =>
      (b.uploaded || b.date || '').localeCompare(a.uploaded || a.date || ''));
      const sliced = all.slice(0, 6);
      setRecs(sliced);
      setStatus(`${j.numRecordings || sliced.length} total · showing ${sliced.length} most recent`);
    }).
    catch((e) => {setErr(true);setStatus('XC error: ' + e.message);});
  }, []);

  const toggle = (rec) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing === rec.id) {audio.pause();setPlaying(null);return;}
    audio.src = rec.file || '';
    audio.play().then(() => setPlaying(rec.id)).catch(() => setPlaying(null));
    audio.onended = () => setPlaying(null);
  };

  const contributorUrl = (() => {
    const sonoUrl = recs[0]?.sono?.small || '';
    const m = sonoUrl.match(/spectrograms\/([A-Z]+)\//);
    return m ? `https://xeno-canto.org/contributor/${m[1]}` : 'https://xeno-canto.org/';
  })();

  return (
    <section style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="small-cap">Xeno-Canto · recent recordings</span>
        <a href={contributorUrl} target="_blank" rel="noopener"
        className="mono" style={{ fontSize: 11, color: 'var(--accent, #2f7d4f)' }}>
          {FN_XC_USER} on XC ↗
        </a>
      </div>
      <div className="mono" style={{ fontSize: 11, color: err ? '#b84a2a' : 'var(--sub)', marginBottom: 10 }}>{status} · click to play</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        border: '1.5px solid var(--ink)',
        background: '#1a1a1a',
        padding: 6
      }}>
        {recs.length === 0 && !err && Array.from({ length: 6 }).map((_, i) =>
        <div key={i} style={{ height: 110, background: '#2a2a2a' }} />
        )}
        {recs.map((rec) => {
          const isPlaying = playing === rec.id;
          const sp = `${rec.gen} ${rec.sp}`;
          const place = (rec.loc || rec.cnt || '').slice(0, 38);
          const dur = rec.length || '';
          const spec = rec.sono && (rec.sono.med || rec.sono.small) || '';
          return (
            <div key={rec.id}
            onClick={() => toggle(rec)}
            style={{ position: 'relative', height: 110, overflow: 'hidden', background: '#1a1a1a', cursor: 'pointer' }}>
              {spec &&
              <img src={spec} alt="" loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: isPlaying ?
                'hue-rotate(80deg) saturate(1.2) brightness(.95)' :
                'hue-rotate(60deg) saturate(.6) brightness(.85)'
              }} />

              }
              <div style={{
                position: 'absolute', top: 8, left: 8,
                width: 22, height: 22, borderRadius: 99,
                background: isPlaying ? 'var(--accent, #2f7d4f)' : 'rgba(255,255,255,.94)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform .15s'
              }}>
                {isPlaying ?
                <div style={{ width: 8, height: 10, display: 'flex', gap: 2 }}>
                    <span style={{ width: 2, height: 10, background: '#fff' }} />
                    <span style={{ width: 2, height: 10, background: '#fff' }} />
                  </div> :

                <div style={{
                  width: 0, height: 0,
                  borderLeft: '8px solid #1a1a1a',
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  marginLeft: 2
                }} />
                }
              </div>
              <div className="mono" style={{
                position: 'absolute', top: 8, right: 8,
                fontSize: 10, color: '#fff',
                background: 'rgba(0,0,0,.55)', padding: '1px 5px'
              }}>{dur}</div>
              <div className="mono" style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                background: 'rgba(26,26,26,.9)', color: '#fff',
                padding: '4px 8px', fontSize: 10, lineHeight: 1.35
              }}>
                <span style={{ fontStyle: 'italic' }}>{sp}</span>
                <span style={{ opacity: 0.65, marginLeft: 6 }}>· {place}</span>
              </div>
            </div>);

        })}
      </div>
      <audio ref={audioRef} preload="none" />
    </section>);

}

/* Local photo log — small set of personal field photos. Edit FN_PHOTOS to add/remove. */
const FN_PHOTOS = /*EDITMODE-BEGIN*/[
{ src: "images/shingle-point-stream.jpg", cap: "Tundra stream", where: "Rapid Creek", when: "July 2024" },
{ src: "images/thaw-slump.jpg", cap: "Retrogressive thaw slump", where: "Near Noell Lake, NWT", when: "Aug 2024" },
{ src: "images/logan-portrait.jpg", cap: "Richea scoparia", where: "Cradle Mountain", when: "Dec 2024" }]
/*EDITMODE-END*/;

function PhotoLog() {
  return (
    <section style={{ marginTop: 48, marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="small-cap">Photo log</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--sub)' }}>
          {'\n'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {FN_PHOTOS.map((p, i) =>
        <figure key={i} style={{ margin: 0, border: '1.25px solid var(--ink)', background: 'var(--paper, #fff)' }}>
            <div style={{
            aspectRatio: '4/3',
            background: `repeating-linear-gradient(45deg, #ece2cb, #ece2cb 14px, #e6dcc6 14px, #e6dcc6 28px)`,
            overflow: 'hidden'
          }}>
              <img src={p.src} alt={p.cap}
            onError={(e) => {e.target.style.display = 'none';}}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <figcaption style={{
            padding: '8px 12px 10px',
            borderTop: '1px solid var(--hatch, #e6dcc6)',
            fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.4
          }}>
              {p.cap}
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 3, letterSpacing: 0.4 }}>
                {p.where} · {p.when}
              </div>
            </figcaption>
          </figure>
        )}
      </div>
    </section>);

}

function FieldNotesPage() {
  return (
    <div className="bv" style={{ minHeight: 1400 }}>
      <BvHeader activeTab="fieldnotes" />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>
        <FnHero />

        <hr className="bv-divider" />
        <PhotoLog />

        <hr className="bv-divider" />
        <INatGrid />

        <hr className="bv-divider" />
        <XcStrip />

        <hr className="bv-divider" />
        <div className="bv-foot">
          <div>
            <h3>About this page</h3>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--sub)' }}>
              Observations come from <a href={`https://www.inaturalist.org/people/${FN_INAT_USER}`} target="_blank" rel="noopener">iNaturalist</a> and recordings from <a href="https://xeno-canto.org/" target="_blank" rel="noopener">Xeno-Canto</a> — the same datasets that show up cited in published work elsewhere on this site.
              The photo log is curated separately and lives in the page source.
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

Object.assign(window, { FieldNotesPage });