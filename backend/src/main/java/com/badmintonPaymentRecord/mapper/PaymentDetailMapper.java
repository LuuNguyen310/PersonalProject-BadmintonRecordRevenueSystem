package com.badmintonPaymentRecord.mapper;

import com.badmintonPaymentRecord.dto.response.PaymentDetailResponse;
import com.badmintonPaymentRecord.entity.PaymentDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentDetailMapper {

    @Mapping(source = "product.name",           target = "productName")
    @Mapping(source = "unitPrice",               target = "unitPrice")
    @Mapping(source = "subTotal",                target = "subtotal")
    @Mapping(source = "booking.court.name",      target = "courtName")
    @Mapping(source = "booking.startTime",       target = "startTime")
    @Mapping(source = "booking.endTime",         target = "endTime")
    @Mapping(source = "booking.totalHours",      target = "totalHours")
    PaymentDetailResponse toResponse(PaymentDetail paymentDetail);

    List<PaymentDetailResponse> toResponseList(List<PaymentDetail> paymentDetails);
}
