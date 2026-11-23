import fs from 'node:fs';
import path from 'node:path';

/** Liệt kê test case theo owner / trạng thái. */
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

const thuocTinh = process.argv[2] ?? 'Chưa thực thi';
const chu = process.argv[3];

const tong = [];
for (const f of fs.readdirSync('docs/testcases').filter((x) => x.endsWith('.csv'))) {
  for (const r of docCsv(path.join('docs/testcases', f))) {
    if (r.Status !== thuocTinh) continue;
    if (chu && !(r.Owner ?? '').includes(chu)) continue;
    tong.push({ file: f, ...r });
  }
}

console.log(`Tong chua thuc thi (${thuocTinh}${chu ? `, owner ${chu}` : ''}): ${tong.length}`);
const theoLoai = {};
for (const r of tong) {
  const k = `${r.System} · ${r.Type}`;
  theoLoai[k] = (theoLoai[k] ?? 0) + 1;
}
Object.entries(theoLoai)
  .sort()
  .forEach(([k, v]) => console.log(`  ${k}: ${v}`));

console.log('\nDANH SACH:');
for (const r of tong) {
  console.log(
    `${r.TC_ID}\t${r.System}\t${r.Type}\t${r.Priority}\t${r.Requirement_ID}\t${r.Owner}\t${r.Title}`,
  );
}
