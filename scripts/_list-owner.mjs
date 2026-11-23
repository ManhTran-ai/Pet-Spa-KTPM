import { parseCsv, readText } from './lib/common.mjs';

/** Liet ke cac test case chua thuc thi theo tung nguoi so huu. */
const NGUOI = process.argv[2] ?? 'Tài';
let all = [];
for (const n of ['t1', 't2', 't3', 'nfr', 'uat']) {
  const { records } = parseCsv(await readText(`docs/testcases/${n}.csv`));
  all = all.concat(records.map((r) => ({ ...r, file: n })));
}
const pend = all.filter((r) => /Chưa thực thi/i.test(r.Status ?? ''));
console.log(`PENDING total ${pend.length}`);
const byS = {};
for (const r of pend) byS[r.Owner] = (byS[r.Owner] ?? 0) + 1;
console.log(byS);

const chon = pend.filter((r) => (NGUOI === 'ALL' ? true : r.Owner === NGUOI));
console.log(`--- ${NGUOI}: ${chon.length} ca ---`);
for (const r of chon) {
  console.log(`${r.TC_ID} | ${r.Requirement_ID} | ${r.file} | ${r.Type} | ${r.Title}`);
}
