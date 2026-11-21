/**
 * Phase 1 — Inspection bộ test case theo checklist 4C (Cẩm nang §3.2).
 *
 * Mục tiêu: rà soát *trước khi* thực thi để không tốn công chạy test case sai.
 * Bốn thành phần 4C (xem `docs/ASSIGNMENT.md` §4):
 *   - Correctness   : Requirement_ID tồn tại trong SRS-01; hệ thống và module
 *                      của test case nằm trong phạm vi của yêu cầu.
 *   - Clarity       : Title đủ cụ thể để người khác chạy được ngay.
 *   - Completeness  : Technique/Type/Priority/Status/Owner có giá trị hợp lệ,
 *                      và mỗi yêu cầu trong SRS-01 có ít nhất 1 test case.
 *   - Consistency   : TC_ID đúng định dạng, không trùng, cùng cấu trúc 9 cột,
 *                      không trùng Title trong cùng nhóm (yêu cầu, hệ thống).
 *
 * Chạy:  node scripts/tc-review-check.mjs
 * Đầu ra: reports/raw/tc-review-check.txt + exit code khác 0 nếu còn lỗi Major.
 */

import path from 'node:path';
import { DOCS_DIR, REPORTS_DIR, log, parseCsv, readText, writeText } from './lib/common.mjs';

const TESTCASE_FILES = ['t1.csv', 't2.csv', 't3.csv', 'nfr.csv'];
const EXPECTED_HEADERS = [
  'TC_ID',
  'Requirement_ID',
  'System',
  'Title',
  'Priority',
  'Technique',
  'Type',
  'Owner',
  'Status',
];

const VALID_PRIORITY = ['Critical', 'High', 'Medium', 'Low'];
// Kỹ thuật thiết kế test (Cẩm nang §4) — áp dụng cho ca chức năng.
const VALID_TECHNIQUE = ['EP', 'BVA', 'DT', 'ST', 'UC', 'Use case'];
// Ca NFR không dùng kỹ thuật thiết kế hộp đen mà dùng công cụ đo định lượng.
const VALID_TECHNIQUE_NFR = ['Lighthouse', 'Accessibility', 'SEO', ...VALID_TECHNIQUE];
const VALID_TYPE = ['Auto', 'Manual'];
const VALID_OWNER = ['Mạnh', 'Tài', 'Ngân', 'Lộc'];
const VALID_STATUS = ['Pass', 'Fail', 'Blocked', 'Not Run', 'Chưa thực thi'];
const VALID_SYSTEM = ['T1', 'T2', 'T3', 'ALL'];

/** `TC-T1-M3-007` hoặc `TC-NFR-02-007`. */
const TC_ID_PATTERN = /^TC-(?:T[123]-M[1-7]|NFR-\d{2})-\d{3}$/;
/** Phần module trong TC_ID chức năng: `TC-T1-M3-007` → `3`. */
const TC_ID_MODULE = /^TC-T[123]-M([1-7])-\d{3}$/;

const MIN_TITLE_LENGTH = 25;
const PLACEHOLDER_PATTERN = /\b(TODO|TBD|FIXME|xxx|chưa rõ|không rõ)\b/i;

/** @type {{severity: 'Major'|'Minor'|'Observation', file: string, tc: string, rule: string, detail: string}[]} */
const findings = [];

function report(severity, file, tc, rule, detail) {
  findings.push({ severity, file, tc, rule, detail });
}

async function readCsv(file) {
  const raw = await readText(file).catch(() => '');
  if (!raw) return { headers: [], records: [] };
  return parseCsv(raw);
}

