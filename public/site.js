/* The only JavaScript on the site: the mobile nav, and the hero video.
   Both are progressive enhancements — every nav destination is also in the
   footer, and every hero renders correctly as a still with this file absent. */
(function () {
  /* ── Mobile navigation ─────────────────────────────────────────────────── */
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (btn && nav) {
    var setOpen = function (open) {
      if (open) nav.setAttribute('data-open', '');
      else nav.removeAttribute('data-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    };

    btn.addEventListener('click', function () {
      setOpen(!nav.hasAttribute('data-open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.hasAttribute('data-open')) {
        setOpen(false);
        btn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.hasAttribute('data-open')) return;
      if (nav.contains(e.target) || btn.contains(e.target)) return;
      setOpen(false);
    });

    // If the viewport grows past the breakpoint, drop the mobile state so the
    // desktop nav is not left in an inconsistent aria state.
    var mq = window.matchMedia('(min-width: 1081px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(
      function () { if (mq.matches) setOpen(false); },
    );
  }

  /* ── Deep-linked FAQ answers ────────────────────────────────────────────
     A <details> cannot be opened by CSS, so a link to a specific answer would
     otherwise land on a closed question with no indication it is the one you
     came for. Progressive enhancement: without this the link still scrolls to
     the right place. */
  var openTargetDetails = function () {
    var id = decodeURIComponent(String(window.location.hash || '').slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || el.tagName.toLowerCase() !== 'details') return;
    el.open = true;
    var summary = el.querySelector('summary');
    if (!summary) return;
    // Opening happens immediately so the answer is expanded before first paint.
    // Focus waits a frame: this file is deferred, so it runs before the browser
    // has finished its own fragment handling, and focus set now is discarded.
    // Without the focus a keyboard or screen-reader user following a link to a
    // specific answer lands at the top of the document instead of on it.
    // Marked before focusing: the stylesheet's only focus ring is
    // :focus-visible-gated, and programmatic focus does not match it, so a
    // keyboard user following a deep link landed on an invisible target.
    el.setAttribute('data-deeplinked', '');
    requestAnimationFrame(function () {
      summary.focus({ preventScroll: true });
      el.scrollIntoView({ block: 'start' });
    });
  };
  openTargetDetails();
  window.addEventListener('hashchange', openTargetDetails);

  /* ── Hero video, scrubbed by scroll ───────────────────────────────────────
     The clip does not play. Its frame is a function of how far the reader has
     scrolled through the hero: scroll down and the shot advances, scroll back
     and it rewinds, stop and it holds. Nothing moves on its own.

     That is why the encode changed. Scrubbing means seeking to an arbitrary
     time on every frame, and the previous clips carried a single keyframe
     each, so every seek decoded from frame zero and the picture snapped. They
     are now all-keyframe — and because a scrubbed clip never loops, they no
     longer need the forward-then-reverse ping-pong that used to double them,
     which paid for the keyframes.

     Declined in four cases, exactly as before: reduced motion, Save-Data,
     narrow viewports, and no <video> support. In all four the poster still
     remains and is the whole hero. It is also why there is no pause control
     any more — WCAG 2.2.2 governs content that moves by itself, and this
     only moves while the reader does.                                        */
  var heroes = document.querySelectorAll('.mhero[data-video]');
  if (!heroes.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || {};

  function shouldScrub() {
    return window.matchMedia('(min-width: 700px)').matches &&
      !reduceMotion.matches && !conn.saveData;
  }

  Array.prototype.forEach.call(heroes, function (hero) {
    var video = hero.querySelector('.mhero__video');
    if (!video || typeof video.canPlayType !== 'function') return;

    var ready = false;
    var attached = false;
    var frame = null;
    var lastSet = -1;

    function attach() {
      if (attached) return;
      attached = true;
      var src = video.getAttribute('data-src');
      if (!src) return;
      // preload=auto here rather than in the markup: the file must be fully
      // buffered before a seek is smooth, but it must not compete with the
      // hero still, which is the LCP element. This runs after window load.
      video.preload = 'auto';
      video.addEventListener('loadeddata', function () {
        ready = true;
        video.setAttribute('data-playing', '');   // fades the clip in over the still
        update();
      }, { once: true });
      // Assigning src is itself a load. Calling load() after it fetched the
      // clip twice — visible as two requests for the same file in the network
      // log — so the assignment stands alone.
      video.src = src;
    }

    function update() {
      frame = null;
      if (!ready || !shouldScrub()) return;
      var d = video.duration;
      if (!d || !isFinite(d)) return;
      // Measured from the section BELOW the hero, not from the hero.
      //
      // The hero is position: sticky, and nothing on a sticky element reports
      // where it would have been: getBoundingClientRect().top pins at 0, and
      // offsetTop tracks the scroll so start grew in step with scrollY. Both
      // gave a progress of exactly zero at every position and the clip never
      // advanced a frame. The next section is position: relative and does not
      // pin, so its document top is stable — and the hero's bottom edge is
      // that, by definition.
      var travel = hero.offsetHeight || 1;
      var next = hero.nextElementSibling;
      var start = next
        ? next.getBoundingClientRect().top + window.scrollY - travel
        : 0;
      var scrolled = Math.min(Math.max(window.scrollY - start, 0), travel);
      var t = (scrolled / travel) * d;
      // Only seek when the target frame actually differs. At 12fps a scroll of
      // a few pixels resolves to the same frame, and re-seeking to it stalls
      // the decoder for no visible gain.
      var snapped = Math.round(t * 12) / 12;
      if (snapped === lastSet) return;
      lastSet = snapped;
      try { video.currentTime = Math.min(snapped, d - 0.001); } catch (e) { /* seek before ready */ }
    }

    function onScroll() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    }

    var onMotionChange = function () {
      if (reduceMotion.matches) {
        video.removeAttribute('data-playing');
      } else if (shouldScrub()) {
        attached ? update() : attach();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
    else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    if (!shouldScrub()) return;
    if (document.readyState === 'complete') attach();
    else window.addEventListener('load', attach, { once: true });
  });
})();
