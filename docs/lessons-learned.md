# Bài học kinh nghiệm — Kiểm thử 3 hệ thống web đang hoạt động

| | |
|---|---|
| **Dự án** | Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa — Hướng 2 (ADR-15) |
| **Nhóm** | Mạnh · Tài · Ngân · Lộc |
| **Ngày** | 2026-11-22 (Ngày 14 / 14) |
| **Bối cảnh** | 14 ngày · 238 test case · 39 defect · 3 hệ thống · 0 môi trường staging |

Tài liệu này ghi lại những bài học rút ra trong quá trình thực hiện đồ án — không chỉ kết quả đạt được mà cả những chỗ vướng, sai lầm và cách xử lý. Mục tiêu là để người đọc có thể tái lập hoặc cải thiện cách làm.

---

## 1. Về quy trình

### 1.1. Phân tích tĩnh trước khi kiểm thử động — đòn bẩy lớn nhất

**Bài học.** Nhóm xây dựng ma trận McCabe V(G) cho các luồng JS của 3 site (`docs/design/mccabe-coverage.md`) và phát hiện ngay rằng có các nhánh không thể tiếp cận bằng thao tác UI thông thường. Nhờ đó, nhóm tìm được lỗi `DEF-025` (T3 báo lỗi im lặng khi SĐT không có hồ sơ) — một lỗi mà nếu chỉ click theo kịch bản UI sẽ dễ bỏ sót, vì UI không đưa ra manh mối nào cho người kiểm thử biết đã xảy ra lỗi.

**Áp dụng.** Phân tích tĩnh mất khoảng 1 ngày nhưng giảm đáng kể số ca phải chạy tay và tăng độ bao phủ nhánh. Với hệ thống không có mã nguồn (chỉ có JS bundle), đọc code bundle vẫn là cách hiệu quả nhất để lên danh sách ca kiểm thử.

### 1.2. Đặc tả "as-observed" cần một vòng Inspection riêng

**Bài học.** Đặc tả viết ở Ngày 2 dựa trên quan sát bề mặt dẫn đến mâu thuẫn nội tại: `BR-06` khai 3 gói hỗ trợ tại nhà nhưng thực tế có 4 (thiếu "Combo Tắm + Vệ sinh" +70.000₫); `BR-03` khai 5 bậc cân nặng cho Cat Bath nhưng danh mục chỉ có 1 dịch vụ. Chỉ khi chạy Inspection (Ngày 8) mới phát hiện ra 9 yêu cầu cần đổi phạm vi và 11 test case T3 cần viết lại theo hành vi thật.

**Áp dụng.** Với đồ án kiểm thử phần mềm đang hoạt động, hãy dành riêng một phiên review đặc tả với checklist so khớp từng câu đặc tả với hành vi quan sát được, và mở Change Request cho từng điểm lệch. Tài liệu `CHG-2026-11-19-01`, `CHG-2026-11-22-01` là minh chứng.

### 1.3. Cổng kiểm tra tự động làm thay đổi hành vi của nhóm

**Bài học.** `npm run gate` gồm 4 bước (`req:check` → `rtm:check` → `assign:check` → `exit:check`) chạy trong vài giây. Nhờ đó, mỗi lần thêm test case, nhóm biết ngay độ phủ truy xuất có còn 100% không, phân công có còn cân bằng không, và số liệu Exit criteria có đồng bộ với bản ghi thực thi không.

**Đặc biệt đáng chú ý.** Khi hợp nhất với nhóm, `assign:check` phát hiện chênh lệch số ca vượt ngưỡng — điều mà không có script thì không ai phát hiện được, và báo cáo Exit criteria sẽ trông "đẹp" nhưng sai.

**Áp dụng.** Viết cổng kiểm tra sớm (Ngày 1), chạy ở mọi commit. Cổng kiểm tra phải đọc từ **nguồn sự thật duy nhất** — nếu không, sẽ tự mâu thuẫn.

### 1.4. Ngưỡng tuyệt đối không bền khi quy mô thay đổi

**Bài học.** `assign-check.mjs` dùng ngưỡng "chênh lệch ≤ 3 ca" — hợp lý khi bộ ca là 226. Khi bạn Ngân thêm 4 ca mới, ngưỡng này trở nên không khả thi nếu giữ nguyên người thực thi cho từng ca (toán học: lệch tối thiểu là 5). Thay vì nới ngưỡng tùy tiện, nhóm đổi sang công thức **tỷ lệ 3% quy mô bộ ca** và ghi rõ lý do trong chính file script.