/** Phạm vi hệ thống của một yêu cầu trong SRS-01. */
function requirementSystems(req) {
  return (req.systems ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const requirements = (await readCsv(path.join(DOCS_DIR, 'requirements.csv'))).records;
  const reqById = new Map(requirements.map((r) => [r.id, r]));

  const allRecords = [];
  const seenIds = new Map();

  for (const file of TESTCASE_FILES) {
    const filePath = path.join(DOCS_DIR, 'testcases', file);
    const { headers, records } = await readCsv(filePath);

    // --- Consistency: cấu trúc cột ---
    const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      report('Major', file, '(file)', 'C-COLUMN', `thiếu cột: ${missing.join(', ')}`);
      continue;
    }
    const extra = headers.filter((h) => !EXPECTED_HEADERS.includes(h));
    if (extra.length > 0) {
      report('Minor', file, '(file)', 'C-COLUMN', `cột thừa không nằm trong chuẩn: ${extra.join(', ')}`);
    }

    for (const record of records) {
      const tc = record.TC_ID;
      const isNfr = tc.startsWith('TC-NFR-');
      allRecords.push({ ...record, _file: file });

      // --- Consistency: TC_ID hợp lệ và duy nhất ---
      if (!TC_ID_PATTERN.test(tc)) {
        report('Major', file, tc, 'C-ID', 'TC_ID sai định dạng {TC-Tx-Mn-nnn | TC-NFR-nn-nnn}');
      } else if (seenIds.has(tc)) {
        report('Major', file, tc, 'C-ID', `TC_ID trùng với ${seenIds.get(tc)}`);
      } else {
        seenIds.set(tc, file);
      }

      // --- Correctness: yêu cầu tồn tại trong SRS-01 ---
      const reqId = record.Requirement_ID;
      const req = reqById.get(reqId);
      if (!req) {
        report('Major', file, tc, 'C-REQ', `Requirement_ID "${reqId}" không tồn tại trong requirements.csv`);
      } else {
        const reqSystems = requirementSystems(req);

        // Hệ thống của test case phải nằm trong phạm vi hệ thống của yêu cầu.
        // `ALL` chỉ hợp lệ với yêu cầu áp dụng cho cả 3 site.
        if (record.System === 'ALL') {
          const appliesToAll = ['T1', 'T2', 'T3'].every((sys) => reqSystems.includes(sys));
          if (!appliesToAll) {
            report(
              'Major',
              file,
              tc,
              'C-SYSTEM',
              `System "ALL" nhưng ${reqId} chỉ áp dụng cho ${reqSystems.join(', ')}`,
            );
          }
        } else if (!reqSystems.includes(record.System)) {
          report(
            'Major',
            file,
            tc,
            'C-SYSTEM',
            `System "${record.System}" không thuộc phạm vi của ${reqId} (${reqSystems.join(', ')})`,
          );
        }

        // Module trong TC_ID phải khớp module của yêu cầu.
        const moduleInId = TC_ID_MODULE.exec(tc)?.[1];
        if (moduleInId && req.module && moduleInId !== req.module.replace(/^M/, '')) {
          report(
            'Major',
            file,
            tc,
            'C-MODULE',
            `module trong TC_ID (M${moduleInId}) khác module của ${reqId} (${req.module})`,
          );
        }
      }

      // --- Correctness: hệ thống hợp lệ ---
      if (!VALID_SYSTEM.includes(record.System)) {
        report('Major', file, tc, 'C-SYSTEM', `System "${record.System}" không thuộc {T1,T2,T3,ALL}`);
      }

      // --- Clarity: Title đủ cụ thể ---
      const title = (record.Title ?? '').trim();
      if (title.length === 0) {
        report('Major', file, tc, 'CL-TITLE', 'Title rỗng');
      } else {
        if (title.length < MIN_TITLE_LENGTH) {
          report(
            'Minor',
            file,
            tc,
            'CL-TITLE',
            `Title chỉ ${title.length} ký tự (< ${MIN_TITLE_LENGTH}), dễ mơ hồ khi người khác chạy`,
          );
        }
        if (PLACEHOLDER_PATTERN.test(title)) {
          report('Minor', file, tc, 'CL-TITLE', `Title còn chỗ trống: "${title}"`);
        }
        // Ký tự đầu phải là chữ hoa (bỏ qua ký tự mở đầu không phải chữ cái).
        const firstLetter = /[\p{L}]/u.exec(title);
        if (firstLetter && firstLetter[0] === firstLetter[0].toLowerCase()) {
          report('Minor', file, tc, 'CL-TITLE', 'Title không bắt đầu bằng chữ hoa');
        }
      }

      // --- Completeness: các trường rời rạc có giá trị hợp lệ ---
      if (!VALID_PRIORITY.includes(record.Priority)) {
        report('Major', file, tc, 'CMP-PRIO', `Priority "${record.Priority}" không hợp lệ`);
      }
      const validTechniques = isNfr ? VALID_TECHNIQUE_NFR : VALID_TECHNIQUE;
      if (!validTechniques.includes(record.Technique)) {
        report(
          'Major',
          file,
          tc,
          'CMP-TECH',
          `Technique "${record.Technique}" không thuộc ${validTechniques.join('/')}`,
        );
      }
      if (!VALID_TYPE.includes(record.Type)) {
        report('Major', file, tc, 'CMP-TYPE', `Type "${record.Type}" không thuộc Auto/Manual`);
      }
      if (!VALID_OWNER.includes(record.Owner)) {
        report('Major', file, tc, 'CMP-OWNER', `Owner "${record.Owner}" không thuộc 4 thành viên`);
      }
      if (!VALID_STATUS.includes(record.Status)) {
        report('Major', file, tc, 'CMP-STATUS', `Status "${record.Status}" không hợp lệ`);
      }
    }
  }

  // --- Consistency: không trùng Title trong cùng nhóm (yêu cầu, hệ thống) ---
  const titleIndex = new Map();
  for (const record of allRecords) {
    const key = `${record.Requirement_ID}|${record.System}|${(record.Title ?? '').trim().toLowerCase()}`;
    if (titleIndex.has(key)) {
      report(
        'Minor',
        record._file,
        record.TC_ID,
        'C-DUP',
        `Title trùng với ${titleIndex.get(key)} trong cùng nhóm (${record.Requirement_ID}, ${record.System})`,
      );
    } else {
      titleIndex.set(key, record.TC_ID);
    }
  }

  // --- Completeness ở cấp bộ: mỗi yêu cầu SRS-01 phải có test case ---
  const covered = new Set(allRecords.map((r) => r.Requirement_ID));
  for (const req of requirements) {
    if (!covered.has(req.id)) {
      report('Major', '(bộ test case)', req.id, 'CMP-COVER', `yêu cầu ${req.id} chưa có test case nào`);
    }
  }

  // --- Báo cáo ---
  const bySeverity = { Major: [], Minor: [], Observation: [] };
  for (const finding of findings) bySeverity[finding.severity].push(finding);

  const lines = [];
  lines.push('# Báo cáo Inspection bộ test case — checklist 4C');
  lines.push('');
  lines.push('Nguồn: `docs/testcases/{t1,t2,t3,nfr}.csv` · SRS-01 · `docs/requirements.csv`');
  lines.push(`Tổng test case: ${allRecords.length}`);
  lines.push(
    `Tổng phát hiện: ${findings.length} (Major ${bySeverity.Major.length} · Minor ${bySeverity.Minor.length} · Observation ${bySeverity.Observation.length})`,
  );
  lines.push('');

  for (const severity of ['Major', 'Minor', 'Observation']) {
    lines.push(`## ${severity} (${bySeverity[severity].length})`);
    lines.push('');
    if (bySeverity[severity].length === 0) {
      lines.push('Không có.');
      lines.push('');
      continue;
    }
    lines.push('| File | TC_ID | Quy tắc | Chi tiết |');
    lines.push('|---|---|---|---|');
    for (const finding of bySeverity[severity]) {
      lines.push(
        `| ${finding.file} | ${finding.tc} | ${finding.rule} | ${finding.detail.replace(/\|/g, '\\|')} |`,
      );
    }
    lines.push('');
  }

  const outputPath = path.join(REPORTS_DIR, 'raw', 'tc-review-check.txt');
  await writeText(outputPath, lines.join('\n'));

  log(`Đã ghi ${path.relative(process.cwd(), outputPath)}`);
  log(
    `Tổng test case: ${allRecords.length} · phát hiện: ${findings.length} ` +
      `(Major ${bySeverity.Major.length} · Minor ${bySeverity.Minor.length} · Observation ${bySeverity.Observation.length})`,
  );

  if (bySeverity.Major.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
