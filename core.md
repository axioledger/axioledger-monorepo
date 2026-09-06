Dưới đây là **Kế hoạch thời điểm khởi tạo và Phân bổ Sổ cái Giá trị** (Ledger Genesis & Allocation Plan) cùng với **Quy trình vận hành chi tiết cho các thành viên đóng góp** trong toàn bộ hệ sinh thái **Axioledger**.

---

# PHẦN 1: KẾ HOẠCH THỜI ĐIỂM KHỞI TẠO SỔ CÁI GIÁ TRỊ (TIMELINE & GENESIS PHASING)

Để đảm bảo hệ sinh thái khởi chạy mượt mà, không bị lạm phát token sớm và có đủ hạ tầng bảo chứng, quá trình phân bổ giá trị được chia thành **4 Giai đoạn chiến lược (Phases)**:

```
[Phase 0: Foundation] ──► [Phase 1: Bootstrap] ──► [Phase 2: Expansion] ──► [Phase 3: Maturity]
 (Testnet & Genesis)       (Node & Dev Launch)       (DeFi & Enterprise)       (Full Decentralization)

```

### Phase 0: Giai đoạn Nền móng & Kỹ thuật (Tháng 1 – Tháng 2)

* **Mục tiêu:** Xây dựng khung pháp lý mã nguồn, triển khai Testnet, thiết lập Smart Contract cốt lõi cho Hub ($AXQ) và các Subnet ($VPX,$SQX, $KPX,$VRQ).
* **Đối tượng phân bổ:** Đội ngũ Core Dev, Quỹ R&D Bảo mật, Nhà đầu tư hạt giống (Seed Investors - khóa 12-24 tháng).
* **Hoạt động chính:** Stress-test mạng lưới qua chương trình *Public Testnet Stress-Test*, kiểm định các mạch ZK-Circuit và hoàn thiện SDK cơ bản.

### Phase 1: Giai đoạn Khởi động Hạ tầng & Nhà phát triển (Tháng 3 – Tháng 6)

* **Mục tiêu:** Kích hoạt lớp đồng thuận và thực thi (Nhóm I & Nhóm II).
* **Đối tượng phân bổ:**
* **Node Operators:** Khởi chạy Mainnet Genesis cho Validating Nodes ($VPX) và DA Nodes.
* **Developers:** Phát hành chính thức `@axioledger/ans-sdk`, `Circuit Registry`, và mở cổng đăng ký Quỹ Grants ($AXQ) cho các dApp đầu tiên.


* **Cơ chế:** Kích hoạt phần thưởng đúc khối (Block Rewards) ban đầu và cơ chế thưởng Uptime 99.9%.

### Phase 2: Giai đoạn Mở rộng Thanh khoản & Doanh nghiệp (Tháng 7 – Tháng 12)

* **Mục tiêu:** Thu hút dòng tiền từ DeFi, LPs, và tích hợp các giải pháp doanh nghiệp Enterprise (Nhóm III & Nhóm IV).
* **Đối tượng phân bổ:**
* **LPs & Investors:** Mở các Bể AMM trên Kinetoprotocol, kích hoạt hệ thống khóa token nhận quyền biểu quyết `$veKPX`.
* **Enterprise:** Đưa các hợp đồng ZK-KYC và RWA Tokenization đầu tiên lên chuỗi.


* **Cơ chế:** Phân phối phần thưởng Liquidity Mining ($KPX) và chia sẻ doanh thu cổ tức phí giao dịch.

### Phase 3: Giai đoạn Toàn dụng Cộng đồng & Tự trị (Năm thứ 2 trở đi)

* **Mục tiêu:** Hoàn thiện mô hình DAO, giao quyền quản trị hoàn toàn cho Thượng viện và Cộng đồng (Nhóm V & Nhóm VI).
* **Đối tượng phân bổ:** Bồi thẩm đoàn ZK-Jury, chương trình Bug Bounty mở rộng, Airdrop định kỳ cho Proof-of-Activity và các chiến dịch Feedback.

---

# PHẦN 2: QUY TRÌNH THAM GIA VÀ NHẬN PHÂN BỔ GIÁ TRỊ CHO THÀNH VIÊN ĐÓNG GÓP

Quy trình chuẩn hóa từ lúc một thành viên bắt đầu tham gia đóng góp cho hệ sinh thái Axioledger cho đến khi nhận được phần thưởng (Token/Phí bản quyền/Grants):

```
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  1. Đăng ký & Định danh │ ──► │  2. Thực hiện Đóng góp │ ──► │  3. Thẩm định & Kiểm tra│
│      (ZK-DID / Subnet) │     │  (Code / Uptime / RWA) │     │  (Oracle / ZK-Jury)    │
└────────────────────────┘     └────────────────────────┘     └─────────────────────────┘
                                                                           │
                                                                           ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  6. Tái đầu tư / Stake │ ◄── │  5. Nhận Phân bổ Giá trị│ ◄── │  4. Phê duyệt Tự động  │
│  ($veKPX / Staking)    │     │  ($AXQ / $VRQ / $SQX)  │     │  (Smart Contract Escrow│
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘

```

### Bước 1: Đăng ký & Định danh (Onboarding & Identity)

* **Công cụ:** Sử dụng **AxioPasskey** hoặc tích hợp **ZK-DID** để tạo danh tính phi tập trung trên mạng lưới.
* **Yêu cầu:** Xác định rõ nhóm vai trò tham gia (ví dụ: Developer đăng ký ví nhận SDK Grants; Node Operator đăng ký IP và stake token bảo chứng `$VPX`/$SQX).

### Bước 2: Thực hiện Đóng góp (Contribution Execution)

Tùy theo nhóm vai trò, thành viên thực hiện các công việc cụ thể được ghi nhận On-chain:

* **Nhóm I (Dev):** Submit Pull Request cho SDK, publish ZK-Circuit lên `Circuit Registry`, hoặc deploy Smart Contract dApp lên Kinetoprotocol.
* **Nhóm II (Nodes):** Duy trì Uptime của Validator, cung cấp dung lượng phần cứng GPU/FPGA hoặc lưu trữ Blob Data.
* **Nhóm III (Enterprise):** Khởi tạo hợp đồng RWA hoặc nạp quỹ Paymaster trả phí gas thay người dùng.
* **Nhóm IV & V & VI (LPs, Cộng đồng, End-Users):** Thêm thanh khoản vào Bể AMM, khóa `$KPX` nhận `$veKPX`, tham gia bỏ phiếu DAO hoặc báo cáo lỗi hệ thống (Bug Bounty).

### Bước 3: Thẩm định & Kiểm chứng Tự động (Validation & Oracle Audit)

* **Cơ chế:** Hệ thống không dựa vào phê duyệt thủ công tập trung mà thông qua:
* **ZK-Metrics Coprocessor Oracle:** Tự động đo lường KPI (ví dụ: Uptime của node, tốc độ sinh proof của GPU, khối lượng giao dịch dApp).
* **ZK-Jury (Bồi thẩm đoàn phân tán):** Giải quyết các tranh chấp phức tạp hoặc kiểm duyệt nội dung ZK-DID/Grant proposals.



