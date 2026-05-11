import api from "./index";

export const createInquiry = (data) => api.post("/api/inquiries", data);
export const getMyInquiries = () => api.get("/api/inquiries/my");
export const cancelInquiry = (inquiryId) => api.patch(`/api/inquiries/${inquiryId}/cancel`);

// 특정 문의 상세 조회 (현재 미사용 - 문의 상세 페이지 구현 시 사용)
export const getInquiryById = (inquiryId) => api.get(`/api/inquiries/${inquiryId}`);

export const replyToInquiry = (id, data) =>
    api.post(`/api/inquiries/${id}/answers/admin`, data)
        .then((res) => res.data.data)