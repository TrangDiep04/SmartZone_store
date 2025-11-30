package com.smartzone.store.controller;
import com.smartzone.store.model.Products;
import com.smartzone.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
public class TimKiemController {
    @Autowired
    private ProductService productService;

//lay toan bo danh sach
    @GetMapping
    public List<Products> getAllProducts() {
        return productService.getAllProducts();
    }

    // Tìm theo tên sản phẩm
    @GetMapping("/search")
    public List<Products> searchByName(@RequestParam("keyword") String keyword) {
        return productService.searchByName(keyword);
    }

    // Tìm theo thương hiệu
    @GetMapping("/brand")
    public List<Products> searchByBrand(@RequestParam("name") String name) {
        return productService.searchByBrand(name);
    }

}
