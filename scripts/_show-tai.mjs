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

const only = process.argv[2];
for (const f of ['t1', 't2', 'nfr']) {
  const rs = docCsv(`docs/testcases/${f}.csv`);
  const tai = rs.filter((r) => r.Owner === 'Tài' && r.Status === 'Chưa thực thi');
  console.log(`=== ${f} (${tai.length}) ===`);
  for (const r of tai) {
    if (only && !r.TC_ID.includes(only)) continue;
    console.log(
      [
        r.TC_ID,
        `req=${r.Requirement_ID}`,
        `type=${r.Type}`,
        `prio=${r.Priority}`,
        `title=${r.Title}`,
        `  PRE: ${(r.Preconditions || '').slice(0, 60)}`,
        `  STEP: ${(r.Test_Steps || '').slice(0, 200)}`,
        `  EXP: ${(r.Expected_Result || '').slice(0, 200)}`,
        `  NOTE: ${(r.Notes || '').slice(0, 120)}`,
      ].join('\n'),
    );
  }
}
