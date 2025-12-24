import React, { useState } from 'react';
import AdminProductManager from './AdminProductManager';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'stats'>('products');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* SIDEBAR */}
            <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white' }}>
                <div style={{ padding: '30px 20px', fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid #34495e' }}>
                    SmartZone Admin
                </div>
                <nav style={{ padding: '20px 0' }}>
                    <div onClick={() => setActiveTab('products')} style={{...navItem, backgroundColor: activeTab === 'products' ? '#34495e' : ''}}>
                        📦 Quản lý Sản phẩm
                    </div>
                    <div onClick={() => setActiveTab('stats')} style={{...navItem, backgroundColor: activeTab === 'stats' ? '#34495e' : ''}}>
                        📊 Thống kê báo cáo
                    </div>
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, padding: '30px' }}>
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ margin: 0 }}>{activeTab === 'products' ? 'Sản phẩm' : 'Thống kê'}</h1>
                </header>
                
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    {activeTab === 'products' ? <AdminProductManager /> : <div>Biểu đồ đang cập nhật...</div>}
                </div>
            </div>
        </div>
    );
};

const navItem: React.CSSProperties = { padding: '15px 25px', cursor: 'pointer', transition: '0.3s' };
export default AdminDashboard;