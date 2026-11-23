import path from 'node:path';
import {
  DOCS_DIR,
  REPORTS_DIR,
  listFiles,
  log,
  parseCsv,
  readText,
  toCsv,
  writeText,
} from './lib/common.mjs';

/**
 * Ghi kết quả thực thi của một test case thủ công.
 *
 * Cập nhật hai nơi:
 *  1. `docs/testcases/*.csv` — cột `Status`.
 *  2. `reports/execution-log.csv` — dòng nhật ký có `Executed_By`, `Note`, `Defect_ID`.
 *
 * Cả hai file đều dùng tên cột đúng như trong file: `TC_ID`, `Status`,
 * `Executed_By`... Việc ghi tay trực tiếp vào CSV bằng tay bị cấm trong
 * `docs/ASSIGNMENT.md` §5.1 — script này là đường ghi chính thức.
 *
 * Ví dụ:
 *   node scripts/tc-record.mjs --tc TC-T1-M2-003 --result Pass --by "Tài" --note "..."
 *   node scripts/tc-record.mjs --tc TC-T2-M4-002 --result Fail --by "Ngân" --defect DEF-022
 */

const testcasesDir = path.join(DOCS_DIR, 'testcases');
const executionLogPath = path.join(REPORTS_DIR, 'execution-log.csv');

const EXECUTION_HEADERS = [
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

const RESULT_MAP = {
  pass: 'Pass',
  fail: 'Fail',
  blocked: 'Blocked',
};

function parseArgs(argv) {
  const args = { tcId: '', result: '', by: '', defect: '', note: '' };
  const FLAGS = { '--tc': 'tcId', '--result': 'result', '--by': 'by', '--defect': 'defect', '--note': 'note' };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (FLAGS[arg]) {
      args[FLAGS[arg]] = argv[i + 1] ?? '';
      i += 1;
    } else if (!arg.startsWith('--') && !args.tcId) {
      // Dạng vị trí: `tc-record.mjs TC-T1-M2-003 Pass`
      args.tcId = arg;
    } else if (!arg.startsWith('--') && !args.result) {
      args.result = arg;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.tcId) {
    console.error('Thiếu --tc <TC-ID>. Ví dụ: node scripts/tc-record.mjs --tc TC-T1-M2-003 --result Pass --by Tài');
    process.exitCode = 1;
    return;
  }

  const resultKey = (args.result ?? '').trim().toLowerCase();
  if (!RESULT_MAP[resultKey]) {
    console.error(`--result phải là một trong: Pass | Fail | Blocked (nhận ${args.result || '(rỗng)'}).`);
    process.exitCode = 1;
    return;
  }
  const status = RESULT_MAP[resultKey];

  if (!args.by) {
    console.error('Thiếu --by <tên người chạy>. Bắt buộc.');
    process.exitCode = 1;
    return;
  }
  if (status === 'Fail' && !args.defect) {
    console.error('Kết quả Fail bắt buộc có --defect DEF-nnn.');
    process.exitCode = 1;
    return;
  }

  // --- 1. Cập nhật cột Status trong docs/testcases/*.csv ---
  const files = await listFiles(testcasesDir, '.csv');
  let found = null;

  for (const file of files) {
    const name = path.basename(file);
    if (name.startsWith('_')) continue;

    const { headers, records } = parseCsv(await readText(file));
    const record = records.find((r) => r.TC_ID === args.tcId);
    if (!record) continue;

    record.Status = status;
    await writeText(file, toCsv(headers, records));
    found = { name, record };
    break;
  }

  if (!found) {
    console.error(`Không tìm thấy test case ${args.tcId} trong ${path.relative(process.cwd(), testcasesDir)}.`);
    process.exitCode = 1;
    return;
  }

  // --- 2. Ghi dòng vào reports/execution-log.csv ---
  const existingRaw = await readText(executionLogPath).catch(() => '');
  const existing = existingRaw ? parseCsv(existingRaw) : { headers: EXECUTION_HEADERS, records: [] };
  const headers = existing.headers.length ? existing.headers : EXECUTION_HEADERS;

  const { record: tc } = found;
  const row = {
    TC_ID: tc.TC_ID,
    Requirement_ID: tc.Requirement_ID ?? '',
    System: tc.System ?? '',
    Title: tc.Title ?? '',
    Type: tc.Type ?? 'Manual',
    Owner: tc.Owner ?? '',
    Executed_By: args.by,
    Executed_At: new Date().toISOString().slice(0, 10),
    Result: status,
    Defect_ID: args.defect ?? '',
    Note: args.note ?? '',
  };

  const index = existing.records.findIndex((r) => r.TC_ID === args.tcId);
  if (index >= 0) {
    existing.records[index] = { ...existing.records[index], ...row };
  } else {
    existing.records.push(row);
  }
  existing.records.sort((a, b) => (a.TC_ID ?? '').localeCompare(b.TC_ID ?? ''));

  await writeText(executionLogPath, toCsv(headers, existing.records));
  log(`Đã ghi ${args.tcId} = ${status} (${args.by}) trong ${found.name} và reports/execution-log.csv`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
