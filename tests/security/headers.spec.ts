import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getWithRetry } from '../support/http';

/**
 * NFR-02 — Kiểm tra header bảo mật, cookie và TLS cho cả 3 hệ thống đích.
 * Chỉ đọc header, không gửi payload phá hại (ADR-11).
 *
 * Mỗi header là một test case riêng để khi Fail thì báo lỗi gọn (tránh Defect masking).
 * Test case trong `docs/testcases/nfr.csv` có System = ALL nên mỗi test áp dụng
 * cho cả 3 site và Fail nếu có bất kỳ site nào vi phạm.
 *
 * Kết quả tổng hợp ghi vào `reports/raw/security-summary.csv` (nguồn số liệu EC-6).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const SECURITY_HEADERS = [
  ['x-content-type-options', 'X-Content-Type-Options'],
  ['x-frame-options', 'X-Frame-Options'],
  ['content-security-policy', 'Content-Security-Policy'],
  ['referrer-policy', 'Referrer-Policy'],
  ['strict-transport-security', 'Strict-Transport-Security'],
] as const;

const RAW = path.join('reports', 'raw');
const SECURITY_CSV = path.join(RAW, 'security-summary.csv');

function toCsv(data: string[][]) {
  return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
}

test.describe('NFR-02 — Baseline bảo mật', () => {
  test.beforeAll(() => {
    mkdirSync(RAW, { recursive: true });
  });

  test('tổng hợp HTTP security header của 3 site vào reports/raw/security-summary.csv', async ({ request }) => {
    const rows = [['System', 'Header', 'Present', 'Value']];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      const headers = response.headers();
      for (const [key, label] of SECURITY_HEADERS) {
        const value = headers[key];
        rows.push([target.id, label, value ? 'Yes' : 'No', value ?? '']);
      }
    }
    writeFileSync(SECURITY_CSV, `\uFEFF${toCsv(rows)}\n`, 'utf8');
    expect(rows.length - 1).toBe(TARGETS.length * SECURITY_HEADERS.length);
  });

  test('TC-NFR-02-001: cả 3 site bật HTTPS và trả header Strict-Transport-Security', async ({ request }) => {
    const missing: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      if (!response.url().startsWith('https://')) missing.push(`${target.id} không dùng HTTPS`);
      if (!response.headers()['strict-transport-security']) missing.push(`${target.id} thiếu HSTS`);
    }
    expect(missing, missing.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-002: cả 3 site trả header X-Content-Type-Options: nosniff', async ({ request }) => {
    const missing: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      expect(response.status()).toBeLessThan(400);
      if (response.headers()['x-content-type-options'] !== 'nosniff') {
        missing.push(`${target.id} thiếu X-Content-Type-Options: nosniff`);
      }
    }
    expect(missing, missing.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-003: cả 3 site có X-Frame-Options hoặc CSP frame-ancestors', async ({ request }) => {
    const missing: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      const headers = response.headers();
      if (!headers['x-frame-options'] && !headers['content-security-policy']) {
        missing.push(`${target.id} thiếu X-Frame-Options hoặc CSP frame-ancestors`);
      }
    }
    expect(missing, missing.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-004: cả 3 site có header Referrer-Policy', async ({ request }) => {
    const missing: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      if (!response.headers()['referrer-policy']) missing.push(`${target.id} thiếu Referrer-Policy`);
    }
    expect(missing, missing.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-005: cookie phiên của cả 3 site có Secure và HttpOnly', async ({ request }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, target.url);
      const raw = response.headersArray().filter((h) => h.name.toLowerCase() === 'set-cookie');
      const sessionCookies = raw.filter((h) => /session|sid|auth/i.test(h.value));
      for (const cookie of sessionCookies) {
        const value = cookie.value.toLowerCase();
        if (!value.includes('secure')) problems.push(`${target.id} cookie ${cookie.name} thiếu Secure`);
        if (!value.includes('httponly')) problems.push(`${target.id} cookie ${cookie.name} thiếu HttpOnly`);
      }
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-008: URL sai trả trang lỗi thân thiện, không lộ stack trace', async ({ request }) => {
    const leaks: string[] = [];
    for (const target of TARGETS) {
      const response = await getWithRetry(request, `${target.url}/__khong-ton-tai-kiem-thu-404`);
      const body = await response.text();
      if (/at \w+ \(.*:\d+:\d+\)/.test(body)) leaks.push(`${target.id} lộ stack trace`);
      if (/node_modules|\/usr\/lib\/node/i.test(body)) leaks.push(`${target.id} lộ đường dẫn hệ thống`);
    }
    expect(leaks, leaks.join('; ')).toEqual([]);
  });
});
