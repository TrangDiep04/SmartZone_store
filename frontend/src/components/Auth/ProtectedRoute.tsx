import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đúng đường dẫn và dùng { useAuth }

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'Admin' | 'User';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isLoggedIn, userRole, userName } = useAuth();

    // Nếu dữ liệu user chưa kịp load từ localStorage
    if (isLoggedIn && !userRole) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Đang xác thực...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Nếu là Admin đi nhầm vào User page hoặc ngược lại
        const redirectPath = userRole === 'Admin' ? '/admin/dashboard' : '/';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;