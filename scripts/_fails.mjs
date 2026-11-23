import fs from 'node:fs';

const r = JSON.parse(fs.readFileSync('reports/raw/playwright-report.json', 'utf8'));
const out = [];

function walk(suite) {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const res = t.results?.[0];
      if (res?.status === 'passed') continue;
      const err = (res?.error?.message || '').split('\n').slice(0, 12).join('\n');
      out.push({
        title: spec.title,
        file: spec.file,
        status: res?.status,
        err,
      });
    }
  }
  for (const s of suite.suites ?? []) walk(s);
}
for (const s of r.suites ?? []) walk(s);

fs.writeFileSync('reports/raw/_fails.json', JSON.stringify(out, null, 2), 'utf8');
console.log(out.map((o) => `### ${o.title}\n${o.err}\n`).join('\n'));
