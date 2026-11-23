import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ga-booking-btn', { timeout: 20000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15000 });
const modal = page.locator('.bk-modal');

// --- Buoc 1 ---
out.buoc1 = await modal.evaluate((m) => ({
  html: m.innerHTML.slice(0, 4000),
  svcCount: m.querySelectorAll('.bk-svc').length,
}));

// Chon dich vu Tắm
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
out.nutSauChonDichVu = await modal.getByRole('button', { name: /Tiếp tục/ }).isEnabled();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

// --- Buoc 2 ---
out.buoc2 = await modal.evaluate((m) => ({
  html: m.innerHTML.slice(0, 6000),
  petCount: m.querySelectorAll('.bk-pet').length,
  inputs: [...m.querySelectorAll('input')].map((i) => ({ ph: i.placeholder, cls: i.className })),
  species: [...m.querySelectorAll('.bk-species-group *')].slice(0, 30).map((e) => ({
    tag: e.tagName,
    cls: e.className,
    txt: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
  })),
}));
out.nutTiepTucBuoc2ChuaChon = await modal.getByRole('button', { name: /Tiếp tục/ }).isEnabled();

// Chon loài Mèo xem danh sach doi khong
const speciesBtns = await modal.locator('.bk-species-group button, .bk-species-label').count();
out.speciesCount = speciesBtns;

// chon chó vừa + ten
await modal.locator('.bk-pet').filter({ hasText: 'Chó vừa' }).first().click();
await page.waitForTimeout(300);
out.nutTiepTucBuoc2ChonCânNặngChưaTen = await modal.getByRole('button', { name: /Tiếp tục/ }).isEnabled();
await modal.locator('.bk-input').first().fill('Bé Test');
await page.waitForTimeout(300);
out.nutTiepTucBuoc2ChonCânNặngCóTen = await modal.getByRole('button', { name: /Tiếp tục/ }).isEnabled();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

// --- Buoc 3 ---
out.buoc3 = await modal.evaluate((m) => ({
  dayCount: m.querySelectorAll('.bk-day').length,
  dayText: [...m.querySelectorAll('.bk-day')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  timeCount: m.querySelectorAll('.bk-time').length,
  timeText: [...m.querySelectorAll('.bk-time')].map((e) => (e.textContent || '').trim()),
  dateInputs: m.querySelectorAll('input[type=date]').length,
  html: m.innerHTML.slice(0, 2500),
}));

// Quay lai buoc 2 - kiem tra giu lua chon
await modal.getByRole('button', { name: /Quay lại/ }).click();
await page.waitForTimeout(700);
out.buoc2SauQuayLai = await modal.evaluate((m) => ({
  petOn: [...m.querySelectorAll('.bk-pet.is-on, .bk-pet.sel, .bk-pet[aria-pressed=true]')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  inputs: [...m.querySelectorAll('input')].map((i) => i.value),
}));
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(600);
// chon ngay + gio
await modal.locator('.bk-day').nth(1).click();
await page.waitForTimeout(200);
await modal.locator('.bk-time').nth(1).click();
await page.waitForTimeout(200);
out.nutTiepTucBuoc3 = await modal.getByRole('button', { name: /Tiếp tục/ }).isEnabled();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

// --- Buoc 4 ---
out.buoc4 = await modal.evaluate((m) => ({
  locCount: m.querySelectorAll('.bk-loc').length,
  locText: [...m.querySelectorAll('.bk-loc')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  inputs: [...m.querySelectorAll('input')].map((i) => ({ ph: i.placeholder, cls: i.className, type: i.type })),
  btnLabels: [...m.querySelectorAll('button')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean),
  hasError: /lỗi|không hợp lệ|required|vui lòng/i.test(m.textContent || ''),
}));

fs.writeFileSync('reports/raw/probe-t1-spec-dom.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
