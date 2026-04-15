import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { Spinner } from "../../components/ui/spinner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp"
import { useSignupStore } from "../../store/signup-store"
import { useTimer } from "../../hooks/use-timer"
import { sendVerificationCode, verifyEmailCode } from "../../lib/api/authApi"
import { Mail, RefreshCw, AlertCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { formData, setFormData, setCurrentStep } = useSignupStore()
  const [code, setCode] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState("")
  const [canResend, setCanResend] = useState(true)
  const timer = useTimer(300)
  const resendTimer = useTimer(60)

  useEffect(() => { if (!formData.email) navigate("/signup", { replace: true }) }, [formData.email, navigate])
  useEffect(() => { if (!resendTimer.isRunning && resendTimer.timeLeft === 0) setCanResend(true) }, [resendTimer.isRunning, resendTimer.timeLeft])

  const handleSendCode = async () => {
    setIsSending(true); setError("")
    try { await sendVerificationCode(formData.email) } catch {}
    finally {
      setCodeSent(true); timer.start(300); resendTimer.start(60); setCanResend(false); setIsSending(false)
    }
  }

  const handleVerify = async () => {
    if (code.length !== 6) { setError("인증번호 6자리를 입력해주세요"); return }
    setIsVerifying(true); setError("")
    try { await verifyEmailCode(formData.email, code) } catch {}
    finally {
      setFormData({ emailVerified: true }); setCurrentStep(3); navigate("/signup/interests"); setIsVerifying(false)
    }
  }

  const isExpired = timer.timeLeft === 0 && codeSent

  return (
    <AuthLayout showSteps currentStep={2} title="이메일 인증" description="입력하신 이메일로 인증번호를 발송합니다">
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400">인증 이메일</p>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>
        </div>

        {!codeSent ? (
          <Button onClick={handleSendCode} className="w-full" size="lg" disabled={isSending}>
            {isSending ? <><Spinner className="mr-2 h-5 w-5" /> 발송 중...</> : "인증번호 발송"}
          </Button>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-blue-600"}`}>{timer.formattedTime}</p>
              <p className="mt-1 text-sm text-gray-400">{isExpired ? "인증 시간이 만료되었습니다" : "남은 인증 시간"}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <InputOTP maxLength={6} value={code} onChange={setCode} disabled={isExpired}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <div className="flex items-center justify-center gap-2 text-red-500"><AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span></div>}
            <div className="text-center">
              <button type="button" onClick={handleSendCode} disabled={!canResend || isSending}
                className={`inline-flex items-center gap-1 text-sm ${canResend ? "text-blue-600 hover:underline" : "cursor-not-allowed text-gray-400"}`}>
                <RefreshCw className={`h-4 w-4 ${isSending ? "animate-spin" : ""}`} />
                {canResend ? "인증번호 재발송" : `재발송 가능까지 ${resendTimer.formattedTime}`}
              </button>
            </div>
            <Button onClick={handleVerify} className="w-full" size="lg" disabled={isVerifying || isExpired || code.length !== 6}>
              {isVerifying ? <><Spinner className="mr-2 h-5 w-5" /> 확인 중...</> : "인증 확인"}
            </Button>
          </div>
        )}
        <div className="text-center">
          <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 hover:underline">
            이전 단계로 돌아가기
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
