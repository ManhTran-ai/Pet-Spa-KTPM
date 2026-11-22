import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Đối chiếu giá và thời lượng dịch vụ T3: API `booking-api/v1/service` ↔ giao diện.
 *
 * Ngày 2 — Ngân (TV3). Đầu ra: `reports/raw/survey-T3-ui-prices.csv`.
 * ADR-11: chỉ đọc danh mục và giá, không bấm "Book Now".
 *
 * API trả giá tính bằng cent và thời lượng tính bằng phút.
 * Giao diện hiển thị `$52.00` và thời lượng dạng `30mins` / `1h`.
 */

const PAGE_URL = 'https://prettypawscatanddoggrooming.groomore.com/';

const UI_PRICE_SELECTOR = '.PriceAndDuration-price';
const UI_DURATION_SELECTOR = '.PriceAndDuration-duration';
const UI_NAME_SELECTOR = '.NameAndDesc-name';

/** Chuẩn hoá tên để đối chiếu: bỏ khoảng trắng thừa và vạch gạch nối. */
const chuanHoa = (text) => text.replace(/\s+/g, ' ').replace(/[-‐-―]/g, '-').trim();

/** `30mins` → 30; `1h` → 60; `1h 30mins` → 90. */
function phutTuText(text) {
  const clean = text.replace(/\s+/g, '').toLowerCase();
  if (clean === '' || clean === '0mins') return 0;

  let total = 0;
  const hours = clean.match(/(\d+)h/);
  const minutes = clean.match(/(\d+)m/);
  if (hours) total += Number(hours[1]) * 60;
  if (minutes) total += Number(minutes[1]);
  return total;
}

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto(PAGE_URL, { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

// Mở từng nhóm để toàn bộ dịch vụ nằm trong DOM.
const nhom = await page.evaluate(() =>
  [...document.querySelectorAll('.MuiListItemText-primary')].map((el) => el.textContent.trim()),
);
for (const tenNhom of nhom) {
  try {
    await page.getByText(tenNhom, { exact: false }).first().click({ timeout: 5000 });
    await page.waitForTimeout(800);
  } catch {
    /* nhóm không mở được thì bỏ qua */
  }
}

// Gom từng dịch vụ trên UI: tên, giá, thời lượng.
const ui = await page.evaluate(
  ({ priceSel, durSel, nameSel }) =>
    [...document.querySelectorAll(priceSel)].map((priceEl) => {
      const container = priceEl.parentElement?.parentElement;
      const nameEl = container?.querySelector(nameSel);
      const durEl = priceEl.parentElement?.querySelector(durSel);
      return {
        name: nameEl?.textContent?.trim() ?? '',
        price: priceEl.textContent.trim(),
        duration: durEl?.textContent?.trim() ?? '',
      };
    }),
  { priceSel: UI_PRICE_SELECTOR, durSel: UI_DURATION_SELECTOR, nameSel: UI_NAME_SELECTOR },
);

// Lấy danh mục từ API.
const apiRaw = JSON.parse(fs.readFileSync('reports/raw/survey-T3-services.json', 'utf8'));
const api = [];
for (const nhomApi of apiRaw.data.obj) {
  for (const service of nhomApi.services) {
    api.push({
      category: nhomApi.name,
      name: service.name,
      priceCents: service.price,
      durationMin: service.duration,
    });
  }
}

const apiTheoTen = new Map(api.map((s) => [chuanHoa(s.name), s]));

const rows = [['Service', 'API Price (cents)', 'API Duration (min)', 'UI Price', 'UI Duration', 'Match', 'Note']];
const khongKhop = [];

for (const item of ui) {
  const key = chuanHoa(item.name);
  const apiService = apiTheoTen.get(key);

  if (!apiService) {
    rows.push([item.name, '', '', item.price.replace('$', ''), String(phutTuText(item.duration)), 'NO', 'Không tìm thấy dịch vụ cùng tên trong API']);
    khongKhop.push(item.name);
    continue;
  }

  const uiPrice = Number(item.price.replace(/[^0-9.]/g, ''));
  const uiDuration = phutTuText(item.duration);
  const giaKhop = Math.abs(uiPrice - apiService.priceCents / 100) < 0.005;
  const thoiLuongKhop = uiDuration === apiService.durationMin;

  let note = '';
  if (!giaKhop) note = `Lệch giá API ${(apiService.priceCents / 100).toFixed(2)} vs UI ${uiPrice.toFixed(2)}`;
  else if (!thoiLuongKhop) note = `Lệch thời lượng API ${apiService.durationMin} phút vs UI ${uiDuration} phút`;

  rows.push([
    item.name,
    String(apiService.priceCents),
    String(apiService.durationMin),
    uiPrice.toFixed(2),
    String(uiDuration),
    giaKhop && thoiLuongKhop ? 'YES' : 'NO',
    note,
  ]);
  if (!giaKhop || !thoiLuongKhop) khongKhop.push(item.name);
}

// Dịch vụ có trong API nhưng không hiện trên UI.
const tenUi = new Set(ui.map((item) => chuanHoa(item.name)));
for (const apiService of api) {
  if (tenUi.has(chuanHoa(apiService.name))) continue;
  rows.push([
    apiService.name,
    String(apiService.priceCents),
    String(apiService.durationMin),
    '',
    '',
    'NO',
    'Có trong API nhưng không hiển thị trên danh mục UI đã mở',
  ]);
  khongKhop.push(apiService.name);
}

const csv = rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
fs.writeFileSync('reports/raw/survey-T3-ui-prices.csv', `\uFEFF${csv}\n`, 'utf8');

console.log(`survey-T3-ui-prices.csv: ${rows.length - 1} dòng`);
console.log(`UI đọc được: ${ui.length} dịch vụ · API: ${api.length} dịch vụ`);
console.log(`Khớp hoàn toàn: ${rows.length - 1 - khongKhop.length}/${rows.length - 1}`);
if (khongKhop.length > 0) console.log(`Lệch: ${khongKhop.join(' | ')}`);

await browser.close();
