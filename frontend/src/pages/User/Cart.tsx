import React, { useState, useEffect } from 'react';
import { cartApi, type CartItemResponse } from '../../api/cartApi';
import { useAuth } from '../../context/AuthContext'; // Dùng để lấy userId
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CircularProgress } from '@mui/material';

const Cart: React.FC = () => {
  const { userId, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Tải giỏ hàng từ Backend
  const loadCart = async () => {
    if (!isLoggedIn || !userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart(Number(userId));
      setCartItems(data);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  // 2. Thay đổi số lượng (Cộng/Trừ)
  const handleQuantityChange = async (maSanPham: number, delta: number) => {
    try {
      // Backend của bạn dùng logic cộng dồn: soLuong hiện tại + delta
      await cartApi.addToCart(Number(userId), maSanPham, delta);
      loadCart(); // Tải lại để đồng bộ
    } catch (err) {
      alert("Không thể cập nhật số lượng");
    }
  };

  // 3. Xóa sản phẩm
  const removeItem = async (maSanPham: number) => {
    if (!window.confirm("Bạn muốn xóa sản phẩm này?")) return;
    try {
      await cartApi.removeFromCart(Number(userId), maSanPham);
      loadCart();
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => item.maSanPham));
    }
  };

  const total = cartItems
    .filter(item => selectedIds.includes(item.maSanPham))
    .reduce((sum, item) => sum + (item.gia * item.soLuong), 0);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><CircularProgress /></div>;

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto", backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #edf2f7' }}>
        
        <div style={{ padding: '30px', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCartOutlinedIcon /> Giỏ hàng trực tuyến
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#a0aec0', fontSize: '0.9rem' }}>Bạn có {cartItems.length} sản phẩm lưu trên hệ thống</p>
          </div>
        </div>

        {!isLoggedIn ? (
           <div style={{ textAlign: "center", padding: "50px" }}>Vui lòng đăng nhập để xem giỏ hàng</div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛒</div>
            <p style={{ color: '#718096' }}>Giỏ hàng trống!</p>
            <button onClick={() => window.location.href = '/'} style={{ marginTop: '25px', padding: '12px 30px', backgroundColor: '#1a202c', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Mua sắm ngay</button>
          </div>
        ) : (
          <div style={{ padding: '0 30px' }}>
            <div style={{ display: 'flex', padding: '20px 0', color: '#718096', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #f8fafc' }}>
              <div style={{ width: '40px' }}>
                <input type="checkbox" checked={selectedIds.length === cartItems.length} onChange={toggleSelectAll} style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ flex: 2 }}>Sản phẩm</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Số lượng</div>
              <div style={{ flex: 1, textAlign: 'right' }}>Thành tiền</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.maSanPham} style={{ display: "flex", alignItems: "center", padding: "25px 0", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: '40px' }}>
                  <input type="checkbox" checked={selectedIds.includes(item.maSanPham)} onChange={() => toggleSelect(item.maSanPham)} style={{ width: '18px', height: '18px' }} />
                </div>
                
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={item.hinhAnh} alt="" style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'contain', background: '#f8f9fa' }} />
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{item.tenSanPham}</h4>
                    <div style={{ color: '#718096' }}>{item.gia.toLocaleString()}đ</div>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f7fafc', borderRadius: '10px', padding: '5px' }}>
                    <button onClick={() => handleQuantityChange(item.maSanPham, -1)} style={{ width: '30px', border: 'none', background: '#fff', cursor: 'pointer' }}>-</button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{item.soLuong}</span>
                    <button onClick={() => handleQuantityChange(item.maSanPham, 1)} style={{ width: '30px', border: 'none', background: '#fff', cursor: 'pointer' }}>+</button>
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#1a202c' }}>{(item.gia * item.soLuong).toLocaleString()}đ</div>
                  <button onClick={() => removeItem(item.maSanPham)} style={{ border: 'none', background: 'none', color: '#cbd5e0', cursor: 'pointer' }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div style={{ padding: '30px', background: '#fcfcfd', borderTop: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'right', width: '100%' }}>
              <div style={{ color: '#718096', fontSize: '0.9rem' }}>Tổng thanh toán ({selectedIds.length} mục)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e53e3e', marginBottom: '20px' }}>{total.toLocaleString()}đ</div>
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => { localStorage.setItem("checkoutItems", JSON.stringify(selectedIds)); window.location.href = "/order"; }}
                style={{ padding: '12px 45px', borderRadius: '12px', border: 'none', background: selectedIds.length === 0 ? '#cbd5e0' : '#1a202c', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                THANH TOÁN NGAY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;