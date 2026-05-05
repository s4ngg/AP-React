import api from "./index";

// 상품 리뷰 목록 조회
// GET /api/reviews/{productId}?page=0&size=5&sort=createdAt,desc
export const getProductReviews = async (productId, page = 0) => {
  const response = await api.get(`/api/reviews/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

// 리뷰 작성
// POST /api/reviews  (JWT 필요)
// Spring ReviewRequestDto: { orderItemId, rating, content, selectedOption }
// ※ productId 아님! 주문 상품 ID(orderItemId) 필요
export const createReview = async (reviewRequestDto) => {
  const response = await api.post("/api/reviews", reviewRequestDto);
  return response.data;
};

// 리뷰 수정
// PATCH /api/reviews/{reviewId}  (JWT 필요)
// Spring ReviewUpdateRequestDto: { content, rating }
export const updateReview = async (reviewId, reviewUpdateRequestDto) => {
  const response = await api.patch(`/api/reviews/${reviewId}`, reviewUpdateRequestDto);
  return response.data;
};
