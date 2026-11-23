import { chromium } from '@playwright/test';

/**
 * Điều tra TC-T3-M5-005 (FR-M5-07): trạng thái Open/Closed của T3.
 *
 * Ngày 2 — Ngân (TV3). Khảo sát ngày 14/11 thấy chữ "Closed" trong drawer;
 * lần chạy sau (18/11) không thấy. Cần xác định điều kiện render để kết luận
 * đây là lỗi sản phẩm hay hành vi phụ thuộc thời điểm / render bất đồng bộ.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

/** Ghi lại mọi response chứa "open"/"close"/"status"/"business". */
const apis = [];
page.on('response', async (res) => {
  const url = res.url();
  if (!url.includes('/booking-api/')) return;
  let body = '';
  try {
    body = (await res.text()).slice(0, 600);
  } catch {
    body = '<không đọc được>';
  }
  apis.push({ url: url.replace(/^https?:\/\/[^/]+/, ''), status: res.status(), body });
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });

// Chờ lâu hơn để trạng thái render bất đồng bộ có cơ hội xuất hiện.
for (const wait of [2000, 4000, 6000]) {
  await page.waitForTimeout(wait === 2000 ? 2000 : 2000);
  const snapshot = await page.evaluate(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    const text = drawer ? drawer.innerText.replace(/\s+/g, ' ') : '';
    return {
      hasStatus: /\b(Open|Closed)\b/.test(text),
      head: text.slice(0, 220),
      fullLen: text.length,
    };
  });
  console.log(`[sau ~${wait}ms] có trạng thái=${snapshot.hasStatus} · len=${snapshot.fullLen}`);
  console.log(`   head: ${snapshot.head}`);
}

console.log('\n--- API đã gọi ---');
for (const api of apis) console.log(`${api.status} ${api.url}\n   ${api.body.replace(/\s+/g, ' ').slice(0, 300)}`);

await browser.close();
