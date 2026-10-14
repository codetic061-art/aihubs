# AI Hub — Landing Page with Both Mascots

Working landing page with the two approved mascots integrated into the **existing**
page. The page, its sections, links, language controls and theme switching are all
preserved; nothing was rebuilt or redesigned.

Open `index.html` — it works over `http://` **and** straight from disk (`file://`).

---

## What was built

| Mascot | Role | Source | Where |
|---|---|---|---|
| **Large full-body V2 robot** | Main landing-page character | `avatar-animation-pack.html` lines 129–257 (artwork) + 374–1202 (controller), extracted **byte-verbatim** | Hero, left of the code-update panel |
| **Small head-only robot** | Contextual guide that dashes to a target and explains it | [`CX-ArtLab/agent-robot-avatar`](https://github.com/CX-ArtLab/agent-robot-avatar) — **MIT**, (c) 2026 CX ART Lab | Fixed overlay, `position:fixed`, follows the pointer |

The two build scripts (`build-mascots.js`, `build-tokens.js`) generate the assets from
the supplied files. Re-run them if the source pack changes; the inputs are never modified.

---

## Files changed / added

**New — the deliverable**

```
index.html                              the landing page (entry point)
assets/design-tokens.css                design tokens — original block byte-verbatim + additive mascot/panel tokens
assets/landing.css                      layout + component styles
assets/landing.js                       language, theme, shelf, journey path, code panel, V2 wiring
assets/guide.js                         the contextual guide (dash + speech bubble)
assets/content.js                       ALL copy (en/ar) + all code snippets — the single content dictionary
assets/v2-mascot.svg                    the V2 artwork, extracted verbatim (also inlined into index.html)
assets/v2-mascot.js                     the V2 controller, extracted verbatim + minimal host adaptation
assets/vendor/agent-robot-avatar.js     small robot, bundled to one classic script (no build step needed)
assets/vendor/agent-robot-avatar.LICENSE.txt
assets/vendor/prism*.js                 Prism 1.29.0, pinned, vendored locally (python/js/json/bash only)
build-mascots.js                        extracts the V2 artwork + controller from the pack
build-tokens.js                         emits the token file from the reference page
preview/*.png                           screenshots of all four theme/language combinations + mobile
```

**Untouched inputs** (verified byte-identical, original timestamps)

```
avatar-animation-pack.html                              sha256 df250d8b…
design_tokens_css.css                                   sha256 f051b931…
AI Hub - Reference Preview (live, toggle theme).html    sha256 d04d6dbe…
```

No backend, DNS, Cloudflare, deployment config or other page was modified.

---

## 1. Large full-body V2 mascot

- **Only the robot's SVG artwork was extracted** — all 34 `<path>` elements, the
  original `viewBox="-35 65 966 1070"`, gradients, proportions, colours and the
  transparent background. Verified: every long `d` string appears verbatim, all 18
  rig element ids preserved, no background `<rect>` added.
- **Only the essential CSS/JS was reused** — the full speaking, blinking, pointing,
  gaze-tracking, sleeve and hand rig comes from the original controller. The demo's
  voice-panel, audio-upload, TTS and preview-button code was dropped; the
  host-panel writes are now null-guarded.
- Sits **left of the code-update panel** on desktop, stacked above it on mobile.
- **It points at the code panel** using its own `pointAt()` IK solver — verified:
  `arm-right rotate(70.552 300 530)` when aimed at the panel.

## 2. Small contextual guide

- Reuses the upstream component's own **eye tracking, blinking, inertial head
  movement, press-squeeze and antenna drag** — none of it was re-implemented.
- On **hover, keyboard focus or tap** of any `[data-guide]` element it **dashes**
  to that target (CSS transition, 430 ms) and shows **one** brief speech bubble.
- **No repetition**: a target is only re-announced after the pointer/focus leaves it.
- Colours follow the AI Hub tokens — **ink head + white eyes on light, cream head +
  ink eyes on dark** — matching `--bot-visor` / `--bot-fill`.
- `pointer-events:none` while travelling, so it **never blocks clicks** on the page
  beneath it (verified by hit-test + a real click on the theme toggle).

---

## Verified in a real browser (Chrome 149, headless CDP)

| Check | Result |
|---|---|
| Loads with **zero console errors** — en/light, en/dark, ar/light, ar/dark | PASS ×4 |
| V2 artwork inlined, 34 paths, all 18 rig ids, original viewBox | PASS |
| V2 **animating** (head, eyes, pupils, body, sleeves all changing per frame) | PASS |
| V2 `greeting` / `explaining` / `pointing` / `waving` / `talk` states all reachable | PASS |
| V2 **points at the code panel** (arm IK solves to the panel) | PASS |
| V2 **speaking** — mouth path changes on a speech-shaped cycle, no audio needed | PASS |
| Small guide custom element upgrades, shadow-DOM SVG renders | PASS |
| Guide **dash** interpolates (547 px across 7 samples, no jump) | PASS |
| Guide **one explanation**, no repeat; re-announces on return | PASS |
| Guide follows **keyboard Tab** through every target | PASS |
| Theme toggle repaints the guide head (ink ↔ cream) | PASS |
| Arabic toggle: `lang=ar`, `dir=rtl`, IBM Plex Sans Arabic, mirrored layout | PASS |
| Journey path redraws correctly in RTL | PASS |
| **375 px**: no horizontal overflow (`scrollWidth == clientWidth`) in all 4 combos | PASS |
| `prefers-reduced-motion: reduce` — V2 idle off, no transitions, no typing, full snippet shown, guide explains without dashing | PASS |
| Code panel: typing line-by-line, Prism tokens (14–59 per snippet), all 4 snippets cycle | PASS |
| A11y: heading order 1→2→2→2, landmarks ×4, skip link, 2 `aria-live`, 0 unlabelled svg / 0 unnamed controls | PASS |
| Works over **`file://`** with no network — both mascots live, 0 errors | PASS |
| Design tokens preserved byte-verbatim from the reference page | PASS |
| Supplied input files byte-identical (sha256) | PASS |

Screenshots: `preview/01…06.png` — hero in light/dark × en/ar, plus mobile.

---

## Bugs found and fixed during verification

1. **V2 controller never booted.** It looks the rig up by element id at parse time,
   but the artwork was being `fetch()`ed afterwards, so every lookup returned `null`
   and the controller returned early. Fixed by **inlining the artwork** into
   `index.html` between `<!--V2-RIG:START/END-->` markers — which also makes the
   page work from `file://`, where a sibling fetch is blocked.
2. **Prism produced zero tokens.** `highlightElement` reads the language from the
   `<code>` element's class list, not an ancestor attribute. Fixed by setting
   `className = 'language-' + lang`.
3. **Bubble positioned at `NaN`.** `place(node, bx, by)` was called with an object
   for `bx`. Signature corrected to `place(guidePos, bubblePos)`.
4. **Bubble measured before its text was set**, so it was positioned for the wrong
   box. Copy is now set first, then measured.
5. **Horizontal overflow at 375 px** (`scrollWidth` 535 > 375) from the nowrap
   headline spans and the oversized journey-path SVG. Fixed by releasing `.nw`
   below 420 px and clipping the path with `overflow-x:clip` on its section.

---

## Honest limitations

- The **code panel is a frontend demonstration only.** The snippets are predefined
  samples from `assets/content.js`; they are not real code changes, not real system
  operations, and not connected to any AI execution. The caption on the panel says so.
- The **nav links, search, sign-up and course cards are the original placeholders.**
  They were not given real destinations or a backend, so they still go nowhere —
  no login, registration or fake accounts were added.
- The **small guide's speech-bubble copy is static**, looked up per target from the
  dictionary. It is not generated; there are no AI or network calls anywhere in the
  guide or the mascots.
- **Prism is the one added dependency**, pinned to 1.29.0 and vendored locally, so
  there is no runtime CDN call. The Google Fonts request (Inter + IBM Plex Sans
  Arabic) is the page's only external request; the page falls back to system fonts
  if it is unavailable.

## Running locally

```
# any static server
python -m http.server 8781        # then open http://127.0.0.1:8781/index.html

# or just double-click index.html — it works from disk too
```

Console helpers for QA:

```js
AIHUBPage.setLang('ar')            // 'en' | 'ar'
AIHUBPage.setTheme('dark')         // 'light' | 'dark'
AIHUBPage.redraw()                 // re-measure the shelf + journey SVGs
AIHubMascotV2.playGreeting()       // also: playExplaining, pointAt(el), talk(), wave()
AIHUBGuideDebug.announce('shelf')  // force the guide to a target
```

Rebuild the extracted assets after editing the source pack:

```
node build-mascots.js
node build-tokens.js
```
