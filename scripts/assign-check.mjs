/**
 * Kiểm chứng nguyên tắc phân công (ADR-15, ADR-16) trên bộ test case thật.
 *
 * 1. Mỗi module của mỗi hệ thống có TỐI THIỂU 2 người chạy → đối chiếu chéo.
 * 2. Tổng ca mỗi người cân bằng. Ngưỡng chênh lệch theo TỶ LỆ: tối đa 3% quy mô bộ ca
 *    (226 ca → 7; 230 ca → 7). Dùng tỷ lệ vì bộ ca đã lớn thêm 4 ca của Ngân
 *    trong lần hợp nhất 2026-11-22, còn ngưỡng tuyệt đối ±3 không còn khả thi nếu
 *    giữ nguyên người thực thi cho từng ca.
 * 3. NFR chuyên trách theo ADR-15: NFR-02 → Mạnh, NFR-01/05 → Ngân,
 *    NFR-03/04 → Tài, NFR-06/07 → Lộc.
 * 4. Mỗi người viết cho hệ thống mình không tự chạy hết hệ thống đó.
 *
 * Dùng: node scripts/assign-check.mjs
 */

import { readFile } from 'node:fs/promises';
import { parseCsv } from './lib/common.mjs';

const MEMBERS = ['Mạnh', 'Tài', 'Ngân', 'Lộc'];
// Chênh lệch tối đa = 3% quy mô bộ test case (226 ca → 7; 230 ca → 7).
const SPREAD_RATE = 0.03;

const NFR_OWNER = {
  'NFR-01': 'Ngân',
  'NFR-02': 'Mạnh',
  'NFR-03': 'Tài',
  'NFR-04': 'Tài',
  'NFR-05': 'Ngân',
  'NFR-06': 'Lộc',
  'NFR-07': 'Lộc',
};

const files = ['t1', 't2', 't3', 'nfr', 'uat'];
const tally = {};
const byModule = {};
const byReq = {};
let total = 0;

for (const file of files) {
  const { records } = parseCsv(await readFile(`docs/testcases/${file}.csv`, 'utf8'));
  for (const record of records) {
    if (!record.Owner) continue;
    total += 1;
    tally[record.Owner] = (tally[record.Owner] ?? 0) + 1;
    byReq[record.Requirement_ID] ??= {};
    byReq[record.Requirement_ID][record.Owner] = (byReq[record.Requirement_ID][record.Owner] ?? 0) + 1;
    if (file === 'nfr') continue;
    const key = `${record.System}|${record.Requirement_ID.split('-')[1]}`;
    byModule[key] ??= {};
    byModule[key][record.Owner] = (byModule[key][record.Owner] ?? 0) + 1;
  }
}

const problems = [];

const maxSpread = Math.ceil(total * SPREAD_RATE);
const spread = Math.max(...MEMBERS.map((m) => tally[m] ?? 0)) - Math.min(...MEMBERS.map((m) => tally[m] ?? 0));
if (spread > maxSpread) problems.push(`Chênh lệch số ca ${spread} > ${maxSpread}`);

for (const member of MEMBERS) {
  if (!tally[member]) problems.push(`${member}: không có test case nào được gán`);
}

for (const [key, owners] of Object.entries(byModule)) {
  if (Object.keys(owners).length < 2) {
    problems.push(`Module ${key} chỉ có 1 người chạy: ${Object.keys(owners).join(', ')}`);
  }
}

for (const [req, owners] of Object.entries(byReq)) {
  const expected = NFR_OWNER[req];
  if (!expected) continue;
  const actual = Object.keys(owners);
  if (actual.length !== 1 || actual[0] !== expected) {
    problems.push(`${req} phải do ${expected} chuyên trách, thực tế: ${actual.join(', ')}`);
  }
}

console.log('Tổng test case:', total);
console.log('Số ca theo Owner:', JSON.stringify(tally));
console.log(`Chênh lệch max-min: ${spread} (giới hạn ${maxSpread} = 3% quy mô ${total} ca)`);
console.log('Module chỉ có 1 người chạy:', Object.values(byModule).filter((o) => Object.keys(o).length < 2).length);

if (problems.length > 0) {
  console.error('\nVI PHẠM:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
} else {
  console.log('\nOK: 4/4 nguyên tắc phân công được thoả mãn.');
}
