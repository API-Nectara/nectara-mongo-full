import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

// Interceptor opcional para mensajes de error más claros
api.interceptors.response.use(
  r => r,
  err => {
    const data = err?.response?.data;
    if (Array.isArray(data?.errors)) {
      const list = data.errors.map(e => `${e.path}: ${e.msg}`).join(" | ");
      return Promise.reject(new Error(list));
    }
    const msg = data?.error || data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);