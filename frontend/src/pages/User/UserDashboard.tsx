import React, { useEffect, useState } from "react";
import { productApi, type Product } from "../../api/productApi";
import { categoryApi, type Category } from "../../api/categoryApi";
import { cartApi } from "../../api/cartApi"; // Import cartApi để kết nối Backend

import ProductCard from "../../components/UI/ProductCard";
import Sidebar from "../../components/UI/Sidebar";

// Material UI
<<<<<<< HEAD
import { Paper, InputBase, IconButton, CircularProgress, Alert } from "@mui/material";
=======
import { Paper, InputBase, IconButton,Box,TextField,MenuItem,Select,FormControl,InputLabel,Button,Divider} from "@mui/material";
>>>>>>> e9736ddfc67e67ea46c35f60372d8cc76e13051f
import SearchIcon from "@mui/icons-material/Search";


//them vao loc
import FilterListIcon from '@mui/icons-material/FilterList';

const PAGE_SIZE = 21;

const UserDashboard: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  //chen vao day chuc nang loc
const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("default");

  const handleFilter = () => {
      let filtered = [...allProducts];

      // 1. Lọc giá
      if (minPrice) {
        filtered = filtered.filter(p => (p.price || (p as any).gia) >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => (p.price || (p as any).gia) <= Number(maxPrice));
      }

      // 2. Sắp xếp
      if (sortOrder === "priceAsc") {
        filtered.sort((a, b) => (a.price || (a as any).gia) - (b.price || (b as any).gia));
      } else if (sortOrder === "priceDesc") {
        filtered.sort((a, b) => (b.price || (b as any).gia) - (a.price || (a as any).gia));
      }

      // 3. Cập nhật state (QUAN TRỌNG)
      setAllProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
      setPage(0); // Về trang đầu tiên
    };



  // Hàm thêm vào giỏ hàng gọi đến Backend
  const addToCart = async (product: Product) => {
    try {
      // Giả lập maKhachHang = 1 (Sau này lấy từ User Context hoặc JWT)
      const maKhachHang = 1;
      const maSanPham = product.maSanPham || (product as any).id;
      const soLuong = 1;

      // Gọi API từ cartApi đã tạo
      await cartApi.addToCart(maKhachHang, maSanPham, soLuong);

      const productName = product.tenSanPham || (product as any).name || "Sản phẩm";
      alert(`Đã thêm "${productName}" vào giỏ hàng thành công!`);
      
      // Bắn event để cập nhật badge số lượng trên Header (nếu có)
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      const errorMsg = err.response?.data || "Không thể kết nối tới máy chủ";
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  // Lấy danh sách danh mục khi component mount
  useEffect(() => {
    categoryApi.getAll()
      .then(setCategories)
      .catch(() => setError("Không thể tải danh mục sản phẩm"));
  }, []);

  // Lấy danh sách sản phẩm lần đầu
  useEffect(() => {
    fetchProducts("");
  }, []);

  // Phân trang Local (Client-side pagination dựa trên allProducts)
  useEffect(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setProducts(allProducts.slice(start, end));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, allProducts]);

  // Hàm fetch sản phẩm từ API
  const fetchProducts = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      let res: Product[] = [];
      if (searchQuery.trim()) {
        const brandRes = await productApi.searchByBrand(searchQuery.trim());
        const nameRes = await productApi.searchByName(searchQuery.trim());
        
        // Gộp kết quả và loại bỏ trùng lặp dựa trên mã sản phẩm
        const combined = [...brandRes, ...nameRes];
        const uniqueProducts = Array.from(
          new Map(combined.map((p) => [p.maSanPham || (p as any).id, p])).values()
        );
        res = uniqueProducts;
      } else {
        res = await productApi.getAllProducts();
      }
      setAllProducts(res);
      setTotalPages(Math.ceil(res.length / PAGE_SIZE));
      setPage(0);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối Backend.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn danh mục từ Sidebar
  const handleCategorySelect = async (categoryId: number | null) => {
    setQuery("");
    setLoading(true);
    setError(null);
    try {
      const res =
        categoryId === null
          ? await productApi.getAllProducts()
          : await productApi.getByCategory(categoryId);
      setAllProducts(res);
      setTotalPages(Math.ceil(res.length / PAGE_SIZE));
      setPage(0);
    } catch (err) {
      setError("Lỗi khi tải sản phẩm theo danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchProducts(query);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 20,
        maxWidth: "1440px",
        margin: "0 auto",
        flexWrap: "wrap",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh"
      }}
    >
      <Sidebar
        categories={categories}
        onSelect={handleCategorySelect}
        showAllLabel="Tất cả sản phẩm"
        style={{ minWidth: 220, maxWidth: 300, flexShrink: 0 }}
      />

      <main style={{ flex: 1 }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            mb: 3,
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px", color: "#1976d2" }}>
            <SearchIcon />
          </IconButton>
        </Paper>

<<<<<<< HEAD
        <h2 style={{ marginBottom: "20px", fontWeight: 600 }}>
          {query ? `Kết quả cho "${query}"` : "Danh sách sản phẩm"}
        </h2>
=======
{/* 2. CHÈN ĐOẠN NÀY VÀO ĐÂY (Giữa thanh tìm kiếm và tiêu đề h2) */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.8)', mr: 1 }}>
              <FilterListIcon sx={{ mr: 0.5 }} />
              <span style={{ fontWeight: 500 }}>Bộ lọc:</span>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField size="small" placeholder="₫ TỪ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} sx={{ width: 100, bgcolor: 'white' }} />
              <Divider sx={{ width: 10, bgcolor: 'black' }} />
              <TextField size="small" placeholder="₫ ĐẾN" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} sx={{ width: 100, bgcolor: 'white' }} />
            </Box>

            <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select value={sortOrder} label="Sắp xếp theo" onChange={(e) => setSortOrder(e.target.value)}>
                <MenuItem value="default">Mặc định</MenuItem>
                <MenuItem value="priceAsc">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="priceDesc">Giá: Cao đến Thấp</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleFilter} sx={{ bgcolor: '#ee4d2d', '&:hover': { bgcolor: '#d73211' }, textTransform: 'none' }}>
              Áp dụng
            </Button>

            <Button size="small" sx={{ textTransform: 'none' }} onClick={() => { setMinPrice(""); setMaxPrice(""); setSortOrder("default"); fetchProducts(""); }}>
              Xóa tất cả
            </Button>
          </Paper>

{/* 3. Tiêu đề h2 cũ của bạn */}

        <h2>{query ? `Kết quả cho "${query}"` : "Danh sách sản phẩm"}</h2>
>>>>>>> e9736ddfc67e67ea46c35f60372d8cc76e13051f

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "50px", color: "#666" }}>
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            ) : (
              <div
                className="product-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {products.map((p) => (
                  <ProductCard
                    key={p.maSanPham || (p as any).id}
                    product={p}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 15,
                  paddingBottom: 40,
                }}
              >
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                  style={{
                    padding: "10px 20px",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    backgroundColor: page === 0 ? "#e0e0e0" : "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    transition: "0.3s"
                  }}
                >
                  Trang trước
                </button>

                <span style={{ fontWeight: 600, color: "#444" }}>
                  Trang {page + 1} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{
                    padding: "10px 20px",
                    cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                    backgroundColor: page >= totalPages - 1 ? "#e0e0e0" : "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    transition: "0.3s"
                  }}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;