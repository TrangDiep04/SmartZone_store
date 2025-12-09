import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.tsx';
import RegisterPage from './pages/Auth/RegisterPage.tsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx';
import AdminDashboard from './pages/Admin/AdminDashboard.tsx';
import UserDashboard from './pages/User/UserDashboard';
import ProductList from './components/UI/ProductList';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import ProductDetail from './pages/User/ProductDetail';
import Cart from './pages/User/Cart'; // thêm giỏ hàng
import './styles/layout.css';

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <Header />
      </header>

      <main className="app-main">
        <div className="app-container">
          <Routes>
            {/* Tuyến công khai */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Trang chính (UserDashboard as root) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public product listing */}
            <Route path="/products" element={<ProductList />} />

            {/* Trang chi tiết sản phẩm */}
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Trang giỏ hàng */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Tuyến đặc biệt (Chỉ Admin mới truy cập được) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Xử lý 404 */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '100px' }}>
                  <h1>404</h1>
                  <p>Không tìm thấy trang.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

export default App;