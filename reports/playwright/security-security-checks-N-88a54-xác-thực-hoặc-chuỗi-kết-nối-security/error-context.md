# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\security-checks.spec.ts >> NFR-02 — Kiểm tra bảo mật bổ sung (tự động hoá ca thủ công) >> TC-NFR-02-010: không rò rỉ khoá API, kho xác thực hoặc chuỗi kết nối
- Location: tests\security\security-checks.spec.ts:110:3

# Error details

```
Error: T3 lộ Google API key trong HTML nguồn

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "T3 lộ Google API key trong HTML nguồn",
+ ]
```

# Page snapshot

```yaml
- dialog [active] [ref=f2e2]:
  - generic [ref=f2e3]:
    - generic [ref=f2e5]:
      - img "business logo" [ref=f2e6]
      - generic [ref=f2e7]: Pretty Paws Cat and Dog Grooming
    - generic [ref=f2e20]:
      - generic [ref=f2e21]:
        - generic [ref=f2e23]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=f2e24]
          - generic [ref=f2e25]:
            - link "(609) 816-7755" [ref=f2e29] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=f2e33] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=f2e37] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=f2e41] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=f2e42]:
              - generic [ref=f2e46]: Closed
              - generic [ref=f2e47]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=f2e49] [cursor=pointer]
        - generic [ref=f2e52]:
          - heading "Business Hours" [level=5] [ref=f2e53]
          - list [ref=f2e54]:
            - generic [ref=f2e55]:
              - generic [ref=f2e56]: SUN
              - generic [ref=f2e57]: 8:00 AM
              - generic [ref=f2e58]: "-"
              - generic [ref=f2e59]: 8:00 PM
            - generic [ref=f2e60]:
              - generic [ref=f2e61]: MON
              - generic [ref=f2e62]: 8:00 AM
              - generic [ref=f2e63]: "-"
              - generic [ref=f2e64]: 8:00 PM
            - generic [ref=f2e65]:
              - generic [ref=f2e66]: TUE
              - generic [ref=f2e67]: 8:00 AM
              - generic [ref=f2e68]: "-"
              - generic [ref=f2e69]: 8:00 PM
            - generic [ref=f2e70]:
              - generic [ref=f2e71]: WED
              - generic [ref=f2e72]: 8:00 AM
              - generic [ref=f2e73]: "-"
              - generic [ref=f2e74]: 8:00 PM
            - generic [ref=f2e75]:
              - generic [ref=f2e76]: THU
              - generic [ref=f2e77]: 8:00 AM
              - generic [ref=f2e78]: "-"
              - generic [ref=f2e79]: 8:00 PM
            - generic [ref=f2e80]:
              - generic [ref=f2e81]: FRI
              - generic [ref=f2e82]: 8:00 AM
              - generic [ref=f2e83]: "-"
              - generic [ref=f2e84]: 8:00 PM
            - generic [ref=f2e85]:
              - generic [ref=f2e86]: SAT
              - generic [ref=f2e87]: 8:00 AM
              - generic [ref=f2e88]: "-"
              - generic [ref=f2e89]: 8:00 PM
      - generic [ref=f2e90]:
        - heading "About us" [level=5] [ref=f2e91]
        - generic [ref=f2e93]:
          - generic [ref=f2e94]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=f2e95]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=f2e96]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=f2e97]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=f2e99]:
        - heading "Services" [level=5] [ref=f2e100]
        - list [ref=f2e101]:
          - listitem [ref=f2e102]:
            - generic [ref=f2e103]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=f2e107]:
            - generic [ref=f2e108]: Dog (bath included) (16)
          - listitem [ref=f2e112]:
            - generic [ref=f2e113]: Cat (bath included) (4)
          - listitem [ref=f2e117]:
            - generic [ref=f2e118]: QUICK SERVICE (no bath) (12)
          - listitem [ref=f2e122]:
            - generic [ref=f2e123]: ADD ON TO GROOM (7)
    - generic [ref=f2e138]:
      - heading [level=6] [ref=f2e139]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=f2e140] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=f2e141] [cursor=pointer]
```

# Test source

