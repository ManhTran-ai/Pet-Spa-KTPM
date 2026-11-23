import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Rà soát sâu NFR-04-005 — tràn ngang ở 360px (Tài, Ngày 11–12).
 *
 * Mục tiêu: xác định CHÍNH XÁC phần tử nào gây tràn, phạm vi bao nhiêu px,
 * và ảnh hưởng tới từng hệ thống (T1/T2/T3) thế nào.
 */

const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const VIEWPORT = { width: 360, height: 740 };
const browser = await chromium.launch({ channel: 'chrome' });
const ketQua = {};

for (const target of TARGETS) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'vi-VN' });
  const page = await ctx.newPage();
  await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);

  const chiTiet = await page.evaluate(() => {
    const de = document.documentElement;
    const clientWidth = de.clientWidth;
    const scrollWidth = de.scrollWidth;

    // Tim moi phan tu vuot qua canh phai
    const vuot = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > clientWidth + 1) {
        vuot.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 70),
          id: el.id || null,
          right: Math.round(r.right),
          width: Math.round(r.width),
          left: Math.round(r.left),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        });
      }
    });

    return {
      clientWidth,
      scrollWidth,
      tran: scrollWidth - clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      soPhanTuVuot: vuot.length,
      vuot: vuot.slice(0, 40),
    };
  });

  // Chup anh man hinh de lam bang chung
  await page.screenshot({ path: `reports/raw/nfr-04-005-${target.id}-360px.png`, fullPage: false });

  // Kiem tra cuon ngang co thuc su xay ra khong
  const coTheCuon = await page.evaluate(() => {
    const de = document.documentElement;
    de.scrollLeft = 9999;
    const maxScroll = de.scrollLeft;
    de.scrollLeft = 0;
    return { maxScroll, the: maxScroll > 0 };
  });

  console.log(`\n=== ${target.id} (${target.url}) ===`);
  console.log(
    `clientWidth=${chiTiet.clientWidth} scrollWidth=${chiTiet.scrollWidth} tran=${chiTiet.tran}px`,
  );
  console.log(`scrollLeft tối đa = ${coTheCuon.maxScroll} (cuộn được: ${coTheCuon.the})`);
  console.log(`Số phần tử vuột khung 360px: ${chiTiet.soPhanTuVuot}`);
  for (const v of chiTiet.vuot.slice(0, 12)) {
    console.log(`  <${v.tag}.${v.cls}> right=${v.right} w=${v.width} "${v.text}"`);
  }

  ketQua[target.id] = { ...chiTiet, coTheCuon };
  await ctx.close();
}

fs.writeFileSync('reports/raw/nfr-04-005-overflow.json', JSON.stringify(ketQua, null, 2), 'utf8');
await browser.close();
