import api from "./index"

// 회원 보유 쿠폰 전체 목록 (PathVariable)
export const getMemberCoupons = (memberId) =>
  api.get(`/api/coupons/members/${memberId}`).then((res) => res.data.data)

// 회원 미사용 쿠폰 목록 (PathVariable)
export const getUnusedCoupons = (memberId) =>
  api.get(`/api/coupons/members/${memberId}/unused`).then((res) => res.data.data)

// 쿠폰 코드 조회
export const getCouponByCode = (couponCode) =>
  api.get(`/api/coupons/search`, { params: { couponCode } }).then((res) => res.data.data)