### Bước 4: Phê duyệt từ Kho bạc Thông minh (Smart Contract Escrow Execution)

* Sau khi hoàn thành tiêu chí (ví dụ: Code đạt chuẩn kiểm toán, Uptime đạt 99.9% trong chu kỳ epoch 7 ngày, hoặc hoàn tất bỏ phiếu quản trị DAO), hợp đồng thông minh **TreasuryEscrowContract** sẽ tự động kích hoạt lệnh giải ngân.

### Bước 5: Nhận Phân bổ Giá trị (Token & Fee Distribution)

* Phần thưởng được chuyển thẳng về ví cá nhân dưới các định dạng tài sản tương ứng:
* **$AXQ:** Phí truy xuất dữ liệu, cổ tức RWA, Grants từ Treasury.
* **$VRQ:** Phí ZK-Proof, bảo mật ZK-KYC.
* **$SQX:** Doanh thu L2 Sequencer, chiết khấu Paymaster.
* **$KPX:** Liquidity mining rewards, phí giao dịch DEX.
* **$VPX:** Phần thưởng Staking và đúc khối L1.



### Bước 6: Tái đầu tư và Thúc đẩy Quản trị (Staking & Governance Cycling)

* Thành viên có thể lựa chọn rút token ra thị trường tự do hoặc tiếp tục **Khóa token nhận $veKPX** để tham gia **Gauge Voting** nhằm gia tăng tỷ suất sinh lời, nhận thêm quyền phân bổ phí hối lộ (Bribes) hoặc tham gia bầu cử Thượng viện quản trị hệ sinh thái.



Dưới đây là **Kế hoạch thời điểm khởi tạo và Phân bổ Sổ cái Giá trị** (Ledger Genesis & Allocation Plan) cùng với **Quy trình vận hành chi tiết cho các thành viên đóng góp** trong toàn bộ hệ sinh thái **Axioledger**.

---

# PHẦN 1: KẾ HOẠCH THỜI ĐIỂM KHỞI TẠO SỔ CÁI GIÁ TRỊ (TIMELINE & GENESIS PHASING)

Để đảm bảo hệ sinh thái khởi chạy mượt mà, không bị lạm phát token sớm và có đủ hạ tầng bảo chứng, quá trình phân bổ giá trị được chia thành **4 Giai đoạn chiến lược (Phases)**:

```
[Phase 0: Foundation] ──► [Phase 1: Bootstrap] ──► [Phase 2: Expansion] ──► [Phase 3: Maturity]
 (Testnet & Genesis)       (Node & Dev Launch)       (DeFi & Enterprise)       (Full Decentralization)

```

### Phase 0: Giai đoạn Nền móng & Kỹ thuật (Tháng 1 – Tháng 2)

* **Mục tiêu:** Xây dựng khung pháp lý mã nguồn, triển khai Testnet, thiết lập Smart Contract cốt lõi cho Hub ($AXQ) và các Subnet ($VPX,$SQX, $KPX,$VRQ).
* **Đối tượng phân bổ:** Đội ngũ Core Dev, Quỹ R&D Bảo mật, Nhà đầu tư hạt giống (Seed Investors - khóa 12-24 tháng).
* **Hoạt động chính:** Stress-test mạng lưới qua chương trình *Public Testnet Stress-Test*, kiểm định các mạch ZK-Circuit và hoàn thiện SDK cơ bản.

### Phase 1: Giai đoạn Khởi động Hạ tầng & Nhà phát triển (Tháng 3 – Tháng 6)

* **Mục tiêu:** Kích hoạt lớp đồng thuận và thực thi (Nhóm I & Nhóm II).
* **Đối tượng phân bổ:**
* **Node Operators:** Khởi chạy Mainnet Genesis cho Validating Nodes ($VPX) và DA Nodes.
* **Developers:** Phát hành chính thức `@axioledger/ans-sdk`, `Circuit Registry`, và mở cổng đăng ký Quỹ Grants ($AXQ) cho các dApp đầu tiên.


* **Cơ chế:** Kích hoạt phần thưởng đúc khối (Block Rewards) ban đầu và cơ chế thưởng Uptime 99.9%.

### Phase 2: Giai đoạn Mở rộng Thanh khoản & Doanh nghiệp (Tháng 7 – Tháng 12)

* **Mục tiêu:** Thu hút dòng tiền từ DeFi, LPs, và tích hợp các giải pháp doanh nghiệp Enterprise (Nhóm III & Nhóm IV).
* **Đối tượng phân bổ:**
* **LPs & Investors:** Mở các Bể AMM trên Kinetoprotocol, kích hoạt hệ thống khóa token nhận quyền biểu quyết `$veKPX`.
* **Enterprise:** Đưa các hợp đồng ZK-KYC và RWA Tokenization đầu tiên lên chuỗi.


* **Cơ chế:** Phân phối phần thưởng Liquidity Mining ($KPX) và chia sẻ doanh thu cổ tức phí giao dịch.

### Phase 3: Giai đoạn Toàn dụng Cộng đồng & Tự trị (Năm thứ 2 trở đi)

* **Mục tiêu:** Hoàn thiện mô hình DAO, giao quyền quản trị hoàn toàn cho Thượng viện và Cộng đồng (Nhóm V & Nhóm VI).
* **Đối tượng phân bổ:** Bồi thẩm đoàn ZK-Jury, chương trình Bug Bounty mở rộng, Airdrop định kỳ cho Proof-of-Activity và các chiến dịch Feedback.

---

# PHẦN 2: QUY TRÌNH THAM GIA VÀ NHẬN PHÂN BỔ GIÁ TRỊ CHO THÀNH VIÊN ĐÓNG GÓP

Quy trình chuẩn hóa từ lúc một thành viên bắt đầu tham gia đóng góp cho hệ sinh thái Axioledger cho đến khi nhận được phần thưởng (Token/Phí bản quyền/Grants):

```
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  1. Đăng ký & Định danh │ ──► │  2. Thực hiện Đóng góp │ ──► │  3. Thẩm định & Kiểm tra│
│      (ZK-DID / Subnet) │     │  (Code / Uptime / RWA) │     │  (Oracle / ZK-Jury)    │
└────────────────────────┘     └────────────────────────┘     └─────────────────────────┘
                                                                           │
                                                                           ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  6. Tái đầu tư / Stake │ ◄── │  5. Nhận Phân bổ Giá trị│ ◄── │  4. Phê duyệt Tự động  │
│  ($veKPX / Staking)    │     │  ($AXQ / $VRQ / $SQX)  │     │  (Smart Contract Escrow│
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘

```

### Bước 1: Đăng ký & Định danh (Onboarding & Identity)

