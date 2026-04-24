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
          "Five urban extractions from an accumulated cycling map of Los Angeles. PedalúDico / UCLA REMAP 2026.",
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

// Bounding box for LA region projection
const BOUNDS = { minLat: 33.95, maxLat: 34.18, minLon: -118.50, maxLon: -118.15 };

function project(lat: number, lon: number) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  // invert y because lat increases northward
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
        <p className="landing-meta">An experimental tool for S.A.L.I. — PedalúDico / UCLA REMAP 2026</p>
      </header>

      <div className="hero-map" aria-label="Schematic map of Los Angeles with five crop markers">
        <svg className="map-svg" viewBox="0 0 100 56" preserveAspectRatio="none">
          {/* Grid */}
          <g className="map-grid">
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={56} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 9.33} x2={100} y2={i * 9.33} />
            ))}
          </g>
          {/* Schematic coast / freeways */}
          <path
            className="map-coast"
            d="M 0 48 Q 12 44 22 46 T 42 50 T 70 52 T 100 50"
          />
          <g className="map-roads">
            <path d="M 5 30 Q 35 28 65 32 T 98 30" />
            <path d="M 20 5 Q 28 25 32 50" />
            <path d="M 60 8 Q 55 28 58 52" />
            <path d="M 0 18 Q 40 22 95 15" />
            <path d="M 78 5 Q 72 28 80 54" />
          </g>
        </svg>

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

      <section className="section">
        <h2 className="section-title">About FiveCrops</h2>
        <div className="section-body">
          <p>
            FiveCrops emerges from a daily practice of cycling Los Angeles. Over months of riding, a
            map built itself through movement — street by street, neighborhood by neighborhood. From
            this accumulated cartography, five areas of particular density were extracted: crops,
            like the Photoshop command — focused cuts into the urban fabric.
          </p>
          <p>
            Each crop visualizes all the times the cyclist passed through that zone, layered and
            animated. The accumulated paths reveal something invisible in everyday experience: the
            weight of presence, the rhythm of return, the texture of a neighborhood absorbed through
            the body on a bicycle.
          </p>
          <p>
            Sound responds to the data: elevation becomes frequency, speed shapes the filter, wind
            modulates the oscillator. The city speaks through its own physical parameters.
          </p>
          <p>
            FiveCrops is a tool-building exercise within the Interpretive Cartographies branch of
            PedalúDico, developed during a Visiting Scholar residency at UCLA/REMAP. It feeds into
            S.A.L.I. (Siempre a la Izquierda), a larger psicogeographic research project exploring
            situationist and pedalúdic practices across urban and non-urban territories.
          </p>
        </div>
        <div className="section-links">
          <a href="https://wiki.chela.org.ar/PedalúDico" target="_blank" rel="noreferrer">
            → PedalúDico Research Wiki
          </a>
          <a href="https://chela.org.ar" target="_blank" rel="noreferrer">
            → CHELA
          </a>
          <a href="https://remap.ucla.edu" target="_blank" rel="noreferrer">
            → REMAP UCLA
          </a>
        </div>
      </section>

      <section className="thumbs-section">
        <div className="crop-thumbs">
          {CROPS.map((c) =>
            c.active ? (
              <Link
                key={c.slug}
                to="/crop/$slug"
                params={{ slug: c.slug }}
                className="crop-thumb active"
              >
                <span className="thumb-num">{c.num}</span>
                <span className="thumb-name">{c.name}</span>
              </Link>
            ) : (
              <div key={c.slug} className="crop-thumb inactive">
                <span className="thumb-num">{c.num}</span>
                <span className="thumb-name">Coming Soon</span>
              </div>
            )
          )}
        </div>
        <Link to="/gallery" className="gallery-link">
          → Process Gallery — crops, GIFs &amp; reference images
        </Link>
      </section>

      <section className="section">

        <div className="credits-block">
          <div className="credits-name"><strong>Juan Pablo Margenat</strong></div>
          <div className="credits-role">
            Architect & Professor, Universidad de Buenos Aires
            <br />
            Visiting Scholar, UCLA/REMAP 2026
            <br />
            Home institution: <strong>CHELA</strong> — Centro Heurístico Experimental Latinoamericano —{" "}
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
            PedalúDico —{" "}
            <a href="https://wiki.chela.org.ar/PedalúDico" target="_blank" rel="noreferrer">
              wiki.chela.org.ar/PedalúDico
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
        FiveCrops 2026 — CHELA / UCLA REMAP / PedalúDico
      </footer>
    </div>
  );
}
