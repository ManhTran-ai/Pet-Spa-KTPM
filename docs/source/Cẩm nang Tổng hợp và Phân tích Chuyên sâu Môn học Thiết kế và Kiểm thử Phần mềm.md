### Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm

#### 1\. Tổng quan Nền tảng về Kiểm thử và Đảm bảo Chất lượng Phần mềm

Phần mềm là một sản phẩm trí tuệ vô hình, có tính phức tạp cao và dễ phát sinh sai sót trong quá trình phát triển. Việc thấu hiểu bản chất của kiểm thử phần mềm cũng như sự phân định giữa các khái niệm nền tảng đóng vai trò quyết định trong thiết lập tư duy kiểm thử chuẩn mực cho kỹ sư phần mềm.

##### 1.1 Bản chất Lỗi Phần mềm: Phân biệt Mistake, Defect và Failure

Theo tài liệu giảng dạy Tổng quan Kiểm thử Phần mềm và chuẩn ISTQB CTFL, sự hình thành một sự cố trên môi trường thực tế trải qua một chuỗi nguyên nhân \- kết quả rõ ràng:

* **Mistake / Error (Sai lầm từ con người)** : Hành động không đúng đắn của con người trong quá trình phân tích yêu cầu, thiết kế kiến trúc hoặc lập trình mã nguồn. Lỗi này xuất phát từ nhiều nguyên nhân như thiếu giao tiếp, yêu cầu mơ hồ, áp lực tiến độ hoặc sự thiếu hụt năng lực kỹ thuật.  
* **Defect / Fault / Bug (Khuyết tật / Lỗi phần mềm)** : Biểu hiện của sai lầm (Mistake) được lưu lại trong tài liệu hoặc mã nguồn chương trình. Khuyết tật là sự sai lệch giữa mã nguồn thực tế với đặc tả yêu cầu hoặc logic mong đợi.  
* **Failure (Sự thất bại / Sự cố vận hành)** : Sự sai lệch của phần mềm so với hành vi mong đợi khi chương trình đang chạy thực tế trên môi trường vận hành. Sự cố chỉ xuất hiện khi đoạn mã chứa khuyết tật (Defect) được thực thi dưới những điều kiện đầu vào cụ thể.

##### 1.2 Định nghĩa và Mục tiêu Cốt lõi của Kiểm thử Phần mềm

Khái niệm kiểm thử phần mềm được xây dựng dựa trên hai góc nhìn nền tảng:

* **Theo Glenford Myers** : Kiểm thử là quá trình vận hành một chương trình nhằm mục đích tìm ra lỗi (Defects). Đây là góc nhìn mang tính "phá hủy" tích cực, định hướng người làm kiểm thử chủ động truy tìm khiếm khuyết.  
* **Theo tiêu chuẩn IEEE** : Kiểm thử là quá trình vận hành hệ thống hoặc thành phần dưới các điều kiện xác định, quan sát hoặc ghi nhận kết quả và đưa ra đánh giá. Đồng thời, đây cũng là quá trình phân tích phần mềm để xác định sự khác biệt giữa điều kiện thực tế và điều kiện yêu cầu.

Mục tiêu cốt lõi của hoạt động kiểm thử không chỉ dừng lại ở việc tìm ra càng nhiều lỗi càng tốt trong giới hạn thời gian và ngân sách, mà còn phải chứng minh sản phẩm đáp ứng đúng đặc tả, xác nhận chất lượng hệ thống với chi phí tối ưu, và cung cấp thông tin rủi ro minh bạch cho các bên liên quan trước khi phát hành.

##### 1.3 Phân định Vai trò: Tester (KS Kiểm định) vs QA (KS Chất lượng)

Sự nhầm lẫn giữa kiểm thử sản phẩm và quản lý chất lượng quy trình là khá phổ biến. Giáo trình phân định rõ hai vai trò này:

* **Kỹ sư Kiểm định (Tester)** : Tập trung vào sản phẩm (Product-oriented). Nhiệm vụ chính là khảo sát, thiết kế kịch bản, chạy thử hệ thống để bảo đảm phần mềm đáp ứng các yêu cầu chức năng và khả năng vận hành, đồng thời ghi nhận lỗi để nhóm phát triển sửa chữa.  
* **Kỹ sư Bảo đảm Chất lượng (QA \- Quality Assurance)** : Tập trung vào quy trình (Process-oriented). QA giám sát việc định nghĩa và tuân thủ các tiêu chuẩn, quy trình sản xuất phần mềm ngay từ đầu dự án nhằm ngăn ngừa sai sót xuất hiện (Preventive action).

Tiêu chí,Kỹ sư Kiểm định (Tester),Kỹ sư Bảo đảm Chất lượng (QA)  
Trọng tâm đối tượng,Sản phẩm phần mềm (Product),Quy trình sản xuất (Process)  
Mục tiêu hoạt động,Phát hiện lỗi tồn tại trong mã nguồn/hệ thống,"Định nghĩa, giám sát và cải tiến quy trình để ngừa lỗi"  
Thời điểm tác động,Thường tập trung mạnh từ giai đoạn kiểm thử động,Tác động liên tục từ khi bắt đầu dự án  
Tính chất hành động,Kiểm tra và phát hiện (Detective),Phòng ngừa và cải tiến (Preventive)

