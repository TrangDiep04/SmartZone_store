import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, type Product } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography, Button, Container, Grid, Divider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = Number(id);
      if (id && !isNaN(productId)) {
        try {
          setLoading(true);
          const res = await productApi.getById(productId);
          setProduct(res);
        } catch (err) {
          console.error("Lỗi fetch API chi tiết:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const handleAction = (type: 'cart' | 'buy') => {
    if (!product) return;
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      navigate('/login');
      return;
    }

    // Đồng bộ logic với ProductCard
    const savedCart = localStorage.getItem('cart');
    let currentCart: any[] = savedCart ? JSON.parse(savedCart) : [];
    
    const pid = product.maSanPham || product.id;
    const index = currentCart.findIndex((item) => (item.maSanPham || item.id) === pid);

    if (index !== -1) {
      currentCart[index].quantity = (currentCart[index].quantity || 0) + 1;
    } else {
      currentCart.push({ 
        ...product, 
        quantity: 1,
        hinhAnh: product.hinhAnh || (product as any).image,
        tenSanPham: product.tenSanPham || (product as any).name,
        gia: product.gia || (product as any).price
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // QUAN TRỌNG: Cập nhật Header
    window.dispatchEvent(new Event("storage"));

    if (type === 'buy') {
      localStorage.setItem("selectedIds", JSON.stringify([String(pid)]));
      navigate("/cart");
    } else {
      alert(`Đã thêm ${product.tenSanPham || 'sản phẩm'} vào giỏ hàng!`);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress />
    </Box>
  );
  
  if (!product) return (
    <Typography sx={{ textAlign: 'center', py: 10 }}>Sản phẩm không tồn tại.</Typography>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={5}>
        {/* Ảnh sản phẩm */}
        <Grid item xs={12} md={5}>
          <Box sx={{ 
            p: 2, 
            border: '1px solid #f0f0f0', 
            borderRadius: '16px', 
            backgroundColor: '#fff',
            textAlign: 'center'
          }}>
            <img 
              src={product.hinhAnh || (product as any).image} 
              alt={product.tenSanPham || (product as any).name} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '450px', 
                objectFit: 'contain',
                borderRadius: '8px' 
              }} 
            />
          </Box>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#2d3436' }}>
            {product.tenSanPham || (product as any).name}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#636e72', mb: 3 }}>
            Mã sản phẩm: {product.maSanPham || product.id}
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: 900, color: '#d63031', mb: 4 }}>
            {Number(product.gia || (product as any).price || 0).toLocaleString()} VNĐ
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => handleAction('cart')} 
              sx={{ flex: 1, borderRadius: '10px', height: '56px', fontWeight: 700 }}
            >
              THÊM GIỎ HÀNG
            </Button>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={() => handleAction('buy')} 
              sx={{ flex: 1, borderRadius: '10px', height: '56px', fontWeight: 700, boxShadow: 'none' }}
            >
              MUA NGAY
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Mô tả sản phẩm</Typography>
          <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
            {product.moTa || (product as any).description || "Chưa có mô tả cho sản phẩm này."}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;