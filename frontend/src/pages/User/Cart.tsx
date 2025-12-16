import React, { useState, useEffect } from 'react';
import { type Product } from '../../api/productApi';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'; // Icon xóa hàng loạt

interface CartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Lưu mã sản phẩm được chọn

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const rawData: Product[] = JSON.parse(savedCart);
      const groupedCart = rawData.reduce((acc: CartItem[], item: any) => {
        const id = item.maSanPham || item.id;
        const existingItem = acc.find(i => (i.maSanPham || (i as any).id) === id);
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

  // Logic chọn sản phẩm
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => (item.maSanPham || (item as any).id)));
    }
  };

  // Xóa những sản phẩm đã chọn
  const removeSelected = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) {
      const newCart = cartItems.filter(item => !selectedIds.includes(item.maSanPham || (item as any).id));
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

  const handleInputChange = (index: number, value: string) => {
    const newCart = [...cartItems];
    if (value === "") {
      newCart[index].quantity = 0;
      setCartItems(newCart);
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0) {
      newCart[index].quantity = num;
      setCartItems(newCart);
      if (num > 0) {
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  const handleInputBlur = (index: number) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity <= 0) {
      newCart[index].quantity = 1;
      updateLocalStorage(newCart);
    }
  };

  const removeFromCart = (idToRemove: string) => {
    const newCart = cartItems.filter(item => (item.maSanPham || (item as any).id) !== idToRemove);
    updateLocalStorage(newCart);
    setSelectedIds(prev => prev.filter(id => id !== idToRemove));
  };

  // Tổng tiền chỉ tính trên những sản phẩm được chọn (giống Shopee)
  const total = cartItems
    .filter(item => selectedIds.includes(item.maSanPham || (item as any).id))
    .reduce((sum, item) => {
      const price = item.gia || (item as any).price || 0;
      return sum + (Number(price) * (item.quantity || 1));
    }, 0);

  return (
    <div style={{ padding: "40px 20px", maxWidth: "950px", margin: "0 auto" }}>
      <h2 style={{ borderBottom: "3px solid #1976d2", paddingBottom: "15px", marginBottom: "30px" }}>
        GIỎ HÀNG CỦA BẠN
      </h2>

      {cartItems.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '15px 20px', 
          background: '#fff', 
          borderRadius: '8px', 
          marginBottom: '15px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.length === cartItems.length && cartItems.length > 0}
              onChange={toggleSelectAll}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Chọn tất cả ({cartItems.length})</span>
          </div>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={removeSelected}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                color: '#ff4d4f', 
                border: 'none', 
                background: 'none', 
                cursor: 'pointer',
                fontWeight: 'bold' 
              }}
            >
              <DeleteSweepIcon /> Xóa mục đã chọn ({selectedIds.length})
            </button>
          )}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
           <p style={{ color: '#666', fontSize: '1.1rem' }}>Giỏ hàng của bạn đang trống.</p>
           <button 
             onClick={() => window.location.href = '/'}
             style={{ marginTop: '20px', padding: '10px 25px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
           >
             Tiếp tục mua sắm
           </button>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            {cartItems.map((item, index) => {
              const id = item.maSanPham || (item as any).id;
              const name = item.tenSanPham || (item as any).name || "Sản phẩm";
              const price = item.gia || (item as any).price || 0;
              const image = item.hinhAnh || (item as any).image || "";
              const isSelected = selectedIds.includes(id);

              return (
                <div key={id} style={{ 
                  display: "flex", 
                  gap: "15px", 
                  alignItems: "center", 
                  padding: "20px", 
                  borderBottom: "1px solid #eee",
                  background: isSelected ? '#fafafa' : '#fff'
                }}>
                  {/* Checkbox cho từng hàng */}
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleSelect(id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />

                  <img src={image} alt={name} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: '1rem' }}>{name}</h4>
                    <div style={{ color: "#d32f2f", fontWeight: "bold" }}>{Number(price).toLocaleString()}đ</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <button onClick={() => handleQuantityChange(index, -1)} style={{ padding: '5px 10px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>-</button>
                    <input 
                      type="text" 
                      value={item.quantity === 0 ? "" : item.quantity} 
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onBlur={() => handleInputBlur(index)}
                      style={{ width: '40px', textAlign: 'center', border: 'none', outline: 'none' }}
                    />
                    <button onClick={() => handleQuantityChange(index, 1)} style={{ padding: '5px 10px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>+</button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "110px" }}>
                    <div style={{ fontWeight: "bold", color: isSelected ? '#d32f2f' : '#333' }}>
                      {(Number(price) * (item.quantity || 1)).toLocaleString()}đ
                    </div>
                    <button
                      onClick={() => removeFromCart(id)}
                      style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', marginTop: '10px' }}
                    >
                      <DeleteOutlineIcon onMouseOver={(e) => (e.currentTarget.style.color = '#ff4d4f')} onMouseOut={(e) => (e.currentTarget.style.color = '#ccc')} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ 
            marginTop: "30px", 
            padding: "25px", 
            background: "#fff", 
            borderRadius: "12px", 
            textAlign: "right", 
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            position: 'sticky',
            bottom: '20px' // Thanh tổng tiền dính dưới màn hình giống Shopee
          }}>
            <h3 style={{ margin: 0 }}>
              Tổng thanh toán ({selectedIds.length} sản phẩm): 
              <span style={{ color: "#d32f2f", fontSize: '1.8rem', marginLeft: '10px' }}>
                {total.toLocaleString()}đ
              </span>
            </h3>
            <button 
              disabled={selectedIds.length === 0}
              style={{ 
                marginTop: "20px", 
                padding: "15px 50px", 
                backgroundColor: selectedIds.length === 0 ? "#ccc" : "#ee4d2d", // Màu cam Shopee
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                fontSize: "1.1rem", 
                fontWeight: "bold", 
                cursor: selectedIds.length === 0 ? "not-allowed" : "pointer" 
              }}
            >
              MUA HÀNG
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;