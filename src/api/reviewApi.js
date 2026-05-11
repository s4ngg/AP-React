import api from "./index";

// 상품 리뷰 목록 조회
export const getProductReviews = async (productId, page = 0) => {
  const response = await api.get(`/api/reviews/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

// 리뷰 작성 (JWT 필요) - 응답: { success, message, data: ReviewResponseDto }
export const createReview = async (reviewRequestDto) => {
  const response = await api.post("/api/reviews", reviewRequestDto);
  return response.data;
};

// 리뷰 수정 (JWT 필요 - 서버에서 memberId 검증) - 응답: { success, message, data: ReviewResponseDto }
export const updateReview = async (reviewId, reviewUpdateRequestDto) => {
  const response = await api.patch(`/api/reviews/${reviewId}`, reviewUpdateRequestDto);
  return response.data;
};
