# Axioledger — Contribution Groups & Value Distribution

> **Nguồn chính thức:** [`core.md`](../../core.md)  
> **Phiên bản:** v1.0 · Cập nhật: 2025  
> **Phạm vi:** 6 Nhóm Vai Trò Đóng Góp · Cơ Chế Phần Thưởng · Phân Bổ Giá Trị

---

## Tổng Quan Các Nhóm Vai Trò

| Nhóm | Tên | Token Thưởng Chính |
|---|---|---|
| **Nhóm I** | Nhà phát triển & Kỹ sư (Developers) | `$AXQ` · `$VRQ` · `$KPX` · `$SQX` |
| **Nhóm II** | Vận hành hạ tầng (Node Operators) | `$VPX` · `$AXQ` · `$VRQ` · `$SQX` |
| **Nhóm III** | Doanh nghiệp & Tổ chức (Enterprise) | `$AXQ` · `$VRQ` · `$SQX` |
| **Nhóm IV** | Nhà cung cấp thanh khoản & Nhà đầu tư (LPs & Investors) | `$KPX` · `$veKPX` · `$AXQ` |
| **Nhóm V** | Cộng đồng, Thường dân & Thượng viện | `$AXQ` · `$VRQ` |
| **Nhóm VI** | Người dùng cuối & Sản phẩm thực tế (End-Users) | `$AXQ` · `$SQX` · `$KPX` · `$VPX` |

---

## Nhóm I — Nhà Phát Triển & Kỹ Sư Phần Mềm (Developers)

### 1. SDK & Thư Viện Mã Nguồn Mở

- **Mô tả:** Lập trình viên xây dựng và xuất bản các thư viện như `@axioledger/ans-sdk` hoặc SDK hỗ trợ các ngôn ngữ (Python, Rust, Go).
- **Giá trị:** Giúp các nhà phát triển khác dễ dàng tích hợp dịch vụ Axioledger vào ứng dụng commercial.
- **Phần thưởng:** Cổ tức bản quyền (Royalty Fees 0.1–0.5%) và Grants từ Treasury DAO (`$AXQ`).

### 2. Đóng Góp ZK-Circuit Bảo Mật

- **Mô tả:** Kỹ sư mật mã thiết kế và tối ưu hóa các mạch Halo2/PlonKy2 cho bài toán xác thực dữ liệu.
- **Giá trị:** Tăng tốc độ sinh bằng chứng ZK, giảm thời gian xử lý xuống dưới 100ms trên điện thoại.
- **Phần thưởng:** Token `$VRQ` trích từ Quỹ R&D Bảo mật.

### 3. Phát Triển dApp Tài Chính (DeFi Protocol)

- **Mô tả:** Xây dựng các sàn DEX, nền tảng Lending hoặc Vaults tự động tái cân bằng trên Kinetoprotocol.
- **Giá trị:** Tạo thanh khoản, gia tăng khối lượng giao dịch (Trading Volume) cho hệ sinh thái.
- **Phần thưởng:** Phí giao dịch từ người dùng và phần thưởng Liquidity Mining bằng `$KPX`.

### 4. Xây Dựng Trò Chơi Web3 (GameFi Native)

- **Mô tả:** Lập trình trò chơi tích hợp cơ chế AxioPasskey và giao dịch không tốn gas (Paymaster).
- **Giá trị:** Thu hút người dùng phổ thông (Retail Users), tạo nhu cầu sử dụng mạng lưới `$SQX` liên tục.
- **Phần thưởng:** Doanh thu bán vật phẩm NFT, phí gas được trợ cấp và `$SQX`.

### 5. Viết Plugin & Script Tự Động Hóa

- **Mô tả:** Tạo các tập lệnh Tampermonkey/Puppeteer hoặc Bot giao dịch chênh lệch giá (Arbitrage Bots).
- **Giá trị:** Tăng hiệu quả thanh khoản giữa các Bể AMM và tạo lưu lượng giao dịch thực tế trên chuỗi.
- **Phần thưởng:** Lợi nhuận chênh lệch giá và token `$KPX`.

### 6. Xây Dựng Công Cụ Lập Chỉ Mục Dữ Liệu (Custom Indexers)

- **Mô tả:** Triển khai các nút Subgraph / GraphQL để truy xuất dữ liệu On-chain theo thời gian thực.
- **Giá trị:** Cung cấp hạ tầng dữ liệu mượt mà cho các ứng dụng Frontend và Dashboards.
- **Phần thưởng:** Phí truy xuất dữ liệu (Query Fees) trả bằng `$AXQ`.

---

## Nhóm II — Vận Hành Hạ Tầng (Node Operators)

### 1. Vận Hành Nút Xác Thực Chạy Mượt (Uptime 99.9%)

- **Mô tả:** Vận hành máy chủ đạt chuẩn (4 Cores / 8GB RAM) xác nhận trạng thái Stateless.
- **Giá trị:** Duy trì sự ổn định, tính toàn vẹn và phi tập trung cho toàn bộ mạng lưới L1.
- **Phần thưởng:** Phần thưởng đúc khối (Block Rewards) và phí mạng lưới trả bằng `$VPX` / `$AXQ`.

