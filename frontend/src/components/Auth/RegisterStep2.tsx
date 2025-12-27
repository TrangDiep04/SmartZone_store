import React, { useState } from 'react';
import authService from '../../api/authService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

interface OtpVerificationProps {
  tenDangNhap: string;
  email: string;
  onSuccess: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  tenDangNhap,
  email,
  onSuccess,
}) => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.verifyOtp(tenDangNhap, otp);
      console.log('Xác thực OTP thành công! Đang hoàn tất đăng ký...');
      onSuccess();
    } catch (err) {
      const resp = (err as any).response?.data;
      setError(resp || (err as Error).message || 'Mã OTP không hợp lệ.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Typography variant="body1" color="text.secondary">
          Mã OTP đã được gửi đến: <strong>{email}</strong>
        </Typography>

        <TextField
          label="Nhập mã OTP"
          placeholder="6 chữ số"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          inputProps={{ maxLength: 6 }}
          fullWidth
          required
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Xác thực mã OTP
        </Button>
      </Stack>
    </Box>
  );
};

export default OtpVerification;
