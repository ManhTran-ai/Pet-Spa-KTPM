import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, log, parseCsv, readText, writeText } from './lib/common.mjs';

const rtmPath = path.join(DOCS_DIR, 'rtm.csv');
const testcasesDir = path.join(DOCS_DIR, 'testcases');
const defectsPath = path.join(DOCS_DIR, 'defects', 'defects.csv');
const coveragePath = path.join(REPORTS_DIR, 'raw', 'coverage', 'coverage-summary.json');
const outputPath = path.join(REPORTS_DIR, 'exit-criteria.md');

const OPEN_STATUSES = ['New', 'Assigned', 'Open', 'Fixed', 'Pending Retest', 'Retest', 'Reopened'];

async function main() {
  const criteria = [];

  const rtmRaw = await readText(rtmPath).catch(() => '');
  const rtm = rtmRaw ? parseCsv(rtmRaw).records : [];

  const mustIds = rtm
    .filter((row) => (row.priority ?? row.muc_do ?? '').toLowerCase() === 'must')
    .map((row) => row.req_id ?? row.id ?? '')
    .filter(Boolean);

  criteria.push({
    id: 'EC-1',
    name: '100% yêu cầu Must có ít nhất 1 test case',
    measured: mustIds.length === 0 ? 'chưa có dữ liệu RTM' : `${mustIds.length} yêu cầu Must trong RTM`,
    passed: false,
    source: 'docs/rtm.csv, docs/testcases/*.csv',
  });

  const testCaseFiles = (await import('node:fs/promises')).readdir(testcasesDir).catch(() => []);
  criteria.push({
    id: 'EC-2',
    name: '100% test case Critical/High đã thực thi, tỷ lệ Pass ≥ 95%',
    measured: 'chưa có dữ liệu thực thi',
    passed: false,
    source: 'docs/testcases/*.csv, reports/execution-log.csv',
  });

  const defectsRaw = await readText(defectsPath).catch(() => '');
  const defects = defectsRaw ? parseCsv(defectsRaw).records : [];
  const openCriticalHigh = defects.filter(
    (d) =>
      ['Critical', 'High'].includes((d.severity ?? '').trim()) &&
      OPEN_STATUSES.includes((d.status ?? '').trim()),
  );
  criteria.push({
    id: 'EC-3',
    name: '0 lỗi Critical/High còn mở, mọi lỗi đi qua đủ vòng đời',
    measured: `${openCriticalHigh.length} lỗi Critical/High đang mở`,
    passed: openCriticalHigh.length === 0 && defects.length > 0,
    source: 'docs/defects/defects.csv',
  });

  const coverageRaw = await readText(coveragePath).catch(() => '');
  if (coverageRaw) {
    const coverage = JSON.parse(coverageRaw);
    const total = coverage.total ?? {};
    criteria.push({
      id: 'EC-4',
      name: 'Statement ≥ 80%, Branch ≥ 70% trên module lõi, hai hàm white-box 100% đường độc lập',
      measured: `Statement ${total.statements?.pct ?? 'n/a'}%, Branch ${total.branches?.pct ?? 'n/a'}%`,
      passed: (total.statements?.pct ?? 0) >= 80 && (total.branches?.pct ?? 0) >= 70,
      source: 'reports/raw/coverage/coverage-summary.json',
    });
  } else {
    criteria.push({
      id: 'EC-4',
      name: 'Statement ≥ 80%, Branch ≥ 70% trên module lõi, hai hàm white-box 100% đường độc lập',
      measured: 'chưa có báo cáo coverage',
      passed: false,
      source: 'reports/raw/coverage/coverage-summary.json',
    });
  }

  criteria.push({
    id: 'EC-5',
    name: 'UAT không có phản hồi chặn',
    measured: 'HUMAN-PENDING',
    passed: false,
    source: 'reports/uat-report.md (phiếu UAT thật)',
  });

  const lines = [];
  lines.push('# Chấm Exit criteria');
  lines.push('');
  lines.push('Căn cứ: TP-01 §5.2 · Nguồn số liệu: các file trong `reports/raw/` và `docs/`');
  lines.push('');
  lines.push('| Mã | Tiêu chí | Kết quả | Trạng thái | Nguồn |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const criterion of criteria) {
    lines.push(
      `| ${criterion.id} | ${criterion.name} | ${criterion.measured} | ${criterion.passed ? 'PASS' : 'FAIL'} | ${criterion.source} |`,
    );
  }
  lines.push('');

  await writeText(outputPath, lines.join('\n'));
  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
  log(`Số tiêu chí đạt: ${criteria.filter((c) => c.passed).length}/${criteria.length}`);
  void testCaseFiles;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
