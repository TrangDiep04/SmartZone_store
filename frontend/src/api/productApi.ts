import axios from "axios";

const BASE_URL = "http://localhost:8080/api/products";

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
  // Bổ sung thuộc tính này để không bị lỗi gạch đỏ ở ProductCard và Detail
  quantity?: number; 
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
}

export const productApi = {
  getAllProducts: async (params?: ProductQueryParams): Promise<any> => {
    const res = await axios.get(BASE_URL, { params });
    return res.data;
  },

  searchByName: async (keyword: string): Promise<Product[]> => {
    if (!keyword || keyword.trim() === "") {
      return productApi.getAllProducts();
    }
    const res = await axios.get(`${BASE_URL}/search`, { params: { keyword } });
    return res.data;
  },

  searchByBrand: async (brand: string): Promise<Product[]> => {
    if (!brand || brand.trim() === "") {
      return productApi.getAllProducts();
    }
    const res = await axios.get(`${BASE_URL}/brand`, { params: { brand } });
    return res.data;
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const res = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return res.data;
  },

  getById: async (id: number): Promise<Product> => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  },
};