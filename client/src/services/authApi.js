import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REGISTER
export const registerUser = (data) => API.post("/auth/register", data);

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);
