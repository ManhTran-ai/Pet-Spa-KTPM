import path from 'node:path';
import { DOCS_DIR, parseCsv, readText, toCsv, writeText } from './lib/common.mjs';

/**
 * Bổ sung test case vào DEF-019 (Lighthouse Performance trên cả 3 site):
 * TC-NFR-01-001 (trang chủ) và TC-NFR-01-002 (trang đặt lịch).
 */
const FILE = path.join(DOCS_DIR, 'defects', 'defects.csv');

const raw = await readText(FILE);
const { headers, records } = parseCsv(raw);

const record = records.find((r) => r.DEF_ID === 'DEF-019');
if (!record) {
  console.log('Không tìm thấy DEF-019.');
  process.exit(0);
}

record.Test_Case_ID = 'TC-NFR-01-001 TC-NFR-01-002';
record.Actual =
  'T1 = 67; T2 = 59; T3 = 3 (trang chủ). Trang đặt lịch: T1 = 55; T2 = 51; T3 = 5 (LCP 14.137 ms / 7.171 ms / 23.039 ms)';
record.Evidence = 'reports/raw/lighthouse-summary.csv, reports/raw/lighthouse-booking-summary.csv';

await writeText(FILE, toCsv(headers, records), 'utf8');
console.log('Đã cập nhật DEF-019.');
