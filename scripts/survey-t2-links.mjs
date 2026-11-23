import { chromium, request } from '@playwright/test';

/** Tim lien ket chet (HTTP >= 400) trong menu/footer cua T2. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const api = await request.newContext();

await page.goto('https://matpet.vn/spa', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

const hrefs = await page
  .locator('header a[href], footer a[href], nav a[href]')
  .evaluateAll((l) => l.map((a) => a.href).filter((h) => h.startsWith('http')));

const chet = [];
for (const h of [...new Set(hrefs)]) {
  try {
    const r = await api.get(h, { maxRedirects: 3 });
    if (r.status() >= 400) chet.push(`${r.status()} ${h}`);
  } catch (e) {
    chet.push(`ERR ${h} ${e.message.split('\n')[0]}`);
  }
}
console.log('Tong lien ket:', new Set(hrefs).size);
console.log('Lien ket loi:', chet.length);
chet.forEach((c) => console.log(' ', c));

await api.dispose();
await browser.close();
