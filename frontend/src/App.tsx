import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.tsx'; // Đã đổi tên file
import RegisterPage from './pages/Auth/RegisterPage.tsx'; // Đã đổi tên file
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'; // Đã đổi tên file
import UserDashboard from './pages/User/UserDashboard.tsx'; // Đã đổi tên file
import AdminDashboard from './pages/Admin/AdminDashboard.tsx'; // Đã đổi tên file

function App() {
    return (
        <Routes>
            {/* Tuyến công khai */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 

            {/* Tuyến bảo vệ (Cần Đăng nhập) */}
            <Route path="/" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

            {/* Tuyến đặc biệt (Chỉ Admin mới truy cập được) */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="Admin"> 
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            {/* Xử lý 404 */}
            <Route path="*" element={<div style={{textAlign: 'center', padding: '100px'}}><h1>404</h1><p>Không tìm thấy trang.</p></div>} />
        </Routes>
    );
}

export default App;