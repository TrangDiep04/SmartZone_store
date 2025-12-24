import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import UserDashboard from './pages/User/UserDashboard';
import ProductDetail from './pages/User/ProductDetail';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Cart from './pages/User/Cart';
import Order from './pages/User/order/Order';
import Orders from './pages/User/OrderList';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Snowfall from './components/UI/Snowfall'; // <— Thêm dòng này
import './App.css';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-root">
      {/* Nền tuyết — để dưới header/footer nhưng trên nền */}
      {!isAuthPage && <Snowfall count={160} speed={1} maxSize={3} />}

      {!isAuthPage && (
        <header className="app-header">
          <Header />
        </header>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1 style={{ textAlign: 'center' }}>404</h1>} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
