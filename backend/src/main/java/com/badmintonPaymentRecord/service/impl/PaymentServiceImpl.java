package com.badmintonPaymentRecord.service.impl;

import com.badmintonPaymentRecord.dto.request.CourtBookingRequest;
import com.badmintonPaymentRecord.dto.request.PaymentDetailRequest;
import com.badmintonPaymentRecord.dto.request.PaymentRequest;
import com.badmintonPaymentRecord.dto.request.UpdatePaymentRequest;
import com.badmintonPaymentRecord.dto.response.PaymentResponse;
import com.badmintonPaymentRecord.entity.*;
import com.badmintonPaymentRecord.mapper.PaymentMapper;
import com.badmintonPaymentRecord.repository.*;
import com.badmintonPaymentRecord.service.BookingService;
import com.badmintonPaymentRecord.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final PaymentDetailRepository paymentDetailRepository;
    private final PaymentMapper paymentMapper;
    private final BookingService bookingService;

    @Override
    public List<PaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllByOrderByPaymentDateDesc();
        return paymentMapper.toResponseList(payments);
    }

    /**
     * Tạo mới một Payment kèm danh sách PaymentDetail.
     *
     * Hỗ trợ các trường hợp:
     *  - Case 1: Tiền sân dùng courtBooking inline
     *            → client truyền courtId + startTime + endTime
     *            → backend tự tính totalHours và tạo Booking mới
     *  - Case 2: Tiền nước / sản phẩm (productId)
     *  - Hai case trên có thể kết hợp trong cùng một Payment
     */
    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest paymentRequest) {
        validatePaymentRequest(paymentRequest); //Kiểm tra xem các field đúng validation hay chưa ?

        // --- Bước 1: Tạo Payment (chưa save) ---
        Payment payment = Payment.builder()
                .paymentType(paymentRequest.getPaymentType())
                .note(paymentRequest.getNote())
                .paymentDate(Instant.now())
                .build();

        // --- Bước 2: Xử lý từng PaymentDetail ---
        List<PaymentDetail> details = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (PaymentDetailRequest detailRequest : paymentRequest.getPaymentDetails()) {
            validateDetailRequest(detailRequest);

            PaymentDetail detail = new PaymentDetail();
            detail.setPayment(payment);

            // --- Case: Dòng tiền sân ---
            boolean isCourtDetail = detailRequest.getCourtBooking() != null;

            if (isCourtDetail) {
                detail = buildCourtDetail(detail, detailRequest);
            }

            // --- Case: Dòng tiền nước / sản phẩm ---
            if (detailRequest.getProductId() != null) {
                detail = buildProductDetail(detail, detailRequest);
            }

            total = total.add(detail.getSubTotal());
            details.add(detail);
        }

        // --- Bước 3: Gán total và danh sách detail vào Payment, rồi save ---
        payment.setTotal(total);
        payment.setPaymentDetails(new LinkedHashSet<>(details));

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    public PaymentResponse updatePayment(Integer id, UpdatePaymentRequest paymentRequest) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment Not Found" + id));

        // Cách này đảm bảo các bản ghi trong bảng PaymentDetail được xóa khỏi DB
        paymentDetailRepository.deleteAll(payment.getPaymentDetails());

        //Mặc dù trong database đã hoàn toàn đc clear bởi code trên nhưng trong Persistence context vẫn còn đang giữ
        //tham chiếu đến với paymentDetail nên là ta cân cho Persistence context biết là clear nó đi
        payment.getPaymentDetails().clear();


        // --- Bước 3: Xử lý và tạo lại các PaymentDetail mới từ request ---
        // Tái sử dụng các hàm helper bạn đã viết
        List<PaymentDetail> newDetails = new ArrayList<>();
        BigDecimal newTotal = BigDecimal.ZERO;

        if (paymentRequest.getPaymentDetails() != null && !paymentRequest.getPaymentDetails().isEmpty()) {
            for (PaymentDetailRequest detailRequest : paymentRequest.getPaymentDetails()) {
                validateDetailRequest(detailRequest); // Tái sử dụng hàm validate

                PaymentDetail detail = new PaymentDetail();
                detail.setPayment(payment);

                if (detailRequest.getCourtBooking() != null) {
                    detail = buildCourtDetail(detail, detailRequest);
                }

                if (detailRequest.getProductId() != null) {
                    detail = buildProductDetail(detail, detailRequest);
                }

                newTotal = newTotal.add(detail.getSubTotal());
                newDetails.add(detail);
            }
        } else {
            throw new RuntimeException("Danh sách PaymentDetail không được rỗng");
        }


        // --- Bước 4: Cập nhật thông tin của Payment chính ---
        payment.setNote(paymentRequest.getNote());
        payment.setPaymentType(paymentRequest.getPaymentType());
        payment.setTotal(newTotal);
        payment.getPaymentDetails().addAll(newDetails);
        // paymentDate không nên thay đổi khi update

        // --- Bước 5: Lưu lại Payment đã cập nhật vào DB ---
        Payment updatedPayment = paymentRepository.save(payment);

        // --- Bước 6: Map sang DTO và trả về cho client ---
        return paymentMapper.toResponse(updatedPayment);
    }

    @Override
    public List<PaymentResponse> getAllPaymentsByDate(String date) {
        LocalDate localDate = LocalDate.parse(date);
        Instant startOfDay = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = localDate.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant();
        List<Payment> paymentList = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startOfDay, endOfDay);
        return paymentMapper.toResponseList(paymentList);
    }

    @Override
    public void deletePayment(int id) {
        paymentRepository.deleteById(id);
    }


    // ===================================================================
    // ==================== PRIVATE HELPER METHODS =======================
    // ===================================================================

    /**
     * Xây dựng PaymentDetail cho dòng tiền sân.
     */
    private PaymentDetail buildCourtDetail(PaymentDetail detail,
                                           PaymentDetailRequest detailRequest) {
        Booking booking = bookingService.createBookingFromRequest(detailRequest.getCourtBooking());

        // Tính giá tiền sân
        // TODO: Tích hợp bảng TimeSlotPrice theo "giờ cao điểm / cuối tuần" sau
        BigDecimal totalHours = booking.getTotalHours();
        BigDecimal unitPrice  = new BigDecimal("70000");
        BigDecimal subTotal   = unitPrice.multiply(totalHours);

        detail.setBooking(booking);
        detail.setQuantity(totalHours);  // Số giờ chơi
        detail.setUnitPrice(unitPrice);  // Giá/giờ
        detail.setSubTotal(subTotal);

        return detail;
    }

    /**
     * Xây dựng PaymentDetail cho tiền nước / sản phẩm.
     */
    private PaymentDetail buildProductDetail(PaymentDetail detail,
                                             PaymentDetailRequest detailRequest) {
        Product product = productRepository.findById(detailRequest.getProductId())
                .orElseThrow(() -> new RuntimeException(
                        "Can not find Product with ID: " + detailRequest.getProductId()));

        BigDecimal quantity = (detailRequest.getQuantity() != null)
                ? detailRequest.getQuantity()
                : BigDecimal.ONE;

        BigDecimal unitPrice = product.getPrice();
        BigDecimal subTotal  = unitPrice.multiply(quantity);

        detail.setProduct(product);
        detail.setQuantity(quantity);
        detail.setUnitPrice(unitPrice);
        detail.setSubTotal(subTotal);

        return detail;
    }

    /**
     * Validate PaymentRequest: danh sách paymentDetails không được rỗng.
     */
    private void validatePaymentRequest(PaymentRequest paymentRequest) {
        if (paymentRequest.getPaymentDetails() == null
                || paymentRequest.getPaymentDetails().isEmpty()) {
            throw new RuntimeException("Danh sách PaymentDetail không được rỗng");
        }
    }

    /**
     * Validate từng PaymentDetailRequest:
     *  - Phải có ít nhất một trong: courtBooking, productId
     *  - courtBooking phải có đủ courtId, startTime, endTime
     */
    private void validateDetailRequest(PaymentDetailRequest detailRequest) {
        boolean hasCourtBooking = detailRequest.getCourtBooking() != null;
        boolean hasProductId   = detailRequest.getProductId() != null;

        // At least one of courtBooking or productId is required
        if (!hasCourtBooking && !hasProductId) {
            throw new RuntimeException(
                    "Mỗi PaymentDetail phải có ít nhất một trong: courtBooking, productId");
        }

        // Nếu dùng courtBooking inline thì phải đủ 3 trường
        if (hasCourtBooking) {
            CourtBookingRequest cbr = detailRequest.getCourtBooking();
            if (cbr.getCourtId() == null || cbr.getStartTime() == null || cbr.getEndTime() == null) {
                throw new RuntimeException(
                        "courtBooking phải có đủ courtId, startTime và endTime");
            }
        }
    }
}
