import api from "./index"

// 회원 정보 조회
export const getMember = (memberId) =>
  api.get(`/members/${memberId}`).then((res) => res.data.data)