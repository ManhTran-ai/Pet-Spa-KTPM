import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: tim moi o tim kiem (input type=search / placeholder / the tu khoa) tren T2. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

const DUONG = ['/', '/spa', '/so-sanh', '/bang-gia', '/cho', '/meo', '/bao-hanh', '/showroom', '/cau-hoi-thuong-gap', '/blog'];
const ketQua = [];
for (const d of DUONG) {
  const resp = await page.goto(`https://matpet.vn${d}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  await page.waitForTimeout(1500);
  const inputs = await page.locator('input').evaluateAll((els) =>
    els.map((e) => ({
      type: e.getAttribute('type') || '(none)',
      placeholder: e.getAttribute('placeholder') || '',
      aria: e.getAttribute('aria-label') || '',
      name: e.getAttribute('name') || '',
      id: e.id || '',
      cls: e.className || '',
    })),
  );
  const buttons = await page.locator('button, [role=search], [role=button]').evaluateAll((els) =>
    els
      .map((e) => ({
        text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
        aria: e.getAttribute('aria-label') || '',
        cls: e.className || '',
      }))
      .filter((b) => /tìm|tim|search/i.test(b.text + ' ' + b.aria + ' ' + b.cls)),
  );
  ketQua.push({ duong: d, status: resp?.status() ?? 0, inputs, buttons });
  console.log(`\n### ${d} (${resp?.status() ?? 0})`);
  for (const i of inputs) console.log('  input:', JSON.stringify(i));
  for (const b of buttons) console.log('  button:', JSON.stringify(b));
}

fs.writeFileSync('reports/raw/probe-t2-search-all.json', JSON.stringify(ketQua, null, 2), 'utf8');
await browser.close();
