import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

/**
 * Kiểm thử tích hợp T1 (Pet NGON) — Ngày 10.
 *
 * Ba hợp đồng dữ liệu cần kiểm chứng giữa bảng giá tĩnh và wizard đặt lịch:
 *   HĐ-1  Bảng giá theo bậc cân nặng (`/vi` §pricing) ↔ giá hiển thị ở bước 2 wizard.
 *   HĐ-2  Phụ thu tại nhà theo gói (card dịch vụ) ↔ tổng tiền ở bước 4 wizard.
 *   HĐ-3  Phụ thu di chuyển theo khoảng cách (bảng giá §phụ thu) ↔ công thức tính.
 *
 * Phạm vi chỉ đọc (ADR-11): dừng ở bước xác nhận, không bấm "Xác nhận đặt lịch".
 */

const T1 = 'https://petngon.vn/vi';

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();

// ---------------------------------------------------------------- network log
const network = [];
page.on('response', (res) => {
  const url = res.url();
  if (!url.startsWith('http')) return;
  network.push({
    method: res.request().method(),
    status: res.status(),
    type: res.request().resourceType(),
    url: url.length > 120 ? `${url.slice(0, 120)}…` : url,
  });
});

const report = [];
const log = (s = '') => {
  console.log(s);
  report.push(s);
};

// Site đích đôi lúc chậm → thử lại để tránh báo lỗi hạ tầng giả (giống tests/support/http.ts).
async function gotoWithRetry(url, lan = 3) {
  let loi = null;
  for (let i = 1; i <= lan; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
      return;
    } catch (e) {
      loi = e;
      log(`  (mở trang lần ${i}/${lan} thất bại — thử lại)`);
      await page.waitForTimeout(3000);
    }
  }
  throw loi;
}

// ---------------------------------------------------------------- bảng giá tĩnh
await gotoWithRetry(T1);
await page.waitForTimeout(2500);

const bangGia = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const rows = [...table.querySelectorAll('tr')].map((tr) =>
    [...tr.querySelectorAll('th,td')].map((c) => c.textContent?.trim() ?? ''),
  );
  return { rows, headers: [...table.querySelectorAll('thead th')].map((th) => th.textContent?.trim()) };
});

log('========== HĐ-1: BẢNG GIÁ TĨNH ==========');
log(`tiêu đề cột: ${JSON.stringify(bangGia?.headers ?? [])}`);
for (const row of bangGia?.rows ?? []) log(JSON.stringify(row));

/** Chuyển bảng giá tĩnh thành map: "Chó nhỏ" → { "3–5kg": "155.000₫", ... } */
const giaTinh = new Map();
const dichVu = (bangGia?.headers ?? []).slice(1);
let loaiHienTai = null;
for (const row of (bangGia?.rows ?? []).slice(1)) {
  const [nhan, ...gia] = row;
  if (gia.length === 0) {
    loaiHienTai = nhan;
    continue;
  }
  const ten = nhan.replace(/\s*(<\s*3kg|≤\s*3kg|3–5kg|5–10kg|10–15kg|15–20kg|20–25kg|25–30kg)\s*$/, '').trim();
  const kg = nhan.match(/<\s*3kg|≤\s*3kg|3–5kg|5–10kg|10–15kg|15–20kg|20–25kg|25–30kg/)?.[0] ?? '';
  const key = `${loaiHienTai} · ${ten}`;
  giaTinh.set(key, { kg, gia: Object.fromEntries(dichVu.map((d, i) => [d, gia[i] ?? ''])) });
}

// ---------------------------------------------------------------- wizard
async function moWizard() {
  await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
  const overlay = page.locator('.bk-overlay');
  await overlay.waitFor({ state: 'visible', timeout: 30_000 });
  return overlay;
}

log('\n========== HĐ-1: GIÁ WIZARD ↔ BẢNG GIÁ TĨNH ==========');
let khop = 0;
let lech = 0;
const bangLech = [];

