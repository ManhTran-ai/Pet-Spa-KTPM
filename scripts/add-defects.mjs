import { readFile, writeFile } from 'node:fs/promises';

/**
 * Ghi thêm defect mới vào `docs/defects/defects.csv` (Ngân — Ngày 11/12).
 * Dùng script để escape CSV đúng quy tắc (nháy kép, nháy đôi).
 */
const FILE = 'docs/defects/defects.csv';

const toCsvCell = (value) => {
  const v = String(value ?? '');
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
};

const dong = (cells) => cells.map(toCsvCell).join(',');

const MOI = [
  [
    'DEF-033',
    'T2 không công bố thời lượng và phạm vi bao gồm của dịch vụ trong danh mục',
    'T2',
    'FR-M2-01 FR-M2-02',
    'TC-T2-M2-001 TC-T2-M2-002',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Mở https://matpet.vn/spa | 2. Chọn Chó -> Tiếp tục -> <3kg -> Tiếp tục | 3. Duyệt tab "Combo trọn gói" và "Dịch vụ lẻ" | 4. Đọc text đầy đủ của từng button.svc',
    'Mỗi dịch vụ trong danh mục có đủ 4 thuộc tính: tên, mô tả, giá, thời lượng (FR-M2-01) và 100% dịch vụ có mô tả "bao gồm" liệt kê thành phần (FR-M2-02)',
    'Cả 2 tab đều thiếu: (a) thời lượng — không có dịch vụ nào ghi số phút, nút chỉ có <b>tên</b> + <span class="pr">giá</span>, toàn trang không có chuỗi "phút"; (b) mô tả thành phần — 7 dịch vụ ở tab "Combo trọn gói" (Combo Tắm Vệ Sinh, Combo Tắm Cạo, Combo Tắm Cắt, Combo Tắm Cắt Tạo Hình, Nhuộm 2 tai + đuôi, Nhuộm 4 chân, Nhuộm hình nhỏ) và 9 dịch vụ ở tab "Dịch vụ lẻ" không có phần tử .d. Chỉ 6 dịch vụ "báo giá riêng" có .d, và nội dung .d mô tả cách báo giá chứ không liệt kê thành phần dịch vụ',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
  [
    'DEF-034',
    'T2 không công bố thời gian xác nhận lịch cụ thể',
    'T2',
    'FR-M5-02',
    'TC-T2-M5-002',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Mở https://matpet.vn/spa | 2. Cuộn tới form GIỮ CHỖ và đọc toàn bộ văn bản trang | 3. Tìm câu nói về việc spa gọi xác nhận khung giờ',
    'Trang phải công bố thời gian xác nhận lịch cụ thể (ví dụ "trong vòng 15 phút") (FR-M5-02)',
    'Trang chỉ ghi "Chỉ cần số điện thoại — spa sẽ gọi xác nhận khung giờ." và "Dịch vụ \'báo giá riêng\' sẽ được tư vấn khi spa gọi lại." — không nêu thời gian (phút/giờ) bao lâu sẽ gọi lại. Trang cũng không nêu mốc đặt trước cho từng loại dịch vụ (FR-M5-05)',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
  [
    'DEF-035',
    'T2 không có nội dung chính sách hủy lịch / đổi lịch / hoàn cọc cho dịch vụ spa',
    'T2',
    'FR-M5-04',
    'TC-T2-M5-003',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Duyệt /spa, /cau-hoi-thuong-gap, /bao-hanh, /cham-soc, /bang-gia (mở hết thẻ <details>) | 2. Tìm nội dung về hủy lịch, đổi lịch, đặt cọc/hoàn cọc cho dịch vụ grooming/spa',
    'Phải có nội dung cho cả 3 mục: hủy, đổi, hoàn cọc; không chỉ nêu "liên hệ tiệm" (FR-M5-04)',
    'Không có bất kỳ nội dung nào về hủy/đổi lịch grooming. Nội dung "đặt cọc" và "hoàn tiền" tồn tại nhưng chỉ áp dụng cho mua bán thú cưng (/cau-hoi-thuong-gap: cọc giữ bé tối đa 7 ngày; /bao-hanh: "không hoàn tiền dưới mọi hình thức sau khi mua"), không liên quan dịch vụ spa',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
];

const raw = await readFile(FILE, 'utf8');
const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);

const ids = new Set(lines.slice(1).map((l) => l.split(',')[0]));
const them = MOI.filter((m) => !ids.has(m[0]));
if (them.length === 0) {
  console.log('Không có defect mới để thêm (đã tồn tại).');
} else {
  const noiDung = [...lines, ...them.map(dong)].join('\n') + '\n';
  await writeFile(FILE, noiDung, 'utf8');
  console.log(`Đã thêm ${them.length} defect: ${them.map((m) => m[0]).join(', ')}`);
}
