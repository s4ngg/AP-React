import api from "./index";

export const getFaqs = () => api.get("/faqs");
export const getFaqsByCategory = (category) => api.get(`/faqs/category/${category}`);
