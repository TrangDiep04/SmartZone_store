import axios from "axios";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

const BASE_URL = "http://localhost:8080/api/categories";

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await axios.get(BASE_URL);
    return res.data;
  }
};
