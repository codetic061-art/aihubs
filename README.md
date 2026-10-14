# AI Hub — Landing Page (refined)

Working landing page. Open `index.html` — it works over `http://` **and**
straight from disk (`file://`), with no network calls at runtime.

---

## What changed in this round

| Area | Before | Now |
|---|---|---|
| Small guide | Dashed at every hover/focus | Rests in the bottom-right corner and **never moves on its own** |
| Guide activation | Automatic on hover | **Hover + M**, the **Ask for help** button, or a tap |
| Guide chat | None | **Double-click** the robot to open a chat panel in place |
| Large V2 mascot | Left of the code panel | **Right of the code panel**, mirrored in RTL, never overlapping |
| Code window | Grew and zoomed as lines appeared | **Fixed 415×292**; content scrolls inside |
| Page content | Slogan + shelf + 3 cards | What is AI Hub · Explore · Tools · How it works · CTA · full footer |

---

## 1. Small interactive robot

The guide behaves like an assistant, not a decoration.

**Default** — fixed in the bottom-right corner with the idle line
*"Need anything? I'm here to help."* above it. Verified: sweeping the pointer
across nine different controls and then idling six seconds left it at exactly
`(1366px, 826px)` every time. No continuous motion, no random dashes, no
chasing the pointer.

**How you ask it for help** — any one of these, all keyboard reachable:

- **Hover or focus an element, then press `M`** → one short dash, one explanation.
- **The "Ask for help" button** in the header → explains whatever is hovered/focused.
- **Tap** an element on touch → same explanation, no hover assumption.
- **Double-click the robot** → opens its chat panel **in place**; it does not fly away.
- **Escape** dismisses whatever is open.

**Safety rules, all verified in the browser:**

- `M` does nothing when nothing is eligible, and nothing when the pointer has left.
- `M` never fires while typing — `input`, `textarea`, `select` and `contenteditable`
  are all guarded, and the keystroke passes straight through to the field.
- `Ctrl`/`Meta`/`Alt`/`Shift` + `M` does nothing.
- Holding `M` does not spam (`e.repeat` is rejected).
- The same explanation never repeats while it is open; there is a cooldown.
- The robot accepts pointer events at rest (it must, for the double-click), but
  every click it receives is handled explicitly — verified by hit-testing and by
  clicking the theme toggle while the guide was parked over it.

---

## 2. Large V2 mascot

- Sits on the **right of the code window** on desktop; its own grid cell, so it
  cannot overlap or sit inside the window (verified: `noOverlap: true`).
- In Arabic/RTL it **mirrors to the left** of the window, and the copy still leads.
- On mobile it **leads the column** (`order:-1`), with the code window below.
- Artwork unchanged: all 34 paths, original `viewBox="-35 65 966 1070"`,
  gradients, transparent background — byte-identical to the source pack.
- Movement stays restrained: it reacts to hover/press and to a deliberate
  `pointAt()`. Nothing drives it on a timer of its own.

---

## 3. Code window

A macOS-style editor surface, deliberately restrained — a clean title bar with
three small dots, one filename, a monospace body, and a status strip.

**Fixed size, proven.** Sampled seven times over ~20 seconds while snippets
typed and rotated:

```
0: w=309 h=292 -- | content 212px viewport 212px scrollTop=0
1: w=309 h=292 SAME | content 266px viewport 212px scrollTop=54
3: w=309 h=292 SAME | content 301px viewport 212px scrollTop=89
```

The window never changed size, the text never zoomed, the layout never shifted.
Growth is absorbed by the inner scroll viewport (`overscroll-behavior:contain`),
which follows the cursor down as lines are revealed.

It also **pauses when offscreen or when the tab is hidden** (IntersectionObserver
+ `visibilitychange`), and under `prefers-reduced-motion` it shows each snippet
whole, with no typing and no blinking cursor — still syntax-highlighted.

It is labelled a **visual demonstration** in the panel caption and in this
README. The snippets are predefined samples; nothing here runs code or talks to
a backend.

---

## 4. Content

Every number and every list entry is **real project data**, not invented.
`build-catalog.js` extracts them from the project's own content index
(`src/content/{en,ar}.json`, 85 entries per locale) into `assets/catalog.js`,
and the page computes counts from that at render time so they cannot drift:

| Shown | Value | Source |
|---|---|---|
| courses | **10** | `course` entries |
| concepts | **36** | `concept` entries |
| lesson sessions | **16** | `session` entries |
| MCP servers | **6** | `mcp` entries |
| agent skills | **6** | `skill` entries |
| skills & MCP servers | **12** | 6 + 6 |

Sections: **What is AI Hub?** (prose + the count grid) · **Explore the platform**
(six area cards) · **Tools and resources** (three columns of real catalogue
entries, titles and descriptions verbatim in both languages) · **How it works**
(four steps) · **final CTA** · **footer** (4 columns, 13 links, 3 legal links,
and a working language switcher).

**What the spec asked for that does not exist in this project** — "AI Library,
Knowledge Map, Workshop, Academy, Ecosystem, Learning Journey" are not areas of
the real application. Rather than invent them, the Explore section describes the
six collections that genuinely exist (courses, concepts, sessions, MCP servers,
agent skills, quizzes/exams). Flagging it because you asked to be told.

---

## 5. Verification

Run in a real browser (Chrome 149, headless CDP):

