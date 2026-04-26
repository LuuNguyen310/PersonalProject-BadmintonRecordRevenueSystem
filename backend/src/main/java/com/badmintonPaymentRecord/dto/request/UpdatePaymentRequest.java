package com.badmintonPaymentRecord.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdatePaymentRequest {

    private String note;

    private String paymentType;

    private List<PaymentDetailRequest> paymentDetails;
}
