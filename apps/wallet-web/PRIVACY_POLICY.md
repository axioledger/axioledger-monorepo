# CHÍNH SÁCH BẢO MẬT (PRIVACY POLICY)

> **Axioledger Foundation**  
> **Phiên bản:** 1.0 — Draft (Pending Legal Review)  
> **Ngày hiệu lực:** [Ngày được Ban Pháp lý phê duyệt]  
> **Phạm vi áp dụng:** AxioPass Wallet · Exchange Web · DAO Dashboard · Pay Gateway · Craft Portal · Docs Site  
> **⚠️ TRẠNG THÁI:** TÀI LIỆU NÀY ĐANG Ở TRẠNG THÁI DRAFT — CHƯA ĐƯỢC PUBLISH. Cần review bởi Luật sư chuyên ngành trước khi đưa lên production.

---

## 1. GIỚI THIỆU VÀ CAM KẾT

Axioledger Foundation ("Chúng tôi", "Tổ chức") cam kết bảo vệ quyền riêng tư của người dùng ("Bạn", "Người dùng") khi sử dụng hệ sinh thái Axioledger, bao gồm AxioPass Wallet, các ứng dụng DeFi, và các dịch vụ liên quan.

Chính sách này được soạn thảo tuân thủ:
- **GDPR** (EU General Data Protection Regulation 2016/679)
- **FATF Travel Rule** (Khuyến nghị FATF số 16)
- **MiCA** (EU Markets in Crypto-Assets Regulation 2023/1114)
- Quy định bảo vệ dữ liệu cá nhân tại các quốc gia chúng tôi hoạt động

---

## 2. DỮ LIỆU CHÚNG TÔI THU THẬP

### 2.1 Dữ liệu bạn cung cấp trực tiếp

| Loại dữ liệu | Mục đích | Cơ sở pháp lý |
|---|---|---|
| Địa chỉ email / số điện thoại | Xác thực tài khoản | Thực hiện hợp đồng |
| Tên đầy đủ, ngày sinh | eKYC / AML compliance | Nghĩa vụ pháp lý |
| Ảnh CMND / Hộ chiếu / CCCD | Xác minh danh tính (KYC Level 2+) | Nghĩa vụ pháp lý |
| Ảnh chân dung (Liveness Check) | Chống mạo danh trong KYC | Nghĩa vụ pháp lý |
| Thông tin ngân hàng | Kết nối tài khoản fiat | Thực hiện hợp đồng |
| Thông tin thuế (FATCA/CRS) | Báo cáo thuế bắt buộc | Nghĩa vụ pháp lý |

### 2.2 Dữ liệu sinh trắc học (Biometric Data — GDPR Art. 9)

Khi bạn sử dụng tính năng **WebAuthn Passkey / Face ID / Touch ID** để đăng nhập AxioPass Wallet:

- **Dữ liệu sinh trắc học KHÔNG được lưu trữ trên máy chủ của chúng tôi.**
- Quá trình xác thực diễn ra hoàn toàn trong **Secure Enclave** của thiết bị bạn.
- Chúng tôi chỉ lưu trữ: Credential ID (chuỗi định danh không thể đảo ngược) và Public Key tương ứng.
- Bạn có quyền xóa Passkey bất kỳ lúc nào trong phần **Cài đặt > Bảo mật > Quản lý Passkey**.

> **Yêu cầu đồng ý:** Việc đăng ký Passkey là **tự nguyện hoàn toàn**. Bạn luôn có thể chọn xác thực bằng mật khẩu truyền thống + 2FA thay thế.

### 2.3 Dữ liệu giao dịch blockchain

Các giao dịch trên blockchain là **công khai theo bản chất của công nghệ**. Địa chỉ ví, số tiền và timestamp giao dịch được ghi lại vĩnh viễn trên chuỗi khối và nằm ngoài khả năng xóa của chúng tôi.

Chúng tôi lưu trữ thêm (off-chain) để cung cấp dịch vụ:
- Lịch sử giao dịch và trạng thái giao dịch
- Số dư token (cached từ on-chain)
- Thông tin ANS domain (.axq) bạn đã đăng ký

### 2.4 Dữ liệu tự động thu thập

- **Dữ liệu thiết bị:** Loại thiết bị, hệ điều hành, phiên bản ứng dụng
- **Dữ liệu mạng:** Địa chỉ IP (được ẩn danh hóa sau 30 ngày), quốc gia/khu vực
- **Nhật ký lỗi:** Crash reports (không chứa dữ liệu cá nhân)

---

## 3. MỤC ĐÍCH VÀ CƠ SỞ PHÁP LÝ XỬ LÝ DỮ LIỆU

| Mục đích | Cơ sở pháp lý (GDPR Art. 6) |
|---|---|
| Cung cấp dịch vụ ví và giao dịch | **6(1)(b)** — Thực hiện hợp đồng |
| Xác minh danh tính (KYC/AML) | **6(1)(c)** — Nghĩa vụ pháp lý |
| Ngăn chặn gian lận và rửa tiền | **6(1)(c) + (f)** — Nghĩa vụ pháp lý + Lợi ích hợp pháp |
| Cải thiện sản phẩm và UX | **6(1)(a)** — Đồng ý (có thể rút lại) |
| Gửi thông báo sản phẩm | **6(1)(a)** — Đồng ý (có thể rút lại) |
| Tuân thủ FATF Travel Rule | **6(1)(c)** — Nghĩa vụ pháp lý |

