import api from "./index";

// ==================== 상품 API ====================

// POST /api/products  (JWT 필요 - 판매자)
export const createProduct = async (productSaveRequestDto) => {
  const response = await api.post("/api/products", productSaveRequestDto);
  return response.data;
};

// GET /api/products?page=0&size=8&sort=createdAt,desc
// 응답: Page<ProductListResponseDto>
// ProductListResponseDto: { productId, parentCategoryName, brand, productName, thumbnailUrl, price }
export const getProductList = async (page = 0) => {
  const response = await api.get("/api/products", {
    params: { page, size: 8, sort: "createdAt,desc" },
  });
  return response.data;
};

// GET /api/products/{productId}?page=0&size=5&sort=createdAt,desc
// 응답: ProductDetailResponseDto
// { productId, parentCategoryName, brand, productName, thumbnailUrl, price,
//   description, manufacturer, origin, precaution,
//   optionList: [{optionId, optionName, optionValue, additionalPrice, stockQuantity}],
//   productImagesList: [{productImageId, imageUrl, sortOrder}],
//   reviewList: Page<ReviewResponseDto> }
export const getProductDetail = async (productId, page = 0) => {
  const response = await api.get(`/api/products/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

// PATCH /api/products/{productId}  (JWT 필요 - 판매자)
export const updateProduct = async (productId, productUpdateRequestDto) => {
  const response = await api.patch(`/api/products/${productId}`, productUpdateRequestDto);
  return response.data;
};

// DELETE /api/products/{productId}  (JWT 필요 - 판매자)
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};

// ==================== 카테고리 API ====================

// GET /api/categories
// 응답: List<ParentCategoryResponseDto>
// { parentCategoryId, categoryName, sortOrder, isActive, slug }
export const getParentCategories = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

// GET /api/categories/{slug}
export const getParentCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/${slug}`);
  return response.data;
};

// GET /api/categories/{parentCategoryId}/child-categories
// 응답: List<ChildCategoryResponseDto>
// { childCategoryId, parentCategoryId, categoryName, sortOrder, isActive, slug }
export const getChildCategories = async (parentCategoryId) => {
  const response = await api.get(`/api/categories/${parentCategoryId}/child-categories`);
  return response.data;
};

// GET /api/categories/child-categories/{slug}
export const getChildCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/child-categories/${slug}`);
  return response.data;
};
