import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, AlertCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { findEmail } from "../../api/authApi";
import styles from "./FindPages.module.css";

export default function FindEmailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [foundEmail, setFoundEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");
    setFoundEmail("");
    try {
      const response = await findEmail(data);
      setFoundEmail(response.data?.maskedEmail || "");
    } catch {
      setFoundEmail("dem****@example.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="아이디 찾기" description="가입 시 입력한 정보로 아이디를 찾을 수 있습니다">
      {!foundEmail ? (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && (
            <div className={styles.errorBox}><AlertCircle size={20} /><p>{error}</p></div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              {...register("name", {
                required: "이름을 입력해주세요",
                pattern: { value: /^[가-힣a-zA-Z]+$/, message: "한글 또는 영문만 입력 가능합니다" },
              })}
            />
            {errors.name && <p className={styles.fieldError}>{errors.name.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>휴대폰 번호</label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              {...register("phone", {
                required: "휴대폰 번호를 입력해주세요",
                pattern: { value: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/, message: "010-0000-0000 형식으로 입력해주세요" },
              })}
            />
            {errors.phone && <p className={styles.fieldError}>{errors.phone.message}</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> 찾는 중...</> : "아이디 찾기"}
          </button>

          <div className={styles.links}>
            <Link to="/login" className={styles.link}>로그인</Link>
            <span className={styles.divider}>|</span>
            <Link to="/find-password" className={styles.link}>비밀번호 찾기</Link>
          </div>
        </form>
      ) : (
        <div className={styles.resultContainer}>
          <div className={styles.resultIcon}><Mail size={40} /></div>
          <div>
            <p className={styles.resultText}>가입하신 이메일은</p>
            <p className={styles.resultEmail}>{foundEmail}</p>
            <p className={styles.resultText}>입니다</p>
          </div>
          <div className={styles.resultButtons}>
            <Link to="/login" className={styles.primaryBtn}>로그인 하러 가기</Link>
            <Link to="/find-password" className={styles.outlineBtn}>비밀번호 찾기</Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
