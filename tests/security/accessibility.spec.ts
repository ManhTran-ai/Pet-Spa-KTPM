import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * NFR-06 — Khả năng tiếp cận (WCAG 2.1 AA) cho 3 site đích.
 *
 * Mỗi test case trong `docs/testcases/nfr.csv` có System = ALL, nên mỗi test
 * chạy trên cả 3 site trong một lần và Fail nếu có bất kỳ site nào vi phạm.
 * Kết quả chi tiết ghi vào `reports/raw/axe-summary.csv` (nguồn số liệu cho EC-6).
 *
 * Chỉ đọc trang, không thao tác ghi dữ liệu (ADR-11).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const RAW = path.join('reports', 'raw');
const AXE_CSV = path.join(RAW, 'axe-summary.csv');

/** Chờ ảnh và nội dung render xong — quét sớm sẽ bỏ sót lỗi alt/contrast. */
async function quetAxe(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
}

function toCsv(data: string[][]) {
  return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
}

test.describe('NFR-06 — Khả năng tiếp cận', () => {
  test.beforeAll(() => {
    mkdirSync(RAW, { recursive: true });
  });

  test('TC-NFR-06-001: axe-core không có vi phạm mức critical trên cả 3 site', async ({ browser }) => {
    const rows = [['System', 'Rule_ID', 'Impact', 'Severity', 'Occurrences', 'Help_URL']];
    const critical: string[] = [];

    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const results = await quetAxe(page, target.url);

      for (const violation of results.violations) {
        const severity =
          violation.impact === 'critical' ? 'critical' : violation.impact === 'serious' ? 'serious' : 'moderate';
        rows.push([
          target.id,
          violation.id,
          violation.impact ?? 'unknown',
          severity,
          String(violation.nodes.length),
          violation.helpUrl,
        ]);
        if (severity === 'critical') {
          critical.push(`${target.id} ${violation.id} (${violation.nodes.length} node)`);
        }
      }
      await context.close();
    }

    writeFileSync(AXE_CSV, `\uFEFF${toCsv(rows)}\n`, 'utf8');

    expect(critical, `vi phạm axe-core mức critical: ${critical.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-002: mọi vùng chữ đạt tương phản ≥ 4,5:1 trên cả 3 site', async ({ browser }) => {
    const violations: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const results = await quetAxe(page, target.url);
      for (const violation of results.violations.filter((v) => v.id === 'color-contrast')) {
        violations.push(`${target.id} color-contrast (${violation.nodes.length} node)`);
      }
      await context.close();
    }
    expect(violations, `vi phạm tương phản màu: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-003: mọi trường form có nhãn gắn liền trên cả 3 site', async ({ browser }) => {
    const violations: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const results = await quetAxe(page, target.url);
      for (const violation of results.violations.filter((v) => v.id === 'label' || v.id === 'form-field-multiple-labels')) {
        violations.push(`${target.id} ${violation.id} (${violation.nodes.length} node)`);
      }
      await context.close();
    }
    expect(violations, `vi phạm nhãn trường form: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-004: mọi ảnh nội dung có thuộc tính alt trên cả 3 site', async ({ browser }) => {
    const violations: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const results = await quetAxe(page, target.url);
      for (const violation of results.violations.filter((v) => v.id === 'image-alt')) {
        violations.push(`${target.id} image-alt (${violation.nodes.length} node)`);
      }
      await context.close();
    }
    expect(violations, `vi phạm thuộc tính alt: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-005: mỗi trang có đúng một tiêu đề h1 trên cả 3 site', async ({ browser }) => {
    const details: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(3000);
      const count = await page.locator('h1').count();
      if (count !== 1) details.push(`${target.id} có ${count} phần tử h1`);
      await context.close();
    }
    expect(details, `tiêu đề h1 không đúng: ${details.join('; ')}`).toEqual([]);
  });
});
