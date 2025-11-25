import React, { useState } from 'react';
import authService from '../../api/authService';
interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
}

interface RegisterFormProps {
    onSuccess: (data: RegisterData) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [data, setData] = useState<RegisterData>({
        tenDangNhap: '', matKhau: '', email: '', hoTen: '', soDienThoai: '', diaChi: '', gioiTinh: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, gioiTinh: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const trimmedData = {
                ...data,
                tenDangNhap: data.tenDangNhap.trim(),
                email: data.email.trim(),
                hoTen: data.hoTen.trim(),
                soDienThoai: data.soDienThoai.trim(),
                diaChi: data.diaChi.trim(),
                gioiTinh: data.gioiTinh.trim()
            };
            
            await authService.sendOtp(trimmedData);
            console.log(`Mã OTP đã được gửi đến email ${trimmedData.email}.`);
            onSuccess(trimmedData); 
        } catch (err) {
            const resp = (err as any).response?.data;
            setError(resp || (err as Error).message || "Lỗi gửi OTP.");
        }
    };

    return (
       <form onSubmit={handleSubmit} className="register-form">
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
   <div className="input-field gender-box">
    <label style={{ display: 'block', marginBottom: '6px', textAlign: 'left' }}>Giới tính:</label>
    <div className="gender-options">
        <label className="radio-label">
            <input
                type="radio"
                name="gioiTinh"
                value="Nam"
                checked={data.gioiTinh === 'Nam'}
                onChange={handleGenderChange}
                required
            />
            <span>Nam</span>
        </label>
        <label className="radio-label">
            <input
                type="radio"
                name="gioiTinh"
                value="Nữ"
                checked={data.gioiTinh === 'Nữ'}
                onChange={handleGenderChange}
                required
            />
            <span>Nữ</span>
        </label>
    </div>
</div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">Đăng ký</button>
        </form>
    );
};

export default RegisterForm;
