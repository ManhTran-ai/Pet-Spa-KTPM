import { chromium } from '@playwright/test';

/** Kiểm tra tràn ngang ở 360px và liệt kê liên kết chết trên T3 (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
const page = await context.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

const info = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  bodyScrollW: document.body.scrollWidth,
  rongNhat: [...document.querySelectorAll('*')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.right > 361)
    .slice(0, 10)
    .map(({ el, r }) => `${el.tagName}.${typeof el.className === 'string' ? el.className : ''} right=${Math.round(r.right)} w=${Math.round(r.width)}`),
}));

console.log(JSON.stringify(info, null, 2));

const links = await page.evaluate(() =>
  [...document.querySelectorAll('a')].map((a) => ({ text: a.textContent.trim(), href: a.href, target: a.target })),
);
console.log(JSON.stringify(links, null, 2));

await browser.close();
