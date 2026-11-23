import fs from 'node:fs';

const p = 'docs/defects/defects.csv';
const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
const rows = lines.slice(1).filter((l) => l.trim());

// --- Cập nhật DEF-016: bổ sung nguyên nhân gốc tràn ngang ---
const i = rows.findIndex((l) => l.startsWith('DEF-016,'));
if (i < 0) throw new Error('DEF-016 not found');
const c = rows[i].split(',');
c[11] =
  'scrollWidth vượt clientWidth 19px (379 > 360). Nguyên nhân gốc: thanh header .bn-bar__right (nút Đặt lịch) tràn ra mép phải; .bn-hero__visual-glow rộng 384px';
c[12] = 'reports/raw/pw-full.txt; reports/raw/probe-t1-nghivan.json (M1_005.tran)';
rows[i] = c.join(',');

// --- Thêm 3 defect mới: lỗi thật của site T1 ---
const moi = [
  {
    id: 'DEF-025',
    title: 'T1 cho phép bỏ qua bước chọn dịch vụ và loài/cân nặng trong wizard',
    system: 'T1',
    req: 'FR-M4-06',
    tc: 'TC-T1-M4-004',
    sev: 'Medium',
    pri: 'High',
    by: 'Tài',
    at: '2026-11-22',
    steps:
      '1. Mở trang chủ T1 | 2. Bấm nút Đặt lịch để mở modal 4 bước | 3. Ở bước 1 (Dịch vụ) CHƯA chọn dịch vụ nào | 4. Quan sát trạng thái nút Tiếp tục',
    expected:
      'Nút Tiếp tục phải bị khoá khi chưa chọn dịch vụ — không có cách bỏ qua bước chọn loài và cân nặng (tiêu chí chấp nhận FR-M4-06: 0 cách bỏ qua, nút Tiếp tục bị khoá khi chưa chọn)',
    actual:
      'Nút Tiếp tục ở bước 1 LUÔN bật (disabled = false) dù chưa chọn dịch vụ nào. Người dùng có thể bấm Tiếp tục để vào thẳng bước 2 mà không chọn dịch vụ, tiếp tục bỏ qua bước chọn loài và cân nặng',
    evidence: 'reports/raw/probe-t1-nghivan.json (M4_004.nutDisabledChuaChonDichVu = false)',
    status: 'Open',
    res: 'Lỗi ở site đích (bên thứ ba) — nhóm khô; đã ghi nhận và báo cáo, không sửa script cho xanh',
  },
  {
    id: 'DEF-026',
    title: 'T1 hiển thị phụ thu di chuyển cố định thay vì liên hệ báo giá riêng khi trên 15 km',
    system: 'T1',
    req: 'FR-M6-06',
    tc: 'TC-T1-M6-018; TC-T1-M6-019',
    sev: 'Medium',
    pri: 'High',
    by: 'Tài',
    at: '2026-11-22',
    steps:
      '1. Mở trang chủ T1 | 2. Mở modal Đặt lịch | 3. Đi tới bước 4 (Địa điểm) | 4. Chọn Tận nhà | 5. Nhập địa chỉ Yên Bái (ánh xạ 15.7 km) | 6. Quan sát dòng Phí di chuyển',
    expected:
      'Trên 15 km phải hiển thị "Liên hệ — Báo giá riêng theo lộ trình" và không hiện con số phụ thu cố định (FR-M6-06, BR-05: trên 15 km liên hệ báo giá riêng)',
    actual:
      'Site hiển thị "Phí di chuyển (15.7km) + 88.000₫" — vẫn là con số cố định theo công thức max(0, ceil(km) − 5) × 8.000₫, không chuyển sang báo giá riêng',
    evidence:
      'reports/raw/probe-t1-km-2026-11-22.json (Yên Bái = 15.7 km, 88.000₫, coBaoGiaRieng = false)',
    status: 'Open',
    res: 'Lỗi ở site đích (bên thứ ba) — nhóm khô; đã ghi nhận và báo cáo, không sửa script cho xanh',
  },
  {
    id: 'DEF-027',
    title: 'T1 dùng accordion mở đơn cho FAQ, đóng mục đang mở khi mở mục khác',
    system: 'T1',
    req: 'FR-M7-06',
    tc: 'TC-T1-M7-003',
    sev: 'Low',
    pri: 'Medium',
    by: 'Tài',
    at: '2026-11-22',
    steps:
      '1. Mở trang chủ T1, cuộn tới mục FAQ | 2. Mục 1 đang mở sẵn (biểu tượng remove) | 3. Bấm mục 2 | 4. Quan sát biểu tượng của mục 1 và mục 2',
    expected:
      'Mỗi mục FAQ mở độc lập — phải có ít nhất 2 mục mở cùng lúc mà không đóng lẫn nhau; biểu tượng đổi theo trạng thái (FR-M7-06)',
    actual:
      'Mở mục 2 làm mục 1 đóng lại (biểu tượng mục 1 đổi remove → add). T1 dùng accordion mở đơn: chỉ 1 mục mở tại một thời điểm',
    evidence:
      'reports/raw/probe-t1-nghivan.json (M7_003: icon0/icon1 → sauClick1 = add, remove, add)',
    status: 'Open',
    res: 'Lỗi ở site đích (bên thứ ba) — nhóm khô; đã ghi nhận và báo cáo, không sửa script cho xanh',
  },
];

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
for (const d of moi) {
  if (rows.some((r) => r.startsWith(`${d.id},`))) {
    console.log(`${d.id} đã tồn tại — bỏ qua`);
    continue;
  }
  rows.push(
    [
      d.id,
      d.title,
      d.system,
      d.req,
      d.tc,
      d.sev,
      d.pri,
      d.by,
      d.at,
      d.steps,
      d.expected,
      d.actual,
      d.evidence,
      d.status,
      d.res,
    ]
      .map(esc)
      .join(','),
  );
  console.log(`${d.id} — đã thêm`);
}

fs.writeFileSync(p, [lines[0], ...rows, ''].join('\n'), 'utf8');
console.log('Tổng số defect:', rows.length);
