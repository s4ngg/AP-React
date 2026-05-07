import api from "./index";

export const addCartItem = async (cartItemRequestDto) => {
  const response = await api.post("/carts", cartItemRequestDto);
  return response.data;
};

export const getCartItems = async (memberId) => {
  const response = await api.get(`/carts/${memberId}`);
  return response.data;
};

export const deleteCartItem = async (cartItemId) => {
  const response = await api.delete(`/carts/${cartItemId}`);
  return response.data;
};

export const deleteSelectedCartItems = async (cartItemIds) => {
  const response = await api.delete("/carts/selected", {
    data: { cartItemIds },
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/carts/clear");
  return response.data;
};
