import api from "./index";

export const createClaim = (data) => api.post("/api/claims", data);
export const getMyClaims = () => api.get("/api/claims/my");
export const cancelClaim = (claimId) => api.patch(`/api/claims/${claimId}/cancel`);
