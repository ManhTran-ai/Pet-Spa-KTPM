import { readText, writeText, listFiles, log, fail } from './lib/common.mjs';
import path from 'node:path';

const ROOT = process.cwd();
const SRS_PATH = path.join(ROOT, 'docs', 'source', 'Đặc tả Yêu cầu Phần Mềm (SRS).md');
const TC_DIR = path.join(ROOT, 'docs', 'testcases');
const OUT_CSV = path.join(ROOT, 'docs', 'rtm.csv');
const OUT_MD = path.join(ROOT, 'docs', 'rtm.md');
const OUT_SOURCE = path.join(ROOT, 'docs', 'source', 'Ma trận Truy xuất Yêu cầu (RTM).md');

async function main() {
  const srs = await readText(SRS_PATH);
  const reqRows = [];
  const reqRe = /^\|\s*((?:FR-M\d-\d+)|(?:NFR-\d+))\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm;
  let match;
  while ((match = reqRe.exec(srs)) !== null) {
    reqRows.push({
      id: match[1].trim(),
      title: match[2].trim(),
      systems: match[3].trim(),
      priority: match[4].trim(),
      criteria: match[5].trim(),
    });
  }

  const tcFiles = await listFiles(TC_DIR, '.csv');
  const tcs = [];
  for (const file of tcFiles) {
    if (path.basename(file) === 'uat.csv') continue;
    const { parseCsv } = await import('./lib/common.mjs');
    const { records } = parseCsv(await readText(file));
    for (const r of records) {
      if (!r.TC_ID) continue;
      tcs.push({ ...r, sourceFile: path.basename(file) });
    }
  }

  const byReq = new Map();
  for (const tc of tcs) {
    if (!byReq.has(tc.Requirement_ID)) byReq.set(tc.Requirement_ID, []);
    byReq.get(tc.Requirement_ID).push(tc);
  }

  const rows = [];
  const uncovered = [];
  for (const req of reqRows) {
    const list = byReq.get(req.id) ?? [];
    if (list.length === 0) uncovered.push(req.id);
    rows.push({
      Requirement_ID: req.id,
      Requirement: req.title,
      System: req.systems,
      Priority: req.priority,
      Module: req.id.startsWith('NFR') ? 'NFR' : req.id.split('-')[1],
      Test_Case_IDs: list.map((t) => t.TC_ID).join('; '),
      Test_Count: String(list.length),
      Coverage: list.length > 0 ? 'Covered' : 'NOT COVERED',
      Techniques: [...new Set(list.map((t) => t.Technique))].join(', '),
      Owners: [...new Set(list.map((t) => t.Owner))].join(', '),
    });
  }

  const unknown = [...byReq.keys()].filter((id) => !reqRows.some((r) => r.id === id));
  const dupTcs = tcs.map((t) => t.TC_ID).filter((id, i, arr) => arr.indexOf(id) !== i);

  const headers = ['Requirement_ID', 'Requirement', 'System', 'Priority', 'Module', 'Test_Case_IDs', 'Test_Count', 'Coverage', 'Techniques', 'Owners'];
  const { toCsv, parseCsv } = await import('./lib/common.mjs');
  await writeText(OUT_CSV, toCsv(headers, rows));

  const total = reqRows.length;
  const covered = total - uncovered.length;
  const critReqs = reqRows.filter((r) => r.priority === 'Must');
  const critCovered = critReqs.filter((r) => (byReq.get(r.id) ?? []).length > 0).length;

  const md = [];
  md.push('# Ma trận Truy xuất Yêu cầu (RTM)');
  md.push('');
  md.push('Mã tài liệu: RTM-01 · Phiên bản 1.0 · Ngày 8, sau Technical Review thiết kế test · Người phụ trách: Mạnh (Test Lead)');
  md.push('');
  md.push('Đầu vào: SRS-01 (`docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md`) và Test Case Specification (`docs/testcases/*.csv`)');
  md.push('');
  md.push('> Bản này thay thế RTM v0.1 của hệ thống do nhóm tự xây (đã archive). Mỗi yêu cầu trong SRS đích đều được truy xuất tới ít nhất một test case; nguyên tắc truy xuất hai chiều (hai chiều đầy đủ) được kiểm tra tự động bằng `scripts/rtm-check.mjs`.');
  md.push('');
  md.push('## 1. Tổng quan độ phủ');
  md.push('');
  md.push('| Chỉ số | Giá trị |');
  md.push('|---|---|');
  md.push(`| Tổng số yêu cầu trong SRS-01 | ${total} |`);
  md.push(`| Yêu cầu có ít nhất 1 test case | ${covered} (${((covered / total) * 100).toFixed(1)}%) |`);
  md.push(`| Yêu cầu Must có ít nhất 1 test case | ${critCovered}/${critReqs.length} (${((critCovered / critReqs.length) * 100).toFixed(1)}%) |`);
  md.push(`| Tổng số test case | ${tcs.length} |`);
  md.push(`| Yêu cầu chưa được phủ | ${uncovered.length === 0 ? '0' : uncovered.join(', ')} |`);
  md.push(`| Test case truy xuất tới yêu cầu không tồn tại trong SRS | ${unknown.length === 0 ? '0' : unknown.join(', ')} |`);
  md.push(`| Test case ID bị trùng | ${dupTcs.length === 0 ? '0' : [...new Set(dupTcs)].join(', ')} |`);
  md.push('');
  md.push('## 2. Ma trận truy xuất chi tiết');
  md.push('');
  md.push('| Yêu cầu | Nội dung | Hệ thống | Ưu tiên | Module | Test case | SL | Kỹ thuật | Phụ trách |');
  md.push('|---|---|---|---|---|---|---|---|---|');
  for (const row of rows) {
    md.push(`| ${row.Requirement_ID} | ${row.Requirement} | ${row.System} | ${row.Priority} | ${row.Module} | ${row.Test_Case_IDs || '—'} | ${row.Test_Count} | ${row.Techniques || '—'} | ${row.Owners || '—'} |`);
  }
  md.push('');
  md.push('## 3. Độ phủ theo hệ thống đích');
  md.push('');
  md.push('| Hệ thống | Số yêu cầu áp dụng | Số yêu cầu đã phủ | Độ phủ | Số test case |');
  md.push('|---|---|---|---|---|');
  for (const sys of ['T1', 'T2', 'T3']) {
    const applicable = reqRows.filter((r) => r.systems.includes(sys));
    const cov = applicable.filter((r) => (byReq.get(r.id) ?? []).some((t) => t.System === sys || t.System === 'ALL'));
    const cnt = tcs.filter((t) => t.System === sys).length;
    md.push(`| ${sys} | ${applicable.length} | ${cov.length} | ${((cov.length / applicable.length) * 100).toFixed(1)}% | ${cnt} |`);
  }
  md.push('');
  md.push('## 4. Độ phủ theo kỹ thuật thiết kế test');
  md.push('');
  md.push('| Kỹ thuật | Số test case |');
  md.push('|---|---|');
  const techCount = new Map();
  for (const t of tcs) techCount.set(t.Technique, (techCount.get(t.Technique) ?? 0) + 1);
  for (const [tech, count] of [...techCount.entries()].sort((a, b) => b[1] - a[1])) {
    md.push(`| ${tech} | ${count} |`);
  }
  md.push('');
  md.push('## 5. Độ phủ theo mức ưu tiên');
  md.push('');
  md.push('| Ưu tiên | Số test case |');
  md.push('|---|---|');
  const prioCount = new Map();
  for (const t of tcs) prioCount.set(t.Priority, (prioCount.get(t.Priority) ?? 0) + 1);
  for (const p of ['Critical', 'High', 'Medium', 'Low']) {
    md.push(`| ${p} | ${prioCount.get(p) ?? 0} |`);
  }
  md.push('');
  md.push('## 6. Use case kiểm thử chấp nhận (UAT)');
  md.push('');
  md.push('| UC | Tên | Hệ thống | Kết quả mong đợi | Người tham gia | Ưu tiên |');
  md.push('|---|---|---|---|---|---|');
  const uat = parseCsv(await readText(path.join(TC_DIR, 'uat.csv'))).records;
  for (const u of uat) {
    md.push(`| ${u.UC_ID} | ${u.Title} | ${u.System} | ${u.Expected_Result} | ${u.Participants} | ${u.Priority} |`);
  }
  md.push('');
  md.push('## 7. Quy tắc bảo trì');
  md.push('');
  md.push('1. Mỗi yêu cầu trong SRS-01 phải có ít nhất một test case trước khi vào kiểm thử hệ thống (Entry criteria giai đoạn 2).');
  md.push('2. Mỗi test case phải truy xuất về đúng một yêu cầu; test case không gắn yêu cầu nào bị loại khỏi RTM và không được thực thi.');
  md.push('3. Test case bổ sung phải cập nhật đồng thời file CSV trong `docs/testcases/` và bảng mục 2 của RTM này.');
  md.push('4. Thay đổi SRS phải kích hoạt kiểm tra truy xuất hai chiều trước khi baseline lại phiên bản RTM.');
  md.push('');

  const content = md.join('\n');
  await writeText(OUT_MD, content);
  await writeText(OUT_SOURCE, content);

  log(`RTM: ${total} yêu cầu, ${covered} được phủ, ${tcs.length} test case`);
  if (uncovered.length > 0) fail(`Yêu cầu chưa phủ: ${uncovered.join(', ')}`);
  if (unknown.length > 0) fail(`Test case tham chiếu yêu cầu không tồn tại: ${unknown.join(', ')}`);
  if (dupTcs.length > 0) fail(`Test case ID trùng: ${[...new Set(dupTcs)].join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
