package com.badmintonPaymentRecord.repository;

import com.badmintonPaymentRecord.entity.PaymentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetail, Integer> {
}
