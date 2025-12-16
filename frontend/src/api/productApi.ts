import axios from "axios";

// Định nghĩa URL cơ sở (Base URL)
const BASE_URL = "http://localhost:8080/api/products";

// --- INTERFACE PRODUCT TRÙNG KHỚP VỚI JSON TRẢ VỀ ---
export interface Product {
  moTa: string;
  gia: any;
  hinhAnh: any;
  thuongHieu: any;
  tenSanPham: any;
  maSanPham: number;
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  description: string;
  color: string;
  status: string;
  stock: number;
  category: {
    id: number;
    name: string;
    description: string;
  };
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
    if (!keyword || keyword.trim() === "") {
      return productApi.getAllProducts();
    }
    const res = await axios.get(`${BASE_URL}/search`, { params: { keyword } });
    return res.data;
  },

  /** 3. TÌM KIẾM THEO THƯƠNG HIỆU 🏷️ */
  searchByBrand: async (brand: string): Promise<Product[]> => {
    if (!brand || brand.trim() === "") {
      return productApi.getAllProducts();
    }
    const res = await axios.get(`${BASE_URL}/brand`, { params: { brand } });
    return res.data;
  },

  /** 4. LẤY SẢN PHẨM THEO DANH MỤC 📂 */
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const res = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return res.data;
  },

  /** 5. LẤY CHI TIẾT SẢN PHẨM 📝 */
  getById: async (id: number): Promise<Product> => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  },
};