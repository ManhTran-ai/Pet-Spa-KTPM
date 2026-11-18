import fs from 'node:fs';

/**
 * Kiểm tra chi tiết ngưỡng cân nặng từng dịch vụ T3 trong API (Ngày 2 — Ngân).
 * BR-03 (SRS-01 v1.1) mô tả ngưỡng theo từng dòng sản phẩm; cần xác minh
 * các ngưỡng đó có suy ra được từ dữ liệu API hay không.
 */
const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));

for (const nhom of raw.data.obj) {
  console.log(`\n=== ${nhom.name} (${nhom.services.length}) ===`);
  for (const s of nhom.services) {
    const weight = s.weight_limit && s.weight_limit.trim() !== '' ? s.weight_limit : '(rỗng)';
    const weightObj = s.weight_limit_obj
      ? JSON.stringify(s.weight_limit_obj).replace(/\s+/g, ' ')
      : '(null)';
    console.log(
      [
        `  ${s.name}`,
        `price=${s.price}`,
        `dur=${s.duration}`,
        `size="${s.size}"`,
        `weight_limit="${weight}"`,
        `weight_limit_obj=${weightObj.slice(0, 120)}`,
      ].join(' | '),
    );
  }
}