##### 1.4 Kiểm chứng (Verification) vs Thẩm định (Validation)

Mối quan hệ giữa Kiểm chứng và Thẩm định tạo thành Tam giác Chất lượng (Quality Triangle) trong phát triển phần mềm:

* **Kiểm chứng (Verification)** : Đặt câu hỏi  *"Did we build the system right?"*  (Chúng ta có xây dựng hệ thống đúng theo mô tả đặc tả không?). Đây là quá trình đánh giá các sản phẩm trung gian (tài liệu SRS, bản thiết kế, mã nguồn) để kiểm tra xem giai đoạn phát triển có tuân thủ đúng điều kiện đã đặt ra ở giai đoạn trước hay không.  
* **Thẩm định (Validation)** : Đặt câu hỏi  *"Did we build the right system?"*  (Chúng ta có xây dựng đúng hệ thống mà người dùng thực sự cần không?). Đây là quá trình đánh giá phần mềm ở cuối giai đoạn phát triển nhằm bảo đảm hệ thống đáp ứng đúng nhu cầu thực tế và mục đích sử dụng của khách hàng.

##### 1.5 Bảy Nguyên tắc Kiểm thử Cốt lõi (ISTQB)

Bộ nguyên tắc ISTQB đóng vai trò là kim chỉ nam tư duy cho mọi chiến lược kiểm thử:

1. **Kiểm thử đưa ra bằng chứng về sự tồn tại của lỗi (Testing shows the presence of defects)** : Kiểm thử có thể chứng minh phần mềm có lỗi, nhưng không thể chứng minh phần mềm hoàn toàn không có lỗi.  
2. **Kiểm thử kiệt quệ là không thể (Exhaustive testing is impossible)** : Không thể kiểm thử tất cả các kết hợp đầu vào và điều kiện ngoại lệ, trừ các trường hợp quá đơn giản.  
3. **Kiểm thử sớm (Early testing)** : Hoạt động kiểm thử nên bắt đầu sớm nhất có thể trong vòng đời phát triển để tối ưu hóa chi phí sửa lỗi.  
4. **Sự tích tụ của lỗi (Defect clustering)** : Phần lớn các lỗi vận hành nghiêm trọng thường tập trung ở một số ít mô-đun cốt lõi hoặc phức tạp của hệ thống.  
5. **Nghịch lý thuốc trừ sâu (Pesticide paradox)** : Nếu lặp đi lặp lại một bộ ca kiểm thử giống hệt nhau, chúng sẽ dần mất khả năng phát hiện lỗi mới. Bộ ca kiểm thử cần được rà soát và cập nhật thường xuyên.  
6. **Kiểm thử phụ thuộc vào bối cảnh (Testing is context dependent)** : Kiểm thử ứng dụng thương mại điện tử sẽ khác hoàn toàn với kiểm thử hệ thống nhúng trong thiết bị y tế hay ứng dụng ngân hàng.  
7. **Sự ngụy biện về việc không có lỗi (Absence-of-errors fallacy)** : Một hệ thống được kiểm thử kỹ lưỡng và không phát hiện lỗi vẫn có thể thất bại nếu nó không đáp ứng đúng nhu cầu thực tế của người dùng.

#### 2\. Quy trình Kiểm thử Hệ thống và Các Cấp độ Kiểm thử trong Vòng đời Phát triển

Kiểm thử là một quy trình kỹ thuật có cấu trúc, bao gồm chuỗi các hoạt động được lập kế hoạch và kiểm soát chặt chẽ nhằm bảo đảm chất lượng phần mềm xuyên suốt vòng đời phát triển.

##### 2.1 Vị trí Kiểm thử trong Mô hình Chữ V (V-Model) và RUP

Trong quy trình phát triển RUP (Rational Unified Process), hoạt động kiểm thử diễn ra lặp đi lặp lại qua tất cả các pha (Inception, Elaboration, Construction, Transition). Đối với mô hình chữ V, kiểm thử không chỉ diễn ra sau khi lập trình xong mà mỗi giai đoạn phát triển ở nhánh bên trái đều có giai đoạn kiểm thử tương ứng ở nhánh bên phải:

* **Phân tích yêu cầu nghiệp vụ (Business Requirements)**  tương ứng với  **Kiểm thử chấp nhận (Acceptance Testing)** .  
* **Đặc tả hệ thống (System Specification)**  tương ứng với  **Kiểm thử hệ thống (System Testing)** .  
* **Thiết kế kiến trúc (Architecture Design)**  tương ứng với  **Kiểm thử tích hợp (Integration Testing)** .  
* **Thiết kế chi tiết (Detailed Design)**  tương ứng với  **Kiểm thử đơn vị (Unit/Component Testing)** .

##### 2.2 Quy trình Kiểm thử Tổng quát 5 Giai đoạn

Giáo trình Quy trình Kiểm thử mô tả 5 giai đoạn cốt lõi của một chiến lược kiểm thử tiêu chuẩn:

