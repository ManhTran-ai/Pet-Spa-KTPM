import { chromium } from '@playwright/test';

/**
 * Xác minh phản hồi API login của T3 và trạng thái UI sau khi gọi.
 * ADR-11: số giả dải 555-01xx, không hoàn tất đặt lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const apis = [];
page.on('response', async (res) => {
  const url = res.url();
  if (!url.includes('/booking-api/')) return;
  let body = '';
  try {
    body = (await res.text()).slice(0, 800);
  } catch {
    body = '<không đọc được>';
  }
  apis.push({ url: url.replace(/^https?:\/\/[^/]+/, ''), status: res.status(), method: res.request().method(), body });
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

await page.getByPlaceholder('Mobile number').first().fill('6095550199');
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Login' }).first().click();
await page.waitForTimeout(8000);

console.log('--- API ---');
for (const a of apis) {
  console.log(`${a.method} ${a.status} ${a.url}`);
  console.log(`   ${a.body.replace(/\s+/g, ' ')}`);
}

console.log('\n--- thông báo UI ---');
const msgs = await page.evaluate(() =>
  [
    ...document.querySelectorAll('.MuiAlert-root, .MuiSnackbar-root, [role="alert"], .MuiFormHelperText-root, .MuiTypography-root'),
  ]
    .map((el) => el.textContent?.trim() ?? '')
    .filter((t) => t && t.length < 300 && !/Pretty Paws|existing clients|NEW CLIENTS/i.test(t)),
);
console.log([...new Set(msgs)].join('\n'));

console.log('\n--- toàn bộ body innerText ---');
console.log((await page.evaluate(() => document.body.innerText)).slice(0, 1200));

await browser.close();
