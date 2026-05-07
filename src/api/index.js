import axios from "axios"
import useAuthStore from "../store/authStore"

const getToken = () => {
  try {
    const authStorage = JSON.parse(localStorage.getItem("auth-storage"))
    return authStorage?.state?.token ?? null
  } catch {
    return null
  }
}

const getSellerToken = () => {
  try {
    const authStorage = JSON.parse(localStorage.getItem("auth-storage"))
    return authStorage?.state?.sellerToken ?? null
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
})

api.interceptors.request.use(
  (config) => {
    const sellerToken = getSellerToken()
    const token = getToken()

    if (config.url?.includes("/products") && sellerToken) {
      config.headers.Authorization = `Bearer ${sellerToken}`
    } else if (token) {
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
      const token = getToken()
      if (token) {
        useAuthStore.getState().logout()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