### 2. Cung Cấp Dàn Máy GPU/FPGA Tính Toán ZK-Proof

- **Mô tả:** Cho thuê phần cứng GPU hiệu năng cao để giải các bài toán mật mã phân tán.
- **Giá trị:** Giúp các Sequencer tạo ZK-Proof cực nhanh để chốt trạng thái L2 xuống L1.
- **Phần thưởng:** Phí tạo bằng chứng (Proving Fees) tính bằng `$VRQ`.

### 3. Vận Hành L2 Sequencer Sắp Xếp Giao Dịch

- **Mô tả:** Khóa token `$SQX` để tham gia Pool sắp xếp giao dịch với công nghệ Zero-Copy AF_XDP.
- **Giá trị:** Đảm bảo tốc độ xử lý hàng trăm nghìn TPS với độ trễ vi giây cho người dùng.
- **Phần thưởng:** Phí gas thực thi L2 và doanh thu MEV hợp lệ bằng `$SQX`.

### 4. Duy Trì Nút Lưu Trữ Dữ Liệu Khả Dụng (DA Nodes)

- **Mô tả:** Cung cấp dung lượng lưu trữ Blob Data cho các giao dịch tạm thời.
- **Giá trị:** Giải phóng dung lượng cho sổ cái chính, giữ cho chi phí lưu trữ luôn siêu rẻ.
- **Phần thưởng:** Phí thuê dung lượng Data Availability bằng `$AXQ`.

---

## Nhóm III — Doanh Nghiệp & Tổ Chức (Enterprise & Biz)

### 1. Cấp Phép Danh Tính ZK-KYC Cho Khách Hàng

- **Mô tả:** Doanh nghiệp tích hợp giải pháp ZK-DID để xác thực người dùng không cần lưu giữ thông tin nhạy cảm.
- **Giá trị:** Bảo vệ quyền riêng tư người dùng và tuân thủ các quy định pháp lý quốc tế.
- **Phần thưởng:** Phí hoa hồng xác thực danh tính trả bằng `$VRQ`.

### 2. Mã Hóa Tài Sản Thế Giới Thực (RWA Tokenization)

- **Mô tả:** Đưa bất động sản, trái phiếu hoặc vàng thế chấp lên chuỗi thông qua hợp đồng thông minh.
- **Giá trị:** Bổ sung nguồn tài sản thực có giá trị bền vững làm bảo chứng cho Kho bạc Reserve.
- **Phần thưởng:** Phí quản lý tài sản và dòng tiền cổ tức bằng `$AXQ`.

### 3. Thương Mại Hóa Tên Miền Con (Sub-domains)

- **Mô tả:** Đăng ký tên miền gốc `.axq` (ví dụ: `tech.axq`) và bán các sub-domain (`alice.tech.axq`).
- **Giá trị:** Mở rộng hệ sinh thái định danh Web3 và tăng tính nhận diện thương hiệu.
- **Phần thưởng:** Phí đăng ký và gia hạn tên miền định kỳ bằng `$AXQ`.

### 4. Tài Trợ Phí Giao Dịch Cho Người Dùng (Paymaster Hosting)

- **Mô tả:** Doanh nghiệp nạp tiền vào quỹ Paymaster để trả phí gas thay cho khách hàng của mình.
- **Giá trị:** Loại bỏ rào cản UX, giúp người dùng Web2 truy cập app không cần mua sẵn token gas.
- **Phần thưởng:** Tăng tỷ lệ chuyển đổi khách hàng và nhận thưởng cashback từ Quỹ Tăng trưởng `$SQX`.

### 5. Mở Phân Vùng Doanh Nghiệp Riêng (Private Subnet)

- **Mô tả:** Thuê hạ tầng L2 phân vùng riêng để xử lý dữ liệu nội bộ doanh nghiệp.
- **Giá trị:** Mở rộng quy mô doanh nghiệp trên nền tảng bảo mật của Axioledger.
- **Phần thưởng:** Doanh thu vận hành chuỗi con và chiết khấu phí bảo chứng `$AXQ`.

---

## Nhóm IV — Nhà Cung Cấp Thanh Khoản & Nhà Đầu Tư (LPs & Investors)

### 1. Cung Cấp Thanh Khoản Tập Trung (Concentrated Liquidity)

- **Mô tả:** Nạp tiền vào các Bể AMM Kinetoprotocol theo các khoảng giá tối ưu.
- **Giá trị:** Tăng độ sâu thị trường, giúp người dùng giao dịch giảm thiểu trượt giá (Slippage).
- **Phần thưởng:** Trích chia phí giao dịch sàn và phần thưởng `$KPX`.

### 2. Khóa Token `$KPX` Nhận `$veKPX`

- **Mô tả:** Tự nguyện khóa token `$KPX` trong thời gian từ 1 đến 4 năm.
- **Giá trị:** Giảm áp lực cung lưu thông trên thị trường, cam kết đồng hành lâu dài.
- **Phần thưởng:** Cổ tức phí giao dịch toàn sàn và quyền phân bổ phí hối lộ (Bribes) `$veKPX`.

