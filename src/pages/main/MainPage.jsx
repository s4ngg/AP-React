import HeroBanner from "./HeroBanner"
import CategorySection from "./CategorySection"
import ProductGrid from "./ProductGrid"
import AiRecommendSection from "./AiRecommendSection"

export default function MainPage() {
  return (
    <main>
      <HeroBanner />
      <CategorySection />
      <AiRecommendSection />   {/* ← 여기 추가 */}
      <ProductGrid />
    </main>
  )
}