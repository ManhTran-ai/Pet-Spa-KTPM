import { chromium } from '@playwright/test';

/**
 * Kiểm tra trạng thái giữ lựa chọn của drawer T3 khi đóng/mở lại
 * và liệt kê các khung giờ được đề nghị (Ngày 12 — Ngân).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

// Mở nhóm "Dog (bath included)" rồi bấm một dịch vụ.
await page.getByText('Dog (bath included)', { exact: false }).first().click();
await page.waitForTimeout(1500);

const service = page.locator('.NameAndDesc-name', { hasText: 'Dog Bath 20-50lbs' }).first();
await service.click();
await page.waitForTimeout(1500);

const state = async (nhan) => {
  const s = await page.evaluate(() => {
    const item = [...document.querySelectorAll('.NameAndDesc-name')].find((el) =>
      el.textContent.includes('Dog Bath 20-50lbs'),
    );
    const chain = [];
    let el = item;
    for (let i = 0; i < 5 && el; i += 1) {
      chain.push(`${el.tagName}.${typeof el.className === 'string' ? el.className : ''}`);
      el = el.parentElement;
    }
    const parent = item?.parentElement?.parentElement;
    return {
      chain,
      parentClass: parent?.className ?? '',
      parentHtml: parent?.outerHTML?.slice(0, 700) ?? '',
    };
  });
  console.log(`\n--- ${nhan} ---`);
  console.log(s.chain.join(' < '));
  console.log(s.parentHtml);
};

await state('sau khi bấm dịch vụ');

// Đóng drawer rồi mở lại.
const dong = page.locator('.MuiDrawer-paper').getByRole('button').first();
await page.keyboard.press('Escape');
await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(3000);
await page.getByText('Dog (bath included)', { exact: false }).first().click();
await page.waitForTimeout(1500);
await state('sau khi đóng và mở lại drawer');

await browser.close();
