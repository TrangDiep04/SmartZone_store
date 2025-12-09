import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Product } from '../../api/productApi';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.maSanPham}`)}
      style={{
        border: '1px solid #ddd',
        padding: 12,
        borderRadius: 6,
        cursor: 'pointer'
      }}
    >
      {product.hinhAnh && (
        <img
          src={product.hinhAnh}
          alt={product.tenSanPham}
          style={{ width: '100%', height: 150, objectFit: 'cover', marginBottom: 8 }}
        />
      )}
      <h3>{product.tenSanPham}</h3>
      <p>{product.gia?.toLocaleString()} VND</p>

      {/* Nút thêm vào giỏ riêng biệt */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // tránh trigger navigate khi bấm nút
          onAddToCart?.(product);
        }}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '6px 12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ProductCard;