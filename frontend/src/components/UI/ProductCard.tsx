import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { type Product } from "../../api/productApi";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const name = product.tenSanPham || (product as any).name || "Không có tên";
  const brand = product.thuongHieu || (product as any).brand || "";
  const image = product.hinhAnh || (product as any).image || "";
  const price = product.gia || (product as any).price || 0;
  const id = product.maSanPham || (product as any).id;

  return (
    <Card
      sx={{ 
        height: '100%', display: 'flex', flexDirection: 'column', cursor: "pointer",
        transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)", boxShadow: 6 } 
      }}
      onClick={() => navigate(`/products/${id}`)}
    >
      <CardMedia
        component="img" height="160"
        image={image || "https://via.placeholder.com/160?text=No+Image"}
        alt={name}
        sx={{ objectFit: "contain", p: 1, background: "#fff" }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', height: '2.8em', overflow: 'hidden' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">{brand}</Typography>
        <Typography variant="h6" color="error" sx={{ mt: 'auto', mb: 1 }}>
          {Number(price).toLocaleString()} đ
        </Typography>

        <Button 
          variant="contained" startIcon={<AddShoppingCartIcon />} fullWidth
          onClick={(e) => {
            e.stopPropagation(); 
            onAddToCart(product);
          }}
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;