/* Part 6 · Decanting and the separating funnel (15 Oct 2026). Decanting: wait for the sand to settle, then press and
   hold to tip the beaker; tip too far and the sand goes over. Separating funnel: the stopper first (the mistake on offer:
   the tap first, and it stops after a few drops), then hold the tap open and close it as the boundary reaches the tap. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S, C = K.C;

  /* ---------------- decanting ---------------- */
  async function decantRun(k) {
    const g = k.svg;
    S('rect', { x: 236, y: 400, width: 120, height: 46, rx: 4, fill: '#8C7A62', stroke: '#5E5140' }, g);   /* a wooden block */
    const wrap = S('g', null, g);
    const b1 = K.beaker(wrap, 300, 400, 104, 130, { color: '#7A5430', level: .72, opacity: .82 });
    const sandG = S('g', null, b1.g);
    const sand = S('rect', { x: 250, y: 396, width: 100, height: 0, fill: C.sand, rx: 2 }, sandG);
    const b2 = K.beaker(g, 470, 446, 104, 120, { color: C.water });
    const sand2 = S('rect', { x: 420, y: 444, width: 100, height: 0, fill: C.sand }, b2.g);
    K.glassRod(g, 362, 262, 452, 432);
    k.label('glass rod', 470, 300, 382, 300, { anchor: 'start', layer: g, fade: false });
    k.step(1, 2, 'Muddy water: sand stirred into water. First, let the sand settle to the bottom.');
    await k.choose([{ id: 'w', x: 300, y: 236, label: 'Wait for the sand to settle' }]);
    k.lapse('ten minutes in a few seconds');
    await k.tween(2200, t => { b1.liq.color(t < .35 ? '#7A5430' : t < .7 ? '#A99A82' : '#BCD7EA'); b1.liq.opacity(.82 - .1 * t); sand.setAttribute('y', 396 - 22 * t); sand.setAttribute('height', 22 * t); });
    b1.liq.color('#BCD7EA'); k.lapse(null);
    const sandLabel = k.label('sand', 220, 386, 254, 386, { anchor: 'end', layer: g });
    /* the physics: holding tips the beaker further; letting go keeps the angle, so water keeps flowing until its
       level falls below the lip. Water reaches the lip past an angle that rises as the beaker empties; the settled
       sand reaches it only past 74°. */
    const sx = b1.x1 + 6, sy = b1.ty - 3;
    let tilt = 0, held = false, w = .72, poured = 0, sandOut = 0, done = false;
    const W0 = .72, th = () => 18 + (1 - w / W0) * 52;
    const st = K.stream(g, [[sx, sy], [sx + 14, sy + 8], [380, 296]], C.water, 5);
    const paint = () => {
      wrap.setAttribute('transform', `rotate(${tilt} ${sx} ${sy})`); b1.liq.tilt(tilt, sx, sy); b1.liq.set(w);
      sandLabel.setAttribute('opacity', tilt < 3 ? 1 : 0);          /* the label stays only while the beaker stands still */
      b2.liq.set(Math.min(.62, poured * .85));
      st.grow((tilt > th() && w > .02) || tilt > 74 ? 1 : 0);
    };
    const flowStep = dt => {
      const f = Math.max(0, tilt - th()) * .012;
      if (w > .02 && f > 0) { const dw = Math.min(w, f * dt); w -= dw; poured += dw; }
      if (tilt > 74) { sandOut += dt; sand2.setAttribute('y', 444 - Math.min(14, sandOut * 30)); sand2.setAttribute('height', Math.min(14, sandOut * 30)); st.path.setAttribute('stroke', C.mud); } else st.path.setAttribute('stroke', C.water);
      paint();
    };
    const tip = dt => { tilt = Math.min(88, tilt + 25 * dt); flowStep(dt); };
    paint();
    if (!k.FAST) k.loop(dt => { if (!held && tilt > 0) flowStep(dt); return !done; });
    const settle = () => { if (k.FAST) for (let i = 0; i < 300; i++) flowStep(1 / 30); };
    for (;;) {
      k.step(2, 2, 'Pour the water slowly into the other beaker. <b>Hold</b> to tip the beaker further; let go to keep it there. Stop before the sand reaches the lip.');
      const c = await k.choose([
        { id: 'tip', x: 300, y: 214, label: 'Hold to tip further', onHold: tip, onPress: v => { held = v; if (!v) settle(); }, fastHold: 2.6 },
        { id: 'back', x: 300, y: 482, label: 'Tip it back' },
        { id: 'done', x: 560, y: 482, label: 'Finished pouring' }
      ]);
      held = false;
      if (c === 'back') { await k.tween(500, t => { tilt *= (1 - t); paint(); }); tilt = 0; paint(); if (sandOut <= .25) continue; }
      if (sandOut > .25) {
        await k.oops('You tipped too far: <b>sand went over</b> into the clean beaker. Tip slowly and stop while a little water is still above the sand.');
        tilt = 0; w = W0; poured = 0; sandOut = 0; sand2.setAttribute('height', 0); paint();
        continue;
      }
      if (c === 'done' && w > .2) { k.note('There is still a lot of water above the sand. Tip a little further.'); await k.wait(1600); continue; }
      if (c === 'done') break;
    }
    await k.tween(500, t => { tilt *= (1 - t); paint(); });
    done = true; tilt = 0; paint();
    k.finish('Most of the water is in the clean beaker; the sand stayed behind. A little water is always left with the sand: decanting is quick but not perfect, so filtration often comes next.');
  }

  /* ---------------- the separating funnel ---------------- */
  const FX = 400, Y0 = 118, Y1 = 334;
  const hw = y => y < 138 ? 11 : y < 196 ? 11 + 49 * Math.sin(Math.PI / 2 * (y - 138) / 58) : y < 224 ? 60 : Math.max(5, 60 - 55 * (y - 224) / (Y1 - 224));
  const vol = y => { let v = 0; for (let yy = Math.max(Y0, y); yy < Y1; yy += 1) v += 2 * hw(yy); return v; };   /* from y down to the tip */
  const yAt = v => { let lo = Y0, hi = Y1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (vol(m) > v) lo = m; else hi = m; } return (lo + hi) / 2; };
  function body() {
    const L = [], R = [];
    for (let y = Y0; y <= Y1; y += 4) { L.push([FX - hw(y), y]); R.push([FX + hw(y), y]); }
    return 'M' + L.map(p => p.join(',')).join(' L') + ' L' + R.reverse().map(p => p.join(',')).join(' L') + ' Z';
  }
  async function funnelRun(k) {
    const g = k.svg, bd = body();
    K.stand(g, 250, 446, 340, 226, FX - 58);
    S('ellipse', { cx: FX, cy: 226, rx: 64, ry: 7, fill: 'none', stroke: 'var(--metal)', 'stroke-width': 4 }, g);
    const cid = K.id('sf'), defs = S('defs', null, g), cp = S('clipPath', { id: cid }, defs); S('path', { d: bd }, cp);
    const fill = S('g', { 'clip-path': `url(#${cid})` }, g);
    const oil = S('rect', { x: FX - 70, y: 0, width: 140, height: 0, fill: C.oil, opacity: .88 }, fill);
    const wat = S('rect', { x: FX - 70, y: 0, width: 140, height: 0, fill: '#5DA9E9', opacity: .75 }, fill);
    S('path', { class: 'glass', d: bd }, g);
    S('path', { class: 'shine', d: `M${FX - 44},${170} Q${FX - 52},${214} ${FX - 34},${262}`, opacity: .8 }, g);
    /* stopper, tap and stem */
    const stopper = S('rect', { x: FX - 12, y: Y0 - 14, width: 24, height: 16, rx: 3, fill: '#5A5F66' }, g);
    S('rect', { x: FX - 4, y: Y1, width: 8, height: 64, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.8 }, g);
    S('rect', { x: FX - 16, y: Y1 + 8, width: 32, height: 12, rx: 4, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.8 }, g);
    const tap = S('rect', { x: FX + 14, y: Y1 + 3, width: 8, height: 22, rx: 2, fill: '#2F6FCA' }, g);
    const bk = K.beaker(g, FX, 446, 110, 70, { color: '#5DA9E9' });
    const oilB = S('rect', { x: FX - 52, y: 444, width: 104, height: 0, fill: C.oil, opacity: .9 }, bk.g);
    const stream = S('line', { x1: FX, y1: Y1 + 64, x2: FX, y2: 444, stroke: '#5DA9E9', 'stroke-width': 4, opacity: 0 }, g);
    k.label('separating funnel', FX + 92, 160, FX + 40, 168, { anchor: 'start', layer: g, fade: false });
    k.label('tap', FX + 60, Y1 + 14, FX + 22, Y1 + 14, { anchor: 'start', layer: g, fade: false });
    const VW0 = vol(262), VO0 = vol(184) - VW0;
    let Vw = VW0, Vo = VO0, outW = 0, outO = 0, open = false, stop = true, flowLeft = 0, lab = null;
    const paint = () => {
      const yi = yAt(Vw), yt = yAt(Vw + Vo);
      wat.setAttribute('y', yi); wat.setAttribute('height', Y1 - yi + 1);
      oil.setAttribute('y', yt); oil.setAttribute('height', Math.max(0, yi - yt));
      const wl = Math.min(.9, outW / VW0 * .78);
      bk.liq.set(wl); const oh = outO / VO0 * 40; oilB.setAttribute('y', bk.liq.y() - oh); oilB.setAttribute('height', oh);
      tap.setAttribute('transform', open ? `rotate(90 ${FX + 18} ${Y1 + 14})` : '');
      stream.setAttribute('opacity', open && (Vw + Vo) > 1 && (!stop || flowLeft > 0) ? .9 : 0);
      stream.setAttribute('stroke', Vw > 1 ? '#5DA9E9' : C.oil);
      if (lab) { place(lab.water, (yi + Y1) / 2 - 6, Vw > VW0 * .04); place(lab.oil, (yt + yi) / 2, Vo > VO0 * .04); }
    };
    const drain = dt => {
      if (stop) { if (flowLeft <= 0) return; flowLeft -= dt; }
      let d = 900 * dt;
      const a = Math.min(Vw, d); Vw -= a; outW += a; d -= a;
      const b = Math.min(Vo, d); Vo -= b; outO += b;
      paint();
    };
    /* each layer's label follows the middle of its layer, its line ending on the glass there; gone when the layer has gone */
    lab = { oil: k.label('oil', 0, 0, 0, 0, { anchor: 'end', layer: g, fade: false }), water: k.label('water', 0, 0, 0, 0, { anchor: 'end', layer: g, fade: false }) };
    /* a label never sits on the clamp's ring (y 226), where its line would run along the clamp arm */
    const place = (l, y, on) => { l.setAttribute('opacity', on ? 1 : 0); if (!on) return; if (Math.abs(y - 226) < 14) y = y < 226 ? 212 : 240; const t = l.querySelector('text'), d = l.querySelector('path'), x = FX - 96, tx = FX - hw(y) + 8;
      t.setAttribute('x', x); t.setAttribute('y', y + 5); d.setAttribute('d', `M${x + 6},${y} L${tx},${y}`); const r = l.querySelector('rect'); if (r) { const bb = t.getBBox(); r.setAttribute('x', bb.x - 4); r.setAttribute('y', bb.y - 2); r.setAttribute('width', bb.width + 8); r.setAttribute('height', bb.height + 4); } };
    paint();
    for (;;) {
      k.step(1, 3, 'Oil and water have settled into two layers. The stopper is still in the top. What do you do first?');
      const c = await k.choose([
        { id: 'stopper', x: FX - 30, y: Y0 - 30, label: 'Remove the stopper', side: 'l' },
        { id: 'tap', x: FX + 40, y: Y1 + 44, label: 'Open the tap', side: 'r' }
      ]);
      if (c === 'tap') {
        open = true; flowLeft = .25; paint();
        await k.tween(900, () => drain(1 / 60));
        open = false; paint();
        await k.oops('A few drops came out, then it <b>stopped</b>: no air could get in at the top to take the liquid’s place. Take the stopper out first.');
        Vw = VW0; Vo = VO0; outW = 0; outO = 0; paint();
        continue;
      }
      break;
    }
    await k.tween(500, t => stopper.setAttribute('transform', `translate(${60 * t} ${-40 * t})`));
    stopper.remove(); stop = false;
    for (;;) {
      k.step(2, 3, 'Run off the bottom layer. <b>Hold</b> the tap button to open the tap; let go to close it. Close it just as the boundary reaches the tap.');
      const c = await k.choose([
        { id: 'open', x: FX + 40, y: Y1 + 44, label: 'Hold to open the tap', side: 'r', onHold: drain, onPress: v => { open = v; paint(); }, fastHold: (VW0 - 30) / 900 },
        { id: 'done', x: 610, y: 300, label: 'Tap closed at the boundary' }
      ]);
      open = false; paint();
      if (outO > VO0 * .04) {
        await k.oops('You let some <b>oil</b> run into the beaker of water. Close the tap as soon as the boundary reaches it.');
        Vw = VW0; Vo = VO0; outW = 0; outO = 0; paint();
        continue;
      }
      if (Vw > VW0 * .05) { k.note('Some water is still in the funnel. Open the tap a little more.'); await k.wait(1400); continue; }
      break;
    }
    k.step(3, 3, 'The water is in the beaker; the oil is still in the funnel. Put a new beaker under the tap and run off the oil.');
    await k.choose([{ id: 'oil', x: FX + 40, y: Y1 + 44, label: 'New beaker, run off the oil', side: 'r' }]);
    await k.tween(500, t => bk.g.setAttribute('transform', `translate(${180 * t} 0)`));
    const bk2 = K.beaker(g, FX, 446, 110, 70, { color: C.oil });
    open = true;
    await k.tween(1800, t => { Vo = Math.max(0, VO0 * (1 - t)); Vw = 0; bk2.liq.set(.62 * t); paint(); stream.setAttribute('opacity', t < 1 ? .9 : 0); });
    open = false; stream.setAttribute('opacity', 0); tap.setAttribute('transform', '');
    k.label('oil', FX - 92, 424, FX - 40, 424, { anchor: 'end' });
    k.label('water', FX + 270, 424, FX + 220, 424, { anchor: 'start' });
    k.finish('Two beakers: water and oil. The water was the bottom layer because it is <b>denser</b>; the oil floated because it is <b>less dense</b>.');
  }

  B.define(6, [
    { id: 'decant', name: 'Decanting', title: 'Decanting water off sand', view: [120, 150, 600], task: { id: 'p6-sim-decant', title: 'Bench: decanted water off sand' }, run: decantRun,
      alt: 'A beaker of muddy water on a block, a glass rod leading into an empty beaker.' },
    { id: 'funnel', name: 'Separating funnel', title: 'Oil and water in a separating funnel', view: [140, 70, 600], task: { id: 'p6-sim-funnel', title: 'Bench: separated oil and water with a separating funnel' }, run: funnelRun,
      alt: 'A separating funnel held in a ring on a stand, with a layer of yellow oil on top of water, a tap at the bottom and a beaker below.' }
  ]);
})();
