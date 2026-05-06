import api from "./index";

export const createClaim = (data) => api.post("/claims", data);
export const getMyClaims = () => api.get("/claims/my");
export const cancelClaim = (claimId) => api.patch(`/claims/${claimId}/cancel`);
