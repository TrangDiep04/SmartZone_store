import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Đã đổi tên thành .ts

const LoginPage: React.FC = () => {
    const [tenDangNhap, setTenDangNhap] = useState<string>('');
    const [matKhau, setMatKhau] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const role = await login(tenDangNhap, matKhau); 

            if (role === 'Admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/user/dashboard', { replace: true });
            }

        } catch (err: unknown) {
            const errorMessage = typeof err === 'string' 
                ? err 
                : "Đăng nhập thất bại. Vui lòng thử lại.";
            setError(errorMessage); 
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng Nhập Hệ Thống</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Tên đăng nhập" 
                       value={tenDangNhap} onChange={(e) => setTenDangNhap(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" 
                       value={matKhau} onChange={(e) => setMatKhau(e.target.value)} required />
                
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Đăng Nhập</button>
            </form>
            <p style={{marginTop: '20px'}}>
                Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
        </div>
    );
};

export default LoginPage;