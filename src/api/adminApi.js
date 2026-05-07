import api from "./index"

// ─── 구매자 회원 ─────────────────────────────────────────────────
export const getMembers = () =>
  api.get("/api/admin/members").then((res) => res.data.data)

export const toggleMemberStatus = (memberId) =>
  api.patch(`/api/admin/members/${memberId}/status`).then((res) => res.data)

// ─── 판매자 ──────────────────────────────────────────────────────
export const getSellers = () =>
  api.get("/api/admin/sellers").then((res) => res.data.data)

export const getPendingSellers = () =>
  api.get("/api/admin/sellers/pending").then((res) => res.data.data)

export const toggleSellerStatus = (sellerId) =>
  api.patch(`/api/admin/sellers/${sellerId}/status`).then((res) => res.data)
