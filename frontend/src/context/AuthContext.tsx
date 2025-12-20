import React, { createContext, useState, useContext, type ReactNode } from 'react';
import authService, { type LoginResponse } from '../api/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  userName: string | null;
  login: (tenDangNhap: string, matKhau: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getSafeValue = (key: string) => {
    const val = localStorage.getItem(key);
    return (val && val !== "undefined" && val !== "null") ? val : null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!getSafeValue('token'));
  const [userRole, setUserRole] = useState(getSafeValue('userRole'));
  const [userName, setUserName] = useState(getSafeValue('userName'));

  const login = async (tenDangNhap: string, matKhau: string): Promise<string> => {
    try {
      const data: LoginResponse = await authService.login(tenDangNhap, matKhau);
      
      const displayName = data.hoTen || data.tenDangNhap || "Thành viên";
      // Đảm bảo lấy đúng phanQuyen từ backend
      const role = data.phanQuyen; 

      // BƯỚC QUAN TRỌNG: Lưu vào localStorage TRƯỚC khi cập nhật State
      localStorage.setItem('token', data.token || 'secret-token');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', displayName);

      // Cập nhật State
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(displayName);

      return role; // Trả về role để LoginPage dùng navigate
    } catch (error) {
      console.error("Login Context Error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout(); // Gọi hàm logout từ service (xử lý redirect nếu cần)
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};