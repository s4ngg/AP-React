import api from "./index";

export const createProduct = async (productSaveRequestDto) => {
  const response = await api.post("/api/products", productSaveRequestDto);
  return response.data;
};

export const getProductList = async (page = 0) => {
  const response = await api.get("/api/products", {
    params: { page, size: 8, sort: "createdAt,desc" },
  });
  return response.data;
};

export const getProductDetail = async (productId, page = 0) => {
  const response = await api.get(`/api/products/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

export const updateProduct = async (productId, productUpdateRequestDto) => {
  const response = await api.patch(`/api/products/${productId}`, productUpdateRequestDto);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};

export const getParentCategories = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

export const getParentCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/${slug}`);
  return response.data;
};

export const getChildCategories = async (parentCategoryId) => {
  const response = await api.get(`/api/categories/${parentCategoryId}/child-categories`);
  return response.data;
};

export const getChildCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/child-categories/${slug}`);
  return response.data;
};
