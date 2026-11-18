import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, ROOT, ensureDir, log, parseCsv, readText, writeText } from './lib/common.mjs';

const submissionDir = path.join(ROOT, 'submission');
const docsDir = path.join(submissionDir, 'docs');
const reportsDir = path.join(submissionDir, 'reports');

const DOC_LIST = [
  'srs.md',
  'test-plan.md',
  'rtm.md',
  'rtm.csv',
  'requirements.csv',
  'backlog.md',
  'backlog.csv',
  'PROGRESS.md',
  'decisions.md',
  'change-requests.md',
  'lessons-learned.md',
  'ASSIGNMENT.md',
];

const REFERENCE_LIST = ['pricing-baseline.md', 'pricing-baseline.csv'];

const REVIEW_LIST = ['inspection-srs.md', 'review-testdesign.md', 'review-testcases.md'];

const REPORT_LIST = [
  'rtm-coverage.md',
  'integration-report.md',
  'nfr-report.md',
  'regression-report.md',
  'uat-report.md',
  'exit-criteria.md',
  'final-test-report.md',
];

async function copyIfExists(source, target) {
  try {
    const content = await readText(source);
    await writeText(target, content);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await ensureDir(docsDir);
  await ensureDir(reportsDir);

  const copied = [];
  const missing = [];

  for (const file of DOC_LIST) {
    const ok = await copyIfExists(path.join(DOCS_DIR, file), path.join(docsDir, file));
    (ok ? copied : missing).push(`docs/${file}`);
  }
  for (const file of REVIEW_LIST) {
    const ok = await copyIfExists(
      path.join(DOCS_DIR, 'reviews', file),
      path.join(docsDir, 'reviews', file),
    );
    (ok ? copied : missing).push(`docs/reviews/${file}`);
  }
  for (const file of REPORT_LIST) {
    const ok = await copyIfExists(path.join(REPORTS_DIR, file), path.join(reportsDir, file));
    (ok ? copied : missing).push(`reports/${file}`);
  }

  for (const file of REFERENCE_LIST) {
    const ok = await copyIfExists(path.join(DOCS_DIR, 'reference', file), path.join(docsDir, 'reference', file));
    (ok ? copied : missing).push(`docs/reference/${file}`);
  }

  for (const file of ['defects.csv', 'README.md']) {
    const ok = await copyIfExists(path.join(DOCS_DIR, 'defects', file), path.join(docsDir, 'defects', file));
    (ok ? copied : missing).push(`docs/defects/${file}`);
  }

  const testcasesDir = path.join(DOCS_DIR, 'testcases');
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(testcasesDir).catch(() => []);
  for (const entry of entries) {
    if (!entry.endsWith('.csv')) {
      continue;
    }
    const ok = await copyIfExists(
      path.join(testcasesDir, entry),
      path.join(docsDir, 'testcases', entry),
    );
    (ok ? copied : missing).push(`docs/testcases/${entry}`);
  }

  const index = [
    '# Hồ sơ nộp',
    '',
    'Được gom bởi `scripts/export-docs.mjs` từ `docs/` và `reports/`.',
    '',
    '## Đã gom',
    '',
    ...copied.map((f) => `- ${f}`),
    '',
    '## Chưa có',
    '',
    ...(missing.length > 0 ? missing.map((f) => `- ${f}`) : ['- (không)']),
    '',
  ].join('\n');

  await writeText(path.join(submissionDir, 'README.md'), index);
  log(`Đã gom ${copied.length} tệp vào ${path.relative(process.cwd(), submissionDir)}`);
  if (missing.length > 0) {
    log(`Chưa có ${missing.length} tệp (xem submission/README.md).`);
  }
  void parseCsv;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
