package com.badmintonPaymentRecord.repository;

import com.badmintonPaymentRecord.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}
