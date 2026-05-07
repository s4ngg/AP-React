import api from "./index"

export const getFaqs = () =>
    api.get("/api/faqs").then((res) => res.data.data)

export const getFaqsByCategory = (category) =>
    api.get(`/api/faqs/category/${category}`).then((res) => res.data.data)

export const createFaq = (data) =>
    api.post("/api/faqs", data).then((res) => res.data.data)

export const deleteFaq = (faqId) =>
    api.delete(`/api/faqs/${faqId}`).then((res) => res.data)