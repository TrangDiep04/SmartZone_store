package com.smartzone.store.service;

import com.smartzone.store.model.Products;
import com.smartzone.store.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Lấy tất cả sản phẩm
    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

    // Lấy chi tiết sản phẩm theo ID
    public Products getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    // Tìm theo tên
    public List<Products> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    // Tìm theo thương hiệu
    public List<Products> searchByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    // Tìm theo danh mục
    public List<Products> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // Thêm sản phẩm mới
    public Products saveProduct(Products product) {
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    public Products updateProduct(Integer id, Products product) {
        Products existing = getProductById(id);

        // cập nhật các field từ entity Products
        existing.setName(product.getName());
        existing.setBrand(product.getBrand());
        existing.setImage(product.getImage());
        existing.setImage2(product.getImage2());
        existing.setImage3(product.getImage3());
        existing.setImage4(product.getImage4());
        existing.setImage5(product.getImage5());
        existing.setPrice(product.getPrice());
        existing.setDescription(product.getDescription());
        existing.setColor(product.getColor());
        existing.setStatus(product.getStatus());
        existing.setStock(product.getStock());
        existing.setCategory(product.getCategory());

        return productRepository.save(existing);
    }

    // Xóa sản phẩm
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}