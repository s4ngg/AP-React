import api from "./index";

/**
 * 회원 등급 변경 이력 조회
 * GET /api/membership/history/{memberId}
 */
export const getMembershipHistory = (memberId) =>
  api.get(`/api/membership/history/${memberId}`);
