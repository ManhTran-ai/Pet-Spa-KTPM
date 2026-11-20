import { chromium } from '@playwright/test';

/** Cấu trúc con trực tiếp của ul chứa danh mục (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

const dom = await page.evaluate(() => {
  const uls = [...document.querySelectorAll('ul.MuiList-root')];
  const ul = uls.find((u) => u.querySelector('.NameAndDesc-name'));
  const con = [...ul.children].map((el) => ({
    tag: el.tagName,
    cls: String(el.className).slice(0, 60),
    header: el.querySelector('.MuiListItemText-primary')?.textContent?.trim() ?? null,
    soDichVu: el.querySelectorAll('.NameAndDesc-name').length,
    tenDichVuDau: el.querySelector('.NameAndDesc-name')?.textContent?.trim() ?? null,
  }));
  return { soUl: uls.length, soCon: con.length, con };
});

console.log('uls:', dom.soUl, 'con:', dom.soCon);
for (const c of dom.con) {
  console.log(`${c.tag}.${c.cls} | header=${c.header} | dv=${c.soDichVu} | dau=${c.tenDichVuDau}`);
}

await browser.close();
