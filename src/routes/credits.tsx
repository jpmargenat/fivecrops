import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Credits — Flowing Cartographies / Meandering L.A." },
      {
        name: "description",
        content: "Credits — Flowing Cartographies. Juan Pablo Margenat, UCLA/REMAP 2026.",
      },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <div className="landing">
      <header className="landing-header" style={{ paddingBottom: "40px" }}>
        <p className="landing-meta" style={{ marginBottom: "8px" }}>
          <a href="/" style={{ color: "inherit", opacity: 0.45, textDecoration: "none", letterSpacing: "0.15em", fontSize: "0.72rem" }}>
            ← MEANDERING L.A. / FLOWING CARTOGRAPHIES
          </a>
        </p>
        <h1 className="landing-title">CREDITS</h1>
      </header>

      <section className="section">

        <div className="credits-block">
          <div className="credits-name"><strong>Juan Pablo Margenat</strong></div>
          <div className="credits-role">
            Architect &amp; Professor, Universidad de Buenos Aires
            <br />
            Visiting Scholar, UCLA/REMAP 2026
            <br />
            Home institution: <strong>cheLA</strong> — Centro Heurístico Experimental Latinoamericano —{" "}
            <a href="https://chela.org.ar" target="_blank" rel="noreferrer">chela.org.ar</a>
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
            <a href="https://remap.ucla.edu" target="_blank" rel="noreferrer">remap.ucla.edu</a>
            <br />
            Metabolic Studio
          </div>
        </div>

        <div className="credits-block">
          <div className="credits-name">Funding</div>
          <div className="credits-role">
            <strong>Fundación Williams</strong>
            <br />
            <span style={{ fontStyle: "italic", opacity: 0.7 }}>
              Esta investigación fue realizada mediante un subsidio de la Fundación Williams
            </span>
          </div>
        </div>

      </section>

      <footer className="landing-footer">
        Flowing Cartographies 2026 — CHELA / UCLA REMAP / PedaLúdico / Fundación Williams
      </footer>
    </div>
  );
}
