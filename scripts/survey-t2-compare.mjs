import fs from 'node:fs';

/**
 * So sanh gia Chó vs Mèo cho T2 (decision table FR-M3-02 / DT bảng giá).
 * T2 khai báo dùng CHUNG một bảng giá cho cả Chó và Mèo — nếu có sai lệch
 * thì đó là sai lệch giữa SRS và thực tế (bằng chứng cho DEF/CR).
 */
const csv = fs.readFileSync('reports/raw/survey-T2-matrix.csv', 'utf8').trim().split('\n');
const header = csv[0].split(',');
const rows = csv.slice(1).map((line) => {
  const cells = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === ',' && !inQ) {
      cells.push(cur);
      cur = '';
    } else cur += ch;
  }
  cells.push(cur);
  const o = {};
  header.forEach((h, i) => (o[h] = cells[i] ?? ''));
  return o;
});

/** Chuan hoa tên dịch vụ: cat phan "Báo giá theo..." va "Báo giá riêng" ra. */
function chuanHoaTen(raw) {
  return raw
    .replace(/Báo giá theo tình trạng lông:.*$/i, '')
    .replace(/Báo giá tuỳ kích thước & màu/i, '')
    .replace(/Báo giá theo thiết kế riêng/i, '')
    .replace(/Báo giá riêng/i, '')
    .trim();
}

const map = new Map();
for (const r of rows) {
  const ten = chuanHoaTen(r.Service);
  const key = `${r.Band}|${ten}`;
  if (!map.has(key)) map.set(key, {});
  map.get(key)[r.Pet] = r.Price;
}

let diff = 0;
let same = 0;
const bang = [];
for (const [key, v] of map.entries()) {
  const cho = v.Cho ?? '';
  const meo = v.Meo ?? '';
  if (cho !== meo) {
    diff += 1;
    bang.push({ Band: key.split('|')[0], Service: key.split('|')[1], Cho: cho, Meo: meo });
  } else same += 1;
}

console.log(`Tong cap (band x service): ${map.size}`);
console.log(`Gia giong nhau: ${same}`);
console.log(`Gia KHAC nhau: ${diff}`);
console.log('\n=== BANG SAI LECH ===');
bang.forEach((b) => console.log(`${b.Band} | ${b.Service} | Cho=${b.Cho} | Meo=${b.Meo}`));

fs.writeFileSync(
  'reports/raw/survey-T2-dog-vs-cat-diff.csv',
  ['Band,Service,Cho,Meo', ...bang.map((b) => `${b.Band},${b.Service},${b.Cho},${b.Meo}`)].join('\n') + '\n',
  'utf8',
);
console.log('\n-> reports/raw/survey-T2-dog-vs-cat-diff.csv');
