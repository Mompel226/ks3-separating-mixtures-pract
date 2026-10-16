/* ============================================================
   bench.js — the lab bench of Separating mixtures (15 Oct 2026): the apparatus a pupil operates, step by step.
   Each part brings one or more scenes (js/sims/*.js, BENCH.define). A scene is a short script: it draws the apparatus,
   says the step, and waits for the pupil to press a button placed ON the part it acts on (memory: controls where they
   point). Every step waits for the pupil (memory animations-wait-for-the-reader). A classic mistake can be chosen on
   purpose: the bench shows what goes wrong, then "Try again". A scene finished = Lesson.done(<its task id>), a square
   on the teacher's board.
   Drawing units: a viewBox of 800 x 520; the bench top is at y = 448.
   ============================================================ */
(function () {
  'use strict';
  const S0 = window.SEP, { $, $$, h, esc, NS, L } = S0;
  const VW = 800, VH = 520, TOP = 448;
  const SCENES = {};            /* part → [scene] */
  let gen = 0, curScene = null, curPart = 0, kbd = false;
  let VX = 0, VY = 0, VWW = VW, VHH = VH;          /* the part of the bench a scene shows (scene.view = [x, y, width]) */
  const px = x => (100 * (x - VX) / VWW) + '%', py = y => (100 * (y - VY) / VHH) + '%';
  const CANCEL = { cancelled: true };

  function S(tag, a, p, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in a || {}) if (a[k] != null) e.setAttribute(k, a[k]);
    if (text != null) e.textContent = text;
    if (p) p.appendChild(e);
    return e;
  }
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const lin = t => t;
  const mix = (a, b, t) => a + (b - a) * t;

  /* ---------------- instructions where the eyes are (16 Oct 2026, Daniel: "highlight instructions otherwise they won't
     read, and if it is about pressing a button put those next to the buttons, not in a text underneath the animation or
     somewhere at the end of a long text without being highlighted … think how young kids interact with things"):
     - a choice made with the buttons on the bench is asked in a yellow bubble beside those buttons: k.choose(list,
       { ask, at, side }); without `ask`, the step's own question (its last sentence ending in "?") when there are two or more
       buttons to choose from; `at` = the id of the one button the bubble points at; `side` ('t', 'b', 'r' or 'l') is the place
       to try first; the bubble never covers a word on the bench or another button;
     - under the bench, every sentence that tells the pupil to do something, and every question, is highlighted;
     - a finished bench lights the button of the next one above it ("Next"). */
  const DO = /^(?:(?:now|then|first|next|so)[,]?\s+)?(?:pour|light|heat|fold|open|put|press|hold|close|leave|look|watch|try|test|stir|add|choose|spot|draw|measure|pick|tip|wait|let|turn|switch|collect|repeat|compare|sort|shake|move|place|read|dip|use|take|remove|mark|start|find|cover|fill|wear|run|click|tap|pull|push|clamp|connect|scrape|rinse|weigh|count|write|check|decide|zoom|keep|lower|raise|drop|hang|bring|cool|boil|separate|decant|swirl|lift|stop|go|see|work|shine|divide|answer|filter(?! paper))\b/i;
  const PRESS = /\b(press|tap|click)\b/i;
  const sentences = html => String(html).split(/(?<=[.?!:])\s+(?=[A-Z<(👀👁🔬])/u);
  const plainOf = s => s.replace(/<[^>]+>/g, '').replace(/^[(\s]+/, '').trim();
  function markDo(html) {
    if (!html) return html || '';
    return sentences(html).map(s => { const t = plainOf(s); return DO.test(t) || PRESS.test(t) || /\?\)?$/.test(t) ? `<mark class="do">${s}</mark>` : s; }).join(' ');
  }
  const lastQuestion = html => sentences(html || '').filter(s => /\?\)?$/.test(plainOf(s))).pop() || '';

  /* ---------------- the frame on the left ---------------- */
  let root, head, sceneBar, togBar, canvas, svg, hots, stepbar, lapseEl, photoEl;
  let stepHtml = '', askEl = null, askFor = [], askSide = '';
  /* the bubble sits next to its buttons, where it hides the least: never a word on the bench or another button, and as
     little of the drawing as it can (Daniel, 16 Oct 2026: "avoid making the new messages cover important things …
     like diagrams"). It tries above, below, right and left of its buttons (`side` first), each centred and at either
     end, and takes the place that covers least; its point stays on the buttons' middle. */
  const SHAPES = /^(path|rect|circle|ellipse|line|polyline|polygon|image|text|use)$/i;
  function shownEl(el) { for (let e = el; e && e !== svg; e = e.parentNode) { const o = e.getAttribute && e.getAttribute('opacity'); if ((o != null && +o < .05) || (e.style && (e.style.display === 'none' || (e.style.opacity !== '' && +e.style.opacity < .05)))) return false; } return true; }
  function placeAsk() {
    if (!askEl || !askEl.isConnected || !askFor.length) return;
    const W = hots.clientWidth, H = hots.clientHeight, hr = hots.getBoundingClientRect();
    const rel = r => ({ l: r.left - hr.left, t: r.top - hr.top, r: r.right - hr.left, b: r.bottom - hr.top });
    const area = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    const bs = askFor.map(b => rel(b.getBoundingClientRect()));
    const u = { l: Math.min(...bs.map(b => b.l)), t: Math.min(...bs.map(b => b.t)), r: Math.max(...bs.map(b => b.r)), b: Math.max(...bs.map(b => b.b)) };
    const G = 16, cx = (u.l + u.r) / 2, cy = (u.t + u.b) / 2;
    /* the bench you can see: the drawing, and the wall beside it when the bench is narrower than its column */
    const st = rel(canvas.parentNode.getBoundingClientRect()), X0 = Math.max(st.l, -60) + 4, X1 = Math.min(st.r, W + 60) - 4;
    /* words and other buttons must stay clear; the drawing (apparatus, label lines) as clear as it can be */
    const hard = [...hots.querySelectorAll('.hot')].map(b => rel(b.getBoundingClientRect()))          /* its own buttons too */
      .concat([...svg.querySelectorAll('text')].filter(t => t.textContent.trim() && shownEl(t)).map(t => rel(t.getBoundingClientRect())).filter(r => r.r > r.l));
    const drawn = [...svg.querySelectorAll('g.scene *, g.labels *')].filter(e => SHAPES.test(e.tagName) && shownEl(e)).map(e => rel(e.getBoundingClientRect()))
      .filter(r => r.r > r.l && r.b > r.t && (r.r - r.l) * (r.b - r.t) < W * H * .35);
    const covered = r => {          /* the share of the bubble that lies over the drawing, from a grid of points */
      const near = drawn.filter(d => area(r, d) > 0); if (!near.length) return 0;
      let n = 0; for (let i = 0; i < 12; i++) for (let j = 0; j < 6; j++) { const x = r.l + (i + .5) * (r.r - r.l) / 12, y = r.t + (j + .5) * (r.b - r.t) / 6; if (near.some(d => x >= d.l && x <= d.r && y >= d.t && y <= d.b)) n++; }
      return n / 72;
    };
    /* its size on one line, or wrapped narrower to fit the wall beside its buttons */
    const size = mw => { askEl.style.maxWidth = mw ? mw + 'px' : ''; return { w: askEl.offsetWidth, hh: askEl.offsetHeight, mw }; };
    const one = size(0), C = [];
    const order = [askSide, 't', 'b', 'r', 'l'].filter((x, i, a) => x && a.indexOf(x) === i);
    order.forEach(k => {
      if (k === 't' || k === 'b') { const { w, hh } = one; [cx - w / 2, u.l, u.r - w].forEach(x => C.push({ k, w, hh, mw: 0, x: Math.max(X0, Math.min(X1 - w, x)), y: k === 't' ? u.t - hh - G : u.b + G })); return; }
      const room = k === 'r' ? X1 - (u.r + G) : (u.l - G) - X0;
      const d = room >= one.w ? one : room >= 90 ? size(Math.floor(room)) : null; if (!d) return;
      const cY = y => Math.max(4, Math.min(H - d.hh - 4, y));
      [cy - d.hh / 2, u.t, u.b - d.hh].forEach(y => C.push({ k, w: d.w, hh: d.hh, mw: d.mw, x: k === 'r' ? u.r + G : u.l - d.w - G, y: cY(y) }));
    });
    /* last: high on the wall above the buttons, like a question written over the picture (two choices on either side
       of the drawing leave no free place beside them) */
    C.push({ k: 'free', w: one.w, hh: one.hh, mw: 0, x: Math.max(X0, Math.min(X1 - one.w, cx - one.w / 2)), y: 8, extra: .06 * one.w * one.hh });
    let best = null;
    for (const c of C) {
      const r = { l: c.x, t: c.y, r: c.x + c.w, b: c.y + c.hh };
      if (r.l < X0 - 1 || r.t < 2 || r.r > X1 + 1 || r.b > H - 2) continue;
      const score = hard.reduce((a, o) => a + area(r, o), 0) * 4 + covered(r) * c.w * c.hh + (c.extra || 0);
      if (!best || score < best.score - 1) best = { ...c, score };
      if (!score) break;
    }
    if (!best) best = { k: 'b', ...one, x: Math.max(X0, Math.min(X1 - one.w, cx - one.w / 2)), y: Math.min(H - one.hh - 4, u.b + G) };
    size(best.mw);
    const w = best.w, hh = best.hh;
    askEl.classList.remove('below', 'r', 'l', 'free');
    if (best.k !== 't') askEl.classList.add(best.k === 'b' ? 'below' : best.k);
    askEl.style.left = (100 * best.x / W) + '%'; askEl.style.top = (100 * best.y / H) + '%';        /* like the buttons: it scales with the bench */
    askEl.style.setProperty('--ax', Math.max(18, Math.min(w - 18, cx - best.x)) + 'px');
    askEl.style.setProperty('--ay', Math.max(14, Math.min(hh - 14, cy - best.y)) + 'px');
  }
  /* a question the pupil is reading can point at a button on the bench (its `cue` in js/questions.js: { label, ask }):
     while they read it, the bubble stands beside that button, if the bench shows it and asks nothing else */
  const cueOf = el => { const id = el && el.dataset && el.dataset.q, q = id && window.QS && window.QS[id]; return q && q.cue; };
  function showCue() {
    if (askEl && askEl.isConnected) return;
    const c = cueOf(reading); if (!c) return;
    const b = [...hots.querySelectorAll('.hot')].find(x => x.textContent.indexOf(c.label) >= 0); if (!b) return;
    showAsk(c.ask, [b], c.side, '.3s'); askEl.dataset.cue = '1';
  }
  /* a button never runs past the edge of the bench you can see: nudged in by as much as it sticks out (16 Oct 2026:
     bigger words made long labels near an edge stick out where the bench fills its column) */
  function fitHots() {
    const st = canvas.parentNode.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    const L = Math.max(st.left, cr.left - 40) + 4, R = Math.min(st.right, cr.right + 40) - 4, T = st.top + 3, B = st.bottom - 3;
    hots.querySelectorAll('.hot').forEach(b => {
      b.style.marginLeft = b.style.marginTop = '';
      const r = b.getBoundingClientRect();
      const dx = r.left < L ? L - r.left : r.right > R ? R - r.right : 0, dy = r.top < T ? T - r.top : r.bottom > B ? B - r.bottom : 0;
      if (dx) b.style.marginLeft = dx + 'px'; if (dy) b.style.marginTop = dy + 'px';
    });
  }
  function showAsk(text, btns, side, delay) {
    askEl = h('div', { class: 'ask', role: 'note' }, text); askFor = btns; askSide = side || '';
    if (!S0.FAST) askEl.style.animationDelay = delay == null ? '1.1s' : delay;      /* the whole drawing is seen first */
    hots.appendChild(askEl); placeAsk();
  }
  function frame() {
    root = $('#bench');
    root.innerHTML = '';
    head = h('div', { class: 'bench__head' }, '<div class="bench__title"></div>');
    sceneBar = h('div', { class: 'scenes', role: 'group', 'aria-label': 'Experiments on this bench' }); head.appendChild(sceneBar);
    togBar = h('div', { class: 'togs', role: 'group', 'aria-label': 'Views' }); head.appendChild(togBar);
    root.appendChild(head);
    const stage = h('div', { class: 'stage' });
    canvas = h('div', { class: 'canvas' });
    svg = S('svg', { class: 'sim', viewBox: `0 0 ${VW} ${VH}`, role: 'img', 'aria-label': 'The lab bench' });
    hots = h('div', { class: 'hots' });
    lapseEl = h('div', { class: 'lapse', 'aria-live': 'polite' });
    canvas.appendChild(svg); canvas.appendChild(hots); canvas.appendChild(lapseEl); stage.appendChild(canvas); root.appendChild(stage);
    if (window.ResizeObserver) new ResizeObserver(() => { fitHots(); placeAsk(); }).observe(hots);
    stepbar = h('div', { class: 'stepbar', 'aria-live': 'polite' }, '<p class="sn"><span class="n"></span><button class="again" type="button">↺ Start this experiment again</button></p><p class="st"></p><div class="msgs"></div>');
    root.appendChild(stepbar);
    $('.again', stepbar).addEventListener('click', () => { if (curScene) run(curScene); });
  }
  function background() {
    const defs = S('defs', null, svg);
    const wg = S('linearGradient', { id: 'wallG', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    S('stop', { offset: 0, 'stop-color': 'var(--wall)' }, wg); S('stop', { offset: 1, 'stop-color': 'var(--tile)' }, wg);
    S('rect', { x: -400, y: -200, width: VW + 800, height: TOP + 200, fill: 'url(#wallG)' }, svg);
    const t = S('g', { class: 'tiles', opacity: .55 }, svg);
    for (let y = TOP - 56 * 9; y < TOP; y += 56) S('line', { class: 'tile', x1: -400, y1: y, x2: VW + 400, y2: y }, t);
    for (let r = 0, y = TOP - 56 * 9; y < TOP; r++, y += 56) for (let x = -400 + (r % 2) * 40; x < VW + 400; x += 80) S('line', { class: 'tile', x1: x, y1: y, x2: x, y2: Math.min(TOP, y + 56) }, t);
    S('rect', { class: 'lip', x: -400, y: TOP - 2, width: VW + 800, height: 10 }, svg);
    S('rect', { class: 'top', x: -400, y: TOP + 8, width: VW + 800, height: 400 }, svg);
  }

  /* ---------------- a scene's kit ---------------- */
  function kitFor(scene, my) {
    const alive = () => { if (my !== gen) throw CANCEL; };
    const layer = S('g', { class: 'scene' }, svg);
    const top = S('g', { class: 'labels' }, svg);
    const k = {
      S, svg: layer, top, VW, VH, TOP, ease, lin, mix, FAST: S0.FAST,
      alive,
      tween(ms, fn, ez) {
        alive();
        return new Promise((res, rej) => {
          const e = ez || ease;
          if (S0.FAST || ms <= 0) { fn(1); res(); return; }
          const t0 = performance.now();
          const step = now => {
            if (my !== gen) { rej(CANCEL); return; }
            const t = Math.min(1, (now - t0) / ms); fn(e(t));
            if (t < 1) requestAnimationFrame(step); else res();
          };
          requestAnimationFrame(step);
        });
      },
      /* fn(dt) every frame while it returns something true; stops with the scene; returns stop() */
      loop(fn) {
        if (S0.FAST) return () => {};
        let last = performance.now(), stopped = false;
        const step = now => {
          if (stopped || my !== gen) return;
          const dt = Math.min(.05, (now - last) / 1000); last = now;
          let go = false; try { go = fn(dt); } catch (e) { return; }
          if (go) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        return () => { stopped = true; };
      },
      wait(ms) { alive(); return new Promise((res, rej) => { if (S0.FAST) { res(); return; } setTimeout(() => (my === gen ? res() : rej(CANCEL)), ms); }); },
      step(n, total, text) {
        alive();
        $('.n', stepbar).textContent = total ? `Step ${n} of ${total}` : n;
        stepHtml = text; $('.st', stepbar).innerHTML = markDo(text);
        $('.msgs', stepbar).innerHTML = '';
      },
      say(text) { alive(); stepHtml = text; $('.st', stepbar).innerHTML = markDo(text); },
      /* buttons on the apparatus; resolves with the id pressed */
      choose(list, opt) {
        alive(); opt = opt || {};
        return new Promise((res, rej) => {
          clearHots();
          const made = [];
          list.forEach(it => {
            const b = h('button', { type: 'button', class: 'hot ' + (it.side || '') + (it.hold ? ' hold' : '') + (it.quiet ? ' quiet' : '') + (it.done ? ' seen' : '') }, esc(it.label) + (it.sub ? `<small>${esc(it.sub)}</small>` : ''));
            b.style.left = px(it.x); b.style.top = py(it.y);
            hots.appendChild(b); made.push(b);
            if (it.onHold) { holdable(b, it, my); return; }   /* press and hold: never resolves; another button moves on */
            b.addEventListener('click', e => { kbd = e.detail === 0; scene._busy = !scene.free; clearHots(); my === gen ? res(it.id) : rej(CANCEL); });   /* a free bench (exploring, nothing to lose) is never half done */
          });
          fitHots();
          const ask = opt.ask !== undefined ? opt.ask : list.filter(it => !it.quiet).length > 1 ? lastQuestion(stepHtml) : '';
          if (ask) showAsk(ask, made.filter((b, i) => opt.at ? list[i].id === opt.at : !list[i].quiet), opt.side);
          else showCue();
          if (kbd) { const first = hots.querySelector('.hot'); if (first) first.focus({ preventScroll: true }); }
        });
      },
      /* press and hold: onHold(dt in s) is called while held; resolves when done() returns true */
      hold(it, onHold, done) {
        alive();
        return new Promise((res, rej) => {
          clearHots();
          const b = h('button', { type: 'button', class: 'hot hold ' + (it.side || '') }, esc(it.label) + (it.sub ? `<small>${esc(it.sub)}</small>` : ''));
          b.style.left = px(it.x); b.style.top = py(it.y);
          hots.appendChild(b); fitHots();
          let held = false, last = 0, raf = 0;
          const tick = now => {
            if (my !== gen) { cancelAnimationFrame(raf); rej(CANCEL); return; }
            if (!held) return;
            const dt = Math.min(.05, (now - last) / 1000); last = now; onHold(dt);
            if (done()) { held = false; b.classList.remove('on'); clearHots(); res(); return; }
            raf = requestAnimationFrame(tick);
          };
          const down = e => { if (held) return; e.preventDefault(); held = true; b.classList.add('on'); last = performance.now(); raf = requestAnimationFrame(tick); if (b.setPointerCapture && e.pointerId != null) try { b.setPointerCapture(e.pointerId); } catch (x) {} };
          const up = () => { held = false; b.classList.remove('on'); cancelAnimationFrame(raf); if (it.onRelease) it.onRelease(); if (done()) { clearHots(); res(); } };
          b.addEventListener('pointerdown', down); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', () => { if (held) up(); });
          b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e); });
          b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') up(); });
          b.addEventListener('contextmenu', e => e.preventDefault());
          /* tests and less motion: one press does the whole hold */
          if (S0.FAST) b.addEventListener('click', () => { for (let i = 0; i < 4000 && !done(); i++) onHold(.02); clearHots(); res(); });
        });
      },
      oops(text, btn) {
        alive();
        return new Promise((res, rej) => {
          clearHots();
          const m = h('div', { class: 'msg oops' }, `<span>${markDo(text)}</span><button type="button">${esc(btn || 'Try again')}</button>`);
          $('.msgs', stepbar).innerHTML = ''; $('.msgs', stepbar).appendChild(m);
          $('button', m).addEventListener('click', () => { m.remove(); my === gen ? res() : rej(CANCEL); });
        });
      },
      note(text) { const m = h('div', { class: 'msg done' }, `<span>${markDo(text)}</span>`); $('.msgs', stepbar).innerHTML = ''; $('.msgs', stepbar).appendChild(m); },
      finish(text) {
        alive(); clearHots(); lapse(null);
        $('.n', stepbar).textContent = 'Done';
        const m = h('div', { class: 'msg done' }, `<span>${markDo(text)}</span><button type="button">↺ Run it again</button>`);
        $('.msgs', stepbar).innerHTML = ''; $('.msgs', stepbar).appendChild(m);
        $('button', m).addEventListener('click', () => run(scene));
        if (scene.task) L.done(scene.task.id);
        scene._busy = false;
        paintScenes();
      },
      lapse, readout: (...a) => readout(...a), clearHots,
      /* a label with a level leader line that ends ON the part, no dot (memory label-lines-never-cross) */
      label(text, x, y, tx, ty, opt) {
        opt = opt || {};
        const g = S('g', { class: 'label' }, opt.layer || top);
        const anchor = opt.anchor || (tx != null && tx < x ? 'end' : 'start');
        /* a label beside its part sits level with it: the words are centred on the part's height and the line runs
           straight across to end ON the part (Daniel, 15 Oct 2026: "make sure that labels properly indicate what they're
           labelling"; memory label-lines-never-cross) */
        if (tx != null && ty != null && anchor !== 'middle' && Math.abs(ty - y) <= 12) y = ty + 5;
        /* a centred label's line leaves from below (or above) its words; a side label's from its end, level */
        if (tx != null) S('path', { class: 'lead', d: anchor === 'middle' ? `M${x},${ty > y ? y + 4 : y - 16} L${tx},${ty}` : `M${anchor === 'end' ? x + 6 : x - 6},${y - 5} L${tx},${ty == null ? y - 5 : ty}` }, g);
        const t = S('text', { class: 'lbl', x: anchor === 'end' ? x : x, y, 'text-anchor': anchor === 'middle' ? 'middle' : anchor }, g, text);
        if (opt.bg !== false) { try { const bb = t.getBBox(); S('rect', { class: 'lbl-bg', x: bb.x - 4, y: bb.y - 2, width: bb.width + 8, height: bb.height + 4, rx: 5 }, g).parentNode.insertBefore(g.lastChild, t); } catch (e) {} }
        if (opt.fade !== false) fadeIn(g);
        return g;
      },
      clearLabels() { top.innerHTML = ''; },
      /* a switch in the bench's header (15 Oct 2026: "a real life view toggle"): cb(on) each time it is pressed */
      toggle(label, onLabel, cb) {
        const b = h('button', { type: 'button', class: 'tog', 'aria-pressed': 'false' }, esc(label));
        b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? onLabel : label; if (my === gen) cb(on); });
        togBar.appendChild(b); return b;
      },
      /* start the scene again from its first step (after a mistake whose outcome ran to the end) */
      restart() { setTimeout(() => { if (my === gen) run(scene); }, 0); }
    };
    return k;
  }
  /* a button that does something for as long as it is held (mouse, finger or the space bar) */
  function holdable(b, it, my) {
    b.classList.add('hold');
    let held = false, last = 0;
    const tick = now => {
      if (!held || my !== gen) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; it.onHold(dt);
      requestAnimationFrame(tick);
    };
    const down = e => { if (held) return; if (e.cancelable) e.preventDefault(); held = true; b.classList.add('on'); if (it.onPress) it.onPress(true); last = performance.now(); requestAnimationFrame(tick); if (b.setPointerCapture && e.pointerId != null) try { b.setPointerCapture(e.pointerId); } catch (x) {} };
    const up = () => { if (!held) return; held = false; b.classList.remove('on'); if (it.onPress) it.onPress(false); };
    b.addEventListener('pointerdown', down); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e); });
    b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') up(); });
    b.addEventListener('contextmenu', e => e.preventDefault());
    /* tests and less motion: one press holds for `fastHold` seconds */
    if (S0.FAST) b.addEventListener('click', () => { if (it.onPress) it.onPress(true); for (let t = 0; t < (it.fastHold || 1); t += .02) it.onHold(.02); if (it.onPress) it.onPress(false); });
  }
  /* 📷 Real photo (15 Oct 2026, Daniel: "students need to know what they look like in real life"): a photograph of the real
     apparatus over the bench, credited; the drawing is kept underneath */
  function showPhoto(ph) {
    if (photoEl) { photoEl.remove(); photoEl = null; }
    if (!ph) return;
    photoEl = h('figure', { class: 'photo-ov' }, `<img src="${esc(ph.src)}" alt="${esc(ph.alt)}"><figcaption>${esc(ph.caption)} <span class="cr">Photo: ${ph.href ? `<a href="${esc(ph.href)}" target="_blank" rel="noopener">${esc(ph.credit)}</a>` : esc(ph.credit)}, ${esc(ph.licence)}</span></figcaption>`);
    canvas.parentNode.appendChild(photoEl);
  }
  function photoButton(scene) {
    const b = h('button', { type: 'button', class: 'tog photo', 'aria-pressed': 'false' }, '📷 Real photo');
    b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '✕ Back to the bench' : '📷 Real photo'; showPhoto(on ? scene.photo : null); });
    togBar.appendChild(b);
  }
  function fadeIn(g) { if (S0.FAST) return; g.style.opacity = 0; g.style.transition = 'opacity .35s'; requestAnimationFrame(() => requestAnimationFrame(() => { g.style.opacity = 1; })); }
  function clearHots() { hots.innerHTML = ''; }
  function lapse(text) { if (!lapseEl) return; lapseEl.classList.toggle('on', !!text); lapseEl.textContent = text ? '⏩ ' + text : ''; }
  const RO = {};
  function readout(id, x, y, text) {
    let e = RO[id];
    if (text == null) { if (e) { e.remove(); delete RO[id]; } return; }
    if (!e || !e.isConnected) { e = RO[id] = h('div', { class: 'readout', 'aria-hidden': 'true' }); canvas.appendChild(e); }
    e.style.left = px(x); e.style.top = py(y); e.textContent = text;
  }
  function clearReadouts() { Object.keys(RO).forEach(k => { RO[k].remove(); delete RO[k]; }); }

  /* ---------------- running a scene ---------------- */
  function run(scene) {
    gen++; const my = gen; curScene = scene; scene._busy = false;
    S0.store.set('scene.' + curPart, scene.id);
    svg.innerHTML = ''; clearHots(); clearReadouts(); lapse(null); togBar.innerHTML = ''; showPhoto(null);
    if (scene.photo) photoButton(scene);
    const v = scene.view || [0, 0, VW]; VX = v[0]; VY = v[1]; VWW = v[2]; VHH = v[2] * VH / VW;
    svg.setAttribute('viewBox', `${VX} ${VY} ${VWW} ${VHH}`);
    background();
    $('.bench__title', head).innerHTML = `${esc(scene.title || scene.name)}<small>${esc(scene.kicker || 'Part ' + curPart + ' · the bench')}</small>`;
    $('.n', stepbar).textContent = ''; $('.st', stepbar).textContent = ''; $('.msgs', stepbar).innerHTML = '';
    svg.setAttribute('aria-label', scene.alt || ('The lab bench: ' + (scene.title || scene.name)));
    paintScenes();
    const kit = kitFor(scene, my);
    Promise.resolve().then(() => scene.run(kit)).catch(e => { if (e !== CANCEL) { console.error(e); } });
  }
  function doneTask(t) {
    if (!t) return false;
    const rec = S0.L && window.Lesson && window.Lesson.record ? window.Lesson.record() : { q: {} };
    const x = rec.q[t.id], r = x && x.r[x.r.length - 1];
    return !!(r && !r.e && r.s === 'd');
  }
  function paintScenes() {
    const list = SCENES[curPart] || [];
    sceneBar.innerHTML = '';
    if (list.length < 2) return;
    /* the bench is finished: the next one not done yet calls "Next" (its instruction is above the bench, not in the text) */
    const next = curScene && !curScene._busy && doneTask(curScene.task) ? list.find(sc => sc !== curScene && !sc.ext && !doneTask(sc.task)) : null;
    list.forEach(sc => {
      const b = h('button', { type: 'button', class: (sc.ext ? 'ext' : '') + (sc._call && sc !== curScene ? ' call' : '') + (sc === next ? ' next' : ''), 'aria-pressed': String(sc === curScene) },
        esc(sc.name) + (doneTask(sc.task) ? ' <span class="tick" aria-label="done">✓</span>' : '') + (sc === next ? ' <span class="nx">Next ▸</span>' : ''));
      b.addEventListener('click', () => { sc._call = false; if (sc !== curScene) run(sc); });
      sceneBar.appendChild(b);
    });
  }
  /* a question or an extension box on the sheet names the scene it needs (data-scene). The bench shows the scene of the
     one the pupil is reading (Daniel, 15 Oct 2026: "as they scroll down and they reach the question that's related to
     that diagram, then that diagram is shown"): the last of them whose top has passed 55 % of the window and that is
     still on screen. It switches only when that one changes, so a scene the pupil picked by hand stays while they read;
     never while a bench is half done: then the scene's button calls instead, so no work is lost. */
  let watched = [], reading = null, watchT = 0;
  function checkExt() {
    watchT = 0;
    let now = null;
    watched.forEach(el => { const r = el.getBoundingClientRect(); if (r.top <= innerHeight * .55 && r.bottom >= 80) now = el; });
    if (!now || now === reading) return;
    reading = now;
    if (askEl && askEl.dataset.cue) askEl.remove();
    showCue();
    const sc = (SCENES[curPart] || []).find(x => x.id === now.dataset.scene);
    if (!sc || sc === curScene) return;
    if (curScene && curScene._busy) { sc._call = true; paintScenes(); return; }
    run(sc);
  }
  function watchExt(part) {
    watched = $$(`#part-${part} [data-scene]`); reading = null;
  }
  addEventListener('scroll', () => { if (watched.length && !watchT) watchT = setTimeout(checkExt, 120); }, { passive: true });
  function mount(part) {
    curPart = part;
    watchExt(part);
    const list = SCENES[part] || [];
    if (!list.length) return;
    const want = S0.store.get('scene.' + part, null);
    run(list.find(s => s.id === want) || list[0]);
  }

  window.BENCH = {
    define(part, list) {
      SCENES[part] = list;
      list.forEach(sc => { if (!sc.photo && window.PHOTOS && window.PHOTOS[sc.id]) sc.photo = window.PHOTOS[sc.id]; });
      list.forEach(sc => { if (sc.task) S0.reg({ id: sc.task.id, part, title: sc.task.title, short: sc.task.short || 'bench', kind: 'task', ext: sc.ext ? 1 : undefined }); });
    },
    S, ease, lin, mix, VW, VH, TOP,
    open(part, sceneId) { const sc = (SCENES[part] || []).find(s => s.id === sceneId); if (sc) { S0.openPart(part, true); run(sc); } },
    current: () => curScene, checkExt
  };
  document.addEventListener('sepmix:build', frame);
  document.addEventListener('part', e => { gen++; mount(e.detail); });
  document.addEventListener('progress', () => { if (sceneBar) paintScenes(); });
})();
