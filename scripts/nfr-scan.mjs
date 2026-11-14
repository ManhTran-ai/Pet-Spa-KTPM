import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const RAW = path.join('reports', 'raw');
mkdirSync(RAW, { recursive: true });

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
];

const browser = await chromium.launch();
const context = await browser.newContext();

// --- axe-core: khả năng tiếp cận NFR-06 ---
const axeRows = [['System', 'Rule_ID', 'Impact', 'Severity', 'Occurrences', 'Help_URL']];
const axeDetail = [];

for (const target of TARGETS) {
  const page = await context.newPage();
  await page.goto(target.url, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  for (const violation of results.violations) {
    const severity = violation.impact === 'critical' ? 'critical' : violation.impact === 'serious' ? 'serious' : 'moderate';
    axeRows.push([
      target.id,
      violation.id,
      violation.impact ?? 'unknown',
      severity,
      String(violation.nodes.length),
      violation.helpUrl,
    ]);
    axeDetail.push(
      `- **${target.id}** — \`${violation.id}\` (${violation.impact}, ${violation.nodes.length} node): ${violation.help}`,
    );
  }
  await page.close();
}

// --- HTTP security header: NFR-02 ---
const headerRows = [['System', 'Header', 'Present', 'Value']];
const headerDetail = [];

for (const target of TARGETS) {
  const response = await context.request.get(target.url, { maxRedirects: 5 });
  const headers = response.headers();
  for (const [key, label] of SECURITY_HEADERS) {
    const value = headers[key];
    headerRows.push([target.id, label, value ? 'Yes' : 'No', value ?? '']);
    headerDetail.push(
      `- **${target.id}** — ${label}: ${value ? `\`${value.slice(0, 120)}\`` : '**không có**'} (${value ? 'Đạt' : 'Không đạt'})`,
    );
  }
}

await browser.close();

const toCsv = (rows) => rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');

writeFileSync(path.join(RAW, 'axe-summary.csv'), `\uFEFF${toCsv(axeRows)}\n`, 'utf8');
writeFileSync(path.join(RAW, 'security-summary.csv'), `\uFEFF${toCsv(headerRows)}\n`, 'utf8');

const md = [
  '# Tóm tắt kiểm thử bảo mật (NFR-02)',
  '',
  'Nguồn: `reports/raw/security-summary.csv` · ngày chạy xem trong `reports/gates/`.',
  '',
  '## HTTP security header',
  '',
  ...headerDetail,
  '',
  '## axe-core (NFR-06)',
  '',
  axeDetail.length > 0 ? axeDetail.join('\n') : '- Không phát hiện vi phạm mức critical/serious trên cả 3 site.',
  '',
].join('\n');
writeFileSync(path.join(RAW, 'security-summary.md'), md, 'utf8');

console.log(`axe-summary.csv: ${axeRows.length - 1} dòng phát hiện`);
console.log(`security-summary.csv: ${headerRows.length - 1} dòng kiểm tra header`);
