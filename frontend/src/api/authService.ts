import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
}

// Định nghĩa kiểu dữ liệu cho phản hồi đăng nhập
interface LoginResponse {
    token: string;
    phanQuyen: 'Admin' | 'User';
}

const API_URL = 'http://localhost:8080/api/auth/'; 

// Hàm Đăng nhập
const login = async (tenDangNhap: string, matKhau: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(API_URL + 'login', { tenDangNhap, matKhau });
        
        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userRole', response.data.phanQuyen);
        }
        return response.data;
    } catch (error) {
        throw (error as any).response?.data?.message || "Đăng nhập thất bại.";
    }
};

// Hàm gửi OTP (Bước 1 Đăng ký)
const sendOtp = (data: UserData) => axios.post(API_URL + 'send-otp', data);

// Hàm xác thực OTP (Bước 2 Đăng ký)
const verifyOtp = (tenDangNhap: string, otp: string) => axios.post(API_URL + 'verify-otp', { tenDangNhap, otp });

// Hàm hoàn tất đăng ký (Bước 3 Đăng ký)
const registerFinal = (data: UserData) => axios.post(API_URL + 'register-final', data);

// Hàm Đăng xuất
const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
};

const authService = { login, logout, sendOtp, verifyOtp, registerFinal };
export default authService;