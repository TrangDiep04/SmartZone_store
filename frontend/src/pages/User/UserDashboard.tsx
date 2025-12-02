import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import { productApi, type Product } from '../../api/productApi';
import { categoryApi, type Category } from '../../api/categoryApi';
import ProductCard from '../../components/UI/ProductCard';
import Sidebar from '../../components/UI/Sidebar';

const PAGE_SIZE = 20;

const UserDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const debounceRef = useRef<number | undefined>(undefined);

  // Load danh mục khi mount
  useEffect(() => {
    categoryApi.getAll()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Load sản phẩm ban đầu
  useEffect(() => {
    fetchProducts('');
  }, []);

  // Cắt sản phẩm theo trang
  useEffect(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setProducts(allProducts.slice(start, end));
  }, [page, allProducts]);

  // Tìm kiếm theo tên hoặc thương hiệu
  const fetchProducts = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      let res: Product[] = [];

      if (searchQuery.trim()) {
        const brandRes = await productApi.searchByBrand(searchQuery.trim());
        const nameRes = await productApi.searchByName(searchQuery.trim());
        const combined = [...brandRes, ...nameRes];
        const uniqueProducts = Array.from(new Map(combined.map(p => [p.maSanPham, p])).values());
        res = uniqueProducts;
      } else {
        res = await productApi.getAllProducts();
      }

      setAllProducts(res);
      setTotalPages(Math.ceil(res.length / PAGE_SIZE));
      setPage(0);
      setProducts(res.slice(0, PAGE_SIZE));
    } catch (err) {
      console.error('Failed to load products', err);
      setError('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Lấy sản phẩm theo danh mục
  const handleCategorySelect = async (categoryId: number | null) => {
    setQuery('');
    setLoading(true);
    setError(null);
    try {
      const res = categoryId === null
        ? await productApi.getAllProducts()
        : await productApi.getByCategory(categoryId);

      setAllProducts(res);
      setTotalPages(Math.ceil(res.length / PAGE_SIZE));
      setPage(0);
      setProducts(res.slice(0, PAGE_SIZE));
    } catch (err) {
      console.error(err);
      setError('Không thể tải sản phẩm theo danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Debounce tìm kiếm
  const onSearchChange = (v: string) => {
    setQuery(v);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchProducts(v);
    }, 350);
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <Sidebar
        categories={categories}
        onSelect={handleCategorySelect}
        showAllLabel="Tất cả sản phẩm"
      />
      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
            style={{ padding: '8px 12px', width: '100%', borderRadius: 6, border: '1px solid #ddd' }}
          />
        </div>

        <h2 style={{ margin: '8px 0 12px' }}>
          {query
            ? `Kết quả tìm kiếm cho "${query}"`
            : 'Danh sách sản phẩm'}
        </h2>

        {loading && <div>Đang tải sản phẩm...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {products.map((p: Product, i: number) => (
                <div key={p?.maSanPham ?? i}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                  style={{ marginRight: 10 }}
                >
                  Trang trước
                </button>
                <span>
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{ marginLeft: 10 }}
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