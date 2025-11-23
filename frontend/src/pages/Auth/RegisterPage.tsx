import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterStep1'; 
import OtpVerification from '../../components/Auth/RegisterStep2'; 
import FinalRegistration from '../../components/Auth/RegisterStep3'; 
import '../../LoginPage.css'; 

interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
}

const RegisterPage: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<Partial<RegisterData>>({});
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
                return renderOtpVerification();
            case 3:
                return renderFinalRegistration();
            default:
                return <RegisterForm onSuccess={handleSendOtpSuccess} />;
        }
    };

    const renderOtpVerification = () => {
        if (!formData.tenDangNhap || !formData.email) {
            return (
                <p className="error-message">
                    Lỗi: Thông tin người dùng bị thiếu. Vui lòng quay lại bước 1.
                </p>
            );
        }

        return (
            <OtpVerification 
                tenDangNhap={formData.tenDangNhap} 
                email={formData.email} 
                onSuccess={handleVerifyOtpSuccess}
            />
        );
    };

    const renderFinalRegistration = () => {
        return (
            <FinalRegistration 
                formData={formData as RegisterData} 
                onComplete={handleRegistrationComplete} 
            />
        );
    };

    return (
        <div className="auth-container">
            {renderStep()}
            {step !== 1 && (
                <p className="link-login" style={{ marginTop: '20px', fontSize: '0.9em' }}>
                    <a href="/login">Đã có tài khoản? Đăng nhập</a>
                </p>
            )}
        </div>
    );
};

export default RegisterPage;