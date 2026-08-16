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

  /* ── Hero video ────────────────────────────────────────────────────────────
     Sources are attached from data-* attributes rather than written into the
     markup, which means the clip is never requested unless we decide it should
     be. We decline in four cases:

       • prefers-reduced-motion — vestibular safety, and it is a stated choice
       • Save-Data — the visitor has asked every site not to do this
       • narrow viewports — most traffic here is a phone on cell data, and the
         still is already the whole message
       • no <video> support

     In all four the poster still remains, which is a complete hero on its own.
     That is why the still is real markup and not the `poster` attribute.       */
  var heroes = document.querySelectorAll('.mhero[data-video]');
  if (!heroes.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || {};
  var wideEnough = window.matchMedia('(min-width: 700px)').matches;

  function shouldPlay() {
    return wideEnough && !reduceMotion.matches && !conn.saveData;
  }

  Array.prototype.forEach.call(heroes, function (hero) {
    var video = hero.querySelector('.mhero__video');
    var toggle = hero.querySelector('[data-motion-toggle]');
    if (!video || typeof video.canPlayType !== 'function') return;

    var attached = false;
    var paused = false;

    function attach() {
      if (attached) return;
      attached = true;

      // The build measured both encodes and put the smaller one in
      // data-first. Browsers take the first playable <source>, and every one
      // of them plays H.264, so a fixed WebM-first order shipped the bigger
      // file on the clips where VP9 lost.
      var order = video.getAttribute('data-first') === 'mp4'
        ? [['mp4', 'video/mp4'], ['webm', 'video/webm']]
        : [['webm', 'video/webm'], ['mp4', 'video/mp4']];
      order.forEach(function (pair) {
        var src = video.getAttribute('data-' + pair[0]);
        if (!src) return;
        var el = document.createElement('source');
        el.src = src;
        el.type = pair[1];
        video.appendChild(el);
      });

      video.addEventListener('playing', function () {
        video.setAttribute('data-playing', '');
        if (toggle) toggle.hidden = false;
      }, { once: true });

      video.load();
      var p = video.play();
      // Autoplay can still be refused (low power mode, browser policy). That is
      // not an error worth surfacing — the still is already correct.
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        paused = !paused;
        if (paused) video.pause();
        else video.play().catch(function () {});
        // The label carries the state, so there is no aria-pressed. Using both
        // contradicted itself: one click produced a button labelled "Play" with
        // aria-pressed="true", which announces as "Play, toggle button, pressed"
        // — playback engaged — while the video was in fact paused. aria-pressed
        // was also absent until that first click, so the control changed role
        // partway through the session.
        toggle.textContent = paused ? 'Play' : 'Pause';
        toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
      });
    }

    // Someone can turn reduced-motion on while the page is open.
    var onChange = function () {
      if (reduceMotion.matches) {
        video.pause();
        video.removeAttribute('data-playing');
        if (toggle) toggle.hidden = true;
      } else if (!paused) {
        shouldPlay() && (attached ? video.play().catch(function () {}) : attach());
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onChange);
    else if (reduceMotion.addListener) reduceMotion.addListener(onChange);

    if (!shouldPlay()) return;

    // Wait for load so the clip never competes with the LCP paint or the fonts.
    if (document.readyState === 'complete') attach();
    else window.addEventListener('load', attach, { once: true });
  });
})();
