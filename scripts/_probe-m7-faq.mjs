import { chromium } from '@playwright/test';

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.hm-faq__q', { timeout: 20000 });

const snap = async (label) => {
  const data = await page.locator('.hm-faq__q').evaluateAll((els) =>
    els.map((e, i) => ({
      i,
      cls: e.className,
      icon: (e.querySelector('.material-symbols-outlined')?.textContent || '').trim(),
      aria: e.getAttribute('aria-expanded'),
      text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
    })),
  );
  console.log('---', label);
  data.forEach((d) => console.log(' ', d.i, '| cls:', d.cls, '| icon:', JSON.stringify(d.icon), '| aria:', d.aria, '|', d.text));
};

await snap('trang thai ban dau');
await page.locator('.hm-faq__q').nth(0).click();
await page.waitForTimeout(600);
await snap('sau khi click muc 0');
await page.locator('.hm-faq__q').nth(1).click();
await page.waitForTimeout(600);
await snap('sau khi click muc 1');

// So trang thai "mo" cua item 0 - dung DOM cha
const structure = await page.evaluate(() => {
  const q = document.querySelectorAll('.hm-faq__q')[0];
  const parent = q?.parentElement;
  return {
    qOuter: q?.outerHTML.slice(0, 600),
    parentCls: parent?.className,
    parentOuter: parent?.outerHTML.slice(0, 900),
  };
});
console.log('--- cau truc DOM item 0');
console.log(JSON.stringify(structure, null, 1));
await b.close();
