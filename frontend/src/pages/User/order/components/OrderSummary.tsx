import React from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

interface Props {
  selectedItems: any[];
  shippingFee: number;
  total: number;
  receiverName: string;
  receiverPhone: string;
  fullAddress: string;
  paymentMethod: string;
  error: string | null;
  handleConfirm: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
};

const OrderSummary: React.FC<Props> = ({
  selectedItems,
  shippingFee,
  total,
  receiverName,
  receiverPhone,
  fullAddress,
  paymentMethod,
  error,
  handleConfirm,
}) => {
  const paymentText =
    paymentMethod === "COD" ? "Thanh toán khi nhận hàng" :
    paymentMethod === "MOMO" ? "Ví MOMO" :
    paymentMethod === "VNPAY" ? "Ví VNPAY" :
    paymentMethod === "ZALOPAY" ? "Ví ZaloPay" : paymentMethod;

  const finalTotal = total + shippingFee;

  // Style chung cho font Inter
  const fontStyle = { fontFamily: "'Inter', sans-serif" };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        bgcolor: '#fff',
        position: 'sticky', // Cố định khi cuộn trang
        top: 20
      }}
    >
      <h3 variant="h6" sx={{ fontWeight: 800, mb: 3, ...fontStyle, color: '#1a1c1e' }}>
        Tóm tắt đơn hàng
      </h3>

      {/* Danh sách sản phẩm rút gọn */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="body2" sx={{ ...fontStyle, color: '#555', flex: 1, pr: 2 }}>
                <strong>{item.tenSanPham || item.name}</strong>
                <span style={{ color: '#999', marginLeft: '8px' }}>x{item.soLuong}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, ...fontStyle }}>
                {formatPrice((item.gia || item.price) * item.soLuong)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>Chưa có sản phẩm.</Typography>
        )}
      </Stack>

      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

      {/* Chi phí vận chuyển */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#636e72', ...fontStyle }}>Tạm tính</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, ...fontStyle }}>{formatPrice(total)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocalShippingOutlinedIcon sx={{ fontSize: 16, color: '#636e72' }} />
            <Typography variant="body2" sx={{ color: '#636e72', ...fontStyle }}>Phí vận chuyển</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontWeight: 600, ...fontStyle, color: '#2ecc71' }}>
            {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
          </Typography>
        </Box>
      </Stack>

      {/* Tổng cộng tiền */}
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: '12px', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, ...fontStyle }}>Tổng thanh toán</Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#d63031', ...fontStyle, letterSpacing: '-1px' }}>
            {formatPrice(finalTotal)}
          </Typography>
        </Box>
      </Box>

      {/* Thông tin nhận hàng rút gọn */}
      <Box sx={{ mb: 3, p: 2, border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: '#1976d2' }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#adb5bd', textTransform: 'uppercase' }}>Thông tin nhận hàng</Typography>
          </Stack>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, ...fontStyle }}>
            {receiverName || "Chưa nhập tên"} • {receiverPhone || "Chưa có SĐT"}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#636e72', ...fontStyle, lineHeight: 1.4 }}>
            {fullAddress || "Vui lòng chọn địa chỉ giao hàng"}
          </Typography>
          <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600, ...fontStyle }}>
            PTTT: {paymentText}
          </Typography>
        </Stack>
      </Box>

      {/* Lỗi */}
      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.8rem' }}>
          {error}
        </Alert>
      )}

      {/* Nút bấm xác nhận */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleConfirm}
        startIcon={<CheckCircleOutlineIcon />}
        sx={{
          py: 1.5,
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)',
          bgcolor: '#28a745',
          '&:hover': {
            bgcolor: '#218838',
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)',
          },
          ...fontStyle
        }}
      >
        Xác nhận đặt hàng
      </Button>
    </Paper>
  );
};

export default OrderSummary;