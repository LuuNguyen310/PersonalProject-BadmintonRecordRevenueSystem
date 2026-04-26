package com.badmintonPaymentRecord.service.impl;

import com.badmintonPaymentRecord.dto.request.ProductRequest;
import com.badmintonPaymentRecord.dto.response.ProductResponse;
import com.badmintonPaymentRecord.entity.Product;
import com.badmintonPaymentRecord.mapper.ProductMapper;
import com.badmintonPaymentRecord.repository.ProductRepository;
import com.badmintonPaymentRecord.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return productMapper.toResponseList(products);
    }

    @Override
    @Transactional
    public void deleteProduct(int id) {
        productRepository.deleteProductById(id);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(int id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setName(productRequest.getName());
        product.setPrice(java.math.BigDecimal.valueOf(productRequest.getPrice()));
        product.setCategory(productRequest.getCategory());
        productRepository.save(product);
        return productMapper.toResponse(product);
    }
}
