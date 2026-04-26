package com.badmintonPaymentRecord.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentDetailResponse {

    // --- Thông tin sản phẩm (nước uống/đồ ăn) ---
    // null nếu dòng này là tiền sân
    String productName;

    // --- Thông tin sân ---
    // null nếu dòng này là tiền nước
    String courtName;
    Instant startTime;
    Instant endTime;
    BigDecimal totalHours;

    // --- Thông tin chung ---
    BigDecimal unitPrice;  // Giá/giờ (sân) hoặc giá/sản phẩm (nước)
    BigDecimal quantity;   // Số giờ (sân) hoặc số lượng (nước)
    BigDecimal subtotal;
}
