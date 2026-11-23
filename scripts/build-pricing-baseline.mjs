import fs from 'node:fs';

/**
 * Gom bảng giá tham chiếu của 3 site thành một file CSV duy nhất (Ngày 2).
 * Nguồn: khảo sát trực tiếp ngày 2026-11-14 (bằng chứng ở reports/raw/).
 *
 * Từ Ngày 8 (Phase 2 — item 2.4) bổ sung cột `Input_Guide`: cách nhập dữ liệu
 * để **cùng một ca kiểm thử chạy trên 3 hệ thống** dùng chung một bộ giá trị
 * và cho ra cùng kết luận — bộ dữ liệu dùng chung, không tự chế số liệu.
 */
const rows = [
  [
    'System',
    'Table',
    'Service',
    'Band',
    'Price',
    'Currency',
    'Source',
    'Input_Guide',
  ],
];

/** Cách nhập chuỗi tìm kiếm để tới đúng dòng giá trên từng hệ thống. */
const INPUT_GUIDE = {
  t1: 'Chọn loài (Chó/Mèo) → chọn bậc cân nặng → chọn dịch vụ; đọc giá hiển thị',
  t2: 'Chọn loại bé → chọn bậc cân nặng → chọn dịch vụ; đọc khung "GIÁ DỰ KIẾN"',
  t3: 'Không có ô nhập cân nặng: chọn đúng dịch vụ theo bậc lbs trong tên; đọc giá trong danh mục',
};

// --- T1: bảng giá 6 gói × 7 bậc chó + 7 bậc mèo --------------------------------
const T1 = [
  ['Chó mini', '< 3kg', [88000, 145000, 88000, 130000, 240000, 185000]],
  ['Chó nhỏ', '3–5kg', [155000, 165000, 110000, 265000, 405000, 350000]],
  ['Chó vừa', '5–10kg', [240000, 220000, 165000, 375000, 515000, 460000]],
  ['Chó lớn', '10–15kg', [350000, 275000, 220000, 460000, 605000, 550000]],
  ['Chó rất lớn', '15–20kg', [460000, 330000, 275000, 550000, 660000, 605000]],
  ['Chó đại', '20–25kg', [570000, 385000, 330000, 640000, 750000, 695000]],
  ['Chó siêu đại', '25–30kg', [660000, 440000, 385000, 725000, 835000, 780000]],
  ['Mèo mini', '≤ 3kg', [110000, 160000, 110000, 155000, 240000, 210000]],
  ['Mèo nhỏ', '3–5kg', [165000, 275000, 165000, 275000, 415000, 365000]],
  ['Mèo vừa', '5–10kg', [275000, 370000, 220000, 405000, 565000, 495000]],
  ['Mèo lớn', '10–15kg', [385000, 440000, 275000, 495000, 665000, 585000]],
  ['Mèo rất lớn', '15–20kg', [460000, 455000, 330000, 550000, 690000, 605000]],
  ['Mèo đại', '20–25kg', [570000, 520000, 385000, 640000, 795000, 695000]],
  ['Mèo siêu đại', '25–30kg', [660000, 585000, 440000, 725000, 890000, 780000]],
];
const T1_SERVICES = ['Tắm', 'Cắt tỉa lông', 'Cạo lông', 'Combo Tắm+Vệ sinh', 'Combo Tắm+Cắt tỉa', 'Combo Tắm+Cạo'];
for (const [label, band, prices] of T1) {
  prices.forEach((price, i) => {
    rows.push([
      'T1',
      'Bảng giá chính',
      T1_SERVICES[i],
      `${label} ${band}`,
      price.toLocaleString('vi-VN'),
      'VND',
      'reports/raw/survey-T1.html',
      INPUT_GUIDE.t1,
    ]);
  });
}

