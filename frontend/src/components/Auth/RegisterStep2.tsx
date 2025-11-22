import React, { useState } from 'react';
import authService from '../../api/authService'; // Đã đổi tên thành .ts

interface OtpVerificationProps {
    tenDangNhap: string;
    email: string;
    onSuccess: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ tenDangNhap, email, onSuccess }) => {
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await authService.verifyOtp(tenDangNhap, otp);
            console.log("Xác thực OTP thành công! Đang hoàn tất đăng ký...");
            onSuccess(); // Chuyển sang bước 3 (Hoàn tất)
        } catch (err) {
            const resp = (err as any).response?.data;
            setError(resp || (err as Error).message || "Mã OTP không hợp lệ.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p style={{marginBottom: '20px'}}>Mã OTP đã được gửi đến: <strong>{email}</strong></p>
            <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Nhập mã OTP 6 chữ số" 
                maxLength={6}
                required 
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Xác thực Mã OTP (Bước 2/3)</button>
        </form>
    );
};

export default OtpVerification;