import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, listFiles, log, parseCsv, readText, writeText } from './lib/common.mjs';

const requirementsPath = path.join(DOCS_DIR, 'requirements.csv');
const testcasesDir = path.join(DOCS_DIR, 'testcases');
const rtmPath = path.join(DOCS_DIR, 'rtm.csv');
const outputPath = path.join(REPORTS_DIR, 'rtm-coverage.md');

const notes = [];

async function loadRequirements() {
  try {
    const { records } = parseCsv(await readText(requirementsPath));
    return records;
  } catch {
    notes.push('Chưa có `docs/requirements.csv`. Bỏ qua kiểm tra độ phủ yêu cầu.');
    return [];
  }
}

async function loadTestCases() {
  const cases = [];
  for (const file of await listFiles(testcasesDir, '.csv')) {
    if (path.basename(file).startsWith('_')) continue;
    const { records } = parseCsv(await readText(file));
    for (const record of records) {
      if (!record.TC_ID) continue;
      cases.push({ ...record, source: path.basename(file) });
    }
  }
  return cases;
}

async function loadRtm() {
  try {
    const { records } = parseCsv(await readText(rtmPath));
    return records;
  } catch {
    notes.push('Chưa có `docs/rtm.csv`. Bỏ qua kiểm tra dải mã RTM.');
    return [];
  }
}

async function main() {
  const requirements = await loadRequirements();
  const testCases = await loadTestCases();
  const rtm = await loadRtm();

  const problems = [];

  const requirementIds = new Set(requirements.map((r) => r.id));
  const covered = new Set(testCases.map((tc) => tc.Requirement_ID).filter(Boolean));

  const uncovered = [...requirementIds].filter((id) => !covered.has(id));

  const duplicated = testCases
    .map((tc) => tc.TC_ID)
    .filter((id, index, all) => id && all.indexOf(id) !== index);

  const missingReq = testCases.filter((tc) => tc.Requirement_ID && !requirementIds.has(tc.Requirement_ID));

  for (const id of uncovered) problems.push(`Yêu cầu chưa có test case: ${id}`);
  for (const id of [...new Set(duplicated)]) problems.push(`Trùng TC_ID: ${id}`);
  for (const tc of missingReq) problems.push(`Test case ${tc.TC_ID} tham chiếu yêu cầu không tồn tại: ${tc.Requirement_ID}`);

  const rtmIds = new Set(rtm.map((row) => row.Requirement_ID));
  for (const id of uncovered) {
    if (!rtmIds.has(id)) problems.push(`Yêu cầu ${id} chưa có dòng trong docs/rtm.csv`);
  }
  const rtmWithoutReq = [...rtmIds].filter((id) => !requirementIds.has(id));
  for (const id of rtmWithoutReq) problems.push(`Dòng RTM ${id} không có trong docs/requirements.csv`);

  const mustIds = requirements.filter((r) => r.priority === 'Must').map((r) => r.id);
  const mustCovered = mustIds.filter((id) => covered.has(id));

  const lines = [];
  lines.push('# Độ phủ truy xét yêu cầu (RTM coverage)');
  lines.push('');
  lines.push('Nguồn: `docs/requirements.csv`, `docs/testcases/*.csv`, `docs/rtm.csv`');
  lines.push('');
  lines.push('| Chỉ số | Giá trị |');
  lines.push('| --- | --- |');
  lines.push(`| Tổng yêu cầu | ${requirementIds.size} |`);
  lines.push(`| Yêu cầu có ít nhất 1 test case | ${[...requirementIds].filter((id) => covered.has(id)).length} |`);
  lines.push(`| Tỷ lệ độ phủ yêu cầu | ${requirementIds.size === 0 ? 'chưa có dữ liệu' : `${(((requirementIds.size - uncovered.length) / requirementIds.size) * 100).toFixed(1)}%`} |`);
  lines.push(`| Yêu cầu Must đã phủ | ${mustCovered.length}/${mustIds.length} |`);
  lines.push(`| Tổng test case | ${testCases.length} |`);
  lines.push(`| Số dòng RTM | ${rtm.length} |`);
  lines.push('');
  lines.push('## Yêu cầu chưa có test case');
  lines.push('');
  if (uncovered.length === 0) {
    lines.push('Không có.');
  } else {
    for (const id of uncovered) lines.push(`- ${id}`);
  }
  lines.push('');
  lines.push('## Vi phạm phát hiện');
  lines.push('');
  if (problems.length === 0) {
    lines.push('Không có.');
  } else {
    for (const problem of problems) lines.push(`- ${problem}`);
  }
  if (notes.length > 0) {
    lines.push('');
    lines.push('## Ghi chú');
    lines.push('');
    for (const note of notes) lines.push(`- ${note}`);
  }
  lines.push('');

  await writeText(outputPath, lines.join('\n'));
  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
  for (const note of notes) log(`Ghi chú: ${note}`);

  if (problems.length > 0) {
    for (const problem of problems) console.error(`VI PHẠM: ${problem}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
