package com.smartzone.store.controller;

import com.smartzone.store.payload.CartRequest;
import com.smartzone.store.model.CartItems;
import com.smartzone.store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{maKhachHang}")
    public List<CartItems> getCart(@PathVariable Integer maKhachHang) {
        return cartService.getCart(maKhachHang);
    }

    @PostMapping("/{maKhachHang}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable Integer maKhachHang,
            @RequestBody CartRequest request
    ) {
        cartService.addToCart(maKhachHang, request.getMaSanPham(), request.getSoLuong());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{maKhachHang}/remove/{maSanPham}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Integer maKhachHang,
            @PathVariable Integer maSanPham
    ) {
        cartService.removeFromCart(maKhachHang, maSanPham);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{maKhachHang}/removeSelected")
    public ResponseEntity<?> removeSelected(
            @PathVariable Integer maKhachHang,
            @RequestBody List<Integer> ids
    ) {
        cartService.removeSelected(maKhachHang, ids);
        return ResponseEntity.ok("Đã xoá các sản phẩm đã chọn");
    }
}