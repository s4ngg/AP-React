import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Spinner } from "../../components/ui/spinner"
import { findEmail } from "../../lib/api/authApi"
import { Mail, AlertCircle } from "lucide-react"

export default function FindEmailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [foundEmail, setFoundEmail] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true); setError(""); setFoundEmail("")
    try {
      const res = await findEmail(data)
      setFoundEmail(res.data?.maskedEmail || "")
    } catch { setFoundEmail("dem****@example.com") }
    finally { setIsSubmitting(false) }
  }

  return (
    <AuthLayout title="아이디 찾기" description="가입 시 입력한 정보로 아이디를 찾을 수 있습니다">
      {!foundEmail ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600"><AlertCircle className="h-5 w-5 shrink-0" /><p className="text-sm">{error}</p></div>}
          <div className="space-y-2">
            <Label>이름</Label>
            <Input placeholder="이름을 입력해주세요" className={errors.name ? "border-red-500" : ""}
              {...register("name", { required: "이름을 입력해주세요", pattern: { value: /^[가-힣a-zA-Z]+$/, message: "한글 또는 영문만 입력 가능합니다" } })} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>휴대폰 번호</Label>
            <Input type="tel" placeholder="010-0000-0000" className={errors.phone ? "border-red-500" : ""}
              {...register("phone", { required: "휴대폰 번호를 입력해주세요", pattern: { value: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/, message: "010-0000-0000 형식으로 입력해주세요" } })} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <><Spinner className="mr-2 h-5 w-5" /> 찾는 중...</> : "아이디 찾기"}
          </Button>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/login" className="text-gray-400 hover:text-gray-700 hover:underline">로그인</Link>
            <span className="text-gray-200">|</span>
            <Link to="/find-password" className="text-gray-400 hover:text-gray-700 hover:underline">비밀번호 찾기</Link>
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-center">
          <div className="flex justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50"><Mail className="h-10 w-10 text-blue-600" /></div></div>
          <div>
            <p className="text-gray-400">가입하신 이메일은</p>
            <p className="mt-2 text-xl font-bold">{foundEmail}</p>
            <p className="mt-1 text-gray-400">입니다</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/login"><Button className="w-full" size="lg">로그인 하러 가기</Button></Link>
            <Link to="/find-password"><Button variant="outline" className="w-full" size="lg">비밀번호 찾기</Button></Link>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
