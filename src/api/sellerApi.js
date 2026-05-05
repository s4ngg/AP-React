import api from "./index";

/**
 * 판매자 신청 (구매자 → 판매자 전환 요청)
 * POST /api/sellers/apply
 */
export const applyForSeller = (data) =>
  api.post("/api/sellers/apply", data);
