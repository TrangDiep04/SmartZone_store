package com.smartzone.store.controller;

import com.smartzone.store.payload.CartRequest;
import com.smartzone.store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*") // Cho phép React (cổng 3000) gọi sang Spring Boot (cổng 8080) mà không bị chặn
public class CartController {

    @Autowired
    private CartService cartService;

    // API: Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        try {
            cartService.addProductToCart(
                request.getMaKhachHang(), 
                request.getMaSanPham(), 
                request.getSoLuong()
            );
            return ResponseEntity.ok("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (Exception e) {
            // Trả về lỗi nếu có vấn đề (ví dụ: không tìm thấy User hoặc Product)
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}