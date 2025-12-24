import axios from "axios";

const BASE_URL = "http://localhost:8080/api/cart";

export interface CartItemResponse {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string;
  gia: number;
  soLuong: number;
}

export const cartApi = {
  getCart: async (userId: number) => {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  },
  addToCart: async (maKhachHang: number, maSanPham: number, soLuong: number) => {
    return (await axios.post(`${BASE_URL}/add`, { maKhachHang, maSanPham, soLuong })).data;
  },
  removeFromCart: async (maKhachHang: number, maSanPham: number) => {
    return (await axios.delete(`${BASE_URL}/remove`, { params: { maKhachHang, maSanPham } })).data;
  }
};