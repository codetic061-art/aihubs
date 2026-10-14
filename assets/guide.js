/* =====================================================================
   AI HUB — SMALL CONTEXTUAL GUIDE (assistant, not a decoration)
   Wraps the head-only <agent-robot-avatar> component (MIT, CX ART Lab).
   The component owns its own eye tracking, blinking, inertial head
   motion, squeeze and antenna drag. This file adds ONLY the page
   behaviour the work order asks for, and nothing that makes the robot
   move on its own:

     DEFAULT   the robot sits fixed in the bottom-right corner and
               never moves. No continuous motion, no random dashes,
               no automatic chasing of the pointer.
     M / tap   with an eligible element hovered or focused, press M
               (or tap the robot's help button) to trigger ONE short
               dash toward that element and one explanation.
     Dbl-click double-click the robot to open its chat panel in place.

   Everything runs locally. No AI calls, no network, no backend.
   ===================================================================== */
(function () {
  'use strict';

  var guide = document.getElementById('guide');
  var bubble = document.getElementById('guide-bubble');
  var chat = document.getElementById('guide-chat');
  if (!guide || !bubble) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------ *
   * Copy + theme
   * Per-target explanations live under `guide`; a few lines (the idle
   * prompt, the chat copy) are top-level locale keys. Look in both so
   * a key is never silently missing just because it sits elsewhere. */
  function copy(key) {
    var dict = window.AIHUB_I18N || {};
    var lang = document.documentElement.getAttribute('lang') || 'en';
    var entry = dict[lang] || dict.en || {};
    var v = (entry.guide || {})[key];
    if (v) return v;
    return entry[key] || '';
  }

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      body: (cs.getPropertyValue('--bot-fill') || '').trim() || '#FBF8F2',
      stroke: (cs.getPropertyValue('--bot-stroke') || '').trim() || '#111110',
      visor: (cs.getPropertyValue('--bot-visor') || '').trim() || '#0A0A0A',
      eye: (cs.getPropertyValue('--bot-eye') || '').trim() || '#FFFFFF'
    };
  }

  var GUIDEG = {
    retheme: function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var c = themeColors();
      // Head silhouette: ink on light, cream on dark — locked to the same
      // palette the large V2 mascot and the line-art bot use.
      guide.setAttribute('color', dark ? c.body : c.visor);
      if (chat) chat.setAttribute('data-theme', dark ? 'dark' : 'light');
    }
  };
  window.AIHUBGuide = GUIDEG;

  /* ------------------------------------------------------------------ *
   * Position
   * The guide is position:fixed with pointer-events managed per state:
   *   parked  → pointer-events:none  (clicks pass straight through)
   *   active  → pointer-events:auto  (so it can be squeezed/dragged)
   * ------------------------------------------------------------------ */
  function place(guidePos, bubblePos) {
    guide.style.setProperty('--gx', Math.round(guidePos.x) + 'px');
    guide.style.setProperty('--gy', Math.round(guidePos.y) + 'px');
    if (bubblePos) {
      bubble.style.setProperty('--bx', Math.round(bubblePos.x) + 'px');
      bubble.style.setProperty('--by', Math.round(bubblePos.y) + 'px');
    }
  }

  function guideSize() { return guide.offsetWidth || 54; }

  /* The one and only resting position: bottom-right of the viewport. */
  function homePos() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = guideSize(), pad = 20;
    return { x: vw - s - pad, y: vh - s - pad };
  }

  var parked = false;      // false while the guide is away from home

  /* park() must be able to run twice: it is the single source of truth for
     the resting position, so it re-places unconditionally and only skips the
     transition restart. An early return on `parked` broke the idle bubble,
     which is shown by calling park() right after boot had already parked. */
  function park() {
    var wasParked = parked;
    parked = true;
    guide.classList.remove('is-active');
    if (chat) chat.classList.remove('is-open');
    currentKey = null;
    var h = homePos();
    var s = guideSize();
    var line = copy('guide-idle') || '';
    if (!line) {
      bubble.textContent = '';
      bubble.classList.remove('is-visible');
      place(h, null);
      if (!wasParked) guide.classList.add('is-visible');
      return;
    }
    bubble.textContent = line;
    var bw = bubble.offsetWidth || 220, bh = bubble.offsetHeight || 40;
    var vw = window.innerWidth, vh = window.innerHeight;
    var bx = Math.max(10, Math.min(h.x - bw + s, vw - bw - 10));
    var by = Math.max(10, h.y - bh - 12);
    place(h, { x: bx, y: by });
    if (!wasParked) void guide.offsetWidth;
    guide.classList.add('is-visible');
    bubble.classList.add('is-visible');
  }

  /* Show the idle "Need anything?" line. Copy comes from the dictionary. */
  function showIdle() { park(); }

  /* ------------------------------------------------------------------ *
   * ONE short dash + ONE explanation, only when explicitly requested.
   * ------------------------------------------------------------------ */
  var currentKey = null;      // the target currently being explained
  var bubbleTimer = null;
  var lastDash = 0;
  var DASH_COOLDOWN = 900;    // ms — stops accidental double-firing

  function dashTo(key, target) {
    if (!key || !copy(key)) { park(); return; }
    var now = Date.now();
    if (key === currentKey && bubble.classList.contains('is-visible')) return;
    if (now - lastDash < DASH_COOLDOWN) return;
    lastDash = now;
    currentKey = key;
    parked = false;

    // Set the copy FIRST so the bubble is measured at its real size.
    bubble.textContent = copy(key);

    var r = target.getBoundingClientRect();
    var s = guideSize();
    var bw = bubble.offsetWidth || 232, bh = bubble.offsetHeight || 44;
    var vw = window.innerWidth, vh = window.innerHeight;
    var rtl = document.documentElement.getAttribute('dir') === 'rtl';

    // Sit beside the target: below it when there is room, above otherwise.
    var below = r.bottom + s + 12 < vh;
    var gx = rtl ? (r.right - s) : r.left;
    var gy = below ? (r.bottom + 8) : (r.top - s - 8);
    gx = Math.max(8, Math.min(gx, vw - s - 8));
    gy = Math.max(8, Math.min(gy, vh - s - 8));

    var bx = rtl ? (gx + s - bw) : gx;
    var by = below ? (gy - bh - 10) : (gy + s + 10);
    bx = Math.max(8, Math.min(bx, vw - bw - 8));
    by = Math.max(8, Math.min(by, vh - bh - 8));

    place({ x: gx, y: gy }, { x: bx, y: by });

    void guide.offsetWidth;   // force a reflow so the transition restarts
    guide.classList.add('is-visible', 'is-active');
    bubble.classList.add('is-visible');

    // Play the component's own expression so the dash reads as intentional.
    if (typeof guide.play === 'function') {
      try { guide.play('inspect'); } catch (e) {}
    }
    if (chat) chat.classList.remove('is-open');

    // Return home after a short beat; the explanation stays a moment longer.
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      bubble.classList.remove('is-visible');
      setTimeout(park, 260);
    }, 3600);
  }

  function dismiss() {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubble.classList.remove('is-visible');
    park();
  }

  /* ------------------------------------------------------------------ *
   * Which element is "eligible" — the one under the pointer / focus.
   * ------------------------------------------------------------------ */
  var hoverNode = null;
  var focusNode = null;

  function keyOf(el) {
    var node = el && el.closest ? el.closest('[data-guide]') : null;
    return node ? node.getAttribute('data-guide') : null;
  }

  function live(node) {
    // A node is only usable if it is still in the document AND still
    // carries a data-guide key. Stale references otherwise outlive their
    // element and make the M key explain the wrong thing.
    return node && node.isConnected && keyOf(node) ? node : null;
  }

  function currentTarget() {
    // Focus wins over hover: the keyboard user must get the same result.
    var f = live(focusNode);
    if (f) return f.closest('[data-guide]');
    var h = live(hoverNode);
    return h ? h.closest('[data-guide]') : null;
  }

  function activeKey() {
    var node = currentTarget();
    return node ? node.getAttribute('data-guide') : null;
  }

  /* Pointer movement only RECORDS the candidate. It never moves the robot. */
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    hoverNode = keyOf(e.target) ? e.target.closest('[data-guide]') : null;
  }, { passive: true });

  // Leaving the target clears it. Without this the pointer position goes
  // stale and the M key would explain a control the user is not on.
  document.addEventListener('pointerout', function (e) {
    if (e.pointerType === 'touch') return;
    if (keyOf(e.target) && e.target.closest('[data-guide]') === hoverNode) {
      hoverNode = null;
    }
  }, { passive: true });

  document.addEventListener('pointerleave', function () { hoverNode = null; }, true);

  document.addEventListener('focusin', function (e) {
    focusNode = keyOf(e.target) ? e.target.closest('[data-guide]') : null;
  }, true);

  document.addEventListener('focusout', function () { focusNode = null; }, true);

  // A tap on an eligible element also requests the explanation, so touch
  // users are not left needing a keyboard.
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    var node = keyOf(e.target);
    if (node) {
      e.preventDefault();   // record the request, don't follow a placeholder
      hoverNode = node;
      dashTo(node.getAttribute('data-guide'), node);
    }
  }, { passive: false });

  /* ------------------------------------------------------------------ *
   * The M shortcut — only when an element is eligible, and NEVER while
   * the user is typing. Ordinary typing must be untouched.
   * ------------------------------------------------------------------ */
  function isTyping(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    var tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  document.addEventListener('keydown', function (e) {
    // Only the bare M key, no modifiers, and never inside a text field.
    if (e.key !== 'm' && e.key !== 'M') return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    if (isTyping(e.target) || isTyping(document.activeElement)) return;
    if (e.repeat) return;                    // holding M must not spam

    var node = currentTarget();
    if (!node) return;                       // nothing eligible → ignore
    e.preventDefault();
    var key = node.getAttribute('data-guide');
    dashTo(key, node);
  });

  /* Escape closes whatever the guide is showing. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (chat && chat.classList.contains('is-open')) { closeChat(); return; }
    if (bubble.classList.contains('is-visible')) dismiss();
  });

  /* ------------------------------------------------------------------ *
   * Chat panel — opened by double-click, in place, never flying away.
   * ------------------------------------------------------------------ */
  function openChat() {
    if (!chat) return;
    // Chat replaces the bubble, so never show both.
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubble.classList.remove('is-visible');
    currentKey = null;
    chat.hidden = false;              // `hidden` beats any CSS class */
    chat.classList.add('is-open');
    renderChat();
    var h = homePos();
    place(h, null);
    // The guide must accept pointer events for its own dblclick to land,
    // and the panel is anchored just above it.
    guide.classList.add('is-visible', 'is-active');
    var input = chat.querySelector('.gc-input');
    if (input) input.focus();
  }

  function closeChat() {
    if (!chat) return;
    chat.classList.remove('is-open');
    chat.hidden = true;
    var h = homePos();
    place(h, null);
    showIdle();
  }

  /* The topic line may be an array (older dictionaries) or a plain
     string. Accept both so neither shape can throw. */
  function topics(t) {
    var v = t.guideChatTopics;
    if (Array.isArray(v)) return v.join(' \u00b7 ');
    return v || '';
  }

  function renderChat() {
    if (!chat) return;
    var body = chat.querySelector('.gc-log');
    var t = window.AIHUB_I18N[document.documentElement.getAttribute('lang')] ||
            window.AIHUB_I18N.en;
    if (body) body.innerHTML =
      '<p class="gc-msg">' + esc(t.guideChatIntro) + '</p>' +
      '<p class="gc-msg gc-muted">' + esc(topics(t)) + '</p>';
    var ph = chat.querySelector('.gc-input');
    if (ph) ph.setAttribute('placeholder', t.guideChatPlaceholder);
    var lbl = chat.querySelector('.gc-title');
    if (lbl) lbl.textContent = t.guideChatTitle;
  }

  // A canned, clearly-labelled reply. This is a local demo, not an AI.
  function chatReply(q) {
    var t = window.AIHUB_I18N[document.documentElement.getAttribute('lang')] ||
            window.AIHUB_I18N.en;
    return t.guideChatReply;
  }

  function chatSubmit() {
    if (!chat) return;
    var input = chat.querySelector('.gc-input');
    var body = chat.querySelector('.gc-log');
    var q = (input && input.value || '').trim();
    if (!q) return;
    if (body) {
      body.insertAdjacentHTML('beforeend', '<p class="gc-msg gc-me">' + esc(q) + '</p>');
      body.insertAdjacentHTML('beforeend', '<p class="gc-msg">' + esc(chatReply(q)) + '</p>');
      body.scrollTop = body.scrollHeight;
    }
    if (input) input.value = '';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Double-click the robot → open the chat. It stays where it is. */
  guide.addEventListener('dblclick', function (e) {
    e.preventDefault();
    if (chat && chat.classList.contains('is-open')) closeChat();
    else openChat();
  });

  /* A single click on the robot asks for help with the current target,
     which is the discoverable alternative to knowing the M shortcut. */
  guide.addEventListener('click', function () {
    if (chat && chat.classList.contains('is-open')) return;
    var node = currentTarget();
    if (node) { dashTo(node.getAttribute('data-guide'), node); return; }
    if (typeof guide.play === 'function') {
      try { guide.play('success'); } catch (e) {}
    }
    showIdle();
  });

  /* The chat's own close button + send button. */
  if (chat) {
    var close = chat.querySelector('.gc-close');
    if (close) close.addEventListener('click', function (e) { e.stopPropagation(); closeChat(); });
    var send = chat.querySelector('.gc-send');
    if (send) send.addEventListener('click', function (e) { e.stopPropagation(); chatSubmit(); });
    // The input is inside a <form>, so Enter fires a native submit. Handle
    // it here or the browser navigates and the panel disappears.
    var form = chat.querySelector('.gc-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      chatSubmit();
    });
    var input = chat.querySelector('.gc-input');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); chatSubmit(); }
        e.stopPropagation();
      });
      // Clicks inside the chat must not reach the guide's own handlers.
      chat.addEventListener('click', function (e) { e.stopPropagation(); });
      chat.addEventListener('dblclick', function (e) { e.stopPropagation(); });
    }
  }

  /* ------------------------------------------------------------------ *
   * Keep the resting position correct after resize / language flip.
   * ------------------------------------------------------------------ */
  var rafId = null;
  function reposition() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      if (parked) park();
      else if (currentKey) {
        var node = document.querySelector('[data-guide="' + currentKey + '"]');
        if (node) dashTo(currentKey, node); else park();
      }
    });
  }
  window.addEventListener('resize', reposition, { passive: true });
  window.addEventListener('scroll', function () {
    // The guide is fixed, so scrolling must not drag it away from home.
    if (parked) reposition();
  }, { passive: true });

  document.addEventListener('aihub:langchange', function () {
    if (chat && chat.classList.contains('is-open')) renderChat();
    else showIdle();
  });
  document.addEventListener('aihub:themechange', GUIDEG.retheme);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', reposition);
  else if (reduceMotion.addListener) reduceMotion.addListener(reposition);

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function boot() {
    GUIDEG.retheme();
    park();
    showIdle();
    if (reduceMotion.matches) guide.setAttribute('motion', 'reduce');
    else guide.removeAttribute('motion');
  }

  if (window.customElements && customElements.whenDefined) {
    customElements.whenDefined('agent-robot-avatar').then(boot).catch(boot);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { GUIDEG.retheme(); });
  } else {
    GUIDEG.retheme();
  }

  /* Public surface for QA. */
  window.AIHUBGuideDebug = {
    dashTo: dashTo,
    dismiss: dismiss,
    park: park,
    showIdle: showIdle,
    openChat: openChat,
    closeChat: closeChat,
    isParked: function () { return parked; },
    key: function () { return currentKey; },
    activeKey: activeKey,
    retheme: GUIDEG.retheme
  };
})();
