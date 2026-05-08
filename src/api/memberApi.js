import api from "./index"

// 내 정보 조회 (JWT)
export const getMember = () =>
  api.get(`/api/members/me`).then((res) => res.data.data)

// 내 정보 수정 (JWT) - { phone, address }
export const updateMember = (data) =>
  api.patch(`/api/members/me`, data).then((res) => res.data.data)

// 비밀번호 변경 (JWT) - { currentPassword, newPassword }
export const changePassword = (data) =>
  api.patch(`/api/members/me/password`, data).then((res) => res.data)

// 회원 탈퇴 (JWT)
export const deleteMember = () =>
  api.delete(`/api/members/me`).then((res) => res.data)

// 내 주문 목록 조회 (JWT)
export const getMyOrders = () =>
  api.get(`/api/members/me/orders`).then((res) => res.data.data)