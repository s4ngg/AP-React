import api from "./index"

// ─── 상품 ───────────────────────────────────────────

export const getProducts = (page = 0, size = 20) =>
  api
    .get("/api/products", { params: { page, size, sort: "createdAt,desc" } })
    .then((res) => res.data.data)

export const getProductList = async (page = 0, size = 8, sort = "createdAt,desc") => {
  const response = await api.get("/api/products", {
    params: { page, size, sort },
  })
  return response.data
}

export const getAllProductsForFilter = async () => {
  const response = await api.get("/api/products", {
    params: { page: 0, size: 1000, sort: "createdAt,desc" },
  })
  return response.data
}

export const getProductDetail = async (productId, page = 0) => {
  const response = await api.get(`/api/products/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  })
  return response.data
}

export const createProduct = (data) =>
  api.post("/api/products", data).then((res) => res.data.data)

export const uploadProductImage = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return api
    .post("/api/products/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.data)
}
export const updateProduct = (productId, data) =>
  api.patch(`/api/products/${productId}`, data).then((res) => res.data.data)

export const deleteProduct = (productId) =>
  api.delete(`/api/products/${productId}`).then((res) => res.data)

export const getSellerProducts = () =>
  api.get("/api/products/seller").then((res) => res.data.data)

// ─── 카테고리 ─────────────────────────────────────────

export const getParentCategories = async () => {
  const response = await api.get("/api/categories")
  return response.data
}

export const getParentCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/${slug}`)
  return response.data
}

export const getChildCategories = async (parentCategoryId) => {
  const response = await api.get(`/api/categories/${parentCategoryId}/child-categories`)
  return response.data
}

export const getChildCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/child-categories/${slug}`)
  return response.data
}