/* Part 4 · Distillation (15 Oct 2026). Simple: seawater → pure water (Daniel chose the standard version on 14 Oct:
   simple distillation takes the solvent out of a solution; fractional, ethanol and water, is the extension). The mistake
   on offer: cold water into the condenser's upper end. Fractional: a live temperature graph; the pupil changes the
   beaker when the temperature leaves 78 °C. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;

  /* a Liebig condenser from (x0, y0) sloping down to (x1, y1) */
  function condenser(p, x0, y0, x1, y1, o) {
    o = o || {};
    const ang = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0), deg = ang * 180 / Math.PI;
    const W = (lx, ly) => [x0 + lx * Math.cos(ang) - ly * Math.sin(ang), y0 + lx * Math.sin(ang) + ly * Math.cos(ang)];
    const g = S('g', { transform: `translate(${x0} ${y0}) rotate(${deg})` }, p);
    const j0 = o.j0 || 34, j1 = L - (o.j1 || 30), jh = 17;
    const water = S('rect', { x: j0, y: -jh, width: 0, height: 2 * jh, fill: '#5DA9E9', opacity: .5 }, g);
    S('rect', { x: j0, y: -jh, width: j1 - j0, height: 2 * jh, rx: 6, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2.4 }, g);
    S('rect', { x: -4, y: -5.5, width: L + 30, height: 11, rx: 3, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2 }, g);
    S('path', { class: 'shine', d: `M${j0 + 10},${-jh + 5} L${j1 - 10},${-jh + 5}`, opacity: .6 }, g);
    /* the two nozzles: one near each end of the jacket, on the underside (lower end) and topside (upper end) */
    S('rect', { x: j1 - 22, y: jh - 2, width: 10, height: 14, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2 }, g);
    S('rect', { x: j0 + 12, y: -jh - 12, width: 10, height: 14, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2 }, g);
    return {
      g, W, L, deg, ang,
      lowNozzle: W(j1 - 17, jh + 12), highNozzle: W(j0 + 17, -jh - 12),
      fill(f) { water.setAttribute('x', j1 - (j1 - j0) * f); water.setAttribute('width', (j1 - j0) * f); water.setAttribute('y', -jh); water.setAttribute('height', 2 * jh); },
      trickle(f) { water.setAttribute('x', j0); water.setAttribute('width', (j1 - j0) * f); water.setAttribute('y', jh - 6); water.setAttribute('height', 6); }
    };
  }
  /* small dots that travel along a path: vapour first, then drops of liquid after `cond` (0..1 of the way) */
  function flow(k, p, pts, o) {
    const g = S('g', { 'pointer-events': 'none' }, p), segs = [];
    let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push([pts[i - 1], pts[i], l]); tot += l; }
    const at = s => { let d = s * tot; for (const [a, b, l] of segs) { if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; d -= l; } return pts[pts.length - 1]; };
    const parts = []; let acc = 0, on = true;
    if (k.FAST) return { stop() {}, g };
    k.loop(dt => {
      acc += dt;
      if (on && acc > (o.every || .12)) { acc = 0; parts.push({ c: S('circle', { r: 3.2, fill: '#FFFFFF', opacity: .8 }, g), s: 0 }); }
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i]; q.s += dt * (q.s < o.cond ? (o.speed || .3) : (o.speed || .3) * .55);
        if (q.s >= 1) { q.c.remove(); parts.splice(i, 1); if (o.onEnd) o.onEnd(); continue; }
        const [x, y] = at(q.s); q.c.setAttribute('cx', x); q.c.setAttribute('cy', y);
        if (q.s >= o.cond) { q.c.setAttribute('fill', o.drop || '#5FA3E0'); q.c.setAttribute('r', 2.6); q.c.setAttribute('opacity', 1); }
        else q.c.setAttribute('opacity', .35 + .5 * (1 - q.s / o.cond));
      }
      return on || parts.length;
    });
    return { g, stop() { on = false; } };
  }
  function hose(p, pts, col) { S('path', { d: 'M' + pts.map(q => q.join(',')).join(' L'), fill: 'none', stroke: col || '#3E6E8E', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .85 }, p); }

  /* ---------------- simple distillation of seawater ---------------- */
  async function simpleRun(k) {
    const g = k.svg, FX = 200, FY = 318, FR = 50;
    S('rect', { x: FX - 70, y: 444, width: 140, height: 6, rx: 2, fill: '#B9B4A6' }, g);
    const bun = K.bunsen(g, FX, 446, { flame: 30, h: 42 });
    K.tripod(g, FX, 446, 378, 112);
    K.stand(g, 112, 446, 330, 226, FX - 14);
    const fl = K.rbFlask(g, FX, FY, FR, 214, { color: C.sea, level: .62 });
    const salt = S('g', null, fl.g);
    /* the side arm, the stopper and the thermometer (its bulb level with the side arm) */
    S('path', { class: 'glass-line', d: `M${FX + 13},${232} L${FX + 64},${254}` }, g);
    S('path', { class: 'glass-line', d: `M${FX + 13},${244} L${FX + 60},${264}` }, g);
    S('rect', { x: FX - 16, y: 204, width: 32, height: 14, rx: 3, fill: '#5A5F66' }, g);
    const th = K.thermometer(g, FX, 112, 240, { max: 110 });
    k.readout('t', FX + 46, 132, '20 °C');
    const cd = condenser(g, FX + 62, 258, 540, 374);
    const rec = K.conical(g, 612, 446, 100, 96, { neck: 34, color: C.water });
    S('path', { class: 'glass-line', d: `M540,374 Q584,390 606,404` }, g);
    K.stand(g, 440, 446, 250, 328, 410);
    k.label('thermometer', FX - 36, 128, FX - 6, 128, { anchor: 'end', layer: g, fade: false });
    k.label('round-bottomed flask', FX + 66, 376, FX + 36, 360, { anchor: 'start', layer: g, fade: false });
    k.label('condenser', 390, 248, 390, 292, { anchor: 'middle', layer: g, fade: false });
    k.label('distillate', 676, 424, 650, 424, { anchor: 'start', layer: g, fade: false });
    k.label('seawater', FX - 64, 338, FX - 40, 338, { anchor: 'end', layer: g, fade: false });

    /* step 1: which way does the cold water go? */
    const low = cd.lowNozzle, high = cd.highNozzle;
    for (;;) {
      k.step(1, 4, 'The condenser has a jacket for cold tap water. Which end does the cold water go IN?');
      const c = await k.choose([
        { id: 'low', x: low[0], y: low[1] + 34, label: 'IN at the lower end', side: 'b' },
        { id: 'high', x: high[0], y: high[1] - 30, label: 'IN at the upper end', side: 't' }
      ]);
      const hoses = S('g', null, g);
      const lowHose = [low, [low[0], 430], [low[0] - 70, 430]], highHose = [high, [high[0], high[1] - 36], [high[0] + 70, high[1] - 36]];
      hose(hoses, lowHose); hose(hoses, highHose);
      if (c === 'high') {
        const tIn = k.label('cold water in', high[0] + 76, high[1] - 32, null, null, { anchor: 'start' });
        const tOut = k.label('water out', low[0] - 76, 434, null, null, { anchor: 'end' });
        await k.tween(1500, t => cd.trickle(t));
        await k.oops('The water runs straight down along the bottom and out. The jacket <b>never fills</b>, so most of the vapour is not cooled and escapes. Cold water must go in at the <b>lower</b> end.');
        hoses.remove(); tIn.remove(); tOut.remove(); cd.trickle(0); cd.fill(0);
        continue;
      }
      k.label('cold water in', low[0] - 76, 434, null, null, { anchor: 'end', layer: g });
      k.label('water out', high[0] + 76, high[1] - 32, null, null, { anchor: 'start', layer: g });
      await k.tween(1600, t => cd.fill(t));
      break;
    }
    k.step(2, 4, 'The jacket is full of cold water. Light the Bunsen and heat the seawater. Watch the thermometer.');
    await k.choose([{ id: 'l', x: FX + 52, y: 420, label: 'Light the Bunsen', side: 'r' }]);
    bun.on(true);
    let T = 20;
    await k.tween(2500, t => { T = 20 + 80 * t; th.set(T); k.readout('t', FX + 46, 132, Math.round(T) + ' °C'); });
    const bub = K.bubbles(g, k, FX - 30, FX + 30, FY + FR - 8, () => fl.liq.y());
    k.step(3, 4, 'The water boils. The vapour rises, passes the thermometer and goes into the condenser, where it condenses. The distillate drips into the flask.');
    const fw = flow(k, g, [[FX, FY - 10], [FX, 240], [FX + 30, 248], [FX + 64, 260], cd.W(150, 0), cd.W(cd.L, 0), [540, 374], [590, 394], [606, 412]],
      { cond: .45, speed: .28 });
    k.lapse('30 minutes in a few seconds');
    await k.tween(5000, t => {
      fl.liq.set(.62 - .4 * t); rec.liq.set(.32 * t);
      if (Math.random() < .25 && salt.childNodes.length < 40) S('rect', { x: FX - 30 + Math.random() * 60, y: FY + FR - 8 - Math.random() * 8, width: 3, height: 3, fill: C.salt, stroke: '#999', 'stroke-width': .4 }, salt);
    });
    k.lapse(null);
    k.say('Drops of distillate are falling. Read the thermometer (the red box) while they fall. The seawater in the flask is getting saltier.');
    await k.choose([{ id: 'off', x: FX + 52, y: 420, label: 'Turn off the Bunsen', sub: 'before the flask boils dry', side: 'r' }]);
    bun.on(false); bub.stop(); fw.stop();
    await k.tween(1500, t => { T = 100 - 60 * t; th.set(T); k.readout('t', FX + 46, 132, Math.round(T) + ' °C'); });
    k.step(4, 4, 'Is the distillate pure water? Put a drop on a watch glass and let it evaporate.');
    await k.choose([{ id: 't', x: 612, y: 320, label: 'Test a drop of the distillate', side: 't' }]);
    const lz = K.lens(k.top, 640, 186, 70, 'Nothing left on the glass', 'the distillate is pure water');
    S('rect', { x: 570, y: 116, width: 140, height: 140, fill: '#EAF3FB' }, lz.inner);
    S('path', { d: 'M592,190 Q640,214 688,190', fill: 'none', stroke: '#6E8296', 'stroke-width': 3 }, lz.inner);
    const drop = S('ellipse', { cx: 640, cy: 197, rx: 18, ry: 4, fill: C.water, opacity: .95 }, lz.inner);
    k.lapse('ten minutes in a few seconds');
    await k.tween(2000, t => { drop.setAttribute('rx', 18 - 6 * t); drop.setAttribute('opacity', .95 * (1 - t)); });
    k.lapse(null);
    k.finish('Nothing was left on the watch glass: the distillate is <b>pure water</b>. The salt stayed in the flask. Distillation keeps the liquid; evaporation loses it.');
  }

  /* ---------------- fractional distillation (extension) ---------------- */
  async function fracRun(k) {
    const g = k.svg, FX = 150, FY = 340, FR = 46;
    const bun = K.bunsen(g, FX, 446, { flame: 22, h: 30 });
    K.tripod(g, FX, 446, 396, 104);
    K.stand(g, 64, 446, 380, 240, FX - 12);
    const fl = K.rbFlask(g, FX, FY, FR, 268, { color: C.ethanol, level: .6 });
    /* the fractionating column: a tall tube of glass beads */
    S('rect', { x: FX - 13, y: 140, width: 26, height: 128, rx: 4, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 2.2 }, g);
    for (let y = 150; y < 262; y += 9) for (let x = FX - 8; x <= FX + 8; x += 8) S('circle', { cx: x + ((y / 9) % 2) * 3, cy: y, r: 3.4, fill: 'none', stroke: 'var(--glass)', 'stroke-width': 1 }, g);
    S('path', { class: 'glass-line', d: `M${FX + 13},${150} L${FX + 50},${168}` }, g);
    S('path', { class: 'glass-line', d: `M${FX + 13},${162} L${FX + 46},${178}` }, g);
    const th = K.thermometer(g, FX, 60, 156, { max: 110 });
    S('rect', { x: FX - 15, y: 128, width: 30, height: 12, rx: 3, fill: '#5A5F66' }, g);
    k.readout('t', FX + 44, 80, '20 °C');
    const cd = condenser(g, FX + 48, 172, 470, 300);
    const lowN = cd.lowNozzle, highN = cd.highNozzle;
    hose(g, [lowN, [lowN[0], lowN[1] + 24], [lowN[0] + 50, lowN[1] + 24]]);
    hose(g, [highN, [highN[0], highN[1] - 30], [highN[0] + 50, highN[1] - 30]]);
    cd.fill(1);
    S('path', { class: 'glass-line', d: `M470,300 Q492,310 496,330` }, g);
    const bA = K.beaker(g, 500, 446, 70, 84, { color: '#CFE9F7' }), bBw = S('g', null, g), bB = K.beaker(bBw, 600, 446, 70, 84, { color: C.water });
    S('text', { x: 500, y: 350, 'text-anchor': 'middle', class: 'lbl' }, bA.g, 'beaker 1');
    S('text', { x: 600, y: 350, 'text-anchor': 'middle', class: 'lbl' }, bB.g, 'beaker 2');
    k.label('fractionating column', FX + 30, 256, FX + 14, 256, { anchor: 'start', layer: g, fade: false });
    k.label('ethanol and water', FX + 60, 348, FX + 40, 348, { anchor: 'start', layer: g, fade: false });
    /* the graph */
    const GX = 560, GY = 70, GW = 210, GH = 150;
    const gr = S('g', null, g);
    S('rect', { x: GX - 44, y: GY - 26, width: GW + 60, height: GH + 74, rx: 10, fill: 'var(--sheet)', stroke: 'var(--rule)' }, gr);
    S('line', { x1: GX, y1: GY + GH, x2: GX + GW, y2: GY + GH, stroke: 'var(--ink3)', 'stroke-width': 1.4 }, gr);
    S('line', { x1: GX, y1: GY, x2: GX, y2: GY + GH, stroke: 'var(--ink3)', 'stroke-width': 1.4 }, gr);
    const ty = T => GY + GH - (T - 20) / 90 * GH;
    [20, 40, 60, 78, 100].forEach(T => { S('line', { x1: GX - 4, y1: ty(T), x2: GX, y2: ty(T), stroke: 'var(--ink3)' }, gr); S('text', { x: GX - 7, y: ty(T) + 4, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: 'var(--ink2)' }, gr, T); });
    [78, 100].forEach(T => S('line', { x1: GX, y1: ty(T), x2: GX + GW, y2: ty(T), stroke: 'var(--rule2)', 'stroke-dasharray': '3 4' }, gr));
    S('text', { x: GX + GW / 2, y: GY + GH + 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--ink2)' }, gr, 'time');
    S('text', { x: GX - 34, y: GY - 10, 'font-size': 12, 'font-weight': 800, fill: 'var(--ink2)' }, gr, 'temperature / °C');
    const line = S('polyline', { points: '', fill: 'none', stroke: '#D22F27', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, gr);
    const TT = 15, temp = t => t < 3 ? 20 + 58 * t / 3 : t < 8 ? 78 : t < 12 ? 78 + 22 * (t - 8) / 4 : 100;
    const draw = t => { const pts = []; for (let s = 0; s <= t; s += .1) pts.push((GX + s / TT * GW).toFixed(1) + ',' + ty(temp(s)).toFixed(1)); line.setAttribute('points', pts.join(' ')); };

    k.step(1, 3, 'Ethanol boils at 78 °C, water at 100 °C. Light the Bunsen and watch the thermometer and the graph.');
    await k.choose([{ id: 'l', x: FX + 70, y: 420, label: 'Light the Bunsen', side: 'r' }]);
    bun.on(true);
    if (k.FAST) { draw(TT); th.set(100); k.readout('t', FX + 44, 80, '100 °C'); bA.liq.set(.3); bB.liq.set(.3); k.finish('Ethanol collected first, at 78 °C; water came over at 100 °C.'); return; }
    for (;;) {
      let t = 0, swapped = false, late = null;
      const lateP = new Promise(res => { late = res; });
      bA.liq.set(0); bB.liq.set(0); bBw.setAttribute('transform', ''); bA.g.setAttribute('transform', '');
      const drip = K.drips(g, k, 496, 332, () => (swapped ? bB : bA).liq.y(), { color: '#CFE9F7', every: .3 });
      k.lapse('40 minutes in 15 seconds');
      k.step(2, 3, 'When the ethanol has all boiled off, the temperature starts to rise. Change the beaker <b>then</b>, not before.');
      k.loop(dt => {
        if (swapped === 'done') return false;
        t += dt; const T = temp(t);
        th.set(T); k.readout('t', FX + 44, 80, Math.round(T) + ' °C'); draw(Math.min(t, TT));
        if (t > 3 && t < 8) bA.liq.set(Math.min(.42, (t - 3) / 5 * .42));
        if (T > 95 && !swapped) { swapped = 'late'; late(); return false; }
        return t < TT + 1;
      });
      const r = await Promise.race([k.choose([{ id: 'swap', x: 550, y: 330, label: 'Change the beaker', side: 'r' }]).then(() => 'press'), lateP.then(() => 'late')]);
      if (r === 'late' || t < 8) {
        swapped = 'done'; drip.stop(); k.clearHots(); k.lapse(null);
        if (r === 'late') bA.liq.color('#A6D2F0');
        await k.oops(r === 'late'
          ? 'Too late: the temperature passed 78 °C and water vapour came over too. Beaker 1 now holds ethanol <b>and</b> water.'
          : 'Too early: the temperature was still 78 °C, so ethanol was still coming over. You lost some ethanol into beaker 2.');
        bA.liq.color('#CFE9F7'); draw(0); th.set(20); k.readout('t', FX + 44, 80, '20 °C');
        continue;
      }
      swapped = true;
      await k.tween(900, x => { bA.g.setAttribute('transform', `translate(${200 * Math.min(1, x * 2)} 0)`); bBw.setAttribute('transform', `translate(${-100 * Math.max(0, x * 2 - 1)} 0)`); });
      k.step(3, 3, 'Good timing. Now water collects in beaker 2 at 100 °C.');
      await k.tween(4500, x => bB.liq.set(.3 * x));
      swapped = 'done'; drip.stop(); k.lapse(null);
      break;
    }
    bun.on(false);
    k.finish('Ethanol (boiling point 78 °C) came over first and the temperature stayed at 78 °C. When it rose, the ethanol was gone, and water followed at 100 °C.');
  }

  B.define(4, [
    { id: 'simple', name: 'Simple distillation', title: 'Pure water from seawater', view: [40, 70, 720], task: { id: 'p4-sim', title: 'Bench: distilled seawater' }, run: simpleRun,
      alt: 'A round-bottomed flask of seawater over a Bunsen burner, a thermometer at the side arm, a sloping condenser with a cold-water jacket, and a flask to collect the distillate.' },
    { id: 'frac', name: 'Fractional', ext: true, title: 'Fractional distillation of ethanol and water', kicker: 'Extension · the bench', view: [20, 20, 780], task: { id: 'p4-sim-frac', title: 'Bench: fractional distillation (extension)' }, run: fracRun,
      alt: 'A flask of ethanol and water under a column of glass beads, a condenser, two beakers and a graph of temperature against time.' }
  ]);
})();
