import fs from 'node:fs';

/**
 * Liên kết TC-T1-M1-005 vào DEF-016.
 *
 * TC-T1-M1-005 ("Trang chủ không cuộn ngang ở màn hình 360px") và
 * TC-NFR-04-005 ("Không có cuộn ngang ở màn hình 360px trên trang đặt lịch")
 * đều phát hiện **cùng một lỗi gốc** của T1: tràn ngang 19px do
 * `.bn-bar__right` và `.bn-hero__visual-glow`.
 *
 * Ghi rõ quan hệ này để EC-3 ("mọi Fail phải có defect") không báo thiếu.
 */

const duongDan = 'docs/defects/defects.csv';
const lines = fs.readFileSync(duongDan, 'utf8').trim().split(/\r?\n/);
const tenCot = lines[0].split(',');
const iTC = tenCot.indexOf('Test_Case_ID');
const idx = lines.findIndex((l) => l.startsWith('DEF-016,'));

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

const tcHienTai = row[iTC];
if (!tcHienTai.includes('TC-T1-M1-005')) {
  row[iTC] = `${tcHienTai}; TC-T1-M1-005`;
}

lines[idx] = tenCot
  .map((_, i) => {
    const v = row[i] ?? '';
    return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  })
  .join(',');

fs.writeFileSync(duongDan, lines.join('\n') + '\n', 'utf8');
console.log('DEF-016 Test_Case_ID =', row[iTC]);
