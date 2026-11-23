import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: kiem tra cac nghi van loi that cua T1 (mo trang moi cho moi phan). */
const browser = await chromium.launch({ channel: 'chrome' });
const ketQua = {};

async function moTrang() {
  const ctx = await browser.newContext({ locale: 'vi-VN' });
  const page = await ctx.newPage();
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  return { page, modal: page.locator('.bk-modal') };
}

async function sangBuoc4(page, modal) {
  await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(700);
  await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(250);
  await modal.locator('.bk-input[placeholder*="Bông" i]').fill('Bé Test');
  await page.waitForTimeout(250);
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(700);
  await modal.locator('.bk-day').nth(1).click();
  await page.waitForTimeout(150);
  await modal.locator('.bk-time').nth(1).click();
  await page.waitForTimeout(150);
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(700);
}

// (1) M4-001
{
  const { page, modal } = await moTrang();
  await sangBuoc4(page, modal);
  const sdt = modal.locator('.bk-input[placeholder*="0987"]');
  ketQua.M4_001 = { sdtCount: await sdt.count() };
  const nut = modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
  ketQua.M4_001.disabledTruoc = await nut.isDisabled();
  await sdt.fill('0987 654 321');
  await page.waitForTimeout(800);
  ketQua.M4_001.disabledSau = await nut.isDisabled();
  ketQua.M4_001.inputs = await modal.locator('input').evaluateAll((els) =>
    els.map((e) => ({ ph: e.getAttribute('placeholder'), val: e.value, cls: e.className })),
  );
  ketQua.M4_001.text = (await modal.innerText()).replace(/\n{2,}/g, '\n');
  await page.context().close();
}

// (2) M4-004 — buoc 2
{
  const { page, modal } = await moTrang();
  const nut = modal.getByRole('button', { name: /Tiếp tục/ });
  ketQua.M4_004 = {
    nutDisabledChuaChonDichVu: await nut.isDisabled(),
    stepLabels: await modal.locator('.bk-step').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
  };
  await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await nut.click();
  await page.waitForTimeout(900);
  ketQua.M4_004.activeSau = await modal.locator('.bk-step.is-active').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
  ketQua.M4_004.coClassIsActive = await modal.locator('.bk-step.is-active').count();
  ketQua.M4_004.text = (await modal.innerText()).replace(/\n{2,}/g, '\n').slice(0, 900);
  await page.context().close();
}

// (3) M6-004 / M6-018 / M6-019
{
  const { page, modal } = await moTrang();
  await sangBuoc4(page, modal);
  await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(500);
  const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
  const probe = [];
  for (const d of ['Phước Long, Bình Chánh', 'Yên Bái', 'Phú Cường, Thủ Dầu Một, Bình Dương', 'Gò Vấp, TP. Hồ Chí Minh']) {
    await onDiaChi.fill(d);
    await page.waitForTimeout(2600);
    const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
    const i = txt.indexOf('Khoảng cách');
    probe.push({
      diaChi: d,
      km: (txt.match(/Khoảng cách ước tính\s*\n?\s*([\d.,]+)\s*km/) || [])[1] ?? null,
      phiDong: (txt.match(/Phí di chuyển[^\n]*/g) || []),
      coBaoGia: /Báo giá riêng/i.test(txt),
      coLienHe: /Liên hệ/i.test(txt),
      excerpt: i >= 0 ? txt.slice(Math.max(0, i - 150), i + 500) : txt.slice(-700),
    });
  }
  ketQua.M6 = probe;
  await page.context().close();
}

// (4) M3-006 — the gia buoc 1 co khoang min-max?
{
  const { page, modal } = await moTrang();
  ketQua.M3_006 = {
    theGia: await modal.locator('.bk-svc').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
    theGiaPrice: await modal.locator('.bk-svc__price').allInnerTexts(),
  };
  await page.context().close();
}

// (5) M7-003 — FAQ accordion
{
  const ctx = await browser.newContext({ locale: 'vi-VN' });
  const page = await ctx.newPage();
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('.hm-faq__q', { timeout: 20_000 });
  const icon = async (i) =>
    (await page.locator('.hm-faq__q').nth(i).locator('.material-symbols-outlined').innerText()).trim();
  ketQua.M7_003 = { icon0: await icon(0), icon1: await icon(1), icon2: await icon(2) };
  await page.locator('.hm-faq__q').nth(1).click();
  await page.waitForTimeout(600);
  ketQua.M7_003.sauClick1 = [await icon(0), await icon(1), await icon(2)];
  // Click lai muc 1
  await page.locator('.hm-faq__q').nth(1).click();
  await page.waitForTimeout(600);
  ketQua.M7_003.sauClickLai = [await icon(0), await icon(1), await icon(2)];
  await ctx.close();
}

// (6) M1-005 — tran ngang 360px: tim phan tu gay tran
{
  const ctx = await browser.newContext({ locale: 'vi-VN', viewport: { width: 360, height: 740 } });
  const page = await ctx.newPage();
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  await page.waitForTimeout(1000);
  ketQua.M1_005 = await page.evaluate(() => {
    const de = document.documentElement;
    const tran = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > de.clientWidth + 1) {
        tran.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 70),
          right: Math.round(r.right),
          w: Math.round(r.width),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        });
      }
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      tran: tran.slice(0, 25),
    };
  });
  await ctx.close();
}

fs.writeFileSync('reports/raw/probe-t1-nghivan.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
