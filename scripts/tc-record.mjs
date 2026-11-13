import path from 'node:path';
import { DOCS_DIR, listFiles, log, parseCsv, readText, toCsv, writeText } from './lib/common.mjs';

const testcasesDir = path.join(DOCS_DIR, 'testcases');

function parseArgs(argv) {
  const args = { tcId: '', result: '', by: '', defect: '', note: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--by') {
      args.by = argv[i + 1] ?? '';
      i += 1;
    } else if (arg === '--defect') {
      args.defect = argv[i + 1] ?? '';
      i += 1;
    } else if (arg === '--note') {
      args.note = argv[i + 1] ?? '';
      i += 1;
    } else if (!arg.startsWith('--') && !args.tcId) {
      args.tcId = arg;
    } else if (!arg.startsWith('--') && !args.result) {
      args.result = arg;
    }
  }
  return args;
}

const VALID_RESULTS = ['pass', 'fail', 'blocked'];

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.tcId) {
    console.error('Thiếu TC-ID. Ví dụ: npm run tc:record -- TC-M2-001 pass --by Mạnh');
    process.exitCode = 1;
    return;
  }
  if (!VALID_RESULTS.includes(args.result)) {
    console.error(`Kết quả phải là một trong: ${VALID_RESULTS.join(', ')}.`);
    process.exitCode = 1;
    return;
  }
  if (!args.by) {
    console.error('Thiếu --by <tên người chạy>. Bắt buộc.');
    process.exitCode = 1;
    return;
  }
  if (args.result === 'fail' && !args.defect) {
    console.error('Kết quả fail bắt buộc có --defect DEF-nnn.');
    process.exitCode = 1;
    return;
  }

  const files = await listFiles(testcasesDir, '.csv');
  for (const file of files) {
    const name = path.basename(file);
    if (name.startsWith('_')) {
      continue;
    }
    const { headers, records } = await parseCsv(await readText(file));
    const record = records.find((r) => r.tc_id === args.tcId);
    if (!record) {
      continue;
    }

    record.status = args.result === 'pass' ? 'Pass' : args.result === 'fail' ? 'Fail' : 'Blocked';
    record.executor = args.by;
    record.run_date = new Date().toISOString().slice(0, 10);
    record.build = process.env.GIT_COMMIT ?? 'local';
    if (args.defect) {
      record.defect_id = args.defect;
    }
    if (args.note) {
      record.notes = args.note;
    }

    await writeText(file, toCsv(headers, records));
    log(`Đã ghi kết quả ${args.tcId} = ${record.status} (${args.by}) trong ${name}`);
    return;
  }

  console.error(`Không tìm thấy test case ${args.tcId} trong ${path.relative(process.cwd(), testcasesDir)}.`);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
