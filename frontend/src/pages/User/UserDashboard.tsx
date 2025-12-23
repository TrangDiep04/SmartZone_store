import React, { useEffect, useState } from "react";
import { productApi, type Product } from "../../api/productApi";
import { categoryApi, type Category } from "../../api/categoryApi";
import { cartApi } from "../../api/cartApi";
import { useAuth } from "../../context/AuthContext"; // Import useAuth để lấy userId thực tế

import ProductCard from "../../components/UI/ProductCard";
import Sidebar from "../../components/UI/Sidebar";

// Material UI
import { 
  Paper, InputBase, IconButton, Box, TextField, MenuItem, 
  Select, FormControl, InputLabel, Button, Divider, Alert, CircularProgress 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from '@mui/icons-material/FilterList';

const PAGE_SIZE = 21;

const UserDashboard: React.FC = () => {
  // Lấy userId từ AuthContext
  const { userId, isLoggedIn } = useAuth();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  // Bộ lọc và Sắp xếp
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("default");

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  // Lấy danh sách danh mục & sản phẩm khi mount
  useEffect(() => {
    categoryApi.getAll()
      .then(setCategories)
      .catch(() => setError("Không thể tải danh mục sản phẩm"));
    
    fetchProducts("");
  }, []);

  // Hàm fetch sản phẩm từ API
  const fetchProducts = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      let res: Product[] = [];
      if (searchQuery.trim()) {
        const brandRes = await productApi.searchByBrand(searchQuery.trim());
        const nameRes = await productApi.searchByName(searchQuery.trim());
        const combined = [...brandRes, ...nameRes];
        res = Array.from(
          new Map(combined.map((p) => [p.maSanPham || (p as any).id, p])).values()
        );
      } else {
        res = await productApi.getAllProducts();
      }
      setAllProducts(res);
      updatePagination(res);
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const updatePagination = (data: Product[]) => {
    setTotalPages(Math.ceil(data.length / PAGE_SIZE));
    setPage(0);
  };

  // Cập nhật sản phẩm hiển thị theo trang
  useEffect(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setDisplayedProducts(allProducts.slice(start, end));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, allProducts]);

  // --- LOGIC TƯƠNG TÁC ---

  const handleFilter = () => {
    let filtered = [...allProducts];

    // 1. Lọc giá
    if (minPrice) {
      filtered = filtered.filter(p => (p.gia || (p as any).price) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => (p.gia || (p as any).price) <= Number(maxPrice));
    }

    // 2. Sắp xếp
    if (sortOrder === "priceAsc") {
      filtered.sort((a, b) => (a.gia || (a as any).price) - (b.gia || (b as any).price));
    } else if (sortOrder === "priceDesc") {
      filtered.sort((a, b) => (b.gia || (b as any).price) - (a.gia || (a as any).price));
    }

    setAllProducts(filtered);
    updatePagination(filtered);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("default");
    fetchProducts("");
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    setQuery("");
    setLoading(true);
    try {
      const res = categoryId === null 
        ? await productApi.getAllProducts() 
        : await productApi.getByCategory(categoryId);
      setAllProducts(res);
      updatePagination(res);
    } catch (err) {
      setError("Lỗi khi tải sản phẩm theo danh mục");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!isLoggedIn || !userId) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    try {
      const maSanPham = product.maSanPham || (product as any).id;
      // Gọi API với userId từ Context
      await cartApi.addToCart(Number(userId), maSanPham, 1);
      
      alert(`Thành công: Đã thêm vào giỏ hàng!`);
      // Kích hoạt event để Header cập nhật số lượng badge
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      const msg = err.response?.data || "Lỗi kết nối";
      alert(`Lỗi: ${msg}`);
    }
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20, maxWidth: "1440px", margin: "0 auto", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Sidebar categories={categories} onSelect={handleCategorySelect} showAllLabel="Tất cả sản phẩm" />

      <main style={{ flex: 1 }}>
        {/* Thanh tìm kiếm */}
        <Paper component="form" onSubmit={(e) => { e.preventDefault(); fetchProducts(query); }} sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%", borderRadius: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", mb: 3 }}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <IconButton type="submit" sx={{ p: "10px", color: "#1976d2" }}><SearchIcon /></IconButton>
        </Paper>

        {/* Thanh bộ lọc */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', bgcolor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.8)', mr: 1 }}>
            <FilterListIcon sx={{ mr: 0.5 }} />
            <span style={{ fontWeight: 500 }}>Bộ lọc:</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField size="small" placeholder="₫ TỪ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} sx={{ width: 100, bgcolor: 'white' }} />
            <Divider sx={{ width: 10, bgcolor: 'black', borderBottomWidth: 2 }} />
            <TextField size="small" placeholder="₫ ĐẾN" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} sx={{ width: 100, bgcolor: 'white' }} />
          </Box>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select value={sortOrder} label="Sắp xếp" onChange={(e) => setSortOrder(e.target.value)}>
              <MenuItem value="default">Mặc định</MenuItem>
              <MenuItem value="priceAsc">Giá: Thấp đến Cao</MenuItem>
              <MenuItem value="priceDesc">Giá: Cao đến Thấp</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleFilter} sx={{ bgcolor: '#ee4d2d', '&:hover': { bgcolor: '#d73211' } }}>Áp dụng</Button>
          <Button size="small" onClick={handleReset}>Xóa tất cả</Button>
        </Paper>

        <h2>{query ? `Kết quả cho "${query}"` : "Danh sách sản phẩm"}</h2>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>
        ) : (
          <>
            {displayedProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10, color: "#666" }}>Không tìm thấy sản phẩm nào.</Box>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {displayedProducts.map((p) => (
                  <ProductCard key={p.maSanPham || (p as any).id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <Box sx={{ mt: 5, mb: 5, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Trang trước</Button>
                <span style={{ fontWeight: 600 }}>Trang {page + 1} / {totalPages}</span>
                <Button variant="outlined" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Trang sau</Button>
              </Box>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;