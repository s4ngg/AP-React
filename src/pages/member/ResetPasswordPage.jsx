import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Spinner } from "../../components/ui/spinner"
import { resetPassword } from "../../lib/api/authApi"
import { Eye, EyeOff, Check, X, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const newPassword = watch("newPassword"); const confirmPassword = watch("confirmPassword")

  useEffect(() => {
    const e = sessionStorage.getItem("resetPasswordEmail")
    const c = sessionStorage.getItem("resetPasswordCode")
    if (!e || !c) { navigate("/find-password", { replace: true }); return }
    setEmail(e); setCode(c)
  }, [navigate])

  const pv = { hasLength: (newPassword?.length ?? 0) >= 8, hasLetter: /[a-zA-Z]/.test(newPassword ?? ""), hasNumber: /[0-9]/.test(newPassword ?? ""), hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword ?? "") }
  const isPasswordValid = Object.values(pv).every(Boolean)
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword

  const onSubmit = async (data) => {
    if (!isPasswordValid || !passwordsMatch) return
    setIsSubmitting(true)
    try { await resetPassword({ email, code, newPassword: data.newPassword }) } catch {}
    finally {
      sessionStorage.removeItem("resetPasswordEmail"); sessionStorage.removeItem("resetPasswordCode")
      setIsComplete(true); setIsSubmitting(false)
    }
  }

  if (isComplete) return (
    <AuthLayout title="비밀번호 변경 완료">
      <div className="space-y-6 text-center">
        <div className="flex justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"><CheckCircle className="h-10 w-10 text-green-600" /></div></div>
        <div><p className="text-lg font-semibold">비밀번호가 성공적으로 변경되었습니다</p><p className="mt-2 text-sm text-gray-400">새로운 비밀번호로 로그인해주세요</p></div>
        <Link to="/login"><Button className="w-full" size="lg">로그인 하러 가기</Button></Link>
      </div>
    </AuthLayout>
  )

  return (
    <AuthLayout title="비밀번호 재설정" description="새로운 비밀번호를 입력해주세요">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>새 비밀번호</Label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} placeholder="새 비밀번호를 입력해주세요" className="pr-10"
              {...register("newPassword", { required: "새 비밀번호를 입력해주세요" })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {newPassword && (
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[["hasLength","8자 이상"],["hasLetter","영문 포함"],["hasNumber","숫자 포함"],["hasSpecial","특수문자 포함"]].map(([k,l]) => (
                <span key={k} className={pv[k] ? "text-green-600" : "text-gray-400"}>
                  {pv[k] ? <Check className="inline h-3 w-3" /> : <X className="inline h-3 w-3" />} {l}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>새 비밀번호 확인</Label>
          <div className="relative">
            <Input type={showConfirm ? "text" : "password"} placeholder="새 비밀번호를 다시 입력해주세요" className="pr-10"
              {...register("confirmPassword", { required: "비밀번호 확인을 입력해주세요" })} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && <p className={`flex items-center gap-1 text-sm ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
            {passwordsMatch ? <><Check className="h-4 w-4" /> 비밀번호가 일치합니다</> : <><X className="h-4 w-4" /> 비밀번호가 일치하지 않습니다</>}
          </p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={!isPasswordValid || !passwordsMatch || isSubmitting}>
          {isSubmitting ? <><Spinner className="mr-2 h-5 w-5" /> 변경 중...</> : "비밀번호 변경"}
        </Button>
        <div className="text-center"><Link to="/login" className="text-sm text-gray-400 hover:text-gray-700 hover:underline">취소하고 로그인으로 돌아가기</Link></div>
      </form>
    </AuthLayout>
  )
}
