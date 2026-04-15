import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await api.post("/auth/reissue")
      return api(err.config)
    }
    return Promise.reject(err)
  }
)

export default api
