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
    /** 1. LẤY TẤT CẢ SẢN PHẨM 📦 */
    getAllProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
        const res = await axios.get(BASE_URL, { params });
        return res.data;
    },

    /** 2. TÌM KIẾM THEO TÊN SẢN PHẨM 🔍 */
    searchByName: async (keyword: string): Promise<Product[]> => {
        if (!keyword || keyword.trim() === '') {
            return productApi.getAllProducts();
        }
        const res = await axios.get(`${BASE_URL}/search`, { params: { keyword } });
        return res.data;
    },

    /** 3. TÌM KIẾM THEO THƯƠNG HIỆU 🏷️ */
    searchByBrand: async (thuongHieu: string): Promise<Product[]> => {
        if (!thuongHieu || thuongHieu.trim() === '') {
            return productApi.getAllProducts();
        }
        const res = await axios.get(`${BASE_URL}/brand`, { params: { brand: thuongHieu } });
        return res.data;
    },

    /** 4. LẤY SẢN PHẨM THEO DANH MỤC 📂 */
    getByCategory: async (categoryId: number): Promise<Product[]> => {
        const res = await axios.get(`${BASE_URL}/category/${categoryId}`);
        return res.data;
    },

    /** 5. LẤY CHI TIẾT SẢN PHẨM 📝 */
    getById: async (maSanPham: number): Promise<Product> => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
    }
};