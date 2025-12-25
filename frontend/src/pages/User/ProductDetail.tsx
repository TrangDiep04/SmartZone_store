import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, type Product } from '../../api/productApi';
import axios from 'axios';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [soLuong, setsoLuong] = useState<number>(1);


  const maKhachHang = 16;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const res = await productApi.getById(Number(id));
          setProduct(res);
          const defaultImage = res.image || "";
          setMainImage(defaultImage);
        }
      } catch (err) {
        setError('Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (soLuong > product.stock) {
      alert("Số lượng vượt quá tồn kho, vui lòng chọn ít hơn!");
      return;
    }

    try {
      await axios.post(`/api/cart/${maKhachHang}/add`, {
        maSanPham: product.id || (product as any).maSanPham,
        soLuong: soLuong,
      });
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (err) {
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (soLuong > product.stock) {
      alert("Số lượng vượt quá tồn kho, vui lòng chọn ít hơn!");
      return;
    }

    // Lưu cả thông tin sản phẩm và số lượng
    const checkoutItem = {
      maSanPham: product.id || (product as any).maSanPham,
      tenSanPham: product.name,
      gia: product.price,
      soLuong: soLuong,
      image: product.image,
      brand: product.brand,
      description: product.description,
    };

    localStorage.setItem("checkoutDetail", JSON.stringify([checkoutItem]));

    navigate("/order");
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: 20 }}>Không tìm thấy sản phẩm</div>;

  const { name, brand, price, description, image, image2, image3, image4, image5, stock } = product;

  const validDescription =
    !description || description.trim() === "" || description.trim() === "Không có mô tả"
      ? "Đang cập nhật mô tả..."
      : description;

  const splitDescription = (text: string): string[] => {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const thumbnails = [image2, image3, image4, image5].filter(Boolean);

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: '0 0 400px' }}>
          <img
            src={mainImage}
            alt={name}
            style={{
              width: '100%',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 20,
            }}
          />
          {thumbnails.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Ảnh ${index + 2}`}
                  onClick={() => setMainImage(thumb)}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 4,
                    cursor: 'pointer',
                    border: thumb === mainImage ? '2px solid #1976d2' : '1px solid #ccc',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1>{name}</h1>
          <p style={{ fontSize: '1.8rem', color: '#d32f2f', fontWeight: 'bold' }}>
            {Number(price).toLocaleString()} VNĐ
          </p>
          <p><strong>Thương hiệu:</strong> {brand}</p>
          <p><strong>Kho:</strong> {stock}</p>

          {/* ✅ chọn số lượng */}
          <div style={{ marginTop: 20 }}>
            <label>Số lượng: </label>
            <input
              type="number"
              min={1}
              value={soLuong}
              onChange={(e) => setsoLuong(Number(e.target.value))}
              style={{ width: 80, padding: 5 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: '15px',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              THÊM VÀO GIỎ
            </button>

            <button
              onClick={handleBuyNow}
              style={{
                flex: 1,
                padding: "15px",
                background: "#f57c00",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Mô tả sản phẩm</h3>
        <div style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {showFullDescription
            ? splitDescription(validDescription).map((line, index) => (
                <p key={index}>{line}</p>
              ))
            : `${validDescription.slice(0, 500)}...`}
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              marginLeft: 5
            }}
          >
            {showFullDescription ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;