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

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <ul>
          {cartItems.map((item, i) => (
            <li key={i}>
              {item.tenSanPham} - {item.gia?.toLocaleString()} VND
              <button
                onClick={() => removeFromCart(i)}
                style={{ marginLeft: 10, color: 'red' }}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;