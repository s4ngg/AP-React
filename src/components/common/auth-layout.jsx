import { Link } from "react-router-dom"
import { ShoppingBag } from "lucide-react"

const STEPS = ["기본정보", "이메일인증", "카테고리", "약관동의", "완료"]

export function AuthLayout({ children, title, description, showSteps = false, currentStep = 1 }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 배너 + 로고 - AllPick 스타일 */}
      <header className="bg-white border-b border-gray-200">
        <div className="bg-blue-600 text-white text-center py-2 text-xs font-medium">
          신규가입 시 <strong className="font-bold">5,000원</strong> 할인쿠폰 즉시 지급!
        </div>
        <div className="mx-auto max-w-md px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-blue-600 w-fit">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">AllPick</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/login" className="hover:text-blue-600 transition-colors">로그인</Link>
            <Link to="/signup" className="hover:text-blue-600 transition-colors font-medium text-blue-600">회원가입</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* 스텝 인디케이터 */}
          {showSteps && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                {STEPS.map((label, i) => {
                  const step = i + 1
                  const isDone = step < currentStep
                  const isActive = step === currentStep
                  return (
                    <div key={step} className="flex flex-col items-center gap-1 flex-1">
                      {/* 연결선 */}
                      <div className="relative flex items-center justify-center w-full">
                        {i > 0 && (
                          <div className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full
                            ${step <= currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                        )}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${isDone
                            ? "bg-blue-600 text-white"
                            : isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-100 text-gray-400"}`}>
                          {isDone ? "✓" : step}
                        </div>
                      </div>
                      <span className={`text-[10px] mt-1 ${isActive ? "text-blue-600 font-semibold" : isDone ? "text-blue-400" : "text-gray-400"}`}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 타이틀 */}
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  )
}
