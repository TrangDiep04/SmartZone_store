import React from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  InputAdornment
} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

interface Props {
  receiverName: string;
  receiverPhone: string;
  setReceiverName: (val: string) => void;
  setReceiverPhone: (val: string) => void;
}

const ReceiverForm: React.FC<Props> = ({
  receiverName,
  receiverPhone,
  setReceiverName,
  setReceiverPhone
}) => {

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số và giới hạn 10 ký tự
    if (/^\d*$/.test(value) && value.length <= 10) {
      setReceiverPhone(value);
    }
  };

  const fontStyle = { fontFamily: "'Inter', sans-serif" };
  const isPhoneError = receiverPhone.length > 0 && receiverPhone.length !== 10;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Tiêu đề phần thông tin */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <PersonOutlineIcon sx={{ color: '#1976d2', fontSize: 22 }} />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            ...fontStyle,
            color: '#1a1c1e'
          }}
        >
          Thông tin người nhận
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Tên người nhận */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Họ và tên người nhận"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ fontSize: 20, color: '#999' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '10px', ...fontStyle }
            }}
            InputLabelProps={{ sx: fontStyle }}
          />
        </Grid>

        {/* Số điện thoại */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Số điện thoại"
            placeholder="Nhập 10 chữ số"
            value={receiverPhone}
            onChange={handlePhoneChange}
            error={isPhoneError}
            helperText={isPhoneError ? "Số điện thoại phải có đúng 10 chữ số" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneIcon sx={{ fontSize: 20, color: '#999' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '10px', ...fontStyle }
            }}
            InputLabelProps={{ sx: fontStyle }}
            FormHelperTextProps={{ sx: { ...fontStyle, fontWeight: 500 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceiverForm;