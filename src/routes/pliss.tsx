import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pliss")({
  head: () => ({
    meta: [
      { title: "PLISS — PedaLudic Interpretive Situationist Spheres" },
      {
        name: "description",
        content:
          "PLISS is the live transmission and archive platform for situationist pedaludic experiences. Spherical captures, environmental data and collective dialogue assembled in real time.",
      },
    ],
  }),
  component: PlissPage,
});

function PlissPage() {
  return (
    <div className="landing">
      <header className="landing-header" style={{ paddingBottom: "48px" }}>
        <p className="landing-meta" style={{ marginBottom: "8px" }}>
          <a href="/" style={{ color: "inherit", opacity: 0.45, textDecoration: "none", letterSpacing: "0.15em", fontSize: "0.72rem" }}>
            ← MEANDERING L.A. / FLOWING CARTOGRAPHIES
          </a>
        </p>
        <h1 className="landing-title">PLISS</h1>
        <p className="landing-subtitle" style={{ maxWidth: "580px", margin: "12px auto 0" }}>
          PedaLudic Interpretive Situationist Spheres
        </p>
        <p className="landing-meta" style={{ marginTop: "16px", opacity: 0.45 }}>
          Live Transmission &amp; Archive Platform — Flowing Cartographies / UCLA REMAP 2026
        </p>
      </header>

      <section className="section" style={{ maxWidth: "640px", margin: "0 auto 64px" }}>
        <div className="section-body" style={{ textAlign: "justify", textAlignLast: "left" } as React.CSSProperties}>
          <p>
            PLISS is the live transmission and archive platform designed to accompany S.A.L.I. — a collective pedaludic drift crossing the province of Buenos Aires from north to south, always turning left, during September 2026.
          </p>
          <p>
            The platform integrates spherical video captures, real-time environmental data — wind, elevation, heading — and a continuous stream of collective messaging between riders and remote participants. An artificial interpretation system assembles these fragments into navigable, multimodal cartographies: <em>Drift Fragments</em> that can be re-explored after the event.
          </p>
          <p>
            PLISS is not a documentation tool. It is an interpretive instrument — one that listens to bodies in movement and translates their situated experience into shared, transmissible form.
          </p>
          <p style={{ opacity: 0.5, fontSize: "0.85rem", marginTop: "24px" }}>
            Platform under development. S.A.L.I. departs September 2026, Buenos Aires → Bahía Blanca.
          </p>
        </div>

        <div className="section-links" style={{ marginTop: "40px" }}>
          <a
            href="/plissT.html"
            className="gallery-link"
            style={{ display: "block", fontWeight: 500 }}
          >
            → PLISS Tríptico — live tripartite display
          </a>
          <a
            href="/plissE.html"
            className="gallery-link"
            style={{ display: "block", fontWeight: 500 }}
          >
            → PLISS Esfera — interpretive sphere
          </a>
          <a href="/system" className="gallery-link" style={{ display: "block" }}>
            → System — how the interpretive platform works
          </a>
          <a
            href="https://wiki.chela.org.ar/flowingcartographies"
            target="_blank"
            rel="noreferrer"
            className="gallery-link"
            style={{ display: "block" }}
          >
            → PedaLúdico Research Wiki
          </a>
          <a
            href="https://chela.org.ar"
            target="_blank"
            rel="noreferrer"
            className="gallery-link"
            style={{ display: "block" }}
          >
            → cheLA
          </a>
          <a
            href="https://remap.ucla.edu"
            target="_blank"
            rel="noreferrer"
            className="gallery-link"
            style={{ display: "block" }}
          >
            → REMAP UCLA
          </a>
        </div>
      </section>

      <footer className="landing-footer">
        PLISS 2026 — CHELA / UCLA REMAP / PedaLúdico / Fundación Williams
      </footer>
    </div>
  );
}
