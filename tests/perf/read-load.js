import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * NFR-01 — Kiểm thử tải đọc mức nhẹ trên site đích.
 * ADR-11: chỉ GET, ≤ 10 VU, chạy ngoài giờ cao điểm.
 */
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<5000'],
  },
};

const TARGETS = [
  'https://petngon.vn/vi',
  'https://matpet.vn/spa',
  'https://prettypawscatanddoggrooming.groomore.com',
];

export default function () {
  const url = TARGETS[__VU % TARGETS.length];
  const response = http.get(url, { headers: { 'User-Agent': 'petspa-ktpm-load-test/1.0' } });
  check(response, {
    'tra ve 2xx hoac 3xx': (r) => r.status >= 200 && r.status < 400,
  });
  sleep(3);
}
