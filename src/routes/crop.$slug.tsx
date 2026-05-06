import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { LincolnHeightsEngine, type EngineHud as LHHud } from "@/components/LincolnHeightsEngine";
import { WestHollywoodEngine, type EngineHud as WHHud } from "@/components/WestHollywoodEngine";
import { VeniceEngine, type EngineHud as VHud } from "@/components/VeniceEngine";

type CropData = {
  num: string;
  name: string;
  region: string;
  rides: string;
  elevation: string;
  distance: string;
  points: string;
};

const CROPS: Record<string, CropData> = {
  "lincoln-heights": {
    num: "01",
    name: "Lincoln Heights",
    region: "Los Angeles, California",
    rides: "1 ride accumulated — April 2026",
    elevation: "86.1m – 124m",
    distance: "~8.5km",
    points: "554 GPS points",
  },
  "west-hollywood": {
    num: "02",
    name: "West Hollywood",
    region: "Los Angeles, California",
    rides: "1 ride accumulated — April 2026",
    elevation: "115.6m – 145.8m",
    distance: "~2.16km",
    points: "86 GPS points",
  },
  "venice": {
    num: "05",
    name: "Venice",
    region: "Los Angeles, California",
    rides: "9 rides accumulated — 2026",
    elevation: "-6m – 16m",
    distance: "~4km",
    points: "2034 GPS points",
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
  loader: ({ params }): CropData => {
    const c = CROPS[params.slug];
    if (!c) throw notFound();
    return c;
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

type AnyHud = LHHud | WHHud | VHud;

const EMPTY_HUD: AnyHud = {
  frequency: "— Hz",
  cutoff: "— Hz",
  elevation: "— m",
  slope: "—",
  windSpeed: "— km/h",
  windDirection: "—",
  windGusts: "— m/s",
};

function CropPage() {
  const { slug } = Route.useParams();
  const c = CROPS[slug] as CropData;
  const [hud, setHud] = useState<AnyHud>(EMPTY_HUD);
  const [playKey, setPlayKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);

  const isLincoln       = slug === "lincoln-heights";
  const isWestHollywood = slug === "west-hollywood";
  const isVenice        = slug === "venice";
  const hasEngine       = isLincoln || isWestHollywood || isVenice;

  const handlePlay = () => {
    if (playing) return;
    setDone(false);
    setPlaying(true);
    setPlayKey((k) => k + 1);
  };
  const handleFinish = () => { setPlaying(false); setDone(true); };
  const handleHud    = (h: Partial<AnyHud>) => setHud((prev) => ({ ...prev, ...h }));

  return (
    <div className="crop-page">
      <div className="crop-topbar">
        <Link to="/" className="crop-brand">FIVECROPS</Link>
        <div className="crop-title">
          {c.name.toUpperCase()} — Crop {c.num}
        </div>
        <div className="crop-controls">
          {hasEngine && (
            <button
              className="play-btn"
              type="button"
              disabled={playing}
              onClick={handlePlay}
            >
              {done ? "✓ Finalizado" : playing ? "● Playing" : "▶ Play"}
            </button>
          )}
        </div>
      </div>

      <div className="crop-stats">
        <div className="stat">frequency<strong>{hud.frequency}</strong></div>
        <div className="stat">cutoff<strong>{hud.cutoff}</strong></div>
        <div className="stat">elevation<strong>{hud.elevation}</strong></div>
        {isVenice ? (
          <>
            <div className="stat">dist. océano<strong>{(hud as VHud).distOcean ?? "— m"}</strong></div>
            <div className="stat">dist. canal<strong>{(hud as VHud).distCanal ?? "— m"}</strong></div>
            <div className="stat">marea<strong>{(hud as VHud).tide ?? "—"}</strong></div>
          </>
        ) : (
          <>
            <div className="stat">slope<strong>{(hud as LHHud).slope ?? "—"}</strong></div>
            <div className="stat wind">wind speed<strong>{(hud as LHHud).windSpeed ?? "—"}</strong></div>
            <div className="stat wind">wind direction<strong>{(hud as LHHud).windDirection ?? "—"}</strong></div>
            <div className="stat wind">wind gusts<strong>{(hud as LHHud).windGusts ?? "—"}</strong></div>
          </>
        )}
      </div>

      <div className="crop-canvas">
        {isLincoln && (
          <LincolnHeightsEngine
            playKey={playKey}
            onHud={handleHud}
            onFinish={handleFinish}
          />
        )}
        {isWestHollywood && (
          <WestHollywoodEngine
            playKey={playKey}
            onHud={handleHud}
            onFinish={handleFinish}
          />
        )}
        {isVenice && (
          <VeniceEngine
            playKey={playKey}
            onHud={handleHud}
            onFinish={handleFinish}
          />
        )}
        {!hasEngine && (
          <>
            <div className="canvas-placeholder-title">{c.name.toUpperCase()}</div>
            <div className="canvas-placeholder-sub">{c.region}</div>
          </>
        )}
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
