import { useEffect } from "react";

export default function Tools() {
  useEffect(() => {
    document.title = "GPX Crop Tool — FiveCrops";
  }, []);

  return (
    <div
      style={{ margin: 0, padding: 0 }}
      dangerouslySetInnerHTML={{
        __html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GPX Crop Tool — FiveCrops</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --border: rgba(232,232,224,0.1);
  --accent: #c8f5d0;
  --accent2: #f5c8c8;
  --text: rgba(232,232,224,0.92);
  --muted: rgba(232,232,224,0.55);
  --mono: 'Space Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

nav {
  padding: 24px 40px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 20px;
}
nav a { color: var(--accent); text-decoration: none; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
nav a:hover { text-decoration: underline; }
nav span { color: var(--muted); font-size: 11px; letter-spacing: 0.08em; }

.main {
  display: grid;
  grid-template-columns: 340px 1fr;
  flex: 1;
  min-height: 0;
}

.panel {
  border-right: 1px solid var(--border);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.section-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.drop-zone {
  border: 1px dashed rgba(200,245,208,0.25);
  border-radius: 2px;
  padding: 28px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(200,245,208,0.02);
}
.drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); background: rgba(200,245,208,0.05); }
.drop-zone input { display: none; }
.drop-zone .icon { font-size: 20px; margin-bottom: 10px; opacity: 0.3; }
.drop-zone p { font-size: 11px; color: var(--muted); line-height: 1.8; }

.file-list { display: flex; flex-direction: column; gap: 3px; }
.file-item {
  display: flex; align-items: center;
  padding: 5px 8px; background: var(--surface); border-radius: 2px;
  font-size: 10px;
}
.file-item .name { color: var(--accent); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; }
.file-item .pts { color: var(--muted); flex-shrink: 0; margin-left: 6px; }
.file-item .remove { color: var(--accent2); cursor: pointer; opacity: 0.5; flex-shrink: 0; margin-left: 6px; }
.file-item .remove:hover { opacity: 1; }

.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
.field input {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 2px; color: var(--text); font-family: var(--mono);
  font-size: 12px; padding: 7px 8px; outline: none; transition: border-color 0.2s; width: 100%;
}
.field input:focus { border-color: var(--accent); }
.field input::placeholder { color: var(--muted); opacity: 1; }
.hint { font-size: 10px; color: var(--muted); line-height: 1.7; font-style: italic; }

.toggle-wrap { display: flex; flex-direction: column; gap: 5px; }
.toggle-label { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.toggle-label input { display: none; }
.toggle-track {
  width: 30px; height: 16px; background: rgba(255,255,255,0.08);
  border-radius: 8px; position: relative; flex-shrink: 0; transition: background 0.2s;
}
.toggle-label input:checked + .toggle-track { background: var(--accent); }
.toggle-thumb {
  position: absolute; width: 10px; height: 10px;
  background: white; border-radius: 50%; top: 3px; left: 3px; transition: left 0.2s;
}
.toggle-label input:checked + .toggle-track .toggle-thumb { left: 17px; }
.toggle-text { font-size: 11px; color: var(--text); }

.btn {
  padding: 10px 12px; border-radius: 2px; border: none; cursor: pointer;
  font-family: var(--mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.15s; width: 100%;
}
.btn-primary { background: var(--accent); color: #0a0a0a; }
.btn-primary:hover { background: #a8f0bc; }
.btn-primary:disabled { opacity: 0.25; cursor: not-allowed; }
.btn-secondary { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.btn-secondary:hover { color: var(--text); border-color: rgba(232,232,224,0.25); }

.btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; }
.btn-grid .span2 { grid-column: 1 / -1; }

.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.stat { background: var(--surface); border-radius: 2px; padding: 10px; }
.stat .val { font-size: 18px; color: var(--accent); font-weight: 700; }
.stat .lbl { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 2px; }

textarea.output {
  width: 100%; height: 80px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 2px;
  color: var(--accent); font-family: var(--mono); font-size: 10px;
  padding: 8px; resize: vertical; outline: none;
}

.msg { font-size: 10px; padding: 6px 8px; border-radius: 2px; margin-top: 4px; letter-spacing: 0.04em; }
.msg.ok   { background: rgba(200,245,208,0.07); color: var(--accent); }
.msg.err  { background: rgba(245,200,200,0.07); color: var(--accent2); }
.msg.info { background: rgba(255,255,255,0.03); color: var(--muted); }

.preview { position: relative; background: var(--bg); }
canvas { width: 100%; height: 100%; display: block; }
.preview-info {
  position: absolute; top: 16px; right: 16px;
  font-size: 10px; color: var(--muted);
  text-align: right; line-height: 1.8; pointer-events: none; white-space: pre;
  letter-spacing: 0.05em;
}

footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.footer-toggle {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 24px; cursor: pointer;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
  user-select: none; transition: color 0.2s;
}
.footer-toggle:hover { color: var(--text); }
.footer-arrow { transition: transform 0.2s; display: inline-block; }
.footer-toggle.open .footer-arrow { transform: rotate(90deg); }
.footer-body { display: none; padding: 0 24px 24px; }
.footer-body.open { display: block; }
.code-wrap {
  position: relative; background: #050505;
  border: 1px solid var(--border); border-radius: 2px;
  overflow: auto; max-height: 400px;
}
.code-wrap pre {
  font-family: var(--mono); font-size: 10px; line-height: 1.85;
  color: rgba(232,232,224,0.45); padding: 20px; margin: 0; white-space: pre;
}
.copy-btn {
  position: absolute; top: 8px; right: 10px;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  border-radius: 2px; padding: 3px 8px; cursor: pointer; transition: all 0.15s;
}
.copy-btn:hover { color: var(--accent); border-color: var(--accent); }

::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

@media (max-width: 700px) {
  .main { grid-template-columns: 1fr; }
  .preview { min-height: 300px; }
  nav { padding: 16px 20px; }
  .panel { padding: 16px; }
}
</style>
</head>
<body>

<nav>
  <a href="/">← FIVECROPS</a>
  <span>GPX Crop Tool</span>
</nav>

<div class="main">
  <div class="panel">

    <div>
      <div class="section-label">01 · Files — GPX / GeoJSON</div>
      <div class="drop-zone" id="dropZone">
        <div class="icon">⊕</div>
        <p>Drop .gpx or .geojson files here<br>or click to select<br>Multiple files supported</p>
        <input type="file" id="fileInput" accept=".gpx,.geojson" multiple>
      </div>
      <div class="file-list" id="fileList" style="margin-top:8px;"></div>
    </div>

    <div>
      <div class="section-label">02 · Spatial Crop</div>
      <div class="field-group">
        <div class="field-row">
          <div class="field">
            <label>Center LAT</label>
            <input type="number" id="centerLat" step="0.0001" placeholder="e.g. 34.0697">
          </div>
          <div class="field">
            <label>Center LON</label>
            <input type="number" id="centerLon" step="0.0001" placeholder="e.g. -118.2277">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Delta LAT ±</label>
            <input type="number" id="deltaLat" step="0.001" placeholder="e.g. 0.02">
          </div>
          <div class="field">
            <label>Delta LON ±</label>
            <input type="number" id="deltaLon" step="0.001" placeholder="e.g. 0.025">
          </div>
        </div>
        <p class="hint">ΔLat 0.01 ≈ 1.1km · ΔLon 0.01 ≈ 0.9km (LA)</p>
        <div class="toggle-wrap">
          <label class="toggle-label">
            <input type="checkbox" id="hardCrop">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span class="toggle-text">Cut routes at bbox border</span>
          </label>
          <p class="hint" id="cropHint">Mode: includes full route if it touches the bbox</p>
        </div>
      </div>
    </div>

    <div>
      <div class="section-label">03 · Options</div>
      <div class="field-row">
        <div class="field">
          <label>Max pts / route</label>
          <input type="number" id="maxPts" value="200" step="50" min="10">
        </div>
        <div class="field">
          <label>Min pts</label>
          <input type="number" id="minPts" value="2" step="1" min="1">
        </div>
      </div>
    </div>

    <button class="btn btn-primary" id="btnProcess" disabled>Process & Generate JSON</button>

    <div class="stats" id="stats" style="display:none">
      <div class="stat"><div class="val" id="statRoutes">0</div><div class="lbl">Routes</div></div>
      <div class="stat"><div class="val" id="statPts">0</div><div class="lbl">Points</div></div>
      <div class="stat"><div class="val" id="statCropped">0</div><div class="lbl">Discarded</div></div>
      <div class="stat"><div class="val" id="statEle">—</div><div class="lbl">Ele range</div></div>
    </div>

    <div id="outputSection">
      <div class="section-label">04 · Output</div>
      <textarea class="output" id="output" readonly style="display:none"></textarea>
      <div id="msg" class="msg info" style="display:none"></div>
      <div class="btn-grid">
        <button class="btn btn-primary span2" id="btnCopy">Copy JSON</button>
        <button class="btn btn-secondary" id="btnDownload">Download .json</button>
        <button class="btn btn-secondary" id="btnGeoJSON">Download GeoJSON</button>
        <button class="btn btn-secondary span2" id="btnP5">Generate p5.js sketch</button>
      </div>
    </div>

  </div>

  <div class="preview">
    <canvas id="preview"></canvas>
    <div class="preview-info" id="previewInfo">no data</div>
  </div>

</div>

<footer>
  <div class="footer-toggle" id="footerToggle">
    <span class="footer-arrow">▶</span>
    <span>How it works · Annotated source</span>
  </div>
  <div class="footer-body" id="footerBody">
    <div class="code-wrap">
      <button class="copy-btn" id="copySource">copy</button>
      <pre id="codeContent"></pre>
    </div>
  </div>
</footer>

<script>
let allRoutes = [], processedRoutes = [];

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; drawPreview(); }
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 100);

function drawPreview() {
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,W,H);
  const routes = processedRoutes.length ? processedRoutes : allRoutes;
  if (!routes.length) { document.getElementById('previewInfo').textContent = 'no data'; return; }
  const allPts = routes.flatMap(r=>r.pts);
  const lons=allPts.map(p=>p[0]), lats=allPts.map(p=>p[1]);
  const minLon=Math.min(...lons), maxLon=Math.max(...lons), minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const pad=32;
  const toX=lon=>pad+(lon-minLon)/(maxLon-minLon+1e-9)*(W-pad*2);
  const toY=lat=>(H-pad)-(lat-minLat)/(maxLat-minLat+1e-9)*(H-pad*2);
  const cLat=parseFloat(document.getElementById('centerLat').value);
  const cLon=parseFloat(document.getElementById('centerLon').value);
  const dLat=parseFloat(document.getElementById('deltaLat').value);
  const dLon=parseFloat(document.getElementById('deltaLon').value);
  if (!isNaN(cLat)&&!isNaN(cLon)&&!isNaN(dLat)&&!isNaN(dLon)) {
    ctx.strokeStyle='rgba(200,245,208,0.25)'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    ctx.strokeRect(toX(cLon-dLon),toY(cLat+dLat),toX(cLon+dLon)-toX(cLon-dLon),toY(cLat-dLat)-toY(cLat+dLat));
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(200,245,208,0.8)'; ctx.beginPath(); ctx.arc(toX(cLon),toY(cLat),3,0,Math.PI*2); ctx.fill();
  }
  const ip=processedRoutes.length>0;
  routes.forEach((route,i)=>{
    const hue=(i*360/routes.length+160)%360;
    ctx.strokeStyle=\`hsla(\${hue},60%,65%,\${ip?0.85:0.25})\`; ctx.lineWidth=ip?1.5:0.6;
    ctx.beginPath();
    route.pts.forEach((pt,j)=>j===0?ctx.moveTo(toX(pt[0]),toY(pt[1])):ctx.lineTo(toX(pt[0]),toY(pt[1])));
    ctx.stroke();
  });
  document.getElementById('previewInfo').textContent=\`\${routes.length} routes · \${allPts.length} pts
Lon \${minLon.toFixed(4)} → \${maxLon.toFixed(4)}
Lat \${minLat.toFixed(4)} → \${maxLat.toFixed(4)}\`;
}

['centerLat','centerLon','deltaLat','deltaLon'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{if(allRoutes.length)drawPreview();}));

const dropZone=document.getElementById('dropZone'), fileInput=document.getElementById('fileInput');
dropZone.addEventListener('click',()=>fileInput.click());
dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('drag-over');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop',e=>{e.preventDefault();dropZone.classList.remove('drag-over');loadFiles([...e.dataTransfer.files]);});
fileInput.addEventListener('change',()=>{loadFiles([...fileInput.files]);fileInput.value='';});

function loadFiles(files) {
  const valid=files.filter(f=>f.name.match(/\\.(gpx|geojson)$/i));
  if(!valid.length){showMsg('Only .gpx or .geojson','err');return;}
  let pending=valid.length;
  valid.forEach(file=>{
    const r=new FileReader();
    r.onload=e=>{
      const routes=parseFile(e.target.result,file.name);
      routes.forEach(rt=>rt._source=file.name);
      allRoutes.push(...routes); renderFileList(); drawPreview();
      if(--pending===0){showMsg(\`\${allRoutes.length} routes loaded\`,'ok');document.getElementById('btnProcess').disabled=false;}
    };
    r.readAsText(file);
  });
}

function parseFile(text,filename){
  try{return filename.match(/\\.geojson$/i)||text.trim().startsWith('{')?parseGeoJSON(text):parseGPX(text);}
  catch(e){showMsg('Error in '+filename,'err');return[];}
}

function parseGPX(text){
  const xml=new DOMParser().parseFromString(text,'text/xml'),routes=[];
  const extract=(sel,ptSel)=>{xml.querySelectorAll(sel).forEach(el=>{
    const name=el.querySelector('name')?.textContent||'route',pts=[];
    el.querySelectorAll(ptSel).forEach(pt=>{
      const lat=parseFloat(pt.getAttribute('lat')),lon=parseFloat(pt.getAttribute('lon')),ele=parseFloat(pt.querySelector('ele')?.textContent||'0');
      if(!isNaN(lat)&&!isNaN(lon))pts.push([lon,lat,ele]);
    });
    if(pts.length>1)routes.push({name,pts});
  });};
  extract('trk','trkpt');extract('rte','rtept');return routes;
}

function parseGeoJSON(text){
  const data=JSON.parse(text),routes=[],features=data.type==='FeatureCollection'?data.features:[data];
  features.forEach(f=>{
    if(!f.geometry)return;
    const name=f.properties?.name||'route';
    if(f.geometry.type==='LineString'){const pts=f.geometry.coordinates.map(c=>[c[0],c[1],c[2]||0]);if(pts.length>1)routes.push({name,pts});}
    else if(f.geometry.type==='MultiLineString'){f.geometry.coordinates.forEach((line,i)=>{const pts=line.map(c=>[c[0],c[1],c[2]||0]);if(pts.length>1)routes.push({name:name+'_'+i,pts});});}
  });
  return routes;
}

function renderFileList(){
  const src={};allRoutes.forEach(r=>{const s=r._source||'?';src[s]=(src[s]||0)+1;});
  document.getElementById('fileList').innerHTML=Object.entries(src).map(([n,c])=>
    \`<div class="file-item"><span class="name">\${n}</span><span class="pts">\${c}r</span><span class="remove" onclick="removeSource('\${n}')">✕</span></div>\`
  ).join('');
}

function removeSource(name){
  allRoutes=allRoutes.filter(r=>r._source!==name);processedRoutes=[];
  renderFileList();drawPreview();
  document.getElementById('btnProcess').disabled=allRoutes.length===0;
  document.getElementById('stats').style.display='none';
}

document.getElementById('btnProcess').addEventListener('click',()=>{
  const cLat=parseFloat(document.getElementById('centerLat').value);
  const cLon=parseFloat(document.getElementById('centerLon').value);
  const dLat=parseFloat(document.getElementById('deltaLat').value);
  const dLon=parseFloat(document.getElementById('deltaLon').value);
  const maxPts=parseInt(document.getElementById('maxPts').value);
  const minPts=parseInt(document.getElementById('minPts').value);
  const hard=document.getElementById('hardCrop').checked;
  const minLat=cLat-dLat,maxLat=cLat+dLat,minLon=cLon-dLon,maxLon=cLon+dLon;
  const inBox=p=>p[1]>=minLat&&p[1]<=maxLat&&p[0]>=minLon&&p[0]<=maxLon;
  let cropped=0;processedRoutes=[];
  allRoutes.forEach(route=>{
    let pts=hard?route.pts.filter(inBox):(route.pts.some(inBox)?route.pts:[]);
    if(pts.length<minPts){cropped++;return;}
    if(pts.length>maxPts){const step=pts.length/maxPts;pts=Array.from({length:maxPts},(_,i)=>pts[Math.floor(i*step)]);}
    processedRoutes.push({name:route.name,pts:pts.map(p=>[Math.round(p[0]*1e6)/1e6,Math.round(p[1]*1e6)/1e6,Math.round(p[2]*10)/10])});
  });
  const allPts=processedRoutes.flatMap(r=>r.pts),eles=allPts.map(p=>p[2]).filter(e=>e>0);
  document.getElementById('statRoutes').textContent=processedRoutes.length;
  document.getElementById('statPts').textContent=allPts.length;
  document.getElementById('statCropped').textContent=cropped;
  document.getElementById('statEle').textContent=eles.length?Math.round(Math.min(...eles))+'–'+Math.round(Math.max(...eles))+'m':'—';
  document.getElementById('stats').style.display='grid';
  const json=JSON.stringify(processedRoutes);
  const out=document.getElementById('output');
  out.value=json.length>2000?json.slice(0,2000)+'
// ...':json;
  out.dataset.full=json;
  out.style.display='block';
  document.getElementById('msg').style.display='block';
  showMsg(\`✓ \${processedRoutes.length} routes · \${allPts.length} pts · \${Math.round(json.length/1024)}KB\`,'ok');
  drawPreview();
});

function getRoutes(){try{return JSON.parse(document.getElementById('output').dataset.full||'[]');}catch(e){showMsg('Process first','err');return null;}}
function dl(content,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();}

document.getElementById('btnCopy').addEventListener('click',()=>{
  navigator.clipboard.writeText(document.getElementById('output').dataset.full||'').then(()=>showMsg('JSON copied','ok'));
});
document.getElementById('btnDownload').addEventListener('click',()=>{dl(document.getElementById('output').dataset.full||'','routes_crop.json','application/json');});
document.getElementById('btnGeoJSON').addEventListener('click',()=>{
  const routes=getRoutes();if(!routes)return;
  const geojson={type:'FeatureCollection',features:routes.map(r=>({type:'Feature',geometry:{type:'LineString',coordinates:r.pts.map(p=>[p[0],p[1],p[2]])},properties:{name:r.name,stroke:'#c8f5d0','stroke-width':2,'stroke-opacity':0.8}}))};
  dl(JSON.stringify(geojson,null,2),'routes_crop.geojson','application/geo+json');
  showMsg('GeoJSON ready for uMap / QGIS / Scrbbble','ok');
});
document.getElementById('btnP5').addEventListener('click',()=>{
  const routes=getRoutes();if(!routes)return;
  const allPts=routes.flatMap(r=>r.pts);
  const lons=allPts.map(p=>p[0]),lats=allPts.map(p=>p[1]),eles=allPts.map(p=>p[2]);
  const B={minLon:Math.min(...lons),maxLon:Math.max(...lons),minLat:Math.min(...lats),maxLat:Math.max(...lats),minEle:Math.min(...eles),maxEle:Math.max(...eles)};
  const sketch=\`// Flowing Cartographies — generated by GPX Crop Tool / FiveCrops
const ROUTES=\${JSON.stringify(routes)};
const B=\${JSON.stringify(B)};
const DURATION=60;let idx=[];
function setup(){createCanvas(windowWidth,windowHeight);colorMode(HSB,360,100,100,100);background(240,10,4);idx=ROUTES.map(()=>0);}
function geoX(lon){return map(lon,B.minLon,B.maxLon,60,width-60);}
function geoY(lat){return map(lat,B.minLat,B.maxLat,height-60,60);}
function draw(){
  let t=(frameCount/60)%DURATION,progress=t/DURATION;
  fill(240,10,4,3);noStroke();rect(0,0,width,height);
  let gh=(progress*140+160)%360;
  ROUTES.forEach((route,i)=>{
    if(idx[i]>=route.pts.length-1)return;
    let hue=(gh+i*(360/ROUTES.length))%360,pt=route.pts[idx[i]],ptN=route.pts[idx[i]+1];
    let ele=map(pt[2],B.minEle,B.maxEle,0,1);
    stroke(hue,80,map(ele,0,1,60,100),map(progress,0,1,40,85));
    strokeWeight(map(ele,0,1,1.5,5));
    line(geoX(pt[0]),geoY(pt[1]),geoX(ptN[0]),geoY(ptN[1]));
    idx[i]=min(idx[i]+max(1,floor(route.pts.length/(DURATION*60*0.08))),route.pts.length-1);
  });
  if(progress>0.93){fill(240,10,4,map(progress,0.93,1,0,80));noStroke();rect(0,0,width,height);}
  if(t<0.1&&frameCount>60){idx=ROUTES.map(()=>0);background(240,10,4);}
  noStroke();fill(0,0,100,25);textSize(11);textFont('monospace');
  text(nf(t,2,1)+'s  |  '+ROUTES.length+' routes  |  Flowing Cartographies',16,20);
}
function windowResized(){resizeCanvas(windowWidth,windowHeight);background(240,10,4);idx=ROUTES.map(()=>0);}\`;
  dl(sketch,'sketch_crop.js','text/javascript');
  showMsg('p5.js sketch ready — paste in editor.p5js.org','ok');
});

document.getElementById('hardCrop').addEventListener('change',function(){
  document.getElementById('cropHint').textContent=this.checked?'Mode: cuts exactly at the bbox border':'Mode: includes full route if it touches the bbox';
});

function showMsg(text,type){const el=document.getElementById('msg');el.textContent=text;el.className='msg '+type;}

document.getElementById('footerToggle').addEventListener('click',function(){
  this.classList.toggle('open');document.getElementById('footerBody').classList.toggle('open');
});

let sourceLoaded=false;
document.getElementById('footerToggle').addEventListener('click',function(){
  if(!sourceLoaded){
    document.getElementById('codeContent').textContent='<!DOCTYPE html>\\n'+document.documentElement.outerHTML;
    sourceLoaded=true;
  }
},true);

document.getElementById('copySource').addEventListener('click',function(){
  const code=document.getElementById('codeContent').textContent;
  navigator.clipboard.writeText(code).then(()=>{this.textContent='✓ copied';setTimeout(()=>this.textContent='copy',2000);});
});
</script>
</body>
</html>`
      }}
    />
  );
}
