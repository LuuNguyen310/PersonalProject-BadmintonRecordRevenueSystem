package com.badmintonPaymentRecord.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    Integer paymentId;
    Instant paymentDate;
    BigDecimal total;
    String paymentType;
    String note;
    List<PaymentDetailResponse> paymentDetails;
}
