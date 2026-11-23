import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { parseCsv, readText, writeText } from './lib/common.mjs';

/**
 * Đồng bộ tiêu đề test case trong spec Playwright với `docs/testcases/*.csv`.
 *
 * Quy tắc: với mỗi cặp `'<TC-ID>: <tiêu đề>'` trong spec, tiêu đề phải **khớp
 * tuyệt đối** với cột `Title` của bản ghi CSV cùng `TC_ID`.
 *
 * Cơ chế: thay bằng placeholder `__TC_TITLE__` rồi điền lại — tránh nhân bản
 * tiêu đề CSV vào spec (vi phạm nguyên tắc "CSV là nguồn chuẩn, spec tham chiếu").
 *
 * Cờ:
 *   --dry-run   chỉ báo cáo, không ghi file
 *   --id <ID>   chỉ xử lý một TC-ID cụ thể
 */
async function quetSpec(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await quetSpec(p)));
    else if (e.name.endsWith('.spec.ts')) out.push(p);
  }
  return out.sort();
}

const csvTitles = new Map();
for (const f of ['t1', 't2', 't3', 'nfr', 'uat']) {
  const { records } = parseCsv(await readText(`docs/testcases/${f}.csv`));
  for (const r of records) csvTitles.set(r.TC_ID, r.Title ?? '');
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const idFlag = args.indexOf('--id');
const onlyId = idFlag >= 0 ? args[idFlag + 1] : null;

const specs = await quetSpec('tests');
let changed = 0;
let fixed = 0;
const unmatched = [];

for (const s of specs) {
  const original = await readText(s);
  let text = original;

  // Vòng 1: đánh dấu những tiêu đề lệch bằng placeholder.
  text = text.replace(/'((TC-[A-Z0-9-]+)):\s*([^']*)'/g, (match, id, _id2, current) => {
    if (onlyId && id !== onlyId) return match;
    const want = csvTitles.get(id);
    if (want === undefined) {
      unmatched.push(`${id} (không có trong CSV)`);
      return match;
    }
    if (current === want) return match;
    fixed += 1;
    return `'${id}: __TC_TITLE__'`;
  });

  if (text === original) continue;

  // Vòng 2: điền tiêu đề CSV thật (escape `$` của tham chiếu thay thế).
  text = text.replace(/'((TC-[A-Z0-9-]+)):\s*__TC_TITLE__'/g, (match, id) => {
    const want = csvTitles.get(id);
    if (want === undefined) return match;
    return `'${id}: ${want.replace(/\$/g, '$$$$')}'`;
  });

  if (text !== original) {
    changed += 1;
    if (!dryRun) await writeText(s, text);
    console.log(`${dryRun ? '[DRY] ' : ''}${path.relative(process.cwd(), s)} — đã cập nhật`);
  }
}

console.log(`\nĐã sửa ${fixed} tiêu đề trong ${changed} file.`);
if (unmatched.length > 0) {
  console.log('TC-ID không có trong CSV (cần bổ sung test case):');
  for (const u of [...new Set(unmatched)]) console.log(`  ${u}`);
}