* **Công cụ:** Sử dụng **AxioPasskey** hoặc tích hợp **ZK-DID** để tạo danh tính phi tập trung trên mạng lưới.
* **Yêu cầu:** Xác định rõ nhóm vai trò tham gia (ví dụ: Developer đăng ký ví nhận SDK Grants; Node Operator đăng ký IP và stake token bảo chứng `$VPX`/$SQX).

### Bước 2: Thực hiện Đóng góp (Contribution Execution)

Tùy theo nhóm vai trò, thành viên thực hiện các công việc cụ thể được ghi nhận On-chain:

* **Nhóm I (Dev):** Submit Pull Request cho SDK, publish ZK-Circuit lên `Circuit Registry`, hoặc deploy Smart Contract dApp lên Kinetoprotocol.
* **Nhóm II (Nodes):** Duy trì Uptime của Validator, cung cấp dung lượng phần cứng GPU/FPGA hoặc lưu trữ Blob Data.
* **Nhóm III (Enterprise):** Khởi tạo hợp đồng RWA hoặc nạp quỹ Paymaster trả phí gas thay người dùng.
* **Nhóm IV & V & VI (LPs, Cộng đồng, End-Users):** Thêm thanh khoản vào Bể AMM, khóa `$KPX` nhận `$veKPX`, tham gia bỏ phiếu DAO hoặc báo cáo lỗi hệ thống (Bug Bounty).

### Bước 3: Thẩm định & Kiểm chứng Tự động (Validation & Oracle Audit)

* **Cơ chế:** Hệ thống không dựa vào phê duyệt thủ công tập trung mà thông qua:
* **ZK-Metrics Coprocessor Oracle:** Tự động đo lường KPI (ví dụ: Uptime của node, tốc độ sinh proof của GPU, khối lượng giao dịch dApp).
* **ZK-Jury (Bồi thẩm đoàn phân tán):** Giải quyết các tranh chấp phức tạp hoặc kiểm duyệt nội dung ZK-DID/Grant proposals.



### Bước 4: Phê duyệt từ Kho bạc Thông minh (Smart Contract Escrow Execution)

* Sau khi hoàn thành tiêu chí (ví dụ: Code đạt chuẩn kiểm toán, Uptime đạt 99.9% trong chu kỳ epoch 7 ngày, hoặc hoàn tất bỏ phiếu quản trị DAO), hợp đồng thông minh **TreasuryEscrowContract** sẽ tự động kích hoạt lệnh giải ngân.

### Bước 5: Nhận Phân bổ Giá trị (Token & Fee Distribution)

* Phần thưởng được chuyển thẳng về ví cá nhân dưới các định dạng tài sản tương ứng:
* **$AXQ:** Phí truy xuất dữ liệu, cổ tức RWA, Grants từ Treasury.
* **$VRQ:** Phí ZK-Proof, bảo mật ZK-KYC.
* **$SQX:** Doanh thu L2 Sequencer, chiết khấu Paymaster.
* **$KPX:** Liquidity mining rewards, phí giao dịch DEX.
* **$VPX:** Phần thưởng Staking và đúc khối L1.



### Bước 6: Tái đầu tư và Thúc đẩy Quản trị (Staking & Governance Cycling)

* Thành viên có thể lựa chọn rút token ra thị trường tự do hoặc tiếp tục **Khóa token nhận $veKPX** để tham gia **Gauge Voting** nhằm gia tăng tỷ suất sinh lời, nhận thêm quyền phân bổ phí hối lộ (Bribes) hoặc tham gia bầu cử Thượng viện quản trị hệ sinh thái.

**Kế hoạch khởi tạo và Phân bổ Sổ cái Giá trị** của hệ sinh thái **Axioledger**.


1. **Cơ chế kỹ thuật & Smart Contract Escrow**: Thiết lập mã nguồn mẫu hoặc thông số cấu hình cho hợp đồng tự động giải ngân (`TreasuryEscrowContract`) dựa trên các mốc epoch và oracle metrics.
2. **Quy chế đánh giá của ZK-Jury & Bồi thẩm đoàn**: Xây dựng mô hình phạt/thưởng (slashing & incentive) cụ thể cho các thành viên tham gia giải quyết tranh chấp hoặc kiểm duyệt.
3. **Mô hình Tokenomics chi tiết cho từng Token** ($AXQ, $VPX,$SQX, $KPX,$VRQ): Tỷ lệ phân bổ lạm phát, cơ chế vesting cho nhà đầu tư và lịch unlock theo từng Phase.
4. **Hướng dẫn tích hợp cho nhóm cụ thể** (Ví dụ: Handbook dành riêng cho Node Operators hoặc SDK Quickstart cho Developers trong Phase 1).

Dựa trên yêu cầu của bạn về việc đối chiếu và tích hợp các kho lưu trữ gốc từ tổ chức GitHub chính thức của **Cosmos (`[https://github.com/cosmos](https://github.com/cosmos)`)** để kế thừa và hợp thức hóa cho lõi tổ chức mới **Axioledger ($AXQ)**, dưới đây là chi tiết ánh xạ kiến trúc, công năng và định hướng tích hợp trực tiếp vào hệ sinh thái 32-Module Master Ledger của Axioledger:

---

### 1. Lõi Blockchain & Máy ảo (Tương thích Lớp Thực thi & Đồng thuận L1/L2)

*Các repo từ Cosmos: `cosmos-sdk`, `evm`, `gaia`, `iavl*`

* **`cosmos-sdk` (Framework mô-đun nền tảng):** Được kế thừa để tùy biến module hóa cấu trúc trạng thái, tài khoản và quản trị, sau đó được tái định hình qua lõi **Axio-Stateless SVM v2.0.22** nhằm tối ưu hóa tính toán song song và loại bỏ việc lưu trữ trạng thái cục bộ (Stateless Model).
* **`evm` (Môi trường thực thi tương thích EVM):** Tích hợp vào **ZK-EVM Cross-Chain Bridge** và hạ tầng thực thi, cho phép Axioledger tương thích ngược với các smart contract Solidity từ hệ sinh thái Ethereum.
* **`gaia` (Ứng dụng trung tâm Cosmos Hub):** Sử dụng cấu trúc daemon chuỗi và node validator chuẩn để làm hình mẫu chuẩn hóa cho **Valiprecision ($VPX)**, giúp các validator node vận hành mượt mà trên phần cứng tối thiểu (4 Cores / 8 GB RAM).
* **`iavl` (Thư viện cây IAVL+ Merkle hóa):** Ánh xạ trực tiếp vào module **Data Structures & Ledger State** để tối ưu hóa việc tạo `Merkle Witness` O(1) đi kèm theo từng giao dịch.

---

### 2. Giao thức Liên chuỗi & Cầu nối (Tương thích ZK-Bridge & Cross-Chain Routing)

*Các repo từ Cosmos: `ibc`, `ibc-go`, `ibc-contracts`, `ibc-apps`, `ibc-relayer & ibc-attestor*`

