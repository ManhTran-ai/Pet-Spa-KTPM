import fs from 'node:fs';

/**
 * Cập nhật bằng chứng cho DEF-016 sau khi rà soát sâu NFR-04-005 (Ngày 11–12).
 * Không thay đổi tiêu chí, không đổi trạng thái — chỉ bổ sung bằng chứng đo đạc chính xác.
 */

const duongDan = 'docs/defects/defects.csv';
const lines = fs.readFileSync(duongDan, 'utf8').trim().split(/\r?\n/);
const tenCot = lines[0].split(',');
const idx = lines.findIndex((l) => l.startsWith('DEF-016,'));

if (idx === -1) throw new Error('Không tìm thấy DEF-016');

/** Tách CSV tôn trọng dấu nháy kép. */
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
  throw new Error(`Số cột không khớp: row=${row.length}, header=${tenCot.length}`);
}

const giaTri = Object.fromEntries(tenCot.map((t, i) => [t, row[i]]));

giaTri.Steps =
  '1. Mở trang chủ T1 (https://petngon.vn/vi) ở khung nhìn 360x740 | ' +
  '2. Đo documentElement.scrollWidth trừ clientWidth | ' +
  '3. Quét mọi phần tử, so getBoundingClientRect().right với clientWidth để tìm phần tử vượt mép phải | ' +
  '4. Đặt scrollLeft = 9999 để xác nhận người dùng thực sự cuộn được | ' +
  '5. Đối chiếu cùng phép đo trên T2 (matpet.vn/spa) và T3 (groomore) để khoanh vùng hệ thống';

giaTri.Actual =
  'T1: scrollWidth 379 > clientWidth 360 → tràn 19px; đặt scrollLeft = 9999 thì giữ được 19px ' +
  '→ người dùng THỰC SỰ cuộn ngang được, không chỉ là tràn vô hại. ' +
  'Nguyên nhân gốc (đo đạc chính xác): ' +
  '(a) .bn-bar__right nằm tại left=241 → right=379 (rộng 138px), trong đó nút .bn-bar__book ' +
  '"Đặt lịch" nằm tại left=339 → right=379 — vượt mép phải 19px; ' +
  '(b) .bn-hero__visual-glow là position:absolute, rộng 384px, left=-6 → right=378 — vượt 18px. ' +
  'T2: scrollWidth 360 = clientWidth 360, tràn 0px, scrollLeft tối đa = 0. ' +
  'T3: scrollWidth 360 = clientWidth 360, tràn 0px, scrollLeft tối đa = 0 (27 phần tử .BannerSlickImage ' +
  'vượt mép phải nhưng bị clip trong carousel → không gây cuộn ngang ở cấp document). ' +
  '⇒ Lỗi chỉ xảy ra ở T1. ' +
  'Ghi chú: bảng giá .hm-pricing-matrix (720px) cũng vượt mép phải nhưng nằm trong vùng cuộn riêng ' +
  '→ cố ý, không phải nguyên nhân của cuộn ngang cấp trang.';

giaTri.Evidence =
  'reports/raw/nfr-04-005-overflow.json (đo đạc T1/T2/T3 tại 360px, kèm maxScroll và danh sách phần tử vượt mép); ' +
  'reports/raw/nfr-04-005-T1-360px.png (ảnh chụp màn hình T1 ở 360px); ' +
  'reports/raw/pw-full.txt; reports/raw/probe-t1-nghivan.json (M1_005.tran)';

const dong = tenCot
  .map((t) => {
    const v = giaTri[t] ?? '';
    if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  })
  .join(',');

lines[idx] = dong;
fs.writeFileSync(duongDan, lines.join('\n') + '\n', 'utf8');
console.log('Đã cập nhật DEF-016.');
console.log('Status =', giaTri.Status);
console.log('Severity =', giaTri.Severity);
console.log('Steps len =', giaTri.Steps.length);
console.log('Actual len =', giaTri.Actual.length);
