import api from "./index";

export const createClaim = (data) =>
  api.post("/api/claims", data).then((res) => res.data.data);

export const getMyClaims = () =>
  api.get("/api/claims/my").then((res) => res.data.data);

export const cancelClaim = (claimId) =>
  api.patch(`/api/claims/${claimId}/cancel`).then((res) => res.data.data);

export const getAdminClaims = () =>
  api.get("/api/claims/admin").then((res) => res.data.data);

export const updateClaimStatus = (claimId, status) =>
  api.patch(`/api/claims/${claimId}/status`, { status }).then((res) => res.data.data);

export const rejectAdminClaim = (claimId, rejectReason) =>
  api.patch(`/api/claims/${claimId}/reject`, { rejectReason }).then((res) => res.data.data);
