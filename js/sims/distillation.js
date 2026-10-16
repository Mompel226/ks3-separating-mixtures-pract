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
    /* salt left in the flask as the water boils off: a crust on the curved bottom, n specks in all */
    const saltTo = n => { while (salt.childNodes.length < n) { const dx = (Math.random() - .5) * 2 * (FR - 14); S('rect', { x: FX + dx - 1.5, y: FY + Math.sqrt(Math.max(0, (FR - 4) * (FR - 4) - dx * dx)) - 4 - Math.random() * 3, width: 3, height: 3, fill: C.salt, stroke: '#999', 'stroke-width': .4 }, salt); } };
    /* the side arm, the stopper and the thermometer (its bulb level with the side arm) */
    S('path', { class: 'glass-line', d: `M${FX + 13},${232} L${FX + 64},${254}` }, g);
    S('path', { class: 'glass-line', d: `M${FX + 13},${244} L${FX + 60},${264}` }, g);
    S('rect', { x: FX - 16, y: 204, width: 32, height: 14, rx: 3, fill: '#5A5F66' }, g);
    const th = K.thermometer(g, FX, 112, 240, { max: 110 });
    k.readout('t', FX + 46, 132, '20 °C');
    /* the condenser's lower end is above the receiving flask's mouth, so the outlet drops straight into it */
    const cd = condenser(g, FX + 62, 258, 520, 350);
    const rec = K.conical(g, 604, 446, 96, 72, { neck: 30, color: '#CFE6F6' });
    S('path', { class: 'glass-line', d: `M520,350 Q596,348 604,364 L604,394` }, g);
    K.stand(g, 440, 446, 250, 314, 420);
    k.label('thermometer', FX - 36, 128, FX - 5, 128, { anchor: 'end', layer: g, fade: false });
    k.label('round-bottomed flask', FX + 66, 378, FX + 32, FY + 38, { anchor: 'start', layer: g, fade: false });
    k.label('condenser', 390, 248, 390, 292, { anchor: 'middle', layer: g, fade: false });
    k.label('distillate', 676, 432, 638, 432, { anchor: 'start', layer: g, fade: false });
    let seaLab = k.label('seawater', FX - 64, 338, FX - 40, 338, { anchor: 'end', layer: g, fade: false });
    /* the label follows the liquid down as it boils away: level with the middle of what is left, its line ending inside it */
    const relabelSea = text => { seaLab.remove(); const y = (fl.liq.y() + FY + FR - 2) / 2, hw = Math.sqrt(Math.max(0, FR * FR - (y - FY) * (y - FY))); seaLab = k.label(text, FX - 64, y, FX - hw + 6, y, { anchor: 'end', layer: g, fade: false }); };

    /* step 1: which way does the cold water go? A wrong choice runs on to its real outcome (Daniel, 15 Oct 2026: "make sure
       that the wrong decisions lead to the wrong outcomes"): steam leaves the end of the condenser, almost no distillate. */
    const low = cd.lowNozzle, high = cd.highNozzle;
    k.step(1, 4, 'The condenser has a jacket for cold tap water. Which end does the cold water go IN?');
    const c = await k.choose([
      { id: 'low', x: low[0], y: low[1] + 34, label: 'IN at the lower end', side: 'b' },
      { id: 'high', x: high[0], y: high[1] - 30, label: 'IN at the upper end', side: 't' }
    ]);
    const wrong = c === 'high';
    const hoses = S('g', null, g);
    hose(hoses, [low, [low[0], 430], [low[0] - 70, 430]]); hose(hoses, [high, [high[0], high[1] - 36], [high[0] + 70, high[1] - 36]]);
    k.label(wrong ? 'water out' : 'cold water in', low[0] - 76, 434, null, null, { anchor: 'end', layer: g });
    k.label(wrong ? 'cold water in' : 'water out', high[0] + 76, high[1] - 32, null, null, { anchor: 'start', layer: g });
    if (wrong) await k.tween(1500, t => cd.trickle(t)); else await k.tween(1600, t => cd.fill(t));
    k.step(2, 4, (wrong ? 'Cold water is running through the condenser.' : 'The jacket is full of cold water.') + ' Light the Bunsen and heat the seawater. Watch the thermometer.');
    await k.choose([{ id: 'l', x: FX, y: 484, label: 'Light the Bunsen' }]);
    bun.on(true);
    let T = 20;
    /* the bulb is at the side arm: it stays near room temperature until the steam reaches it, then climbs fast to 100 °C */
    await k.tween(2500, t => { T = t < .65 ? 20 + 8 * t : 25 + 75 * (t - .65) / .35; th.set(T); k.readout('t', FX + 46, 132, Math.round(T) + ' °C'); });
    const bub = K.bubbles(g, k, FX - 30, FX + 30, FY + FR - 8, () => fl.liq.y());
    const path = [[FX, FY - 10], [FX, 240], [FX + 30, 248], [FX + 64, 260], cd.W(150, 0), cd.W(cd.L, 0), [520, 350], [594, 351], [604, 366], [604, 404]];
    if (wrong) {
      k.step(3, 4, 'The water boils and the vapour goes into the condenser. Watch the end of the condenser.');
      const fw = flow(k, g, path.slice(0, 7), { cond: 2, speed: .3 });
      const puff = K.steam(g, k, 528, 346, { spread: 12, drift: 40, every: .06, speed: 30 });
      const few = K.drips(g, k, 604, 400, () => rec.liq.y(), { color: C.water, every: 2.2 });
      k.lapse('30 minutes in a few seconds');
      await k.tween(4000, t => { fl.liq.set(.62 - .35 * t); rec.liq.set(.03 * t); });
      k.lapse(null); fw.stop(); puff.stop(); few.stop(); bun.on(false); bub.stop(); relabelSea('seawater');
      k.label('steam escaping', 600, 306, 532, 338, { anchor: 'start' });
      await k.oops('Steam came out of the end of the condenser and only a few drops of distillate were collected. The jacket did not fill with cold water, so the vapour was not cooled enough. Cold water must go IN at the <b>lower</b> end.');
      k.restart(); return;
    }
    k.step(3, 4, 'The water boils. The vapour rises, passes the thermometer and goes into the condenser, where it condenses. The distillate drips into the flask.');
    const fw = flow(k, g, path, { cond: .45, speed: .28 });
    k.lapse('30 minutes in a few seconds');
    await k.tween(5000, t => {
      fl.liq.set(.62 - .4 * t); rec.liq.set(.32 * t); saltTo(Math.floor(14 * t));
    });
    k.lapse(null); relabelSea('salty water');
    k.say('Drops of distillate are falling. Read the thermometer (the red box) while they fall. The seawater in the flask is getting saltier. What now?');
    const c2 = await k.choose([
      { id: 'off', x: FX + 56, y: 486, label: 'Turn off the Bunsen', sub: 'while some is left', side: 'l' },
      { id: 'dry', x: FX + 72, y: 486, label: 'Keep heating', sub: 'until the flask is dry', side: 'r' }
    ]);
    if (c2 === 'dry') {
      await k.tween(2600, t => { fl.liq.set(.22 * (1 - t)); rec.liq.set(.32 + .1 * t); T = 100 + 60 * Math.max(0, t - .7) / .3; th.set(Math.min(110, T)); k.readout('t', FX + 46, 132, Math.round(T) + ' °C'); saltTo(14 + Math.floor(70 * t)); });
      seaLab.remove(); k.label('salt baked onto the glass', FX + 66, 410, FX + 24, FY + FR - 6, { anchor: 'start' });
      fw.stop(); bub.stop();
      S('path', { d: `M${FX - 30},${FY + 20} l10,8 l-4,10 l12,6 l-2,9 M${FX + 18},${FY + 30} l-8,6 l6,8`, stroke: '#1B1B1B', 'stroke-width': 2, fill: 'none', 'stroke-linejoin': 'round' }, g);
      bun.on(false);
      const dz = K.danger(k.top, 556, 84, 'DANGER: a flask heated\ndry can crack');
      await k.oops('<b>Crack!</b> The flask boiled dry: the salt baked onto the glass, and the hot, empty flask cracked. Turn off the Bunsen while some liquid is still in the flask.');
      dz.remove(); k.restart(); return;
    }
    bun.on(false); bub.stop(); fw.stop();
    await k.tween(1500, t => { T = 100 - 60 * t; th.set(T); k.readout('t', FX + 46, 132, Math.round(T) + ' °C'); });
    k.step(4, 4, 'Is the distillate pure water? Put a drop on a watch glass and let it evaporate.');
    await k.choose([{ id: 't', x: 640, y: 318, label: 'Test a drop of the distillate', side: 't' }]);
    const lz = K.lens(k.top, 640, 186, 70, 'Nothing left on the glass', 'the distillate is pure water');
    S('rect', { x: 570, y: 116, width: 140, height: 140, fill: '#EAF3FB' }, lz.inner);
    S('path', { d: 'M592,190 Q640,214 688,190', fill: 'none', stroke: '#6E8296', 'stroke-width': 3 }, lz.inner);
    const drop = S('ellipse', { cx: 640, cy: 197, rx: 18, ry: 4, fill: C.water, opacity: .95 }, lz.inner);
    k.lapse('ten minutes in a few seconds');
    await k.tween(2000, t => { drop.setAttribute('rx', 18 - 6 * t); drop.setAttribute('opacity', .95 * (1 - t)); });
    k.lapse(null);
    k.finish('Nothing was left on the watch glass: the distillate is <b>pure water</b>. The salt stayed in the flask. Distillation keeps the liquid; evaporation loses it.');
  }

  /* an electric heater (a heating mantle): ethanol catches fire easily, so schools never heat it with a flame (15 Oct 2026
     audit; the page's two distillation photos show such heaters). Drawn after the flask, so the flask sits in it. */
  function heater(p, x, by, w, top) {
    const g = S('g', null, p);
    S('rect', { x: x - w / 2, y: top, width: w, height: by - top, rx: 10, fill: '#3E79B7', stroke: '#24496E', 'stroke-width': 2 }, g);
    S('rect', { x: x - w / 2, y: top, width: w, height: 11, rx: 5, fill: '#2B2F35' }, g);
    const glow = S('rect', { x: x - w / 2 + 8, y: top + 2, width: w - 16, height: 5, rx: 2.5, fill: '#FF8A3D', opacity: 0 }, g);
    S('circle', { cx: x - w / 2 + 18, cy: by - 20, r: 7, fill: '#DDE3EA', stroke: '#24496E', 'stroke-width': 1.5 }, g);
    S('line', { x1: x - w / 2 + 18, y1: by - 20, x2: x - w / 2 + 21, y2: by - 25, stroke: '#24496E', 'stroke-width': 2 }, g);
    const lamp = S('circle', { cx: x + w / 2 - 16, cy: by - 20, r: 4.5, fill: '#5A2020' }, g);
    return { g, on(v) { glow.setAttribute('opacity', v ? .9 : 0); lamp.setAttribute('fill', v ? '#FF3B30' : '#5A2020'); } };
  }

  /* ---------------- fractional distillation (extension) ---------------- */
  async function fracRun(k) {
    const g = k.svg, FX = 150, FY = 340, FR = 46;
    K.stand(g, 64, 446, 380, 240, FX - 12);
    const fl = K.rbFlask(g, FX, FY, FR, 268, { color: C.ethanol, level: .6 });
    const bun = heater(g, FX, 446, 124, 376);
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
    k.label('fractionating column', FX + 30, 256, FX + 13, 256, { anchor: 'start', layer: g, fade: false });
    let mixLab = k.label('ethanol and water', FX + 60, 348, FX + 40, 348, { anchor: 'start', layer: g, fade: false });
    const relabelMix = text => { mixLab.remove(); const y = (fl.liq.y() + FY + FR - 2) / 2, hw = Math.sqrt(Math.max(0, FR * FR - (y - FY) * (y - FY))); mixLab = k.label(text, FX + 60, y, FX + hw - 6, y, { anchor: 'start', layer: g, fade: false }); };
    /* the graph */
    const GX = 560, GY = 70, GW = 210, GH = 150;
    const gr = S('g', null, g);
    S('rect', { x: GX - 44, y: GY - 26, width: GW + 60, height: GH + 74, rx: 10, fill: 'var(--sheet)', stroke: 'var(--rule)' }, gr);
    S('line', { x1: GX, y1: GY + GH, x2: GX + GW, y2: GY + GH, stroke: 'var(--ink3)', 'stroke-width': 1.4 }, gr);
    S('line', { x1: GX, y1: GY, x2: GX, y2: GY + GH, stroke: 'var(--ink3)', 'stroke-width': 1.4 }, gr);
    const ty = T => GY + GH - (T - 20) / 90 * GH;
    [20, 40, 60, 78, 100].forEach(T => { S('line', { x1: GX - 4, y1: ty(T), x2: GX, y2: ty(T), stroke: 'var(--ink3)' }, gr); S('text', { x: GX - 7, y: ty(T) + 4, 'text-anchor': 'end', 'font-size': 15.5, 'font-weight': 700, fill: 'var(--ink2)' }, gr, T); });
    [78, 100].forEach(T => S('line', { x1: GX, y1: ty(T), x2: GX + GW, y2: ty(T), stroke: 'var(--rule2)', 'stroke-dasharray': '3 4' }, gr));
    S('text', { x: GX + GW / 2, y: GY + GH + 22, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: 'var(--ink2)' }, gr, 'time');
    S('text', { x: GX - 34, y: GY - 10, 'font-size': 16, 'font-weight': 800, fill: 'var(--ink2)' }, gr, 'temperature / °C');
    const line = S('polyline', { points: '', fill: 'none', stroke: '#D22F27', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, gr);
    const TT = 15, temp = t => t < 2 ? 20 + 2 * t : t < 3 ? 24 + 54 * (t - 2) : t < 8 ? 78 : t < 12 ? 78 + 22 * (t - 8) / 4 : 100;   /* the vapour reaches the bulb at 2 s */
    const draw = t => { const pts = []; for (let s = 0; s <= t; s += .1) pts.push((GX + s / TT * GW).toFixed(1) + ',' + ty(temp(s)).toFixed(1)); line.setAttribute('points', pts.join(' ')); };

    k.step(1, 3, 'Ethanol boils at 78 °C, water at 100 °C. Ethanol catches fire easily, so it is heated with an electric heater, never a flame. Switch on the heater and watch the thermometer and the graph.');
    await k.choose([{ id: 'l', x: FX + 76, y: 420, label: 'Switch on the heater', side: 'r' }]);
    bun.on(true);
    if (k.FAST) { draw(TT); th.set(100); k.readout('t', FX + 44, 80, '100 °C'); bA.liq.set(.3); bB.liq.set(.3); fl.liq.set(.3); relabelMix('water left'); k.finish('Ethanol collected first, at 78 °C; water followed at 100 °C.'); return; }
    for (;;) {
      let t = 0, swapped = false, late = null;
      const lateP = new Promise(res => { late = res; });
      bA.liq.set(0); bB.liq.set(0); fl.liq.set(.6); bBw.setAttribute('transform', ''); bA.g.setAttribute('transform', ''); relabelMix('ethanol and water');
      let drip = null;                                                  /* no drops until the ethanol boils (3 s, 78 °C) */
      const dripStop = () => { if (drip) drip.stop(); };
      k.lapse('40 minutes in 15 seconds');
      k.step(2, 3, 'When almost no ethanol is left in the flask, the temperature starts to rise. Change the beaker <b>then</b>, not before.');
      k.loop(dt => {
        if (swapped === 'done') return false;
        t += dt; const T = temp(t);
        if (t > 3 && !drip) drip = K.drips(g, k, 496, 332, () => (swapped ? bB : bA).liq.y(), { color: '#CFE9F7', every: .3 });
        th.set(T); k.readout('t', FX + 44, 80, Math.round(T) + ' °C'); draw(Math.min(t, TT));
        if (t > 3 && t < 8) bA.liq.set(Math.min(.42, (t - 3) / 5 * .42));
        if (t > 3) fl.liq.set(.6 - .3 * Math.min(1, (t - 3) / (TT - 3)));      /* the flask empties as both liquids boil off */
        if (T > 95 && !swapped) { swapped = 'late'; late(); return false; }
        return t < TT + 1;
      });
      const r = await Promise.race([k.choose([{ id: 'swap', x: 550, y: 330, label: 'Change the beaker', side: 'r' }], { ask: 'Watch the thermometer. Change the beaker when the temperature starts to rise.', at: 'swap' }).then(() => 'press'), lateP.then(() => 'late')]);
      if (r === 'late' || t < 8) {
        swapped = 'done'; dripStop(); k.clearHots(); k.lapse(null); relabelMix(r === 'late' ? 'water left' : 'ethanol and water');
        if (r === 'late') bA.liq.color('#A6D2F0');
        await k.oops(r === 'late'
          ? 'Too late: the temperature reached almost 100 °C, so water vapour reached beaker 1 too. Beaker 1 now holds ethanol <b>and</b> water.'
          : 'Too early: the temperature was still 78 °C, so ethanol was still reaching the beaker. You lost some ethanol into beaker 2.');
        bA.liq.color('#CFE9F7'); draw(0); th.set(20); k.readout('t', FX + 44, 80, '20 °C');
        continue;
      }
      swapped = true;
      await k.tween(900, x => { bA.g.setAttribute('transform', `translate(${200 * Math.min(1, x * 2)} 0)`); bBw.setAttribute('transform', `translate(${-100 * Math.max(0, x * 2 - 1)} 0)`); });
      k.step(3, 3, 'Good timing. Now water collects in beaker 2 at 100 °C.');
      await k.tween(4500, x => bB.liq.set(.3 * x));
      swapped = 'done'; dripStop(); k.lapse(null); relabelMix('water left');
      break;
    }
    bun.on(false);
    k.finish('Ethanol (boiling point 78 °C) reached the beaker first, while the temperature stayed at 78 °C. When the temperature rose, almost no ethanol was left in the flask, and water followed at 100 °C.');
  }

  B.define(4, [
    { id: 'simple', name: 'Simple distillation', title: 'Pure water from seawater', view: [20, 70, 740], task: { id: 'p4-sim', title: 'Bench: distilled seawater' }, run: simpleRun,
      alt: 'A round-bottomed flask of seawater over a Bunsen burner, a thermometer at the side arm, a sloping condenser with a cold-water jacket, and a flask to collect the distillate.' },
    { id: 'frac', name: 'Fractional', ext: true, title: 'Fractional distillation of ethanol and water', kicker: 'Extension · the bench', view: [20, 20, 780], task: { id: 'p4-sim-frac', title: 'Bench: fractional distillation (extension)' }, run: fracRun,
      alt: 'A flask of ethanol and water in an electric heater, under a column of glass beads, a condenser, two beakers and a graph of temperature against time.' }
  ]);
})();
