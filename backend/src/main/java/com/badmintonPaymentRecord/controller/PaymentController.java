package com.badmintonPaymentRecord.controller;

import com.badmintonPaymentRecord.dto.request.PaymentRequest;
import com.badmintonPaymentRecord.dto.request.UpdatePaymentRequest;
import com.badmintonPaymentRecord.dto.response.PaymentResponse;
import com.badmintonPaymentRecord.entity.Court;
import com.badmintonPaymentRecord.entity.Payment;
import com.badmintonPaymentRecord.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
@Tag(name = "Payment API", description = "API for managing payments")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payments", description = "Get a list of all payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/by-date")
    @Operation(summary = "Get payments by date", description = "Get a list of payments by date (format: yyyy-MM-dd)")
    public List<PaymentResponse> getAllPaymentsByDate(@RequestParam("date") String date) {
        return paymentService.getAllPaymentsByDate(date);
    }

    @PostMapping
    @Operation(summary = "Create a payment", description = "Create a new payment")
    public PaymentResponse createPayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.createPayment(paymentRequest);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a payment", description = "Update an existing payment by ID")
    public PaymentResponse updatePayment(@PathVariable("id") int id, @RequestBody UpdatePaymentRequest updatePaymentRequest) {
        return paymentService.updatePayment(id, updatePaymentRequest);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a payment", description = "Delete a payment by ID")
    public void deletePayment(@PathVariable("id") int id) {
        paymentService.deletePayment(id);
    }

}