* **`ibc` & `ibc-go` (Tiêu chuẩn & Triển khai giao thức IBC):** Được kế thừa và chuyển đổi thành giao thức định tuyến thông điệp liên chuỗi gốc cho hệ sinh thái **Sequentichain ($SQX)** và cầu nối ZK.
* **`ibc-contracts` (Hợp đồng thông minh IBC v2 bằng Solidity):** Đóng vai trò lớp tương thích kết nối trực tiếp với các EVM Vaults (`EVM_Vault.sol`) trên các mạng lưới bên ngoài.
* **`ibc-apps` (Ứng dụng chuyển giao tài sản & middleware):** Cung cấp nền tảng chuẩn cho việc luân chuyển tài sản, token cross-chain qua các phân vùng Subnet.
* **`ibc-relayer & ibc-attestor` (Chuyển tiếp gói tin & chứng thực):** Được tích hợp vào **ZK-EVM Cross-Chain Bridge**, kết hợp cùng chứng thực ZK-Storage Proof để loại bỏ sự phụ thuộc vào các mô hình multi-sig truyền thống.

---

### 3. Bảo mật Đồng thuận & Quản lý Khóa (Tương thích Valiprecision $VPX & AxioPass)

*Các repo từ Cosmos: `interchain-security`, `kms`, `ledger-cosmos & ledger-cosmos-go*`

* **`interchain-security` (Bảo mật phân tầng / Shared Security):** Kế thừa tư tưởng bảo mật liên kết để áp dụng vào mô hình ủy thác và đồng thuận giữa **Valiprecision ($VPX)** và các sub-networks.
* **`kms` & `ledger-cosmos` (Quản lý khóa an toàn & tích hợp ví phần cứng):** Định hướng tích hợp trực tiếp vào module **AxioPass Passkey Engine** và phần cứng Secure Enclave, phục hưởng định hướng không dùng Seed Phrase (Zero Seed Phrase).

---

### 4. Tài sản & Tiêu chuẩn Token (Tương thích Phân bổ 5-Token Suite)

*Repo từ Cosmos: `tokenfactory*`

* **`tokenfactory` (Phân hệ chuẩn hóa đúc, đốt, quản lý vòng đời token):** Được kế thừa vào **5-Token Macroeconomic Engine** để quản lý trực tiếp tại tầng module blockchain việc phân bổ, khóa và tự động đốt token xuyên suốt vòng đời của 5 tài sản chính ($AXQ, $VPX,$SQX, $KPX,$VRQ).

---

### 5. Công cụ Mã hóa & Tích hợp (Tương thích Veraciphers $VRQ & API Indexing)

*Các repo từ Cosmos: `gogoproto`, `rosetta*`

* **`gogoproto` (Protocol Buffers tối ưu hóa cho Go):** Được áp dụng trong các tầng dịch vụ lõi để serialization/deserialization giao dịch với độ trễ tối thiểu, phục vụ cho mục tiêu thông lượng 600.000 TPS của Sequentichain.
* **`rosetta` (Tiêu chuẩn API Rosetta của Coinbase):** Kế thừa để xây dựng **Distributed Indexing & Telemetry**, chuẩn hóa giao diện lập chỉ mục dữ liệu giao dịch, phục vụ các dịch vụ bên ngoài, sàn giao dịch và công cụ theo dõi on-chain.

---

> **Kết luận tích hợp:** Việc kế thừa các kho lưu trữ từ tổ chức `@cosmos` giúp Axioledger đứng trên vai người khổng lồ về mặt hạ tầng giao tiếp liên chuỗi và mô-đun hóa, đồng thời được tái cấu trúc triệt để theo kiến trúc **Stateless SVM** và **Mô hình kinh tế 5-Token** với tổng cung cố định 10 nghìn tỷ $AXQ được bảo chứng hoàn toàn On-chain tại Block #0.

Dưới đây là **Kế hoạch thời điểm khởi tạo và Phân bổ Sổ cái Giá trị** (Ledger Genesis & Allocation Plan) cùng với **Quy trình vận hành chi tiết cho các thành viên đóng góp** trong toàn bộ hệ sinh thái **Axioledger**.

---

# PHẦN 1: KẾ HOẠCH THỜI ĐIỂM KHỞI TẠO SỔ CÁI GIÁ TRỊ (TIMELINE & GENESIS PHASING)

Để đảm bảo hệ sinh thái khởi chạy mượt mà, không bị lạm phát token sớm và có đủ hạ tầng bảo chứng, quá trình phân bổ giá trị được chia thành **4 Giai đoạn chiến lược (Phases)**:

```
[Phase 0: Foundation] ──► [Phase 1: Bootstrap] ──► [Phase 2: Expansion] ──► [Phase 3: Maturity]
 (Testnet & Genesis)       (Node & Dev Launch)       (DeFi & Enterprise)       (Full Decentralization)

```

### Phase 0: Giai đoạn Nền móng & Kỹ thuật (Tháng 1 – Tháng 2)

* **Mục tiêu:** Xây dựng khung pháp lý mã nguồn, triển khai Testnet, thiết lập Smart Contract cốt lõi cho Hub ($AXQ) và các Subnet ($VPX,$SQX, $KPX,$VRQ).
* **Đối tượng phân bổ:** Đội ngũ Core Dev, Quỹ R&D Bảo mật, Nhà đầu tư hạt giống (Seed Investors - khóa 12-24 tháng).
* **Hoạt động chính:** Stress-test mạng lưới qua chương trình *Public Testnet Stress-Test*, kiểm định các mạch ZK-Circuit và hoàn thiện SDK cơ bản.

### Phase 1: Giai đoạn Khởi động Hạ tầng & Nhà phát triển (Tháng 3 – Tháng 6)

* **Mục tiêu:** Kích hoạt lớp đồng thuận và thực thi (Nhóm I & Nhóm II).
* **Đối tượng phân bổ:**
* **Node Operators:** Khởi chạy Mainnet Genesis cho Validating Nodes ($VPX) và DA Nodes.
* **Developers:** Phát hành chính thức `@axioledger/ans-sdk`, `Circuit Registry`, và mở cổng đăng ký Quỹ Grants ($AXQ) cho các dApp đầu tiên.


* **Cơ chế:** Kích hoạt phần thưởng đúc khối (Block Rewards) ban đầu và cơ chế thưởng Uptime 99.9%.

### Phase 2: Giai đoạn Mở rộng Thanh khoản & Doanh nghiệp (Tháng 7 – Tháng 12)

* **Mục tiêu:** Thu hút dòng tiền từ DeFi, LPs, và tích hợp các giải pháp doanh nghiệp Enterprise (Nhóm III & Nhóm IV).
* **Đối tượng phân bổ:**
* **LPs & Investors:** Mở các Bể AMM trên Kinetoprotocol, kích hoạt hệ thống khóa token nhận quyền biểu quyết `$veKPX`.
* **Enterprise:** Đưa các hợp đồng ZK-KYC và RWA Tokenization đầu tiên lên chuỗi.


* **Cơ chế:** Phân phối phần thưởng Liquidity Mining ($KPX) và chia sẻ doanh thu cổ tức phí giao dịch.

