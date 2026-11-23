import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Kiểm chứng trạng thái Open/Closed của T3 theo múi giờ trình duyệt.
 *
 * Ngày 2 — Ngân (TV3). Đầu ra: `reports/raw/survey-T3-status-timezone.csv`.
 *
 * Bối cảnh: endpoint `book-online-setting` của T3 trả `timezone_name = America/New_York`
 * và `working_hour` 480–1200 phút (08:00–20:00) cho cả 7 ngày. Trạng thái
 * "Open"/"Closed" hiển thị trên UI được render bất đồng bộ ~4s.
 *
 * Giả thuyết cần kiểm chứng: trạng thái có được tính theo múi giờ của tiệm
 * hay theo múi giờ của TRÌNH DUYỆT đang xem. Nếu theo trình duyệt thì khách ở
 * múi giờ khác sẽ thấy "Open" lúc tiệm đã đóng — đó là lỗi sản phẩm.
 */
const URL_T3 = 'https://prettypawscatanddoggrooming.groomore.com/';
const TZ_TIEM = 'America/New_York';
const GIO_MO_CUA = 8;
const GIO_DONG_CUA = 20;

const browser = await chromium.launch({ channel: 'chrome' });

// Múi giờ đại diện cho các vùng khách của T3 (tiệm ở New Jersey).
const MUI_GIO = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Ho_Chi_Minh',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
];

const rows = [['Browser_Timezone', 'Browser_Local_Time', 'Salon_Local_Time_NewYork', 'Salon_Open_Hours', 'UI_Status', 'Correct', 'Note']];
let sai = 0;

for (const tz of MUI_GIO) {
  const context = await browser.newContext({ locale: 'en-US', timezoneId: tz });
  const page = await context.newPage();

  await page.goto(URL_T3, { waitUntil: 'load', timeout: 60_000 });

  // Trạng thái render bất đồng bộ; chờ tới khi xuất hiện hoặc hết 20s.
  let trangThai = '(không hiển thị)';
  for (let i = 0; i < 20; i += 1) {
    await page.waitForTimeout(1000);
    const kiemTra = await page.evaluate(() => {
      const drawer = document.querySelector('.MuiDrawer-paper');
      const text = drawer ? drawer.innerText.replace(/\s+/g, ' ') : '';
      const match = text.match(/\b(Open|Closed)\b/i);
      return match ? match[1] : null;
    });
    if (kiemTra) {
      trangThai = kiemTra;
      break;
    }
  }

  const gio = await page.evaluate(
    ({ tzTiem }) => ({
      trinhDuyet: new Date().toLocaleString('en-US', { hour12: false }),
      tiem: new Date().toLocaleString('en-US', { hour12: false, timeZone: tzTiem }),
      gioTiem: new Date().toLocaleString('en-US', { hour12: false, timeZone: tzTiem, hour: '2-digit' }),
    }),
    { tzTiem: TZ_TIEM },
  );

  const gioTiem = Number(gio.gioTiem);
  const tiemDangMo = gioTiem >= GIO_MO_CUA && gioTiem < GIO_DONG_CUA;
  const trangThaiDung = (trangThai === 'Open') === tiemDangMo;

  if (!trangThaiDung) sai += 1;

  rows.push([
    tz,
    gio.trinhDuyet,
    gio.tiem,
    `${String(GIO_MO_CUA).padStart(2, '0')}:00-${String(GIO_DONG_CUA).padStart(2, '0')}:00`,
    trangThai,
    trangThaiDung ? 'YES' : 'NO',
    trangThaiDung
      ? 'Trạng thái khớp với giờ mở cửa của tiệm'
      : `Tiệm đang ${tiemDangMo ? 'mở' : 'đóng'} theo giờ ${TZ_TIEM} nhưng UI hiển thị "${trangThai}"`,
  ]);

  console.log(`TZ=${tz.padEnd(20)} ${gio.trinhDuyet} | NY ${gio.tiem} | UI=${trangThai} | ${trangThaiDung ? 'đúng' : 'SAI'}`);

  await context.close();
}

await browser.close();

const csv = rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
fs.writeFileSync('reports/raw/survey-T3-status-timezone.csv', `\uFEFF${csv}\n`, 'utf8');

console.log(`\nsurvey-T3-status-timezone.csv: ${rows.length - 1} dòng · sai: ${sai}`);
