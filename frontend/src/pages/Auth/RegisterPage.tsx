import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RegisterForm from '../../components/Auth/RegisterStep1';
import OtpVerification from '../../components/Auth/RegisterStep2';
import FinalRegistration from '../../components/Auth/RegisterStep3';
import '../../styles/LoginPage.css'; // Sử dụng chung CSS để đồng bộ

interface RegisterData {
  tenDangNhap: string;
  matKhau: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
  gioiTinh: string;
}

const steps = ['Nhập thông tin', 'Xác nhận OTP', 'Hoàn tất đăng ký'];

const RegisterPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<RegisterData>>({});
  const navigate = useNavigate();

  const handleSendOtpSuccess = (data: RegisterData) => {
    setFormData(data);
    setActiveStep(1);
  };

  const handleVerifyOtpSuccess = () => {
    setActiveStep(2);
  };

  const handleRegistrationComplete = () => {
    navigate('/login', { replace: true });
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <RegisterForm onSuccess={handleSendOtpSuccess} />;
      case 1:
        return formData.tenDangNhap && formData.email ? (
          <OtpVerification
            tenDangNhap={formData.tenDangNhap}
            email={formData.email}
            onSuccess={handleVerifyOtpSuccess}
          />
        ) : (
          <Typography color="error">
            Thiếu thông tin người dùng. Vui lòng quay lại bước trước.
          </Typography>
        );
      case 2:
        return (
          <FinalRegistration
            formData={formData as RegisterData}
            onComplete={handleRegistrationComplete}
          />
        );
      default:
        return <RegisterForm onSuccess={handleSendOtpSuccess} />;
    }
  };

  return (
    <Box className="auth-wrapper" sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Nút quay lại */}
          {activeStep > 0 && activeStep < 2 && (
            <IconButton
              onClick={handleBack}
              sx={{ position: 'absolute', left: 16, top: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Logo + tiêu đề */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSORrlt2auZR3ziF7XRwl9EpaOA-IKSny9JMw&s"
              alt="Logo"
              style={{ width: '70px', marginBottom: '15px' }}
            />
            <Typography variant="h4" fontWeight="700" color="primary">
              Đăng ký tài khoản
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hoàn tất các bước để bắt đầu trải nghiệm
            </Typography>
          </Box>

          {/* Thanh tiến trình */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': { fontWeight: 600 },
              '& .MuiStepIcon-root.Mui-active': { color: '#1976d2' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Nội dung từng bước */}
          <Box className="step-container">{renderStepContent(activeStep)}</Box>

          {/* Link đăng nhập */}
          {activeStep === 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Bạn đã có tài khoản?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
