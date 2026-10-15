/* Part 1 · Mixtures (15 Oct 2026). Zoom: eight samples (the slide's gold, distilled and drinking water, salt, coffee,
   plus brass, muddy water and air); the lens shows their particles, and the words say only WHAT is there, never
   "pure" or "mixture": the pupil decides that in the sort. Dissolve: salt spoon by spoon until it is saturated, then
   sand, which does not dissolve. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;
  const COL = { O: '#E0533F', H: '#F4F6F8', Na: '#8E6BD8', Cl: '#3DBA6A', Au: '#E8B923', Cu: '#D9814A', Zn: '#AEB8C2', min: '#F29B38', cof: '#7A4A26', N: '#5B8DEF', Ar: '#B06AD9', sand: '#C9A66B' };
  const SAMPLES = [
    { id: 'gold', name: 'Gold', x: 52, say: 'Only one kind of atom: gold atoms, packed in rows.', key: [['Au', 'gold atom']] },
    { id: 'dist', name: 'Distilled', sub: 'water', x: 149, say: 'Only water particles. Each one is two hydrogen atoms joined to one oxygen atom. In a liquid they touch and slide past each other.', key: [['O', 'oxygen'], ['H', 'hydrogen'], ['hb', 'hydrogen bond']] },
    { id: 'salt', name: 'Salt', x: 246, say: 'Sodium ions and chloride ions, held together in a regular pattern (a lattice). Only this one kind of substance.', key: [['Na', 'sodium ion'], ['Cl', 'chloride ion']] },
    { id: 'mineral', name: 'Mineral', sub: 'water', x: 343, say: 'Water particles, with a few mineral particles spread between them. Water particles crowd round each mineral particle, but are not joined to it.', key: [['O', 'water'], ['min', 'mineral'], ['hb', 'hydrogen bond']] },
    { id: 'coffee', name: 'Black', sub: 'coffee', x: 440, say: 'Water particles, with coffee particles spread evenly between them.', key: [['O', 'water'], ['cof', 'coffee'], ['hb', 'hydrogen bond']] },
    { id: 'brass', name: 'Brass', x: 537, say: 'Copper atoms and zinc atoms, mixed in rows but not joined to each other.', key: [['Cu', 'copper'], ['Zn', 'zinc']] },
    { id: 'mud', name: 'Muddy', sub: 'water', x: 634, say: 'Water particles above a grain of sand. The grain is millions of times bigger than a water particle.', key: [['O', 'water'], ['sand', 'sand grain'], ['hb', 'hydrogen bond']] },
    { id: 'air', name: 'Air', x: 731, say: 'A gas: mostly nitrogen and oxygen particles (about 4 to 1), far apart and moving fast. They do not hold on to each other.', key: [['N', 'nitrogen'], ['O', 'oxygen']] }
  ];

  /* ---------------- the samples on the bench (97 apart, so their buttons can be big: Daniel, 15 Oct 2026) ---------------- */
  function drawSample(g, s) {
    const x = s.x, by = 446;
    if (s.id === 'gold') { S('path', { d: `M${x - 32},${by} L${x - 22},${by - 22} L${x + 22},${by - 22} L${x + 32},${by} Z`, fill: '#E8B923', stroke: '#9A7412', 'stroke-width': 1.6 }, g); S('path', { d: `M${x - 22},${by - 22} L${x - 14},${by - 18} L${x + 14},${by - 18} L${x + 22},${by - 22}`, fill: '#F6D869', stroke: 'none' }, g); }
    if (s.id === 'dist') { const b = K.conical(g, x, by, 58, 74, { neck: 22, color: C.water, level: .55 }); S('rect', { x: x - 16, y: by - 34, width: 32, height: 12, rx: 2, fill: '#FFFFFF', stroke: 'var(--glass)', 'stroke-width': 1 }, g); S('text', { x, y: by - 25, 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 800, fill: '#333' }, g, 'distilled'); return b; }
    if (s.id === 'salt') { S('path', { class: 'glass', d: `M${x - 34},${by - 16} Q${x},${by + 6} ${x + 34},${by - 16}` }, g); S('path', { d: `M${x - 22},${by - 12} Q${x},${by - 34} ${x + 22},${by - 12} Z`, fill: C.salt, stroke: '#A8A498', 'stroke-width': 1 }, g); }
    if (s.id === 'mineral') { S('path', { d: `M${x - 18},${by} L${x - 18},${by - 58} Q${x - 18},${by - 70} ${x - 8},${by - 76} L${x - 8},${by - 84} L${x + 8},${by - 84} L${x + 8},${by - 76} Q${x + 18},${by - 70} ${x + 18},${by - 58} L${x + 18},${by} Z`, fill: 'rgba(126,184,234,.55)', stroke: 'var(--glass)', 'stroke-width': 1.8 }, g); S('rect', { x: x - 9, y: by - 92, width: 18, height: 9, rx: 2, fill: '#2E7FD9' }, g); S('rect', { x: x - 18, y: by - 44, width: 36, height: 16, fill: '#FFFFFF', opacity: .9 }, g); S('text', { x, y: by - 33, 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 800, fill: '#2E7FD9' }, g, 'mineral'); }
    if (s.id === 'coffee') { S('path', { d: `M${x - 24},${by - 50} L${x - 20},${by} L${x + 20},${by} L${x + 24},${by - 50} Z`, fill: '#F4F1E8', stroke: '#7A7468', 'stroke-width': 1.6 }, g); S('path', { d: `M${x + 23},${by - 40} q16,4 0,22`, fill: 'none', stroke: '#7A7468', 'stroke-width': 4 }, g); S('ellipse', { cx: x, cy: by - 46, rx: 21, ry: 4, fill: '#3B2414' }, g); }
    if (s.id === 'brass') { S('circle', { cx: x - 16, cy: by - 30, r: 15, fill: 'none', stroke: '#C9A43A', 'stroke-width': 7 }, g); S('path', { d: `M${x - 2},${by - 30} L${x + 34},${by - 30} M${x + 22},${by - 30} L${x + 22},${by - 20} M${x + 30},${by - 30} L${x + 30},${by - 22}`, stroke: '#C9A43A', 'stroke-width': 7, 'stroke-linecap': 'square', fill: 'none' }, g); }
    if (s.id === 'mud') { const b = K.beaker(g, x, by, 58, 70, { color: '#7A5430', level: .7, opacity: .82 }); S('rect', { x: x - 26, y: by - 12, width: 52, height: 10, rx: 2, fill: C.sand }, b.g); }
    if (s.id === 'air') { S('ellipse', { cx: x, cy: by - 62, rx: 24, ry: 28, fill: 'rgba(120,180,240,.35)', stroke: '#5B8DEF', 'stroke-width': 1.8 }, g); S('path', { d: `M${x - 4},${by - 33} L${x + 4},${by - 33} L${x},${by - 38} Z`, fill: '#5B8DEF' }, g); S('path', { d: `M${x},${by - 33} q6,14 -2,32`, fill: 'none', stroke: 'var(--ink3)', 'stroke-width': 1.3 }, g); }
  }

  /* ---------------- particles in the lens ---------------- */
  function atom(p, x, y, r, c) { return S('circle', { cx: x, cy: y, r, fill: COL[c] || c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': .9 }, p); }
  function water(p, x, y, a) {
    const g = S('g', { transform: `translate(${x} ${y}) rotate(${a})` }, p);
    atom(g, -7, 6, 5, 'H'); atom(g, 7, 6, 5, 'H'); atom(g, 0, 0, 8, 'O'); return g;
  }
  function pair(p, x, y, a, c) { const g = S('g', { transform: `translate(${x} ${y}) rotate(${a})` }, p); atom(g, -8, 0, 9, c); atom(g, 8, 0, 9, c); return g; }
  function fillLens(k, lz, id) {
    const p = lz.inner, cx = lz.x, cy = lz.y, R = lz.r;
    p.innerHTML = '';
    S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: id === 'air' ? '#F3F8FF' : '#EAF3FB' }, p);
    const movers = [];
    const rnd = (() => { let s = 7; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
    /* a gas: each particle drawn at (0, 0) and moved by its transform, far apart, fast, in straight lines, never held */
    const scatter = (n, make) => { for (let i = 0; i < n; i++) {
      let x, y, t = 0; do { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 22); x = cx + Math.cos(a) * d; y = cy + Math.sin(a) * d; } while (movers.some(m => Math.hypot(m.x - x, m.y - y) < 48) && ++t < 60);
      const sp = 50 + rnd() * 30, h = rnd() * Math.PI * 2; movers.push({ g: make(), x, y, a: rnd() * 360, vx: Math.cos(h) * sp, vy: Math.sin(h) * sp }); } };
    if (id === 'gold' || id === 'brass' || id === 'salt') {
      const step = id === 'salt' ? 19 : 21;
      for (let row = -7; row <= 7; row++) for (let col = -7; col <= 7; col++) {
        const x = cx + col * step + (id === 'salt' ? 0 : (row % 2) * step / 2), y = cy + row * (id === 'salt' ? step : step * .87);
        if (Math.hypot(x - cx, y - cy) > R + 10) continue;
        const kind = id === 'gold' ? 'Au' : id === 'brass' ? (rnd() < .35 ? 'Zn' : 'Cu') : ((row + col) % 2 ? 'Na' : 'Cl');
        atom(p, x, y, id === 'salt' ? (kind === 'Na' ? 6.5 : 9.5) : 10, kind);
      }
    } else if (id === 'air') {
      scatter(8, () => pair(p, 0, 0, 0, 'N')); scatter(2, () => pair(p, 0, 0, 0, 'O'));      /* air is 78 % nitrogen, 21 % oxygen, 1 % argon */
    } else if (id === 'mud') {
      /* the top of one sand grain, a gentle curve; the water particles rest on it */
      const gy = cy + 30, y0 = gy + 10, y1 = gy - 14, y2 = gy + 4, top = x => { const t = (x - cx + R) / (2 * R); return (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2; };
      K.liquidLens(k, lz, { seed: 5, solids: [{ floor: top }] });
      S('path', { d: `M${cx - R},${y0} Q${cx},${y1} ${cx + R},${y2} L${cx + R},${cy + R} L${cx - R},${cy + R} Z`, fill: COL.sand, stroke: '#8A6A3A', 'stroke-width': 1.5 }, p);
      for (let i = 0; i < 26; i++) S('circle', { cx: cx - R + 10 + rnd() * 2 * R, cy: gy + 22 + rnd() * 60, r: 1.4, fill: '#8A6A3A', opacity: .6 }, p);
      S('text', { x: cx, y: gy + 50, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#5B4520' }, p, 'part of one sand grain');
    } else {
      /* a liquid: the particles touch and slide past each other, held by hydrogen bonds (kit liquidLens) */
      K.liquidLens(k, lz, { seed: id === 'dist' ? 7 : id === 'mineral' ? 9 : 13,
        extra: id === 'mineral' ? [{ kind: 'min', n: 2, r: 8, fill: COL.min, hug: '+' }] : id === 'coffee' ? [{ kind: 'cof', n: 4, r: 9, fill: COL.cof }] : [] });
    }
    if (movers.length) k.loop(dt => {
      movers.forEach(m => {
        m.x += m.vx * dt; m.y += m.vy * dt; m.a += 40 * dt;
        /* off the wall like a ball: the speed stays, the direction mirrors */
        const dx = m.x - cx, dy = m.y - cy, d = Math.hypot(dx, dy);
        if (d > R - 18) { const ux = dx / d, uy = dy / d, dot = m.vx * ux + m.vy * uy; if (dot > 0) { m.vx -= 2 * dot * ux; m.vy -= 2 * dot * uy; } }
        m.g.setAttribute('transform', `translate(${m.x} ${m.y}) rotate(${m.a})`);
      });
      return lz.g.isConnected;
    });
    movers.forEach(m => m.g.setAttribute('transform', `translate(${m.x} ${m.y}) rotate(${m.a})`));
  }

  async function zoomRun(k) {
    const g = k.svg;
    SAMPLES.forEach(s => drawSample(S('g', null, g), s));
    const lz = K.lens(g, 230, 200, 128);
    const cap = S('g', null, g);
    /* before the first press: the lens says what it is for (an empty first frame reads as broken) */
    S('rect', { x: 102, y: 72, width: 256, height: 256, fill: '#EAF3FB' }, lz.inner);
    S('circle', { cx: 218, cy: 186, r: 34, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 7 }, lz.inner);
    S('line', { x1: 243, y1: 211, x2: 272, y2: 240, stroke: 'var(--accent)', 'stroke-width': 10, 'stroke-linecap': 'round' }, lz.inner);
    S('text', { x: 230, y: 284, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#1F4E79' }, lz.inner, 'Press a sample below');
    S('text', { x: 400, y: 150, 'font-size': 26, 'font-weight': 900, fill: 'var(--ink)' }, cap, 'What is it made of?');
    ['Everything is made of particles.', 'Press each sample on the bench', 'to see its particles in the lens.'].forEach((t, i) => S('text', { x: 400, y: 184 + i * 24, 'font-size': 17, 'font-weight': 700, fill: 'var(--ink2)' }, cap, t));
    const seen = new Set();
    k.step('Zoom in', 0, 'Press a sample to see its particles. Look at all eight, then sort them in the first check.');
    for (;;) {
      const id = await k.choose(SAMPLES.map(s => ({ id: s.id, x: s.x, y: 478, label: s.name, sub: s.sub, quiet: true, done: seen.has(s.id) })));
      const s = SAMPLES.find(x => x.id === id); seen.add(id);
      fillLens(k, lz, id);
      cap.innerHTML = '';
      S('text', { x: 400, y: 112, 'font-size': 26, 'font-weight': 900, fill: 'var(--ink)' }, cap, (s.name + ' ' + (s.sub || '')).trim());
      const words = wrap(s.say, 34); words.forEach((ln, i) => S('text', { x: 400, y: 146 + i * 22, 'font-size': 17, 'font-weight': 700, fill: 'var(--ink2)' }, cap, ln));
      s.key.forEach(([c, t], i) => { const y = 160 + words.length * 22 + i * 26; if (c === 'O' && (id === 'dist' || id === 'mineral' || id === 'coffee' || id === 'mud')) { water(cap, 412, y - 5, 0); } else if (c === 'sand') { S('rect', { x: 402, y: y - 14, width: 20, height: 16, fill: COL.sand, stroke: '#8A6A3A' }, cap); } else if (c === 'hb') { S('line', { x1: 400, y1: y - 5, x2: 424, y2: y - 5, stroke: '#2F4A66', 'stroke-width': 1.8, 'stroke-dasharray': '3 2.5', 'stroke-linecap': 'round' }, cap); } else atom(cap, 412, y - 5, 8, c); S('text', { x: 432, y, 'font-size': 15, 'font-weight': 800, fill: 'var(--ink)' }, cap, t); });
      S('text', { x: 400, y: 172 + words.length * 22 + s.key.length * 26, class: 'zoom-sub' }, cap, 'particles, not to scale');
      const pointer = S('path', { d: `M${s.x},${400} L${230 + (s.x - 230) * .25},${330}`, stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-dasharray': '5 5', fill: 'none' }, cap);
      k.say(`<b>${(s.name + ' ' + (s.sub || '')).trim()}</b>: ${s.say} <span style="color:var(--ink3)">Seen ${seen.size} of 8.</span>`);
      if (seen.size === SAMPLES.length) { k.finish('You have seen all eight. Now sort them in the first check: one kind of particle, or more than one?'); return; }
    }
  }
  function wrap(t, n) { const out = []; let ln = ''; t.split(' ').forEach(w => { if ((ln + ' ' + w).trim().length > n) { out.push(ln.trim()); ln = w; } else ln += ' ' + w; }); if (ln.trim()) out.push(ln.trim()); return out; }

  /* ---------------- Dissolve: salt until saturated, then sand ---------------- */
  async function dissolveRun(k) {
    const g = k.svg;
    const bk = K.beaker(g, 250, 446, 150, 170, { color: C.water, level: .62, marks: true });
    const grains = S('g', null, bk.g), settled = S('g', null, bk.g);
    k.label('100 cm³ of water', 250, 474, null, null, { anchor: 'middle', layer: g, fade: false });
    /* the salt jar and the sand jar */
    const jar = (x, col, t) => { S('rect', { x: x - 26, y: 380, width: 52, height: 66, rx: 8, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2 }, g); S('rect', { x: x - 22, y: 404, width: 44, height: 40, rx: 5, fill: col }, g); S('rect', { x: x - 28, y: 372, width: 56, height: 10, rx: 3, fill: 'var(--metal)' }, g); S('rect', { x: x - 20, y: 386, width: 40, height: 15, rx: 3, fill: '#FFFFFF', stroke: '#9AA3AC' }, g); S('text', { x, y: 398, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#333' }, g, t); };
    jar(440, C.salt, 'salt'); jar(520, C.sand, 'sand');
    const lz = K.lens(g, 650, 215, 140, 'Inside the beaker', 'particles, not to scale');
    const L = lz.inner, cx = lz.x, cy = lz.y, R = lz.r;
    S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: '#EAF3FB' }, L);
    /* liquid water (kit liquidLens). A spoon of salt puts a tiny piece of a grain at the bottom of the lens: one sodium ion
       and one chloride ion. Stirred, water particles close round each ion and carry it away (Daniel, 15 Oct 2026: the
       solvent "hugs" the solute): oxygen towards sodium, a hydrogen towards chloride. After two spoons most water
       particles are holding an ion, which is why the third spoon stays: saturated (real saturated salt water has about one
       sodium and one chloride for every nine water particles; 100 cm³ of water dissolves about 36 g, so two spoons of
       about 15 g dissolve and the third does not). Sizes as the real ions: sodium smaller than the oxygen atom of a water
       particle, chloride bigger. */
    const NA = { kind: 'Na', r: 8.5, fill: COL.Na, hug: '+', sign: '+' }, CL = { kind: 'Cl', r: 15, fill: COL.Cl, hug: '-', sign: '−' };
    let liq = K.liquidLens(k, lz, { seed: 11 });
    const over = S('g', null, L);                     /* the undissolved salt and the sand grain, over the liquid */
    const ion = (p, x, y, e) => { atom(p, x, y, e.r, e.kind); S('text', { x, y: y + e.r * .42, 'text-anchor': 'middle', 'font-size': e.r * 1.25, 'font-weight': 900, fill: '#FFFFFF' }, p, e.sign); };
    const BOT = cy + R - 34, PIECE = [[cx - 12, BOT, NA], [cx + 12, BOT, CL]];
    const piece = S('g', { opacity: 0 }, over);
    PIECE.forEach(([x, y, e]) => ion(piece, x, y, e));
    const CRY = [cx - 54, cy + R - 72, cx + 54, cy + R];
    const crystal = S('g', { opacity: 0 }, over);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) ion(crystal, cx - 36 + c * 24, cy + R - 30 - r * 24, (r + c) % 2 ? NA : CL);
    const refill = o => { liq.destroy(); liq = K.liquidLens(k, lz, Object.assign({ seed: 11 }, o)); L.appendChild(over); };
    const legend = S('g', null, g);
    S('text', { x: 60, y: 76, class: 'note' }, legend, 'In the lens:');
    water(legend, 72, 100, 0); S('text', { x: 88, y: 105, class: 'note' }, legend, 'water');
    ion(legend, 152, 100, NA); S('text', { x: 166, y: 105, class: 'note' }, legend, 'sodium ion');
    ion(legend, 262, 100, CL); S('text', { x: 282, y: 105, class: 'note' }, legend, 'chloride ion');
    S('line', { x1: 62, y1: 126, x2: 84, y2: 126, stroke: '#2F4A66', 'stroke-width': 1.8, 'stroke-dasharray': '3 2.5', 'stroke-linecap': 'round' }, legend); S('text', { x: 90, y: 131, class: 'note' }, legend, 'hydrogen bond');
    let spoons = 0;
    let spoonX = 440;
    async function spoonIn(col, n) {
      const sp = S('g', null, g);
      S('path', { d: 'M0,0 L70,-8', stroke: 'var(--metal)', 'stroke-width': 4, 'stroke-linecap': 'round' }, sp);
      S('ellipse', { cx: -6, cy: 1, rx: 12, ry: 6, fill: 'var(--metal)' }, sp);
      S('ellipse', { cx: -6, cy: -2, rx: 9, ry: 4, fill: col }, sp);
      await k.tween(700, t => sp.setAttribute('transform', `translate(${B.mix(spoonX, 260, t)} ${B.mix(360, 250, t)}) rotate(${-30 * t})`));
      const fall = [];
      for (let i = 0; i < n; i++) fall.push(S('rect', { x: 250 - 16 + Math.random() * 30, y: 250, width: 4, height: 4, fill: col, stroke: 'rgba(0,0,0,.25)', 'stroke-width': .5 }, grains));
      sp.remove();
      await k.tween(900, t => fall.forEach((f, i) => f.setAttribute('y', 250 + t * (180 - (i % 5) * 2))));
      return fall;
    }
    for (;;) {
      k.step('Dissolve', 0, spoons < 3 ? `Add a spoon of salt (about 15 g) to the water. Spoons so far: <b>${spoons}</b>.` : '');
      await k.choose([{ id: 'salt', x: 440, y: 482, label: 'Add a spoon of salt' }]);
      const fall = await spoonIn(C.salt, 14); spoons++;
      /* in the lens: a tiny piece of a salt grain on the bottom (the whole lattice at the fourth spoon) */
      if (spoons < 3) { piece.setAttribute('opacity', 1); liq.setSolids([{ rect: [cx - 24, BOT - 17, cx + 30, cy + R] }]); }
      else { crystal.setAttribute('opacity', 1); liq.setSolids([{ rect: CRY }]); }
      k.say('The salt is at the bottom. Stir, and watch the particles in the lens.');
      await k.choose([{ id: 'stir', x: 250, y: 236, label: 'Stir' }]);
      const rod = K.glassRod(g, 250, 230, 250, 432);
      const keep = spoons >= 3 ? 5 : 0;
      await k.tween(1600, t => { rod.setAttribute('transform', `rotate(${Math.sin(t * 12) * 10} 250 230)`); fall.forEach((f, i) => { if (i >= keep) f.setAttribute('opacity', 1 - t); }); });
      rod.remove();
      fall.forEach((f, i) => { if (i >= keep) f.remove(); else { f.setAttribute('y', 436 - (i % 2) * 3); settled.appendChild(f); } });
      if (spoons < 3) {
        piece.setAttribute('opacity', 0); liq.setSolids([]);
        PIECE.forEach(([x, y, e]) => liq.add(e, [x, y]));
        k.say(`The salt has gone: it <b>dissolved</b>. In the lens, water particles closed round each ion and carried it away: the <b>oxygen</b> side faces sodium, a <b>hydrogen</b> side faces chloride. Spoons dissolved: <b>${spoons}</b>.`);
        await k.wait(400); continue;
      }
      k.label('undissolved salt', 250, 418, null, null, { anchor: 'middle' });
      break;
    }
    k.step('Dissolve', 0, 'After three spoons, some salt stays at the bottom however long you stir. In the lens, most water particles are already holding an ion, and too few are free to take more. No more salt can dissolve: the solution is <b>saturated</b>. Now try sand.');
    await k.choose([{ id: 'sand', x: 520, y: 482, label: 'Add a spoon of sand', sub: 'to fresh water' }]);
    k.clearLabels(); grains.innerHTML = ''; settled.innerHTML = ''; refill({}); crystal.setAttribute('opacity', 0);
    spoonX = 520;
    const fall = await spoonIn(C.sand, 18);
    await k.choose([{ id: 'stir', x: 250, y: 236, label: 'Stir' }]);
    const rod = K.glassRod(g, 250, 230, 250, 432);
    await k.tween(1600, t => { rod.setAttribute('transform', `rotate(${Math.sin(t * 12) * 10} 250 230)`); fall.forEach((f, i) => f.setAttribute('y', 300 + Math.sin(t * 9 + i) * 60 + t * 120 * (i % 3) / 3)); });
    rod.remove();
    k.say('The sand swirls around, then sinks again…');
    await k.tween(1200, t => fall.forEach((f, i) => f.setAttribute('y', B.mix(+f.getAttribute('y'), 434 - (i % 3) * 4, t))));
    /* the top of a sand grain, a gentle curve: the water particles rest on it */
    const y0 = cy + 40, y1 = cy + 16, y2 = cy + 26, top = x => { const t = (x - cx + R) / (2 * R); return (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2; };
    refill({ solids: [{ floor: top }] });
    S('path', { d: `M${cx - R},${y0} Q${cx},${y1} ${cx + R},${y2} L${cx + R},${cy + R} L${cx - R},${cy + R} Z`, fill: COL.sand, stroke: '#8A6A3A', 'stroke-width': 1.5 }, over);
    k.label('sand at the bottom', 250, 418, null, null, { anchor: 'middle' });
    k.finish('The sand did not dissolve: sand is <b>insoluble</b> in water. Salt is <b>soluble</b>. (At 20 °C, 100 cm³ of water dissolves about 36 g of salt.)');
  }

  /* ---------------- Extension: milk, a colloid (Daniel, 15 Oct 2026: "for the colloid … show … an animation") ----------------
     Three beakers side by side: a solution (salt water), a colloid (milk in water) and a mechanical mixture (muddy water).
     The lens shows milk's fat droplets and protein clumps moving through water and never settling; left to stand, only
     the mud settles; a torch beam shows only in the milk (the droplets scatter the light: the Tyndall effect). */
  async function colloidRun(k) {
    const g = k.svg, defs = S('defs', null, g), fid = K.id('glow');
    const f = S('filter', { id: fid, x: '-20%', y: '-200%', width: '140%', height: '500%' }, defs); S('feGaussianBlur', { stdDeviation: 3 }, f);
    const salt = K.beaker(g, 160, 446, 104, 120, { color: '#CFE6F6', level: .72, opacity: .6 });
    const milk = K.beaker(g, 310, 446, 104, 120, { color: '#FBF8EF', level: .72, opacity: .95 });
    const mud = K.beaker(g, 460, 446, 104, 120, { color: '#7A5430', level: .72, opacity: .82 });
    const sand = S('rect', { x: 410, y: 444, width: 100, height: 0, fill: C.sand }, mud.g);
    k.label('salt water', 160, 312, null, null, { anchor: 'middle', layer: g, fade: false });
    k.label('milk in water', 310, 312, null, null, { anchor: 'middle', layer: g, fade: false });
    k.label('muddy water', 460, 312, null, null, { anchor: 'middle', layer: g, fade: false });
    S('text', { x: 160, y: 474, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#DDE6EE' }, g, 'a solution');
    S('text', { x: 310, y: 474, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#DDE6EE' }, g, 'a colloid');
    S('text', { x: 460, y: 474, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#DDE6EE' }, g, 'a mechanical mixture');
    k.step(1, 3, 'Milk looks white all through, like a solution. Look inside it. (<b>Fat</b> is the oily part of milk, as in butter. <b>Protein</b> is a substance the body uses to grow, as in egg white.)');
    await k.choose([{ id: 'z', x: 310, y: 262, label: 'Zoom into the milk' }]);
    const lz = K.lens(g, 650, 186, 112, 'Milk, much bigger', 'fat droplets and protein clumps in water · too small to see with your eyes');
    const L = lz.inner, cx = lz.x, cy = lz.y, R = lz.r;
    /* water fills the lens as a pale blue: at this size one water particle is far too small to draw (dots spread apart
       would look like a gas: Daniel, 15 Oct 2026) */
    S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: '#CFE4F6' }, L);
    const rnd = (() => { let q = 5; return () => (q = (q * 9301 + 49297) % 233280) / 233280; })();
    const bits = [];
    const put = (m) => m.g.setAttribute('transform', `translate(${m.x} ${m.y})`);
    const add = (make, n) => { for (let i = 0; i < n; i++) { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * (R - 22), m = { g: make(), x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: (rnd() - .5) * 30, vy: (rnd() - .5) * 30 }; put(m); bits.push(m); } };
    add(() => { const q = S('g', null, L); const r = 9 + rnd() * 8; S('circle', { r, fill: '#F6D77A', stroke: '#C9A43A', 'stroke-width': 1.5 }, q); S('circle', { cx: -r * .35, cy: -r * .35, r: r * .3, fill: '#FFF3C4' }, q); return q; }, 7);
    add(() => { const q = S('g', null, L); for (let j = 0; j < 6; j++) S('circle', { cx: Math.cos(j) * 4.5, cy: Math.sin(j * 1.7) * 4.5, r: 3, fill: '#F4F4F2', stroke: '#9AA3AC', 'stroke-width': .8 }, q); return q; }, 6);
    const key = S('g', null, g);
    S('circle', { cx: 548, cy: 392, r: 8, fill: '#F6D77A', stroke: '#C9A43A', 'stroke-width': 1.5 }, key); S('text', { x: 562, y: 397, class: 'note' }, key, 'fat droplet');
    S('circle', { cx: 652, cy: 389, r: 3, fill: '#F4F4F2', stroke: '#9AA3AC' }, key); S('circle', { cx: 658, cy: 394, r: 3, fill: '#F4F4F2', stroke: '#9AA3AC' }, key); S('text', { x: 668, y: 397, class: 'note' }, key, 'protein clump');
    S('rect', { x: 543, y: 407, width: 14, height: 12, rx: 2, fill: '#CFE4F6', stroke: '#7FB2E5' }, key); S('text', { x: 562, y: 419, class: 'note' }, key, 'water (particles too small to show)');
    k.loop(dt => { bits.forEach(m => { m.vx += (Math.random() - .5) * 120 * dt; m.vy += (Math.random() - .5) * 120 * dt; m.vx *= .96; m.vy *= .96; m.x += m.vx * dt; m.y += m.vy * dt; if (Math.hypot(m.x - cx, m.y - cy) > R - 18) { m.x += (cx - m.x) * .05; m.y += (cy - m.y) * .05; } put(m); }); return lz.g.isConnected; });
    k.step(2, 3, 'The droplets and clumps jiggle about all the time; they are too small to sink. Now leave all three beakers to stand.');
    await k.choose([{ id: 'w', x: 310, y: 262, label: 'Leave them for an hour' }]);
    k.lapse('an hour in a few seconds');
    await k.tween(2600, t => { mud.liq.color(t < .4 ? '#7A5430' : t < .75 ? '#A99A82' : '#C9DCEB').opacity(.82 - .2 * t); sand.setAttribute('y', 444 - 20 * t); sand.setAttribute('height', 20 * t); });
    k.lapse(null);
    k.label('the sand settled', 600, 434, 488, 434, { anchor: 'start' });
    k.step(3, 3, 'Only the mud settled. The milk is still white all through, and the salt water is still clear. Now shine a torch through all three.');
    await k.choose([{ id: 't', x: 112, y: 372, label: 'Shine the torch', side: 't' }]);
    S('rect', { x: 34, y: 386, width: 46, height: 18, rx: 4, fill: '#3C434B' }, g); S('path', { d: 'M80,382 L92,378 L92,412 L80,408 Z', fill: '#5B6573' }, g);
    const BY = 395;
    const beam = S('g', { opacity: 0 }, g);
    S('rect', { x: 92, y: BY - 6, width: 420, height: 12, fill: '#FFF6B0', opacity: .18 }, beam);            /* faint, in the air */
    S('rect', { x: 260, y: BY - 9, width: 100, height: 18, fill: '#FFF2A0', opacity: .95, filter: `url(#${fid})` }, beam);   /* scattered by the milk */
    k.label('the beam shows in the milk', 310, 350, 310, 380, { anchor: 'middle' });
    await k.tween(900, t => beam.setAttribute('opacity', t));
    k.label('no beam', 160, 368, null, null, { anchor: 'middle' });
    k.finish('Milk is a <b>colloid</b>: tiny droplets of fat and clumps of protein, spread through water. They are too small to see or to settle, but big enough to scatter light, so the beam shows (the Tyndall effect). In a solution the particles are far too small to scatter it; in a mechanical mixture the bits settle.');
  }

  B.define(1, [
    { id: 'zoom', name: 'Zoom in', title: 'Zoom in on eight samples', task: { id: 'p1-sim-zoom', title: 'Bench: zoomed in on all eight samples' }, run: zoomRun,
      alt: 'Eight samples on a lab bench: gold, distilled water, salt, mineral water, black coffee, brass, muddy water and air in a balloon, with a lens that shows the particles of the one chosen.' },
    { id: 'dissolve', name: 'Dissolve', title: 'Dissolve salt, then sand', task: { id: 'p1-sim-dissolve', title: 'Bench: dissolved salt until saturated; tried sand' }, run: dissolveRun,
      alt: 'A beaker of water, a jar of salt and a jar of sand, with a lens that shows the particles in the beaker.' },
    { id: 'colloid', name: 'Milk (colloid)', ext: true, title: 'Milk: a colloid', kicker: 'Extension · the bench', task: { id: 'p1-sim-colloid', title: 'Bench: milk, a colloid (extension)' }, run: colloidRun,
      alt: 'Three beakers: salt water, milk in water and muddy water, a lens showing fat droplets and protein clumps in milk, and a torch whose beam shows only in the milk.' }
  ]);
})();
