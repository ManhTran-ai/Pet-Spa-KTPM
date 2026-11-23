import { readText, parseCsv } from './lib/common.mjs';

const { records } = parseCsv(await readText('docs/testcases/t1.csv'));
for (const r of records) {
  console.log(`${r.TC_ID} | ${r.Requirement_ID} | ${r.Type} | ${r.Status} | ${r.Title}`);
}
