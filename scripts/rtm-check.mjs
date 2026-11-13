import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, listFiles, log, parseCsv, readText, writeText } from './lib/common.mjs';

const requirementsPath = path.join(DOCS_DIR, 'requirements.csv');
const testcasesDir = path.join(DOCS_DIR, 'testcases');
const rtmPath = path.join(DOCS_DIR, 'rtm.csv');
const outputPath = path.join(REPORTS_DIR, 'rtm-coverage.md');

const notes = [];

async function loadRequirements() {
  try {
    const { records } = await parseCsv(await readText(requirementsPath));
    return records;
  } catch {
    notes.push('Chưa có `docs/requirements.csv` (tạo ở Ngày 2). Bỏ qua kiểm tra độ phủ yêu cầu.');
    return [];
  }
}

async function loadTestCases() {
  const files = await listFiles(testcasesDir, '.csv');
  const cases = [];
  for (const file of files) {
    if (path.basename(file).startsWith('_')) {
      continue;
    }
    const { records } = await parseCsv(await readText(file));
    for (const record of records) {
      cases.push({ ...record, source: path.basename(file) });
    }
  }
  return cases;
}

async function loadRtm() {
  try {
    const { records } = await parseCsv(await readText(rtmPath));
    return records;
  } catch {
    notes.push('Chưa có `docs/rtm.csv` (dựng ở Ngày 5). Bỏ qua kiểm tra dải mã RTM.');
    return [];
  }
}

async function main() {
  const requirements = await loadRequirements();
  const testCases = await loadTestCases();
  const rtm = await loadRtm();

  const problems = [];

  const requirementIds = new Set(requirements.map((r) => r.id));
  const covered = new Set(testCases.map((tc) => tc.req_id).filter(Boolean));

  const uncovered = [...requirementIds].filter((id) => !covered.has(id));

  const duplicated = testCases
    .map((tc) => tc.tc_id)
    .filter((id, index, all) => id && all.indexOf(id) !== index);

  const missingReq = testCases.filter((tc) => tc.req_id && !requirementIds.has(tc.req_id));

  for (const id of uncovered) {
    problems.push(`Yêu cầu chưa có test case: ${id}`);
  }
  for (const id of [...new Set(duplicated)]) {
    problems.push(`Trùng tc_id: ${id}`);
  }
  for (const tc of missingReq) {
    problems.push(`Test case ${tc.tc_id} tham chiếu req_id không tồn tại: ${tc.req_id}`);
  }

  const lines = [];
  lines.push('# Độ phủ truy vết yêu cầu (RTM coverage)');
  lines.push('');
  lines.push(`Nguồn: \`docs/requirements.csv\`, \`docs/testcases/*.csv\`, \`docs/rtm.csv\``);
  lines.push('');
  lines.push('| Chỉ số | Giá trị |');
  lines.push('| --- | --- |');
  lines.push(`| Tổng yêu cầu | ${requirementIds.size} |`);
  lines.push(`| Yêu cầu có ít nhất 1 test case | ${[...requirementIds].filter((id) => covered.has(id)).length} |`);
  lines.push(`| Tỷ lệ độ phủ yêu cầu | ${requirementIds.size === 0 ? 'chưa có dữ liệu' : `${(((requirementIds.size - uncovered.length) / requirementIds.size) * 100).toFixed(1)}%`} |`);
  lines.push(`| Tổng test case | ${testCases.length} |`);
  lines.push(`| Số dòng RTM | ${rtm.length} |`);
  lines.push('');
  lines.push('## Yêu cầu chưa có test case');
  lines.push('');
  if (uncovered.length === 0) {
    lines.push('Không có.');
  } else {
    for (const id of uncovered) {
      lines.push(`- ${id}`);
    }
  }
  lines.push('');
  lines.push('## Vi phạm phát hiện');
  lines.push('');
  if (problems.length === 0) {
    lines.push('Không có.');
  } else {
    for (const problem of problems) {
      lines.push(`- ${problem}`);
    }
  }
  if (notes.length > 0) {
    lines.push('');
    lines.push('## Ghi chú');
    lines.push('');
    for (const note of notes) {
      lines.push(`- ${note}`);
    }
  }
  lines.push('');

  await writeText(outputPath, lines.join('\n'));
  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
  for (const note of notes) {
    log(`Ghi chú: ${note}`);
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`VI PHẠM: ${problem}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
