import fs from 'node:fs';

const tachCSV = (line) => {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
};

const lines = fs.readFileSync('docs/testcases/nfr.csv', 'utf8').trim().split(/\r?\n/);
const header = tachCSV(lines[0]);
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
console.log('HEADER:', header.join(' | '));

const rows = lines.slice(1).filter((l) => l.trim()).map(tachCSV);
console.log('\n--- Ca cua Tai ---');
for (const r of rows.filter((x) => x[idx.Owner] === 'Tài')) {
  console.log(`${r[idx.TC_ID]} | ${r[idx.Requirement_ID]} | ${r[idx.Type]} | ${r[idx.Status]} | ${r[idx.Title]}`);
}
console.log('\n--- Tat ca ca Fail ---');
for (const r of rows.filter((x) => x[idx.Status] === 'Fail')) {
  console.log(`${r[idx.TC_ID]} | ${r[idx.Requirement_ID]} | ${r[idx.Owner]} | ${r[idx.Title]}`);
}
