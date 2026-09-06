/**
 * @file index.ts
 * Điểm xuất công khai duy nhất của gói @kinetoprotocol/market-registry.
 * Re-export tất cả các symbol từ các module con để người dùng chỉ cần
 * import từ một đường dẫn duy nhất.
 *
 * @example
 * import { MarketRegistry, MarketRegistryError, validateMarketConfig } from "@kinetoprotocol/market-registry";
 */

// Các kiểu dữ liệu và lớp lỗi cốt lõi
export type { MarketStatus, AssetPair, MarketConfig, MarketRegistryErrorCode } from "./types.js";
export { MarketRegistryError } from "./types.js";

// Lớp Market đại diện cho một thị trường đơn lẻ
export { Market } from "./market.js";

// Hàm kiểm tra cấu hình và kiểu kết quả
export type { ValidationResult } from "./validator.js";
export { validateMarketConfig } from "./validator.js";

// Lớp registry trung tâm và kiểu bộ lọc
export type { MarketListFilter } from "./registry.js";
export { MarketRegistry } from "./registry.js";
