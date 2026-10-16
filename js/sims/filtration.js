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
    await k.choose([{ id: 'o', x: x + 10, y: y - 30, label: 'Open it into a cone' }]);
    await k.tween(450, t => left.setAttribute('opacity', 1 - t));
    left.remove();
    const cone = S('path', { class: 'paper', d: `M${x - 52},${y - 10} L${x},${y + 66} L${x + 52},${y - 10} Z` }, g);
    S('path', { d: `M${x - 52},${y - 10} L${x},${y + 66}`, stroke: 'var(--paper-edge)', 'stroke-width': 3, fill: 'none' }, g);
    await k.wait(250);
    return g;
  }

  /* what you see (Daniel, 15 Oct 2026: "be accurate with what you actually see"): the beaker empties completely, sand and
     all; in the funnel the sand settles as a grainy, paler layer at the tip of the paper, under the cloudy brown water;
     the filtrate is clear. Poured all at once, the level rises over the paper's edge and runs down the glass around it. */
  const PT = FT + 12;                                               /* the paper's edge sits below the funnel's rim */
  const MUD = '#7A5430', CLEAR = '#CFE6F6';
  const hw = y => 4.5 + (FW / 2 - 4.5) * (FT + FCH - y) / FCH;      /* the funnel's inside half-width at height y */
  async function run(k) {
    const g = k.svg, sc = scene(k);
    const defs = S('defs', null, g), pid = K.id('sandpat');
    const pat = S('pattern', { id: pid, width: 7, height: 7, patternUnits: 'userSpaceOnUse' }, defs);
    S('rect', { width: 7, height: 7, fill: '#D6B87F' }, pat);
    S('circle', { cx: 1.5, cy: 2, r: 1.1, fill: '#8A6A3A' }, pat); S('circle', { cx: 5, cy: 5, r: .9, fill: '#A8865A' }, pat); S('circle', { cx: 4.6, cy: 1.3, r: .6, fill: '#6E5230' }, pat);
    const SAND = `url(#${pid})`;
    const paperIn = S('g', { opacity: 0 }, sc.paperG);
    S('path', { class: 'paper', d: coneD(0, PT) }, paperIn);
    S('path', { d: `M${FX - FW / 2 + 6},${PT} L${FX},${AP}`, stroke: 'var(--paper-edge)', 'stroke-width': 2.5, fill: 'none' }, paperIn);
    const res = S('path', { fill: SAND, stroke: '#8A6A3A', 'stroke-width': 1 }, sc.paperG);
    let resF = 0;
    const setRes = f => { resF = f; const hR = 30 * f, w = hR * (FW / 2 - 8) / (AP - PT); res.setAttribute('d', f > .01 ? `M${FX - w},${AP - hR} Q${FX},${AP - hR - 4} ${FX + w},${AP - hR} L${FX},${AP} Z` : ''); };
    const inCone = K.liquid(sc.paperG, coneD(2, PT), PT + 2, AP - 2, MUD, { opacity: .7 });
    /* over the paper's edge: the strip between the paper and the rim, and the liquid running down the glass */
    const over = S('path', { d: `M${FX - hw(FT + 3)},${FT + 3} L${FX + hw(FT + 3)},${FT + 3} L${FX + hw(PT)},${PT} L${FX - hw(PT)},${PT} Z`, fill: MUD, opacity: 0 }, sc.paperG);
    const flaskSand = S('rect', { x: FX - 66, y: 444, width: 132, height: 0, fill: SAND }, sc.flask.liq.g);
    sc.flask.liq.color(CLEAR).opacity(.7);
    setRes(0);
    const folded = await fold(k, g);

    k.step(2, 5, 'Put the cone into the funnel, held by the clamp. The flask below will catch what passes through.');
    await k.choose([{ id: 'p', x: 260, y: 200, label: 'Put the cone in the funnel' }]);
    await k.tween(700, t => { folded.setAttribute('opacity', 1 - t); paperIn.setAttribute('opacity', t); });
    folded.remove();

    /* a beaker of muddy water: sand settled at the bottom of cloudy water (a mechanical mixture) */
    const pourBeaker = (color, op, level, sandy) => {
      const wrap = S('g', null, g);
      const b = K.beaker(wrap, 640, 448, 92, 110, { color, level, opacity: op });
      b.sand = sandy ? S('rect', { x: b.x0 + 3, y: 446 - 14, width: 86, height: 14, fill: SAND, rx: 2 }, b.g) : null;
      b.wrap = wrap; return b;
    };
    let bk = pourBeaker(MUD, .82, .72, true);
    const lblM = k.label('sand and water', 640, 318, null, null, { anchor: 'middle' });
    const DROP = FT + FCH + FSL;

    for (;;) {
      k.step(3, 5, 'Pour in all of the muddy water, sand and all. How do you pour it?');
      const how = await k.choose([
        { id: 'fast', x: 640, y: 222, label: 'Pour it all in at once', side: 't' },   /* lower: the question fits on the wall above */
        { id: 'slow', x: 640, y: 290, label: 'Pour slowly', sub: 'below the paper’s edge', side: 't' }
      ]);
      lblM.remove();
      if (how === 'fast') {
        let sl = null, sr = null;
        const d = K.drips(g, k, FX, DROP, () => sc.flask.liq.y(), { color: MUD, every: .1 });
        sc.flask.liq.color(MUD).opacity(.8);
        await pourAll(k, bk, 1100, MUD, t => {
          inCone.set(Math.min(1, t * 1.7)); setRes(.6 * t);
          over.setAttribute('opacity', t > .6 ? .62 : 0);
          if (t > .6 && !sl) {
            sl = K.stream(g, [[FX - hw(FT + 3) + 2, FT + 4], [FX - 6, FT + FCH - 2], [FX - 2, DROP]], MUD, 3.5);
            sr = K.stream(g, [[FX + hw(FT + 3) - 2, FT + 4], [FX + 6, FT + FCH - 2], [FX + 2, DROP]], MUD, 3.5);
          }
          if (sl) { const f = Math.min(1, (t - .6) / .3); sl.grow(f); sr.grow(f); }
          sc.flask.liq.set(.16 * t);
        });
        k.lapse('a few minutes in a few seconds');
        await k.tween(1800, t => { inCone.set(1 - t); over.setAttribute('opacity', .62 * (1 - Math.min(1, t * 3))); sc.flask.liq.set(.16 + .08 * t); flaskSand.setAttribute('y', 444 - 4 * t); flaskSand.setAttribute('height', 4 * t); });
        d.stop(); k.lapse(null);
        k.label('muddy filtrate', 250, 430, FX - 52, 430, { anchor: 'end' });
        await k.oops('The level rose over the edge of the paper, so muddy water ran down the glass <b>around</b> the paper. The filtrate is muddy: some sand is in the flask.');
        k.clearLabels(); sl.remove(); sr.remove();
        sc.flask.liq.set(0).color(CLEAR).opacity(.7); flaskSand.setAttribute('height', 0); inCone.set(0); setRes(0);
        bk.wrap.remove(); bk = pourBeaker(MUD, .82, .72, true);
        continue;
      }
      break;
    }
    /* poured slowly: the level stays below the paper's edge; clear water drips through while the sand settles on the paper */
    const drops = K.drips(g, k, FX, DROP, () => sc.flask.liq.y(), { color: CLEAR, every: .16 });
    k.lapse('a few minutes in a few seconds');
    await pourAll(k, bk, 3600, MUD, t => { inCone.set(Math.min(.6, t * 2.4)); setRes(.8 * Math.pow(t, 1.4)); sc.flask.liq.set(.14 * t); });
    await k.tween(2200, t => { inCone.set(.6 * (1 - t)); setRes(.8 + .2 * t); sc.flask.liq.set(.14 + .1 * t); });
    drops.stop(); k.lapse(null);
    k.label('residue (sand)', 250, AP - 12, FX - 6, AP - 12, { anchor: 'end' });
    k.label('filtrate (clear water)', 250, 430, FX - 52, 430, { anchor: 'end' });
    k.label('empty', 640, 318, null, null, { anchor: 'middle', bg: false });

    k.step(4, 5, 'The beaker is empty. The sand stayed on the paper; clear water passed through. Why? Look at the paper close up.');
    await k.choose([{ id: 'z', x: 560, y: 150, label: 'Look closer at the paper', side: 'r' }]);
    bk.wrap.remove(); k.clearLabels();
    const lz = K.lens(k.top, 616, 228, 100, 'Sand is too big to pass', 'water passes through · the holes: its particles · are too small to show');
    zoom(k, lz, true);
    k.label('residue (sand)', 250, AP - 12, FX - 6, AP - 12, { anchor: 'end' });
    k.label('filtrate (clear water)', 250, 430, FX - 52, 430, { anchor: 'end' });

    k.step(5, 5, 'Now the contrast: <b>salt water</b>. The salt is dissolved. Will the paper stop it?');
    await k.choose([{ id: 'n', x: 640, y: 482, label: 'Try salt water', sub: 'clean paper, empty flask' }]);
    lz.g.remove(); k.clearLabels();
    setRes(0); sc.flask.liq.set(0);
    bk = pourBeaker(CLEAR, .7, .7, false);
    k.label('salt water', 640, 318, null, null, { anchor: 'middle' });
    await k.choose([{ id: 'p', x: 640, y: 262, label: 'Pour slowly', side: 't' }]);
    k.clearLabels();
    inCone.color(CLEAR).opacity(.7);
    const d2 = K.drips(g, k, FX, DROP, () => sc.flask.liq.y(), { color: CLEAR, every: .16 });
    k.lapse('a few minutes in a few seconds');
    await pourAll(k, bk, 3200, CLEAR, t => { inCone.set(Math.min(.6, t * 2.4)); sc.flask.liq.set(.14 * t); });
    await k.tween(2000, t => { inCone.set(.6 * (1 - t)); sc.flask.liq.set(.14 + .1 * t); });
    d2.stop(); k.lapse(null);
    k.label('nothing on the paper', 262, AP - 12, FX - 6, AP - 12, { anchor: 'end' });
    k.label('filtrate (salt water)', 250, 430, FX - 52, 430, { anchor: 'end' });
    k.say('Nothing stayed on the paper, and the filtrate looks like the salt water you poured in. Is the salt still in it? Test a drop: put it on a watch glass and leave it until the water has evaporated.');
    await k.choose([{ id: 't', x: 640, y: 482, label: 'Test a drop of the filtrate' }]);
    bk.wrap.remove(); k.clearLabels();
    /* a watch glass resting on the bench (its lowest point on the bench top, y 448), a drop left to evaporate: a white
       ring of salt */
    const wx = 628, wy = 445;
    S('path', { class: 'glass', d: `M${wx - 60},${wy - 8} Q${wx},${wy + 14} ${wx + 60},${wy - 8}` }, g);
    const drop = S('ellipse', { cx: wx, cy: wy - 2, rx: 22, ry: 4, fill: '#9CC9E6', opacity: .9 }, g);
    k.label('watch glass', wx, wy + 30, null, null, { anchor: 'middle' });
    k.lapse('ten minutes in a few seconds');
    await k.tween(2200, t => { drop.setAttribute('rx', 22 - 6 * t); drop.setAttribute('opacity', .9 * (1 - t)); });
    k.lapse(null);
    const ring = S('g', null, g);
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; S('rect', { x: wx + Math.cos(a) * 16 - 1.8, y: wy - 2 + Math.sin(a) * 3 - 1.8, width: 3.6, height: 3.6, fill: C.salt, stroke: '#9A968A', 'stroke-width': .6 }, ring); }
    k.label('salt left behind', wx - 74, wy - 14, wx - 18, wy - 4, { anchor: 'end' });
    const lz2 = K.lens(k.top, 616, 228, 100, 'Salt ions pass through too', 'inside one hole, much bigger · each ion, with its water, · is far smaller than the hole');
    zoom(k, lz2, false);
    k.finish('The salt passed through the paper. Filtration separates an <b>insoluble</b> solid from a liquid; it cannot remove a <b>dissolved</b> solid.');
  }

  /* lift the beaker over the funnel, tip it and pour ALL of it (the settled sand goes with the last of the water), then
     put the empty beaker back on the bench; during(t) moves the funnel and the flask in step */
  async function pourAll(k, b, ms, color, during) {
    const sx = b.x0 - 6, sy = b.ty - 3, dx = (FX + 46) - sx, dy = (FT - 26) - sy, lev0 = b.liq.level();
    await k.tween(700, t => b.wrap.setAttribute('transform', `translate(${dx * t} ${dy * t}) rotate(${-64 * t} ${sx} ${sy})`));
    b.liq.tilt(-64, sx, sy);
    const st = K.stream(k.svg, [[FX + 46, FT - 26], [FX + 40, FT - 10], [FX + 30, FT + 16], [FX + 18, FT + 40]], color, 6);
    await k.tween(250, t => st.grow(t));
    await k.tween(ms, t => {
      b.liq.set(lev0 * (1 - t));
      if (b.sand) { const h = 14 * Math.min(1, (1 - t) / .35); b.sand.setAttribute('y', 446 - h); b.sand.setAttribute('height', h); }
      if (b.sand && t > .65) st.path.setAttribute('stroke', '#A8865A');
      during(t);
    });
    await k.tween(200, t => st.cut(t));
    st.remove();
    await k.tween(600, t => b.wrap.setAttribute('transform', `translate(${dx * (1 - t)} ${dy * (1 - t)}) rotate(${-64 * (1 - t)} ${sx} ${sy})`));
    b.liq.tilt(0, sx, sy);
  }

  /* the paper close up: fibres with gaps; water particles slip through, sand grains rest on top (or salt slips through) */
  /* the filter paper close up, at two sizes (15 Oct 2026 audit: the picture must show what the words say).
     Sand: at the size of sand grains the holes in the paper are much smaller than a grain, and water particles are far too
     small to draw, so the water is a pale blue (as in the milk lens). Grains rest on the paper; a grain over a hole blocks
     it; drops of water pass through the open holes.
     Salt: much bigger, inside one hole: the paper is the wall on each side. The water is drawn as particles (kit
     liquidLens: touching, sliding, hydrogen bonds), and the dissolved ions, each with its water, flow through with it. */
  function zoom(k, lz, sand) {
    const p = lz.inner, x = lz.x, y = lz.y, r = lz.r;
    const fibres = (g, x0, y0, w, h) => { S('rect', { x: x0, y: y0, width: w, height: h, fill: '#EDE6CF', stroke: '#B8AD8A', 'stroke-width': 1.5 }, g); for (let i = 0; i < (w + h) / 9; i++) { const fx = x0 + ((i * 37) % Math.max(1, w)), fy = y0 + ((i * 23) % Math.max(1, h)); S('line', { x1: fx, y1: fy, x2: Math.min(x0 + w, fx + 7), y2: Math.min(y0 + h, fy + 4), stroke: '#CDBF98', 'stroke-width': 1.2 }, g); } };
    const tag = (tx, ty, t, col, rot) => S('text', { x: tx, y: ty, 'text-anchor': 'middle', 'font-size': 15.5, 'font-weight': 900, fill: col, stroke: '#EAF3FB', 'stroke-width': 4, 'paint-order': 'stroke', transform: rot ? `rotate(${rot} ${tx} ${ty})` : null }, p, t);
    if (sand) {
      S('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, fill: '#CFE4F6' }, p);
      const fy = y + 10, PH = 18, HW = 8, holes = [x - 80, x - 40, x, x + 40, x + 80];
      const grains = [[x - 40, fy - 28, 30], [x + 60, fy - 24, 26]];          /* one over the hole at -40, one over +40 and +80 */
      const open = holes.filter(h => !grains.some(([gx, , gs]) => Math.abs(h - gx) < gs));
      /* the paper between the holes */
      const edges = [x - r - 10].concat(...holes.map(h => [h - HW / 2, h + HW / 2])).concat([x + r + 10]);
      for (let i = 0; i < edges.length; i += 2) fibres(p, edges[i], fy, edges[i + 1] - edges[i], PH);
      /* drops of water: from above, along the paper to an open hole, through it, and on down */
      const drops = [];
      for (let i = 0; i < 10; i++) drops.push({ e: S('rect', { width: 4, height: 9, rx: 2, fill: '#3F86C9', opacity: .85 }, p), t: i / 10, h: open[i % open.length], x0: x - r + 10 + ((i * 53) % (2 * r - 20)) });
      const place = d => { const top = y - r, yh = fy - 6; let px, py; if (d.t < .55) { const u = d.t / .55; px = d.x0 + (d.h - d.x0) * u * u; py = top + (yh - top) * u; } else { const u = (d.t - .55) / .45; px = d.h; py = yh + (y + r - yh) * u; } d.e.setAttribute('x', (px - 2).toFixed(1)); d.e.setAttribute('y', (py - 4.5).toFixed(1)); };
      drops.forEach(place);
      if (!k.FAST) k.loop(dt => { drops.forEach(d => { d.t += dt * .16; if (d.t > 1) { d.t -= 1; d.x0 = x - r + 10 + Math.random() * (2 * r - 20); d.h = open[Math.floor(Math.random() * open.length)]; } place(d); }); return lz.g.isConnected; });
      grains.forEach(([gx, gy, gs]) => S('path', { d: `M${gx - gs},${gy + gs * .25} L${gx - gs * .45},${gy - gs * .8} L${gx + gs * .55},${gy - gs * .75} L${gx + gs},${gy + gs * .1} L${gx + gs * .4},${gy + gs * .95} L${gx - gs * .6},${gy + gs * .9} Z`, fill: C.sand, stroke: '#8A6A3A', 'stroke-width': 1.4 }, p));
      tag(x - 40, fy - 26, 'sand', '#5B4520');
      tag(x - 20, fy + 14, 'paper', '#7A6D45');
      tag(x + 4, y - 64, 'water', '#1F4E79');
      return;
    }
    /* inside one hole: the paper's walls left and right; the water flows down between them, the ions with it */
    S('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, fill: '#EAF3FB' }, p);
    const left = [x - r - 20, y - r - 20, x - 60, y + r + 20], right = [x + 60, y - r - 20, x + r + 20, y + r + 20];   /* a hole 120 wide */
    K.liquidLens(k, lz, { scale: .62, fill: .6, box: true, flow: 14, seed: 6, solids: [{ rect: left }, { rect: right }],
      extra: [{ kind: 'Na', n: 1, r: 5, fill: '#8E6BD8', hug: '+', sign: '+', at: [[x - 20, y - 50]] }, { kind: 'Cl', n: 1, r: 9.3, fill: '#3DBA6A', hug: '-', sign: '−', at: [[x + 24, y + 20]] }] });
    fibres(p, left[0], left[1], left[2] - left[0], left[3] - left[1]); fibres(p, right[0], right[1], right[2] - right[0], right[3] - right[1]);
    tag(x - 80, y + 4, 'paper', '#7A6D45', -90); tag(x + 80, y + 4, 'paper', '#7A6D45', 90);
  }

  B.define(2, [{ id: 'filter', name: 'Filtration', title: 'Filtration', view: [70, 112, 670], kicker: 'Part 2 · the bench', task: { id: 'p2-sim', title: 'Bench: filtration of muddy water and salt water' }, run,
                 alt: 'A filter funnel held by a clamp over a conical flask, with filter paper and a beaker of muddy water.' }]);
})();
