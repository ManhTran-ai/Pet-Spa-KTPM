import fs from 'node:fs';

/**
 * Đóng DEF-023 sau khi xác minh lại (Ngày 13, Tài).
 *
 * Lý do: DEF-023 được Mạnh mở ngày 18/11 dựa trên **wording cũ** của
 * `FR-M4-04` (SRS v1.1): "bước chọn ngày mong muốn" — hiểu là phải có
 * `input[type=date]`.
 *
 * Ngay trong ngày 18/11, Inspection (RV-06) đã **sửa lại** `FR-M4-04` của
 * SRS v1.2 theo quan sát hành vi thật:
 *   "T1: bước 'Lịch hẹn' hiển thị **7 ngày cố định** (từ hôm nay trở đi)
 *    kèm **8 khung giờ** 08:30–17:00; ngày trong quá khứ không chọn được."
 *
 * Xác minh lại ngày 22/11/2026 (`scripts/_probe-t1-date-step.mjs`):
 *   - 7 ngày cố định: 23/11 → 29/11/2026 (bắt đầu từ ngày mai)
 *   - 8 khung giờ: 08:30, 09:30, 10:30, 13:00, 14:00, 15:00, 16:00, 17:00
 *   - `input[type=date]` = 0 (đúng với thiết kế ngày cố định)
 *   → T1 **thoả** tiêu chí chấp nhận hiện hành của FR-M4-04.
 *
 * ⇒ Đóng defect (đã lỗi thời do đặc tả được hiệu chỉnh). Không hạ tiêu chí:
 *   tiêu chí đã được Inspection chấp nhận và đặc tả đã cập nhật.
 */

const duongDan = 'docs/defects/defects.csv';
const lines = fs.readFileSync(duongDan, 'utf8').trim().split(/\r?\n/);
const tenCot = lines[0].split(',');
const idx = lines.findIndex((l) => l.startsWith('DEF-023,'));

function tach(line) {
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
}

const row = tach(lines[idx]);
if (row.length !== tenCot.length) {
  throw new Error(`Số cột không khớp: ${row.length} vs ${tenCot.length}`);
}

const g = Object.fromEntries(tenCot.map((t, i) => [t, row[i]]));

g.Title = 'T1 không có ô chọn ngày mong muốn (đã lỗi thời — FR-M4-04 sửa ở SRS v1.2)';
g.Actual =
  'T1: bước "Lịch hẹn" (bước 3) hiển thị đúng 7 ngày cố định ' +
  '23/11/2026 → 29/11/2026 (bắt đầu từ ngày mai, không có ngày trong quá khứ) ' +
  'kèm 8 khung giờ 08:30, 09:30, 10:30, 13:00, 14:00, 15:00, 16:00, 17:00; ' +
  'không có input[type=date]. ' +
  '⇒ ĐÂY CHÍNH LÀ hành vi mà FR-M4-04 (SRS v1.2, sau Inspection RV-06 ngày 18/11) ' +
  'yêu cầu. Defect đã lỗi thời vì đặc tả được hiệu chỉnh sau khi defect được mở.';
g.Evidence =
  'reports/raw/t1-m4-004-date-step.json (đo đạc trực tiếp 22/11/2026: 7 ngày, 8 khung giờ, input[type=date]=0); ' +
  'reports/raw/survey-day03-detail.json (khảo sát gốc 18/11 — dựa trên wording SRS v1.1); ' +
  'docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md §FR-M4-04 phiên bản 1.2';
g.Status = 'Closed';
g.Resolution =
  'Đóng — lỗi thời do đặc tả hiệu chỉnh, KHÔNG phải do site được sửa. ' +
  'SRS v1.2 (Inspection RV-06, 18/11) đã sửa tiêu chí chấp nhận FR-M4-04 cho T1 thành ' +
  '"7 ngày cố định + 8 khung giờ 08:30–17:00, ngày trong quá khứ không chọn được". ' +
  'Xác minh lại 22/11/2026: T1 thoả đúng tiêu chí hiện hành. ' +
  'TC-T1-M4-003 Pass trong regression Ngày 13. Không hạ tiêu chí — tiêu chí đã được ' +
  'Inspection chấp nhận và đặc tả đã cập nhật công khai.';

lines[idx] = tenCot
  .map((_, i) => {
    const v = g[tenCot[i]] ?? '';
    return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  })
  .join(',');

fs.writeFileSync(duongDan, lines.join('\n') + '\n', 'utf8');
console.log('DEF-023 Status =', g.Status);
