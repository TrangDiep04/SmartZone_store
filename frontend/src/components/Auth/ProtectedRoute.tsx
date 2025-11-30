import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'Admin' | 'User';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isLoggedIn, userRole, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2em'}}>Đang kiểm tra quyền...</div>; 
    }

    if (!isLoggedIn) {
        // Chưa đăng nhập: Bắt buộc chuyển về trang login
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Sai vai trò: Chuyển về trang mà user có quyền truy cập
        const redirectPath = userRole === 'User' ? '/user/dashboard' : '/';
        // Thay alert() bằng console.error() hoặc một modal/toast UI trong ứng dụng thực tế
        console.error(`Bạn không có quyền truy cập trang này (Yêu cầu: ${requiredRole}, Quyền của bạn: ${userRole}).`);
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};
export default ProtectedRoute;