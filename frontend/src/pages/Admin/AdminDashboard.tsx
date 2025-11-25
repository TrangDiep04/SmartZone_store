import React from 'react';
import useAuth from '../../hooks/useAuth'; 
import Header from '../../components/UI/Header';
const AdminDashboard: React.FC = () => {
    const { userRole } = useAuth();
    return (
        <>
            <Header />
            <div style={{ padding: '20px', border: '2px solid #dc3545', margin: '20px', borderRadius: '8px', backgroundColor: '#fff8f8' }}>
                <h1>🛡️ Trang Quản Trị (ADMIN)</h1>
                <p style={{fontSize: '1.1em', fontWeight: 'bold'}}>Xin chào, Admin!</p>
                <p>Vai trò của bạn: **{userRole}**</p>
                <p>Từ đây, bạn có thể truy cập các chức năng Quản lý Sản phẩm và Quản lý Đơn hàng.</p>
            </div>
        </>
    );
};
export default AdminDashboard;