import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "GPX Crop Tool — FiveCrops" },
      { name: "description", content: "Process and export your GPX routes — FiveCrops / PedaLúdico." },
    ],
  }),
  component: ToolsPage,
});

const S: Record<string, React.CSSProperties> = {
  page: { display:"flex", flexDirection:"column", minHeight:"100vh", background:"#0a0a0a", color:"rgba(232,232,224,0.92)", fontFamily:"'Space Mono',monospace", fontSize:12 },
  nav: { padding:"20px 32px", borderBottom:"1px solid rgba(232,232,224,0.08)", display:"flex", alignItems:"baseline", gap:16 },
  navA: { color:"#c8f5d0", textDecoration:"none", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase" as const },
  navSpan: { color:"rgba(232,232,224,0.4)", fontSize:11 },
  main: { display:"grid", gridTemplateColumns:"340px 1fr", flex:1, minHeight:0, height:"calc(100vh - 61px)" },
  panel: { borderRight:"1px solid rgba(232,232,224,0.08)", padding:20, display:"flex", flexDirection:"column", gap:16, overflowY:"auto" as const },
  sectionLabel: { fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase" as const, color:"rgba(232,232,224,0.4)", marginBottom:6 },
  dropZone: { border:"1px dashed rgba(200,245,208,0.25)", borderRadius:2, padding:"24px 12px", textAlign:"center" as const, cursor:"pointer", background:"rgba(200,245,208,0.02)", transition:"all 0.2s" },
  dropZoneOver: { border:"1px dashed #c8f5d0", background:"rgba(200,245,208,0.06)" },
  icon: { fontSize:20, marginBottom:8, opacity:0.4 },
  dropText: { fontSize:11, color:"rgba(232,232,224,0.5)", lineHeight:1.8 },
  fileItem: { display:"flex", alignItems:"center", padding:"5px 8px", background:"#111", borderRadius:2, fontSize:10, marginBottom:3 },
  fieldRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  field: { display:"flex", flexDirection:"column", gap:4 },
  label: { fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase" as const, color:"rgba(232,232,224,0.5)" },
  input: { background:"#111", border:"1px solid rgba(232,232,224,0.1)", borderRadius:2, color:"rgba(232,232,224,0.92)", fontFamily:"'Space Mono',monospace", fontSize:12, padding:"7px 8px", outline:"none", width:"100%" },
  hint: { fontSize:10, color:"rgba(232,232,224,0.4)", lineHeight:1.7, fontStyle:"italic" as const },
  btnPrimary: { padding:"10px 12px", borderRadius:2, border:"none", cursor:"pointer", fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, background:"#c8f5d0", color:"#0a0a0a", width:"100%" },
  btnSecondary: { padding:"10px 12px", borderRadius:2, border:"1px solid rgba(232,232,224,0.1)", cursor:"pointer", fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, background:"transparent", color:"rgba(232,232,224,0.5)", width:"100%" },
  btnGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:8 },
  stats: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 },
  stat: { background:"#111", borderRadius:2, padding:10 },
  statVal: { fontSize:18, color:"#c8f5d0", fontWeight:700 },
  statLbl: { fontSize:9, color:"rgba(232,232,224,0.4)", textTransform:"uppercase" as const, letterSpacing:"0.12em", marginTop:2 },
  textarea: { width:"100%", height:80, background:"#111", border:"1px solid rgba(232,232,224,0.1)", borderRadius:2, color:"#c8f5d0", fontFamily:"'Space Mono',monospace", fontSize:10, padding:8, resize:"vertical" as const, outline:"none" },
  preview: { position:"relative" as const, background:"#0a0a0a" },
  previewInfo: { position:"absolute" as const, top:12, right:14, fontSize:10, color:"rgba(232,232,224,0.35)", textAlign:"right" as const, lineHeight:1.8, pointerEvents:"none" as const, whiteSpace:"pre" as const },
  footer: { borderTop:"1px solid rgba(232,232,224,0.08)", background:"#111", flexShrink:0 },
  footerToggle: { display:"flex", alignItems:"center", gap:10, padding:"12px 24px", cursor:"pointer", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"rgba(232,232,224,0.35)" },
};

type Route = { name: string; pts: number[][]; _source?: string };

function parseGPX(text: string): Route[] {
  const xml = new DOMParser().parseFromString(text, "text/xml");
  const routes: Route[] = [];
  const extract = (sel: string, ptSel: string) => {
    xml.querySelectorAll(sel).forEach(el => {
      const name = el.querySelector("name")?.textContent || "route";
      const pts: number[][] = [];
      el.querySelectorAll(ptSel).forEach(pt => {
        const lat = parseFloat(pt.getAttribute("lat") || "");
        const lon = parseFloat(pt.getAttribute("lon") || "");
        const ele = parseFloat(pt.querySelector("ele")?.textContent || "0");
        if (!isNaN(lat) && !isNaN(lon)) pts.push([lon, lat, ele]);
      });
      if (pts.length > 1) routes.push({ name, pts });
    });
  };
  extract("trk", "trkpt");
  extract("rte", "rtept");
  return routes;
}

function parseGeoJSON(text: string): Route[] {
  const data = JSON.parse(text);
  const routes: Route[] = [];
  const features = data.type === "FeatureCollection" ? data.features : [data];
  features.forEach((f: any) => {
    if (!f.geometry) return;
    const name = f.properties?.name || "route";
    if (f.geometry.type === "LineString") {
      const pts = f.geometry.coordinates.map((c: number[]) => [c[0], c[1], c[2] || 0]);
      if (pts.length > 1) routes.push({ name, pts });
    } else if (f.geometry.type === "MultiLineString") {
      f.geometry.coordinates.forEach((line: number[][], i: number) => {
        const pts = line.map((c: number[]) => [c[0], c[1], c[2] || 0]);
        if (pts.length > 1) routes.push({ name: name + "_" + i, pts });
      });
    }
  });
  return routes;
}

function ToolsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [processedRoutes, setProcessedRoutes] = useState<Route[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [centerLat, setCenterLat] = useState("");
  const [centerLon, setCenterLon] = useState("");
  const [deltaLat, setDeltaLat] = useState("");
  const [deltaLon, setDeltaLon] = useState("");
  const [maxPts, setMaxPts] = useState("200");
  const [minPts, setMinPts] = useState("2");
  const [hardCrop, setHardCrop] = useState(false);
  const [stats, setStats] = useState<{routes:number,pts:number,cropped:number,ele:string}|null>(null);
  const [outputJson, setOutputJson] = useState("");
  const [msg, setMsg] = useState<{text:string,type:string}|null>(null);
  const [previewInfo, setPreviewInfo] = useState("no data");
  const [footerOpen, setFooterOpen] = useState(false);

  const drawPreview = useCallback((routes: Route[], processed: Route[], cLat: string, cLon: string, dLat: string, dLon: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, W, H);
    const display = processed.length ? processed : routes;
    if (!display.length) { setPreviewInfo("no data"); return; }
    const allPts = display.flatMap(r => r.pts);
    const lons = allPts.map(p => p[0]), lats = allPts.map(p => p[1]);
    const minLon = Math.min(...lons), maxLon = Math.max(...lons);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const pad = 32;
    const toX = (lon: number) => pad + (lon - minLon) / (maxLon - minLon + 1e-9) * (W - pad * 2);
    const toY = (lat: number) => (H - pad) - (lat - minLat) / (maxLat - minLat + 1e-9) * (H - pad * 2);
    const cl = parseFloat(cLat), clo = parseFloat(cLon), dl = parseFloat(dLat), dlo = parseFloat(dLon);
    if (!isNaN(cl) && !isNaN(clo) && !isNaN(dl) && !isNaN(dlo)) {
      ctx.strokeStyle = "rgba(200,245,208,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.strokeRect(toX(clo - dlo), toY(cl + dl), toX(clo + dlo) - toX(clo - dlo), toY(cl - dl) - toY(cl + dl));
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(200,245,208,0.8)"; ctx.beginPath(); ctx.arc(toX(clo), toY(cl), 3, 0, Math.PI * 2); ctx.fill();
    }
    const ip = processed.length > 0;
    display.forEach((route, i) => {
      const hue = (i * 360 / display.length + 160) % 360;
      ctx.strokeStyle = `hsla(${hue},60%,65%,${ip ? 0.85 : 0.25})`; ctx.lineWidth = ip ? 1.5 : 0.6;
      ctx.beginPath();
      route.pts.forEach((pt, j) => j === 0 ? ctx.moveTo(toX(pt[0]), toY(pt[1])) : ctx.lineTo(toX(pt[0]), toY(pt[1])));
      ctx.stroke();
    });
    setPreviewInfo(`${display.length} routes · ${allPts.length} pts\nLon ${minLon.toFixed(4)} → ${maxLon.toFixed(4)}\nLat ${minLat.toFixed(4)} → ${maxLat.toFixed(4)}`);
  }, []);

  useEffect(() => {
    drawPreview(allRoutes, processedRoutes, centerLat, centerLon, deltaLat, deltaLon);
  }, [allRoutes, processedRoutes, centerLat, centerLon, deltaLat, deltaLon, drawPreview]);

  useEffect(() => {
    const handleResize = () => drawPreview(allRoutes, processedRoutes, centerLat, centerLon, deltaLat, deltaLon);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allRoutes, processedRoutes, centerLat, centerLon, deltaLat, deltaLon, drawPreview]);

  function loadFiles(files: File[]) {
    const valid = files.filter(f => f.name.match(/\.(gpx|geojson)$/i));
    if (!valid.length) { setMsg({text:"Only .gpx or .geojson",type:"err"}); return; }
    let pending = valid.length;
    valid.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        let routes: Route[] = [];
        try {
          routes = file.name.match(/\.geojson$/i) || text.trim().startsWith("{") ? parseGeoJSON(text) : parseGPX(text);
        } catch { setMsg({text:"Error parsing "+file.name,type:"err"}); }
        routes.forEach(r => r._source = file.name);
        setAllRoutes(prev => {
          const next = [...prev, ...routes];
          if (--pending === 0) setMsg({text:`${next.length} routes loaded`,type:"ok"});
          return next;
        });
      };
      reader.readAsText(file);
    });
  }

  function process() {
    const cLat = parseFloat(centerLat), cLon = parseFloat(centerLon);
    const dLat = parseFloat(deltaLat), dLon = parseFloat(deltaLon);
    const mxP = parseInt(maxPts), mnP = parseInt(minPts);
    const minLat = cLat - dLat, maxLat = cLat + dLat;
    const minLon = cLon - dLon, maxLon = cLon + dLon;
    const inBox = (p: number[]) => p[1] >= minLat && p[1] <= maxLat && p[0] >= minLon && p[0] <= maxLon;
    let cropped = 0;
    const result: Route[] = [];
    allRoutes.forEach(route => {
      let pts = hardCrop ? route.pts.filter(inBox) : (route.pts.some(inBox) ? route.pts : []);
      if (pts.length < mnP) { cropped++; return; }
      if (pts.length > mxP) { const step = pts.length / mxP; pts = Array.from({length:mxP},(_,i)=>pts[Math.floor(i*step)]); }
      result.push({ name: route.name, pts: pts.map(p => [Math.round(p[0]*1e6)/1e6, Math.round(p[1]*1e6)/1e6, Math.round(p[2]*10)/10]) });
    });
    const allPts = result.flatMap(r => r.pts);
    const eles = allPts.map(p => p[2]).filter(e => e > 0);
    setStats({ routes: result.length, pts: allPts.length, cropped, ele: eles.length ? Math.round(Math.min(...eles))+"–"+Math.round(Math.max(...eles))+"m" : "—" });
    const json = JSON.stringify(result);
    setOutputJson(json);
    setProcessedRoutes(result);
    setMsg({text:`✓ ${result.length} routes · ${allPts.length} pts · ${Math.round(json.length/1024)}KB`,type:"ok"});
  }

  function dl(content: string, name: string, type: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], {type}));
    a.download = name; a.click();
  }

  function downloadGeoJSON() {
    const routes = JSON.parse(outputJson || "[]");
    const geojson = { type:"FeatureCollection", features: routes.map((r: Route) => ({ type:"Feature", geometry:{type:"LineString",coordinates:r.pts.map(p=>[p[0],p[1],p[2]])}, properties:{name:r.name,stroke:"#c8f5d0","stroke-width":2,"stroke-opacity":0.8} })) };
    dl(JSON.stringify(geojson,null,2),"routes_crop.geojson","application/geo+json");
    setMsg({text:"GeoJSON ready for uMap / QGIS / Scrbbble",type:"ok"});
  }

  function downloadP5() {
    const routes = JSON.parse(outputJson || "[]");
    const allPts = routes.flatMap((r: Route) => r.pts);
    const lons = allPts.map((p: number[]) => p[0]), lats = allPts.map((p: number[]) => p[1]), eles = allPts.map((p: number[]) => p[2]);
    const B = { minLon:Math.min(...lons),maxLon:Math.max(...lons),minLat:Math.min(...lats),maxLat:Math.max(...lats),minEle:Math.min(...eles),maxEle:Math.max(...eles) };
    const sketch = `// Flowing Cartographies — FiveCrops GPX Crop Tool\nconst ROUTES=${JSON.stringify(routes)};\nconst B=${JSON.stringify(B)};\nconst DURATION=60;let idx=[];\nfunction setup(){createCanvas(windowWidth,windowHeight);colorMode(HSB,360,100,100,100);background(240,10,4);idx=ROUTES.map(()=>0);}\nfunction geoX(lon){return map(lon,B.minLon,B.maxLon,60,width-60);}\nfunction geoY(lat){return map(lat,B.minLat,B.maxLat,height-60,60);}\nfunction draw(){\n  let t=(frameCount/60)%DURATION,progress=t/DURATION;\n  fill(240,10,4,3);noStroke();rect(0,0,width,height);\n  ROUTES.forEach((route,i)=>{\n    if(idx[i]>=route.pts.length-1)return;\n    let hue=((progress*140+160)+i*(360/ROUTES.length))%360,pt=route.pts[idx[i]],ptN=route.pts[idx[i]+1];\n    let ele=map(pt[2],B.minEle,B.maxEle,0,1);\n    stroke(hue,80,map(ele,0,1,60,100),map(progress,0,1,40,85));\n    strokeWeight(map(ele,0,1,1.5,5));\n    line(geoX(pt[0]),geoY(pt[1]),geoX(ptN[0]),geoY(ptN[1]));\n    idx[i]=min(idx[i]+max(1,floor(route.pts.length/(DURATION*60*0.08))),route.pts.length-1);\n  });\n  if(progress>0.93){fill(240,10,4,map(progress,0.93,1,0,80));noStroke();rect(0,0,width,height);}\n  if(t<0.1&&frameCount>60){idx=ROUTES.map(()=>0);background(240,10,4);}\n}\nfunction windowResized(){resizeCanvas(windowWidth,windowHeight);background(240,10,4);idx=ROUTES.map(()=>0);}`;
    dl(sketch,"sketch_crop.js","text/javascript");
    setMsg({text:"p5.js sketch ready — paste in editor.p5js.org",type:"ok"});
  }

  const sources: Record<string,number> = {};
  allRoutes.forEach(r => { const s = r._source||"?"; sources[s]=(sources[s]||0)+1; });

  const msgStyle: React.CSSProperties = {
    fontSize:10, padding:"6px 8px", borderRadius:2, marginTop:4, letterSpacing:"0.04em",
    background: msg?.type==="ok" ? "rgba(200,245,208,0.07)" : msg?.type==="err" ? "rgba(245,200,200,0.07)" : "rgba(255,255,255,0.03)",
    color: msg?.type==="ok" ? "#c8f5d0" : msg?.type==="err" ? "#f5c8c8" : "rgba(232,232,224,0.4)",
  };

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <a href="/" style={S.navA}>← FIVECROPS</a>
        <span style={S.navSpan}>GPX Crop Tool</span>
      </nav>

      <div style={S.main}>
        <div style={S.panel}>

          {/* 01 FILES */}
          <div>
            <div style={S.sectionLabel}>01 · Files — GPX / GeoJSON</div>
            <div
              style={{...S.dropZone, ...(isDragOver ? S.dropZoneOver : {})}}
              onClick={() => document.getElementById("fileInput")?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); loadFiles([...e.dataTransfer.files]); }}
            >
              <div style={S.icon}>⊕</div>
              <p style={S.dropText}>Drop .gpx or .geojson files here<br/>or click to select<br/>Multiple files supported</p>
            </div>
            <input id="fileInput" type="file" accept=".gpx,.geojson" multiple style={{display:"none"}}
              onChange={e => { if (e.target.files) { loadFiles([...e.target.files]); e.target.value=""; } }} />
            <div style={{marginTop:8}}>
              {Object.entries(sources).map(([name, count]) => (
                <div key={name} style={S.fileItem}>
                  <span style={{color:"#c8f5d0",flex:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{name}</span>
                  <span style={{color:"rgba(232,232,224,0.4)",marginLeft:6}}>{count}r</span>
                  <span style={{color:"#f5c8c8",cursor:"pointer",marginLeft:6,opacity:0.6}}
                    onClick={() => { setAllRoutes(prev => prev.filter(r => r._source !== name)); setProcessedRoutes([]); }}>✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* 02 CROP */}
          <div>
            <div style={S.sectionLabel}>02 · Spatial Crop</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={S.fieldRow}>
                <div style={S.field}><label style={S.label}>Center LAT</label><input style={S.input} type="number" step="0.0001" placeholder="e.g. 34.0697" value={centerLat} onChange={e=>setCenterLat(e.target.value)}/></div>
                <div style={S.field}><label style={S.label}>Center LON</label><input style={S.input} type="number" step="0.0001" placeholder="e.g. -118.2277" value={centerLon} onChange={e=>setCenterLon(e.target.value)}/></div>
              </div>
              <div style={S.fieldRow}>
                <div style={S.field}><label style={S.label}>Delta LAT ±</label><input style={S.input} type="number" step="0.001" placeholder="e.g. 0.02" value={deltaLat} onChange={e=>setDeltaLat(e.target.value)}/></div>
                <div style={S.field}><label style={S.label}>Delta LON ±</label><input style={S.input} type="number" step="0.001" placeholder="e.g. 0.025" value={deltaLon} onChange={e=>setDeltaLon(e.target.value)}/></div>
              </div>
              <p style={S.hint}>ΔLat 0.01 ≈ 1.1km · ΔLon 0.01 ≈ 0.9km (LA)</p>
              <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>setHardCrop(!hardCrop)}>
                <div style={{width:30,height:16,background:hardCrop?"#c8f5d0":"rgba(255,255,255,0.08)",borderRadius:8,position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                  <div style={{position:"absolute",width:10,height:10,background:"white",borderRadius:"50%",top:3,left:hardCrop?17:3,transition:"left 0.2s"}}/>
                </div>
                <span style={{fontSize:11}}>Cut routes at bbox border</span>
              </div>
              <p style={S.hint}>{hardCrop ? "Mode: cuts exactly at the bbox border" : "Mode: includes full route if it touches the bbox"}</p>
            </div>
          </div>

          {/* 03 OPTIONS */}
          <div>
            <div style={S.sectionLabel}>03 · Options</div>
            <div style={S.fieldRow}>
              <div style={S.field}><label style={S.label}>Max pts / route</label><input style={S.input} type="number" value={maxPts} step="50" min="10" onChange={e=>setMaxPts(e.target.value)}/></div>
              <div style={S.field}><label style={S.label}>Min pts</label><input style={S.input} type="number" value={minPts} step="1" min="1" onChange={e=>setMinPts(e.target.value)}/></div>
            </div>
          </div>

          <button style={{...S.btnPrimary, opacity:allRoutes.length===0?0.3:1}} disabled={allRoutes.length===0} onClick={process}>
            Process &amp; Generate JSON
          </button>

          {/* STATS */}
          {stats && (
            <div style={S.stats}>
              <div style={S.stat}><div style={S.statVal}>{stats.routes}</div><div style={S.statLbl}>Routes</div></div>
              <div style={S.stat}><div style={S.statVal}>{stats.pts}</div><div style={S.statLbl}>Points</div></div>
              <div style={S.stat}><div style={S.statVal}>{stats.cropped}</div><div style={S.statLbl}>Discarded</div></div>
              <div style={S.stat}><div style={S.statVal}>{stats.ele}</div><div style={S.statLbl}>Ele range</div></div>
            </div>
          )}

          {/* OUTPUT */}
          <div>
            <div style={S.sectionLabel}>04 · Output</div>
            {outputJson && <textarea style={S.textarea} readOnly value={outputJson.length>2000?outputJson.slice(0,2000)+"\n// ...":outputJson}/>}
            {msg && <div style={msgStyle}>{msg.text}</div>}
            <div style={S.btnGrid}>
              <button style={{...S.btnPrimary,gridColumn:"1/-1"}} onClick={()=>navigator.clipboard.writeText(outputJson).then(()=>setMsg({text:"JSON copied",type:"ok"}))}>Copy JSON</button>
              <button style={S.btnSecondary} onClick={()=>dl(outputJson,"routes_crop.json","application/json")}>Download .json</button>
              <button style={S.btnSecondary} onClick={downloadGeoJSON}>Download GeoJSON</button>
              <button style={{...S.btnSecondary,gridColumn:"1/-1"}} onClick={downloadP5}>Generate p5.js sketch</button>
            </div>
          </div>

        </div>

        {/* PREVIEW */}
        <div style={S.preview}>
          <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>
          <div style={S.previewInfo}>{previewInfo}</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={S.footer}>
        <div style={S.footerToggle} onClick={()=>setFooterOpen(!footerOpen)}>
          <span style={{transition:"transform 0.2s",display:"inline-block",transform:footerOpen?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
          <span>How it works · Annotated source</span>
        </div>
        {footerOpen && (
          <div style={{padding:"0 24px 24px"}}>
            <div style={{background:"#050505",border:"1px solid rgba(232,232,224,0.08)",borderRadius:2,overflow:"auto",maxHeight:400}}>
              <pre style={{fontFamily:"'Space Mono',monospace",fontSize:10,lineHeight:1.85,color:"rgba(232,232,224,0.45)",padding:20,margin:0,whiteSpace:"pre"}}>
{`GPX CROP TOOL — Flowing Cartographies / PedaLúdico / UCLA REMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built as a React component (TSX) — no external dependencies.

FILE LOADING
  Click or drag .gpx / .geojson files onto the drop zone.
  Multiple files from different sources — each removable.
  Uses FileReader API + DOMParser for GPX (XML) parsing.
  Supports GeoJSON FeatureCollection, LineString, MultiLineString.

CROP MODES
  SOFT (default): includes full route if any point touches the bbox.
  HARD (toggle on): filters point by point, cuts at the bbox border.
  Bbox = [centerLon ± deltaLon] × [centerLat ± deltaLat]

PREVIEW CANVAS
  Redraws on every parameter change in real time.
  Shows bbox as dashed rectangle + center dot.
  Loaded routes: faint. Processed routes: colored by index (HSB).

EXPORTS
  JSON     → [{name, pts: [[lon,lat,ele],...]}] for p5.js / SALI
  GeoJSON  → RFC 7946 FeatureCollection for uMap / QGIS / Scrbbble
  p5.js    → ready-to-paste sketch for editor.p5js.org`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
