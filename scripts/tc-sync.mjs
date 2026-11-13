import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, listFiles, log, parseCsv, readText, toCsv, writeText } from './lib/common.mjs';

const testcasesDir = path.join(DOCS_DIR, 'testcases');
const jestJsonPath = path.join(REPORTS_DIR, 'raw', 'jest.json');
const executionLogPath = path.join(REPORTS_DIR, 'execution-log.csv');

const STATUS_HEADERS = [
  'tc_id',
  'status',
  'run_date',
  'build',
  'defect_id',
  'executor',
  'automated_ref',
];

function collectTestIds(assertionResults) {
  const results = [];
  for (const suite of assertionResults ?? []) {
    for (const assertion of suite.assertionResults ?? []) {
      const matched = /\[(TC-[A-Z]{2}-\d{3}(?:#[^\]]+)?)\]/.exec(assertion.fullName ?? '');
      if (matched) {
        results.push({ tcId: matched[1], status: assertion.status });
      }
    }
  }
  return results;
}

async function main() {
  let jestRaw;
  try {
    jestRaw = JSON.parse(await readText(jestJsonPath));
  } catch {
    log(`Không tìm thấy ${path.relative(process.cwd(), jestJsonPath)}. Chạy "npm run test:json" trước.`);
    process.exitCode = 1;
    return;
  }

  const results = collectTestIds(jestRaw.testResults);
  const build = process.env.GIT_COMMIT ?? 'local';
  const runDate = new Date().toISOString().slice(0, 10);

  const byTcId = new Map();
  for (const result of results) {
    const baseId = result.tcId.split('#')[0];
    const previous = byTcId.get(baseId);
    const mapped = result.status === 'passed' ? 'Pass' : result.status === 'failed' ? 'Fail' : 'Blocked';
    if (previous && previous.status === 'Fail') {
      continue;
    }
    byTcId.set(baseId, { status: mapped, defect: previous?.defect ?? '' });
  }

  const files = await listFiles(testcasesDir, '.csv');
  const logRows = [];
  const problems = [];

  for (const file of files) {
    const name = path.basename(file);
    if (name.startsWith('_')) {
      continue;
    }
    const { headers, records } = await parseCsv(await readText(file));
    if (!headers.includes('tc_id') || !headers.includes('status')) {
      problems.push(`${name}: thiếu cột tc_id hoặc status`);
      continue;
    }
    let changed = false;
    for (const record of records) {
      const matched = byTcId.get(record.tc_id);
      if (!matched) {
        if (record.status === 'Designed' && record.execution === 'auto') {
          problems.push(`${name}: test case ${record.tc_id} có execution=auto nhưng không có trong kết quả Jest`);
        }
        continue;
      }
      record.status = matched.status;
      record.run_date = runDate;
      record.build = build;
      changed = true;
      logRows.push({
        tc_id: record.tc_id,
        status: matched.status,
        run_date: runDate,
        build,
        defect_id: matched.defect,
        executor: record.executor || 'tc-sync',
        automated_ref: record.automated_ref || '',
      });
    }
    if (changed) {
      await writeText(file, toCsv(headers, records));
      log(`Đã cập nhật ${name}`);
    }
  }

  if (logRows.length > 0) {
    await writeText(executionLogPath, toCsv(STATUS_HEADERS, logRows));
    log(`Đã ghi ${path.relative(process.cwd(), executionLogPath)} (${logRows.length} dòng)`);
  } else {
    log('Không có test case nào khớp kết quả Jest.');
  }

  for (const problem of problems) {
    console.error(`VI PHẠM: ${problem}`);
  }
  if (problems.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
