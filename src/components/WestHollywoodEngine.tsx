import { useEffect, useRef, useState } from "react";
import { WEST_HOLLYWOOD_GPS_01 } from "@/data/west-hollywood-gps-01";

const COMPRESS     = 60 / 910;
const PADDING      = 70;
const PDI_RADIUS_M = 50;

// Color base turquesa neón
const TEAL_BASE = { r: 0, g: 180, b: 255 }; // #00b4ff azul neón

const PDI_POINTS = [
  { name: "Center of the Crop", description: "Wilson Plaza",                               lat: 34.07221939292978, lon: -118.44363368595516 },
  { name: "Remap",              description: "Research Engineering\nMedia And Performance", lat: 34.07631649345299, lon: -118.43987165217965  },
];

function mapRange(v: number, a1: number, a2: number, b1: number, b2: number) {
  return b1 + Math.max(0, Math.min(1, (v - a1) / (a2 - a1))) * (b2 - b1);
}
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000, p = Math.PI / 180;
  const a = Math.sin((lat2 - lat1) * p / 2) ** 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * Math.sin((lon2 - lon1) * p / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}
function headingToCutoff(h: number) { return 300 + ((Math.cos(h * Math.PI / 180) + 1) / 2) * 2700; }
function headingToQ(h: number)      { return 1 + Math.abs(Math.sin(h * Math.PI / 180)) * 14; }
function compass(deg: number) {
  const d = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return d[Math.round(((deg % 360) / 22.5)) % 16];
}

export type EngineHud = {
  frequency: string; cutoff: string; elevation: string; slope: string;
  windSpeed: string; windDirection: string; windGusts: string; heading: string;
};

type Wind = { speed: number; direction: number; gusts: number };

// Segmento vivo — se redibuja cada frame con envejecimiento
type LiveSegment = {
  x1: number; y1: number; x2: number; y2: number;
  baseWidth: number;  // grosor original según velocidad
  age: number;        // frames de vida
  windContra: number; // qué tan en contra estaba el viento al dibujarse (0-1)
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; trail: { x: number; y: number }[] };
type PdiLabel = { name: string; desc: string; x: number; y: number; age: number };

type Props = { playKey: number; onHud: (h: Partial<EngineHud>) => void; onFinish: () => void };

