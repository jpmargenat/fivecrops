import { useEffect } from "react";

export default function System() {
  useEffect(() => {
    // Inject the full HTML into the page
    document.title = "System — FiveCrops";
  }, []);

  return (
    <div
      style={{ margin: 0, padding: 0 }}
      dangerouslySetInnerHTML={{
        __html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>System — FiveCrops</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Space Mono', monospace; background: #0a0a0a; color: rgba(232,232,224,0.9); min-height: 100vh; }
  nav { padding: 20px 32px; border-bottom: 1px solid rgba(232,232,224,0.08); }
  nav a { color: #c8f5d0; text-decoration: none; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }
  nav a:hover { text-decoration: underline; }
  header { text-align: center; padding: 20px 20px 14px; border-bottom: 1px solid rgba(232,232,224,0.08); }
  header h1 { font-size: 14px; font-weight: 700; letter-spacing: 0.3em; color: #c8f5d0; text-transform: uppercase; }
  header p { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(232,232,224,0.3); margin-top: 6px; }
  .wrap { display: flex; gap: 0; height: calc(100vh - 120px); }
  .left { width: 48%; border-right: 1px solid rgba(232,232,224,0.08); padding: 16px 10px; overflow-y: auto; background: #0a0a0a; }
  .right { width: 52%; padding: 28px 32px; overflow-y: auto; background: #0d0d0d; }
  .node-btn { cursor: pointer; }
  .node-btn rect { transition: opacity 0.15s; }
  .node-btn:hover rect { opacity: 0.75; }
  .placeholder { color: rgba(232,232,224,0.2); font-size: 13px; margin-top: 60px; text-align: center; line-height: 2; letter-spacing: 0.05em; }
  .tag { display: inline-block; font-size: 10px; padding: 3px 10px; border-radius: 10px; margin-bottom: 14px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
  .tag-coral  { background: rgba(216,90,48,0.2);  color: #f09567; }
  .tag-teal   { background: rgba(29,158,117,0.2); color: #5dcaa5; }
  .tag-purple { background: rgba(83,74,183,0.2);  color: #afa9ec; }
  .tag-gray   { background: rgba(136,135,128,0.2);color: #b4b2a9; }
  .tag-blue   { background: rgba(55,138,221,0.2); color: #85b7eb; }
  .tag-amber  { background: rgba(186,117,23,0.2); color: #fac775; }
  .tag-green  { background: rgba(99,153,34,0.2);  color: #c0dd97; }
  .tag-pink   { background: rgba(153,53,86,0.2);  color: #ed93b1; }
  .exp-title { font-size: 18px; font-weight: 500; color: rgba(232,232,224,0.9); margin-bottom: 14px; line-height: 1.3; }
  .exp-body { font-size: 13px; color: rgba(232,232,224,0.5); line-height: 1.8; }
  .exp-body ul { padding-left: 18px; margin: 10px 0; }
  .exp-body li { margin-bottom: 6px; color: rgba(232,232,224,0.5); }
  .exp-body strong { color: rgba(232,232,224,0.8); font-weight: 500; }
  .exp-body code { font-family: "SF Mono", "Fira Code", monospace; font-size: 11px; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 3px; color: rgba(125,211,252,0.9); }
  @media (max-width: 600px) {
    .wrap { flex-direction: column; height: auto; }
    .left, .right { width: 100%; height: auto; }
  }
</style>
</head>
<body>

<nav><a href="/">← FIVECROPS</a></nav>
<header>
  <h1>FIVECROPS — SYSTEM</h1>
  <p>Click any element to see its explanation</p>
</header>

<div class="wrap">
  <div class="left">
    <svg width="100%" viewBox="0 0 340 880" role="img">
      <title>FiveCrops sistema</title>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </marker>
        <marker id="arr-coral"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#D85A30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
        <marker id="arr-teal"   viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#1D9E75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
        <marker id="arr-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#534AB7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
        <marker id="arr-amber"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#BA7517" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
        <marker id="arr-green"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#639922" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
        <marker id="arr-pink"   viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#D4537E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
      </defs>

      <text x="170" y="22" text-anchor="middle" style="font-size:9px;font-weight:700;fill:rgba(232,232,224,0.4);letter-spacing:0.2em;text-transform:uppercase">Sistema FiveCrops</text>

      <!-- PRESENCIA -->
      <text x="10" y="44" style="font-size:8px;fill:rgba(232,232,224,0.25);letter-spacing:0.1em">presencia (GPS + sensores)</text>
      <g class="node-btn" onclick="show('gps')">
        <rect x="8" y="50" width="96" height="36" rx="6" fill="rgba(216,90,48,0.15)" stroke="#D85A30" stroke-width="0.5"/>
        <text x="56" y="64" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#f09567">GPS raw</text>
        <text x="56" y="78" text-anchor="middle" style="font-size:9px;fill:#D85A30">lat · lon · ele · time</text>
      </g>
      <g class="node-btn" onclick="show('velocidad')">
        <rect x="8" y="96" width="44" height="26" rx="6" fill="rgba(216,90,48,0.1)" stroke="#D85A30" stroke-width="0.5"/>
        <text x="30" y="113" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#f09567">vel.</text>
      </g>
      <g class="node-btn" onclick="show('pendiente')">
        <rect x="60" y="96" width="44" height="26" rx="6" fill="rgba(216,90,48,0.1)" stroke="#D85A30" stroke-width="0.5"/>
        <text x="82" y="113" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#f09567">pend.</text>
      </g>
      <g class="node-btn" onclick="show('aceleracion')">
        <rect x="8" y="130" width="44" height="26" rx="6" fill="rgba(216,90,48,0.1)" stroke="#D85A30" stroke-width="0.5"/>
        <text x="30" y="147" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#f09567">acel.</text>
      </g>
      <g class="node-btn" onclick="show('rumbo')">
        <rect x="60" y="130" width="44" height="26" rx="6" fill="rgba(216,90,48,0.1)" stroke="#D85A30" stroke-width="0.5"/>
        <text x="82" y="147" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#f09567">rumbo</text>
      </g>
      <!-- cadencia — sensor externo, borde punteado -->
      <g class="node-btn" onclick="show('cadencia')">
        <rect x="8" y="164" width="96" height="26" rx="6" fill="rgba(216,90,48,0.08)" stroke="#D85A30" stroke-width="0.5" stroke-dasharray="3 2"/>
        <text x="56" y="181" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#f09567">cadencia (RPM) ⊕</text>
      </g>

      <line x1="56" y1="86" x2="30" y2="96"  stroke="#D85A30" stroke-width="0.5"/>
      <line x1="56" y1="86" x2="82" y2="96"  stroke="#D85A30" stroke-width="0.5"/>
      <line x1="30" y1="96" x2="30" y2="130" stroke="#D85A30" stroke-width="0.5"/>
      <line x1="82" y1="96" x2="82" y2="130" stroke="#D85A30" stroke-width="0.5"/>

      <!-- AMBIENTE -->
      <text x="118" y="44" style="font-size:8px;fill:rgba(232,232,224,0.25);letter-spacing:0.1em">ambiente</text>
      <g class="node-btn" onclick="show('viento')">
        <rect x="116" y="50" width="66" height="24" rx="6" fill="rgba(29,158,117,0.15)" stroke="#1D9E75" stroke-width="0.5"/>
        <text x="149" y="66" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#5dcaa5">viento ✓</text>
      </g>
      <g class="node-btn" onclick="show('temperatura')">
        <rect x="116" y="82" width="66" height="24" rx="6" fill="rgba(29,158,117,0.1)" stroke="#1D9E75" stroke-width="0.5"/>
        <text x="149" y="98" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#5dcaa5">temp.</text>
      </g>
      <g class="node-btn" onclick="show('aqi')">
        <rect x="116" y="114" width="66" height="24" rx="6" fill="rgba(29,158,117,0.1)" stroke="#1D9E75" stroke-width="0.5"/>
        <text x="149" y="130" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#5dcaa5">AQI</text>
      </g>
      <g class="node-btn" onclick="show('sismos')">
        <rect x="116" y="146" width="66" height="24" rx="6" fill="rgba(29,158,117,0.1)" stroke="#1D9E75" stroke-width="0.5"/>
        <text x="149" y="162" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#5dcaa5">sismos</text>
      </g>

      <!-- CULTURAL -->
      <text x="200" y="44" style="font-size:8px;fill:rgba(232,232,224,0.25);letter-spacing:0.1em">cultural</text>
      <g class="node-btn" onclick="show('telegram')">
        <rect x="198" y="50" width="66" height="24" rx="6" fill="rgba(83,74,183,0.15)" stroke="#534AB7" stroke-width="0.5"/>
        <text x="231" y="66" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#afa9ec">Telegram</text>
      </g>
      <g class="node-btn" onclick="show('echoes')">
        <rect x="198" y="82" width="66" height="24" rx="6" fill="rgba(83,74,183,0.1)" stroke="#534AB7" stroke-width="0.5"/>
        <text x="231" y="98" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#afa9ec">ECHOES</text>
      </g>
      <g class="node-btn" onclick="show('wikipedia')">
        <rect x="198" y="114" width="66" height="24" rx="6" fill="rgba(83,74,183,0.1)" stroke="#534AB7" stroke-width="0.5"/>
        <text x="231" y="130" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#afa9ec">Wikipedia</text>
      </g>
      <g class="node-btn" onclick="show('audiograb')">
        <rect x="198" y="146" width="66" height="24" rx="6" fill="rgba(83,74,183,0.1)" stroke="#534AB7" stroke-width="0.5"/>
        <text x="231" y="162" text-anchor="middle" style="font-size:9px;font-weight:500;fill:#afa9ec">audio grab.</text>
      </g>

      <!-- SISTEMA -->
      <text x="276" y="44" style="font-size:8px;fill:rgba(232,232,224,0.25);letter-spacing:0.1em">sistema</text>
      <g class="node-btn" onclick="show('densidad')">
        <rect x="274" y="50" width="58" height="24" rx="6" fill="rgba(136,135,128,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="303" y="66" text-anchor="middle" style="font-size:9px;font-weight:500;fill:rgba(255,255,255,0.5)">densidad</text>
      </g>
      <g class="node-btn" onclick="show('clock')">
        <rect x="274" y="82" width="58" height="24" rx="6" fill="rgba(136,135,128,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="303" y="98" text-anchor="middle" style="font-size:9px;font-weight:500;fill:rgba(255,255,255,0.5)">/1 → /32</text>
      </g>
      <g class="node-btn" onclick="show('hora')">
        <rect x="274" y="114" width="58" height="24" rx="6" fill="rgba(136,135,128,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="303" y="130" text-anchor="middle" style="font-size:9px;font-weight:500;fill:rgba(255,255,255,0.5)">hora</text>
      </g>
      <g class="node-btn" onclick="show('crop')">
        <rect x="274" y="146" width="58" height="24" rx="6" fill="rgba(136,135,128,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="303" y="162" text-anchor="middle" style="font-size:9px;font-weight:500;fill:rgba(255,255,255,0.5)">crop bbox</text>
      </g>

      <!-- MOTOR -->
      <g class="node-btn" onclick="show('motor')">
        <rect x="18" y="212" width="304" height="52" rx="10" fill="rgba(55,138,221,0.15)" stroke="#378ADD" stroke-width="1"/>
        <text x="170" y="232" text-anchor="middle" style="font-size:12px;font-weight:500;fill:#85b7eb">motor generativo</text>
        <text x="170" y="252" text-anchor="middle" style="font-size:9px;fill:rgba(55,138,221,0.7)">scheduler · osciladores · canvas · envelopes · clock divider</text>
      </g>
      <line x1="56"  y1="190" x2="100" y2="212" stroke="#D85A30" stroke-width="0.8" marker-end="url(#arr-coral)"/>
      <line x1="149" y1="170" x2="149" y2="212" stroke="#1D9E75" stroke-width="0.8" marker-end="url(#arr-teal)"/>
      <line x1="231" y1="170" x2="210" y2="212" stroke="#534AB7" stroke-width="0.8" marker-end="url(#arr-purple)"/>
      <line x1="303" y1="170" x2="290" y2="212" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" marker-end="url(#arr)"/>

      <!-- OUTPUTS -->
      <text x="170" y="288" text-anchor="middle" style="font-size:8px;fill:rgba(232,232,224,0.25);letter-spacing:0.1em">outputs</text>
      <g class="node-btn" onclick="show('visual')">
        <rect x="18"  y="296" width="86" height="44" rx="6" fill="rgba(186,117,23,0.15)" stroke="#BA7517" stroke-width="0.5"/>
        <text x="61"  y="314" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#fac775">visual</text>
        <text x="61"  y="330" text-anchor="middle" style="font-size:9px;fill:#BA7517">trazos · color</text>
      </g>
      <g class="node-btn" onclick="show('sonoro')">
        <rect x="127" y="296" width="86" height="44" rx="6" fill="rgba(186,117,23,0.15)" stroke="#BA7517" stroke-width="0.5"/>
        <text x="170" y="314" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#fac775">sonoro</text>
        <text x="170" y="330" text-anchor="middle" style="font-size:9px;fill:#BA7517">oscilador · samples</text>
      </g>
      <g class="node-btn" onclick="show('mensajes')">
        <rect x="236" y="296" width="86" height="44" rx="6" fill="rgba(186,117,23,0.15)" stroke="#BA7517" stroke-width="0.5"/>
        <text x="279" y="314" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#fac775">mensajes</text>
        <text x="279" y="330" text-anchor="middle" style="font-size:9px;fill:#BA7517">Telegram · audio</text>
      </g>
      <line x1="110" y1="264" x2="70"  y2="296" stroke="#BA7517" stroke-width="0.8" marker-end="url(#arr-amber)"/>
      <line x1="170" y1="264" x2="170" y2="296" stroke="#BA7517" stroke-width="0.8" marker-end="url(#arr-amber)"/>
      <line x1="230" y1="264" x2="265" y2="296" stroke="#BA7517" stroke-width="0.8" marker-end="url(#arr-amber)"/>

      <!-- ESPECTADOR -->
      <g class="node-btn" onclick="show('espectador')">
        <rect x="48" y="370" width="244" height="44" rx="8" fill="rgba(99,153,34,0.15)" stroke="#639922" stroke-width="0.5"/>
        <text x="170" y="388" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#c0dd97">interfaz espectador</text>
        <text x="170" y="404" text-anchor="middle" style="font-size:9px;fill:#639922">sliders · parámetros · interacción</text>
      </g>
      <line x1="61"  y1="340" x2="110" y2="370" stroke="#639922" stroke-width="0.8" marker-end="url(#arr-green)"/>
      <line x1="170" y1="340" x2="170" y2="370" stroke="#639922" stroke-width="0.8" marker-end="url(#arr-green)"/>
      <line x1="279" y1="340" x2="230" y2="370" stroke="#639922" stroke-width="0.8" marker-end="url(#arr-green)"/>
      <path d="M48 392 Q10 392 10 238 Q10 212 18 212" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" stroke-dasharray="3 3" marker-end="url(#arr)"/>
      <text x="6" y="310" text-anchor="middle" style="font-size:8px;fill:rgba(255,255,255,0.2)" transform="rotate(-90,6,310)">feedback</text>

      <!-- SISTEMA 2 -->
      <g class="node-btn" onclick="show('ingesta')">
        <rect x="18" y="438" width="304" height="36" rx="8" fill="rgba(136,135,128,0.1)" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
        <text x="170" y="452" text-anchor="middle" style="font-size:10px;font-weight:500;fill:rgba(255,255,255,0.5)">sistema 2 — ingesta de rutas GPX</text>
        <text x="170" y="466" text-anchor="middle" style="font-size:8px;fill:rgba(232,232,224,0.25)">pedalear → exportar → subir → crop</text>
      </g>
      <line x1="170" y1="414" x2="170" y2="438" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" stroke-dasharray="3 3" marker-end="url(#arr)"/>

      <!-- SALI -->
      <g class="node-btn" onclick="show('sali')">
        <rect x="18" y="496" width="304" height="44" rx="8" fill="rgba(153,53,86,0.15)" stroke="#D4537E" stroke-width="0.5"/>
        <text x="170" y="514" text-anchor="middle" style="font-size:9px;font-weight:700;fill:#ed93b1">S.A.L.I. — en vivo</text>
        <text x="170" y="530" text-anchor="middle" style="font-size:9px;fill:#D4537E">el mismo sistema · en tiempo real · en el territorio</text>
      </g>
      <line x1="170" y1="474" x2="170" y2="496" stroke="#D4537E" stroke-width="0.8" marker-end="url(#arr-pink)"/>

    </svg>
  </div>

  <div class="right" id="panel">
    <div class="placeholder">
      ← Clickeá cualquier elemento<br>del diagrama<br>para ver su explicación
    </div>
  </div>
</div>

<script>
const info = {
  gps: {
    tag: 'presencia', tagClass: 'tag-coral',
    title: 'GPS raw — los 4 datos crudos',
    body: \`El archivo GPX exportado desde RideWithGPS o similar contiene solo 4 campos por punto:
    <ul>
      <li><code>lat</code> — latitud</li>
      <li><code>lon</code> — longitud</li>
      <li><code>ele</code> — elevación en metros</li>
      <li><code>time</code> — marca temporal exacta</li>
    </ul>
    Todo lo demás — velocidad, pendiente, aceleración, rumbo — son cálculos derivados de estos 4 valores.<br><br>
    El conversor Python actual ya calcula <code>dist</code> y <code>slope</code>. Hay que actualizarlo para incluir <code>speed</code>, <code>acceleration</code> y <code>heading</code>.\`
  },
  velocidad: {
    tag: 'presencia', tagClass: 'tag-coral',
    title: 'Velocidad',
    body: \`Calculada como: <code>distancia / diferencia de time</code> entre dos puntos consecutivos.<br><br>
    Todavía no se usa en el engine actual. Su uso potencial:
    <ul>
      <li>Attack del envelope — más velocidad = ataque más corto</li>
      <li>Grosor del trazo visual</li>
      <li>Scheduler basado en tiempo real — arregla el bug de los clicks acelerados cuando el ciclista para</li>
    </ul>\`
  },
  pendiente: {
    tag: 'presencia', tagClass: 'tag-coral',
    title: 'Pendiente',
    body: \`Calculada como: <code>diferencia de elevación / distancia</code>.<br><br>
    Ya se usa en el engine:
    <ul>
      <li>Color del trazo — rojo subida, amarillo bajada, rosa plano</li>
      <li>Grosor de línea</li>
      <li>Ganancia del oscilador</li>
    </ul>
    Uso potencial adicional: Decay del envelope ADSR.\`
  },
  aceleracion: {
    tag: 'presencia', tagClass: 'tag-coral',
    title: 'Aceleración',
    body: \`Calculada como: <code>cambio de velocidad / diferencia de time</code>.<br><br>
    Todavía no se usa. Representa los cambios bruscos de ritmo del ciclista — frenadas, arrancadas.<br><br>
    Uso potencial:
    <ul>
      <li>Trigger de eventos sonoros en cambios bruscos</li>
      <li>Distorsión visual momentánea</li>
      <li>Release del envelope</li>
    </ul>\`
  },
  rumbo: {
    tag: 'presencia', tagClass: 'tag-coral',
    title: 'Rumbo / dirección',
    body: \`Calculado como el ángulo entre dos puntos lat/lon consecutivos.<br><br>
    Todavía no se usa. Es conceptualmente muy rico — hacia dónde va la bici en cada momento.<br><br>
    Uso potencial:
    <ul>
      <li>Paneo estéreo — norte/sur/este/oeste → izquierda/derecha en el audio</li>
      <li>Rotación visual de las partículas de viento</li>
      <li>Cambios de timbre según orientación cardinal</li>
    </ul>\`
  },
  cadencia: {
    tag: 'presencia · sensor externo', tagClass: 'tag-coral',
    title: 'Cadencia — RPM del pedaleo',
    body: \`La cadencia mide las revoluciones por minuto de los pies sobre los pedales. No viene del GPS — requiere un sensor específico (cadenciómetro Bluetooth/ANT+) montado en la bicicleta.<br><br>
    <strong>Por qué es el dato más humano del sistema:</strong><br>
    Es el pulso directo del cuerpo pedaleando. Varía con el esfuerzo, el terreno, el estado anímico, la fatiga. Es el ritmo interno del ciclista — independiente de la velocidad o la distancia.<br><br>
    <strong>Conexión con el sonido:</strong>
    <ul>
      <li>La cadencia como <strong>clock master</strong> del engine — en lugar de un scheduler fijo, el ritmo de los eventos sonoros sigue el pedaleo real</li>
      <li>En sintetizadores modulares sería el CV de ritmo — todo lo demás se sincroniza con él</li>
      <li>90 RPM = tempo fluido · 60 RPM = esfuerzo · 110 RPM = descenso</li>
    </ul>
    <strong>Conexión con lo visual:</strong>
    <ul>
      <li>Frecuencia de aparición de nuevos trazos</li>
      <li>Pulsación del punto activo sincronizada al pedaleo</li>
    </ul>
    El sensor de cadencia convierte la bici en un instrumento musical.\`
  },
  viento: {
    tag: 'ambiente', tagClass: 'tag-teal',
    title: 'Viento — Open-Meteo API ✓ activo',
    body: \`Ya integrado en el engine. Datos en tiempo real:
    <ul>
      <li><code>wind_speed_10m</code> → velocidad LFO + profundidad de modulación</li>
      <li><code>wind_direction_10m</code> → dirección de las partículas animadas</li>
      <li><code>wind_gusts_10m</code> → afecta el cutoff del filtro pasa-bajos</li>
    </ul>
    Se actualiza cada 30 segundos. Es el único dato de ambiente actualmente activo en el sistema.\`
  },
  temperatura: {
    tag: 'ambiente', tagClass: 'tag-teal',
    title: 'Temperatura',
    body: \`Disponible en Open-Meteo, la misma API que ya usamos para el viento — sin costo adicional.<br><br>
    Todavía no se usa. Uso potencial:
    <ul>
      <li>Color de fondo general — más cálido / más frío</li>
      <li>Parámetro del envelope Sustain</li>
      <li>Densidad de partículas de viento</li>
    </ul>\`
  },
  aqi: {
    tag: 'ambiente', tagClass: 'tag-teal',
    title: 'Calidad del aire — AQI / OpenAQ',
    body: \`Via OpenAQ — API gratuita, sin key, datos reales de LA.<br><br>
    Conceptualmente muy potente: el aire que respira el ciclista mientras pedalea, invisible pero presente.<br><br>
    Uso potencial:
    <ul>
      <li>Opacidad general de los trazos</li>
      <li>Nivel de ruido en el oscilador</li>
      <li>Color de las partículas de viento</li>
    </ul>\`
  },
  sismos: {
    tag: 'ambiente', tagClass: 'tag-teal',
    title: 'Sismos — USGS API',
    body: \`En Los Angeles los sismos son parte de la vida cotidiana. La ciudad vive sobre fallas sísmicas activas.<br><br>
    La API del USGS es gratuita y da datos en tiempo real: magnitud, profundidad, distancia al punto GPS.<br><br>
    El sismo como evento que interrumpe la narración del pedaleo — el territorio habla. Afecta simultáneamente sonido e imagen:
    <ul>
      <li>El fondo cambia de color brevemente</li>
      <li>Las líneas vibran / se distorsionan</li>
      <li>Entra una frecuencia sub-bass muy grave</li>
      <li>Dura exactamente lo que duró el temblor real</li>
    </ul>\`
  },
  telegram: {
    tag: 'cultural', tagClass: 'tag-purple',
    title: 'Mensajes de Telegram',
    body: \`Telegram tiene API completa. Cada mensaje tiene timestamp exacto, texto, audio, imagen o video.<br><br>
    Si durante el recorrido había un grupo activo, se pueden recuperar todos esos mensajes y sincronizarlos con el timeline GPS.<br><br>
    Cuando la animación llega al minuto exacto en que alguien escribió algo → aparece el mensaje en pantalla.<br><br>
    <strong>En FiveCrops</strong> los mensajes son del pasado. <strong>En SALI</strong> llegan en vivo.\`
  },
  echoes: {
    tag: 'cultural', tagClass: 'tag-purple',
    title: 'ECHOES — audio georeferenciado',
    body: \`ECHOES es una app que permite dejar audios georeferenciados — cuando alguien pasa por esa coordenada, el audio se activa.<br><br>
    En FiveCrops: cuando la animación pasa por un punto donde hay un audio dejado, se reproduce.<br><br>
    Uso posible:
    <ul>
      <li>Rastros sonoros del territorio — lo que había en ese punto</li>
      <li>Mensajes dejados por otros pedaleantes</li>
      <li>Grabaciones de ambiente del lugar exacto</li>
    </ul>\`
  },
  wikipedia: {
    tag: 'cultural', tagClass: 'tag-purple',
    title: 'Wikipedia — memoria histórica',
    body: \`La API de Wikipedia es gratuita y sin key. Permite obtener resúmenes de calles, barrios, lugares históricos.<br><br>
    Cuando la ruta pasa por un lugar con artículo → aparece un card con info histórica del lugar.<br><br>
    Reemplaza a NewsAPI que no funciona desde el browser. La diferencia conceptual es importante: en lugar de noticias de hoy, la <strong>memoria acumulada del territorio</strong>.\`
  },
  audiograb: {
    tag: 'cultural', tagClass: 'tag-purple',
    title: 'Audio grabado del recorrido',
    body: \`Si el ciclista grabó audio mientras pedaleaba, ese audio puede sincronizarse con la animación GPS.<br><br>
    Cuando el trazo llega al minuto 4:32 del recorrido → suena lo que se oía en ese momento: tráfico, viento, respiración, conversaciones.<br><br>
    Es la capa más directa del cuerpo en el espacio. El sonido del recorrido corriendo debajo de la síntesis generativa.\`
  },
  densidad: {
    tag: 'sistema', tagClass: 'tag-gray',
    title: 'Densidad acumulada',
    body: \`El número de trazos superpuestos en el canvas. Es un dato del propio sistema.<br><br>
    La densidad es central al concepto: una o dos líneas no dicen nada. Con 20 o 30 trazos superpuestos el crop adquiere peso visual real — el <strong>peso de la presencia acumulada</strong>.<br><br>
    Uso potencial:
    <ul>
      <li>Modular la opacidad de nuevas rutas según cuántas ya hay</li>
      <li>Afectar el volumen general del sonido</li>
      <li>Trigger para cambiar el modo visual</li>
    </ul>\`
  },
  clock: {
    tag: 'sistema', tagClass: 'tag-gray',
    title: 'Clock divider /1 → /32',
    body: \`Inspirado en los divisores de clock de los sintetizadores modulares.<br><br>
    Cada bici dentro de un crop tiene su propio pulso base:
    <ul>
      <li>Bici 1 → /1 — cada punto GPS</li>
      <li>Bici 2 → /4</li>
      <li>Bici 3 → /8</li>
      <li>Bici 4 → /16</li>
      <li>Bici 5 → /32</li>
    </ul>
    Con 20+ bicis el patrón se repite cíclicamente. Genera <strong>polirritmos territoriales</strong> — cada cuerpo tiene su propio tiempo interno.\`
  },
  hora: {
    tag: 'sistema', tagClass: 'tag-gray',
    title: 'Hora del recorrido',
    body: \`El timestamp real del GPX dice a qué hora se realizó cada segmento del recorrido.<br><br>
    Uso potencial:
    <ul>
      <li>Color de fondo según amanecer / atardecer / noche</li>
      <li>Densidad de partículas según luz del día</li>
      <li>Paleta sonora diferente según momento del día</li>
    </ul>
    Conecta el recorrido grabado con el tiempo real del territorio.\`
  },
  crop: {
    tag: 'sistema', tagClass: 'tag-gray',
    title: 'Crop bounding box',
    body: \`Define el área geográfica del crop — el recorte del territorio que se visualiza.<br><br>
    <strong>Tres formas de definirlo:</strong>
    <ul>
      <li><strong>4 esquinas</strong> — minLat, maxLat, minLon, maxLon</li>
      <li><strong>Centro + radio rectangular</strong> — centerLat, centerLon, halfLat, halfLon</li>
      <li><strong>Centro + radio circular</strong> — centerLat, centerLon, radiusKm (usando Haversine)</li>
    </ul>
    El filtro descarta automáticamente todos los puntos GPS que caigan fuera del área — así cualquier pedaleada larga puede subirse completa y el sistema extrae solo lo que pertenece al crop.<br><br>
    La forma <strong>circular</strong> es conceptualmente la más interesante — equidistante del centro en todas las direcciones, como una zona de densidad que irradia desde un punto.\`
  },
  motor: {
    tag: 'motor generativo', tagClass: 'tag-blue',
    title: 'Motor generativo',
    body: \`El núcleo del sistema. Recibe todos los inputs y los traduce en outputs visuales y sonoros en tiempo real.<br><br>
    <strong>Componentes actuales:</strong>
    <ul>
      <li>Scheduler de setTimeout — distribuye los puntos GPS en el tiempo</li>
      <li>Oscilador triangular — genera el sonido base</li>
      <li>Canvas offscreen + main — double-buffer para rendering</li>
      <li>LFO — modulado por viento</li>
      <li>Filtro pasa-bajos — cutoff por distancia acumulada</li>
    </ul>
    <strong>A agregar:</strong>
    <ul>
      <li>Envelopes ADSR disparados por cambios de pendiente</li>
      <li>Clock divider por ruta</li>
      <li>Cadencia como clock master</li>
      <li>Sampler para audio georeferenciado y audio grabado</li>
      <li>Scheduler basado en time real del GPX</li>
    </ul>\`
  },
  visual: {
    tag: 'output', tagClass: 'tag-amber',
    title: 'Output visual',
    body: \`Lo que se ve en el canvas:
    <ul>
      <li>Trazos de ruta con grosor variable según pendiente</li>
      <li>Color según slope — rojo subida, amarillo bajada, rosa plano</li>
      <li>Paleta fría para rutas adicionales — cian, menta, violeta</li>
      <li>Partículas de viento animadas en tiempo real</li>
      <li>Punto activo que recorre la ruta mientras la animación corre</li>
    </ul>
    <strong>A desarrollar:</strong> expansión de líneas después de pasar, recorte circular del crop, reacción visual a sismos, fondo que responde a hora del día.\`
  },
  sonoro: {
    tag: 'output', tagClass: 'tag-amber',
    title: 'Output sonoro',
    body: \`Lo que se escucha:
    <ul>
      <li>Oscilador triangular — frecuencia = elevación</li>
      <li>Filtro pasa-bajos — cutoff = distancia acumulada</li>
      <li>LFO — modulado por velocidad y profundidad del viento</li>
      <li>Clicks percusivos — cada 4 puntos GPS en ruta 2</li>
    </ul>
    <strong>A desarrollar:</strong> envelopes ADSR, cadencia como clock master, samples georeferenciados, audio grabado del recorrido, sub-bass para sismos, clock divider por ruta.\`
  },
  mensajes: {
    tag: 'output', tagClass: 'tag-amber',
    title: 'Output de mensajes',
    body: \`Cards que aparecen en pantalla sincronizados con el timeline del recorrido:
    <ul>
      <li>Mensajes de Telegram del momento exacto del pedaleo</li>
      <li>Audios georeferenciados de ECHOES al pasar por un punto</li>
      <li>Info histórica de Wikipedia al pasar por un lugar</li>
    </ul>
    El código para mostrar cards ya existe en el engine — hay que redirigirlo a estas nuevas fuentes en lugar de NewsAPI.\`
  },
  espectador: {
    tag: 'sistema 3', tagClass: 'tag-green',
    title: 'Interfaz del espectador — Sistema 3',
    body: \`Todavía no existe. El espectador hoy solo da play y mira.<br><br>
    Lo que se quiere agregar:
    <ul>
      <li>Slider de densidad — cuántas rutas mostrar simultáneamente</li>
      <li>Balance sonoro entre oscilador y samples</li>
      <li>Profundidad del LFO — intensidad del viento</li>
      <li>Activar/desactivar capas — solo presencia, solo ambiente, todo</li>
      <li>Relaciones entre inputs y outputs — qué modula qué</li>
    </ul>
    El espectador no cambia el recorrido — cambia la <strong>interpretación</strong> de ese recorrido.\`
  },
  ingesta: {
    tag: 'sistema 2', tagClass: 'tag-gray',
    title: 'Sistema de ingesta de rutas — Sistema 2',
    body: \`Actualmente las rutas se agregan manualmente — conversor Python + subir a GitHub.<br><br>
    El sistema 2 haría esto automático:
    <ul>
      <li>Salís a pedalear en Lincoln Heights</li>
      <li>Exportás el GPX desde RideWithGPS</li>
      <li>Lo subís a la plataforma</li>
      <li>Aparece inmediatamente en el crop</li>
    </ul>
    Esto es lo que permite acumular densidad rápidamente. Sin este sistema siempre hay pocas líneas y el crop no tiene el peso visual que necesita.\`
  },
  sali: {
    tag: 'escala → SALI', tagClass: 'tag-pink',
    title: 'S.A.L.I. — el mismo sistema en vivo',
    body: \`El mismo motor generativo de FiveCrops corriendo en tiempo real durante el recorrido Buenos Aires → Bahía Blanca.<br><br>
    <strong>Lo que cambia en SALI:</strong>
    <ul>
      <li>Las rutas llegan en vivo — la bici está pedaleando ahora</li>
      <li>Los mensajes de Telegram llegan en tiempo real</li>
      <li>El viento, la temperatura, los sismos son de este momento</li>
      <li>Los participantes remotos interactúan en directo</li>
      <li>El video es esférico 360°</li>
    </ul>\`
  }
};

function show(key) {
  const d = info[key];
  if (!d) return;
  document.getElementById('panel').innerHTML = \`
    <span class="tag \${d.tagClass}">\${d.tag}</span>
    <div class="exp-title">\${d.title}</div>
    <div class="exp-body">\${d.body}</div>
  \`;
}
</script>
<div style="text-align:center;padding:20px;border-top:1px solid rgba(232,232,224,0.08);">
  <a href="/tools" style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(232,232,224,0.3);text-decoration:none;">→ GPX Crop Tool</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="/" style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(232,232,224,0.3);text-decoration:none;">← Back to FiveCrops</a>
</div>
</body>
</html>
`
      }}
    />
  );
}
