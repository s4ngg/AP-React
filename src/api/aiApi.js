import axios from "axios"

const fastapi = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL || "http://localhost:8000",
  timeout: 10000,
})

export const getAiRecommendations = (categories, wishlist = []) =>
  fastapi.post("/api/recommend", { categories, wishlist }).then((res) => res.data.data)