<<<<<<< HEAD
package com.smartzone.store.controller;

import com.smartzone.store.model.User;
import com.smartzone.store.payload.DangKyRequest;
import com.smartzone.store.payload.OtpVerificationRequest; // Cần tạo DTO này
import com.smartzone.store.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class DangKyController {

    private final UserService userService;

    public DangKyController(UserService userService) {
        this.userService = userService;
    }

    // --- ENDPOINT 1: GỬI MÃ OTP (Thay thế /register/validate) ---
    // URL: POST /api/auth/send-otp
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody DangKyRequest request) {
        try {
            // Chỉ gửi thông tin cần thiết để tạo OTP và gửi Email
            // Logic kiểm tra trùng lặp sẽ được thực hiện trong Service
            userService.createAndSendOtp(request.getTenDangNhap(), request.getEmail());
            
            // Lưu ý: Thông tin đăng ký đầy đủ (matKhau, hoTen,...) cần được lưu tạm thời
            // ở Frontend hoặc một cache riêng trong Service để dùng cho bước 3.
            
            return ResponseEntity.ok("Mã OTP đã được gửi đến email " + request.getEmail() + ". Mã có hiệu lực 5 phút.");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // --- ENDPOINT 2: XÁC THỰC OTP (Thay thế /register/otp) ---
    // URL: POST /api/auth/verify-otp
    // Sử dụng OtpVerificationRequest DTO mới (chỉ chứa tên đăng nhập và OTP)
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest request) {
        try {
            // Gọi Service để kiểm tra mã OTP, kiểm tra thời hạn
            userService.verifyOtp(request.getTenDangNhap(), request.getOtp());

            // Nếu không ném ngoại lệ, tức là mã OTP chính xác và còn hạn
            return ResponseEntity.ok("Xác thực OTP thành công. Vui lòng hoàn tất đăng ký.");
        } catch (RuntimeException e) {
            // Bắt các lỗi: Hết hạn, Mã không khớp, Không tồn tại
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // --- ENDPOINT 3: HOÀN TẤT ĐĂNG KÝ (MỚI - Chỉ chạy sau khi OTP hợp lệ) ---
    // URL: POST /api/auth/register-final
    @PostMapping("/register-final")
    public ResponseEntity<String> finalizeRegistration(@RequestBody DangKyRequest request) {
        try {
            // 1. Chuyển đổi từ Request DTO sang Entity User
            User user = new User();
            user.setTenDangNhap(request.getTenDangNhap());
            user.setMatKhau(request.getMatKhau()); 
            user.setHoTen(request.getHoTen());
            user.setEmail(request.getEmail());
            user.setSoDienThoai(request.getSoDienThoai());
            user.setDiaChi(request.getDiaChi());
            
            // 2. Gọi Service để lưu User vào DB và xóa OTP khỏi cache
            // Lưu ý: API này cần được bảo vệ để chỉ lưu khi OTP đã xác thực, 
            // nhưng vì bạn đã loại bỏ Spring Security, Frontend cần đảm bảo luồng này.
            userService.finalizeRegistration(user);

            return new ResponseEntity<>("Đăng ký tài khoản thành công!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
             // Bắt lỗi nếu tài khoản đã bị lưu/OTP bị xóa do hết hạn trước khi gọi API này
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
=======
package com.smartzone.store.controller;

import com.smartzone.store.model.User;
import com.smartzone.store.payload.DangKyRequest;
import com.smartzone.store.payload.OtpVerificationRequest; // Cần tạo DTO này
import com.smartzone.store.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class DangKyController {

    private final UserService userService;

    public DangKyController(UserService userService) {
        this.userService = userService;
    }

    // --- ENDPOINT 1: GỬI MÃ OTP (Thay thế /register/validate) ---
    // URL: POST /api/auth/send-otp
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody DangKyRequest request) {
        try {
            // Chỉ gửi thông tin cần thiết để tạo OTP và gửi Email
            // Logic kiểm tra trùng lặp sẽ được thực hiện trong Service
            userService.createAndSendOtp(request.getTenDangNhap(), request.getEmail());
            
            // Lưu ý: Thông tin đăng ký đầy đủ (matKhau, hoTen,...) cần được lưu tạm thời
            // ở Frontend hoặc một cache riêng trong Service để dùng cho bước 3.
            
            return ResponseEntity.ok("Mã OTP đã được gửi đến email " + request.getEmail() + ". Mã có hiệu lực 5 phút.");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // --- ENDPOINT 2: XÁC THỰC OTP (Thay thế /register/otp) ---
    // URL: POST /api/auth/verify-otp
    // Sử dụng OtpVerificationRequest DTO mới (chỉ chứa tên đăng nhập và OTP)
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest request) {
        try {
            // Gọi Service để kiểm tra mã OTP, kiểm tra thời hạn
            userService.verifyOtp(request.getTenDangNhap(), request.getOtp());

            // Nếu không ném ngoại lệ, tức là mã OTP chính xác và còn hạn
            return ResponseEntity.ok("Xác thực OTP thành công. Vui lòng hoàn tất đăng ký.");
        } catch (RuntimeException e) {
            // Bắt các lỗi: Hết hạn, Mã không khớp, Không tồn tại
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // --- ENDPOINT 3: HOÀN TẤT ĐĂNG KÝ (MỚI - Chỉ chạy sau khi OTP hợp lệ) ---
    // URL: POST /api/auth/register-final
    @PostMapping("/register-final")
    public ResponseEntity<String> finalizeRegistration(@RequestBody DangKyRequest request) {
        try {
            // 1. Chuyển đổi từ Request DTO sang Entity User
            User user = new User();
            user.setTenDangNhap(request.getTenDangNhap());
            user.setMatKhau(request.getMatKhau()); 
            user.setHoTen(request.getHoTen());
            user.setEmail(request.getEmail());
            user.setSoDienThoai(request.getSoDienThoai());
            user.setDiaChi(request.getDiaChi());
            
            // 2. Gọi Service để lưu User vào DB và xóa OTP khỏi cache
            // Lưu ý: API này cần được bảo vệ để chỉ lưu khi OTP đã xác thực, 
            // nhưng vì bạn đã loại bỏ Spring Security, Frontend cần đảm bảo luồng này.
            userService.finalizeRegistration(user);

            return new ResponseEntity<>("Đăng ký tài khoản thành công!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
             // Bắt lỗi nếu tài khoản đã bị lưu/OTP bị xóa do hết hạn trước khi gọi API này
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
>>>>>>> e748f32ad2f984ab7d66a0a4f40f683ba908937d
}