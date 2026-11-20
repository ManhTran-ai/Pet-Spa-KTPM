import fs from 'node:fs';

/** Kiểm tra ngưỡng cân nặng (weight_limit_obj) của từng dịch vụ T3 — Ngày 12 — Ngân. */
const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));

for (const cat of raw.data.obj) {
  for (const s of cat.services) {
    const w = s.weight_limit;
    const obj = s.weight_limit_obj;
    const weights = obj?.weights ?? [];
    const chiTiet = Array.isArray(weights)
      ? weights.map((x) => `${x.min ?? x.weight_min ?? '?'}-${x.max ?? x.weight_max ?? '?'}`).join(',')
      : JSON.stringify(weights);
    console.log(`${cat.name} | ${s.name} | weight_limit="${w}" | weights=[${chiTiet}]`);
  }
}
