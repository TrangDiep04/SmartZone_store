import React, { useState, useEffect, useCallback } from 'react';
import { cartApi, type CartItemResponse } from '../../api/cartApi';
import { useAuth } from '../../context/AuthContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

const Cart: React.FC = () => {
  const { userId, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Dùng useCallback để tránh re-render vô tận
  const loadCart = useCallback(async () => {
    // Nếu chưa đăng nhập hoặc chưa có userId thì dừng lại ngay
    if (!isLoggedIn || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Đang tải giỏ hàng cho User ID:", userId);
      const data = await cartApi.getCart(Number(userId));
      
      // KIỂM TRA: Nếu API trả về null hoặc không phải mảng, set mảng rỗng
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi fetch giỏ hàng:", err);
      setCartItems([]); // Reset về rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  }, [userId, isLoggedIn]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = async (maSanPham: number, delta: number) => {
    try {
      await cartApi.addToCart(Number(userId), maSanPham, delta);
      await loadCart(); // Load lại ngay để thấy thay đổi
    } catch (err) {
      alert("Lỗi cập nhật số lượng");
    }
  };

  const removeItem = async (maSanPham: number) => {
    if (!window.confirm("Xóa sản phẩm này khỏi giỏ?")) return;
    try {
      await cartApi.removeFromCart(Number(userId), maSanPham);
      await loadCart();
    } catch (err) {
      alert("Lỗi khi xóa");
    }
  };

  const total = cartItems
    .filter(item => selectedIds.includes(item.maSanPham))
    .reduce((sum, item) => sum + (item.gia * item.soLuong), 0);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto", minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        <div style={{ padding: '30px', borderBottom: '1px solid #f1f1f1' }}>
           <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
             <ShoppingCartOutlinedIcon /> Giỏ hàng của bạn
           </Typography>
        </div>

        {!isLoggedIn ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>Vui lòng đăng nhập để xem giỏ hàng</Box>
        ) : cartItems.length === 0 ? (
          <Box sx={{ p: 10, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: 60 }}>🛒</Typography>
            <Typography sx={{ color: '#718096', mt: 2 }}>Giỏ hàng hiện đang trống!</Typography>
            <Button variant="contained" href="/" sx={{ mt: 3, borderRadius: 2 }}>Tiếp tục mua sắm</Button>
          </Box>
        ) : (
          <div style={{ padding: '20px 30px' }}>
            {cartItems.map((item) => (
              <div key={item.maSanPham} style={{ display: "flex", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #f8fafc" }}>
                <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.maSanPham)} 
                    onChange={() => setSelectedIds(prev => prev.includes(item.maSanPham) ? prev.filter(id => id !== item.maSanPham) : [...prev, item.maSanPham])}
                    style={{ width: 20, height: 20, marginRight: 20 }}
                />
                
                <img src={item.hinhAnh} alt={item.tenSanPham} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'contain' }} />
                
                <Box sx={{ flex: 1, ml: 3 }}>
                  <Typography sx={{ fontWeight: 600 }}>{item.tenSanPham}</Typography>
                  <Typography color="textSecondary">{item.gia?.toLocaleString()}đ</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f3f5', borderRadius: 2, p: 0.5 }}>
                  <button onClick={() => handleQuantityChange(item.maSanPham, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 10px' }}>-</button>
                  <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>{item.soLuong}</span>
                  <button onClick={() => handleQuantityChange(item.maSanPham, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 10px' }}>+</button>
                </Box>

                <Box sx={{ width: 150, textAlign: 'right', fontWeight: 800 }}>
                  {(item.gia * item.soLuong).toLocaleString()}đ
                  <IconButton onClick={() => removeItem(item.maSanPham)} color="error"><DeleteOutlineIcon /></IconButton>
                </Box>
              </div>
            ))}

            <Box sx={{ p: 4, textAlign: 'right', bgcolor: '#fcfcfd' }}>
              <Typography variant="h6">Tổng thanh toán: <span style={{ color: '#e53e3e', fontSize: '1.8rem' }}>{total.toLocaleString()}đ</span></Typography>
              <Button 
                variant="contained" 
                size="large"
                disabled={selectedIds.length === 0}
                sx={{ mt: 3, px: 6, py: 1.5, borderRadius: 3, bgcolor: '#1a202c' }}
                onClick={() => { localStorage.setItem("checkout", JSON.stringify(selectedIds)); window.location.href = "/order"; }}
              >
                ĐẶT HÀNG NGAY
              </Button>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;