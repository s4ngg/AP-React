import api from "./index";

// ==================== 회원가입 관련 API ====================

export const checkEmailDuplicate = async (email) => {
  const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
  return response.data;
};

export const sendVerificationCode = async (email) => {
  const response = await api.post("/auth/send-verification", { email });
  return response.data;
};

export const verifyEmailCode = async (email, code) => {
  const response = await api.post("/auth/verify-email", { email, code });
  return response.data;
};

export const signup = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// ==================== 로그인 관련 API ====================

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getSocialLoginUrl = (provider) => {
  const baseUrl = import.meta.env.VITE_API_URL || "/api";
  return `${baseUrl}/oauth2/authorization/${provider}`;
};

// ==================== 계정 찾기/복구 API ====================

export const findEmail = async (data) => {
  const response = await api.post("/auth/find-email", data);
  return response.data;
};

export const sendPasswordResetCode = async (email) => {
  const response = await api.post("/auth/send-password-reset", { email });
  return response.data;
};

export const verifyPasswordResetCode = async (email, code) => {
  const response = await api.post("/auth/verify-password-reset", { email, code });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const sendSmsCode = async (phone) => {
  const response = await api.post("/sms/send", { phone });
  return response.data;
};

export const verifySmsCode = async (phone, code) => {
  const response = await api.post("/sms/verify", { phone, code });
  return response.data;
};
export const getTerms = async () => {
  const response = await api.get("/terms");
  return response.data;
};
// ==================== 사업자등록번호 검증 ====================

export const validateBusinessNumber = async (businessNumber) => {
  const cleaned = businessNumber.replaceAll("-", "");

  const response = await fetch(
    `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${import.meta.env.VITE_BUSINESS_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ b_no: [cleaned] })
    }
  );

  const data = await response.json();
  return data.data[0]?.b_stt_cd === "01";
};