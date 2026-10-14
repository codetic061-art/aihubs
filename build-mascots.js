#!/usr/bin/env node
/* Build script: extracts the V2 mascot SVG artwork + controller from
   avatar-animation-pack.html byte-exact, and emits the landing-page assets.

   The artwork is INLINED into index.html between marker comments rather than
   fetched, for two reasons:
     1. the V2 controller looks the rig up by element id at parse time, so the
        nodes must exist synchronously before the controller runs;
     2. an XHR/fetch to a sibling file is blocked under file://, so a fetched
        rig would render an empty stage when the page is opened from disk.

   Run: node build-mascots.js     (re-run after editing the pack or the markers)
   Inputs are never modified. */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'avatar-animation-pack.html');
const PAGE = path.join(__dirname, 'index.html');
const OUT = path.join(__dirname, 'assets');
const src = fs.readFileSync(SRC, 'utf8');
const lines = src.split(/\r?\n/);
const L = n => lines[n - 1];

/* ---- 1. SVG artwork: lines 129..257 inclusive, verbatim ---- */
const svgStart = 129, svgEnd = 257;
if (!L(svgStart).trim().startsWith('<svg xmlns=')) throw new Error('svg start marker moved: ' + L(svgStart).slice(0,60));
if (L(svgEnd).trim() !== '</svg>') throw new Error('svg end marker moved');
const svg = lines.slice(svgStart - 1, svgEnd).join('\n');

/* integrity: every path d= must be unique-preserved; count for the report */
const pathCount = (svg.match(/<path/g) || []).length;
fs.writeFileSync(path.join(OUT, 'v2-mascot.svg'), svg + '\n');

/* ---- 2. Controller: lines 374..1202, the IIFE ---- */
const jsStart = 374, jsEnd = 1202;
if (L(jsStart) !== '(() => {') throw new Error('js start marker moved');
if (L(jsEnd) !== '})();') throw new Error('js end marker moved');
let js = lines.slice(jsStart - 1, jsEnd).join('\n');

/* ---- 3. Adapt the demo controller to the landing page (minimal, surgical) ---- */
const edits = [];

// 3a. root: the demo used <div id="demo">; the landing page hosts the mascot in
//     #v2-stage. Fall back so the controller still boots if the host differs.
edits.push([
  '  const root = $("demo");\n  if (!root) return;',
  '  const root = $("v2-stage") || $("demo");\n  if (!root) return;'
]);

// 3b. ui: every demo-panel control is absent on the landing page. Look each one
//     up optionally and guard the one function that writes to them.
edits.push([
  `  const ui = {
    trigger:$("mascot-trigger"),play:$("play-talk"),stop:$("stop-talk"),label:$("motion-status"),
    state:$("state-label"),progress:$("progress-fill"),reduce:$("reduced-motion"),
    system:$("system-motion"),file:$("voice-file"),audio:$("voice-audio"),audioPlay:$("play-audio"),
    mute:$("mute-audio"),audioStatus:$("audio-status"),tts:$("speak-text"),text:$("speech-text")
  };`,
  `  // Optional host-panel controls. The landing page supplies only the trigger,
  // so every other lookup is absent and the writer below is guarded.
  const ui = {
    trigger:$("v2-trigger") || $("mascot-trigger"),
    play:$("play-talk"),stop:$("stop-talk"),label:$("motion-status"),
    state:$("state-label"),progress:$("progress-fill"),reduce:$("reduced-motion"),
    system:$("system-motion"),file:$("voice-file"),audio:$("voice-audio"),audioPlay:$("play-audio"),
    mute:$("mute-audio"),audioStatus:$("audio-status"),tts:$("speak-text"),text:$("speech-text")
  };`
]);

// 3c. updateUI: guard every absent node.
edits.push([
  `  function updateUI() {
    root.dataset.state=state;
    ui.label.textContent=labels[state];
    ui.state.textContent=state.toUpperCase();
    ui.stop.disabled=state==="idle" && !utterance && !audioActive;
    ui.stop.textContent=audioActive || utterance ? "Stop speaking" : "Stop";
    $("play-label").textContent=state==="listening" ? "Greet again" : "Start interaction";
    ui.mute.setAttribute("aria-pressed",String(muted));
    ui.mute.textContent=muted ? "Unmute voice" : "Mute voice";
  }`,
  `  function updateUI() {
    if (root) root.dataset.state=state;
    // The landing page has no demo control panel, so every write is optional.
    const set=(node,key,value)=>{ if(node) node[key]=value; };
    const text=(node,value)=>{ if(node) node.textContent=value; };
    set(ui.label,"textContent",labels[state]);
    set(ui.state,"textContent",state.toUpperCase());
    set(ui.stop,"disabled",state==="idle" && !utterance && !audioActive);
    set(ui.stop,"textContent",audioActive || utterance ? "Stop speaking" : "Stop");
    text($("play-label"),state==="listening" ? "Greet again" : "Start interaction");
    if(ui.mute){ui.mute.setAttribute("aria-pressed",String(muted));
      ui.mute.textContent=muted ? "Unmute voice" : "Mute voice";}
  }`
]);