### Phase 3: Giai đoạn Toàn dụng Cộng đồng & Tự trị (Năm thứ 2 trở đi)

* **Mục tiêu:** Hoàn thiện mô hình DAO, giao quyền quản trị hoàn toàn cho Thượng viện và Cộng đồng (Nhóm V & Nhóm VI).
* **Đối tượng phân bổ:** Bồi thẩm đoàn ZK-Jury, chương trình Bug Bounty mở rộng, Airdrop định kỳ cho Proof-of-Activity và các chiến dịch Feedback.

---

# PHẦN 2: QUY TRÌNH THAM GIA VÀ NHẬN PHÂN BỔ GIÁ TRỊ CHO THÀNH VIÊN ĐÓNG GÓP

Quy trình chuẩn hóa từ lúc một thành viên bắt đầu tham gia đóng góp cho hệ sinh thái Axioledger cho đến khi nhận được phần thưởng (Token/Phí bản quyền/Grants):

```
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  1. Đăng ký & Định danh │ ──► │  2. Thực hiện Đóng góp │ ──► │  3. Thẩm định & Kiểm tra│
│      (ZK-DID / Subnet) │     │  (Code / Uptime / RWA) │     │  (Oracle / ZK-Jury)    │
└────────────────────────┘     └────────────────────────┘     └─────────────────────────┘
                                                                           │
                                                                           ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  6. Tái đầu tư / Stake │ ◄── │  5. Nhận Phân bổ Giá trị│ ◄── │  4. Phê duyệt Tự động  │
│  ($veKPX / Staking)    │     │  ($AXQ / $VRQ / $SQX)  │     │  (Smart Contract Escrow│
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘

```

### Bước 1: Đăng ký & Định danh (Onboarding & Identity)

* **Công cụ:** Sử dụng **AxioPasskey** hoặc tích hợp **ZK-DID** để tạo danh tính phi tập trung trên mạng lưới.
* **Yêu cầu:** Xác định rõ nhóm vai trò tham gia (ví dụ: Developer đăng ký ví nhận SDK Grants; Node Operator đăng ký IP và stake token bảo chứng `$VPX`/$SQX).

### Bước 2: Thực hiện Đóng góp (Contribution Execution)

Tùy theo nhóm vai trò, thành viên thực hiện các công việc cụ thể được ghi nhận On-chain:

* **Nhóm I (Dev):** Submit Pull Request cho SDK, publish ZK-Circuit lên `Circuit Registry`, hoặc deploy Smart Contract dApp lên Kinetoprotocol.
* **Nhóm II (Nodes):** Duy trì Uptime của Validator, cung cấp dung lượng phần cứng GPU/FPGA hoặc lưu trữ Blob Data.
* **Nhóm III (Enterprise):** Khởi tạo hợp đồng RWA hoặc nạp quỹ Paymaster trả phí gas thay người dùng.
* **Nhóm IV & V & VI (LPs, Cộng đồng, End-Users):** Thêm thanh khoản vào Bể AMM, khóa `$KPX` nhận `$veKPX`, tham gia bỏ phiếu DAO hoặc báo cáo lỗi hệ thống (Bug Bounty).

### Bước 3: Thẩm định & Kiểm chứng Tự động (Validation & Oracle Audit)

* **Cơ chế:** Hệ thống không dựa vào phê duyệt thủ công tập trung mà thông qua:
* **ZK-Metrics Coprocessor Oracle:** Tự động đo lường KPI (ví dụ: Uptime của node, tốc độ sinh proof của GPU, khối lượng giao dịch dApp).
* **ZK-Jury (Bồi thẩm đoàn phân tán):** Giải quyết các tranh chấp phức tạp hoặc kiểm duyệt nội dung ZK-DID/Grant proposals.



### Bước 4: Phê duyệt từ Kho bạc Thông minh (Smart Contract Escrow Execution)

* Sau khi hoàn thành tiêu chí (ví dụ: Code đạt chuẩn kiểm toán, Uptime đạt 99.9% trong chu kỳ epoch 7 ngày, hoặc hoàn tất bỏ phiếu quản trị DAO), hợp đồng thông minh **TreasuryEscrowContract** sẽ tự động kích hoạt lệnh giải ngân.

### Bước 5: Nhận Phân bổ Giá trị (Token & Fee Distribution)

* Phần thưởng được chuyển thẳng về ví cá nhân dưới các định dạng tài sản tương ứng:
* **$AXQ:** Phí truy xuất dữ liệu, cổ tức RWA, Grants từ Treasury.
* **$VRQ:** Phí ZK-Proof, bảo mật ZK-KYC.
* **$SQX:** Doanh thu L2 Sequencer, chiết khấu Paymaster.
* **$KPX:** Liquidity mining rewards, phí giao dịch DEX.
* **$VPX:** Phần thưởng Staking và đúc khối L1.



### Bước 6: Tái đầu tư và Thúc đẩy Quản trị (Staking & Governance Cycling)

* Thành viên có thể lựa chọn rút token ra thị trường tự do hoặc tiếp tục **Khóa token nhận $veKPX** để tham gia **Gauge Voting** nhằm gia tăng tỷ suất sinh lời, nhận thêm quyền phân bổ phí hối lộ (Bribes) hoặc tham gia bầu cử Thượng viện quản trị hệ sinh thái.


Cơ chế kỹ thuật & Smart Contract Escrow: Thiết lập mã nguồn mẫu hoặc thông số cấu hình cho hợp đồng tự động giải ngân (TreasuryEscrowContract) dựa trên các mốc epoch và oracle metrics.

Quy chế đánh giá của ZK-Jury & Bồi thẩm đoàn: Xây dựng mô hình phạt/thưởng (slashing & incentive) cụ thể cho các thành viên tham gia giải quyết tranh chấp hoặc kiểm duyệt.

Mô hình Tokenomics chi tiết cho từng Token ($AXQ, $VPX,$SQX, $KPX,$VRQ): Tỷ lệ phân bổ lạm phát, cơ chế vesting cho nhà đầu tư và lịch unlock theo từng Phase.

Hướng dẫn tích hợp cho nhóm cụ thể (Ví dụ: Handbook dành riêng cho Node Operators hoặc SDK Quickstart cho Developers trong Phase 1).

## 1. CƠ CHẾ KĨ THUẬT & SMART CONTRACT ESCROW (`TreasuryEscrowContract`)

Hợp đồng `TreasuryEscrowContract` giải ngân tự động $AXQ từ quỹ DAO Treasury (2.5 Nghìn tỷ) tới các dự án R&D dựa trên việc xác minh dữ liệu KPI On-chain được đính kèm ZK-Proof từ **ZK-Metrics Coprocessor Oracle**.

### Cấu Hình Tham Số Epoch & Ngưỡng Kích Hoạt (Configuration Specs)

