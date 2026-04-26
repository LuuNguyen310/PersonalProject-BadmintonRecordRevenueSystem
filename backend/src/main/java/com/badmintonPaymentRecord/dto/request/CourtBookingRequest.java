package com.badmintonPaymentRecord.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourtBookingRequest {

    /**
     * ID của sân cầu lông (bắt buộc).
     */
    Integer courtId;

    /**
     * Giờ bắt đầu chơi (bắt buộc).
     * Chấp nhận định dạng "HH:mm" hoặc "HH:mm:ss". Ví dụ: "19:15"
     * Backend tự ghép với ngày hôm nay theo múi giờ Asia/Ho_Chi_Minh.
     */
    String startTime;

    /**
     * Giờ kết thúc chơi (bắt buộc).
     * Chấp nhận định dạng "HH:mm" hoặc "HH:mm:ss". Ví dụ: "21:00"
     * Backend tự ghép với ngày hôm nay theo múi giờ Asia/Ho_Chi_Minh.
     */
    String endTime;
}
