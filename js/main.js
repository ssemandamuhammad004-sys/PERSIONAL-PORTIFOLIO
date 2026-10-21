/* ==========================================================
   Shaheed — Futuristic Portfolio
   Vanilla JS: no dependencies.
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lowPower     = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 700;

  /* ---------- Loader (never blocks longer than ~1s) ---------- */
  const loader = $('#loader');
  let started = false;
  function start() {
    if (started) return;
    started = true;
    document.body.classList.add('loaded');
    if (loader) loader.classList.add('done');
    initTyped();
    initCounters();
  }
  window.addEventListener('load', () => setTimeout(start, reduceMotion ? 0 : 700));
  setTimeout(start, 1800); // hard fallback

  /* ---------- Year ---------- */
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Particle network background ---------- */
  (function particles() {
    const canvas = $('#bg');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], raf = null, running = true;
    const mouse = { x: -9999, y: -9999 };
    const colors = ['0,229,255', '139,92,246', '59,130,246'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const count = Math.round(Math.min(90, (window.innerWidth * window.innerHeight) / (lowPower ? 22000 : 14000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
        r: (Math.random() * 1.6 + .6) * dpr,
        c: colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const maxD = (lowPower ? 110 : 150) * dpr;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduceMotion) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          // gentle mouse repulsion
          const dx = n.x - mouse.x * dpr, dy = n.y - mouse.y * dpr;
          const d2 = dx * dx + dy * dy, rr = (120 * dpr) ** 2;
          if (d2 < rr) { const f = (1 - d2 / rr) * .6; n.x += dx * f * .05; n.y += dy * f * .05; }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${n.c},.85)`;
        ctx.shadowColor = `rgba(${n.c},.9)`; ctx.shadowBlur = 8 * dpr;
        ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
        ctx.shadowBlur = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, d = dx * dx + dy * dy;
          if (d < maxD * maxD) {
            const a = (1 - Math.sqrt(d) / maxD) * .35;
            ctx.strokeStyle = `rgba(${n.c},${a})`; ctx.lineWidth = dpr * .8;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
    }
    function loop() { draw(); if (running && !reduceMotion) raf = requestAnimationFrame(loop); }

    resize(); draw();
    if (!reduceMotion) loop();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); draw(); }, 150); });
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running && !reduceMotion) { cancelAnimationFrame(raf); loop(); } else cancelAnimationFrame(raf);
    });
  })();

  /* ---------- Rotating typewriter ---------- */
  function initTyped() {
    const el = $('#typed'); if (!el) return;
    const phrases = ['IT Skills Trainer', 'Aspiring Software Developer', 'AI Tools Trainer', 'Technology Enthusiast'];
    if (reduceMotion) {
      let i = 0; el.textContent = phrases[0];
      setInterval(() => { i = (i + 1) % phrases.length; el.textContent = phrases[i]; }, 3000);
      return;
    }
    let p = 0, c = 0, del = false;
    (function tick() {
      const full = phrases[p];
      c += del ? -1 : 1;
      el.textContent = full.slice(0, c);
      let delay = del ? 35 : 75;
      if (!del && c === full.length) { del = true; delay = 1700; }
      else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    $$('[data-count]').forEach(el => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const t0 = performance.now() + 1500, dur = 1600;
      (function step(now) {
        const k = Math.min(Math.max((now - t0) / dur, 0), 1), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * e) + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }

  /* ---------- Scroll reveal + skill bars ---------- */
  (function reveal() {
    const items = $$('.reveal');
    // stagger siblings
    $$('.skills,.services,.projects,.tags,.about__text,.contact__text').forEach(group => {
      $$('.reveal, .project', group).forEach((el, i) => el.style.setProperty('--rd', (i * 0.09) + 's'));
    });
    $$('.card .bar i').forEach((b, i) => b.style.setProperty('--i', i % 3));
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(i => io.observe(i));
  })();

  /* ---------- Navigation ---------- */
  (function nav() {
    const navEl = $('#nav'), menu = $('#menu'), burger = $('#burger'), ul = $('#menuUnderline');
    const links = $$('.menu__link'), progress = $('#scrollProgress');
    const sections = links.map(l => $(l.getAttribute('href'))).filter(Boolean);

    function moveUnderline(link) {
      if (!link || !ul || getComputedStyle(ul).display === 'none') return;
      const mr = menu.getBoundingClientRect(), lr = link.getBoundingClientRect();
      ul.style.width = (lr.width - 28) + 'px';
      ul.style.transform = `translateX(${lr.left - mr.left + 14}px)`;
    }
    function setActive(id) {
      let active = null;
      links.forEach(l => { const on = l.getAttribute('href') === '#' + id; l.classList.toggle('active', on); if (on) active = l; });
      moveUnderline(active);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
        navEl.classList.toggle('scrolled', y > 24);
        if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        // active section
        let cur = sections[0] ? sections[0].id : 'home';
        sections.forEach(s => { if (s.getBoundingClientRect().top <= window.innerHeight * .4) cur = s.id; });
        setActive(cur);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    links.forEach(l => {
      l.addEventListener('mouseenter', () => moveUnderline(l));
      l.addEventListener('focus', () => moveUnderline(l));
      l.addEventListener('mouseleave', () => moveUnderline($('.menu__link.active')));
    });

    function setMenu(open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    // smooth scroll with menu close
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id); if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    }));
  })();

  /* ---------- Cursor spotlight & card spotlight ---------- */
  if (finePointer && !reduceMotion) {
    const glow = $('#cursorGlow');
    let gx = 0, gy = 0, tx = 0, ty = 0, gr = false;
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY; glow.classList.add('on');
      if (!gr) { gr = true; requestAnimationFrame(follow); }
    }, { passive: true });
    function follow() {
      gx += (tx - gx) * .12; gy += (ty - gy) * .12;
      glow.style.transform = `translate(${gx}px,${gy}px)`;
      if (Math.abs(tx - gx) > .5 || Math.abs(ty - gy) > .5) requestAnimationFrame(follow); else gr = false;
    }
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));

    $$('.spot').forEach(card => card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));

    /* 3D tilt */
    $$('.tilt').forEach(el => {
      const max = +el.dataset.tilt || 8;
      let raf = null;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
        });
      });
      el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
    });

    /* Magnetic buttons */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * .22, y = (e.clientY - (r.top + r.height / 2)) * .3;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Button click ripple ---------- */
  $$('.btn').forEach(b => b.addEventListener('click', e => {
    if (reduceMotion) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = `width:${s}px;height:${s}px;left:${(e.clientX || r.left + r.width / 2) - r.left - s / 2}px;top:${(e.clientY || r.top + r.height / 2) - r.top - s / 2}px`;
    b.appendChild(sp); setTimeout(() => sp.remove(), 650);
  }));

  /* ---------- Project filters ---------- */
  (function filters() {
    const btns = $$('.filter'), cards = $$('.project');
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
      const f = btn.dataset.filter;
      let shown = 0;
      cards.forEach(c => {
        const match = f === 'all' || c.dataset.cat === f;
        if (match) {
          c.classList.remove('gone', 'hide');
          c.classList.remove('pop'); void c.offsetWidth;
          c.style.animationDelay = reduceMotion ? '0s' : (shown++ * 0.07) + 's';
          c.classList.add('pop');
          c.classList.add('in');
        } else {
          c.classList.remove('pop');
          c.classList.add('hide');
          setTimeout(() => { if (c.classList.contains('hide')) c.classList.add('gone'); }, reduceMotion ? 0 : 350);
        }
      });
    }));
  })();

  /* ---------- Photo lightbox ---------- */
  (function lightbox() {
    const lb = $('#lightbox'), img = $('#lbImg'), cap = $('#lbCap'), close = $('#lbClose');
    if (!lb) return;
    let last = null;
    function open(btn) { last = btn; img.src = btn.dataset.src; img.alt = btn.querySelector('img').alt; cap.textContent = btn.dataset.cap; lb.hidden = false; close.focus(); }
    function shut() { lb.hidden = true; img.removeAttribute('src'); if (last) last.focus(); }
    $$('.g-open').forEach(b => b.addEventListener('click', () => open(b)));
    close.addEventListener('click', shut);
    lb.addEventListener('click', e => { if (e.target === lb) shut(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) shut(); });
  })();

  /* ---------- Contact form (opens email client; no backend required) ---------- */
  (function form() {
    const f = $('#contactForm'), status = $('#formStatus');
    if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('input,textarea', f).forEach(i => {
        const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (!ok) { status.style.color = '#ff6b8b'; status.textContent = 'Please complete all fields with valid details.'; return; }
      const d = new FormData(f);
      const subject = encodeURIComponent('Portfolio enquiry from ' + d.get('name'));
      const body = encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')');
      status.style.color = ''; status.textContent = 'Opening your email app. If nothing opens, write to ssemandamuhammad004@gmail.com directly.';
      window.location.href = `mailto:ssemandamuhammad004@gmail.com?subject=${subject}&body=${body}`;
      f.reset();
    });
  })();
})();
