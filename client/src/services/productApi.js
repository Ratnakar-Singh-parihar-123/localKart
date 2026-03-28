import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// Attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// GET ALL PRODUCTS
export const getProducts = () => API.get("/api/products");

// CREATE PRODUCT
export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// UPDATE PRODUCT
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE PRODUCT
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
