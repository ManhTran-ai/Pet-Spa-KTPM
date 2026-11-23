# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t3\m2-m3-m4-m7.spec.ts >> T3 Pretty Paws — M2/M3 Danh mục dịch vụ và bảng giá >> TC-T3-M4-006: đặt lịch T3 bằng SĐT chưa có hồ sơ bị từ chối kèm thông báo rõ ràng
- Location: tests\e2e\t3\m2-m3-m4-m7.spec.ts:203:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /only available for existing client|phone number invalid|not available/i
Received string:  "Pretty Paws Cat and Dog Grooming·
NEW CLIENTS please fill out our intake form on our Facebook page or text 609-816-7755 for the form before booking an appointment. Thank you!·
more ˅
International
Afghanistan
Åland Islands
Albania
Algeria
American Samoa
Andorra
Angola
Anguilla
Antigua and Barbuda
Argentina
Armenia
Aruba
Ascension Island
Australia
Austria
Azerbaijan
Bahamas
Bahrain
Bangladesh
Barbados
Belarus
Belgium
Belize
Benin
Bermuda
Bhutan
Bolivia
Bonaire, Sint Eustatius and Saba
Bosnia and Herzegovina
Botswana
Brazil
British Indian Ocean Territory
Brunei Darussalam
Bulgaria
Burkina Faso
Burundi
Cambodia
Cameroon
Canada
Cape Verde
Cayman Islands
Central African Republic
Chad
Chile
China
Christmas Island
Cocos (Keeling) Islands
Colombia
Comoros
Congo
Congo, Democratic Republic of the
Cook Islands
Costa Rica
Cote d'Ivoire
Croatia
Cuba
Curaçao
Cyprus
Czech Republic
Denmark
Djibouti
Dominica
Dominican Republic
Ecuador
Egypt
El Salvador
Equatorial Guinea
Eritrea
Estonia
Ethiopia
Falkland Islands
Faroe Islands
Federated States of Micronesia
Fiji
Finland
France
French Guiana
French Polynesia
Gabon
Gambia
Georgia
Germany
Ghana
Gibraltar
Greece
Greenland
Grenada
Guadeloupe
Guam
Guatemala
Guernsey
Guinea
Guinea-Bissau
Guyana
Haiti
Holy See (Vatican City State)
Honduras
Hong Kong
Hungary
Iceland
India
Indonesia
Iran
Iraq
Ireland
Isle of Man
Israel
Italy
Jamaica
Japan
Jersey
Jordan
Kazakhstan
Kenya
Kiribati
Kosovo
Kuwait
Kyrgyzstan
Laos
Latvia
Lebanon
Lesotho
Liberia
Libya
Liechtenstein
Lithuania
Luxembourg
Macao
Madagascar
Malawi
Malaysia
Maldives
Mali
Malta
Marshall Islands
Martinique
Mauritania
Mauritius
Mayotte
Mexico
Moldova
Monaco
Mongolia
Montenegro
Montserrat
Morocco
Mozambique
Myanmar
Namibia
Nauru
Nepal
Netherlands
New Caledonia
New Zealand
Nicaragua
Niger
Nigeria
Niue
Norfolk Island
North Korea
North Macedonia
Northern Mariana Islands
Norway
Oman
Pakistan
Palau
Palestine
Panama
Papua New Guinea
Paraguay
Peru
Philippines
Poland
Portugal
Puerto Rico
Qatar
Reunion
Romania
Russia
Rwanda
Saint Barthélemy
Saint Helena
Saint Kitts and Nevis
Saint Lucia
Saint Martin (French Part)
Saint Pierre and Miquelon
Saint Vincent and the Grenadines
Samoa
San Marino
Sao Tome and Principe
Saudi Arabia
Senegal
Serbia
Seychelles
Sierra Leone
Singapore
Sint Maarten
Slovakia
Slovenia
Solomon Islands
Somalia
South Africa
South Korea
South Sudan
Spain
Sri Lanka
Sudan
Suriname
Svalbard and Jan Mayen
Swaziland
Sweden
Switzerland
Syria
Taiwan
Tajikistan
Tanzania
Thailand
Timor-Leste
Togo
Tokelau
Tonga
Trinidad and Tobago
Tristan da Cunha
Tunisia
Turkey
Turkmenistan
Turks and Caicos Islands
Tuvalu
Uganda
Ukraine
United Arab Emirates
United Kingdom
United States
Uruguay
Uzbekistan
Vanuatu
Venezuela
Vietnam
Virgin Islands, British
Virgin Islands, U.S.
Wallis and Futuna
Western Sahara
Yemen
Zambia
Zimbabwe·
This link is for existing clients only.·
Login"
```

# Page snapshot

```yaml
- generic:
  - dialog [ref=e3]:
    - generic [ref=e5]:
      - progressbar [ref=e8]
      - generic [ref=e12]:
        - generic [ref=e15]: Pretty Paws Cat and Dog Grooming
        - generic [ref=e16]:
          - paragraph [ref=e17]: NEW CLIENTS please fill out our intake form on our Facebook page or text 609-816-7755 for the form before booking an appointment. Thank you!
          - button [ref=e19] [cursor=pointer]: more ˅
        - generic [ref=e20]:
          - generic [ref=e23]:
            - combobox [ref=e25] [cursor=pointer]
            - textbox [ref=e29]:
              - /placeholder: Mobile number
              - text: (555) 123-4567
          - paragraph [ref=e30]: This link is for existing clients only.
          - button [ref=e31] [cursor=pointer]: Login
  - dialog [ref=e34]:
    - paragraph [ref=e37]: phone number invalid
    - button "OK" [ref=e39] [cursor=pointer]
