/* =========================================================
   O Cauê em versão desenho: personagem em SVG com articulações de verdade
   (IK de dois ossos), duas vistas (frente e três quartos), expressões de rosto
   inteiro, acessórios e as poses das cenas do guia.
   Uso: const m = Caue.mount(slot, { onPop }) -> m.setExpr('grin'), m.scene('pull')...
   ========================================================= */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const v2 = (x, y) => ({ x, y });
  const f1 = n => n.toFixed(1);
  const clamp = (a, b, x) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const lerpP = (a, b, k) => v2(lerp(a.x, b.x, k), lerp(a.y, b.y, k));
  const ease2 = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = () => window.gsap;

  /* ===== paleta (tirada do concept) ===== */
  const C = { K: '#161412', SK: '#9A6244', SK2: '#7A4A31', HR: '#231C16', HR2: '#4A3A2C', O: '#66704A', O2: '#525B3B', O3: '#7C8759', T: '#BDBBB4', J: '#262633', J2: '#1A1A24', S: '#3D4235', S2: '#2B2F26', SO: '#DAD7CE', W: '#F6F2EE', IR: '#3A2416', MO: '#3A1C14' };

  /* ===== expressões: mesma estrutura de comandos em cada caminho, pra poder transformar uma na outra ===== */
  const EX = {
    smile:     { m: 'M137 154 Q150 164 164 153 Q150 159 137 154 Z', t: 'M140 155 Q150 159 161 155 Q150 158 140 155 Z', to: 0, bL: 'M119 102 Q130 95 143 100', bR: 'M157 100 Q170 95 181 102', eye: { wide: 1, lid: 0.12, pupil: 1, ly: 0 }, head: 0 },
    grin:      { m: 'M135 151 Q150 172 166 151 Q150 155 135 151 Z', t: 'M138 152 Q150 159 163 152 Q150 156 138 152 Z', to: 1, bL: 'M119 99 Q130 92 143 97', bR: 'M157 97 Q170 92 181 99', eye: { wide: 1, lid: 0.22, pupil: 1, ly: 0 }, head: 0 },
    flat:      { m: 'M140 156 Q150 159 161 156 Q150 158 140 156 Z', t: 'M142 156 Q150 158 159 156 Q150 157 142 156 Z', to: 0, bL: 'M119 103 Q130 99 143 102', bR: 'M157 102 Q170 99 181 103', eye: { wide: 1, lid: 0.28, pupil: 1, ly: 0 }, head: 0 },
    scared:    { m: 'M135 156 Q150 147 166 156 Q151 182 135 156 Z', t: 'M138 155 Q150 150 163 155 Q150 160 138 155 Z', to: 1, bL: 'M119 98 Q131 92 143 89', bR: 'M157 89 Q169 92 181 98', eye: { wide: 1.32, lid: 0, pupil: 0.55, ly: 0 }, head: 0 },
    surprised: { m: 'M144 158 Q150 142 157 158 Q150 173 144 158 Z', t: 'M146 157 Q150 152 155 157 Q150 158 146 157 Z', to: 0, bL: 'M119 95 Q130 84 143 91', bR: 'M157 91 Q170 84 181 95', eye: { wide: 1.25, lid: 0, pupil: 0.8, ly: 0 }, head: -3 },
    angry:     { m: 'M135 153 Q150 148 166 153 Q150 168 135 153 Z', t: 'M137 153 Q150 150 164 153 Q150 164 137 153 Z', to: 1, bL: 'M119 96 Q132 99 145 107', bR: 'M155 107 Q168 99 181 96', eye: { wide: 0.95, lid: 0.4, pupil: 1, ly: 0 }, head: 0 },
    sad:       { m: 'M139 161 Q150 152 162 161 Q150 157 139 161 Z', t: 'M141 160 Q150 156 160 160 Q150 158 141 160 Z', to: 0, bL: 'M120 103 Q132 99 143 94', bR: 'M157 94 Q168 99 180 103', eye: { wide: 0.95, lid: 0.5, pupil: 1, ly: 2.5 }, head: 6 },
    love:      { m: 'M135 151 Q150 172 166 151 Q150 155 135 151 Z', t: 'M138 152 Q150 159 163 152 Q150 156 138 152 Z', to: 1, bL: 'M119 96 Q130 88 143 94', bR: 'M157 94 Q170 88 181 96', eye: { wide: 1, lid: 0, pupil: 1, ly: 0, heart: 1 }, head: -4 },
    sleep:     { m: 'M144 157 Q150 162 156 157 Q150 159 144 157 Z', t: 'M146 157 Q150 159 154 157 Q150 158 146 157 Z', to: 0, bL: 'M120 105 Q131 102 142 104', bR: 'M158 104 Q169 102 180 105', eye: { wide: 1, lid: 1, pupil: 1, ly: 0 }, head: 9 }
  };
  // nomes antigos do site
  const ALIAS = { wow: 'surprised' };
  const TALK_M = 'M138 150 Q150 172 163 150 Q150 155 138 150 Z';
  const HEART = 'M0 9 C-13 0 -17 -7 -11 -13 C-6 -17 -1 -14 0 -9 C1 -14 6 -17 11 -13 C17 -7 13 0 0 9 Z';

  /* ===== desenho das peças ===== */
  const curls = [[110,80,12],[120,66,15],[138,57,16],[157,55,16],[175,60,15],[190,76,12],[128,77,12],[147,73,13],[166,75,12],[116,56,11],[133,47,12],[151,45,12],[169,47,12],[185,58,11],[124,88,8],[140,86,9],[158,86,9],[176,88,8]];
  const hairSVG = dx => {
    const cs = curls.map(([x, y, r]) => [x + dx, y, r]);
    if (dx) cs.push([104, 74, 12], [106, 90, 9], [112, 60, 12]);
    return `<g fill="${C.K}">${cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 4}"/>`).join('')}</g>
      <g fill="${C.HR}">${cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <g fill="none" stroke="${C.HR2}" stroke-width="3" stroke-linecap="round">${cs.filter((_, i) => i % 2 === 0).map(([x, y, r]) => `<path d="M${x - r * 0.5} ${y - r * 0.15} q${r * 0.5} -${r * 0.55} ${r} 0"/>`).join('')}</g>`;
  };
  // cabeça. q = três quartos (rosto virado pra direita)
  const headSVG = q => {
    const face = q
      ? `M114 96 Q114 56 152 56 Q190 56 192 96 L191 126 Q186 164 156 174 Q122 168 116 130 Z`
      : `M110 96 Q110 56 150 56 Q190 56 190 96 L189 126 Q186 164 150 174 Q114 164 111 126 Z`;
    const ears = q
      ? `<ellipse cx="114" cy="120" rx="10" ry="14" fill="${C.SK}" stroke="${C.K}" stroke-width="4.5"/><path d="M111 113 Q117 120 112 127" stroke="${C.SK2}" stroke-width="3" fill="none"/>`
      : `<ellipse cx="107" cy="120" rx="9" ry="13" fill="${C.SK}" stroke="${C.K}" stroke-width="4.5"/><ellipse cx="193" cy="120" rx="9" ry="13" fill="${C.SK}" stroke="${C.K}" stroke-width="4.5"/><path d="M104 114 Q110 120 105 126 M196 114 Q190 120 195 126" stroke="${C.SK2}" stroke-width="3" fill="none"/>`;
    const fade = q
      ? `<path d="M116 108 Q113 84 122 70 L128 92 Q120 98 119 110 Z" fill="${C.HR}" opacity=".5"/>`
      : `<path d="M112 108 Q109 84 118 70 L124 92 Q116 98 115 110 Z" fill="${C.HR}" opacity=".5"/><path d="M188 108 Q191 84 182 70 L176 92 Q184 98 185 110 Z" fill="${C.HR}" opacity=".5"/>`;
    const nose = q
      ? `<path d="M165 121 Q168 131 177 137 Q181 142 171 143" fill="none" stroke="${C.K}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M169 140 Q172 138 174 141" stroke="${C.SK2}" stroke-width="2.5" fill="none"/>`
      : `<path d="M150 121 Q146 132 141 139 Q150 146 159 139 Q154 132 150 121 Z" fill="${C.SK2}" opacity=".35"/><path d="M141 138 Q144 145 150 145 Q156 145 159 138" stroke="${C.K}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M144 141 Q146 139 148 141 M152 141 Q154 139 156 141" stroke="${C.SK2}" stroke-width="2.5" fill="none"/>`;
    // traços do rosto (iguais nas duas vistas; em 3/4 vão pra direita e estreitam)
    const feat = q ? `transform="translate(161 0) scale(0.86 1) translate(-150 0)"` : '';
    return `${ears}
      <path d="${face}" fill="${C.SK}" stroke="${C.K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M${q ? 124 : 118} 156 Q${q ? 140 : 150} 172 ${q ? 176 : 182} 156" stroke="${C.SK2}" stroke-width="3" fill="none" opacity=".5"/>
      ${fade}
      <g class="cv-hair">${hairSVG(q ? -4 : 0)}
        <g class="cv-acc cv-acc-motion" opacity="0" transform="translate(${q ? -4 : 0} 0)"><path d="M100 70 Q102 24 154 22 Q206 26 202 62 Q160 82 100 70 Z" fill="#FF4B3E" stroke="${C.K}" stroke-width="5" stroke-linejoin="round"/><path d="M106 66 Q152 74 196 60" stroke="#C93226" stroke-width="5" fill="none"/><path d="M153 23 L158 10" stroke="${C.K}" stroke-width="5" stroke-linecap="round"/></g>
      </g>
      <g ${feat}>
        <g class="cv-eyes"></g>
        <g fill="none" stroke="${C.K}" stroke-width="6.5" stroke-linecap="round"><path class="cv-bL" d="${EX.smile.bL}"/><path class="cv-bR" d="${EX.smile.bR}"/></g>
        <path class="cv-mouth" d="${EX.smile.m}" fill="${C.MO}" stroke="${C.K}" stroke-width="2.5" stroke-linejoin="round"/>
        <path class="cv-teeth" d="${EX.smile.t}" fill="${C.W}" opacity="0"/>
        <g class="cv-hearts" opacity="0">${[131, 169].map(x => `<g transform="translate(${x} 118)"><path class="cv-heart" d="${HEART}" fill="#FF2E93" stroke="${C.K}" stroke-width="2.5" stroke-linejoin="round"/></g>`).join('')}</g>
        <g class="cv-acc cv-acc-gsap" opacity="0"><path d="M104 118 L118 118 M182 118 L196 118" stroke="${C.K}" stroke-width="5" stroke-linecap="round"/><rect x="116" y="104" width="68" height="28" rx="13" fill="#0AE448" fill-opacity=".45" stroke="${C.K}" stroke-width="4.5"/><path d="M124 111 L140 111" stroke="#D9F7E8" stroke-width="4" stroke-linecap="round"/></g>
        <g class="cv-acc cv-acc-three" opacity="0"><path d="M116 112 L104 107 M184 112 L196 107" stroke="${C.K}" stroke-width="4.5" stroke-linecap="round"/><rect x="114" y="105" width="33" height="25" rx="5" fill="#FF3B3B" fill-opacity=".72" stroke="${C.K}" stroke-width="4.5"/><rect x="153" y="105" width="33" height="25" rx="5" fill="#22E4FF" fill-opacity=".72" stroke="${C.K}" stroke-width="4.5"/><path d="M147 113 L153 113" stroke="${C.K}" stroke-width="4.5"/></g>
      </g>
      ${nose}
      <g class="cv-zzz" opacity="0" font-family="Lilita One, Arial Black, sans-serif" fill="#FF2E93" stroke="${C.K}" stroke-width="1.5"><text font-size="30">Z</text><text font-size="24">z</text><text font-size="18">z</text></g>
      <g class="cv-poof" opacity="0">${[[150, 50, 30], [108, 80, 24], [192, 80, 24], [114, 136, 22], [186, 136, 22], [150, 162, 20]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.W}" stroke="${C.K}" stroke-width="4"/>`).join('')}</g>
      <g class="cv-sweat" opacity="0"><path d="M${q ? 120 : 196} 76 q-6 10 0 14 q6 -4 0 -14 Z" fill="#9BE3FF" stroke="${C.K}" stroke-width="2.5"/><path d="M${q ? 108 : 206} 96 q-5 8 0 11 q5 -3 0 -11 Z" fill="#9BE3FF" stroke="${C.K}" stroke-width="2.5"/></g>`;
  };
  // tronco do moletom (coordenadas locais; o pivô é o quadril em 150,414)
  const torsoSVG = q => `<g ${q ? 'transform="translate(150 0) scale(0.86 1) translate(-150 0)"' : ''}>
    <path d="M114 214 Q104 174 132 166 L168 166 Q196 174 186 214 Z" fill="${C.O2}" stroke="${C.K}" stroke-width="4.5"/>
    <path d="M136 150 L164 150 L166 200 L134 200 Z" fill="${C.SK}" stroke="${C.K}" stroke-width="4"/>
    <path d="M102 214 Q110 196 132 192 L168 192 Q190 196 198 214 L208 380 Q209 394 196 396 L104 396 Q91 394 92 380 Z" fill="${C.O}" stroke="${C.K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M192 222 Q203 300 199 380" stroke="${C.O2}" stroke-width="11" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M110 230 Q104 300 106 376" stroke="${C.O3}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>
    <path d="M95 380 L205 380 L204 404 Q204 410 198 410 L102 410 Q96 410 96 404 Z" fill="${C.O}" stroke="${C.K}" stroke-width="4.5" stroke-linejoin="round"/>
    <g stroke="${C.O2}" stroke-width="2.5">${Array.from({ length: 13 }, (_, i) => `<line x1="${102 + i * 8}" y1="384" x2="${102 + i * 8}" y2="406"/>`).join('')}</g>
    <g ${q ? 'transform="translate(14 0)"' : ''}>
      <path d="M118 316 L182 316 L192 370 L108 370 Z" fill="${C.O}" stroke="${C.K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M118 316 L110 366 M182 316 L190 366" stroke="${C.O2}" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 196 Q150 212 168 196 L168 206 Q150 222 132 206 Z" fill="${C.T}" stroke="${C.K}" stroke-width="3"/>
      <path d="M118 204 Q150 246 182 204 Q190 192 180 188 Q150 228 120 188 Q110 192 118 204 Z" fill="${C.O}" stroke="${C.K}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M126 204 Q150 232 174 204" stroke="${C.O2}" stroke-width="3" fill="none"/>
      <g class="cv-strings" fill="none" stroke="${C.K}" stroke-width="3" stroke-linecap="round"><path d="M141 218 Q138 244 141 268"/><path d="M159 218 Q162 244 159 268"/></g>
    </g>
  </g>`;
  // mãos (pulso em 0,0, dedos apontando pra +y)
  const HANDS = {
    open: `<path d="M8 3 Q19 5 18 15 Q17 20 12 17 L8 12 Z" fill="${C.SK}" stroke="${C.K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-10 -2 Q-13 14 -9 24 Q-4 31 3 30 Q10 28 11 19 L12 2 Q11 -3 6 -3 Z" fill="${C.SK}" stroke="${C.K}" stroke-width="4" stroke-linejoin="round"/><path d="M-4 20 L-4 28 M2 21 L2 29" stroke="${C.SK2}" stroke-width="2.5" stroke-linecap="round"/>`,
    fist: `<path d="M-11 -2 Q-13 12 -9 19 Q0 25 9 19 Q13 12 11 -2 Z" fill="${C.SK}" stroke="${C.K}" stroke-width="4" stroke-linejoin="round"/><path d="M-5 13 L-5 19 M1 14 L1 21 M6 13 L6 19" stroke="${C.SK2}" stroke-width="2.5" stroke-linecap="round"/><path d="M9 4 Q15 8 9 13" fill="none" stroke="${C.K}" stroke-width="3"/>`,
    point: `<path d="M-11 -2 Q-13 12 -9 19 Q0 25 9 19 Q13 12 11 -2 Z" fill="${C.SK}" stroke="${C.K}" stroke-width="4" stroke-linejoin="round"/><path d="M4 16 L5 38" stroke="${C.K}" stroke-width="12" stroke-linecap="round"/><path d="M4 16 L5 38" stroke="${C.SK}" stroke-width="5.5" stroke-linecap="round"/><path d="M-5 13 L-5 19 M0 15 L0 21" stroke="${C.SK2}" stroke-width="2.5" stroke-linecap="round"/>`
  };
  const SHOE_P = `<path d="M-14 -12 Q-17 6 -15 14 L30 14 Q38 12 36 3 Q33 -5 20 -7 L8 -12 Z" fill="${C.S}" stroke="${C.K}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-15 11 L36 11" stroke="${C.SO}" stroke-width="5" stroke-linecap="round"/><path d="M6 -8 L11 0 M13 -6 L18 1" stroke="${C.S2}" stroke-width="2.5" stroke-linecap="round"/>`;
  const SHOE_F = `<path d="M-17 -8 Q-20 12 -16 16 L16 16 Q20 12 17 -8 Q0 -14 -17 -8 Z" fill="${C.S}" stroke="${C.K}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-17 13 L17 13" stroke="${C.SO}" stroke-width="5" stroke-linecap="round"/><path d="M-6 -6 L6 -6 M-6 0 L6 0" stroke="${C.S2}" stroke-width="2.5" stroke-linecap="round"/>`;
  const STAR = 'M0 -11 L3.2 -3.6 L11 -3.4 L5 1.6 L7 9.4 L0 5 L-7 9.4 L-5 1.6 L-11 -3.4 L-3.2 -3.6 Z';

  /* ===== matemática do esqueleto ===== */
  // IK de dois ossos: devolve a articulação do meio. pref = pra onde o cotovelo/joelho prefere apontar
  const ik = (a, t, l1, l2, pref) => {
    const dx = t.x - a.x, dy = t.y - a.y, d = Math.hypot(dx, dy);
    const dd = clamp(Math.abs(l1 - l2) + 1, l1 + l2 - 0.5, d);
    const ang = Math.atan2(dy, dx), al = Math.acos(clamp(-1, 1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd)));
    const c1 = v2(a.x + Math.cos(ang - al) * l1, a.y + Math.sin(ang - al) * l1), c2 = v2(a.x + Math.cos(ang + al) * l1, a.y + Math.sin(ang + al) * l1);
    const j = (c1.x - c2.x) * pref.x + (c1.y - c2.y) * pref.y >= 0 ? c1 : c2;
    const ang2 = Math.atan2(t.y - j.y, t.x - j.x);
    return { j, end: v2(j.x + Math.cos(ang2) * l2, j.y + Math.sin(ang2) * l2), ang2 };
  };
  // caminho do membro com a articulação levemente arredondada
  const limbD = (a, j, e) => {
    const p1 = v2(a.x + (j.x - a.x) * 0.82, a.y + (j.y - a.y) * 0.82), p2 = v2(j.x + (e.x - j.x) * 0.18, j.y + (e.y - j.y) * 0.18);
    return `M${f1(a.x)} ${f1(a.y)} L${f1(p1.x)} ${f1(p1.y)} Q${f1(j.x)} ${f1(j.y)} ${f1(p2.x)} ${f1(p2.y)} L${f1(e.x)} ${f1(e.y)}`;
  };
  const spring = (k = 0.14, damp = 0.72, x = 0) => ({ x, v: 0, k, damp, step(t) { this.v += (t - this.x) * this.k; this.v *= this.damp; this.x += this.v; return this.x; } });
  const PIV = v2(150, 414), NECK = v2(150, 176), GROUND = 674;
  const xf = (p, B) => { const c = Math.cos(B.r), s = Math.sin(B.r), lx = (p.x - PIV.x) * B.sx, ly = (p.y - PIV.y) * B.sy; return v2(PIV.x + B.x + lx * c - ly * s, PIV.y + B.y + lx * s + ly * c); };
  const LEN = { up: 104, fore: 98, thigh: 134, shin: 128 };
  // ombros e quadris de cada vista (locais). Em 3/4: [perto, longe]
  const RIG = {
    f: { sh: [v2(104, 222), v2(196, 222)], hip: [v2(128, 414), v2(172, 414)], armDir: [v2(-1, 0.25), v2(1, 0.25)], legDir: [v2(-1, 0), v2(1, 0)] },
    q: { sh: [v2(116, 228), v2(184, 222)], hip: [v2(144, 414), v2(158, 410)], armDir: [v2(-0.5, 1), v2(-0.5, 1)], legDir: [v2(1, 0), v2(1, 0)] }
  };
  // pé num ciclo de passo: metade apoiado (desliza pra trás), metade no ar (arco pra frente)
  const cycleFoot = (q, S, lift) => {
    if (q < 0.5) { const u = q / 0.5; return { x: S * (1 - 2 * u), y: 0, rot: Math.max(0, (u - 0.7) / 0.3) * 28 }; }
    const u = (q - 0.5) / 0.5, e = ease2(u); return { x: S * (-1 + 2 * e), y: -Math.sin(Math.PI * u) * lift, rot: 28 * (1 - u) * (1 - u) - 14 * u * u };
  };

  /* ===== poses das cenas (coordenadas do mundo: viewBox 300x700, chão em y 674) ===== */
  const SCENES = {
    // puxa a corda andando de ré, inclinado pra trás
    pull: { view: 'q', ex: 'angry', pose(m) {
      const ph = m.sph, tug = Math.sin(ph * Math.PI * 4) * 4, fs = [0, 1].map(i => cycleFoot((ph + i * 0.5) % 1, 26, 16));
      return { b: [-10, 24 + 4 * Math.cos(ph * Math.PI * 4), -13], f: fs.map((c, i) => [RIG.q.hip[i].x - 10 + c.x, GROUND + c.y]), r: fs.map(c => c.rot), h: [[258 + tug, 312], [244 + tug, 304]], hs: ['fist', 'fist'] };
    } },
    // voo de super-herói: corpo deitado, braços na frente, pernas batendo atrás
    fly: { view: 'q', ex: 'surprised', pose(m, t) {
      const r = 80, Bs = { x: 0, y: -40, r: r * Math.PI / 180, sx: 1, sy: 1 }, u = v2(Math.sin(Bs.r), -Math.cos(Bs.r)), n = v2(-u.y, u.x), fl = Math.sin(t * 14);
      const sh = [0, 1].map(i => xf(RIG.q.sh[i], Bs)), hip = [0, 1].map(i => xf(RIG.q.hip[i], Bs));
      return { b: [Bs.x, Bs.y, r],
        h: sh.map((p, i) => { const o = i ? -14 : 14; return [p.x + u.x * 190 + n.x * o, p.y + u.y * 190 + n.y * o]; }),
        f: hip.map((p, i) => { const o = (i ? 18 : -18) + fl * 12 * (i ? -1 : 1); return [p.x - u.x * 252 + n.x * o, p.y - u.y * 252 + n.y * o]; }),
        r: [168, 162], hs: ['open', 'open'] };
    } },
    // surfando: base aberta, joelhos dobrados, braços abertos pra equilibrar
    surf: { view: 'q', ex: 'grin', pose(m, t) {
      const c = Math.sin(t * 1.7);
      return { b: [c * 8, 46, -4 + c * 6], f: [[214, 647], [92, 647]], r: [0, 0], h: [[292, 372 + c * 26], [10, 350 - c * 26]], hs: ['open', 'open'] };
    } },
    // do lado da claquete: braços pra cima e pra frente, como quem segura a ponta
    clap: { view: 'q', ex: 'surprised', pose(m, t) {
      const k = Math.sin(t * 6) * 6;
      return { b: [0, 4, 4], f: [[146, 674], [168, 674]], r: [0, 0], h: [[300, 150 + k], [282, 176 - k]], hs: ['open', 'open'] };
    } },
    // sentado no lápis, pernas balançando, segurando firme na frente
    ride: { view: 'q', ex: 'grin', pose(m, t) {
      const bob = Math.sin(t * 5) * 5, pw = Math.sin(t * 2.4) * 5;
      return { b: [-14, 66 + bob, 10 + pw * 0.4], f: [[186 + Math.sin(t * 3.2) * 12, 632 + bob], [164 + Math.sin(t * 3.2 + 1.2) * 12, 622 + bob]], r: [12, 12], h: [[226, 492 + bob + pw], [244, 488 + bob + pw * 1.2]], hs: ['fist', 'fist'] };
    } },
    // aponta com o braço inteiro esticado
    point: { view: 'q', ex: 'grin', pose(m, t) {
      const bob = Math.sin(t * 4);
      return { b: [0, 2 + bob * 1.5, -2], f: [[146, 674], [168, 674]], r: [0, 0], h: [[332 + bob * 6, 222 + bob * 2], [150, 410]], hs: ['point', 'open'] };
    } },
    // puxa uma corda vertical, uma mão de cada vez
    haul: { view: 'f', ex: 'angry', pose(m, t) {
      const a = (Math.sin(t * 4.2) + 1) / 2;
      return { b: [0, 14 + a * 6, 0], f: [[118, 674], [182, 674]], r: [0, 0], h: [[144, 40 + a * 90], [156, 130 - a * 90]], hs: ['fist', 'fist'] };
    } },
    // pendurado pelas mãos: as pernas balançam, chutam e se debatem na queda
    hang: { view: 'f', ex: 'grin', pose(m, t) {
      const st = m.st, sw = st.swing * 24 * Math.PI / 180, fl = st.flail;
      const hips = RIG.f.hip, legA = (i, extra) => { const a = sw + extra; return [hips[i].x - Math.sin(a) * 258, hips[i].y + Math.cos(a) * 258]; };
      const kick = st.kick * 100 * Math.PI / 180;
      return { b: [0, 0, st.swing * 4], f: [legA(0, Math.sin(t * 20) * 0.5 * fl), legA(1, -kick + Math.sin(t * 20 + 1) * 0.5 * fl)], r: [0, -st.kick * 60],
        h: [[112 - fl * 40, 20 - fl * 30 + Math.sin(t * 18) * 20 * fl], [188 + fl * 40, 20 - fl * 30 - Math.sin(t * 18) * 20 * fl]], hs: ['fist', 'fist'] };
    } }
  };

  /* ===== relógio compartilhado: física a 60/s, desenho a 12/s ("de dois em dois") ===== */
  const inst = [];
  let mx = innerWidth / 2, my = innerHeight / 3, ticking = false;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { const m = inst.find(i => i.slot === e.target); if (m) m.onScreen = e.isIntersecting; }), { rootMargin: '120px' }) : null;
  function startTicker() {
    if (ticking || !G()) return; ticking = true;
    G().ticker.add((time, dms) => {
      const dt = Math.min(dms, 100) / 1000;
      inst.forEach(m => {
        if (!m.onScreen) return;
        if (reduce) { if (m.dirty) { m.frame(0); m.dirty = false; } return; }
        m.acc += dt;
        const step = 1 / 12;
        if (m.acc >= step) { const n = Math.min(10, Math.round(m.acc * 60)); for (let i = 0; i < n; i++) m.frame(1 / 60); m.acc = 0; }
      });
    });
  }

  let uid = 0;
  function mount(slot, opt = {}) {
    const id = 'cv' + (uid++);
    const svg = el('svg', { class: 'mascot', viewBox: '0 0 300 700', role: 'img', 'aria-label': 'Cauê em versão desenho: pele marrom, cabelo cacheado, moletom verde-oliva e calça escura' });
    slot.innerHTML = ''; slot.appendChild(svg);
    const shadow = el('ellipse', { cx: 150, cy: 692, rx: 84, ry: 10, fill: C.K, opacity: 0.2 }, svg);
    const root = el('g', { filter: 'url(#boil)' }, svg);
    const makeLimb = (parent, w, col) => ({ o: el('path', { fill: 'none', stroke: C.K, 'stroke-width': w + 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent), f: el('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent) });
    const makeArm = (parent, col, cuff) => {
      const g = el('g', {}, parent), l = makeLimb(g, 30, col);
      const cf = el('path', { fill: 'none', stroke: cuff, 'stroke-width': 30, 'stroke-linecap': 'butt' }, g);
      const hand = el('g', {}, g), shapes = {};
      for (const k in HANDS) { shapes[k] = el('g', { display: k === 'open' ? 'inline' : 'none' }, hand); shapes[k].innerHTML = HANDS[k]; }
      return { g, l, cf, hand, shapes, cur: 'open' };
    };
    const makeLeg = (parent, col, shoe) => { const g = el('g', {}, parent), l = makeLimb(g, 40, col), s = el('g', {}, g); s.innerHTML = shoe; return { g, l, shoe: s }; };
    const V = {};
    ['f', 'q'].forEach(v => {
      const q = v === 'q', g = el('g', { display: q ? 'none' : 'inline' }, root), o = { g };
      if (q) {
        o.armB = makeArm(g, C.O2, C.S2); o.legB = makeLeg(g, C.J2, SHOE_P); o.legF = makeLeg(g, C.J, SHOE_P);
        o.torso = el('g', {}, g); o.torso.innerHTML = torsoSVG(true);
        o.head = el('g', {}, g); o.head.innerHTML = headSVG(true);
        o.armF = makeArm(g, C.O, C.O2);
        o.arms = [o.armF, o.armB]; o.legs = [o.legF, o.legB];
      } else {
        o.legs = [makeLeg(g, C.J, SHOE_F), makeLeg(g, C.J, SHOE_F)];
        o.torso = el('g', {}, g); o.torso.innerHTML = torsoSVG(false);
        o.head = el('g', {}, g); o.head.innerHTML = headSVG(false);
        o.arms = [makeArm(g, C.O, C.O2), makeArm(g, C.O, C.O2)];
      }
      const h = o.head;
      o.strings = Array.from(o.torso.querySelectorAll('.cv-strings path'));
      o.hair = h.querySelector('.cv-hair');
      o.face = { eyes: h.querySelector('.cv-eyes'), hearts: h.querySelector('.cv-hearts'), heart: Array.from(h.querySelectorAll('.cv-heart')), zzz: h.querySelector('.cv-zzz'), zl: Array.from(h.querySelectorAll('.cv-zzz text')) };
      // olhos: branco + íris recortados, pálpebra que desce, linha da pálpebra
      o.eyes = [131, 169].map((cx, i) => {
        const box = o.face.eyes, cp = el('clipPath', { id: `${id}-${v}-e${i}` }, box), ce = el('ellipse', { cx, cy: 118, rx: 10, ry: 8 }, cp);
        const white = el('ellipse', { cx, cy: 118, rx: 10, ry: 8, fill: C.W }, box), inner = el('g', { 'clip-path': `url(#${id}-${v}-e${i})` }, box), iris = el('g', {}, inner);
        el('circle', { cx, cy: 118, r: 6, fill: C.IR }, iris); const pupil = el('circle', { cx, cy: 118, r: 3.2, fill: C.K }, iris); el('circle', { cx: cx + 2, cy: 115.5, r: 1.7, fill: '#fff' }, iris);
        const lid = el('path', { fill: C.SK }, inner), line = el('path', { fill: 'none', stroke: C.K, 'stroke-width': 3.6, 'stroke-linecap': 'round' }, box), low = el('path', { fill: 'none', stroke: C.K, 'stroke-width': 1.8, 'stroke-linecap': 'round', opacity: 0.6 }, box);
        return { cx, ce, white, iris, pupil, lid, line, low, i };
      });
      V[v] = o;
    });
    const stars = el('g', { display: 'none' }, root);
    const starEls = [0, 1, 2].map(() => el('path', { d: STAR, fill: '#FFD43B', stroke: C.K, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, stars));
    const q = s => svg.querySelectorAll(s);

    /* ---------- estado (o GSAP anima estes números; timelines com scroll também) ---------- */
    const st = { speed: 0, crouch: 0, air: 0, sy: 1, armsUp: 0, tuck: 0, wave: 0, fall: 0, stars: 0, scn: 0, sc: 0, an: 0, sa: 0, su: 0, zz: 0, swing: 0, kick: 0, flail: 0 };
    const eye = { heart: 0, ...EX.smile.eye }, wink = { v: 0 };
    const sp = { hx: spring(0.12, 0.74), hy: spring(0.12, 0.72), hr: spring(0.1, 0.78), hair: spring(0.08, 0.8), s1: spring(0.06, 0.86), s2: spring(0.07, 0.85) };
    const prev = { bx: 0, by: 0 };
    let view = 'f', phase = 0, t = rnd(0, 10), blinkAt = rnd(0.5, 3), exName = 'smile', scene = null, flipped = false;
    const m = { slot, svg, st, eye, wink, onScreen: !io, acc: 0, dirty: true, sph: 0, pullV: 0, lookDir: null, busy: false };

    function setView(v) {
      if (v === view) return;
      const g = G();
      if (!g || reduce) { V[view].g.setAttribute('display', 'none'); view = v; V[view].g.setAttribute('display', 'inline'); return; }
      // "vush": achata, troca a vista e volta com elástico
      g.timeline().to(svg, { scaleX: 0.15, duration: 0.07, ease: 'power2.in', transformOrigin: '50% 100%' })
        .add(() => { V[view].g.setAttribute('display', 'none'); view = v; V[view].g.setAttribute('display', 'inline'); m.dirty = true; })
        .to(svg, { scaleX: 1, duration: 0.22, ease: 'back.out(2.4)' });
    }
    const wantView = () => (scene ? SCENES[scene].view : st.fall > 0.001 || st.speed > 0.05 || m.forceQ ? 'q' : 'f');

    function frame(dt) {
      t += dt;
      const wv = wantView(); if (wv !== view && !m.viewLock) setView(wv);
      const R_ = RIG[view], O = V[view], s = st.speed, w = clamp(0, 1, s), run = clamp(0, 1, s - 1);
      phase = (phase + dt * (0.95 + 0.55 * run) * (s > 0.01 ? 1 : 0)) % 1;
      if (scene === 'pull') m.sph = (m.sph - dt * clamp(-2.6, 2.6, m.pullV) + 5) % 1;
      const breath = Math.sin(t * 2.2);

      /* --- locomoção / parado --- */
      const B = { x: 0, y: breath * 1.4, r: 0, sx: 1, sy: 1 };
      const feet = [], fRot = [0, 0], handsT = [], hShape = ['open', 'open'];
      if (view === 'q') {
        const S = 40 + run * 30, lift = 30 + run * 38, A = 6 + run * 6;
        B.y = w * A * Math.cos(phase * Math.PI * 4) - w * run * 10 + (1 - w) * breath * 1.4;
        B.r = w * (3 + run * 8) * Math.PI / 180;
        [0, 1].forEach(i => {
          const { x, y, rot } = cycleFoot((phase + i * 0.5) % 1, S, lift);
          feet.push(v2(R_.hip[i].x + 4 + x * w, GROUND + y * w)); fRot[i] = rot * w;
          // braço oposto à perna; correndo, o cotovelo fica em ~90°
          const ap = Math.sin((phase + i * 0.5 + 0.5) * Math.PI * 2), ang = (ap * (26 + run * 26) + run * 8) * Math.PI / 180, L = 196 - run * 52 - (1 - w) * 2;
          const hw = { rel: v2(Math.sin(ang) * L * w + (1 - w) * (i ? 6 : -4), Math.cos(ang) * L * w + (1 - w) * 194) };
          if (run > 0.01) {
            const ua = ap * 50 * Math.PI / 180, elb = v2(Math.sin(ua) * LEN.up, Math.cos(ua) * LEN.up), fa = ua + 95 * Math.PI / 180;
            const hd = v2(elb.x + Math.sin(fa) * LEN.fore * 0.98, elb.y + Math.cos(fa) * LEN.fore * 0.98);
            hw.rel = lerpP(hw.rel, hd, run * w); if (run > 0.3) hw.pref = v2(elb.x - hd.x / 2, elb.y - hd.y / 2);
          }
          handsT.push(hw);
          if (run > 0.5) hShape[i] = 'fist';
        });
      } else {
        R_.hip.forEach((h, i) => { feet.push(v2(h.x + (i ? 6 : -6), GROUND)); });
        handsT.push({ rel: v2(-12, 194 + breath) }, { rel: v2(12, 194 + breath) });
        // a expressão também mexe no corpo
        B.y += st.sa * 8 + st.sc * 4 + st.zz * (2 + Math.sin(t * 1.3) * 1.5); B.sy *= 1 - st.sa * 0.02;
        [[st.sc, v2(-6, -72), v2(6, -72), 'open'], [st.an, v2(16, 44), v2(-16, 44), 'fist'], [st.su, v2(-40, 150), v2(40, 150), 'open'], [st.sa, v2(4, 200), v2(-4, 200), 'open'], [st.zz, v2(10, 200), v2(-10, 200), 'open']]
          .forEach(([k, l, r, shp]) => { if (k > 0.001) { handsT[0].rel = lerpP(handsT[0].rel, l, k); handsT[1].rel = lerpP(handsT[1].rel, r, k); if (k > 0.5) hShape[0] = hShape[1] = shp; } });
      }

      /* --- ações --- */
      B.y += st.crouch + st.air; B.sy *= st.sy; B.sx = 1 / Math.sqrt(B.sy);
      feet.forEach((f, i) => { f.y += Math.min(0, st.air) + (st.air < 0 ? -st.tuck * (i ? 0.7 : 1) : 0); if (st.air < -4) fRot[i] = lerp(fRot[i], view === 'q' ? 30 : 0, 0.7); });
      if (st.armsUp) {
        const up = view === 'q' ? [v2(40, -176), v2(10, -180)] : [v2(-70, -160), v2(70, -160)];
        handsT.forEach((h, i) => { h.rel = lerpP(h.rel, up[i], st.armsUp); }); if (st.armsUp > 0.5) hShape[0] = hShape[1] = 'open';
      }
      if (st.wave && view === 'f') handsT[1].rel = lerpP(handsT[1].rel, v2(70 + Math.sin(t * 12) * 22, -150 + Math.cos(t * 12) * 6), st.wave);
      if (st.fall > 0.001 && view === 'q') {
        // escorregão em poses-chave: 0 em pé → 1 escorrega → 2 no ar → 3 cai sentado → 4 tonto → 5 agachado → 6 em pé
        const fl = Math.sin(t * 17) * 16;
        const P0 = { b: [B.x, B.y, B.r * 180 / Math.PI], f: feet.map(p => [p.x, p.y]), r: fRot.slice(), h: null };
        const P = [P0,
          { b: [-6, -34, -24], f: [[262, 590], [228, 640]], r: [-40, -25], h: [[236, 140 + fl], [70, 190 - fl]] },
          { b: [-24, 96, -52], f: [[300, 420], [276, 470]], r: [-70, -55], h: [[150, 250 + fl], [-20, 300 - fl]] },
          { b: [-20, 262, -16], f: [[350, 662], [272, 672]], r: [-55, 0], h: [[50 + fl * 0.3, 340], [82, 680]] },
          { b: [-20, 258, -10], f: [[346, 664], [274, 672]], r: [-50, 0], h: [[52 + fl * 0.3, 336], [84, 680]] },
          { b: [0, 118, 20], f: [[168, 674], [150, 674]], r: [0, 0], h: [[226, 560], [212, 570]] },
          P0];
        const k = clamp(0, 6, st.fall), i = Math.min(5, Math.floor(k)), u = k - i, a = P[i], b = P[i + 1], L = (x, y) => lerp(x, y, u);
        B.x = L(a.b[0], b.b[0]); B.y = L(a.b[1], b.b[1]); B.r = L(a.b[2], b.b[2]) * Math.PI / 180;
        [0, 1].forEach(j => {
          feet[j] = v2(L(a.f[j][0], b.f[j][0]), L(a.f[j][1], b.f[j][1])); fRot[j] = L(a.r[j], b.r[j]);
          const sh = xf(R_.sh[j], B), cur = v2(sh.x + handsT[j].rel.x, sh.y + handsT[j].rel.y);
          const ha = a.h ? v2(...a.h[j]) : cur, hb = b.h ? v2(...b.h[j]) : cur;
          handsT[j].rel = v2(L(ha.x, hb.x) - sh.x, L(ha.y, hb.y) - sh.y); delete handsT[j].pref;
        });
        hShape[0] = hShape[1] = 'open';
      }
      // cena: pose em coordenadas do mundo, misturada por st.scn
      const SC = scene && SCENES[scene];
      if (SC && st.scn > 0.001 && SC.view === view) {
        const S = SC.pose(m, t), k = st.scn;
        B.x = lerp(B.x, S.b[0], k); B.y = lerp(B.y, S.b[1], k); B.r = lerp(B.r, S.b[2] * Math.PI / 180, k);
        [0, 1].forEach(j => {
          feet[j] = lerpP(feet[j], v2(...S.f[j]), k); fRot[j] = lerp(fRot[j], S.r[j], k);
          const sh = xf(R_.sh[j], B), cur = v2(sh.x + handsT[j].rel.x, sh.y + handsT[j].rel.y), p = lerpP(cur, v2(...S.h[j]), k);
          handsT[j].rel = v2(p.x - sh.x, p.y - sh.y); if (k > 0.5) { hShape[j] = S.hs[j]; delete handsT[j].pref; }
        });
      }
      // estrelinhas de tontura
      if (st.stars > 0.01) {
        const hc = xf(v2(150, 70), B);
        stars.setAttribute('display', 'inline'); stars.setAttribute('opacity', Math.min(1, st.stars).toFixed(2));
        starEls.forEach((e, j) => { const an = t * 5 + j * Math.PI * 2 / 3; e.setAttribute('transform', `translate(${f1(hc.x + Math.cos(an) * 56)} ${f1(hc.y - 44 + Math.sin(an) * 14)}) rotate(${f1(t * 200)}) scale(${(1.7 + 0.4 * Math.sin(an)).toFixed(2)})`); });
      } else stars.setAttribute('display', 'none');

      /* --- desenha --- */
      O.torso.setAttribute('transform', `translate(${f1(B.x)} ${f1(B.y)}) translate(${PIV.x} ${PIV.y}) rotate(${(B.r * 180 / Math.PI).toFixed(2)}) scale(${B.sx.toFixed(3)} ${B.sy.toFixed(3)}) translate(${-PIV.x} ${-PIV.y})`);
      O.legs.forEach((lg, i) => {
        const hip = xf(R_.hip[i], B), k = ik(hip, feet[i], LEN.thigh, LEN.shin, R_.legDir[i]), d = limbD(hip, k.j, k.end);
        lg.l.o.setAttribute('d', d); lg.l.f.setAttribute('d', d);
        lg.shoe.setAttribute('transform', `translate(${f1(k.end.x)} ${f1(k.end.y + 2)}) rotate(${fRot[i].toFixed(1)})`);
      });
      O.arms.forEach((am, i) => {
        const sh = xf(R_.sh[i], B), tgt = v2(sh.x + handsT[i].rel.x, sh.y + handsT[i].rel.y);
        const k = ik(sh, tgt, LEN.up, LEN.fore, handsT[i].pref || R_.armDir[i]), d = limbD(sh, k.j, k.end);
        am.l.o.setAttribute('d', d); am.l.f.setAttribute('d', d);
        const cb = v2(k.end.x - Math.cos(k.ang2) * 12, k.end.y - Math.sin(k.ang2) * 12);
        am.cf.setAttribute('d', `M${f1(cb.x)} ${f1(cb.y)} L${f1(k.end.x)} ${f1(k.end.y)}`);
        const deg = k.ang2 * 180 / Math.PI - 90, mir = view === 'f' ? (i ? -1 : 1) : -1;
        am.hand.setAttribute('transform', `translate(${f1(k.end.x)} ${f1(k.end.y)}) rotate(${deg.toFixed(1)}) scale(${mir} 1)`);
        if (am.cur !== hShape[i]) { am.shapes[am.cur].setAttribute('display', 'none'); am.shapes[hShape[i]].setAttribute('display', 'inline'); am.cur = hShape[i]; }
      });
      // cabeça com mola (ação sobreposta)
      const nk = xf(NECK, B), dbx = B.x - prev.bx, dby = B.y - prev.by; prev.bx = B.x; prev.by = B.y;
      const hx = sp.hx.step(clamp(-12, 12, -dbx * 2)), hy = sp.hy.step(clamp(-12, 12, -dby * 2.2));
      const hr = sp.hr.step(B.r * 180 / Math.PI * 0.4 + EX[exName].head + (view === 'f' && !m.lookDir ? (mx / innerWidth - 0.5) * 6 : 0));
      O.head.setAttribute('transform', `translate(${f1(nk.x - NECK.x + hx)} ${f1(nk.y - NECK.y + hy + st.sa * 6)}) rotate(${hr.toFixed(2)} ${NECK.x} ${NECK.y})`);
      O.hair.setAttribute('transform', `translate(0 ${f1(clamp(-10, 6, sp.hair.step(clamp(-12, 12, -dby * 3))))})`);
      const s1 = sp.s1.step(-dbx * 9 + Math.sin(t * 2) * 0.4), s2 = sp.s2.step(-dbx * 10);
      O.strings[0].setAttribute('d', `M141 218 Q${f1(138 + s1 * 0.5)} 244 ${f1(141 + s1)} 268`);
      O.strings[1].setAttribute('d', `M159 218 Q${f1(162 + s2 * 0.5)} 244 ${f1(159 + s2)} 268`);
      shadow.setAttribute('transform', `translate(${f1(150 + B.x * 0.5)} 692) scale(${(1 - Math.max(0, -st.air) / 300).toFixed(3)} 1) translate(-150 -692)`);
      shadow.setAttribute('opacity', scene === 'fly' || scene === 'hang' || scene === 'ride' ? 0 : 0.2);
      // olhos: piscam, seguem o mouse (ou olham pra onde a cena manda), coração, Zz
      if (t > blinkAt + 0.14) blinkAt = t + rnd(1.8, 4.4);
      const bl = t > blinkAt ? Math.sin(clamp(0, 1, (t - blinkAt) / 0.14) * Math.PI) : 0;
      let lx, ly;
      if (m.lookDir) { lx = m.lookDir[0]; ly = m.lookDir[1]; }
      else if (view === 'q') { lx = 2.5; ly = 0; }
      else {
        const r = svg.getBoundingClientRect(), ex = r.left + r.width * 0.5, ey = r.top + r.height * (118 / 700);
        const ddx = mx - ex, ddy = my - ey, dd = Math.max(1, Math.hypot(ddx, ddy)), kk = Math.min(1, dd / 300);
        lx = ddx / dd * 3.6 * kk; ly = ddy / dd * 2.4 * kk;
      }
      ly += eye.ly;
      const F = O.face;
      F.eyes.setAttribute('opacity', (1 - eye.heart).toFixed(2)); F.hearts.setAttribute('opacity', eye.heart.toFixed(2));
      if (eye.heart > 0.01) F.heart.forEach((h, j) => h.setAttribute('transform', `scale(${(eye.heart * (1.05 + 0.14 * Math.sin(t * 9 + j * 0.6))).toFixed(3)})`));
      F.zzz.setAttribute('opacity', st.zz.toFixed(2));
      if (st.zz > 0.01) F.zl.forEach((z, j) => { const ph = (t * 0.45 + j / 3) % 1; z.setAttribute('x', f1(192 + ph * 26 + j * 4)); z.setAttribute('y', f1(78 - ph * 52)); z.setAttribute('opacity', Math.sin(ph * Math.PI).toFixed(2)); });
      O.eyes.forEach(E => {
        const rx = 10, ry = 8 * eye.wide, cy = 118, lid = clamp(0, 1, Math.max(eye.lid + bl * (1 - eye.lid), E.i === 1 ? wink.v : 0));
        E.ce.setAttribute('ry', f1(ry)); E.white.setAttribute('ry', f1(ry));
        E.iris.setAttribute('transform', `translate(${f1(lx)} ${f1(ly)}) translate(${E.cx} 118) scale(${(0.92 + 0.08 * eye.wide).toFixed(3)}) translate(${-E.cx} -118)`);
        E.pupil.setAttribute('r', f1(3.2 * eye.pupil));
        const peak = cy - ry + 2 * ry * lid, e = cy + lid * ry * 0.8, ctrl = 2 * peak - e;
        E.lid.setAttribute('d', `M${E.cx - rx - 2} ${f1(cy - ry - 3)} L${E.cx - rx - 1} ${f1(e)} Q${E.cx} ${f1(ctrl)} ${E.cx + rx + 1} ${f1(e)} L${E.cx + rx + 2} ${f1(cy - ry - 3)} Z`);
        E.line.setAttribute('d', `M${E.cx - rx - 1.5} ${f1(e + 1)} Q${E.cx} ${f1(ctrl)} ${E.cx + rx + 1.5} ${f1(e + 1)}`);
        E.low.setAttribute('d', `M${E.cx - rx + 2} ${f1(cy + ry * 0.75)} Q${E.cx} ${f1(cy + ry * 1.2)} ${E.cx + rx - 2} ${f1(cy + ry * 0.75)}`);
      });
    }
    m.frame = frame;

    /* ---------- API ---------- */
    const tw = (target, vars) => { const g = G(); if (!g || reduce) { const { duration, ease, delay, overwrite, onComplete, ...rest } = vars; for (const k in rest) if (typeof rest[k] === 'number') target[k] = rest[k]; m.dirty = true; if (onComplete) onComplete(); return null; } return g.to(target, vars); };
    m.setExpr = (n, dur = 0.25) => {
      n = ALIAS[n] || n; if (!EX[n]) n = 'smile'; exName = n; const E = EX[n], g = G();
      if (g && !reduce) {
        g.to(q('.cv-mouth'), { attr: { d: E.m }, duration: dur, ease: 'power2.out', overwrite: true });
        g.to(q('.cv-teeth'), { attr: { d: E.t }, opacity: E.to, duration: dur, ease: 'power2.out', overwrite: true });
        g.to(q('.cv-bL'), { attr: { d: E.bL }, duration: dur, ease: 'back.out(2)', overwrite: true });
        g.to(q('.cv-bR'), { attr: { d: E.bR }, duration: dur, ease: 'back.out(2)', overwrite: true });
        g.to(q('.cv-sweat'), { opacity: n === 'scared' ? 1 : 0, duration: 0.2 });
      } else {
        q('.cv-mouth').forEach(p => p.setAttribute('d', E.m)); q('.cv-teeth').forEach(p => { p.setAttribute('d', E.t); p.setAttribute('opacity', E.to); });
        q('.cv-bL').forEach(p => p.setAttribute('d', E.bL)); q('.cv-bR').forEach(p => p.setAttribute('d', E.bR)); q('.cv-sweat').forEach(p => p.setAttribute('opacity', n === 'scared' ? 1 : 0));
      }
      tw(eye, { heart: 0, ...E.eye, duration: dur, ease: 'back.out(2)', overwrite: true });
      tw(st, { sc: n === 'scared' ? 1 : 0, an: n === 'angry' ? 1 : 0, su: n === 'surprised' ? 1 : 0, sa: n === 'sad' ? 1 : 0, zz: n === 'sleep' ? 1 : 0, duration: 0.45, ease: 'back.out(1.4)' });
      m.exName = n; m.dirty = true;
    };
    m.mood = m.setExpr;
    m.feel = n => { m.base = ALIAS[n] || n; m.setExpr(n, 0.3); m.sleeping = n === 'sleep'; };
    // acessório do mundo atual, trocado atrás de uma nuvem de fumaça
    m.outfitName = 'none';
    m.outfit = name => {
      if (name === m.outfitName) return; m.outfitName = name;
      const accs = q('.cv-acc'), poofs = q('.cv-poof'), g = G();
      const swap = () => accs.forEach(a => a.setAttribute('opacity', a.classList.contains('cv-acc-' + name) ? 1 : 0));
      if (!g || reduce) { swap(); m.dirty = true; return; }
      g.timeline().fromTo(poofs, { opacity: 1, scale: 0.2, transformOrigin: '50% 50%' }, { scale: 1.1, duration: 0.14, ease: 'back.out(2)' })
        .add(swap).to(poofs, { opacity: 0, scale: 1.4, duration: 0.3, ease: 'power2.out' });
    };
    // cena do guia (null = nenhuma). A pose entra e sai misturada
    m.scene = (name, dur = 0.4) => {
      if (name === scene) return;
      const g = G();
      if (!name) { if (g && !reduce) g.to(st, { scn: 0, duration: dur * 0.6, ease: 'power2.inOut', overwrite: 'auto', onComplete: () => { if (st.scn === 0) scene = null; } }); else { st.scn = 0; scene = null; } m.dirty = true; return; }
      scene = name; m.sph = 0;
      if (g && !reduce) g.fromTo(st, { scn: 0 }, { scn: 1, duration: dur, ease: 'back.out(1.3)', overwrite: 'auto' }); else st.scn = 1;
      if (SCENES[name].ex) m.setExpr(SCENES[name].ex, 0.2);
      m.dirty = true;
    };
    m.sceneName = () => scene;
    m.setSpeed = v => { tw(st, { speed: v, duration: v ? 0.45 : 0.5, ease: 'power2.inOut', overwrite: 'auto' }); if (!m.talking) m.setExpr(v > 1 ? 'grin' : v ? 'smile' : 'flat'); };
    // espelha o desenho (pra apontar/andar pra esquerda); fica no grupo interno pra não brigar com o "vush"
    m.flip = on => { if (on === flipped) return; flipped = on; root.setAttribute('transform', on ? 'translate(300 0) scale(-1 1)' : ''); m.dirty = true; };
    m.handEl = i => V[view].arms[i].hand;
    const pop = txt => (opt.onPop ? opt.onPop(slot, txt) : null);
    m.jump = () => {
      const g = G(); if (!g || reduce || m.jumping) return; m.jumping = true;
      const back = exName; m.setExpr('grin', 0.15);
      g.timeline({ onComplete: () => { m.jumping = false; m.setExpr(back === 'grin' ? 'smile' : back, 0.3); } })
        .to(st, { crouch: 70, sy: 0.92, armsUp: 0, duration: 0.24, ease: 'power2.out' })
        .to(st, { crouch: 0, sy: 1.08, armsUp: 1, duration: 0.12, ease: 'power2.in' })
        .to(st, { air: -125, tuck: 70, duration: 0.38, ease: 'power2.out' }, '<0.04')
        .to(st, { sy: 1, duration: 0.3 }, '<0.1')
        .to(st, { air: 0, tuck: 0, armsUp: 0.3, duration: 0.32, ease: 'power2.in' })
        .to(st, { crouch: 64, sy: 0.9, armsUp: 0, duration: 0.09, ease: 'power2.out' })
        .to(st, { crouch: 0, sy: 1, duration: 0.6, ease: 'elastic.out(1, .4)' })
        .add(() => pop(), 0.3);
    };
    m.wave = () => {
      const g = G(); if (!g || reduce || m.busy || scene || st.speed > 0.05 || view !== 'f') return; m.busy = true;
      g.timeline({ onComplete: () => { m.busy = false; } }).to(st, { wave: 1, duration: 0.4, ease: 'back.out(1.5)' }).to(st, { wave: 0, duration: 0.5, ease: 'power2.inOut' }, '+=1.2');
    };
    m.wink = () => { const g = G(); if (g && !reduce) g.timeline().to(wink, { v: 1, duration: 0.08 }).to(wink, { v: 0, duration: 0.14 }, '+=0.3'); };
    let talkTl = null;
    m.talk = on => {
      const g = G(); if (!g || reduce) return;
      if (talkTl) { talkTl.kill(); talkTl = null; }
      m.talking = on;
      if (on) talkTl = g.timeline({ repeat: -1, yoyo: true }).to(q('.cv-mouth'), { attr: { d: TALK_M }, duration: 0.1, ease: 'none' });
      else m.setExpr(exName, 0.15);
    };
    // escorrega, cai sentado, fica tonto e levanta
    m.fall = done => {
      const g = G(); if (!g || reduce || m.falling) return null; m.falling = true; st.fall = 0;
      const back = exName;
      return g.timeline({ onComplete: () => { m.falling = false; st.fall = 0; m.setExpr(back, 0.3); if (done) done(); } })
        .add(() => m.setExpr('scared', 0.1))
        .to(st, { fall: 1, duration: 0.16, ease: 'power2.out' }, 0.05)
        .to(st, { fall: 2, duration: 0.2, ease: 'sine.inOut' })
        .to(st, { fall: 3, duration: 0.17, ease: 'power2.in' })
        .add(() => pop('POF!'))
        .to(st, { sy: 0.86, duration: 0.06, ease: 'power2.out' }).to(st, { sy: 1, duration: 0.5, ease: 'elastic.out(1, .4)' })
        .add(() => m.setExpr('sad', 0.3), '-=0.35')
        .to(st, { stars: 1, duration: 0.2 }, '<')
        .to(st, { fall: 4, duration: 0.5, ease: 'sine.inOut' }, '<')
        .to(st, { stars: 0, duration: 0.25 }, '+=0.7')
        .add(() => m.setExpr('smile', 0.3))
        .to(st, { fall: 5, duration: 0.45, ease: 'power2.inOut' }, '<')
        .to(st, { fall: 6, duration: 0.5, ease: 'back.out(1.6)' }, '+=0.12');
    };

    inst.push(m);
    if (io) io.observe(slot);
    frame(0);
    startTicker();
    return m;
  }

  window.Caue = { mount, EYE: { x: 0.5, y: 118 / 700 } };
})();
