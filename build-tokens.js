#!/usr/bin/env node
/* Emits assets/design-tokens.css from the existing reference page verbatim
   (lines 14..242), then appends the new mascot / code-panel tokens.
   Guarantees no design token value is re-typed by hand. */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'AI Hub - Reference Preview (live, toggle theme).html');
const OUT = path.join(__dirname, 'assets', 'design-tokens.css');

const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const start = 14, end = 242;
if (lines[start - 1].trim() !== ':root {') throw new Error('token start marker moved: ' + lines[start - 1]);
if (!/--dur-3: 0ms/.test(lines[end - 1])) throw new Error('token end marker moved: ' + lines[end - 1]);

const verbatim = lines.slice(start - 1, end).join('\n') + '\n}';

const additions = `
/* =====================================================================
   ADDITIVE TOKENS — mascots, code-update panel, contextual guide.
   Original token block above is byte-verbatim from the reference page.
   ===================================================================== */

:root {
  /* ---------- 11. LARGE V2 MASCOT ---------- */
  /* The V2 artwork ships its own locked palette (cream shell #fff→#f1f4f5,
     visor #111314→#17191a, joint #101213→#252829, stroke #080a0a, eye #fff,
     pupil #0b0d0e). Those are preserved exactly, so the figure reads on both
     themes with no re-skin. Only the stage around it is themed. */
  --v2-h: clamp(230px, 25vw, 390px);      /* rendered figure height */
  --v2-stage-pad: 0;

  /* ---------- 12. SMALL CONTEXTUAL GUIDE (head-only) ---------- */
  /* Light: ink head + white eyes, matching --bot-visor / --bot-eye.
     Dark:  cream head + ink eyes, matching --bot-fill / --bot-stroke.
     Set from JS because the component paints through the color attribute. */
  --guide-size: 54px;
  --guide-size-sm: 44px;
  --guide-dash: 430ms;          /* the short dash toward a target */
  --guide-dash-ease: cubic-bezier(.22,.9,.24,1);
  --guide-bubble-w: 232px;
  --guide-bubble-life: 3000ms;
  --guide-z: 95;

  /* ---------- 13. CODE-UPDATE PANEL ---------- */
  --panel-radius: var(--radius-lg);
  --panel-line-h: 1.62;
  --panel-fs: clamp(11px, .74vw, 12.5px);
  --panel-pad: 14px 16px 16px;
  --panel-chrome-h: 30px;
  --panel-type-ms: 150ms;       /* per-line reveal */
  --panel-hold-ms: 2600ms;      /* hold before the next snippet */
  --panel-cursor-w: 7px;

  /* Prism token colours — derived from the locked AI Hub palette so the
     panel belongs to the page instead of importing a third-party theme. */
  --code-kw:   #7AA2F7;   /* keyword / control flow   (blue family)  */
  --code-str:  #E0A46A;   /* string                   (orange family)*/
  --code-num:  #D98E6A;
  --code-com:  #6E7B84;   /* comment                  (muted)        */
  --code-fn:   #9EC5FE;   /* function / class name                 */
  --code-var:  #DCE3F4;   /* identifier                             */
  --code-punc: #9AA6AE;
  --code-op:   #C9D3DC;
}

/* The large V2 mascot is a fixed-palette figure: it must never invert. */
[data-theme="dark"] { --code-com: #7C8892; --code-punc: #A8B2BA; }
`;

fs.writeFileSync(OUT, '/* =====================================================================\n'
  + '   AI HUB — DESIGN TOKENS\n'
  + '   Lines 1..N below (the :root block) are byte-verbatim from the existing\n'
  + '   reference landing page; the additive block at the end is new.\n'
  + '   Single source of truth for colour, spacing, type and motion.\n'
  + '   ===================================================================== */\n\n'
  + verbatim + additions);

console.log('design-tokens.css written:', fs.statSync(OUT).size, 'bytes');
