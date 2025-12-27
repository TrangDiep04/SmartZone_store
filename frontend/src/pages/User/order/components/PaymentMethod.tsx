import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Stack,
  Avatar
} from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Props {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

const PaymentMethod: React.FC<Props> = ({ paymentMethod, setPaymentMethod }) => {
  const methods = [
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      sub: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: <AccountBalanceWalletIcon sx={{ color: '#ff9f43' }} />
    },
    {
      value: "MOMO",
      label: "Ví MoMo",
      sub: "Thanh toán qua ứng dụng MoMo",
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
    },
//     {
//       value: "VNPAY",
//       label: "VNPAY",
//       sub: "Cổng thanh toán VNPAY (QR, Thẻ ATM/Visa)",
//       logo: "https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmdfn091686814746106.png"
//     },
//     {
//       value: "ZALOPAY",
//       label: "ZaloPay",
//       sub: "Ví điện tử ZaloPay",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_ZaloPay-01.png/640px-Logo_ZaloPay-01.png"
//     },
  ];

  const fontStyle = { fontFamily: "'Inter', sans-serif" };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Tiêu đề */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <PaymentIcon sx={{ color: '#1976d2', fontSize: 22 }} />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            ...fontStyle,
            color: '#1a1c1e'
          }}
        >
          Phương thức thanh toán
        </Typography>
      </Stack>

      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Stack spacing={1.5}>
          {methods.map((method) => {
            const isSelected = paymentMethod === method.value;

            return (
              <Paper
                key={method.value}
                elevation={0}
                onClick={() => setPaymentMethod(method.value)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: isSelected ? '#1976d2' : '#f0f0f0',
                  bgcolor: isSelected ? '#f0f7ff' : '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                    bgcolor: '#f0f7ff'
                  }
                }}
              >
                <FormControlLabel
                  value={method.value}
                  control={<Radio size="small" />}
                  label={
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 1 }}>
                      {/* Logo hoặc Icon */}
                      <Avatar
                        src={method.logo}
                        variant="rounded"
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: isSelected ? '#fff' : '#f8f9fa',
                          border: '1px solid #eee',
                          p: method.logo ? 0.5 : 0
                        }}
                      >
                        {!method.logo && method.icon}
                      </Avatar>

                      {/* Text nội dung */}
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', ...fontStyle }}>
                          {method.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#636e72', ...fontStyle }}>
                          {method.sub}
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            );
          })}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default PaymentMethod;