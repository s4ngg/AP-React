import axios from 'axios';

// axios 공통 인스턴스
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // HttpOnly 쿠키 전송
});

// 요청 인터셉터 - 필요 시 토큰 처리
api.interceptors.request.use(config => config);

// 응답 인터셉터 - 401 시 토큰 재발급
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await api.post('/auth/reissue');
      return api(err.config);
    }
    return Promise.reject(err);
  }
);

export default api;