**Áp dụng.** Khi một ngưỡng kiểm chứng bắt đầu báo động, phân biệt hai trường hợp: (a) ngưỡng sai vì quy mô đổi → chuyển sang tỷ lệ và ghi lý do; (b) ngưỡng đúng và quy trình lệch → sửa quy trình, **không** sửa ngưỡng. Ở đây là trường hợp (a), và dùng phương án (b) sẽ đồng nghĩa với việc gán sai người thực thi.

### 1.5. Số hiệu ID là tài sản dùng chung — cần quy tắc khi hợp nhất

**Bài học.** Khi 4 thành viên làm song song, xung đột ID xảy ra ở cả hai loại: 4 test case trùng `TC_ID` (nhưng khác nội dung) và 4 defect trùng `DEF_ID`. Nhóm đã xử lý bằng cách: giữ bản chuẩn của người viết trước, cấp số mới cho bản viết sau (`TC-T3-M4-012`…`015`, `DEF-036`…`039`), và cập nhật mọi tham chiếu.

**Áp dụng.** Ngay từ đầu nên quy định: **mỗi thành viên dành một dải số riêng** (ví dụ Tài `TC-T1-*`, Ngân `TC-T2-*`, Lộc `TC-T3-*`) hoặc dùng tiền tố tên. Khi phải hợp nhất muộn, dùng quy tắc "bản chuẩn là bản đã có nhiều tham chiếu hơn; bản còn lại cấp số mới" và **ghi lại quyết định này vào `docs/PROGRESS.md`** để cả nhóm hiểu vì sao ID không liên tục.

---

## 2. Về công cụ và kỹ thuật

### 2.1. Tự động hoá 44 ca là bước ngoặt về tốc độ và độ tin cậy

**Bài học.** Trước Phase 3, nhóm có 56 ca thuộc Mạnh chưa có bằng chứng máy. Sau khi viết 4 spec Playwright, 44 ca chuyển từ Manual sang Auto, và **bằng chứng máy loại bỏ tranh luận** — khi test Fail, có ảnh chụp và `error-context.md` (ảnh + cây DOM) thay vì mô tả bằng lời.

**Áp dụng.** Ưu tiên tự động hoá các ca có tiêu chí chấp nhận **quan sát được** (HTTP status, nội dung DOM, header, số đo). Với ca cần thao tác thủ công, vẫn nên chụp màn hình làm bằng chứng.

### 2.2. Selector theo vai trò/nhãn quan trọng hơn selector theo class

**Bài học.** Các site dùng class sinh tự động (`css-1x2y3z`), nên selector theo class hỏng ngay khi site deploy lại. Nhóm chuyển sang selector theo vai trò (`getByRole`), theo nhãn hiển thị và theo vị trí (`nth`), kết hợp với `data-*` ổn định.

**Áp dụng.** Với hệ thống không kiểm soát mã nguồn, luôn dùng selector dựa trên **nội dung hiển thị cho người dùng** — đó cũng là thứ ít thay đổi nhất.

### 2.3. Script khảo sát hành vi viết riêng tốt hơn nhét vào test case

**Bài học.** Khi cần hiểu sâu một hành vi (múi giờ tiệm, bậc cân nặng trong tên dịch vụ, độ dài SĐT tối thiểu), nhóm viết **script khảo sát riêng** (`scripts/survey-t3-status-timezone.mjs`, `survey-t3-weight-bands.mjs`, `survey-t3-phone-length.mjs`) xuất CSV vào `reports/raw/`, thay vì nhồi nhiều assertion vào một test case. Nhờ vậy, khi phát hiện "6/8 múi giờ cho kết quả sai", nhóm có dữ liệu đầy đủ để viết defect, thay vì chỉ có một assertion đỏ.

**Áp dụng.** Khi một yêu cầu cần khảo sát nhiều biến thể để hiểu hành vi thật, hãy tách bước **khảo sát** (sinh dữ liệu) khỏi bước **kiểm chứng** (assert). Hai loại script này phục vụ hai mục đích khác nhau và nên tách.

### 2.4. Bằng chứng phải tái lập được

**Bài học.** Mỗi con số trong báo cáo phải truy được về một file thô. Nhóm giữ nguyên nguyên tắc: `reports/raw/` là nguồn của mọi con số; `reports/*.md` chỉ tổng hợp. Nhiều lần trong quá trình làm, em phải sửa báo cáo vì đọc lại log thô phát hiện bản nháp nhớ sai (ví dụ tỷ lệ phân bổ test case theo project trong báo cáo hồi quy).

**Áp dụng.** Khi viết báo cáo, **luôn đọc lại log thô và đếm lại** thay vì dựa vào trí nhớ. Script đếm lại từ CSV gốc mất vài phút nhưng loại bỏ được lỗi số liệu.

