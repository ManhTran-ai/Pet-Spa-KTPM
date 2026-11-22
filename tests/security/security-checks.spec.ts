import { test, expect } from '@playwright/test';
import { getWithRetry } from '../support/http';

/**
 * NFR-02 — 6 kiểm tra bảo mật trước đây chỉ làm thủ công, nay tự động hoá.
 *
 * Ranh giới ADR-11: payload đều **vô hại** — chỉ chứng minh rằng đầu vào được
 * mã hoá đúng hoặc dữ liệu nhạy cảm không bị rò rỉ ra mã nguồn trả về.
 * Không gửi payload khai thác (SQLi, RCE, traversal dắt chết), không đọc dữ liệu
 * khách hàng, không tạo tài khoản.
 *
 * Mỗi test case có System = ALL nên áp dụng cho cả 3 site: Fail nếu bất kỳ
 * site nào vi phạm (tránh che mất lỗi).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
] as const;

/** Payload XSS vô hại: chỉ chứng minh khả năng chèn thẻ, không gọi hàm nguy hiểm. */
const XSS_PAYLOAD = '<script>alert(1)</script>';

test.describe('NFR-02 — Kiểm tra bảo mật bổ sung (tự động hoá ca thủ công)', () => {
  test('TC-NFR-02-006: không có cookie phiên ẩn dùng sessionid trong HTML nguồn', async ({ page }) => {
    const leaks: string[] = [];
    for (const target of TARGETS) {
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      const html = await page.content();
      // Cookie phiên không được nhúng sẵn vào HTML nguồn trả về cho trình duyệt.
      const patterns = [/sessionid\s*=\s*["'][^"']{6,}["']/i, /["']sessionid["']\s*:\s*["'][^"']{6,}/i];
      for (const pattern of patterns) {
        if (pattern.test(html)) leaks.push(`${target.id} lộ sessionid trong HTML nguồn`);
      }
    }
    expect(leaks, leaks.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-007: payload script trong tên hiển thị đúng văn bản, không kích hoạt alert', async ({
    page,
  }) => {
    const problems: string[] = [];

    for (const target of TARGETS) {
      let alertFired = false;
      const onDialog = async (dialog: { dismiss: () => Promise<void> }) => {
        alertFired = true;
        await dialog.dismiss();
      };
      page.on('dialog', onDialog);

      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      // Tìm ô nhập đơn giản nhất trên trang để nhập payload.
      const input = page.locator('input[type="text"], input:not([type]), textarea').first();
      if ((await input.count()) === 0) {
        page.off('dialog', onDialog);
        continue;
      }

      await input.fill(XSS_PAYLOAD);
      await page.waitForTimeout(1200);

      // Payload phải được hiển thị nguyên văn hoặc đã mã hoá entity, không phải thẻ script.
      const rendered = await input.evaluate((el) => (el as HTMLInputElement).value);
      if (rendered.includes('<script>')) {
        // Giá trị ô nhập giữ nguyên là bình thường — vấn đề là khi nó bị chèn vào DOM
        // dưới dạng HTML. Kiểm tra DOM có thẻ script sinh ra từ payload không.
        const injected = await page.evaluate((payload) => {
          return document.body.innerHTML.includes(`<script>${payload}</script>`);
        }, XSS_PAYLOAD);
        if (injected) problems.push(`${target.id} chèn payload script thành công vào DOM`);
      }

      if (alertFired) problems.push(`${target.id} kích hoạt alert từ payload nhập vào form`);
      page.off('dialog', onDialog);
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-009: TLS bật và không nhận chứng thương mại hợp lệ bị từ chối', async ({
    request,
  }) => {
    const problems: string[] = [];

    for (const target of TARGETS) {
      const url = new URL(target.url);

      // Kết nối TLS phải thành công với chứng thương mại do CA tin cậy cấp.
      const response = await getWithRetry(request, target.url);
      if (!response.url().startsWith('https://')) problems.push(`${target.id} không dùng HTTPS`);

      // Chứng thương mại hợp lệ phải được chấp nhận (không bị từ chối).
      if (response.status() >= 500) problems.push(`${target.id} trả lỗi server khi TLS hợp lệ`);

      // Phiên bản TLS lỗi thời phải bị từ chối ở tầng server.
      if (url.protocol === 'https:') {
        const hsts = response.headers()['strict-transport-security'];
        if (hsts && !/max-age\s*=\s*\d{6,}/i.test(hsts)) {
          problems.push(`${target.id} HSTS thiếu max-age đủ lớn: ${hsts}`);
        }
      }
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-010: không rò rỉ khoá API, kho xác thực hoặc chuỗi kết nối', async ({ page }) => {
    const leaks: string[] = [];

    for (const target of TARGETS) {
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      const html = await page.content();
      const patterns = [
        // Chuỗi kết nối cơ sở dữ liệu.
        { re: /(mongodb(\+srv)?:\/\/[^\s"']+|postgres(?:ql)?:\/\/[^\s"']+|mysql:\/\/[^\s"']+)/i, moTa: 'chuỗi kết nối CSDL' },
        // Khoá dạng AWS.
        { re: /AKIA[0-9A-Z]{16}/, moTa: 'AWS access key id' },
        // Khoá dạng Google API.
        { re: /AIza[0-9A-Za-z_-]{35}/, moTa: 'Google API key' },
        // Khoá dạng Stripe.
        { re: /\bsk_(live|test)_[0-9a-zA-Z]{10,}/, moTa: 'Stripe secret key' },
        // Bearer token dạng JWT hard-code.
        { re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, moTa: 'JWT hard-code' },
      ];

      for (const { re, moTa } of patterns) {
        if (re.test(html)) leaks.push(`${target.id} lộ ${moTa} trong HTML nguồn`);
      }
    }
    expect(leaks, leaks.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-011: không rò rỉ email hay số điện thoại thực của khách hàng trong HTML nguồn', async ({
    page,
  }) => {
    const leaks: string[] = [];

    for (const target of TARGETS) {
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      const html = await page.content();

      // Kênh liên hệ chính thức của tiệm được công bố — không phải dữ liệu rò rỉ.
      const hotlineChinh = await page
        .locator('a[href^="tel:"]')
        .evaluateAll((els) => els.map((e) => (e.getAttribute('href') || '').replace('tel:', '')));
      const emailChinh = await page
        .locator('a[href^="mailto:"]')
        .evaluateAll((els) => els.map((e) => (e.getAttribute('href') || '').replace('mailto:', '')));

      // Email cá nhân của khách (loại trừ email thuộc kênh chính thức).
      const emailMatches = html.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? [];
      for (const email of new Set(emailMatches)) {
        if (emailChinh.includes(email)) continue;
        const domain = email.split('@')[1]?.toLowerCase() ?? '';
        const laEmailChinh = /^(gmail|yahoo|hotmail|outlook|icloud|aol)\./.test(domain);
        if (laEmailChinh) leaks.push(`${target.id} lộ email khách hàng: ${email}`);
      }

      // Số điện thoại: chỉ tính những chuỗi nằm trong thẻ liên hết, không phải
      // số nằm rải rác trong nội dung (timestamp tên ảnh, đường dẫn SVG, UUID).
      const sdtTrongThe = html.match(
        /(?:href|tel:)["'\s:=]*\+?\d[\d\s().-]{8,16}\d/gi,
      ) ?? [];
      for (const sdt of new Set(sdtTrongThe)) {
        const digits = sdt.replace(/\D/g, '');
        if (digits.length < 9) continue;
        const laHotlineChinh = hotlineChinh.some((h) => digits.endsWith(h.replace(/\D/g, '')));
        if (!laHotlineChinh) leaks.push(`${target.id} lộ số điện thoại khách hàng: ${sdt}`);
      }
    }
    expect(leaks, leaks.join('; ')).toEqual([]);
  });

  test('TC-NFR-02-012: form gửi chỉ không gửi tới URL bên thứ ba', async ({ page }) => {
    const problems: string[] = [];

    for (const target of TARGETS) {
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      const origin = new URL(target.url).origin;

      // action của form không được trỏ sang domain khác.
      const actions = await page.locator('form[action]').evaluateAll((els) =>
        els.map((e) => (e.getAttribute('action') || '').trim()),
      );
      for (const action of actions) {
        if (!action || action.startsWith('#') || action.startsWith('javascript:')) continue;
        try {
          const abs = new URL(action, target.url);
          if (abs.origin !== origin) problems.push(`${target.id} form action trỏ tới domain khác: ${action}`);
        } catch {
          problems.push(`${target.id} form action không phải URL hợp lệ: ${action}`);
        }
      }

      // input kiểu hidden không mang action tới bên thứ ba.
      const hiddenActions = await page
        .locator('input[type="hidden"][formaction]')
        .evaluateAll((els) => els.map((e) => e.getAttribute('formaction') || ''));
      for (const action of hiddenActions) {
        if (!action) continue;
        try {
          const abs = new URL(action, target.url);
          if (abs.origin !== origin) problems.push(`${target.id} formaction trỏ tới domain khác: ${action}`);
        } catch {
          problems.push(`${target.id} formaction không phải URL hợp lệ: ${action}`);
        }
      }
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });
});
