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

  /* ---------------- the frame on the left ---------------- */
  let root, head, sceneBar, togBar, canvas, svg, hots, stepbar, lapseEl, photoEl;
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
        $('.st', stepbar).innerHTML = text;
        $('.msgs', stepbar).innerHTML = '';
      },
      say(text) { alive(); $('.st', stepbar).innerHTML = text; },
      /* buttons on the apparatus; resolves with the id pressed */
      choose(list) {
        alive();
        return new Promise((res, rej) => {
          clearHots();
          list.forEach(it => {
            const b = h('button', { type: 'button', class: 'hot ' + (it.side || '') + (it.hold ? ' hold' : '') + (it.quiet ? ' quiet' : '') + (it.done ? ' seen' : '') }, esc(it.label) + (it.sub ? `<small>${esc(it.sub)}</small>` : ''));
            b.style.left = px(it.x); b.style.top = py(it.y);
            hots.appendChild(b);
            if (it.onHold) { holdable(b, it, my); return; }   /* press and hold: never resolves; another button moves on */
            b.addEventListener('click', e => { kbd = e.detail === 0; scene._busy = true; clearHots(); my === gen ? res(it.id) : rej(CANCEL); });
          });
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
          hots.appendChild(b);
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
          const m = h('div', { class: 'msg oops' }, `<span>${text}</span><button type="button">${esc(btn || 'Try again')}</button>`);
          $('.msgs', stepbar).innerHTML = ''; $('.msgs', stepbar).appendChild(m);
          $('button', m).addEventListener('click', () => { m.remove(); my === gen ? res() : rej(CANCEL); });
        });
      },
      note(text) { const m = h('div', { class: 'msg done' }, `<span>${text}</span>`); $('.msgs', stepbar).innerHTML = ''; $('.msgs', stepbar).appendChild(m); },
      finish(text) {
        alive(); clearHots(); lapse(null);
        $('.n', stepbar).textContent = 'Done';
        const m = h('div', { class: 'msg done' }, `<span>${text}</span><button type="button">↺ Run it again</button>`);
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
    list.forEach(sc => {
      const b = h('button', { type: 'button', class: (sc.ext ? 'ext' : '') + (sc._call && sc !== curScene ? ' call' : ''), 'aria-pressed': String(sc === curScene) },
        esc(sc.name) + (doneTask(sc.task) ? ' <span class="tick" aria-label="done">✓</span>' : ''));
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
