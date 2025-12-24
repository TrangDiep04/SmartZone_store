import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'Admin' | 'User';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isLoggedIn, userRole } = useAuth();

  // Lấy giá trị trực tiếp từ localStorage để dự phòng cho State
  const localRole = localStorage.getItem('userRole');
  const currentRole = userRole || localRole;

  // 1. Nếu không có token -> Về Login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã có isLoggedIn mà chưa có bất kỳ role nào (cả state lẫn local) -> Mới hiện Loading
  if (isLoggedIn && !currentRole) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang xác thực...</div>;
  }

  // 3. Kiểm tra quyền (So sánh không phân biệt hoa thường để tránh lỗi Admin vs ADMIN)
  if (requiredRole && currentRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    const redirectPath = currentRole?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;