import { readFile, writeFile } from 'node:fs/promises';

/**
 * Ghi thêm defect mới vào `docs/defects/defects.csv` (Ngân — Ngày 10-11).
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
    'DEF-029',
    'T2 không giữ lựa chọn của người dùng sau khi tải lại trang',
    'T2',
    'NFR-05',
    'TC-NFR-05-003 TC-NFR-05-004',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Mở /spa | 2. Chọn Chó > bậc >6-10kg | 3. Tải lại trang (F5) | 4. Đọc lại trạng thái wizard',
    'Tải lại trang phải giữ nguyên lựa chọn đã làm (tiêu chí chấp nhận NFR-05)',
    'Sau khi tải lại, wizard quay về S0 (chưa chọn loài): .chip.sel rỗng, .st.done rỗng, .rail-price không có giá. Trang không lưu trạng thái vào localStorage/sessionStorage (chỉ có khoá posthog và mpet_company_settings_v1)',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
  [
    'DEF-030',
    'T3 vượt ngưỡng DOMContentLoaded 3 giây trên mạng 4G mô phỏng',
    'T3',
    'NFR-01',
    'TC-NFR-01-003',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Bật Chrome DevTools Protocol Network.emulateNetworkConditions (1.6 Mbps / 750 kbps / 150 ms) | 2. Mở trang chủ T3 | 3. Đọc navigation.domContentLoadedEventEnd',
    'DOMContentLoaded không quá 3000 ms trên mạng 4G mô phỏng',
    'T3 = 6757 ms (vượt ngưỡng 2,3 lần); T1 = 1930 ms và T2 = 2540 ms đạt ngưỡng',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
  [
    'DEF-031',
    'T2 vượt ngưỡng LCP 2,5 giây trên mạng 4G mô phỏng',
    'T2',
    'NFR-01',
    'TC-NFR-01-004 TC-NFR-01-005',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Bật Chrome DevTools Protocol Network.emulateNetworkConditions (1.6 Mbps / 750 kbps / 150 ms) | 2. Mở trang chủ và trang đặt lịch T2 | 3. Đọc Largest Contentful Paint',
    'LCP không quá 2500 ms trên mạng 4G mô phỏng',
    'T2 = 4364 ms (trang chủ) và 4332 ms (trang đặt lịch), vượt ngưỡng khoảng 1,7 lần',
    'reports/raw/playwright-report.json',
    'Open',
    'Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận và báo cáo, không hạ tiêu chí',
  ],
  [
    'DEF-032',
    'T3 trả về khung giờ đặt lịch ngoài giờ mở cửa 06:30-07:30 mà không từ chối',
    'T3',
    'FR-M5-06',
    'TC-T3-M5-003',
    'High',
    'High',
    'Ngân',
    '2026-11-20',
    '1. Mở trang chủ T3 | 2. Gọi GET /booking-api/v1/available-time với Dog Bath 20-50lbs (id 293693) và Cat Bath (id 293691) cho 30 ngày tới | 3. Đọc staff_available_time (phút tính từ nửa đêm) và so với khung 08:00-20:00 khai trong book-online-setting (BR-13)',
    'Khung giờ nằm ngoài 08:00-20:00 phải bị từ chối kèm >= 1 câu giải thích lý do (FR-M5-06) và không được trả về cho khách chọn (BR-13)',
    'API trả về 30 khung giờ ngoài khung mở cửa: 06:30 (390 phút), 07:00 (420 phút), 07:30 (450 phút) — ví dụ Dog Bath 20-50lbs ngày 2026-11-28 có 06:30/07:00/07:30; cả Cat Bath lẫn Dog Bath 20-50lbs đều bị ảnh hưởng',
    'reports/raw/survey-T3-timeslots.csv',
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
