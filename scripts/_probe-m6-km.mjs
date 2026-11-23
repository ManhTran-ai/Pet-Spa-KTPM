import { chromium } from '@playwright/test';

const DIA_CHI = [
  '1.09 A1 Westgate, Bình Chánh',
  'Võ Văn Kiệt, Thủ Dầu Một',
  'Trí Chánh, Củ Chi',
  'Bến Tây, Bình Dương',
  'Trung tâm Thành phố Hồ Chí Minh',
];

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const dc of DIA_CHI) {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ga-booking-btn', { timeout: 20000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15000 });
  const modal = page.locator('.bk-modal');

  await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await modal.locator('.bk-input[placeholder*="Bông" i]').fill('Bé Test');
  await page.waitForTimeout(300);
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-day').nth(1).click();
  await modal.locator('.bk-time').nth(1).click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(400);
  await modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]').fill(dc);
  await page.waitForTimeout(3000);

  const txt = (await modal.innerText()).replace(/\s+/g, ' ');
  const km = txt.match(/Khoảng cách ước tính\s*([\d.,]+)\s*km/);
  const phi = txt.match(/Phí di chuyển \(([^)]*)\)\s*\+?\s*([\d.]+)₫/);
  const tong = txt.match(/Tạm tính\s*([\d.]+)₫/);
  console.log(
    dc.padEnd(38),
    '| km:', km ? km[1] : 'n/a',
    '| phi:', phi ? `${phi[1]} -> ${phi[2]}` : (txt.match(/Phí di chuyển[^A-Z]{0,25}/i)?.[0] ?? 'n/a'),
    '| tong:', tong ? tong[1] : 'n/a',
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}
await b.close();
