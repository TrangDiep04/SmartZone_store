import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, type Product } from '../../api/productApi';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // lấy id từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Quay lại
      </button>

      <h2>{product.tenSanPham}</h2>
      <p><strong>Thương hiệu:</strong> {product.thuongHieu}</p>
      <p><strong>Giá:</strong> {product.gia?.toLocaleString()} VND</p>
      <p><strong>Mô tả:</strong> {product.moTa}</p>

      {product.hinhAnh && (
        <img
          src={product.hinhAnh}
          alt={product.tenSanPham}
          style={{ maxWidth: 400, marginTop: 20 }}
        />
      )}
    </div>
  );
};

export default ProductDetail;