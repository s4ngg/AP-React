import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/common/auth-layout"
import { Button } from "../../components/ui/button"
import { useSignupStore } from "../../store/signup-store"
import { cn } from "../../lib/utils"
import { Sparkles, Shirt, UtensilsCrossed, Wine, Sofa, Check } from "lucide-react"

const categories = [
  { id: "beauty", name: "뷰티", icon: Sparkles, description: "스킨케어, 메이크업, 향수", color: "bg-pink-50 border-pink-200 text-pink-700", activeColor: "bg-pink-100 border-pink-500 text-pink-700" },
  { id: "fashion", name: "패션", icon: Shirt, description: "의류, 신발, 액세서리", color: "bg-blue-50 border-blue-200 text-blue-700", activeColor: "bg-blue-100 border-blue-500 text-blue-700" },
  { id: "food", name: "식품", icon: UtensilsCrossed, description: "신선식품, 가공식품, 건강식품", color: "bg-orange-50 border-orange-200 text-orange-700", activeColor: "bg-orange-100 border-orange-500 text-orange-700" },
  { id: "liquor", name: "주류", icon: Wine, description: "와인, 위스키, 전통주", color: "bg-purple-50 border-purple-200 text-purple-700", activeColor: "bg-purple-100 border-purple-500 text-purple-700" },
  { id: "living", name: "리빙", icon: Sofa, description: "가구, 생활용품, 인테리어", color: "bg-green-50 border-green-200 text-green-700", activeColor: "bg-green-100 border-green-500 text-green-700" },
]

export default function InterestsPage() {
  const navigate = useNavigate()
  const { formData, setFormData, setCurrentStep } = useSignupStore()

  //useEffect(() => { if (!formData.emailVerified) navigate("/signup/verify-email", { replace: true }) }, [formData.emailVerified, navigate])

  const toggle = (id) => {
    const current = formData.interests || []
    setFormData({ interests: current.includes(id) ? current.filter(i => i !== id) : [...current, id] })
  }

  return (
    <AuthLayout showSteps currentStep={3} title="관심 카테고리" description="관심 있는 카테고리를 선택해주세요 (선택사항)">
      <div className="space-y-6">
        <p className="text-center text-sm text-gray-400">
          {(formData.interests?.length ?? 0) > 0 ? <><span className="font-semibold text-blue-600">{formData.interests.length}개</span> 선택됨</> : "선택하지 않고 건너뛸 수 있습니다"}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map(cat => {
            const isSelected = formData.interests?.includes(cat.id)
            const Icon = cat.icon
            return (
              <button key={cat.id} type="button" onClick={() => toggle(cat.id)}
                className={cn("relative flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]", isSelected ? cat.activeColor : cat.color)}>
                {isSelected && <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-current"><Check className="h-3 w-3 text-white" /></div>}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/80"><Icon className="h-6 w-6" /></div>
                <div><p className="font-semibold">{cat.name}</p><p className="text-xs opacity-80">{cat.description}</p></div>
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => { setCurrentStep(4); navigate("/signup/terms") }} className="w-full" size="lg">다음 단계</Button>
          <Button type="button" variant="ghost" onClick={() => { setFormData({ interests: [] }); setCurrentStep(4); navigate("/signup/terms") }} className="w-full text-gray-400">건너뛰기</Button>
        </div>
        <div className="text-center"><button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 hover:underline">이전 단계로 돌아가기</button></div>
      </div>
    </AuthLayout>
  )
}
