import { test, expect } from '@playwright/test';
import { getWithRetry } from '../support/http';

/**
 * NFR-07 — SEO và kỹ thuật bảo trì.
 * Kiểm tra thẻ meta, sitemap.xml, robots.txt trên 3 site đích.
 * Chỉ đọc (ADR-11).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

test.describe('NFR-07 — SEO và kỹ thuật bảo trì', () => {
  test('TC-NFR-07-001: Mỗi trang có một thẻ title duy nhất và không rỗng', async ({ browser }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      const titles = await page.locator('title').allTextContents();
      if (titles.length !== 1) problems.push(`${target.id} có ${titles.length} thẻ title`);
      else if (!titles[0]?.trim()) problems.push(`${target.id} có thẻ title rỗng`);
      await context.close();
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-07-002: Mỗi trang có thẻ meta description không rỗng', async ({ browser }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      const count = await page.locator('meta[name="description"]').count();
      if (count === 0) {
        problems.push(`${target.id} thiếu thẻ meta description`);
      } else {
        const content = await page.locator('meta[name="description"]').first().getAttribute('content', { timeout: 5000 });
        if (!content || !content.trim()) problems.push(`${target.id} có meta description rỗng`);
      }
      await context.close();
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-07-003: Thẻ html có thuộc tính lang', async ({ browser }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      const lang = await page.locator('html').getAttribute('lang', { timeout: 5000 });
      if (!lang || !lang.trim()) problems.push(`${target.id} thiếu thuộc tính lang trên thẻ html`);
      await context.close();
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-07-004: sitemap.xml tồn tại và không chặn trang quan trọng', async ({ request }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const origin = new URL(target.url).origin;
      const response = await getWithRetry(request, `${origin}/sitemap.xml`);
      if (response.status() !== 200) {
        problems.push(`${target.id} sitemap.xml trả ${response.status()}`);
        continue;
      }
      const body = await response.text();
      if (!body.includes('<urlset')) problems.push(`${target.id} sitemap.xml không phải định dạng urlset`);
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-07-005: robots.txt tồn tại và không chặn toàn bộ site', async ({ request }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const origin = new URL(target.url).origin;
      const response = await getWithRetry(request, `${origin}/robots.txt`);
      if (response.status() !== 200) {
        problems.push(`${target.id} robots.txt trả ${response.status()}`);
        continue;
      }
      const body = await response.text();
      if (!body.trim()) problems.push(`${target.id} robots.txt rỗng`);
      if (/^User-agent:\s*\*\s*$/im.test(body) && /^Disallow:\s*\/\s*$/im.test(body)) {
        problems.push(`${target.id} robots.txt chặn toàn bộ site`);
      }
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-07-006: Thẻ Open Graph có title, description và image', async ({ browser }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      const missing: string[] = [];
      for (const property of ['og:title', 'og:description', 'og:image']) {
        const locator = page.locator(`meta[property="${property}"]`);
        if ((await locator.count()) === 0) {
          missing.push(property);
          continue;
        }
        const value = await locator.first().getAttribute('content');
        if (!value || !value.trim()) missing.push(property);
      }
      if (missing.length > 0) problems.push(`${target.id} thiếu ${missing.join(', ')}`);
      await context.close();
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });
});
