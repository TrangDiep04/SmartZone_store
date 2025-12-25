import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { type Product } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { cartApi } from "../../api/cartApi"; // ✅ import cartApi

interface ProductCardProps { product: Product; }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth(); // giả sử context có user.id hoặc maKhachHang

  // Xác định ID duy nhất
  const pid = product.maSanPham || product.id;

  const handleAction = async (e: React.MouseEvent, type: 'cart' | 'buy') => {
    e.stopPropagation();

    // 1. Kiểm tra đăng nhập
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để mua hàng!");
      navigate('/login');
      return;
    }

    try {
      // 2. Gọi API thêm vào giỏ hàng
      const addedItem = await cartApi.addToCart(user.maKhachHang, pid, 1);

      if (type === 'buy') {
        // ✅ lưu sản phẩm vừa chọn để checkout
        localStorage.setItem("checkoutDetail", JSON.stringify([addedItem]));
        navigate("/order");
      } else {
        alert(`Đã thêm ${product.tenSanPham || product.name} vào giỏ hàng!`);
      }

      // Nếu bạn có Header hiển thị số lượng giỏ hàng, có thể phát sự kiện để update
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px',
      transition: 'all 0.3s ease-in-out', border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: 'primary.light' }
    }}>
      <Box sx={{ pt: 2, px: 2, textAlign: 'center' }}>
        <CardMedia
          component="img"
          image={product.hinhAnh || (product as any).image || "https://via.placeholder.com/180"}
          alt={product.tenSanPham || (product as any).name}
          sx={{ height: 180, objectFit: "contain", cursor: "pointer",
            transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }}
          onClick={() => navigate(`/products/${pid}`)}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: '20px !important' }}>
        <Typography variant="body1" onClick={() => navigate(`/products/${pid}`)}
          sx={{ fontWeight: 600, mb: 1, height: '45px', cursor: 'pointer',
            color: '#2d3436', overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4,
            '&:hover': { color: 'primary.main' } }}>
          {product.tenSanPham || (product as any).name || "Sản phẩm không tên"}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#d63031' }}>
          {Number(product.gia || (product as any).price || 0).toLocaleString()} đ
        </Typography>
{/*
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
*/}
      </CardContent>
    </Card>
  );
};

export default ProductCard;