import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** T2 — validation form giu cho (bo trong SĐT) + nhan truong (NFR-03.2 / NFR-03.3). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const next = page.getByRole('button', { name: 'Tiếp tục →' });
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(1200);

const ketQua = {};

// Nhan truong form (NFR-03.3)
const labels = await page.locator('label, .lbl, [class*=label]').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean),
);
const inputs = await page.locator('input').evaluateAll((els) =>
  els.map((e) => ({
    type: e.getAttribute('type') ?? '',
    ph: e.getAttribute('placeholder') ?? '',
    name: e.getAttribute('name') ?? '',
    id: e.id ?? '',
    required: e.hasAttribute('required'),
    ariaReq: e.getAttribute('aria-required') ?? '',
    cls: e.className ?? '',
  })),
);
ketQua.nhan = { labels: [...new Set(labels)].slice(0, 20), inputs };
console.log('=== LABELS ===');
console.log(JSON.stringify([...new Set(labels)].slice(0, 20), null, 1));
console.log('=== INPUTS ===');
console.log(JSON.stringify(inputs, null, 1));

// Bấm "Giữ chỗ cho bé" khi SĐT rỗng -> coi thong bao loi (NFR-03.2)
const nut = page.locator('button', { hasText: 'Giữ chỗ cho bé' }).first();
const truoc = await page.locator('body').innerText();
await nut.click({ timeout: 8000 }).catch((e) => console.log('click err:', e.message.slice(0, 80)));
await page.waitForTimeout(1500);
const sau = await page.locator('body').innerText();

const doanLoi = sau.match(/[^.\n]{0,150}(Vui lòng|bắt buộc|không được|không được để trống|chưa nhập|required|SĐT|số điện thoại)[^.\n]{0,150}/gi) ?? [];
const khac = sau !== truoc;
const coAlert = await page.locator('[role=alert], .error, .invalid, [class*=err]').count();

ketQua.validation = {
  nutText: 'Giữ chỗ cho bé',
  noiDungThayDoi: khac,
  coThongBaoLoi: doanLoi.length > 0,
  doanLoi,
  soPhanTuLoi: coAlert,
};

console.log('\n=== VALIDATION ===');
console.log(JSON.stringify(ketQua.validation, null, 2));

// Neu khong co loi, in phan cuoi cua body de xem trang thai
if (!doanLoi.length) {
  const i = sau.indexOf('Số điện thoại');
  console.log('\n--- đoạn quanh form ---\n' + sau.slice(Math.max(0, i - 400), i + 900));
}

fs.writeFileSync('reports/raw/probe-t2-validation.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t2-validation.json');
await browser.close();