```

# Test source

```ts
  128 |   test('TC-T3-M4-001: drawer Book Now có trường SĐT bắt buộc và chọn quốc gia', async ({ page }) => {
  129 |     await page.goto('/', { waitUntil: 'load' });
  130 |     await page.waitForTimeout(2500);
  131 | 
  132 |     const drawer = await moDrawer(page);
  133 |     const phone = drawer.locator('input.PhoneInputInput');
  134 |     const country = drawer.locator('select.PhoneInputCountrySelect');
  135 | 
  136 |     await expect(phone).toBeVisible();
  137 |     await expect(phone).toHaveAttribute('type', 'tel');
  138 |     await expect(country).toBeVisible();
  139 | 
  140 |     // Danh sách quốc gia là đầy đủ, không phải vài lựa chọn rút gọn.
  141 |     const soQuocGia = await country.locator('option').count();
  142 |     expect(soQuocGia).toBeGreaterThan(200);
  143 |   });
  144 | 
  145 |   test('TC-T3-M4-002: bỏ trống SĐT thì nút Login bị khoá và form không gửi được', async ({ page }) => {
  146 |     await page.goto('/', { waitUntil: 'load' });
  147 |     await page.waitForTimeout(2500);
  148 | 
  149 |     const drawer = await moDrawer(page);
  150 |     const login = drawer.getByRole('button', { name: 'Login' });
  151 | 
  152 |     await expect(login).toBeDisabled();
  153 |     // Không có request nào được gửi khi nút bị khoá.
  154 |     let calls = 0;
  155 |     page.on('request', (r) => {
  156 |       if (r.url().includes('/booking-api/v1/login')) calls += 1;
  157 |     });
  158 |     await page.waitForTimeout(1000);
  159 |     expect(calls).toBe(0);
  160 |   });
  161 | 
  162 |   test('TC-T3-M4-003: nhập SĐT chứa chữ cái vào drawer T3 thì nút Login bị khoá', async ({ page }) => {
  163 |     await page.goto('/', { waitUntil: 'load' });
  164 |     await page.waitForTimeout(2500);
  165 | 
  166 |     const drawer = await moDrawer(page);
  167 |     const phone = drawer.locator('input.PhoneInputInput');
  168 |     const login = drawer.getByRole('button', { name: 'Login' });
  169 | 
  170 |     await phone.fill('abc');
  171 |     await page.waitForTimeout(800);
  172 | 
  173 |     // Ô nhập chỉ nhận ký tự số → giá trị vẫn rỗng.
  174 |     await expect(phone).toHaveValue('');
  175 |     await expect(login).toBeDisabled();
  176 |   });
  177 | 
  178 |   test('TC-T3-M4-004: nhập SĐT 10 chữ số hợp lệ vào drawer T3 thì nút Login được kích hoạt', async ({
  179 |     page,
  180 |   }) => {
  181 |     await page.goto('/', { waitUntil: 'load' });
  182 |     await page.waitForTimeout(2500);
  183 | 
  184 |     const drawer = await moDrawer(page);
  185 |     const phone = drawer.locator('input.PhoneInputInput');
  186 |     const login = drawer.getByRole('button', { name: 'Login' });
  187 | 
  188 |     await phone.fill('6098167755');
  189 |     await page.waitForTimeout(800);
  190 | 
  191 |     await expect(login).toBeEnabled();
  192 |   });
  193 | 
  194 |   test('TC-T3-M4-005: nút Book Now hoạt động 24/7 và mở được drawer ngoài giờ mở cửa', async ({ page }) => {
  195 |     await page.goto('/', { waitUntil: 'load' });
  196 |     await page.waitForTimeout(2500);
  197 | 
  198 |     // Trạng thái hiện tại của tiệm không ảnh hưởng tới việc mở drawer.
  199 |     const drawer = await moDrawer(page);
  200 |     await expect(drawer.locator('input.PhoneInputInput')).toBeVisible();
  201 |   });
  202 | 
  203 |   test('TC-T3-M4-006: đặt lịch T3 bằng SĐT chưa có hồ sơ bị từ chối kèm thông báo rõ ràng', async ({ page }) => {
  204 |     await page.goto('/', { waitUntil: 'load' });
  205 |     await page.waitForTimeout(2500);
  206 | 
  207 |     const drawer = await moDrawer(page);
  208 |     const phone = drawer.locator('input.PhoneInputInput');
  209 |     const login = drawer.getByRole('button', { name: 'Login' });
  210 | 
  211 |     // Số dùng để kiểm thử không thuộc hồ sơ khách hàng nào của T3.
  212 |     await phone.fill('5551234567');
  213 |     await page.waitForTimeout(800);
  214 |     await expect(login).toBeEnabled();
  215 | 
  216 |     const [response] = await Promise.all([
  217 |       page.waitForResponse((r) => r.url().includes('/booking-api/v1/login'), { timeout: 30_000 }),
  218 |       login.click(),
  219 |     ]);
  220 |     expect(response.status()).toBe(200);
  221 |     const payload = JSON.parse(await response.text());
  222 |     // API từ chối SĐT không có hồ sơ.
  223 |     expect(payload.code).toBe(1023);
  224 |     expect(payload.message).toMatch(/phone number invalid/i);
  225 | 
  226 |     // FR-M4-13: người dùng phải đọc được thông báo từ chối.
  227 |     const drawerText = await drawer.innerText();
> 228 |     expect(drawerText).toMatch(/only available for existing client|phone number invalid|not available/i);
      |                        ^ Error: expect(received).toMatch(expected)
  229 |   });
  230 | 
  231 |   test('TC-T3-M4-007: trang chủ T3 hướng khách mới tới form tiếp nhận thay vì đặt lịch trực tiếp', async ({
  232 |     page,
  233 |   }) => {
  234 |     await page.goto('/', { waitUntil: 'load' });
  235 |     await page.waitForTimeout(2500);
  236 | 
  237 |     // Hướng dẫn khách mới nằm trong drawer "Book Now", không ở trang chủ.
  238 |     const drawer = await moDrawer(page);
  239 |     const drawerText = await drawer.innerText();
  240 | 
  241 |     expect(drawerText).toMatch(/NEW CLIENTS/i);
  242 |     expect(drawerText).toMatch(/intake form/i);
  243 |     // Hướng dẫn nêu rõ kênh tiếp nhận: form Facebook hoặc nhắn tin.
  244 |     expect(drawerText).toMatch(/Facebook page/i);
  245 |     expect(drawerText).toMatch(/text\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/i);
  246 |   });
  247 | 
  248 |   test('TC-T3-M4-008: nút Book Now không bị khoá ngoài khung giờ mở cửa 08:00-20:00', async ({ page }) => {
  249 |     await page.goto('/', { waitUntil: 'load' });
  250 |     await page.waitForTimeout(2500);
  251 | 
  252 |     const body = await page.locator('body').innerText();
  253 |     // Khung giờ mở cửa được công bố 08:00 AM - 08:00 PM cho cả 7 ngày.
  254 |     expect(body).toMatch(/8:00 AM\s*-\s*8:00 PM/);
  255 | 
  256 |     // Nút Book Now luôn bấm được, kể cả khi tiệm đang đóng.
  257 |     const bookNow = page.getByRole('button', { name: 'Book Now' }).first();
  258 |     await expect(bookNow).toBeEnabled();
  259 |   });
  260 | 
  261 |   test('TC-T3-M4-009: T3 không có bước tạo tài khoản mới, chỉ tra cứu khách hiện có', async ({ page }) => {
  262 |     await page.goto('/', { waitUntil: 'load' });
  263 |     await page.waitForTimeout(2500);
  264 | 
  265 |     const drawer = await moDrawer(page);
  266 |     const drawerText = await drawer.innerText();
  267 | 
  268 |     expect(drawerText).toMatch(/existing clients only/i);
  269 |     // Không có ô mật khẩu hay liên kết đăng ký trong drawer.
  270 |     await expect(drawer.locator('input[type="password"]')).toHaveCount(0);
  271 |     await expect(drawer.getByRole('link', { name: /sign up|register|đăng ký/i })).toHaveCount(0);
  272 |   });
  273 | 
  274 |   test('TC-T3-M4-010: ST xoá hết ký tự SĐT thì nút Login bị khoá lại', async ({ page }) => {
  275 |     await page.goto('/', { waitUntil: 'load' });
  276 |     await page.waitForTimeout(2500);
  277 | 
  278 |     const drawer = await moDrawer(page);
  279 |     const phone = drawer.locator('input.PhoneInputInput');
  280 |     const login = drawer.getByRole('button', { name: 'Login' });
  281 | 
  282 |     await phone.fill('6098167755');
  283 |     await page.waitForTimeout(600);
  284 |     await expect(login).toBeEnabled();
  285 | 
  286 |     // FR-M4-03: T3 không kiểm tra độ dài tối thiểu → xoá còn 9 số vẫn cho bấm.
  287 |     await phone.press('Backspace');
  288 |     await page.waitForTimeout(500);
  289 |     await expect(login).toBeEnabled();
  290 | 
  291 |     // Xoá hết → ô rỗng → nút khoá (FR-M4-02).
  292 |     await phone.fill('');
  293 |     await page.waitForTimeout(600);
  294 |     await expect(login).toBeDisabled();
  295 |   });
  296 | 
  297 |   test('TC-T3-M4-011: ST sau khi nhập SĐT hợp lệ nút Login được bật', async ({ page }) => {
  298 |     await page.goto('/', { waitUntil: 'load' });
  299 |     await page.waitForTimeout(2500);
  300 | 
  301 |     const drawer = await moDrawer(page);
  302 |     const phone = drawer.locator('input.PhoneInputInput');
  303 |     const login = drawer.getByRole('button', { name: 'Login' });
  304 | 
  305 |     await phone.fill('6098167755');
  306 |     await page.waitForTimeout(800);
  307 |     await expect(login).toBeEnabled();
  308 |   });
  309 | 
  310 |   test('TC-T3-M5-001: trang mô tả quy trình đặt lịch ở mức nghiệp vụ', async ({ page }) => {
  311 |     await page.goto('/', { waitUntil: 'load' });
  312 |     await page.waitForTimeout(2500);
  313 | 
  314 |     const body = await page.locator('body').innerText();
  315 |     expect(body).toMatch(/book now/i);
  316 |     expect(body).toMatch(/appointment/i);
  317 |   });
  318 | 
  319 |   test('TC-T3-M5-002: nội dung hủy/đổi lịch hợp lệ với điều kiện tại tiệm', async ({ page }) => {
  320 |     await page.goto('/', { waitUntil: 'load' });
  321 |     await page.waitForTimeout(2500);
  322 | 
  323 |     const body = await page.locator('body').innerText();
  324 |     // T3 không công bố chính sách hủy/đổi lịch trên trang công khai.
  325 |     expect(body).not.toMatch(/cancellation policy|refund policy/i);
  326 |   });
  327 | 
  328 |   test('TC-T3-M7-001: cung cấp ít nhất 2 kênh liên hệ hoạt động, liên kết mở đúng ứng dụng', async ({
```