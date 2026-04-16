import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { OtpInput } from "../../components/ui/OtpInput";
import { useSignupStore } from "../../store/signup-store";
import { useTimer } from "../../hooks/useTimer";
import { sendVerificationCode, verifyEmailCode } from "../../api/authApi";
import styles from "./VerifyEmailPage.module.css";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { formData, setFormData, setCurrentStep } = useSignupStore();

  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);

  const timer = useTimer(300);
  const resendTimer = useTimer(60);

  useEffect(() => {
    if (!formData.email) navigate("/signup", { replace: true });
  }, [formData.email, navigate]);

  useEffect(() => {
    if (!resendTimer.isRunning && resendTimer.timeLeft === 0 && codeSent) {
      setCanResend(true);
    }
  }, [resendTimer.isRunning, resendTimer.timeLeft, codeSent]);

  const handleSendCode = async () => {
    setIsSending(true);
    setError("");
    try {
      await sendVerificationCode(formData.email);
    } catch {
      // 데모용: 무시
    } finally {
      setCodeSent(true);
      timer.start(300);
      resendTimer.start(60);
      setCanResend(false);
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("인증번호 6자리를 입력해주세요");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      await verifyEmailCode(formData.email, code);
    } catch {
      // 데모용: 무시
    } finally {
      setFormData({ emailVerified: true });
      setCurrentStep(3);
      navigate("/signup/interests");
      setIsVerifying(false);
    }
  };

  const isExpired = timer.timeLeft === 0 && codeSent;

  return (
    <AuthLayout showSteps currentStep={2} title="이메일 인증" description="입력하신 이메일로 인증번호를 발송합니다">
      <div className={styles.container}>
        {/* 이메일 표시 */}
        <div className={styles.emailCard}>
          <div className={styles.emailIcon}><Mail size={20} /></div>
          <div>
            <p className={styles.emailLabel}>인증 이메일</p>
            <p className={styles.emailValue}>{formData.email}</p>
          </div>
        </div>

        {!codeSent ? (
          <button onClick={handleSendCode} className={styles.sendBtn} disabled={isSending}>
            {isSending ? <><span className={styles.spinner} /> 발송 중...</> : "인증번호 발송"}
          </button>
        ) : (
          <>
            {/* 타이머 */}
            <div className={styles.timerSection}>
              <p className={`${styles.timerText} ${isExpired ? styles.timerExpired : styles.timerActive}`}>
                {timer.formattedTime}
              </p>
              <p className={styles.timerLabel}>
                {isExpired ? "인증 시간이 만료되었습니다" : "남은 인증 시간"}
              </p>
            </div>

            {/* OTP 입력 */}
            <OtpInput value={code} onChange={setCode} maxLength={6} disabled={isExpired} />

            {/* 에러 */}
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={16} /><span>{error}</span>
              </div>
            )}

            {/* 재발송 */}
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!canResend || isSending}
                className={`${styles.resendBtn} ${canResend ? styles.resendBtnActive : styles.resendBtnDisabled}`}
              >
                {isSending ? <span className={styles.spinnerDark} /> : <RefreshCw size={14} />}
                {canResend ? "인증번호 재발송" : `재발송 가능까지 ${resendTimer.formattedTime}`}
              </button>
            </div>

            {/* 인증 확인 */}
            <button
              onClick={handleVerify}
              className={styles.verifyBtn}
              disabled={isVerifying || isExpired || code.length !== 6}
            >
              {isVerifying ? <><span className={styles.spinner} /> 확인 중...</> : "인증 확인"}
            </button>
          </>
        )}

        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          이전 단계로 돌아가기
        </button>
      </div>
    </AuthLayout>
  );
}
