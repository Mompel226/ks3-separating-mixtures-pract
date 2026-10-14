/* Part 1 · Mixtures (15 Oct 2026). Zoom: eight samples (the slide's gold, distilled and drinking water, salt, coffee,
   plus brass, muddy water and air); the lens shows their particles, and the words say only WHAT is there, never
   "pure" or "mixture": the pupil decides that in the sort. Dissolve: salt spoon by spoon until it is saturated, then
   sand, which does not dissolve. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;
  const COL = { O: '#E0533F', H: '#F4F6F8', Na: '#8E6BD8', Cl: '#3DBA6A', Au: '#E8B923', Cu: '#D9814A', Zn: '#AEB8C2', min: '#F29B38', cof: '#7A4A26', N: '#5B8DEF', Ar: '#B06AD9', sand: '#C9A66B' };
  const SAMPLES = [
    { id: 'gold', name: 'Gold', x: 70, say: 'Only one kind of atom: gold atoms, packed in rows.', key: [['Au', 'gold atom']] },
    { id: 'dist', name: 'Distilled', sub: 'water', x: 163, say: 'Only water particles. Each one is two hydrogen atoms joined to one oxygen atom.', key: [['O', 'oxygen'], ['H', 'hydrogen']] },
    { id: 'salt', name: 'Salt', x: 256, say: 'Sodium and chlorine, joined together in a regular pattern. Only this one kind of substance.', key: [['Na', 'sodium'], ['Cl', 'chlorine']] },
    { id: 'mineral', name: 'Mineral', sub: 'water', x: 349, say: 'Water particles, with mineral particles spread between them. They are not joined to the water.', key: [['O', 'water'], ['min', 'mineral']] },
    { id: 'coffee', name: 'Black', sub: 'coffee', x: 442, say: 'Water particles, with coffee particles spread evenly between them.', key: [['O', 'water'], ['cof', 'coffee']] },
    { id: 'brass', name: 'Brass', x: 535, say: 'Copper atoms and zinc atoms, mixed in rows but not joined to each other.', key: [['Cu', 'copper'], ['Zn', 'zinc']] },
    { id: 'mud', name: 'Muddy', sub: 'water', x: 628, say: 'Water particles above a grain of sand. The grain is millions of times bigger than a water particle.', key: [['O', 'water'], ['sand', 'sand grain']] },
    { id: 'air', name: 'Air', x: 721, say: 'Nitrogen, oxygen and argon particles, far apart and moving fast. They are not joined to each other.', key: [['N', 'nitrogen'], ['O', 'oxygen'], ['Ar', 'argon']] }
  ];

  /* ---------------- the samples on the bench ---------------- */
  function drawSample(g, s) {
    const x = s.x, by = 446;
    if (s.id === 'gold') { S('path', { d: `M${x - 32},${by} L${x - 22},${by - 22} L${x + 22},${by - 22} L${x + 32},${by} Z`, fill: '#E8B923', stroke: '#9A7412', 'stroke-width': 1.6 }, g); S('path', { d: `M${x - 22},${by - 22} L${x - 14},${by - 18} L${x + 14},${by - 18} L${x + 22},${by - 22}`, fill: '#F6D869', stroke: 'none' }, g); }
    if (s.id === 'dist') { const b = K.conical(g, x, by, 58, 74, { neck: 22, color: C.water, level: .55 }); S('rect', { x: x - 16, y: by - 34, width: 32, height: 12, rx: 2, fill: '#FFFFFF', stroke: 'var(--glass)', 'stroke-width': 1 }, g); S('text', { x, y: by - 25, 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 800, fill: '#333' }, g, 'distilled'); return b; }
    if (s.id === 'salt') { S('path', { class: 'glass', d: `M${x - 34},${by - 16} Q${x},${by + 6} ${x + 34},${by - 16}` }, g); S('path', { d: `M${x - 22},${by - 12} Q${x},${by - 34} ${x + 22},${by - 12} Z`, fill: C.salt, stroke: '#A8A498', 'stroke-width': 1 }, g); }
    if (s.id === 'mineral') { S('path', { d: `M${x - 18},${by} L${x - 18},${by - 58} Q${x - 18},${by - 70} ${x - 8},${by - 76} L${x - 8},${by - 84} L${x + 8},${by - 84} L${x + 8},${by - 76} Q${x + 18},${by - 70} ${x + 18},${by - 58} L${x + 18},${by} Z`, fill: 'rgba(126,184,234,.55)', stroke: 'var(--glass)', 'stroke-width': 1.8 }, g); S('rect', { x: x - 9, y: by - 92, width: 18, height: 9, rx: 2, fill: '#2E7FD9' }, g); S('rect', { x: x - 18, y: by - 44, width: 36, height: 16, fill: '#FFFFFF', opacity: .9 }, g); S('text', { x, y: by - 33, 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 800, fill: '#2E7FD9' }, g, 'mineral'); }
    if (s.id === 'coffee') { S('path', { d: `M${x - 24},${by - 50} L${x - 20},${by} L${x + 20},${by} L${x + 24},${by - 50} Z`, fill: '#F4F1E8', stroke: '#7A7468', 'stroke-width': 1.6 }, g); S('path', { d: `M${x + 23},${by - 40} q16,4 0,22`, fill: 'none', stroke: '#7A7468', 'stroke-width': 4 }, g); S('ellipse', { cx: x, cy: by - 46, rx: 21, ry: 4, fill: '#3B2414' }, g); }
    if (s.id === 'brass') { S('circle', { cx: x - 16, cy: by - 30, r: 15, fill: 'none', stroke: '#C9A43A', 'stroke-width': 7 }, g); S('path', { d: `M${x - 2},${by - 30} L${x + 34},${by - 30} M${x + 22},${by - 30} L${x + 22},${by - 20} M${x + 30},${by - 30} L${x + 30},${by - 22}`, stroke: '#C9A43A', 'stroke-width': 7, 'stroke-linecap': 'square', fill: 'none' }, g); }
    if (s.id === 'mud') { const b = K.beaker(g, x, by, 58, 70, { color: C.mud, level: .7 }); S('rect', { x: x - 26, y: by - 12, width: 52, height: 10, rx: 2, fill: C.sand }, b.g); }
    if (s.id === 'air') { S('ellipse', { cx: x, cy: by - 62, rx: 24, ry: 28, fill: 'rgba(120,180,240,.35)', stroke: '#5B8DEF', 'stroke-width': 1.8 }, g); S('path', { d: `M${x - 4},${by - 33} L${x + 4},${by - 33} L${x},${by - 38} Z`, fill: '#5B8DEF' }, g); S('path', { d: `M${x},${by - 33} q6,14 -2,32`, fill: 'none', stroke: 'var(--ink3)', 'stroke-width': 1.3 }, g); }
  }

  /* ---------------- particles in the lens ---------------- */
  function atom(p, x, y, r, c) { return S('circle', { cx: x, cy: y, r, fill: COL[c] || c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': .9 }, p); }
  function water(p, x, y, a) {
    const g = S('g', { transform: `translate(${x} ${y}) rotate(${a})` }, p);
    atom(g, -7, 6, 5, 'H'); atom(g, 7, 6, 5, 'H'); atom(g, 0, 0, 8, 'O'); return g;
  }
  function pair(p, x, y, a, c) { const g = S('g', { transform: `translate(${x} ${y}) rotate(${a})` }, p); atom(g, -6, 0, 7, c); atom(g, 6, 0, 7, c); return g; }
  function fillLens(k, lz, id) {
    const p = lz.inner, cx = lz.x, cy = lz.y, R = lz.r;
    p.innerHTML = '';
    S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: id === 'air' ? '#F3F8FF' : '#EAF3FB' }, p);
    const movers = [];
    const rnd = (() => { let s = 7; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
    /* each particle is drawn at (0, 0) and moved by its transform */
    const scatter = (n, make, where) => { for (let i = 0; i < n; i++) { let x, y, tries = 0; do { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 16); x = cx + Math.cos(a) * d; y = cy + Math.sin(a) * d; } while (where && !where(x, y) && ++tries < 50); const g = make(); movers.push({ g, x, y, a: rnd() * 360, vx: (rnd() - .5) * 20, vy: (rnd() - .5) * 20, top: where ? cy + 14 : null }); } };
    if (id === 'gold' || id === 'brass' || id === 'salt') {
      const step = id === 'salt' ? 19 : 21;
      for (let row = -7; row <= 7; row++) for (let col = -7; col <= 7; col++) {
        const x = cx + col * step + (id === 'salt' ? 0 : (row % 2) * step / 2), y = cy + row * (id === 'salt' ? step : step * .87);
        if (Math.hypot(x - cx, y - cy) > R + 10) continue;
        const kind = id === 'gold' ? 'Au' : id === 'brass' ? (rnd() < .35 ? 'Zn' : 'Cu') : ((row + col) % 2 ? 'Na' : 'Cl');
        atom(p, x, y, id === 'salt' ? (kind === 'Na' ? 6.5 : 9.5) : 10, kind);
      }
    } else if (id === 'air') {
      scatter(6, () => pair(p, 0, 0, 0, 'N')); scatter(2, () => pair(p, 0, 0, 0, 'O')); scatter(1, () => atom(p, 0, 0, 8, 'Ar'));
    } else if (id === 'mud') {
      const gy = cy + 30;
      scatter(10, () => water(p, 0, 0, 0), (x, y) => y < gy - 14);
      S('path', { d: `M${cx - R},${gy + 12} C${cx - 60},${gy - 6} ${cx + 30},${gy + 2} ${cx + R},${gy - 4} L${cx + R},${cy + R} L${cx - R},${cy + R} Z`, fill: COL.sand, stroke: '#8A6A3A', 'stroke-width': 1.5 }, p);
      for (let i = 0; i < 26; i++) S('circle', { cx: cx - R + 10 + rnd() * 2 * R, cy: gy + 22 + rnd() * 60, r: 1.4, fill: '#8A6A3A', opacity: .6 }, p);
      S('text', { x: cx, y: gy + 50, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#5B4520' }, p, 'part of one sand grain');
    } else {
      scatter(16, () => water(p, 0, 0, 0));
      if (id === 'mineral') scatter(4, () => atom(p, 0, 0, 6, 'min'));
      if (id === 'coffee') scatter(7, () => atom(p, 0, 0, 7, 'cof'));
    }
    const fast = id === 'air' ? 3 : 1;
    if (movers.length) k.loop(dt => {
      movers.forEach(m => {
        m.x += m.vx * dt * fast; m.y += m.vy * dt * fast; m.a += 30 * dt;
        if (Math.hypot(m.x - cx, m.y - cy) > R - 12 || (m.top != null && m.y > m.top)) { m.vx *= -1; m.vy *= -1; m.x += m.vx * dt * 2; m.y += m.vy * dt * 2; }
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
      s.key.forEach(([c, t], i) => { const y = 160 + words.length * 22 + i * 26; if (c === 'O' && (id === 'dist' || id === 'mineral' || id === 'coffee' || id === 'mud')) { water(cap, 412, y - 5, 0); } else if (c === 'sand') { S('rect', { x: 402, y: y - 14, width: 20, height: 16, fill: COL.sand, stroke: '#8A6A3A' }, cap); } else atom(cap, 412, y - 5, 8, c); S('text', { x: 432, y, 'font-size': 15, 'font-weight': 800, fill: 'var(--ink)' }, cap, t); });
      S('text', { x: 230, y: 350, 'text-anchor': 'middle', class: 'zoom-sub' }, cap, 'particles, not to scale');
      const pointer = S('path', { d: `M${s.x},${400} L${230 + (s.x - 230) * .25},${330}`, stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-dasharray': '5 5', fill: 'none' }, cap);
      k.say(`<b>${s.name} ${s.sub || ''}</b>: ${s.say} <span style="color:var(--ink3)">Seen ${seen.size} of 8.</span>`);
      if (seen.size === SAMPLES.length) { k.finish('You have seen all eight. Now sort them in the first check: one kind of particle, or more than one?'); return; }
    }
  }
  function wrap(t, n) { const out = []; let ln = ''; t.split(' ').forEach(w => { if ((ln + ' ' + w).trim().length > n) { out.push(ln.trim()); ln = w; } else ln += ' ' + w; }); if (ln.trim()) out.push(ln.trim()); return out; }

  /* ---------------- Dissolve: salt until saturated, then sand ---------------- */
  async function dissolveRun(k) {
    const g = k.svg;
    const bk = K.beaker(g, 250, 446, 150, 170, { color: C.water, level: .62, marks: true });
    const grains = S('g', null, bk.g), settled = S('g', null, bk.g);
    S('text', { x: 250, y: 470, 'text-anchor': 'middle', class: 'lbl' }, g, '100 cm³ of water');
    /* the salt jar and the sand jar */
    const jar = (x, col, t) => { S('rect', { x: x - 26, y: 380, width: 52, height: 66, rx: 8, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2 }, g); S('rect', { x: x - 22, y: 404, width: 44, height: 40, rx: 5, fill: col }, g); S('rect', { x: x - 28, y: 372, width: 56, height: 10, rx: 3, fill: 'var(--metal)' }, g); S('text', { x, y: 470, 'text-anchor': 'middle', class: 'lbl' }, g, t); };
    jar(470, C.salt, 'salt'); jar(560, C.sand, 'sand');
    const lz = K.lens(g, 640, 215, 112, 'Inside the beaker', 'particles, not to scale');
    const L = lz.inner, cx = lz.x, cy = lz.y, R = lz.r;
    S('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: '#EAF3FB' }, L);
    const rnd = (() => { let s = 11; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
    const ws = [];
    for (let i = 0; i < 22; i++) { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * (R - 14); const w = water(L, 0, 0, 0); ws.push({ g: w, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: (rnd() - .5) * 26, vy: (rnd() - .5) * 26, a: rnd() * 360 }); }
    const ions = [];
    const addIons = n => { for (let i = 0; i < n; i++) { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * (R - 14), na = i % 2 === 0; const c = atom(L, 0, 0, na ? 6.5 : 9, na ? 'Na' : 'Cl'); ions.push({ g: c, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: (rnd() - .5) * 26, vy: (rnd() - .5) * 26, a: 0 }); } };
    const all = () => ws.concat(ions);
    const move = dt => { all().forEach(m => { m.x += m.vx * dt; m.y += m.vy * dt; m.a += 40 * dt; if (Math.hypot(m.x - cx, m.y - cy) > R - 12) { m.vx *= -1; m.vy *= -1; m.x += m.vx * dt * 2; m.y += m.vy * dt * 2; } m.g.setAttribute('transform', `translate(${m.x} ${m.y}) rotate(${m.a})`); }); return lz.g.isConnected; };
    move(0); k.loop(move);
    const crystal = S('g', { opacity: 0 }, L);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) atom(crystal, cx - 50 + c * 19, cy + R - 30 - r * 17, (r + c) % 2 ? 6.5 : 9, (r + c) % 2 ? 'Na' : 'Cl');
    const legend = S('g', null, g);
    water(legend, 560, 384 - 270, 0); S('text', { x: 574, y: 118, class: 'note' }, legend, 'water');
    atom(legend, 630, 113, 6.5, 'Na'); atom(legend, 646, 113, 9, 'Cl'); S('text', { x: 660, y: 118, class: 'note' }, legend, 'salt');
    let spoons = 0;
    async function spoonIn(col, n) {
      const sp = S('g', null, g);
      S('path', { d: 'M0,0 L70,-8', stroke: 'var(--metal)', 'stroke-width': 4, 'stroke-linecap': 'round' }, sp);
      S('ellipse', { cx: -6, cy: 1, rx: 12, ry: 6, fill: 'var(--metal)' }, sp);
      S('ellipse', { cx: -6, cy: -2, rx: 9, ry: 4, fill: col }, sp);
      await k.tween(700, t => sp.setAttribute('transform', `translate(${B.mix(470, 260, t)} ${B.mix(360, 250, t)}) rotate(${-30 * t})`));
      const fall = [];
      for (let i = 0; i < n; i++) fall.push(S('rect', { x: 250 - 16 + Math.random() * 30, y: 250, width: 4, height: 4, fill: col, stroke: 'rgba(0,0,0,.25)', 'stroke-width': .5 }, grains));
      sp.remove();
      await k.tween(900, t => fall.forEach((f, i) => f.setAttribute('y', 250 + t * (180 - (i % 5) * 2))));
      return fall;
    }
    for (;;) {
      k.step('Dissolve', 0, spoons < 4 ? `Add a spoon of salt (about 10 g) to the water. Spoons so far: <b>${spoons}</b>.` : '');
      await k.choose([{ id: 'salt', x: 470, y: 352, label: 'Add a spoon of salt' }]);
      const fall = await spoonIn(C.salt, 14); spoons++;
      k.say('The salt is at the bottom. Stir, and watch the beaker and the particles.');
      await k.choose([{ id: 'stir', x: 250, y: 236, label: 'Stir' }]);
      const rod = S('line', { x1: 250, y1: 230, x2: 250, y2: 432, stroke: 'var(--glass)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .8 }, g);
      const keep = spoons >= 4 ? 5 : 0;
      await k.tween(1600, t => { rod.setAttribute('transform', `rotate(${Math.sin(t * 12) * 10} 250 230)`); fall.forEach((f, i) => { if (i >= keep) f.setAttribute('opacity', 1 - t); }); });
      rod.remove();
      fall.forEach((f, i) => { if (i >= keep) f.remove(); else { f.setAttribute('y', 436 - (i % 2) * 3); settled.appendChild(f); } });
      if (spoons < 4) { addIons(spoons === 1 ? 6 : 4); k.say(`The salt has gone: it <b>dissolved</b>. Its particles spread out between the water particles. Spoons dissolved: <b>${spoons}</b>.`); await k.wait(400); continue; }
      addIons(2); crystal.setAttribute('opacity', 1);
      k.label('salt that will not dissolve', 140, 418, 230, 434, { anchor: 'end' });
      break;
    }
    k.step('Dissolve', 0, 'After four spoons, some salt stays at the bottom however long you stir. No more salt can dissolve: the solution is <b>saturated</b>. Now try sand.');
    await k.choose([{ id: 'sand', x: 560, y: 352, label: 'Add a spoon of sand', sub: 'to fresh water' }]);
    k.clearLabels(); grains.innerHTML = ''; settled.innerHTML = ''; ions.forEach(i => i.g.remove()); ions.length = 0; crystal.setAttribute('opacity', 0);
    const fall = await spoonIn(C.sand, 18);
    await k.choose([{ id: 'stir', x: 250, y: 236, label: 'Stir' }]);
    const rod = S('line', { x1: 250, y1: 230, x2: 250, y2: 432, stroke: 'var(--glass)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .8 }, g);
    await k.tween(1600, t => { rod.setAttribute('transform', `rotate(${Math.sin(t * 12) * 10} 250 230)`); fall.forEach((f, i) => f.setAttribute('y', 300 + Math.sin(t * 9 + i) * 60 + t * 120 * (i % 3) / 3)); });
    rod.remove();
    k.say('The sand swirls around, then sinks again…');
    await k.tween(1200, t => fall.forEach((f, i) => f.setAttribute('y', B.mix(+f.getAttribute('y'), 434 - (i % 3) * 4, t))));
    const grain = S('path', { d: `M${cx - R},${cy + 40} C${cx - 40},${cy + 22} ${cx + 30},${cy + 30} ${cx + R},${cy + 24} L${cx + R},${cy + R} L${cx - R},${cy + R} Z`, fill: COL.sand, stroke: '#8A6A3A', 'stroke-width': 1.5 }, L);
    k.label('sand at the bottom', 140, 418, 232, 434, { anchor: 'end' });
    k.finish('The sand did not dissolve: sand is <b>insoluble</b> in water. Salt is <b>soluble</b>. (At 20 °C, 100 cm³ of water dissolves about 36 g of salt.)');
    void grain;
  }

  B.define(1, [
    { id: 'zoom', name: 'Zoom in', title: 'Zoom in on eight samples', task: { id: 'p1-sim-zoom', title: 'Bench: zoomed in on all eight samples' }, run: zoomRun,
      alt: 'Eight samples on a lab bench: gold, distilled water, salt, mineral water, black coffee, brass, muddy water and air in a balloon, with a lens that shows the particles of the one chosen.' },
    { id: 'dissolve', name: 'Dissolve', title: 'Dissolve salt, then sand', task: { id: 'p1-sim-dissolve', title: 'Bench: dissolved salt until saturated; tried sand' }, run: dissolveRun,
      alt: 'A beaker of water, a jar of salt and a jar of sand, with a lens that shows the particles in the beaker.' }
  ]);
})();
