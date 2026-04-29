import api from "./index";

/**
 * 회원 보유 쿠폰 전체 목록 조회
 * GET /api/coupons/members/{memberId}
 */
export const getMemberCoupons = (memberId) =>
  api.get(`/api/coupons/members/${memberId}`);

/**
 * 회원 미사용 쿠폰 목록 조회
 * GET /api/coupons/members/{memberId}/unused
 */
export const getMemberUnusedCoupons = (memberId) =>
  api.get(`/api/coupons/members/${memberId}/unused`);
