import api from "./index"

// 등급 변경 이력 조회
export const getMembershipHistory = (memberId) =>
  api.get(`/membership/history/${memberId}`).then((res) => res.data.data)