package com.badmintonPaymentRecord.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "\"Booking\"")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"bookingID\"", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"courtID\"")
    private Court court;

    @Column(name = "\"startTime\"")
    private Instant startTime;

    @Column(name = "\"endTime\"")
    private Instant endTime;

    @Column(name = "\"totalHours\"", precision = 5, scale = 2)
    private BigDecimal totalHours;

    @OneToMany(mappedBy = "booking")
    private Set<PaymentDetail> paymentDetails = new LinkedHashSet<>();


}