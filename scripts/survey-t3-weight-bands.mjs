import fs from 'node:fs';

/**
 * Đối chiếu ngưỡng cân nặng T3: BR-03 (SRS-01 v1.1) ↔ danh mục thật trong API.
 *
 * Ngày 2 — Ngân (TV3). Đầu ra: `reports/raw/survey-T3-weight-bands.csv`.
 *
 * Bối cảnh: phát hiện P4 yêu cầu viết lại BR-03 theo từng dòng sản phẩm.
 * Đặc tả v1.1 đã sửa BR-03, nhưng từng mục trong đó cần kiểm chứng lại.
 *
 * Trong T3, ngưỡng cân nặng KHÔNG nằm ở trường dữ liệu riêng — `weight_limit`
 * đều rỗng và `weight_limit_obj.select_all = 1`. Ngưỡng chỉ được mã hoá trong
 * *tên* dịch vụ. Vì vậy oracle ở đây là danh sách dịch vụ của từng dòng sản phẩm.
 */

/**
 * Mỗi dòng sản phẩm, khai báo tường minh từ danh mục API.
 * `bands` là các ngưỡng cân nặng BR-03 khai báo; `dichVucs` là các dịch vụ
 * thực tế ứng với dòng đó (một ngưỡng có thể sinh nhiều dòng giá).
 */
const DONG_SAN_PHAM = [
  {
    dong: 'Dog Bath',
    bands: ['0-20', '20-50', 'over 50'],
    dichVucs: [
      { ten: 'Dog Bath 0-20lbs', band: '0-20' },
      { ten: 'Dog Bath 20-50lbs', band: '20-50' },
      { ten: 'Dog Bath short hair over 50lbs', band: 'over 50' },
      { ten: 'Dog bath medium/long hair over 50lbs', band: 'over 50' },
    ],
  },
  {
    dong: 'Dog Bath and tidy up',
    bands: ['0-20', '21-40', '41-60', '61-79', '79+'],
    dichVucs: [
      { ten: 'Dog Bath and tidy up 0 - 20lbs', band: '0-20' },
      { ten: 'Dog Bath and tidy up 21 - 40lbs', band: '21-40' },
      { ten: 'Dog Bath and tidy up 41 - 60lbs', band: '41-60' },
      { ten: 'Dog Bath and tidy up 61- 79lbs', band: '61-79' },
      { ten: 'Dog Bath and tidy up 79+ lbs', band: '79+' },
    ],
  },
  {
    dong: 'Dog Full Groom',
    bands: ['0-20', '21-30', '31-40', '41-60', '61-78', '79-90', '91-100+'],
    dichVucs: [
      { ten: 'Dog Full Groom  0 - 20 lbs', band: '0-20' },
      { ten: 'Dog Full groom 21 - 30lbs', band: '21-30' },
      { ten: 'Dog Full Groom  31 - 40lbs', band: '31-40' },
      { ten: 'Dog Full Groom 41 - 60lbs', band: '41-60' },
      { ten: 'Dog Full groom 61 - 78lbs', band: '61-78' },
      { ten: 'Dog Full groom 79 - 90lbs', band: '79-90' },
      { ten: 'Dog Full Groom 91-100+ pounds', band: '91-100+' },
    ],
  },
  {
    dong: 'Cat Bath',
    bands: ['0-20', '21-40', '41-60', '61-79', '79+'],
    dichVucs: [{ ten: 'Cat Bath', band: '(không mã hoá ngưỡng trong tên)' }],
  },
];

const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
const apiTheoTen = new Map();
for (const nhom of raw.data.obj) {
  for (const svc of nhom.services) {
    apiTheoTen.set(svc.name, { ...svc, category: nhom.name });
  }
}

const rows = [
  ['Product_Line', 'Service_Name', 'API_Price_USD', 'API_Duration_min', 'Weight_Band', 'BR03_Declared_Bands', 'Match', 'Note'],
];
const saiLech = [];

for (const { dong, bands, dichVucs } of DONG_SAN_PHAM) {
  const bandThucTe = [...new Set(dichVucs.map((d) => d.band))];
  const khop =
    bandThucTe.length === bands.length && bandThucTe.every((b) => bands.includes(b));

  if (!khop) {
    saiLech.push(
      `${dong}: BR-03 khai ${bands.length} ngưỡng (${bands.join(', ')}) nhưng danh mục chỉ có ${bandThucTe.length} (${bandThucTe.join(', ')})`,
    );
  }

  for (const { ten, band } of dichVucs) {
    const svc = apiTheoTen.get(ten);
    if (!svc) {
      rows.push([dong, ten, '', '', band, bands.join(' / '), 'NO', 'Không có trong danh mục API']);
      continue;
    }
    rows.push([
      dong,
      ten,
      (svc.price / 100).toFixed(2),
      String(svc.duration),
      band,
      bands.join(' / '),
      khop ? 'YES' : 'NO',
      khop
        ? 'Khớp: các ngưỡng BR-03 khai đều có dịch vụ tương ứng trong danh mục'
        : 'Số ngưỡng trong BR-03 không khớp số ngưỡng thực tế của dòng sản phẩm',
    ]);
  }
}

// Các dịch vụ Mèo còn lại — không thuộc dòng "Cat Bath" theo BR-03.
const tenDaXet = new Set(DONG_SAN_PHAM.flatMap((d) => d.dichVucs.map((v) => v.ten)));
for (const svc of raw.data.obj.flatMap((n) => n.services)) {
  if (svc.category !== 'Cat (bath included)') continue;
  if (tenDaXet.has(svc.name)) continue;
  rows.push([
    'Cat (dòng khác, BR-03 chưa mô tả)',
    svc.name,
    (svc.price / 100).toFixed(2),
    String(svc.duration),
    '(không mã hoá ngưỡng trong tên)',
    '(không khai trong BR-03)',
    'NO',
    'Dịch vụ Mèo không mang ngưỡng cân nặng trong tên; BR-03 chưa mô tả dòng sản phẩm này',
  ]);
}

const csv = rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
fs.writeFileSync('reports/raw/survey-T3-weight-bands.csv', `\uFEFF${csv}\n`, 'utf8');

console.log(`survey-T3-weight-bands.csv: ${rows.length - 1} dòng`);
console.log(`Dòng sản phẩm BR-03 lệch danh mục API: ${saiLech.length}/${DONG_SAN_PHAM.length}`);
for (const s of saiLech) console.log(`  - ${s}`);
