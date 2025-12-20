import React, { useEffect, useState } from "react";
import { productApi, type Product } from "../../api/productApi";
import { categoryApi, type Category } from "../../api/categoryApi";

import ProductCard from "../../components/UI/ProductCard";
import Sidebar from "../../components/UI/Sidebar";

// Material UI
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

  const addToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem("cart");
      const currentCart: Product[] = savedCart ? JSON.parse(savedCart) : [];
      const updatedCart = [...currentCart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      const productName = product.tenSanPham || (product as any).name || "Sản phẩm";
      alert(`Đã thêm "${productName}" vào giỏ hàng!`);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => setError("Không thể tải danh mục"));
  }, []);

  useEffect(() => {
    fetchProducts("");
  }, []);

  useEffect(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setProducts(allProducts.slice(start, end));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, allProducts]);

  const fetchProducts = async (searchQuery: string) => {
    setLoading(true);
    try {
      let res: Product[] = [];
      if (searchQuery.trim()) {
        const brandRes = await productApi.searchByBrand(searchQuery.trim());
        const nameRes = await productApi.searchByName(searchQuery.trim());
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
      setError("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    setQuery("");
    setLoading(true);
    try {
      const res =
        categoryId === null
          ? await productApi.getAllProducts()
          : await productApi.getByCategory(categoryId);
      setAllProducts(res);
      setTotalPages(Math.ceil(res.length / PAGE_SIZE));
      setPage(0);
    } catch (err) {
      setError("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const onSearchChange = (v: string) => {
    setQuery(v);
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
      }}
    >
      <Sidebar
        categories={categories}
        onSelect={handleCategorySelect}
        showAllLabel="Tất cả sản phẩm"
        style={{ minWidth: 220, maxWidth: 300, flexShrink: 0 }}
      />

      <main style={{ flex: 1 }}>
        {/* Thanh tìm kiếm hiện đại */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            mb: 2,
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..."
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px", color: "#1976d2" }}>
            <SearchIcon />
          </IconButton>
        </Paper>

        <h2>{query ? `Kết quả cho "${query}"` : "Danh sách sản phẩm"}</h2>

        {loading && <div>Đang tải...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {!loading && (
          <>
            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
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

            {totalPages > 1 && (
              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 20,
                  paddingBottom: 40,
                }}
              >
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                  style={{
                    padding: "8px 16px",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    backgroundColor: page === 0 ? "#ccc" : "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Trang trước
                </button>

                <span style={{ fontWeight: "bold" }}>
                  Trang {page + 1} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{
                    padding: "8px 16px",
                    cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                    backgroundColor: page >= totalPages - 1 ? "#ccc" : "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
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