for (const loai of ['Chó', 'Mèo']) {
  const bands = [...giaTinh.keys()].filter((k) => k.startsWith(`${loai} ·`));
  for (const key of bands) {
    const ten = key.split(' · ')[1];
    const { kg, gia: giaBan } = giaTinh.get(key);

    await gotoWithRetry(T1);
    await page.waitForTimeout(1400);
    const overlay = await moWizard();
    await overlay.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
    await page.waitForTimeout(400);
    await overlay.locator('.bk-pet').filter({ hasText: loai }).first().click();
    await page.waitForTimeout(800);
    await overlay.locator('button').filter({ hasText: 'Tiếp tục' }).click();
    await page.waitForTimeout(1300);

    // Giá trong thẻ bậc cân nặng của wizard (`em`)
    const the = await page.evaluate(
      (tenTim) =>
        [...document.querySelectorAll('.bk-pane')]
          .filter((p) => !p.hidden)
          .flatMap((p) => [...p.querySelectorAll('.bk-pet')])
          .map((el) => ({
            ten: el.querySelector('b')?.textContent?.trim(),
            kg: el.querySelector('span:not(.material-symbols-outlined)')?.textContent?.trim(),
            gia: el.querySelector('em')?.textContent?.trim(),
          }))
          .find((x) => x.ten === tenTim),
      ten,
    );

    const giaWiz = the?.gia ?? '(không thấy)';
    const giaTinhTam = giaBan['Tắm'];
    const dung = giaWiz === giaTinhTam && the?.kg === kg;

    if (dung) khop += 1;
    else {
      lech += 1;
      bangLech.push({ key, kg, giaWiz, giaTinhTam });
    }

    log(
      `${dung ? 'OK  ' : 'LECH'} ${key.padEnd(24)} ${String(the?.kg ?? '?').padEnd(8)} wizard=${giaWiz.padEnd(11)} bảng=${giaTinhTam}`,
    );

    await overlay.locator('.bk-close').click();
    await page.waitForTimeout(300);
  }
}

log(`\n→ khớp ${khop} · lệch ${lech} / ${khop + lech} cặp (loài × bậc)`);
for (const l of bangLech) log(`  LỆCH: ${JSON.stringify(l)}`);

// ---------------------------------------------------------------- HĐ-2
log('\n========== HĐ-2: PHỤ THU TẠI NHÀ ==========');
await gotoWithRetry(T1);
await page.waitForTimeout(2000);
const cards = await page.evaluate(() =>
  [...document.querySelectorAll('.hm-svc')].map((c) => ({
    tieuDe: c.querySelector('h3')?.textContent?.trim(),
    badge: c.querySelector('.hm-svc__home')?.textContent?.trim(),
    phuThu: c.querySelector('.hm-svc__home-note')?.textContent?.trim() ?? null,
  })),
);
for (const c of cards) log(JSON.stringify(c));

// Tổng tiền ở bước 4 khi chọn "Tận nhà" — kiểm cho TẤT CẢ gói hỗ trợ tại nhà.
log('\n--- HĐ-2: tổng tiền bước 4 theo từng gói tại nhà ---');
const GOI_TAI_NHA = [
  { ten: 'Tắm', phuThu: '50.000₫', giaGoc: '155.000₫' },
  { ten: 'Cạo lông', phuThu: '80.000₫', giaGoc: '110.000₫' },
  { ten: 'Combo Tắm + Vệ sinh', phuThu: '70.000₫', giaGoc: '265.000₫' },
  { ten: 'Combo Tắm + Cạo', phuThu: '100.000₫', giaGoc: '350.000₫' },
];

