#!/usr/bin/env node
/* overlap-audit.mjs — every bench, every step, at several window sizes: buttons and words that overlap or are cut off
   (15 Oct 2026, Daniel: "make sure no other labels are overlapping in other tabs").
     node tools/overlap-audit.mjs                      the laptop and tablet sizes; exit 1 on any problem
     node tools/overlap-audit.mjs --gallery 2 out.png  one screenshot of every step of part 2, for a person to look at
   Needs a local server on 127.0.0.1:8787 serving the Biology Hub folder (the workspace's launch.json "estate"). */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL0 = process.env.PAGE || 'http://127.0.0.1:8787/practicals/ks3-separating-mixtures-pract/';
const ALL = [[1280, 720], [1366, 768], [1440, 790], [1440, 900], [1920, 1000], [1100, 800], [820, 1180]];
const oi = process.argv.indexOf('--only');                 /* --only 1280x720: one size, for a quick look */
const SIZES = oi > 0 ? [process.argv[oi + 1].split('x').map(Number)] : ALL;
function chrome(args, ms) {
  const prof = mkdtempSync(join(tmpdir(), 'ovl-'));
  try {
    return spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + prof, ...args],
      { encoding: 'utf8', timeout: ms, killSignal: 'SIGKILL', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 });
  } finally { rmSync(prof, { recursive: true, force: true }); }
}
const gi = process.argv.indexOf('--gallery');
if (gi > 0) {
  const part = process.argv[gi + 1], out = process.argv[gi + 2] || 'gallery.png', h = +(process.argv[gi + 3] || 3200);
  chrome([`--window-size=1440,${h}`, '--virtual-time-budget=40000', `--screenshot=${out}`, `${URL0}?still=1&audit=1&gallery=${part}`], 60000);
  console.log('wrote ' + out);
  process.exit(0);
}
if (process.argv.includes('--scroll')) {
  const r = chrome(['--window-size=1440,790', '--virtual-time-budget=40000', '--dump-dom', `${URL0}?still=1&audit=1&scrolltest=1`], 60000);
  const m = (r.stdout || '').match(/<pre id="scroll">([\s\S]*?)<\/pre>/);
  if (!m) { console.log('the scroll test wrote no result'); process.exit(1); }
  const res = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  res.forEach(x => console.log(x.log ? 'log ' + JSON.stringify(x.log) : x.busy ? `half-done bench: stays ${x.stays ? 'yes' : 'NO'}, extension button calls ${x.calls ? 'yes' : 'NO'}` : `part ${x.part}: ${x.before} → ${x.after} ${x.ok ? '✓' : '✗'} (box top ${x.extTop}, height ${x.extH}, scrolled ${x.y}, window ${x.vh})`));
  process.exit(res.every(x => x.busy ? x.stays && x.calls : x.ok) ? 0 : 1);
}
/* --words: at one laptop size, the bubbles beside the buttons, the sentences highlighted under the bench and those left
   plain, and the smallest size each word on the bench is drawn at (16 Oct 2026, the font-size and instructions audit) */
if (process.argv.includes('--words')) {
  const r = chrome(['--window-size=1440,790', '--virtual-time-budget=40000', '--dump-dom', `${URL0}?still=1&audit=1`], 150000);
  const m = (r.stdout || '').match(/<pre id="audit">([\s\S]*?)<\/pre>/);
  if (!m) { console.log('the page wrote no result'); process.exit(1); }
  const W = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')).words;
  console.log('BUBBLES:'); W.asks.forEach(x => console.log('  ? ' + x));
  console.log('HIGHLIGHTED:'); W.marked.forEach(x => console.log('  + ' + x));
  console.log('NOT HIGHLIGHTED:'); W.plain.forEach(x => console.log('  - ' + x));
  const small = Object.entries(W.min).sort((a, b) => a[1] - b[1]);
  console.log('SMALLEST WORDS ON THE BENCH (px):'); small.slice(0, 25).forEach(([t, px]) => console.log(`  ${String(px).padStart(5)}  ${t.slice(0, 50)}`));
  console.log('BUTTONS (px):', [...new Set(Object.values(W.hot))].sort((a, b) => a - b).join(', '));
  process.exit(0);
}
let bad = 0;
for (const [w, h] of SIZES) {
  const r = chrome([`--window-size=${w},${h}`, '--virtual-time-budget=40000', '--dump-dom', `${URL0}?still=1&audit=1`], 150000);
  const m = (r.stdout || '').match(/<pre id="audit">([\s\S]*?)<\/pre>/);
  if (!m) { console.log(`${w}×${h}: the page wrote no result`); bad++; continue; }
  const res = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
  const seen = new Set(), list = res.problems.filter(p => { const k = p.kind + '|' + p.a + '|' + p.b + '|' + p.where.split('/').slice(0, 2).join('/'); if (seen.has(k)) return false; seen.add(k); return true; });
  console.log(`${w}×${h} (bench ${res.canvas} px wide): ${list.length ? list.length + ' problem(s)' : 'nothing overlaps'}`);
  list.forEach(p => console.log(`   ${p.kind.padEnd(9)} ${p.where}: "${p.a}" | "${p.b}"`));
  bad += list.length;
}
process.exit(bad ? 1 : 0);
