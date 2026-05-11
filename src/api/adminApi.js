import api from "./index"

// ─── 관리자 인증 ─────────────────────────────────────────────────
export const adminLogin = (credentials) =>
  api.post("/api/admins/login", credentials).then((res) => res.data.data)

// ─── 구매자 회원 ─────────────────────────────────────────────────
export const getMembers = () =>
  api.get("/api/admin/members").then((res) => res.data.data)

export const toggleMemberStatus = (memberId) =>
  api.patch(`/api/admin/members/${memberId}/status`).then((res) => res.data)

// ─── 판매자 ──────────────────────────────────────────────────────
export const getSellers = () =>
  api.get("/api/admin/sellers").then((res) => res.data.data)

export const getPendingSellers = () =>
  api.get("/api/admin/sellers/pending").then((res) => res.data.data)

export const toggleSellerStatus = (sellerId) =>
  api.patch(`/api/admin/sellers/${sellerId}/status`).then((res) => res.data)

// ─── 관리자 상품 ─────────────────────────────────────────────────
export const getAdminProducts = () =>
  api.get("/api/admin/products").then((res) => res.data.data)

export const approveAdminProduct = (productId) =>
  api.patch(`/api/admin/products/${productId}/approve`).then((res) => res.data)

export const rejectAdminProduct = (productId, rejectReason) =>
  api.patch(`/api/admin/products/${productId}/reject`, { rejectReason }).then((res) => res.data)

// ─── 관리자 주문 ─────────────────────────────────────────────────
export const getAdminOrders = () =>
  api.get("/api/admin/orders").then((res) => res.data.data)

// 관리자 카테고리
export const getAdminParentCategories = () =>
  api.get("/api/admin/categories/parents").then((res) => res.data.data)

export const createAdminParentCategory = (data) =>
  api.post("/api/admin/categories/parents", data).then((res) => res.data.data)

export const updateAdminParentCategory = (parentCategoryId, data) =>
  api.patch(`/api/admin/categories/parents/${parentCategoryId}`, data).then((res) => res.data.data)

export const deleteAdminParentCategory = (parentCategoryId) =>
  api.delete(`/api/admin/categories/parents/${parentCategoryId}`).then((res) => res.data)

export const getAdminChildCategories = (parentCategoryId) =>
  api.get(`/api/admin/categories/parents/${parentCategoryId}/children`).then((res) => res.data.data)

export const createAdminChildCategory = (parentCategoryId, data) =>
  api.post(`/api/admin/categories/parents/${parentCategoryId}/children`, data).then((res) => res.data.data)

export const updateAdminChildCategory = (childCategoryId, data) =>
  api.patch(`/api/admin/categories/children/${childCategoryId}`, data).then((res) => res.data.data)

export const deleteAdminChildCategory = (childCategoryId) =>
  api.delete(`/api/admin/categories/children/${childCategoryId}`).then((res) => res.data)
