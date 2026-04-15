import api from "./index"

export const login             = (data)           => api.post("/auth/login", data)
export const signup            = (data)           => api.post("/auth/signup", data)
export const checkEmailDuplicate = (email)        => api.get("/auth/check-email", { params: { email } })
export const sendVerificationCode = (email)       => api.post("/auth/email/send", null, { params: { email } })
export const verifyEmailCode   = (email, code)    => api.post("/auth/email/verify", null, { params: { email, code } })
export const findEmail         = (data)           => api.get("/auth/find-email", { params: data })
export const sendPasswordResetCode = (email)      => api.post("/auth/password/send", null, { params: { email } })
export const verifyPasswordResetCode = (email, code) => api.post("/auth/password/verify", null, { params: { email, code } })
export const resetPassword     = (data)           => api.post("/auth/reset-password", data)
