import api from "./index";

// 상품 생성 API
// POST /api/products  (JWT 필요 - 판매자)
export const createProduct = async (productSaveRequestDto) => {
  const response = await api.post("/api/products", productSaveRequestDto);
  return response.data;
};

// 상품 목록 조회 API (메인페이지)
// GET /api/products?page=0&size=8&sort=createdAt,desc
export const getProductList = async (page = 0) => {
  const response = await api.get("/api/products", {
    params: { page, size: 8, sort: "createdAt,desc" },
  });
  return response.data;
};

// 상품 상세 조회 API (리뷰 페이지네이션 포함)
// GET /api/products/{productId}?page=0&size=5&sort=createdAt,desc
export const getProductDetail = async (productId, page = 0) => {
  const response = await api.get(`/api/products/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

// 상품 수정 API
// PATCH /api/products/{productId}  (JWT 필요 - 판매자)
export const updateProduct = async (productId, productUpdateRequestDto) => {
  const response = await api.patch(`/api/products/${productId}`, productUpdateRequestDto);
  return response.data;
};

// 상품 삭제 API
// DELETE /api/products/{productId}  (JWT 필요 - 판매자)
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};

// 부모 카테고리 목록 조회
// GET /api/categories
export const getParentCategories = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

// 자식 카테고리 목록 조회
// GET /api/categories/{parentCategoryId}/child-categories
export const getChildCategories = async (parentCategoryId) => {
  const response = await api.get(`/api/categories/${parentCategoryId}/child-categories`);
  return response.data;
};
