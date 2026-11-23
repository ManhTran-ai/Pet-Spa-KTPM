import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ---------- T1 ----------
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

out.t1 = {};

// 1) Trang chu: co bao gio mo cua?
out.t1.trangChu = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coGio: /\d{1,2}\s*[:hH]\s*\d{2}\s*[-–—]\s*\d{1,2}\s*[:hH]?\s*\d{0,2}/.test(t),
    doan: (t.match(/.{0,80}\d{1,2}\s*[:hH]\s*\d{2}\s*[-–—]\s*\d{1,2}\s*[:hH]?\s*\d{0,2}.{0,80}/) || [''])[0].replace(/\s+/g, ' '),
    coZalo: /zalo/i.test(t),
    coEmail: /[\w.+-]+@[\w-]+\.[\w.]+/.test(t),
    coPhone: /\(\+84\)|0\d{2}[\s.]?\d{3}[\s.]?\d{3}/.test(t),
  };
});

// 2) /vi/contact: gio mo cua?
await page.goto('https://petngon.vn/vi/contact', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.t1.contact = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coGio: /\d{1,2}\s*[:hH]\s*\d{2}\s*[-–—]\s*\d{1,2}\s*[:hH]?\s*\d{0,2}/.test(t),
    doan: (t.match(/.{0,120}GIỜ LÀM VIỆC.{0,120}/i) || [''])[0].replace(/\s+/g, ' '),
  };
});

// 3) Quy trinh + Zalo 5 phut tren trang chu
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.t1.quyTrinh = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('QUY TRÌNH');
  const j = t.indexOf('5 phút');
  return {
    coQuyTrinh4Buoc: /QUY TRÌNH/i.test(t) && /4 bước/i.test(t),
    co5Phut: j >= 0,
    doan5Phut: j >= 0 ? t.slice(Math.max(0, j - 200), j + 120).replace(/\s+/g, ' ') : '',
    coZaloTrong5Phut: j >= 0 && /zalo/i.test(t.slice(Math.max(0, j - 250), j + 120)),
    quyTrinh: i >= 0 ? t.slice(i, i + 700).replace(/\s+/g, ' ') : '',
  };
});

// 4) FAQ accordion: mo dong lap?
out.t1.faq = await page.evaluate(() => {
  const qs = [...document.querySelectorAll('.hm-faq__q')];
  return { so: qs.length, html: qs[0]?.outerHTML?.slice(0, 400) ?? null };
});

// 5) Wizard: trang thai nut Tien tuc o buoc 1 ngay khi mo
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15000 });
const modal = page.locator('.bk-modal');
await page.waitForTimeout(500);
out.t1.buoc1Initial = {
  nutDisabled: await modal.getByRole('button', { name: /Tiếp tục/ }).isDisabled(),
  svcDangChon: await modal.locator('.bk-svc.is-on').count(),
  loaiDangChon: await modal.locator('.bk-pet-grid--2 .bk-pet.is-on').count(),
};

// 6) Wizard: co the bo qua buoc chon loai? (Chó mac dinh is-on)
out.t1.bypassLoai = {
  loaiMacDinh: await modal.locator('.bk-pet-grid--2 .bk-pet.is-on').innerText().catch(() => ''),
  nutDisabled: await modal.getByRole('button', { name: /Tiếp tục/ }).isDisabled(),
};

// 7) Buoc 2: chon loai Meo doi danh sach
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
out.t1.buoc2 = {
  nutDisabledChuaChon: await modal.getByRole('button', { name: /Tiếp tục/ }).isDisabled(),
  soPet: await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').count(),
  petOn: await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet.is-on').count(),
  petOnText: await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet.is-on').innerText().catch(() => ''),
};

// 8) Dien thoai sai -> co thong bao loi?
await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await modal.locator('.bk-input').first().fill('Bé Test');
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
await modal.locator('.bk-time').first().click();
await page.waitForTimeout(200);
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(400);
const sdt = modal.locator('.bk-input[placeholder*="0987" i]');
await sdt.fill('abc');
await page.waitForTimeout(600);
out.t1.sdtChu = {
  nutDisabled: await modal.getByRole('button', { name: /Xác nhận/ }).isDisabled(),
  coThongBao: /lỗi|không hợp lệ|số điện thoại không|vui lòng nhập/i.test(await modal.innerText()),
};
await sdt.fill('0987654321');
await page.waitForTimeout(600);
out.t1.sdtHopLe = {
  nutDisabled: await modal.getByRole('button', { name: /Xác nhận/ }).isDisabled(),
  tong: await modal.locator('.bk-summary__row--total b, .bk-summary__row--total').last().innerText().catch(() => ''),
};
await sdt.fill('123');
await page.waitForTimeout(600);
out.t1.sdtNgan = {
  nutDisabled: await modal.getByRole('button', { name: /Xác nhận/ }).isDisabled(),
  coThongBao: /lỗi|không hợp lệ|vui lòng nhập/i.test(await modal.innerText()),
};

// 9) EN page: con chuoi Viet?
await page.goto('https://petngon.vn/en', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.t1.en = await page.evaluate(() => {
  const t = document.body.innerText;
  const viet = t.match(/[ăâđêôơưĂÂĐÊÔƠƯ]{2,}[^\n]{0,40}/g) || [];
  return { tieuDe: document.title, soChuoiViet: viet.length, vi: viet.slice(0, 10), dau: t.slice(0, 400).replace(/\s+/g, ' ') };
});

fs.writeFileSync('reports/raw/probe-t1-final2.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