### 3. Tham Gia Bầu Chọn Bể Thanh Khoản (Gauge Voting)

- **Mô tả:** Sử dụng quyền biểu quyết `$veKPX` để dẫn dòng phát hành token về các cặp giao dịch mong muốn.
- **Giá trị:** Định hướng dòng vốn đến những dự án tiềm năng nhất trong hệ sinh thái.
- **Phần thưởng:** Phần thưởng Bribes trực tiếp từ các dự án trả bằng `$AXQ` / `$KPX`.

### 4. Cung Cấp Tài Sản Thế Chấp Cho Thị Trường Cho Vay

- **Mô tả:** Gửi các tài sản an toàn (USDC, `$AXQ`) vào các Vault Lending.
- **Giá trị:** Tạo nguồn vốn vay cho các Trader và dự án cần đòn bẩy tài chính.
- **Phần thưởng:** Lãi suất tiền gửi linh hoạt tính bằng `$AXQ`.

---

## Nhóm V — Cộng Đồng, Thường Dân & Thượng Viện (Community & Governance)

| Đóng Góp | Phần Thưởng |
|---|---|
| **Phát hiện Lỗ hổng Bảo mật (Bug Bounty)** | Tìm ra lỗ hổng để nhận thưởng từ Quỹ An ninh (`$AXQ` / `$VRQ`) |
| **Biểu quyết Quản trị Chủ động (Active Voting)** | Bỏ phiếu đề xuất để nhận Airdrop quản trị `$AXQ` |
| **Làm Bồi thẩm đoàn Giải quyết Tranh chấp (ZK-Jury)** | Phân xử khiếu nại để nhận phí tòa án bằng `$AXQ` |
| **Đánh giá & Kiểm duyệt Nội dung ZK-DID (Identity Verifier)** | Kiểm tra tính hợp lệ danh tính để nhận phí theo lượt bằng `$VRQ` |
| **Sáng tạo Nội dung Truyền thông & Giáo dục** | Viết bài / video hướng dẫn để nhận Grants từ Quỹ Cộng đồng `$AXQ` |

---

## Nhóm VI — Người Dùng Cuối & Sản Phẩm Thực Tế (End-Users)

| Đóng Góp | Phần Thưởng |
|---|---|
| **Điểm danh & Tương tác Hàng ngày (Proof-of-Activity)** | Airdrop và điểm loyalty đổi ra `$SQX` |
| **Giới thiệu Người dùng Mới qua AxioPasskey** | Hoa hồng phí giao dịch bằng `$SQX` |
| **Tạo & Mua Bán NFT Định danh** | Phí tác quyền (Royalties) bằng `$KPX` |
| **Tham gia Kiểm thử Mạng lưới (Public Testnet Stress-Test)** | Incentive Airdrop bằng `$AXQ` |
| **Báo cáo & Đánh giá Chất lượng dApp (Feedback)** | Token thưởng từ Feedback Campaign bằng `$AXQ` |
| **Khai thác Quảng cáo Riêng tư (Zero-Knowledge Ads)** | Chiết khấu tiền xem quảng cáo trả thẳng vào ví bằng `$SQX` |
| **Đánh giá Uy tín Nút Xác thực (Delegated Staking)** | Lãi suất staking thụ động bằng `$VPX` |
| **Mua sắm & Thanh toán Hàng hóa Thực tế (Web3 Commerce)** | Cashback bằng `$KPX` / `$SQX` |

---

## Ma Trận Nhóm Vai Trò × Token Thưởng

```
                 $AXQ  $VPX  $SQX  $KPX  $VRQ  $veKPX
                 ────  ────  ────  ────  ────  ──────
Nhóm I (Dev)     ✓           ✓     ✓     ✓
Nhóm II (Nodes)  ✓     ✓     ✓           ✓
Nhóm III (Biz)   ✓           ✓           ✓
Nhóm IV (LPs)    ✓                 ✓           ✓
Nhóm V (Gov)     ✓                       ✓
Nhóm VI (Users)  ✓     ✓     ✓     ✓
```

---

## Liên Kết Tài Liệu Liên Quan

| Tài liệu | Đường dẫn |
|---|---|
| Genesis Phasing & Quy Trình | [`docs/AXIOLEDGER_ROADMAP.md#14`](../AXIOLEDGER_ROADMAP.md) |
| Tokenomics & Escrow Specs | [`docs/logic/GENESIS_ALLOCATION.md`](GENESIS_ALLOCATION.md) |
| ZK-Jury Slashing Matrix | [`docs/logic/GENESIS_ALLOCATION.md#2`](GENESIS_ALLOCATION.md) |
| Cosmos Integration | [`docs/logic/COSMOS_INTEGRATION.md`](COSMOS_INTEGRATION.md) |
| Governance — Axio-Tribunal | [`docs/AXIOLEDGER_ROADMAP.md#11`](../AXIOLEDGER_ROADMAP.md) |

---

*Axioledger Contribution Groups v1.0 · Copyright © 2026 Axioledger Foundation*
