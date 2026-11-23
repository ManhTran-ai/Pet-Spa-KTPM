import fs from 'node:fs';
import path from 'node:path';

/**
 * Khôi phục `reports/execution-log.csv` từ trạng thái trong `docs/testcases/*.csv`.
 *
 * Vì sao cần script này:
 * `exec:sync` ghi đè `execution-log.csv` bằng kết quả của lần chạy Playwright
 * gần nhất. Khi lần chạy đó chỉ phủ một phần test case, các ca đã chạy tay
 * (ghi bằng `tc:record`, `Executed_By` không chứa "script") vẫn được giữ —
 * **nhưng chỉ khi chúng còn nằm trong log**. Sau nhiều lần chạy, log bị thu
 * hẹp lại còn vài dòng.
 *
 * `docs/testcases/*.csv` mới là nguồn sự thật về **trạng thái cuối cùng**
 * của từng ca. Script này dựng lại log đầy đủ từ đó, giữ nguyên:
 *   - `Status` trong test case = nguồn sự thật
 *   - `Defect_ID` tra từ `docs/defects/defects.csv`
 *   - `Executed_By` / `Executed_At` / `Note` lấy từ log hiện có nếu còn
 */

const DOCS = 'docs';
const REPORTS = 'reports';

const EXEC_HEADERS = [
  'TC_ID', 'Requirement_ID', 'System', 'Title', 'Type', 'Owner',
  'Executed_By', 'Executed_At', 'Result', 'Defect_ID', 'Note',
];

function tachCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const tach = (line) => {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      if (inQ) {
        if (c === '"') {
          if (line[i + 1] === '"') { cur += '"'; i += 1; } else inQ = false;
        } else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out;
  };
  const header = tach(lines[0]);
  const records = lines.slice(1).filter((l) => l.trim()).map((l) => {
    const v = tach(l);
    return Object.fromEntries(header.map((h, i) => [h, v[i] ?? '']));
  });
  return { header, records };
}

function toCsv(headers, records) {
  const esc = (v) => {
    const s = v === undefined || v === null ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...records.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n') + '\n';
}

// --- Nguồn sự thật: test cases
const files = ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv'];
const testcases = new Map();
for (const f of files) {
  const p = path.join(DOCS, 'testcases', f);
  if (!fs.existsSync(p)) continue;
  for (const r of tachCsv(fs.readFileSync(p, 'utf8')).records) testcases.set(r.TC_ID, r);
}

// --- Defects
const defectsPath = path.join(DOCS, 'defects', 'defects.csv');
const defects = fs.existsSync(defectsPath)
  ? tachCsv(fs.readFileSync(defectsPath, 'utf8')).records
  : [];

function defectIdsFor(tcId) {
  return defects
    .filter((d) => String(d.Test_Case_ID ?? '').split(/[;\s]+/).includes(tcId))
    .map((d) => d.DEF_ID)
    .join('; ');
}

// --- Log hiện có (giữ metadata)
const logPath = path.join(REPORTS, 'execution-log.csv');
const existing = new Map();
if (fs.existsSync(logPath)) {
  for (const r of tachCsv(fs.readFileSync(logPath, 'utf8')).records) existing.set(r.TC_ID, r);
}

// --- Dựng lại
const rows = [];
let dung = 0;
let bo = 0;

for (const [tcId, tc] of testcases) {
  const status = tc.Status ?? '';
  if (!status || status === 'Chưa thực thi') continue;

  const old = existing.get(tcId);
  const isScript = old && String(old.Executed_By ?? '').includes('script');

  // Ưu tiên metadata thủ công; nếu chỉ có dữ liệu script thì vẫn dùng được.
  const executedBy = old && old.Executed_By ? old.Executed_By : (tc.Owner ?? '');
  const executedAt = old && old.Executed_At ? old.Executed_At : new Date().toISOString().slice(0, 10);
  const note = old && old.Note ? old.Note : '';

  if (old) dung += 1;
  else bo += 1;

  rows.push({
    TC_ID: tcId,
    Requirement_ID: tc.Requirement_ID ?? '',
    System: tc.System ?? '',
    Title: tc.Title ?? '',
    Type: tc.Type ?? 'Manual',
    Owner: tc.Owner ?? '',
    Executed_By: executedBy,
    Executed_At: executedAt,
    Result: status,
    Defect_ID: status === 'Fail' ? defectIdsFor(tcId) : (old?.Defect_ID ?? ''),
    Note: note,
  });
  void isScript;
}

rows.sort((a, b) => a.TC_ID.localeCompare(b.TC_ID));
fs.writeFileSync(logPath, toCsv(EXEC_HEADERS, rows), 'utf8');

const pass = rows.filter((r) => r.Result === 'Pass').length;
const fail = rows.filter((r) => r.Result === 'Fail').length;
console.log(`Đã dựng lại ${logPath}: ${rows.length} dòng (Pass ${pass}, Fail ${fail})`);
console.log(`  - dùng lại metadata có sẵn: ${dung}`);
console.log(`  - dựng mới từ docs/testcases: ${bo}`);
