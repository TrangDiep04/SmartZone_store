import React, { useState, useEffect, useCallback } from 'react';
import { cartApi, type CartItemResponse } from '../../api/cartApi';
import { useAuth } from '../../context/AuthContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
} from '@mui/material';

const Cart: React.FC = () => {
  const { userId, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<(CartItemResponse & { quantity: number })[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load giỏ hàng từ API
  const loadCart = useCallback(async () => {
    if (!isLoggedIn || !userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart(Number(userId));
      const normalized = Array.isArray(data)
        ? data.map(item => ({ ...item, quantity: item.soLuong }))
        : [];
      setCartItems(normalized);
    } catch (err) {
      console.error('Lỗi khi fetch giỏ hàng:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId, isLoggedIn]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Thay đổi số lượng
  const handleQuantityChange = async (maSanPham: number, delta: number) => {
    const item = cartItems.find(i => i.maSanPham === maSanPham);
    if (!item) return;
    const next = item.quantity + delta;
    if (next <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }
    if (item.product?.stock && next > item.product.stock) {
      alert(`Số lượng vượt quá tồn kho (chỉ còn ${item.product.stock})`);
      return;
    }
    try {
      await cartApi.addToCart(Number(userId), maSanPham, delta);
      await loadCart();
    } catch {
      alert('Lỗi cập nhật số lượng');
    }
  };

  const handleInputChange = async (maSanPham: number, value: string) => {
    const item = cartItems.find(i => i.maSanPham === maSanPham);
    if (!item) return;
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) return;
    if (item.product?.stock && num > item.product.stock) {
      alert(`Số lượng vượt quá tồn kho (chỉ còn ${item.product.stock})`);
      return;
    }
    const delta = num - item.quantity;
    try {
      await cartApi.addToCart(Number(userId), maSanPham, delta);
      await loadCart();
    } catch {
      alert('Lỗi cập nhật số lượng');
    }
  };

  // Xóa 1 sản phẩm
  const removeItem = async (maSanPham: number) => {
    if (!window.confirm('Xóa sản phẩm này khỏi giỏ?')) return;
    try {
      await cartApi.removeFromCart(Number(userId), maSanPham);
      await loadCart();
    } catch {
      alert('Lỗi khi xóa');
    }
  };

  // Xóa nhiều sản phẩm
  const removeSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) return;
    try {
      for (const id of selectedIds) {
        await cartApi.removeFromCart(Number(userId), id);
      }
      await loadCart();
      setSelectedIds([]);
    } catch {
      alert('Lỗi khi xóa nhiều sản phẩm');
    }
  };

  // Chọn sản phẩm
  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => item.maSanPham));
    }
  };

  // Tổng tiền
  const total = cartItems
    .filter(item => selectedIds.includes(item.maSanPham))
    .reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  // Checkout
  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn sản phẩm để mua!');
      return;
    }
    localStorage.setItem('checkout', JSON.stringify(selectedIds));
    window.location.href = '/order';
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '950px', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCartOutlinedIcon /> Giỏ hàng của bạn
      </Typography>

      {!isLoggedIn ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>Vui lòng đăng nhập để xem giỏ hàng</Box>
      ) : cartItems.length === 0 ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: 60 }}>🛒</Typography>
          <Typography sx={{ color: '#718096', mt: 2 }}>Giỏ hàng hiện đang trống!</Typography>
          <Button variant="contained" href="/" sx={{ mt: 3, borderRadius: 2 }}>
            Tiếp tục mua sắm
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              bgcolor: '#fff',
              borderRadius: 2,
              mb: 2,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                onChange={toggleSelectAll}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span>Chọn tất cả ({cartItems.length})</span>
            </Box>
            {selectedIds.length > 0 && (
              <Button
                onClick={removeSelected}
                color="error"
                startIcon={<DeleteSweepIcon />}
                sx={{ fontWeight: 'bold' }}
              >
                Xóa mục đã chọn ({selectedIds.length})
              </Button>
            )}
          </Box>

          <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            {cartItems.map(item => {
              const atLimit = item.product?.stock && item.quantity >= item.product.stock;
              const isSelected = selectedIds.includes(item.maSanPham);
              return (
                <Box
                  key={item.maSanPham}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #eee',
                    bgcolor: isSelected ? '#fafafa' : '#fff',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.maSanPham)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.product?.name}</Typography>
                    <Typography color="error" sx={{ fontWeight: 'bold' }}>
                      {item.product?.price?.toLocaleString()}đ
                    </Typography>
                    {item.product?.stock && (
                      <Typography sx={{ fontSize: 13, color: atLimit ? 'error.main' : 'text.secondary' }}>
                        {atLimit
                          ? `Số lượng có hạn: chỉ còn ${item.product.stock}`
                          : `Tồn kho: ${item.product.stock}`}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                    <Button
                      onClick={() => handleQuantityChange(item.maSanPham, -1)}
                      sx={{ minWidth: 40 }}
                    >
                      -
                    </Button>
                    <TextField
                      value={item.quantity}
                      onChange={e => handleInputChange(item.maSanPham, e.target.value)}
                      size="small"
                      inputProps={{ style: { textAlign: 'center' } }}
                      sx={{ width: 60 }}
                    />
                    <Button
                      onClick={() => handleQuantityChange(item.maSanPham, 1)}
                      disabled={atLimit}
                      sx={{ minWidth: 40 }}
                    >
                      +
                    </Button>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography sx={{ fontWeight: 'bold', color: isSelected ? 'error.main' : 'text.primary' }}>
                      {(item.product?.price && item.quantity)
                        ? (item.product.price * item.quantity).toLocaleString()
                        : '0'}đ
                    </Typography>
                    <IconButton onClick={() => removeItem(item.maSanPham)} color="error">
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: '#fff',
              borderRadius: 2,
              textAlign: 'right',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              position: 'sticky',
              bottom: 20,
            }}
          >
            <Typography variant="h6">
              Tổng thanh toán ({selectedIds.length} sản phẩm):{' '}
              <span style={{ color: '#d32f2f', fontSize: '1.8rem' }}>
                {total.toLocaleString()}đ
              </span>
            </Typography>
            <Button
              variant="contained"
              size="large"
              disabled={selectedIds.length === 0}
              sx={{
                mt: 2,
                px: 6,
                py: 1.5,
                borderRadius: 3,
                bgcolor: selectedIds.length === 0 ? '#ccc' : '#1a202c',
              }}
              onClick={handleCheckout}
            >
              ĐẶT HÀNG
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default Cart;