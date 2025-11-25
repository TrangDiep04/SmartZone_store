import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Card sx={{ width: 250 }}>
      <CardMedia component="img" height="140" image={product.image} alt={product.name} />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography color="text.secondary">{product.brand}</Typography>
        <Typography color="primary">{product.price.toLocaleString()} VND</Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;