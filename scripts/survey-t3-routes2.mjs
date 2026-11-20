import { chromium } from '@playwright/test';

/** Thử các route Groomore trên domain T3 (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const paths = ['/form', '/form-v2', '/form-old', '/reschedule', '/gift-card', '/policy', '/terms', '/update-vacc', '/portal', '/report-card', '/outstanding'];

for (const path of paths) {
  const r = await page.evaluate(async (p) => {
    try {
      const res = await fetch(p, { method: 'GET' });
      return { status: res.status, body: (await res.text()).slice(0, 120) };
    } catch (e) {
      return { status: -1, body: String(e) };
    }
  }, path);
  console.log(`${r.status} ${path} :: ${r.body.replace(/\s+/g, ' ')}`);
}

await browser.close();
