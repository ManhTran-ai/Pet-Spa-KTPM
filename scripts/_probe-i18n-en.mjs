import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe i18n EN: nut chuyen ngon ngu cua T1 va T2 (dung selector da biet). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

for (const [ten, url, sel] of [
  ['t1', 'https://petngon.vn/vi', '.bn-locale'],
  ['t2', 'https://matpet.vn/spa', null],
]) {
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1800);

  const nut = sel ? page.locator(sel).first() : page.locator('header a:has-text("EN"), header button:has-text("EN")').first();
  const so = await nut.count();
  K[ten] = { soNut: so };
  if (so === 0) {
    const candidates = await page.locator('a, button').evaluateAll((els) =>
      els
        .map((e) => ({
          tag: e.tagName,
          text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          href: e.getAttribute('href') ?? '',
          aria: e.getAttribute('aria-label') ?? '',
          visible: !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length),
        }))
        .filter((x) => /^(VI|EN)$/.test(x.text) || /lang|EN\b|ngôn ngữ/i.test(x.aria + ' ' + x.href)),
    );
    K[ten].candidates = candidates;
    continue;
  }

  K[ten].nutHtml = await nut.evaluate((e) => e.outerHTML.slice(0, 300));
  await nut.click();
  await page.waitForTimeout(1500);

  // Dropdown: tim option EN.
  const options = page.locator('a, button, [role=menuitem]').filter({ hasText: /^\s*EN\s*$/ });
  K[ten].soOption = await options.count();
  if ((await options.count()) > 0) {
    await options.first().click();
    await page.waitForTimeout(3000);
  }
  K[ten].url = page.url();
  K[ten].tieuDe = await page.title();
  const en = await page.locator('body').innerText();
  K[ten].viConLai = en
    .split('\n')
    .filter((l) => /Đặt lịch|Dịch vụ|Trang chủ|Liên hệ|Bé cưng|Lịch hẹn|Địa điểm|Tiếp tục|Quay lại|Tắm|Cạo lông|Cân nặng|loài|Việt Nam/i.test(l))
    .slice(0, 15);
  K[ten].anh = en
    .split('\n')
    .filter((l) => /book|service|home|contact|pet|appointment|location|continue|back|bath|shave|weight/i.test(l))
    .slice(0, 15);
}

fs.writeFileSync('reports/raw/probe-i18n-en.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 8000));
await browser.close();