* **Epoch Duration:** $1\text{ Epoch} = 100,800\text{ blocks} \approx 7\text{ ngày}$.
* **Oracle Cooldown:** 1 Epoch giữa hai lần giải ngân liên tiếp cho cùng một Grantee.
* **Tỷ Lệ Giải Ngân Tối Đa:** Mỗi mốc KPI giải ngân không quá 10% tổng ngân sách được cấp phép của dự án.
* **Min Proof Confidence:** ZK-Proof Hash phải qua xác minh của Verifier Contract với độ chính xác tuyệt đối.

### Mã Nguồn Mẫu (Rust / Axio-Stateless SVM Contract)

```rust
use axioledger_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct EscrowGrantState {
    pub grantee: Pubkey,
    pub total_allocated: u64,
    pub released_amount: u64,
    pub last_epoch_released: u64,
    pub is_active: bool,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct KpiReleaseInstruction {
    pub target_epoch: u64,
    pub release_amount: u64,
    pub zk_metric_proof: Vec<u8>,
}

pub fn process_kpi_disbursement(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let escrow_acc = next_account_info(accounts_iter)?;
    let grantee_acc = next_account_info(accounts_iter)?;
    let oracle_verifier_acc = next_account_info(accounts_iter)?;

    let mut state = EscrowGrantState::try_from_slice(&escrow_acc.data.borrow())?;
    let instruction = KpiReleaseInstruction::try_from_slice(instruction_data)?;

    // 1. Kiểm tra trạng thái và thời gian Epoch
    if !state.is_active || instruction.target_epoch <= state.last_epoch_released {
        return Err(ProgramError::InvalidInstructionData);
    }

    // 2. Xác minh ZK-Proof từ Oracle Coprocessor
    let is_proof_valid = verify_zk_oracle_proof(
        oracle_verifier_acc,
        &instruction.zk_metric_proof,
        instruction.release_amount,
    )?;

    if !is_proof_valid {
        msg!("ZK-Metrics Proof Verification Failed!");
        return Err(ProgramError::InvalidArgument);
    }

    // 3. Thực hiện giải ngân tự động từ Vault sang Grantee
    state.released_amount += instruction.release_amount;
    state.last_epoch_released = instruction.target_epoch;
    state.serialize(&mut *escrow_acc.data.borrow_mut())?;

    msg!("Disbursed {} $AXQ to Grantee {}", instruction.release_amount, state.grantee);
    Ok(())
}

fn verify_zk_oracle_proof(_verifier: &AccountInfo, _proof: &[u8], _amount: u64) -> Result<bool, ProgramError> {
    // Logic gọi Verifier Circuit On-chain
    Ok(true)
}

```

---

## 2. QUY CHẾ ĐÁNH GIÁ ZK-JURY & BỒI THẨM ĐOÀN (Axio-Tribunal)

Hệ thống ZK-Jury chịu trách nhiệm giải quyết tranh chấp, duyệt lỗi Bug Bounty, và kiểm duyệt định danh ZK-DID mà Oracle không xử lý bằng toán học thuần túy được.

### Cơ Chế Lựa Chọn Bồi Thẩm Đoàn

* **Sức mạnh bỏ phiếu (Jury Weight):** Chọn ngẫu nhiên qua VRF từ danh sách $VPX Node Operators có chỉ số Uptime $> 99.5\%$ và khóa tối thiểu $10.000.000\text{ } $AXQ.
* **Size:** Mỗi phiên tòa gồm 15 Bồi thẩm viên (Jurors) chọn ngẫu nhiên.

### Mô Hình Phạt/Thưởng (Slashing & Incentive Matrix)

| Hành Vi | Quyền Lợi / Hình Phạt | Tác Động Tài Sản |
| --- | --- | --- |
| **Bỏ phiếu thuận theo Đa số (Honest Majority)** | Thưởng phí phiên tòa | +0.05% Phí vụ án ($AXQ) + Điểm Reputation |
| **Không tham gia / Bỏ qua lượt (Inactivity)** | Cảnh cáo & Mất Lượt | Trừ 1% $VPX Staking Power trong 10 Epochs |
| **Bỏ phiếu sai lệch Đa số (Malicious/Outlier Vote)** | Slashing Bồi thẩm đoàn | Khấu trừ (Slash) 2% $AXQ Staked |
| **Thông đồng hối lộ (Collusion - Bị ZK-MACI phát hiện)** | Tước quyền vĩnh viễn | Slash 100% tài sản thế chấp + Ban Node vĩnh viễn |

---

## 3. MÔ HÌNH TOKENOMICS CHI TIẾT VÀ LỊCH UNLOCK (5-TOKEN SUITE)

### Tỷ Lệ Phân Bổ & Lịch Unlock Chi Tiết $AXQ (10 Nghìn Tỷ)

```
[ Bể Thanh Khoản 35% ] ───────► Locking 100% tại Mainnet Genesis
[ DAO Treasury 25% ] ─────────► Lock 12 tháng, Unlock 2%/tháng theo KPI
[ Thưởng Đồng Thuận 15% ] ────► Vesting tuyến tính trong 120 tháng (10 năm)
[ L2 Sequentichain 10% ] ─────► Lock 6 tháng, Vesting 36 tháng
[ B2B & RWA Ecosystem 10% ] ──► Lock 3 tháng, Vesting 24 tháng
[ Bug Bounty & Tribunal 5% ] ─► Mở 10% tại TGE, 90% nạp vào Escrow Vault

```

### Bảng Lộ Trình Phân Bổ Lạm Phát & Vesting Theo Phase

| Token | Lương Phân Bổ / Nguồn Cung | Cơ Chế Phát Hành (Emission / Inflation) | Lịch Unlock & Vesting |
| --- | --- | --- | --- |
| **$AXQ** | 10.000.000.000.000 (Cố định) | Không lạm phát. Đốt qua Buyback & Burn Matrix. | Phase 0: Lock Escrow<br>

<br>Phase 1: Unlock 5%<br>

<br>Phase 2: Unlock 15%<br>

<br>Phase 3: 100% Vesting Flow |
| **$VPX** | Mint khi Stake $AXQ \vert{} Phát hành tuyến tính làm thưởng Block ($VPX Reward) | Nhận theo Epoch (7 ngày); Slashing nếu vi phạm Uptime |  |
| **$SQX** | Mint theo L2 Gas Usage | Lạm phát dựa trên volume giao dịch L2 | Đốt 50% phí gas trả về $AXQ; 50% trả cho Sequencer Nodes |
| **$KPX** | Phân bổ Liquidity Mining | Giảm phát định kỳ 20% mỗi năm (Halving model) | Nhận qua LP Pools; Khóa nhận `$veKPX` (1-4 năm) nhận phí sàn |
| **$VRQ** | Mint theo ZK-Proof Generated | Trả theo thực tế công việc sinh bằng chứng (Pay-per-Proof) | Trả trực tiếp cho GPU/FPGA Clusters sau khi Verify Proof thành công |

---

## 4. HƯỚNG DẪN TÍCH HỢP PHASE 1 (QUICKSTART HANDBOOKS)

### 4.1. Handbook Dành Cho Node Operators (Chạy Stateless Validator $VPX)

