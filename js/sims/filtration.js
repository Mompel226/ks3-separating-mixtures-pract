/* Part 2 · Filtration (15 Oct 2026). Fold the paper, filter muddy water (residue and filtrate), look at the paper close
   up, then the contrast (memory few-choices-for-students: one contrast): salt water goes straight through, and a drop of
   the filtrate leaves salt. The classic mistake on offer: filling the funnel above the paper's edge. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;
  const FX = 420, FT = 190, FW = 124, FCH = 80, FSL = 56;          /* the funnel */
  const AP = FT + FCH - 8;                                          /* the paper cone's tip */
  const coneD = (inset, top) => `M${FX - FW / 2 + 6 + inset},${top} L${FX},${AP - inset * .6} L${FX + FW / 2 - 6 - inset},${top} Z`;

  function scene(k, o) {
    const g = k.svg;
    K.stand(g, 300, 448, 300, 212, FX - 40);
    S('ellipse', { cx: FX, cy: 212, rx: 44, ry: 6, fill: 'none', stroke: 'var(--metal)', 'stroke-width': 4 }, g);
    const flask = K.conical(g, FX, 448, 140, 150, { neck: 40, color: C.water });
    const paperG = S('g', { class: 'cone' }, g);
    const fun = K.funnel(g, FX, FT, FW, FCH, FSL);
    return { flask, paperG, fun };
  }
  /* the filter paper, folded in front of the pupil: a disc, a half, a quarter, a cone */
  async function fold(k, layer) {
    const x = 165, y = 250, r = 58, g = S('g', null, layer);
    const top = S('path', { class: 'paper', d: `M${x - r},${y} A${r},${r} 0 0 1 ${x + r},${y} Z` }, g);
    const bot = S('path', { class: 'paper', d: `M${x - r},${y} A${r},${r} 0 0 0 ${x + r},${y} Z` }, g);
    k.label('filter paper', x, y + r + 26, null, null, { anchor: 'middle', layer: g, bg: false, fade: false });
    k.step(1, 5, 'This is a circle of <b>filter paper</b>. It is full of tiny holes. Fold it to fit the funnel.');
    await k.choose([{ id: 'f', x: x, y: y - r - 26, label: 'Fold it in half' }]);
    await k.tween(700, t => top.setAttribute('transform', `translate(0 ${y}) scale(1 ${1 - 2 * t}) translate(0 ${-y})`));
    top.remove();
    const left = S('path', { class: 'paper', d: `M${x - r},${y} A${r},${r} 0 0 0 ${x},${y + r} L${x},${y} Z` }, g);
    const right = S('path', { class: 'paper', d: `M${x},${y} L${x},${y + r} A${r},${r} 0 0 0 ${x + r},${y} Z` }, g);
    bot.remove();
    await k.choose([{ id: 'f', x: x + 20, y: y - 30, label: 'Fold it in half again' }]);
    await k.tween(700, t => right.setAttribute('transform', `translate(${x} 0) scale(${1 - 2 * t} 1) translate(${-x} 0)`));
    right.remove();
    await k.choose([{ id: 'o', x: x + 10, y: y - 30, label: 'Open it into a cone', sub: 'three layers on one side, one on the other' }]);
    await k.tween(450, t => left.setAttribute('opacity', 1 - t));
    left.remove();
    const cone = S('path', { class: 'paper', d: `M${x - 52},${y - 10} L${x},${y + 66} L${x + 52},${y - 10} Z` }, g);
    S('path', { d: `M${x - 52},${y - 10} L${x},${y + 66}`, stroke: 'var(--paper-edge)', 'stroke-width': 3, fill: 'none' }, g);
    await k.wait(250);
    return g;
  }

  async function run(k) {
    const g = k.svg, sc = scene(k);
    const paperIn = S('g', { opacity: 0 }, sc.paperG);
    S('path', { class: 'paper', d: coneD(0, FT + 3) }, paperIn);
    S('path', { d: `M${FX - FW / 2 + 6},${FT + 3} L${FX},${AP}`, stroke: 'var(--paper-edge)', 'stroke-width': 2.5, fill: 'none' }, paperIn);
    const inCone = K.liquid(sc.paperG, coneD(2, FT + 3), FT + 3, AP - 2, C.mud, { opacity: .85 });
    const sand = S('path', { fill: C.sand, stroke: '#8A6A3A', 'stroke-width': 1 }, sc.paperG);
    const setSand = f => { const hR = 26 * f, w = hR * (FW / 2 - 8) / (AP - FT); sand.setAttribute('d', f ? `M${FX - w},${AP - hR} L${FX},${AP} L${FX + w},${AP - hR} Z` : ''); };
    setSand(0);
    const folded = await fold(k, g);

    k.step(2, 5, 'Put the cone into the funnel, held by the clamp. The flask below will catch what passes through.');
    await k.choose([{ id: 'p', x: 260, y: 200, label: 'Put the cone in the funnel' }]);
    await k.tween(700, t => { folded.setAttribute('opacity', 1 - t); paperIn.setAttribute('opacity', t); });
    folded.remove();

    /* the muddy water: sand and water, a mechanical mixture */
    let bk;
    const pourBeaker = (color, level, sandy) => {
      const wrap = S('g', null, g);
      const b = K.beaker(wrap, 640, 448, 92, 110, { color, level });
      if (sandy) S('rect', { x: b.x0 + 3, y: 448 - 14, width: 86, height: 12, fill: C.sand, rx: 3 }, b.g);
      b.wrap = wrap; return b;
    };
    bk = pourBeaker(C.mud, .72, true);
    const lblM = k.label('sand and water', 640, 318, null, null, { anchor: 'middle' });

    for (;;) {
      k.step(3, 5, 'Pour in the muddy water. How do you pour it?');
      const how = await k.choose([
        { id: 'fast', x: 560, y: 260, label: 'Pour it all in at once', side: 'l' },
        { id: 'slow', x: 720, y: 260, label: 'Pour slowly', sub: 'keep it below the paper’s edge', side: 'r' }
      ]);
      lblM.remove();
      await pour(k, bk, how === 'fast' ? 1 : .55, C.mud);
      if (how === 'fast') {
        /* the level goes over the paper's edge: muddy liquid runs down between paper and glass */
        await k.tween(600, t => inCone.set(.62 + .38 * t));
        /* over the edge: mud runs down between the paper and the glass, into the stem */
        const sl = K.stream(g, [[FX - FW / 2 + 4, FT + 2], [FX - 6, FT + FCH - 2], [FX - 2, FT + FCH + FSL]], C.mud, 3.5);
        const sr = K.stream(g, [[FX + FW / 2 - 4, FT + 2], [FX + 6, FT + FCH - 2], [FX + 2, FT + FCH + FSL]], C.mud, 3.5);
        await k.tween(700, t => { sl.grow(t); sr.grow(t); });
        const d = K.drips(g, k, FX, FT + FCH + FSL, () => sc.flask.liq.y(), { color: C.mud, every: .12 });
        await k.tween(1800, t => { sc.flask.liq.color(C.mud).set(.14 * t); });
        d.stop();
        await k.oops('The liquid went over the edge of the paper and ran down the glass, <b>around</b> the paper. The filtrate is muddy.');
        sc.flask.liq.set(0).color(C.water); inCone.set(0); sl.remove(); sr.remove(); bk.wrap.remove(); bk = pourBeaker(C.mud, .72, true);
        continue;
      }
      break;
    }
    /* drains: clear water through, sand stays */
    inCone.set(.62);
    const drops = K.drips(g, k, FX, FT + FCH + FSL, () => sc.flask.liq.y(), { color: C.water, every: .16 });
    k.lapse('a few minutes in a few seconds');
    await k.tween(3200, t => { inCone.set(.62 * (1 - t)); setSand(t); sc.flask.liq.set(.22 * t); });
    drops.stop(); k.lapse(null);
    k.label('residue (sand)', 250, AP - 6, FX - 10, AP - 10, { anchor: 'end' });
    k.label('filtrate (water)', 250, 430, FX - 52, 430, { anchor: 'end' });

    k.step(4, 5, 'The sand stayed on the paper; clear water passed through. Why? Look at the paper close up.');
    await k.choose([{ id: 'z', x: 560, y: 150, label: 'Look closer at the paper', side: 'r' }]);
    bk.wrap.remove(); k.clearLabels();
    const lz = K.lens(k.top, 628, 228, 100, 'Sand grains are too big to pass', 'water particles pass through the holes · not to scale');
    zoom(k, lz, true);
    k.label('residue (sand)', 250, AP - 6, FX - 10, AP - 10, { anchor: 'end' });
    k.label('filtrate (water)', 250, 430, FX - 52, 430, { anchor: 'end' });

    k.step(5, 5, 'Now the contrast: <b>salt water</b>. The salt is dissolved. Will the paper stop it?');
    await k.choose([{ id: 'n', x: 640, y: 380, label: 'Try salt water', sub: 'clean paper, empty flask' }]);
    lz.g.remove(); k.clearLabels();
    setSand(0); sc.flask.liq.set(0);
    bk = pourBeaker('#9CC9E6', .7, false);
    k.label('salt water', 640, 318, null, null, { anchor: 'middle' });
    await k.choose([{ id: 'p', x: 720, y: 260, label: 'Pour slowly', side: 'r' }]);
    k.clearLabels();
    await pour(k, bk, .55, '#9CC9E6');
    inCone.color('#9CC9E6').set(.62);
    const d2 = K.drips(g, k, FX, FT + FCH + FSL, () => sc.flask.liq.y(), { color: '#9CC9E6', every: .16 });
    k.lapse('a few minutes in a few seconds');
    await k.tween(3000, t => { inCone.set(.62 * (1 - t)); sc.flask.liq.color('#9CC9E6').set(.22 * t); });
    d2.stop(); k.lapse(null);
    k.label('nothing left on the paper', 250, AP - 6, FX - 10, AP - 10, { anchor: 'end' });
    k.say('Nothing stayed on the paper. Is the salt still in the filtrate? Test a drop: warm it until the water has gone.');
    await k.choose([{ id: 't', x: 640, y: 380, label: 'Test a drop of the filtrate' }]);
    bk.wrap.remove(); k.clearLabels();
    /* a watch glass on the bench, a drop, warmed: a white ring of salt */
    const wx = 628, wy = 432;
    S('path', { class: 'glass', d: `M${wx - 60},${wy - 8} Q${wx},${wy + 14} ${wx + 60},${wy - 8}` }, g);
    const drop = S('ellipse', { cx: wx, cy: wy - 2, rx: 22, ry: 4, fill: '#9CC9E6', opacity: .9 }, g);
    k.label('watch glass', wx, wy + 32, null, null, { anchor: 'middle', bg: false });
    k.lapse('ten minutes in a few seconds');
    await k.tween(2200, t => { drop.setAttribute('rx', 22 - 6 * t); drop.setAttribute('opacity', .9 * (1 - t)); });
    k.lapse(null);
    const ring = S('g', null, g);
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; S('rect', { x: wx + Math.cos(a) * 16 - 1.8, y: wy - 2 + Math.sin(a) * 3 - 1.8, width: 3.6, height: 3.6, fill: C.salt, stroke: '#9A968A', 'stroke-width': .6 }, ring); }
    k.label('salt left behind', wx - 74, wy - 14, wx - 18, wy - 4, { anchor: 'end' });
    const lz2 = K.lens(k.top, 628, 228, 100, 'Salt particles pass through too', 'dissolved salt is as small as water · not to scale');
    zoom(k, lz2, false);
    k.finish('The salt passed through the paper. Filtration separates an <b>insoluble</b> solid from a liquid; it cannot remove a <b>dissolved</b> solid.');
  }

  /* lift the beaker over the funnel, tip it, pour; amount = how much of it goes in */
  async function pour(k, b, amount, color) {
    const sx = b.x0 - 6, sy = b.ty - 3, dx = (FX + 46) - sx, dy = (FT - 26) - sy, lev0 = b.liq.level();
    await k.tween(800, t => b.wrap.setAttribute('transform', `translate(${dx * t} ${dy * t}) rotate(${-58 * t} ${sx} ${sy})`));
    b.liq.tilt(-58, sx, sy);
    const st = K.stream(k.svg, [[FX + 46, FT - 26], [FX + 40, FT - 10], [FX + 30, FT + 16], [FX + 18, FT + 40]], color, 6);
    await k.tween(300, t => st.grow(t));
    await k.tween(1500, t => b.liq.set(lev0 * (1 - amount * t)));
    await k.tween(250, t => st.cut(t));
    st.remove();
    await k.tween(700, t => b.wrap.setAttribute('transform', `translate(${dx * (1 - t)} ${dy * (1 - t)}) rotate(${-58 * (1 - t)} ${sx} ${sy})`));
    b.liq.tilt(0, sx, sy);
  }

  /* the paper close up: fibres with gaps; water particles slip through, sand grains rest on top (or salt slips through) */
  function zoom(k, lz, sand) {
    const p = lz.inner, x = lz.x, y = lz.y, r = lz.r;
    S('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, fill: '#E8F2FB' }, p);
    const fy = y + 4, gaps = [x - 66, x - 22, x + 22, x + 66];
    S('rect', { x: x - r, y: fy, width: 2 * r, height: 26, fill: '#EDE6CF', stroke: '#B8AD8A', 'stroke-width': 1.5 }, p);
    gaps.forEach(gx => S('rect', { x: gx - 7, y: fy - 1, width: 14, height: 28, fill: '#E8F2FB' }, p));
    S('text', { x: x - 44, y: fy + 18, 'font-size': 12, 'font-weight': 900, fill: '#7A6D45', 'text-anchor': 'middle' }, p, 'paper');
    if (sand) {
      [[x - 44, fy - 20, 22], [x, fy - 18, 20], [x + 44, fy - 21, 23]].forEach(([gx, gy, s]) =>
        S('path', { d: `M${gx - s},${gy + s * .3} L${gx - s * .4},${gy - s * .7} L${gx + s * .6},${gy - s * .6} L${gx + s},${gy + s * .2} L${gx + s * .3},${gy + s * .8} L${gx - s * .7},${gy + s * .7} Z`, fill: C.sand, stroke: '#8A6A3A', 'stroke-width': 1.4 }, p));
    }
    const parts = [];
    const add = (cls, rr, col) => { const c = S('circle', { r: rr, fill: col, stroke: '#1F4E79', 'stroke-width': .8 }, p); parts.push({ c, gi: Math.floor(Math.random() * 4), t: Math.random(), rr }); };
    for (let i = 0; i < 14; i++) add('w', 4, '#5FA3E0');
    if (!sand) for (let i = 0; i < 6; i++) add('s', 4.5, '#F2EEE3');
    if (sand) S('text', { x: x - 50, y: fy - 42, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: '#5B4520' }, p, 'sand');
    S('text', { x: x + 52, y: y + 62, 'font-size': 12.5, 'font-weight': 900, fill: '#1F4E79', 'text-anchor': 'middle' }, p, sand ? 'water' : 'water + salt');
    const place = (q) => { const gx = gaps[q.gi] + (Math.sin(q.t * 9 + q.gi) * 3), yy = y - r + 20 + q.t * (2 * r - 40); q.c.setAttribute('cx', yy > fy - 8 && yy < fy + 34 ? gaps[q.gi] : gx + (q.t < .4 ? (q.gi - 1.5) * 8 * (1 - q.t * 2.5) : 0)); q.c.setAttribute('cy', yy); };
    parts.forEach(place);
    k.loop(dt => { parts.forEach(q => { q.t += dt * .22; if (q.t > 1) { q.t = 0; q.gi = Math.floor(Math.random() * 4); } place(q); }); return lz.g.isConnected; });
  }

  B.define(2, [{ id: 'filter', name: 'Filtration', title: 'Filtration', view: [70, 112, 670], kicker: 'Part 2 · the bench', task: { id: 'p2-sim', title: 'Bench: filtration of muddy water and salt water' }, run,
                 alt: 'A filter funnel held by a clamp over a conical flask, with filter paper and a beaker of muddy water.' }]);
})();
