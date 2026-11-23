import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Chạy Lighthouse CLI (chỉ đọc) trên **trang đặt lịch** của 3 site đích cho
 * NFR-01 — `TC-NFR-01-002` (Lighthouse Performance mobile trang đặt lịch ≥ 70).
 *
 * Mỗi site chạy 3 lần, lấy trung vị (SRS-01 §9.1 / TP-01 §8).
 *
 * Về T3: T3 là ứng dụng trang đơn, luồng đặt lịch nằm trong drawer "Book Now"
 * của chính trang chủ — không có trang đặt lịch riêng. Vì vậy URL đo của T3
 * là trang chủ (nơi mà thao tác đặt lịch bắt đầu).
 */
const RAW = path.join('reports', 'raw');
mkdirSync(RAW, { recursive: true });

const TARGETS = [
  // T1: luồng đặt lịch là modal mở trên chính trang chủ — không có URL riêng.
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  // T3: luồng đặt lịch là drawer "Book Now" trên trang chủ — không có URL riêng.
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const RUNS = 3;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: process.platform === 'win32' });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd} exit ${code}\n${err}`)),
    );
  });
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const rows = [['System', 'Category', 'Score', 'Metric', 'Value', 'Runs']];

for (const target of TARGETS) {
  const scores = { performance: [], accessibility: [], 'best-practices': [], seo: [] };
  const lcp = [];
  const cls = [];

  for (let i = 0; i < RUNS; i += 1) {
    const jsonPath = path.join(RAW, `lighthouse-booking-${target.id}-${i + 1}.json`);
    await run('npx', [
      'lighthouse',
      target.url,
      '--output=json',
      `--output-path=${jsonPath}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
    ]);
    const report = JSON.parse(await readFile(jsonPath, 'utf8'));
    for (const key of Object.keys(scores)) {
      const category = report.categories?.[key];
      if (category?.score != null) scores[key].push(Math.round(category.score * 100));
    }
    const audits = report.audits ?? {};
    if (audits['largest-contentful-paint']?.numericValue != null)
      lcp.push(audits['largest-contentful-paint'].numericValue);
    if (audits['cumulative-layout-shift']?.numericValue != null)
      cls.push(audits['cumulative-layout-shift'].numericValue);
  }

  for (const [category, values] of Object.entries(scores)) {
    if (values.length === 0) continue;
    rows.push([target.id, category, String(median(values)), '', '', String(values.length)]);
  }
  if (lcp.length > 0)
    rows.push([target.id, 'metric', '', 'LCP (ms)', String(Math.round(median(lcp))), String(lcp.length)]);
  if (cls.length > 0)
    rows.push([target.id, 'metric', '', 'CLS', median(cls).toFixed(3), String(cls.length)]);
}

const toCsv = (data) =>
  data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');

await writeFile(
  path.join(RAW, 'lighthouse-booking-summary.csv'),
  `\uFEFF${toCsv(rows)}\n`,
  'utf8',
);
console.log(`lighthouse-booking-summary.csv: ${rows.length - 1} dòng`);
