import api from "./index"

// 배송지 목록 조회
export const getDeliveryAddresses = (memberId) =>
  api.get(`/orders/${memberId}/addresses`).then((res) => res.data.data)

// 배송지 추가
export const addDeliveryAddress = (memberId, data) =>
  api.post(`/orders/${memberId}/addresses`, data).then((res) => res.data.data)

// 주문 생성
export const createOrder = (memberId, data) =>
  api.post(`/orders/${memberId}`, data).then((res) => res.data.data)

// 주문 조회
export const getOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then((res) => res.data.data)

// 내 주문 목록 조회
export const getMyOrders = () =>
  api.get("/members/me/orders").then((res) => res.data.data)