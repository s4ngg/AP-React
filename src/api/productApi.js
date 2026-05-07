import api from "./index"

// ─── 상품 ───────────────────────────────────────────

export const getProducts = (page = 0, size = 20) =>
  api
    .get("/products", { params: { page, size, sort: "createdAt,desc" } })
    .then((res) => res.data.data)

export const getProductList = async (page = 0) => {
  const response = await api.get("/products", {
    params: { page, size: 8, sort: "createdAt,desc" },
  })
  return response.data
}

export const getProductDetail = async (productId, page = 0) => {
  const response = await api.get(`/products/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  })
  return response.data
}

export const createProduct = (data) =>
  api.post("/products", data).then((res) => res.data.data)

export const updateProduct = (productId, data) =>
  api.patch(`/products/${productId}`, data).then((res) => res.data.data)

export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`).then((res) => res.data)

export const getSellerProducts = () =>
  api.get("/products/seller").then((res) => res.data.data)

// ─── 카테고리 ─────────────────────────────────────────

export const getParentCategories = async () => {
  const response = await api.get("/categories")
  return response.data
}

export const getParentCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`)
  return response.data
}

export const getChildCategories = async (parentCategoryId) => {
  const response = await api.get(`/categories/${parentCategoryId}/child-categories`)
  return response.data
}

export const getChildCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/child-categories/${slug}`)
  return response.data
}