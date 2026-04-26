package com.badmintonPaymentRecord.service;

import com.badmintonPaymentRecord.dto.request.ProductRequest;
import com.badmintonPaymentRecord.dto.response.ProductResponse;
import com.badmintonPaymentRecord.entity.Product;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    void deleteProduct(int id);
    ProductResponse createProduct(ProductRequest productRequest);
    ProductResponse updateProduct(int id, ProductRequest productRequest);
}
