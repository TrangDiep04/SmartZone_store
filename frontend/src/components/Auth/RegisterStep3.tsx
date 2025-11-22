import React, { useEffect, useState } from 'react';
import authService from '../../api/authService'; // Đã đổi tên thành .ts

interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
}

interface FinalRegistrationProps {
    formData: RegisterData;
    onComplete: () => void;
}

const FinalRegistration: React.FC<FinalRegistrationProps> = ({ formData, onComplete }) => {
    const [status, setStatus] = useState<string>('Đang hoàn tất đăng ký...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Tự động gọi API cuối cùng khi Component được render (Bước 3)
        const finalize = async () => {
            try {
                await authService.registerFinal(formData); 
                setStatus('Đăng ký thành công!');
                // Chờ 1.5 giây trước khi chuyển hướng
                setTimeout(onComplete, 1500); 
            } catch (err) {
                const resp = (err as any).response?.data;
                setError(resp || (err as Error).message || "Lỗi hoàn tất đăng ký.");
                setStatus('Hoàn tất đăng ký thất bại.');
            }
        };

        // Chỉ gọi API nếu formData không rỗng (để tránh lỗi khi mount)
        if (formData.tenDangNhap) {
            finalize();
        }
    }, [formData, onComplete]);

    return (
        <div style={{minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h3>Trạng thái: {status}</h3>
            {error && <div className="error-message">{error}</div>}
            {!error && status === 'Đăng ký thành công!' && 
                <p style={{color: '#28a745'}}>Bạn sẽ được chuyển hướng đến trang Đăng nhập sau giây lát.</p>}
            {status === 'Đang hoàn tất đăng ký...' && <p>Vui lòng đợi...</p>}
        </div>
    );
};

export default FinalRegistration;