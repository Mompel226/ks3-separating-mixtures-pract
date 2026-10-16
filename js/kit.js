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
  /* ---------------- the particles of liquid water (15 Oct 2026, Daniel: "if you're showing water as a liquid, you show
     the molecules moving past each other, but still with a hydrogen bond … if it's a solid, they're in a lattice … if it's
     a gas, they're passing past each other, but not bonding … otherwise you're gonna confuse the students"; and fewer,
     bigger particles, so a lens is never crowded). The pupils' particle model, as they drew it in class.
     liquidLens(k, lz, o) fills a lens with water particles that TOUCH and slide past each other: each frame they jiggle,
     then any two that overlap are pushed apart and the walls keep them in, so they stay packed but never fixed in place.
     Dashed hydrogen bonds join a hydrogen atom of one particle to the oxygen atom of a neighbour; they break and form
     again as the particles move.
     Dissolved particles (Daniel, same day: "the solvent … hugs … the solute … water will hug … ions of sodium and …
     chloride") are each held by four water particles that move with them: around a positive ion (sodium, the minerals)
     the water particles turn their OXYGEN atom inwards; around a negative ion (chloride) each turns ONE HYDROGEN atom
     inwards. add() shows it happening: the four nearest water particles turn and close round the new ion.
       o.scale   size (1: oxygen radius 12)      o.fill   share of the space the particles fill (.68: touching)
       o.box     the lens's square is the container (for a flow), not its circle
       o.flow    px/s downwards; a particle that leaves at the bottom comes back in at the top (filtration)
       o.drain   { x, y, w }: a hole w wide at (x, y) in a paper: the liquid above the paper slides sideways to it
       o.solids  [{ rect: [x0, y0, x1, y1] } | { circle: [x, y, r] } | { floor: x => y }]: places no particle enters
       o.extra   [{ kind, n, r, fill, hug: '+' | '-', sign, at: [[x, y]] }]: other particles among the water (held by water if hug
                 is set), at the places given or anywhere
     Returns { add(extra, at), setSolids(list), count(kind), destroy() }. */
  function liquidLens(k, lz, o) {
    o = o || {};
    const p = lz.inner, cx = lz.x, cy = lz.y, R = lz.r, s = o.scale || 1;
    const rO = 12 * s, rH = 7 * s, hx = 10 * s, hy = 8 * s, RW = 20 * s, reach = rH + rO + 10 * s, T = (o.speed || 24) * s;
    const DEG = Math.PI / 180, HA = Math.atan2(hy, hx) / DEG, HL = Math.hypot(hx, hy);
    let solids = o.solids || [];
    const rnd = (() => { let q = o.seed || 3; return () => (q = (q * 9301 + 49297) % 233280) / 233280; })();
    const root = S('g', null, p), bonds = S('g', null, root), layer = S('g', null, root), pool = [], ps = [];
    let stopped = false;
    const inSolid = (x, y, r) => solids.some(sh => sh.rect ? x > sh.rect[0] - r && x < sh.rect[2] + r && y > sh.rect[1] - r && y < sh.rect[3] + r
      : sh.circle ? Math.hypot(x - sh.circle[0], y - sh.circle[1]) < sh.circle[2] + r : sh.floor ? y > sh.floor(x) - r : false);
    const inside = (x, y, r) => o.box ? Math.abs(x - cx) <= R - r * .5 && Math.abs(y - cy) <= R - r * .5 : Math.hypot(x - cx, y - cy) < R - r - 2;
    const atom = (g, x, y, r, fill) => S('circle', { cx: x, cy: y, r, fill, stroke: 'rgba(0,0,0,.35)', 'stroke-width': .9 }, g);
    const makeWater = () => { const g = S('g', null, layer); atom(g, -hx, hy, rH, '#F4F6F8'); atom(g, hx, hy, rH, '#F4F6F8'); atom(g, 0, 0, rO, '#E0533F'); return g; };
    const water = (x, y, a) => ({ g: makeWater(), x, y, vx: 0, vy: 0, a, va: 0, r: RW, water: true });
    /* the four places round an ion, in the ion's own frame: [x, y, angle of the water particle] */
    const slots = (e, n) => {
      const out = [];
      for (let i = 0; i < n; i++) {
        const th = (i * 360 / n + 45) * DEG;
        if (e.hug === '-') { const d = e.r + rH + 1 * s + HL; out.push([Math.cos(th) * d, Math.sin(th) * d, th / DEG + 180 - HA]); }   /* one H inwards */
        else { const d = e.r + rO + 1 * s; out.push([Math.cos(th) * d, Math.sin(th) * d, th / DEG - 90]); }                             /* O inwards */
      }
      return out;
    };
    const hugR = e => e.hug === '-' ? e.r + rH + 1 * s + HL + rO + 1 * s : Math.hypot(e.r + rO + 1 * s + hy, hx) + rH;
    const other = (e, x, y) => {
      const q = { g: S('g', null, layer), x, y, vx: 0, vy: 0, a: rnd() * 360, va: 0, r: e.r + 3 * s, water: false, kind: e.kind, full: e.hug ? hugR(e) : e.r + 3 * s, form: 1, shell: [] };
      atom(q.g, 0, 0, e.r, e.fill);
      if (e.sign) S('text', { x: 0, y: e.r * .42, 'text-anchor': 'middle', 'font-size': e.r * 1.25, 'font-weight': 900, fill: '#FFFFFF' }, q.g, e.sign);
      if (e.hug) { q.r = q.full; slots(e, 4).forEach(sl => q.shell.push({ w: water(0, 0, 0), sl, from: null })); }
      return q;
    };
    /* how many: o.fill of the free space (the container less its solids), counted on a fine grid; they start on a loose
       honeycomb (any left over at random), then jiggle into a liquid's random packing */
    const capacity = () => { let free = 0; for (let y = cy - R; y < cy + R; y += 4) for (let x = cx - R; x < cx + R; x += 4) if (inside(x, y, 0) && !inSolid(x, y, 0)) free += 16; return (o.fill || .68) * free; };
    const used = () => ps.reduce((t, q) => t + Math.PI * (q.full || q.r) * (q.full || q.r), 0);
    const d = 2 * RW * 1.04, cand = [];
    for (let row = 0, y = cy - R + RW * .6; y < cy + R; row++, y += d * .866)
      for (let x = cx - R + RW * .6 + (row % 2) * d / 2; x < cx + R; x += d) if (inside(x, y, RW) && !inSolid(x, y, RW * .9)) cand.push([x, y]);
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
    const spot = () => { for (let t = 0; t < 200; t++) { const x = cx - R + rnd() * 2 * R, y = cy - R + rnd() * 2 * R; if (inside(x, y, RW * .5) && !inSolid(x, y, RW * .5)) return [x, y]; } return [cx, cy]; };
    const cap0 = capacity();
    let c = 0;
    (o.extra || []).forEach(e => { for (let i = 0; i < e.n; i++) { const [x, y] = (e.at && e.at[i]) || cand[c++] || spot(); ps.push(other(e, x, y)); } });
    while (used() + Math.PI * RW * RW <= cap0) { const [x, y] = cand[c++] || spot(); ps.push(water(x, y, rnd() * 360)); }
    function wall(q) {
      const r = q.r;
      if (o.box) { q.x = Math.max(cx - R + r * .5, Math.min(cx + R - r * .5, q.x)); if (!o.flow) q.y = Math.max(cy - R + r * .5, Math.min(cy + R - r * .5, q.y)); }
      else { const dx = q.x - cx, dy = q.y - cy, dd = Math.hypot(dx, dy), lim = R - r - 1; if (dd > lim) { q.x = cx + dx / dd * lim; q.y = cy + dy / dd * lim; q.vx *= -.5; q.vy *= -.5; } }
      solids.forEach(sh => {
        if (sh.rect) {
          const [x0, y0, x1, y1] = sh.rect, nx = Math.max(x0, Math.min(x1, q.x)), ny = Math.max(y0, Math.min(y1, q.y)), dx = q.x - nx, dy = q.y - ny, dd = Math.hypot(dx, dy);
          if (dd > 0 && dd < r) { q.x = nx + dx / dd * r; q.y = ny + dy / dd * r; }       /* touching an edge or a corner: out along the nearest point */
          else if (dd === 0) { const l = q.x - x0 + r, rr = x1 + r - q.x, t = q.y - y0 + r, b = y1 + r - q.y, m = Math.min(l, rr, t, b); if (m === l) q.x -= l; else if (m === rr) q.x += rr; else if (m === t) q.y -= t; else q.y += b; }
        }
        else if (sh.circle) { const [sx, sy, sr] = sh.circle, dx = q.x - sx, dy = q.y - sy, dd = Math.hypot(dx, dy) || 1, m = sr + r; if (dd < m) { q.x = sx + dx / dd * m; q.y = sy + dy / dd * m; } }
        else if (sh.floor) { const f = sh.floor(q.x) - r; if (q.y > f) q.y = f; }
      });
    }
    function relax(times) {
      for (let t = 0; t < times; t++) {
        for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, m = a.r + b.r, d2 = dx * dx + dy * dy;
          if (d2 < m * m && d2 > 1e-6) { const dd = Math.sqrt(d2), push = (m - dd) / 2, ux = dx / dd, uy = dy / dd; a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push; }
        }
        ps.forEach(wall);
      }
    }
    function step(dt, rand) {
      ps.forEach(q => {
        const slow = q.shell && q.shell.length ? .6 : 1;                 /* an ion with its water moves a little slower */
        q.vx += (rand() - .5) * T * 8 * dt; q.vy += (rand() - .5) * T * 8 * dt;
        const sp = Math.hypot(q.vx, q.vy), top = T * slow; if (sp > top) { q.vx *= top / sp; q.vy *= top / sp; }
        /* a hole: over the paper the liquid slides sideways towards it; in the hole it flows faster, as much per second as
           flows below the paper (a flow speeds up where it narrows), so nothing piles up */
        let down = o.flow || 0;
        if (o.drain && q.y < o.drain.y + 30) {
          const dx = q.x - o.drain.x, half = o.drain.w / 2;
          if (Math.abs(dx) < half - q.r * .5) down *= 2 * R / o.drain.w;
          else if (q.y < o.drain.y) { down *= .15; q.x -= Math.sign(dx) * (o.flow || 0) * 1.6 * dt; }
          /* a big particle (an ion with its water) is carried along the middle of the stream, so it meets the hole square on */
          if (!q.water && q.y > o.drain.y - 160) q.x -= dx * Math.min(1, dt * 1.6);
        }
        q.x += q.vx * dt; q.y += (q.vy + down) * dt;
        q.va = Math.max(-50, Math.min(50, (q.va + (rand() - .5) * 240 * dt) * .98)); q.a += q.va * dt * slow;
        if (q.form < 1) { q.form = Math.min(1, q.form + dt / 2); q.r = q.r0 + (q.full - q.r0) * q.form; }
        if (o.flow && q.y > cy + R + q.r) { q.y = cy - R - q.r; q.x = cx - R + q.r + rand() * (2 * R - 2 * q.r); }
      });
      relax(3);
    }
    /* every water particle in the lens, with where it is drawn now: the free ones, and the ones holding an ion */
    function bodies() {
      const out = [];
      ps.forEach(q => {
        if (q.water) { out.push(q); return; }
        const co = Math.cos(q.a * DEG), sn = Math.sin(q.a * DEG), e = q.form < 1 ? q.form * q.form * (3 - 2 * q.form) : 1;
        q.shell.forEach(sh => {
          const tx = q.x + sh.sl[0] * co - sh.sl[1] * sn, ty = q.y + sh.sl[0] * sn + sh.sl[1] * co, ta = q.a + sh.sl[2];
          if (sh.from && e < 1) { let da = ((ta - sh.from[2]) % 360 + 540) % 360 - 180; sh.w.x = sh.from[0] + (tx - sh.from[0]) * e; sh.w.y = sh.from[1] + (ty - sh.from[1]) * e; sh.w.a = sh.from[2] + da * e; }
          else { sh.w.x = tx; sh.w.y = ty; sh.w.a = ta; }
          out.push(sh.w);
        });
      });
      return out;
    }
    function draw() {
      ps.forEach(q => q.g.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})` + (q.water ? ` rotate(${q.a.toFixed(0)})` : '')));
      const W = bodies();
      W.forEach(w => { if (!w.water || !ps.includes(w)) w.g.setAttribute('transform', `translate(${w.x.toFixed(1)} ${w.y.toFixed(1)}) rotate(${w.a.toFixed(0)})`); });
      let n = 0;
      W.forEach(q => {
        const co = Math.cos(q.a * DEG), sn = Math.sin(q.a * DEG);
        [-1, 1].forEach(sd => {
          const x = q.x + sd * hx * co - hy * sn, y = q.y + sd * hx * sn + hy * co;
          let best = null, bd = reach;
          W.forEach(w => { if (w === q) return; const dd = Math.hypot(w.x - x, w.y - y); if (dd < bd) { bd = dd; best = w; } });
          if (!best) return;
          const ux = (best.x - x) / bd, uy = (best.y - y) / bd;
          const ln = pool[n] || (pool[n] = S('line', { stroke: '#2F4A66', 'stroke-width': 1.8 * Math.max(.8, s), 'stroke-dasharray': '3 2.5', 'stroke-linecap': 'round' }, bonds));
          ln.style.display = '';
          ln.setAttribute('x1', (x + ux * rH).toFixed(1)); ln.setAttribute('y1', (y + uy * rH).toFixed(1));
          ln.setAttribute('x2', (best.x - ux * rO).toFixed(1)); ln.setAttribute('y2', (best.y - uy * rO).toFixed(1));
          n++;
        });
      });
      for (let i = n; i < pool.length; i++) pool[i].style.display = 'none';
    }
    /* fit what is there into the space: free water particles leave (those inside a solid first) until it fits */
    function fit() {
      const cap = capacity();
      ps.filter(q => q.water && inSolid(q.x, q.y, 0)).forEach(q => { q.g.remove(); ps.splice(ps.indexOf(q), 1); });
      while (used() > cap) { const W = ps.filter(q => q.water); if (!W.length) break; const q = W[Math.floor(rnd() * W.length)]; q.g.remove(); ps.splice(ps.indexOf(q), 1); }
    }
    relax(30); for (let i = 0; i < 40; i++) step(1 / 30, rnd);
    draw();
    if (!k.FAST) k.loop(dt => { if (stopped || !root.isConnected) return false; step(dt, Math.random); draw(); return true; });
    return {
      /* a new particle among the water, at [x, y] (or a random place); one that is held by water takes the four nearest
         water particles, which turn and close round it */
      add(e, at) {
        const [x, y] = at || spot(), q = other(e, x, y);
        if (e.hug) {
          const free = ps.filter(w => w.water).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
          q.shell.forEach((sh, i) => { const w = free[i]; if (!w) return; sh.w.g.remove(); sh.w = w; sh.from = [w.x, w.y, w.a]; ps.splice(ps.indexOf(w), 1); });
          q.r0 = e.r + 3 * s; q.r = q.r0; q.form = k.FAST ? 1 : 0; if (k.FAST) q.r = q.full;
        }
        ps.push(q); fit(); relax(4); draw();
      },
      setSolids(list) { solids = list; fit(); relax(20); draw(); },
      count(kind) { return ps.filter(q => q.kind === kind).length; },
      destroy() { stopped = true; root.remove(); }
    };
  }
  /* a round "zoom" lens drawn at (x, y): returns its inner group, clipped to the circle */
  function lens(p, x, y, r, title, sub) {
    const g = S('g', { class: 'lens' }, p), cid = id('lens');
    const defs = S('defs', null, g), cp = S('clipPath', { id: cid }, defs);
    S('circle', { cx: x, cy: y, r: r - 2 }, cp);
    S('circle', { class: 'zoom-ring', cx: x, cy: y, r }, g);
    const inner = S('g', { 'clip-path': `url(#${cid})` }, g);
    if (title) S('text', { class: 'zoom-cap', x, y: y + r + 21, 'text-anchor': 'middle' }, g, title);
    if (sub) { const parts = String(sub).split(' · '); parts.forEach((t, i) => S('text', { class: 'zoom-sub', x, y: y + r + (title ? 42 : 21) + i * 19, 'text-anchor': 'middle' }, g, t)); }   /* 19 apart at 15 units (16 Oct 2026: bigger words) */
    return { g, inner, x, y, r };
  }
  /* a danger card (15 Oct 2026, Daniel: "add the warning sign … blinking … then you show goggles and lab coat on the left"):
     a blinking hazard triangle, what goes wrong, and what to wear, drawn at (x, y) = its top-left corner, 196 x 196 */
  function danger(p, x, y, text) {
    const g = S('g', { class: 'danger' }, p);
    S('rect', { x, y, width: 196, height: 206, rx: 12, fill: 'var(--sheet)', stroke: '#C62828', 'stroke-width': 3 }, g);
    const tri = S('g', { class: 'blink' }, g);
    S('path', { d: `M${x + 98},${y + 12} L${x + 128},${y + 62} L${x + 68},${y + 62} Z`, fill: '#F6C026', stroke: '#1B1B1B', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, tri);
    S('text', { x: x + 98, y: y + 57, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: '#1B1B1B' }, tri, '!');
    String(text).split('\n').forEach((t, i) => S('text', { x: x + 98, y: y + 84 + i * 19, 'text-anchor': 'middle', 'font-size': 14.5, 'font-weight': 900, fill: '#C62828' }, g, t));
    /* goggles */
    const gx = x + 52, gy = y + 146;
    S('path', { d: `M${gx - 36},${gy} Q${gx},${gy - 10} ${gx + 36},${gy}`, stroke: '#3A3F47', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    S('rect', { x: gx - 30, y: gy - 12, width: 27, height: 22, rx: 9, fill: '#BFE3F7', stroke: '#2F4357', 'stroke-width': 3 }, g);
    S('rect', { x: gx + 3, y: gy - 12, width: 27, height: 22, rx: 9, fill: '#BFE3F7', stroke: '#2F4357', 'stroke-width': 3 }, g);
    S('path', { d: `M${gx - 24},${gy - 5} l7,-3 M${gx + 9},${gy - 5} l7,-3`, stroke: '#FFFFFF', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
    S('text', { x: gx, y: gy + 38, 'text-anchor': 'middle', 'font-size': 14.5, 'font-weight': 800, fill: 'var(--ink)' }, g, 'goggles');
    /* lab coat */
    const cx = x + 146, cy = y + 146;
    S('path', { d: `M${cx - 13},${cy - 30} L${cx - 28},${cy - 23} L${cx - 34},${cy + 5} L${cx - 26},${cy + 7} L${cx - 22},${cy - 8} L${cx - 21},${cy + 30} L${cx + 21},${cy + 30} L${cx + 22},${cy - 8} L${cx + 26},${cy + 7} L${cx + 34},${cy + 5} L${cx + 28},${cy - 23} L${cx + 13},${cy - 30} L${cx},${cy - 16} Z`, fill: '#FFFFFF', stroke: '#5C6679', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
    S('path', { d: `M${cx - 13},${cy - 30} L${cx - 2},${cy - 6} M${cx + 13},${cy - 30} L${cx + 2},${cy - 6} M${cx},${cy - 12} L${cx},${cy + 30}`, stroke: '#5C6679', 'stroke-width': 2, fill: 'none' }, g);
    [-2, 9, 20].forEach(d => S('circle', { cx: cx + 4, cy: cy + d, r: 1.8, fill: '#5C6679' }, g));
    S('text', { x: cx, y: cy + 44, 'text-anchor': 'middle', 'font-size': 14.5, 'font-weight': 800, fill: 'var(--ink)' }, g, 'lab coat');
    return g;
  }
  /* a glass rod from (x1, y1) to (x2, y2): clear glass with an outline and a highlight, never a dark stick */
  function glassRod(p, x1, y1, x2, y2) {
    const g = S('g', { class: 'rod' }, p), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, L = Math.hypot(x2 - x1, y2 - y1);
    const r = S('g', { transform: `translate(${x1} ${y1}) rotate(${a})` }, g);
    S('rect', { x: 0, y: -3.5, width: L, height: 7, rx: 3.5, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.6 }, r);
    S('line', { x1: 5, y1: -1, x2: L - 5, y2: -1, stroke: 'var(--shine)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, r);
    return g;
  }
  window.KIT = { glassRod, danger, C, liquid, beaker, conical, rbFlask, funnel, stand, bunsen, tripod, thermometer, steam, bubbles, drips, stream, lens, liquidLens, id };
})();