| Check | Result |
|---|---|
| Loads with **zero console errors** — en/light, en/dark, ar/light, ar/dark | PASS ×4 |
| Guide stays parked at (1366, 826) across 9 hovers + 6s idle | PASS |
| Idle bubble shows in both languages | PASS |
| Hover + `M` → one dash, one explanation | PASS |
| Same explanation does not repeat; new target does | PASS |
| `M` inert with nothing eligible / after leaving | PASS |
| `M` inert while typing; keystroke reaches the field | PASS |
| `Shift`/`Ctrl` + `M` inert | PASS |
| "Ask for help" button explains the current target | PASS |
| Double-click opens chat in place; Escape and ✕ close it | PASS |
| Chat send works, input clears, no page navigation | PASS |
| V2: 34 paths, animating, right of window (left in RTL), no overlap | PASS |
| Code window fixed 415×292 while content scrolls | PASS |
| Code window pauses offscreen / when tab hidden | PASS |
| Counts match the catalogue (10/36/16/6/6) | PASS |
| Footer: 4 columns, 13 links, language switch works both ways | PASS |
| **No horizontal overflow** at 1440/1280/1100/980/860/720/560/375 × en/ar | PASS |
| `prefers-reduced-motion`: no dash, no typing, full snippet, `M` still works | PASS |
| Arabic: `lang=ar`, `dir=rtl`, correct font, mirrored layout | PASS |
| Mobile 375: guide in corner, nav hidden, mascot leads, no overflow | PASS |
| Works from `file://` with no network | PASS |
| Design tokens + V2 artwork byte-verbatim from source | PASS |
| Supplied inputs byte-identical (sha256, before and after rebuild) | PASS |

Screenshots: `preview/10…13.png` — hero in both themes × both languages,
full page, and mobile.

### Bugs found and fixed during verification

1. **Guide never moved on hover — then moved when it shouldn't.** `pointerout`
   was never handled, so `hoverNode` went stale and `M` explained a control the
   user had already left. Added `pointerout` handling and a liveness guard that
   rejects nodes no longer in the document.
2. **Idle bubble never appeared.** `park()` returned early when already parked,
   and `copy()` only looked inside `entry.guide` while the idle line is a
   top-level key spelled `guideIdle`. Fixed the guard, added a top-level
   fallback, and normalised the key to `guide-idle`.
3. **`M` silently did nothing on the new sections.** `data-guide="area-0"` etc.
   were rendered but had no copy, so `dashTo` bailed. Added the missing entries
   for all 10 new targets in both languages.
4. **Double-click never opened the chat.** The panel carried the `hidden`
   attribute, which beats any stylesheet class, and the resting guide had
   `pointer-events:none`. Now `hidden` is toggled with the class and the guide
   accepts pointer events at rest.
5. **Chat panel opened empty.** `renderChat` called `.join()` on a string.
   Now accepts either shape.
6. **Sending a chat message navigated the page.** The input is inside a `<form>`
   and nothing handled `submit`. Added a `submit` handler with `preventDefault`.
7. **Horizontal overflow at 1100px.** The header held a search field plus four
   buttons past the viewport. Search now drops at 1200px and the help button
   at 900px, so language/theme always survive.
8. **Headline overflowed** once the right column widened. The `.nw` guard now
   measures the **copy column** with a container query instead of the viewport.
9. **Catalogue counts read as zero.** `build-catalog.js` emitted plural keys
   (`courses`) while the page asked for singular (`course`). Normalised to
   singular in the build, with a locale-count parity check.

---

## Honest limitations

- The **code window is a frontend demonstration.** Predefined snippets, not real
  code changes, not a live feed, not a connected AI run. The caption says so.
- The **chat is a local demo.** It replies with one canned, clearly-labelled
  message; it cannot look anything up and makes no network calls.
- **Nav links, search, sign-up and the footer links are placeholders** with no
  destinations. No login, registration or fake accounts were added.
- **Six areas are described from the real content index.** The spec's named areas
  (AI Library, Knowledge Map, Workshop, Academy, Ecosystem, Learning Journey)
  do not exist in this project — see §4.
- **Prism is the one added dependency**, pinned to 1.29.0 and vendored locally.
  The Google Fonts request (Inter + IBM Plex Sans Arabic) is the only external
  request; the page falls back to system fonts without it.
- **One placeholder image slot exists** (`.img-slot`, 16:9) for a section that
  has no supplied asset yet. No images were generated or downloaded.

## Running locally

```
# any static server
python -m http.server 8783        # then open http://127.0.0.1:8783/index.html

# or just double-click index.html — it works from disk too
```

Console helpers for QA:

```js
AIHUBPage.setLang('ar')            // 'en' | 'ar'
AIHUBPage.setTheme('dark')         // 'light' | 'dark'
AIHUBPage.counts.course()          // live catalogue counts

AIHUBGuideDebug.isParked()         // true = resting in the corner
AIHUBGuideDebug.activeKey()        // what is hovered/focused right now
AIHUBGuideDebug.dashTo('shelf', el)  // force one explanation
AIHUBGuideDebug.openChat()         // / closeChat() / showIdle() / park()

AIHubMascotV2.playExplaining()     // large mascot: pointAt(el), talk(), wave()
```

Rebuild the extracted assets:

```
node build-catalog.js     # catalogue from src/content/*.json
node build-mascots.js     # V2 artwork + controller from the pack
node build-tokens.js      # design tokens from the reference page
```