### 2.5. Chạy song song có nguy cơ tranh chấp tài nguyên mạng

**Bài học.** Khi chạy nhiều project Playwright cùng lúc trên site thật, một số lần `page.goto()` timeout do độ trễ mạng. Nhóm thêm cơ chế thử lại (3 lần, timeout 60s) cho các thao tác điều hướng. Riêng T3 — site có LCP 17,6 giây — cần timeout dài hơn hẳn.

**Áp dụng.** Với site thật, timeout mặc định của Playwright (30s) là không đủ. Đặt timeout theo **số liệu hiệu năng đã đo**, không đặt theo cảm tính.

---

## 3. Về kiểm thử không phá hại

### 3.1. Ranh giới phải được viết thành quy tắc kiểm chứng được, không chỉ là lời nhắc

**Bài học.** ADR-11 quy định ranh giới an toàn (không gửi form đặt lịch thật, không tạo tài khoản, không lưu PII). Nhóm biến nó thành **tiêu chí kiểm chứng tự động**: quét telemetry toàn bộ request trong phiên kiểm thử và đếm số request có phương thức ghi dữ liệu tới miền site đích — kết quả **0/779**. Nhờ đó, "nhóm không phá hại" là một khẳng định có số liệu, không phải lời hứa.

**Áp dụng.** Với bất kỳ đồ án kiểm thử phần mềm đang hoạt động nào, hãy biến ranh giới an toàn thành **script kiểm chứng** và chạy nó ở mỗi phiên.

### 3.2. Có những ca test không thể chạy an toàn — hãy đánh dấu, đừng ép chạy

**Bài học.** `DEF-028` (API T3 trả hồ sơ khách hàng đầy đủ qua tra cứu SĐT) muốn re-test thì phải dùng **SĐT khách hàng thật** — điều này vi phạm chính ranh giới bảo vệ PII mà nhóm đã đặt ra. Nhóm đã đánh dấu ca này `HUMAN-PENDING` và **ghi rõ lý do** thay vì chạy một truy vấn với dữ liệu thật.

**Áp dụng.** Luôn có trạng thái trung gian "cần người/sự cho phép" cho các ca không thể tự động hoá. Trạng thái này **không phải là thiếu sót** — nó là bằng chứng cho thấy nhóm hiểu ranh giới của mình.

### 3.3. Đo hiệu năng phải dùng kịch bản chỉ đọc

**Bài học.** Kịch bản k6 ghi (POST) sẽ tạo dữ liệu thật trên site đích. Nhóm chỉ dùng kịch bản **GET** với 10 VU trong 1 phút: 183 request, 0 lỗi 5xx, `http_req_failed = 0,00%`, p95 = 907,74 ms — đủ để đánh giá độ ổn định mà không ghi bất kỳ dữ liệu nào.

**Áp dụng.** Với bài toán hiệu năng trên hệ thống không kiểm soát, hãy ưu tiên kịch bản chỉ đọc. Nếu cần kịch bản ghi, phải xin phép chủ site trước (đã ghi là câu hỏi cần nhóm quyết định trong `docs/design/test-design-ngan.md` §8).

---

## 4. Về đạo đức và vị trí của nhóm kiểm thử

### 4.1. Test Fail không phải lúc nào cũng là lỗi của sản phẩm

**Bài học.** 28 test case Fail đều dẫn tới lỗi thật của site đích — không phải lỗi của test case. Nhưng ngược lại, trong quá trình thiết kế cũng có lúc giả định của nhóm về hành vi thật là sai. Rõ nhất là 9 ca BVA của T3 dùng bậc cân nặng `51–60lbs` — bậc này **không tồn tại** trên 2 dòng sản phẩm T3, và chỉ phát hiện được khi nhóm đọc lại danh mục dịch vụ thật (RV-D2, Inspection Ngày 3). Tương tự, giả định T3 có wizard nhiều bước như T1/T2 là sai — T3 không có bước chọn ngày hay khung giờ.

Quy tắc nhóm áp dụng: **được sửa test case chỉ khi ca đó chưa có kết quả**; ca đã Fail thì giữ nguyên và tìm nguyên nhân gốc.

**Áp dụng.** Ghi rõ trong báo cáo: "0 sửa test cho xanh" kèm con số **22 defect đã re-test — cả 22 đều vẫn tái hiện, 0 defect nào đóng được** (6 defect còn lại không re-test được vì lý do kỹ thuật, xem `reports/defect-retest-report.md` §2.2). Đây là thông tin giá trị hơn nhiều so với một bảng "tất cả xanh".

