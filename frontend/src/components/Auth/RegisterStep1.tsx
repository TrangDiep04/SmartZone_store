import React, { useState } from 'react';
import authService from '../../api/authService';

interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
}

interface RegisterFormProps {
    onSuccess: (data: RegisterData) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [data, setData] = useState<RegisterData>({
        tenDangNhap: '', matKhau: '', email: '', hoTen: '', soDienThoai: '', diaChi: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await authService.sendOtp(data);
            console.log(`Mã OTP đã được gửi đến email ${data.email}.`);
            onSuccess(data); // Chuyển sang bước 2 và truyền data tạm thời
        } catch (err) {
            const resp = (err as any).response?.data;
            setError(resp || (err as Error).message || "Lỗi gửi OTP.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            {} 
            
             <h2>Đăng Ký</h2>
            <div className="input-field">
                <input type="text" name="tenDangNhap" onChange={handleChange} placeholder="Tên đăng nhập" required />
            </div>
            <div className="input-field">
                <input type="password" name="matKhau" onChange={handleChange} placeholder="Mật khẩu" required />
            </div>
            <div className="input-field">
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="input-field">
                <input type="text" name="hoTen" onChange={handleChange} placeholder="Họ Tên" required />
            </div>
            <div className="input-field">
                <input type="text" name="soDienThoai" onChange={handleChange} placeholder="Số điện thoại" required />
            </div>
            <div className="input-field">
                <input type="text" name="diaChi" onChange={handleChange} placeholder="Địa chỉ" required />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">Đăng ký</button>
        </form>
    );
};

export default RegisterForm;