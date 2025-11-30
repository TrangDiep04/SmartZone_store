import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.tsx'; // Đã đổi tên file
import RegisterPage from './pages/Auth/RegisterPage.tsx'; // Đã đổi tên file
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'; // Đã đổi tên file
import AdminDashboard from './pages/Admin/AdminDashboard.tsx'; // Đã đổi tên file
import UserDashboard from './pages/User/UserDashboard';
import ProductList from './components/UI/ProductList';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import './styles/layout.css';

function App() {
    return (
        <div className="app-root">
            <header className="app-header"><Header /></header>
            <main className="app-main">
                <div className="app-container">
                    <Routes>
            {/* Tuyến công khai */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 

            {/* Trang chính (UserDashboard as root) */}
            <Route path="/" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            {/* Tuyến bảo vệ (Cần Đăng nhập) */}
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            {/* Public product listing (full paginated view) */}
            <Route path="/products" element={<ProductList />} />

            {/* Tuyến đặc biệt (Chỉ Admin mới truy cập được) */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="Admin"> 
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            {/* Xử lý 404 */}
            <Route path="*" element={<div style={{textAlign: 'center', padding: '100px'}}><h1>404</h1><p>Không tìm thấy trang.</p></div>} />
                    </Routes>
                </div>
            </main>
            <footer className="app-footer"><div className="footer-inner"><Footer /></div></footer>
        </div>
    );
}

export default App;