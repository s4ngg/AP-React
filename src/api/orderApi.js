import api from "./index"

// 주문 생성 (JWT)
export const createOrder = (data) =>
  api.post(`/orders`, data).then((res) => res.data.data)

// 주문 조회
export const getOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then((res) => res.data.data)

// 내 주문 목록 조회
export const getMyOrders = () =>
  api.get("/members/me/orders").then((res) => res.data.data)
// 배송지 목록 조회 (JWT)
export const getDeliveryAddresses = () =>
  api.get(`/orders/addresses`).then((res) => res.data.data)

// 배송지 추가 (JWT)
export const addDeliveryAddress = (data) =>
  api.post(`/orders/addresses`, data).then((res) => res.data.data)

// 배송지 수정 (JWT)
export const updateDeliveryAddress = (addressId, data) =>
  api.patch(`/orders/addresses/${addressId}`, data).then((res) => res.data.data)

// 배송지 삭제 (JWT)
export const deleteDeliveryAddress = (addressId) =>
  api.delete(`/orders/addresses/${addressId}`).then((res) => res.data)
