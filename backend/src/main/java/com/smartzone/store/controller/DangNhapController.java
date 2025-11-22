package com.smartzone.store.controller;

import com.smartzone.store.model.User;
import com.smartzone.store.payload.DangNhapRequest;
import com.smartzone.store.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class DangNhapController {

    // Thay thế AuthenticationManager bằng UserRepository
    private final UserRepository userRepository;

    // Thay đổi constructor
    public DangNhapController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Khớp với biểu đồ: kiemTraHopLe()
    @PostMapping("/login")
    public ResponseEntity<?> kiemTraHopLe(@RequestBody DangNhapRequest request) {
        
        // 1. Tìm User
        User user = userRepository.findByTenDangNhap(request.getTenDangNhap())
            .orElse(null);
        
        // 2. So sánh mật khẩu thô (Không mã hóa)
        if (user != null && user.getMatKhau().equals(request.getMatKhau())) {
            
            // Đăng nhập thành công, chuẩn bị thông tin phản hồi
            String vaiTro = user.getPhanQuyen(); // Lấy vai trò (Admin/User)
            
            // Trả về dữ liệu cần thiết cho Frontend (Admin, User)
            Map<String, Object> response = new HashMap<>();
            response.put("trangThai", "Đăng nhập thành công");
            response.put("maKhachHang", user.getMaKhachHang());
            response.put("tenDangNhap", user.getTenDangNhap());
            response.put("vaiTro", vaiTro != null ? vaiTro : "User"); // Luôn có vai trò

            return ResponseEntity.ok(response);
            
        } else {
            // Sai tên đăng nhập hoặc mật khẩu
            return new ResponseEntity<>("Sai tên đăng nhập hoặc mật khẩu.", HttpStatus.UNAUTHORIZED);
        }
    }
}