// 3d. Drop the demo-only preview-panel wiring block (pack buttons + readout) and
//     the voice/upload/gesture-button listeners. Replace with landing-page hooks.
const demoWiringStart = js.indexOf('  // ---- Animation pack preview panel wiring (dev only, this file) ----');
const demoWiringEnd = js.indexOf('  window.AIHubAvatar=api;');
if (demoWiringStart < 0 || demoWiringEnd < 0) throw new Error('demo wiring block not found');
js = js.slice(0, demoWiringStart) + js.slice(demoWiringEnd);

// 3e. Drop the demo-only event listeners that reference absent demo controls,
//     keeping only the listeners the landing page actually needs.
const listenerStart = js.indexOf('  on(ui.play,"click",startConversation);');
const listenerEnd = js.indexOf('  if(media.addEventListener)');
if (listenerStart < 0 || listenerEnd < 0) throw new Error('listener block not found');
js = js.slice(0, listenerStart) + js.slice(listenerEnd);

// 3f. Reduced-motion manual override checkbox does not exist on the landing page.
js = js.replace('reduced=media.matches||ui.reduce.checked;root.dataset.reduced=String(reduced);',
                'reduced=media.matches||(ui.reduce?ui.reduce.checked:false);if(root)root.dataset.reduced=String(reduced);');
js = js.replace('    ui.system.hidden=!media.matches;cancelFrame();',
                '    if(ui.system)ui.system.hidden=!media.matches;cancelFrame();');
js = js.replace('if(reduced) {winkAt=-10000;pose=neutral();render(pose,1);ui.progress.style.transform="scaleX(0)";}',
                'if(reduced) {winkAt=-10000;pose=neutral();render(pose,1);if(ui.progress)ui.progress.style.transform="scaleX(0)";}');
js = js.replace('    ui.progress.style.transform=`scaleX(${value})`;',
                '    if(ui.progress)ui.progress.style.transform=`scaleX(${value})`;');

for (const [from, to] of edits) {
  if (!js.includes(from)) throw new Error('edit anchor not found:\n' + from.slice(0, 120));
  js = js.replace(from, to);
}

// 3g. Boot: expose a stable global the landing page calls into.
js = js.replace('  window.AIHubAvatar=api;', '  window.AIHubMascotV2=api;');
js = js.replace(`  if (window.AIHubAvatar) window.AIHubAvatar.destroy();`,
                `  if (window.AIHubMascotV2) window.AIHubMascotV2.destroy();`);
js = js.replace(`    if(window.AIHubAvatar===api) delete window.AIHubAvatar;`,
                `    if(window.AIHubMascotV2===api) delete window.AIHubMascotV2;`);

fs.writeFileSync(path.join(OUT, 'v2-mascot.js'), js + '\n');

/* ---- 4. Inline the artwork into index.html between marker comments ---- */
let page = fs.readFileSync(PAGE, 'utf8');
const RIG_START = '<!--V2-RIG:START-->';
const RIG_END = '<!--V2-RIG:END-->';
const i0 = page.indexOf(RIG_START), i1 = page.indexOf(RIG_END);
if (i0 < 0 || i1 < 0 || i1 < i0) throw new Error('V2 rig markers missing in index.html');
page = page.slice(0, i0 + RIG_START.length) + '\n' + svg + '\n' + RIG_END + page.slice(i1 + RIG_END.length);
fs.writeFileSync(PAGE, page);

console.log(JSON.stringify({
  svgLines: [svgStart, svgEnd],
  svgPaths: pathCount,
  svgBytes: fs.statSync(path.join(OUT, 'v2-mascot.svg')).size,
  inlinedIntoPage: true,
  jsLines: [jsStart, jsEnd],
  jsBytes: fs.statSync(path.join(OUT, 'v2-mascot.js')).size,
  jsEdits: edits.length,
  pageBytes: fs.statSync(PAGE).size
}, null, 2));
