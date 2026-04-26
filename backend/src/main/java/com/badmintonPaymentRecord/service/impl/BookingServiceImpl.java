package com.badmintonPaymentRecord.service.impl;

import com.badmintonPaymentRecord.dto.request.CourtBookingRequest;
import com.badmintonPaymentRecord.entity.Booking;
import com.badmintonPaymentRecord.entity.Court;
import com.badmintonPaymentRecord.repository.BookingRepository;
import com.badmintonPaymentRecord.repository.CourtRepository;
import com.badmintonPaymentRecord.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;

    @Override
    public Booking createBookingFromRequest(CourtBookingRequest cbr) {
        // Tìm sân theo courtId
        Court court = courtRepository.findById(cbr.getCourtId())
                .orElseThrow(() -> new RuntimeException(
                        "Can not find Court with ID: " + cbr.getCourtId()));

        // Parse giờ từ chuỗi "HH:mm" hoặc "HH:mm:ss"
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDate today = LocalDate.now(vnZone);

        LocalTime parsedStart = parseTimeString(cbr.getStartTime());
        LocalTime parsedEnd   = parseTimeString(cbr.getEndTime());

        // Ghép ngày hôm nay với giờ vừa parse
        LocalDate endDate = parsedEnd.isBefore(parsedStart)
                ? today.plusDays(1)  // qua nửa đêm
                : today;

        Instant startInstant = parsedStart.atDate(today).atZone(vnZone).toInstant();
        Instant endInstant   = parsedEnd.atDate(endDate).atZone(vnZone).toInstant();

        // Tính số giờ chơi
        Duration duration = Duration.between(startInstant, endInstant);
        if (duration.isNegative() || duration.isZero()) {
            throw new RuntimeException("Giờ kết thúc phải lớn hơn giờ bắt đầu");
        }
        BigDecimal totalHours = BigDecimal.valueOf(duration.toMinutes())
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        // Tạo và lưu Booking
        Booking booking = Booking.builder()
                .court(court)
                .startTime(startInstant)
                .endTime(endInstant)
                .totalHours(totalHours)
                .build();

        return bookingRepository.save(booking);
    }

    private LocalTime parseTimeString(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) {
            throw new RuntimeException("Giờ không được để trống");
        }
        try {
            // Hỗ trợ cả "HH:mm" (ngắn) và "HH:mm:ss" (đầy đủ)
            return timeStr.length() == 5
                    ? LocalTime.parse(timeStr, java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
                    : LocalTime.parse(timeStr, java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss"));
        } catch (Exception e) {
            throw new RuntimeException(
                    "Định dạng giờ không hợp lệ: \"" + timeStr + "\". Vui lòng dùng HH:mm hoặc HH:mm:ss (ví dụ: \"19:15\")");
        }
    }
}
