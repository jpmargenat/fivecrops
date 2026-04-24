import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Process Gallery — FiveCrops" },
      { name: "description", content: "Crops, GIFs and reference images from the FiveCrops research process." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <Link to="/" className="crop-brand">FIVECROPS</Link>
        <h1 className="landing-title" style={{ fontSize: "clamp(32px, 5vw, 56px)", marginTop: 32 }}>
          PROCESS GALLERY
        </h1>
        <p className="landing-subtitle">Crops, GIFs &amp; reference images</p>
      </header>
      <section className="section">
        <div className="section-body">
          <p>Coming soon. This page will collect process images, GIFs, sketches and reference materials from the FiveCrops research.</p>
        </div>
        <div className="section-links">
          <Link to="/">← Back to FiveCrops</Link>
        </div>
      </section>
    </div>
  );
}
