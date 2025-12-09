import React, { useState, useEffect } from 'react';
import { type Product } from '../../api/productApi';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Load giỏ hàng từ localStorage khi mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Xóa sản phẩm khỏi giỏ theo id
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.maSanPham !== id));
  };

  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => sum + (item.gia ?? 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.maSanPham}>
                {item.tenSanPham} - {item.gia?.toLocaleString()} VND
                <button
                  onClick={() => removeFromCart(item.maSanPham)}
                  style={{ marginLeft: 10, color: 'red' }}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
          <p><strong>Tổng cộng:</strong> {total.toLocaleString()} VND</p>
        </>
      )}
    </div>
  );
};

export default Cart;