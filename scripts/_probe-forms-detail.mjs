import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: attributes form T1 buoc 4, dung chieu FAQ vs card, form T2, search overlay T2. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

/* ---- T1: buoc 4 attributes ---- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(600);
await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await page.waitForTimeout(300);
await modal.locator('.bk-input').first().fill('Bé Test');
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(1000);
if ((await modal.locator('.bk-time').count()) > 0) {
  await modal.locator('.bk-time').first().click();
  await page.waitForTimeout(300);
}
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(1000);

K.t1_buoc4_form = await modal.locator('input, textarea, button').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.type ?? '',
    ph: e.placeholder ?? '',
    required: e.required ?? false,
    maxlength: e.maxLength ?? null,
    pattern: e.pattern ?? '',
    ariaRequired: e.getAttribute('aria-required') ?? '',
    cls: e.className,
    text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
  })),
);

// Bấm "Xác nhận đặt lịch" với SĐT rỗng để xem có validate không (KHÔNG gửi được).
const nutXacNhan = modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
K.t1_nutXacNhanCo = (await nutXacNhan.count()) > 0;
if (K.t1_nutXacNhanCo) {
  // Không bấm gửi (ADR-11) — chỉ ghi nhận trạng thái nút khi thiếu SĐT.
  K.t1_nutXacNhanDisabled = await nutXacNhan.isDisabled();
  K.t1_thongBaoLoi = (await page.locator('body').innerText()).match(
    /[^\n]*(bắt buộc|không được để trống|vui lòng nhập|số điện thoại[^\n]*)[^\n]*/gi,
  );
}

/* ---- T1: dung chieu gia card vs FAQ ---- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);
K.t1_giaVsFaq = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.hm-svc')].map((e) =>
    (e.textContent || '').replace(/\s+/g, ' ').trim(),
  );
  const faq = [...document.querySelectorAll('.hm-faq')].map((e) =>
    (e.textContent || '').replace(/\s+/g, ' ').trim(),
  );
  const cau = [...document.querySelectorAll('.hm-faq__q')].map((e) =>
    (e.textContent || '').replace(/\s+/g, ' ').trim(),
  );
  const phuThu = cards
    .map((c) => {
      const ten = c.match(/(Combo Tắm \+ Vệ sinh|Combo Tắm \+ Cạo|Combo Tắm \+ Cắt tỉa|Cạo lông|Cắt tỉa lông|Tắm)/)?.[0];
      const pt = c.match(/Phụ thu tận nhà:\s*\+([\d.]+)₫/)?.[1];
      return { ten, phuThu: pt };
    })
    .filter((x) => x.ten);
  return { phuThu, cau, faq };
});

/* ---- T2: form + search overlay ---- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1800);
K.t2_form = await page.evaluate(() => {
  const labels = [...document.querySelectorAll('label')].map((l) => (l.textContent || '').trim());
  const inputs = [...document.querySelectorAll('input')].map((i) => ({
    id: i.id,
    type: i.type,
    ph: i.placeholder,
    required: i.required,
    min: i.min,
    max: i.max,
    ariaReq: i.getAttribute('aria-required') ?? '',
  }));
  const buttons = [...document.querySelectorAll('button')].map((b) =>
    (b.textContent || '').replace(/\s+/g, ' ').trim(),
  );
  const t = document.body.innerText;
  return {
    labels,
    inputs,
    buttons,
    coDongY: /đồng ý.*liên hệ lại|liên hệ lại qua điện thoại/i.test(t),
    doanDongY: (() => {
      const i = t.search(/đồng ý/i);
      return i >= 0 ? t.slice(Math.max(0, i - 100), i + 300) : '';
    })(),
    coGioXacNhan: /gọi xác nhận|xác nhận khung giờ/i.test(t),
  };
});

// Nut tim kiem overlay
const nutSearch = page.locator('button[aria-label*="Tìm kiếm" i], button[aria-label*="Search" i]').first();
K.t2_searchNut = (await nutSearch.count()) > 0;
if (K.t2_searchNut) {
  await nutSearch.click();
  await page.waitForTimeout(800);
  K.t2_searchOverlay = await page.evaluate(() => {
    const inp = [...document.querySelectorAll('input')].filter((i) => i.offsetParent !== null);
    return inp.map((i) => ({ ph: i.placeholder, type: i.type, id: i.id }));
  });
  const onSearch = page.locator('input[placeholder*="Tìm" i], input[type=search]').first();
  if ((await onSearch.count()) > 0) {
    await onSearch.fill('spa');
    await page.waitForTimeout(1500);
    K.t2_searchKetQua = (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(0, 1200);
    await onSearch.fill('SPA');
    await page.waitForTimeout(1500);
    K.t2_searchKetQuaHoa = (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(0, 1200);
    await onSearch.fill('');
    await page.waitForTimeout(1200);
    K.t2_searchRong = (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(0, 900);
  }
}

fs.writeFileSync('reports/raw/probe-forms-detail.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 20000));
await browser.close();
