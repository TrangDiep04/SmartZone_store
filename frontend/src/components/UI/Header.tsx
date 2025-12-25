import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Header: React.FC = () => {
  const { isLoggedIn, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();

  const isUserValid = isLoggedIn && userName && userName !== "undefined";

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="site-logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">
              SmartZone<span className="dot">Store</span>
            </span>
          </Link>
        </div>

        <div className="header-right">
          {/* Icon giỏ hàng */}
          <Link to="/cart" className="cart-link">
            <span className="icon">🛒</span>
          </Link>

          {/* Icon đơn hàng */}
          <Link to="/orders" className="orders-link" style={{ marginLeft: "15px" }}>
            <AssignmentTurnedInIcon style={{ fontSize: 28, color: "#1976d2" }} />
          </Link>

          <div className="auth-group">
            {isUserValid ? (
              <div className="user-logged-in">
                <div className="user-profile-info">
                  <span className="greeting">Xin chào,</span>
                  <span className="display-name">{userName}</span>
                </div>
                <div className="user-actions">
                  {userRole === 'Admin' && (
                    <Link to="/admin/dashboard" className="admin-link">
                      Quản trị
                    </Link>
                  )}
                  <button
                    className="btn-logout-action"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="user-guest">
                <Link to="/login" className="login-text-link">
                  <span className="icon-guest">👤</span> Đăng nhập
                </Link>
                <Link to="/register" className="register-primary-btn">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;