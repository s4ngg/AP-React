import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthLayout } from "../../components/common/auth-layout"
import { SocialLoginButtons } from "../../components/common/social-login-buttons"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Spinner } from "../../components/ui/spinner"
import { login } from "../../lib/api/authApi"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true); setError("")
    try {
      await login({ email: data.email, password: data.password, autoLogin })
      navigate("/")
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다")
    } finally { setIsSubmitting(false) }
  }

  return (
    <AuthLayout title="로그인" description="SHOP에 오신 것을 환영합니다">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" /><p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" placeholder="example@email.com"
            className={errors.email ? "border-red-500" : ""}
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" }
            })} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="비밀번호를 입력해주세요"
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              {...register("password", { required: "비밀번호를 입력해주세요" })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={autoLogin} onCheckedChange={(v) => setAutoLogin(v)} id="autoLogin" />
          <label htmlFor="autoLogin" className="text-sm text-gray-500 cursor-pointer">자동 로그인</label>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner className="mr-2 h-5 w-5" /> 로그인 중...</> : "로그인"}
        </Button>

        <div className="flex items-center justify-center gap-4 text-sm">
          <Link to="/find-email" className="text-gray-400 hover:text-gray-700 hover:underline">아이디 찾기</Link>
          <span className="text-gray-200">|</span>
          <Link to="/find-password" className="text-gray-400 hover:text-gray-700 hover:underline">비밀번호 찾기</Link>
          <span className="text-gray-200">|</span>
          <Link to="/signup" className="text-gray-400 hover:text-gray-700 hover:underline">회원가입</Link>
        </div>

        <SocialLoginButtons className="mt-8" />
      </form>
    </AuthLayout>
  )
}
