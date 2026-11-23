import { test, expect, type Page, type CDPSession } from '@playwright/test';

/**
 * NFR-01 — Hiệu năng tải trang trong trình duyệt thật (Ngân, Ngày 5/8).
 *
 * TC-NFR-01-003: DOMContentLoaded ≤ 3 giây trên mạng 4G mô phỏng.
 * TC-NFR-01-004: LCP ≤ 2,5 giây trên mạng 4G mô phỏng (trang chủ).
 * TC-NFR-01-005: LCP ≤ 2,5 giây trên mạng 4G mô phỏng (trang đặt lịch T1 và T2).
 *
 * Ranh giới ADR-11: chỉ GET trang công khai, không tương tác gửi form.
 * Tham số mô phỏng 4G theo Chrome DevTools "Slow 4G": tải 1,6 Mbps,
 * tải lên 750 kbps, độ trễ 150 ms.
 */

const MANG_4G = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

const GIOI_HAN_DCL = 3_000;
const GIOI_HAN_LCP = 2_500;

type DoDuc = {
  domContentLoaded: number;
  lcp: number;
  fcp: number;
};

/**
 * Gắn PerformanceObserver trước khi điều hướng để không bỏ sót LCP
 * (LCP được ghi đè liên tục cho tới khi người dùng tương tác).
 */
async function doTrucNghien(page: Page, url: string): Promise<DoDuc> {
  await page.addInitScript(() => {
    (window as unknown as { __lcp: number }).__lcp = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        (window as unknown as { __lcp: number }).__lcp = entry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForTimeout(3_000);

  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      domContentLoaded: nav ? nav.domContentLoadedEventEnd : Number.NaN,
      lcp: (window as unknown as { __lcp: number }).__lcp,
      fcp: fcp ? fcp.startTime : Number.NaN,
    };
  });
}

async function bat4G(page: Page): Promise<CDPSession> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', MANG_4G);
  return cdp;
}

const TRANG_CHU = {
  T1: 'https://petngon.vn/vi',
  T2: 'https://matpet.vn/spa',
  T3: 'https://prettypawscatanddoggrooming.groomore.com/',
};

test.describe('NFR-01 — Hiệu năng tải trang trên mạng 4G mô phỏng', () => {
  test('TC-NFR-01-003: DOMContentLoaded ≤ 3s trên cả 3 site', async ({ page }) => {
    const cdp = await bat4G(page);

    for (const [heThong, url] of Object.entries(TRANG_CHU)) {
      const doDuc = await doTrucNghien(page, url);

      console.log(
        `[NFR-01-003] ${heThong}: DCL=${Math.round(doDuc.domContentLoaded)}ms ` +
          `LCP=${Math.round(doDuc.lcp)}ms FCP=${Math.round(doDuc.fcp)}ms`,
      );
      expect(doDuc.domContentLoaded, `${heThong}: DOMContentLoaded`).toBeLessThanOrEqual(GIOI_HAN_DCL);
    }

    await cdp.detach();
  });

  test('TC-NFR-01-004: LCP ≤ 2,5s trên trang chủ cả 3 site', async ({ page }) => {
    const cdp = await bat4G(page);

    for (const [heThong, url] of Object.entries(TRANG_CHU)) {
      const doDuc = await doTrucNghien(page, url);

      console.log(`[NFR-01-004] ${heThong}: LCP=${Math.round(doDuc.lcp)}ms`);
      expect(doDuc.lcp, `${heThong}: LCP`).toBeLessThanOrEqual(GIOI_HAN_LCP);
    }

    await cdp.detach();
  });

  test('TC-NFR-01-005: LCP ≤ 2,5s trên trang đặt lịch T1 và T2', async ({ page }) => {
    const cdp = await bat4G(page);

    // Trang đặt lịch của T1 và T2 là trang chủ có form giữ chỗ nhúng sẵn
    // (SRS-01 FR-M4-01) — cùng đường dẫn, đo riêng để khớp định nghĩa ca.
    const trangDatLich = {
      T1: 'https://petngon.vn/vi/dat-lich',
      T2: 'https://matpet.vn/spa',
    };

    for (const [heThong, url] of Object.entries(trangDatLich)) {
      const doDuc = await doTrucNghien(page, url);

      console.log(`[NFR-01-005] ${heThong} trang đặt lịch: LCP=${Math.round(doDuc.lcp)}ms`);
      expect(doDuc.lcp, `${heThong}: LCP trang đặt lịch`).toBeLessThanOrEqual(GIOI_HAN_LCP);
    }

    await cdp.detach();
  });
});
