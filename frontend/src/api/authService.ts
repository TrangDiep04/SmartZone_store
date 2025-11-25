import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
}

// Định nghĩa kiểu dữ liệu cho phản hồi đăng nhập
interface LoginResponse {
    // Backend currently returns these fields (no token, role is 'vaiTro')
    trangThai?: string;
    maKhachHang?: number | string;
    tenDangNhap?: string;
    vaiTro?: 'Admin' | 'User';
}

const API_URL = 'http://localhost:8080/api/auth/'; 

// Hàm Đăng nhập
const login = async (tenDangNhap: string, matKhau: string): Promise<{ token?: string; phanQuyen: 'Admin' | 'User' }> => {
    try {
        const response = await axios.post<LoginResponse>(API_URL + 'login', { tenDangNhap, matKhau });
        const data = response.data;

        // Backend uses `vaiTro` for role and doesn't return a token currently.
        const role: 'Admin' | 'User' = (data.vaiTro as 'Admin' | 'User') || 'User';

        // Store role in localStorage so AuthContext can initialize from it
        localStorage.setItem('userRole', role);

        // If backend later provides a token (or we map maKhachHang -> token), store it here
        if ((data as any).token) {
            localStorage.setItem('userToken', (data as any).token);
        } else if (data.maKhachHang) {
            // optional: keep the id as a lightweight token
            localStorage.setItem('userToken', String(data.maKhachHang));
        }

        return { token: localStorage.getItem('userToken') || undefined, phanQuyen: role };
    } catch (error) {
        throw (error as any).response?.data || "Đăng nhập thất bại.";
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