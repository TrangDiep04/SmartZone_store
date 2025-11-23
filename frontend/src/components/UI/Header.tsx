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
        <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '15px 40px', backgroundColor: '#343a40', color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold' }}>
                SmartZone Store
            </Link>
            <nav style={{display: 'flex', alignItems: 'center'}}>
                {isLoggedIn ? (
                    <>
                        <span style={{marginRight: '15px', padding: '5px 10px', backgroundColor: userRole === 'Admin' ? '#dc3545' : '#007bff', borderRadius: '4px', fontSize: '0.9em'}}>
                            {userRole}
                        </span>
                        {userRole === 'Admin' && <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Quản trị</Link>}
                        
                        <button onClick={handleLogout} style={{
                            padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
                        }}>
                            Đăng Xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Đăng nhập</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Đăng ký</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;