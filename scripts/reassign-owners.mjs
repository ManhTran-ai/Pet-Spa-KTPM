import fs from 'node:fs';

/**
 * Phân bổ lại Owner cho 226 test case (ADR-15).
 *
 * Nguyên tắc:
 * 1. Mỗi module của mỗi hệ thống có TỐI THIỂU 2 người chạy → đối chiếu chéo.
 * 2. Người viết và người chạy một phần của cùng hệ thống là hai người khác nhau.
 * 3. Chuyên môn NFR giữ nguyên theo ADR-15:
 *    NFR-02 → Mạnh (bảo mật), NFR-01/05 → Ngân (hiệu năng, độ tin cậy),
 *    NFR-03/04 → Tài (khả năng dùng, tương thích), NFR-06/07 → Lộc (a11y, SEO).
 * 4. Tổng ca mỗi người cân bằng trong khoảng 55–58 (chênh lệch ≤ 3).
 */

function sp(l) {
  const c = []; let f = ''; let q = false;
  for (let i = 0; i < l.length; i += 1) {
    const ch = l[i];
    if (q) {
      if (ch === '"') { if (l[i + 1] === '"') { f += '"'; i += 1; } else q = false; }
      else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { c.push(f.trim()); f = ''; }
    else f += ch;
  }
  c.push(f.trim());
  return c;
}
function esc(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function pc(text) {
  const L = text.trim().split(/\r?\n/); const h = sp(L[0]);
  return L.slice(1).filter(Boolean).map((l) => { const c = sp(l); const o = {}; h.forEach((k, i) => { o[k] = c[i]; }); return o; });
}

/** Phân bổ số ca cho từng người trong mỗi module: { [owner]: soLuong } */
const PLAN = {
  // T1 — Pet NGON (72 ca): Tài chính, Mạnh và Lộc đối chiếu
  'T1|M1': { Tài: 3, Mạnh: 2, Lộc: 1 },
  'T1|M2': { Tài: 3, Mạnh: 3, Lộc: 1 },
  'T1|M3': { Tài: 7, Mạnh: 7, Lộc: 4 },
  'T1|M4': { Tài: 5, Mạnh: 4, Lộc: 3 },
  'T1|M5': { Tài: 2, Mạnh: 2, Lộc: 2 },
  'T1|M6': { Tài: 7, Mạnh: 8, Lộc: 5 },
  'T1|M7': { Tài: 1, Mạnh: 1, Lộc: 1 },
  // T2 — Mật Pet Family (66 ca): Ngân chính, Tài và Lộc đối chiếu
  'T2|M1': { Ngân: 3, Tài: 1, Lộc: 2 },
  'T2|M2': { Ngân: 3, Tài: 2, Lộc: 1 },
  'T2|M3': { Ngân: 12, Tài: 6, Lộc: 6 },
  'T2|M4': { Ngân: 8, Tài: 5, Lộc: 4 },
  'T2|M5': { Ngân: 3, Tài: 2, Lộc: 1 },
  'T2|M7': { Ngân: 3, Tài: 1, Lộc: 3 },
  // T3 — Pretty Paws (44 ca): Mạnh chính, Ngân và Lộc đối chiếu
  'T3|M1': { Mạnh: 3, Ngân: 2, Lộc: 2 },
  'T3|M2': { Mạnh: 2, Ngân: 2, Lộc: 1 },
  'T3|M3': { Mạnh: 5, Ngân: 5, Lộc: 4 },
  'T3|M4': { Mạnh: 4, Ngân: 4, Lộc: 3 },
  'T3|M5': { Mạnh: 2, Ngân: 2, Lộc: 1 },
  'T3|M7': { Mạnh: 1, Lộc: 1 },
};

/** Chuyên môn NFR: toàn bộ ca của nhóm NFR thuộc về một người chuyên trách. */
const NFR_OWNER = {
  'NFR-01': 'Ngân',
  'NFR-02': 'Mạnh',
  'NFR-03': 'Tài',
  'NFR-04': 'Tài',
  'NFR-05': 'Ngân',
  'NFR-06': 'Lộc',
  'NFR-07': 'Lộc',
};

const FILES = ['t1', 't2', 't3', 'nfr'];
const totals = {};

for (const file of FILES) {
  const P = `docs/testcases/${file}.csv`;
  const raw = fs.readFileSync(P, 'utf8');
  const lines = raw.trim().split(/\r?\n/);
  const header = sp(lines[0]);
  const rows = pc(raw);

  // Gom theo khóa phân bổ
  const groups = new Map();
  for (const rec of rows) {
    const key = file === 'nfr' ? rec.Requirement_ID : `${rec.System}|${rec.Requirement_ID.split('-')[1]}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rec);
  }

  const out = [lines[0]];
  for (const [key, list] of groups) {
    let owners;
    if (file === 'nfr') {
      owners = list.map(() => NFR_OWNER[list[0].Requirement_ID]);
    } else {
      const plan = PLAN[key];
      if (!plan) throw new Error(`Thiếu kế hoạch phân bổ cho ${key}`);
      owners = [];
      for (const [owner, n] of Object.entries(plan)) for (let i = 0; i < n; i += 1) owners.push(owner);
      if (owners.length !== list.length) {
        throw new Error(`${key}: kế hoạch ${owners.length} ≠ số ca ${list.length}`);
      }
    }
    list.forEach((rec, i) => {
      rec.Owner = owners[i];
      totals[rec.Owner] = (totals[rec.Owner] || 0) + 1;
    });
    out.push(...list.map((rec) => header.map((h) => esc(rec[h])).join(',')));
  }
  fs.writeFileSync(P, `${out.join('\n')}\n`, 'utf8');
}

console.log('Tổng ca theo Owner:', JSON.stringify(totals));
const vals = Object.values(totals);
console.log('Chênh lệch max-min:', Math.max(...vals) - Math.min(...vals));
