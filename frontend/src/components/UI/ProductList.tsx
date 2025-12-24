import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import { Grid, Container, TextField, Box, Pagination, CircularProgress } from "@mui/material";
import ProductCard from "./ProductCard";
import { productApi, type Product } from "../../api/productApi";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [loading, setLoading] = useState<boolean>(false);

  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '0');
  const size = 12; // Thay đổi size thành 12 để khớp với lưới 4 cột (12 chia hết cho 4)
  const [totalPages, setTotalPages] = useState<number>(1);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    const categoryId = searchParams.get('category');
    fetchProducts(page, size, query, categoryId ? Number(categoryId) : undefined);
  }, [page, searchParams.get('category'), query]);

  const fetchProducts = async (p: number, s: number, q: string, catId?: number) => {
    setLoading(true);
    try {
      let res: any;
      if (q) {
        res = await productApi.searchByName(q);
      } else if (catId) {
        res = await productApi.getByCategory(catId);
      } else {
        res = await productApi.getAllProducts({ page: p, size: s });
      }

      const data = res?.content || res;
      setProducts(Array.isArray(data) ? data : []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi fetch sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams({ q: val, page: '0' });
    }, 500);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <TextField 
          placeholder="Tìm kiếm sản phẩm theo tên..." 
          variant="outlined"
          fullWidth
          defaultValue={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* alignItems stretch cực kỳ quan trọng để các cột bằng nhau */
        <Grid container spacing={3} alignItems="stretch">
          {products.map((p, index) => (
            <Grid 
              item 
              key={p.maSanPham || p.id || index} 
              xs={12} sm={6} md={4} lg={3}
              sx={{ display: 'flex' }} // Giúp Card bên trong có thể dùng height: 100%
            >
              <ProductCard product={p} />
            </Grid>
          ))}
          
          {products.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                Không tìm thấy sản phẩm nào.
              </Box>
            </Grid>
          )}
        </Grid>
      )}
      
      {!query && totalPages > 1 && (
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page + 1} 
            color="primary"
            size="large"
            onChange={(_, v) => setSearchParams({ page: (v - 1).toString() })} 
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;



