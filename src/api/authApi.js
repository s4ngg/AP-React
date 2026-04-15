import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // HttpOnly 쿠키 전송
});

const authApi = {
  signup:               (data)           => api.post('/auth/signup', data),
  checkEmail:           (email)          => api.get('/auth/check-email', { params: { email } }),
  sendVerificationCode: (email)          => api.post('/auth/email/send', null, { params: { email } }),
  verifyCode:           (email, code)    => api.post('/auth/email/verify', null, { params: { email, code } }),
  login:                (data)           => api.post('/auth/login', data),
  logout:               ()               => api.post('/auth/logout'),
  reissue:              ()               => api.post('/auth/reissue'),
  findEmail:            (name, phone)    => api.get('/auth/find-email', { params: { name, phone } }),
  resetPassword:        (email, pw)      => api.post('/auth/reset-password', null, { params: { email, newPassword: pw } }),
};

export default authApi;
