import api from "./index"

// 회원 미사용 쿠폰 목록
export const getUnusedCoupons = (memberId) =>
  api.get(`/coupons/members/${memberId}/unused`).then((res) => res.data.data)

// 쿠폰 코드 조회
export const getCouponByCode = (couponCode) =>
  api.get(`/coupons/search`, { params: { couponCode } }).then((res) => res.data.data)