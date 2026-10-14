/* =====================================================================
   AI HUB — LANDING PAGE CONTROLLER
   Vanilla JS. Handles: language switching, theme switching + persistence,
   the large V2 mascot wiring, the fixed-size code window, and all the
   content sections. All copy comes from assets/content.js; all catalogue
   entries come from assets/catalog.js (real project data).
   ===================================================================== */
(function () {
  'use strict';

  var I18N = window.AIHUB_I18N;
  var SNIPPETS = window.AIHUB_SNIPPETS;
  var CATALOG = window.AIHUB_CATALOG || { en: {}, ar: {} };
  var root = document.documentElement;

  var LS_LANG = 'aihub.lang';
  var LS_THEME = 'aihub.theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------ *
   * Language + theme
   * ------------------------------------------------------------------ */
  function savedLang() {
    try { var v = localStorage.getItem(LS_LANG); return (v === 'en' || v === 'ar') ? v : 'en'; }
    catch (e) { return 'en'; }
  }
  function savedTheme() {
    try { var v = localStorage.getItem(LS_THEME); return (v === 'light' || v === 'dark') ? v : 'light'; }
    catch (e) { return 'light'; }
  }
  var lang = savedLang();
  function T() { return I18N[lang] || I18N.en; }
  function C() { return CATALOG[lang] || CATALOG.en || {}; }
  function count(type) { return (C()[type] || []).length; }

  function applyLang(next) {
    lang = (next === 'ar') ? 'ar' : 'en';
    var t = T();
    root.setAttribute('lang', t.htmlLang);
    root.setAttribute('dir', t.dir);
    try { localStorage.setItem(LS_LANG, lang); } catch (e) {}
    render();
    document.dispatchEvent(new CustomEvent('aihub:langchange', { detail: { lang: lang } }));
  }

  function applyTheme(next) {
    root.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem(LS_THEME, next === 'dark' ? 'dark' : 'light'); } catch (e) {}
    // The small guide paints through its `color` attribute, so it must be
    // re-coloured from the theme tokens on every switch.
    if (window.AIHUBGuide) window.AIHUBGuide.retheme();
    document.dispatchEvent(new CustomEvent('aihub:themechange', { detail: { theme: next } }));
  }

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function $(id) { return document.getElementById(id); }
  function txt(id, value) { var n = $(id); if (n) n.textContent = value; }
  /* Substitute {n} placeholders with real catalogue counts. */
  function fill(s, n) { return String(s).replace('{n}', n); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ------------------------------------------------------------------ *
   * Large V2 mascot
   * The artwork is inlined into index.html between the V2-RIG markers, so
   * the rig nodes exist before assets/v2-mascot.js runs and looks them up.
   * That file owns the whole animation (blinking, speaking, pointing, gaze)
   * and its own idle behaviour. This only wires page events to it, so the
   * mascot's movement stays restrained: it reacts to hover/press and to a
   * deliberate gesture request, never on a timer of its own.
   * ------------------------------------------------------------------ */
  function wireV2() {
    var v2 = window.AIHubMascotV2;
    var trigger = $('v2-trigger');
    if (!v2 || !trigger) return;

    // Point at the code window when it is hovered/focused, using the rig's
    // own IK solver, so the mascot "points at" the panel as the design asks.
    var panel = $('code-panel');
    if (panel && typeof v2.pointAt === 'function') {
      var t = null;
      function point() {
        if (t) clearTimeout(t);
        t = setTimeout(function () { v2.pointAt(panel); }, 120);
      }
      panel.addEventListener('pointerenter', point);
      panel.addEventListener('focusin', point);
      panel.addEventListener('pointerleave', function () {
        if (t) clearTimeout(t);
      });
    }

    window.AIHUBMascotV2 = v2;
  }

  /* ------------------------------------------------------------------ *
   * Code window — FIXED size at every state.
   * The window is a fixed-height box with `contain:paint`; lines are
   * revealed inside a scroll viewport that scrolls itself as content
   * grows, so the window never resizes, never zooms the text, and never
   * shifts the surrounding layout.
   * ------------------------------------------------------------------ */
  var CP = {
    index: 0, line: 0, timer: null, destroyed: false,
    el: null, code: null, file: null, scroll: null, cursor: null, offscreen: false
  };

  function cpInit() {
    CP.el = $('code-panel'); CP.code = $('cp-code');
    CP.file = $('cp-file'); CP.scroll = $('cp-scroll');
    CP.cursor = $('cp-cursor');
    if (!CP.el || !CP.code || !SNIPPETS.length) return;

    // The scroll viewport is the element that actually scrolls.
    CP.scroll = CP.el.querySelector('.cw-scroll') || $('cp-scroll');

    // Pause while the panel is scrolled out of view, resume on return.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          CP.offscreen = !en.isIntersecting;
          if (!en.isIntersecting && CP.timer) { clearTimeout(CP.timer); CP.timer = null; }
          else if (en.isIntersecting && CP.code && !CP.timer) cpResume();
        });
      }, { threshold: 0.1 }).observe(CP.el);
    }
    cpShow(0);
  }

  function cpResume() {
    if (CP.destroyed || !CP.code) return;
    var s = SNIPPETS[CP.index];
    // If the snippet finished while we were away, move to the next one.
    if (CP.line >= s.lines.length) { cpShow(CP.index + 1); return; }
    if (!reduceMotion.matches) cpNextLine(s);
  }

  function cpShow(i) {
    if (CP.destroyed) return;
    CP.index = ((i % SNIPPETS.length) + SNIPPETS.length) % SNIPPETS.length;
    CP.line = 0;
    var s = SNIPPETS[CP.index];
    if (CP.file) CP.file.textContent = s.file;
    var lg = $('cp-lang');
    if (lg) lg.textContent = s.lang;
    CP.code.textContent = '';
    CP.el.setAttribute('data-lang', s.lang);
    CP.el.setAttribute('aria-label', T().codeWindowAria + ' — ' + s.file);
    // Prism reads the language from the element's class list, not from an
    // ancestor attribute, so set it explicitly on the <code> node.
    CP.code.className = 'language-' + s.lang;
    if (CP.scroll) CP.scroll.scrollTop = 0;
    if (reduceMotion.matches) {
      // Reduced motion: show the whole snippet at once, no typing, no cursor.
      renderLines(s, s.lines.length);
      if (CP.cursor) CP.cursor.style.display = 'none';
      return;
    }
    if (CP.cursor) CP.cursor.style.display = '';
    cpNextLine(s);
  }

  function cpNextLine(s) {
    if (CP.destroyed || CP.offscreen) return;
    CP.line++;
    renderLines(s, CP.line);
    if (CP.line < s.lines.length) {
      CP.timer = setTimeout(function () { cpNextLine(s); }, 150);
    } else {
      CP.timer = setTimeout(function () { cpShow(CP.index + 1); }, 2600);
    }
  }

  function renderLines(s, upto) {
    var text = s.lines.slice(0, upto).join('\n');
    if (CP.code) CP.code.textContent = text;
    // Highlight only the revealed portion. highlightElement rewrites the node's
    // innerHTML with token spans; the CSS maps those tokens onto the palette.
    if (window.Prism && Prism.languages[s.lang]) {
      try { Prism.highlightElement(CP.code); } catch (e) {}
    }
    if (CP.cursor) CP.cursor.style.display = '';
    // Follow the cursor downward so new lines scroll into view naturally.
    if (CP.scroll) {
      CP.scroll.scrollTop = CP.scroll.scrollHeight;
    }
    var ln = $('cp-lines');
    if (ln) ln.textContent = ('0' + Math.min(upto, 99)).slice(-2);
  }

  /* ------------------------------------------------------------------ *
   * Hero stat row — counts computed from the real catalogue
   * ------------------------------------------------------------------ */
  function buildHeroStats() {
    var host = $('hero-sub');
    if (!host) return;
    var t = T();
    var vals = [
      count('course'),
      count('concept'),
      count('mcp'),
      (count('skill') || 0) + (count('mcp') || 0)
    ];
    host.innerHTML = t.heroStats.map(function (pair, i) {
      return '<div><b>' + vals[i] + '</b><span>' + esc(fill(pair[1], vals[i])) + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * "What is AI Hub?" — prose + a count row from the real catalogue
   * ------------------------------------------------------------------ */
  function buildWhat() {
    var t = T();
    var body = $('what-body');
    if (body) body.innerHTML = t.whatBody.map(function (p) {
      return '<p>' + esc(p) + '</p>';
    }).join('');

    var facts = $('what-facts');
    if (facts) {
      var vals = [count('concept'), count('course'), count('session'),
                  count('skill') + count('mcp')];
      facts.innerHTML = t.whatFacts.map(function (pair, i) {
        return '<div class="fact"><b>' + vals[i] + '</b><span>' + esc(fill(pair[1], vals[i])) + '</span></div>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------------ *
   * Platform areas — six cards, counts from the catalogue
   * ------------------------------------------------------------------ */
  function buildAreas() {
    var host = $('areas');
    if (!host) return;
    var t = T();
    var typeOf = ['course', 'concept', 'session', 'mcp', 'skill', 'quiz'];
    host.innerHTML = t.areas.map(function (a, i) {
      var n = count(typeOf[i]) || 0;
      return '<article class="area" data-guide="area-' + i + '" tabindex="0">' +
        '<span class="area-num">0' + (i + 1) + '</span>' +
        '<h3>' + esc(a[0]) + '</h3>' +
        '<p>' + esc(a[1]) + '</p>' +
        '<span class="area-count">' + esc(fill(a[2], n)) + '</span></article>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * Tools and resources — real catalogue entries
   * ------------------------------------------------------------------ */
  function buildResources() {
    var host = $('res');
    if (!host) return;
    var t = T();
    host.innerHTML = t.resCols.map(function (col, ci) {
      var rows = (C()[col.type] || []).slice(0, 5);
      return '<div class="res-col" data-guide="res-' + ci + '" tabindex="0">' +
        '<div class="res-head"><h3>' + esc(col.title) + '</h3>' +
        '<span class="res-n">' + esc(fill(col.n, count(col.type))) + '</span></div>' +
        '<ul class="res-list">' + rows.map(function (r) {
          return '<li><a href="#">' + esc(r[0]) + '</a>' +
            (r[1] ? '<span class="rd">' + esc(r[1]) + '</span>' : '') + '</li>';
        }).join('') + '</ul></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * How it works + final CTA + footer
   * ------------------------------------------------------------------ */
  function buildSteps() {
    var host = $('steps');
    if (!host) return;
    host.innerHTML = T().steps.map(function (s) {
      return '<div class="step" tabindex="0" data-guide="step"><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
    }).join('');
  }

  function buildFooter() {
    var t = T();
    var cols = $('foot-c1') && [$('foot-c1'), $('foot-c2'), $('foot-c3'), $('foot-c4')];
    if (cols) {
      cols.forEach(function (ul, i) {
        var col = t.footCols[i];
        if (!ul || !col) return;
        $('foot-h' + (i + 1)).textContent = col.h;
        ul.innerHTML = col.items.map(function (label) {
          // The language column switches language; the rest are placeholders.
          if (i === 3) {
            var isAr = (lang === 'ar');
            var active = (label === 'English') !== isAr ? '' : ' aria-current="true"';
            return '<li><a href="#" data-lang="' + (label === 'English' ? 'en' : 'ar') + '"' + active + '>' + esc(label) + '</a></li>';
          }
          return '<li><a href="#">' + esc(label) + '</a></li>';
        }).join('');
      });
    }
    txt('foot-about', t.footAbout);
    txt('foot-copy', t.footCopy);
    var legal = $('foot-legal');
    if (legal) legal.innerHTML = t.footLegal.map(function (l) {
      return '<a href="#">' + esc(l) + '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * Render all copy from the dictionary
   * ------------------------------------------------------------------ */
  function render() {
    var t = T();

    // Header
    var nav = $('nav');
    if (nav) {
      var keys = ['nav-explore', 'nav-learn', 'nav-models', 'nav-tools', 'nav-updates'];
      nav.innerHTML = t.nav.map(function (label, i) {
        return '<a href="#" data-guide="' + keys[i] + '">' + esc(label) + '</a>';
      }).join('');
    }
    txt('search-label', t.search);
    txt('signup', t.signUp);
    txt('guide-help', t.guideHelp);

    // Hero
    var ht = $('hero-title');
    if (ht) ht.innerHTML = t.heroTitle.map(function (l) { return '<span class="nw">' + esc(l) + '</span>'; }).join('<br>');
    txt('hero-lede', t.heroLede);
    txt('btn-search', t.btnSearch);
    txt('btn-browse', t.btnBrowse);

    // Sections
    txt('what-eyebrow', t.whatEyebrow);
    txt('what-heading', t.whatHeading);
    txt('areas-eyebrow', t.areasEyebrow);
    txt('areas-heading', t.areasHeading);
    txt('areas-lede', t.areasLede);
    txt('res-eyebrow', t.resEyebrow);
    txt('res-heading', t.resHeading);
    txt('res-lede', t.resLede);
    txt('how-eyebrow', t.howEyebrow);
    txt('how-heading', t.howHeading);
    txt('how-lede', t.howLede);
    txt('cta-heading', t.ctaHeading);
    txt('cta-body', t.ctaBody);
    txt('btn-browse-2', t.ctaBtnPrimary);
    txt('btn-search-2', t.ctaBtnSecondary);
    txt('cta-note', t.ctaNote);
    txt('code-panel-title', t.codePanelTitle);

    buildHeroStats();
    buildWhat();
    buildAreas();
    buildResources();
    buildSteps();
    buildFooter();

    var lt = $('lang-toggle');
    if (lt) {
      lt.textContent = lang === 'ar' ? 'EN' : 'ع';
      lt.setAttribute('aria-label', t.langToggle);
      lt.setAttribute('title', t.langToggle);
      lt.setAttribute('aria-pressed', String(lang === 'ar'));
    }
    var tt = $('theme-toggle');
    if (tt) { tt.setAttribute('aria-label', t.themeToggle); tt.setAttribute('title', t.themeToggle); }

    // Code window caption follows the active language.
    if ($('cp-caption')) $('cp-caption').textContent = t.codePanelCaption;
    var g = $('guide');
    if (g) g.setAttribute('aria-label', t.guideAria);
    var cs = $('gc-send');
    if (cs) cs.textContent = t.guideSend;
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */
  function wire() {
    var lt = $('lang-toggle');
    if (lt) lt.addEventListener('click', function () { applyLang(lang === 'ar' ? 'en' : 'ar'); });
    var tt = $('theme-toggle');
    if (tt) tt.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    // The help button is the discoverable alternative to knowing the M key:
    // it explains whatever is currently hovered or focused.
    var help = $('guide-help');
    if (help) help.addEventListener('click', function (e) {
      e.preventDefault();
      var d = window.AIHUBGuideDebug;
      if (!d) return;
      var key = d.activeKey && d.activeKey();
      if (key) d.dashTo(key, document.querySelector('[data-guide="' + key + '"]'));
      else d.dashTo('guide-help', help);
    });

    // Footer language column switches language directly.
    document.addEventListener('click', function (e) {
      var la = e.target.closest && e.target.closest('[data-lang]');
      if (la) { e.preventDefault(); applyLang(la.getAttribute('data-lang')); return; }
      // Nav links and placeholder buttons must not navigate anywhere.
      var a = e.target.closest && e.target.closest('a[href="#"]');
      if (a) e.preventDefault();
      var b = e.target.closest && e.target.closest('button:not([type])');
      if (b && !b.id) e.preventDefault();
    });

    // Pause the code window while the tab is hidden; resume on return.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (CP.timer) { clearTimeout(CP.timer); CP.timer = null; }
      } else if (CP.code) {
        cpResume();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function boot() {
    applyTheme(savedTheme());
    applyLang(savedLang());
    wire();
    cpInit();
    wireV2();   // after cpInit so #code-panel exists
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Small public surface for the guide and for manual QA from the console.
  window.AIHUBPage = {
    setLang: applyLang,
    setTheme: applyTheme,
    getLang: function () { return lang; },
    getTheme: function () { return root.getAttribute('data-theme'); },
    counts: { course: function () { return count('course'); },
              concept: function () { return count('concept'); },
              mcp: function () { return count('mcp'); },
              skill: function () { return count('skill'); } }
  };
})();
