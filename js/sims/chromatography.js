/* Part 5 · Chromatography: who wrote the note? (15 Oct 2026). The two classic mistakes of Daniel's chromatography
   sheet are on offer: a start line in pen (it runs) and water above the start line (the spots wash into the beaker).
   The bench never names the pen that matches: that is the pupil's check (p5-qc-3).
   Distances: 20 units = 1 cm; the start line to the solvent front is 10.0 cm, so Rf = height ÷ 200. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S;
  const PX0 = 268, PX1 = 532, PTOP = 154, PBOT = 432, LINE = 400, CM = 20, FRONT = LINE - 10 * CM;
  const COLS = { Y: '#E9B820', R: '#D8343A', B: '#2A5FC8', P: '#8A3FC2' };
  const RF = { Y: .80, R: .55, B: .25, P: .40 };
  const INKS = [['X', ['Y', 'R', 'B']], ['A', ['Y', 'B']], ['B', ['Y', 'R', 'B']], ['C', ['R', 'P', 'B']], ['D', []]];
  const xs = i => PX0 + 34 + i * 49;

  async function run(k) {
    const g = k.svg;
    const defs = S('defs', null, g), f = S('filter', { id: 'inkblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    S('feGaussianBlur', { stdDeviation: 1.6 }, f);
    /* the paper hangs from a glass rod laid across the beaker (drawn first: it is inside the beaker) */
    const paper = S('g', null, g);
    S('rect', { class: 'paper', x: PX0, y: PTOP, width: PX1 - PX0, height: PBOT - PTOP }, paper);
    const wet = S('rect', { x: PX0 + 1, y: PBOT, width: PX1 - PX0 - 2, height: 0, fill: '#9CC9EC', opacity: .28 }, paper);
    const lineEl = S('line', { x1: PX0 + 10, y1: LINE, x2: PX1 - 10, y2: LINE, stroke: '#6E6E6E', 'stroke-width': 2, 'stroke-dasharray': PX1 - PX0, 'stroke-dashoffset': PX1 - PX0 }, paper);
    const run1 = S('g', null, paper), spots = S('g', null, paper);
    const bk = K.beaker(g, 400, 446, 320, 292, { color: '#BFDDF3', level: 0, opacity: .5 });
    S('line', { x1: PX0 - 40, y1: PTOP - 2, x2: PX1 + 40, y2: PTOP - 2, stroke: 'var(--glass)', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .8 }, g);
    INKS.forEach(([n], i) => S('text', { x: xs(i), y: LINE + 20, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#5A5A5A' }, paper, n));
    k.label('chromatography paper', PX1 + 40, 172, PX1 - 4, 172, { anchor: 'start', layer: g, fade: false });
    k.label('beaker', PX1 + 46, 300, 560, 300, { anchor: 'start', layer: g, fade: false });

    let pen = false;
    for (;;) {
      /* 1 · the start line */
      k.step(1, 5, 'Draw a start line across the paper, 2 cm from the bottom. What do you draw it with?');
      const c = await k.choose([
        { id: 'pencil', x: PX0 - 30, y: LINE - 26, label: 'A pencil', side: 'l' },
        { id: 'pen', x: PX1 + 30, y: LINE - 26, label: 'A black pen', side: 'r' }
      ]);
      pen = c === 'pen';
      lineEl.setAttribute('stroke', pen ? '#1F2B46' : '#6E6E6E'); lineEl.setAttribute('stroke-width', pen ? 2.6 : 2);
      await k.tween(700, t => lineEl.setAttribute('stroke-dashoffset', (PX1 - PX0) * (1 - t)));
      k.label('start line', PX1 + 40, LINE + 4, PX1 - 12, LINE + 4, { anchor: 'start' });

      /* 2 · the spots */
      k.step(2, 5, 'Put a small spot of each black ink on the line: the note (X), then pens A, B, C and D.');
      await k.choose([{ id: 's', x: 400, y: LINE - 50, label: 'Spot the five inks' }]);
      spots.innerHTML = ''; run1.innerHTML = '';
      const blobs = [];
      for (let i = 0; i < INKS.length; i++) { const e = S('ellipse', { cx: xs(i), cy: LINE, rx: 0, ry: 0, fill: '#1B1B22', filter: 'url(#inkblur)' }, spots); blobs.push(e); await k.tween(180, t => { e.setAttribute('rx', 8 * t); e.setAttribute('ry', 6 * t); }); }

      /* 3 · the water */
      let ok = false;
      for (;;) {
        k.step(3, 5, 'Pour water into the beaker. How high should the water come?');
        const w = await k.choose([
          { id: 'below', x: PX1 + 40, y: LINE + 30, label: 'Below the start line', side: 'r' },
          { id: 'above', x: PX0 - 40, y: LINE - 46, label: 'Above the start line', side: 'l' }
        ]);
        const to = w === 'below' ? (446 - 416) / 284 : (446 - 384) / 284;
        await k.tween(1100, t => bk.liq.set(to * t));
        if (w === 'above') {
          await k.tween(1400, t => { blobs.forEach(b => { b.setAttribute('rx', 8 + 14 * t); b.setAttribute('ry', 6 + 4 * t); b.setAttribute('opacity', 1 - t); }); bk.liq.color(t > .5 ? '#9FB3C4' : '#BFDDF3'); });
          await k.oops('The spots were under the water, so the dyes <b>dissolved into the water in the beaker</b> instead of moving up the paper. The water must stay below the start line.');
          bk.liq.set(0).color('#BFDDF3'); blobs.forEach(b => { b.setAttribute('rx', 8); b.setAttribute('ry', 6); b.setAttribute('opacity', 1); });
          continue;
        }
        ok = true; break;
      }
      if (!ok) continue;
      k.label('water (solvent)', PX1 + 46, 426, PX1 + 10, 426, { anchor: 'start' });

      /* 4 · the run */
      k.step(4, 5, 'Cover the beaker so the water does not evaporate, and wait. Watch the water soak up the paper.');
      await k.choose([{ id: 'go', x: 400, y: 130, label: 'Cover it and wait' }]);
      const lid = S('rect', { x: 236, y: PTOP - 14, width: 328, height: 6, rx: 3, fill: 'var(--glass-fill)', stroke: 'var(--glass)', 'stroke-width': 1.6 }, g);
      k.clearLabels();
      /* each ink's dyes, born at the start line */
      const dyes = [];
      INKS.forEach(([n, list], i) => list.forEach(d => dyes.push({ e: S('ellipse', { cx: xs(i), cy: LINE, rx: 8, ry: 6, fill: COLS[d], opacity: 0, filter: 'url(#inkblur)' }, run1), rf: RF[d] })));
      const penBands = pen ? [['#2C3E8F', .62], ['#7B3FB0', .34]].map(([c, rf]) => ({ e: S('rect', { x: PX0 + 10, y: LINE - 3, width: PX1 - PX0 - 20, height: 6, fill: c, opacity: 0, filter: 'url(#inkblur)' }, run1), rf })) : [];
      k.lapse('20 minutes in a few seconds');
      await k.tween(6000, t => {
        const front = (LINE - FRONT) * t, wy = 416 - (416 - FRONT) * t;
        wet.setAttribute('y', wy); wet.setAttribute('height', PBOT - wy);
        dyes.forEach(d => { d.e.setAttribute('cy', LINE - d.rf * front); d.e.setAttribute('opacity', Math.min(1, t * 4)); d.e.setAttribute('ry', 6 + 3 * t * d.rf); });
        blobs.forEach((b, i) => b.setAttribute('opacity', i === 4 ? 1 : Math.max(0, 1 - t * 4)));
        penBands.forEach(p => { p.e.setAttribute('y', LINE - 3 - p.rf * front); p.e.setAttribute('opacity', Math.min(.85, t * 3)); p.e.setAttribute('height', 6 + 10 * t); });
        if (pen) lineEl.setAttribute('opacity', Math.max(.25, 1 - t));
      }, B.lin);
      k.lapse(null);
      if (pen) {
        await k.oops('The start line was in <b>pen</b>. Pen ink is soluble too: it ran up the paper as coloured bands, mixed with the inks you are testing. Draw the line in <b>pencil</b>: pencil is insoluble.');
        lid.remove(); run1.innerHTML = ''; spots.innerHTML = ''; bk.liq.set(0); wet.setAttribute('y', PBOT); wet.setAttribute('height', 0);
        lineEl.setAttribute('opacity', 1); lineEl.setAttribute('stroke-dashoffset', PX1 - PX0); k.clearLabels();
        continue;
      }
      /* 5 · out, and mark the front */
      k.step(5, 5, 'The water is near the top. Remove the paper and mark, with a pencil, how far the water reached.');
      await k.choose([{ id: 'out', x: 400, y: 130, label: 'Remove it and mark the front' }]);
      lid.remove();
      await k.tween(900, t => { bk.liq.set((446 - 416) / 284 * (1 - t)); bk.g.setAttribute('opacity', 1 - .75 * t); });
      S('line', { x1: PX0 + 6, y1: FRONT, x2: PX1 - 6, y2: FRONT, stroke: '#6E6E6E', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, paper);
      k.label('solvent front', PX1 + 40, FRONT + 4, PX1 - 8, FRONT + 4, { anchor: 'start' });
      k.label('start line', PX1 + 40, LINE + 4, PX1 - 12, LINE + 4, { anchor: 'start' });
      /* a ruler beside the paper, 0 at the start line (for the Rf extension) */
      const ru = S('g', null, g);
      S('rect', { x: PX0 - 46, y: FRONT - 16, width: 30, height: LINE - FRONT + 32, rx: 3, fill: '#F7E7A8', stroke: '#B39A3E', 'stroke-width': 1.2 }, ru);
      for (let mm = 0; mm <= 110; mm++) { const y = LINE - mm * CM / 10; if (y < FRONT - 14) break; S('line', { x1: PX0 - 16, y1: y, x2: PX0 - 16 - (mm % 10 ? (mm % 5 ? 5 : 8) : 12), y2: y, stroke: '#5A4A10', 'stroke-width': mm % 10 ? .7 : 1.2 }, ru); if (mm % 10 === 0) S('text', { x: PX0 - 40, y: y + 4, 'font-size': 10, 'font-weight': 800, fill: '#5A4A10' }, ru, mm / 10); }
      S('text', { x: PX0 - 31, y: FRONT - 20, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: 'var(--ink2)' }, ru, 'cm');
      break;
    }
    k.finish('This pattern of spots is a <b>chromatogram</b>. Compare each pen with the note, X: which one has the same dyes, at the same heights? Answer in the checks.');
  }

  B.define(5, [{ id: 'chrom', name: 'Chromatography', title: 'Who wrote the note?', view: [40, 70, 720], task: { id: 'p5-sim', title: 'Bench: made the chromatogram of the five inks' }, run,
                 alt: 'A strip of chromatography paper hanging in a large beaker, with a start line and five spots of black ink: the note X and pens A, B, C and D.' }]);
})();
