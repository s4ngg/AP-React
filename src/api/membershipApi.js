import api from "./index"

// 등급 변경 이력 조회 (PathVariable)
export const getMembershipHistory = (memberId) =>
  api.get(`/membership/history/${memberId}`).then((res) => res.data.data)