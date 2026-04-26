package com.badmintonPaymentRecord.service;

import com.badmintonPaymentRecord.dto.response.CourtResponse;
import com.badmintonPaymentRecord.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtService {
    List<CourtResponse> getCourts();
}
