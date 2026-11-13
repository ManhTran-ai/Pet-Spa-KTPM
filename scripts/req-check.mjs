// Gate Ngày 2 — kiểm tra máy: requirements.csv khớp SRS và tiêu chí chấp nhận đo được
// Chạy: node scripts/req-check.mjs
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.join(process.cwd(), 'docs');
const srs = fs.readFileSync(path.join(DOCS, 'srs.md'), 'utf8');
const csvRaw = fs.readFileSync(path.join(DOCS, 'requirements.csv'), 'utf8');

const problems = [];
const notes = [];

const lines = csvRaw.trim().split(/\r?\n/);
const header = lines[0].split(',');
const rows = lines.slice(1).map((line) => {
  const cells = line.split(',');
  return Object.fromEntries(header.map((h, i) => [h, cells[i]]));
});

// 1. Cấu trúc CSV
const expectedHeader = ['id', 'type', 'module', 'priority', 'title'];
const actualHeader = header.filter((h) => h !== 'uc' && h !== 'code_owner' && h !== 'test_owner');
if (actualHeader.join(',') !== expectedHeader.join(',')) {
  problems.push(`Header requirements.csv phải chứa ${expectedHeader.join(',')} (thêm cột phụ được phép). Thực tế: ${actualHeader.join(',')}`);
}

// 2. Số dòng
if (rows.length !== 46) {
  problems.push(`requirements.csv phải có đúng 46 dòng yêu cầu. Thực tế: ${rows.length}`);
}
const frRows = rows.filter((r) => r.type === 'FR');
const nfrRows = rows.filter((r) => r.type === 'NFR');
if (frRows.length !== 40) problems.push(`Số FR phải là 40. Thực tế: ${frRows.length}`);
if (nfrRows.length !== 6) problems.push(`Số NFR phải là 6. Thực tế: ${nfrRows.length}`);

// 3. ID trùng
const ids = rows.map((r) => r.id);
const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (dupes.length > 0) problems.push(`ID trùng trong requirements.csv: ${dupes.join(', ')}`);

// 4. Khớp với SRS
const srsIds = [...srs.matchAll(/\| (FR-M\d-\d\d|NFR-\d\d) \|/g)].map((m) => m[1]);
const srsSet = new Set(srsIds);
const csvNotInSrs = ids.filter((id) => !srsSet.has(id));
const srsNotInCsv = [...srsSet].filter((id) => !ids.includes(id));
if (csvNotInSrs.length > 0) problems.push(`ID trong requirements.csv không có trong SRS: ${csvNotInSrs.join(', ')}`);
if (srsNotInCsv.length > 0) problems.push(`ID trong SRS không có trong requirements.csv: ${srsNotInCsv.join(', ')}`);

// 5. Ưu tiên khớp SRS (bảng §5)
const priorityMap = {};
for (const line of srs.split(/\r?\n/)) {
  const m = line.match(/^\| (FR-M\d-\d\d|NFR-\d\d) \|[^|]*\| (Must|Should|Could) \|/);
  if (m) priorityMap[m[1]] = m[2];
}
for (const row of rows) {
  if (row.type === 'FR') {
    const srsPriority = priorityMap[row.id];
    if (!srsPriority) {
      problems.push(`Không đọc được ưu tiên của ${row.id} trong bảng §5 của SRS`);
    } else if (srsPriority !== row.priority) {
      problems.push(`Ưu tiên không khớp: ${row.id} — requirements.csv=${row.priority}, SRS=${srsPriority}`);
    }
  }
}

// 6. Mỗi FR trong SRS phải có tiêu chí chấp nhận đo được
const vagueWords = ['nhanh', 'thân thiện', 'phù hợp', 'dễ dùng', 'gọn', 'hợp lý', 'thích hợp', 'đầy đủ', 'khoảng thời gian'];
const measurableHints = [
  /\d/, // có con số
  /HTTP\s*\d{3}/, // có mã lỗi
  /BR-\d\d/, // tham chiếu quy tắc nghiệp vụ
  /ADR-\d\d/, // tham chiếu quyết định
  /SRS\s*§/, // tham chiếu mục tài liệu
  /\b(R\d|GET |POST |PUT |DELETE |PATCH )/, // endpoint hoặc mã quyết định
];

