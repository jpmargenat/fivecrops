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

const CAPTIONS: string[] = [
  "All 29 routes overlaid — Dogtown / Lincoln Heights corpus",
  "West Hollywood crop — single ride, sinusoidal trace",
  "West Hollywood — hard crop at bbox border",
  "Lincoln Heights — color by elevation, dark background",
  "Work in progress",
  "Lincoln Heights — all rides, sparse rendering",
  "Lincoln Heights — single ride with PDI markers",
  "West Hollywood — blue palette, slow animation",
  "West Hollywood — blue background, ambient mode",
  "West Hollywood — teal, full route visible",
  "Circular text — PedaLúdico / SALI generative typography",
  "SALI transmission — generative text overlay",
  "Telegram live — 'en directo / chat de telegram'",
  "Lincoln Heights — red background, seismic mode",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
  "Work in progress",
];

function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

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
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <img src={img.src} alt={img.alt} className="gallery-thumb" />

              {/* HOVER OVERLAY */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.72)",
                display: "flex",
                alignItems: "flex-end",
                padding: "12px",
                opacity: hovered === i ? 1 : 0,
                transition: "opacity 0.2s ease",
                pointerEvents: "none",
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: "rgba(232,232,224,0.85)",
                  lineHeight: 1.5,
                }}>
                  {CAPTIONS[i] || `Image ${i + 1}`}
                </span>
              </div>

              {/* INDEX */}
              <div style={{
                position: "absolute",
                top: 8,
                left: 10,
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: "rgba(232,232,224,0.3)",
                letterSpacing: "0.1em",
                pointerEvents: "none",
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
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
            <div className="lightbox-counter">
              {selected + 1} / {IMAGES.length}
              {CAPTIONS[selected] && (
                <span style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  color: "rgba(232,232,224,0.55)",
                  marginTop: 4,
                }}>
                  {CAPTIONS[selected]}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