// --- T2: grooming 6 dịch vụ lẻ + 4 combo × 7 bậc ------------------------------
const T2 = [
  ['Combo Tắm Vệ Sinh', ['120k', '200k', '300k', '400k', '500k', '600k', '700k']],
  ['Combo Tắm Cạo', ['200k', '250k', '350k', '450k', '600k', '700k', '800k']],
  ['Combo Tắm Cắt', ['300k', '350k', '400k', '550k', '700k', '800k', '1tr']],
  ['Combo Tắm Cắt Tạo Hình', ['350k', '400k', '500k', '650k', '800k', '1tr', '1,2tr']],
  ['Cắt dũa + Móng', ['30k', '30k', '50k', '50k', '70k', '70k', '70k']],
  ['Vệ sinh tai', ['30k', '30k', '50k', '50k', '70k', '70k', '70k']],
  ['Cạo bụng + Bàn + Hậu môn', ['30k', '30k', '50k', '50k', '70k', '70k', '70k']],
  ['Tắm sấy', ['100k', '150k', '250k', '350k', '450k', '550k', '650k']],
  ['Cạo lông', ['150k', '200k', '300k', '400k', '500k', '600k', '700k']],
  ['Cắt lông', ['200k', '300k', '400k', '500k', '650k', '750k', '900k']],
];
const T2_BANDS = ['<3kg', '>3–6kg', '>6–10kg', '>10–20kg', '>20–30kg', '>30–40kg', '>40kg'];
for (const [service, prices] of T2) {
  prices.forEach((price, i) => {
    rows.push([
      'T2',
      'Grooming',
      service,
      T2_BANDS[i],
      price,
      'VND',
      'reports/raw/survey-T2-text.txt',
      INPUT_GUIDE.t2,
    ]);
  });
}

// --- T2: nhuộm 3 dịch vụ × 4 bậc ----------------------------------------------
const T2_DYE = [
  ['Nhuộm 2 tai + đuôi', ['250k', '300k', '350k', '400k']],
  ['Nhuộm 4 chân', ['250k', '300k', '350k', '400k']],
  ['Nhuộm hình nhỏ', ['300k', '350k', '400k', '500k']],
];
const T2_DYE_BANDS = ['<6kg', '>6–15kg', '>15–30kg', '>30kg'];
for (const [service, prices] of T2_DYE) {
  prices.forEach((price, i) => {
    rows.push([
      'T2',
      'Nhuộm',
      service,
      T2_DYE_BANDS[i],
      price,
      'VND',
      'reports/raw/survey-T2-text.txt',
      INPUT_GUIDE.t2,
    ]);
  });
}

// --- T2: báo giá riêng 6 dịch vụ ----------------------------------------------
for (const service of ['Gỡ rối', 'Tẩy ố', 'Tắm trắng', 'Xả dưỡng']) {
  rows.push([
    'T2',
    'Báo giá riêng',
    service,
    'theo tình trạng lông',
    '50.000–500.000',
    'VND',
    'reports/raw/survey-T2-text.txt',
    INPUT_GUIDE.t2,
  ]);
}
for (const service of ['Nhuộm hình lớn', 'Nhuộm tạo hình cơ thể']) {
  rows.push([
    'T2',
    'Báo giá riêng',
    service,
    'theo thiết kế',
    'tuỳ thiết kế',
    'VND',
    'reports/raw/survey-T2-text.txt',
    INPUT_GUIDE.t2,
  ]);
}

// --- T3: 41 dịch vụ lấy từ API công khai Groomore ------------------------------
const t3 = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
for (const category of t3.data.obj) {
  for (const service of category.services) {
    rows.push([
      'T3',
      category.name,
      service.name,
      'theo nhóm cân nặng trong tên dịch vụ',
      (service.price / 100).toFixed(2),
      'USD',
      'reports/raw/survey-T3-services.json',
      INPUT_GUIDE.t3,
    ]);
  }
}

const csv = rows
  .map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(','))
  .join('\n');
fs.mkdirSync('docs/reference', { recursive: true });
fs.writeFileSync('docs/reference/pricing-baseline.csv', `\uFEFF${csv}\n`, 'utf8');

const bySystem = {};
for (const r of rows.slice(1)) bySystem[r[0]] = (bySystem[r[0]] ?? 0) + 1;
console.log(`pricing-baseline.csv: ${rows.length - 1} dòng`, bySystem);

