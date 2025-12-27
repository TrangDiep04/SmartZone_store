import React, { useEffect, useState } from 'react';
import authService from '../../api/authService'; 
// Thêm Stack và Button vào danh sách import dưới đây
import { Box, Typography, CircularProgress, Alert, Stack, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface RegisterData {
    tenDangNhap: string;
    matKhau: string;
    email: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
}

interface FinalRegistrationProps {
    formData: RegisterData;
    onComplete: () => void;
}

const FinalRegistration: React.FC<FinalRegistrationProps> = ({ formData, onComplete }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const finalize = async () => {
            try {
                await authService.registerFinal(formData);
                setStatus('success');
                setTimeout(onComplete, 2000);
            } catch (err: any) {
                const resp = err.response?.data;
                const message = typeof resp === 'string' ? resp : (resp?.message || "Lỗi hệ thống khi lưu thông tin.");
                setErrorMsg(message);
                setStatus('error');
            }
        };

        if (formData.tenDangNhap) {
            finalize();
        }
    }, [formData, onComplete]);

    return (
        <Box sx={{
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 2
        }}>
            {status === 'loading' && (
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={50} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                        Đang khởi tạo tài khoản...
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Hệ thống đang lưu dữ liệu của bạn vào SmartZone.
                    </Typography>
                </Stack>
            )}

            {status === 'success' && (
                <Box>
                    <CheckCircleOutlineIcon sx={{ fontSize: 70, color: '#2e7d32', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} color="#2e7d32">
                        Đăng Ký Thành Công!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Chào mừng <strong>{formData.hoTen}</strong>. <br/>
                        Bạn sẽ quay về trang đăng nhập ngay bây giờ.
                    </Typography>
                </Box>
            )}

            {status === 'error' && (
                <Box>
                    <ErrorOutlineIcon sx={{ fontSize: 70, color: '#d32f2f', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} color="#d32f2f">
                        Lỗi Hoàn Tất
                    </Typography>
                    <Alert severity="error" variant="outlined" sx={{ mt: 2, textAlign: 'left' }}>
                        {errorMsg}
                    </Alert>
                    <Button
                        variant="text"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.reload()}
                    >
                        Thử lại bước này
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default FinalRegistration;