import { readText, parseCsv } from './lib/common.mjs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

/** So khop TC-ID giua spec Playwright va docs/testcases/*.csv */
async function quetSpec(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await quetSpec(p)));
    else if (e.name.endsWith('.spec.ts')) out.push(p);
  }
  return out.sort();
}

const csvIds = new Map();
for (const f of ['t1', 't2', 't3', 'nfr', 'uat']) {
  const { records } = parseCsv(await readText(`docs/testcases/${f}.csv`));
  for (const r of records) csvIds.set(r.TC_ID, { title: r.Title, file: f, req: r.Requirement_ID });
}

const specs = await quetSpec('tests');
const used = new Map();
for (const s of specs) {
  const txt = await readText(s);
  for (const m of txt.matchAll(/'(TC-[A-Z0-9-]+):\s*([^']*)'/g)) {
    const id = m[1];
    const title = m[2];
    if (!used.has(id)) used.set(id, []);
    used.get(id).push({ file: path.basename(s), title });
  }
  // Template literal: `TC-T1-M3-007: ...` (BVA sinh động)
  for (const m of txt.matchAll(/`(TC-[A-Z0-9-]+):\s*([^`]*)`/g)) {
    const id = m[1];
    const title = m[2];
    if (!used.has(id)) used.set(id, []);
    used.get(id).push({ file: path.basename(s), title });
  }
}

console.log('so spec', specs.length, '| so TC-ID dung trong spec', used.size);
console.log('\n--- SPEC dung TC-ID KHONG ton tai trong CSV ---');
let n = 0;
for (const [id, arr] of used) {
  if (!csvIds.has(id)) {
    n += 1;
    for (const a of arr) console.log(`  ${id}  (${a.file}) "${a.title}"`);
  }
}
if (n === 0) console.log('  (khong co)');

console.log('\n--- SPEC trung TC-ID ---');
n = 0;
for (const [id, arr] of used) {
  if (arr.length > 1) {
    n += 1;
    console.log(`  ${id}: ${arr.map((a) => `${a.file}:"${a.title.slice(0, 45)}"`).join('  ||  ')}`);
  }
}
if (n === 0) console.log('  (khong co)');

console.log('\n--- TIEU DE spec KHAC CSV (mapping lech) ---');
n = 0;
for (const [id, arr] of used) {
  const csv = csvIds.get(id);
  if (!csv) continue;
  for (const a of arr) {
    if (a.title.trim() !== csv.title.trim()) {
      n += 1;
      console.log(`  ${id}\n     spec: "${a.title}"\n     csv : "${csv.title}"`);
    }
  }
}
if (n === 0) console.log('  (khong co)');

console.log('\n--- Ca TAI chua co spec ---');
for (const [id, csv] of csvIds) {
  if (!used.has(id) && csv.file !== 'uat' && csv.file !== 't3') {
    console.log(`  ${id} | ${csv.req} | ${csv.title}`);
  }
}
