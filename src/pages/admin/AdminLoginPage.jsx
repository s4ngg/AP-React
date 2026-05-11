import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "../../components/common/AuthLayout"
import { adminLogin } from "../../api/adminApi"
import useAuthStore from "../../store/authStore"
import styles from "../member/LoginPage.module.css"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { setAdminToken, setAdminRole, setAdminName } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await adminLogin({
        email: data.email,
        password: data.password,
      })

      setAdminToken(response.token)
      setAdminRole(response.role)
      setAdminName(response.adminName)
      navigate(response.role === "CS_ADMIN" ? "/admin/refunds" : "/admin/members")
    } catch {
      setError("관리자 이메일 또는 비밀번호가 올바르지 않습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="관리자 로그인" description="관리자 계정으로 로그인해주세요">
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={20} />
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              placeholder="admin@allpick.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
            />
            {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
                className={`${styles.input} ${styles.inputWithButton} ${
                  errors.password ? styles.inputError : ""
                }`}
                {...register("password", { required: "비밀번호를 입력해주세요" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                로그인 중...
              </>
            ) : (
              "관리자 로그인"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
