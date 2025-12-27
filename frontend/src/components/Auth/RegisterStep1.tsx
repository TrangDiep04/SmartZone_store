import React, { useState } from 'react';
import authService from '../../api/authService';
import {
  Box, TextField, Button, Typography, Stack, Alert, Paper, InputAdornment,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

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
    tenDangNhap: '', matKhau: '', email: '', hoTen: '',
    soDienThoai: '', diaChi: '', gioiTinh: 'Nam', // Mặc định là Nam
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
      };

      // Gọi đến authService.sendOtp đã sửa
      await authService.sendOtp(trimmedData);
      onSuccess(trimmedData);
    } catch (err: any) {
      // ✅ PHẦN QUAN TRỌNG: Sửa lỗi "Objects are not valid as a React child"
      const resp = err.response?.data;
      let errorText = "Lỗi gửi OTP. Vui lòng thử lại.";

      if (typeof resp === 'string') {
        errorText = resp; // Nếu Backend trả về mỗi dòng chữ lỗi
      } else if (typeof resp === 'object' && resp !== null) {
        // Nếu Backend trả về JSON { message: "...", status: 400 }
        errorText = resp.message || resp.error || JSON.stringify(resp);
      }

      setError(errorText); // Bây giờ setError luôn nhận vào 1 String, không lo bị Crash
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 500, margin: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" fontWeight={700} textAlign="center" color="primary" gutterBottom>
          Đăng ký tài khoản
        </Typography>

        <Stack spacing={2}>
          <TextField label="Tên đăng nhập" name="tenDangNhap" value={data.tenDangNhap} onChange={handleChange} fullWidth required />
          <TextField label="Mật khẩu" name="matKhau" type="password" value={data.matKhau} onChange={handleChange} fullWidth required />
          <TextField label="Email" name="email" type="email" value={data.email} onChange={handleChange} fullWidth required />
          <TextField label="Họ tên" name="hoTen" value={data.hoTen} onChange={handleChange} fullWidth required />
          <TextField label="Số điện thoại" name="soDienThoai" value={data.soDienThoai} onChange={handleChange} fullWidth required />
          <TextField label="Địa chỉ" name="diaChi" value={data.diaChi} onChange={handleChange} fullWidth required />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Giới tính</Typography>
            <ToggleButtonGroup
              value={data.gioiTinh}
              exclusive
              onChange={(_, val) => val && setData({ ...data, gioiTinh: val })}
              fullWidth
              color="primary"
            >
              <ToggleButton value="Nam">Nam</ToggleButton>
              <ToggleButton value="Nữ">Nữ</ToggleButton>
              <ToggleButton value="Khác">Khác</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Hiển thị lỗi một cách an toàn */}
          {error && <Alert severity="error" variant="filled" sx={{ fontWeight: 'bold' }}>{error}</Alert>}

          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5, fontWeight: 700, mt: 2 }}>
            NHẬN MÃ OTP
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterForm;