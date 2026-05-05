import api from "./index";

// 장바구니 상품 추가
// POST /api/carts  (JWT 필요)
// Spring CartItemRequestDto: { productId, productOptionId, quantity }
// ※ productOptionId 필수! 옵션 없으면 요청 자체가 실패함
export const addCartItem = async (cartItemRequestDto) => {
  const response = await api.post("/api/carts", cartItemRequestDto);
  return response.data;
};

// 장바구니 목록 조회
// GET /api/carts/{memberId}  (JWT 필요)
// Spring 응답: CartItemResponseDto { cartItemId, brandName, productName, price, option, quantity }
export const getCartItems = async (memberId) => {
  const response = await api.get(`/api/carts/${memberId}`);
  return response.data;
};

// 장바구니 단일 상품 삭제
// DELETE /api/carts/{cartItemId}
export const deleteCartItem = async (cartItemId) => {
  const response = await api.delete(`/api/carts/${cartItemId}`);
  return response.data;
};

// 장바구니 선택 상품 삭제
// DELETE /api/carts/selected  { cartItemIds: [1, 2, 3] }
export const deleteSelectedCartItems = async (cartItemIds) => {
  const response = await api.delete("/api/carts/selected", {
    data: { cartItemIds },
  });
  return response.data;
};

// 장바구니 전체 비우기
// DELETE /api/carts/clear  (JWT 필요)
export const clearCart = async () => {
  const response = await api.delete("/api/carts/clear");
  return response.data;
};
