import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { OtpInput } from "../../components/ui/OtpInput";
import { useTimer } from "../../hooks/useTimer";
import { sendPasswordResetCode, verifyPasswordResetCode } from "../../api/authApi";
import styles from "./FindPages.module.css";

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);

  const timer = useTimer(300);
  const resendTimer = useTimer(60);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!resendTimer.isRunning && resendTimer.timeLeft === 0 && codeSent) {
      setCanResend(true);
    }
  }, [resendTimer.isRunning, resendTimer.timeLeft, codeSent]);

  const onSubmit = async (data) => {
    setIsSending(true);
    setError("");
    try {
      await sendPasswordResetCode(data.email);
    } catch {
      // 데모용: 무시
    } finally {
      setEmail(data.email);
      setCodeSent(true);
      timer.start(300);
      resendTimer.start(60);
      setCanResend(false);
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsSending(true);
    try {
      await sendPasswordResetCode(email);
    } catch {
      // 데모용: 무시
    } finally {
      timer.start(300);
      resendTimer.start(60);
      setCanResend(false);
      setCode("");
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) { setError("인증번호 6자리를 입력해주세요"); return; }
    setIsVerifying(true);
    setError("");
    try {
      await verifyPasswordResetCode(email, code);
    } catch {
      // 데모용: 무시
    } finally {
      sessionStorage.setItem("resetPasswordEmail", email);
      sessionStorage.setItem("resetPasswordCode", code);
      navigate("/reset-password");
      setIsVerifying(false);
    }
  };

  const isExpired = timer.timeLeft === 0 && codeSent;

  return (
    <AuthLayout title="비밀번호 찾기" description="가입한 이메일로 인증번호를 발송합니다">
      {!codeSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" },
              })}
            />
            {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSending}>
            {isSending ? <><span className={styles.spinner} /> 발송 중...</> : "인증번호 발송"}
          </button>

          <div className={styles.links}>
            <Link to="/login" className={styles.link}>로그인</Link>
            <span className={styles.divider}>|</span>
            <Link to="/find-email" className={styles.link}>아이디 찾기</Link>
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 이메일 카드 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid var(--color-border)", borderRadius: 8, backgroundColor: "#f9fafb", padding: 16 }}>
            <div style={{ display: "flex", width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "#eef2ff", color: "var(--color-primary)", flexShrink: 0 }}>
              <Mail size={20} />
            </div>
            <div>
              <p style={{ fontSize: 13, color: "var(--color-muted)" }}>인증 이메일</p>
              <p style={{ fontWeight: 600 }}>{email}</p>
            </div>
          </div>

          {/* 타이머 */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: isExpired ? "#dc2626" : "var(--color-primary)" }}>{timer.formattedTime}</p>
            <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>{isExpired ? "인증 시간이 만료되었습니다" : "남은 인증 시간"}</p>
          </div>

          <OtpInput value={code} onChange={setCode} maxLength={6} disabled={isExpired} />

          {error && <div className={styles.errorBox}><AlertCircle size={16} /><span style={{ fontSize: 14 }}>{error}</span></div>}

          {/* 재발송 */}
          <div style={{ textAlign: "center" }}>
            <button type="button" onClick={handleResend} disabled={!canResend || isSending}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, background: "none", border: "none", cursor: canResend ? "pointer" : "not-allowed", color: canResend ? "var(--color-primary)" : "var(--color-muted)", textDecoration: canResend ? "underline" : "none" }}>
              <RefreshCw size={14} />
              {canResend ? "인증번호 재발송" : `재발송 가능까지 ${resendTimer.formattedTime}`}
            </button>
          </div>

          <button onClick={handleVerify} className={styles.submitBtn} disabled={isVerifying || isExpired || code.length !== 6}>
            {isVerifying ? <><span className={styles.spinner} /> 확인 중...</> : "확인"}
          </button>

          <div style={{ textAlign: "center" }}>
            <button type="button" onClick={() => setCodeSent(false)}
              style={{ fontSize: 14, color: "var(--color-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              이메일 다시 입력하기
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
