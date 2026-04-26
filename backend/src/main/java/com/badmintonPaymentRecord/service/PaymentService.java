package com.badmintonPaymentRecord.service;

import com.badmintonPaymentRecord.dto.request.PaymentRequest;
import com.badmintonPaymentRecord.dto.request.UpdatePaymentRequest;
import com.badmintonPaymentRecord.dto.response.PaymentResponse;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {
    List<PaymentResponse> getAllPayments();
    PaymentResponse createPayment(PaymentRequest paymentRequest);
    PaymentResponse updatePayment(Integer id, UpdatePaymentRequest paymentRequest);
    List<PaymentResponse> getAllPaymentsByDate(String date);
    void deletePayment(int id);
}
