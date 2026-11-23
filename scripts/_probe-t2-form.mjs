import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const next = page.locator('button:has-text("Tiếp tục →")').first();
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(500);
await next.click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(500);
await next.click();
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(800);
await page.locator('button:has-text("Giữ chỗ với mức giá này")').first().click();
await page.waitForTimeout(1500);

out.trangSauMoForm = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('GIỮ CHỖ');
  return {
    doan: i >= 0 ? t.slice(i, i + 700).replace(/\s+/g, ' ') : 'KHONG THAY',
    inputs: [...document.querySelectorAll('input')].map((i) => ({
      type: i.type,
      ph: i.placeholder,
      required: i.required,
      min: i.min,
      max: i.max,
      visible: i.offsetParent !== null,
    })),
    buttons: [...document.querySelectorAll('button')]
      .filter((b) => b.offsetParent !== null)
      .map((b) => ({ txt: (b.textContent || '').replace(/\s+/g, ' ').trim(), disabled: b.disabled }))
      .slice(-12),
  };
});

// Bấm nút gửi trong modal với SĐT rỗng
const nut = page.locator('button:has-text("Giữ chỗ →")').and(page.locator('visible=true')).first();
out.coNut = await nut.count();
if (out.coNut > 0) {
  await nut.click();
  await page.waitForTimeout(1200);
  out.sauBam = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      doan: (t.match(/.{0,150}(lỗi|không hợp lệ|vui lòng nhập|Số điện thoại).{0,200}/i) || [''])[0].replace(/\s+/g, ' '),
      coLoi: /lỗi|không hợp lệ|vui lòng nhập/i.test(t),
    };
  });
}

// Nhập SĐT sai định dạng
const sdt = page.locator('input[type=tel]').first();
if ((await sdt.count()) > 0) {
  await sdt.fill('abc');
  await page.waitForTimeout(500);
  out.sdtChu = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      doan: (t.match(/.{0,150}(lỗi|không hợp lệ|vui lòng nhập|Số điện thoại).{0,200}/i) || [''])[0].replace(/\s+/g, ' '),
      coLoi: /lỗi|không hợp lệ|vui lòng nhập/i.test(t),
    };
  });
  await sdt.fill('0987654321');
  await page.waitForTimeout(500);
  out.sdtHopLe = await page.evaluate(() => {
    const t = document.body.innerText;
    return { coLoi: /lỗi|không hợp lệ|vui lòng nhập/i.test(t) };
  });
}

fs.writeFileSync('reports/raw/probe-t2-form.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
