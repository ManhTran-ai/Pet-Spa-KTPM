import { chromium } from '@playwright/test';

const DIA_CHI = [
  ['Quận 1, TP. Hồ Chí Minh', 3.2],
  ['Phan Huy Ích, Bình Chánh', 5.8],
  ['Gò Vấp, TP. Hồ Chí Minh', 7.2],
  ['Thủ Đức, TP. Hồ Chí Minh', 12.4],
  ['Bình Chánh, TP. Hồ Chí Minh', 13.8],
  ['Yên Bái', 15.7],
];

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const [dc, kmExpected] of DIA_CHI) {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ga-booking-btn', { timeout: 20000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15000 });
  const modal = page.locator('.bk-modal');

  await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(500);
  await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await modal.locator('.bk-input[placeholder*="Bông" i]').fill('Bé Test');
  await page.waitForTimeout(250);
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(500);
  await modal.locator('.bk-day').nth(1).click();
  await modal.locator('.bk-time').nth(1).click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(500);
  await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(400);
  await modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]').fill(dc);
  await page.waitForTimeout(3000);

  const txt = (await modal.innerText()).replace(/\s+/g, ' ');
  const km = txt.match(/Khoảng cách ước tính\s*([\d.,]+)\s*km/);
  const phi = txt.match(/Phí di chuyển \(([^)]*)\)\s*\+?\s*([\d.]+)₫/);
  const lienHe = /Liên hệ[\s\S]{0,80}Báo giá riêng/i.test(txt);
  const baoGia = txt.match(/[^.]*Báo giá riêng[^.]*\./)?.[0]?.trim() ?? '(khong co)';
  console.log(
    `${dc} (kg ${km?.[1] ?? 'n/a'}, ky vong ${kmExpected})`.padEnd(58),
    '| phi:', phi ? phi[2] : 'n/a',
    '| LienHe:', lienHe,
  );
  console.log('    ->', baoGia.slice(0, 160));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}
await b.close();
