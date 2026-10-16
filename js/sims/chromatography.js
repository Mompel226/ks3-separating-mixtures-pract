/* Part 5 · Chromatography: who wrote the note? (15 Oct 2026). The two classic mistakes of Daniel's chromatography
   sheet are on offer: a start line in pen (it runs) and water above the start line (the spots wash into the beaker).
   The bench never names the pen that matches: that is the pupil's check (p5-qc-3).
   Distances: 20 units = 1 cm; the start line to the solvent front is 10.0 cm, so Rf = height ÷ 200. */
(function () {
  'use strict';
  const B = window.BENCH, K = window.KIT, S = B.S;
  const PX0 = 268, PX1 = 532, PTOP = 154, PBOT = 432, LINE = 392, CM = 20, FRONT = LINE - 10 * CM;   /* the start line 2 cm above the bottom edge, as the step says */
  const COLS = { Y: '#E9B820', R: '#D8343A', B: '#2A5FC8', P: '#8A3FC2' };
  const RF = { Y: .80, R: .55, B: .25, P: .40 };
  const INKS = [['X', ['Y', 'R', 'B']], ['A', ['Y', 'B']], ['B', ['Y', 'R', 'B']], ['C', ['R', 'P', 'B']], ['D', []]];
  const xs = i => PX0 + 34 + i * 49;

  /* the real-life view (Daniel, 15 Oct 2026: "this is not how they are going to see things in real life, all colours are
     smeared"): each dye as a streak with a fading tail back to the start line, a soft, uneven head, colours that overlap,
     a faint stain left at the start. The positions are the diagram's, so the answers do not change. */
  function realView(layer) {
    const g = S('g', { class: 'real', opacity: 0, 'pointer-events': 'none' }, layer), defs = S('defs', null, g), fid = K.id('smear');
    const f = S('filter', { id: fid, x: '-80%', y: '-40%', width: '260%', height: '180%' }, defs);
    S('feTurbulence', { type: 'fractalNoise', baseFrequency: '.08 .03', numOctaves: 2, seed: 7, result: 'n' }, f);
    S('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 9, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }, f);
    S('feGaussianBlur', { in: 'd', stdDeviation: 2.6 }, f);
    INKS.forEach(([n, list], i) => {
      const x = xs(i);
      S('ellipse', { cx: x, cy: LINE, rx: 10, ry: 6, fill: list.length ? '#5A4A52' : '#1B1B22', opacity: list.length ? .35 : .9, filter: `url(#${fid})` }, g);
      list.slice().sort((a, b) => RF[a] - RF[b]).forEach(d => {
        const y = LINE - RF[d] * (LINE - FRONT), gid = K.id('tail');
        const gr = S('linearGradient', { id: gid, x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
        S('stop', { offset: 0, 'stop-color': COLS[d], 'stop-opacity': 0 }, gr); S('stop', { offset: .75, 'stop-color': COLS[d], 'stop-opacity': .3 }, gr); S('stop', { offset: 1, 'stop-color': COLS[d], 'stop-opacity': .55 }, gr);
        S('rect', { x: x - 7, y, width: 14, height: LINE - y, fill: `url(#${gid})`, filter: `url(#${fid})`, style: 'mix-blend-mode:multiply' }, g);
        S('ellipse', { cx: x, cy: y + 4, rx: 10, ry: 12 + 7 * RF[d], fill: COLS[d], opacity: .72, filter: `url(#${fid})`, style: 'mix-blend-mode:multiply' }, g);
      });
    });
    return g;
  }
  /* ... and a real photograph beside it (Daniel: "plus a real image next to it"), on the left where the ruler was: the
     ruler steps aside while the photo shows */
  function realPhoto(layer) {
    const ph = window.PHOTOS && window.PHOTOS.chrom; if (!ph) return null;
    const g = S('g', { class: 'real-photo' }, layer); g.style.display = 'none';
    /* the card stops short of the glass rod (x 228); the photo is shown 1.5 times larger than the clip, centred on the
       paper and its streaks, so the beaker's empty margins fall outside */
    const cp = K.id('clip'), Z = 162 * 1.5; S('rect', { x: 50, y: 160, width: 162, height: 162, rx: 5 }, S('clipPath', { id: cp }, S('defs', null, g)));
    S('rect', { x: 42, y: 152, width: 178, height: 226, rx: 9, fill: 'var(--sheet)', stroke: 'var(--rule)', 'stroke-width': 1.2 }, g);
    S('image', { href: ph.src, x: 131 - .52 * Z, y: 241 - .53 * Z, width: Z, height: Z, 'clip-path': `url(#${cp})` }, g);
    S('text', { x: 131, y: 346, 'text-anchor': 'middle', 'font-size': 15.5, 'font-weight': 800, fill: 'var(--ink)' }, g, 'Real chromatograms');
    const a = S('a', { href: ph.href, target: '_blank', rel: 'noopener' }, g);
    S('text', { x: 131, y: 366, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--ink3)' }, a, `Photo: ${ph.credit}, ${ph.licence}`);
    return g;
  }

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
    K.glassRod(g, PX0 - 40, PTOP - 2, PX1 + 40, PTOP - 2);
    INKS.forEach(([n], i) => S('text', { x: xs(i), y: LINE + 20, 'text-anchor': 'middle', 'font-size': 15.5, 'font-weight': 800, fill: '#5A5A5A' }, paper, n));
    k.label('chromatography paper', PX1 + 26, 146, PX1 - 4, 172, { anchor: 'start', layer: g, fade: false });
    const bkLabel = k.label('beaker', PX1 + 46, 300, 560, 300, { anchor: 'start', layer: g, fade: false });

    let pen = false, ru = null;
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
      k.label('start line', PX1 + 40, LINE, PX1 - 12, LINE, { anchor: 'start' });

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
          { id: 'below', x: PX1 + 40, y: LINE + 42, label: 'Below the start line', side: 'r' },
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
      k.step(4, 5, 'Cover the beaker so the water does not evaporate, and wait. Watch the water move up the paper.');
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
      await k.choose([{ id: 'out', x: 388, y: 130, label: 'Remove it and mark the front' }]);
      lid.remove();
      /* the paper comes out of the water: the beaker is taken away, and the paper hangs from a clamp to dry */
      const standG = S('g', { opacity: 0 }, g); g.insertBefore(standG, paper);
      K.stand(standG, PX1 + 92, 446, 330, PTOP - 2, PX1 + 36);
      bkLabel.remove();
      await k.tween(1000, t => { bk.g.setAttribute('transform', `translate(${420 * t} 0)`); bk.g.setAttribute('opacity', 1 - t); standG.setAttribute('opacity', t); });
      bk.g.remove();
      S('line', { x1: PX0 + 6, y1: FRONT, x2: PX1 - 6, y2: FRONT, stroke: '#6E6E6E', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, paper);
      k.label('solvent front', PX1 + 40, FRONT, PX1 - 8, FRONT, { anchor: 'start' });
      k.label('start line', PX1 + 40, LINE, PX1 - 12, LINE, { anchor: 'start' });
      /* a ruler beside the paper, 0 at the start line (for the Rf extension) */
      ru = S('g', null, g);
      S('rect', { x: PX0 - 46, y: FRONT - 16, width: 30, height: LINE - FRONT + 32, rx: 3, fill: '#F7E7A8', stroke: '#B39A3E', 'stroke-width': 1.2 }, ru);
      for (let mm = 0; mm <= 110; mm++) { const y = LINE - mm * CM / 10; if (y < FRONT - 14) break; S('line', { x1: PX0 - 16, y1: y, x2: PX0 - 16 - (mm % 10 ? (mm % 5 ? 5 : 8) : 12), y2: y, stroke: '#5A4A10', 'stroke-width': mm % 10 ? .7 : 1.2 }, ru); if (mm % 10 === 0) S('text', { x: PX0 - 40, y: y + 4, 'font-size': 14, 'font-weight': 800, fill: '#5A4A10' }, ru, mm / 10); }
      S('text', { x: PX0 - 31, y: FRONT - 20, 'text-anchor': 'middle', 'font-size': 13.5, 'font-weight': 800, fill: 'var(--ink2)' }, ru, 'cm');
      break;
    }
    /* real life: smeared dyes, beside a real photograph when the page has one */
    const real = realView(paper), photo = realPhoto(g);
    k.toggle('👁 Real-life view', '◻ Clear diagram', on => {
      real.setAttribute('opacity', on ? 1 : 0); run1.setAttribute('opacity', on ? 0 : 1); spots.setAttribute('opacity', on ? 0 : 1);
      if (photo) { photo.style.display = on ? '' : 'none'; if (ru) ru.style.display = on ? 'none' : ''; }
      k.say(on ? 'This is closer to what you see on real paper: the dyes <b>smear</b> into streaks and overlap, as in the photo of real chromatograms on the left. Compare the middle of each smear, at the same height, across the columns.' : 'The clear diagram: each dye drawn as one neat spot.');
    });
    k.finish('This pattern of spots is a <b>chromatogram</b>. Compare each pen with the note, X: which one has the same dyes, at the same heights? Answer in the checks.');
  }

  /* ---------------- Extension: an Rf value, worked out on the bench (Daniel, 15 Oct 2026: every extension gets its own
     animation). Shown on pen A's yellow dye, so the red dye of the note stays the pupil's own check (p5-ext-1). */
  async function rfRun(k) {
    const g = k.svg, defs = S('defs', null, g), f = S('filter', { id: 'inkblur2', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    S('feGaussianBlur', { stdDeviation: 1.6 }, f);
    K.stand(g, PX1 + 92, 446, 330, PTOP - 2, PX1 + 36);
    const paper = S('g', null, g);
    S('rect', { class: 'paper', x: PX0, y: PTOP, width: PX1 - PX0, height: PBOT - PTOP }, paper);
    S('rect', { x: PX0 + 1, y: FRONT, width: PX1 - PX0 - 2, height: PBOT - FRONT, fill: '#9CC9EC', opacity: .22 }, paper);
    K.glassRod(g, PX0 - 40, PTOP - 2, PX1 + 40, PTOP - 2);
    S('line', { x1: PX0 + 10, y1: LINE, x2: PX1 - 10, y2: LINE, stroke: '#6E6E6E', 'stroke-width': 2 }, paper);
    S('line', { x1: PX0 + 6, y1: FRONT, x2: PX1 - 6, y2: FRONT, stroke: '#6E6E6E', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, paper);
    INKS.forEach(([n, list], i) => { S('text', { x: xs(i), y: LINE + 20, 'text-anchor': 'middle', 'font-size': 15.5, 'font-weight': 800, fill: '#5A5A5A' }, paper, n);
      list.forEach(d => S('ellipse', { cx: xs(i), cy: LINE - RF[d] * (LINE - FRONT), rx: 8, ry: 6 + 3 * RF[d], fill: COLS[d], filter: 'url(#inkblur2)' }, paper));
      if (!list.length) S('ellipse', { cx: xs(i), cy: LINE, rx: 8, ry: 6, fill: '#1B1B22', filter: 'url(#inkblur2)' }, paper); });
    k.label('solvent front', PX1 + 40, FRONT, PX1 - 8, FRONT, { anchor: 'start', layer: g, fade: false });
    k.label('start line', PX1 + 40, LINE, PX1 - 12, LINE, { anchor: 'start', layer: g, fade: false });
    const ru = S('g', null, g);                                          /* the ruler, 0 at the start line */
    S('rect', { x: PX0 - 46, y: FRONT - 16, width: 30, height: LINE - FRONT + 32, rx: 3, fill: '#F7E7A8', stroke: '#B39A3E', 'stroke-width': 1.2 }, ru);
    for (let mm = 0; mm <= 110; mm++) { const y = LINE - mm * CM / 10; if (y < FRONT - 14) break; S('line', { x1: PX0 - 16, y1: y, x2: PX0 - 16 - (mm % 10 ? (mm % 5 ? 5 : 8) : 12), y2: y, stroke: '#5A4A10', 'stroke-width': mm % 10 ? .7 : 1.2 }, ru); if (mm % 10 === 0) S('text', { x: PX0 - 40, y: y + 4, 'font-size': 14, 'font-weight': 800, fill: '#5A4A10' }, ru, mm / 10); }
    S('text', { x: PX0 - 31, y: FRONT - 20, 'text-anchor': 'middle', 'font-size': 13.5, 'font-weight': 800, fill: 'var(--ink2)' }, ru, 'cm');
    /* the working, on a card to the right */
    const card = S('g', null, g), cx0 = 598;
    S('rect', { x: cx0, y: 226, width: 158, height: 160, rx: 12, fill: 'var(--sheet)', stroke: 'var(--rule2)', 'stroke-width': 1.5 }, card);
    S('text', { x: cx0 + 79, y: 252, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: 'var(--ink)' }, card, 'Rf of pen A’s yellow');
    const l1 = S('text', { x: cx0 + 14, y: 282, 'font-size': 16, 'font-weight': 800, fill: '#B8860B' }, card, '');
    const l2 = S('text', { x: cx0 + 14, y: 306, 'font-size': 16, 'font-weight': 800, fill: '#2A5FC8' }, card, '');
    const l3 = S('text', { x: cx0 + 14, y: 340, 'font-size': 18, 'font-weight': 900, fill: 'var(--ink)' }, card, '');
    const l4 = S('text', { x: cx0 + 14, y: 366, 'font-size': 18, 'font-weight': 900, fill: 'var(--ink)' }, card, '');
    const ax = xs(1), dyeY = LINE - RF.Y * (LINE - FRONT);
    const arrow = (x, y1, y2, col) => { const a = S('g', null, g), ln = S('line', { x1: x, y1, x2: x, y2: y1, stroke: col, 'stroke-width': 3 }, a), hd = S('path', { d: '', fill: col }, a);
      return { a, set(t) { const y = y1 + (y2 - y1) * t; ln.setAttribute('y2', y); hd.setAttribute('d', `M${x - 6},${y + 9} L${x},${y} L${x + 6},${y + 9} Z`); } }; };
    k.step(1, 3, '<b>Rf = distance moved by the dye ÷ distance moved by the solvent</b>, both measured from the start line. Work it out for the <b>yellow</b> dye of pen A. First, measure how far the dye moved.');
    await k.choose([{ id: 'm1', x: ax, y: 478, label: 'Measure the dye' }]);
    const a1 = arrow(ax + 18, LINE, dyeY, '#B8860B');
    await k.tween(1200, t => a1.set(t));
    l1.textContent = 'dye: 8.0 cm';
    k.step(2, 3, 'The yellow dye moved 8.0 cm (read the middle of the spot on the ruler). Now measure how far the solvent moved.');
    await k.choose([{ id: 'm2', x: PX1 - 30, y: 478, label: 'Measure the solvent' }]);
    const a2 = arrow(PX1 - 10, LINE, FRONT, '#2A5FC8');
    await k.tween(1200, t => a2.set(t));
    l2.textContent = 'solvent: 10.0 cm';
    k.step(3, 3, 'The solvent moved 10.0 cm. Divide the first distance by the second.');
    await k.choose([{ id: 'd', x: cx0 + 79, y: 478, label: 'Divide' }]);
    l3.textContent = 'Rf = 8.0 ÷ 10.0';
    await k.tween(600, t => { l4.textContent = t < .5 ? '' : '= 0.80'; });
    k.finish('Rf of pen A’s yellow dye = 8.0 ÷ 10.0 = <b>0.80</b>. An Rf has no unit and is always between 0 and 1. The note’s yellow dye has the same Rf, so it can be the same dye. Now work out the Rf of the <b>red</b> dye in X yourself, in the extension check.');
  }

  B.define(5, [{ id: 'chrom', name: 'Chromatography', title: 'Who wrote the note?', view: [40, 70, 720], task: { id: 'p5-sim', title: 'Bench: made the chromatogram of the five inks' }, run,
                 alt: 'A strip of chromatography paper hanging in a large beaker, with a start line and five spots of black ink: the note X and pens A, B, C and D.' },
               { id: 'rf', name: 'Rf values', ext: true, title: 'Working out an Rf value', view: [40, 70, 720], task: { id: 'p5-sim-rf', title: 'Bench: worked out an Rf value (extension)' }, run: rfRun,
                 alt: 'The finished chromatogram hanging from a clamp, with a ruler; arrows measure pen A’s yellow dye and the solvent front, and a card divides one by the other.' }]);
})();
