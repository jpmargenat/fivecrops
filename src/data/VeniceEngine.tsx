import { useEffect, useRef } from "react";
import {
  VENICE_MAIN_GPS,
  VENICE_WATER_GPS,
  VENICE_WAYPOINTS,
  VENICE_ALL_TRACKS,
  type GpsPoint,
} from "@/data/venice-gps";

export type EngineHud = {
  frequency: string;
  cutoff: string;
  elevation: string;
  distOcean: string;
  distCanal: string;
  tide: string;
};

type Props = {
  playKey: number;
  onHud: (h: Partial<EngineHud>) => void;
  onFinish: () => void;
};

const BBOX = { W: -118.4777, E: -118.4557, S: 33.9717, N: 33.9897 };
const DURATION_MS = 60000;

function mapRange(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * Math.max(0, Math.min(1, (v - a) / (b - a)));
}

function geoToCanvas(lat: number, lon: number, W: number, H: number): [number, number] {
  return [
    mapRange(lon, BBOX.W, BBOX.E, 0, W),
    mapRange(lat, BBOX.N, BBOX.S, 0, H),
  ];
}

function distToOcean(lat: number, lon: number): number {
  const p1 = { lat: 33.9897, lon: -118.4777 };
  const p2 = { lat: 33.9717, lon: -118.4650 };
  const dx = (p2.lon - p1.lon) * 85000;
  const dy = (p2.lat - p1.lat) * 111320;
  const len2 = dx * dx + dy * dy;
  const px = (lon - p1.lon) * 85000;
  const py = (lat - p1.lat) * 111320;
  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
  return Math.sqrt((dx * t - px) ** 2 + (dy * t - py) ** 2);
}

const CANALS: [number, number][][] = [
  [[33.9875, -118.468], [33.9865, -118.4682], [33.9855, -118.4685], [33.9845, -118.4688]],
  [[33.9865, -118.4695], [33.9865, -118.4675], [33.9865, -118.466]],
  [[33.985, -118.47], [33.9848, -118.4685], [33.9846, -118.467]],
];

function distToCanals(lat: number, lon: number): number {
  let min = Infinity;
  for (const canal of CANALS) {
    for (let i = 0; i < canal.length - 1; i++) {
      const [la1, lo1] = canal[i], [la2, lo2] = canal[i + 1];
      const dx = (lo2 - lo1) * 85000, dy = (la2 - la1) * 111320;
      const len2 = dx * dx + dy * dy;
      const px = (lon - lo1) * 85000, py = (lat - la1) * 111320;
      const t = len2 > 0 ? Math.max(0, Math.min(1, (px * dx + py * dy) / len2)) : 0;
      const d = Math.sqrt((dx * t - px) ** 2 + (dy * t - py) ** 2);
      if (d < min) min = d;
    }
  }
  return min;
}

function pdiType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("playa")) return "playa";
  if (n.includes("río") || n.includes("rio")) return "rio";
  if (n.includes("puente")) return "puente";
  if (n.includes("muelle")) return "muelle";
  if (n.includes("tesoros") || n.includes("juntadores")) return "tesoros";
  return "foto";
}

const TRACK_COLORS = ["#ff5028","#4fc3f7","#ffbe28","#e664a0","#80cbc4","#ff8c28","#c8f0a0","#ce93d8","#f08080"];

