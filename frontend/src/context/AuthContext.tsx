import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import authService from '../api/authService'; // Đã đổi tên thành .ts

type UserRole = 'Admin' | 'User' | null;

// Định nghĩa kiểu cho Context
interface AuthContextType {
    isLoggedIn: boolean;
    userRole: UserRole;
    isLoading: boolean;
    login: (tenDangNhap: string, matKhau: string) => Promise<UserRole>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Kiểu cho useState
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Kiểm tra trạng thái khi Component mount (tải lại trang)
    useEffect(() => {
        const role = localStorage.getItem('userRole') as UserRole;
        if (role) {
            setUserRole(role);
        }
        setIsLoading(false);
    }, []);

    const login = async (tenDangNhap: string, matKhau: string): Promise<UserRole> => {
        const data = await authService.login(tenDangNhap, matKhau);
        setUserRole(data.phanQuyen);
        return data.phanQuyen; 
    };

    const logout = () => {
        authService.logout();
        setUserRole(null);
    };

    const value: AuthContextType = {
        isLoggedIn: !!userRole,
        userRole,
        isLoading,
        login,
        logout
    };

    // Hiển thị trạng thái chờ khi đang kiểm tra LocalStorage
    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#007bff'}}>Đang tải dữ liệu xác thực...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};