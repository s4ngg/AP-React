import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Spinner } from "../../components/ui/spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { useSignupStore } from "../../store/signup-store"
import { signup } from "../../lib/api/authApi"
import { ChevronRight, AlertCircle } from "lucide-react"

const termItems = [
  { id: "termsAgreed", label: "이용약관 동의", required: true, content: "제1조 (목적)\n이 약관은 SHOP이 운영하는 쇼핑몰에서 제공하는 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다." },
  { id: "privacyAgreed", label: "개인정보 수집 및 이용 동의", required: true, content: "수집 항목: 이메일, 비밀번호, 이름, 휴대폰 번호, 배송지 주소\n수집 목적: 회원 가입 및 관리, 서비스 제공\n보유 기간: 회원 탈퇴 시까지" },
  { id: "marketingEmailAgreed", label: "마케팅 이메일 수신 동의", required: false, content: "SHOP의 이벤트, 할인, 신상품 안내 등 마케팅 정보를 이메일로 받아보실 수 있습니다. 본 동의는 선택사항입니다." },
  { id: "marketingSmsAgreed", label: "마케팅 SMS 수신 동의", required: false, content: "SHOP의 이벤트, 할인, 신상품 안내 등 마케팅 정보를 SMS로 받아보실 수 있습니다. 본 동의는 선택사항입니다." },
  { id: "ageVerified", label: "만 14세 이상입니다", required: true, content: "만 14세 미만의 아동은 법정대리인의 동의 없이 회원가입을 할 수 없습니다." },
]

export default function TermsPage() {
  const navigate = useNavigate()
  const { formData, setFormData, setCurrentStep } = useSignupStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { if (!formData.emailVerified) navigate("/signup/verify-email", { replace: true }) }, [formData.emailVerified, navigate])

  const isAllChecked = termItems.every(t => formData[t.id])
  const isRequiredChecked = termItems.filter(t => t.required).every(t => formData[t.id])

  const handleSubmit = async () => {
    if (!isRequiredChecked) { setError("필수 약관에 모두 동의해주세요"); return }
    setIsSubmitting(true); setError("")
    try { await signup({ ...formData }) } catch {}
    finally { setCurrentStep(5); navigate("/signup/complete"); setIsSubmitting(false) }
  }

  return (
    <AuthLayout showSteps currentStep={4} title="약관 동의" description="서비스 이용을 위해 약관에 동의해주세요">
      <div className="space-y-6">
        {/* 전체 동의 */}
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={isAllChecked} onCheckedChange={(v) => termItems.forEach(t => setFormData({ [t.id]: v }))} className="h-5 w-5" />
            <span className="font-semibold">전체 동의</span>
          </label>
        </div>
        {/* 개별 약관 */}
        <div className="space-y-3 rounded-lg border border-gray-100 p-4">
          {termItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <label className="flex cursor-pointer items-center gap-3">
                <Checkbox checked={!!formData[item.id]} onCheckedChange={(v) => setFormData({ [item.id]: v })} />
                <span className="text-sm">
                  {item.label}
                  {item.required && <span className="ml-1 text-red-500">(필수)</span>}
                </span>
              </label>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="flex items-center text-sm text-gray-400 hover:text-gray-700">
                    보기 <ChevronRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{item.label}</DialogTitle></DialogHeader>
                  <div className="mt-4 whitespace-pre-line text-sm text-gray-500">{item.content}</div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
        {error && <div className="flex items-center justify-center gap-2 text-red-500"><AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span></div>}
        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!isRequiredChecked || isSubmitting}>
          {isSubmitting ? <><Spinner className="mr-2 h-5 w-5" /> 가입 중...</> : "가입 완료"}
        </Button>
        <div className="text-center"><button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 hover:underline">이전 단계로 돌아가기</button></div>
      </div>
    </AuthLayout>
  )
}
