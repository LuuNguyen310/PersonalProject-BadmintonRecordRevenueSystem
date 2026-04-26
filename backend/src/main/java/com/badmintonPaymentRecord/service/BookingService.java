package com.badmintonPaymentRecord.service;

import com.badmintonPaymentRecord.dto.request.CourtBookingRequest;
import com.badmintonPaymentRecord.entity.Booking;

public interface BookingService {
    Booking createBookingFromRequest(CourtBookingRequest cbr);
}
