import fs from 'node:fs';

function docCsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
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
  const header = lines[0].replace(/^\uFEFF/, '').split(',');
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

const rows = docCsv('reports/raw/survey-T2-matrix.csv');
const pets = [...new Set(rows.map((r) => r.Pet))];
console.log('Pets:', JSON.stringify(pets));

const bands = [...new Set(rows.map((r) => r.Band))];
console.log('Bands:', JSON.stringify(bands));

// Gia theo (Pet, Band, Service)
const gia = new Map();
for (const r of rows) gia.set(`${r.Pet}|${r.Band}|${r.Service}`, r.Price);

const svcChinh = [...new Set(rows.map((r) => r.Service))].filter((s) => !/Báo giá riêng/.test(s));

console.log('\n=== So sanh gia Cho vs Meo ===');
let cung = 0;
let khac = 0;
for (const r of rows) {
  const k = `${r.Band}|${r.Service}`;
  const cho = gia.get(`${pets[0]}|${k}`);
  const meo = gia.get(`${pets[1]}|${k}`);
  if (cho === undefined || meo === undefined) continue;
  if (cho === meo) cung += 1;
  else khac += 1;
}
console.log(`  giong=${cung}  khac=${khac}`);

console.log('\n=== Gia tang don dieu theo bac (Combo Tam Ve Sinh) ===');
const comboTam = svcChinh.find((s) => /Combo Tắm Vệ Sinh/.test(s));
for (const pet of pets) {
  const vals = bands.map((b) => gia.get(`${pet}|${b}|${comboTam}`) ?? '?');
  console.log(`  ${pet}: ${vals.join(' -> ')}`);
}

console.log('\n=== Phan loai dich vu T2 (theo SRS 3.2) ===');
const combo = svcChinh.filter((s) => /^Combo/.test(s));
const nhuom = svcChinh.filter((s) => /Nhuộm/.test(s));
const le = svcChinh.filter((s) => !/^Combo/.test(s) && !/Nhuộm/.test(s));
const baoGia = [...new Set(rows.map((r) => r.Service))].filter((s) => /Báo giá riêng/.test(s));
console.log(`  combo=${combo.length} le=${le.length} nhuom=${nhuom.length} baoGiaRieng=${baoGia.length}`);
console.log(`  tong grooming (combo+le+nhuom)=${combo.length + le.length + nhuom.length}`);
console.log(`  TONG tat ca=${combo.length + le.length + nhuom.length + baoGia.length}`);
console.log(`  le: ${le.join(' | ')}`);
