package com.badmintonPaymentRecord.mapper;

import com.badmintonPaymentRecord.dto.response.CourtResponse;
import com.badmintonPaymentRecord.entity.Court;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CourtMapper {
    CourtResponse toCourtResponse(Court court);
    List<CourtResponse> toCourtResponseList(List<Court> courts);
}
