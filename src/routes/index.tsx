import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meandering L.A. — Flowing Cartographies" },
      {
        name: "description",
        content:
          "Archive, analysis and visualization of situationist and pedaludic practices in urban and non-urban territories. Visiting Scholar Residency UCLA/REMAP 2026.",
      },
      { property: "og:title", content: "Meandering L.A. — Flowing Cartographies" },
      {
        property: "og:description",
        content: "Flowing Cartographies — UCLA/REMAP 2026. Juan Pablo Margenat.",
      },
    ],
  }),
  component: FlowingCartographies,
});

const SECTIONS = [
  {
    num: "01",
    slug: "/pliss",
    title: "PLISS",
    subtitle: "PedaLudic Interpretive Situationist Spheres",
    description: "The live transmission and archive platform for situationist pedaludic experiences. Spherical captures, environmental data and collective dialogue assembled in real time.",
    status: "coming",
  },
  {
    num: "02",
    slug: "/fivecrops",
    title: "FiveCrops",
    subtitle: "Cartographic Laboratory",
    description: "A rhizomatic detour within the research. Five urban extractions from a cycling map of Los Angeles — where interpretive tools are built, tested and iterated in small portions of territory.",
    status: "active",
  },
  {
    num: "03",
    slug: "/tools",
    title: "Tools",
    subtitle: "Knowledge built to share",
    description: "Instruments, scripts and methodologies developed during the research — open and available for other practices.",
    status: "active",
  },
  {
    num: "04",
    slug: "/credits",
    title: "Credits",
    subtitle: "",
    description: "",
    status: "active",
  },
];

function FlowingCartographies() {
  return (
    <div className="landing">
      <header className="landing-header" style={{ paddingBottom: "48px" }}>
        <p className="landing-meta" style={{ marginBottom: "4px", letterSpacing: "0.3em", opacity: 0.35 }}>
          MEANDERING L.A.
        </p>
        <h1 className="landing-title" style={{ fontSize: "clamp(1.8rem, 6vw, 4rem)", letterSpacing: "0.12em" }}>
          FLOWING CARTOGRAPHIES
        </h1>
        <p className="landing-subtitle" style={{ maxWidth: "580px", margin: "16px auto 0" }}>
          Archive, analysis and visualization of situationist and pedaludic practices in urban and non-urban territories
        </p>
        <p className="landing-meta" style={{ marginTop: "24px", lineHeight: "2", opacity: 0.5 }}>
          Juan Pablo Margenat — Visiting Scholar UCLA/REMAP 2026
          <br />
          Research Director: Fabián Wagmister &nbsp;·&nbsp; REMAP Development: Jeff Burke
          <br />
          cheLA &nbsp;·&nbsp; Fundación Williams
        </p>
      </header>

      {/* INTRO */}
      <section className="section" style={{ maxWidth: "640px", margin: "0 auto 64px" }}>
        <div className="section-body" style={{ textAlign: "justify", textAlignLast: "left" }}>
          <p>
            There is a moment when cycling becomes more than a mechanical movement.
            The body finds its rhythm, the territory begins to speak in ways that only slow and sustained movement allows,
            and something we decided to call knowledge — embodied, situated, unrepeatable — starts to take shape.
          </p>
          <p>
            Flowing Cartographies investigates that moment: how to record it, express it, and above all how to expand it.
          </p>
          <p style={{ opacity: 0.55, fontSize: "0.88rem", marginTop: "24px" }}>
            Developed within a Visiting Scholar residency at UCLA/REMAP, in dialogue with Professors Fabián Wagmister and Jeff Burke,
            building on the corpus of experiences generated during <em>Flujos y Diacronías</em> (2025).
            Its practical horizon is S.A.L.I. — a collective pedaludic drift crossing the province of Buenos Aires, September 2026.
          </p>
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="section">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px", maxWidth: "960px", margin: "0 auto" }}>
          {SECTIONS.map((s) => (
            <a
              key={s.slug}
              href={s.status === "coming" ? undefined : s.slug}
              style={{
                display: "block",
                padding: "32px 28px",
                background: "rgba(255,255,255,0.03)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
                color: "inherit",
                cursor: s.status === "coming" ? "default" : "pointer",
                opacity: s.status === "coming" ? 0.45 : 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (s.status !== "coming") (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", opacity: 0.35 }}>
                  {s.num}
                </span>
                {s.status === "coming" && (
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", opacity: 0.4 }}>
                    COMING SOON
                  </span>
                )}
                {s.status === "active" && s.description && (
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", opacity: 0.4 }}>
                    →
                  </span>
                )}
              </div>
              <h2 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(1rem, 2.5vw, 1.3rem)", letterSpacing: "0.15em", fontWeight: "normal", marginBottom: "6px" }}>
                {s.title}
              </h2>
              {s.subtitle && (
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", opacity: 0.5, marginBottom: "16px" }}>
                  {s.subtitle}
                </p>
              )}
              {s.description && (
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.72rem", lineHeight: "1.7", opacity: 0.6 }}>
                  {s.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>

      <footer className="landing-footer" style={{ marginTop: "80px" }}>
        Flowing Cartographies 2026 — CHELA / UCLA REMAP / PedaLúdico / Fundación Williams
      </footer>
    </div>
  );
}
