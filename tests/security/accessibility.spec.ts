import { test, expect } from '@playwright/test';
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

type SiteScan = {
  id: string;
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];
  h1Count: number;
};

let scans: SiteScan[] = [];

function toCsv(data: string[][]) {
  return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
}

test.describe('NFR-06 — Khả năng tiếp cận', () => {
  // Quét axe-core cả 3 site mất hơn 60 giây (mỗi site chờ render + quét
  // WCAG 2.1 AA), nên nới hạn thời gian riêng cho nhóm test này.
  test.describe.configure({ timeout: 300_000 });

  // Quét một lần cho cả 3 site rồi dùng lại kết quả cho 5 test case, thay vì
  // mỗi test lại tải trang 3 lần — giảm tải lên site bên thứ ba (ADR-11).
  test.beforeAll(async ({ browser }) => {
    mkdirSync(RAW, { recursive: true });
    scans = [];

    for (const target of TARGETS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(3000);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const h1Count = await page.locator('h1').count();
      scans.push({ id: target.id, violations: results.violations, h1Count });
      await context.close();
    }

    const rows = [['System', 'Rule_ID', 'Impact', 'Severity', 'Occurrences', 'Help_URL']];
    for (const scan of scans) {
      for (const violation of scan.violations) {
        const severity =
          violation.impact === 'critical' ? 'critical' : violation.impact === 'serious' ? 'serious' : 'moderate';
        rows.push([
          scan.id,
          violation.id,
          violation.impact ?? 'unknown',
          severity,
          String(violation.nodes.length),
          violation.helpUrl,
        ]);
      }
    }
    writeFileSync(AXE_CSV, `﻿${toCsv(rows)}\n`, 'utf8');
  });

  test('TC-NFR-06-001: axe-core không có vi phạm mức critical trên cả 3 site', () => {
    const critical = scans.flatMap((scan) =>
      scan.violations
        .filter((v) => v.impact === 'critical')
        .map((v) => `${scan.id} ${v.id} (${v.nodes.length} node)`),
    );
    expect(critical, `vi phạm axe-core mức critical: ${critical.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-002: mọi vùng chữ đạt tương phản ≥ 4,5:1 trên cả 3 site', () => {
    const violations = scans.flatMap((scan) =>
      scan.violations
        .filter((v) => v.id === 'color-contrast')
        .map((v) => `${scan.id} color-contrast (${v.nodes.length} node)`),
    );
    expect(violations, `vi phạm tương phản màu: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-003: mọi trường form có nhãn gắn liền trên cả 3 site', () => {
    const violations = scans.flatMap((scan) =>
      scan.violations
        .filter((v) => v.id === 'label' || v.id === 'form-field-multiple-labels')
        .map((v) => `${scan.id} ${v.id} (${v.nodes.length} node)`),
    );
    expect(violations, `vi phạm nhãn trường form: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-004: mọi ảnh nội dung có thuộc tính alt trên cả 3 site', () => {
    const violations = scans.flatMap((scan) =>
      scan.violations
        .filter((v) => v.id === 'image-alt')
        .map((v) => `${scan.id} image-alt (${v.nodes.length} node)`),
    );
    expect(violations, `vi phạm thuộc tính alt: ${violations.join('; ')}`).toEqual([]);
  });

  test('TC-NFR-06-005: mỗi trang có đúng một tiêu đề h1 trên cả 3 site', () => {
    const details = scans.filter((scan) => scan.h1Count !== 1).map((scan) => `${scan.id} có ${scan.h1Count} phần tử h1`);
    expect(details, `tiêu đề h1 không đúng: ${details.join('; ')}`).toEqual([]);
  });
});
