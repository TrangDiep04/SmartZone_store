import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productApi, type Product } from '../../api/productApi';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false); // trạng thái mô tả

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const res = await productApi.getById(Number(id));
          setProduct(res);
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const handleBuyNow = () => {
    alert(`Bạn đã chọn mua ngay sản phẩm: ${product.name}`);
  };

  const handleAddToCart = () => {
    alert(`Sản phẩm "${product.name}" đã được thêm vào giỏ hàng`);
  };

  const shortDescription = product.description.slice(0, 1300);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 30 }}>
        {/* Ảnh sản phẩm bên trái */}
        {product.image && (
          <div style={{ flex: '0 0 250px' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        {/* Thông tin sản phẩm bên phải */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 10 }}>{product.name}</h2>
          <p><strong>Giá:</strong> {product.price ? product.price.toLocaleString() : 'Liên hệ'} VNĐ</p>
          <p><strong>Thương hiệu:</strong> {product.brand}</p>
          <p><strong>Loại:</strong> {product.category?.name}</p>
          <p><strong>Số lượng tồn:</strong> {product.stock}</p>

          {/* Nút hành động */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: '#f57c00',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Mua hàng
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div style={{ marginTop: 30 }}>
        <h3>Mô tả sản phẩm</h3>
        <p>
          {showFullDescription ? product.description : `${shortDescription}... `}
          {!showFullDescription ? (
            <button
              onClick={() => setShowFullDescription(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                padding: 0,
                fontSize: '1em'
              }}
            >
              Xem thêm
            </button>
          ) : (
            <button
              onClick={() => setShowFullDescription(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                padding: 0,
                fontSize: '1em'
              }}
            >
              Thu gọn
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;