---

## 4. CHIA SẺ DỮ LIỆU

Chúng tôi **KHÔNG bán** dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào.

Chúng tôi có thể chia sẻ dữ liệu trong các trường hợp sau:

- **Nhà cung cấp dịch vụ KYC/AML:** Được ủy quyền xử lý dữ liệu theo hợp đồng DPA (Data Processing Agreement) nghiêm ngặt.
- **Cơ quan nhà nước và pháp lý:** Khi có yêu cầu hợp lệ theo pháp luật (lệnh tòa án, yêu cầu điều tra AML/CTF).
- **Đối tác kỹ thuật hạ tầng:** AWS, Cloudflare (dữ liệu được mã hóa end-to-end).
- **FATF Travel Rule:** Thông tin người gửi/nhận cho các giao dịch vượt ngưỡng theo quy định.

---

## 5. LƯU TRỮ VÀ BẢO MẬT DỮ LIỆU

### 5.1 Thời gian lưu trữ

| Loại dữ liệu | Thời gian lưu trữ |
|---|---|
| Dữ liệu KYC / AML | 5 năm sau khi kết thúc quan hệ khách hàng (yêu cầu FATF) |
| Lịch sử giao dịch | 5 năm (yêu cầu thuế tại nhiều jurisdiction) |
| Nhật ký hệ thống (Audit Logs) | 2 năm |
| Dữ liệu email marketing | Đến khi bạn hủy đăng ký |
| Dữ liệu phân tích ẩn danh | Tối đa 24 tháng |

### 5.2 Biện pháp bảo mật

- **Mã hóa lưu trữ (Data at Rest):** AES-256 cho tất cả dữ liệu nhạy cảm
- **Mã hóa truyền tải (Data in Transit):** TLS 1.3 bắt buộc
- **Quản lý khóa:** HashiCorp Vault HSM-backed KMS (xem `@axioledger/kms`)
- **Kiểm soát truy cập:** Zero-trust architecture, Principle of Least Privilege
- **Kiểm toán:** Audit logs được lưu trữ và giám sát liên tục

---

## 6. QUYỀN CỦA BẠN (GDPR Chapter III)

Bạn có các quyền sau đối với dữ liệu cá nhân của mình:

| Quyền | Mô tả | Cách thực hiện |
|---|---|---|
| **Quyền truy cập** | Nhận bản sao dữ liệu chúng tôi lưu trữ về bạn | privacy@axioledger.org |
| **Quyền chỉnh sửa** | Yêu cầu sửa dữ liệu không chính xác | Trong ứng dụng hoặc email |
| **Quyền xóa** | Yêu cầu xóa dữ liệu (trừ khi có nghĩa vụ pháp lý lưu giữ) | privacy@axioledger.org |
| **Quyền hạn chế** | Hạn chế xử lý trong khi tranh chấp | privacy@axioledger.org |
| **Quyền di chuyển dữ liệu** | Nhận dữ liệu dạng máy đọc được (JSON/CSV) | privacy@axioledger.org |
| **Quyền phản đối** | Phản đối xử lý dựa trên lợi ích hợp pháp | privacy@axioledger.org |
| **Rút lại đồng ý** | Rút lại đồng ý bất kỳ lúc nào | Trong ứng dụng > Cài đặt > Quyền riêng tư |

**Thời gian phản hồi:** Trong vòng 30 ngày theo GDPR.

---

## 7. COOKIES VÀ CÔNG NGHỆ THEO DÕI

Ứng dụng web Axioledger sử dụng:

- **Cookie kỹ thuật bắt buộc:** Phiên đăng nhập, CSRF protection — KHÔNG cần đồng ý
- **Cookie phân tích (tùy chọn):** Đo lường hiệu năng ứng dụng — Cần đồng ý
- **KHÔNG sử dụng:** Cookie quảng cáo, cookie theo dõi bên thứ ba

Bạn có thể quản lý tùy chọn cookie tại: Cài đặt > Quyền riêng tư > Quản lý Cookie.

---

## 8. LIÊN HỆ

**Axioledger Foundation — Bộ phận Bảo vệ Dữ liệu**  
Email: privacy@axioledger.org  
Địa chỉ: [Địa chỉ pháp lý đăng ký — điền khi thành lập tổ chức]

**Data Protection Officer (DPO):**  
dpo@axioledger.org

Nếu bạn không hài lòng với cách chúng tôi xử lý khiếu nại, bạn có quyền gửi khiếu nại lên cơ quan bảo vệ dữ liệu tại quốc gia cư trú của bạn.

---

*Chính sách này có thể được cập nhật. Chúng tôi sẽ thông báo qua email hoặc thông báo trong ứng dụng ít nhất 30 ngày trước khi thay đổi có hiệu lực.*

*© 2026 Axioledger Foundation — Phiên bản 1.0 Draft*
