import fs from 'node:fs';

/**
 * Doi chieu ma tran gia T2 (khan gia thuc te 21/11/2026) voi baseline REF-01
 * trong docs/reference/pricing-baseline.csv (khan gia 13/11/2026).
 * Muc dich: phat hien sai lech gia (khai bao trong SRS) va chay muc doi.
 */

function docCsv(path) {
  const text = fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const lines = [];
  let cur = '';
  let inQ = false;
  for (const ch of text) {
    if (ch === '"') inQ = !inQ;
    if (ch === '\n' && !inQ) {
      lines.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) lines.push(cur);

  const header = lines[0].replace(/^﻿/, '').split(',');
  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const cells = [];
      let c = '';
      let q = false;
      for (const ch of line) {
        if (ch === '"') q = !q;
        else if (ch === ',' && !q) {
          cells.push(c);
          c = '';
        } else c += ch;
      }
      cells.push(c);
      const o = {};
      header.forEach((h, i) => (o[h] = cells[i] ?? ''));
      return o;
    });
}

/** Chuan hoa dau gach: baseline dung "-" ASCII, khan gia dung en-dash. */
const chuanHoaBand = (b) => b.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();

function chuanHoaTen(raw) {
  return raw
    .replace(/Báo giá theo tình trạng lông:.*$/i, '')
    .replace(/Báo giá tuỳ kích thước & màu/i, '')
    .replace(/Báo giá theo thiết kế riêng/i, '')
    .replace(/Báo giá riêng/i, '')
    .trim();
}

/** Chuan hoa gia ve don vi VND de so sanh. */
function giaVnd(text) {
  if (!text) return null;
  const t = text.replace(/\s|đ|VND/g, '').toLowerCase();
  const m = t.match(/^([\d.,]+)(k|tr)?$/);
  if (!m) return null;
  const n = Number(m[1].replace(/[.,]/g, (s, i, str) => (str.indexOf('.') < 0 ? '' : s)));
  const clean = m[1].replace(/\./g, '').replace(',', '.');
  const val = Number(clean);
  if (!Number.isFinite(val)) return null;
  if (m[2] === 'tr') return Math.round(val * 1_000_000);
  if (m[2] === 'k') return Math.round(val * 1000);
  return Math.round(val);
}

const matrix = docCsv('reports/raw/survey-T2-matrix.csv');
const baseline = docCsv('docs/reference/pricing-baseline.csv').filter((r) => r.System === 'T2');

// Baseline chi lay dong Grooming + Nhuộm co gia cu the.
const baseMap = new Map();
for (const r of baseline) {
  const band = chuanHoaBand(r.Band);
  const ten = chuanHoaTen(r.Service);
  const key = `${band}|${ten}`;
  baseMap.set(key, { price: r.Price, table: r.Table });
}

const matrixMap = new Map();
for (const r of matrix) {
  const key = `${chuanHoaBand(r.Band)}|${chuanHoaTen(r.Service)}`;
  matrixMap.set(key, r.Price);
}

const lech = [];
const khongCo = [];
for (const [key, v] of matrixMap.entries()) {
  if (!v) continue; // dịch vụ báo giá riêng — không có giá cố định
  if (!baseMap.has(key)) {
    khongCo.push({ key, giaMoi: v });
    continue;
  }
  const a = giaVnd(v);
  const b = giaVnd(baseMap.get(key).price);
  if (a !== null && b !== null && a !== b) {
    lech.push({ key, giaBaseline: baseMap.get(key).price, giaMoi: v, bang: baseMap.get(key).table });
  }
}

const mat = [...baseMap.keys()].filter((k) => !matrixMap.has(k));

console.log(`Ma tran (khan moi): ${matrixMap.size} cap`);
console.log(`Baseline T2: ${baseMap.size} dong`);
console.log(`SAI LECH gia: ${lech.length}`);
console.log(`Chi co o baseline (khong thay trong khan moi): ${mat.length}`);
console.log(`Chi co o khan moi: ${khongCo.length}`);

if (lech.length) {
  console.log('\n=== SAI LECH GIA ===');
  lech.forEach((l) => console.log(`${l.key} | baseline=${l.giaBaseline} | moi=${l.giaMoi} | bang=${l.bang}`));
}
if (khongCo.length) {
  console.log('\n=== CHI CO O KHAN MOI ===');
  khongCo.slice(0, 20).forEach((l) => console.log(`${l.key} | moi=${l.giaMoi}`));
}
if (mat.length) {
  console.log('\n=== CHI CO O BASELINE ===');
  mat.forEach((k) => console.log(k));
}

fs.writeFileSync(
  'reports/raw/survey-T2-baseline-diff.csv',
  [
    'Band,Service,Baseline,Survey,Source',
    ...lech.map((l) => {
      const [band, ...rest] = l.key.split('|');
      return `${band},${rest.join('|')},${l.giaBaseline},${l.giaMoi},${l.bang}`;
    }),
  ].join('\n') + '\n',
  'utf8',
);
console.log('\n-> reports/raw/survey-T2-baseline-diff.csv');
