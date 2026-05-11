// Publications page for Logan McLeod — dense single-line list.

const PUB_AUTHOR_SELF = /\bMcLeod,?\s*LJT\b/;

function PubAuthors({ authors }) {
  const parts = authors.split(PUB_AUTHOR_SELF);
  if (parts.length === 1) return <span>{authors}</span>;
  const match = authors.match(PUB_AUTHOR_SELF);
  const selfStr = match ? match[0] : 'McLeod LJT';
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(<span key={`p${i}`}>{parts[i]}</span>);
    if (i < parts.length - 1) {
      out.push(<strong key={`s${i}`} className="pub-self">{selfStr}</strong>);
    }
  }
  return <span>{out}</span>;
}

const PUBLICATIONS = [
  {
    status: 'published', year: 2025,
    authors: 'Darras K et al. (incl. McLeod LJT)',
    title: 'Worldwide Soundscapes: a synthesis of passive acoustic monitoring across realms',
    venue: 'Global Ecology and Biogeography',
    venueDetail: '34:e70021',
    doi: 'https://doi.org/10.1111/geb.70021',
    lead: false,
  },
  {
    status: 'published', year: 2025,
    authors: 'Beyer D, DeLancey ER, & McLeod LJT',
    title: 'Automating colon polyp classification in digital pathology by evaluation of a "machine learning as a service" AI model: algorithm development and validation study',
    venue: 'JMIR Formative Research',
    venueDetail: '9:e67457',
    doi: 'https://doi.org/10.2196/67457',
    lead: false,
  },
  {
    status: 'published', year: 2023,
    authors: 'Ware L, Mahon CL, McLeod LJT, & Jetté J-F',
    title: 'Artificial intelligence (BirdNET) supplements manual methods to maximize bird species richness from acoustic data sets generated from regional monitoring',
    venue: 'Canadian Journal of Zoology',
    venueDetail: '101(12):1031–1051',
    doi: 'https://doi.org/10.1139/cjz-2023-0044',
    lead: false,
  },
  {
    status: 'report', year: 2022,
    authors: 'COSEWIC',
    title: 'COSEWIC assessment and status report on the Gray-headed Chickadee (Poecile cinctus) in Canada',
    venue: 'Committee on the Status of Endangered Wildlife in Canada, Ottawa',
    venueDetail: 'Prepared by Mahon CL & McLeod LJT. May 2024',
    doi: 'https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/gray-headed-chickadee-2024.html',
    lead: false,
  },
  {
    status: 'published', year: 2022,
    authors: 'McLeod LJT, DeLancey ER, & Bayne EM',
    title: 'Spatially explicit abundance modelling of a highly specialized wetland bird using Sentinel-1 and Sentinel-2',
    venue: 'Canadian Journal of Remote Sensing',
    venueDetail: '48(1)',
    doi: 'https://doi.org/10.1080/07038992.2021.2014797',
    lead: true,
  },
  {
    status: 'published', year: 2021,
    authors: 'McLeod LJT, Haché S, Pankratz RF, & Bayne EM',
    title: 'High-density Yellow Rail (Coturnicops noveboracensis) population beyond purported range limits in the Northwest Territories, Canada',
    venue: 'Waterbirds',
    venueDetail: '44(2):175–184',
    doi: 'https://doi.org/10.1675/063.044.0204',
    lead: true,
  },
  {
    status: 'published', year: 2021,
    authors: 'DeLancey ER, Brisco B, McLeod LJT, Hedley RW, Bayne EM, Murnaghan K, Gregory F, & Kariyeva J',
    title: 'Modelling, characterizing, and monitoring boreal forest wetland bird habitat with RADARSAT-2 and Landsat-8 data',
    venue: 'Water',
    venueDetail: '13(17):2327',
    doi: 'https://doi.org/10.3390/w13172327',
    lead: false,
  },
  {
    status: 'published', year: 2020,
    authors: 'Van Wilgenburg SL, Mahon CL, Campbell G, McLeod LJT, et al.',
    title: 'A cost efficient spatially balanced hierarchical sampling design for monitoring boreal birds incorporating access costs and habitat stratification',
    venue: 'PLoS ONE',
    venueDetail: '15(6):e0234494',
    doi: 'https://doi.org/10.1371/journal.pone.0234494',
    lead: false,
  },
  {
    status: 'published', year: 2020,
    authors: 'Hedley RW, McLeod LJT, Yip DA, Farr D, Knaga P, Drake KL, & Bayne EM',
    title: 'Modeling the occurrence of the Yellow Rail (Coturnicops noveboracensis) in the context of ongoing resource development in the oil sands region of Alberta',
    venue: 'Avian Conservation and Ecology',
    venueDetail: '15(1):10',
    doi: 'https://doi.org/10.5751/ACE-01538-150110',
    lead: false,
  },
];

function PubRow({ pub }) {
  const cls = `pub-row ${pub.lead ? 'lead' : ''} ${pub.status === 'report' ? 'report' : ''}`;
  const TitleEl = pub.doi ? 'a' : 'span';
  const titleProps = pub.doi ? { href: pub.doi, target: '_blank', rel: 'noopener' } : {};
  return (
    <div className={cls}>
      <span className="pub-row-year mono">
        {pub.year}
      </span>
      <span className="pub-row-body">
        <span className="pub-row-authors"><PubAuthors authors={pub.authors} />.</span>{' '}
        <TitleEl className="pub-row-title" {...titleProps}>{pub.title}.</TitleEl>{' '}
        <em className="pub-row-venue">{pub.venue}</em>
        {pub.venueDetail ? <span className="pub-row-detail"> {pub.venueDetail}.</span> : '.'}
      </span>
    </div>
  );
}

function PublicationsPage() {
  const byYear = (a, b) => (b.year || 0) - (a.year || 0);
  const lead = PUBLICATIONS.filter(p => p.lead && p.status !== 'report').sort(byYear);
  const coauthored = PUBLICATIONS.filter(p => !p.lead && p.status !== 'report').sort(byYear);
  const reports = PUBLICATIONS.filter(p => p.status === 'report').sort(byYear);

  return (
    <div className="bv pub-page">
      <BvHeader activeTab="publications" />
      <main className="pub-main pub-main-tight">

        <h1 className="pub-title-h pub-title-tight">Publications</h1>

        <h2 className="pub-section-label mono">Lead-authored</h2>
        <div className="pub-list pub-list-tight">
          {lead.map((p, i) => <PubRow key={`l${i}`} pub={p} />)}
        </div>

        <h2 className="pub-section-label mono">Co-authored</h2>
        <div className="pub-list pub-list-tight">
          {coauthored.map((p, i) => <PubRow key={`c${i}`} pub={p} />)}
        </div>

        {reports.length > 0 && <>
          <h2 className="pub-section-label mono">Reports</h2>
          <div className="pub-list pub-list-tight">
            {reports.map((p, i) => <PubRow key={`r${i}`} pub={p} />)}
          </div>
        </>}

        <div className="pub-foot mono pub-foot-tight">
          <span className="pub-foot-label">Profiles</span>
          <a href="https://scholar.google.com/citations?user=zGTNsyYAAAAJ&hl=en" target="_blank" rel="noopener">Google Scholar</a>
          <a href="https://orcid.org/0000-0003-4528-1523" target="_blank" rel="noopener">ORCID</a>
          <a href="https://www.inaturalist.org/people/lj_mcleod" target="_blank" rel="noopener">iNaturalist</a>
          <a href="https://xeno-canto.org/contributor/JRPEHMSIPP" target="_blank" rel="noopener">Xeno-Canto</a>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { PublicationsPage });
