import { test, expect, type Page } from '@playwright/test';
import { moTrangSpa, chonLoai, chonBucCanNang, sangBuocDichVu } from './helpers';

/**
 * T2 Mật Pet Family — các ca kiểm thử của Ngân (TV3) viết ở dạng Manual
 * trong `docs/testcases/t2.csv`, nay được tự động hoá.
 *
 *   TC-T2-M1-003  FR-M1-03 — trang hiển thị đủ địa chỉ, điện thoại, email, giờ mở cửa
 *   TC-T2-M2-001  FR-M2-01 — mỗi dịch vụ có đủ tên, mô tả, giá, thời lượng
 *   TC-T2-M2-002  FR-M2-02 — mỗi dịch vụ nêu rõ phạm vi bao gồm
 *   TC-T2-M2-004  FR-M2-04 — danh mục tách nhóm combo trọn gói / dịch vụ lẻ
 *   TC-T2-M3-001  FR-M3-01 — bảng giá có đủ cột cho mọi bậc cân nặng
 *   TC-T2-M3-007  FR-M3-04 — dịch vụ báo giá riêng không hiện con số đơn lẻ
 *   TC-T2-M3-008  FR-M3-04 — DT: cả 6 dịch vụ báo giá riêng đều không hiện con số đơn lẻ
 *   TC-T2-M3-009  FR-M3-05 — trang giá ghi rõ giá cuối xác nhận tại spa
 *   TC-T2-M3-010  FR-M3-06 — bảng giá nêu rõ 3 phí ngoại lệ
 *   TC-T2-M3-012  FR-M3-02 — BVA ngưỡng 3kg: 2.9kg thuộc bậc dưới
 *   TC-T2-M4-006  FR-M4-04 — ô ngày có min = hôm nay + 2 mốc cố định
 *   TC-T2-M4-007  FR-M4-05 — ngày quá 30 ngày được nhập, không có giới hạn max
 *   TC-T2-M5-001  FR-M5-01 — trang mô tả quy trình 4 bước
 *   TC-T2-M5-002  FR-M5-02 — nêu spa sẽ gọi xác nhận khung giờ
 *   TC-T2-M5-003  FR-M5-04 — nội dung hủy/đổi lịch và hoàn cọc
 *
 * Ranh giới ADR-11: chỉ đọc, không gửi form.
 */

async function moTrangVaCuonToiBangGia(page: Page): Promise<void> {
  await moTrangSpa(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1_200);
}

/** Đọc toàn bộ bảng giá tĩnh trên trang /spa. */
async function docBangGia(page: Page): Promise<{
  cols: string[];
  rows: { ten: string; gia: string[] }[];
}> {
  return page.evaluate(() => {
    const bang = [...document.querySelectorAll('table')].find((t) =>
      t.textContent?.includes('Dịch vụ (Grooming)'),
    );
    if (!bang) return { cols: [], rows: [] };
    const trs = [...bang.querySelectorAll('tr')];
    const cols = [...(trs[0]?.querySelectorAll('th, td') ?? [])].map((c) => c.textContent?.trim() ?? '');
    const rows = trs.slice(1).map((tr) => {
      const cells = [...tr.querySelectorAll('td')].map((c) => c.textContent?.trim() ?? '');
      return { ten: cells[0] ?? '', gia: cells.slice(1) };
    });
    return { cols, rows };
  });
}

/** Đọc các nút dịch vụ ở bước S3 (sau khi đã chọn loài + cân nặng). */
async function docNutDichVu(page: Page): Promise<
  { ten: string; moTa: string; gia: string; text: string; baoGiaRieng: boolean }[]
> {
  return page.evaluate(() =>
    [...document.querySelectorAll('button.svc')].map((b) => {
      const ten = b.querySelector('b')?.textContent?.trim() ?? '';
      const moTa = b.querySelector('.d')?.textContent?.trim() ?? '';
      const gia = b.querySelector('.pr')?.textContent?.trim() ?? '';
      const text = b.textContent?.trim() ?? '';
      const baoGiaRieng = !!b.querySelector('.quote');
      return { ten, moTa, gia, text, baoGiaRieng };
    }),
  );
}

/** Đi tới bước chọn dịch vụ (S3) với loài Chó và bậc cân nặng cho trước. */
async function sangBuocDichVuChon(page: Page, band: string): Promise<void> {
  await moTrangSpa(page);
  await chonLoai(page, 'Chó');
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await chonBucCanNang(page, band);
  await sangBuocDichVu(page);
}

