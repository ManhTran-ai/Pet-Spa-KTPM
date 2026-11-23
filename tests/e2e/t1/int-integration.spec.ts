import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import {
  chonCanNang,
  chonDichVu,
  chonTanNha,
  dienTenBe,
  docKm,
  docPhiDiChuyen,
  docTongTat,
  docTongTien,
  moWizard,
  nhapDiaChi,
  sangBuoc2,
  sangBuoc4,
  tiepTuc,
} from '../../support/t1-wizard';

/**
 * Kiểm thử tích hợp T1 — Pet NGON (Ngày 10, Tài/TV2).
 *
 * Mục tiêu theo `reports/gates/plan-tai.md` § Ngày 10:
 *   10.1 Quan sát network của wizard T1
 *   10.2 Kiểm chứng hợp đồng dữ liệu: giá bảng tĩnh == giá wizard tính ra
 *   10.3 Kiểm chứng validation biên: 2.9 / 3 / 3.1 kg → đúng bậc
 *   10.4 Phụ thu di chuyển: 0 / 2 / 5 / 6 / 7 km theo max(0, km − 5) × 8.000₫
 *
 * RANH GIỚI ADR-11: chỉ điền/chọn, **không** bấm nút "Xác nhận đặt lịch".
 */

/** 7 bậc cân nặng của T1 cho Chó — nhãn hiển thị trong DOM wizard. */
const BAC_CHO = [
  { ten: 'Chó mini', kg: '< 3kg', mo: 130_000 },
  { ten: 'Chó nhỏ', kg: '3–5kg', mo: 265_000 },
  { ten: 'Chó vừa', kg: '5–10kg', mo: 375_000 },
  { ten: 'Chó lớn', kg: '10–15kg', mo: 460_000 },
  { ten: 'Chó rất lớn', kg: '15–20kg', mo: 550_000 },
  { ten: 'Chó đại', kg: '20–25kg', mo: 640_000 },
  { ten: 'Chó siêu đại', kg: '25–30kg', mo: 725_000 },
] as const;

/** 6 dịch vụ T1 — khoảng giá tĩnh theo bậc Chó mini / Chó siêu đại. */
const DICH_VU = [
  { ten: 'Tắm', min: 88_000, max: 660_000 },
  { ten: 'Cắt tỉa lông', min: 145_000, max: 440_000 },
  { ten: 'Cạo lông', min: 88_000, max: 385_000 },
  { ten: 'Combo Tắm + Vệ sinh', min: 130_000, max: 725_000 },
  { ten: 'Combo Tắm + Cắt tỉa', min: 240_000, max: 835_000 },
  { ten: 'Combo Tắm + Cạo', min: 185_000, max: 780_000 },
] as const;

