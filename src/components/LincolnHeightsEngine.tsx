import { useEffect, useRef, useState } from "react";
import { LINCOLN_HEIGHTS_GPS, type GpsPoint } from "@/data/lincoln-heights-gps";
import { LINCOLN_HEIGHTS_SUPER_GPS } from "@/data/lincoln-heights-super-gps";

const TOTAL_MS = 75000;
const PADDING = 40;

const STREET_LABELS: Record<number, string> = {
  36: "N Broadway", 40: "Daly St", 61: "N Main St", 119: "Pasadena Ave",
  129: "Griffin Ave", 173: "Figueroa St", 189: "Marengo St", 288: "Mission Rd",
  389: "N Spring St", 402: "Valley Blvd", 410: "Workman St", 443: "Ave 26",
};

const SUPER_STREET_LABELS: Record<number, string> = {
  20: "Workman St", 55: "Ave 26", 90: "N Broadway", 140: "Griffin Ave",
  200: "Pasadena Ave", 280: "N Main St", 350: "Mission Rd", 420: "Valley Blvd",
};

type Wind = { speed: number; direction: number; gusts: number };
type NewsItem = { source: string; title: string; idx: number };
type ActiveLabel = { idx: number; text: string; age: number; maxAge: number; fadeIn: number; isSuper?: boolean };
type ActiveCard = { idx: number; news: NewsItem; age: number; maxAge: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; trail: { x: number; y: number }[] };

function mapRange(v: number, a1: number, a2: number, b1: number, b2: number) {
  const t = (v - a1) / (a2 - a1);
  return b1 + Math.max(0, Math.min(1, t)) * (b2 - b1);
}

