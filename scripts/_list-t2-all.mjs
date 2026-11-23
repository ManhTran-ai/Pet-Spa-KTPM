import { readText } from './lib/common.mjs';
import { parseCsv } from './lib/common.mjs';

const file = process.argv[2] ?? 'docs/testcases/t2.csv';
const { records } = parseCsv(await readText(file));
for (const r of records) {
  console.log(`${r.TC_ID} | ${r.Requirement_ID} | ${r.Type} | ${r.Status} | ${r.Title}`);
}
