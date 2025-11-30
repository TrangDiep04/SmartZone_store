import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import ProductCard from "../UI/ProductCard";
// ⭐ Sửa import: Phải import toàn bộ object productApi để gọi các hàm tìm kiếm chuyên biệt
import { productApi, type Product} from "../../api/productApi"; 

const ProductList: React.FC = () => {
    // ⭐ Cập nhật kiểu dữ liệu cho products
    const [products, setProducts] = useState<Product[]>([]); 
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Lấy trạng thái ban đầu từ URL
    const initialQuery = searchParams.get('q') ?? '';
    const initialCategory = searchParams.get('category') ?? ''; // category vẫn là string/number
    const initialPage = Number(searchParams.get('page') ?? '0');
    const initialSize = Number(searchParams.get('size') ?? '8');

    const [page, setPage] = useState<number>(initialPage);
    const [size, setSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [query, setQuery] = useState<string>(initialQuery);
    // ⭐ Chuyển category thành categoryId dạng number để dễ sử dụng
    const categoryId = initialCategory ? Number(initialCategory) : undefined;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // debounce input
    const debounceRef = useRef<number | undefined>(undefined);
    
    // ⭐ Biến cờ: Kiểm tra xem có đang tìm kiếm/lọc chuyên biệt không (vì Backend không phân trang cho chúng)
    const isSearchingOrFiltering = !!query.trim() || (categoryId !== undefined && categoryId > 0);


    // ⭐ EFFECT 1: Chạy khi Page, Size hoặc Category thay đổi (Không cần debounce)
    useEffect(() => {
        fetchProducts(page, size, query, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, categoryId]);

    // ⭐ EFFECT 2: Chạy khi Query thay đổi (Có debounce)
    useEffect(() => {
        // debounce search
        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            // Khi query thay đổi, reset về trang 0 và fetch
            if (page !== 0) {
                setPage(0); // Nếu page không phải 0, effect [page] sẽ gọi fetchProducts
            } else {
                fetchProducts(0, size, query, categoryId); // Nếu page đã là 0, gọi fetchProducts trực tiếp
            }
        }, 400); // 400ms debounce
        
        return () => window.clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // ⭐ HÀM CHÍNH: XỬ LÝ VIỆC GỌI API DỰA TRÊN CÁC THAM SỐ
    const fetchProducts = async (pageNum: number, pageSize: number, q: string, categoryIdParam?: number) => {
        setLoading(true);
        setError(null);
        try {
            let res: any;
            
            // ⭐ ĐIỀU CHỈNH LOGIC GỌI API DỰA TRÊN THAM SỐ:
            if (q && q.trim() !== '') {
                // ƯU TIÊN TÌM KIẾM THEO TÊN (q) -> Dùng searchByName
                // Backend không hỗ trợ phân trang cho endpoint này
                res = await productApi.searchByName(q); 
            } else if (categoryIdParam !== undefined && categoryIdParam > 0) {
                // SAU ĐÓ LỌC THEO DANH MỤC -> Dùng getByCategory
                // Backend không hỗ trợ phân trang cho endpoint này
                res = await productApi.getByCategory(categoryIdParam);
            } else {
                // CUỐI CÙNG: Lấy tất cả -> Dùng getAllProducts (có thể có phân trang)
                res = await productApi.getAllProducts({ page: pageNum, size: pageSize });
            }
            
            // ⭐ Sync URL với current params
            const params: Record<string, string> = {};
            if (q) params.q = q;
            if (categoryIdParam) params.category = String(categoryIdParam);
            
            // Chỉ thêm phân trang vào URL nếu không phải là tìm kiếm/lọc chuyên biệt
            if (!isSearchingOrFiltering) {
                params.page = String(pageNum);
                params.size = String(pageSize);
            } else {
                 // Nếu tìm kiếm chuyên biệt, xóa phân trang khỏi URL
                delete params.page;
                delete params.size;
            }
            setSearchParams(params);


            // ⭐ Xử lý Response
            if (Array.isArray(res)) {
                // Nếu là mảng (từ searchByName, getByCategory, hoặc getAllProducts không phân trang)
                setProducts(res);
                setTotalPages(1); // Reset totalPages về 1
            } else if (res && Array.isArray((res as any).content)) {
                // Nếu là đối tượng phân trang của Spring Data JPA
                setProducts((res as any).content);
                setTotalPages((res as any).totalPages ?? 1);
            } else {
                // Fallback an toàn
                setProducts(res ?? []);
                setTotalPages(1);
            }

        } catch (err) {
            console.error("Failed to fetch products", err);
            setError("Không thể tải dữ liệu sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const onPrev = () => setPage((p) => Math.max(0, p - 1));
    const onNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));
    const goTo = (p: number) => setPage(Math.max(0, Math.min(totalPages - 1, p)));

    // ⭐ Điều chỉnh tổng số trang hiển thị
    const finalTotalPages = isSearchingOrFiltering ? 1 : totalPages;


    return (
        <section style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        style={{ padding: '8px 12px', width: 300, borderRadius: 6, border: '1px solid #ddd' }}
                    />
                    {/* Ẩn select size nếu đang tìm kiếm chuyên biệt */}
                    {!isSearchingOrFiltering && (
                        <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }} style={{ padding: '8px', borderRadius: 6 }}>
                            <option value={4}>4 / trang</option>
                            <option value={8}>8 / trang</option>
                            <option value={12}>12 / trang</option>
                        </select>
                    )}
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>{loading ? 'Đang tải...' : `${products.length} sản phẩm`}</div>
            </div>

            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
                {products.map((p: Product, index: number) => (
                    <div key={p?.maSanPham ?? index}>
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>

            {/* pagination controls */}
            {finalTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
                    <button onClick={onPrev} disabled={page === 0} style={{ padding: '6px 10px' }}>Prev</button>
                    {Array.from({ length: finalTotalPages }).map((_, i) => (
                        <button key={i} onClick={() => goTo(i)} style={{ padding: '6px 10px', background: i === page ? '#007bff' : undefined, color: i === page ? 'white' : undefined }}>{i + 1}</button>
                    ))}
                    <button onClick={onNext} disabled={page >= finalTotalPages - 1} style={{ padding: '6px 10px' }}>Next</button>
                </div>
            )}
        </section>
    );
};

export default ProductList;