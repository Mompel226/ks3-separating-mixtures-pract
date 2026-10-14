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
    S('path', { d: basinD, fill: '#F4F1EA', stroke: '#8B8578', 'stroke-width': 2 }, bas);
    S('path', { d: `M${BX - BW / 2 + 14},${RIM + 10} C${BX - BW / 2 + 20},${BOT - 6} ${BX - 10},${BOT - 4} ${BX + 4},${BOT - 6}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: .8 }, bas);
    const liq = K.liquid(bas, innerD, RIM + 4, BOT - 7, color, { opacity: .85 });
    const solid = S('g', null, bas);
    S('ellipse', { cx: BX, cy: RIM, rx: BW / 2, ry: 6, fill: 'none', stroke: '#8B8578', 'stroke-width': 2.2 }, bas);
    S('path', { d: `M${BX - BW / 2 - 2},${RIM - 1} L${BX - BW / 2 - 12},${RIM - 6} L${BX - BW / 2 - 6},${RIM + 4} Z`, fill: '#F4F1EA', stroke: '#8B8578', 'stroke-width': 1.6 }, bas);
    k.label('evaporating basin', BX + 96, RIM + 8, BX + BW / 2 - 4, RIM + 8, { anchor: 'start', fade: false, layer: g });
    k.label('tripod and gauze', BX + 96, 352, BX + 62, 352, { anchor: 'start', fade: false, layer: g });
    k.label('Bunsen burner', BX + 96, 420, BX + 12, 420, { anchor: 'start', fade: false, layer: g });
    return { bun, liq, solid };
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
    await k.tween(1400, t => { b.liq.set(.75 * (1 - .8 * t)); r.liq.set(to * t); });
    await k.tween(250, t => st.cut(t)); st.remove();
    await k.tween(600, t => wrap.setAttribute('transform', `translate(${dx * (1 - t)} ${dy * (1 - t)}) rotate(${60 * (1 - t)} ${sx} ${sy})`));
    wrap.remove();
  }
  function crust(r, n, col, big) {
    for (let i = 0; i < n; i++) {
      const x = BX - BW / 2 + 26 + Math.random() * (BW - 52), y = BOT - 12 - Math.random() * 5, s = big ? 6 + Math.random() * 6 : 2 + Math.random() * 2.5;
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
    await k.tween(3600, t => { r.liq.set(.8 - .64 * t); if (Math.random() < .08) crust(r, 1, C.salt); });
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
        await k.oops('<b>Crack!</b> Near the end, hot salt <b>spits</b> out of the basin: dangerous, and you lose salt. When the salt starts to appear, turn the heat off and let the last water evaporate.');
        continue;
      }
      break;
    }
    r.bun.on(false); bub.stop();
    k.lapse('an hour in a few seconds');
    await k.tween(2200, t => { r.liq.set(.16 * (1 - t)); });
    st.stop(); k.lapse(null);
    crust(r, 70, C.salt);
    k.label('salt', BX - 100, BOT - 6, BX - 40, BOT - 6, { anchor: 'end' });
    k.finish('All the water has evaporated; the salt is left as small white crystals. The water is lost to the air: evaporation keeps the solid, not the liquid.');
  }

  /* ---------------- crystallisation ---------------- */
  async function crystRun(k) {
    const r = rig(k, C.cuso4);
    k.step(1, 4, 'Copper sulfate solution is blue. Pour it into the basin.');
    k.label('copper sulfate solution', 170, 338, null, null, { anchor: 'middle' });
    await pourIn(k, r, C.cuso4, .82);
    k.clearLabels();
    await k.choose([{ id: 'l', x: BX - 70, y: 390, label: 'Light the Bunsen', side: 'l' }]);
    r.bun.on(true);
    let heats = 0, bub = null, st = null;
    const rod = S('g', { opacity: 0 }, k.svg);
    S('line', { x1: 0, y1: 0, x2: 0, y2: 120, stroke: 'var(--glass)', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .85 }, rod);
    const tip = S('g', { opacity: 0 }, rod);
    for (let i = 0; i < 6; i++) S('path', { d: `M${-6 + (i % 3) * 4},${112 - Math.floor(i / 3) * 6} l4,-3 l4,2 l-2,4 z`, fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': .6 }, tip);
    const level = () => .82 - heats * .12;
    const deepen = () => r.liq.color(heats >= 3 ? '#1C5FB8' : heats >= 2 ? '#2369C4' : C.cuso4);
    for (;;) {
      k.step(2, 4, `Heat to evaporate some of the water. Test with a cold glass rod: crystals on the rod show the solution is <b>saturated</b>. Heated so far: <b>${heats * 2} minutes</b>.`);
      const c = await k.choose([
        { id: 'heat', x: BX - 170, y: 230, label: 'Heat for 2 minutes', side: 'l' },
        { id: 'rod', x: BX + 160, y: 200, label: 'Test with a glass rod', side: 'r' },
        { id: 'cool', x: BX + 160, y: 262, label: 'Stop and leave to cool', side: 'r' }
      ]);
      if (c === 'heat') {
        if (!bub) { bub = K.bubbles(k.svg, k, BX - 40, BX + 40, BOT - 4, () => r.liq.y()); st = K.steam(k.svg, k, BX, RIM - 6, { spread: 70 }); }
        heats++;
        k.lapse('2 minutes in 2 seconds');
        await k.tween(1600, t => r.liq.set(level() + .12 * (1 - t)));
        k.lapse(null); deepen();
        if (heats >= 5) {
          bub.stop(); st.stop();
          await k.tween(1200, t => r.liq.set(level() * (1 - t)));
          crust(r, 80, '#C9D6DC');
          await k.oops('It boiled <b>dry</b>. You get a crust of pale powder, not large blue crystals (too hot, copper sulfate even loses the water in its crystals and turns white). Stop heating as soon as the solution is saturated.');
          r.solid.innerHTML = ''; heats = 0; r.liq.color(C.cuso4).set(.82); bub = null; st = null; r.bun.on(true);
        }
        continue;
      }
      if (c === 'rod') {
        rod.setAttribute('opacity', 1); tip.setAttribute('opacity', 0);
        await k.tween(700, t => rod.setAttribute('transform', `translate(${BX + 20} ${B.mix(150, RIM - 90, t)})`));
        await k.wait(200);
        await k.tween(700, t => rod.setAttribute('transform', `translate(${BX + 20} ${B.mix(RIM - 90, 150, t)})`));
        if (heats >= 3) { await k.tween(500, t => tip.setAttribute('opacity', t)); k.label('crystals on the rod', BX - 40, 266, BX + 13, 266, { anchor: 'end' }); k.note('Small crystals formed on the cool rod: the solution is <b>saturated</b>. Stop heating now.'); }
        else k.note('No crystals on the rod yet: the solution is not saturated. Heat it a little more.');
        await k.wait(1400);
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
      const x = BX - 44 + (i % 5) * 22 + (i > 4 ? 11 : 0), y = BOT - 14 - (i > 4 ? 8 : 0);
      cr.push(S('path', { d: `M-7,4 L-3,-6 L8,-4 L4,6 Z`, fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': 1, transform: `translate(${x} ${y}) rotate(${i * 23}) scale(0)` }, r.solid));
    }
    await k.tween(3000, t => { cr.forEach((c, i) => { const s = Math.max(0, Math.min(1.25, t * 1.5 - i * .04)); const m = /translate\(([^)]*)\) rotate\(([^)]*)\)/.exec(c.getAttribute('transform')); c.setAttribute('transform', `translate(${m[1]}) rotate(${m[2]}) scale(${s})`); }); r.liq.color(t > .5 ? '#3F8AD9' : '#2E7FD9'); });
    k.lapse(null);
    k.label('copper sulfate crystals', BX - 100, BOT - 10, BX - 46, BOT - 10, { anchor: 'end' });
    k.step(4, 4, 'Crystals grew as the solution cooled. Filter to collect them, then leave them to dry.');
    await k.choose([{ id: 'f', x: BX + 160, y: 250, label: 'Filter and dry the crystals', side: 'r' }]);
    k.clearLabels();
    const lz = K.lens(k.svg, 170, 222, 92, 'Copper sulfate crystals', 'flat faces and straight edges');
    S('rect', { x: 78, y: 130, width: 184, height: 184, fill: '#EAF3FB' }, lz.inner);
    [[140, 202, 1.9, 10], [190, 237, 2.3, -15], [165, 267, 1.4, 30], [205, 182, 1.2, 50]].forEach(([x, y, s, a]) => {
      const gg = S('g', { transform: `translate(${x} ${y}) rotate(${a}) scale(${s})` }, lz.inner);
      S('path', { d: 'M-14,8 L-6,-12 L16,-8 L8,12 Z', fill: '#2B6FC4', stroke: '#173E73', 'stroke-width': 1.2 }, gg);
      S('path', { d: 'M-6,-12 L-2,-16 L20,-12 L16,-8 Z', fill: '#5FA0E6', stroke: '#173E73', 'stroke-width': 1 }, gg);
      S('path', { d: 'M16,-8 L20,-12 L12,8 L8,12 Z', fill: '#1E5AA8', stroke: '#173E73', 'stroke-width': 1 }, gg);
    });
    k.finish('Large, pure blue crystals. A cool solution can hold <b>less</b> dissolved solute than a hot one, so the extra copper sulfate came out as crystals.');
  }

  B.define(3, [
    { id: 'evap', name: 'Evaporation', title: 'Evaporation of salt solution', view: [60, 150, 620], task: { id: 'p3-sim-evap', title: 'Bench: evaporated salt solution' }, run: evapRun,
      alt: 'An evaporating basin on a tripod and gauze over a Bunsen burner, with a beaker of salt solution.' },
    { id: 'cryst', name: 'Crystallisation', title: 'Crystals of copper sulfate', view: [60, 100, 640], task: { id: 'p3-sim-cryst', title: 'Bench: grew copper sulfate crystals' }, run: crystRun,
      alt: 'An evaporating basin of blue copper sulfate solution on a tripod and gauze over a Bunsen burner, with a glass rod.' }
  ]);
})();