export function VeniceEngine({ playKey, onHud, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const audioRef = useRef<{
    actx: AudioContext;
    v1osc: OscillatorNode; v1filt: BiquadFilterNode; v1gain: GainNode;
    v1lfoO: OscillatorNode; v1lfoG: GainNode;
    v2osc: OscillatorNode; v2filt: BiquadFilterNode; v2gain: GainNode;
    surfFilt: BiquadFilterNode; surfGain: GainNode;
    canalFilt: BiquadFilterNode; canalGain: GainNode;
    urbFilt: BiquadFilterNode; urbGain: GainNode;
    master: GainNode;
  } | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastKickRef = useRef<number>(-1);
  const pdiShownRef = useRef<Set<number>>(new Set());
  const tideRef = useRef<number>(0.5);

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function makeNoise(actx: AudioContext): AudioBufferSourceNode {
    const size = actx.sampleRate * 2;
    const buf = actx.createBuffer(1, size, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource();
    src.buffer = buf; src.loop = true; src.start();
    return src;
  }

  function fireKick(actx: AudioContext, master: GainNode) {
    const t = actx.currentTime;
    const buf = actx.createBuffer(1, Math.floor(actx.sampleRate * 0.06), actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    const src = actx.createBufferSource(); src.buffer = buf;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 160;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  // ── DRAW BASE ──────────────────────────────────────────────────────────────
  function drawBase(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = "#080c10"; ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.025)"; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // ocean glow
    const og = ctx.createLinearGradient(0, 0, W * 0.25, 0);
    og.addColorStop(0, "rgba(79,195,247,0.07)"); og.addColorStop(1, "rgba(79,195,247,0)");
    ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);

    // all tracks
    VENICE_ALL_TRACKS.forEach((track, ti) => {
      ctx.beginPath();
      ctx.strokeStyle = TRACK_COLORS[ti % TRACK_COLORS.length];
      ctx.lineWidth = 1.4; ctx.globalAlpha = 0.3;
      track.forEach(([lat, lon], i) => {
        const [x, y] = geoToCanvas(lat, lon, W, H);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke(); ctx.globalAlpha = 1;
    });

    // waypoint dots
    VENICE_WAYPOINTS.forEach((w) => {
      const type = pdiType(w.name);
      if (type === "foto") return;
      const [x, y] = geoToCanvas(w.lat, w.lon, W, H);
      const colors: Record<string, string> = { playa: "#4fc3f7", rio: "#80cbc4", puente: "#fff", muelle: "#ffb74d", tesoros: "#ce93d8" };
      ctx.fillStyle = colors[type] || "#fff"; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  // ── FETCH TIDE ─────────────────────────────────────────────────────────────
  async function fetchTide() {
    try {
      const url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410840&product=water_level&datum=MLLW&time_zone=lst&units=metric&format=json";
      const res = await fetch(url);
      const data = await res.json();
      if (data.data?.length > 0) {
        tideRef.current = parseFloat(data.data[data.data.length - 1].v);
        onHud({ tide: tideRef.current.toFixed(2) + " m" });
      }
    } catch {
      onHud({ tide: "~ 0.5 m" });
    }
  }

  // ── MAIN EFFECT ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (playKey === 0) return;
    const canvas = canvasRef.current!;

    // Resize canvas
    const wrap = canvas.parentElement!;
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;

    pdiShownRef.current = new Set();
    fetchTide();

    // Init audio
    const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = actx.createGain(); master.gain.value = 0.85; master.connect(actx.destination);

    const v1filt = actx.createBiquadFilter(); v1filt.type = "lowpass"; v1filt.Q.value = 3; v1filt.frequency.value = 300;
    const v1gain = actx.createGain(); v1gain.gain.value = 0;
    const v1lfoO = actx.createOscillator(); v1lfoO.type = "sine"; v1lfoO.frequency.value = 0.35;
    const v1lfoG = actx.createGain(); v1lfoG.gain.value = 0;
    v1lfoO.connect(v1lfoG);
    const v1osc = actx.createOscillator(); v1osc.type = "triangle"; v1osc.frequency.value = 60;
    v1lfoG.connect(v1osc.frequency);
    v1osc.connect(v1filt); v1filt.connect(v1gain); v1gain.connect(master);
    v1osc.start(); v1lfoO.start();
    v1gain.gain.linearRampToValueAtTime(0.22, actx.currentTime + 2);

    const v2filt = actx.createBiquadFilter(); v2filt.type = "lowpass"; v2filt.frequency.value = 120; v2filt.Q.value = 4;
    const v2gain = actx.createGain(); v2gain.gain.value = 0;
    const v2osc = actx.createOscillator(); v2osc.type = "sine"; v2osc.frequency.value = 38;
    v2osc.connect(v2filt); v2filt.connect(v2gain); v2gain.connect(master);
    v2osc.start();

    const surfFilt = actx.createBiquadFilter(); surfFilt.type = "lowpass"; surfFilt.frequency.value = 180; surfFilt.Q.value = 0.8;
    const surfGain = actx.createGain(); surfGain.gain.value = 0;
    makeNoise(actx).connect(surfFilt); surfFilt.connect(surfGain); surfGain.connect(master);

    const canalFilt = actx.createBiquadFilter(); canalFilt.type = "bandpass"; canalFilt.frequency.value = 600; canalFilt.Q.value = 8;
    const canalGain = actx.createGain(); canalGain.gain.value = 0;
    makeNoise(actx).connect(canalFilt); canalFilt.connect(canalGain); canalGain.connect(master);

    const urbFilt = actx.createBiquadFilter(); urbFilt.type = "highpass"; urbFilt.frequency.value = 1800;
    const urbGain = actx.createGain(); urbGain.gain.value = 0;
    makeNoise(actx).connect(urbFilt); urbFilt.connect(urbGain); urbGain.connect(master);
    urbGain.gain.linearRampToValueAtTime(0.018, actx.currentTime + 1);

    audioRef.current = { actx, v1osc, v1filt, v1gain, v1lfoO, v1lfoG, v2osc, v2filt, v2gain, surfFilt, surfGain, canalFilt, canalGain, urbFilt, urbGain, master };

    const startTime = performance.now();
    startTimeRef.current = startTime;
    lastKickRef.current = -1;

    drawBase(canvas);

    function frame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const ptIdx = Math.floor(progress * (VENICE_MAIN_GPS.length - 1));
      const pt = VENICE_MAIN_GPS[ptIdx];
      const { lat, lon, ele } = pt;

      drawBase(canvas);
      const W = canvas.width, H = canvas.height;
      const [cx, cy] = geoToCanvas(lat, lon, W, H);

      // dot
      const ctx2d = canvas.getContext("2d")!;
      ctx2d.save();
      ctx2d.shadowColor = "rgba(255,255,255,0.7)"; ctx2d.shadowBlur = 16;
      ctx2d.fillStyle = "#ffffff";
      ctx2d.beginPath(); ctx2d.arc(cx, cy, 5, 0, Math.PI * 2); ctx2d.fill();
      ctx2d.restore();

      const dOcean = distToOcean(lat, lon);
      const dCanal = distToCanals(lat, lon);

      // audio
      const a = audioRef.current;
      if (a) {
        const t = a.actx.currentTime;
        const baseFreq = Math.max(35, ele * 2 + 40);
        const canalBoost = mapRange(dCanal, 0, 300, 20, 0);
        a.v1osc.frequency.setTargetAtTime(baseFreq + canalBoost, t, 0.3);
        const cutoff = mapRange(dOcean, 0, 600, 18000, 80);
        a.v1filt.frequency.setTargetAtTime(cutoff, t, 0.35);
        a.v1lfoG.gain.setTargetAtTime(mapRange(dOcean, 0, 600, 18, 0.5), t, 0.5);

        // water voice
        const wIdx = Math.floor(progress * (VENICE_WATER_GPS.length - 1));
        const wEle = VENICE_WATER_GPS[wIdx].ele;
        a.v2gain.gain.setTargetAtTime(mapRange(wEle, 0, -6, 0, 0.16), t, 0.6);
        a.v2osc.frequency.setTargetAtTime(mapRange(wEle, 0, -6, 50, 28), t, 0.8);

        // surf
        a.surfGain.gain.setTargetAtTime(mapRange(dOcean, 0, 500, 0.28, 0), t, 0.4);
        a.surfFilt.frequency.setTargetAtTime(mapRange(dOcean, 0, 500, 320, 120), t, 0.5);

        // canal
        a.canalGain.gain.setTargetAtTime(mapRange(dCanal, 0, 250, 0.12, 0), t, 0.3);

        // urban
        a.urbGain.gain.setTargetAtTime(mapRange(Math.min(dOcean, dCanal), 0, 400, 0.005, 0.02), t, 0.6);

        // kick every 4 pts
        const kickIdx = Math.floor(ptIdx / 4);
        if (kickIdx !== lastKickRef.current) { fireKick(a.actx, a.master); lastKickRef.current = kickIdx; }

        onHud({
          frequency: (baseFreq + canalBoost).toFixed(0) + " Hz",
          cutoff: cutoff.toFixed(0) + " Hz",
          elevation: ele.toFixed(1) + " m",
          distOcean: dOcean.toFixed(0) + " m",
          distCanal: dCanal.toFixed(0) + " m",
        });
      }

      // PDIs — draw inline on canvas
      VENICE_WAYPOINTS.forEach((w, i) => {
        if (pdiType(w.name) === "foto") return;
        const [wx, wy] = geoToCanvas(w.lat, w.lon, W, H);
        const dist = Math.sqrt((cx - wx) ** 2 + (cy - wy) ** 2);
        if (dist < 70 && !pdiShownRef.current.has(i)) {
          pdiShownRef.current.add(i);
        }
        if (pdiShownRef.current.has(i)) {
          const ctx2d = canvas.getContext("2d")!;
          const colors: Record<string, string> = { playa: "#4fc3f7", rio: "#80cbc4", puente: "#fff", muelle: "#ffb74d", tesoros: "#ce93d8" };
          const type = pdiType(w.name);
          ctx2d.save();
          ctx2d.font = "9px 'Space Mono', monospace";
          ctx2d.fillStyle = colors[type] || "#fff";
          ctx2d.globalAlpha = 0.9;
          ctx2d.fillText(w.name.toUpperCase(), wx + 8, wy - 8);
          ctx2d.restore();
        }
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        // fade out
        const a = audioRef.current;
        if (a) {
          [a.v1gain, a.v2gain, a.surfGain, a.canalGain, a.urbGain].forEach(g => {
            try { g.gain.linearRampToValueAtTime(0, a.actx.currentTime + 1.5); } catch {}
          });
          setTimeout(() => { try { a.actx.close(); } catch {} audioRef.current = null; }, 1800);
        }
        onFinish();
      }
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      const a = audioRef.current;
      if (a) { try { a.actx.close(); } catch {} audioRef.current = null; }
    };
  }, [playKey]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
