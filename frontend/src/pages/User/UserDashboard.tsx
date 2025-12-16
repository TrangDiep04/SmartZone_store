import React, { useEffect, useState, useRef } from "react";
import { productApi, type Product } from "../../api/productApi";
import { categoryApi, type Category } from "../../api/categoryApi";
import ProductCard from "../../components/UI/ProductCard";
import Sidebar from "../../components/UI/Sidebar";

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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem('cart');
      const currentCart: Product[] = savedCart ? JSON.parse(savedCart) : [];
      const updatedCart = [...currentCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

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
    // Cuộn lên đầu khi đổi trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, allProducts]);

  const fetchProducts = async (searchQuery: string) => {
    setLoading(true);
    try {
      let res: Product[] = [];
      if (searchQuery.trim()) {
        const brandRes = await productApi.searchByBrand(searchQuery.trim());
        const nameRes = await productApi.searchByName(searchQuery.trim());
        const combined = [...brandRes, ...nameRes];
        const uniqueProducts = Array.from(new Map(combined.map((p) => [p.maSanPham || (p as any).id, p])).values());
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
      const res = categoryId === null ? await productApi.getAllProducts() : await productApi.getByCategory(categoryId);
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchProducts(v), 350);
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <Sidebar categories={categories} onSelect={handleCategorySelect} showAllLabel="Tất cả sản phẩm" />
      <main style={{ flex: 1 }}>
        <input
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm..."
          style={{ padding: "8px 12px", width: "100%", borderRadius: 6, border: "1px solid #ddd", marginBottom: 12 }}
        />
        <h2>{query ? `Kết quả cho "${query}"` : "Danh sách sản phẩm"}</h2>
        
        {loading && <div>Đang tải...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        
        {!loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {products.map((p) => (
                <ProductCard 
                  key={p.maSanPham || (p as any).id} 
                  product={p} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>

            {/* --- BỘ PHÂN TRANG TRANG TRƯỚC / TRANG SAU --- */}
            {totalPages > 1 && (
              <div style={{ 
                marginTop: 30, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 20,
                paddingBottom: 40 
              }}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage(prev => prev - 1)}
                  style={{
                    padding: '8px 16px',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                    backgroundColor: page === 0 ? '#ccc' : '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4
                  }}
                >
                  Trang trước
                </button>

                <span style={{ fontWeight: 'bold' }}>
                  Trang {page + 1} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                  style={{
                    padding: '8px 16px',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                    backgroundColor: page >= totalPages - 1 ? '#ccc' : '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4
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