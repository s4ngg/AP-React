import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { useSignupStore } from "../../store/signup-store"
import { CheckCircle, ShoppingBag, Gift, Truck } from "lucide-react"

export default function SignupCompletePage() {
  const navigate = useNavigate()
  const { formData, resetForm } = useSignupStore()

  useEffect(() => { if (!formData.email || !formData.name) navigate("/signup", { replace: true }) }, [formData.email, formData.name, navigate])

  return (
    <AuthLayout showSteps currentStep={5}>
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">가입을 축하합니다!</h1>
          <p className="mt-2 text-lg text-blue-600"><span className="font-semibold">{formData.name}</span>님, SHOP의 회원이 되셨습니다</p>
          <p className="mt-1 text-sm text-gray-400">{formData.email}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
          <h2 className="mb-4 font-semibold">회원 혜택 안내</h2>
          <div className="grid grid-cols-3 gap-4">
            {[{ Icon: Gift, label: "신규 가입 쿠폰", value: "3,000원" }, { Icon: ShoppingBag, label: "적립금 혜택", value: "최대 5%" }, { Icon: Truck, label: "무료배송", value: "5만원 이상" }].map(({ Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => { resetForm(); navigate("/login") }} className="w-full" size="lg">로그인 하러 가기</Button>
          <Link to="/"><Button variant="outline" className="w-full" size="lg">메인으로 가기</Button></Link>
        </div>
      </div>
    </AuthLayout>
  )
}
