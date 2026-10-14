/* Part 7 · Sieve and magnet (15 Oct 2026). NOT the class mixture (Daniel, 14 Oct: pupils separate sand, iron filings,
   salt and paper clips at the bench themselves): a recycling plant's electromagnet over a belt of steel and aluminium
   cans, then the contrast (the magnet over the aluminium: nothing moves); and a garden sieve of soil and stones. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S;
  const BELT = 360, MX = 360;

  function can(p, type, col) {
    const g = S('g', null, p);
    if (type === 'steel') {
      S('rect', { x: -14, y: -38, width: 28, height: 38, rx: 3, fill: '#9AA3AC', stroke: '#5D666F', 'stroke-width': 1.4 }, g);
      for (let y = -32; y < -4; y += 6) S('line', { x1: -14, y1: y, x2: 14, y2: y, stroke: '#6F7880', 'stroke-width': 1 }, g);
      S('rect', { x: -14, y: -26, width: 28, height: 12, fill: '#E8E3D2', opacity: .9 }, g);
      S('text', { x: 0, y: -17, 'text-anchor': 'middle', 'font-size': 7.5, 'font-weight': 900, fill: '#5D666F' }, g, 'BEANS');
    } else {
      S('path', { d: 'M-12,0 L-12,-36 Q-12,-41 -8,-42 L8,-42 Q12,-41 12,-36 L12,0 Z', fill: col, stroke: 'rgba(0,0,0,.4)', 'stroke-width': 1.3 }, g);
      S('rect', { x: -9, y: -45, width: 18, height: 4, rx: 1.5, fill: '#D3D9DE', stroke: '#8F969C', 'stroke-width': .8 }, g);
      S('rect', { x: -12, y: -30, width: 24, height: 10, fill: '#FFFFFF', opacity: .35 }, g);
    }
    return g;
  }

  async function magnetRun(k) {
    const g = k.svg;
    /* the belt */
    S('rect', { x: -400, y: BELT, width: 1030, height: 16, rx: 8, fill: '#2B2F35' }, g);
    for (let x = -394; x < 620; x += 40) S('circle', { cx: x, cy: BELT + 8, r: 5, fill: '#4A5059' }, g);
    S('rect', { x: 60, y: BELT + 16, width: 10, height: 446 - BELT - 16, fill: 'var(--metal)' }, g);
    S('rect', { x: 580, y: BELT + 16, width: 10, height: 446 - BELT - 16, fill: 'var(--metal)' }, g);
    /* the bins */
    const bin = (x, t, col) => { S('path', { d: `M${x - 52},${380} L${x - 44},${446} L${x + 44},${446} L${x + 52},${380} Z`, fill: col, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }, g); S('text', { x, y: 472, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#fff' }, g, t); };
    bin(690, 'aluminium', '#3E7CB1');
    /* the crane and the electromagnet */
    S('rect', { x: 120, y: 92, width: 640, height: 12, rx: 3, fill: 'var(--metal)' }, g);
    const mag = S('g', null, g);
    S('line', { x1: 0, y1: 104, x2: 0, y2: 170, stroke: '#3C434B', 'stroke-width': 3 }, mag);
    S('rect', { x: -46, y: 170, width: 92, height: 34, rx: 6, fill: '#3C434B' }, mag);
    for (let x = -38; x <= 38; x += 8) S('line', { x1: x, y1: 174, x2: x, y2: 200, stroke: '#C77B2E', 'stroke-width': 4 }, mag);
    const glow = S('rect', { x: -48, y: 168, width: 96, height: 38, rx: 7, fill: 'none', stroke: '#F2C230', 'stroke-width': 3, opacity: 0 }, mag);
    let mx = MX; mag.setAttribute('transform', `translate(${mx} 0)`);
    k.label('electromagnet', MX - 70, 190, MX - 48, 190, { anchor: 'end', layer: g, fade: false });
    /* the cans */
    const types = ['steel', 'al', 'al', 'steel', 'al', 'steel', 'al', 'steel'];
    const alCols = ['#C8322F', '#2E9E5B', '#2F6FCA', '#D9A520'];
    const cans = types.map((t, i) => { const e = can(g, t === 'steel' ? 'steel' : 'al', alCols[i % 4]); return { e, t, x: -40 - i * 74, y: BELT, s: 'belt', vy: 0 }; });
    const put = c => c.e.setAttribute('transform', `translate(${c.x} ${c.y})`);
    cans.forEach(put);
    let on = false, running = false, stuck = 0, inAl = { steel: 0, al: 0 };
    const tick = dt => {
      cans.forEach(c => {
        if (c.s === 'belt' && running) { c.x += 120 * dt; if (on && c.t === 'steel' && Math.abs(c.x - mx) < 40) { c.s = 'lift'; c.slot = stuck++; } if (c.x > 625) { c.s = 'fall'; c.vy = 0; } }
        else if (c.s === 'lift') { const tx = mx - 45 + c.slot * 30, ty = 252; c.x += (tx - c.x) * Math.min(1, dt * 10); c.y += (ty - c.y) * Math.min(1, dt * 10); }
        else if (c.s === 'stuck') { c.x = mx - 45 + c.slot * 30; }
        else if (c.s === 'fall') { c.vy += 900 * dt; c.y += c.vy * dt; c.x += 60 * dt; if (c.y > 438) { const n = inAl.steel + inAl.al; c.y = 438 - (n > 3 ? 14 : 0); c.x = 656 + (n % 4) * 22; c.s = 'bin'; inAl[c.t === 'steel' ? 'steel' : 'al']++; } }
        put(c);
      });
      cans.forEach(c => { if (c.s === 'lift' && Math.abs(c.y - 252) < 2) c.s = 'stuck'; });
      return true;
    };
    const setOn = v => { on = v; glow.setAttribute('opacity', v ? 1 : 0); };
    if (!k.FAST) k.loop(tick);
    const fastRun = () => { for (let i = 0; i < 1200; i++) tick(1 / 60); };
    for (;;) {
      k.step(1, 3, 'A belt brings steel cans and aluminium cans. The electromagnet works only when it is switched on. Start the belt.');
      const c = await k.choose((on ? [] : [{ id: 'on', x: MX + 70, y: 186, label: 'Switch on the magnet', side: 'r' }]).concat([{ id: 'go', x: 160, y: 300, label: 'Start the belt' }]));
      if (c === 'on') { setOn(true); continue; }
      running = true;
      if (k.FAST) fastRun(); else await k.tween(11000, () => {});
      running = false;
      if (inAl.steel) {
        await k.oops('Steel cans went into the aluminium bin, because the magnet was <b>off</b> when they passed. Switch the magnet on <b>before</b> you start the belt.');
        cans.forEach((c, i) => { c.x = -40 - i * 74; c.y = BELT; c.s = 'belt'; put(c); }); stuck = 0; inAl = { steel: 0, al: 0 }; setOn(false);
        continue;
      }
      break;
    }
    k.label('steel cans', MX + 80, 262, MX + 48, 262, { anchor: 'start' });
    k.step(2, 3, 'The magnet pulled out every steel can; the aluminium cans went on into the bin. Does the magnet attract aluminium? Try it.');
    await k.choose([{ id: 'al', x: 650, y: 320, label: 'Move the magnet over the aluminium bin', side: 'l' }]);
    k.clearLabels();
    /* drop the steel first, then hover over the aluminium */
    await k.tween(1200, t => { mx = MX + (690 - MX) * t; mag.setAttribute('transform', `translate(${mx} 0)`); if (k.FAST) tick(0); });
    k.say('The magnet is on, right over the aluminium cans.');
    await k.wait(1300);
    k.label('nothing moves', 600, 330, 660, 400, { anchor: 'end' });
    k.step(3, 3, 'Not one aluminium can moved. Put the steel cans in their own bin.');
    await k.choose([{ id: 'drop', x: 640, y: 300, label: 'Switch off over the steel bin', side: 'l' }]);
    k.clearLabels();
    const sb = S('g', null, g);
    S('path', { d: `M${458},${380} L${466},${446} L${554},${446} L${562},${380} Z`, fill: '#6D747B', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }, sb);
    S('text', { x: 510, y: 472, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#fff' }, sb, 'steel');
    g.insertBefore(sb, cans[0].e);
    await k.tween(1000, t => { mx = 690 + (510 - 690) * t; mag.setAttribute('transform', `translate(${mx} 0)`); if (k.FAST) tick(0); });
    setOn(false);
    const steel = cans.filter(c => c.t === 'steel');
    steel.forEach(c => { c.s = 'drop'; c.y0 = c.y; });
    await k.tween(700, t => steel.forEach((c, i) => { c.y = c.y0 + (430 - c.y0) * t * t; c.x = 482 + i * 16; put(c); }));
    k.finish('Steel is <b>magnetic</b>: the magnet attracted it. Aluminium is not, so it stayed. Only a few metals are magnetic: iron, steel, nickel and cobalt.');
  }

  /* ---------------- the sieve ---------------- */
  async function sieveRun(k) {
    const g = k.svg;
    const tray = S('g', null, g);
    S('path', { d: 'M250,402 L262,446 L538,446 L550,402 Z', fill: '#7D6B55', stroke: '#4F4234', 'stroke-width': 1.6 }, tray);
    const heap = S('path', { d: '', fill: '#6B4A2B' }, tray);
    const sv = S('g', null, g);
    const RIMY = 250, MESH = 300;
    S('rect', { x: 240, y: RIMY, width: 320, height: MESH - RIMY, fill: 'none', stroke: '#9C7A4C', 'stroke-width': 10, rx: 6 }, sv);
    const mesh = S('g', null, sv);
    for (let x = 246; x <= 554; x += 9) S('line', { x1: x, y1: MESH - 4, x2: x + 4, y2: MESH + 4, stroke: '#6E6E6E', 'stroke-width': 1.2 }, mesh);
    S('line', { x1: 240, y1: MESH, x2: 560, y2: MESH, stroke: '#6E6E6E', 'stroke-width': 2 }, mesh);
    const soil = S('g', null, sv), stones = S('g', null, sv);
    const fine = [];
    for (let i = 0; i < 160; i++) fine.push(S('circle', { cx: 252 + Math.random() * 296, cy: MESH - 4 - Math.random() * 30, r: 1.8 + Math.random() * 1.4, fill: i % 3 ? '#6B4A2B' : '#7D5A36' }, soil));
    [[300, 284, 14], [350, 288, 10], [410, 282, 17], [470, 289, 12], [520, 285, 15], [380, 290, 9]].forEach(([x, y, r]) => S('ellipse', { cx: x, cy: y, rx: r, ry: r * .7, fill: '#8E9399', stroke: '#5F656B', 'stroke-width': 1.3 }, stones));
    k.label('sieve', 214, 276, 236, 276, { anchor: 'end', layer: g, fade: false });
    k.label('soil and stones', 620, 260, 560, 280, { anchor: 'start', layer: g, fade: false });
    k.step(1, 1, 'Garden soil with stones in it. <b>Press and hold</b> to shake the sieve.');
    let shaken = 0, ph = 0, left = fine.slice();
    const falling = [];
    const shake = dt => {
      shaken += dt; ph += dt * 30;
      sv.setAttribute('transform', `translate(${Math.sin(ph) * 7} 0)`);
      const n = Math.min(left.length, Math.ceil(dt * 60));
      for (let i = 0; i < n; i++) { const p = left.splice(Math.floor(Math.random() * left.length), 1)[0]; if (!p) break; p.remove(); const c = S('circle', { cx: +p.getAttribute('cx'), cy: MESH + 4, r: p.getAttribute('r'), fill: p.getAttribute('fill') }, tray); falling.push({ c, v: 0 }); }
      for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += 700 * dt; const y = +f.c.getAttribute('cy') + f.v * dt; if (y > 432 - (fine.length - left.length) * .1) { f.c.remove(); falling.splice(i, 1); } else f.c.setAttribute('cy', y); }
      const fr = 1 - left.length / fine.length;
      heap.setAttribute('d', `M268,440 Q400,${440 - 34 * fr} 532,440 Z`);
    };
    for (;;) {
      await k.choose([
        { id: 'shake', x: 400, y: 214, label: 'Hold to shake the sieve', onHold: shake, onPress: v => { if (!v) sv.setAttribute('transform', ''); }, fastHold: 4 },
        { id: 'done', x: 660, y: 340, label: 'Finished', side: 'r' }
      ]);
      if (left.length <= 20) break;
      k.note('Most of the soil is still in the sieve: shake a bit longer.');
    }
    falling.forEach(f => f.c.remove()); left.forEach(p => p.remove());
    k.label('stones: too big to pass', 620, 286, 532, 286, { anchor: 'start' });
    k.label('soil', 620, 430, 500, 432, { anchor: 'start' });
    k.finish('The small soil particles fell through the holes of the sieve; the stones are too big, so they stayed. A sieve separates by <b>size</b>.');
  }

  B.define(7, [
    { id: 'magnet', name: 'Magnet', title: 'The recycling plant', view: [20, 70, 760], task: { id: 'p7-sim-magnet', title: 'Bench: sorted steel and aluminium cans with a magnet' }, run: magnetRun,
      alt: 'A conveyor belt of steel cans and aluminium drink cans under an electromagnet on a crane, with a bin for aluminium at the end.' },
    { id: 'sieve', name: 'Sieve', title: 'A sieve of garden soil', view: [140, 150, 600], task: { id: 'p7-sim-sieve', title: 'Bench: sieved soil' }, run: sieveRun,
      alt: 'A round garden sieve holding soil and stones over a wooden tray.' }
  ]);
})();
