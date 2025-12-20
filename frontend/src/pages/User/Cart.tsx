import React, { useState, useEffect } from 'react';
import { type Product } from '../../api/productApi';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

interface CartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const rawData: any[] = JSON.parse(savedCart);
      const groupedCart = rawData.reduce((acc: CartItem[], item: any) => {
        const id = String(item.maSanPham || item.id);
        const existingItem = acc.find(i => String(i.maSanPham || (i as any).id) === id);
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
        } else {
          acc.push({ ...item, quantity: item.quantity || 1 });
        }
        return acc;
      }, []);
      setCartItems(groupedCart);
    }
  }, []);

  const updateLocalStorage = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => String(item.maSanPham || (item as any).id)));
    }
  };

  const removeSelected = () => {
    if (window.confirm(`Xóa ${selectedIds.length} sản phẩm đã chọn khỏi giỏ hàng?`)) {
      const newCart = cartItems.filter(item => !selectedIds.includes(String(item.maSanPham || (item as any).id)));
      updateLocalStorage(newCart);
      setSelectedIds([]);
    }
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const newCart = [...cartItems];
    const newQty = (newCart[index].quantity || 1) + delta;
    if (newQty > 0) {
      newCart[index].quantity = newQty;
      updateLocalStorage(newCart);
    }
  };

  const total = cartItems
    .filter(item => selectedIds.includes(String(item.maSanPham || (item as any).id)))
    .reduce((sum, item) => {
      const price = item.gia || (item as any).price || 0;
      return sum + (Number(price) * (item.quantity || 1));
    }, 0);

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto", backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Container chính: Gộp tất cả vào 1 khối trắng duy nhất */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
        overflow: 'hidden',
        border: '1px solid #edf2f7'
      }}>
        
        {/* Header Giỏ Hàng */}
        <div style={{ padding: '30px', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCartOutlinedIcon /> Giỏ hàng của bạn
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#a0aec0', fontSize: '0.9rem' }}>Bạn có {cartItems.length} sản phẩm trong giỏ</p>
          </div>
          
          {selectedIds.length > 0 && (
            <button onClick={removeSelected} style={{ color: '#e53e3e', background: '#fff5f5', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <DeleteSweepIcon fontSize="small" /> Xóa mục chọn
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛒</div>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>Giỏ hàng đang trống. Hãy chọn cho mình những sản phẩm ưng ý nhé!</p>
            <button onClick={() => window.location.href = '/'} style={{ marginTop: '25px', padding: '12px 30px', backgroundColor: '#1a202c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
              Quay lại cửa hàng
            </button>
          </div>
        ) : (
          <div style={{ padding: '0 30px' }}>
            {/* Header của bảng ẩn danh */}
            <div style={{ display: 'flex', padding: '20px 0', color: '#718096', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ width: '40px' }}>
                <input type="checkbox" checked={selectedIds.length === cartItems.length} onChange={toggleSelectAll} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
              </div>
              <div style={{ flex: 2 }}>Sản phẩm</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Số lượng</div>
              <div style={{ flex: 1, textAlign: 'right' }}>Thành tiền</div>
            </div>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item, index) => {
              const id = String(item.maSanPham || (item as any).id);
              const isSelected = selectedIds.includes(id);
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", padding: "25px 0", borderBottom: index === cartItems.length - 1 ? 'none' : "1px solid #f8fafc", transition: '0.3s' }}>
                  <div style={{ width: '40px' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(id)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                  </div>
                  
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={item.hinhAnh || (item as any).image} alt="" style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'contain', background: '#f8f9fa' }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '0.95rem' }}>{item.tenSanPham || (item as any).name}</h4>
                      <div style={{ color: '#718096', fontSize: '0.9rem' }}>{Number(item.gia || (item as any).price).toLocaleString()}đ</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f7fafc', borderRadius: '10px', padding: '5px' }}>
                      <button onClick={() => handleQuantityChange(index, -1)} style={{ width: '30px', height: '30px', border: 'none', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>-</button>
                      <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(index, 1)} style={{ width: '30px', height: '30px', border: 'none', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>+</button>
                    </div>
                  </div>

                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#1a202c', fontSize: '1.05rem' }}>{(Number(item.gia || (item as any).price) * item.quantity).toLocaleString()}đ</div>
                    <button onClick={() => updateLocalStorage(cartItems.filter(i => String(i.maSanPham || (i as any).id) !== id))} style={{ border: 'none', background: 'none', color: '#cbd5e0', cursor: 'pointer', marginTop: '8px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e53e3e'} onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e0'}>
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Tổng kết - Nằm gọn bên trong Container */}
        {cartItems.length > 0 && (
          <div style={{ padding: '30px', background: '#fcfcfd', borderTop: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <p style={{ margin: 0, color: '#718096', fontWeight: 500 }}>Sản phẩm đã chọn: <strong style={{ color: '#2d3748' }}>{selectedIds.length}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '5px' }}>Tổng tiền thanh toán</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e53e3e', marginBottom: '20px' }}>{total.toLocaleString()}đ</div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button onClick={() => window.location.href = '/'} style={{ padding: '12px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Tiếp tục mua sắm</button>
                <button 
                  disabled={selectedIds.length === 0} 
                  onClick={() => { localStorage.setItem("selectedIds", JSON.stringify(selectedIds)); window.location.href = "/order"; }}
                  style={{ 
                    padding: '12px 45px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: selectedIds.length === 0 ? '#cbd5e0' : '#1a202c', 
                    color: '#fff', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: selectedIds.length === 0 ? 'none' : '0 10px 20px rgba(26, 32, 44, 0.2)'
                  }}
                >
                  THANH TOÁN NGAY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;