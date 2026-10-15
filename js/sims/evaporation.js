/* Part 3 · Evaporation and crystallisation (15 Oct 2026; slide 15's four steps). Evaporation: salt solution heated
   until the salt is left; the mistake on offer is heating hard to the very end (hot salt spits). Crystallisation: copper
   sulfate heated only until a glass rod shows it is saturated, then cooled; cooling too early gives nothing, boiling dry
   gives a pale powder. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;
  const BX = 360, RIM = 300, BOT = 340, BW = 140;                 /* the evaporating basin: white porcelain */
  const basinD = `M${BX - BW / 2},${RIM} C${BX - BW / 2 + 4},${BOT + 2} ${BX + BW / 2 - 4},${BOT + 2} ${BX + BW / 2},${RIM} Z`;
  const innerD = `M${BX - BW / 2 + 6},${RIM + 2} C${BX - BW / 2 + 10},${BOT - 4} ${BX + BW / 2 - 10},${BOT - 4} ${BX + BW / 2 - 6},${RIM + 2} Z`;

  function rig(k, color) {
    const g = k.svg;
    S('rect', { x: BX - 70, y: 444, width: 140, height: 6, rx: 2, fill: '#B9B4A6' }, g);         /* heatproof mat */
    const bun = K.bunsen(g, BX, 446, { flame: 38, h: 60 });
    K.tripod(g, BX, 446, 352, 118);
    const bas = S('g', null, g);
    /* the lip first, so the bowl is drawn over its joint; the highlight stays well inside the bowl */
    S('path', { d: `M${BX - BW / 2 + 8},${RIM - 5} Q${BX - BW / 2 - 6},${RIM - 7} ${BX - BW / 2 - 13},${RIM - 3} Q${BX - BW / 2 - 4},${RIM + 3} ${BX - BW / 2 + 8},${RIM + 4} Z`, fill: '#F4F1EA', stroke: '#8B8578', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, bas);
    S('path', { d: basinD, fill: '#F4F1EA', stroke: '#8B8578', 'stroke-width': 2 }, bas);
    S('path', { d: `M${BX - BW / 2 + 16},${RIM + 9} Q${BX - BW / 2 + 30},${RIM + 23} ${BX - 26},${RIM + 25}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: .8, 'stroke-linecap': 'round' }, bas);
    const liq = K.liquid(bas, innerD, RIM + 3, BOT - 13, color, { opacity: .85 });   /* the bowl's inside bottom is at BOT - 12.5 */
    const solid = S('g', null, bas);
    S('ellipse', { cx: BX, cy: RIM, rx: BW / 2, ry: 6, fill: 'none', stroke: '#8B8578', 'stroke-width': 2.2 }, bas);
    const labs = [k.label('evaporating basin', BX + 96, RIM + 8, BX + BW / 2 - 4, RIM + 8, { anchor: 'start', fade: false, layer: g }),
      k.label('tripod and gauze', BX + 96, 352, BX + 62, 352, { anchor: 'start', fade: false, layer: g }),
      k.label('Bunsen burner', BX + 96, 420, BX + 8, 420, { anchor: 'start', fade: false, layer: g })];
    return { bun, liq, solid, labs, bas };
  }
  /* the solution poured from a beaker on the left into the basin */
  async function pourIn(k, r, color, to) {
    const g = k.svg, wrap = S('g', null, g), b = K.beaker(wrap, 170, 446, 76, 92, { color, level: .75 });
    const sx = b.x1 + 6, sy = b.ty - 3;          /* pours from the right-hand lip */
    S('path', { class: 'glass-line', d: `M${b.x1},${b.ty + 6} Q${b.x1},${b.ty} ${b.x1 + 6},${b.ty - 3}` }, b.g);
    await k.choose([{ id: 'p', x: 170, y: 292, label: 'Pour it into the basin' }]);
    const dx = (BX - 36) - sx, dy = (RIM - 46) - sy;
    await k.tween(800, t => wrap.setAttribute('transform', `translate(${dx * t} ${dy * t}) rotate(${60 * t} ${sx} ${sy})`));
    b.liq.tilt(60, sx, sy);
    const st = K.stream(g, [[BX - 36, RIM - 46], [BX - 30, RIM - 30], [BX - 22, RIM + 12]], color, 6);
    await k.tween(300, t => st.grow(t));
    await k.tween(1400, t => { b.liq.set(.75 * (1 - t)); r.liq.set(to * t); });          /* all of it: the beaker goes back empty */
    await k.tween(250, t => st.cut(t)); st.remove();
    await k.tween(600, t => wrap.setAttribute('transform', `translate(${dx * (1 - t)} ${dy * (1 - t)}) rotate(${60 * (1 - t)} ${sx} ${sy})`));
    b.liq.tilt(0, sx, sy);
    return wrap;
  }
  /* the inside bottom of the bowl at x (the curve of innerD, measured): 327.5 in the middle, rising towards the sides */
  const bottomAt = x => BOT - 12.5 - .0045 * (x - BX) * (x - BX);
  function crust(r, n, col, big) {
    for (let i = 0; i < n; i++) {
      /* on the inside bottom of the bowl (its lowest point is BOT - 12.5) */
      const x = BX - 46 + Math.random() * 92, s = big ? 6 + Math.random() * 6 : 2 + Math.random() * 2.5, y = bottomAt(x) - s - Math.random() * 2;
      if (big) S('path', { d: `M${x - s},${y} L${x - s * .4},${y - s * .9} L${x + s},${y - s * .7} L${x + s * .4},${y + s * .2} Z`, fill: col, stroke: 'rgba(0,0,0,.35)', 'stroke-width': .8 }, r.solid);
      else S('rect', { x, y, width: s, height: s, fill: col, stroke: 'rgba(0,0,0,.25)', 'stroke-width': .5, transform: `rotate(${Math.random() * 40} ${x} ${y})` }, r.solid);
    }
  }

  /* ---------------- evaporation ---------------- */
  async function evapRun(k) {
    const r = rig(k, '#A9CFEA');
    k.step(1, 4, 'Salt solution: salt dissolved in water. Pour it into the evaporating basin. (Wear eye protection.)');
    k.label('salt solution', 170, 338, null, null, { anchor: 'middle' });
    await pourIn(k, r, '#A9CFEA', .8);
    k.clearLabels();
    k.step(2, 4, 'Light the Bunsen burner and heat the basin.');
    await k.choose([{ id: 'l', x: BX - 70, y: 390, label: 'Light the Bunsen', side: 'l' }]);
    r.bun.on(true);
    k.step(3, 4, 'The water boils and leaves as water vapour. Watch the level fall.');
    const bub = K.bubbles(k.svg, k, BX - 40, BX + 40, BOT - 4, () => r.liq.y());
    const st = K.steam(k.svg, k, BX, RIM - 6, { spread: 70 });
    k.lapse('20 minutes in a few seconds');
    let shown = 0;
    await k.tween(3600, t => { r.liq.set(.8 - .64 * t); const want = Math.floor(Math.max(0, t - .55) * 30); if (want > shown) { crust(r, want - shown, C.salt); shown = want; } });
    if (shown < 12) crust(r, 12 - shown, C.salt);
    k.lapse(null);
    for (;;) {
      k.step(4, 4, 'Only a little water is left and salt is appearing. What now?');
      const c = await k.choose([
        { id: 'hard', x: BX - 160, y: 250, label: 'Keep heating hard', sub: 'until it is dry', side: 'l' },
        { id: 'off', x: BX + 160, y: 250, label: 'Turn the Bunsen off', sub: 'let the rest evaporate', side: 'r' }
      ]);
      if (c === 'hard') {
        const specks = [];
        for (let i = 0; i < 14; i++) specks.push({ e: S('rect', { x: BX, y: BOT - 8, width: 4, height: 4, fill: C.salt, stroke: '#999', 'stroke-width': .5 }, k.svg), vx: (Math.random() - .5) * 260, vy: -160 - Math.random() * 160 });
        await k.tween(900, t => specks.forEach(s => { s.e.setAttribute('x', BX + s.vx * t); s.e.setAttribute('y', BOT - 8 + s.vy * t + 320 * t * t); }), B.lin);
        specks.forEach(s => s.e.remove());
        const dz = K.danger(k.top, 70, 150, 'DANGER: hot salt\nspits out of the basin');
        await k.oops('<b>Crack!</b> Near the end, hot salt <b>spits</b> out of the basin. It can burn your eyes and skin: always wear <b>goggles</b> and a <b>lab coat</b>. And you lose salt. When the salt starts to appear, turn the heat off and let the last water evaporate.');
        dz.remove();
        continue;
      }
      break;
    }
    r.bun.on(false); bub.stop();
    k.lapse('an hour in a few seconds');
    await k.tween(2200, t => { r.liq.set(.16 * (1 - t)); });
    st.stop(); k.lapse(null);
    crust(r, 70, C.salt);
    k.label('salt', BX - 96, BOT - 16, BX - 34, BOT - 16, { anchor: 'end' });
    k.finish('All the water has evaporated; the salt is left as small white crystals. The water is lost to the air: evaporation keeps the solid, not the liquid.');
  }

  /* ---------------- crystallisation ---------------- */
  async function crystRun(k) {
    const r = rig(k, C.cuso4);
    k.step(1, 4, 'Copper sulfate solution is blue. Pour it into the basin.');
    k.label('copper sulfate solution', 170, 338, null, null, { anchor: 'middle' });
    const emptyBeaker = await pourIn(k, r, C.cuso4, .82);
    k.clearLabels();
    await k.choose([{ id: 'l', x: BX - 70, y: 390, label: 'Light the Bunsen', side: 'l' }]);
    r.bun.on(true);
    let heats = 0, bub = null, st = null;
    const rod = S('g', { opacity: 0 }, k.svg);
    /* a glass rod: clear glass with an outline and a highlight, not a dark stick */
    S('rect', { x: -3.5, y: 0, width: 7, height: 120, rx: 3.5, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.6 }, rod);
    S('line', { x1: -1, y1: 6, x2: -1, y2: 112, stroke: 'var(--shine)', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, rod);
    const tip = S('g', { opacity: 0 }, rod);
    for (let i = 0; i < 6; i++) S('path', { d: `M${-6 + (i % 3) * 4},${112 - Math.floor(i / 3) * 6} l4,-3 l4,2 l-2,4 z`, fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': .6 }, tip);
    const level = () => .82 - heats * .12;
    const deepen = () => r.liq.color(heats >= 3 ? '#1C5FB8' : heats >= 2 ? '#2369C4' : C.cuso4);
    let lastTest = '';
    const putDown = () => { rod.setAttribute('opacity', 0); k.clearLabels(); };   /* the rod is put down when you do something else */
    for (;;) {
      k.step(2, 4, `Heat to evaporate some of the water. Test with a cold glass rod: crystals on the rod show the solution is <b>saturated</b>. Heated so far: <b>${heats * 2} minutes</b>.` + lastTest);
      const c = await k.choose([
        { id: 'heat', x: BX - 170, y: 230, label: 'Heat for 2 minutes', side: 'l' },
        { id: 'rod', x: BX + 160, y: 200, label: 'Test with a glass rod', side: 'r' },
        { id: 'cool', x: BX + 160, y: 262, label: 'Stop and leave to cool', side: 'r' }
      ]);
      if (c !== 'rod') putDown();
      if (c === 'heat') {
        lastTest = '';
        if (!bub) { bub = K.bubbles(k.svg, k, BX - 40, BX + 40, BOT - 4, () => r.liq.y()); st = K.steam(k.svg, k, BX, RIM - 6, { spread: 70 }); }
        heats++;
        k.lapse('2 minutes in 2 seconds');
        await k.tween(1600, t => r.liq.set(level() + .12 * (1 - t)));
        k.lapse(null); deepen();
        if (heats >= 5) {
          bub.stop(); st.stop();
          await k.tween(1200, t => r.liq.set(level() * (1 - t)));
          crust(r, 80, '#E8EDEF');                                   /* anhydrous copper sulfate: white */
          /* boiling dry, the hot solid cracks and spits, as salt does */
          const specks = [];
          for (let i = 0; i < 14; i++) specks.push({ e: S('rect', { x: BX, y: BOT - 10, width: 4, height: 4, fill: i % 3 ? '#E8EDEF' : '#2B6FC4', stroke: '#777', 'stroke-width': .5 }, k.svg), vx: (Math.random() - .5) * 260, vy: -160 - Math.random() * 160 });
          await k.tween(900, t => specks.forEach(s => { s.e.setAttribute('x', BX + s.vx * t); s.e.setAttribute('y', BOT - 10 + s.vy * t + 320 * t * t); }), B.lin);
          specks.forEach(s => s.e.remove());
          const dz = K.danger(k.top, 70, 150, 'DANGER: hot crystals\nspit out of the basin');
          await k.oops('<b>Crack!</b> It boiled <b>dry</b> and hot crystals spat out of the basin: wear <b>goggles</b> and a <b>lab coat</b>. You get a crust of pale powder, not large blue crystals (too hot, copper sulfate even loses the water in its crystals and turns white). Stop heating as soon as the solution is saturated.');
          dz.remove();
          r.solid.innerHTML = ''; heats = 0; r.liq.color(C.cuso4).set(.82); bub = null; st = null; r.bun.on(true);
        }
        continue;
      }
      if (c === 'rod') {
        rod.setAttribute('opacity', 1); tip.setAttribute('opacity', 0);
        await k.tween(700, t => rod.setAttribute('transform', `translate(${BX + 20} ${B.mix(150, RIM - 90, t)})`));
        await k.wait(200);
        await k.tween(700, t => rod.setAttribute('transform', `translate(${BX + 20} ${B.mix(RIM - 90, 150, t)})`));
        k.clearLabels();
        if (heats >= 3) { await k.tween(500, t => tip.setAttribute('opacity', t)); k.label('crystals on the rod', BX - 40, 262, BX + 16, 262, { anchor: 'end' }); lastTest = ' <br><b>Test:</b> small crystals formed on the cool rod: the solution is <b>saturated</b>.'; }
        else lastTest = ' <br><b>Test:</b> no crystals on the rod: the solution is not saturated yet.';
        continue;
      }
      /* cool */
      r.bun.on(false); if (bub) bub.stop(); if (st) st.stop();
      if (heats < 3) {
        k.lapse('a day in a few seconds');
        await k.tween(2000, () => {});
        k.lapse(null);
        await k.oops('A day later: no crystals. The solution was <b>not saturated</b>, so it can hold all its copper sulfate even when cool. Heat it more first, and test with the rod.');
        r.bun.on(true); bub = null; st = null;
        continue;
      }
      break;
    }
    k.clearLabels(); rod.remove();
    k.step(3, 4, 'Leave the saturated solution to cool slowly. Watch the basin.');
    k.lapse('a day in a few seconds');
    const cr = [];
    for (let i = 0; i < 9; i++) {
      const x = BX - 40 + (i % 5) * 20 + (i > 4 ? 10 : 0), y = bottomAt(x) - 5 - (i > 4 ? 7 : 0);
      cr.push(S('path', { d: `M-7,4 L-3,-6 L8,-4 L4,6 Z`, fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': 1, transform: `translate(${x} ${y}) rotate(${i * 23}) scale(0)` }, r.solid));
    }
    await k.tween(3000, t => { cr.forEach((c, i) => { const s = Math.max(0, Math.min(.95, t * 1.3 - i * .04)); const m = /translate\(([^)]*)\) rotate\(([^)]*)\)/.exec(c.getAttribute('transform')); c.setAttribute('transform', `translate(${m[1]}) rotate(${m[2]}) scale(${s})`); }); r.liq.color(t > .5 ? '#3F8AD9' : '#2E7FD9'); });
    k.lapse(null);
    k.label('copper sulfate crystals', BX - 100, BOT - 21, BX - 38, BOT - 21, { anchor: 'end' });
    k.step(4, 4, 'Crystals grew as the solution cooled. Filter to collect them, then leave them to dry.');
    await k.choose([{ id: 'f', x: BX + 150, y: 232, label: 'Filter and dry the crystals' }]);
    k.clearLabels(); r.labs.forEach(l => l.remove()); emptyBeaker.remove();
    /* filtration, as Daniel's revision mat says ("filter the crystals and leave them in a warm place to dry"): the crystals
       are solid and the leftover solution is saturated, so they cannot dissolve back: they stay on the paper (residue);
       the leftover blue solution runs through (filtrate) */
    const FX = 170, FT = 296;
    const fl = K.conical(k.svg, FX, 446, 104, 100, { neck: 36, color: C.cuso4 });
    fl.liq.opacity(.7);
    const cone = S('g', null, k.svg);
    S('path', { class: 'paper', d: `M${FX - 38},${FT + 8} L${FX},${FT + 52} L${FX + 38},${FT + 8} Z` }, cone);
    K.funnel(k.svg, FX, FT, 90, 58, 44);
    const stx = BX - BW / 2 - 12, sty = RIM - 3;
    const pst = K.stream(k.svg, [[stx, sty], [stx - 40, sty - 30], [FX + 40, FT - 14], [FX + 14, FT + 16]], C.cuso4, 5);
    const at = cr.map(c => { const m = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)/.exec(c.getAttribute('transform')); return [+m[1], +m[2], +m[3]]; });
    k.svg.appendChild(r.solid);
    const drips = K.drips(k.svg, k, FX, FT + 102, () => fl.liq.y(), { color: C.cuso4, every: .2 });
    await k.tween(400, t => pst.grow(t));
    k.lapse('a few minutes in a few seconds');
    await k.tween(2600, t => {
      r.liq.set(Math.max(0, r.liq.level() - .004)); fl.liq.set(.3 * t);
      cr.forEach((c, i) => { const [x, y, a] = at[i], u = Math.min(1, Math.max(0, t * 1.6 - i * .06)), tx = FX - 16 + (i % 4) * 11, ty = FT + 40 - Math.floor(i / 4) * 8, hgt = Math.sin(Math.PI * u) * 70;
        c.setAttribute('transform', `translate(${B.mix(x, tx, u)} ${B.mix(y, ty, u) - hgt}) rotate(${a}) scale(${B.mix(.95, .8, u)})`); });
    });
    r.liq.set(0); await k.tween(200, t => pst.cut(t)); pst.remove();
    await k.tween(1400, t => fl.liq.set(.3 + .06 * t));
    drips.stop(); k.lapse(null);
    k.label('crystals (residue)', FX, FT - 18, FX, FT + 30, { anchor: 'middle' });
    k.label('leftover solution (filtrate)', FX + 64, 424, FX + 30, 424, { anchor: 'start' });
    const lz = K.lens(k.svg, 600, 196, 80, 'Copper sulfate crystals');
    S('rect', { x: 520, y: 116, width: 160, height: 160, fill: '#EAF3FB' }, lz.inner);
    [[575, 180, 1.6, 10], [618, 210, 1.9, -15], [596, 240, 1.2, 30], [630, 165, 1.0, 50]].forEach(([x, y, s, a]) => {
      const gg = S('g', { transform: `translate(${x} ${y}) rotate(${a}) scale(${s})` }, lz.inner);
      S('path', { d: 'M-14,8 L-6,-12 L16,-8 L8,12 Z', fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': 1.2 }, gg);
      S('path', { d: 'M-6,-12 L-2,-16 L20,-12 L16,-8 Z', fill: '#5FA0E6', stroke: '#173E73', 'stroke-width': 1 }, gg);
      S('path', { d: 'M16,-8 L20,-12 L12,8 L8,12 Z', fill: '#1E5AA8', stroke: '#173E73', 'stroke-width': 1 }, gg);
    });
    k.finish('Large, pure blue crystals, left on the paper to dry. A cool solution can hold <b>less</b> dissolved solute than a hot one, so the extra copper sulfate came out as solid crystals; the leftover solution is saturated, so they do not dissolve again as it passes through.');
  }

  B.define(3, [
    { id: 'evap', name: 'Evaporation', title: 'Evaporation of salt solution', view: [60, 150, 620], task: { id: 'p3-sim-evap', title: 'Bench: evaporated salt solution' }, run: evapRun,
      alt: 'An evaporating basin on a tripod and gauze over a Bunsen burner, with a beaker of salt solution.' },
    { id: 'cryst', name: 'Crystallisation', title: 'Crystals of copper sulfate', view: [30, 100, 670], task: { id: 'p3-sim-cryst', title: 'Bench: grew copper sulfate crystals' }, run: crystRun,
      alt: 'An evaporating basin of blue copper sulfate solution on a tripod and gauze over a Bunsen burner, with a glass rod.' }
  ]);
})();