1. **Lập kế hoạch và Kiểm soát (Test Planning & Control)** : Xác định phạm vi kiểm thử, phân tích rủi ro, lựa chọn chiến lược, ước lượng nguồn lực, lập lịch trình và xác định tiêu chí kết thúc kiểm thử (Exit criteria).  
2. **Phân tích và Thiết kế Kiểm thử (Test Analysis & Design)** : Phân tích tài liệu đặc tả (Test basis) để chuyển đổi mục tiêu kiểm thử thành các kịch bản kiểm thử (Test scenarios), điều kiện kiểm thử và dàn khung ca kiểm thử (High-level test cases).  
3. **Thực hiện và Cấu hình Kiểm thử (Test Implementation & Execution)** : Chuẩn bị môi trường kiểm thử, tạo dữ liệu kiểm thử (Test data), phát triển các test script (nếu tự động hóa), thực thi các ca kiểm thử và ghi nhận kết quả thực tế.  
4. **Báo cáo và Đánh giá Kết quả (Test Report & Evaluation)** : Thu thập số liệu thực thi, so sánh kết quả thực tế với tiêu chí kết thúc, đưa ra đánh giá về độ bao phủ và lập báo cáo kết quả kiểm thử tổng hợp (Final Test Report).  
5. **Đóng Hoạt động Kiểm thử (Test Closure)** : Thu thập dữ liệu từ các hoạt động kiểm thử đã hoàn thành, lưu trữ tài liệu kiểm thử, bàn giao sản phẩm và rút ra bài học kinh nghiệm (Lessons learned) cho các dự án sau.

##### 2.3 Bốn Cấp độ Kiểm thử Cơ bản (Test Levels)

Hệ thống kiểm thử được chia thành 4 cấp độ nối tiếp nhau từ thấp đến cao:

* **Kiểm thử Đơn vị / Thành phần (Unit / Component Testing)** : Kiểm thử các thành phần mã nguồn riêng lẻ (như hàm, phương thức, lớp, mô-đun) một cách độc lập. Do nhóm lập trình viên thực hiện nhằm phát hiện lỗi cấu trúc mã và logic xử lý nội bộ.  
* **Kiểm thử Tích hợp (Integration Testing)** : Kiểm thử sự tương tác và giao tiếp giữa các thành phần hoặc giữa các hệ thống con với nhau. Tập trung phát hiện lỗi tại các giao diện kết nối (Interfaces) và luồng dữ liệu truyền qua lại.  
* **Kiểm thử Hệ thống (System Testing)** : Kiểm thử toàn bộ hệ thống đã tích hợp hoàn chỉnh dựa trên các yêu cầu chức năng và phi chức năng đã được đặc tả trong SRS. Thường do nhóm kiểm thử độc lập thực hiện trên môi trường tương đương sản phẩm thực tế.  
* **Kiểm thử Chấp nhận (Acceptance Testing)** : Đánh giá sự sẵn sàng của hệ thống từ góc nhìn của khách hàng hoặc người dùng cuối. Bao gồm Kiểm thử chấp nhận người dùng (UAT), Kiểm thử Alpha (thực hiện tại môi trường phát triển bởi người dùng) và Kiểm thử Beta (thực hiện tại môi trường thực tế của người dùng).

##### 2.4 Phân loại Loại hình Kiểm thử (Test Types)

Bên cạnh các cấp độ, kiểm thử được phân loại theo mục đích và bản chất đối tượng kiểm tra:

* **Kiểm thử Chức năng (Functional Testing)** : Đánh giá "chương trình làm gì" (What the system does) dựa trên đặc tả yêu cầu, kiểm tra tính đúng đắn của việc nhập liệu, xử lý nghiệp vụ và truy xuất dữ liệu.  
* **Kiểm thử Phi Chức năng (Non-Functional Testing)** : Đánh giá "hệ thống hoạt động như thế nào" (How the system works). Bao gồm kiểm thử hiệu năng (Performance), kiểm thử tải (Load), kiểm thử chịu tải cực hạn (Stress), kiểm thử khả năng sử dụng (Usability), kiểm thử tính tin cậy (Reliability), và kiểm thử bảo mật (Security).  
* **Kiểm thử Liên quan đến Thay đổi** :  
* **Kiểm thử lại (Re-testing / Confirmation Testing)** : Thực thi lại chính xác các ca kiểm thử từng bị thất bại sau khi lập trình viên báo đã sửa xong lỗi, nhằm xác nhận lỗi đã thực sự được khắc phục.  
* **Kiểm thử Hồi quy (Regression Testing)** : Kiểm thử lại các chức năng cũ chưa bị thay đổi để đảm bảo việc sửa lỗi hoặc bổ sung tính năng mới không gây ra tác động tiêu cực làm phát sinh lỗi ở các phần đang hoạt động ổn định.

##### 2.5 Chiến lược Tích hợp: Big Bang vs Kiểm thử Gia tăng

Khi thực hiện kiểm thử tích hợp hệ thống, có hai tiếp cận chiến lược cơ bản:

