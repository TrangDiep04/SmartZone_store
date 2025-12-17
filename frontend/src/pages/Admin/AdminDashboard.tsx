import React from 'react';
import useAuth from '../../hooks/useAuth'; 
import Header from '../../components/UI/Header';
import AdminProductManager from './AdminProductManager';

const AdminDashboard: React.FC = () => {
    const { userRole } = useAuth();

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <Header />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Khu vực thông báo Admin */}
                <div style={{ 
                    padding: '20px', 
                    borderLeft: '5px solid #dc3545', 
                    marginBottom: '30px', 
                    borderRadius: '4px', 
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{ margin: 0, color: '#2d3436' }}>🛡️ Hệ thống Quản trị SmartZone</h1>
                    <p style={{ margin: '10px 0 0', color: '#636e72' }}>
                        Chào mừng <strong>Admin</strong>. Vai trò hiện tại: <span style={{ color: '#d63031' }}>{userRole}</span>
                    </p>
                </div>

                {/* Hiển thị Component quản lý sản phẩm */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <AdminProductManager />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;