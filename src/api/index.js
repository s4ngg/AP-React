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

const getAdminToken = () => {
  try {
    const authStorage = JSON.parse(localStorage.getItem("auth-storage"))
    return authStorage?.state?.adminToken ?? null
  } catch {
    return null
  }
}

const isAdminClaimRequest = (url = "") =>
  url === "/api/claims/admin" || /^\/api\/claims\/[^/]+\/(status|reject)$/.test(url)

const isAdminRequest = (url = "") =>
  url.startsWith("/api/admin/") || url.startsWith("/api/admins") || isAdminClaimRequest(url)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const adminToken = getAdminToken()
    const sellerToken = getSellerToken()
    const token = getToken()

    if (isAdminRequest(config.url) && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    } else if (config.url?.includes("/products") && sellerToken) {
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
      const adminToken = getAdminToken()
      const token = getToken()
      if (adminToken || token) {
        useAuthStore.getState().logout()
        window.location.href = adminToken ? "/admin/login" : "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
