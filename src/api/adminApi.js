// api/adminApi.js
// 관리자 API 함수 (추후 axiosInstance 연동 예정)
// 현재: 구조만 정의 (백엔드 연동 전)
// 실제 연동 시 주석 해제 후 axiosInstance import 추가

// import axiosInstance from "./axiosInstance"

// ─── 통계 ────────────────────────────────────────────────────────
export const getAdminStats = () =>
  // axiosInstance.get("/api/v1/admin/stats")
  Promise.resolve({})

// ─── 회원 ────────────────────────────────────────────────────────
export const getMembers = (params) =>
  // axiosInstance.get("/api/v1/admin/members", { params })
  Promise.resolve([])

export const updateMemberStatus = (memberId, status) =>
  // axiosInstance.patch(`/api/v1/admin/members/${memberId}/status`, { status })
  Promise.resolve({ memberId, status })

// ─── 상품 ────────────────────────────────────────────────────────
export const getAdminProducts = (params) =>
  // axiosInstance.get("/api/v1/admin/products", { params })
  Promise.resolve([])

export const createProduct = (data) =>
  // axiosInstance.post("/api/v1/admin/products", data)
  Promise.resolve(data)

export const updateProduct = (productId, data) =>
  // axiosInstance.put(`/api/v1/admin/products/${productId}`, data)
  Promise.resolve({ id: productId, ...data })

export const deleteProduct = (productId) =>
  // axiosInstance.delete(`/api/v1/admin/products/${productId}`)
  Promise.resolve({ productId })

// ─── 주문 ────────────────────────────────────────────────────────
export const getAdminOrders = (params) =>
  // axiosInstance.get("/api/v1/admin/orders", { params })
  Promise.resolve([])

export const updateOrderStatus = (orderId, status) =>
  // axiosInstance.patch(`/api/v1/admin/orders/${orderId}/status`, { status })
  Promise.resolve({ orderId, status })
