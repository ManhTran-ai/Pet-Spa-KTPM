import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: khoa nut / bao qua buoc cua wizard T1. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

async function moWizard() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1200);
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  return page.locator('.bk-modal');
}

const modal = await moWizard();
const nut = modal.getByRole('button', { name: /Tiếp tục/ });

K.buoc1 = {
  nutDisabled: await nut.isDisabled(),
  coLoaiChon: await modal.locator('.bk-pet').count(),
  loaiTexts: await modal.locator('.bk-pet').evaluateAll((e) => e.map((x) => (x.textContent || '').trim())),
  coDichVu: await modal.locator('.bk-svc').count(),
};

// Bấm Tiếp tục ở bước 1 mà KHÔNG chọn dịch vụ (nút kỳ vọng bị khoá).
if (await nut.isEnabled()) {
  await nut.click();
  await page.waitForTimeout(800);
} else {
  K.nutBiuTocBuoc1 = 'disabled';
}
K.sauBamTiepTucBuoc1 = {
  buocDangActive: await modal.locator('.bk-step.is-active .bk-step__num').innerText(),
  buocLabel: await modal.locator('.bk-step.is-active .bk-step__label').innerText(),
  nutDisabled: await nut.isDisabled(),
  coBuoc2: await modal.locator('.bk-pet').count(),
};

// Quay lại bước 1 nếu được.
const quayLai = modal.getByRole('button', { name: /Quay lại/ });
if (await quayLai.count()) {
  await quayLai.click();
  await page.waitForTimeout(600);
}

// Chọn dịch vụ → sang bước 2, KHÔNG chọn bậc cân nặng → bấm Tiếp tục.
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await page.waitForTimeout(400);
K.sauChonDichVu = { nutDisabled: await nut.isDisabled() };

await nut.click();
await page.waitForTimeout(800);
K.buoc2 = {
  nutDisabled: await nut.isDisabled(),
  chips: await modal.locator('.bk-pet').evaluateAll((e) => e.map((x) => ({ cls: x.className, t: (x.textContent || '').replace(/\s+/g, ' ').trim() }))),
  coChonTruoc: await modal.locator('.bk-pet.is-on').count(),
};

// Bấm Tiếp tục khi chưa chọn bậc cân nặng (nút kỳ vọng bị khoá → không click được).
if (await nut.isEnabled()) {
  await nut.click();
  await page.waitForTimeout(800);
} else {
  K.nutBiuTocBuoc2 = 'disabled';
}
K.sauBamTiepTucBuoc2 = {
  buocDangActive: await modal.locator('.bk-step.is-active .bk-step__num').innerText(),
  buocLabel: await modal.locator('.bk-step.is-active .bk-step__label').innerText(),
  nutDisabled: await nut.isDisabled(),
};

/* Quay lại từ bước 3 giữ lựa chọn */
const modal2 = await moWizard();
await modal2.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal2.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(600);
await modal2.locator('.bk-pet').filter({ hasText: 'Chó vừa' }).first().click();
await page.waitForTimeout(400);
await modal2.locator('.bk-input').first().fill('Bé Test');
await modal2.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);
const t3 = {
  buoc: await modal2.locator('.bk-step.is-active .bk-step__num').innerText(),
  soNgay: await modal2.locator('.bk-day').count(),
};
await modal2.getByRole('button', { name: /Quay lại/ }).click();
await page.waitForTimeout(800);
const quayLaiState = {
  buoc: await modal2.locator('.bk-step.is-active .bk-step__num').innerText(),
  chips: await modal2.locator('.bk-pet').evaluateAll((e) => e.map((x) => ({ cls: x.className, t: (x.textContent || '').replace(/\s+/g, ' ').trim() }))),
  giaTen: await modal2.locator('.bk-input').first().inputValue(),
};
K.quayLai = { t3, quayLaiState };

/* Đổi lựa chọn: quay lại bước 1 rồi đổi dịch vụ */
let soQuay = 0;
while ((await modal2.locator('.bk-svc').count()) === 0 && soQuay < 4) {
  await modal2.getByRole('button', { name: /Quay lại/ }).click();
  await page.waitForTimeout(700);
  soQuay += 1;
}
K.soQuayVeBuoc1 = soQuay;
await modal2.locator('.bk-svc').filter({ hasText: 'Cạo lông' }).first().click();
await page.waitForTimeout(500);
K.doiDichVu = {
  chips: await modal2.locator('.bk-pet').evaluateAll((e) => e.map((x) => ({ cls: x.className, t: (x.textContent || '').replace(/\s+/g, ' ').trim() }))),
  soInput: await modal2.locator('.bk-input').count(),
};

/* Đăng nhập? */
K.coYeuCauDangNhap = await modal2
  .locator('input[type=password], input[type=email], a[href*="login"], a[href*="dang-nhap"]')
  .count();

fs.writeFileSync('reports/raw/probe-t1-wizard-flow.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1));
await browser.close();
