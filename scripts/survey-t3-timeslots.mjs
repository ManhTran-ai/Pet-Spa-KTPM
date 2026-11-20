import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Thống kê toàn bộ khung giờ T3 trả về trong 30 ngày tới (Ngày 12 — Ngân).
 * Mục đích kiểm chứng ràng buộc giờ mở cửa 08:00–20:00 (BR-13, FR-M5-06).
 * ADR-11: chỉ GET, không tạo lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const raw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
const flat = [];
for (const cat of raw.data.obj) for (const s of cat.services) flat.push(s);

const chon = (ten) => flat.find((s) => s.name === ten);
const dichVu = [chon('Dog Bath 20-50lbs'), chon('Dog Full Groom  31 - 40lbs'), chon('Cat Bath')].filter(Boolean);

const rows = [['Service', 'Date', 'Status', 'Staff', 'Slots_raw', 'Slots_HH:MM', 'Outside_08_20']];

for (const svc of dichVu) {
  const params = {
    service_ids: String(svc.id),
    duration: String(svc.duration),
    start_date: '2026-11-23',
    end_date: '2026-12-23',
    services: JSON.stringify([{ pet_id: 0, service_id: svc.id, price: svc.price, duration: svc.duration }]),
    pets: JSON.stringify([{ pet_id: 0, weight: 0 }]),
  };
  const qs = new URLSearchParams(params).toString();
  const body = await page.evaluate(async (url) => (await fetch(url)).text(), `/booking-api/v1/available-time?${qs}`);
  const json = JSON.parse(body);
  const list = json.data?.list ?? {};

  for (const [ngay, v] of Object.entries(list)) {
    const slots = [];
    for (const st of v.available_staff ?? []) for (const t of st.staff_available_time ?? []) slots.push(t);
    const hhmms = slots
      .map((t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
      .sort();
    const ngoai = slots.filter((t) => t < 480 || t >= 1200);
    rows.push([
      svc.name,
      ngay,
      String(v.status),
      (v.available_staff ?? []).length,
      slots.join(' '),
      hhmms.join(' '),
      ngoai.join(' '),
    ]);
  }
}

const csv = rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
fs.writeFileSync('reports/raw/survey-T3-timeslots.csv', `\uFEFF${csv}\n`, 'utf8');

const ngoai = rows.slice(1).filter((r) => r[6].trim() !== '');
console.log(`survey-T3-timeslots.csv: ${rows.length - 1} dòng`);
console.log(`Khung giờ ngoài 08:00-20:00: ${ngoai.length}`);
for (const r of ngoai.slice(0, 10)) console.log(`  ${r[0]} ${r[1]} -> ${r[6]}`);

await browser.close();