* **Chiến lược Big Bang** : Tích hợp toàn bộ các mô-đun cùng một lúc rồi tiến hành kiểm thử toàn bộ hệ thống. Chiến lược này tiết kiệm thời gian chuẩn bị ban đầu nhưng rủi ro cực kỳ cao, rất khó khoanh vùng nguyên nhân khi xuất hiện lỗi.  
* **Chiến lược Gia tăng (Incremental Testing)** : Tích hợp và kiểm thử từng phần nhỏ theo thứ tự. Bao gồm các tiếp cận Top-Down (từ trên xuống, sử dụng Stubs), Bottom-Up (từ dưới lên, sử dụng Drivers), và Sandwich/Hybrid (kết hợp cả hai).

#### 3\. Kỹ thuật Kiểm thử Tĩnh: Rà soát (Review) và Phân tích Tĩnh (Static Analysis)

Kiểm thử tĩnh là phương pháp đánh giá tài liệu hoặc mã nguồn phần mềm mà  **không cần thực thi chương trình** . Kỹ thuật này giúp phát hiện nguyên nhân gốc rễ của lỗi ngay từ các giai đoạn đầu của dự án, đem lại hiệu quả chi phí vượt trội.

##### 3.1 Bản chất và Lợi ích của Kiểm thử Tĩnh

Khác với kiểm thử động (chạy chương trình để tìm hành vi sai hỏng), kiểm thử tĩnh trực tiếp kiểm tra tính đúng đắn, đầy đủ và nhất quán của các sản phẩm làm việc như tài liệu yêu cầu (SRS), bản thiết kế kiến trúc, kịch bản kiểm thử và mã nguồn.  
Lợi ích chính của kiểm thử tĩnh bao gồm:

* Phát hiện và khắc phục lỗi sớm, giảm chi phí sửa lỗi lên đến hàng chục lần so với khi tìm thấy ở giai đoạn kiểm thử động hay vận hành.  
* Nâng cao năng lực giao tiếp và sự thấu hiểu chung giữa các thành viên trong dự án (BA, Developer, Tester, PM).  
* Rút ngắn thời gian phát triển và giảm khối lượng công việc kiểm thử lại ở các giai đoạn sau.

##### 3.2 Quy trình Rà soát Trang trọng (Formal Review Process)

Một quy trình rà soát trang trọng tiêu chuẩn bao gồm 6 bước chính:

1. **Khởi tạo (Phù hợp/Planning)** : Xác định phạm vi rà soát, lựa chọn nhân sự, phân công vai trò và chuẩn bị tài liệu tiêu chí đầu vào (Entry criteria).  
2. **Kích hoạt (Kick-off)** : Phân phát tài liệu, giải thích mục tiêu, quy trình làm việc và bảng kiểm tra (Checklist) cho người tham gia.  
3. **Chuẩn bị cá nhân (Individual Preparation)** : Mỗi người tham gia tự đọc, nghiên cứu tài liệu và ghi nhận các nghi vấn hay lỗi phát hiện được.  
4. **Họp rà soát (Review Meeting)** : Thảo luận, đánh giá các khuyết tật được ghi nhận, đề xuất giải pháp xử lý hoặc ghi nhận để tác giả chỉnh sửa.  
5. **Sửa đổi (Rework)** : Tác giả sản phẩm tiến hành chỉnh sửa các lỗi đã được thống nhất trong cuộc họp.  
6. **Theo dõi và Đóng (Follow-up & Exit)** : Điều phối viên kiểm tra lại sản phẩm đã sửa so với tiêu chí kết thúc (Exit criteria) để chính thức khép lại đợt rà soát.

Trong quy trình này, các vai trò chính được phân định rõ ràng:

* **Tác giả (Author)** : Người tạo ra sản phẩm tài liệu hoặc mã nguồn cần rà soát.  
* **Điều phối viên (Moderator / Lead Reviewer)** : Dẫn dắt cuộc họp, đảm bảo quy trình diễn ra đúng hướng và hiệu quả.  
* **Người rà soát (Reviewer / Inspector)** : Các chuyên gia hoặc thành viên nhóm đóng góp ý kiến chuyên môn để tìm lỗi.  
* **Thư ký (Scribe / Recorder)** : Ghi chép lại toàn bộ các lỗi, câu hỏi và quyết định trong cuộc họp.

##### 3.3 Phân loại 4 Hình thức Rà soát (Review Types)

Mức độ trang trọng của rà soát tăng dần qua 4 hình thức cơ bản:  
Hình thức Rà soát,Đặc điểm Quy trình,Mục tiêu & Thành phần Tham gia  
Informal Review,"Không có quy trình trang trọng, không cần ghi chép biên bản chính thức.","Trao đổi giữa đồng nghiệp, lập trình theo cặp (Pair programming), chi phí thấp."  
Walkthrough,"Do Tác giả chủ trì cuộc họp, hướng dẫn đồng nghiệp đi qua từng phần tài liệu.","Nhằm truyền đạt thông tin, thu thập đóng góp và xây dựng sự đồng thuận chung."  
Technical Review,"Cần quy trình chuẩn bị cá nhân, do chuyên gia kỹ thuật hoặc đồng nghiệp đánh giá.","Tập trung đánh giá tính khả thi kỹ thuật, sự tuân thủ thiết kế và tiêu chuẩn mã nguồn."  
Inspection,"Hình thức trang trọng nhất, do Moderator độc lập dẫn dắt, tuân thủ checklist và tiêu chí đóng nghiêm ngặt.","Tìm kiếm khuyết tật tối đa, đo lường chỉ số chất lượng và cải tiến quy trình sản xuất."

