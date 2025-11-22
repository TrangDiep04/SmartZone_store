<<<<<<< HEAD
package com.smartzone.store.payload;

public class DangNhapRequest {
    
    private String tenDangNhap;
    private String matKhau;

    // Constructors
    public DangNhapRequest() {
    }

    public DangNhapRequest(String tenDangNhap, String matKhau) {
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
    }

    // Getters và Setters (BẮT BUỘC cho Spring Boot)
    
    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
=======
package com.smartzone.store.payload;

public class DangNhapRequest {
    
    private String tenDangNhap;
    private String matKhau;

    // Constructors
    public DangNhapRequest() {
    }

    public DangNhapRequest(String tenDangNhap, String matKhau) {
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
    }

    // Getters và Setters (BẮT BUỘC cho Spring Boot)
    
    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
>>>>>>> e748f32ad2f984ab7d66a0a4f40f683ba908937d
}