import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { SocialLoginButtons } from "../../components/common/SocialLoginButtons";
import { login } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await login({ email: data.email, password: data.password, autoLogin });

      // ✅ 전역 상태에 유저 정보 저장
      setUser(res.member, res.token);

      navigate("/");
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="로그인" description="SHOP에 오신 것을 환영합니다">
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
              placeholder="example@email.com"
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
                className={`${styles.input} ${styles.inputWithButton} ${errors.password ? styles.inputError : ""}`}
                {...register("password", { required: "비밀번호를 입력해주세요" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <span>자동 로그인</span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>

          <div className={styles.links}>
            <Link to="/find-email" className={styles.link}>아이디 찾기</Link>
            <span className={styles.divider}>|</span>
            <Link to="/find-password" className={styles.link}>비밀번호 찾기</Link>
            <span className={styles.divider}>|</span>
            <Link to="/signup" className={styles.link}>회원가입</Link>
          </div>

          <SocialLoginButtons className={styles.socialButtons} />

        </form>
      </div>
    </AuthLayout>
  );
}