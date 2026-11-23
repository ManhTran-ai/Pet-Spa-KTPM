import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: dieu kien mo nut "Xac nhan dat lich" o buoc 4 cua T1 + thong bao loi. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

async function buoc4() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1200);
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  const modal = page.locator('.bk-modal');
  await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(300);
  await modal.locator('.bk-input').first().fill('Bé Test');
  await page.waitForTimeout(300);
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  if ((await modal.locator('.bk-time').count()) > 0) {
    await modal.locator('.bk-time').first().click();
    await page.waitForTimeout(300);
  }
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  return modal;
}

const modal = await buoc4();
const nut = modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
const inputs = modal.locator('.bk-input');

K.trangThai = {
  soInput: await inputs.count(),
  ph: await inputs.evaluateAll((e) => e.map((x) => x.getAttribute('placeholder'))),
  nutDisabled: await nut.isDisabled(),
};

// B1: dien SĐT, khong dien ten.
await inputs.nth(1).fill('0987654321');
await page.waitForTimeout(500);
K.chiSdt = { nutDisabled: await nut.isDisabled() };

// B2: them ten.
await inputs.nth(0).fill('Nguyễn Văn A');
await page.waitForTimeout(500);
K.tenVaSdt = { nutDisabled: await nut.isDisabled() };

// B3: xoa SĐT, giu ten.
await inputs.nth(1).fill('');
await page.waitForTimeout(600);
K.chiTen = {
  nutDisabled: await nut.isDisabled(),
  thongBao: (await modal.innerText()).match(/[^\n]*(bắt buộc|không được để trống|vui lòng|số điện thoại)[^\n]*/gi),
  doanLoi: (await modal.innerText()).replace(/\n{2,}/g, '\n').slice(-600),
};

// B4: SĐT sai dinh dang.
await inputs.nth(1).fill('abc');
await page.waitForTimeout(600);
K.sdtChu = { nutDisabled: await nut.isDisabled() };

// B5: SĐT qua ngan.
await inputs.nth(1).fill('123');
await page.waitForTimeout(600);
K.sdtNgan = { nutDisabled: await nut.isDisabled() };

// B6: SĐT hop le dai.
await inputs.nth(1).fill('0987 654 321');
await page.waitForTimeout(600);
K.sdtHopLe = { nutDisabled: await nut.isDisabled() };

fs.writeFileSync('reports/raw/probe-t1-submit-gate.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1));
await browser.close();
