import React from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Avatar
} from "@mui/material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

interface CartItem {
  id?: string;
  maSanPham?: string;
  tenSanPham?: string;
  name?: string;
  gia?: number;
  price?: number;
  quantity: number;
  hinhAnh?: string;
  image?: string;
}

interface Props {
  items: CartItem[];
}

// Hàm định dạng tiền tệ VNĐ thống nhất
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
};

const CartItems: React.FC<Props> = ({ items }) => {
  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      {/* Tiêu đề danh sách */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <ShoppingBagIcon sx={{ color: '#1976d2', fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
            color: '#333'
          }}
        >
          Sản phẩm đã chọn ({items.length})
        </Typography>
      </Stack>

      <Box sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        overflow: 'hidden'
      }}>
        {items.map((item, index) => {
          const name = item.tenSanPham || item.name;
          const price = item.gia || item.price || 0;
          const image = item.hinhAnh || item.image;

          return (
            <Box key={item.maSanPham || item.id}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Ảnh sản phẩm thu nhỏ */}
                  <Avatar
                    src={image}
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: '#f9f9f9',
                      border: '1px solid #eee',
                      '& img': { objectFit: 'contain', p: 0.5 }
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        fontFamily: "'Inter', sans-serif",
                        color: '#2d3436',
                        lineHeight: 1.3
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#636e72',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Số lượng: {item.quantity}
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: "'Inter', sans-serif",
                    color: '#1a1c1e'
                  }}
                >
                  {formatPrice(price * item.quantity)}
                </Typography>
              </Stack>

              {index < items.length - 1 && (
                <Divider sx={{ mx: 2, borderColor: '#f1f1f1' }} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CartItems;