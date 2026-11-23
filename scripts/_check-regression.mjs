import fs from 'node:fs';

/**
 * Đối chiếu kết quả regression với `docs/defects/defects.csv`.
 *
 * Mục tiêu: bảo đảm **mọi** ca Fail đều có defect trỏ về (EC-3),
 * và ca nào Fail mà chưa có defect thì phải báo, không bỏ sót.
 */

function tachCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const t = (line) => {
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
  const header = t(lines[0]);
  return lines.slice(1).filter((l) => l.trim()).map((l) => {
    const v = t(l);
    return Object.fromEntries(header.map((h, i) => [h, v[i] ?? '']));
  });
}

// --- Đọc kết quả regression từ playwright-report.json
const report = JSON.parse(fs.readFileSync('reports/raw/playwright-report.json', 'utf8'));
function collectSpecs(suites, out = []) {
  for (const s of suites ?? []) {
    for (const sp of s.specs ?? []) out.push(sp);
    collectSpecs(s.suites, out);
  }
  return out;
}
const specs = collectSpecs(report.suites);

const ketQua = specs.map((sp) => ({
  tcId: (sp.title.match(/TC-[A-Z0-9]+(?:-[A-Z0-9]+)*/) ?? [''])[0],
  title: sp.title,
  ok: sp.ok,
  project: sp.fileName ?? '',
}));

const failed = ketQua.filter((k) => !k.ok);
const passed = ketQua.filter((k) => k.ok);

console.log(`=== REGRESSION ===`);
console.log(`Tổng: ${ketQua.length} | Pass: ${passed.length} | Fail: ${failed.length}`);
console.log(`Skip: ${report.stats?.expected ?? 0}`);

// --- Defects
const defects = tachCsv(fs.readFileSync('docs/defects/defects.csv', 'utf8'));
function defectIdsFor(tcId) {
  return defects
    .filter((d) => String(d.Test_Case_ID ?? '').split(/[;\s]+/).includes(tcId))
    .map((d) => `${d.DEF_ID}(${d.Severity}/${d.Status})`);
}

console.log(`\n=== ĐỐI CHIẾU FAIL ↔ DEFECT (${failed.length} ca fail) ===`);
const thieu = [];
for (const f of failed) {
  const ds = defectIdsFor(f.tcId);
  if (!ds.length) thieu.push(f);
  console.log(`${ds.length ? '✔' : '✘'} ${f.tcId} → ${ds.length ? ds.join(', ') : 'CHƯA CÓ DEFECT'}`);
}
console.log(`\nFail chưa có defect: ${thieu.length}`);
for (const t of thieu) console.log(`  - ${t.tcId}: ${t.title}`);

// --- Ngược lại: defect nào mà test case đã Pass
console.log(`\n=== DEFECT CÓ LIÊN KẾT TỚI CA ĐÃ PASS (cần kiểm tra lại) ===`);
const passedIds = new Set(passed.map((p) => p.tcId));
for (const d of defects) {
  const ids = String(d.Test_Case_ID ?? '').split(/[;\s]+/).filter(Boolean);
  const allPass = ids.length > 0 && ids.every((id) => passedIds.has(id));
  if (allPass) console.log(`  ${d.DEF_ID} [${d.Status}] → ${ids.join(', ')} đều Pass trong regression`);
}

// --- Tổng hợp trạng thái defect
console.log(`\n=== TỔNG HỢP DEFECT (${defects.length}) ===`);
const theoStatus = {};
for (const d of defects) theoStatus[d.Status] = (theoStatus[d.Status] ?? 0) + 1;
console.log('Theo Status:', JSON.stringify(theoStatus));
const theoSev = {};
for (const d of defects) theoSev[d.Severity] = (theoSev[d.Severity] ?? 0) + 1;
console.log('Theo Severity:', JSON.stringify(theoSev));
console.log('\nCritical/High đang mở:');
for (const d of defects.filter((x) => (x.Severity === 'Critical' || x.Severity === 'High') && x.Status === 'Open')) {
  console.log(`  ${d.DEF_ID} [${x(d)}] ${d.Title}`);
}
function x(d) { return d.Status; }