##### 3.4 Phân tích Tĩnh Tự động (Static Analysis)

Phân tích tĩnh tự động là sự mở rộng của công nghệ trình biên dịch. Các công cụ phân tích tĩnh quét mã nguồn mà không cần chạy chương trình để phát hiện các bất thường cấu trúc:

* **Phân tích luồng dữ liệu (Data Flow Analysis)** : Kiểm tra chuỗi trạng thái của biến trong chương trình (Khai báo \- Define, Sử dụng \- Use, Hủy bỏ \- Kill). Phát hiện các lỗi như sử dụng biến chưa khởi tạo, gán giá trị mà không bao giờ dùng đến, hoặc khai báo biến lặp lại.  
* **Kiểm tra vi phạm chuẩn mã hóa** : Phát hiện vi phạm quy tắc đặt tên, hàm quá dài, độ sâu lồng nhau quá mức, mã không bao giờ chạm tới (Dead code/Unreachable code).  
* **Chỉ số đo lường tĩnh (Static Metrics)** :  
* **LOC (Lines of Code)** : Tổng số dòng mã.  
* **Halstead's Metrics** : Đo lường dựa trên số lượng toán tử (Operators) và toán hạng (Operands).  
* **Fan-in & Fan-out** : Đo lường mức độ phụ thuộc giữa các mô-đun. Fan-in là số lượng mô-đun gọi đến mô-đun hiện tại; Fan-out là số lượng mô-đun mà mô-đun hiện tại gọi đến.  
* **Coupling & Cohesion** : Đánh giá độ kết nối giữa các mô-đun và độ tập trung chức năng bên trong một mô-đun.

#### 4\. Kỹ thuật Thiết kế Ca kiểm thử Hộp đen (Black-box Test Design Techniques)

Kiểm thử hộp đen (Black-box Testing hay Specification-based Testing) coi hệ thống phần mềm như một "hộp đen" ẩn kín cấu trúc mã nguồn bên trong. Kiểm thử viên thiết kế ca kiểm thử dựa trên đặc tả yêu cầu, tập trung vào dữ liệu đầu vào (Input) và kết quả đầu ra (Output).

##### 4.1 Cấu trúc Ca kiểm thử Chuẩn và Nguyên tắc 4C

Một ca kiểm thử (Test Case) hoàn chỉnh theo tài liệu Test Design phải đáp ứng tiêu chuẩn cấu trúc bao gồm:

* **Test Case ID** : Mã định danh duy nhất.  
* **Test Description** : Mô tả mục tiêu kiểm thử.  
* **Test Pre-condition** : Điều kiện tiền đề cần thiết trước khi thực thi.  
* **Test Procedure / Steps** : Các bước thực hiện chi tiết theo thứ tự.  
* **Expected Output** : Kết quả mong đợi chính xác.

Đồng thời, viết ca kiểm thử phải tuân thủ  **Nguyên tắc 4C** :

1. **Correctness (Đúng đắn)** : Đảm bảo kiểm tra chính xác yêu cầu đặc tả.  
2. **Clarity (Rõ ràng)** : Các bước rõ ràng, người khác đọc vào có thể thực thi ngay mà không cần hỏi lại.  
3. **Completeness (Đầy đủ)** : Bao phủ đầy đủ các kịch bản hợp lệ và ngoại lệ.  
4. **Consistency (Nhất quán)** : Thuật ngữ và định dạng nhất quán xuyên suốt bộ ca kiểm thử.

##### 4.2 Phân vùng Tương đương (Equivalence Partitioning \- EP)

Phân vùng tương đương chia miền dữ liệu đầu vào hoặc đầu ra thành các tập hợp con gọi là các "lớp tương đương" (Equivalence classes). Giả định cơ bản là phần mềm sẽ xử lý tất cả các giá trị trong cùng một lớp theo một cách hoàn toàn giống nhau. Do đó, chỉ cần chọn 1 giá trị đại diện từ mỗi phân vùng để kiểm thử.  
Quy tắc áp dụng:

* Tạo phân vùng cho cả  **Dữ liệu Hợp lệ (Valid Partitions)**  và  **Dữ liệu Không hợp lệ (Invalid Partitions)** .  
* Dữ liệu hợp lệ có thể kết hợp nhiều giá trị trong cùng một ca kiểm thử để tiết kiệm thời gian.  
* Dữ liệu không hợp lệ phải được kiểm thử riêng biệt từng giá trị trong từng ca kiểm thử độc lập để tránh hiện tượng lỗi này che khuất lỗi khác (Defect masking).

##### 4.3 Phân tích Giá trị Biên (Boundary Value Analysis \- BVA)

Kinh nghiệm cho thấy lỗi phần mềm có xu hướng tập trung cao độ tại các vùng biên của các lớp tương đương hơn là ở trung tâm. Phân tích giá trị biên là kỹ thuật mở rộng của EP, tập trung chọn các giá trị tại biên và ngay sát biên.  
Giáo trình mô tả hai tiếp cận phân tích biên cơ bản đối với một biến có phạm vi hợp lệ  \$min, max\$ :

