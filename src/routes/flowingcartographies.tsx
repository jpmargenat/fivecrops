import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/flowingcartographies")({
  head: () => ({
    meta: [
      { title: "Flowing Cartographies — Research Framework" },
      {
        name: "description",
        content:
          "Flowing Cartographies — theoretical and practice-based framework for analyzing and expressing situationist and pedaludic practices. UCLA/REMAP 2026.",
      },
    ],
  }),
  component: FlowingCartographiesPage,
});

function FlowingCartographiesPage() {
  return (
    <div className="landing">
      <header className="landing-header" style={{ paddingBottom: "40px" }}>
        <p className="landing-meta" style={{ marginBottom: "8px" }}>
          <a href="/" style={{ color: "inherit", opacity: 0.45, textDecoration: "none", letterSpacing: "0.15em", fontSize: "0.72rem" }}>
            ← MEANDERING L.A.
          </a>
        </p>
        <h1 className="landing-title" style={{ fontSize: "clamp(1.8rem, 6vw, 4rem)", letterSpacing: "0.12em" }}>
          FLOWING CARTOGRAPHIES
        </h1>
        <p className="landing-subtitle" style={{ maxWidth: "580px", margin: "12px auto 0" }}>
          Archive, analysis and visualization of situationist and pedaludic practices in urban and non-urban territories
        </p>
        <p className="landing-meta" style={{ marginTop: "16px", opacity: 0.5 }}>
          Juan Pablo Margenat — Visiting Scholar UCLA/REMAP 2026
          <br />
          Research Director: Fabián Wagmister · REMAP Development: Jeff Burke
          <br />
          cheLA · Fundación Williams
        </p>
      </header>

      {/* RESEARCH SUMMARY */}
      <section className="section">
        <h2 className="section-title">Research</h2>
        <div className="section-body" style={{ textAlign: "justify", textAlignLast: "left" }}>
          <p>
            This research develops a theoretical and practice-based framework and a digital platform for analyzing
            and expressing situationist and pedaludic practices in urban and non-urban territories.
            Drawing on the UCLA/REMAP <em>Flows and Diachronies</em> project as a primary case study, it investigates
            how embodied movement and drift can interrupt dominant psychogeographies and enable alternative forms
            of territorial understanding, engagement, and transformation.
          </p>
          <p>
            The work advances the long-standing PedaLúdico/UCLA collaboration and contributes prototype tools
            directly to Professor Wagmister's Engaged Media Production course.
          </p>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="section">
        <h2 className="section-title">Objectives</h2>
        <div className="section-body" style={{ textAlign: "justify", textAlignLast: "left" }}>
          <p>
            To develop a theoretical, referential, and practice-based framework — together with a digital platform —
            for archiving, analyzing, and expressing situationist and pedaludic practices in both urban and non-urban
            territories. Drawing on the experiences, situations, and data generated during <em>Flows and Diachronies</em> —
            directed by UCLA Professor Fabián Wagmister — the project uses this corpus as a primary case study for
            experimentation and conceptual advancement.
          </p>
          <p>
            To investigate how movement, drift, meandering, and embodied navigation can interrupt phenomenologically
            limiting psychogeographies and enable the emergence of alternative forms of territorial understanding,
            engagement, and transformation. This includes documenting pedaludic actions that weave situationist
            dérive-inspired methodologies with contemporary technocultural tools.
          </p>
          <p>
            To analyze the affinities between situationist strategies and pedaludicity as modes of creative, critical,
            and mobile engagement with territory, producing new interpretative insights and expanding the theoretical
            vocabulary for motion-based artistic research.
          </p>
          <p>
            To design new tools, protocols, and frameworks for reading, sensing, visualizing, and intervening in
            landscapes through motion — including multimodal cartographies, dynamic embodied mappings, and dynamic
            archives capable of capturing situated experiences across time.
          </p>
          <p>
            To advance the long-standing collaboration between PedaLúdico and UCLA REMAP — extending previous joint
            developments such as CIBIC and, more specifically, the research and technical methodologies originated
            in <em>Flows and Diachronies</em>. The project is developed in close dialogue with Professor Jeff Burke
            and the REMAP research group, integrating their expertise in locative media, experimental interfaces,
            and networked performance.
          </p>
          <p>
            To contribute directly to the pedagogical evolution of Professor Fabián Wagmister's course Engaged Media
            Production, by generating theoretical materials, case studies, and prototype tools that support a renewed
            approach to media practices grounded in territorial engagement, embodied inquiry, and critical
            movement-based methodologies.
          </p>
        </div>
      </section>

      {/* LINKS */}
      <section className="section">
        <h2 className="section-title">Links</h2>
        <div className="section-links">
          <a href="https://wiki.chela.org.ar/flowingcartographies" target="_blank" rel="noreferrer" className="gallery-link" style={{ display: "block" }}>
            → PedaLúdico Research Wiki
          </a>
          <a href="https://chela.org.ar" target="_blank" rel="noreferrer" className="gallery-link" style={{ display: "block" }}>
            → cheLA — Centro Heurístico Experimental Latinoamericano
          </a>
          <a href="https://remap.ucla.edu" target="_blank" rel="noreferrer" className="gallery-link" style={{ display: "block" }}>
            → REMAP UCLA
          </a>
        </div>
      </section>

      {/* ACKNOWLEDGEMENTS */}
      <section className="section">
        <h2 className="section-title">Acknowledgements</h2>
        <div className="section-body">
          <p style={{ opacity: 0.7 }}>With the support of Metabolic Studio</p>
          <p style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "12px 20px",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "rgba(255,255,255,0.9)",
            fontStyle: "italic",
            fontSize: "0.88rem",
            letterSpacing: "0.04em",
          }}>
            Esta investigación fue realizada mediante un subsidio de la Fundación Williams
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        Flowing Cartographies 2026 — CHELA / UCLA REMAP / PedaLúdico / Fundación Williams
      </footer>
    </div>
  );
}
