import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterStep1'; // Đã đổi tên thành .tsx
import OtpVerification from '../../components/Auth/RegisterStep2'; // Đã đổi tên thành .tsx
import FinalRegistration from '../../components/Auth/RegisterStep3'; // Đã đổi tên thành .tsx

interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
}

const RegisterPage: React.FC = () => {
    // 1: Nhập thông tin, 2: Xác thực OTP, 3: Hoàn tất
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<Partial<RegisterData>>({}); // Lưu dữ liệu form qua các bước
    const navigate = useNavigate();

    const handleSendOtpSuccess = (data: RegisterData) => {
        setFormData(data); 
        setStep(2);
    };

    const handleVerifyOtpSuccess = () => {
        setStep(3);
    };

    const handleRegistrationComplete = () => {
        navigate('/login', { replace: true }); 
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <RegisterForm onSuccess={handleSendOtpSuccess} />;
            case 2:
                // TypeScript Guard để đảm bảo tenDangNhap và email tồn tại
                if (!formData.tenDangNhap || !formData.email) {
                    return <p className="error-message">Lỗi: Thông tin người dùng bị thiếu. Vui lòng quay lại bước 1.</p>;
                }
                return <OtpVerification 
                            tenDangNhap={formData.tenDangNhap} 
                            email={formData.email} 
                            onSuccess={handleVerifyOtpSuccess}
                        />;
            case 3:
                // Type casting an toàn hơn trong ứng dụng thực tế, nhưng dùng Partial<RegisterData> ở trên là tạm ổn
                return <FinalRegistration 
                            formData={formData as RegisterData} 
                            onComplete={handleRegistrationComplete} 
                        />;
            default:
                return <RegisterForm onSuccess={handleSendOtpSuccess} />;
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng Ký Tài Khoản (Bước {step}/3)</h2>
            {renderStep()}
            {step !== 1 && <p style={{marginTop: '20px', fontSize: '0.9em'}}>
                <a href="/login">Đã có tài khoản? Đăng nhập</a>
            </p>}
        </div>
    );
};

export default RegisterPage;