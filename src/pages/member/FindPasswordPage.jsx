import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Spinner } from "../../components/ui/spinner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp"
import { useTimer } from "../../hooks/use-timer"
import { sendPasswordResetCode, verifyPasswordResetCode } from "../../lib/api/authApi"
import { Mail, RefreshCw, AlertCircle } from "lucide-react"

export default function FindPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [canResend, setCanResend] = useState(true)
  const timer = useTimer(300)
  const resendTimer = useTimer(60)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => { if (!resendTimer.isRunning && resendTimer.timeLeft === 0) setCanResend(true) }, [resendTimer.isRunning, resendTimer.timeLeft])

  const onSubmit = async (data) => {
    setIsSending(true); setError("")
    try { await sendPasswordResetCode(data.email) } catch {}
    finally { setEmail(data.email); setCodeSent(true); timer.start(300); resendTimer.start(60); setCanResend(false); setIsSending(false) }
  }

  const handleResend = async () => {
    if (!canResend) return
    setIsSending(true)
    try { await sendPasswordResetCode(email) } catch {}
    finally { timer.start(300); resendTimer.start(60); setCanResend(false); setCode(""); setIsSending(false) }
  }

  const handleVerify = async () => {
    if (code.length !== 6) { setError("인증번호 6자리를 입력해주세요"); return }
    setIsVerifying(true); setError("")
    try { await verifyPasswordResetCode(email, code) } catch {}
    finally {
      sessionStorage.setItem("resetPasswordEmail", email)
      sessionStorage.setItem("resetPasswordCode", code)
      navigate("/reset-password"); setIsVerifying(false)
    }
  }

  const isExpired = timer.timeLeft === 0 && codeSent

  return (
    <AuthLayout title="비밀번호 찾기" description="가입한 이메일로 인증번호를 발송합니다">
      {!codeSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input type="email" placeholder="example@email.com" className={errors.email ? "border-red-500" : ""}
              {...register("email", { required: "이메일을 입력해주세요", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" } })} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSending}>
            {isSending ? <><Spinner className="mr-2 h-5 w-5" /> 발송 중...</> : "인증번호 발송"}
          </Button>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/login" className="text-gray-400 hover:text-gray-700 hover:underline">로그인</Link>
            <span className="text-gray-200">|</span>
            <Link to="/find-email" className="text-gray-400 hover:text-gray-700 hover:underline">아이디 찾기</Link>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Mail className="h-5 w-5" /></div>
              <div><p className="text-sm text-gray-400">인증 이메일</p><p className="font-medium">{email}</p></div>
            </div>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-blue-600"}`}>{timer.formattedTime}</p>
            <p className="mt-1 text-sm text-gray-400">{isExpired ? "인증 시간이 만료되었습니다" : "남은 인증 시간"}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={code} onChange={setCode} disabled={isExpired}>
              <InputOTPGroup>{[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
          </div>
          {error && <div className="flex items-center justify-center gap-2 text-red-500"><AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span></div>}
          <div className="text-center">
            <button type="button" onClick={handleResend} disabled={!canResend || isSending}
              className={`inline-flex items-center gap-1 text-sm ${canResend ? "text-blue-600 hover:underline" : "cursor-not-allowed text-gray-400"}`}>
              <RefreshCw className={`h-4 w-4 ${isSending ? "animate-spin" : ""}`} />
              {canResend ? "인증번호 재발송" : `재발송 가능까지 ${resendTimer.formattedTime}`}
            </button>
          </div>
          <Button onClick={handleVerify} className="w-full" size="lg" disabled={isVerifying || isExpired || code.length !== 6}>
            {isVerifying ? <><Spinner className="mr-2 h-5 w-5" /> 확인 중...</> : "확인"}
          </Button>
          <div className="text-center"><button type="button" onClick={() => setCodeSent(false)} className="text-sm text-gray-400 hover:text-gray-700 hover:underline">이메일 다시 입력하기</button></div>
        </div>
      )}
    </AuthLayout>
  )
}
