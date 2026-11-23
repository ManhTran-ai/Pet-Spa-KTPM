import { readText, parseCsv } from './lib/common.mjs';

const files = ['t1', 't2', 't3', 'nfr'];
for (const f of files) {
  const { records } = parseCsv(await readText(`docs/testcases/${f}.csv`));
  const pending = records.filter((r) => /Chưa thực thi/i.test(r.Status ?? ''));
  const tai = pending.filter((r) => /Tài/i.test(r.Owner ?? ''));
  console.log(`--- ${f}: pending ${pending.length} | Tài ${tai.length}`);
  for (const r of tai) console.log(`  ${r.TC_ID} | ${r.Requirement_ID} | ${r.Type} | ${r.Title}`);
}
