import api from "./index"

export const getNotices = () =>
    api.get("/api/notices").then((res) => res.data.data)

export const getNoticeById = (noticeId) =>
    api.get(`/api/notices/${noticeId}`).then((res) => res.data.data)

export const createNotice = (data) =>
    api.post("/api/notices", data).then((res) => res.data.data)

export const updateNotice = (noticeId, data) =>
    api.put(`/api/notices/${noticeId}`, data).then((res) => res.data.data)

export const deleteNotice = (noticeId) =>
    api.delete(`/api/notices/${noticeId}`).then((res) => res.data)