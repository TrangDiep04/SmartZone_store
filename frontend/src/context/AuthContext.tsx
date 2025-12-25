import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import authService, { type LoginResponse } from '../api/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  userName: string | null;
  userId: string | null;
  login: (tenDangNhap: string, matKhau: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Hàm lấy giá trị sạch từ localStorage
  const getSafeValue = (key: string) => {
    const val = localStorage.getItem(key);
    return (val && val !== "undefined" && val !== "null") ? val : null;
  };

  // Khởi tạo state trực tiếp từ localStorage để tránh "Đang xác thực"
  const [isLoggedIn, setIsLoggedIn] = useState(!!getSafeValue('token'));
  const [userRole, setUserRole] = useState<string | null>(getSafeValue('userRole'));
  const [userName, setUserName] = useState<string | null>(getSafeValue('userName'));
  const [userId, setUserId] = useState<string | null>(getSafeValue('userId'));

  const login = async (tenDangNhap: string, matKhau: string): Promise<string> => {
    try {
      const data: LoginResponse = await authService.login(tenDangNhap, matKhau);
     // const role = data.phanQuyen; // Ví dụ: "Admin" hoặc "User"
     //them cai nay
     const roleMap: Record<string, string> = {
         'admin': 'Admin',
         'user': 'User'
       };
       const rawRole = (data.vaiTro || 'user').toLowerCase(); // lowercase để map
       const role = roleMap[rawRole] || 'User';

     //const rawRole = data.phanQuyen || "User";  // backend trả gì lấy đó, default User
    // const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
      const displayName = data.hoTen || data.tenDangNhap || "Thành viên";
      const uId = String(data.maKhachHang || data.id);

      // Lưu LocalStorage trước
      localStorage.setItem('token', data.token || 'secret-token');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', displayName);
      localStorage.setItem('userId', uId);

      // Cập nhật State sau
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(displayName);
      setUserId(uId);
       console.log('Login response data:', data);
       console.log('Parsed role:', role);
      return role;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setUserId(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userName, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};