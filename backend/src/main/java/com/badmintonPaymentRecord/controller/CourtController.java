package com.badmintonPaymentRecord.controller;

import com.badmintonPaymentRecord.dto.response.CourtResponse;
import com.badmintonPaymentRecord.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/courts")
public class CourtController {

    private final CourtService courtService;

    @GetMapping
    public List<CourtResponse> getAll() {
        return courtService.getCourts();
    }
}
