package com.smartzone.store.payload;

// Thêm Lombok nếu bạn đã dùng, nếu không thì tự tạo Getters/Setters

public class OtpVerificationRequest {
    
    private String tenDangNhap;
    private String otp;

    // --- Constructor Mặc định ---
    public OtpVerificationRequest() {
    }

    // --- Constructor đầy đủ ---
    public OtpVerificationRequest(String tenDangNhap, String otp) {
        this.tenDangNhap = tenDangNhap;
        this.otp = otp;
    }

    // --- Getters và Setters ---
    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}