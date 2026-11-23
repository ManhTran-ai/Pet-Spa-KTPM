import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// T2 FAQ page
await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
out.faq = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    status: 200,
    tieuDe: document.title,
    coHuy: /hủy|huy|huỷ/i.test(t),
    coDoiLich: /đổi lịch|doi lich|dời lịch/i.test(t),
    coHoanCoc: /hoàn cọc|hoan coc|hoàn tiền|hoàn lại|refund|đặt cọc/i.test(t),
    doan: t.slice(0, 2500).replace(/\s+/g, ' '),
  };
});

// T2 trang chu - noi dung quy trinh / xac nhan
await page.goto('https://matpet.vn/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.trangChu = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.search(/quy trình|Quy trình|QUY TRÌNH/);
  return {
    coQuyTrinh: i >= 0,
    doan: i >= 0 ? t.slice(i - 100, i + 800).replace(/\s+/g, ' ') : '',
    coXacNhanLich: /xác nhận (lịch|khung giờ)|sẽ gọi/i.test(t),
    doanXacNhan: (t.match(/.{0,150}(xác nhận lịch|xác nhận khung giờ|sẽ gọi).{0,150}/i) || [''])[0].replace(/\s+/g, ' '),
  };
});

// T2 nut doi ngon ngu tren tung trang
for (const p of ['/spa', '/en/spa']) {
  await page.goto('https://matpet.vn' + p, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  out['lang_' + p] = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="/en"], a[href*="/vi"]')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.textContent || '').trim(),
      aria: a.getAttribute('aria-label'),
    })),
  );
}

// T2 trang tim be thuong + bao hanh co yeu cau dang nhap?
for (const p of ['/tim-be-thuong', '/bao-hanh']) {
  await page.goto('https://matpet.vn' + p, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  out['trang_' + p] = await page.evaluate(() => ({
    coDangNhap: /đăng nhập|đăng ký|tạo tài khoản|sign in|log ?in/i.test(document.body.innerText),
    coForm: document.querySelectorAll('input[type=password]').length,
  }));
}

// T2: danh muc co nhom "Combo tron goi" / "Dich vu le" / "Nhuom" / "Bao gia rieng"?
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2000);
out.nhomDichVu = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coComboTrongGoi: /Combo trọn gói/i.test(t),
    coDichVuLe: /Dịch vụ lẻ/i.test(t),
    coNhuom: /NHUỘM|Nhuộm tạo kiểu/i.test(t),
    coBaoGiaRieng: /DỊCH VỤ BÁO GIÁ RIÊNG|Báo giá riêng/i.test(t),
    soNhom: (t.match(/Combo trọn gói|Dịch vụ lẻ|NHUỘM TẠO KIỂU|DỊCH VỤ BÁO GIÁ RIÊNG/gi) || []).length,
  };
});

// T2: co mo ta "bao gom" / thoi luong trong danh muc?
out.dichVuMoTa = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coBaoGom: /bao gồm|bao gom|bao gồm:/i.test(t),
    coThoiLuong: /\d+\s*(phút|’|')/i.test(t),
    doan: (t.match(/.{0,120}(bao gồm|phút).{0,120}/i) || [''])[0].replace(/\s+/g, ' '),
  };
});

// T2: gia cuoi xac nhan tai spa
out.giaCuoi = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coXacNhan: /Giá cuối được xác nhận tại spa/i.test(t),
    doan: (t.match(/.{0,60}Giá cuối được xác nhận tại spa.{0,120}/i) || [''])[0].replace(/\s+/g, ' '),
    coGosRoi: /gỡ rối|tẩy ố|tắm trắng/i.test(t),
  };
});

// T2: co nhan "Hôm nay"/"Ngay mai"/"Ngay khac"?
out.mocNgay = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coHomNay: /Hôm nay/i.test(t),
    coNgayMai: /Ngày mai/i.test(t),
    coNgayKhac: /Ngày khác/i.test(t),
  };
});

fs.writeFileSync('reports/raw/probe-t2-final2.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