// --- Bảng dữ liệu dùng chung: giờ mở cửa + bậc cân nặng (Phase 2, item 2.4) ---
// Nguồn: SRS-01 §3.1–§3.4 (đã kiểm chứng sống 2026-11-14 và 2026-11-19).
const scheduleRows = [
  ['System', 'Kind', 'Key', 'Value', 'Note', 'Source'],
  ['T1', 'Giờ mở cửa', 'Tất cả các ngày', '07:00–22:00', 'Trang liên hệ; blog ghi "đến trong 60\' nội thành"', 'docs/srs.md §3.1'],
  ['T1', 'Giờ mở cửa', 'Ngoài khung', 'vẫn cho đặt lịch', 'Đặt lịch online 24/7; xác nhận trong 5 phút qua Zalo', 'docs/srs.md §3.1'],
  ['T1', 'Bậc cân nặng (chó)', '7 bậc', '<3 / 3–5 / 5–10 / 10–15 / 15–20 / 20–25 / 25–30', 'Đơn vị kg', 'docs/srs.md §3.1, §7'],
  ['T1', 'Bậc cân nặng (mèo)', '7 bậc', '≤3 / 3–5 / 5–10 / 10–15 / 15–20 / 20–25 / 25–30', 'Đơn vị kg', 'docs/srs.md §3.1, §7'],
  ['T1', 'Phụ thu di chuyển', 'Công thức', 'max(0, km − 5) × 8.000₫', 'Trên 15 km: "liên hệ báo giá riêng"', 'docs/srs.md §8.4, BR-05'],
  ['T1', 'Phụ thu gói tại nhà', 'Tắm / Cạo / Combo Tắm+Cạo', '+50.000₫ / +80.000₫ / +100.000₫', 'Cắt tỉa và Combo Tắm+Cắt tỉa chỉ tại spa', 'docs/srs.md §3.1, BR-06'],

  ['T2', 'Giờ mở cửa', 'Tất cả các ngày', '08:00–22:00', 'Footer trang chủ', 'docs/srs.md §3.2'],
  ['T2', 'Bậc cân nặng', '7 bậc', '<3 / >3–6 / >6–10 / >10–20 / >20–30 / >30–40 / >40', 'Đơn vị kg; dùng chung bảng giá Chó và Mèo', 'docs/srs.md §3.2, §7'],
  ['T2', 'Bậc cân nặng (nhuộm)', '4 bậc', '<6 / >6–15 / >15–30 / >30', 'Đơn vị kg', 'docs/srs.md §3.2, §7'],
  ['T2', 'Ngày mong muốn', 'Giới hạn', 'Hôm nay … +30 ngày', 'min = hôm nay; max = null (nhận được ngày xa, phải giải thích theo lịch mở cửa)', 'docs/srs.md §7, FR-M4-05'],
  ['T2', 'Quy trình đặt lịch', '3 bước', 'Loại bé → Cân nặng → Dịch vụ', 'Nút "Tiếp tục →" bị khoá khi chưa đủ dữ liệu', 'docs/srs.md §8.1'],

  ['T3', 'Giờ mở cửa', '7 ngày (SUN–SAT)', '08:00–20:00', 'Khối "Business Hours"; trạng thái "Open" hiển thị trên trang', 'docs/srs.md §3.3, FR-M5-07'],
  ['T3', 'Đặt lịch ngoài giờ', '24/7', 'Nút "Book Now" không bị khoá', 'Ngoài khung 08:00–20:00 vẫn mở được drawer', 'docs/srs.md §3.3, FR-M4-11'],
  ['T3', 'Bậc cân nặng', 'Mã hoá trong tên dịch vụ', 'lbs (0-20 / 20-50 / over 50 / …)', 'KHÔNG có ô nhập cân nặng — mỗi dòng dịch vụ có bậc riêng', 'docs/srs.md §3.3, §7, BR-03'],
  ['T3', 'Quy trình đặt lịch', '1 màn hình', 'Book Now → SĐT → Login', 'KHÔNG có bước chọn loài / cân nặng / dịch vụ / ngày / khung giờ; chỉ nhận khách đã có hồ sơ', 'docs/srs.md §3.3, §8.2b'],
  ['T3', 'Số điện thoại', 'Định dạng', 'Chỉ chữ số', 'Placeholder "Mobile number"; không kiểm tra độ dài tối thiểu; tự mask theo (609) 123-4567', 'docs/srs.md §7, FR-M4-03'],
];

const scheduleCsv = scheduleRows
  .map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(','))
  .join('\n');
fs.writeFileSync('docs/reference/test-data-baseline.csv', `\uFEFF${scheduleCsv}\n`, 'utf8');
console.log(`test-data-baseline.csv: ${scheduleRows.length - 1} dòng`);
