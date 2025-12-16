import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, type Product } from '../../api/productApi';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
        setError('Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const savedCart = localStorage.getItem('cart');
      const currentCart: Product[] = savedCart ? JSON.parse(savedCart) : [];

      // Thêm sản phẩm vào mảng
      const updatedCart = [...currentCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

     
      const productName = product.tenSanPham || (product as any).name || "Sản phẩm";
      alert(`Đã thêm "${productName}" vào giỏ hàng!`);
      
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Lỗi thêm vào giỏ:", err);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: 20 }}>Không tìm thấy sản phẩm</div>;

  // Mapping dữ liệu để hiển thị giao diện an toàn
  const name = product.tenSanPham || (product as any).name || "Không rõ tên";
  const price = product.gia || (product as any).price || 0;
  const image = product.hinhAnh || (product as any).image || "";
  const brand = product.thuongHieu || (product as any).brand || "Đang cập nhật";
  const description = product.moTa || product.description || "Đang cập nhật mô tả...";

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: '0 0 400px' }}>
          <img src={image} alt={name} style={{ width: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1>{name}</h1>
          <p style={{ fontSize: '1.8rem', color: '#d32f2f', fontWeight: 'bold' }}>
            {Number(price).toLocaleString()} VNĐ
          </p>
          <p><strong>Thương hiệu:</strong> {brand}</p>
          <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
            <button onClick={handleAddToCart} style={{ flex: 1, padding: '15px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
              THÊM VÀO GIỎ
            </button>
            <button onClick={handleBuyNow} style={{ flex: 1, padding: '15px', background: '#f57c00', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
              MUA NGAY
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Mô tả sản phẩm</h3>
        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {showFullDescription ? description : `${description.slice(0, 500)}...`}
          <button onClick={() => setShowFullDescription(!showFullDescription)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', marginLeft: 5 }}>
            {showFullDescription ? "Thu gọn" : "Xem thêm"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;