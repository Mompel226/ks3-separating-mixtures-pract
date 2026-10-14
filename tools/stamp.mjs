#!/usr/bin/env node
/* stamp.mjs — one version for the whole page (15 Oct 2026): version.txt and every ?v= in index.html, from one value, so a
   pupil's browser fetches the new files and the labs script re-reads data/questions.json (it caches on version.txt).
     node tools/stamp.mjs            stamp with the time now (yyyymmddhhmm)
     node tools/stamp.mjs --check    exit 1 if index.html's ?v= and version.txt disagree */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = join(ROOT, 'index.html'), ver = join(ROOT, 'version.txt');
let page = readFileSync(html, 'utf8');
if (process.argv.includes('--check')) {
  let v = ''; try { v = readFileSync(ver, 'utf8').trim(); } catch (e) {}
  const stamps = [...new Set([...page.matchAll(/\?v=([0-9]+)"/g)].map(m => m[1]))];
  const ok = stamps.length === 1 && stamps[0] === v;
  console.log(ok ? 'stamp: index.html and version.txt agree (' + v + ')' : 'stamp: index.html has ' + stamps.join(', ') + '; version.txt has ' + v);
  process.exit(ok ? 0 : 1);
}
const d = new Date(), p = n => String(n).padStart(2, '0');
const v = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}`;
page = page.replace(/\?v=[0-9]+"/g, `?v=${v}"`);
writeFileSync(html, page); writeFileSync(ver, v + '\n');
console.log('stamped ' + v);
