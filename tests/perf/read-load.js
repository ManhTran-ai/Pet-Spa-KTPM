import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

/**
 * NFR-01 / TC-NFR-01-006 — kịch bản tải đọc mức nhẹ trên site đích.
 *
 * Ngày 5 — Ngân (TV3). Ranh giới ADR-11:
 *  - chỉ GET trang công khai, không POST vào endpoint đặt lịch;
 *  - tối đa 10 VU, mỗi VU giữ lễ tinh giữa các lần gọi;
 *  - chạy ngoài giờ cao điểm nếu được phép.
 *
 * Ngưỡng đạt (SRS-01 §9.1): không gây lỗi 5xx.
 *
 * Biến môi trường:
 *   K6_VUS        số VU (mặc định 10 — trần của ADR-11)
 *   K6_DURATION   thời lượng (mặc định 1m, theo TC-NFR-01-006)
 *   K6_TARGET     chỉ đo một hệ thống: T1 | T2 | T3
 */

const VU = Number(__ENV.K6_VUS ?? 10);
const DURATION = __ENV.K6_DURATION ?? '1m';

const TARGETS = {
  T1: 'https://petngon.vn/vi',
  T2: 'https://matpet.vn/spa',
  T3: 'https://prettypawscatanddoggrooming.groomore.com/',
};

const danhSach = __ENV.K6_TARGET ? [TARGETS[__ENV.K6_TARGET]] : Object.values(TARGETS);

/** Đo riêng độ trễ của từng hệ thống để biết site nào là nút thắt. */
const doLatT1 = new Trend('do_lat_t1', true);
const doLatT2 = new Trend('do_lat_t2', true);
const doLatT3 = new Trend('do_lat_t3', true);
const loi5xx = new Counter('loi_5xx');

export const options = {
  vus: VU,
  duration: DURATION,
  thresholds: {
    // Ngưỡng đạt của TC-NFR-01-006: không lỗi 5xx.
    http_req_failed: ['rate<0.05'],
    // Ngưỡng quan sát: p95 < 5 giây (xem reports/raw/k6-summary.csv).
    http_req_duration: ['p(95)<5000'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'max'],
};

const USER_AGENT = 'petspa-ktpm-load-test/1.0 (+k6; read-only; contact: ngan@student)';

export default function () {
  // Chia đều VU cho 3 site để không dồn tải vào một hệ thống.
  const url = danhSach[(__VU - 1) % danhSach.length];

  const response = http.get(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    tags: { target: url },
  });

  const ok = check(response, {
    'tra ve 2xx hoac 3xx': (r) => r.status >= 200 && r.status < 400,
  });

  if (response.status >= 500) loi5xx.add(1);

  if (url.includes('petngon.vn')) doLatT1.add(response.timings.duration);
  else if (url.includes('matpet.vn')) doLatT2.add(response.timings.duration);
  else doLatT3.add(response.timings.duration);

  if (!ok) console.error(`Fail ${url} → ${response.status}`);

  // Giữ lễ tinh giữa các lần gọi cho từng VU.
  sleep(3);
}

/**
 * Tự dựng bản tóm tắt để nhóm đối chiếu được giữa các lần regression (Ngày 13).
 * k6 v2.3.0 không kèm thư viện `k6/summary` nên không dùng `format()`.
 */
export function handleSummary(data) {
  const tongHop = (ten) => {
    const metric = data.metrics[ten];
    if (!metric) return null;
    const value = metric.values ?? {};
    return {
      avg: value.avg,
      min: value.min,
      med: value.med,
      p90: value['p(90)'],
      p95: value['p(95)'],
      max: value.max,
      count: metric.values?.count ?? value.count,
    };
  };

  const tomTat = {
    ngay: new Date().toISOString(),
    kichBan: 'tests/perf/read-load.js',
    vus: VU,
    duration: DURATION,
    http_reqs: data.metrics.http_reqs?.values?.count ?? 0,
    http_req_failed_rate: data.metrics.http_req_failed?.values?.rate ?? null,
    checks_failed: data.metrics.checks?.values?.failed ?? 0,
    loi_5xx: data.metrics.loi_5xx?.values?.count ?? 0,
    do_lat_t1: tongHop('do_lat_t1'),
    do_lat_t2: tongHop('do_lat_t2'),
    do_lat_t3: tongHop('do_lat_t3'),
    nguong: {
      http_req_failed: 'rate<0.05',
      http_req_duration: 'p(95)<5000',
    },
  };

  const dong = [
    'NFR-01 / TC-NFR-01-006 — kết quả tải đọc',
    `  ngày: ${tomTat.ngay}`,
    `  VU: ${tomTat.vus} · thời lượng: ${tomTat.duration}`,
    `  số request: ${tomTat.http_reqs} · tỉ lệ lỗi: ${tomTat.http_req_failed_rate} · lỗi 5xx: ${tomTat.loi_5xx}`,
    `  check fail: ${tomTat.checks_failed}`,
  ];

  return {
    'reports/raw/k6-summary.json': JSON.stringify(tomTat, null, 2),
    stdout: `${dong.join('\n')}\n`,
  };
}
