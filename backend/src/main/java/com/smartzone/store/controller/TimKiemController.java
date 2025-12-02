package com.smartzone.store.controller;

import com.smartzone.store.model.Products;
import com.smartzone.store.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class TimKiemController {

    private final ProductService productService;

    public TimKiemController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy toàn bộ sản phẩm
    @GetMapping
    public List<Products> getAllProducts() {
        return productService.getAllProducts();
    }

    // Tìm theo tên sản phẩm
    @GetMapping("/search")
    public List<Products> searchByName(@RequestParam String keyword) {
        return productService.searchByName(keyword);
    }

    // Tìm theo thương hiệu
    @GetMapping("/brand")
    public List<Products> searchByBrand(@RequestParam String brand) {
        return productService.searchByBrand(brand);
    }

    // Tìm theo danh mục
    @GetMapping("/category/{categoryId}")
    public List<Products> getProductsByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
}