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

const getAdminToken = () => {
  try {
    const authStorage = JSON.parse(localStorage.getItem("auth-storage"))
    return authStorage?.state?.adminToken ?? null
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

const isAdminClaimRequest = (url = "") =>
  url === "/api/claims/admin" || /^\/api\/claims\/[^/]+\/(status|reject)$/.test(url)

const isAdminInquiryRequest = (url = "") =>
  url === "/api/inquiries/admin" ||
  /^\/api\/inquiries\/[^/]+\/answers\/admin$/.test(url) ||
  /^\/api\/inquiries\/[^/]+\/status$/.test(url)

const isAdminRequest = (url = "") =>
  url.startsWith("/api/admin/") ||
  (url.startsWith("/api/admins") && url !== "/api/admins/login") ||
  isAdminClaimRequest(url) ||
  isAdminInquiryRequest(url) ||
  url.startsWith("/api/notices") ||
  url.startsWith("/api/faqs")

const isSellerProductMutationRequest = (method = "get", url = "") => {
  const normalizedMethod = method.toLowerCase()

  return (
    ["post", "patch", "delete"].includes(normalizedMethod) &&
    /^\/api\/products(?:\/\d+)?$/.test(url)
  )
}

const isSellerRequest = (url = "", method = "get") =>
  url.startsWith("/api/seller/") ||
  url.startsWith("/api/sellers/") ||
  url === "/api/products/seller" ||
  url === "/api/products/images" ||
  isSellerProductMutationRequest(method, url) ||
  url === "/api/claims/seller" ||
  url === "/api/inquiries/seller" ||
  /^\/api\/inquiries\/[^/]+\/answers\/seller$/.test(url)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    const adminToken = getAdminToken()
    const sellerToken = getSellerToken()
    const token = getToken()

    if (isAdminRequest(config.url) && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    } else if (isSellerRequest(config.url, config.method) && sellerToken) {
      config.headers.Authorization = `Bearer ${sellerToken}`
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      return Promise.reject(new Error(response.data.message || "요청에 실패했습니다."))
    }

    return response
  },
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
