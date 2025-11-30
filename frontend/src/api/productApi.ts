import axios from "axios";

// Định nghĩa URL cơ sở (Base URL)
const BASE_URL = "http://localhost:8080/api/products"; 

// --- INTERFACE PRODUCT TRÙNG KHỚP VỚI Products.java ---
export interface Product {
    maSanPham: number;
    tenSanPham: string;
    thuongHieu: string;
    hinhAnh: string;
    namSanXuat: number;
    gia: number; // Long trong Java, ánh xạ sang number trong TS
    moTa: string;
    mauSac: string;
    trangThai: string; 
    ngayRaMat: string; // java.sql.Date, ánh xạ sang string
    soLuongTon: number;
    maDanhMuc: number;
}

// Định nghĩa kiểu dữ liệu cho tham số truy vấn chung (nếu cần phân trang)
export interface ProductQueryParams {
    page?: number;
    size?: number;
}

export const productApi = {
    
    /**
     * 1. LẤY TẤT CẢ SẢN PHẨM 📦
     * ENDPOINT: GET /api/products
     */
    getAllProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
        const res = await axios.get(BASE_URL, { params });
        return res.data;
    },

    /**
     * 2. TÌM KIẾM THEO TÊN SẢN PHẨM 🔍
     * ENDPOINT: GET /api/products/search?keyword=...
     * Tham số Backend: keyword
     */
    searchByName: async (keyword: string): Promise<Product[]> => {
        if (!keyword || keyword.trim() === '') {
            return productApi.getAllProducts(); 
        }
        
        const res = await axios.get(`${BASE_URL}/search`, { 
            params: { keyword: keyword } 
        });
        return res.data;
    },

    /**
     * 3. TÌM KIẾM THEO THƯƠNG HIỆU 🏷️
     * ENDPOINT: GET /api/products/brand?name=...
     * Tham số Backend: name
     */
    searchByBrand: async (brandName: string): Promise<Product[]> => {
        if (!brandName || brandName.trim() === '') {
            return productApi.getAllProducts(); 
        }

        const res = await axios.get(`${BASE_URL}/brand`, { 
            params: { name: brandName } 
        });
        return res.data;
    },

    /**
     * 4. LẤY SẢN PHẨM THEO DANH MỤC 📂
     * ENDPOINT: GET /api/products/category/{categoryId}
     * Tham số Backend: Path Variable {categoryId}
     */
    getByCategory: async (categoryId: number): Promise<Product[]> => {
        const res = await axios.get(`${BASE_URL}/category/${categoryId}`);
        return res.data;
    }
};