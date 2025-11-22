package com.smartzone.store.service;

import com.smartzone.store.model.User;
import com.smartzone.store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    // Lớp nội bộ để lưu trữ OTP và thời gian hết hạn
    private static class OtpDetails {
        private final String otp;
        private final long expiryTime; 

        public OtpDetails(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() { return otp; }
        public long getExpiryTime() { return expiryTime; }
    }

    private final UserRepository userRepository;
    private final JavaMailSender mailSender; // Thêm JavaMailSender
    
    // Cache: Tên đăng nhập -> OtpDetails (OTP + Thời gian hết hạn)
    private final ConcurrentHashMap<String, OtpDetails> otpCache = new ConcurrentHashMap<>();
    
    // OTP chỉ có giá trị trong 5 phút
    private static final long OTP_VALIDITY_MS = 5 * 60 * 1000; 

    @Autowired
    public UserService(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    // =================================================================
    // LOGIC 1: GỬI OTP (Kiểm tra trùng lặp, sinh mã, gửi email, lưu cache)
    // =================================================================
    public void createAndSendOtp(String tenDangNhap, String email) {
        // 1. Kiểm tra trùng lặp
        if (userRepository.findByTenDangNhap(tenDangNhap).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }

        // 2. Sinh OTP và tính thời gian hết hạn
        String generatedOtp = generateRandomOtp();
        long expiryTime = System.currentTimeMillis() + OTP_VALIDITY_MS;
        
        // 3. Lưu vào Cache: key=tenDangNhap, value={OTP, Expiry Time}
        otpCache.put(tenDangNhap, new OtpDetails(generatedOtp, expiryTime));

        // 4. Gửi Email
        sendOtpEmail(email, generatedOtp);
    }
    
    // =================================================================
    // LOGIC 2: XÁC THỰC OTP (Kiểm tra hết hạn và khớp mã)
    // =================================================================
    public boolean verifyOtp(String tenDangNhap, String inputOtp) {
        OtpDetails details = otpCache.get(tenDangNhap);

        if (details == null) {
            // Trường hợp: Chưa gửi, đã hết hạn và bị xóa cache, hoặc đã đăng ký xong.
            throw new RuntimeException("Mã OTP không hợp lệ hoặc phiên đăng ký đã kết thúc.");
        }

        // 1. Kiểm tra Hết hạn (Xử lý ngoại lệ)
        if (System.currentTimeMillis() > details.getExpiryTime()) {
            otpCache.remove(tenDangNhap); // Xóa khỏi cache khi hết hạn
            throw new RuntimeException("Mã OTP đã hết hạn (hơn 5 phút). Vui lòng gửi lại.");
        }

        // 2. Kiểm tra Khớp mã
        if (!details.getOtp().equals(inputOtp)) {
            // Không xóa cache ở đây để người dùng có thể nhập lại trong thời hạn
            throw new RuntimeException("Mã OTP không chính xác. Vui lòng kiểm tra email.");
        }
        
        // 3. Xác thực thành công
        return true;
    }

    // =================================================================
    // LOGIC 3: ĐĂNG KÝ CUỐI CÙNG (Lưu User và xóa Cache)
    // =================================================================
    public void finalizeRegistration(User user) {
        // Kiểm tra User đã tồn tại trong cache chưa (đã xác thực OTP)
        if (!otpCache.containsKey(user.getTenDangNhap())) {
             throw new RuntimeException("Yêu cầu đăng ký không hợp lệ. Vui lòng xác thực lại OTP.");
        }
        
        // 1. Gán vai trò mặc định (User/Khách hàng)
        user.setPhanQuyen("User");
        
        // 2. Lưu User vào DB
        userRepository.save(user);
        
        // 3. Dọn dẹp OTP khỏi cache sau khi đăng ký thành công
        otpCache.remove(user.getTenDangNhap());
    }

    // =================================================================
    // PHƯƠNG THỨC HỖ TRỢ
    // =================================================================

    // Gửi Email OTP
    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("DIEN_DIA_CHI_EMAIL_CUA_BAN@gmail.com"); // Thay thế bằng email cấu hình
        message.setTo(toEmail);
        message.setSubject("Mã Xác Thực Đăng Ký Cửa Hàng SmartZone");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã này sẽ hết hạn trong 5 phút. Vui lòng không chia sẻ mã này.");
        
        try {
             mailSender.send(message);
        } catch (Exception e) {
             // Xử lý lỗi gửi email
             throw new RuntimeException("Không thể gửi mã OTP. Vui lòng kiểm tra lại địa chỉ email.");
        }
    }

    // Sinh OTP ngẫu nhiên 6 chữ số
    private String generateRandomOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
    
    // Phương thức cần thiết cho Đăng nhập
    public Optional<User> findByTenDangNhap(String tenDangNhap) {
        return userRepository.findByTenDangNhap(tenDangNhap);
    }
}