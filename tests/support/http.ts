import type { APIRequestContext } from '@playwright/test';

/**
 * Gọi GET tới site đích với số lần thử lại và timeout dài hơn mặc định.
 *
 * Site đích là hệ thống của bên thứ ba nên đôi lúc phản hồi chậm hoặc rớt DNS.
 * Lỗi mạng như vậy là sự cố hạ tầng, không phải lỗi sản phẩm — nếu để lỗi
 * mạng làm test Fail thì sẽ ghi nhầm defect cho site đích (vi phạm nguyên tắc
 * "bằng chứng phải phản ánh đúng nguyên nhân"). Vì vậy chỉ retry lỗi mạng,
 * còn lỗi assertion về header vẫn được báo cáo trung thực.
 */
export async function getWithRetry(
  request: APIRequestContext,
  url: string,
  options: { attempts?: number; timeout?: number } = {},
): Promise<Awaited<ReturnType<APIRequestContext['get']>>> {
  const attempts = options.attempts ?? 3;
  const timeout = options.timeout ?? 45_000;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request.get(url, { maxRedirects: 5, timeout });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw lastError;
}
