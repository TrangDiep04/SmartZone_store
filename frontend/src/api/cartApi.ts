import axios from "axios";

const BASE_URL = "http://localhost:8080/api/cart";

export interface CartItemResponse {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string;
  gia: number;
  soLuong: number;
  ngayThem: string;
}

export const cartApi = {
  // Gửi dữ liệu lên Backend (Khớp với CartRequest bên Java)
  addToCart: async (maKhachHang: number, maSanPham: number, soLuong: number) => {
    const response = await axios.post(`${BASE_URL}/add`, {
      maKhachHang,
      maSanPham,
      soLuong,
    });
    return response.data;
  },

  // Lấy danh sách sản phẩm trong giỏ từ Database
  // Lưu ý: Bạn cần bổ sung API này ở Backend nếu chưa có
  getCart: async (maKhachHang: number): Promise<CartItemResponse[]> => {
    const response = await axios.get(`${BASE_URL}/${maKhachHang}`);
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (maKhachHang: number, maSanPham: number) => {
    const response = await axios.delete(`${BASE_URL}/remove`, {
      params: { maKhachHang, maSanPham }
    });
    return response.data;
  }
};