/* overlap-audit.js — loaded by the page only with ?audit=1&still=1 (15 Oct 2026, Daniel: "why are labels overlapping? make sure
   no other labels are overlapping in other tabs"). It walks every bench through every step, its mistakes included, and at
   each step measures the buttons on the drawing and the words drawn in it:
     ('#tog:<words>' presses a switch in the bench's header, such as the real-life view)
     hot×hot    two buttons overlap            hot×text   a button covers words of the drawing
     text×text  two pieces of words overlap    cut        a button or words reach past the edge of the bench
   The result is written into <pre id="audit"> (JSON), which tools/overlap-audit.mjs reads at several window sizes. */
(function () {
  'use strict';
  const S = window.SEP, B = window.BENCH;
  const RUNS = [
    [1, 'zoom', ['Gold', 'Distilled', 'Salt', 'Mineral', 'Black', 'Brass', 'Muddy', 'Air', 'Show what you see', 'Gold', '＋', '＋', '−', 'Salt', 'Distilled', 'Brass', 'Muddy', 'Air', 'Oil and water', 'Granite', 'Black', 'Show the particles']],
    [1, 'dissolve', ['Add a spoon of salt', 'Stir', 'Add a spoon of salt', 'Stir', 'Add a spoon of salt', 'Stir', 'Add a spoon of sand', 'Stir']],
    [1, 'colloid', ['Zoom into the milk', 'Leave them', 'Shine the torch']],
    [2, 'filter', ['Fold it in half', 'Fold it in half again', 'Open it', 'Put the cone', 'all in at once', '#oops', 'Pour slowly', 'Look closer', 'Try salt water', 'Pour slowly', 'Test a drop']],
    [3, 'evap', ['Pour it', 'Light', 'Keep heating hard', '#oops', 'Turn the Bunsen off']],
    [3, 'cryst', ['Pour it', 'Light', 'Test with', 'Stop and leave', '#oops', 'Heat for 2', 'Heat for 2', 'Heat for 2', 'Test with', 'Stop and leave', 'Filter and dry']],
    [4, 'simple', ['IN at the upper', 'Light', '#oops', 'IN at the lower', 'Light', 'Keep heating', '#oops', 'IN at the lower', 'Light', 'Turn off', 'Test a drop']],
    [4, 'frac', ['Switch on']],
    [5, 'chrom', ['A black pen', 'Spot the five', 'Above', '#oops', 'Below', 'Cover it', '#oops', 'A pencil', 'Spot the five', 'Below', 'Cover it', 'Remove it', '#tog:Real-life view']],
    [5, 'rf', ['Measure the dye', 'Measure the solvent', 'Divide']],
    [6, 'decant', ['Wait for', 'Hold to tip', 'Finished pouring']],
    [6, 'funnel', ['Open the tap', '#oops', 'Remove the stopper', 'Hold to open', 'Tap closed', 'New beaker']],
    [7, 'magnet', ['Start the belt', '#oops', 'Switch on', 'Start the belt', 'Move the magnet', 'Switch off']],
    [7, 'sieve', ['Hold to shake', 'Finished']],
    [8, 'finder', ['A solid and a liquid', 'Yes', 'The solid', 'Yes', 'Find another', 'Two solids', 'No', 'No', 'Yes']]
  ];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const area = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  function shown(el) {
    for (let e = el; e && e.tagName !== 'svg'; e = e.parentNode) {
      const o = e.getAttribute && e.getAttribute('opacity'); if (o != null && +o < .05) return false;
      const st = e.style; if (st && (st.display === 'none' || (st.opacity !== '' && +st.opacity < .05))) return false;
    }
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  }
  /* ?gallery=<part>: also copy the bench at every step into one long page, for a person to look at every state */
  const GAL = S.params.get('gallery'), gal = GAL ? document.createElement('div') : null;
  if (gal) { gal.id = 'gallery'; gal.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px;background:var(--page)'; }
  function shot(where) {
    if (!gal) return;
    const box = document.createElement('figure'); box.style.cssText = 'margin:0;background:var(--sheet);border:1px solid var(--rule);border-radius:10px;overflow:hidden';
    const c = document.querySelector('.stage').cloneNode(true); c.style.position = 'relative';
    const cap = document.createElement('figcaption'); cap.style.cssText = 'font:700 13px/1.35 Nunito,sans-serif;padding:6px 10px;color:var(--ink2)';
    cap.textContent = where + ' · ' + document.querySelector('.stepbar').innerText.replace(/\s+/g, ' ').slice(0, 230);
    box.appendChild(c); box.appendChild(cap); gal.appendChild(box);
  }
  const WORDS = { asks: new Set(), marked: new Set(), plain: new Set(), min: {}, hot: {} };
  function snap(where, out) {
    shot(where);
    const stage = document.querySelector('.stage').getBoundingClientRect();
    const hots = Array.from(document.querySelectorAll('.hot')).map(b => ({ n: b.textContent.trim(), r: b.getBoundingClientRect(), el: b }));
    const texts = Array.from(document.querySelectorAll('svg.sim text')).filter(t => t.textContent.trim() && shown(t)).map(t => ({ n: t.textContent.trim(), r: t.getBoundingClientRect(), el: t }));
    const say = (kind, a, b) => out.push({ where, kind, a, b });
    for (let i = 0; i < hots.length; i++) {
      const h = hots[i];
      if (area(h.r, stage) > 0 && (h.r.left < stage.left - 1 || h.r.right > stage.right + 1 || h.r.top < stage.top - 1 || h.r.bottom > stage.bottom + 1)) say('cut', h.n, 'button past the edge');
      for (let j = i + 1; j < hots.length; j++) if (area(h.r, hots[j].r) > 4) say('hot×hot', h.n, hots[j].n);
      texts.forEach(t => { if (area(h.r, t.r) > 6) say('hot×text', h.n, t.n); });
    }
    /* the question bubble beside the buttons (16 Oct 2026) covers no button and no words, and stays on the bench */
    document.querySelectorAll('.ask').forEach(q => {
      const r = q.getBoundingClientRect(), n = 'bubble: ' + q.textContent.trim().slice(0, 40);
      if (r.left < stage.left - 1 || r.right > stage.right + 1 || r.top < stage.top - 1 || r.bottom > stage.bottom + 1) say('cut', n, 'bubble past the edge');
      hots.forEach(h => { if (area(r, h.r) > 4) say('ask×hot', n, h.n); });
      texts.forEach(t => { if (area(r, t.r) > 6) say('ask×text', n, t.n); });
      const drawn = Array.from(document.querySelectorAll('svg.sim g.scene *, svg.sim g.labels *')).filter(e => /^(path|rect|circle|ellipse|line|polyline|polygon|image|use)$/i.test(e.tagName) && shown(e)).map(e => e.getBoundingClientRect()).filter(d => d.width * d.height > 0 && d.width * d.height < stage.width * stage.height * .35 && area(r, d) > 0);
      let pts = 0; for (let i = 0; i < 12; i++) for (let j = 0; j < 6; j++) { const x = r.left + (i + .5) * r.width / 12, y = r.top + (j + .5) * r.height / 6; if (drawn.some(d => x >= d.left && x <= d.right && y >= d.top && y <= d.bottom)) pts++; }
      if (pts / 72 > .2) say('ask×drawing', n, Math.round(100 * pts / 72) + '% of the bubble is over the drawing');
      WORDS.asks.add(q.textContent.trim());
    });
    /* how big the words are on screen, and which sentences under the bench are highlighted as things to do */
    texts.forEach(t => { const el = t.el, px = el.getScreenCTM().a * parseFloat(getComputedStyle(el).fontSize); if (px < (WORDS.min[t.n] || 99)) WORDS.min[t.n] = Math.round(px * 10) / 10; });
    hots.forEach(h => { const px = parseFloat(getComputedStyle(h.el).fontSize); if (px < (WORDS.hot[h.n] || 99)) WORDS.hot[h.n] = Math.round(px * 10) / 10; });
    document.querySelectorAll('.stepbar mark.do').forEach(m => WORDS.marked.add(m.textContent.trim()));
    document.querySelectorAll('.stepbar .st, .stepbar .msg > span').forEach(e => { const c = e.cloneNode(true); c.querySelectorAll('mark').forEach(m => m.remove()); c.textContent.split(/(?<=[.?!])\s+/).map(x => x.trim()).filter(x => x.length > 3).forEach(x => WORDS.plain.add(x)); });
    for (let i = 0; i < texts.length; i++) {
      const t = texts[i];
      if (area(t.r, stage) > 0 && (t.r.left < stage.left - 1 || t.r.right > stage.right + 1)) say('cut', t.n, 'words past the edge');
      for (let j = i + 1; j < texts.length; j++) { const a = area(t.r, texts[j].r); if (a > 8 && a > .12 * Math.min(t.r.width * t.r.height, texts[j].r.width * texts[j].r.height)) say('text×text', t.n, texts[j].n); }
    }
  }
  async function go() {
    const out = [];
    for (const [part, id, steps] of RUNS) {
      if (GAL && String(part) !== GAL) continue;
      B.open(part, id); await sleep(120);
      let i = 0;
      for (const label of steps) {
        snap(`${part}/${id}/${i} before "${label}"`, out);
        if (label.startsWith('#tog:')) { const b = Array.from(document.querySelectorAll('.togs .tog, .tog')).find(x => x.textContent.indexOf(label.slice(5)) >= 0); if (b) b.click(); else out.push({ where: `${part}/${id}/${i}`, kind: 'run', a: 'no switch: ' + label.slice(5), b: '' }); }
        else if (label === '#oops') { const b = document.querySelector('.msg.oops button'); if (b) b.click(); else out.push({ where: `${part}/${id}/${i}`, kind: 'run', a: 'no Try again', b: '' }); }
        else { const b = Array.from(document.querySelectorAll('.hot')).find(x => x.textContent.indexOf(label) >= 0); if (b) b.click(); else out.push({ where: `${part}/${id}/${i}`, kind: 'run', a: 'no button: ' + label, b: Array.from(document.querySelectorAll('.hot')).map(x => x.textContent).join(' / ') }); }
        await sleep(120); i++;
      }
      snap(`${part}/${id}/end`, out);
    }
    const pre = document.createElement('pre'); pre.id = 'audit';
    pre.textContent = JSON.stringify({ w: innerWidth, h: innerHeight, canvas: Math.round(document.querySelector('.canvas').getBoundingClientRect().width), problems: out, words: { asks: [...WORDS.asks], marked: [...WORDS.marked], plain: [...WORDS.plain], min: WORDS.min, hot: WORDS.hot } });
    document.body.appendChild(pre);
    if (gal) { document.querySelector('.layout').style.display = 'none'; document.querySelector('.top').style.display = 'none'; document.querySelector('.partbar').style.display = 'none'; document.body.insertBefore(gal, document.body.firstChild); scrollTo(0, 0); }
  }
  /* ?scrolltest=1: scrolling to each extension box switches the bench to its scene (unless a bench is half done) */
  async function scrollTest() {
    const out = [], title = () => document.querySelector('.bench__title').firstChild.textContent;
    for (const [part, scene] of [[1, 'Milk: a colloid'], [4, 'Fractional distillation of ethanol and water'], [5, 'Working out an Rf value']]) {
      S.openPart(part); scrollTo(0, 0); await sleep(300);
      const before = title();
      const box = document.querySelector(`#part-${part} .ext[data-scene="${{ 1: 'colloid', 4: 'frac', 5: 'rf' }[part]}"]`);
      box.scrollIntoView({ block: 'start' }); B.checkExt(); await sleep(600);
      const er = box.getBoundingClientRect();
      out.push({ part, before, after: title(), ok: title() === scene, extTop: Math.round(er.top), extH: Math.round(er.height), y: Math.round(scrollY), vh: innerHeight });
    }
    /* a question names the scene it needs: scrolling to it switches the bench, and scrolling back switches it back */
    for (const [part, q, scene] of [[1, 'p1-qc-5', 'Dissolve salt, then sand'], [1, 'p1-sort-state', 'Zoom in on eight samples'], [3, 'p3-qc-3', 'Crystals of copper sulfate'], [3, 'p3-qc-1', 'Evaporation of salt solution'], [6, 'p6-qc-1', 'Oil and water in a separating funnel']]) {
      if (S.cur() !== part) { S.openPart(part); scrollTo(0, 0); await sleep(300); }
      const before = title();
      document.querySelector(`#part-${part} [data-q="${q}"]`).scrollIntoView({ block: 'center' }); B.checkExt(); await sleep(500);
      out.push({ part: part + ' ' + q, before, after: title(), ok: title() === scene, extTop: 0, extH: 0, y: Math.round(scrollY), vh: innerHeight });
    }
    /* half done: part 5, one step taken, then scroll: the bench stays, the extension's button calls */
    S.openPart(2); await sleep(200); S.openPart(5); scrollTo(0, 0); await sleep(300);
    B.open(5, 'chrom'); await sleep(200);
    const pen = Array.from(document.querySelectorAll('.hot')).find(x => x.textContent.indexOf('A pencil') >= 0); if (pen) pen.click(); await sleep(300);
    document.querySelector('#part-5 .ext[data-scene="rf"]').scrollIntoView({ block: 'start' }); B.checkExt(); await sleep(600);
    out.push({ busy: true, stays: title() === 'Who wrote the note?', calls: !!document.querySelector('.scenes button.call') });
    const pre = document.createElement('pre'); pre.id = 'scroll'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
  }
  if (S.params.has('scrolltest')) setTimeout(scrollTest, 400); else setTimeout(go, 400);
})();
