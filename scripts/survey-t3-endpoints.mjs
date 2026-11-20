import { chromium } from '@playwright/test';

/**
 * Dò các endpoint công khai của booking-api T3 (Ngày 12 — Ngân).
 * Chỉ GET/OPTIONS, không POST — không tạo lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const candidates = [
  '/booking-api/v1/service?booking_page=1',
  '/booking-api/v1/book-online-setting',
  '/booking-api/v1/appointment?booking_page=1',
  '/booking-api/v1/appointment-slot',
  '/booking-api/v1/slot',
  '/booking-api/v1/available-slot',
  '/booking-api/v1/staff',
  '/booking-api/v1/staff-service',
  '/booking-api/v1/login',
  '/booking-api/v1/form',
  '/booking-api/v1/business',
  '/booking-api/v1/policy',
];

for (const path of candidates) {
  const r = await page.evaluate(async (p) => {
    try {
      const res = await fetch(p, { method: 'GET' });
      const body = (await res.text()).slice(0, 200);
      return { status: res.status, body };
    } catch (e) {
      return { status: -1, body: String(e) };
    }
  }, path);
  console.log(`${r.status} ${path}\n    ${r.body.replace(/\s+/g, ' ').slice(0, 190)}`);
}

await browser.close();
