import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { type Product } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";

interface ProductCardProps { product: Product; }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  // Xác định ID duy nhất
  const pid = product.maSanPham || product.id;

  const handleAction = (e: React.MouseEvent, type: 'cart' | 'buy') => {
    e.stopPropagation();
    
    // 1. Kiểm tra đăng nhập
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để mua hàng!");
      navigate('/login');
      return;
    }

    // 2. Lấy giỏ hàng từ LocalStorage
    const savedCart = localStorage.getItem('cart');
    let currentCart: any[] = savedCart ? JSON.parse(savedCart) : [];

    // 3. Tìm sản phẩm trong giỏ (kiểm tra cả maSanPham và id)
    const index = currentCart.findIndex((item) => 
      (item.maSanPham || item.id) === pid
    );

    if (index !== -1) {
      currentCart[index].quantity = (currentCart[index].quantity || 0) + 1;
    } else {
      // Lưu sản phẩm mới với quantity mặc định là 1
      currentCart.push({ 
        ...product, 
        quantity: 1,
        // Đảm bảo các trường dữ liệu luôn tồn tại để Header/Cart hiển thị được
        hinhAnh: product.hinhAnh || (product as any).image,
        tenSanPham: product.tenSanPham || (product as any).name,
        gia: product.gia || (product as any).price
      });
    }

    // 4. Lưu lại và PHÁT SỰ KIỆN để Header cập nhật số lượng
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage"));

    if (type === 'buy') {
      localStorage.setItem("selectedIds", JSON.stringify([String(pid)]));
      navigate("/order"); // Chuyển hướng vào giỏ hàng để xác nhận thanh toán
    } else {
      // Hiệu ứng thông báo nhẹ (có thể dùng Snackbar thay vì alert)
      alert(`Đã thêm ${product.tenSanPham || 'sản phẩm'} vào giỏ hàng!`);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '16px',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          borderColor: 'primary.light'
        }
      }}
    >
      <Box sx={{ pt: 2, px: 2, textAlign: 'center' }}>
        <CardMedia
          component="img"
          image={product.hinhAnh || (product as any).image || "https://via.placeholder.com/180"}
          alt={product.tenSanPham || (product as any).name}
          sx={{ 
            height: 180, 
            objectFit: "contain", 
            cursor: "pointer",
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' } 
          }}
          onClick={() => navigate(`/products/${pid}`)}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: '20px !important' }}>
        <Typography 
          variant="body1" 
          onClick={() => navigate(`/products/${pid}`)}
          sx={{ 
            fontWeight: 600, 
            mb: 1, 
            height: '45px', 
            cursor: 'pointer',
            color: '#2d3436',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            '&:hover': { color: 'primary.main' }
          }}
        >
          {product.tenSanPham || (product as any).name || "Sản phẩm không tên"}
        </Typography>
        
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#d63031' }}>
          {Number(product.gia || (product as any).price || 0).toLocaleString()} đ
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<AddShoppingCartIcon />}
            onClick={(e) => handleAction(e, 'cart')}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
          >
            Thêm giỏ hàng
          </Button>

          <Button 
            variant="contained" 
            fullWidth 
            color="primary"
            startIcon={<ShoppingBagIcon />}
            onClick={(e) => handleAction(e, 'buy')}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Mua ngay
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;