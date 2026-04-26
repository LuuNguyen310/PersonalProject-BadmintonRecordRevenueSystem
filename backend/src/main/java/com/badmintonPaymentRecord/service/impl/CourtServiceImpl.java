package com.badmintonPaymentRecord.service.impl;

import com.badmintonPaymentRecord.dto.response.CourtResponse;
import com.badmintonPaymentRecord.entity.Court;
import com.badmintonPaymentRecord.mapper.CourtMapper;
import com.badmintonPaymentRecord.repository.CourtRepository;
import com.badmintonPaymentRecord.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourtServiceImpl implements CourtService {

    private final CourtRepository courtRepository;
    private final CourtMapper courtMapper;

    @Override
    public List<CourtResponse> getCourts() {
        List<Court> courtList = courtRepository.findAll();
        return courtMapper.toCourtResponseList(courtList);
    }
}
