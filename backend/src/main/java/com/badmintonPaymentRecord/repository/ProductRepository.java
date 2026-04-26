package com.badmintonPaymentRecord.repository;

import com.badmintonPaymentRecord.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Product getProductsById(Integer id);
    void deleteProductById(int id);
}