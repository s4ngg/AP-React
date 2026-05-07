import api from "./index";

export const getProductReviews = async (productId, page = 0) => {
  const response = await api.get(`/api/reviews/${productId}`, {
    params: { page, size: 5, sort: "createdAt,desc" },
  });
  return response.data;
};

export const createReview = async (reviewRequestDto) => {
  const response = await api.post("/api/reviews", reviewRequestDto);
  return response.data;
};

export const updateReview = async (reviewId, reviewUpdateRequestDto) => {
  const response = await api.patch(`/api/reviews/${reviewId}`, reviewUpdateRequestDto);
  return response.data;
};
