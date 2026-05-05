import axios from "axios";
import useAuthStore from "../store/authStore";

// JWT 토큰 디코딩 함수 (base64)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 페이지 로드 시 토큰이 있으면 자동으로 user 세팅
const token = localStorage.getItem("token");
if (token) {
  const decoded = decodeToken(token);
  if (decoded) {
    useAuthStore.getState().setUser({
      id: decoded.sub,
      email: decoded.email,
    });
  }
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;