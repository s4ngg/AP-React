import api from "./index";

export const createInquiry = (data) => api.post("/api/inquiries", data);
export const getMyInquiries = () => api.get("/api/inquiries/my");
export const cancelInquiry = (inquiryId) => api.patch(`/api/inquiries/${inquiryId}/cancel`);
export const getInquiryById = (inquiryId) => api.get(`/api/inquiries/${inquiryId}`);

// ─── 관리자 ───────────────────────────────────────────────────────────────────
export const getAdminInquiries = () =>
  api.get("/api/inquiries/admin").then((res) => res.data.data);
export const postAdminAnswer = (inquiryId, content) =>
  api.post(`/api/inquiries/${inquiryId}/answers/admin`, { content }).then((res) => res.data.data);
export const updateInquiryStatus = (inquiryId, status) =>
  api.patch(`/api/inquiries/${inquiryId}/status`, null, { params: { status } });
