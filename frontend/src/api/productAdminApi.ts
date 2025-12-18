import axios from 'axios';

// Định nghĩa URL backend
const ADMIN_API_URL = 'http://localhost:8080/api/admin/products';

// Interface Product khớp với Model Backend của bạn
export interface Product {
    id?: number;
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
        name?: string;
    };
}

export const productAdminApi = {
    // Lấy tất cả sản phẩm
    getAll: () => axios.get<Product[]>(ADMIN_API_URL),

    // Lấy 1 sản phẩm theo ID
    getById: (id: number) => axios.get<Product>(`${ADMIN_API_URL}/${id}`),

    // Thêm mới sản phẩm
    create: (product: Product) => axios.post<Product>(ADMIN_API_URL, product),

    // Cập nhật sản phẩm
    update: (id: number, product: Product) => axios.put<Product>(`${ADMIN_API_URL}/${id}`, product),

    // Xóa sản phẩm
    delete: (id: number) => axios.delete(`${ADMIN_API_URL}/${id}`),
};