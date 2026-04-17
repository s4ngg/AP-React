import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Check, X, CheckCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { resetPassword } from "../../api/authApi";
import styles from "./FindPages.module.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");
    const storedCode = sessionStorage.getItem("resetPasswordCode");
    if (!storedEmail || !storedCode) { navigate("/find-password", { replace: true }); return; }
    setEmail(storedEmail);
    setCode(storedCode);
  }, [navigate]);

  const passwordValidation = {
    hasLength: newPassword?.length >= 8,
    hasLetter: /[a-zA-Z]/.test(newPassword || ""),
    hasNumber: /[0-9]/.test(newPassword || ""),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || ""),
  };
  const isPasswordValid = passwordValidation.hasLength && passwordValidation.hasLetter && passwordValidation.hasNumber && passwordValidation.hasSpecial;
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const onSubmit = async (data) => {
    if (!isPasswordValid || !passwordsMatch) return;
    setIsSubmitting(true);
    try {
      await resetPassword({ email, code, newPassword: data.newPassword });
    } catch {
      // 데모용: 무시
    } finally {
      sessionStorage.removeItem("resetPasswordEmail");
      sessionStorage.removeItem("resetPasswordCode");
      setIsComplete(true);
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <AuthLayout title="비밀번호 변경 완료">
        <div className={styles.completeContainer}>
          <div className={styles.completeIcon}><CheckCircle size={40} color="#16a34a" /></div>
          <div>
            <p className={styles.completeTitle}>비밀번호가 성공적으로 변경되었습니다</p>
            <p className={styles.completeDesc}>새로운 비밀번호로 로그인해주세요</p>
          </div>
          <Link to="/login" className={styles.primaryBtn}>로그인 하러 가기</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="비밀번호 재설정" description="새로운 비밀번호를 입력해주세요">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* 새 비밀번호 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>새 비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="새 비밀번호를 입력해주세요"
              className={`${styles.input} ${styles.inputWithButton} ${errors.newPassword ? styles.inputError : ""}`}
              {...register("newPassword", { required: "새 비밀번호를 입력해주세요" })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {newPassword && (
            <div className={styles.passwordValidation}>
              {[
                { key: "hasLength", label: "8자 이상" },
                { key: "hasLetter", label: "영문 포함" },
                { key: "hasNumber", label: "숫자 포함" },
                { key: "hasSpecial", label: "특수문자 포함" },
              ].map(({ key, label }) => (
                <span key={key} className={`${styles.validItem} ${passwordValidation[key] ? styles.validItemOk : styles.validItemFail}`}>
                  {passwordValidation[key] ? <Check size={12} /> : <X size={12} />} {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>새 비밀번호 확인</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="새 비밀번호를 다시 입력해주세요"
              className={`${styles.input} ${styles.inputWithButton} ${errors.confirmPassword ? styles.inputError : ""}`}
              {...register("confirmPassword", { required: "비밀번호 확인을 입력해주세요" })}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeButton}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && (
            <p className={`${styles.passwordMatch} ${passwordsMatch ? styles.matchOk : styles.matchFail}`}>
              {passwordsMatch ? <><Check size={14} /> 비밀번호가 일치합니다</> : <><X size={14} /> 비밀번호가 일치하지 않습니다</>}
            </p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={!isPasswordValid || !passwordsMatch || isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> 변경 중...</> : "비밀번호 변경"}
        </button>

        <div style={{ textAlign: "center" }}>
          <Link to="/login" style={{ fontSize: 14, color: "var(--color-muted)", textDecoration: "underline" }}>
            취소하고 로그인으로 돌아가기
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
