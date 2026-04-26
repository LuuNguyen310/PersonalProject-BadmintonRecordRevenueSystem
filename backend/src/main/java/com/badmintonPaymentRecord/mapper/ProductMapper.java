package com.badmintonPaymentRecord.mapper;

import com.badmintonPaymentRecord.dto.request.ProductRequest;
import com.badmintonPaymentRecord.dto.response.ProductResponse;
import com.badmintonPaymentRecord.entity.Product;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
    List<ProductResponse> toResponseList(List<Product> products);
    Product toProduct(ProductRequest productRequest);
}
