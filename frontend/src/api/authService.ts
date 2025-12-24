import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

export interface LoginResponse {
  maKhachHang: number;
  tenDangNhap: string;
  hoTen: string; 
  phanQuyen: "Admin" | "User";
  token?: string;
}

export interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
}

const authService = {
  login: async (tenDangNhap: string, matKhau: string): Promise<LoginResponse> => {
    const response = await axios.post(API_URL + "login", { tenDangNhap, matKhau });
    return response.data;
  },

  sendOtp: async (data: RegisterData) => {
    const response = await axios.post(API_URL + "send-otp", data);
    return response.data;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  }
};

export default authService;