const frTableRows = srs
  .split(/\r?\n/)
  .filter((line) => /^\| FR-M\d-\d\d \|/.test(line))
  // Bảng chi tiết §5.1a/§5.7a có 2 cột nội dung; bảng tổng hợp §5 có 4 cột (ID | Yêu cầu | Ưu tiên | Tiêu chí)
  .filter((line) => {
    const cells = line.split('|').map((c) => c.trim());
    return cells[3] === 'Must' || cells[3] === 'Should' || cells[3] === 'Could';
  });

// FR nào đã có bảng tiêu chí chi tiết (mục 5.1a, 5.7a) thì không yêu cầu lặp lại ở bảng tổng hợp §5
const detailedFrIds = new Set(
  srs
    .split(/\r?\n/)
    .filter((line) => /^\| FR-M\d-\d\d \| \(/.test(line))
    .map((line) => line.match(/^\| (FR-M\d-\d\d) \|/)[1]),
);

for (const line of frTableRows) {
  const id = line.match(/^\| (FR-M\d-\d\d) \|/)[1];
  const cells = line.split('|').map((c) => c.trim());
  const acceptance = cells[4] ?? '';
  const lower = acceptance.toLowerCase();
  for (const word of vagueWords) {
    if (lower.includes(word)) {
      problems.push(`${id}: tiêu chí chấp nhận còn từ mơ hồ "${word}" mà thiếu con số`);
    }
  }
  if (detailedFrIds.has(id)) {
    // đã có tiêu chí chi tiết ở §5.1a/§5.7a — bảng tổng hợp chỉ cần có từ khóa đo được
    if (!measurableHints.some((re) => re.test(acceptance))) {
      problems.push(`${id}: bảng tổng hợp §5 chưa có con số, mã lỗi hay tham chiếu đo được`);
    }
    continue;
  }
  if (!measurableHints.some((re) => re.test(acceptance))) {
    problems.push(`${id}: tiêu chí chấp nhận không có con số, mã lỗi hay tham chiếu đo được`);
  }
}

// 7. NFR trong SRS phải có tiêu chí chi tiết (§9a/§9b)
for (const nfr of ['NFR-01', 'NFR-02', 'NFR-03', 'NFR-04', 'NFR-05', 'NFR-06']) {
  const hasDetail =
    new RegExp(`^\\| ${nfr} \\| \\(\\d\\)`, 'm').test(srs) ||
    new RegExp(`^\\| ${nfr}\\.\\d+ \\|`, 'm').test(srs);
  if (!hasDetail) {
    problems.push(`${nfr}: chưa có tiêu chí chấp nhận chi tiết (mục 9a/9b)`);
  }
}

// 8. [Cần chốt] chưa xử lý — chỉ tính trong phần định nghĩa BR (mục 6), bỏ qua phần mô tả và phụ lục
const brSection = srs.split('## 6. Quy tắc nghiệp vụ')[1]?.split('## 7.')[0] ?? '';
const unresolved = [...brSection.matchAll(/\*\*\\\[Cần chốt\\\]\*\*/g)];
if (unresolved.length > 0) {
  problems.push(`Còn ${unresolved.length} mục [Cần chốt] chưa được xử lý trong §6 (phải trỏ tới ADR-xx)`);
}

// Kết quả
const out = [];
out.push('# Kết quả Gate Ngày 2 — kiểm tra requirements.csv và tiêu chí chấp nhận');
out.push('');
out.push('| Chỉ số | Giá trị |');
out.push('| --- | --- |');
out.push(`| Số dòng requirements.csv (không tính header) | ${rows.length} |`);
out.push(`| Số FR | ${frRows.length} |`);
out.push(`| Số NFR | ${nfrRows.length} |`);
out.push(`| ID trùng | ${dupes.length} |`);
out.push(`| ID trong CSV không có trong SRS | ${csvNotInSrs.length} |`);
out.push(`| ID trong SRS không có trong CSV | ${srsNotInCsv.length} |`);
out.push(`| Số dòng FR trong bảng §5 của SRS đã kiểm tra | ${frTableRows.length} |`);
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
if (notes.length > 0) {
  out.push('## Ghi chú');
  out.push('');
  for (const n of notes) out.push(`- ${n}`);
  out.push('');
}

const outDir = path.join(process.cwd(), 'reports', 'raw');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'day-02-req-check.md'), out.join('\n'), 'utf8');
console.log(out.join('\n'));

if (problems.length > 0) process.exitCode = 1;
