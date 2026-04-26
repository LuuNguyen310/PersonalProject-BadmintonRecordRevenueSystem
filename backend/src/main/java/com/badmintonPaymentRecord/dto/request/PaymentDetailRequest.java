package com.badmintonPaymentRecord.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentDetailRequest {

    /**


    /**
     * Thông tin đặt sân inline.
     * - Có giá trị: backend tự tạo Booking mới từ sân + giờ chơi → tính tiền sân
     * - null: không dùng cách này
     */
    CourtBookingRequest courtBooking;

    /**
     * ID của Product (nước uống / đồ ăn).
     * - Có giá trị: dòng này là tiền nước/sản phẩm
     * - null: dòng này không phải tiền nước
     */
    Integer productId;

    /**
     * Số lượng sản phẩm — chỉ dùng khi productId != null.
     * Đối với tiền sân, số giờ được tự tính từ endTime - startTime.
     */
    BigDecimal quantity;
}