### 4.2. Lỗi của bên thứ ba không thể đóng — và đó là kết quả hợp lệ

**Bài học.** Có hai nguồn hướng dẫn mâu thuẫn: `PLN-01` §6.3 gợi ý đóng lỗi site đích để báo cáo đẹp, còn `docs/design/usecase-workflow.md` §5.2 (tài liệu thiết kế test đã được review chéo) yêu cầu giữ trạng thái `Open` kèm ghi chú. Nhóm chọn giữ `Open` và **tài liệu hóa lý do** trong `reports/defect-retest-report.md`.

**Áp dụng.** Khi một quy trình chuẩn của nhóm mâu thuẫn với một quy trình đã được review chéo, hãy theo tài liệu đã review và **ghi rõ lý do vào báo cáo** để người đọc hiểu đây là quyết định có chủ đích, không phải sơ suất.

### 4.3. Điểm số thấp vẫn là kết quả kiểm thử có giá trị

**Bài học.** Lighthouse Performance của T3 chỉ 3/100, 49 ảnh thiếu `alt`, 2 API key lộ trong HTML, API trả về PII khách hàng không mask. Nhóm không có quyền sửa, nhưng có quyền **ghi nhận đầy đủ và nêu rõ mức độ rủi ro** — đó là giá trị lớn nhất mà một đội kiểm thử sinh viên mang lại cho đồ án này.

**Áp dụng.** Trong Final Test Report, phân biệt rõ "tiêu chí FAIL vì **chất lượng phần mềm đang hoạt động**" với "tiêu chí FAIL vì **quá trình kiểm thử chưa đủ**". EC-2/EC-5/EC-6 thuộc nhóm đầu; EC-7 (UAT) thuộc nhóm thứ hai và được đánh dấu `HUMAN-PENDING` kèm người chịu trách nhiệm.

---

## 5. Về làm việc nhóm

### 5.1. Đối chiếu chéo là lớp an toàn cho dữ liệu đầu vào

**Bài học.** Nguyên tắc ADR-15 yêu cầu mỗi module của mỗi hệ thống có **≥ 2 người chạy**. Ngoài giá trị kiểm chứng, nguyên tắc này còn bảo vệ khỏi việc một người viết sai đặc tả rồi tự chạy và tự xác nhận. Script `assign:check` kiểm tra điều này tự động và hiện báo **0 module chỉ có 1 người chạy**.

**Áp dụng.** Ngay cả khi phân công không cân bằng tuyệt đối, hãy giữ nguyên nguyên tắc "≥ 2 người cho mỗi module" — nó đáng giá hơn nhiều so với việc cân bằng số ca tuyệt đối.

### 5.2. Bàn giao giữa các phiên cần bằng chứng, không chỉ mô tả

**Bài học.** Khi bạn Ngân hoàn tất 57 ca và giao lại, nhóm phải đối chiếu từng dòng log, phát hiện 4 ca trùng `TC_ID` khác nội dung và 4 defect trùng số. Nếu bàn giao chỉ có "xong 57 ca, 43 Pass", nhóm sẽ không có cách nào phát hiện ra xung đột đó.

**Áp dụng.** Bàn giao phải kèm **file dữ liệu thô** (CSV log thực thi, file defect), không kèm bản tóm tắt. Tóm tắt có thể sai; dữ liệu thô thì đối chiếu được.

### 5.3. Ghi quyết định vào tài liệu ngay khi ra, không để tới cuối

**Bài học.** Nhiều quyết định quan trọng (đổi số TC_ID, đổi ngưỡng `assign:check`, giữ trạng thái `Open` cho lỗi site đích) nếu không ghi lại sẽ biến mất. Nhóm ghi vào `docs/PROGRESS.md` (lịch sử phiên), `docs/decisions.md` (ADR) và `docs/change-requests.md` (CR) — mỗi loại cho một loại quyết định.

**Áp dụng.** Ba nơi lưu quyết định nên có ranh giới rõ:
- `docs/decisions.md` — quyết định kiến trúc/phương pháp kiểm thử (có đánh số ADR, không đổi sau khi ban hành)
- `docs/change-requests.md` — thay đổi đặc tả (có ngày, lý do, tác động)
- `docs/PROGRESS.md` — nhật ký phiên làm việc (kể cả những gì **không** làm và vì sao)

---

## 6. Bảng tổng hợp: 10 bài học mang lại giá trị lớn nhất

