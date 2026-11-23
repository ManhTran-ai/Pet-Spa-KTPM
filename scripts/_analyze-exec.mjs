import fs from 'node:fs';

export function tachCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const t = (line) => {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      if (inQ) {
        if (c === '"') {
          if (line[i + 1] === '"') { cur += '"'; i += 1; } else inQ = false;
        } else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out;
  };
  const header = t(lines[0]);
  return lines.slice(1).filter((l) => l.trim()).map((l) => {
    const v = t(l);
    return Object.fromEntries(header.map((h, i) => [h, v[i] ?? '']));
  });
}

const rows = tachCsv(fs.readFileSync('reports/execution-log.csv', 'utf8'));
const byOwner = {};
for (const r of rows) {
  const k = r.Owner || '?';
  byOwner[k] = byOwner[k] || { Pass: 0, Fail: 0 };
  byOwner[k][r.Result] = (byOwner[k][r.Result] || 0) + 1;
}
console.log('Tong dong:', rows.length);
console.log('Theo Owner:', JSON.stringify(byOwner, null, 1));

console.log('\n--- FAIL cua Tai ---');
for (const r of rows.filter((x) => x.Owner === 'Tài' && x.Result === 'Fail')) {
  console.log(`${r.TC_ID} | ${r.Defect_ID} | ${r.Title.slice(0, 55)}`);
}

console.log('\n--- FAIL cua cac thanh vien khac ---');
for (const r of rows.filter((x) => x.Owner !== 'Tài' && x.Result === 'Fail')) {
  console.log(`${r.TC_ID} | ${r.Owner} | ${r.Defect_ID} | ${r.Title.slice(0, 45)}`);
}

console.log('\n--- Chua thuc thi ---');
const tcFiles = ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv'];
let chua = 0;
const theoOwnerChua = {};
for (const f of tcFiles) {
  for (const r of tachCsv(fs.readFileSync(`docs/testcases/${f}`, 'utf8'))) {
    if (!r.Status || r.Status === 'Chưa thực thi') {
      chua += 1;
      theoOwnerChua[r.Owner] = (theoOwnerChua[r.Owner] || 0) + 1;
    }
  }
}
console.log('Tong chua thuc thi:', chua, JSON.stringify(theoOwnerChua));
