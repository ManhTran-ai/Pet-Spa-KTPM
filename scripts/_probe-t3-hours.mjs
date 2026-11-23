import { chromium } from '@playwright/test';

/** Soi kỹ chuỗi giờ mở cửa trong Drawer của T3. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load' });
await page.waitForTimeout(3000);

const drawer = page.locator('.MuiDrawer-paper');
await drawer.waitFor({ state: 'visible', timeout: 20000 });
const body = await drawer.innerText();

console.log('=== 300 ky tu dau (JSON) ===');
console.log(JSON.stringify(body.slice(0, 300)));

const i = body.indexOf('AM');
console.log('\n=== 60 ky tu quanh "AM" ===');
console.log(JSON.stringify(body.slice(Math.max(0, i - 40), i + 40)));
console.log('Codes:', [...body.slice(Math.max(0, i - 12), i + 18)].map((c) => `${c}=${c.charCodeAt(0)}`).join(' '));

console.log('\n=== thu lai regex tren body raw ===');
console.log('AM-PM raw:', /\d{1,2}:\d{2}\s*AM\s*-\s*\d{1,2}:\d{2}\s*PM/i.test(body));
console.log('AM-PM gop dong:', /\d{1,2}:\d{2}\s*AM\s*-\s*\d{1,2}:\d{2}\s*PM/i.test(body.replace(/\s+/g, ' ')));
console.log('co "AM" rieng:', body.includes('AM'));

await browser.close();