test.describe('T2 Mật Pet — M1/M2/M3/M4/M5 (Ngân)', () => {
  test('TC-T2-M1-003: trang hiển thị đủ địa chỉ, điện thoại, email và giờ mở cửa', async ({ page }) => {
    await moTrangVaCuonToiBangGia(page);
    const body = await page.evaluate(() => document.body.innerText);

    expect(body, 'Địa chỉ').toMatch(/239 Nguyễn Hồng Đào/);
    expect(body, 'Điện thoại').toMatch(/0939\.86\.36\.96/);
    expect(body, 'Email').toMatch(/matpetfamily2011@gmail\.com/);
    expect(body, 'Giờ mở cửa').toMatch(/Mở cửa:\s*08:00\s*–\s*22:00/);
  });

  test('TC-T2-M2-001: mỗi dịch vụ trong danh mục có đủ tên, mô tả, giá và thời lượng', async ({
    page,
  }) => {
    await sangBuocDichVuChon(page, '<3kg');
    const dichVu = await docNutDichVu(page);

    expect(dichVu.length, 'Số dịch vụ trong danh mục').toBeGreaterThan(0);

    const thieuTen = dichVu.filter((d) => !d.ten).map((d) => d.ten);
    expect(thieuTen, 'Dịch vụ thiếu tên').toEqual([]);

    // Dịch vụ có giá cố định phải có giá; dịch vụ "báo giá riêng" thì không.
    const sai = dichVu
      .filter((d) => (d.baoGiaRieng ? d.gia !== '' : d.gia === ''))
      .map((d) => `${d.ten} (gia="${d.gia}", baoGiaRieng=${d.baoGiaRieng})`);
    expect(sai, 'Dịch vụ thiếu giá hoặc có giá sai').toEqual([]);

    // FR-M2-01: mỗi dịch vụ phải có thời lượng (tìm trong toàn bộ text của nút).
    const thieuThoiLuong = dichVu
      .filter((d) => !/\d+\s*('|′|\s)?\s*(phút|min\b|giờ|hours?\b)/i.test(d.text))
      .map((d) => d.ten);
    expect(thieuThoiLuong, 'Dịch vụ thiếu thời lượng').toEqual([]);
  });

  test('TC-T2-M2-002: mỗi dịch vụ nêu rõ phạm vi bao gồm', async ({ page }) => {
    await sangBuocDichVuChon(page, '<3kg');
    const dichVu = await docNutDichVu(page);

    const thieuMoTa = dichVu.filter((d) => !d.moTa).map((d) => d.ten);
    expect(thieuMoTa, 'Dịch vụ thiếu mô tả thành phần bao gồm').toEqual([]);
  });

  test('TC-T2-M2-004: danh mục tách nhóm Combo trọn gói và Dịch vụ lẻ', async ({ page }) => {
    await sangBuocDichVuChon(page, '<3kg');

    const tabs = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .map((b) => b.textContent?.trim())
        .filter((t) => t === 'Combo trọn gói' || t === 'Dịch vụ lẻ'),
    );
    expect(tabs, 'Hai nhóm dịch vụ').toEqual(['Combo trọn gói', 'Dịch vụ lẻ']);

    // Nhóm "Dịch vụ lẻ" hiện đúng các dịch vụ lẻ khai ở BR-11.
    await page.getByRole('button', { name: 'Dịch vụ lẻ', exact: true }).click();
    await page.waitForTimeout(600);
    const le = await docNutDichVu(page);
    const tenLe = le.map((d) => d.ten);

    for (const dichVu of [
      'Cắt dũa + Móng',
      'Vệ sinh tai',
      'Cạo bụng + Bàn + Hậu môn',
      'Tắm sấy',
      'Cạo lông',
      'Cắt lông',
    ]) {
      expect(tenLe, `Nhóm "Dịch vụ lẻ" có "${dichVu}"`).toContain(dichVu);
    }
  });

  test('TC-T2-M3-001: bảng giá có đủ cột cho mọi bậc cân nặng và mọi dịch vụ', async ({
    page,
  }) => {
    await moTrangVaCuonToiBangGia(page);
    const { cols, rows } = await docBangGia(page);

    // BR-02: 7 bậc cân nặng.
    expect(cols, 'Cột bảng giá').toEqual([
      'Dịch vụ (Grooming)',
      '<3kg',
      '>3–6kg',
      '>6–10kg',
      '>10–20kg',
      '>20–30kg',
      '>30–40kg',
      '>40kg',
    ]);

    // Mỗi dòng dịch vụ có đủ 7 ô giá, mọi ô là số xác định.
    const thieu = rows
      .filter((r) => r.ten && !/^Combo trọn gói$|^Dịch vụ lẻ$/i.test(r.ten))
      .filter((r) => r.gia.length !== 7 || r.gia.some((g) => !/^[\d.,ktr]+$/i.test(g)))
      .map((r) => `${r.ten}: ${JSON.stringify(r.gia)}`);
    expect(thieu, 'Dòng giá thiếu ô hoặc có ô không xác định').toEqual([]);
  });

  test('TC-T2-M3-007: dịch vụ báo giá riêng hiển thị khoảng hoặc tuỳ thiết kế, không phải con số đơn lẻ', async ({
    page,
  }) => {
    await sangBuocDichVuChon(page, '<3kg');
    const dichVu = await docNutDichVu(page);

    const rieng = dichVu.filter((d) => d.baoGiaRieng);
    expect(rieng.length, 'Số dịch vụ báo giá riêng').toBe(6);

    for (const d of rieng) {
      const coKhoang = /50\.000\s*–\s*500\.000/.test(d.moTa);
      const coThietKe = /tuỳ|thiết kế|kích thước/i.test(d.moTa);
      expect(coKhoang || coThietKe, `Mô tả của "${d.ten}" không nêu khoảng giá`).toBe(true);
    }
  });

  test('TC-T2-M3-008: DT — cả 6 dịch vụ báo giá riêng đều không hiện một con số đơn lẻ', async ({
    page,
  }) => {
    await sangBuocDichVuChon(page, '<3kg');
    const dichVu = await docNutDichVu(page);

    const rieng = dichVu.filter((d) => d.baoGiaRieng);
    expect(rieng.length, 'Số dịch vụ báo giá riêng').toBe(6);

    // Không được hiện đúng 1 con số trần duy nhất (kiểu "500.000đ").
    const conSoDuyNhat = rieng
      .filter((d) => {
        const so = d.moTa.match(/\d[\d.]*/g) ?? [];
        return so.length === 1;
      })
      .map((d) => `${d.ten}: ${d.moTa}`);
    expect(conSoDuyNhat, 'Dịch vụ báo giá riêng hiện một con số đơn lẻ').toEqual([]);
  });

  test('TC-T2-M3-009: trang giá ghi rõ giá cuối xác nhận tại spa, giá hiển thị chỉ là dự kiến', async ({
    page,
  }) => {
    await moTrangVaCuonToiBangGia(page);
    const body = await page.evaluate(() => document.body.innerText);

    expect(body).toMatch(/GIÁ DỰ KIẾN/i);
    expect(body).toMatch(/Giá cuối được xác nhận tại spa/);
  });

  test('TC-T2-M3-010: bảng giá nêu rõ ngoại lệ phát sinh phí gỡ rối, tẩy ố, tắm trắng', async ({
    page,
  }) => {
    await moTrangVaCuonToiBangGia(page);
    const body = await page.evaluate(() => document.body.innerText);

    expect(body).toMatch(/phí gỡ rối/i);
    expect(body).toMatch(/tẩy ố/i);
    expect(body).toMatch(/tắm trắng/i);
  });

  test('TC-T2-M3-012: BVA ngưỡng 3kg — cân 2.9kg thuộc bậc dưới (<3kg)', async ({ page }) => {
    await sangBuocDichVuChon(page, '<3kg');

    // Bậc dưới biên (<3kg) là bậc đầu tiên; giá của nó thấp hơn bậc kế tiếp.
    await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
    const gia = await page.locator('.rail-price').innerText();
    expect(gia).toContain('120.000');
  });

  test('TC-T2-M4-006: ô ngày của T2 có min = hôm nay, kèm 2 mốc cố định "Hôm nay" và "Ngày mai"', async ({
    page,
  }) => {
    await moTrangSpa(page);

    const min = await page.evaluate(() => {
      const i = document.querySelector('input[type="date"]');
      return i?.getAttribute('min') ?? null;
    });
    expect(min, 'min của ô ngày').toBeTruthy();

    const homNay = new Date();
    const dinhDang = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(min).toBe(dinhDang(homNay));

    // 2 mốc cố định + 3 ngày trong tuần.
    const moc = await page.evaluate(() =>
      [...document.querySelectorAll('.date-pill .dp-top')]
        .map((s) => s.textContent?.trim() ?? '')
        .filter((t) => /^(Hôm nay|Ngày mai|T\d)$/.test(t)),
    );
    expect(moc, 'Các mốc ngày cố định').toEqual([
      'Hôm nay',
      'Ngày mai',
      'T2',
      'T3',
      'T4',
    ]);
  });

  test('TC-T2-M4-007: ngày quá 30 ngày được nhập vào ô ngày nhưng không có giới hạn max', async ({
    page,
  }) => {
    await moTrangSpa(page);

    const oNgay = page.locator('input[type="date"]');
    const namSau = new Date();
    namSau.setDate(namSau.getDate() + 60);
    const giaTri = `${namSau.getFullYear()}-${String(namSau.getMonth() + 1).padStart(2, '0')}-${String(namSau.getDate()).padStart(2, '0')}`;

    await oNgay.fill(giaTri);
    await page.waitForTimeout(500);

    const trangThai = await page.evaluate(() => {
      const i = document.querySelector<HTMLInputElement>('input[type="date"]');
      return {
        value: i?.value ?? '',
        max: i?.getAttribute('max') ?? '',
        hopLe: i?.checkValidity() ?? false,
      };
    });

    expect(trangThai.value, 'Giá trị ngày đã nhập').toBe(giaTri);
    expect(trangThai.max, 'Ô ngày không đặt giới hạn max').toBe('');
    expect(trangThai.hopLe, 'Ô ngày vẫn hợp lệ').toBe(true);
  });

  test('TC-T2-M5-001: trang mô tả quy trình 4 bước khớp thực tế', async ({ page }) => {
    await moTrangVaCuonToiBangGia(page);
    const body = await page.evaluate(() => document.body.innerText);

    // BR-10: tiếp nhận → kiểm tra → grooming → bàn giao.
    expect(body).toMatch(/01\s*Tiếp nhận/);
    expect(body).toMatch(/02\s*Kiểm tra/);
    expect(body).toMatch(/03\s*Grooming/);
    expect(body).toMatch(/04\s*Bàn giao/);
  });

  test('TC-T2-M5-002: có nêu spa sẽ gọi xác nhận khung giờ với thời gian cụ thể', async ({
    page,
  }) => {
    await moTrangVaCuonToiBangGia(page);
    const body = await page.evaluate(() => document.body.innerText);

    expect(body, 'Có nói spa sẽ gọi xác nhận khung giờ').toMatch(
      /spa sẽ gọi (lại )?xác nhận khung giờ/i,
    );
    // Tiêu chí chấp nhận yêu cầu nêu rõ thời gian xác nhận.
    expect(body, 'Có nêu thời gian xác nhận').toMatch(
      /xác nhận (lịch|khung giờ)[^\n]*\d+\s*(giây|phút|giờ|tiếng)|trong vòng \d+\s*(giây|phút|giờ)/i,
    );
  });

  test('TC-T2-M5-003: nội dung hủy/đổi lịch và hoàn cọc tồn tại, không chỉ nói liên hệ tiệm', async ({
    page,
  }) => {
    const trang = ['/spa', '/cau-hoi-thuong-gap', '/bao-hanh', '/cham-soc'];

    let noiDung = '';
    for (const duongDan of trang) {
      await page.goto(`https://matpet.vn${duongDan}`, { waitUntil: 'load' });
      await page.waitForTimeout(2_000);
      await page.evaluate(() => {
        document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''));
      });
      await page.waitForTimeout(500);
      noiDung += `\n${duongDan}\n` + (await page.evaluate(() => document.body.innerText));
    }

    // FR-M5-04: cần nội dung cho cả 3 mục — hủy, đổi, hoàn cọc.
    const coHuy = /hủy|huỷ|chấp nhận hủy/i.test(noiDung);
    const coDoi = /đổi lịch|đổi khung giờ|reschedul/i.test(noiDung);
    const coHoanCoc = /hoàn (cọc|tiền)|hoàn lại tiền|đặt cọc/i.test(noiDung);

    expect(coHuy, 'Có nội dung về hủy lịch').toBe(true);
    expect(coDoi, 'Có nội dung về đổi lịch').toBe(true);
    expect(coHoanCoc, 'Có nội dung về hoàn cọc').toBe(true);
  });
});