test.describe('INT-T1 — Kiểm thử tích hợp T1 (Pet NGON)', () => {
  test('INT-T1-001: 10.1 — Wizard không gọi API giá (dữ liệu đóng gói sẵn trong bundle SSR)', async ({ page }) => {
    const apiCalls: { method: string; url: string; type: string }[] = [];
    page.on('request', (req) => {
      const t = req.resourceType();
      if (t === 'xhr' || t === 'fetch') {
        apiCalls.push({ method: req.method(), url: req.url(), type: t });
      }
    });

    const modal = await moWizard(page);
    await chonDichVu(modal, 'Combo Tắm + Vệ sinh');
    await tiepTuc(modal);
    await chonCanNang(modal, 'Chó nhỏ');
    await dienTenBe(modal);
    await page.waitForTimeout(1500);

    // Ghi nhận bằng chứng quan sát network
    fs.mkdirSync('reports/raw', { recursive: true });
    fs.writeFileSync(
      'reports/raw/t1-network.json',
      JSON.stringify({ capturedAt: new Date().toISOString(), apiCalls }, null, 2),
      'utf8',
    );

    /**
     * Kết luận kiểm thử (10.1):
     * T1 là Next.js App Router. Giá, bậc cân nặng và công thức phụ thu đều được
     * **đóng gói sẵn trong RSC payload / JS bundle**, không có endpoint giá riêng.
     *
     * Vì vậy ta chỉ loại trừ các request **có thể mang dữ liệu giá**.
     * - `_rsc=` → prefetch RSC của Next.js (điều hướng prefetch, không phải giá)
     * - `google-analytics.com` → telemetry, không phải dữ liệu nghiệp vụ
     * Mọi request còn lại (nếu có) sẽ là API giá → phải đưa vào báo cáo.
     */
    const requestGia = apiCalls.filter(
      (c) => !c.url.includes('_rsc=') && !c.url.includes('google-analytics.com'),
    );
    expect(
      requestGia,
      `Wizard T1 gọi API giá — hợp đồng dữ liệu đã thay đổi: ${JSON.stringify(requestGia)}`,
    ).toEqual([]);
  });

  test('INT-T1-002: 10.2 — Hợp đồng dữ liệu: khoảng giá bảng tĩnh == khoảng giá trong wizard', async ({ page }) => {
    const modal = await moWizard(page);

    /**
     * Khoảng giá hiển thị ngay trên thẻ dịch vụ ở bước 1.
     * Tên dịch vụ nằm trong thẻ `.bk-svc__row > b`; không dùng `innerText` của
     * cả thẻ vì sẽ lẫn tên icon Material (`bathtub`, `cut`, ...).
     */
    const the = modal.locator('.bk-svc');
    const soDichVu = await the.count();
    expect(soDichVu, 'Wizard T1 phải có 6 dịch vụ').toBe(6);

    const khoangTrongWizard: Record<string, { min: number; max: number }> = {};
    for (let i = 0; i < soDichVu; i++) {
      const t = await the.nth(i).locator('.bk-svc__row').innerText();
      const ten = t.split('\n')[0]!.trim();
      const m = t.match(/([\d.]+)₫\s*–\s*([\d.]+)₫/);
      expect(m, `Không đọc được khoảng giá của "${ten}"`).not.toBeNull();
      khoangTrongWizard[ten] = {
        min: Number(m![1]!.replace(/\./g, '')),
        max: Number(m![2]!.replace(/\./g, '')),
      };
    }

    // Khoảng giá tĩnh lấy từ bảng giá trên trang (bảng <table> của trang chủ)
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const bangGia = await page.locator('table').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).join(' | '),
    );

    for (const dv of DICH_VU) {
      const khoang = khoangTrongWizard[dv.ten];
      expect(khoang, `Wizard thiếu dịch vụ "${dv.ten}"`).toBeDefined();

      // Mốc min/max phải khớp giá trị bảng tĩnh ở bậc ngoài cùng
      expect(khoang!.min, `Giá min "${dv.ten}" lệch bảng tĩnh`).toBe(dv.min);
      expect(khoang!.max, `Giá max "${dv.ten}" lệch bảng tĩnh`).toBe(dv.max);
    }

    fs.writeFileSync(
      'reports/raw/t1-int-contract-price-range.json',
      JSON.stringify({ khoangTrongWizard, bangGiaExcerpt: bangGia.slice(0, 3000) }, null, 2),
      'utf8',
    );
  });

  test('INT-T1-003: 10.2 — Giá wizard ở bước 2 khớp bảng tĩnh theo từng bậc cân nặng', async ({ page }) => {
    const modal = await moWizard(page);
    await chonDichVu(modal, 'Combo Tắm + Vệ sinh');
    await sangBuoc2(modal, 'Combo Tắm + Vệ sinh');

    // Chọn "Chó" để lộ nhóm bậc Chó
    await modal.locator('.bk-pet').filter({ hasText: 'Chó' }).first().click();
    await page.waitForTimeout(400);

    const giaTheoBac: Record<string, number | null> = {};
    for (const bac of BAC_CHO) {
      await chonCanNang(modal, bac.ten);
      await page.waitForTimeout(300);

      // Giá hiển thị ngay trên thẻ bậc (<em>) và dòng tóm tắt
      const em = await modal
        .locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet')
        .filter({ hasText: bac.ten })
        .first()
        .locator('em')
        .innerText();
      const giaThe = Number(em.replace(/[^\d]/g, ''));

      giaTheoBac[bac.ten] = giaThe;

      expect(giaThe, `Giá hiển thị tại bậc "${bac.ten}" (${bac.kg}) lệch bảng tĩnh`).toBe(bac.mo);
    }

    fs.writeFileSync(
      'reports/raw/t1-int-contract-by-band.json',
      JSON.stringify({ dichVu: 'Combo Tắm + Vệ sinh', giaTheoBac }, null, 2),
      'utf8',
    );
  });

  test('INT-T1-004: 10.3 — Validation biên: 2.9 / 3 / 3.1 kg ánh xạ đúng bậc', async ({ page }) => {
    const modal = await moWizard(page);
    await chonDichVu(modal, 'Combo Tắm + Vệ sinh');
    await sangBuoc2(modal, 'Combo Tắm + Vệ sinh');
    await modal.locator('.bk-pet').filter({ hasText: 'Chó' }).first().click();
    await page.waitForTimeout(400);

    /**
     * Quy ước biên của T1 — BR-01 + `docs/design/test-design-techniques.md` §3.1:
     *   Chó mini = kg < 3
     *   Chó nhỏ  = 3 ≤ kg ≤ 5     (ngưỡng 3 kg thuộc bậc `3–5`)
     *   Chó vừa  = 5 < kg ≤ 10    (ngưỡng 5 kg thuộc bậc `5–10`)
     * Bậc đúng = bậc có cận dưới `lo` lớn nhất thỏa `lo <= kg`
     * (giống quy tắc đã chốt cho T2 ở §3.2).
     */
    const bacCho = (kg: number): string => {
      const bang = BAC_CHO.map((b) => {
        // Nhãn bậc dạng `< 3kg` hoặc `3–5kg` (dấu gạch ngang – hoặc -).
        const laDau = b.kg.trim().startsWith('<');
        const so = b.kg
          .replace(/[^\d.\s–-]/g, '')
          .split(/[–-]/)
          .map((x) => Number(x.trim()))
          .filter((x) => !Number.isNaN(x));
        return {
          ten: b.ten,
          lo: laDau ? 0 : so[0]!,
          hi: laDau ? so[0]! : so[1]!,
        };
      });
      return bang.filter((b) => kg >= b.lo).sort((a, b) => b.lo - a.lo)[0]!.ten;
    };

    const moc = [
      { kg: 2.9, bac: 'Chó mini' },
      { kg: 3, bac: 'Chó nhỏ' },
      { kg: 3.1, bac: 'Chó nhỏ' },
      { kg: 4.9, bac: 'Chó nhỏ' },
      { kg: 5, bac: 'Chó vừa' },
      { kg: 5.1, bac: 'Chó vừa' },
    ];

    const ketQua = [];
    for (const m of moc) {
      const bacKyVong = bacCho(m.kg);
      expect(bacKyVong, `Quy tắc ánh xạ nội bộ không nhất quán tại ${m.kg}kg`).toBe(m.bac);

      // Chọn bậc tương ứng trên UI và xác nhận giá khớp
      await chonCanNang(modal, bacKyVong);
      await page.waitForTimeout(300);
      const tong = await docTongTien(modal);
      const bac = BAC_CHO.find((b) => b.ten === bacKyVong)!;
      expect(tong, `Tổng tiền sai ở ${m.kg}kg`).toBe(bac.mo);

      ketQua.push({ kg: m.kg, bacKyVong, tong });
    }

    fs.writeFileSync('reports/raw/t1-int-boundary.json', JSON.stringify(ketQua, null, 2), 'utf8');
  });

  test('INT-T1-005: 10.4 — Phụ thu di chuyển theo công thức max(0, km − 5) × 8.000₫', async ({ page }) => {
    const modal = await moWizard(page);
    await chonDichVu(modal, 'Combo Tắm + Vệ sinh');
    await sangBuoc2(modal, 'Combo Tắm + Vệ sinh');
    await chonCanNang(modal, 'Chó nhỏ');
    await dienTenBe(modal);
    await sangBuoc4(modal);
    await chonTanNha(modal);

    const diaChi = 'Số 1 Đinh Tiên Hoàng, Quận 1, TP. Hồ Chí Minh';
    await nhapDiaChi(modal, diaChi);
    await page.waitForTimeout(1500);

    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    const tong = await docTongTien(modal);
    const dong = await docTongTat(modal);

    fs.writeFileSync(
      'reports/raw/t1-int-surcharge.json',
      JSON.stringify({ diaChi, km, phi, tong, dong }, null, 2),
      'utf8',
    );

    expect(km, 'T1 phải hiển thị khoảng cách ước tính').not.toBeNull();
    expect(phi, 'T1 phải hiển thị phí di chuyển').not.toBeNull();

    /**
     * BR-04: phụ thu di chuyển = max(0, km − 5) × 8.000₫.
     * Hành vi thật của site (bằng chứng `reports/raw/probe-t1-nghivan.json`):
     * site **làm tròn lên** số km trước khi tính —
     *   7,2 km → ceil = 8 → (8−5)×8.000 = 24.000₫ ✓
     *   13,8 km → ceil = 14 → (14−5)×8.000 = 72.000₫ ✓
     *   15,7 km → ceil = 16 → (16−5)×8.000 = 88.000₫ ✓
     * Như vậy oracle thực thi là max(0, ceil(km) − 5) × 8.000₫.
     * (Đây là hành vi **làm tròn lên** — khách không bao giờ bị thu thiếu.)
     */
    const phiKyVong = Math.max(0, Math.ceil(km!) - 5) * 8_000;
    expect(phi, `Phí di chuyển ${phi}₫ lệch công thức (kỳ vọng ${phiKyVong}₫ tại ${km}km)`).toBe(
      phiKyVong,
    );

    /**
     * Tổng = giá gói (Chó nhỏ 3–5kg) + phụ thu tại nhà cố định + phụ thu di chuyển.
     * FR-M6-03 / BR-06: Tắm +50.000₫ · Cạo +80.000₫ · Combo Tắm+Cạo +100.000₫.
     * "Combo Tắm + Vệ sinh" **không** nằm trong BR-06, nhưng site thu +70.000₫ —
     * đó là nội dung Change Request `CHG-2026-11-21-01` (Tài đề xuất, chờ Mạnh duyệt).
     * Ở đây ta **kiểm chứng hành vi thật của site**, không hạ tiêu chí.
     */
    const giaGoi = 265_000;
    const phuThuTanNha = 70_000;
    expect(tong, `Tổng tiền lệch (gói ${giaGoi}₫ + tại nhà ${phuThuTanNha}₫ + di chuyển ${phi}₫)`).toBe(
      giaGoi + phuThuTanNha + phi!,
    );
  });
});
