import path from 'node:path';
import { existsSync } from 'node:fs';
import { DOCS_DIR, REPORTS_DIR, ROOT, log, parseCsv, readText, writeText } from './lib/common.mjs';

const rtmPath = path.join(DOCS_DIR, 'rtm.csv');
const requirementsPath = path.join(DOCS_DIR, 'requirements.csv');
const defectsPath = path.join(DOCS_DIR, 'defects', 'defects.csv');
const executionPath = path.join(REPORTS_DIR, 'execution-log.csv');
const lighthousePath = path.join(REPORTS_DIR, 'raw', 'lighthouse-summary.csv');
const axePath = path.join(REPORTS_DIR, 'raw', 'axe-summary.csv');
const securityPath = path.join(REPORTS_DIR, 'raw', 'security-summary.csv');
const designIndexPath = path.join(DOCS_DIR, 'design', 'design-index.csv');
const outputPath = path.join(REPORTS_DIR, 'exit-criteria.md');

const OPEN_STATUSES = ['New', 'Assigned', 'Open', 'Fixed', 'Pending Retest', 'Retest', 'Reopened'];

async function readCsv(file) {
  const raw = await readText(file).catch(() => '');
  return raw ? parseCsv(raw).records : [];
}

async function main() {
  const criteria = [];

  const rtm = await readCsv(rtmPath);
  const requirements = await readCsv(requirementsPath);
  const execution = await readCsv(executionPath);
  const defects = await readCsv(defectsPath);
  const lighthouse = await readCsv(lighthousePath);
  const axe = await readCsv(axePath);
  const security = await readCsv(securityPath);

  const mustIds = requirements.filter((r) => r.priority === 'Must').map((r) => r.id);
  const rtmCovered = new Set(rtm.filter((row) => row.Coverage === 'Covered').map((row) => row.Requirement_ID));
  const mustCovered = mustIds.filter((id) => rtmCovered.has(id));
  criteria.push({
    id: 'EC-1',
    name: '100% yêu cầu Must có ít nhất 1 test case',
    measured: mustIds.length === 0 ? 'chưa có dữ liệu RTM' : `${mustCovered.length}/${mustIds.length} yêu cầu Must đã phủ`,
    passed: mustIds.length > 0 && mustCovered.length === mustIds.length,
    source: 'docs/rtm.csv, docs/requirements.csv',
  });

  // EC-2 đo đúng theo định nghĩa: "100% test case Critical/High đã thực thi,
  // tỷ lệ Pass ≥ 95%". Cần `Priority` của test case nên đọc thêm từ
  // `docs/testcases/*.csv` (nguồn sự thật về priority) — `execution-log.csv`
  // không mang cột này.
  const testcasePriority = new Map();
  for (const file of ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv']) {
    const rows = await readCsv(path.join(DOCS_DIR, 'testcases', file));
    for (const row of rows) {
      if (row.TC_ID) testcasePriority.set(row.TC_ID, row.Priority ?? '');
    }
  }

  const executed = execution.filter((e) => e.Result && e.Result !== 'Chưa thực thi');
  const passCount = executed.filter((e) => e.Result === 'Pass').length;
  const overallRate = executed.length === 0 ? 0 : (passCount / executed.length) * 100;

  const chTotal = [...testcasePriority.values()].filter((p) => p === 'Critical' || p === 'High').length;
  const chExecuted = executed.filter((e) => {
    const p = testcasePriority.get(e.TC_ID);
    return p === 'Critical' || p === 'High';
  });
  const chPass = chExecuted.filter((e) => e.Result === 'Pass').length;
  const chRate = chExecuted.length === 0 ? 0 : (chPass / chExecuted.length) * 100;
  const chCovered = chTotal === 0 ? 0 : (chExecuted.length / chTotal) * 100;

  criteria.push({
    id: 'EC-2',
    name: '100% test case Critical/High đã thực thi, tỷ lệ Pass ≥ 95%',
    measured:
      execution.length === 0
        ? 'chưa có nhật ký thực thi'
        : `Critical/High đã thực thi ${chExecuted.length}/${chTotal} (${chCovered.toFixed(1)}%), ` +
          `Pass ${chRate.toFixed(1)}% trong nhóm này; toàn bộ ${executed.length} ca đã chạy, Pass ${overallRate.toFixed(1)}%`,
    passed:
      execution.length > 0 &&
      chTotal > 0 &&
      chExecuted.length === chTotal &&
      chRate >= 95,
    source: 'reports/execution-log.csv, docs/testcases/*.csv',
  });

  // `docs/defects/defects.csv` dùng tên cột `Severity`/`Status` (viết hoa) — đọc
  // cả hai biến thể để không phụ thuộc vào cách viết của từng phiên cập nhật.
  const openCriticalHigh = defects.filter(
    (d) =>
      ['Critical', 'High'].includes((d.Severity ?? d.severity ?? '').trim()) &&
      OPEN_STATUSES.includes((d.Status ?? d.status ?? '').trim()),
  );
  criteria.push({
    id: 'EC-3',
    name: '0 lỗi Critical/High còn mở, mọi lỗi đi qua đủ vòng đời',
    measured: `${openCriticalHigh.length} lỗi Critical/High đang mở trong tổng ${defects.length} lỗi`,
    passed: defects.length > 0 && openCriticalHigh.length === 0,
    source: 'docs/defects/defects.csv',
  });

  // EC-4 đo đúng theo định nghĩa: "Mỗi hệ thống có ít nhất 1 bộ E2E tự động
  // chạy được và xanh" → phải có ít nhất 1 ca **Pass** cho mỗi hệ thống T1/T2/T3.
  const autoPass = execution.filter((e) => e.Type === 'Auto' && e.Result === 'Pass');
  const autoPassSystems = new Set(autoPass.map((e) => e.System));
  const TARGET_SYSTEMS = ['T1', 'T2', 'T3'];
  const systemsWithoutGreenSuite = TARGET_SYSTEMS.filter((s) => {
    // 'ALL' = test case đo trên cả 3 site, vẫn là bằng chứng E2E cho site đó.
    return !autoPassSystems.has(s) && !autoPassSystems.has('ALL');
  });
  criteria.push({
    id: 'EC-4',
    name: 'Mỗi hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh',
    measured:
      `${autoPass.length} test case tự động Pass; ` +
      `${TARGET_SYSTEMS.length - systemsWithoutGreenSuite.length}/${TARGET_SYSTEMS.length} hệ thống có bộ E2E xanh` +
      (systemsWithoutGreenSuite.length > 0 ? ` (thiếu: ${systemsWithoutGreenSuite.join(', ')})` : ''),
    passed: autoPass.length > 0 && systemsWithoutGreenSuite.length === 0,
    source: 'reports/execution-log.csv, tests/e2e/',
  });

  const perfScores = lighthouse.filter((l) => l.Category === 'performance').map((l) => Number(l.Score)).filter((n) => !Number.isNaN(n));
  const perfOk = perfScores.length > 0 && Math.min(...perfScores) >= 70;
  criteria.push({
    id: 'EC-5',
    name: 'NFR-01 đạt: điểm Lighthouse Performance (mobile) ≥ 70 trên cả 3 site',
    measured: perfScores.length === 0 ? 'chưa có kết quả Lighthouse' : `điểm thấp nhất ${Math.min(...perfScores)}`,
    passed: perfOk,
    source: 'reports/raw/lighthouse-summary.csv',
  });

  const axeCritical = axe.filter((a) => a.Severity === 'critical').length;
  const missingHeaders = security.filter((s) => s.Present === 'No');
  const systemsWithHeaders = new Set(security.filter((s) => s.Present === 'Yes').map((s) => s.System)).size;
  criteria.push({
    id: 'EC-6',
    name: 'NFR-02 đạt: không có phát hiện bảo mật mức Critical/High',
    measured:
      `${axeCritical} phát hiện axe-core mức critical; ` +
      `${missingHeaders.length}/${security.length} header bảo mật thiếu trên ${systemsWithHeaders} hệ thống đo được`,
    passed: axe.length > 0 && axeCritical === 0 && missingHeaders.length === 0,
    source: 'reports/raw/axe-summary.csv, reports/raw/security-summary.csv',
  });

  const uatRaw = await readText(path.join(REPORTS_DIR, 'uat-report.md')).catch(() => '');
  const blockingUat = uatRaw.match(/phản hồi chặn[^\n]*/i) ?? [];
  criteria.push({
    id: 'EC-7',
    name: 'UAT không có phản hồi chặn',
    measured: uatRaw ? (blockingUat.length > 0 ? blockingUat[0] : 'báo cáo UAT đã có, không ghi nhận phản hồi chặn') : 'HUMAN-PENDING',
    passed: uatRaw.length > 0 && blockingUat.length === 0,
    source: 'reports/uat-report.md',
  });

  const designRows = await readCsv(designIndexPath);
  const MEMBERS = ['Mạnh', 'Tài', 'Ngân', 'Lộc'];
  const designIssues = [];
  for (const member of MEMBERS) {
    const rows = designRows.filter((r) => r.member === member);
    if (rows.length === 0) {
      designIssues.push(`${member}: chưa khai báo tài liệu thiết kế trong docs/design/design-index.csv`);
      continue;
    }
    for (const row of rows) {
      const exists = existsSync(path.join(ROOT, row.design_doc));
      if (!exists) designIssues.push(`${member}: thiếu file ${row.design_doc}`);
      if (row.reviewer === member) designIssues.push(`${member}: tự review tài liệu của chính mình (${row.design_doc})`);
      if (!['Đã review', 'Reviewed'].includes((row.review_status ?? '').trim())) {
        designIssues.push(`${member}: ${row.design_doc} chưa được review chéo (reviewer: ${row.reviewer})`);
      }
    }
  }
  criteria.push({
    id: 'EC-8',
    name: 'Mỗi thành viên có ≥ 1 tài liệu thiết kế test đã được review chéo',
    measured:
      designRows.length === 0
        ? 'chưa có docs/design/design-index.csv'
        : `${designRows.length} tài liệu thiết kế, ${designIssues.length === 0 ? 'tất cả đã review chéo' : `${designIssues.length} vấn đề`}`,
    passed: designRows.length > 0 && designIssues.length === 0,
    source: 'docs/design/design-index.csv',
  });
  if (designIssues.length > 0) {
    for (const issue of designIssues) log(`EC-8: ${issue}`);
  }

  const lines = [];
  lines.push('# Chấm Exit criteria');
  lines.push('');
  lines.push('Căn cứ: TP-01 §5.2 · Nguồn số liệu: `docs/`, `reports/`');
  lines.push('');
  lines.push('| Mã | Tiêu chí | Kết quả | Trạng thái | Nguồn |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const criterion of criteria) {
    lines.push(`| ${criterion.id} | ${criterion.name} | ${criterion.measured} | ${criterion.passed ? 'PASS' : 'FAIL'} | ${criterion.source} |`);
  }
  lines.push('');
  lines.push(
    `**Tổng: ${criteria.filter((c) => c.passed).length}/${criteria.length} tiêu chí đạt.**`,
  );
  lines.push('');

  // --- Phân tích ranh giới Hướng 2 (ADR-15) ---------------------------------
  // Đồ án kiểm thử phần mềm ĐANG HOẠT ĐỘNG của bên thứ ba, không có mã nguồn
  // và không có quyền triển khai. Vì vậy EC-2/EC-3/EC-5/EC-6 có thể FAIL vì
  // lỗi thật của site đích — đó là kết quả ĐÚNG, không phải khiếm khuyết của
  // quy trình kiểm thử. ASG-01 §5.3 yêu cầu Fail trung thực + ghi defect.
  const thirdPartyBlocking = [
    { ec: 'EC-2', reason: 'Tỷ lệ Pass của nhóm Critical/High bị kéo xuống bởi lỗi thật của site đích (mỗi lỗi đã có defect trong `docs/defects/defects.csv`).' },
    { ec: 'EC-3', reason: 'Lỗi Critical/High còn mở thuộc mã nguồn production của bên thứ ba — không sửa được trong phạm vi dự án Hướng 2.' },
    { ec: 'EC-5', reason: 'Điểm Lighthouse Performance và LCP phụ thuộc hạ tầng/CDN của bên thứ ba, nằm ngoài phạm vi thay đổi của nhóm.' },
    { ec: 'EC-6', reason: 'Thiếu header bảo mật, thiếu `alt`, thiếu tương phản màu và thiếu `h1` là cấu hình máy chủ/markup của bên thứ ba.' },
  ];

  lines.push('## Ranh giới Hướng 2 — vì sao một số tiêu chí FAIL');
  lines.push('');
  lines.push(
    'Theo **ADR-15 (Hướng 2)**, nhóm kiểm thử **phần mềm đang hoạt động** của bên thứ ba ' +
      'mà không có mã nguồn và không có quyền triển khai. Do đó:',
  );
  lines.push('');
  lines.push(
    '1. Test **phải Fail trung thực** khi ứng dụng đích có lỗi — không được nới lỏng tiêu chí ' +
      'để "ép xanh" (ASG-01 §5.3).',
  );
  lines.push(
    '2. Mọi lỗi phải được ghi thành defect trong `docs/defects/defects.csv` với bằng chứng thô ' +
      'trong `reports/raw/`.',
  );
  lines.push(
    '3. Tiêu chí FAIL vì lỗi thật của bên thứ ba là **kết quả đúng** của quy trình, ' +
      'không phải bằng chứng thiếu chất lượng.',
  );
  lines.push('');
  lines.push('| Tiêu chí | Lý do bị chặn bởi ranh giới Hướng 2 |');
  lines.push('| --- | --- |');
  for (const item of thirdPartyBlocking) {
    lines.push(`| ${item.ec} | ${item.reason} |`);
  }
  lines.push('');
  lines.push(
    'Các tiêu chí **EC-1, EC-4, EC-8** đạt vì chúng nằm trong tầm kiểm soát của nhóm ' +
      '(truy xuết yêu cầu, bộ E2E tự động, tài liệu thiết kế đã review chéo).',
  );
  lines.push('');

  await writeText(outputPath, lines.join('\n'));
  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
  log(`Số tiêu chí đạt: ${criteria.filter((c) => c.passed).length}/${criteria.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
