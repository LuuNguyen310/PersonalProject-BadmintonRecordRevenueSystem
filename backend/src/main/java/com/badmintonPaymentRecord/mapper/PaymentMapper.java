package com.badmintonPaymentRecord.mapper;

import com.badmintonPaymentRecord.dto.request.PaymentRequest;
import com.badmintonPaymentRecord.dto.response.PaymentResponse;
import com.badmintonPaymentRecord.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PaymentDetailMapper.class})
public interface PaymentMapper {

    @Mapping(source = "id",             target = "paymentId")
    @Mapping(source = "paymentDetails", target = "paymentDetails")
    PaymentResponse toResponse(Payment payment);

    List<PaymentResponse> toResponseList(List<Payment> payments);

    @Mapping(target = "id",             ignore = true)
    @Mapping(target = "paymentDate",    ignore = true)
    @Mapping(target = "total",          ignore = true)
    @Mapping(target = "paymentDetails", ignore = true)
    Payment toPayment(PaymentRequest paymentRequest);
}
