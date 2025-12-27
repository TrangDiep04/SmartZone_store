import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginResponse {
  token: string;
  maKhachHang: number;
  tenDangNhap: string;
  hoTen?: string;
  vaiTro: string;
}

const authService = {
  // 1. Đăng nhập
  login: async (tenDangNhap: string, matKhau: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/login`, { tenDangNhap, matKhau });
    return response.data;
  },

  // 2. Bước 1: Gửi toàn bộ thông tin đăng ký để nhận mã OTP
  // Khớp với Endpoint: @PostMapping("/send-otp")
  sendOtp: async (userData: any) => {
    // Lưu ý: Gửi toàn bộ Object (DangKyRequest) vì Backend cần lấy Email và TenDangNhap
    const response = await axios.post(`${API_URL}/send-otp`, userData);
    return response.data;
  },

  // 3. Bước 2: Xác thực mã OTP
  // Khớp với Endpoint: @PostMapping("/verify-otp") nhận OtpVerificationRequest
  verifyOtp: async (tenDangNhap: string, otp: string) => {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      tenDangNhap,
      otp
    });
    return response.data;
  },

  // 4. Bước 3: Hoàn tất lưu vào Database (Finalize)
  // Khớp với Endpoint: @PostMapping("/register-final")
  registerFinal: async (userData: any) => {
    const response = await axios.post(`${API_URL}/register-final`, userData);
    return response.data;
  },

  // 5. Quên mật khẩu & Reset
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  }
};

export default authService;