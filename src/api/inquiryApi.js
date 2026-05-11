import api from "./index";

export const createInquiry = (data, images = []) => {
  const formData = new FormData()
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }))
  images.forEach((img) => formData.append("images", img.file))
  return api.post("/api/inquiries", formData, {
    headers: { "Content-Type": undefined },
  })
};
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
