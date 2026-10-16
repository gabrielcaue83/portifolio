(() => {
  /* ======== EDITE AQUI SEUS DADOS ======== */
  const CONFIG = {
    whatsapp: '5512996492304',            // DDI + DDD + número, só dígitos
    whatsappTexto: '(12) 99649-2304',
    instagram: 'caue_gabriiel',
    email: 'gabrielcaue83@gmail.com',
    msgPadrao: 'Oi, Cauê! Vi seu portfólio e quero conversar sobre um projeto.'
  };
  /* ======================================= */

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const root = document.documentElement;
  const W = () => innerWidth, H = () => innerHeight;
  const MOBILE = () => innerWidth < 760;

  /* ---------- contatos ---------- */
  const waLink = t => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(t || CONFIG.msgPadrao);
  $$('[data-wa]').forEach(a => { a.href = waLink(); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-wa-text]').forEach(e => { e.textContent = CONFIG.whatsappTexto; });
  $$('[data-ig]').forEach(a => { a.href = 'https://instagram.com/' + CONFIG.instagram; a.target = '_blank'; a.rel = 'noopener'; if (a.dataset.ig === 'text') a.textContent = '@' + CONFIG.instagram; });
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + CONFIG.email; if (a.dataset.mail === 'text') a.textContent = CONFIG.email; });

  /* ---------- links internos (sabem onde cada mundo começa, mesmo com telas presas) ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'), el = id.length > 1 && document.querySelector(id);
    if (!el) return;
    e.preventDefault(); root.classList.remove('menu');
    const box = el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
    let y = id === '#inicio' ? 0 : box.getBoundingClientRect().top + scrollY;
    if (a.dataset.off) y += parseFloat(a.dataset.off) * innerHeight;
    if (id === '#gsap' && root.classList.contains('gs')) y -= 2;
    scrollTo({ top: Math.max(0, y), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  $('.burger').addEventListener('click', () => root.classList.toggle('menu'));

  /* ---------- formulário ---------- */
  const form = $('#form'), err = $('.err', form);
  $$('.pick', form).forEach(c => c.addEventListener('click', () => c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true')));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const via = (e.submitter && e.submitter.value) || 'wa';
    const nome = $('#f-nome').value.trim(), msg = $('#f-msg').value.trim();
    const quer = $$('.pick[aria-pressed=true]', form).map(c => c.textContent);
    if (!nome) { err.textContent = 'Faltou seu nome! Escreve ali em cima pra eu saber quem é.'; $('#f-nome').focus(); return; }
    err.textContent = '';
    const texto = 'Oi, Cauê! Sou ' + nome + '.\nPreciso de: ' + (quer.length ? quer.join(', ') : 'ainda estou decidindo') + '.' + (msg ? '\nSobre o projeto: ' + msg : '');
    if (via === 'mail') location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Projeto — ' + nome) + '&body=' + encodeURIComponent(texto);
    else window.open(waLink(texto), '_blank', 'noopener');
  });

  /* ---------- personagem: o Cauê em versão desenho (assets/js/caue.js) ---------- */
  const EYE = window.Caue ? window.Caue.EYE : { x: 0.5, y: 0.17 };
  const mascots = {};
  if (window.Caue) $$('[data-mascot]').forEach(slot => { mascots[slot.dataset.mascot] = window.Caue.mount(slot, { onPop: (el, txt) => boing(el, txt) }); });

  /* ---------- sem GSAP: página funciona parada ---------- */
  if (!(window.gsap && window.gsap.to)) { root.classList.remove('gs', 'preload'); return; }

  setTimeout(() => { if (!root.classList.contains('t-ready')) { root.classList.add('t-fail'); const l = $('.t-load'); if (l) l.textContent = 'O 3D não carregou. Tenta recarregar a página.'; } }, 9000);
  const has = n => typeof window[n] !== 'undefined' && !(window[n] instanceof Element);
  ['ScrollTrigger', 'SplitText', 'ScrambleTextPlugin', 'Flip', 'MotionPathPlugin', 'MorphSVGPlugin', 'DrawSVGPlugin', 'Draggable', 'InertiaPlugin']
    .forEach(n => { if (has(n)) gsap.registerPlugin(window[n]); });
  if (!has('ScrollTrigger')) root.classList.remove('gs');
  const GS = root.classList.contains('gs');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const R = gsap.utils.random, clamp = gsap.utils.clamp;
  const setWorld = w => { if (root.dataset.world !== w) root.dataset.world = w; };

  // roda a função só quando o elemento está na tela (economiza bateria)
  const visible = new WeakMap();
  const io = new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)), { threshold: 0.2 });
  const watch = el => { io.observe(el); return () => visible.get(el); };

  /* ---------- line boil: o contorno treme 12x por segundo ---------- */
  if (!reduce) {
    const turb = $('#boil feTurbulence'); let sd = 1;
    setInterval(() => { sd = (sd % 6) + 1; turb.setAttribute('seed', sd); }, 1000 / 12);
  }

  /* ---------- mascote ganha vida ---------- */
  function boing(slot, txt) {
    if (!window.gsap) return;
    const b = document.createElement('span'); b.className = 'boing';
    b.textContent = txt || ['BOING!', 'POING!', 'UÉ!', 'IUHUL!'][R(0, 3, 1)];
    b.style.left = R(0, 50) + '%'; b.style.top = R(0, 30) + '%';
    slot.appendChild(b);
    gsap.fromTo(b, { scale: 0, rotation: -30 }, { scale: 1, rotation: R(-12, 12), duration: 0.4, ease: 'back.out(3)' });
    gsap.to(b, { scale: 0, opacity: 0, duration: 0.25, delay: 0.9, onComplete: () => b.remove() });
  }
  Object.entries(mascots).forEach(([k, m]) => {
    // clique pra pular (menos nos que já têm papel na cena)
    if (!['walk', 'iris', 'guide', 'hang'].includes(k)) m.slot.addEventListener('click', m.jump);
    // aceno de tempos em tempos
    if ((k === 'hero' || k === 'contato') && !reduce) (function loop() { gsap.delayedCall(R(3.5, 6.5), () => { m.wave(); loop(); }); })();
  });
  if (mascots.hang) mascots.hang.scene('hang', 0);
  const heroM = mascots.hero;

  /* ---------- mouse: olhos seguem, cursor elástico, estrelinhas no clique ---------- */
  let mx = innerWidth / 2, my = innerHeight / 3;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  if (fine && !reduce) {
    const cur = $('.cursor'), cx = gsap.quickTo(cur, 'x', { duration: 0.28, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.28, ease: 'power3' });
    let lx = 0, ly = 0;
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); cur.style.opacity = 1; }, { passive: true });
    gsap.ticker.add(() => {
      const x = gsap.getProperty(cur, 'x'), y = gsap.getProperty(cur, 'y'), vx = x - lx, vy = y - ly; lx = x; ly = y;
      const v = Math.min(Math.hypot(vx, vy) / 30, 0.7);
      gsap.set(cur, { rotation: Math.atan2(vy, vx) * 180 / Math.PI, scaleX: 1 + v, scaleY: 1 - v * 0.45 });
    });
  }
  if (!reduce) addEventListener('pointerdown', e => {
    if (e.target.closest('input, textarea, canvas, .mp-knob, .stg-grid, .tile')) return;
    const w = root.dataset.world;
    const cols = w === 'gsap' ? ['#0AE448', '#22E4FF', '#A585FF'] : w === 'motion' ? ['#FFD43B', '#FF4B3E', '#7B5CFF'] : ['#B6FF3B', '#FF2E93', '#FF8A00'];
    for (let i = 0; i < 6; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '-24 -24 48 48'); s.setAttribute('class', 'zap');
      s.innerHTML = '<path d="M0-22C3-3 3-3 22 0 3 3 3 3 0 22-3 3-3 3-22 0-3-3-3-3 0-22Z" fill="' + cols[i % 3] + '"/>';
      document.body.appendChild(s);
      const a = i / 6 * Math.PI * 2 + R(-0.3, 0.3), d = R(40, 80);
      gsap.set(s, { x: e.clientX, y: e.clientY, scale: 0 });
      gsap.timeline({ onComplete: () => s.remove() })
        .to(s, { x: e.clientX + Math.cos(a) * d, y: e.clientY + Math.sin(a) * d, scale: R(0.7, 1.2), rotation: R(-180, 180), duration: 0.45, ease: 'power3.out' })
        .to(s, { y: '+=50', scale: 0, duration: 0.4, ease: 'power2.in' });
    }
  });

  /* ---------- abertura: íris + entrada do hero ---------- */
  const split = has('SplitText') ? new SplitText('.h1 .line', { type: 'chars', charsClass: 'ch' }) : null;
  let bubbleStarted = false;
  const PHRASES = ['E aí! Eu sou o Cauê.', 'Esse aqui sou eu, versão desenho.', 'Aqui tem 3 mundos. Rola que eu te levo!', 'Passa o mouse no meu nome!', 'Clica em mim pra eu pular!'];
  function startBubble() {
    if (bubbleStarted || reduce) return; bubbleStarted = true;
    const el = $('.hero .bubble-txt'); let i = 0;
    (function next() {
      const txt = PHRASES[i % PHRASES.length], o = { n: 0 }; i++;
      heroM.talk(true);
      gsap.timeline({ onComplete: () => gsap.delayedCall(2.4, next) })
        .to(o, { n: txt.length, duration: txt.length * 0.045, ease: 'none', onUpdate: () => { el.textContent = txt.slice(0, Math.round(o.n)); } })
        .call(() => heroM.talk(false));
    })();
  }
  function intro() {
    if (reduce) { root.classList.remove('preload'); return; }
    const tl = gsap.timeline({ defaults: { ease: 'back.out(2)' } });
    tl.fromTo('#iris .logo-pop', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, .45)' })
      .to('#iris .logo-pop', { y: -30, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 3 })
      .to('#iris .logo-pop', { scale: 0, duration: 0.25, ease: 'back.in(2)' })
      .to('#iris', { '--r': '150vmax', duration: 1.1, ease: 'power3.in' }, '-=0.05')
      .add(() => root.classList.remove('preload'));
    if (split) tl.from(split.chars, { yPercent: -170, rotation: () => R(-50, 50), opacity: 0, duration: 1, ease: 'bounce.out', stagger: 0.045 }, '-=0.55');
    tl.from('.hero .tag', { scale: 0, rotation: -40, duration: 0.5 }, '-=0.9')
      .from('.hero .lead, .hero .worlds-mini, .hero .ctas > *', { y: 40, opacity: 0, stagger: 0.08, duration: 0.6 }, '-=0.6')
      .from('.burst', { scale: 0, duration: 1.1, ease: 'elastic.out(1, .5)' }, '-=1.3')
      .from(heroM.svg, { yPercent: 130, duration: 0.8, ease: 'back.out(1.4)' }, '-=1')
      .from('.hero .spark', { scale: 0, rotation: 180, stagger: 0.1, duration: 0.6 }, '-=0.6')
      .from('.hero .bubble', { scale: 0, transformOrigin: '10% 100%', duration: 0.5, ease: 'back.out(3)', onComplete: startBubble }, '-=0.3')
      .from('.scroll-hint', { y: 40, opacity: 0, duration: 0.5 }, '-=0.2');
  }
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 1800))]).then(intro);
  if (split && !reduce) split.chars.forEach(c => c.addEventListener('pointerenter', () => {
    gsap.fromTo(c, { y: 0, rotation: 0, scaleY: 1 }, { keyframes: { y: [0, -26, 0], rotation: [0, R(-16, 16), 0], scaleY: [1, 1.18, 0.86, 1] }, duration: 0.55, ease: 'power1.inOut', overwrite: true });
  }));
  $$('.hero .btn, .contact .btn').forEach(b => {
    b.addEventListener('pointerenter', () => [mascots.hero, mascots.contato].forEach(m => m && !m.talking && m.mood('grin')));
    b.addEventListener('pointerleave', () => [mascots.hero, mascots.contato].forEach(m => m && !m.talking && m.mood(m.base || 'smile')));
  });
  if (!reduce) {
    gsap.to('.hero .spark', { scale: 0.6, rotation: 90, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.25 });
    gsap.to('.contact .sign', { rotation: -4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  /* =========================================================
     TRANSIÇÃO 1 · o próprio código GSAP anima o hero pra fora
     ========================================================= */
  const CODE = [
    [['// entrar no mundo do GSAP', 'com']],
    [['gsap', 'fn'], ['.', 'pun'], ['to', 'fn'], ['(', 'pun'], ['".hero"', 'str'], [', {', 'pun']],
    [['  scale', 'key'], [': ', 'pun'], ['0.3', 'num'], [',', 'pun']],
    [['  rotation', 'key'], [': ', 'pun'], ['-6', 'num'], [',', 'pun']],
    [['  ease', 'key'], [': ', 'pun'], ['"expo.inOut"', 'str hot']],
    [['});', 'pun']]
  ];
  const codeEl = $('#code'), chars = [];
  CODE.forEach((line, li) => {
    line.forEach(([txt, cls]) => {
      const tok = document.createElement('span'); tok.className = cls.split(' ').map(c => c === 'hot' ? 'hot' : 'tk-' + c).join(' ');
      [...txt].forEach(ch => { const s = document.createElement('span'); s.className = 'c'; s.textContent = ch; tok.appendChild(s); chars.push(s); });
      codeEl.appendChild(tok);
    });
    if (li < CODE.length - 1) { const nl = document.createElement('span'); nl.className = 'c'; nl.textContent = '\n'; codeEl.appendChild(nl); chars.push(nl); }
  });
  const caret = document.createElement('span'); caret.className = 'typecaret';
  let shownChars = -1;
  const typeObj = { n: 0 };
  const renderType = () => {
    const n = Math.round(typeObj.n);
    if (n === shownChars) return; shownChars = n;
    chars.forEach((c, i) => c.classList.toggle('v', i < n));
    if (n > 0 && n <= chars.length) chars[n - 1].after(caret); else codeEl.prepend(caret);
  };
  if (!GS) chars.forEach(c => c.classList.add('v'));

  if (GS) {
    const mob = MOBILE();
    const head = $('.tl-head');
    const it = gsap.timeline({ defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.t-intro', start: 'top top', end: 'bottom bottom', scrub: 0.8,
        onUpdate: s => { if (s.progress > 0.02) setWorld(s.progress > 0.4 ? 'gsap' : 'home'); } } });
    it.to('.scroll-hint', { opacity: 0, y: 30, duration: 0.4 }, 0.05)
      .fromTo('.code-win', { opacity: 0, y: () => -innerHeight * 0.75, rotation: -7 }, { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: 'bounce.out' }, 0.4)
      .to(typeObj, { n: chars.length, duration: 1.8, onUpdate: renderType }, 0.9)
      .to('.hero', { scale: mob ? 0.4 : 0.3, rotation: -6, xPercent: mob ? 0 : -27, yPercent: mob ? 12 : 9, borderRadius: 26,
        boxShadow: '0 0 0 2px #0AE448, 0 0 60px rgba(10,228,72,.45)', duration: 2, ease: 'expo.inOut' }, 2.8)
      .to('.g-bg', { opacity: 1, duration: 1.2 }, 3.0)
      .fromTo('.tl-ui', { opacity: 0, yPercent: 120 }, { opacity: 1, yPercent: 0, duration: 1.2, ease: 'power3.out' }, 3.4)
      .fromTo('.kf', { scale: 0 }, { scale: 1, stagger: 0.12, duration: 0.35, ease: 'back.out(3)' }, 4.0)
      .fromTo(head, { left: () => getComputedStyle($('.tl-ui')).paddingLeft }, { left: '97%', duration: 2.6 }, 4.4)
      .to('.hero', { xPercent: mob ? 90 : 140, scale: 0.06, rotation: 12, opacity: 0, duration: 1.6, ease: 'power3.in' }, 5.2)
      .to('.code-win', { y: () => -innerHeight * 0.7, rotationX: 45, opacity: 0, duration: 1.2, ease: 'power2.in' }, 5.8);
    // eu pendurado na janela: balanço, chute no hero e queda
    const hm = mascots.hang;
    if (hm) {
      const hs_ = hm.slot;
      it.fromTo(hm.st, { swing: -1 }, { swing: 1, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 1.2)
        .to(hs_, { rotation: 8, transformOrigin: '50% 2%', duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 1.2)
        .fromTo(hm.st, { kick: 0 }, { kick: 1, duration: 0.25, ease: 'back.out(3)' }, 4.95)
        .fromTo(hm.st, { kick: 1 }, { kick: 0, duration: 0.3, immediateRender: false }, 5.25)
        .to(hs_, { y: () => innerHeight * 1.1, rotation: 200, duration: 1.1, ease: 'power2.in' }, 5.7)
        .fromTo(hm.st, { flail: 0 }, { flail: 1, duration: 0.3 }, 5.7);
    }
    // o chute: quadro de impacto, tela tremendo e linhas de velocidade enquanto o hero voa
    it.fromTo('.impact', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 4.98)
      .fromTo('.impact span', { scale: 0, rotation: -24 }, { scale: 1, rotation: -6, duration: 0.14, ease: 'back.out(3)' }, 4.98)
      .fromTo('.impact', { opacity: 1 }, { opacity: 0, duration: 0.22, immediateRender: false }, 5.3)
      .fromTo('.t-intro .stage', { x: 0, y: 0 }, { keyframes: { x: [0, -16, 13, -9, 6, -2, 0], y: [0, 9, -7, 5, -3, 1, 0] }, duration: 0.34 }, 4.98)
      .fromTo('.speedlines', { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, 5.15)
      .fromTo('.speedlines', { opacity: 1 }, { opacity: 0, duration: 0.7, immediateRender: false }, 6.3);
    if (has('ScrambleTextPlugin')) it.fromTo('.g-title', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 6.6)
      .to('.g-title', { scrambleText: { text: 'GSAP', chars: '01<>/{}=;#', revealDelay: 0.4 }, duration: 1.6 }, 6.6);
    else it.fromTo('.g-title', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 6.6);
    it.fromTo('.g-title', { textShadow: '-16px 0 0 rgba(255,46,147,.9), 16px 0 0 rgba(34,228,255,.9), 0 0 30px rgba(10,228,72,.55), 0 0 90px rgba(10,228,72,.25)', skewX: -14 },
      { textShadow: '0px 0 0 rgba(255,46,147,0), 0px 0 0 rgba(34,228,255,0), 0 0 30px rgba(10,228,72,.55), 0 0 90px rgba(10,228,72,.25)', skewX: 0, duration: 1.3, ease: 'steps(9)' }, 6.6);
    it.fromTo('.g-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 7.6)
      .to('.tl-ui', { yPercent: 130, opacity: 0, duration: 1 }, 8.2)
      .to('.g-title-wrap', { yPercent: -8, duration: 1.8 }, 8.2);
  }

  /* =========================================================
     MUNDO 1 · GSAP (galeria horizontal)
     ========================================================= */
  const hs = $('#gsap'), track = $('.hs-track', hs), pns = $$('.pn', hs), bars = $$('.hs-bar i', hs);
  const pnShown = pns.map((_, i) => i === 0);
  let splitIn = () => {};
  function revealPanel(i) {
    if (pnShown[i]) return; pnShown[i] = true;
    const p = pns[i];
    gsap.to($$('.pn-txt > *', p), { y: 0, opacity: 1, stagger: 0.07, duration: 0.8, ease: 'power3.out' });
    gsap.to($('.pn-demo', p), { rotationY: 0, x: 0, opacity: 1, duration: 1, ease: 'expo.out' });
    if (i === 3) splitIn();
  }
  let HS = null;
  if (GS) {
    pns.slice(1).forEach(p => { gsap.set($$('.pn-txt > *', p), { y: 50, opacity: 0 }); gsap.set($('.pn-demo', p), { rotationY: -18, x: 80, opacity: 0, transformPerspective: 1200 }); });
    const dist = () => track.scrollWidth - innerWidth;
    const exitR = Math.max(0.22, innerHeight / Math.max(1, dist()));
    const htl = gsap.timeline({ scrollTrigger: { trigger: hs, pin: true, start: 'top top', end: () => '+=' + dist() * (1 + exitR), scrub: 0.5, invalidateOnRefresh: true,
      onUpdate: s => {
        const xf = Math.min(1, s.progress * (1 + exitR)), pos = xf * (pns.length - 1);
        bars.forEach((b, i) => gsap.set(b, { scaleX: clamp(0, 1, pos + 1 - i) }));
        pns.forEach((_, i) => { if (pos > i - 0.45) revealPanel(i); });
        const ex = (s.progress * (1 + exitR) - 1) / exitR;
        setWorld(ex > 0.35 ? 'three' : 'gsap');
      } } });
    // saída: a galeria tomba primeiro, depois anéis de dobra abrem o portal e um clarão corta pro túnel 3D
    // (fromTo com início explícito: com invalidateOnRefresh, .to() regravaria o início no meio da animação)
    const once = { immediateRender: false }, X = n => 1 + exitR * n;
    htl.to(track, { x: () => -dist(), ease: 'none', duration: 1 })
      .fromTo(track, { rotationX: 0, yPercent: 0, scale: 1, opacity: 1 }, { rotationX: 70, yPercent: 16, scale: 0.6, opacity: 0, transformOrigin: () => (track.scrollWidth - innerWidth / 2) + 'px 100%', ease: 'power2.in', duration: exitR * 0.42, ...once }, X(0))
      .fromTo('.hs-bar', { opacity: 1 }, { opacity: 0, duration: exitR * 0.15, ...once }, X(0))
      .fromTo('.hs-bg', { opacity: 1 }, { opacity: 0, duration: exitR * 0.45, ease: 'power1.in', ...once }, X(0.2))
      .fromTo('.warp i', { scale: 0, opacity: 0 }, { keyframes: { scale: [0, 2.2, 7], opacity: [0, 1, 0] }, duration: exitR * 0.5, stagger: exitR * 0.08, ease: 'power2.in', ...once }, X(0.34))
      .fromTo('.hs-portal', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: exitR * 0.2, ease: 'back.out(2)', ...once }, X(0.46))
      .fromTo('.hs-portal', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.8, duration: exitR * 0.16, ease: 'power2.in', ...once }, X(0.8))
      .fromTo('.warp b', { opacity: 0 }, { keyframes: { opacity: [0, 0.95, 0] }, duration: exitR * 0.12, ...once }, X(0.88));
    if (htl.scrollTrigger) HS = { st: htl.scrollTrigger, exitR };
  }

  // 1 · easing
  (() => {
    const p = pns[0], curve = $('.curve', p), dot = $('.dot', p), box = $('.ease-box', p), trk = $('.ease-track', p), nm = $('.ease-name', p), btns = $$('.gbtn', p);
    let cur = null, lastUser = 0, idx = 0;
    const X = t => 20 + t * 180, Y = v => 170 - v * 130;
    function play(name) {
      const f = gsap.parseEase(name); let d = '';
      for (let i = 0; i <= 90; i++) { const t = i / 90; d += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(f(t)).toFixed(1); }
      curve.setAttribute('d', d);
      if (has('DrawSVGPlugin')) gsap.fromTo(curve, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.out' });
      nm.textContent = name; btns.forEach(b => b.classList.toggle('on', b.dataset.ease === name));
      $('.pn-code', p).textContent = 'gsap.to(box, { x: 400, ease: "' + name + '" })';
      if (cur) cur.kill();
      const o = { t: 0 }, w = () => trk.clientWidth - box.offsetWidth;
      gsap.set(box, { x: 0 }); dot.setAttribute('cx', X(0)); dot.setAttribute('cy', Y(0));
      cur = gsap.to(o, { t: 1, duration: 1.4, ease: 'none', delay: 0.3, onUpdate: () => {
        const v = f(o.t); gsap.set(box, { x: v * w() }); dot.setAttribute('cx', X(o.t)); dot.setAttribute('cy', Y(v));
      } });
    }
    btns.forEach((b, i) => b.addEventListener('click', () => { lastUser = Date.now(); idx = i; play(b.dataset.ease); }));
    const vis = watch(p.querySelector('.pn-demo'));
    play(btns[0].dataset.ease);
    if (!reduce) setInterval(() => { if (vis() && Date.now() - lastUser > 7000) { idx = (idx + 1) % btns.length; play(btns[idx].dataset.ease); } }, 2700);
  })();

  // 2 · stagger em grade
  (() => {
    const p = pns[1], grid = $('.stg-grid', p), lab = $('.stg-label', p);
    const cols = MOBILE() ? 9 : 15, rows = MOBILE() ? 8 : 9;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', auto)';
    for (let i = 0; i < cols * rows; i++) grid.appendChild(document.createElement('i'));
    const dots = $$('i', grid); let lastUser = 0;
    function ripple(i) {
      lab.textContent = 'stagger: { grid: [' + rows + ', ' + cols + '], from: ' + i + ' }';
      gsap.to(dots, { keyframes: { scale: [1, 0.15, 1.35, 1], y: [0, 10, -12, 0], backgroundColor: ['#1b2a33', '#0AE448', '#22E4FF', '#1b2a33'] },
        duration: 1.3, ease: 'power1.inOut', stagger: { each: 0.045, grid: [rows, cols], from: i }, overwrite: true });
    }
    grid.addEventListener('click', e => { const i = dots.indexOf(e.target); if (i > -1) { lastUser = Date.now(); ripple(i); } });
    const vis = watch(grid);
    if (!reduce) setInterval(() => { if (vis() && Date.now() - lastUser > 6000) ripple(R(0, dots.length - 1, 1)); }, 2600);
  })();

  // 3 · Flip
  (() => {
    const p = pns[2], box = $('.flip-box', p), tiles = () => $$('.tile', box), btns = $$('.flip-btns .gbtn', p);
    let lastUser = 0;
    const flip = (change, vars) => {
      if (!has('Flip')) { change(); return; }
      const st = Flip.getState(tiles());
      change();
      Flip.from(st, Object.assign({ duration: 0.75, ease: 'power3.inOut', stagger: 0.025, absolute: true }, vars));
    };
    const setLayout = l => flip(() => { box.dataset.layout = l; btns.forEach(b => b.classList.toggle('on', b.dataset.layout === l)); });
    const shuffle = () => flip(() => gsap.utils.shuffle(tiles()).forEach(t => box.appendChild(t)), { ease: 'back.inOut(1.3)', duration: 0.9 });
    btns.forEach(b => b.addEventListener('click', () => { lastUser = Date.now(); b.dataset.layout ? setLayout(b.dataset.layout) : shuffle(); }));
    box.addEventListener('click', e => {
      const t = e.target.closest('.tile'); if (!t) return; lastUser = Date.now();
      flip(() => { const big = t.classList.contains('big'); tiles().forEach(x => x.classList.remove('big')); if (!big) t.classList.add('big'); }, { ease: 'expo.inOut', duration: 0.7 });
    });
    const vis = watch(box), seq = [() => shuffle(), () => setLayout('list'), () => setLayout('stack'), () => setLayout('grid'), () => { const t = tiles()[R(0, 7, 1)]; t.click(); lastUser = 0; }];
    let k = 0;
    if (!reduce) setInterval(() => { if (vis() && Date.now() - lastUser > 7000) seq[k++ % seq.length](); }, 2800);
  })();

  // 4 · SplitText + ScrambleText
  (() => {
    const p = pns[3], big = $('.split-big', p), line = $('.scr-line', p);
    let sChars = [];
    if (has('SplitText')) {
      const s = new SplitText(big, { type: 'words,chars', charsClass: 'ch' }); sChars = s.chars;
      if (GS) gsap.set(sChars, { yPercent: 110, rotationX: -90, opacity: 0, transformPerspective: 600 });
      splitIn = () => gsap.to(sChars, { yPercent: 0, rotationX: 0, opacity: 1, stagger: 0.035, duration: 0.8, ease: 'back.out(2)' });
      if (!reduce) sChars.forEach(c => c.addEventListener('pointerenter', () => gsap.fromTo(c, { y: 0 }, { keyframes: { y: [0, -30, 0], rotation: [0, R(-25, 25), 0], color: ['#D9F7E8', '#0AE448', '#D9F7E8'] }, duration: 0.6, overwrite: true })));
    }
    const wave = () => gsap.to(sChars, { keyframes: { y: [0, -34, 0], scaleY: [1, 1.25, 1] }, duration: 0.7, stagger: { each: 0.04, from: 'start' }, ease: 'sine.inOut' });
    const PH = ['Cada letra é um objeto', 'Texto também é animação', 'Feito com ScrambleText', 'gsap.to(texto, { scrambleText })'];
    let k = 0, lastUser = 0;
    const scramble = () => {
      const t = PH[k++ % PH.length];
      if (has('ScrambleTextPlugin')) gsap.to(line, { scrambleText: { text: t, chars: '01<>/{}*#', speed: 0.5 }, duration: 1.3 });
      else line.textContent = t;
    };
    $('.scr-btn', p).addEventListener('click', () => { lastUser = Date.now(); scramble(); });
    $('.wave-btn', p).addEventListener('click', () => { lastUser = Date.now(); wave(); });
    const vis = watch(big);
    if (!reduce) setInterval(() => { if (vis() && Date.now() - lastUser > 6000) { scramble(); if (k % 2) wave(); } }, 3400);
  })();

  // 5 · motionPath + botão giratório
  (() => {
    const p = pns[4], svg = $('.mp-svg', p), path = $('.mp-path', p), comet = $('.comet', p), trail = $('.comet-trail', p), knob = $('.mp-knob', p), sp = $('.mp-speed', p);
    const tweens = [];
    if (!has('MotionPathPlugin')) return;
    for (let i = 0; i < 7; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', 7 - i * 0.8); c.setAttribute('fill', i % 2 ? '#22E4FF' : '#0AE448'); c.setAttribute('opacity', 0.75 - i * 0.09);
      trail.appendChild(c);
      const t = gsap.to(c, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 4, ease: 'none', repeat: -1 });
      t.progress(1 - (i + 1) * 0.018); tweens.push(t);
    }
    tweens.push(gsap.to(comet, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 4, ease: 'none', repeat: -1 }));
    const setSpeed = v => { tweens.forEach(t => t.timeScale(v)); sp.textContent = v.toFixed(1) + '×'; knob.setAttribute('aria-valuenow', v.toFixed(1)); };
    const fromRot = r => clamp(0.2, 3, 1 + r / 180);
    if (has('Draggable')) {
      Draggable.create(knob, { type: 'rotation', inertia: has('InertiaPlugin'),
        onDrag() { setSpeed(fromRot(this.rotation)); }, onThrowUpdate() { setSpeed(fromRot(this.rotation)); } });
    }
    knob.addEventListener('keydown', e => {
      const r = gsap.getProperty(knob, 'rotation') + (e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 30 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -30 : 0);
      gsap.set(knob, { rotation: r }); setSpeed(fromRot(r));
    });
    if (reduce) tweens.forEach(t => t.pause());
  })();

  /* =========================================================
     TRANSIÇÃO 3 · o lápis rabisca por cima do 3D
     ========================================================= */
  if (GS) {
    const s1 = $('.scrib .s1'), s2 = $('.scrib .s2'), pencil = $('.pencil'), letters = $$('.m-title span'), mst = $('.m-stage');
    const clapper = $('.clapper'), arm = $('.clap-arm', clapper), pow = $('.clap-pow');
    const once = { immediateRender: false };
    const mtl = gsap.timeline({ defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.m-intro', start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: s => setWorld(s.progress > 0.5 ? 'motion' : 'three') } });
    // 1 · claquete: "corta!" antes do lápis entrar
    gsap.set(clapper, { xPercent: -50, yPercent: -50 });
    gsap.set(pow, { xPercent: -50 });
    gsap.set(arm, { rotation: -32, svgOrigin: '14 60' });
    mtl.fromTo(clapper, { scale: 0, rotation: -14, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.05, ease: 'back.out(2.5)' }, 0)
      .fromTo(arm, { rotation: -32 }, { rotation: 0, duration: 0.025, ease: 'power4.in', ...once }, 0.07)
      .fromTo(pow, { scale: 0, rotation: -20, opacity: 0 }, { scale: 1, rotation: 8, opacity: 1, duration: 0.03, ease: 'back.out(3)', ...once }, 0.095)
      .fromTo(clapper, { x: 0 }, { keyframes: { x: [0, -10, 8, -5, 0] }, duration: 0.03, ...once }, 0.095)
      .fromTo([clapper, pow], { scale: 1, opacity: 1 }, { scale: 0.2, opacity: 0, y: -80, duration: 0.04, ease: 'back.in(2)', ...once }, 0.14);
    // 2 · o lápis rabisca a tela
    if (has('DrawSVGPlugin')) {
      gsap.set([s1, s2], { drawSVG: '0%' });
      mtl.fromTo(s1, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.32, ease: 'power1.inOut', ...once }, 0.15)
        .fromTo(s2, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.32, ease: 'power1.inOut', ...once }, 0.28);
    } else {
      gsap.set([s1, s2], { opacity: 0 });
      mtl.to(s1, { opacity: 1, duration: 0.3 }, 0.15).to(s2, { opacity: 1, duration: 0.3 }, 0.28);
    }
    if (has('MotionPathPlugin')) {
      mtl.set(pencil, { opacity: 1 }, 0.28)
        .to(pencil, { motionPath: { path: s2, align: s2, alignOrigin: [0.5, 0.92] }, rotation: 30, duration: 0.32, ease: 'power1.inOut' }, 0.28);
    }
    // 3 · eu escrevo MOTION: cada letra aparece onde a ponta do lápis passa
    const write = { p: 0 }, WRITE_SCALE = 0.68;
    const drawLetters = () => {
      const n = letters.length, f = write.p * n;
      letters.forEach((l, i) => {
        const k = clamp(0, 1, f - i);
        gsap.set(l, { opacity: k > 0 ? 1 : 0, clipPath: 'inset(-30% ' + ((1 - k) * 125 - 25).toFixed(1) + '% -30% -25%)', scale: k > 0 && k < 1 ? 1.08 : 1 });
      });
      if (write.p <= 0 || write.p >= 1 || !has('MotionPathPlugin')) return;
      const i = Math.min(n - 1, Math.floor(f)), k = f - i, r = letters[i].getBoundingClientRect(), sr = mst.getBoundingClientRect();
      const tx = r.left - sr.left + r.width * (0.08 + k * 0.86), ty = r.top - sr.top + r.height * (0.6 - Math.sin(k * Math.PI * 3) * 0.2);
      // o lápis é um <svg> (sem offsetWidth): tamanho vem da largura CSS e da proporção 60x200 do desenho.
      // Encolhe em volta da ponta pra eu (montado nele) continuar dentro da tela enquanto escrevo
      const pw = parseFloat(getComputedStyle(pencil).width), ph = pw * 200 / 60;
      gsap.set(pencil, { x: tx - pw * 0.5, y: ty - ph * 0.92, scale: WRITE_SCALE, rotation: 16 + Math.sin(k * Math.PI * 6) * 7 });
    };
    gsap.set(letters, { opacity: 0 });
    mtl.fromTo(write, { p: 0 }, { p: 1, duration: 0.3, onUpdate: drawLetters, ...once }, 0.62);
    if (has('MotionPathPlugin')) mtl.fromTo(pencil, { opacity: 1, scale: WRITE_SCALE }, { opacity: 0, scale: 0.3, duration: 0.03, ...once }, 0.93);
    mtl.fromTo('.m-sub', { scale: 0, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -2, duration: 0.06, ease: 'back.out(3)' }, 0.95);
  }

  /* =========================================================
     MUNDO 3 · MOTION (demos vetoriais)
     ========================================================= */
  // ciclo de caminhada
  (() => {
    const m = mascots.walk; if (!m) return;
    const st = $('.walk-scr'), ground = $('.ground-lines', st);
    const btns = $$('.walk-btns .mbtn');
    const apply = speed => {
      m.setSpeed(speed);
      ground.style.animationPlayState = speed ? 'running' : 'paused';
      if (speed) ground.style.animationDuration = (0.6 / speed) + 's';
    };
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.classList.toggle('on', x === b)); apply(+b.dataset.speed); }));
    m.slot.addEventListener('click', () => m.jump());
    apply(1);
  })();

  // expressões
  (() => {
    const m = mascots.face; if (!m) return;
    const btns = $$('.face-btns .mbtn');
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.classList.toggle('on', x === b)); m.feel(b.dataset.mood); }));
  })();

  // logo animado
  (() => {
    const scr = $('.logo-scr'); if (!scr) return;
    const bg = $('.lg-bg', scr), c = $('.lg-c', scr), g = $('.lg-g', scr), star = $('.lg-star', scr), word = $('.lg-word', scr);
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(bg, { scale: 0 }, { scale: 1, transformOrigin: '50% 50%', duration: 0.7, ease: 'elastic.out(1, .45)' });
    if (has('DrawSVGPlugin')) tl.fromTo(c, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power3.inOut' }, 0.25).fromTo(g, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.55, ease: 'power3.inOut' }, 0.45);
    else tl.fromTo([c, g], { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.2 }, 0.25);
    tl.to(g, { scaleX: 1.25, scaleY: 0.8, transformOrigin: '50% 100%', duration: 0.1, ease: 'power2.out' }, 1.0)
      .to(g, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, .3)' })
      .to(c, { rotation: -12, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, 1.0)
      .fromTo(star, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(3)' }, 1.1)
      .fromTo(word, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 1.3)
      .to(star, { rotation: 360, duration: 1.2, ease: 'power2.inOut' }, 1.9);
    const go = () => tl.restart();
    scr.addEventListener('click', go);
    scr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    if (has('ScrollTrigger')) ScrollTrigger.create({ trigger: scr, start: 'top 80%', once: true, onEnter: go }); else go();
  })();

  // morph de formas
  (() => {
    const scr = $('.morph-scr'); if (!scr) return;
    const p = $('.morph', scr), ps = $('.morph-shadow', scr), sig = $('.sign-draw', scr);
    const SH = [
      { d: 'M100 18 L122 74 L182 76 L134 112 L152 170 L100 136 L48 170 L66 112 L18 76 L78 74 Z', c: '#FF4B3E', bg: '#FFD43B' },
      { d: 'M100 22 C140 18 178 50 176 96 C174 140 146 178 100 176 C56 174 24 146 26 100 C28 56 58 26 100 22 Z', c: '#7B5CFF', bg: '#6EC8FF' },
      { d: 'M100 172 C60 140 20 112 20 72 C20 44 42 26 66 26 C82 26 94 34 100 46 C106 34 118 26 134 26 C158 26 180 44 180 72 C180 112 140 140 100 172 Z', c: '#FF4B3E', bg: '#FFF6E0' },
      { d: 'M116 16 L46 110 L94 110 L80 184 L154 84 L106 84 Z', c: '#FFD43B', bg: '#7B5CFF' }
    ];
    let i = 0;
    const go = () => {
      i = (i + 1) % SH.length; const s = SH[i];
      if (has('MorphSVGPlugin')) gsap.to([p, ps], { morphSVG: s.d, duration: 0.8, ease: 'elastic.out(1, .5)', overwrite: true });
      else { p.setAttribute('d', s.d); ps.setAttribute('d', s.d); }
      gsap.to(p, { fill: s.c, duration: 0.4 }); gsap.to(scr, { backgroundColor: s.bg, duration: 0.4 });
      gsap.fromTo(p.parentNode, { rotation: -8 }, { rotation: 0, svgOrigin: '160 134', duration: 0.8, ease: 'elastic.out(1, .4)' });
    };
    const auto = gsap.timeline({ repeat: -1, paused: true }).call(go, null, 1.6).to({}, { duration: 1.6 });
    scr.addEventListener('click', () => { go(); auto.restart(); });
    scr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    const vis = watch(scr);
    let dtl = null;
    if (has('DrawSVGPlugin') && !reduce) dtl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true }).fromTo(sig, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'power1.inOut' }).to(sig, { drawSVG: '100% 100%', duration: 0.8, ease: 'power1.in', delay: 0.6 });
    if (!reduce) gsap.ticker.add(() => { const v = vis(); if (v && auto.paused()) { auto.play(); dtl && dtl.play(); } else if (!v && !auto.paused()) { auto.pause(); dtl && dtl.pause(); } });
  })();

  // squash & stretch
  (() => {
    const svg = $('.ball-scr svg'); if (!svg) return;
    const ball = $('.ball', svg), sh = $('.b-shadow', svg), ticks = $('.ticks', svg);
    const top = 56, bottom = 212, n = 7; let html = '';
    for (let i = 0; i <= n; i++) {
      const y = top + (bottom - top) * (i / n) ** 2;
      html += '<line x1="46" x2="62" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#0E0E0E" stroke-width="3" stroke-linecap="round"/>';
      html += '<circle cx="190" cy="' + y.toFixed(1) + '" r="26" fill="none" stroke="#0E0E0E" stroke-width="1.5" stroke-dasharray="3 4" opacity=".22"/>';
    }
    ticks.innerHTML = html;
    gsap.set(ball, { x: 190, y: top, transformOrigin: '50% 100%' });
    const tl = gsap.timeline({ repeat: -1, paused: true })
      .to(ball, { y: bottom, duration: 0.46, ease: 'power2.in' })
      .to(ball, { scaleY: 1.2, scaleX: 0.85, duration: 0.46, ease: 'power2.in' }, 0)
      .to(sh, { scaleX: 1.25, opacity: 0.45, transformOrigin: '50% 50%', duration: 0.46, ease: 'power2.in' }, 0)
      .to(ball, { scaleY: 0.6, scaleX: 1.42, duration: 0.07, ease: 'power1.out' })
      .to(ball, { scaleY: 1.18, scaleX: 0.86, duration: 0.1, ease: 'power1.out' })
      .to(ball, { y: top, duration: 0.46, ease: 'power2.out' }, '<')
      .to(sh, { scaleX: 0.6, opacity: 0.18, duration: 0.46, ease: 'power2.out' }, '<')
      .to(ball, { scaleY: 1, scaleX: 1, duration: 0.3, ease: 'power2.out' }, '<0.1');
    const vis = watch(svg);
    if (!reduce) gsap.ticker.add(() => { const v = vis(); if (v && tl.paused()) tl.play(); else if (!v && !tl.paused()) tl.pause(); });
  })();

  // cards do mundo motion entram pulando
  if (has('ScrollTrigger') && !reduce) {
    gsap.set('.pop', { opacity: 0, scale: 0.7, rotation: () => R(-7, 7), y: 50 });
    ScrollTrigger.batch('.pop', { start: 'top 90%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.12, clearProps: 'transform' }) });
    gsap.from('.m-head > *', { y: 60, opacity: 0, rotation: () => R(-6, 6), stagger: 0.1, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.m-head', start: 'top 80%', once: true } });
    gsap.to('.cloud', { x: (i) => (i % 2 ? -60 : 60), ease: 'none', scrollTrigger: { trigger: '.motion', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* =========================================================
     TRANSIÇÃO 4 · íris fecha no meu rosto e abre em casa
     ========================================================= */
  if (GS) {
    const stage = $('.iris-stage'), hole = $('.iris-hole'), txt = $('.iris-txt'), im = mascots.iris;
    const center = () => {
      const s = stage.getBoundingClientRect(), r = im.svg.getBoundingClientRect();
      hole.style.setProperty('--x', (r.left - s.left + r.width * EYE.x) + 'px');
      hole.style.setProperty('--y', (r.top - s.top + r.height * EYE.y) + 'px');
    };
    let home = false;
    const itl = gsap.timeline({ scrollTrigger: { trigger: '.iris-st', start: 'top top', end: 'bottom bottom', scrub: 0.5, onRefresh: center,
      onUpdate: s => {
        const h = s.progress >= 0.5;
        setWorld(h ? 'home' : 'motion');
        if (h !== home) { home = h; stage.classList.toggle('home', h); txt.textContent = h ? '…o que já está no ar!' : 'Corta pra…'; im.mood(h ? 'grin' : 'wow'); }
      } } });
    // fecha em etapas como nos desenhos antigos: para no meu rosto, eu pisco e aceno, e só então fecha de vez
    const once = { immediateRender: false };
    const big = () => Math.hypot(innerWidth, innerHeight) + 'px', face = () => Math.min(innerWidth, innerHeight) * 0.22 + 'px';
    itl.fromTo(hole, { '--r': big }, { '--r': face, duration: 0.3, ease: 'power3.inOut' }, 0)
      .fromTo(hole, { '--r': face }, { '--r': '0px', duration: 0.05, ease: 'back.in(3)', ...once }, 0.45)
      .fromTo(hole, { '--r': '0px' }, { '--r': big, duration: 0.46, ease: 'power2.out', ...once }, 0.54)
      .fromTo(txt, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.08)
      .fromTo(txt, { opacity: 1 }, { opacity: 0, duration: 0.06, ...once }, 0.38)
      .fromTo(txt, { opacity: 0 }, { opacity: 1, duration: 0.08, ...once }, 0.58)
      .fromTo(txt, { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.1, ...once }, 0.88)
      .fromTo(im.svg, { scale: 0.9 }, { scale: 1.12, duration: 0.3, ease: 'power1.in' }, 0)
      .fromTo(im.svg, { scale: 1.12 }, { scale: 0.9, duration: 0.46, ease: 'power1.out', ...once }, 0.54);
    if (im) {
      // aceno e piscadinha controlados pela rolagem
      itl.fromTo(im.st, { wave: 0 }, { wave: 1, duration: 0.04, ease: 'back.out(2)', ...once }, 0.31)
        .fromTo(im.st, { wave: 1 }, { wave: 0, duration: 0.03, ...once }, 0.44)
        .fromTo(im.wink, { v: 0 }, { keyframes: { v: [0, 1, 1, 0] }, duration: 0.05, ...once }, 0.37);
    }
  }

  /* =========================================================
     CASA · Trampos e Contato
     ========================================================= */
  if (has('ScrollTrigger') && !reduce) {
    $$('.work .h2, .contact .h2').forEach(h => {
      const parts = has('SplitText') ? new SplitText(h, { type: 'words' }).words : [h];
      gsap.from(parts, { yPercent: 110, rotation: () => R(-10, 10), opacity: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.07, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });
  }
  if (fine && !reduce) $$('.proj').forEach(c => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.4, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: 0.4, ease: 'power3' });
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 14); rx(-((e.clientY - r.top) / r.height - 0.5) * 14); });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });


  /* =========================================================
     O GUIA: eu atravesso o site junto com quem visita
     puxo a galeria do GSAP, surfo no túnel do 3D, bato a claquete, escrevo
     MOTION montado no lápis, aponto os trampos e iço a seção de contato.
     Em cada mundo troco de roupa: viseira neon, óculos 3D e boina de pintor
     ========================================================= */
  if (GS && mascots.guide) {
    const gm = mascots.guide, gel = $('.guide'), ropeH = $('.rope-h', gel), ropeV = $('.rope-v', gel), board = $('.board', gel);
    const pencil = $('.pencil'), clapper = $('.clapper'), three = $('#threejs'), mIntro = $('.m-intro'), work = $('#trampos'), cont = $('#contato');
    const op = gsap.quickTo(gel, 'opacity', { duration: 0.25 });
    const lerp = (a, b, t) => a + (b - a) * t;
    const ASPECT = 700 / 300;
    let phase = '', fallCool = 0;
    const SCENE_OF = { pull: 'pull', dive: 'fly', surf: 'surf', clap: 'clap', ride: 'ride', point: 'point', hoist: 'haul', off: null };
    const OUTFIT_OF = { pull: 'gsap', dive: 'three', surf: 'three', clap: 'three', ride: 'motion' };
    function setPhase(ph) {
      if (ph === phase) return;
      phase = ph;
      gm.scene(SCENE_OF[ph], ph === 'dive' ? 0.3 : 0.45);
      gm.flip(ph === 'point');
      gsap.to(ropeH, { opacity: ph === 'pull' ? 1 : 0, scaleX: ph === 'pull' ? 1 : 0.2, duration: 0.25 });
      gsap.to(ropeV, { opacity: ph === 'hoist' ? 1 : 0, duration: 0.2 });
      gsap.to(board, { opacity: ph === 'surf' ? 1 : 0, scale: ph === 'surf' ? 1 : 0.3, duration: ph === 'surf' ? 0.4 : 0.2, ease: ph === 'surf' ? 'back.out(2.5)' : 'power1.in' });
      if (ph !== 'off') gm.outfit(OUTFIT_OF[ph] || 'none');
      gm.lookDir = ph === 'hoist' ? [0, -3] : null;
    }
    gsap.ticker.add((time, dms) => {
      const vw = innerWidth, vh = innerHeight, gw = gel.offsetWidth, gh = gw * ASPECT;
      // tudo calculado pelo CENTRO do personagem (escala e giro acontecem em volta do centro)
      let ph = 'off', cx = -gw * 2, cy = vh, s = 1, rot = 0;
      const tr = three.getBoundingClientRect(), tp = (vh - tr.top) / tr.height;
      const mr = mIntro.getBoundingClientRect(), mp = (-mr.top) / Math.max(1, mr.height - vh);
      const wr = work.getBoundingClientRect(), cr = cont.getBoundingClientRect();
      const pull = { x: vw * 0.03 + gw / 2, y: vh - gh / 2 - Math.max(vh * 0.05, 30) }, mid = { x: vw / 2, y: vh / 2 };
      fallCool = Math.max(0, fallCool - dms / 1000);
      if (HS && HS.st.isActive) {
        const tot = HS.st.progress * (1 + HS.exitR);
        if (tot <= 1) {
          ph = 'pull'; cx = pull.x; cy = pull.y;
          // o passo segue a rolagem: rolando pra baixo ele anda de ré puxando, pra cima anda pra frente
          const v = HS.st.getVelocity();
          gm.pullV = Math.abs(v) > 25 ? v / 700 : 0;
          // rolou rápido demais: escorrega e cai
          if (Math.abs(v) > 7000 && !fallCool && !reduce) { fallCool = 6; gm.scene(null, 0.1); gsap.delayedCall(0.12, () => gm.fall(() => { phase = ''; })); }
        } else {
          const e = clamp(0, 1, (tot - 1) / HS.exitR), k = e * e * (3 - 2 * e);
          ph = 'dive'; cx = lerp(pull.x, mid.x, k); cy = lerp(pull.y, mid.y, k) - Math.sin(k * Math.PI) * vh * 0.25;
          s = lerp(1, 0.5, k); rot = lerp(0, -380, k);
        }
      } else if (tp > 0 && tp < 0.12) {
        const k = tp / 0.12;
        // surfando pelos anéis: faz curvas pros lados e vai sumindo no fundo do túnel
        ph = 'surf'; cx = mid.x + Math.sin(k * 7) * vw * 0.13; cy = mid.y + vh * 0.08 - k * vh * 0.1 + Math.sin(k * 15) * 8; s = 0.55 * (1 - k) ** 1.3; rot = -Math.cos(k * 7) * 16;
      } else if (mp > 0 && mp < 0.15 && clapper && +getComputedStyle(clapper).opacity > 0.3) {
        const kr = clapper.getBoundingClientRect();
        ph = 'clap'; s = MOBILE() ? 0.62 : 0.85; cx = kr.left - gw * s * 0.3; cy = kr.top + kr.height * 0.5; rot = -4;
      } else if (mp > 0.2 && mp < 0.98 && pencil && +getComputedStyle(pencil).opacity > 0.5) {
        const pr = pencil.getBoundingClientRect();
        ph = 'ride'; s = 0.62; cx = pr.left + pr.width / 2; cy = pr.top + pr.height * 0.25 - 0.19 * gh * s; rot = gsap.getProperty(pencil, 'rotation') * 0.4;
      } else if (wr.top < vh * 0.5 && wr.bottom > vh * 0.55 && cr.top > vh * 0.98) {
        ph = 'point'; s = MOBILE() ? 0.8 : 1; cx = vw - gw * s * 0.5; cy = vh - 0.47 * gh * s; rot = 0;
      } else if (cr.top < vh * 0.98 && cr.top > vh * 0.2) {
        ph = 'hoist'; s = MOBILE() ? 0.75 : 0.95; cx = Math.min(vw * 0.66, vw - gw * 0.8); cy = cr.top - 0.46 * gh * s;
      }
      if (!gm.falling) setPhase(ph);
      op(ph === 'off' || s < 0.03 ? 0 : 1);
      if (ph !== 'off') gsap.set(gel, { x: cx - gw / 2, y: cy - gh / 2, scale: s, rotation: rot, transformOrigin: '50% 50%' });
      if (ph === 'pull') {
        const hx = cx - gw / 2 + gw * 0.84, hy = cy - gh / 2 + gh * 0.44, ex = vw + 20, ey = vh - Math.max(vh * 0.03, 22);
        gsap.set(ropeH, { width: Math.hypot(ex - hx, ey - hy), rotation: Math.atan2(ey - hy, ex - hx) * 180 / Math.PI });
      }
    });
  }

  /* ---------- mundo atual: navegação muda de roupa ---------- */
  if (has('ScrollTrigger')) {
    [['#gsap', 'gsap', 'gsap'], ['#threejs', 'three', 'three'], ['#motion', 'motion', 'motion'], ['#trampos', 'home', 'work'], ['#contato', 'home', 'contact']].forEach(([sel, w, link]) => {
      ScrollTrigger.create({ trigger: sel, start: 'top 50%', end: 'bottom 50%',
        onToggle: s => { if (s.isActive) { setWorld(w); $$('.links a').forEach(a => a.classList.toggle('on', a.dataset.w === link)); } } });
    });
    ScrollTrigger.create({ trigger: '#inicio', start: 'top top', end: 'bottom 50%', onToggle: s => { if (s.isActive) $$('.links a').forEach(a => a.classList.remove('on')); } });
    if (!GS) ScrollTrigger.create({ trigger: '#inicio', start: 'top top', end: 'bottom 50%', onToggle: s => s.isActive && setWorld('home') });
    gsap.to('.nav-prog i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    ScrollTrigger.config({ ignoreMobileResize: true });
    addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
