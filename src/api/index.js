import axios from "axios"
import useAuthStore from "../store/authStore"

// zustand persist가 "auth-storage" 키에 { state: { token, user, ... } } 형태로 저장
const getToken = () => {
  try {
    const authStorage = JSON.parse(localStorage.getItem("auth-storage"))
    return authStorage?.state?.token ?? null
  } catch {
    return null
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api