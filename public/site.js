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
      hero.setAttribute('data-scrubbing', '');
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

    /* Writes the two custom properties the hero reads.

       PUSH RANGE 1 -> 1.055. Enough that a reader notices the frame closing
       while the shot advances, small enough that it is not a zoom effect. The
       floor is exactly 1 and never below: .mhero clips and .mhero__bg is
       inset:0, so anything under 1 pulls the edges in and shows the page
       behind the hero.

       The copy lift eases out rather than tracking linearly, so the type
       settles early and holds while the frame keeps closing. Linear on both
       made the whole hero feel like it was sliding. */
    function setPush(p) {
      if (reduceMotion.matches) {
        hero.style.removeProperty('--mhero-scale');
        hero.style.removeProperty('--mhero-lift');
        return;
      }
      var x = p < 0 ? 0 : p > 1 ? 1 : p;
      hero.style.setProperty('--mhero-scale', String(1 + x * 0.055));
      hero.style.setProperty('--mhero-lift', (1 - Math.pow(1 - x, 3)).toFixed(3));
    }

    function update() {
      frame = null;
      if (!ready || !shouldScrub()) return;
      var d = video.duration;
      if (!d || !isFinite(d)) return;
      // Measured against the runway, not the hero.
      //
      // The hero is position: sticky and nothing on a sticky element reports
      // where it would have been — getBoundingClientRect().top pins at 0 and
      // offsetTop tracks the scroll, so both gave a progress of exactly zero
      // at every position and the clip never advanced a frame. The runway is
      // an ordinary block and does not pin, so its rect is honest.
      //
      // Travel is the distance the hero actually stays put for: the runway's
      // height less the hero's own. Scrubbing against that means the shot
      // plays through exactly while the hero is held, and is finished at the
      // moment it starts to leave.
      var runway = hero.parentElement;
      var travel = Math.max(runway.offsetHeight - hero.offsetHeight, 1);
      var start = runway.getBoundingClientRect().top + window.scrollY;
      var scrolled = Math.min(Math.max(window.scrollY - start, 0), travel);
      var t = (scrolled / travel) * d;
      // Only seek when the target frame actually differs. At 12fps a scroll of
      // a few pixels resolves to the same frame, and re-seeking to it stalls
      // the decoder for no visible gain.
      /* The push-in, from the SAME progress that drives the clip.
         Computed before the frame-snapping below, because scale is continuous
         and the seek is not: snapping the scale to twelfths would step it
         visibly, and returning early on an unchanged frame would freeze it
         between seeks. */
      setPush(scrolled / travel);

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
        hero.removeAttribute('data-scrubbing');
        setPush(0);   // clears both properties; see setPush
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

/* ── Contact form ─────────────────────────────────────────────────────────
   Sends the enquiry to RankEngineAI's lead capture as JSON.

   WHY JS AND NOT A NATIVE FORM POST. The endpoint takes JSON with a client_id
   and answers with JSON; a native POST would send urlencoded fields and
   navigate the visitor away to a 400. So the form carries no action, the
   markup keeps onsubmit="return false", and a <noscript> notice tells anyone
   without JavaScript to call instead. Nothing here fails silently: if this
   file does not load, the visitor is told, rather than typing into a form that
   quietly discards them.

   THE STATUS LINE IS THE POINT. The previous form looked like it worked and
   threw every message away. Whatever happens here, the visitor is told which
   of the three things happened: sent, not sent, or the phone number instead. */
(function () {
  var form = document.querySelector('form.form[data-endpoint]');
  if (!form) return;

  var endpoint = form.getAttribute('data-endpoint');
  var clientId = form.getAttribute('data-client-id');
  var status = form.querySelector('[data-form-status]');
  var button = form.querySelector('button[type="submit"]');
  if (!endpoint || !clientId || !status || !button) return;

  var val = function (n) {
    var el = form.querySelector('[name="' + n + '"]');
    return el && el.value ? String(el.value).trim() : '';
  };

  var say = function (text, ok) {
    status.textContent = text;
    status.hidden = false;
    status.setAttribute('data-state', ok ? 'ok' : 'error');
    status.setAttribute('role', 'status');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* The browser has already enforced `required` on name and phone; this is
       the belt for the case where it has not. */
    if (!val('name') || !val('phone')) {
      say('Please give us a name and a phone number so we can call you back.', false);
      return;
    }

    var original = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';

    /* The issue dropdown and the city field are the useful part of the
       message: what they are seeing, and where. Sent as the message body
       rather than dropped, because a lead with neither is a callback with no
       context. */
    var parts = [];
    if (val('issue')) parts.push(val('issue'));
    if (val('city')) parts.push('City: ' + val('city'));
    if (val('message')) parts.push(val('message'));

    fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        name: val('name'),
        phone: val('phone'),
        email: val('email'),
        message: parts.join('\n'),
        city: val('city'),
        form_source: 'contact',
        landing_path: window.location.pathname
      })
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(String(r.status))); })
      .then(function () {
        form.reset();
        say('Thank you. We have your message and will call you back.', true);
        button.textContent = 'Sent';
      })
      .catch(function () {
        /* Never claim it sent. The phone number is the recovery route, and it
           is the one thing on this site that has always worked. */
        button.disabled = false;
        button.textContent = original;
        say('That did not send. Please call us on (561) 680-3584 and we will take it from there.', false);
      });
  });
})();

/* ── Fig 1: scroll-drive the diagram where CSS cannot ─────────────────────
   The air-path diagram's thesis is that the reader's own scroll carries the
   air through the system. Chrome and Edge (115+) and Safari (26+) do that
   natively with animation-timeline; Firefox has no support, and what it got
   instead was a 4.5s clip starting 2.6s after load, once — finished long
   before anyone scrolled down to the figure. The animation played to nobody.

   So where the feature is missing, this drives --dg-cover and the paused
   animations in styles.css are scrubbed by it. Same ranges, same keyframes,
   one effect.

   NOTHING RUNS WHERE THE NATIVE PATH WORKS. The feature test is the same one
   the CSS uses, and on a supporting browser this returns immediately without
   attaching a listener. */
(function () {
  var figures = document.querySelectorAll('figure.diagram');
  if (!figures.length) return;

  /* Identical to the CSS @supports condition. The animation-range half is not
     optional: some browsers shipped animation-timeline without it, and a
     partial implementation is the one case where both paths would run. */
  var native = window.CSS && CSS.supports &&
    CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  if (native) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) return;

  var frame = null;

  function cover(el) {
    /* The `cover` range, matching the CSS: 0 when the element's top edge meets
       the bottom of the viewport, 1 when its bottom edge leaves the top. The
       denominator is viewport + element height, which is the distance the
       element travels through the viewport. */
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var travelled = vh - r.top;
    var total = vh + r.height;
    var p = travelled / total;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  function update() {
    frame = null;
    for (var i = 0; i < figures.length; i++) {
      figures[i].style.setProperty('--dg-cover', cover(figures[i]).toFixed(4));
    }
  }

  function onScroll() {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  }

  for (var i = 0; i < figures.length; i++) {
    figures[i].setAttribute('data-scroll-fallback', '');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* Turning the preference on mid-session stops it and hands the figure back
     to its static state, rather than leaving it frozen mid-animation. */
  if (reduce) {
    var off = function () {
      if (!reduce.matches) return;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      for (var j = 0; j < figures.length; j++) {
        figures[j].removeAttribute('data-scroll-fallback');
        figures[j].style.removeProperty('--dg-cover');
      }
    };
    if (reduce.addEventListener) reduce.addEventListener('change', off);
    else if (reduce.addListener) reduce.addListener(off);
  }
})();
