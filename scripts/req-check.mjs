// Gate — kiểm tra máy: requirements.csv khớp SRS-01 đích và mọi yêu cầu đều có tiêu chí chấp nhận đo được
// Chạy: node scripts/req-check.mjs
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.join(process.cwd(), 'docs');
const srsPath = path.join(DOCS, 'source', 'Đặc tả Yêu cầu Phần Mềm (SRS).md');
const csvPath = path.join(DOCS, 'requirements.csv');

const srs = fs.readFileSync(srsPath, 'utf8');
const csvRaw = fs.readFileSync(csvPath, 'utf8');

const problems = [];

function splitCsvLine(line) {
  const cells = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      cells.push(field.trim());
      field = '';
    } else field += ch;
  }
  cells.push(field.trim());
  return cells;
}

const lines = csvRaw.trim().split(/\r?\n/);
const header = splitCsvLine(lines[0]);
const rows = lines.slice(1).map((line) => Object.fromEntries(header.map((h, i) => [h, splitCsvLine(line)[i]])));

const requiredHeader = ['id', 'type', 'module', 'priority', 'systems', 'title', 'acceptance_criteria', 'uc_refs', 'test_owner'];
for (const col of requiredHeader) {
  if (!header.includes(col)) problems.push(`requirements.csv thiếu cột bắt buộc: ${col}`);
}
if (rows.length === 0) problems.push('requirements.csv rỗng');

// ID trùng
const ids = rows.map((r) => r.id);
const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (dupes.length > 0) problems.push(`ID trùng trong requirements.csv: ${dupes.join(', ')}`);

// Khớp với SRS
const srsIds = [...srs.matchAll(/^\|\s*((?:FR-M\d-\d+)|(?:NFR-\d+))\s*\|/gm)].map((m) => m[1]);
const srsSet = new Set(srsIds);
const csvNotInSrs = ids.filter((id) => !srsSet.has(id));
const srsNotInCsv = [...srsSet].filter((id) => !ids.includes(id));
if (csvNotInSrs.length > 0) problems.push(`ID trong requirements.csv không có trong SRS: ${csvNotInSrs.join(', ')}`);
if (srsNotInCsv.length > 0) problems.push(`ID trong SRS không có trong requirements.csv: ${srsNotInCsv.join(', ')}`);

// Ưu tiên khớp SRS
const priorityMap = {};
for (const line of srs.split(/\r?\n/)) {
  const m = line.match(/^\|\s*((?:FR-M\d-\d+)|(?:NFR-\d+))\s*\|[^|]*\|[^|]*\|\s*(Must|Should|Could)\s*\|/);
  if (m) priorityMap[m[1]] = m[2];
}
for (const row of rows) {
  const srsPriority = priorityMap[row.id];
  if (!srsPriority) {
    problems.push(`Không đọc được ưu tiên của ${row.id} trong SRS`);
  } else if (srsPriority !== row.priority) {
    problems.push(`Ưu tiên không khớp: ${row.id} — CSV=${row.priority}, SRS=${srsPriority}`);
  }
}

// Tiêu chí chấp nhận phải đo được
const vagueWords = ['nhanh chóng', 'thân thiện', 'dễ dùng', 'gọn gàng', 'hợp lý', 'thích hợp', 'khoảng thời gian'];
const measurableHints = [
  /\d/, // có con số
  /HTTP\s*\d{3}/, // có mã lỗi
  /BR-\d\d/, // tham chiếu quy tắc nghiệp vụ
  /ADR-\d\d/, // tham chiếu quyết định
  /§\d/, // tham chiếu mục tài liệu
  /max\(/, // công thức
  /₫|kg|lbs|px|giây/i, // đơn vị đo
  /mọi |mỗi |tất cả|không |0 |duy nhất|đủ |≥|≤|=|trong khi|khác/i, // định lượng tương đối kiểm chứng được
];

for (const row of rows) {
  const acceptance = row.acceptance_criteria ?? '';
  if (!acceptance) {
    problems.push(`${row.id}: thiếu tiêu chí chấp nhận`);
    continue;
  }
  const lower = acceptance.toLowerCase();
  for (const word of vagueWords) {
    if (lower.includes(word)) problems.push(`${row.id}: tiêu chí chấp nhận còn từ mơ hồ "${word}" mà thiếu con số`);
  }
  if (!measurableHints.some((re) => re.test(acceptance))) {
    problems.push(`${row.id}: tiêu chí chấp nhận không có con số, mã lỗi hay tham chiếu đo được`);
  }
  if (!row.test_owner) problems.push(`${row.id}: chưa có test owner`);
}

// Mọi hệ thống trong SRS phải khớp
const systemsMap = {};
for (const line of srs.split(/\r?\n/)) {
  const m = line.match(/^\|\s*((?:FR-M\d-\d+)|(?:NFR-\d+))\s*\|[^|]*\|\s*([^|]*?)\s*\|\s*(?:Must|Should|Could)\s*\|/);
  if (m) systemsMap[m[1]] = m[2];
}
for (const row of rows) {
  const srsSystems = systemsMap[row.id];
  if (srsSystems && srsSystems !== row.systems) {
    problems.push(`Danh sách hệ thống không khớp: ${row.id} — CSV=${row.systems}, SRS=${srsSystems}`);
  }
}

// [Cần chốt] chưa xử lý trong toàn bộ SRS
const unresolved = [...srs.matchAll(/\[Cần chốt\]/g)];
if (unresolved.length > 0) {
  problems.push(`Còn ${unresolved.length} mục [Cần chốt] chưa được xử lý trong SRS`);
}

const frRows = rows.filter((r) => r.type === 'FR');
const nfrRows = rows.filter((r) => r.type === 'NFR');

const out = [];
out.push('# Kết quả Gate — kiểm tra requirements.csv và tiêu chí chấp nhận của SRS-01');
out.push('');
out.push('| Chỉ số | Giá trị |');
out.push('| --- | --- |');
out.push(`| Số dòng requirements.csv (không tính header) | ${rows.length} |`);
out.push(`| Số FR | ${frRows.length} |`);
out.push(`| Số NFR | ${nfrRows.length} |`);
out.push(`| ID trùng | ${dupes.length} |`);
out.push(`| ID trong CSV không có trong SRS | ${csvNotInSrs.length} |`);
out.push(`| ID trong SRS không có trong CSV | ${srsNotInCsv.length} |`);
out.push(`| Số vi phạm | ${problems.length} |`);
out.push('');
out.push('## Vi phạm');
out.push('');
if (problems.length === 0) {
  out.push('Không có.');
} else {
  for (const p of problems) out.push(`- ${p}`);
}
out.push('');

const outDir = path.join(process.cwd(), 'reports', 'raw');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'req-check.md'), out.join('\n'), 'utf8');
console.log(out.join('\n'));

if (problems.length > 0) process.exitCode = 1;
