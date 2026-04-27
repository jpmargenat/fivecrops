import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Process Gallery — FiveCrops" },
      { name: "description", content: "Crops, GIFs and reference images from the FiveCrops research process." },
    ],
  }),
  component: GalleryPage,
});

const IMAGES = Array.from({ length: 25 }, (_, i) => ({
  src: `/g${i + 1}.jpg`,
  alt: `Process image ${i + 1}`,
}));

function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const handlePrev = () => {
    if (selected === null) return;
    setSelected(selected === 0 ? IMAGES.length - 1 : selected - 1);
  };

  const handleNext = () => {
    if (selected === null) return;
    setSelected(selected === IMAGES.length - 1 ? 0 : selected + 1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") setSelected(null);
  };

  return (
    <div className="landing">
      <header className="landing-header">
        <Link to="/" className="crop-brand">FIVECROPS</Link>
        <h1 className="landing-title" style={{ fontSize: "clamp(32px, 5vw, 56px)", marginTop: 32 }}>
          PROCESS GALLERY
        </h1>
        <p className="landing-subtitle">Crops, GIFs &amp; reference images</p>
      </header>

      <section className="section" style={{ maxWidth: 1100 }}>
        <div className="gallery-grid">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-cell"
              onClick={() => setSelected(i)}
            >
              <img src={img.src} alt={img.alt} className="gallery-thumb" />
            </div>
          ))}
        </div>
        <div className="section-links" style={{ marginTop: 40 }}>
          <Link to="/">← Back to FiveCrops</Link>
        </div>
      </section>

      {/* LIGHTBOX */}
      {selected !== null && (
        <div
          className="lightbox"
          onClick={() => setSelected(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={IMAGES[selected].src}
              alt={IMAGES[selected].alt}
              className="lightbox-img"
            />
            <button className="lightbox-prev" onClick={handlePrev}>‹</button>
            <button className="lightbox-next" onClick={handleNext}>›</button>
            <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
            <div className="lightbox-counter">{selected + 1} / {IMAGES.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
