import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, parseCsv, readText, toCsv, writeText, log } from './lib/common.mjs';

/**
 * Đồng bộ kết quả chạy tự động (Playwright JSON + Newman JSON) vào
 * `reports/execution-log.csv` và cập nhật trạng thái trong `docs/testcases/*.csv`.
 *
 * Nguyên tắc:
 * - Chỉ ghi kết quả có bằng chứng thật trong `reports/raw/`.
 * - Một TC có nhiều biến thể (nhiều site / nhiều bảng giá): Fail nếu bất kỳ
 *   biến thể nào Fail — tránh che mất lỗi.
 * - Fail ở site bên thứ ba vẫn ghi là `Fail` kèm DEF, không bị làm xanh.
 * - Log được dựng lại từ lần chạy mới nhất; dòng thủ công do người ghi tay
 *   (không có bằng chứng máy) được giữ nguyên.
 */
const EXEC_HEADERS = [
  'TC_ID',
  'Requirement_ID',
  'System',
  'Title',
  'Type',
  'Owner',
  'Executed_By',
  'Executed_At',
  'Result',
  'Defect_ID',
  'Note',
];

const TESTCASE_HEADERS = [
  'TC_ID',
  'Requirement_ID',
  'System',
  'Title',
  'Priority',
  'Technique',
  'Type',
  'Owner',
  'Status',
];

const EXECUTION_LOG = path.join(REPORTS_DIR, 'execution-log.csv');
const PLAYWRIGHT_JSON = path.join(REPORTS_DIR, 'raw', 'playwright-report.json');
const NEWMAN_JSON = path.join(REPORTS_DIR, 'raw', 'newman-report.json');
const TESTCASE_FILES = ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv'];

function collectSpecs(suites, out = []) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) out.push(spec);
    collectSpecs(suite.suites, out);
  }
  return out;
}

/** Tên test Playwright luôn bắt đầu bằng mã test case, ví dụ `TC-T1-M1-001: ...`. */
function tcIdFromTitle(title) {
  const match = /TC-[A-Z0-9]+(?:-[A-Z0-9]+)*/.exec(title);
  return match ? match[0] : null;
}

async function loadTestcases() {
  const map = new Map();
  for (const file of TESTCASE_FILES) {
    const raw = await readText(path.join(DOCS_DIR, 'testcases', file)).catch(() => '');
    if (!raw) continue;
    const { records } = parseCsv(raw);
    for (const record of records) map.set(record.TC_ID, { ...record, _file: file });
  }
  return map;
}

async function loadCsv(file) {
  const raw = await readText(file).catch(() => '');
  return raw ? parseCsv(raw).records : [];
}

/** Danh sách DEF liên quan tới một TC (nhiều site có thể sinh nhiều DEF). */
function defectIdsFor(defects, tcId) {
  return defects
    .filter((d) => (d.Test_Case_ID ?? '').split(/\s+/).includes(tcId))
    .map((d) => d.DEF_ID)
    .join(' ');
}

async function main() {
  const testcases = await loadTestcases();
  const previousLog = await loadCsv(EXECUTION_LOG);
  const defects = await loadCsv(path.join(DOCS_DIR, 'defects', 'defects.csv'));
  const executedAt = new Date().toISOString().slice(0, 10);

  /** @type {Map<string, {status: string, note: string, executedBy: string, variants: number}>} */
  const results = new Map();

  const record = (tcId, status, note, executedBy) => {
    const current = results.get(tcId);
    if (!current) {
      results.set(tcId, { status, note, executedBy, variants: 1 });
      return;
    }
    current.variants += 1;
    // Fail ở bất kỳ biến thể nào thì TC đó Fail.
    if (status === 'Fail') {
      current.status = 'Fail';
      current.note = note;
      current.executedBy = executedBy;
    }
  };

  // --- Playwright ---
  let playwrightCount = 0;
  const pwRaw = await readText(PLAYWRIGHT_JSON).catch(() => '');
  if (pwRaw) {
    const report = JSON.parse(pwRaw);
    for (const spec of collectSpecs(report.suites)) {
      const tcId = tcIdFromTitle(spec.title);
      if (!tcId) continue;
      playwrightCount += 1;
      record(
        tcId,
        spec.ok ? 'Pass' : 'Fail',
        spec.ok
          ? 'Playwright — xem reports/raw/playwright-report.json'
          : 'Playwright — bằng chứng trong reports/playwright/',
        'Mạnh (script)',
      );
    }
  }

  // --- Newman (Postman) ---
  let newmanCount = 0;
  const nmRaw = await readText(NEWMAN_JSON).catch(() => '');
  if (nmRaw) {
    const report = JSON.parse(nmRaw);
    for (const item of report.run?.executions ?? []) {
      const tcId = tcIdFromTitle(item.item?.name ?? '');
      if (!tcId) continue;
      newmanCount += 1;
      const assertions = item.assertions ?? [];
      const failed = assertions.filter((a) => a.error).length;
      record(
        tcId,
        failed === 0 && assertions.length > 0 ? 'Pass' : 'Fail',
        `Newman — ${assertions.length} assertion, ${failed} fail`,
        'Tài (Newman)',
      );
    }
  }

  // Dòng thủ công do người ghi tay: giữ lại nếu chưa có kết quả máy cho TC đó.
  for (const row of previousLog) {
    if (results.has(row.TC_ID)) continue;
    if (row.Executed_By && !row.Executed_By.includes('script') && !row.Executed_By.includes('Newman')) {
      results.set(row.TC_ID, {
        status: row.Result,
        note: row.Note ?? '',
        executedBy: row.Executed_By,
        variants: 1,
      });
    }
  }

  const rows = [...results.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([tcId, result]) => {
      const tc = testcases.get(tcId);
      return {
        TC_ID: tcId,
        Requirement_ID: tc?.Requirement_ID ?? '',
        System: tc?.System ?? '',
        Title: tc?.Title ?? '',
        Type: tc?.Type ?? 'Auto',
        Owner: tc?.Owner ?? '',
        Executed_By: result.executedBy,
        Executed_At: executedAt,
        Result: result.status,
        Defect_ID: result.status === 'Fail' ? defectIdsFor(defects, tcId) : '',
        Note: result.variants > 1 ? `${result.note} (${result.variants} biến thể)` : result.note,
      };
    });

  await writeText(EXECUTION_LOG, toCsv(EXEC_HEADERS, rows), 'utf8');

  // Ghi lại trạng thái test case
  const statusById = new Map(rows.map((r) => [r.TC_ID, r.Result]));
  for (const file of TESTCASE_FILES) {
    const filePath = path.join(DOCS_DIR, 'testcases', file);
    const raw = await readText(filePath).catch(() => '');
    if (!raw) continue;
    const { records } = parseCsv(raw);
    for (const record of records) {
      const status = statusById.get(record.TC_ID);
      if (status) record.Status = status;
    }
    await writeText(filePath, toCsv(TESTCASE_HEADERS, records), 'utf8');
  }

  const passCount = rows.filter((r) => r.Result === 'Pass').length;
  const failCount = rows.filter((r) => r.Result === 'Fail').length;
  log(`Đã ghi ${EXECUTION_LOG}: ${rows.length} dòng (Pass ${passCount}, Fail ${failCount})`);
  log(`Nguồn: Playwright ${playwrightCount} test, Newman ${newmanCount} request`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
