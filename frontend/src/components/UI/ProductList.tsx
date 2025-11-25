import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ProductCard from "../UI/ProductCard";
import { getAllProducts } from "../../api/productApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res));
  }, []);

  return (
    <Grid container spacing={3} sx={{ marginTop: 4 }}>
      {products.map((p: any) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;