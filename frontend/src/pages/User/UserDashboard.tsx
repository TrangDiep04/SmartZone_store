import React from 'react';
import useAuth from '../../hooks/useAuth'; // Đã đổi tên thành .ts
import Header from '../../components/UI/Header'; // Đã đổi tên thành .tsx

const UserDashboard: React.FC = () => {
    const { userRole } = useAuth();
    return (
        <>
            <Header />
            <div style={{ padding: '20px', border: '2px solid #007bff', margin: '20px', borderRadius: '8px', backgroundColor: '#f4faff' }}>
                <h1>🛒 Trang Mua Sắm (USER)</h1>
                <p style={{fontSize: '1.1em', fontWeight: 'bold'}}>Chào mừng bạn đến với cửa hàng!</p>
                <p>Vai trò của bạn: **{userRole}**</p>
                <p>Hãy bắt đầu tìm kiếm sản phẩm ngay bây giờ.</p>
            </div>
        </>
    );
};
export default UserDashboard;