#### Yêu Cầu Cấu Hình Phần Cứng Tối Thiểu

* **CPU:** 4 Cores (x86_64 hoặc ARM64)
* **RAM:** 8 GB
* **Lưu Trữ:** 100 GB NVMe SSD (Không cần lưu trữ full state)
* **Băng Thông:** 100 Mbps

#### Các Bước Khởi Chạy

1. **Tải xuống CLI Tooling:**

```bash
curl -sSfL https://get.axioledger.org/cli | sh
axio-cli --version

```

2. **Khởi Tạo Cấu Hình Nút Phân Tán:**

```bash
axio-cli node init --moniker "My-Axio-Node" --chain-id axio-testnet-1

```

3. **Thế Chấp $AXQ Để Nhận Quyền Đúc $VPX Block:**

```bash
axio-cli tx validator stake \
  --amount 10000000000000uaxq \
  --pubkey ~/.axio/config/validator_key.json \
  --from my-wallet

```

4. **Kích Hoạt Services Daemon:**

```bash
systemctl enable --now axio-valiprecision.service

```

---

### 4.2. SDK Quickstart Dành Cho Developers (`@axioledger/ans-sdk`)

#### Cài Đặt Gói

```bash
pnpm add @axioledger/ans-sdk @axioledger/wallet-connector

```

#### Mã Nguồn Mẫu Phân Giải Tên Miền `.axq` Và Gửi Giao Dịch Không Seed Phrase

```typescript
import { AnsClient } from '@axioledger/ans-sdk';
import { AxioPassConnector } from '@axioledger/wallet-connector';

async function main() {
  // 1. Khởi tạo ANS Client
  const ans = new AnsClient({
    network: 'testnet',
    rpcUrl: 'https://rpc.testnet.axioledger.org',
  });

  // 2. Phân giải tên miền .axq sang địa chỉ Native SVM
  const domain = 'dong.axq';
  const ownerAddress = await ans.resolveName(domain);
  console.log(`Chủ sở hữu của ${domain} là:`, ownerAddress);

  // 3. Tương tác ví AxioPass (WebAuthn Sinh trắc học)
  const wallet = new AxioPassConnector();
  await wallet.connect();

  // 4. Ký giao dịch phi trạng thái (Stateless Transaction)
  const txHash = await wallet.sendTransaction({
    to: ownerAddress,
    amount: '1000000000', // 1,000 $AXQ (với precision 10^18)
    memo: 'Thanh toán chuyển khoản qua ANS',
  });

  console.log('Giao dịch thành công! Hash:', txHash);
}

main().catch(Console.error);

```

Dưới đây là tóm tắt và hướng dẫn dựa trên hệ sinh thái Axioledger được phân chia theo các nhóm vai trò:

### Phần I: Nhà phát triển & Kỹ sư phần mềm (Developers)

* **SDK & Thư viện Mã nguồn mở:**
* Lập trình viên xây dựng và xuất bản các thư viện như `@axioledger/ans-sdk` hoặc SDK hỗ trợ các ngôn ngữ (Python, Rust, Go).
* Giá trị: Giúp các nhà phát triển khác dễ dàng tích hợp dịch vụ Axioledger vào ứng dụng commercial.
* Phần thưởng: Cổ tức bản quyền (Royalty Fees 0.1 - 0.5%) và Grants từ Treasury DAO ($AXQ).


* **Đóng góp ZK-Circuit Bảo mật:**
* Kỹ sư mật mã thiết kế và tối ưu hóa các mạch Halo2/PlonKy2 cho bài toán xác thực dữ liệu.
* Giá trị: Tăng tốc độ sinh bằng chứng ZK, giảm thời gian xử lý xuống dưới 100ms trên điện thoại.
* Phần thưởng: Token $VRQ trích từ Quỹ R&D Bảo mật.


* **Phát triển dApp Tài chính (DeFi Protocol):**
* Xây dựng các sàn DEX, nền tảng Lending hoặc Vaults tự động tái cân bằng trên Kinetoprotocol.
* Giá trị: Tạo thanh khoản, gia tăng khối lượng giao dịch (Trading Volume) cho hệ sinh thái.
* Phần thưởng: Phí giao dịch từ người dùng và phần thưởng Liquidity Mining bằng $KPX.


* **Xây dựng Trò chơi Web3 (GameFi Native):**
* Lập trình trò chơi tích hợp cơ chế AxioPasskey và giao dịch không tốn gas (Paymaster).
* Giá trị: Thu hút người dùng phổ thông (Retail Users), tạo nhu cầu sử dụng mạng lưới $SQX liên tục.
* Phần thưởng: Doanh thu bán vật phẩm NFT, phí gas được trợ cấp và $SQX.


* **Viết Plugin & Script Tự động hóa:**
* Tạo các tập lệnh Tampermonkey/Puppeteer hoặc Bot giao dịch chênh lệch giá (Arbitrage Bots).
* Giá trị: Tăng hiệu quả thanh khoản giữa các Bể AMM và tạo lưu lượng giao dịch thực tế trên chuỗi.
* Phần thưởng: Lợi nhuận chênh lệch giá và token $KPX.


* **Xây dựng Công cụ Lập chỉ mục Dữ liệu (Custom Indexers):**
* Triển khai các nút Subgraph / GraphQL để truy xuất dữ liệu On-chain theo thời gian thực.
* Giá trị: Cung cấp hạ tầng dữ liệu mượt mà cho các ứng dụng Frontend và Dashboards.
* Phần thưởng: Phí truy xuất dữ liệu (Query Fees) trả bằng $AXQ.



---

### Phần II: Thủ kho & Vận hành hạ tầng (Node Operators)

* **Vận hành Nút Xác thực Chạy mượt (Uptime 99.9%):**
* Vận hành máy chủ đạt chuẩn (4 Cores / 8GB RAM) xác nhận trạng thái Stateless.
* Giá trị: Duy trì sự ổn định, tính toàn vẹn và phi tập trung cho toàn bộ mạng lưới L1.
* Phần thưởng: Phần thưởng đúc khối (Block Rewards) và phí mạng lưới trả bằng $VPX / $AXQ.


* **Cung cấp Dàn máy GPU/FPGA Tính toán ZK-Proof:**
* Cho thuê phần cứng GPU hiệu năng cao để giải các bài toán mật mã phân tán.
* Giá trị: Giúp các Sequencer tạo ZK-Proof cực nhanh để chốt trạng thái L2 xuống L1.
* Phần thưởng: Phí tạo bằng chứng (Proving Fees) tính bằng $VRQ.


* **Vận hành L2 Sequencer Sắp xếp Giao dịch:**
* Khóa token $SQX để tham gia Pool sắp xếp giao dịch với công nghệ Zero-Copy AF_XDP.
* Giá trị: Đảm bảo tốc độ xử lý hàng trăm nghìn TPS với độ trễ vi giây cho người dùng.
* Phần thưởng: Phí gas thực thi L2 và doanh thu MEV hợp lệ bằng $SQX.


