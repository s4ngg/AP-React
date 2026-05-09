import api from "./index";

/**
 * 판매자 신청 (일반회원 → 판매자 전환 요청)
 * POST /api/sellers/apply
 * Body: { businessName, businessNumber(10자리 숫자), representativeName, bankName, bankAccount }
 */
export const applyForSeller = (data) =>
  api.post("/api/sellers/apply", data);

/**
 * 판매자 신청 상태 조회
 * GET /api/sellers/apply/status
 */
export const getSellerApplyStatus = () =>
  api.get("/api/sellers/apply/status").then((res) => res.data.data);

/**
 * 판매자 로그인
 * POST /api/seller/auth/login
 * Body: { email, password }
 */
export const sellerLogin = (data) =>
  api.post("/api/seller/auth/login", data).then((res) => res.data);

/**
 * 판매자 정보 수정
 * PATCH /api/seller/auth/{sellerId}
 */
export const updateSeller = (sellerId, data) =>
  api.patch(`/api/seller/auth/${sellerId}`, data).then((res) => res.data);

/**
 * 판매자 탈퇴
 * DELETE /api/seller/auth/{sellerId}
 */
export const deleteSeller = (sellerId) =>
  api.delete(`/api/seller/auth/${sellerId}`).then((res) => res.data);

export const getSellerClaims = () =>
  api.get("/api/claims/seller").then((res) => res.data.data)

export const getSellerOrders = () =>
  api.get("/api/seller/orders").then((res) => res.data.data)

export const updateSellerOrderStatus = (orderId, status) =>
  api.patch(`/api/seller/orders/${orderId}/status`, { status }).then((res) => res.data.data)

export const approveClaim = (claimId) =>
  api.patch(`/api/claims/${claimId}/approve`).then((res) => res.data)

export const rejectClaim = (claimId, rejectReason) =>
  api.patch(`/api/claims/${claimId}/seller-reject`, { rejectReason }).then((res) => res.data)

// 수정: /api/inquiries/my → /api/inquiries/seller (판매자용 엔드포인트)
export const getSellerInquiries = () =>
  api.get("/api/inquiries/seller").then((res) => res.data.data)

/**
 * 판매자 본인 상품 목록 조회
 * GET /api/products/seller
 */
export const getSellerProducts = () =>
  api.get("/api/products/seller").then((res) => res.data.data)

/**
 * 어드민 - 판매자 승인
 * PATCH /api/admin/sellers/{sellerId}/approve
 */
export const approveSeller = (sellerId) =>
  api.patch(`/api/admin/sellers/${sellerId}/approve`).then((res) => res.data)

/**
 * 어드민 - 판매자 거절
 * PATCH /api/admin/sellers/{sellerId}/reject
 */
export const rejectSeller = (sellerId, rejectReason) =>
  api.patch(`/api/admin/sellers/${sellerId}/reject`, { rejectReason }).then((res) => res.data)

export const getClaimDetail = (claimId) =>
  api.get(`/api/claims/${claimId}`).then((res) => res.data.data)

export const getClaimAttachments = (claimId) =>
  api.get(`/api/attachments/claim/${claimId}`).then((res) => res.data.data)