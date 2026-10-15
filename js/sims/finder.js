/* Part 8 · the method finder (15 Oct 2026): questions a pupil asks about a mixture, one at a time, ending at a method.
   It records nothing; the jobs on the right are the checks. */
(function () {
  'use strict';
  const B = window.BENCH, S = B.S;
  const T = {
    start: { q: 'What is in the mixture?', a: [['A solid and a liquid', 'sl'], ['Two liquids', 'll'], ['Two solids', 'ss'], ['Coloured dyes, as in an ink', 'chrom']] },
    sl: { q: 'Is the solid dissolved?', a: [['Yes: you cannot see it', 'keep'], ['No: you can see the bits', 'filt']] },
    keep: { q: 'Which part do you want to keep?', a: [['The solid', 'big'], ['The liquid', 'dist']] },
    big: { q: 'Do you want large, pure crystals?', a: [['Yes', 'cryst'], ['No: any dry solid will do', 'evap']] },
    ll: { q: 'Do the two liquids mix?', a: [['No: they form two layers', 'funnel'], ['Yes: they mix completely', 'frac']] },
    ss: { q: 'Is one of the solids magnetic (iron or steel)?', a: [['Yes', 'magnet'], ['No', 'sol']] },
    sol: { q: 'Does one of them dissolve in water?', a: [['Yes', 'dfe'], ['No', 'size']] },
    size: { q: 'Are the pieces different sizes?', a: [['Yes', 'sieve'], ['No', 'hand']] },
    filt: { m: 'Filtration', d: 'The filter paper keeps the insoluble solid (the residue); the liquid passes through (the filtrate). If a lot of solid has settled, decant first.' },
    evap: { m: 'Evaporation', d: 'Heat the solution: the liquid turns into a gas and leaves; the solid stays.' },
    cryst: { m: 'Crystallisation', d: 'Heat until the solution is saturated, then let it cool: crystals form.' },
    dist: { m: 'Simple distillation', d: 'Boil the solution and cool the vapour in a condenser: you collect the pure liquid.' },
    funnel: { m: 'Separating funnel', d: 'Open the tap and let the bottom (denser) layer flow out. Decanting also works, less exactly.' },
    frac: { m: 'Fractional distillation', d: 'The liquid with the lower boiling point boils first and reaches the beaker first. (Extension)' },
    magnet: { m: 'Magnet', d: 'The magnet attracts the iron or steel out of the mixture.' },
    sieve: { m: 'Sieve', d: 'Small pieces fall through the holes; big pieces stay.' },
    dfe: { m: 'Dissolve, filter, evaporate', d: 'Add water to dissolve one solid; filter out the other; evaporate the solution to get the first solid back.' },
    hand: { m: 'Pick them apart by hand', d: 'Use colour or shape, with tweezers, and only if it is safe.' },
    chrom: { m: 'Chromatography', d: 'The dyes travel different distances up the paper and separate.' }
  };
  function wrap(t, n) { const out = []; let ln = ''; t.split(' ').forEach(w => { if ((ln + ' ' + w).trim().length > n) { out.push(ln.trim()); ln = w; } else ln += ' ' + w; }); if (ln.trim()) out.push(ln.trim()); return out; }

  /* effort first (memory effort-before-explanations): the finder opens once a job has had two tries */
  const unlocked = () => Object.keys(window.QS || {}).some(id => id.indexOf('p8-job') === 0 && ((window.SEP.ans.get(id) || {}).tries || 0) >= 2);
  async function run(k) {
    const g = k.svg;
    const card = S('g', null, g);
    if (!unlocked() && !k.FAST) {
      S('rect', { x: 70, y: 60, width: 660, height: 360, rx: 18, fill: 'var(--sheet)', stroke: 'var(--rule)', 'stroke-width': 1.5 }, card);
      S('text', { x: 400, y: 200, 'text-anchor': 'middle', 'font-size': 44 }, card, '🔒');
      ['The method finder opens when you have', 'tried a job twice. Think about each job first.'].forEach((t, i) => S('text', { x: 400, y: 262 + i * 32, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: 'var(--ink2)' }, card, t));
      k.step('Method finder', 0, 'Choose the methods for the jobs. If you are stuck on a job after two tries, the finder opens here.');
      while (!unlocked()) await k.wait(1000);
      card.innerHTML = '';
    }
    for (;;) {
      let node = 'start'; const trail = [];
      k.step('Method finder', 0, 'Answer the questions about your mixture. The finder records nothing: it is there to help.');
      for (;;) {
        const n = T[node];
        card.innerHTML = '';
        S('rect', { x: 70, y: 60, width: 660, height: 360, rx: 18, fill: 'var(--sheet)', stroke: 'var(--rule)', 'stroke-width': 1.5 }, card);
        trail.forEach((t, i) => S('text', { x: 100, y: 96 + i * 22, 'font-size': 14, 'font-weight': 700, fill: 'var(--ink3)' }, card, '✓ ' + t));
        const y0 = 110 + trail.length * 22;
        if (n.m) {
          S('text', { x: 100, y: y0 + 10, 'font-size': 14, 'font-weight': 900, fill: 'var(--accent-ink)', 'letter-spacing': '.12em' }, card, 'USE');
          S('text', { x: 100, y: y0 + 50, 'font-size': 36, 'font-weight': 900, fill: 'var(--ink)' }, card, n.m);
          wrap(n.d, 52).forEach((ln, i) => S('text', { x: 100, y: y0 + 88 + i * 24, 'font-size': 18, 'font-weight': 600, fill: 'var(--ink2)' }, card, ln));
          await k.choose([{ id: 'again', x: 400, y: 450, label: '↺ Find another method' }]);
          break;
        }
        wrap(n.q, 40).forEach((ln, i) => S('text', { x: 100, y: y0 + 26 + i * 34, 'font-size': 28, 'font-weight': 900, fill: 'var(--ink)' }, card, ln));
        const id = await k.choose(n.a.map((a, i) => ({ id: a[1], x: 400, y: y0 + 110 + i * 56, label: a[0], quiet: true })));
        trail.push(n.q.replace(/\?$/, '') + ': ' + n.a.find(a => a[1] === id)[0]);
        node = id;
      }
    }
  }
  B.define(8, [{ id: 'finder', name: 'Method finder', title: 'Method finder', kicker: 'Part 8 · if you are stuck', run,
                 alt: 'A card that asks questions about a mixture, one at a time, and names a method to separate it.' }]);
})();