function compass(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

export type EngineHud = {
  frequency: string; cutoff: string; elevation: string; slope: string;
  windSpeed: string; windDirection: string; windGusts: string;
};

type Props = { playKey: number; onHud: (h: Partial<EngineHud>) => void; onFinish: () => void; };

export function LincolnHeightsEngine({ playKey, onHud, onFinish }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLCanvasElement | null>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const stateRef = useRef({
    wind: { speed: 2, direction: 270, gusts: 3 } as Wind,
    particles: [] as Particle[],
    activeLabels: [] as ActiveLabel[],
    activeCards: [] as ActiveCard[],
    news: [] as NewsItem[],
    activeIdx: 0, activeSuperIdx: 0, rafId: 0,
    timeouts: [] as ReturnType<typeof setTimeout>[],
    audio: null as null | { ctx: AudioContext; osc: OscillatorNode; filter: BiquadFilterNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode; },
    width: 0, height: 0,
    projected: [] as { x: number; y: number }[],
    projectedSuper: [] as { x: number; y: number }[],
    maxDist: 1, maxDistSuper: 1,
    cumDist: [] as number[], cumDistSuper: [] as number[],
    finished: false, superFinished: false, running: false,
  });

  useEffect(() => {
    const wrap = wrapRef.current, main = mainRef.current, off = offRef.current;
    if (!wrap || !main || !off) return;
    const project = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width));
      const h = Math.max(320, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;
      [main, off].forEach((c) => {
        c.width = w * dpr; c.height = h * dpr;
        c.style.width = w + "px"; c.style.height = h + "px";
        c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      stateRef.current.width = w; stateRef.current.height = h;
      const allPts = [...LINCOLN_HEIGHTS_GPS, ...LINCOLN_HEIGHTS_SUPER_GPS];
      const minLon = Math.min(...allPts.map(p => p.lon)), maxLon = Math.max(...allPts.map(p => p.lon));
      const minLat = Math.min(...allPts.map(p => p.lat)), maxLat = Math.max(...allPts.map(p => p.lat));
      const s = Math.min((w - PADDING * 2) / (maxLon - minLon), (h - PADDING * 2) / (maxLat - minLat));
      const offX = (w - (maxLon - minLon) * s) / 2;
      const offY = (h - (maxLat - minLat) * s) / 2;
      const pt = (p: GpsPoint) => ({ x: offX + (p.lon - minLon) * s, y: h - (offY + (p.lat - minLat) * s) });
      stateRef.current.projected = LINCOLN_HEIGHTS_GPS.map(pt);
      stateRef.current.projectedSuper = LINCOLN_HEIGHTS_SUPER_GPS.map(pt);
      let total = 0; const cum: number[] = [];
      for (const p of LINCOLN_HEIGHTS_GPS) { total += p.dist; cum.push(total); }
      stateRef.current.maxDist = total; stateRef.current.cumDist = cum;
      let totalS = 0; const cumS: number[] = [];
      for (const p of LINCOLN_HEIGHTS_SUPER_GPS) { totalS += p.dist; cumS.push(totalS); }
      stateRef.current.maxDistSuper = totalS; stateRef.current.cumDistSuper = cumS;
      off.getContext("2d")!.clearRect(0, 0, w, h);
      drawIdle();
    };
    project();
    const ro = new ResizeObserver(project);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchWind = async () => {
      try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=34.0724&longitude=-118.2177&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m");
        const j = await r.json(); if (cancelled) return;
        const c = j.current ?? {};
        const w: Wind = { speed: c.wind_speed_10m ?? 2, direction: c.wind_direction_10m ?? 270, gusts: c.wind_gusts_10m ?? 3 };
        stateRef.current.wind = w;
        onHud({ windSpeed: `${(w.speed * 3.6).toFixed(1)} km/h`, windDirection: `${Math.round(w.direction)}° ${compass(w.direction)}`, windGusts: `${w.gusts.toFixed(1)} m/s` });
      } catch { /* ignore */ }
    };
    fetchWind();
    const id = setInterval(fetchWind, 30000);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("https://newsapi.org/v2/everything?q=%22Lincoln+Heights%22+%22Los+Angeles%22&language=en&sortBy=publishedAt&pageSize=8&apiKey=7a465e6a1c994a47af01a22a82d8f362");
        const j = await r.json(); if (cancelled) return;
        const arts = (j.articles ?? []) as Array<{ source: { name: string }; title: string }>;
        const n = LINCOLN_HEIGHTS_GPS.length;
        stateRef.current.news = arts.slice(0, 8).map((a, i) => ({ source: a.source?.name ?? "News", title: a.title ?? "", idx: Math.floor(((i + 1) * n) / 9) }));
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { if (playKey === 0) return; void start(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [playKey]);
  useEffect(() => { return () => stop(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  function drawIdle() {
    const main = mainRef.current; if (!main) return;
    const ctx = main.getContext("2d")!;
    const { width: w, height: h } = stateRef.current;
    ctx.fillStyle = "#1a1015"; ctx.fillRect(0, 0, w, h);
    const off = offRef.current; if (off) ctx.drawImage(off, 0, 0, w, h);
    drawLocationLabel(ctx);
  }

  function drawLocationLabel(ctx: CanvasRenderingContext2D) {
    const { width: w, height: h } = stateRef.current;
    ctx.save(); ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
    ctx.fillText("LINCOLN HEIGHTS", w / 2, h * 0.82);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "17px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
    ctx.fillText("Los Angeles, California", w / 2, h * 0.82 + 28);
    ctx.restore();
  }

  function spawnParticle() {
    const { width: w, height: h, wind } = stateRef.current;
    const rad = ((wind.direction + 180) * Math.PI) / 180;
    const speed = Math.max(0.4, wind.speed * 0.25);
    return { x: Math.random() * w, y: Math.random() * h, vx: Math.sin(rad) * speed, vy: -Math.cos(rad) * speed, life: 0, maxLife: 80 + Math.random() * 120, trail: [] } as Particle;
  }

  function initAudio() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator(), filter = ctx.createBiquadFilter(), gain = ctx.createGain(), lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    osc.type = "triangle"; osc.frequency.value = 100;
    filter.type = "lowpass"; filter.frequency.value = 600; filter.Q.value = 2;
    gain.gain.value = 0; lfo.type = "sine"; lfo.frequency.value = 0.5; lfoGain.gain.value = 5;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency); osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(); lfo.start();
    stateRef.current.audio = { ctx, osc, filter, gain, lfo, lfoGain };
  }

  function clickSuperAt(t: number, dist: number) {
    const a = stateRef.current.audio; if (!a) return;
    const { ctx } = a;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 4;
    bp.frequency.value = mapRange(dist, 0, stateRef.current.maxDistSuper, 400, 2000);
    const g = ctx.createGain();
    const vol = mapRange(dist, 0, stateRef.current.maxDistSuper, 0.08, 0.45);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination);
    src.start(t); src.stop(t + 0.05);
  }

  async function start() {
    if (stateRef.current.running) return;
    stateRef.current.running = true; stateRef.current.finished = false; stateRef.current.superFinished = false;
    setRunning(true); setFinished(false);
    const off = offRef.current;
    if (off) off.getContext("2d")!.clearRect(0, 0, stateRef.current.width, stateRef.current.height);
    stateRef.current.activeLabels = []; stateRef.current.activeCards = [];
    stateRef.current.activeIdx = 0; stateRef.current.activeSuperIdx = 0;
    initAudio();

    // Main route
    const pts = LINCOLN_HEIGHTS_GPS, total = stateRef.current.maxDist;
    let elapsed = 0;
    for (let i = 1; i < pts.length; i++) {
      const dur = Math.max(30, (pts[i].dist / total) * TOTAL_MS);
      const at = elapsed, ii = i, dd = dur;
      stateRef.current.timeouts.push(setTimeout(() => stepSegment(ii, dd / 1000), at));
      elapsed += dur;
    }
    stateRef.current.timeouts.push(setTimeout(() => finishMain(), elapsed + 200));

    // Super route — proportional to its own distance
    const ptsS = LINCOLN_HEIGHTS_SUPER_GPS, totalS = stateRef.current.maxDistSuper;
    const superTotalMs = TOTAL_MS * (totalS / total);
    let elapsedS = 0;
    for (let i = 1; i < ptsS.length; i++) {
      const dur = Math.max(30, (ptsS[i].dist / totalS) * superTotalMs);
      const at = elapsedS, ii = i, dd = dur;
      stateRef.current.timeouts.push(setTimeout(() => stepSuperSegment(ii, dd / 1000), at));
      elapsedS += dur;
    }
    stateRef.current.timeouts.push(setTimeout(() => finishSuper(), elapsedS + 200));

    const loop = () => { render(); stateRef.current.rafId = requestAnimationFrame(loop); };
    stateRef.current.rafId = requestAnimationFrame(loop);
  }

  function stepSegment(i: number, segSec: number) {
    const proj = stateRef.current.projected, off = offRef.current; if (!off) return;
    const oc = off.getContext("2d")!, a = stateRef.current.audio;
    const cum = stateRef.current.cumDist, total = stateRef.current.maxDist;
    const seg = LINCOLN_HEIGHTS_GPS[i], cumNow = cum[i];
    const normDist = cumNow / total, normSlope = Math.min(1, Math.abs(seg.slope) / 0.2);
    const lw = Math.max(1.5, (1 - normDist) * 14 + normSlope * 6);
    let color = "#e664a0";
    if (seg.slope > 0.05) color = "#ff5028";
    else if (seg.slope < -0.05) color = "#ffbe28";
    oc.save(); oc.globalAlpha = 0.3; oc.strokeStyle = color; oc.lineWidth = lw; oc.lineCap = "round";
    oc.beginPath(); oc.moveTo(proj[i - 1].x, proj[i - 1].y); oc.lineTo(proj[i].x, proj[i].y); oc.stroke(); oc.restore();
    stateRef.current.activeIdx = i;
    if (a) {
      const t = a.ctx.currentTime;
      const cutoff = mapRange(cumNow, 0, total, 200, 3000) + stateRef.current.wind.gusts * 80;
      const gainV = mapRange(Math.max(0, seg.slope), -0.1, 0.3, 0.08, 0.22);
      a.osc.frequency.linearRampToValueAtTime(seg.ele, t + segSec);
      a.filter.frequency.linearRampToValueAtTime(cutoff, t + segSec);
      a.gain.gain.linearRampToValueAtTime(gainV, t + segSec);
      a.lfo.frequency.linearRampToValueAtTime(mapRange(stateRef.current.wind.speed, 0, 15, 0.2, 3), t + segSec);
      a.lfoGain.gain.linearRampToValueAtTime(mapRange(stateRef.current.wind.speed, 0, 15, 1, 20), t + segSec);
    }
    onHud({ frequency: `${Math.round(seg.ele)} Hz`, cutoff: `${Math.round(mapRange(cumNow, 0, total, 200, 3000))} Hz`, elevation: `${seg.ele} m`, slope: `${seg.slope > 0 ? "+" : ""}${seg.slope.toFixed(3)}` });
    const streetText = STREET_LABELS[i];
    if (streetText) stateRef.current.activeLabels.push({ idx: i, text: streetText, age: 0, maxAge: 180, fadeIn: 15 });
    const news = stateRef.current.news.find((n) => n.idx === i);
    if (news) stateRef.current.activeCards.push({ idx: i, news, age: 0, maxAge: 360 });
  }

  function stepSuperSegment(i: number, _segSec: number) {
    const proj = stateRef.current.projectedSuper, off = offRef.current; if (!off) return;
    const oc = off.getContext("2d")!, a = stateRef.current.audio;
    const cum = stateRef.current.cumDistSuper, total = stateRef.current.maxDistSuper;
    const seg = LINCOLN_HEIGHTS_SUPER_GPS[i], cumNow = cum[i];
    const normDist = cumNow / total, normSlope = Math.min(1, Math.abs(seg.slope) / 0.2);
    const lw = Math.max(1.5, (1 - normDist) * 14 + normSlope * 6);
    let color = "#7b61ff";
    if (seg.slope > 0.05) color = "#00d4ff";
    else if (seg.slope < -0.05) color = "#00ff9d";
    oc.save(); oc.globalAlpha = 0.3; oc.strokeStyle = color; oc.lineWidth = lw; oc.lineCap = "round";
    oc.beginPath(); oc.moveTo(proj[i - 1].x, proj[i - 1].y); oc.lineTo(proj[i].x, proj[i].y); oc.stroke(); oc.restore();
    stateRef.current.activeSuperIdx = i;
    if (a && i % 4 === 0) clickSuperAt(a.ctx.currentTime + 0.001, cumNow);
    const streetText = SUPER_STREET_LABELS[i];
    if (streetText) stateRef.current.activeLabels.push({ idx: i, text: streetText, age: 0, maxAge: 180, fadeIn: 15, isSuper: true });
  }

  function finishMain() { stateRef.current.finished = true; if (stateRef.current.superFinished) finishAll(); }
  function finishSuper() { stateRef.current.superFinished = true; if (stateRef.current.finished) finishAll(); }

  function finishAll() {
    stateRef.current.running = false; setRunning(false); setFinished(true); onFinish();
    const a = stateRef.current.audio;
    if (a) {
      const t = a.ctx.currentTime;
      a.gain.gain.linearRampToValueAtTime(0, t + 1.5);
      setTimeout(() => { try { a.osc.stop(); a.lfo.stop(); a.ctx.close(); } catch { /* */ } stateRef.current.audio = null; }, 1700);
    }
  }

  function render() {
    const main = mainRef.current, off = offRef.current; if (!main || !off) return;
    const ctx = main.getContext("2d")!;
    const { width: w, height: h, projected: proj, projectedSuper: projS } = stateRef.current;
    ctx.fillStyle = "#1a1015"; ctx.fillRect(0, 0, w, h); ctx.drawImage(off, 0, 0, w, h);

    // Wind particles
    const particles = stateRef.current.particles;
    while (particles.length < 150) particles.push(spawnParticle());
    ctx.save(); ctx.lineWidth = 1.5; ctx.lineCap = "round";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life++;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > Math.max(12, stateRef.current.wind.speed * 3.5)) p.trail.shift();
      const lifeT = p.life / p.maxLife;
      const alpha = (lifeT < 0.2 ? lifeT / 0.2 : lifeT > 0.8 ? (1 - lifeT) / 0.2 : 1) * 0.55;
      ctx.strokeStyle = `rgba(125,211,252,${Math.max(0, Math.min(1, alpha))})`;
      ctx.beginPath();
      p.trail.forEach((t, j) => j === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y));
      ctx.stroke();
      if (p.life >= p.maxLife || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) particles[i] = spawnParticle();
    }
    ctx.restore();

    // Active dot — main route
    const idx = stateRef.current.activeIdx;
    if (stateRef.current.running && !stateRef.current.finished && idx > 0 && idx < proj.length) {
      const seg = LINCOLN_HEIGHTS_GPS[idx], cumNow = stateRef.current.cumDist[idx];
      const normSlope = Math.min(1, Math.abs(seg.slope) / 0.2);
      const r = Math.max(2, ((1 - cumNow / stateRef.current.maxDist) * 14 + normSlope * 6) / 1.5);
      let color = "#e664a0";
      if (seg.slope > 0.05) color = "#ff5028"; else if (seg.slope < -0.05) color = "#ffbe28";
      ctx.save(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(proj[idx].x, proj[idx].y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // Active dot — super route
    const idxS = stateRef.current.activeSuperIdx;
    if (stateRef.current.running && !stateRef.current.superFinished && idxS > 0 && idxS < projS.length) {
      const seg = LINCOLN_HEIGHTS_SUPER_GPS[idxS], cumNow = stateRef.current.cumDistSuper[idxS];
      const normSlope = Math.min(1, Math.abs(seg.slope) / 0.2);
      const r = Math.max(2, ((1 - cumNow / stateRef.current.maxDistSuper) * 14 + normSlope * 6) / 1.5);
      let color = "#7b61ff";
      if (seg.slope > 0.05) color = "#00d4ff"; else if (seg.slope < -0.05) color = "#00ff9d";
      ctx.save(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(projS[idxS].x, projS[idxS].y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // Street labels
    ctx.save(); ctx.font = "11px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif";
    const labels = stateRef.current.activeLabels;
    for (let i = labels.length - 1; i >= 0; i--) {
      const L = labels[i]; L.age++;
      let alpha = L.age < L.fadeIn ? L.age / L.fadeIn : L.age > L.maxAge - 30 ? Math.max(0, (L.maxAge - L.age) / 30) : 1;
      const p = L.isSuper ? projS[Math.min(L.idx, projS.length - 1)] : proj[L.idx];
      const lx = Math.min(w - 90, Math.max(10, p.x + 18)), ly = Math.max(20, p.y - 18);
      ctx.strokeStyle = L.isSuper ? `rgba(123,97,255,${alpha * 0.4})` : `rgba(255,255,255,${alpha * 0.5})`;
      ctx.lineWidth = 0.75; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.fillStyle = L.isSuper ? `rgba(123,97,255,${alpha * 0.9})` : `rgba(255,255,255,${alpha * 0.85})`;
      ctx.fillText(L.text, lx + 4, ly);
      if (L.age >= L.maxAge) labels.splice(i, 1);
    }
    ctx.restore();

    // News cards
    const cards = stateRef.current.activeCards;
    for (let i = cards.length - 1; i >= 0; i--) {
      const C = cards[i]; C.age++;
      const alpha = C.age < 15 ? C.age / 15 : C.age > C.maxAge - 60 ? Math.max(0, (C.maxAge - C.age) / 60) : 1;
      const p = proj[C.idx], cw = 230;
      const lines = wrapText(C.news.title, 38).slice(0, 3);
      const ch = 24 + lines.length * 16 + 12;
      const cx = Math.max(10, Math.min(w - cw - 10, p.x + 30)), cy = Math.max(10, Math.min(h - ch - 10, p.y - ch - 20));
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(125,211,252,0.5)"; ctx.lineWidth = 0.75;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(cx + 8, cy + ch / 2); ctx.stroke();
      ctx.fillStyle = "rgba(10,5,15,0.82)"; ctx.strokeStyle = "rgba(125,211,252,0.4)"; ctx.lineWidth = 1;
      roundRect(ctx, cx, cy, cw, ch, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(125,211,252,1)"; ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.fillText(C.news.source.toUpperCase(), cx + 10, cy + 16);
      ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.font = "12px -apple-system, sans-serif";
      lines.forEach((ln, k) => ctx.fillText(ln, cx + 10, cy + 34 + k * 16));
      ctx.restore();
      if (C.age >= C.maxAge) cards.splice(i, 1);
    }

    if (!stateRef.current.running || (stateRef.current.finished && stateRef.current.superFinished)) drawLocationLabel(ctx);
  }

  function wrapText(text: string, max: number): string[] {
    const words = text.split(/\s+/), out: string[] = []; let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max) { if (cur) out.push(cur); cur = w; }
      else cur = (cur + " " + w).trim();
    }
    if (cur) out.push(cur); return out;
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function stop() {
    cancelAnimationFrame(stateRef.current.rafId);
    stateRef.current.timeouts.forEach((t) => clearTimeout(t)); stateRef.current.timeouts = [];
    const a = stateRef.current.audio;
    if (a) { try { a.osc.stop(); a.lfo.stop(); a.ctx.close(); } catch { /* */ } stateRef.current.audio = null; }
    stateRef.current.running = false;
  }

  void running; void finished;

  return (
    <div ref={wrapRef} className="engine-wrap">
      <canvas ref={offRef} style={{ display: "none" }} />
      <canvas ref={mainRef} className="engine-canvas" />
    </div>
  );
}