```ts
  35  |         if (pattern.test(html)) leaks.push(`${target.id} lộ sessionid trong HTML nguồn`);
  36  |       }
  37  |     }
  38  |     expect(leaks, leaks.join('; ')).toEqual([]);
  39  |   });
  40  | 
  41  |   test('TC-NFR-02-007: payload script trong tên hiển thị đúng văn bản, không kích hoạt alert', async ({
  42  |     page,
  43  |   }) => {
  44  |     const problems: string[] = [];
  45  | 
  46  |     for (const target of TARGETS) {
  47  |       let alertFired = false;
  48  |       const onDialog = async (dialog: { dismiss: () => Promise<void> }) => {
  49  |         alertFired = true;
  50  |         await dialog.dismiss();
  51  |       };
  52  |       page.on('dialog', onDialog);
  53  | 
  54  |       await page.goto(target.url, { waitUntil: 'load' });
  55  |       await page.waitForTimeout(1500);
  56  | 
  57  |       // Tìm ô nhập đơn giản nhất trên trang để nhập payload.
  58  |       const input = page.locator('input[type="text"], input:not([type]), textarea').first();
  59  |       if ((await input.count()) === 0) {
  60  |         page.off('dialog', onDialog);
  61  |         continue;
  62  |       }
  63  | 
  64  |       await input.fill(XSS_PAYLOAD);
  65  |       await page.waitForTimeout(1200);
  66  | 
  67  |       // Payload phải được hiển thị nguyên văn hoặc đã mã hoá entity, không phải thẻ script.
  68  |       const rendered = await input.evaluate((el) => (el as HTMLInputElement).value);
  69  |       if (rendered.includes('<script>')) {
  70  |         // Giá trị ô nhập giữ nguyên là bình thường — vấn đề là khi nó bị chèn vào DOM
  71  |         // dưới dạng HTML. Kiểm tra DOM có thẻ script sinh ra từ payload không.
  72  |         const injected = await page.evaluate((payload) => {
  73  |           return document.body.innerHTML.includes(`<script>${payload}</script>`);
  74  |         }, XSS_PAYLOAD);
  75  |         if (injected) problems.push(`${target.id} chèn payload script thành công vào DOM`);
  76  |       }
  77  | 
  78  |       if (alertFired) problems.push(`${target.id} kích hoạt alert từ payload nhập vào form`);
  79  |       page.off('dialog', onDialog);
  80  |     }
  81  |     expect(problems, problems.join('; ')).toEqual([]);
  82  |   });
  83  | 
  84  |   test('TC-NFR-02-009: TLS bật và không nhận chứng thương mại hợp lệ bị từ chối', async ({
  85  |     request,
  86  |   }) => {
  87  |     const problems: string[] = [];
  88  | 
  89  |     for (const target of TARGETS) {
  90  |       const url = new URL(target.url);
  91  | 
  92  |       // Kết nối TLS phải thành công với chứng thương mại do CA tin cậy cấp.
  93  |       const response = await getWithRetry(request, target.url);
  94  |       if (!response.url().startsWith('https://')) problems.push(`${target.id} không dùng HTTPS`);
  95  | 
  96  |       // Chứng thương mại hợp lệ phải được chấp nhận (không bị từ chối).
  97  |       if (response.status() >= 500) problems.push(`${target.id} trả lỗi server khi TLS hợp lệ`);
  98  | 
  99  |       // Phiên bản TLS lỗi thời phải bị từ chối ở tầng server.
  100 |       if (url.protocol === 'https:') {
  101 |         const hsts = response.headers()['strict-transport-security'];
  102 |         if (hsts && !/max-age\s*=\s*\d{6,}/i.test(hsts)) {
  103 |           problems.push(`${target.id} HSTS thiếu max-age đủ lớn: ${hsts}`);
  104 |         }
  105 |       }
  106 |     }
  107 |     expect(problems, problems.join('; ')).toEqual([]);
  108 |   });
  109 | 
  110 |   test('TC-NFR-02-010: không rò rỉ khoá API, kho xác thực hoặc chuỗi kết nối', async ({ page }) => {
  111 |     const leaks: string[] = [];
  112 | 
  113 |     for (const target of TARGETS) {
  114 |       await page.goto(target.url, { waitUntil: 'load' });
  115 |       await page.waitForTimeout(1500);
  116 | 
  117 |       const html = await page.content();
  118 |       const patterns = [
  119 |         // Chuỗi kết nối cơ sở dữ liệu.
  120 |         { re: /(mongodb(\+srv)?:\/\/[^\s"']+|postgres(?:ql)?:\/\/[^\s"']+|mysql:\/\/[^\s"']+)/i, moTa: 'chuỗi kết nối CSDL' },
  121 |         // Khoá dạng AWS.
  122 |         { re: /AKIA[0-9A-Z]{16}/, moTa: 'AWS access key id' },
  123 |         // Khoá dạng Google API.
  124 |         { re: /AIza[0-9A-Za-z_-]{35}/, moTa: 'Google API key' },
  125 |         // Khoá dạng Stripe.
  126 |         { re: /\bsk_(live|test)_[0-9a-zA-Z]{10,}/, moTa: 'Stripe secret key' },
  127 |         // Bearer token dạng JWT hard-code.
  128 |         { re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, moTa: 'JWT hard-code' },
  129 |       ];
  130 | 
  131 |       for (const { re, moTa } of patterns) {
  132 |         if (re.test(html)) leaks.push(`${target.id} lộ ${moTa} trong HTML nguồn`);
  133 |       }
  134 |     }
> 135 |     expect(leaks, leaks.join('; ')).toEqual([]);
      |                                     ^ Error: T3 lộ Google API key trong HTML nguồn
  136 |   });
  137 | 
  138 |   test('TC-NFR-02-011: không rò rỉ email hay số điện thoại thực của khách hàng trong HTML nguồn', async ({
  139 |     page,
  140 |   }) => {
  141 |     const leaks: string[] = [];
  142 | 
  143 |     for (const target of TARGETS) {
  144 |       await page.goto(target.url, { waitUntil: 'load' });
  145 |       await page.waitForTimeout(1500);
  146 | 
  147 |       const html = await page.content();
  148 | 
  149 |       // Kênh liên hệ chính thức của tiệm được công bố — không phải dữ liệu rò rỉ.
  150 |       const hotlineChinh = await page
  151 |         .locator('a[href^="tel:"]')
  152 |         .evaluateAll((els) => els.map((e) => (e.getAttribute('href') || '').replace('tel:', '')));
  153 |       const emailChinh = await page
  154 |         .locator('a[href^="mailto:"]')
  155 |         .evaluateAll((els) => els.map((e) => (e.getAttribute('href') || '').replace('mailto:', '')));
  156 | 
  157 |       // Email cá nhân của khách (loại trừ email thuộc kênh chính thức).
  158 |       const emailMatches = html.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? [];
  159 |       for (const email of new Set(emailMatches)) {
  160 |         if (emailChinh.includes(email)) continue;
  161 |         const domain = email.split('@')[1]?.toLowerCase() ?? '';
  162 |         const laEmailChinh = /^(gmail|yahoo|hotmail|outlook|icloud|aol)\./.test(domain);
  163 |         if (laEmailChinh) leaks.push(`${target.id} lộ email khách hàng: ${email}`);
  164 |       }
  165 | 
  166 |       // Số điện thoại: chỉ tính những chuỗi nằm trong thẻ liên hết, không phải
  167 |       // số nằm rải rác trong nội dung (timestamp tên ảnh, đường dẫn SVG, UUID).
  168 |       const sdtTrongThe = html.match(
  169 |         /(?:href|tel:)["'\s:=]*\+?\d[\d\s().-]{8,16}\d/gi,
  170 |       ) ?? [];
  171 |       for (const sdt of new Set(sdtTrongThe)) {
  172 |         const digits = sdt.replace(/\D/g, '');
  173 |         if (digits.length < 9) continue;
  174 |         const laHotlineChinh = hotlineChinh.some((h) => digits.endsWith(h.replace(/\D/g, '')));
  175 |         if (!laHotlineChinh) leaks.push(`${target.id} lộ số điện thoại khách hàng: ${sdt}`);
  176 |       }
  177 |     }
  178 |     expect(leaks, leaks.join('; ')).toEqual([]);
  179 |   });
  180 | 
  181 |   test('TC-NFR-02-012: form gửi chỉ không gửi tới URL bên thứ ba', async ({ page }) => {
  182 |     const problems: string[] = [];
  183 | 
  184 |     for (const target of TARGETS) {
  185 |       await page.goto(target.url, { waitUntil: 'load' });
  186 |       await page.waitForTimeout(1500);
  187 | 
  188 |       const origin = new URL(target.url).origin;
  189 | 
  190 |       // action của form không được trỏ sang domain khác.
  191 |       const actions = await page.locator('form[action]').evaluateAll((els) =>
  192 |         els.map((e) => (e.getAttribute('action') || '').trim()),
  193 |       );
  194 |       for (const action of actions) {
  195 |         if (!action || action.startsWith('#') || action.startsWith('javascript:')) continue;
  196 |         try {
  197 |           const abs = new URL(action, target.url);
  198 |           if (abs.origin !== origin) problems.push(`${target.id} form action trỏ tới domain khác: ${action}`);
  199 |         } catch {
  200 |           problems.push(`${target.id} form action không phải URL hợp lệ: ${action}`);
  201 |         }
  202 |       }
  203 | 
  204 |       // input kiểu hidden không mang action tới bên thứ ba.
  205 |       const hiddenActions = await page
  206 |         .locator('input[type="hidden"][formaction]')
  207 |         .evaluateAll((els) => els.map((e) => e.getAttribute('formaction') || ''));
  208 |       for (const action of hiddenActions) {
  209 |         if (!action) continue;
  210 |         try {
  211 |           const abs = new URL(action, target.url);
  212 |           if (abs.origin !== origin) problems.push(`${target.id} formaction trỏ tới domain khác: ${action}`);
  213 |         } catch {
  214 |           problems.push(`${target.id} formaction không phải URL hợp lệ: ${action}`);
  215 |         }
  216 |       }
  217 |     }
  218 |     expect(problems, problems.join('; ')).toEqual([]);
  219 |   });
  220 | });
  221 | 
```