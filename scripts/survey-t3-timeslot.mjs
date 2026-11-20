import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Gọi endpoint `available-time` của T3 để xem khung giờ nào được trả về
 * trong/ngoài giờ mở cửa (Ngày 12 — Ngân). Chỉ GET — không tạo lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
const flat = [];
for (const cat of raw.data.obj) for (const s of cat.services) flat.push({ cat: cat.name, ...s });

const dogBath = flat.find((s) => s.name === 'Dog Bath 20-50lbs');
const dogGroom = flat.find((s) => /Dog Full Groom  31 - 40lbs/.test(s.name));
console.log('dogBath id', dogBath?.id, 'price', dogBath?.price, 'dur', dogBath?.duration);
console.log('dogGroom id', dogGroom?.id, 'price', dogGroom?.price, 'dur', dogGroom?.duration);

const build = (svc) => ({
  service_ids: String(svc.id),
  duration: String(svc.duration),
  start_date: '2026-11-23',
  end_date: '2026-12-23',
  services: JSON.stringify([{ pet_id: 0, service_id: svc.id, price: svc.price, duration: svc.duration }]),
  pets: JSON.stringify([{ pet_id: 0, weight: 0 }]),
});

for (const svc of [dogBath, dogGroom].filter(Boolean)) {
  const params = build(svc);
  const qs = new URLSearchParams(params).toString();
  const r = await page.evaluate(async (url) => {
    const res = await fetch(url);
    return { status: res.status, body: (await res.text()).slice(0, 1500) };
  }, `/booking-api/v1/available-time?${qs}`);
  console.log(`\n=== ${svc.name} -> ${r.status} ===`);
  console.log(r.body.replace(/\s+/g, ' ').slice(0, 1200));
}

await browser.close();