| # | Bài học | Hình thức | Áp dụng vào đồ án này |
|---|---|---|---|
| 1 | Phân tích tĩnh trước động | Quy trình | McCabe V(G) → tìm được `DEF-025` |
| 2 | Đặc tả as-observed cần vòng Inspection riêng | Quy trình | Ngày 8 sửa 9 yêu cầu + 11 test case |
| 3 | Cổng kiểm tra tự động thay đổi hành vi nhóm | Công cụ | `npm run gate` phát hiện lệch phân công khi hợp nhất |
| 4 | Ngưỡng tuyệt đối → chuyển sang tỷ lệ khi quy mô đổi | Quy trình | `assign:check` ±3 → 3% quy mô |
| 5 | ID là tài sản dùng chung — cần dải số riêng | Quy trình | Hợp nhất: cấp `TC-T3-M4-012…015`, `DEF-036…039` |
| 6 | Bằng chứng phải tái lập được | Công cụ | `reports/raw/` là nguồn duy nhất của mọi con số |
| 7 | Ranh giới an toàn phải kiểm chứng được | Kỹ thuật | Telemetry: 0/779 request ghi dữ liệu |
| 8 | Có ca không thể chạy an toàn — đánh dấu, đừng ép | Đạo đức | `DEF-028` → `HUMAN-PENDING` |
| 9 | Điểm số thấp vẫn là kết quả có giá trị | Đạo đức | 39 defect tất cả là lỗi thật của site đích |
| 10 | Bàn giao phải kèm dữ liệu thô | Nhóm | Phát hiện 4 trùng `TC_ID` + 4 trùng `DEF_ID` khi hợp nhất |

---

## 7. Việc nên làm khác đi nếu có thêm thời gian

| # | Việc | Lý do | Ước lượng |
|---|---|---|---|
| 1 | Chạy 76 ca T1/T2 còn "Chưa thực thi" (T1: 43 · T2: 33) | Đưa EC-2 về mức đo đầy đủ nhất | 2 ngày · Tài + Ngân |
| 2 | Hoàn thành UAT với 5–8 người ngoài nhóm | EC-7 là tiêu chí duy nhất còn để mở bởi nhóm | 3 ngày · Lộc |
| 3 | Tự động hoá 27 ca NFR (20 Fail + 7 chưa chạy) | 20/44 ca NFR đang Fail — chi phí thấp (axe + Lighthouse đã có sẵn), giá trị cao | 1 ngày · Mạnh + Lộc |
| 4 | Bổ sung test case API (Postman/Newman) | 3 hệ thống đều có API công khai; `DEF-032` và `DEF-039` chỉ phát hiện được qua API | 1 ngày · Ngân |
| 5 | Thêm kiểm thử tương thích trình duyệt đầy đủ | `TC-NFR-04-005` Fail; hiện mới chạy Chromium + 1 ca WebKit | 1 ngày · Tài |

---

## 8. Lời khuyên cho nhóm khác

Nếu nhóm khác muốn làm đồ án kiểm thử phần mềm đang hoạt động, 5 điều em khuyên làm ngay từ đầu:

1. **Viết ADR về ranh giới an toàn trước khi viết test case đầu tiên.** Biết rõ mình sẽ không chạm vào cái gì giúp mọi quyết định sau này nhẹ đi rất nhiều — kể cả quyết định có mở defect hay không.

2. **Đừng vội viết test case.** Dành 2–3 ngày cho khảo sát hành vi thật. Phần lớn test case Mạnh viết sai ban đầu là do giả định từ trải nghiệm, không phải do thiếu kỹ năng viết test.

3. **Đo trước khi đặt tiêu chí.** Một tiêu chí "LCP ≤ 2,5 giây" nghe có vẻ hợp lý cho tới khi biết T3 mất 17,6 giây. Đặt tiêu chí sau khi đo giúp tránh hoặc tạo ra những lần FAIL không mang thông tin.

4. **Tự viết script cho phần lặp lại.** 44 ca tự động hoá giúp nhóm tiết kiệm hàng chục giờ, nhưng lợi ích lớn hơn nằm ở chỗ mỗi lần chạy lại đều cho bằng chứng mới — điều mà kiểm thử thủ công không có.

5. **Ghi lại mọi quyết định, kể cả những cái trông nhỏ.** Sau 14 ngày, giá trị lớn nhất của hồ sơ không phải 39 defect, mà là **khả năng giải thích mọi con số và mọi lựa chọn** — đó là điều làm cho hồ sơ trở thành công trình nghiên cứu thay vì chỉ là một bảng kết quả.

---

*Tài liệu này được lập ngày 2026-11-22 bởi Mạnh (TV1, Test Lead) trong khuôn khổ Phase 8 — Ngày 14. Mọi ví dụ đều trích từ tài liệu thực tế của dự án (`docs/`, `reports/`).*
