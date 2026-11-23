import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** working_hour + hour_format của T3 (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const r = await page.evaluate(async () => {
  const res = await fetch('/booking-api/v1/book-online-setting');
  return res.text();
});
fs.writeFileSync('reports/raw/survey-T3-setting-refresh.json', r, 'utf8');
const j = JSON.parse(r);
const o = j.data.obj;
console.log('hour_format:', o.hour_format);
console.log('arrival_window_before:', o.arrival_window_before, 'after:', o.arrival_window_after);
console.log('working_hour:', JSON.stringify(o.working_hour, null, 1));
console.log('skip_time_selection:', o.skip_time_selection);
console.log('business_type:', o.business_type, 'type:', o.type);

await browser.close();
