import api from "./index";

export const addCartItem = async (cartItemRequestDto) => {
  const response = await api.post("/api/carts", cartItemRequestDto);
  return response.data;
};

export const getCartItems = async (memberId) => {
  const response = await api.get(`/api/carts/${memberId}`);
  return response.data;
};

export const deleteCartItem = async (cartItemId) => {
  const response = await api.delete(`/api/carts/${cartItemId}`);
  return response.data;
};

export const deleteSelectedCartItems = async (cartItemIds) => {
  const response = await api.delete("/api/carts/selected", {
    data: { cartItemIds },
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/api/carts/clear");
  return response.data;
};
