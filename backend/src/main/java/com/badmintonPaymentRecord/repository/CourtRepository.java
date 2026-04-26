package com.badmintonPaymentRecord.repository;

import com.badmintonPaymentRecord.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Integer> {
}