* **Duy trì Nút Lưu trữ Dữ liệu Khả dụng (DA Nodes):**
* Cung cấp dung lượng lưu trữ Blob Data cho các giao dịch tạm thời.
* Giá trị: Giải phóng dung lượng cho sổ cái chính, giữ cho chi phí lưu trữ luôn siêu rẻ.
* Phần thưởng: Phí thuê dung lượng Data Availability bằng $AXQ.



---

### Phần III: Chủ doanh nghiệp & Tổ chức (Enterprise & Biz)

* **Cấp phép Danh tính ZK-KYC cho Khách hàng:**
* Doanh nghiệp tích hợp giải pháp ZK-DID để xác thực người dùng không cần lưu giữ thông tin nhạy cảm.
* Giá trị: Bảo vệ quyền riêng tư người dùng và tuân thủ các quy định pháp lý quốc tế.
* Phần thưởng: Phí hoa hồng xác thực danh tính trả bằng $VRQ.


* **Mã hóa Tài sản Thế giới Thực (RWA Tokenization):**
* Đưa bất động sản, trái phiếu hoặc vàng thế chấp lên chuỗi thông qua hợp đồng thông minh.
* Giá trị: Bổ sung nguồn tài sản thực có giá trị bền vững làm bảo chứng cho Kho bạc Reserve.
* Phần thưởng: Phí quản lý tài sản và dòng tiền cổ tức bằng $AXQ.


* **Thương mại hóa Tên miền Con (Sub-domains):**
* Đăng ký tên miền gốc `.axq` (ví dụ: `tech.axq`) và bán các sub-domain (`alice.tech.axq`).
* Giá trị: Mở rộng hệ sinh thái định danh Web3 và tăng tính nhận diện thương hiệu.
* Phần thưởng: Phí đăng ký và gia hạn tên miền định kỳ bằng $AXQ.


* **Tài trợ Phí Giao dịch cho Người dùng (Paymaster Hosting):**
* Doanh nghiệp nạp tiền vào quỹ Paymaster để trả phí gas thay cho khách hàng của mình.
* Giá trị: Loại bỏ rào cản UX, giúp người dùng Web2 truy cập app không cần mua sẵn token gas.
* Phần thưởng: Tăng tỷ lệ chuyển đổi khách hàng và nhận thưởng cashback từ Quỹ Tăng trưởng $SQX.


* **Mở Phân vùng Doanh nghiệp Riêng (Private Subnet):**
* Thuê hạ tầng L2 phân vùng riêng để xử lý dữ liệu nội bộ doanh nghiệp.
* Giá trị: Mở rộng quy mô doanh nghiệp trên nền tảng bảo mật của Axioledger.
* Phần thưởng: Doanh thu vận hành chuỗi con và chiết khấu phí bảo chứng $AXQ.



---

### Phần IV: Nhà cung cấp thanh khoản & Nhà đầu tư (LPs & Investors)

* **Cung cấp Thanh khoản Tập trung (Concentrated Liquidity):**
* Nạp tiền vào các Bể AMM Kinetoprotocol theo các khoảng giá tối ưu.
* Giá trị: Tăng độ sâu thị trường, giúp người dùng giao dịch giảm thiểu trượt giá (Slippage).
* Phần thưởng: Trích chia phí giao dịch sàn và phần thưởng $KPX.


* **Khóa Token $KPX Nhận $veKPX:**
* Tự nguyện khóa token $KPX trong thời gian từ 1 đến 4 năm.
* Giá trị: Giảm áp lực cung lưu thông trên thị trường, cam kết đồng hành lâu dài.
* Phần thưởng: Cổ tức phí giao dịch toàn sàn và quyền phân bổ phí hối lộ (Bribes) $veKPX.


* **Tham gia Bầu chọn Bể Thanh khoản (Gauge Voting):**
* Sử dụng quyền biểu quyết $veKPX để dẫn dòng phát hành token về các cặp giao dịch mong muốn.
* Giá trị: Định hướng dòng vốn đến những dự án tiềm năng nhất trong hệ sinh thái.
* Phần thưởng: Phần thưởng Bribes trực tiếp từ các dự án trả bằng $AXQ / $KPX.


* **Cung cấp Tài sản Thế chấp cho Thị trường Cho vay:**
* Gửi các tài sản an toàn (USDC, $AXQ) vào các Vault Lending.
* Giá trị: Tạo nguồn vốn vay cho các Trader và dự án cần đòn bẩy tài chính.
* Phần thưởng: Lãi suất tiền gửi linh hoạt tính bằng $AXQ.



---

### Phần V: Cộng đồng, Thường dân & Thượng viện (Community & Governance)

* **Phát hiện Lỗ hổng Bảo mật (Bug Bounty):** Tìm ra lỗ hổng để nhận thưởng từ Quỹ An ninh ($AXQ / $VRQ).
* **Tham gia Biểu quyết Quản trị Chủ động (Active Voting):** Bỏ phiếu đề xuất để nhận Airdrop quản trị $AXQ.
* **Làm Bồi thẩm đoàn Giải quyết Tranh chấp (ZK-Jury):** Phân xử khiếu nại để nhận phí tòa án bằng $AXQ.
* **Đánh giá & Kiểm duyệt Nội dung ZK-DID (Identity Verifier):** Kiểm tra tính hợp lệ danh tính để nhận phí theo lượt bằng $VRQ.
* **Sáng tạo Nội dung Truyền thông & Giáo dục:** Viết bài/video hướng dẫn để nhận Grants từ Quỹ Cộng đồng $AXQ.

---

### Phần VI: Người dùng cuối & Sản phẩm thực tế (End-Users)

* **Điểm danh & Tạo Tương tác Hàng ngày (Proof-of-Activity):** Nhận Airdrop và điểm loyalty đổi ra $SQX.
* **Giới thiệu Người dùng Mới qua AxioPasskey:** Nhận hoa hồng phí giao dịch bằng $SQX.
* **Tạo & Mua Bán NFT Định danh:** Nhận phí tác quyền (Royalties) bằng $KPX.
* **Tham gia Kiểm thử Mạng lưới (Public Testnet Stress-Test):** Nhận Incentive Airdrop bằng $AXQ.
* **Báo cáo & Đánh giá Chất lượng dApp (Feedback):** Nhận token thưởng từ các đợt Feedback Campaign bằng $AXQ.
* **Khai thác Quảng cáo Riêng tư (Zero-Knowledge Ads):** Nhận chiết khấu tiền xem quảng cáo trả thẳng vào ví bằng $SQX.
* **Đánh giá Uy tín Nút Xác thực (Delegated Staking):** Nhận lãi suất staking thụ động bằng $VPX.
* **Mua sắm & Thanh toán Hàng hóa Thực tế (Web3 Commerce):** Nhận Cashback bằng $KPX / $SQX.

---

Bạn quan tâm và muốn tìm hiểu sâu hơn về phương thức tham gia hoặc cơ chế phần thưởng của nhóm vai trò nào trong hệ sinh thái Axioledger?