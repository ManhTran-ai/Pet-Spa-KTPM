import path from 'node:path';
import { DOCS_DIR, parseCsv, readText, toCsv, writeText, log } from './lib/common.mjs';

/**
 * Ghi kết quả thủ công cho các test case của Ngân không có script Playwright
 * (Ngày 11-13). Mỗi dòng đều kèm bằng chứng thô trong `reports/raw/`.
 */
const FILES = ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv'];

const KET_QUA = [
  {
    tc: 'TC-NFR-01-001',
    status: 'Fail',
    defect: 'DEF-019',
    note: 'Lighthouse 3 lan/site, lay trung viet - reports/raw/lighthouse-summary.csv: T1 = 67, T2 = 59, T3 = 3, deu < 70',
  },
  {
    tc: 'TC-NFR-01-002',
    status: 'Fail',
    defect: 'DEF-019',
    note: 'Lighthouse trang dat lich 3 lan/site - reports/raw/lighthouse-booking-summary.csv: T1 = 55, T2 = 51, T3 = 5, deu < 70',
  },
  {
    tc: 'TC-NFR-01-006',
    status: 'Pass',
    defect: '',
    note: 'k6 10 VU / 1m - reports/raw/k6-summary.json: 183 request, 0 loi 5xx, http_req_failed = 0.00%, p95 = 907.74 ms',
  },
  {
    tc: 'TC-T3-M4-007',
    status: 'Blocked',
    defect: '',
    note: 'Bi chan boi luong dang nhap cua T3 (chi danh cho khach hang da co tai khoan) - ADR-11 khong tao tai khoan tren site that. Xem reports/raw/survey-T3-select-state.csv',
  },
];

async function main() {
  for (const file of FILES) {
    const filePath = path.join(DOCS_DIR, 'testcases', file);
    const raw = await readText(filePath).catch(() => '');
    if (!raw) continue;
    const { headers, records } = parseCsv(raw);
    let changed = false;

    for (const item of KET_QUA) {
      const record = records.find((r) => r.TC_ID === item.tc);
      if (!record) continue;
      if (record.Status === item.status) continue;
      record.Status = item.status;
      changed = true;
      log(`${item.tc} -> ${item.status}${item.defect ? ` (${item.defect})` : ''}`);
    }

    if (changed) await writeText(filePath, toCsv(headers, records), 'utf8');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
