import { chromium } from '@playwright/test';

/**
 * Dò endpoint `available-time` của T3 (Ngày 12 — Ngân) để xác định có thể
 * kiểm chứng khung giờ ngoài giờ mở cửa mà không tạo lịch hay không.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const paths = [
  '/booking-api/v1/available-time',
  '/booking-api/v1/available-time?business_id=33290',
  '/booking-api/v1/available-time?business_id=33290&service_id=340126',
  '/booking-api/v1/pet-option',
  '/booking-api/v1/breed',
  '/booking-api/v1/check-service-area',
];

for (const p of paths) {
  const r = await page.evaluate(async (path) => {
    try {
      const res = await fetch(path, { method: 'GET' });
      return { status: res.status, body: (await res.text()).slice(0, 250) };
    } catch (e) {
      return { status: -1, body: String(e) };
    }
  }, p);
  console.log(`${r.status} ${p}\n    ${r.body.replace(/\s+/g, ' ')}\n`);
}

await browser.close();
