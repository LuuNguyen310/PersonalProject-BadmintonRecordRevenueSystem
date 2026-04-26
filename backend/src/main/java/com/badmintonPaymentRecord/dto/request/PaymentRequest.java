package com.badmintonPaymentRecord.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {
    List<PaymentDetailRequest> paymentDetails;
    String paymentType;
    String note;
}
