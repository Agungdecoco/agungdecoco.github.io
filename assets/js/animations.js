/* ============================================================
   PORTFOLIO ANIMATIONS — Powered by anime.js
   ============================================================ */

(function () {
  'use strict';

  if (typeof anime === 'undefined') {
    console.error('anime.js not loaded — animations disabled');
    if (typeof feather !== 'undefined') feather.replace();
    return;
  }

  // ── Theme toggle ──────────────────────────────────────────
  (function initTheme() {
    const root = document.documentElement;
    const stored = localStorage.getItem('portfolio-theme');
    root.setAttribute('data-theme', stored || 'light');

    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  })();

  // ── Feather icons ─────────────────────────────────────────
  if (typeof feather !== 'undefined') feather.replace();

  // ── Helpers ───────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Cursor glow ───────────────────────────────────────────
  (function initCursor() {
    const glow = $('#cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    (function tick() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      // transform avoids reflow and keeps text crisp
      glow.style.transform = `translate(calc(${Math.round(glowX)}px - 50%), calc(${Math.round(glowY)}px - 50%))`;
      requestAnimationFrame(tick);
    })();
  })();

  // ── Navbar scroll effect ──────────────────────────────────
  (function initNavbar() {
    const nav = $('#navbar');
    if (!nav) return;
    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  // ── Smooth-scroll anchor links ────────────────────────────
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Floating background orbs ──────────────────────────────
  function animateOrbs() {
    $$('.orb').forEach((orb, i) => {
      function orbCycle() {
        anime({
          targets: orb,
          translateX: anime.random(-80, 80),
          translateY: anime.random(-80, 80),
          scale: 0.85 + Math.random() * 0.3,
          duration: anime.random(6000, 11000),
          easing: 'easeInOutSine',
          delay: i * 900,
          complete: orbCycle,
        });
      }
      orbCycle();
    });
  }

  // ── Hero entrance sequence ────────────────────────────────
  function heroEntrance() {
    // Split hero words into character spans
    $$('.hero-word').forEach(wordEl => {
      const text = wordEl.textContent;
      wordEl.textContent = '';
      text.split('').forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.display = 'inline-block';
        wordEl.appendChild(span);
      });
    });

    const tl = anime.timeline({ easing: 'easeOutExpo' });

    tl
      // Navbar slides in
      .add({
        targets: '#navbar',
        opacity: [0, 1],
        translateY: [-28, 0],
        duration: 700,
      })
      // Badge fades up
      .add({
        targets: '#heroBadge',
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 600,
      }, '-=350')
      // Title: each word block
      .add({
        targets: '.hero-word',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(140),
        duration: 700,
      }, '-=300')
      // Title: individual chars spring in
      .add({
        targets: '.hero-word span',
        opacity: [0, 1],
        translateY: [40, 0],
        delay: anime.stagger(30, { from: 'first' }),
        duration: 600,
        easing: 'easeOutExpo',
      }, '-=650')
      // Subtitle
      .add({
        targets: '#heroSubtitle',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, '-=300')
      // Description
      .add({
        targets: '#heroDescription',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, '-=400')
      // CTA buttons
      .add({
        targets: '#heroCta .btn',
        opacity: [0, 1],
        scale: [0.85, 1],
        delay: anime.stagger(110),
        duration: 600,
        easing: 'easeOutBack',
      }, '-=350');

    return tl.finished;
  }

  // ── Scroll-triggered animations ───────────────────────────
  function initScrollAnimations() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Section headers
    const hdrObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        anime({
          targets: Array.from(entry.target.children),
          opacity: [0, 1],
          translateY: [28, 0],
          delay: anime.stagger(90),
          duration: 700,
          easing: 'easeOutExpo',
        });
        hdrObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    $$('[data-animate="header"]').forEach(el => {
      if (reduced) return;
      Array.from(el.children).forEach(c => { c.style.opacity = '0'; });
      hdrObs.observe(el);
    });

    // ── Stats
    const statsSection = $('.stats-section');
    if (statsSection) {
      const statsObs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        anime({
          targets: '.stat-item',
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.88, 1],
          delay: anime.stagger(80),
          duration: 700,
          easing: 'easeOutBack',
        });

        $$('.count-up').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const obj = { val: 0 };
          anime({
            targets: obj,
            val: target,
            round: 1,
            duration: 1800,
            easing: 'easeOutExpo',
            delay: 400,
            update() { el.textContent = obj.val; },
          });
        });

        statsObs.disconnect();
      }, { threshold: 0.25 });

      if (!reduced) {
        $$('.stat-item').forEach(el => { el.style.opacity = '0'; });
      }
      statsObs.observe(statsSection);
    }

    // ── Experience timeline
    const timeline = $('.timeline');
    if (timeline) {
      const tlObs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        anime({
          targets: '.timeline-item',
          opacity: [0, 1],
          translateX: [-40, 0],
          delay: anime.stagger(120),
          duration: 700,
          easing: 'easeOutExpo',
        });
        tlObs.disconnect();
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      if (!reduced) {
        $$('.timeline-item').forEach(el => { el.style.opacity = '0'; });
      }
      tlObs.observe(timeline);
    }

    // ── Project & skill cards
    ['.projects-grid', '.skills-grid'].forEach(gridSel => {
      const grid = $(gridSel);
      if (!grid) return;

      const cardObs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        const cards = $$('[data-animate="card"]', entry.target);
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [55, 0],
          delay: anime.stagger(75),
          duration: 750,
          easing: 'easeOutExpo',
        });

        cardObs.disconnect();
      }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

      cardObs.observe(grid);
    });

    // ── Contact card
    const contactEl = $('[data-animate="contact"]');
    if (contactEl) {
      const cObs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        anime({
          targets: contactEl,
          opacity: [0, 1],
          scale: [0.94, 1],
          translateY: [30, 0],
          duration: 900,
          easing: 'easeOutExpo',
        });
        cObs.disconnect();
      }, { threshold: 0.2 });
      cObs.observe(contactEl);
    }
  }

  // ── Tech icon elastic hover ───────────────────────────────
  function initTechHover() {
    $$('.tech-item').forEach(item => {
      let anim;
      const icon = item.querySelector('.tech-icon');
      if (!icon) return;

      item.addEventListener('mouseenter', () => {
        if (anim) anim.pause();
        anim = anime({
          targets: icon,
          rotate: -10,
          scale: 1.3,
          duration: 380,
          easing: 'easeOutElastic(1, .6)',
        });
      });

      item.addEventListener('mouseleave', () => {
        if (anim) anim.pause();
        anim = anime({
          targets: icon,
          rotate: 0,
          scale: 1,
          duration: 420,
          easing: 'easeOutElastic(1, .5)',
        });
      });
    });
  }

  // ── Projects carousel (mobile) ───────────────────────────
  function initCarousel() {
    const grid    = document.getElementById('projectsGrid');
    const dotsEl  = document.getElementById('carouselDots');
    const btnPrev = document.getElementById('carouselPrev');
    const btnNext = document.getElementById('carouselNext');
    if (!grid || !dotsEl) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    if (!cards.length) return;

    // Build dots
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to project ' + (i + 1));
      d.addEventListener('click', () => scrollToCard(i));
      dotsEl.appendChild(d);
    });

    function getCardWidth() {
      return cards[0].offsetWidth + parseInt(getComputedStyle(grid).gap || '16');
    }

    function currentIndex() {
      return Math.round(grid.scrollLeft / getCardWidth());
    }

    function scrollToCard(idx) {
      grid.scrollTo({ left: idx * getCardWidth(), behavior: 'smooth' });
    }

    function updateState() {
      const idx   = currentIndex();
      const atEnd = idx >= cards.length - 1;

      // dots
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });

      // buttons
      if (btnPrev) btnPrev.disabled = idx === 0;
      if (btnNext) btnNext.disabled = atEnd;

      // right-fade mask hint
      grid.classList.toggle('at-end', atEnd);
    }

    if (btnPrev) btnPrev.addEventListener('click', () => scrollToCard(Math.max(0, currentIndex() - 1)));
    if (btnNext) btnNext.addEventListener('click', () => scrollToCard(Math.min(cards.length - 1, currentIndex() + 1)));

    grid.addEventListener('scroll', updateState, { passive: true });
    updateState();

    // Peek animation on first load (mobile only)
    function peekHint() {
      if (window.innerWidth > 768) return;
      // only if user hasn't scrolled yet
      if (grid.scrollLeft > 0) return;
      const peek = Math.round(getCardWidth() * 0.18);
      setTimeout(() => {
        grid.style.scrollBehavior = 'auto';
        grid.scrollLeft = peek;
        setTimeout(() => {
          grid.style.scrollBehavior = '';
          grid.scrollTo({ left: 0, behavior: 'smooth' });
        }, 420);
      }, 1400);
    }

    peekHint();
    window.addEventListener('resize', updateState, { passive: true });
  }

  // ── Project card icon hover ───────────────────────────────
  function initProjectHover() {
    $$('.project-card').forEach(card => {
      const icon = card.querySelector('.project-icon');
      if (!icon) return;

      card.addEventListener('mouseenter', () => {
        anime({
          targets: icon,
          scale: 1.2,
          rotate: -8,
          duration: 400,
          easing: 'easeOutElastic(1, .5)',
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: icon,
          scale: 1,
          rotate: 0,
          duration: 400,
          easing: 'easeOutElastic(1, .5)',
        });
      });
    });
  }

  // ── Timeline scroll indicator ─────────────────────────────
  function initTimelineScroll() {
    const el      = document.getElementById('timelineScroll');
    const fadeTop = document.getElementById('timelineFadeTop');
    const fadeBot = document.getElementById('timelineFadeBottom');
    const ind     = document.getElementById('scrollIndicator');
    if (!el) return;

    function update() {
      const atTop    = el.scrollTop < 12;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12;

      if (fadeTop) fadeTop.style.opacity  = atTop ? '0' : '1';
      if (fadeBot) fadeBot.style.opacity  = atBottom ? '0' : '1';
      if (ind) {
        if (atBottom) ind.classList.add('hidden');
        else          ind.classList.remove('hidden');
      }
    }

    el.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── Project Gallery Modal ─────────────────────────────
  function initProjectModal() {
    const IMAGES = {
      'landing-page':           Array.from({ length: 7 }, (_, i) => `assets/image/project/landing-page_${i + 1}.png`),
      'human-resource-system':  ['assets/image/project/human_resource_system_1.png', 'assets/image/project/human_resource_system_2.png'],
      'guest-book':             ['assets/image/project/guest_book_web.png'],
      'e-commerce':             ['assets/image/project/e_commerce.png'],
      'loyalty-card':           ['assets/image/project/loyalty_card_system.png'],
      'requisition-letter':     ['assets/image/project/requisition_letter.png'],
      'vacancy-web':            ['assets/image/project/vacancy_web.png'],
      'wedding-invitation':     ['assets/image/project/wedding_invitation_maker.png'],
    };

    const TITLES = {
      'landing-page':           'Company Profile — Gallery',
      'human-resource-system':  'Human Resource System — Gallery',
      'guest-book':             'Guest Book System — Gallery',
      'e-commerce':             'Simple E-Commerce — Gallery',
      'loyalty-card':           'Loyalty Card System — Gallery',
      'requisition-letter':     'Requisition Letter System — Gallery',
      'vacancy-web':            'Vacancy Web — Gallery',
      'wedding-invitation':     'Wedding Invitation Maker — Gallery',
    };

    const modal     = document.getElementById('projectModal');
    const backdrop  = document.getElementById('modalBackdrop');
    const track     = document.getElementById('modalTrack');
    const dotsEl    = document.getElementById('modalDots');
    const counter   = document.getElementById('modalCounter');
    const titleEl   = document.getElementById('modalTitle');
    const btnPrev   = document.getElementById('modalPrev');
    const btnNext   = document.getElementById('modalNext');
    const btnClose  = document.getElementById('modalClose');
    if (!modal || !track) return;

    let total   = 0;
    let current = 0;

    function build(key) {
      const srcs = IMAGES[key] || [];
      track.innerHTML = '';
      dotsEl.innerHTML = '';
      total   = srcs.length;
      current = 0;

      srcs.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'modal-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${key} screenshot ${i + 1}`;
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'modal-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Image ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });

      goTo(0, false);
    }

    function goTo(idx, animate) {
      if (animate === false) track.style.transition = 'none';
      else                   track.style.transition = '';

      current = Math.max(0, Math.min(idx, total - 1));
      track.style.transform = `translateX(-${current * 100}%)`;

      if (animate === false) {
        track.offsetHeight; // force reflow
        track.style.transition = '';
      }

      dotsEl.querySelectorAll('.modal-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });

      if (counter) counter.textContent = `${current + 1} / ${total}`;
      if (btnPrev) btnPrev.disabled = current === 0;
      if (btnNext) btnNext.disabled = current === total - 1;
    }

    function openModal(key) {
      build(key);
      if (titleEl) titleEl.textContent = TITLES[key] || 'Project Gallery';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Triggers: card and link
    document.querySelectorAll('[data-modal-trigger]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(el.getAttribute('data-modal-trigger'));
      });
    });

    if (btnClose)  btnClose.addEventListener('click', closeModal);
    if (backdrop)  backdrop.addEventListener('click', closeModal);
    if (btnPrev)   btnPrev.addEventListener('click', () => goTo(current - 1));
    if (btnNext)   btnNext.addEventListener('click', () => goTo(current + 1));

    // Keyboard
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape')     closeModal();
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 48) goTo(current + (dx < 0 ? 1 : -1));
    });
  }

  // ── Footer entrance ───────────────────────────────────────
  function initFooter() {
    const footer = $('.footer');
    if (!footer) return;

    const fObs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      anime({
        targets: '.footer-inner > *',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo',
      });
      fObs.disconnect();
    }, { threshold: 0.3 });

    Array.from(footer.querySelectorAll('.footer-inner > *')).forEach(el => {
      el.style.opacity = '0';
    });
    fObs.observe(footer);
  }

  // ── Prepare initial states ────────────────────────────────
  // Only hide hero elements (above-fold). Cards/contact are off-screen
  // at load time so no need to hide them — avoids invisible flash if JS is slow.
  function prepareInitialStates() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return false;

    ['#heroBadge', '#heroSubtitle', '#heroDescription', '#heroCta'].forEach(sel => {
      const el = $(sel);
      if (el) el.style.opacity = '0';
    });

    return true;
  }

  // ── Boot ─────────────────────────────────────────────────
  function boot() {
    const willAnimate = prepareInitialStates();

    animateOrbs();
    initCarousel();
    initTechHover();
    initProjectHover();
    initProjectModal();
    initTimelineScroll();
    initFooter();

    if (willAnimate) {
      heroEntrance().then(() => {
        initScrollAnimations();
      });
    } else {
      // Reveal all immediately for reduced-motion users
      $$('[data-animate="card"], [data-animate="contact"], [data-animate="header"] > *')
        .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      initScrollAnimations();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
