import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FiveCrops — Five urban extractions from a cycling map of Los Angeles" },
      {
        name: "description",
        content:
          "FiveCrops is an experimental tool for S.A.L.I., extracting five urban crops from a cycling map of Los Angeles built day by day through bodily experience.",
      },
      { property: "og:title", content: "FiveCrops — A cycling cartography of Los Angeles" },
      {
        property: "og:description",
        content:
          "Five urban extractions from an accumulated cycling map of Los Angeles. PedaLúdico / UCLA REMAP 2026.",
      },
    ],
  }),
  component: Landing,
});

type Crop = {
  slug: string;
  num: string;
  name: string;
  lat: number;
  lon: number;
  active: boolean;
};

const CROPS: Crop[] = [
  { slug: "lincoln-heights", num: "01", name: "Lincoln Heights", lat: 34.07, lon: -118.21, active: true },
  { slug: "west-hollywood", num: "02", name: "West Hollywood", lat: 34.09, lon: -118.36, active: false },
  { slug: "culver-city", num: "03", name: "Culver City", lat: 34.02, lon: -118.39, active: false },
  { slug: "downtown-la", num: "04", name: "Downtown LA", lat: 34.05, lon: -118.24, active: false },
  { slug: "silver-lake", num: "05", name: "Silver Lake", lat: 34.08, lon: -118.27, active: false },
];

const BOUNDS = { minLat: 33.95, maxLat: 34.18, minLon: -118.50, maxLon: -118.15 };

function project(lat: number, lon: number) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <h1 className="landing-title">FIVECROPS</h1>
        <p className="landing-subtitle">Five urban extractions from a cycling map of Los Angeles</p>
        <p className="landing-meta">An experimental tool for S.A.L.I. — PedaLúdico / UCLA REMAP 2026</p>
      </header>

      <div className="hero-map" aria-label="Cycling map of Los Angeles with five crop markers">
        <img
          src="/la-map.png"
          alt="Cycling map of Los Angeles"
          className="map-img"
        />
        {CROPS.map((c) => {
          const { x, y } = project(c.lat, c.lon);
          return (
            <div
              key={c.slug}
              className={`crop-marker ${c.active ? "active" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => {
                if (c.active) navigate({ to: "/crop/$slug", params: { slug: c.slug } });
              }}
              role={c.active ? "link" : undefined}
            >
              {!c.active && <span className="crop-tooltip">Coming Soon</span>}
              <span className="dot" />
              <span className="pulse" />
              <span className="crop-label">
                {c.num} · {c.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ✅ THUMBNAILS justo debajo del mapa */}
      <section className="section thumbs-section">
        <div className="crop-thumbs-grid">
          {CROPS.map((c, i) => {
            const imgSrc = `/t${i + 1}.png`;
            return c.active ? (
              <Link
                key={c.slug}
                to="/crop/$slug"
                params={{ slug: c.slug }}
                className="crop-thumb-card active"
              >
                <div className="crop-thumb-img-wrap">
                  <img src={imgSrc} alt={c.name} className="crop-thumb-img crop-thumb-img--active" />
                </div>
                <div className="crop-thumb-label">
                  <span className="crop-thumb-num">{c.num}</span>
                  <span className="crop-thumb-name">{c.name}</span>
                </div>
              </Link>
            ) : (
              <div key={c.slug} className="crop-thumb-card inactive">
                <div className="crop-thumb-img-wrap">
                  <img src={imgSrc} alt={c.name} className="crop-thumb-img crop-thumb-img--inactive" />
                  <div className="crop-thumb-soon">Coming Soon</div>
                </div>
                <div className="crop-thumb-label">
                  <span className="crop-thumb-num">{c.num}</span>
                  <span className="crop-thumb-name">{c.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/gallery" className="gallery-link">
          → Process Gallery — crops, GIFs &amp; reference images
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">ABOUT FIVECROPS</h2>
        <div className="section-body">
          <p>FiveCrops emerged from the daily practice of cycling through Los Angeles. After two months of pedaling, a map was built through movement: street by street, neighborhood by neighborhood. From this accumulated cartography, five areas of particular density were extracted: arbitrary yet precise cutouts in the urban fabric.</p>
          <p>Each cutout visualizes all the times I've passed through that area, superimposed and animated. The accumulated routes reveal something invisible in everyday experience: the weight of presence, the rhythm of the return, the texture of a neighborhood absorbed by the body on the bicycle.</p>
          <p>Sound responds to a possible representation of contextual data: elevation becomes audible frequency, and speed shapes that sound; the wind modulates the result. The city expresses itself through its own physical parameters.</p>
          <p>FiveCrops is an exercise in creating tools within the research branch on the idea of Interpretive Cartographies within PedaLúdico. This work was developed during a visiting researcher residency at UCLA/REMAP. It is integrated into S.A.L.I. (Always to the Left), a broader psychogeographical research project that explores situationist and pedaludic practices in urban and non-urban territories.</p>
        </div>
        <div className="section-links">
          <a href="https://wiki.chela.org.ar/flowingcartographies" target="_blank" rel="noreferrer">
            → PedaLúdico Research Wiki
          </a>
          <a href="https://chela.org.ar" target="_blank" rel="noreferrer">
            → CHELA
          </a>
          <a href="https://remap.ucla.edu" target="_blank" rel="noreferrer">
            → REMAP UCLA
          </a>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">CREDITS</h2>

        <div className="credits-block">
          <div className="credits-name"><strong>Juan Pablo Margenat</strong></div>
          <div className="credits-role">
            Architect & Professor, Universidad de Buenos Aires
            <br />
            Visiting Scholar, UCLA/REMAP 2026
            <br />
            Home institution: <strong>cheLA</strong> — Centro Heurístico Experimental Latinoamericano —{" "}
            <a href="https://chela.org.ar" target="_blank" rel="noreferrer">
              chela.org.ar
            </a>
            <br />
            Funded by: <strong>Fundación Williams</strong>
          </div>
        </div>

        <div className="credits-block">
          <div className="credits-name">Research Director</div>
          <div className="credits-role"><strong>Fabián Wagmister</strong> — UCLA/REMAP</div>
        </div>

        <div className="credits-block">
          <div className="credits-name">REMAP Development</div>
          <div className="credits-role"><strong>Jeff Burke</strong> — UCLA/REMAP</div>
        </div>

        <div className="credits-block">
          <div className="credits-name">Academic context at UCLA</div>
          <div className="credits-role">
            Generative Art — <strong>Refik Anadol</strong>, Design Media Arts, UCLA
            <br />
            Production Practice in Theater with Emerging Technologies I — <strong>Jeff Burke</strong>
            <br />
            REMAP/UCLA — <strong>Jeff Burke</strong> &amp; <strong>Fabián Wagmister</strong>
          </div>
        </div>

        <div className="credits-block">
          <div className="credits-name">Research framework</div>
          <div className="credits-role">
            PedaLúdico —{" "}
            <a href="https://wiki.chela.org.ar/PedaLúdico" target="_blank" rel="noreferrer">
              wiki.chela.org.ar/PedaLúdico
            </a>
          </div>
        </div>

        <div className="credits-block">
          <div className="credits-name">Institutional support</div>
          <div className="credits-role">
            REMAP —{" "}
            <a href="https://remap.ucla.edu" target="_blank" rel="noreferrer">
              remap.ucla.edu
            </a>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        FiveCrops 2026 — CHELA / UCLA REMAP / PedaLúdico
      </footer>
    </div>
  );
}
