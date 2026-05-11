import axios from "axios"

const fastapi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

export const getAiRecommendations = (categories, wishlist = []) =>
  fastapi.post("/fastapi/api/recommend", { categories, wishlist }).then((res) => res.data.data)