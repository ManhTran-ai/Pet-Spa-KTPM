import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

/**
 * Thu thập bằng chứng bảo mật cho cả 3 site đích → `reports/raw/security-summary.csv`.
 *
 * Phạm vi chỉ đọc (ADR-11): chỉ GET, không đăng nhập, không gọi API ghi dữ liệu.
 * Thu thập: 5 security header · TLS · cookie phiên · rò rỉ khoá API / chuỗi kết nối.
 *
 * Dùng BrowserContext (không dùng APIRequestContext) vì `response.securityDetails()`
 * chỉ trả chi tiết chứng thương mương TLS trên response của trình duyệt.
 */

const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com' },
];

const HEADERS = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Content-Security-Policy',
  'Referrer-Policy',
];

const API_KEY_PATTERNS = [
  /AIza[0-9A-Za-z\-_]{20,}/g, // Google Maps / Firebase API key
  /eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/g, // JWT
  /(?:mongodb|postgres|postgresql|mysql|redis):\/\/[^\s"'<>]+/gi,
  /(?:api[_-]?key|secret[_-]?key|access[_-]?token)["']?\s*[:=]\s*["'][^"']{12,}["']/gi,
];

const SESSION_COOKIE_PATTERNS = [/sessionid/i, /phpsessid/i, /jsessionid/i, /connect\.sid/i];

function escapeCsv(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

const rows = [];
const browser = await chromium.launch({ channel: 'chrome' });

for (const target of TARGETS) {
  const context = await browser.newContext();
  const page = await context.newPage();

  let response;
  try {
    response = await page.goto(target.url, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(2000);
  } catch (error) {
    rows.push([target.id, 'Tải trang', 'Unknown', '', `không tải được: ${error.message.split('\n')[0]}`]);
    await context.close();
    continue;
  }

  const allHeaders = await response.allHeaders();

  // --- 5 security header ---
  for (const name of HEADERS) {
    const value = allHeaders[name] ?? allHeaders[name.toLowerCase()] ?? '';
    rows.push([target.id, name, value ? 'Yes' : 'No', value]);
  }

  // --- TLS ---
  const tls = await response.securityDetails();
  if (tls && tls.protocol) {
    const validTo = tls.validTo ? new Date(tls.validTo * 1000).toISOString().slice(0, 10) : '?';
    rows.push([
      target.id,
      'TLS',
      'Yes',
      `${tls.protocol} · chủ thể ${tls.subjectName ?? '?'} · issuer ${tls.issuer ?? '?'} · hết hạn ${validTo}`,
    ]);
  } else {
    rows.push([target.id, 'TLS', 'No', 'không lấy được chi tiết chứng thương mương TLS']);
  }

  // --- Cookie phiên ---
  const cookies = await context.cookies();
  const sessionCookies = cookies
    .filter((c) => SESSION_COOKIE_PATTERNS.some((p) => p.test(c.name)))
    .map((c) => c.name);
  const khongSecure = cookies.filter((c) => !c.secure).map((c) => c.name);
  const khongHttpOnly = cookies.filter((c) => !c.httpOnly).map((c) => c.name);
  rows.push([
    target.id,
    'Cookie phiên',
    sessionCookies.length > 0 ? 'Yes' : 'No',
    sessionCookies.length > 0
      ? `cookie phiên: ${sessionCookies.join(', ')}`
      : `không có cookie phiên · thiếu Secure: ${
          khongSecure.length > 0 ? khongSecure.join(', ') : 'không có'
        } · thiếu HttpOnly: ${khongHttpOnly.length > 0 ? khongHttpOnly.join(', ') : 'không có'}`,
  ]);

  // --- Rò rỉ khoá API / chuỗi kết nối trong HTML nguồn ---
  const html = await page.content();
  const leaks = new Map();
  for (const pattern of API_KEY_PATTERNS) {
    for (const match of html.matchAll(pattern)) {
      const hit = match[0];
      // Che bớt để không lưu bản khoá thật vào repo.
      const che = `${hit.slice(0, 10)}…${hit.slice(-6)} (${hit.length} ký tự)`;
      leaks.set(che, (leaks.get(che) ?? 0) + 1);
    }
  }
  rows.push([
    target.id,
    'Rò rỉ khoá/chuỗi kết nối',
    leaks.size > 0 ? 'Yes' : 'No',
    leaks.size > 0
      ? [...leaks.entries()].map(([k, n]) => `${k} ×${n}`).join(' | ')
      : 'không phát hiện khoá API, kho xác thực hay chuỗi kết nối',
  ]);

  await context.close();
}

await browser.close();

const header = ['System', 'Header', 'Present', 'Value'];
const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
await writeFile('reports/raw/security-summary.csv', `${csv}\n`, 'utf8');

console.log(`Đã ghi reports/raw/security-summary.csv: ${rows.length} dòng`);
