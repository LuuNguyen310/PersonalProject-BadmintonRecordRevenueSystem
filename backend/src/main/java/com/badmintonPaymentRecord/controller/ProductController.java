package com.badmintonPaymentRecord.controller;

import com.badmintonPaymentRecord.dto.request.ProductRequest;
import com.badmintonPaymentRecord.dto.response.ProductResponse;
import com.badmintonPaymentRecord.entity.Product;
import com.badmintonPaymentRecord.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Tag(name = "Product API", description = "API for managing products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Get a list of all products")
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    @Operation(summary = "Creating new product", description = "Create a new product")
    public ProductResponse createProduct(@RequestBody ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Update an existing product by ID")
    public ProductResponse updateProduct(@PathVariable("id") int id, @RequestBody ProductRequest productRequest) {
        return productService.updateProduct(id, productRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable("id") int id) {
        productService.deleteProduct(id);
    }
}
