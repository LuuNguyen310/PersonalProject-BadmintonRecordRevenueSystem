package com.badmintonPaymentRecord.repository;

import com.badmintonPaymentRecord.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findAllByOrderByPaymentDateDesc();

    List<Payment> findByPaymentDateBetweenOrderByPaymentDateDesc(Instant paymentDateAfter, Instant paymentDateBefore);
}
