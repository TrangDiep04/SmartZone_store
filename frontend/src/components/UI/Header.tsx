import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import '../../styles/Header.css';

const Header: React.FC = () => {
    const { isLoggedIn, userRole, userName, logout } = useAuth();
    const navigate = useNavigate();
    
    // State lưu số lượng sản phẩm trong giỏ
    const [cartCount, setCartCount] = useState<number>(0);

    // Hàm tính tổng số lượng từ localStorage
    const updateCartCount = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const cartItems = JSON.parse(savedCart);
                // Tính tổng quantity của tất cả item
                const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
                setCartCount(total);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Lỗi đọc giỏ hàng:", error);
            setCartCount(0);
        }
    };

    useEffect(() => {
        // Chạy ngay khi component load
        updateCartCount();

        // Lắng nghe sự kiện 'storage' (khi Tab khác thay đổi hoặc dispatch thủ công)
        window.addEventListener('storage', updateCartCount);

        // Dọn dẹp listener khi unmount
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const isUserValid = isLoggedIn && userName && userName !== "undefined";

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="site-logo">
                        <span className="logo-icon">S</span>
                        <span className="logo-text">SmartZone<span className="dot">Store</span></span>
                    </Link>
                </div>

                <div className="header-right">
                    <Link to="/cart" className="cart-link">
                        <span className="icon">🛒</span>
                        {/* HIỂN THỊ SỐ LƯỢNG THỰC TẾ */}
                        <span className="cart-badge">{cartCount}</span>
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
                                        <Link to="/admin/dashboard" className="admin-link">Quản trị</Link>
                                    )}
                                    <button 
                                        className="btn-logout-action" 
                                        onClick={() => { logout(); navigate('/login'); }}
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
                                <Link to="/register" className="register-primary-btn">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;