* **Phân tích biên 2 giá trị (Standard BVA)** : Đối với mỗi biên, chọn giá trị nằm chính xác trên biên và giá trị nằm ngay ngoài biên.  
* Các giá trị chọn kiểm thử:  \$min\$ ,  \$min-1\$ ,  \$max\$ ,  \$max+1\$ .  
* Tổng số ca kiểm thử cho  \$n\$  biến đầu vào độc lập là  \$4n \+ 1\$  (bao gồm 1 ca kiểm thử mang các giá trị trung bình hợp lệ).  
* **Phân tích biên 3 giá trị (Robust BVA)** : Chọn thêm giá trị nằm ngay sát bên trong biên để tăng mức độ rà soát khắt khe.  
* Các giá trị chọn kiểm thử:  \$min-1\$ ,  \$min\$ ,  \$min+1\$ ,  \$max-1\$ ,  \$max\$ ,  \$max+1\$ .  
* Tổng số ca kiểm thử cho  \$n\$  biến là  \$6n \+ 1\$ .

##### 4.4 Bảng Quyết định (Decision Table Testing)

Bảng quyết định là kỹ thuật kiểm thử hộp đen lý tưởng cho các chức năng chứa các quy tắc nghiệp vụ phức tạp, trong đó kết quả đầu ra phụ thuộc vào sự kết hợp của nhiều điều kiện đầu vào khác nhau (Nguyên nhân \- Kết quả / Cause-Effect).  
Cấu trúc Bảng quyết định bao gồm 4 phần chính:

1. **Condition Stubs (Các điều kiện)** : Liệt kê tất cả các điều kiện đầu vào.  
2. **Action Stubs (Các hành động)** : Liệt kê tất cả các kết quả hoặc hành động có thể xảy ra.  
3. **Condition Rules (Các quy tắc điều kiện)** : Các tổ hợp giá trị Đúng/Sai ( \$T/F\$ ) của các điều kiện. Đối với  \$k\$  điều kiện logic nhị phân, bảng hoàn chỉnh sẽ có tối đa  \$2^k\$  quy tắc (cột).  
4. **Action Rules (Các quy tắc hành động)** : Đánh dấu hành động nào tương ứng sẽ được thực thi cho từng cột quy tắc.

