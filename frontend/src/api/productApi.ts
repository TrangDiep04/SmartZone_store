import axios from "axios";

export const getAllProducts = async () => {
  const res = await axios.get("http://localhost:8080/api/products");

  return res.data;
};