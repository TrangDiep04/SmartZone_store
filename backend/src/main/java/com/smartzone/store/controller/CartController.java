package com.smartzone.store.controller;

import com.smartzone.store.payload.CartRequest;
import com.smartzone.store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Đảm bảo React có thể truy cập
public class CartController {

    @Autowired
    private CartService cartService;

    // 1. Lấy danh sách sản phẩm trong giỏ (Sửa lỗi 404 & AxiosError)
    @GetMapping("/{maKhachHang}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Integer maKhachHang) {
        try {
            // Nếu không tìm thấy hoặc giỏ trống, trả về mảng rỗng [] thay vì lỗi
            return ResponseEntity.ok(cartService.getCartItems(maKhachHang));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Lỗi khi tải giỏ hàng: " + e.getMessage());
        }
    }

    // 2. Thêm sản phẩm hoặc cập nhật số lượng
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        try {
            cartService.addProductToCart(
                request.getMaKhachHang(), 
                request.getMaSanPham(), 
                request.getSoLuong()
            );
            return ResponseEntity.ok("Thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi thêm vào giỏ: " + e.getMessage());
        }
    }

    // 3. Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(
            @RequestParam Integer maKhachHang, 
            @RequestParam Integer maSanPham) {
        try {
            cartService.removeItemFromCart(maKhachHang, maSanPham);
            return ResponseEntity.ok("Đã xóa sản phẩm");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }
}