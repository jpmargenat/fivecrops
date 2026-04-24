import { createFileRoute, Link, notFound } from "@tanstack/react-router";

const CROPS: Record<
  string,
  { num: string; name: string; region: string; rides: string; elevation: string; distance: string; points: string }
> = {
  "lincoln-heights": {
    num: "01",
    name: "Lincoln Heights",
    region: "Los Angeles, California",
    rides: "1 ride accumulated — April 2026",
    elevation: "86.1m – 124m",
    distance: "~8.5km",
    points: "554 GPS points",
  },
};

export const Route = createFileRoute("/crop/$slug")({
  head: ({ params }) => {
    const c = CROPS[params.slug];
    const title = c ? `${c.name} — Crop ${c.num} · FiveCrops` : "Crop · FiveCrops";
    const desc = c
      ? `Accumulated cycling passes through ${c.name}, ${c.region}. ${c.rides}.`
      : "FiveCrops urban extraction.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    if (!CROPS[params.slug]) throw notFound();
    return CROPS[params.slug];
  },
  component: CropPage,
  notFoundComponent: () => (
    <div className="crop-page">
      <div className="crop-topbar">
        <Link to="/" className="crop-brand">FIVECROPS</Link>
        <div className="crop-title">CROP NOT FOUND</div>
        <div />
      </div>
      <div className="crop-canvas">
        <div className="canvas-placeholder-title">COMING SOON</div>
        <div className="canvas-placeholder-sub">This crop has not been extracted yet</div>
      </div>
    </div>
  ),
});

function CropPage() {
  const c = Route.useLoaderData();

  return (
    <div className="crop-page">
      <div className="crop-topbar">
        <Link to="/" className="crop-brand">FIVECROPS</Link>
        <div className="crop-title">
          {c.name.toUpperCase()} — Crop {c.num}
        </div>
        <div className="crop-controls">
          <button className="play-btn" type="button">▶ Play</button>
        </div>
      </div>

      <div className="crop-stats">
        <div className="stat">frequency<strong>— Hz</strong></div>
        <div className="stat">cutoff<strong>— Hz</strong></div>
        <div className="stat">elevation<strong>— m</strong></div>
        <div className="stat">slope<strong>—</strong></div>
        <div className="stat wind">wind speed<strong>— m/s</strong></div>
        <div className="stat wind">wind direction<strong>—°</strong></div>
        <div className="stat wind">wind gusts<strong>— m/s</strong></div>
      </div>

      <div className="crop-canvas">
        <div className="canvas-placeholder-title">{c.name.toUpperCase()}</div>
        <div className="canvas-placeholder-sub">{c.region}</div>
      </div>

      <div className="crop-info">
        <span className="primary">{c.name}, Los Angeles</span>
        <span>{c.rides}</span>
        <span>
          Elevation: {c.elevation} · Distance: {c.distance} · {c.points}
        </span>
      </div>
    </div>
  );
}
