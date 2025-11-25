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
            // Validate required fields
            if (request.getTenDangNhap() == null || request.getTenDangNhap().trim().isEmpty()) {
                return new ResponseEntity<>("Tên đăng nhập không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getMatKhau() == null || request.getMatKhau().trim().isEmpty()) {
                return new ResponseEntity<>("Mật khẩu không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return new ResponseEntity<>("Email không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getHoTen() == null || request.getHoTen().trim().isEmpty()) {
                return new ResponseEntity<>("Họ tên không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getSoDienThoai() == null || request.getSoDienThoai().trim().isEmpty()) {
                return new ResponseEntity<>("Số điện thoại không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getDiaChi() == null || request.getDiaChi().trim().isEmpty()) {
                return new ResponseEntity<>("Địa chỉ không được để trống.", HttpStatus.BAD_REQUEST);
            }
            if (request.getGioiTinh() == null || request.getGioiTinh().trim().isEmpty()) {
                return new ResponseEntity<>("Giới tính không được để trống.", HttpStatus.BAD_REQUEST);
            }
            
            // 1. Chuyển đổi từ Request DTO sang Entity User
            User user = new User();
            user.setTenDangNhap(request.getTenDangNhap().trim());
            user.setMatKhau(request.getMatKhau()); 
            user.setHoTen(request.getHoTen().trim());
            user.setEmail(request.getEmail().trim());
            user.setSoDienThoai(request.getSoDienThoai().trim());
            user.setDiaChi(request.getDiaChi().trim());
            user.setGioiTinh(request.getGioiTinh().trim());
            
            // 2. Gọi Service để lưu User vào DB
            userService.finalizeRegistration(user);

            // Always return 201 CREATED on success (or if data already saved)
            return new ResponseEntity<>("Đăng ký tài khoản thành công!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Bắt lỗi từ service
            System.err.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Bắt tất cả các lỗi khác (database constraint violations, etc.)
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
