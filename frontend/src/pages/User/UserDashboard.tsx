import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
// ⭐ Sửa import: Import object productApi và interface Product
import { productApi, type Product } from '../../api/productApi'; 
import ProductCard from '../../components/UI/ProductCard';
import { useNavigate } from 'react-router-dom';

const PREVIEW_SIZE = 6;

const UserDashboard: React.FC = () => {
    const { userRole } = useAuth();
    // ⭐ Cập nhật kiểu dữ liệu cho preview
    const [preview, setPreview] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState<string>('');
    const debounceRef = useRef<number | undefined>(undefined);
    const navigate = useNavigate();

    // ⭐ Khi component mount, tải sản phẩm nổi bật
    useEffect(() => {
        fetchPreview(query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ⭐ SỬA LOGIC: Sử dụng các hàm API chuyên biệt
    const fetchPreview = async (q = '') => {
        setLoading(true);
        try {
            let res: any;
            
            if (q && q.trim() !== '') {
                // Nếu có query (tìm kiếm nhanh), dùng searchByName
                // Backend không hỗ trợ phân trang cho endpoint /search, nên chúng ta sẽ dùng slice ở Frontend
                res = await productApi.searchByName(q.trim()); 
            } else {
                // Nếu không có query (tải sản phẩm nổi bật ban đầu), dùng getAllProducts (có thể có phân trang)
                const params = { page: 0, size: PREVIEW_SIZE };
                res = await productApi.getAllProducts(params);
            }

            // Xử lý kết quả trả về
            let resultList: Product[] = [];
            
            if (Array.isArray(res)) {
                // Nếu là mảng (từ searchByName)
                resultList = res;
            } else if (res && Array.isArray((res as any).content)) {
                // Nếu là đối tượng phân trang (từ getAllProducts)
                resultList = (res as any).content;
            } else if (res && Array.isArray((res as any).items)) {
                resultList = (res as any).items;
            } else {
                 // Fallback
                resultList = res ?? [];
            }
            
            // Cắt gọn danh sách để hiển thị PREVIEW_SIZE (dù là từ search hay getAll)
            setPreview(resultList.slice(0, PREVIEW_SIZE));

        } catch (err) {
            console.error('Failed to load preview products', err);
            setPreview([]);
        } finally {
            setLoading(false);
        }
    };

    const onSearchChange = (v: string) => {
        setQuery(v);
        // ⭐ Debounce: chỉ gọi fetchPreview sau 350ms khi người dùng ngừng gõ
        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            fetchPreview(v);
        }, 350);
    };

    // ⭐ Chuyển hướng đến trang danh sách sản phẩm
    const onViewAll = () => {
        const params: any = {};
        if (query) params.q = query;
        // Chuyển hướng tới trang `/products` (hoặc `/product-list`)
        const targetPath = `/product-list${query ? `?q=${query}` : ''}`; 
        navigate(targetPath);
    };

    return (
        <div style={{ display: 'flex', gap: 20, padding: 20 }}>
            {/* Main content */}
            <main style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                            value={query}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            style={{ padding: '8px 12px', width: 420, borderRadius: 6, border: '1px solid #ddd' }}
                        />
                        <button
                            // ⭐ Gọi fetchPreview(query) ngay lập tức khi nhấn nút
                            onClick={() => fetchPreview(query)}
                            aria-label="Tìm"
                            title="Tìm"
                            style={{ width: 40, height: 40, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 21l-4.35-4.35" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button onClick={onViewAll} style={{ padding: '8px 12px', borderRadius: 6, background: '#007bff', color: 'white', border: 'none' }}>Xem tất cả</button>
                    </div>
                </div>

                <section>
                    <h2 style={{ margin: '8px 0 12px' }}>
                        {/* Thay đổi tiêu đề dựa trên trạng thái tìm kiếm */}
                        {query ? `Kết quả nhanh cho "${query}"` : 'Sản phẩm nổi bật'}
                    </h2>

                    {loading ? (
                        <div>Đang tải sản phẩm...</div>
                    ) : (
                        // ⭐ Sử dụng Product interface đã cập nhật
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                            {preview.map((p: Product, i: number) => (
                                <div key={p?.maSanPham ?? i}>
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Hiển thị nút Xem tất cả chỉ khi có kết quả */}
                    {preview.length > 0 && query && (
                         <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <button onClick={onViewAll} style={{ padding: '8px 12px', borderRadius: 6, background: '#007bff', color: 'white', border: 'none' }}>
                                Xem tất cả kết quả cho "{query}"
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;