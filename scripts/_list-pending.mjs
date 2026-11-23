import { readText } from './lib/common.mjs';

const file = process.argv[2] ?? 'docs/testcases/t1.csv';
const { records } = await (async () => {
  const mod = await import('./lib/common.mjs');
  return { records: mod.parseCsv(await readText(file)).records };
})();

const pending = records.filter((r) => /Chưa thực thi/i.test(r.Status ?? ''));
console.log(`TOTAL ${records.length} | PENDING ${pending.length}`);
for (const r of pending) {
  console.log([r.TC_ID, r.Requirement_ID, r.Owner, r.Type, r.Title].join(' | '));
}