Trong thực tế, người kiểm thử có thể tiến hành rút gọn bảng quyết định bằng cách gộp các cột có kết quả hành động giống nhau và chứa các điều kiện "không ảnh hưởng" (Don't care \- dấu \-).

##### 4.5 Kiểm thử Chuyển đổi Trạng thái (State Transition Testing)

Chuyển đổi trạng thái được sử dụng khi hệ thống được mô tả dưới dạng một số lượng hữu hạn các trạng thái, và hành vi của hệ thống thay đổi dựa trên trạng thái hiện tại cùng với sự kiện kích hoạt đầu vào.  
Kỹ thuật này sử dụng hai công cụ chính:

* **Sơ đồ chuyển trạng thái (State Transition Diagram)** : Trực quan hóa các trạng thái, sự kiện (Events), hành động (Actions) và các đường chuyển tiếp hợp lệ.  
* **Bảng chuyển trạng thái (State Transition Table)** : Liệt kê tất cả các trạng thái ở hàng và sự kiện ở cột để phát hiện cả các bước chuyển hợp lệ lẫn các bước chuyển không hợp lệ (Invalid transitions).

##### 4.6 Kiểm thử Dựa trên Use Case và Luồng Công việc (Workflow Testing)

Kiểm thử dựa trên Use Case lấy các kịch bản tương tác người dùng \- hệ thống làm căn cứ thiết kế ca kiểm thử. Ca kiểm thử được xây dựng để kiểm tra từ đầu đến cuối (End-to-End Testing):

* **Main Success Scenario (Luồng chính thành công)** : Kiểm thử đường đi lý tưởng khi mọi điều kiện đều hợp lệ.  
* **Alternate / Extension Paths (Luồng rẽ nhánh / Ngoại lệ)** : Kiểm thử các tình huống xử lý lỗi, người dùng nhập sai, hoặc hủy bỏ giao dịch giữa chừng.

#### 5\. Kỹ thuật Kiểm thử Hộp trắng (White-box Test Design Techniques)

Kiểm thử hộp trắng (White-box Testing / Structural Testing) đòi hỏi kiểm thử viên phải tiếp cận và hiểu rõ cấu trúc mã nguồn bên trong, luồng điều khiển và luồng dữ liệu của chương trình.

##### 5.1 Ưu và Nhược điểm của Kiểm thử Hộp trắng

* **Ưu điểm** :  
* Đảm bảo tất cả các đường thi hành nội bộ và cấu trúc mã nguồn đều được rà soát tỉ mỉ.  
* Giúp tối ưu hóa mã nguồn, loại bỏ mã thừa và phát hiện các lỗi logic ẩn sâu.  
* **Nhược điểm** :  
* Đòi hỏi kiểm thử viên phải có kỹ năng lập trình chuyên sâu.  
* Không thể phát hiện ra các chức năng bị thiếu hoàn toàn so với yêu cầu đặc tả (vì chỉ kiểm tra những gì đã viết trong code).  
* Chi phí và thời gian thực thi rất cao đối với các hệ thống lớn.

##### 5.2 Kiểm thử Đường dẫn Cơ bản (Basis Path Testing) và Đồ thị Luồng Điều khiển

Do Thomas McCabe đề xuất năm 1976, kiểm thử đường dẫn cơ bản là kỹ thuật xác định tập hợp các đường đi độc lập cơ bản (Independent paths) trong mã nguồn sao cho mọi câu lệnh trong chương trình đều được thực thi ít nhất một lần.  
Để áp dụng kỹ thuật này, mã nguồn được chuyển đổi thành  **Đồ thị Luồng Điều khiển (Control Flow Graph \- CFG)**  gồm các thành phần:

* **Node (Nút)** : Đại diện cho một hoặc nhiều câu lệnh xử lý tuần tự.  
* **Edge (Cạnh/Cung)** : Đại diện cho luồng chuyển giao điều khiển giữa các nút.  
* **Predicate Node (Nút điều kiện)** : Nút có từ 2 cạnh đi ra trở lên, đại diện cho câu lệnh điều khiển rẽ nhánh (như if, while, switch).

##### 5.3 Tính toán Độ phức tạp Chu trình McCabe (Cyclomatic Complexity)

Độ phức tạp chu trình  \$V(G)\$  phản ánh số lượng đường đi độc lập tuyến tính tối thiểu cần thiết để bao phủ toàn bộ đồ thị luồng điều khiển.  
Giáo trình giới thiệu 2 phương pháp tính  \$V(G)\$  phổ biến:  
**Phương pháp 1: Dựa trên công thức Cạnh và Nút**   \$\$V(G) \= E \- N \+ 2p\$\$  Trong đó:

* \$E\$ : Số lượng cạnh (Edges) trong đồ thị luồng.  
* \$N\$ : Số lượng nút (Nodes) trong đồ thị luồng.  
* \$p\$ : Số lượng thành phần liên thông của đồ thị (thường  \$p \= 1\$  cho một đoạn chương trình đơn lẻ).

**Phương pháp 2: Dựa trên số lượng Nút Điều kiện (Predicate Nodes)**   \$\$V(G) \= P \+ 1\$\$  Trong đó:

* \$P\$ : Số lượng nút điều kiện (Predicate Nodes) trong đồ thị luồng.

Giá trị  \$V(G)\$  tính ra chính là  **số lượng ca kiểm thử tối thiểu**  cần phải thiết kế để đạt độ bao phủ đường dẫn cơ bản.

##### 5.4 Các Cấp độ Bao phủ Kiểm thử (Test Coverage Levels)

Độ bao phủ kiểm thử (Test Coverage) đo lường tỷ lệ phần trăm các phần tử cấu trúc được thực thi bởi một bộ ca kiểm thử:

1. **Statement Coverage (Phủ câu lệnh \- Cấp 1\)** : Đo lường tỷ lệ các câu lệnh thực thi trong mã nguồn đã được chạy ít nhất một lần.  \$\$\\text{Statement Coverage} \= \\frac{\\text{Số câu lệnh được thực thi}}{\\text{Tổng số câu lệnh}} \\times 100\\%\$\$  
2. **Branch / Decision Coverage (Phủ nhánh / Quyết định \- Cấp 2\)** : Đảm bảo mọi điểm quyết định điều khiển đều được đánh giá ở cả hai nhánh  \$True\$  và  \$False\$  ít nhất một lần.  \$\$\\text{Branch Coverage} \= \\frac{\\text{Số nhánh quyết định được thực thi}}{\\text{Tổng số nhánh quyết định}} \\times 100\\%\$\$  
3. **Condition Coverage (Phủ điều kiện \- Cấp 3\)** : Đảm bảo mỗi điều kiện đơn lẻ (Boolean sub-condition) nằm trong một biểu thức điều kiện phức hợp đều đã nhận cả giá trị  \$True\$  và  \$False\$ .  
4. **Branch & Condition Coverage (Phủ kết hợp Nhánh & Điều kiện \- Cấp 4\)** : Cấp độ bao phủ kết hợp cả việc thực thi tất cả các nhánh quyết định lẫn các giá trị điều kiện con cấu thành.

#### 6\. Quản lý Thực thi Kiểm thử và Bài tập Minh họa Thực hành

Để giúp người học củng cố kiến thức lý thuyết thành năng lực thực hành chuyên môn, phần này hệ thống hóa quy trình quản lý cùng các bài tập mẫu chuẩn hóa.

##### 6.1 Quản lý Ca kiểm thử và Vòng đời Lỗi (Defect Life Cycle)

Hoạt động thực thi kiểm thử gắn liền với việc quản lý các tài liệu kiểm thử (Testware) và theo dõi các khiếm khuyết phát sinh.

* **Quản lý Ca kiểm thử** : Sử dụng công cụ chuyên dụng (như TestLink, Jira) hoặc các bảng tính quản lý để theo dõi số lượng ca kiểm thử, tỷ lệ Pass/Fail, độ bao phủ yêu cầu và ma trận truy xuất nguồn gốc (Traceability Matrix).  
* **Vòng đời Lỗi (Defect Life Cycle)** : Mỗi lỗi khi phát hiện sẽ trải qua các trạng thái: New  \$\\rightarrow\$  Assigned  \$\\rightarrow\$  Open  \$\\rightarrow\$  Fixed  \$\\rightarrow\$  Pending Retest  \$\\rightarrow\$  Retest  \$\\rightarrow\$  Closed (hoặc Reopened nếu kiểm thử lại vẫn thất bại).

##### 6.2 Bài tập Minh họa 1: Phân tích Giá trị Biên (BVA)

**Đề bài** : Một trường nhập liệu tuổi đăng ký tài khoản yêu cầu giá trị số nguyên nằm trong khoảng từ  \$18\$  đến  \$60\$  tuổi (bao gồm cả  \$18\$  và  \$60\$ ). Hãy xác định các tập giá trị kiểm thử theo kỹ thuật BVA 2 giá trị và 3 giá trị.  
**Giải** :

* Miền hợp lệ:  \$18, 60\$ . Miền không hợp lệ dưới:  \$\< 18\$ . Miền không hợp lệ trên:  \$\> 60\$ .  
* **Theo kỹ thuật BVA 2 giá trị (Standard BVA)** :  
* Biên dưới ( \$min \= 18\$ ): Chọn  \$18\$  (hợp lệ) và  \$17\$  (không hợp lệ \-  \$min-1\$ ).  
* Biên trên ( \$max \= 60\$ ): Chọn  \$60\$  (hợp lệ) và  \$61\$  (không hợp lệ \-  \$max+1\$ ).  
* Tập giá trị kiểm thử:  \$\\{17, 18, 60, 61\\}\$ .  
* **Theo kỹ thuật BVA 3 giá trị (Robust BVA)** :  
* Biên dưới: Chọn  \$17\$  ( \$min-1\$ ),  \$18\$  ( \$min\$ ),  \$19\$  ( \$min+1\$ ).  
* Biên trên: Chọn  \$59\$  ( \$max-1\$ ),  \$60\$  ( \$max\$ ),  \$61\$  ( \$max+1\$ ).  
* Tập giá trị kiểm thử:  \$\\{17, 18, 19, 59, 60, 61\\}\$ .

##### 6.3 Bài tập Minh họa 2: Kiểm thử Hộp trắng & Cyclomatic Complexity

**Đề bài** : Cho đoạn mã giả sau:  
1\. Read A  
2\. IF A \> 0 THEN  
3\.   IF A \== 21 THEN  
4\.     Print "Key"  
5\.   ENDIF  
6\. ENDIF  
7\. End

**Giải** :

* **Vẽ Đồ thị Luồng Điều khiển (CFG)** :  
* Nút 1: Read A  
* Nút 2 (Predicate Node): Đánh giá A \> 0\. Nếu  \$True \\rightarrow\$  Nút 3; nếu  \$False \\rightarrow\$  Nút 7\.  
* Nút 3 (Predicate Node): Đánh giá A \== 21\. Nếu  \$True \\rightarrow\$  Nút 4; nếu  \$False \\rightarrow\$  Nút 7\.  
* Nút 4: Print "Key"  \$\\rightarrow\$  Nút 7\.  
* Nút 7: End.  
* **Tính Độ phức tạp Chu trình**  **\$V(G)**\$ :  
* Số lượng Cạnh  \$E \= 6\$ .  
* Số lượng Nút  \$N \= 5\$ .  
* Công thức 1:  \$V(G) \= E \- N \+ 2p \= 6 \- 5 \+ 2(1) \= 3\$ .  
* Công thức 2: Số Predicate Nodes  \$P \= 2\$  (tại nút 2 và nút 3). Do đó  \$V(G) \= P \+ 1 \= 2 \+ 1 \= 3\$ .  
* **Xác định 3 Đường đi Độc lập Cơ bản (Independent Paths)** :  
* Đường đi 1:  \$1 \\rightarrow 2 \\rightarrow 7\$  (Điều kiện  \$A \\le 0\$ ).  
* Đường đi 2:  \$1 \\rightarrow 2 \\rightarrow 3 \\rightarrow 7\$  (Điều kiện  \$A \> 0\$  và  \$A \\ne 21\$ ).  
* Đường đi 3:  \$1 \\rightarrow 2 \\rightarrow 3 \\rightarrow 4 \\rightarrow 7\$  (Điều kiện  \$A \= 21\$ ).  
* **Thiết kế Giá trị Đầu vào cho Test Case** :  
* Test Case 1 (Đường đi 1): Input  \$A \= \-5\$   \$\\rightarrow\$  Kết thúc chương trình.  
* Test Case 2 (Đường đi 2): Input  \$A \= 10\$   \$\\rightarrow\$  Kết thúc chương trình.  
* Test Case 3 (Đường đi 3): Input  \$A \= 21\$   \$\\rightarrow\$  In ra "Key".

