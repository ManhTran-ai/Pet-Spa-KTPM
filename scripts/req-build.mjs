import { readText, writeText, parseCsv, toCsv, listFiles, log, fail } from './lib/common.mjs';
import path from 'node:path';

const ROOT = process.cwd();
const SRS_PATH = path.join(ROOT, 'docs', 'source', 'Đặc tả Yêu cầu Phần Mềm (SRS).md');
const TC_DIR = path.join(ROOT, 'docs', 'testcases');
const OUT = path.join(ROOT, 'docs', 'requirements.csv');

async function main() {
  const srs = await readText(SRS_PATH);

  const reqs = [];
  const reqRe = /^\|\s*((?:FR-M\d-\d+)|(?:NFR-\d+))\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm;
  const stripBold = (s) => s.replace(/\*\*/g, '').trim();
  let m;
  while ((m = reqRe.exec(srs)) !== null) {
    reqs.push({ id: m[1].trim(), title: stripBold(m[2]), systems: m[3].trim(), priority: m[4].trim(), criteria: stripBold(m[5]) });
  }

  const ucRe = /^\|\s*(UC-\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/gm;
  const ucMap = new Map();
  while ((m = ucRe.exec(srs)) !== null) {
    ucMap.set(m[1].trim(), { title: m[2].trim(), systems: m[3].trim(), reqs: m[4].trim() });
  }

  const ownerByReq = new Map();
  for (const file of await listFiles(TC_DIR, '.csv')) {
    if (path.basename(file) === 'uat.csv') continue;
    for (const rec of parseCsv(await readText(file)).records) {
      if (!rec.Requirement_ID || !rec.Owner) continue;
      if (!ownerByReq.has(rec.Requirement_ID)) ownerByReq.set(rec.Requirement_ID, new Set());
      ownerByReq.get(rec.Requirement_ID).add(rec.Owner);
    }
  }

  const headers = ['id', 'type', 'module', 'priority', 'systems', 'title', 'acceptance_criteria', 'uc_refs', 'test_owner'];
  const records = reqs.map((r) => {
    const ucs = [...ucMap.entries()].filter(([, u]) => u.reqs.includes(r.id)).map(([k]) => k);
    const owners = [...(ownerByReq.get(r.id) ?? [])].join(' ');
    return {
      id: r.id,
      type: r.id.startsWith('NFR') ? 'NFR' : 'FR',
      module: r.id.startsWith('NFR') ? 'NFR' : r.id.split('-')[1],
      priority: r.priority,
      systems: r.systems,
      title: r.title,
      acceptance_criteria: r.criteria,
      uc_refs: ucs.join(' '),
      test_owner: owners,
    };
  });

  await writeText(OUT, toCsv(headers, records));
  log(`requirements.csv: ${records.length} yêu cầu`);
  const noOwner = records.filter((r) => !r.test_owner);
  if (noOwner.length > 0) fail(`Yêu cầu chưa có test owner: ${noOwner.map((r) => r.id).join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
