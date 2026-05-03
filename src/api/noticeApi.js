import api from "./index";

export const getNotices = () => api.get("/notices");
export const getNoticeById = (noticeId) => api.get(`/notices/${noticeId}`);