export function WestHollywoodEngine({ playKey, onHud, onFinish }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning]   = useState(false);
  const [finished, setFinished] = useState(false);

  const { cumDist, totalDist } = (() => {
    let t = 0;
    const c = WEST_HOLLYWOOD_GPS_01.map(p => { t += p.dist; return t; });
    return { cumDist: c, totalDist: t };
  })();

  const stateRef = useRef({
    wind:         { speed: 2, direction: 270, gusts: 3 } as Wind,
    particles:    [] as Particle[],
    pdiLabels:    [] as PdiLabel[],
    pdiSeen:      new Set<number>(),
    projected:    [] as { x: number; y: number }[],
    projectedPDI: [] as { x: number; y: number }[],
    segments:     [] as LiveSegment[], // todos los segmentos vivos
    activeIdx:    0, rafId: 0,
    timeouts:     [] as ReturnType<typeof setTimeout>[],
    lfoPhase:     0,  // fase actual del LFO para modulación visual
    audio: null as null | { ctx: AudioContext; osc: OscillatorNode; filter: BiquadFilterNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode },
    width: 0, height: 0,
    running: false, finished: false,
  });

  // ── Proyección ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current, main = mainRef.current;
    if (!wrap || !main) return;
    const project = () => {
      const w = Math.max(320, wrap.clientWidth), h = Math.max(320, wrap.clientHeight);
      const dpr = window.devicePixelRatio || 1;
      main.width = w * dpr; main.height = h * dpr;
      main.style.width = w + "px"; main.style.height = h + "px";
      main.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current.width = w; stateRef.current.height = h;
      const pts = WEST_HOLLYWOOD_GPS_01;
      const minLon = Math.min(...pts.map(p => p.lon)), maxLon = Math.max(...pts.map(p => p.lon));
      const minLat = Math.min(...pts.map(p => p.lat)), maxLat = Math.max(...pts.map(p => p.lat));
      const s  = Math.min((w - PADDING * 2) / (maxLon - minLon), (h - PADDING * 2) / (maxLat - minLat));
      const ox = (w - (maxLon - minLon) * s) / 2;
      const oy = (h - (maxLat - minLat) * s) / 2;
      const toXY = (lat: number, lon: number) => ({ x: ox + (lon - minLon) * s, y: h - (oy + (lat - minLat) * s) });
      stateRef.current.projected    = pts.map(p => toXY(p.lat, p.lon));
      stateRef.current.projectedPDI = PDI_POINTS.map(p => toXY(p.lat, p.lon));
      drawIdle();
    };
    project();
    const ro = new ResizeObserver(project);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Viento ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchWind = async () => {
      try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=34.0722&longitude=-118.4402&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m");
        const j = await r.json(); if (cancelled) return;
        const c = j.current ?? {};
        const w: Wind = { speed: c.wind_speed_10m ?? 2, direction: c.wind_direction_10m ?? 270, gusts: c.wind_gusts_10m ?? 3 };
        stateRef.current.wind = w;
        onHud({ windSpeed: `${(w.speed * 3.6).toFixed(1)} km/h`, windDirection: `${Math.round(w.direction)}° ${compass(w.direction)}`, windGusts: `${w.gusts.toFixed(1)} m/s` });
      } catch { /* ignore */ }
    };
    fetchWind(); const id = setInterval(fetchWind, 30000);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (playKey === 0) return; void start(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [playKey]);
  useEffect(() => { return () => stop(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // ── Idle ────────────────────────────────────────────────────────────────────
  function drawIdle() {
    const main = mainRef.current; if (!main) return;
    const ctx = main.getContext("2d")!;
    const { width: w, height: h } = stateRef.current;
    ctx.fillStyle = "#0f0d14"; ctx.fillRect(0, 0, w, h);
    drawLabel(ctx);
  }
  function drawLabel(ctx: CanvasRenderingContext2D) {
    const { width: w, height: h } = stateRef.current;
    ctx.save(); ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
    ctx.fillText("WEST HOLLYWOOD", w / 2, h * 0.84);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = "15px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
    ctx.fillText("Los Angeles, California", w / 2, h * 0.84 + 24);
    ctx.restore();
  }

  // ── Audio ───────────────────────────────────────────────────────────────────
  function initAudio() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator(), filter = ctx.createBiquadFilter();
    const gain = ctx.createGain(), lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    osc.type = "triangle"; osc.frequency.value = 286.6;
    filter.type = "lowpass"; filter.frequency.value = 1200; filter.Q.value = 2;
    gain.gain.value = 0; lfo.type = "sine"; lfo.frequency.value = 0.5; lfoGain.gain.value = 0;
    lfo.connect(lfoGain); lfoGain.connect(gain.gain);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(); lfo.start();
    stateRef.current.audio = { ctx, osc, filter, gain, lfo, lfoGain };
  }

  function fireKick(cumNow: number) {
    const a = stateRef.current.audio; if (!a) return;
    const t = a.ctx.currentTime + 0.001;
    const kick = a.ctx.createOscillator(), kg = a.ctx.createGain();
    kick.type = "sine";
    kick.frequency.setValueAtTime(110, t); kick.frequency.exponentialRampToValueAtTime(38, t + 0.08);
    kg.gain.setValueAtTime(0.7, t); kg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    kick.connect(kg); kg.connect(a.ctx.destination); kick.start(t); kick.stop(t + 0.13);
    const buf = a.ctx.createBuffer(1, Math.floor(a.ctx.sampleRate * 0.025), a.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = a.ctx.createBufferSource(); src.buffer = buf;
    const bp = a.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 6;
    bp.frequency.value = mapRange(cumNow, 0, totalDist, 1200, 5000);
    const g = a.ctx.createGain();
    g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    src.connect(bp); bp.connect(g); g.connect(a.ctx.destination); src.start(t); src.stop(t + 0.03);
  }

  // ── Start ───────────────────────────────────────────────────────────────────
  async function start() {
    if (stateRef.current.running) return;
    stateRef.current.running = true; stateRef.current.finished = false;
    stateRef.current.pdiLabels = []; stateRef.current.pdiSeen = new Set();
    stateRef.current.segments = []; stateRef.current.lfoPhase = 0;
    setRunning(true); setFinished(false);
    stateRef.current.activeIdx = 0;
    initAudio();
    const pts = WEST_HOLLYWOOD_GPS_01;
    for (let i = 1; i < pts.length; i++) {
      const delayMs = pts[i].elapsed * 1000 * COMPRESS;
      const segMs   = (pts[i].elapsed - pts[i - 1].elapsed) * 1000 * COMPRESS;
      const ii = i, sm = segMs;
      stateRef.current.timeouts.push(setTimeout(() => stepSegment(ii, sm / 1000), delayMs));
    }
    const lastMs = pts[pts.length - 1].elapsed * 1000 * COMPRESS;
    stateRef.current.timeouts.push(setTimeout(() => finish(), lastMs + 400));
    const loop = () => { render(); stateRef.current.rafId = requestAnimationFrame(loop); };
    stateRef.current.rafId = requestAnimationFrame(loop);
  }

  // ── Step ────────────────────────────────────────────────────────────────────
  function stepSegment(i: number, segSec: number) {
    const proj = stateRef.current.projected;
    const a    = stateRef.current.audio;
    const seg  = WEST_HOLLYWOOD_GPS_01[i];
    const cumNow = cumDist[i];

    // Calcular windContra para este segmento (cuán en contra está el viento)
    const windAngle = (seg.heading - stateRef.current.wind.direction) * Math.PI / 180;
    const windCos   = Math.cos(windAngle); // +1=a favor, -1=en contra
    const windContra = Math.max(0, -windCos); // 0=favor/perp, 1=en contra
    const windPerp   = Math.abs(Math.sin(windAngle));

    // Grosor base: velocidad (0→fino, 7.5m/s→grueso)
    const baseWidth = mapRange(seg.speed, 0, 7.5, 1.5, 6);

    // Agregar segmento al array vivo
    stateRef.current.segments.push({
      x1: proj[i - 1].x, y1: proj[i - 1].y,
      x2: proj[i].x,     y2: proj[i].y,
      baseWidth, age: 0, windContra,
    });

    stateRef.current.activeIdx = i;

    // Audio
    if (a) {
      const t = a.ctx.currentTime, ramp = Math.max(0.04, segSec * 0.7);
      a.osc.frequency.linearRampToValueAtTime(seg.ele * 2, t + ramp);
      const cutoff = headingToCutoff(seg.heading) + stateRef.current.wind.gusts * 60;
      a.filter.frequency.linearRampToValueAtTime(cutoff, t + ramp);
      a.filter.Q.linearRampToValueAtTime(headingToQ(seg.heading), t + ramp);
      a.gain.gain.linearRampToValueAtTime(mapRange(Math.max(0, seg.slope), 0, 0.3, 0.12, 0.35), t + ramp);
      // WCL
      const lfoFreq  = mapRange(windCos, -1, 1, 5, 0.2) * mapRange(stateRef.current.wind.speed, 0, 20, 0.5, 1.5);
      const lfoAmp   = mapRange(stateRef.current.wind.speed, 0, 20, 0, 0.12) * windPerp;
      a.lfo.frequency.linearRampToValueAtTime(Math.max(0.1, lfoFreq), t + ramp);
      a.lfoGain.gain.linearRampToValueAtTime(lfoAmp, t + ramp);
    }

    // Kick cada 4 puntos
    if (i % 4 === 0) fireKick(cumNow);

    // PDI por proximidad
    PDI_POINTS.forEach((pdi, pi) => {
      if (stateRef.current.pdiSeen.has(pi)) return;
      if (haversine(seg.lat, seg.lon, pdi.lat, pdi.lon) <= PDI_RADIUS_M) {
        stateRef.current.pdiSeen.add(pi);
        stateRef.current.pdiLabels.push({ name: pdi.name, desc: pdi.description, x: stateRef.current.projectedPDI[pi].x, y: stateRef.current.projectedPDI[pi].y, age: 0 });
      }
    });

    // HUD
    onHud({ frequency: `${Math.round(seg.ele * 2)} Hz`, cutoff: `${Math.round(headingToCutoff(seg.heading))} Hz`, elevation: `${seg.ele} m`, slope: `${seg.slope > 0 ? "+" : ""}${seg.slope.toFixed(3)}`, heading: `${Math.round(seg.heading)}° ${compass(seg.heading)}` });
  }

  function finish() {
    stateRef.current.running = false; stateRef.current.finished = true;
    setRunning(false); setFinished(true); onFinish();
    const a = stateRef.current.audio;
    if (a) {
      a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 2);
      setTimeout(() => { try { a.osc.stop(); a.lfo.stop(); a.ctx.close(); } catch { /* */ } stateRef.current.audio = null; }, 2300);
    }
  }

  // ── Partículas ──────────────────────────────────────────────────────────────
  function spawnParticle(): Particle {
    const { width: w, height: h, wind } = stateRef.current;
    const rad = (wind.direction + 180) * Math.PI / 180, spd = Math.max(0.3, wind.speed * 0.22);
    return { x: Math.random() * w, y: Math.random() * h, vx: Math.sin(rad) * spd, vy: -Math.cos(rad) * spd, life: 0, maxLife: 90 + Math.random() * 130, trail: [] };
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  function render() {
    const main = mainRef.current; if (!main) return;
    const ctx = main.getContext("2d")!;
    const { width: w, height: h, projected: proj, wind } = stateRef.current;

    // Fondo
    ctx.fillStyle = "#0f0d14"; ctx.fillRect(0, 0, w, h);

    // LFO visual: fase oscila en el tiempo para modular el brillo
    const lfoFreqVisual = stateRef.current.audio
      ? mapRange(wind.speed, 0, 20, 0.2, 5) // aprox igual al audio LFO
      : 1;
    stateRef.current.lfoPhase += (lfoFreqVisual * Math.PI * 2) / 60; // 60fps aprox
    const lfoVal = (Math.sin(stateRef.current.lfoPhase) + 1) / 2; // 0–1

    // ── ESTELA — aguada que se expande suave en el tiempo ──
    // Dibujamos varias capas de cada segmento con expansión creciente
    const totalFrames = 60 * 60;
    ctx.save(); ctx.lineCap = "round";
    for (const seg of stateRef.current.segments) {
      seg.age++;
      const ageT = Math.min(1, seg.age / totalFrames);
      // 3 capas de halo: interior, medio, exterior
      const maxExp = 8 + seg.windContra * 12; // expansión máxima en frames finales
      const layers = [
        { expand: 1 + ageT * maxExp * 0.3,  alpha: 0.18 * (1 - ageT * 0.7) },
        { expand: 1 + ageT * maxExp * 0.65, alpha: 0.09 * (1 - ageT * 0.8) },
        { expand: 1 + ageT * maxExp,        alpha: 0.04 * (1 - ageT * 0.9) },
      ];
      for (const layer of layers) {
        ctx.globalAlpha = Math.max(0.002, layer.alpha);
        ctx.strokeStyle = `rgb(${TEAL_BASE.r},${TEAL_BASE.g},${TEAL_BASE.b})`;
        ctx.lineWidth = seg.baseWidth * layer.expand;
        ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
      }
    }
    ctx.restore();

    // ── LÍNEA PRINCIPAL — suavizada con Catmull-Rom, modulada por LFO ──
    const segs = stateRef.current.segments;
    if (segs.length > 0) {
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      const pulse = lfoVal * 0.35;
      const r = Math.round(TEAL_BASE.r * 0.75 + (255 - TEAL_BASE.r) * pulse);
      const g = Math.round(TEAL_BASE.g * 0.85 + (255 - TEAL_BASE.g) * pulse);
      const b = Math.round(TEAL_BASE.b * 0.8 + (255 - TEAL_BASE.b) * pulse);
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.globalAlpha = 0.9;
      // Construir array de puntos únicos
      const pts: {x:number,y:number,w:number}[] = [];
      pts.push({x: segs[0].x1, y: segs[0].y1, w: segs[0].baseWidth});
      for (const s of segs) pts.push({x: s.x2, y: s.y2, w: s.baseWidth});
      // Dibujar con curvas suavizadas (Catmull-Rom → bezier)
      if (pts.length >= 2) {
        ctx.lineWidth = pts[0].w;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          // Punto de control: promedio entre actual y siguiente
          const mx = (pts[i].x + pts[i+1].x) / 2;
          const my = (pts[i].y + pts[i+1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Partículas de viento
    const particles = stateRef.current.particles;
    while (particles.length < 120) particles.push(spawnParticle());
    ctx.save(); ctx.lineWidth = 1.2; ctx.lineCap = "round";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life++;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > Math.max(10, wind.speed * 3)) p.trail.shift();
      const lt = p.life / p.maxLife;
      const alpha = (lt < 0.2 ? lt / 0.2 : lt > 0.8 ? (1 - lt) / 0.2 : 1) * 0.3;
      ctx.strokeStyle = `rgba(0,229,204,${Math.max(0, Math.min(1, alpha))})`;
      ctx.beginPath(); p.trail.forEach((t, j) => j === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y)); ctx.stroke();
      if (p.life >= p.maxLife || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) particles[i] = spawnParticle();
    }
    ctx.restore();

    // Dot activo
    const idx = stateRef.current.activeIdx;
    if (stateRef.current.running && !stateRef.current.finished && idx > 0 && idx < proj.length) {
      const brightness = 0.7 + lfoVal * 0.3;
      const r = Math.round(TEAL_BASE.r * brightness + 255 * (1 - brightness));
      const g = Math.round(TEAL_BASE.g);
      const b = Math.round(TEAL_BASE.b * brightness);
      const color = `rgb(${r},${g},${b})`;
      ctx.save(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(proj[idx].x, proj[idx].y, 5, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }

    // PDI — permanentes
    ctx.save();
    for (const L of stateRef.current.pdiLabels) {
      L.age++;
      const alpha = L.age < 20 ? L.age / 20 : 1;
      const lx = Math.min(w - 200, Math.max(10, L.x + 22)), ly = Math.max(30, L.y - 28);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(0,229,204,0.5)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.fillStyle = "#00e5cc"; ctx.shadowColor = "#00e5cc"; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(L.x, L.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
      ctx.fillStyle = "#00e5cc"; ctx.textAlign = "left";
      ctx.fillText(L.name.toUpperCase(), lx + 4, ly);
      ctx.font = "10px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      L.desc.split("\n").forEach((line, li) => ctx.fillText(line, lx + 4, ly + 14 + li * 13));
    }
    ctx.restore();

    if (!stateRef.current.running || stateRef.current.finished) drawLabel(ctx);
  }

  function stop() {
    cancelAnimationFrame(stateRef.current.rafId);
    stateRef.current.timeouts.forEach(t => clearTimeout(t)); stateRef.current.timeouts = [];
    const a = stateRef.current.audio;
    if (a) { try { a.osc.stop(); a.lfo.stop(); a.ctx.close(); } catch { /* */ } stateRef.current.audio = null; }
    stateRef.current.running = false;
  }

  void running; void finished;

  return (
    <div ref={wrapRef} className="engine-wrap">
      <canvas ref={mainRef} className="engine-canvas" />
    </div>
  );
}
