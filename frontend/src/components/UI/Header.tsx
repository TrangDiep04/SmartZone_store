import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; 

const Header: React.FC = () => {
    const { isLoggedIn, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="header-inner">
            <div className="header-left">
                <Link to="/" className="site-logo">SmartZone Store</Link>
            </div>

            <nav className="header-right">
                <span className="nav-badge">
                  <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }} title="Giỏ hàng">🛒</Link>
                  {/* badge-count can be filled when cart exists */}
                </span>
                {isLoggedIn ? (
                    <>
                        <span style={{marginRight: '8px', padding: '4px 8px', backgroundColor: userRole === 'Admin' ? '#dc3545' : '#007bff', borderRadius: '4px', fontSize: '0.85rem'}}>
                            {userRole}
                        </span>
                        {userRole === 'Admin' && <Link to="/admin/dashboard" className="nav-button" style={{ color: 'white' }}>Quản trị</Link>}
                        <button onClick={handleLogout} className="nav-button" style={{ background: '#6c757d' }}>
                            Đăng Xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-button" style={{ color: 'white' }}>Đăng nhập</Link>
                        <Link to="/register" className="nav-button" style={{ color: 'white' }}>Đăng ký</Link>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Header;