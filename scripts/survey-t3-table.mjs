import fs from 'node:fs';

/** Rút gọn danh mục dịch vụ T3 từ JSON API thành bảng tham chiếu (Ngày 2). */
const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
const rows = [['System', 'Category', 'Service', 'Price (USD)', 'Duration (min)', 'Has addon', 'Detail']];

for (const category of raw.data.obj) {
  for (const service of category.services) {
    rows.push([
      'T3',
      category.name,
      service.name,
      (service.price / 100).toFixed(2),
      String(service.duration),
      service.has_addon ? 'Yes' : 'No',
      (service.detail ?? '').replace(/\s+/g, ' ').trim().slice(0, 200),
    ]);
  }
}

const csv = rows
  .map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(','))
  .join('\n');
fs.writeFileSync('reports/raw/survey-T3-price-table.csv', `\uFEFF${csv}\n`, 'utf8');

for (const row of rows) console.log(row.slice(0, 6).join(' | '));
console.log(`\nTổng: ${rows.length - 1} dịch vụ trong ${raw.data.obj.length} nhóm`);
