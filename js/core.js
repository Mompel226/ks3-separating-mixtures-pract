/* ============================================================
   core.js — Separating mixtures (KS3 Year 7): the page's frame (15 Oct 2026).
   One part open at a time (tabs on top, with a progress bar each); the bench on the left runs that part's apparatus,
   the sheet on the right holds its theory and its checks. Everything a pupil types or chooses survives a reload
   (sepmix.answers); how each question went goes to labs-shared/practical/lesson.js, which keeps it for the teacher's
   🔬 Practicals board when the pupil is signed in. ↺ Start the page again forgets every sepmix.* key.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const KEY = 'sepmix.';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { /* private window: this visit only */ } }
  };
  const ANS = store.get('answers', {});
  const ans = {
    get: id => (ANS[id] && typeof ANS[id] === 'object') ? ANS[id] : null,
    put: (id, o) => { if (!id) return; ANS[id] = Object.assign({}, ANS[id] || {}, o); store.set('answers', ANS); },
    drop: ids => { (ids || []).forEach(i => { delete ANS[i]; }); store.set('answers', ANS); }
  };
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
  const params = new URLSearchParams(location.search);
  /* ?still=1 (tests, and a computer that asks for less motion): every animation jumps to its end */
  const FAST = params.has('still') || params.has('manifest') || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------- the lesson record ---------------- */
  const L0 = window.Lesson || { check() {}, done() {}, restart() {}, restartAll() {}, record: () => ({ q: {} }) };
  const L = {
    check: (...a) => { L0.check(...a); progressSoon(); },
    done: (...a) => { L0.done(...a); progressSoon(); },
    restart: (...a) => { L0.restart(...a); ans.drop(a[0]); progressSoon(); },
    restartAll: () => { L0.restartAll(); progressSoon(); }
  };

  /* ---------------- the list of questions (data/questions.json, for the teacher's board) ---------------- */
  const PARTS = [[1, 'Mixtures'], [2, 'Filtration'], [3, 'Evaporation and crystals'], [4, 'Distillation'],
                 [5, 'Chromatography'], [6, 'Decanting and separating funnel'], [7, 'Sieve and magnet'], [8, 'Method challenge']];
  const QREG = [];
  const reg = q => { if (!QREG.some(x => x.id === q.id)) QREG.push(q); };
  function manifest() {
    const qs = QREG.map((q, i) => [q, i]).sort((a, b) => a[0].part - b[0].part || a[1] - b[1]).map(x => x[0]);
    const used = new Set(qs.map(q => q.part));
    return { id: 'ks3-separating-mixtures-pract', v: 1, parts: PARTS.filter(p => used.has(p[0])).map(p => ({ n: p[0], title: p[1] })), groups: [], questions: qs };
  }

  /* ---------------- progress: a bar under each part's tab, and "Your task" with its tally ---------------- */
  let progT = 0;
  function progressSoon() { clearTimeout(progT); progT = setTimeout(progress, 60); }
  function qDone(rec, id) { const x = rec.q[id], r = x && x.r[x.r.length - 1]; return !!(r && !r.e && (r.s === 'f' || r.s === '1' || r.s === 'd')); }
  function partProgress(n, rec) {
    const qs = QREG.filter(q => q.part === n && !q.ext);
    return { done: qs.filter(q => qDone(rec, q.id)).length, all: qs.length,
             sims: qs.filter(q => q.kind === 'task'), simsDone: qs.filter(q => q.kind === 'task' && qDone(rec, q.id)).length };
  }
  function progress() {
    const rec = L0.record ? L0.record() : { q: {} };
    $$('.tabs button').forEach((b, i) => {
      const n = i + 1, p = partProgress(n, rec), pct = p.all ? Math.round(100 * p.done / p.all) : 0;
      let pb = $('.pb', b);
      if (!pb) { pb = h('span', { class: 'pb', 'aria-hidden': 'true' }, '<i></i>'); b.appendChild(pb); }
      pb.style.setProperty('--p', pct);
      b.classList.toggle('full', p.all > 0 && pct === 100);
      b.setAttribute('aria-label', `Part ${n}, ${PARTS[i][1]}: ${p.done} of ${p.all} done`);
      const t = $(`#part-${n} .task__n`); if (!t) return;
      const qn = p.all - p.sims.length, qd = p.done - p.simsDone;
      t.textContent = (p.sims.length ? `Bench ${p.simsDone}/${p.sims.length} · ` : '') + `Checks ${qd}/${qn}`;
      t.classList.toggle('full', p.all > 0 && p.done === p.all);
    });
    document.dispatchEvent(new Event('progress'));
  }

  /* ---------------- parts as tabs ---------------- */
  let cur = 0;
  function openPart(n, focus) {
    n = Math.max(1, Math.min(PARTS.length, n | 0));
    if (n === cur) return;
    cur = n;
    $$('.tabs button').forEach((b, i) => b.setAttribute('aria-selected', String(i + 1 === n)));
    $$('.part').forEach(p => { p.hidden = p.id !== 'part-' + n; });
    store.set('part', n);
    /* #p5, never #part-5: a fragment naming an element makes the browser jump to it when the page finishes loading */
    if (location.hash !== '#p' + n) history.replaceState(null, '', location.pathname + location.search + '#p' + n);
    document.dispatchEvent(new CustomEvent('part', { detail: n }));
    if (focus) { const top = $('.layout').getBoundingClientRect().top + scrollY - 70; if (scrollY > top) scrollTo({ top, behavior: 'auto' }); }
    /* only the strip of tabs scrolls to show the open one; the page never jumps */
    const tb = $(`#tab-${n}`), strip = $('.tabs');
    if (tb && strip) { const l = tb.offsetLeft - strip.offsetLeft, r = l + tb.offsetWidth; if (l < strip.scrollLeft) strip.scrollLeft = l - 8; else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth + 8; }
  }
  function initTabs() {
    $$('.tabs button').forEach((b, i) => b.addEventListener('click', () => openPart(i + 1, true)));
    $$('.partnav .next').forEach(b => b.addEventListener('click', () => openPart(cur + 1, true)));
    $$('.partnav .back').forEach(b => b.addEventListener('click', () => openPart(cur - 1, true)));
    $('.tabs').addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      openPart(cur + (e.key === 'ArrowRight' ? 1 : -1)); $(`#tab-${cur}`).focus(); e.preventDefault();
    });
    const m = /^#(?:part-|p)(\d)$/.exec(location.hash);
    if (m) scrollTo(0, 0);
    openPart(m ? +m[1] : store.get('part', 1));
  }

  /* ---------------- ☀ Bright / ☾ Dark (biology.theme, the site's own key) ---------------- */
  function initTheme() {
    const tb = $('#btnTheme'); if (!tb) return;
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const nowDark = () => { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : !!(mq && mq.matches); };
    const paint = () => { const d = nowDark(); tb.textContent = d ? '☀ Bright' : '☾ Dark'; tb.setAttribute('aria-label', d ? 'Switch to the bright version' : 'Switch to the dark version'); };
    tb.addEventListener('click', () => {
      const next = nowDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('biology.theme', next); } catch (e) { /* private window */ }
      paint(); document.dispatchEvent(new Event('themechange'));
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', paint);
    tb.hidden = false; paint();
  }

  /* ---------------- ↺ Start the page again ---------------- */
  function initRestart() {
    const b = $('#btnRestart'); if (!b) return;
    b.addEventListener('click', () => {
      if (!confirm('Start the whole page again? Your answers on this computer are cleared. What your teacher already has is kept.')) return;
      L.restartAll();
      try { Object.keys(localStorage).filter(k => k.indexOf(KEY) === 0).forEach(k => localStorage.removeItem(k)); } catch (e) {}
      setTimeout(() => location.replace(location.pathname), 150);
    });
  }

  /* ---------------- the word bank (one list for the page, with Korean and Chinese) ---------------- */
  const WORD = {};
  (window.WORDS || []).forEach(g => g.w.forEach(w => { WORD[w.k] = w; }));
  function initWordBank() {
    const wb = $('#wb'), btn = $('#wbBtn'), list = $('#wbList'), find = $('#wbFind');
    if (!wb || !btn) return;
    list.innerHTML = (window.WORDS || []).map(g => `<p class="wb__g">${esc(g.g)}</p>` + g.w.map(w =>
      `<div class="wb__row" data-s="${esc((w.en + ' ' + w.ko + ' ' + w.zh).toLowerCase())}"><b>${esc(w.en)}</b><span class="ko" lang="ko">${esc(w.ko)}</span><span class="zh" lang="zh-Hans">${esc(w.zh)}</span></div>`).join('')).join('');
    const setLang = l => {
      wb.setAttribute('data-lang', l); store.set('lang', l);
      $$('.langs button', wb).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
      const s = $('.lang', btn); if (s) s.textContent = l === 'ko' ? '· 한국어' : l === 'zh' ? '· 中文' : l === 'all' ? '· 한국어 中文' : '';
      document.dispatchEvent(new Event('langchange'));
    };
    $$('.langs button', wb).forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
    setLang(store.get('lang', 'all'));
    const open = on => { wb.hidden = !on; btn.setAttribute('aria-expanded', String(on)); if (on) find.focus(); };
    btn.addEventListener('click', () => open(wb.hidden));
    $('#wbClose').addEventListener('click', () => { open(false); btn.focus(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !wb.hidden) { open(false); btn.focus(); } });
    find.addEventListener('input', () => {
      const v = find.value.trim().toLowerCase();
      $$('.wb__row', list).forEach(r => r.classList.toggle('hide', !!v && r.dataset.s.indexOf(v) < 0));
    });
  }
  const lang = () => store.get('lang', 'all');

  /* ---------------- key words: the meaning opens where you are (never the title attribute) ---------------- */
  let tipEl = null, tipFor = null;
  function closeTip() { if (tipEl) { tipEl.remove(); tipEl = null; tipFor = null; } }
  function showTip(btn) {
    const w = WORD[btn.dataset.w]; if (!w) return;
    if (tipFor === btn) { closeTip(); return; }
    closeTip();
    const l = lang();
    const tr = (l === 'en') ? '' : '<div class="tr">' + (l !== 'zh' ? `<span lang="ko"><i>한국어</i>${esc(w.ko)}</span>` : '') + (l !== 'ko' ? `<span lang="zh-Hans"><i>中文</i>${esc(w.zh)}</span>` : '') + '</div>';
    tipEl = h('div', { class: 'tip', role: 'note' }, `<b>${esc(w.en)}</b>: ${esc(w.d)}${tr}`);
    document.body.appendChild(tipEl); tipFor = btn;
    const r = btn.getBoundingClientRect(), tw = tipEl.offsetWidth;
    let x = r.left + scrollX; x = Math.max(8, Math.min(x, scrollX + document.documentElement.clientWidth - tw - 8));
    tipEl.style.left = x + 'px'; tipEl.style.top = (r.bottom + scrollY + 6) + 'px';
  }
  function initTerms() {
    $$('dfn[data-w]').forEach(d => {
      const b = h('button', { type: 'button', class: 'term', 'data-w': d.dataset.w, 'aria-label': d.textContent + ': show its meaning' });
      b.textContent = d.textContent; d.replaceWith(b);
    });
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('.term');
      if (t) { showTip(t); e.stopPropagation(); return; }
      if (tipEl && !e.target.closest('.tip')) closeTip();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTip(); });
    addEventListener('resize', closeTip);
  }

  /* ---------------- start ---------------- */
  function start() {
    initTheme(); initRestart(); initWordBank(); initTerms();
    document.dispatchEvent(new Event('sepmix:build'));   /* questions.js and bench.js draw themselves here */
    initTabs();
    progress();
    /* ?demo=<part>: the bench clicks itself through that part's right answers, for the README's screenshot (with ?still=1) */
    const DEMO = { 4: ['IN at the lower', 'Light', 'Turn off'], 5: ['A pencil', 'Spot the five', 'Below', 'Cover it', 'Remove it'], 3: ['Pour it', 'Light', 'Heat for 2', 'Heat for 2', 'Heat for 2', 'Test with'] };
    if (params.has('demo') && DEMO[+params.get('demo')]) {
      openPart(+params.get('demo'));
      (async () => { for (const t of DEMO[+params.get('demo')]) { await new Promise(r => setTimeout(r, 400)); const b = $$('.hot').find(x => x.textContent.indexOf(t) >= 0); if (b) b.click(); } })();
    }
    if (params.has('manifest')) {
      const pre = h('pre', { id: 'manifest' }); pre.textContent = JSON.stringify(manifest());
      document.body.appendChild(pre);
    }
  }
  window.SEP = { $, $$, h, esc, NS, store, ans, L, reg, manifest, progressSoon, openPart, FAST, WORD, lang, params, cur: () => cur };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
