import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthLayout } from "../../components/common/auth-layout"
import { SocialLoginButtons } from "../../components/common/social-login-buttons"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Spinner } from "../../components/ui/spinner"
import { useSignupStore } from "../../store/signup-store"
import { checkEmailDuplicate } from "../../lib/api/authApi"
import { Eye, EyeOff, Check, X } from "lucide-react"

export default function SignupPage() {
  const navigate = useNavigate()
  const { setFormData, setCurrentStep } = useSignupStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm({ mode: "onChange" })
  const password = watch("password"); const passwordConfirm = watch("passwordConfirm"); const email = watch("email")

  const pv = {
    hasLength: (password?.length ?? 0) >= 8,
    hasLetter: /[a-zA-Z]/.test(password ?? ""),
    hasNumber: /[0-9]/.test(password ?? ""),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password ?? ""),
  }
  const isPasswordValid = pv.hasLength && pv.hasLetter && pv.hasNumber && pv.hasSpecial
  const passwordsMatch = password && passwordConfirm && password === passwordConfirm

  const handleCheckEmail = async () => {
    if (!email) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError("email", { message: "올바른 이메일 형식이 아닙니다" }); return }
    setCheckingEmail(true)
    try {
      const response = await checkEmailDuplicate(email)
      setEmailChecked(true); setEmailAvailable(response.data?.available || false)
      if (!response.data?.available) setError("email", { message: "이미 사용 중인 이메일입니다" })
    } catch { setEmailChecked(true); setEmailAvailable(true) }
    finally { setCheckingEmail(false) }
  }

  const onSubmit = async (data) => {
    if (!emailChecked || !emailAvailable) { setError("email", { message: "이메일 중복 확인을 해주세요" }); return }
    if (!isPasswordValid) { setError("password", { message: "비밀번호 조건을 확인해주세요" }); return }
    if (!passwordsMatch) { setError("passwordConfirm", { message: "비밀번호가 일치하지 않습니다" }); return }
    setIsSubmitting(true)
    setFormData({ email: data.email, password: data.password, name: data.name, phone: data.phone, zipCode: data.zipCode, address: data.address, addressDetail: data.addressDetail })
    setCurrentStep(2)
    navigate("/signup/verify-email")
  }

  return (
    <AuthLayout showSteps currentStep={1} title="회원가입" description="AllPick의 회원이 되어 다양한 혜택을 누려보세요">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 이메일 */}
        <div className="space-y-2">
          <Label>이메일</Label>
          <div className="flex gap-2">
            <Input type="email" placeholder="example@email.com"
              className={errors.email ? "border-red-500" : ""}
              {...register("email", { required: "이메일을 입력해주세요", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" }, onChange: () => { setEmailChecked(false); setEmailAvailable(false) } })} />
            <Button type="button" variant="outline" onClick={handleCheckEmail} disabled={checkingEmail || !email} className="shrink-0">
              {checkingEmail ? <Spinner className="h-4 w-4" /> : "중복확인"}
            </Button>
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          {emailChecked && emailAvailable && <p className="flex items-center gap-1 text-sm text-green-600"><Check className="h-4 w-4" /> 사용 가능한 이메일입니다</p>}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-2">
          <Label>비밀번호</Label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} placeholder="비밀번호를 입력해주세요"
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              {...register("password", { required: "비밀번호를 입력해주세요" })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {password && (
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[["hasLength","8자 이상"],["hasLetter","영문 포함"],["hasNumber","숫자 포함"],["hasSpecial","특수문자 포함"]].map(([k,l]) => (
                <span key={k} className={pv[k] ? "text-green-600" : "text-gray-400"}>
                  {pv[k] ? <Check className="inline h-3 w-3" /> : <X className="inline h-3 w-3" />} {l}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-2">
          <Label>비밀번호 확인</Label>
          <div className="relative">
            <Input type={showPasswordConfirm ? "text" : "password"} placeholder="비밀번호를 다시 입력해주세요"
              className={errors.passwordConfirm ? "border-red-500 pr-10" : "pr-10"}
              {...register("passwordConfirm", { required: "비밀번호 확인을 입력해주세요" })} />
            <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordConfirm && <p className={`flex items-center gap-1 text-sm ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
            {passwordsMatch ? <><Check className="h-4 w-4" /> 비밀번호가 일치합니다</> : <><X className="h-4 w-4" /> 비밀번호가 일치하지 않습니다</>}
          </p>}
        </div>

        {/* 이름 */}
        <div className="space-y-2">
          <Label>이름</Label>
          <Input placeholder="이름을 입력해주세요" className={errors.name ? "border-red-500" : ""}
            {...register("name", { required: "이름을 입력해주세요", pattern: { value: /^[가-힣a-zA-Z]+$/, message: "한글 또는 영문만 입력 가능합니다" } })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* 휴대폰 */}
        <div className="space-y-2">
          <Label>휴대폰 번호</Label>
          <Input type="tel" placeholder="010-0000-0000" className={errors.phone ? "border-red-500" : ""}
            {...register("phone", { required: "휴대폰 번호를 입력해주세요", pattern: { value: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/, message: "010-0000-0000 형식으로 입력해주세요" } })} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        {/* 주소 */}
        <div className="space-y-2">
          <Label>기본 배송지</Label>
          <div className="flex gap-2">
            <Input placeholder="우편번호" className={`w-28 ${errors.zipCode ? "border-red-500" : ""}`}
              {...register("zipCode", { required: true })} />
            <Input placeholder="기본주소" className={`flex-1 ${errors.address ? "border-red-500" : ""}`}
              {...register("address", { required: true })} />
          </div>
          <Input placeholder="상세주소" className={errors.addressDetail ? "border-red-500" : ""}
            {...register("addressDetail", { required: true })} />
          {(errors.zipCode || errors.address || errors.addressDetail) && <p className="text-sm text-red-500">배송지 정보를 모두 입력해주세요</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="h-5 w-5" /> : "다음 단계"}
        </Button>
        <SocialLoginButtons className="mt-8" />
      </form>
    </AuthLayout>
  )
}
