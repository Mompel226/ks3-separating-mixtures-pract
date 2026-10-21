/* ============================================================
   checks.js — the quick checks of Separating mixtures (15 Oct 2026): how each kind is drawn, marked and kept.
   Rules (from the IB practicals, Daniel 11–12 Oct 2026, and his choice for Year 7 on 14 Oct: "a mix"):
   - Key words are TYPED into gaps: spelling counts, capitals do not; one word bank for the page (js/words.js).
   - Methods, apparatus and order of steps are chosen, sorted or put in order.
   - Multiple choice: a new random order each time it is drawn; a wrong choice says only "Not this one"; the reason
     comes with the right answer (effort first). The record keeps each option by its place in the list (o0 = the first
     written), never its place on screen.
   - "Show the answers" only after two complete tries. A sorted or ordered answer is kept as the pupil left it and is
     marked as one whole: the page never says which piece is wrong (Daniel's pupils, 16 Sep 2026: being left to work it
     out made them think).
   Each question is drawn into <div class="q" data-q="<id>"> from window.QS (js/questions.js), registered for the
   teacher's board (SEP.reg), and told to the lesson record (SEP.L.check) at every Check or choice.
   ============================================================ */
(function () {
  'use strict';
  const S = window.SEP, { $, $$, h, esc, ans, L, reg } = S;

  /* ---------- typed words: one canonical form ---------- */
  function canon(s) {
    s = String(s == null ? '' : s).toLowerCase().normalize('NFKC')
      .replace(/[‘’`]/g, "'").replace(/[-‐-―_/]/g, ' ').replace(/[.,;:!?"()]+/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/^(the|a|an) /, '');
    s = s.replace(/crystalliz/g, 'crystallis').replace(/vaporiz/g, 'vaporis').replace(/sulph/g, 'sulf');
    s = s.replace(/°\s*c$/, '').trim();
    return s;
  }
  /* "[[residue]] … [[size|sizes]]": each gap's accepted answers, the first one shown when the answers are shown */
  function parseGaps(text) {
    const gaps = [];
    const html = esc(text).replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
      const opts = inner.split('|').map(x => x.replace(/&amp;/g, '&').replace(/&#39;/g, "'"));
      gaps.push(opts);
      const w = Math.max(7, Math.min(24, Math.max(...opts.map(o => o.length)) + 3));
      return `<input class="gap" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" data-g="${gaps.length - 1}" style="width:${w}ch" aria-label="gap ${gaps.length}">`;
    });
    return { html, gaps };
  }
  /* a gap holding a word that belongs to another gap of its anyOrder group still counts (size and solubility) */
  function markGaps(vals, gaps, groups) {
    const ok = vals.map((v, i) => gaps[i].some(a => canon(a) === canon(v)));
    (groups || []).forEach(gr => {
      const idx = gr.map(n => n - 1), want = idx.map(i => gaps[i]), used = new Set();
      idx.forEach(i => {
        const c = canon(vals[i]), j = want.findIndex((w, k) => !used.has(k) && w.some(a => canon(a) === c));
        ok[i] = j >= 0; if (j >= 0) used.add(j);
      });
    });
    return ok;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const LET = 'ABCDEFGH';

  /* ---------- the shell every check shares ---------- */
  function shell(box, q, label) {
    box.innerHTML = '';
    box.appendChild(h('div', { class: 'q__k' }, `<span>${esc(label || q.label || 'Quick check')}</span><span class="st" aria-live="polite"></span>`));
    /* where to look on the bench before answering (15 Oct 2026, Daniel: "guide to the animations that help them answer") */
    if (q.look) box.appendChild(h('p', { class: 'q__look' }, '<span aria-hidden="true">👀</span> <span><b>On the bench</b> · ' + q.look + '</span>'));
    return {
      status(t, ok) { const s = $('.q__k .st', box); s.textContent = t || ''; box.classList.toggle('ok', !!ok); },
      say(el, text, cls) { el.className = 'say' + (cls ? ' ' + cls : ''); el.textContent = text || ''; },
      why(text, shown) {
        let w = $('.why', box);
        if (!text) { if (w) w.remove(); return; }
        if (!w) { w = h('div', { class: 'why' }); box.appendChild(w); }
        w.className = 'why' + (shown ? ' shown' : ''); w.innerHTML = text;
      }
    };
  }
  const RIGHT = '✓ Right';

  /* ---------- gaps ---------- */
  function drawGaps(box, id, q) {
    const ui = shell(box, q), A = ans.get(id) || {};
    const { html, gaps } = q.table ? tableGaps(q) : parseGaps(q.text);
    if (q.stem) box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const body = h(q.table ? 'div' : 'p', { class: 'q__stem gapline' }, html); box.appendChild(body);
    const ins = $$('input.gap', body);
    const row = h('div', { class: 'q__row' }, '<button class="btn" type="button">Check</button><span class="say"></span>');
    box.appendChild(row);
    const btn = $('button', row), say = $('.say', row);
    let tries = A.tries || 0;
    (A.v || []).forEach((v, i) => { if (ins[i]) ins[i].value = v; });
    function lock(shown) {
      ins.forEach(i => { i.readOnly = true; }); btn.remove();
      const sb = $('.show', row); if (sb) sb.remove();
      ui.status(shown ? 'Answers shown' : RIGHT, !shown);
      ui.say(say, shown ? 'These are the answers. Read them, then continue.' : 'All right.', shown ? '' : 'ok');
      if (q.why) ui.why(q.why, shown);
    }
    function paint(ok) { ins.forEach((inp, i) => { inp.classList.toggle('right', !!ok[i]); inp.classList.toggle('wrong', !ok[i] && !!inp.value.trim()); }); }
    function showBtn() {
      if (tries < 2 || $('.show', row)) return;
      const sb = h('button', { class: 'btn ghost show', type: 'button' }, 'Show the answers'); row.insertBefore(sb, say);
      sb.addEventListener('click', () => { ins.forEach((inp, i) => { inp.value = gaps[i][0]; }); paint(gaps.map(() => true)); ans.put(id, { v: ins.map(i => i.value), shown: 1 }); lock(true); });
    }
    if (A.ok || A.shown) { paint(markGaps(ins.map(i => i.value), gaps, q.anyOrder)); if (A.shown) paint(gaps.map(() => true)); lock(!!A.shown); return; }
    if (A.marked) paint(markGaps(ins.map(i => i.value), gaps, q.anyOrder));
    if (tries) ui.status('Try ' + (tries + 1));
    showBtn();
    ins.forEach(inp => {
      inp.addEventListener('input', () => { inp.classList.remove('right', 'wrong'); ans.put(id, { v: ins.map(i => i.value), marked: 0 }); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    });
    btn.addEventListener('click', check);
    function check() {
      const vals = ins.map(i => i.value);
      if (vals.some(v => !v.trim())) { ui.say(say, 'Fill every gap first.', 'no'); return; }
      const ok = markGaps(vals, gaps, q.anyOrder), all = ok.every(Boolean);
      tries++; paint(ok);
      L.check(id, all, all ? [] : vals.map((v, i) => ok[i] ? null : (i + 1) + '=' + v.trim()).filter(Boolean));
      ans.put(id, { v: vals, tries, ok: all ? 1 : 0, marked: 1 });
      if (all) { lock(false); return; }
      ui.status('Try ' + (tries + 1));
      ui.say(say, ok.some(Boolean) ? 'Not right yet: change the ones in amber. Spelling counts.' : 'Not right yet. Spelling counts: check the word bank.', 'no');
      showBtn();
    }
  }
  function tableGaps(q) {
    const gaps = []; let n = 0;
    const cell = t => esc(t).replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
      const opts = inner.split('|'); gaps.push(opts); n++;
      const w = Math.max(9, Math.min(20, Math.max(...opts.map(o => o.length)) + 3));
      return `<input class="gap" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" data-g="${n - 1}" style="width:${w}ch" aria-label="${esc(q.table.find(r => r[1] === t)[0])}: property">`;
    });
    const html = `<table class="recap"><thead><tr><th>${esc(q.cols[0])}</th><th>${esc(q.cols[1])}</th></tr></thead><tbody>` +
      q.table.map(r => `<tr><td>${esc(r[0])}</td><td>${cell(r[1])}</td></tr>`).join('') + '</tbody></table>';
    return { html, gaps };
  }

  /* ---------- multiple choice ---------- */
  function drawMcq(box, id, q) {
    const ui = shell(box, q), A = ans.get(id) || {}, out = new Set(A.out || []);
    box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const ol = h('ol', { class: 'opts' }); box.appendChild(ol);
    const order = shuffle(q.a.map((_, i) => i));
    order.forEach((oi, k) => {
      const li = h('li'), b = h('button', { type: 'button', 'data-o': oi }, `<span class="lt">${LET[k]}</span><span>${esc(q.a[oi])}<span class="nt"></span></span>`);
      li.appendChild(b); ol.appendChild(li);
      b.addEventListener('click', () => choose(oi, b));
    });
    function mark(oi, b) {
      if (oi === 0) { b.classList.add('yes'); $$('button', ol).forEach(x => { x.disabled = true; }); ui.status(RIGHT, true); if (q.why) ui.why('<b>Why:</b> ' + q.why); }
      else { b.classList.add('no'); b.disabled = true; $('.nt', b).textContent = 'Not this one'; }
    }
    function choose(oi, b) {
      if (b.disabled) return;
      const right = oi === 0;
      L.check(id, right, right ? [] : ['o' + oi]);
      if (right) ans.put(id, { ok: 1 }); else { out.add(oi); ans.put(id, { out: Array.from(out) }); }
      mark(oi, b);
    }
    out.forEach(oi => { const b = $(`button[data-o="${oi}"]`, ol); if (b) mark(oi, b); });
    if (A.ok) mark(0, $('button[data-o="0"]', ol));
  }

  /* ---------- a number ---------- */
  function drawNum(box, id, q) {
    const ui = shell(box, q), A = ans.get(id) || {};
    box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const row = h('div', { class: 'q__row' }, `<input class="gap" type="text" inputmode="decimal" autocomplete="off" style="width:9ch" aria-label="your answer"> <span>${esc(q.unit || '')}</span><button class="btn" type="button">Check</button><span class="say"></span>`);
    box.appendChild(row);
    const inp = $('input', row), btn = $('button', row), say = $('.say', row);
    let tries = A.tries || 0;
    if (A.v != null) inp.value = A.v;
    const val = () => parseFloat(String(inp.value).replace(',', '.').replace(/[^0-9.\-]/g, ''));
    const isOk = () => { const v = val(); return isFinite(v) && Math.abs(v - q.ans) <= (q.tol || 0) + 1e-9; };
    function lock(shown) {
      inp.readOnly = true; btn.remove(); const sb = $('.show', row); if (sb) sb.remove();
      inp.classList.add('right'); ui.status(shown ? 'Answer shown' : RIGHT, !shown);
      ui.say(say, shown ? 'This is the answer.' : 'Right.', shown ? '' : 'ok');
      if (q.why) ui.why(q.why, shown);
    }
    function showBtn() {
      if (tries < 2 || $('.show', row)) return;
      const sb = h('button', { class: 'btn ghost show', type: 'button' }, 'Show the answer'); row.insertBefore(sb, say);
      sb.addEventListener('click', () => { inp.value = String(q.ans); ans.put(id, { v: inp.value, shown: 1 }); lock(true); });
    }
    if (A.ok || A.shown) { lock(!!A.shown); return; }
    if (tries) ui.status('Try ' + (tries + 1));
    showBtn();
    inp.addEventListener('input', () => { inp.classList.remove('right', 'wrong'); ans.put(id, { v: inp.value }); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    btn.addEventListener('click', check);
    function check() {
      if (!inp.value.trim() || !isFinite(val())) { ui.say(say, 'Type a number first.', 'no'); return; }
      const ok = isOk(); tries++;
      L.check(id, ok, ok ? [] : [inp.value.trim()]);
      ans.put(id, { v: inp.value, tries, ok: ok ? 1 : 0 });
      if (ok) { lock(false); return; }
      inp.classList.add('wrong'); ui.status('Try ' + (tries + 1));
      ui.say(say, q.hint && tries === 1 ? q.hint : 'Not right yet.', 'no'); showBtn();
    }
  }

  /* ---------- sort into boxes (press a card, then a box; or drag it) ---------- */
  function drawSort(box, id, q) {
    const ui = shell(box, q, q.label || 'Sort'), A = ans.get(id) || {};
    box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const tray = h('div', { class: 'tray', 'aria-label': 'Cards to sort' }); box.appendChild(tray);
    const bins = h('div', { class: 'bins' }); bins.style.setProperty('--n', q.bins.length); box.appendChild(bins);
    q.bins.forEach((b, i) => {
      const d = h('div', { class: 'bin', 'data-b': i, role: 'button', tabindex: '0', 'aria-label': 'Put the chosen card in: ' + b.t }, `<h4>${esc(b.t)}${b.s ? `<small>${esc(b.s)}</small>` : ''}</h4><div class="in"></div>`);
      bins.appendChild(d);
    });
    const row = h('div', { class: 'q__row' }, '<button class="btn" type="button">Check</button><span class="say"></span>'); box.appendChild(row);
    const btn = $('button', row), say = $('.say', row);
    let tries = A.tries || 0, sel = null, locked = false;
    const place = Object.assign({}, A.place || {});
    const chips = q.items.map((it, i) => { const c = h('button', { type: 'button', class: 'chip', 'data-i': i }, esc(it[0])); return c; });
    const order = shuffle(chips.map((_, i) => i));      /* a new random order each time it is drawn */
    function layout() {
      order.forEach(i => { const b = place[i]; (b == null ? tray : $(`.bin[data-b="${b}"] .in`, bins)).appendChild(chips[i]); });
    }
    layout();
    function select(c) { if (locked) return; if (sel) sel.classList.remove('sel'); sel = (sel === c) ? null : c; if (sel) sel.classList.add('sel'); bins.querySelectorAll('.bin').forEach(b => b.classList.toggle('target', !!sel)); }
    function put(c, b) {
      const i = +c.dataset.i; if (b == null) delete place[i]; else place[i] = b;
      layout(); chips.forEach(x => x.classList.remove('right', 'wrong'));
      ans.put(id, { place: Object.assign({}, place) }); ui.say(say, '');
      if (sel) sel.classList.remove('sel'); sel = null; bins.querySelectorAll('.bin').forEach(x => x.classList.remove('target'));
    }
    $$('.bin', bins).forEach(bn => {
      const go = () => { if (sel && !locked) put(sel, +bn.dataset.b); };
      bn.addEventListener('click', e => { if (e.target.closest('.chip') && e.target.closest('.chip') !== sel) return; go(); });
      bn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    tray.addEventListener('click', e => { if (sel && !e.target.closest('.chip') && !locked) put(sel, null); });
    dragify(chips, c => select(c), (c, target) => { if (locked) return; const bn = target && target.closest('.bin'); if (bn) put(c, +bn.dataset.b); else if (target && target.closest('.tray')) put(c, null); });
    function lock(shown) {
      locked = true; btn.remove(); const sb = $('.show', row); if (sb) sb.remove();
      chips.forEach(c => { c.classList.add('right'); c.disabled = true; });
      ui.status(shown ? 'Answers shown' : RIGHT, !shown); ui.say(say, shown ? 'This is where each one goes.' : 'All in the right boxes.', shown ? '' : 'ok');
      if (q.why) ui.why(q.why, shown);
    }
    function showBtn() {
      if (tries < 2 || $('.show', row)) return;
      const sb = h('button', { class: 'btn ghost show', type: 'button' }, 'Show the answers'); row.insertBefore(sb, say);
      sb.addEventListener('click', () => { q.items.forEach((it, i) => { place[i] = it[1]; }); layout(); ans.put(id, { place: Object.assign({}, place), shown: 1 }); lock(true); });
    }
    if (A.ok || A.shown) { lock(!!A.shown); return; }
    if (tries) ui.status('Try ' + (tries + 1));
    showBtn();
    btn.addEventListener('click', () => {
      if (Object.keys(place).length < q.items.length) { ui.say(say, 'Put every card in a box first.', 'no'); return; }
      const wrong = q.items.map((it, i) => place[i] === it[1] ? null : it[0] + ' → ' + q.bins[place[i]].t).filter(Boolean);
      tries++; L.check(id, !wrong.length, wrong);
      ans.put(id, { place: Object.assign({}, place), tries, ok: wrong.length ? 0 : 1 });
      if (!wrong.length) { lock(false); return; }
      ui.status('Try ' + (tries + 1));
      ui.say(say, 'Not right yet. Your answer is kept as you left it: think again about each card.', 'no');
      showBtn();
    });
  }
  /* press = choose; press and move = drag (mouse, pen or finger) */
  function dragify(chips, onTap, onDrop) {
    chips.forEach(c => {
      c.addEventListener('pointerdown', e => {
        if (c.disabled || e.button > 0) return;
        const x0 = e.clientX, y0 = e.clientY; let ghost = null;
        const move = ev => {
          if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 7) { ghost = c.cloneNode(true); ghost.classList.add('ghost'); document.body.appendChild(ghost); c.classList.add('dragging'); }
          if (ghost) { ghost.style.left = (ev.clientX - ghost.offsetWidth / 2) + 'px'; ghost.style.top = (ev.clientY - ghost.offsetHeight / 2) + 'px'; }
        };
        const up = ev => {
          removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
          if (ghost) { ghost.remove(); c.classList.remove('dragging'); onDrop(c, document.elementFromPoint(ev.clientX, ev.clientY)); c._dragged = true; setTimeout(() => { c._dragged = false; }, 0); }
        };
        addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
      });
      c.addEventListener('click', e => { e.stopPropagation(); if (!c._dragged) onTap(c); });
    });
  }

  /* ---------- put in order ---------- */
  function drawOrder(box, id, q) {
    const ui = shell(box, q, q.label || 'Put in order'), A = ans.get(id) || {};
    box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const ol = h('ol', { class: 'order' }); box.appendChild(ol);
    const row = h('div', { class: 'q__row' }, '<button class="btn" type="button">Check</button><span class="say"></span>'); box.appendChild(row);
    const btn = $('button', row), say = $('.say', row);
    let tries = A.tries || 0, locked = false;
    let ord = (A.ord && A.ord.length === q.items.length) ? A.ord.slice() : (() => { let o; do { o = shuffle(q.items.map((_, i) => i)); } while (o.every((v, i) => v === i)); return o; })();
    /* The numbers are PLACES (1 = first) and stay where they are; only the step card moves (21 Oct 2026: with the
       number inside the line, the list read 1, 2, 3 … after every press and a pupil thought nothing had moved).
       After a press each card slides from where it was, and the card pressed is outlined for a moment. */
    function draw(moved) {
      const was = {}; $$('.oc', ol).forEach(c => { was[c.dataset.i] = c.getBoundingClientRect().top; });
      ol.innerHTML = '';
      ord.forEach((oi, k) => {
        const li = h('li', null, `<span class="n">${k + 1}</span><span class="oc" data-i="${oi}"><span class="tx">${esc(q.items[oi])}</span>` + (locked ? '' :
          `<span class="mv"><button type="button" aria-label="Move up" ${k === 0 ? 'disabled' : ''}>↑</button><button type="button" aria-label="Move down" ${k === ord.length - 1 ? 'disabled' : ''}>↓</button></span>`) + '</span>');
        if (locked) li.classList.add('right');
        ol.appendChild(li);
        if (!locked) {
          const [up, dn] = $$('.mv button', li);
          up.addEventListener('click', () => { swap(k, k - 1); const b = $$('.mv button', ol)[(k - 1) * 2]; if (b && !b.disabled) b.focus(); });
          dn.addEventListener('click', () => { swap(k, k + 1); const b = $$('.mv button', ol)[(k + 1) * 2 + 1]; if (b && !b.disabled) b.focus(); });
        }
      });
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      $$('.oc', ol).forEach(c => {
        const dy = was[c.dataset.i] != null ? was[c.dataset.i] - c.getBoundingClientRect().top : 0;
        if (dy && c.animate && !still) c.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 200, easing: 'ease-out' });
        if (c.dataset.i === String(moved)) { c.classList.add('is-moved'); setTimeout(() => c.classList.remove('is-moved'), 900); }
      });
    }
    function swap(a, b) { if (b < 0 || b >= ord.length) return; const m = ord[a]; [ord[a], ord[b]] = [ord[b], ord[a]]; ans.put(id, { ord: ord.slice() }); ui.say(say, ''); draw(m); }
    function lock(shown) { locked = true; btn.remove(); const sb = $('.show', row); if (sb) sb.remove(); draw(); ui.status(shown ? 'Order shown' : RIGHT, !shown); ui.say(say, shown ? 'This is the order.' : 'The right order.', shown ? '' : 'ok'); if (q.why) ui.why(q.why, shown); }
    function showBtn() {
      if (tries < 2 || $('.show', row)) return;
      const sb = h('button', { class: 'btn ghost show', type: 'button' }, 'Show the order'); row.insertBefore(sb, say);
      sb.addEventListener('click', () => { ord = q.items.map((_, i) => i); ans.put(id, { ord: ord.slice(), shown: 1 }); lock(true); });
    }
    if (A.ok || A.shown) { if (A.shown) ord = q.items.map((_, i) => i); lock(!!A.shown); return; }
    draw(); if (tries) ui.status('Try ' + (tries + 1)); showBtn();
    btn.addEventListener('click', () => {
      const ok = ord.every((v, i) => v === i); tries++;
      L.check(id, ok, ok ? [] : ['order ' + ord.map(v => v + 1).join('-')]);
      ans.put(id, { ord: ord.slice(), tries, ok: ok ? 1 : 0 });
      if (ok) { lock(false); return; }
      ui.status('Try ' + (tries + 1)); ui.say(say, 'Not right yet. Your order is kept as you left it.', 'no'); showBtn();
    });
  }

  /* ---------- choose the methods, in order (part 8) ---------- */
  function drawPick(box, id, q) {
    const M = window.METHODS, ui = shell(box, q, q.label), A = ans.get(id) || {};
    box.classList.add('job');
    box.appendChild(h('p', { class: 'q__stem' }, q.stem));
    const seqEl = h('div', { class: 'seq', 'aria-label': 'Your methods, in order', 'aria-live': 'polite' }); box.appendChild(seqEl);
    const pal = h('div', { class: 'palette' }); box.appendChild(pal);
    const row = h('div', { class: 'q__row' }, '<button class="btn" type="button">Check</button><span class="say"></span>'); box.appendChild(row);
    const btn = $('button', row), say = $('.say', row);
    let tries = A.tries || 0, seq = (A.seq || []).slice(), locked = false;
    Object.keys(M).forEach(k => {
      const c = h('button', { type: 'button', class: 'chip' }, esc(M[k])); pal.appendChild(c);
      c.addEventListener('click', () => { if (locked || seq.length >= 4) return; seq.push(k); changed(); });
    });
    function drawSeq() {
      seqEl.innerHTML = '';
      seq.forEach((k, i) => {
        if (i) seqEl.appendChild(h('span', { class: 'arr', 'aria-hidden': 'true' }, '→'));
        const c = h('button', { type: 'button', class: 'chip' + (locked ? ' right' : ''), 'aria-label': (locked ? '' : 'Remove ') + M[k] }, esc(M[k]) + (locked ? '' : ' ×'));
        if (!locked) c.addEventListener('click', () => { seq.splice(i, 1); changed(); });
        seqEl.appendChild(c);
      });
    }
    function changed() { ans.put(id, { seq: seq.slice() }); ui.say(say, ''); drawSeq(); }
    function lock(shown) { locked = true; btn.remove(); pal.remove(); const sb = $('.show', row); if (sb) sb.remove(); drawSeq(); ui.status(shown ? 'Answer shown' : RIGHT, !shown); ui.say(say, shown ? 'One right answer.' : 'Right.', shown ? '' : 'ok'); if (q.why) ui.why(q.why, shown); }
    function showBtn() {
      if (tries < 2 || $('.show', row)) return;
      const sb = h('button', { class: 'btn ghost show', type: 'button' }, 'Show an answer'); row.insertBefore(sb, say);
      sb.addEventListener('click', () => { seq = q.ok[0].slice(); ans.put(id, { seq: seq.slice(), shown: 1 }); lock(true); });
    }
    drawSeq();
    if (A.ok || A.shown) { lock(!!A.shown); return; }
    if (tries) ui.status('Try ' + (tries + 1)); showBtn();
    btn.addEventListener('click', () => {
      if (!seq.length) { ui.say(say, 'Press at least one method first.', 'no'); return; }
      const ok = q.ok.some(s => s.length === seq.length && s.every((k, i) => k === seq[i])); tries++;
      L.check(id, ok, ok ? [] : [seq.map(k => M[k]).join(' > ')]);
      ans.put(id, { seq: seq.slice(), tries, ok: ok ? 1 : 0 });
      if (ok) { lock(false); return; }
      ui.status('Try ' + (tries + 1));
      ui.say(say, (q.ok[0].length > 1 && seq.length === 1) ? 'Not right yet. This job needs more than one step.' : 'Not right yet. Think about what is in the mixture, and what you must keep.', 'no');
      showBtn();
    });
  }

  const DRAW = { gaps: drawGaps, mcq: drawMcq, num: drawNum, sort: drawSort, order: drawOrder, pick: drawPick };
  /* the board's own words for each kind (Teacher.html reads mcq opts and gaps to say a wrong answer in words) */
  function regQ(id, q) {
    const kind = q.kind === 'gaps' ? 'gaps' : q.kind;
    const r = { id, part: q.part, title: q.title, short: q.short, kind };
    if (q.kind === 'mcq') r.opts = q.a.slice();
    if (q.kind === 'gaps') r.gaps = (q.table ? q.table.map(x => x[1]) : [q.text]).join(' ').match(/\[\[([^\]]+)\]\]/g).map(m => m.slice(2, -2).split('|')[0]);
    if (q.ext) r.ext = 1;
    reg(r);
  }
  function drawAll() {
    const QS = window.QS || {};
    $$('.q[data-q]').forEach(box => {
      const id = box.dataset.q, q = QS[id];
      if (!q) { box.textContent = 'Missing question ' + id; return; }
      regQ(id, q);
      DRAW[q.kind](box, id, q);
    });
  }
  /* ↺ for one question box is never offered: the whole page restarts from the top bar, and a sim from the bench. */
  document.addEventListener('sepmix:build', drawAll);
  window.SEPchecks = { canon, markGaps, parseGaps };
})();
