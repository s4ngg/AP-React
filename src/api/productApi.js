import api from "./index"

/**
 * 상품 목록 조회 (전체)
 * GET /api/products
 */
export const getProducts = (page = 0, size = 20) =>
    api.get("/products", { params: { page, size, sort: "createdAt,desc" } })
        .then((res) => res.data.data)

/**
 * 상품 등록
 * POST /api/products
 */
export const createProduct = (data) =>
    api.post("/products", data).then((res) => res.data.data)

/**
 * 상품 수정
 * PATCH /api/products/{productId}
 */
export const updateProduct = (productId, data) =>
    api.patch(`/products/${productId}`, data).then((res) => res.data.data)

/**
 * 상품 삭제
 * DELETE /api/products/{productId}
 */
export const deleteProduct = (productId) =>
    api.delete(`/products/${productId}`).then((res) => res.data)

/**
 * 판매자 본인 상품 목록 조회
 * GET /api/products/seller
 */
export const getSellerProducts = () =>
    api.get("/products/seller").then((res) => res.data.data)