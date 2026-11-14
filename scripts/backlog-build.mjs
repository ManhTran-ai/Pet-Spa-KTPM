import { readText, writeText, parseCsv, toCsv, listFiles, log } from './lib/common.mjs';
import path from 'node:path';

const ROOT = process.cwd();
const TC_DIR = path.join(ROOT, 'docs', 'testcases');
const OUT_CSV = path.join(ROOT, 'docs', 'backlog.csv');
const OUT_MD = path.join(ROOT, 'docs', 'backlog.md');

const SYS_NAME = {
  T1: 'Pet NGON (petngon.vn)',
  T2: 'Mật Pet Family (matpet.vn)',
  T3: 'Pretty Paws (groomore.com)',
  ALL: 'Cả 3 hệ thống',
};

async function main() {
  const groups = new Map();
  for (const file of await listFiles(TC_DIR, '.csv')) {
    if (path.basename(file) === 'uat.csv') continue;
    for (const rec of parseCsv(await readText(file)).records) {
      if (!rec.TC_ID) continue;
      const key = `${rec.Requirement_ID}|${rec.System}`;
      if (!groups.has(key)) {
        groups.set(key, { req: rec.Requirement_ID, system: rec.System, type: rec.Type, technique: rec.Technique, owner: rec.Owner, cases: [] });
      }
      const g = groups.get(key);
      g.cases.push(rec.TC_ID);
      g.priority = g.priority && g.priority !== 'Critical' ? (g.priority === 'Critical' ? 'Critical' : g.priority) : rec.Priority;
      if (rec.Priority === 'Critical') g.priority = 'Critical';
    }
  }

  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const list = [...groups.values()].sort((a, b) => {
    const p = (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    if (p !== 0) return p;
    return a.req.localeCompare(b.req);
  });

  const records = list.map((g, i) => ({
    id: `BL-${String(i + 1).padStart(3, '0')}`,
    requirement: g.req,
    system: g.system,
    system_name: SYS_NAME[g.system] ?? g.system,
    priority: g.priority ?? 'Medium',
    technique: g.technique,
    test_type: g.type,
    test_count: String(g.cases.length),
    test_case_ids: g.cases.join('; '),
    owner: g.owner,
    status: 'TODO',
  }));

  await writeText(OUT_CSV, toCsv(['id', 'requirement', 'system', 'system_name', 'priority', 'technique', 'test_type', 'test_count', 'test_case_ids', 'owner', 'status'], records));

  const byPrio = new Map();
  for (const r of records) byPrio.set(r.priority, (byPrio.get(r.priority) ?? 0) + 1);
  const bySys = new Map();
  for (const r of records) bySys.set(r.system, (bySys.get(r.system) ?? 0) + 1);
  const byOwner = new Map();
  for (const r of records) byOwner.set(r.owner, (byOwner.get(r.owner) ?? 0) + 1);

  const md = [];
  md.push('# Backlog công việc kiểm thử (MoSCoW)');
  md.push('');
  md.push('Phiên bản 1.0 · Ngày 2026-11-13 · Người lập: Mạnh (TV1) · Nguồn: SRS-01 v1.0 và bộ test case `docs/testcases/*.csv`');
  md.push('');
  md.push('Bản máy đọc được: `docs/backlog.csv` (' + records.length + ' mục). Quy ước mã: `BL-nnn`.');
  md.push('');
  md.push('> Backlog này thay thế backlog của hệ thống tự xây (đã archive). Mỗi mục là **một nhóm test case cho một yêu cầu trên một hệ thống đích**, quy đổi trực tiếp từ RTM-01.');
  md.push('');
  md.push('## 1. Quy tắc xếp mức');
  md.push('');
  md.push('- **Must**: yêu cầu mức Must trong SRS-01, hoặc test case mức Critical — bắt buộc thực thi, không được cắt.');
  md.push('- **Should**: yêu cầu Should hoặc test case High — cắt được nếu thiếu thời gian, nhưng phải ghi rõ lý do trong báo cáo.');
  md.push('- **Could**: yêu cầu Could hoặc test case Medium/Low — có thể bỏ.');
  md.push('- **Không bao giờ cắt nhóm Must**: vi phạm Exit criteria của Test Plan (100% yêu cầu Must có ít nhất 1 test case đã thực thi).');
  md.push('');
  md.push('## 2. Tổng hợp');
  md.push('');
  md.push('| Mức | Số mục |');
  md.push('|---|---|');
  for (const p of ['Critical', 'High', 'Medium', 'Low']) md.push(`| ${p} | ${byPrio.get(p) ?? 0} |`);
  md.push(`| **Tổng** | **${records.length}** |`);
  md.push('');
  md.push('| Hệ thống | Số mục |');
  md.push('|---|---|');
  for (const [s, c] of bySys) md.push(`| ${s} — ${SYS_NAME[s] ?? s} | ${c} |`);
  md.push('');
  md.push('| Người phụ trách | Số mục |');
  md.push('|---|---|');
  for (const [o, c] of [...byOwner.entries()].sort()) md.push(`| ${o} | ${c} |`);
  md.push('');
  md.push('## 3. Backlog chi tiết');
  md.push('');
  md.push('| Mã | Yêu cầu | Hệ thống | Mức | Kỹ thuật | Loại | SL | Người phụ trách |');
  md.push('|---|---|---|---|---|---|---|---|');
  for (const r of records) {
    md.push(`| ${r.id} | ${r.requirement} | ${r.system} | ${r.priority} | ${r.technique} | ${r.test_type} | ${r.test_count} | ${r.owner} |`);
  }
  md.push('');
  md.push('## 4. Thứ tự thực hiện');
  md.push('');
  md.push('- **Ngày 6–8:** viết test case cho nhóm Must và Critical theo bảng chi tiết.');
  md.push('- **Ngày 9:** chuẩn bị môi trường và script smoke, xác nhận bộ test case chạy được.');
  md.push('- **Ngày 10:** kiểm thử tích hợp (quan sát hợp đồng dữ liệu giao diện ↔ API).');
  md.push('- **Ngày 11:** system test vòng 1, ưu tiên toàn bộ nhóm Critical.');
  md.push('- **Ngày 12:** re-test và nhóm NFR.');
  md.push('- **Ngày 13:** regression và UAT.');
  md.push('');
  md.push('## 5. Cắt phạm vi');
  md.push('');
  md.push('Thứ tự cắt đề xuất khi thiếu thời gian: nhóm Medium trước, sau đó nhóm Low. Không cắt nhóm Critical. Mọi mục bị cắt phải được liệt kê trong Final Test Report kèm lý do.');
  md.push('');
  await writeText(OUT_MD, md.join('\n'));
  log(`backlog: ${records.length} mục`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
