package com.smartzone.store.service;
import com.smartzone.store.model.Products;
import com.smartzone.store.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    //lay toan bo ds
    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Products> searchByName(String keyword) {
        return productRepository.findByTenSanPhamContainingIgnoreCase(keyword);
    }

    public List<Products> searchByBrand(String brand) {
        return productRepository.findByThuongHieuIgnoreCase(brand);
    }
}
