import fs from 'node:fs';
import path from 'node:path';

/**
 * Đồng bộ bản làm việc trong docs/ từ bản gốc trong docs/source/.
 * docs/source/ là bản chuẩn giữ nguyên (nộp hồ sơ); docs/*.md là bản làm việc.
 */

const PAIRS = [
  ['docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md', 'docs/srs.md'],
  ['docs/source/Kế hoạch Kiểm thử (Test Plan).md', 'docs/test-plan.md'],
  ['docs/source/Ma trận Truy xuất Yêu cầu (RTM).md', 'docs/rtm.md'],
];

for (const [src, work] of PAIRS) {
  if (!fs.existsSync(src)) {
    console.log(`BỎ QUA (không có nguồn): ${src}`);
    continue;
  }
  const text = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
  fs.writeFileSync(work, text, 'utf8');
  console.log(`${src} -> ${work} (${text.split('\n').length} dòng)`);
}
void path;
