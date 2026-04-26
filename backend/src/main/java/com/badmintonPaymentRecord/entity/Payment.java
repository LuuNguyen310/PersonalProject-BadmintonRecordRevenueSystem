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
@Table(name = "\"Payment\"")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"paymentID\"", nullable = false)
    private Integer id;

    @Column(name = "\"paymentType\"", length = Integer.MAX_VALUE)
    private String paymentType;

    @Column(name = "total", precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "\"paymentDate\"")
    private Instant paymentDate;

    @Column(name = "note", length = Integer.MAX_VALUE)
    private String note;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PaymentDetail> paymentDetails = new LinkedHashSet<>();


}