for (const goi of GOI_TAI_NHA) {
  await gotoWithRetry(T1);
  await page.waitForTimeout(1400);
  const ov = await moWizard();
  await ov.locator('.bk-svc').filter({ hasText: goi.ten }).first().click();
  await page.waitForTimeout(500);
  await ov.locator('.bk-pet').filter({ hasText: 'Chó' }).first().click();
  await page.waitForTimeout(800);
  await ov.locator('button').filter({ hasText: 'Tiếp tục' }).click();
  await page.waitForTimeout(1300);
  await ov.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(700);
  await ov.locator('.bk-input').first().fill('Bé Kiểm Thử');
  await page.waitForTimeout(700);
  await ov.locator('button').filter({ hasText: 'Tiếp tục' }).click();
  await page.waitForTimeout(1400);
  await ov.locator('button').filter({ hasText: /\d{2}\/\d{2}/ }).first().click();
  await page.waitForTimeout(500);
  await ov.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first().click();
  await page.waitForTimeout(700);
  await ov.locator('button').filter({ hasText: 'Tiếp tục' }).click();
  await page.waitForTimeout(1700);
  await ov.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).click();
  await page.waitForTimeout(1500);

  const text = await ov.innerText();
  const tamTinh = text.match(/Tạm tính\s*\n?\s*([\d.]+₫)/)?.[1] ?? '(không thấy)';
  const coPhuThu = text.includes(goi.phuThu);
  // Kiểm chứng bằng phép cộng thật: Tạm tính = giá gói + phụ thu tại nhà.
  const cong = (a, b) => Math.round((Number(a.replace(/\D/g, '')) + Number(b.replace(/\D/g, ''))) / 1000) * 1000;
  const tongExpected = `${cong(goi.giaGoc, goi.phuThu).toLocaleString('vi-VN')}₫`;
  const tongDung = tamTinh === tongExpected;

  log(
    `  ${goi.ten.padEnd(22)} ${goi.giaGoc} + ${goi.phuThu.padEnd(11)} = ${tongExpected.padEnd(11)} · ` +
      `Tạm tính=${tamTinh.padEnd(11)} ${coPhuThu ? 'có ghi phụ thu' : 'THIẾU ghi phụ thu'} · ${tongDung ? 'KHỚP' : 'LỆCH'}`,
  );
  if (goi.ten === 'Tắm') {
    log(`  --- chi tiết bước 4 (gói Tắm) ---`);
    log(
      text
        .split('\n')
        .filter((l) => l.trim())
        .slice(-22)
        .join('\n'),
    );
  }
  await ov.locator('.bk-close').click();
  await page.waitForTimeout(400);
}

// ---------------------------------------------------------------- HĐ-3
log('\n========== HĐ-3: PHỤ THU DI CHUYỂN ==========');
await gotoWithRetry(T1);
await page.waitForTimeout(2000);
const phuThuDiChuyen = await page.evaluate(() => {
  const body = document.body.innerText;
  const idx = body.search(/PHỤ THU DI CHUYỂN/i);
  return idx >= 0 ? body.slice(idx, idx + 700) : '(không tìm thấy bảng phụ thu)';
});
log(phuThuDiChuyen);

// ---------------------------------------------------------------- network
log('\n========== NETWORK ==========');
const apiCalls = network.filter((n) => n.type === 'xhr' || n.type === 'fetch');
const domainCounts = {};
for (const n of network) {
  const host = new URL(n.url).host;
  domainCounts[host] = (domainCounts[host] ?? 0) + 1;
}
log(`tổng request: ${network.length} · XHR/fetch: ${apiCalls.length}`);
log('theo domain:');
for (const [host, count] of Object.entries(domainCounts).sort((a, b) => b[1] - a[1])) {
  log(`  ${host}: ${count}`);
}
log('\nrequest ngoài domain của site (dữ liệu gửi đi):');
for (const c of apiCalls) {
  const host = new URL(c.url).host;
  if (!host.includes('petngon.vn')) log(`  ${c.method} ${c.status} ${c.url}`);
}
const byStatus = {};
for (const n of network) byStatus[n.status] = (byStatus[n.status] ?? 0) + 1;
log(`\nphân bổ theo status: ${JSON.stringify(byStatus)}`);

await writeFile('reports/raw/day-13-integration-t1.txt', `${report.join('\n')}\n`, 'utf8');
await browser.close();
