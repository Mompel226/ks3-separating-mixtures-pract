/* ============================================================
   kit.js — the apparatus, drawn in the style of an exam diagram (15 Oct 2026): glass as an outline with a pale fill and
   a highlight, liquids that rise and fall inside it, a Bunsen burner with a live flame, a tripod and gauze, a stand and
   clamp, a thermometer. Daniel asks for clean diagrams where pupils must read the apparatus (memory
   design-bar-for-daniels-sites: "a diagram he asks for may be drawn"). Units: the bench's viewBox, bench top y = 448.
   ============================================================ */
(function () {
  'use strict';
  const B = window.BENCH, S = B.S;
  let uid = 0;
  const id = p => (p || 'k') + (++uid);
  const C = {                                  /* liquids and solids: the same in both themes */
    water: '#7EB8EA', sea: '#6FB3C9', mud: '#9A7446', salt: '#F4F1E8', cuso4: '#2E7FD9', oil: '#E9BC34',
    ethanol: '#BFE3F7', ink: '#22252B', sand: '#C9A66B', steel: '#8C969F', alu: '#D3D9DE'
  };

  /* a liquid inside a vessel: clipped by the vessel's inner shape; set(level 0..1) */
  function liquid(p, innerD, yTop, yBot, color, o) {
    o = o || {};
    const cid = id('clip');
    const defs = S('defs', null, p), cp = S('clipPath', { id: cid }, defs);
    S('path', { d: innerD }, cp);
    const g = S('g', { 'clip-path': `url(#${cid})` }, p);
    const r = S('rect', { x: -1000, y: yBot, width: 3000, height: 0, fill: color, opacity: o.opacity == null ? .78 : o.opacity }, g);
    const men = S('rect', { x: -1000, y: yBot, width: 3000, height: 2.2, fill: '#FFFFFF', opacity: .45 }, g);
    let lev = 0;
    const api = {
      g, rect: r,
      set(f) { lev = Math.max(0, Math.min(1, f)); const y = yBot - lev * (yBot - yTop); r.setAttribute('y', y); r.setAttribute('height', lev > .001 ? 1000 : 0); men.setAttribute('y', y); men.style.display = lev > .01 ? '' : 'none'; return api; },
      /* the vessel is turned by a; keep the surface level by turning the liquid back about (px, py) */
      tilt(a, px, py) { const t = a ? `rotate(${-a} ${px} ${py})` : ''; r.setAttribute('transform', t); men.setAttribute('transform', t); return api; },
      men,
      color(c) { r.setAttribute('fill', c); return api; },
      opacity(v) { r.setAttribute('opacity', v); return api; },
      level: () => lev,
      y: () => yBot - lev * (yBot - yTop)
    };
    return api.set(o.level || 0);
  }

  /* ---------------- glassware ---------------- */
  function beaker(p, cx, by, w, hh, o) {
    o = o || {};
    const g = S('g', { class: 'beaker' }, p), x0 = cx - w / 2, x1 = cx + w / 2, ty = by - hh, r = 7;
    const inner = `M${x0 + 2},${ty} L${x0 + 2},${by - r} Q${x0 + 2},${by - 2} ${x0 + r},${by - 2} L${x1 - r},${by - 2} Q${x1 - 2},${by - 2} ${x1 - 2},${by - r} L${x1 - 2},${ty} Z`;
    const liq = liquid(g, inner, ty + 4, by - 2, o.color || C.water, { level: o.level || 0, opacity: o.opacity });
    S('path', { class: 'glass', d: `M${x0 - 6},${ty - 3} Q${x0},${ty} ${x0},${ty + 6} L${x0},${by - r} Q${x0},${by} ${x0 + r},${by} L${x1 - r},${by} Q${x1},${by} ${x1},${by - r} L${x1},${ty}` }, g);
    S('path', { class: 'shine', d: `M${x0 + 7},${ty + 14} L${x0 + 7},${by - 14}`, opacity: .8 }, g);
    if (o.marks) for (let i = 1; i <= 3; i++) { const y = by - i * (hh - 10) / 4; S('line', { x1: x1 - 12, y1: y, x2: x1 - 3, y2: y, stroke: 'var(--glass)', 'stroke-width': 1.2, opacity: .6 }, g); }
    return { g, liq, x0, x1, ty, by, cx, w, h: hh };
  }
  function conical(p, cx, by, w, hh, o) {
    o = o || {};
    const g = S('g', { class: 'conical' }, p), nw = o.neck || w * .3, nh = hh * .32, ty = by - hh, r = 6;
    const a = cx - nw / 2, b = cx + nw / 2, l = cx - w / 2, rr = cx + w / 2;
    const outer = `M${a - 4},${ty} L${a},${ty + 3} L${a},${ty + nh} L${l},${by - r} Q${l},${by} ${l + r},${by} L${rr - r},${by} Q${rr},${by} ${rr},${by - r} L${b},${ty + nh} L${b},${ty + 3} L${b + 4},${ty}`;
    const inner = `M${a + 2},${ty} L${a + 2},${ty + nh} L${l + 2.5},${by - r} L${l + 3},${by - 2} L${rr - 3},${by - 2} L${rr - 2.5},${by - r} L${b - 2},${ty + nh} L${b - 2},${ty} Z`;
    const liq = liquid(g, inner, ty + 4, by - 2, o.color || C.water, { level: o.level || 0, opacity: o.opacity });
    S('path', { class: 'glass', d: outer }, g);
    S('path', { class: 'shine', d: `M${l + 10},${by - 14} L${a + 4},${ty + nh + 10}`, opacity: .8 }, g);
    return { g, liq, ty, by, cx, w, h: hh, neckY: ty + nh, a, b };
  }
  /* a round-bottomed flask: bulb centre (cx, cy), radius R, neck up to ty */
  function rbFlask(p, cx, cy, R, ty, o) {
    o = o || {};
    const g = S('g', { class: 'rbflask' }, p), nw = o.neck || 26, a = cx - nw / 2, b = cx + nw / 2;
    const ang = Math.asin((nw / 2) / R), yJ = cy - R * Math.cos(ang);
    const outer = `M${a},${ty} L${a},${yJ} A${R},${R} 0 1 0 ${b},${yJ} L${b},${ty}`;
    const innerR = R - 2.2;
    const inner = `M${a + 2},${ty} L${a + 2},${yJ + 2} A${innerR},${innerR} 0 1 0 ${b - 2},${yJ + 2} L${b - 2},${ty} Z`;
    const liq = liquid(g, inner, cy - R * .2, cy + R - 2, o.color || C.water, { level: o.level || 0, opacity: o.opacity });
    S('path', { class: 'glass', d: outer }, g);
    S('path', { class: 'shine', d: `M${cx - R * .62},${cy - R * .3} A${R * .7},${R * .7} 0 0 0 ${cx - R * .3},${cy + R * .55}`, opacity: .8 }, g);
    return { g, liq, cx, cy, R, ty, a, b, bottom: cy + R };
  }
  function funnel(p, cx, ty, w, coneH, stemL, o) {
    o = o || {};
    const g = S('g', { class: 'funnel' }, p), sw = 9, x0 = cx - w / 2, x1 = cx + w / 2;
    const yS = ty + coneH, yE = yS + stemL;
    S('path', { class: 'glass', d: `M${x0 - 3},${ty - 2} L${x0},${ty} L${cx - sw / 2},${yS} L${cx - sw / 2},${yE - 6} L${cx + sw / 2},${yE} L${cx + sw / 2},${yS} L${x1},${ty} L${x1 + 3},${ty - 2}` }, g);
    S('path', { class: 'shine', d: `M${x0 + 10},${ty + 6} L${cx - sw / 2 - 2},${yS - 10}`, opacity: .7 }, g);
    return { g, cx, ty, w, x0, x1, yS, yE, sw };
  }
  /* ---------------- metal and fire ---------------- */
  function stand(p, x, by, hh, armY, armTo) {
    const g = S('g', { class: 'stand' }, p);
    S('rect', { class: 'metal', x: x - 50, y: by - 10, width: 100, height: 10, rx: 3 }, g);
    S('line', { class: 'metal-line', x1: x, y1: by - 8, x2: x, y2: by - hh }, g);
    if (armY != null) {
      S('rect', { class: 'metal', x: x - 9, y: armY - 9, width: 18, height: 18, rx: 3 }, g);
      S('line', { class: 'metal-line', x1: x, y1: armY, x2: armTo, y2: armY, 'stroke-width': 4 }, g);
    }
    return g;
  }
  function bunsen(p, cx, by, o) {
    o = o || {};
    const g = S('g', { class: 'bunsen' }, p), bh = o.h || 70, t = by - bh;
    S('path', { class: 'metal', d: `M${cx - 30},${by} L${cx - 22},${by - 10} L${cx + 22},${by - 10} L${cx + 30},${by} Z` }, g);
    S('rect', { class: 'metal', x: cx - 8, y: t, width: 16, height: bh - 8, rx: 2 }, g);
    S('rect', { x: cx - 10, y: by - Math.min(34, bh * .5), width: 20, height: 10, rx: 2, fill: 'var(--metal-2)', stroke: 'var(--bench-edge)', 'stroke-width': 1 }, g);
    S('path', { d: `M${cx + 22},${by - 6} L${cx + 46},${by - 6}`, stroke: '#D6602A', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const fl = S('g', { class: 'flame', opacity: 0 }, g);
    const fh = o.flame || 52;
    S('path', { d: `M${cx - 9},${t} C${cx - 14},${t - fh * .45} ${cx - 3},${t - fh * .8} ${cx},${t - fh} C${cx + 3},${t - fh * .8} ${cx + 14},${t - fh * .45} ${cx + 9},${t} Z`, fill: '#4F8DF5', opacity: .55 }, fl);
    S('path', { d: `M${cx - 5},${t} C${cx - 7},${t - fh * .3} ${cx - 1},${t - fh * .5} ${cx},${t - fh * .56} C${cx + 1},${t - fh * .5} ${cx + 7},${t - fh * .3} ${cx + 5},${t} Z`, fill: '#A9D3FF', opacity: .95 }, fl);
    return { g, top: t, on(v) { fl.setAttribute('opacity', v ? 1 : 0); fl.classList.toggle('lit', !!v); } };
  }
  function tripod(p, cx, by, top, w) {
    const g = S('g', { class: 'tripod' }, p);
    S('line', { class: 'metal-line', x1: cx - w / 2 + 8, y1: top, x2: cx - w / 2 - 10, y2: by, 'stroke-width': 4.5 }, g);
    S('line', { class: 'metal-line', x1: cx + w / 2 - 8, y1: top, x2: cx + w / 2 + 10, y2: by, 'stroke-width': 4.5 }, g);
    S('rect', { class: 'metal', x: cx - w / 2 - 6, y: top - 3, width: w + 12, height: 6, rx: 2 }, g);
    const gz = S('g', null, g);
    for (let x = cx - w / 2 - 4; x <= cx + w / 2 + 4; x += 6) S('line', { x1: x, y1: top - 7, x2: x + 4, y2: top - 3, stroke: 'var(--metal-2)', 'stroke-width': 1 }, gz);
    S('rect', { x: cx - w / 2 - 6, y: top - 8, width: w + 12, height: 5, fill: 'none', stroke: 'var(--metal)', 'stroke-width': 1.4 }, g);
    return { g, top: top - 8 };
  }
  function thermometer(p, x, y1, y2, o) {
    o = o || {};
    const g = S('g', { class: 'thermo' }, p);
    S('rect', { x: x - 5, y: y1, width: 10, height: y2 - y1, rx: 5, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.8 }, g);
    S('circle', { cx: x, cy: y2, r: 7, fill: '#D22F27', stroke: 'var(--glass)', 'stroke-width': 1.6 }, g);
    const col = S('rect', { x: x - 1.8, y: y2 - 8, width: 3.6, height: 8, fill: '#D22F27' }, g);
    const t0 = o.min == null ? 0 : o.min, t1 = o.max == null ? 110 : o.max;
    for (let t = 0; t <= t1; t += 10) { const yy = y2 - 12 - (t - t0) / (t1 - t0) * (y2 - y1 - 20); S('line', { x1: x + 5, y1: yy, x2: x + (t % 50 ? 8 : 11), y2: yy, stroke: 'var(--glass)', 'stroke-width': 1 }, g); }
    return { g, set(t) { const yy = y2 - 12 - Math.max(0, (t - t0)) / (t1 - t0) * (y2 - y1 - 20); col.setAttribute('y', yy); col.setAttribute('height', y2 - yy); } };
  }
  /* ---------------- moving bits ---------------- */
  /* rising wisps of vapour from (x, y), drifting up; returns stop() */
  function steam(p, k, x, y, o) {
    o = o || {};
    const g = S('g', { class: 'steam', 'pointer-events': 'none' }, p), parts = [];
    let on = true, acc = 0;
    if (k.FAST) return { stop() {}, g };
    const run = k.loop(dt => {
      acc += dt;
      if (on && acc > (o.every || .09)) { acc = 0; const c = S('circle', { cx: x + (Math.random() - .5) * (o.spread || 30), cy: y, r: 3 + Math.random() * 4, fill: o.color || '#FFFFFF', opacity: .7 }, g); parts.push({ c, t: 0, vx: (Math.random() - .5) * 12 + (o.drift || 0), life: o.life || 1.4 }); }
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i]; q.t += dt;
        const f = q.t / q.life;
        if (f >= 1) { q.c.remove(); parts.splice(i, 1); continue; }
        q.c.setAttribute('cy', +q.c.getAttribute('cy') - (o.speed || 38) * dt);
        q.c.setAttribute('cx', +q.c.getAttribute('cx') + q.vx * dt);
        q.c.setAttribute('r', +q.c.getAttribute('r') + 6 * dt);
        q.c.setAttribute('opacity', .55 * (1 - f));
      }
      return on || parts.length;
    });
    return { g, stop() { on = false; }, kill() { on = false; run(); g.remove(); } };
  }
  /* bubbles rising in a liquid between x0 and x1, from yb to the surface y() */
  function bubbles(p, k, x0, x1, yb, surf, o) {
    o = o || {};
    const g = S('g', { class: 'bubbles', 'pointer-events': 'none' }, p), parts = [];
    let on = true, acc = 0;
    if (k.FAST) return { stop() {}, g };
    const run = k.loop(dt => {
      acc += dt;
      if (on && acc > (o.every || .07)) { acc = 0; const c = S('circle', { cx: x0 + Math.random() * (x1 - x0), cy: yb, r: 1.5 + Math.random() * 2.5, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 1.3, opacity: .85 }, g); parts.push({ c, v: 50 + Math.random() * 50 }); }
      const top = surf();
      for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i], y = +q.c.getAttribute('cy') - q.v * dt; if (y < top + 2) { q.c.remove(); parts.splice(i, 1); } else q.c.setAttribute('cy', y); }
      return on || parts.length;
    });
    return { g, stop() { on = false; }, kill() { on = false; run(); g.remove(); } };
  }
  /* drops falling from (x, y0) to y1(); each one calls onLand() */
  function drips(p, k, x, y0, y1, o) {
    o = o || {};
    const g = S('g', { class: 'drips', 'pointer-events': 'none' }, p), parts = [];
    let on = true, acc = 0;
    if (k.FAST) return { stop() {}, g };
    const run = k.loop(dt => {
      acc += dt;
      if (on && acc > (o.every || .45)) { acc = 0; parts.push({ c: S('ellipse', { cx: x, cy: y0, rx: 2.6, ry: 3.6, fill: o.color || C.water, opacity: .95 }, g), v: 40 }); }
      const end = y1();
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i]; q.v += 600 * dt; const y = +q.c.getAttribute('cy') + q.v * dt;
        if (y >= end) { q.c.remove(); parts.splice(i, 1); if (o.onLand) o.onLand(); } else q.c.setAttribute('cy', y);
      }
      return on || parts.length;
    });
    return { g, stop() { on = false; }, kill() { on = false; run(); g.remove(); } };
  }
  /* a stream of liquid poured along a path (array of points); grow 0..1 */
  function stream(p, pts, color, wdt) {
    const d = 'M' + pts.map(q => q.join(',')).join(' L');
    const path = S('path', { d, fill: 'none', stroke: color, 'stroke-width': wdt || 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .85 }, p);
    let len = 1; try { len = path.getTotalLength(); } catch (e) {}
    path.setAttribute('stroke-dasharray', len); path.setAttribute('stroke-dashoffset', len);
    return { path, grow(f) { path.setAttribute('stroke-dashoffset', len * (1 - f)); }, cut(f) { path.setAttribute('stroke-dasharray', `0 ${len * f} ${len}`); path.setAttribute('stroke-dashoffset', 0); }, remove() { path.remove(); } };
  }
  /* a round "zoom" lens drawn at (x, y): returns its inner group, clipped to the circle */
  function lens(p, x, y, r, title, sub) {
    const g = S('g', { class: 'lens' }, p), cid = id('lens');
    const defs = S('defs', null, g), cp = S('clipPath', { id: cid }, defs);
    S('circle', { cx: x, cy: y, r: r - 2 }, cp);
    S('circle', { class: 'zoom-ring', cx: x, cy: y, r }, g);
    const inner = S('g', { 'clip-path': `url(#${cid})` }, g);
    if (title) S('text', { class: 'zoom-cap', x, y: y + r + 20, 'text-anchor': 'middle' }, g, title);
    if (sub) { const parts = String(sub).split(' · '); parts.forEach((t, i) => S('text', { class: 'zoom-sub', x, y: y + r + 37 + i * 16, 'text-anchor': 'middle' }, g, t)); }
    return { g, inner, x, y, r };
  }
  window.KIT = { C, liquid, beaker, conical, rbFlask, funnel, stand, bunsen, tripod, thermometer, steam, bubbles, drips, stream, lens, id };
})();
