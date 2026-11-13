import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, RAW_DIR, ensureDir, listFiles, log, parseCsv, readText, writeText } from './lib/common.mjs';

const testcasesDir = path.join(DOCS_DIR, 'testcases');
const rawDir = path.join(RAW_DIR, 'static');
const outputPath = path.join(REPORTS_DIR, 'static-analysis.md');

async function countLoc(files) {
  let total = 0;
  for (const file of files) {
    const content = await readText(file);
    total += content.split('\n').filter((line) => line.trim() !== '' && !line.trim().startsWith('//')).length;
  }
  return total;
}

async function main() {
  await ensureDir(rawDir);

  const srcFiles = await listFiles(path.join(ROOT_SERVER, 'src'), '.ts');
  const loc = await countLoc(srcFiles);
  await writeText(path.join(rawDir, 'loc.txt'), `files=${srcFiles.length}\nloc=${loc}\n`);

  const testCaseFiles = await listFiles(testcasesDir, '.csv');
  let totalCases = 0;
  const byModule = {};
  for (const file of testCaseFiles) {
    if (path.basename(file).startsWith('_')) {
      continue;
    }
    const { records } = await parseCsv(await readText(file));
    const module = path.basename(file, '.csv');
    byModule[module] = records.length;
    totalCases += records.length;
  }

  const lines = [];
  lines.push('# Báo cáo phân tích tĩnh');
  lines.push('');
  lines.push('Nguồn số liệu thô: `reports/raw/static/`');
  lines.push('');
  lines.push('| Chỉ số | Giá trị |');
  lines.push('| --- | --- |');
  lines.push(`| Số file nguồn TypeScript (server/src) | ${srcFiles.length} |`);
  lines.push(`| Số dòng code không rỗng (LOC) | ${loc} |`);
  lines.push(`| Tổng test case | ${totalCases} |`);
  lines.push('');
  lines.push('## Phân bố test case theo module');
  lines.push('');
  lines.push('| Module | Số test case |');
  lines.push('| --- | --- |');
  for (const [module, count] of Object.entries(byModule)) {
    lines.push(`| ${module} | ${count} |`);
  }
  lines.push('');
  lines.push('## Phát hiện');
  lines.push('');
  lines.push('- Chưa có dữ liệu từ ESLint, `madge`, `knip`, `jscpd`, SonarQube. Sẽ bổ sung ở Ngày 9 (phần chạy tool do Tài phụ trách).');
  lines.push('');

  await writeText(outputPath, lines.join('\n'));
  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
}

const ROOT_SERVER = path.join(process.cwd(), 'server');

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
