import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sparkles, RefreshCw, Heart } from "lucide-react"
import axios from "axios"
import { getAiRecommendations } from "../../api/aiApi"
import styles from "./AiRecommendSection.module.css"
import useAuthStore from "../../store/authStore"

const spring = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const categoryMap = {
  "뷰티": 1, "패션": 2, "식품": 3, "주류": 4, "리빙": 5
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <Link to={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        <div className={styles.aiBadge}>
          <Sparkles size={10} /> AI 추천
        </div>
        <button
          className={styles.wishBtn}
          onClick={() => setLiked(!liked)}
          aria-label="위시리스트"
        >
          <Heart
            size={15}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "#9ca3af"}
          />
        </button>
      </div>
      <div className={styles.cardBody}>
        <Link to={`/products/${product.id}`} className={styles.productName}>
          {product.name}
        </Link>
        <div className={styles.priceRow}>
          {discount && <span className={styles.discount}>{discount}%</span>}
          <span className={styles.price}>{product.price.toLocaleString()}원</span>
        </div>
        {product.originalPrice && (
          <div className={styles.originalPrice}>
            {product.originalPrice.toLocaleString()}원
          </div>
        )}
      </div>
    </div>
  )
}

export default function AiRecommendSection() {
  const { isLoggedIn, user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({ categories: [], keywords: [], products: [] })

  useEffect(() => {
    if (isLoggedIn) {
      handleRefresh()
    }
  }, [isLoggedIn])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const result = await getAiRecommendations(data.categories, [])
      const recommendedCategories = result.recommendedCategories || []

      let products = []
      for (const cat of recommendedCategories) {
        const categoryId = categoryMap[cat]
        if (categoryId) {
          const res = await spring.get(`/api/products?categoryId=${categoryId}&size=2`)
          const items = res.data?.data?.content || []
          products = [
            ...products,
            ...items.map((p) => ({
              id: p.productId,
              name: p.productName,
              price: Number(p.price),
              originalPrice: null,
              image: p.thumbnailUrl,
            })),
          ]
        }
      }

      setData({
        categories: recommendedCategories,
        keywords: result.keywords || [],
        products,
      })
    } catch (e) {
      console.error("AI 추천 실패", e)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.titleWrap}>
              <div className={styles.aiIcon}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div className={styles.titleGroup}>
                <h2 className={styles.sectionTitle}>
                  <span>AI</span> 맞춤 추천
                </h2>
                <p className={styles.sectionSub}>로그인하고 나만의 추천을 받아보세요</p>
              </div>
            </div>
          </div>
          <div className={styles.loginPrompt}>
            <div className={styles.loginPromptIcon}>🤖</div>
            <h3 className={styles.loginPromptTitle}>로그인이 필요한 서비스입니다</h3>
            <p className={styles.loginPromptDesc}>
              관심 카테고리와 위시리스트를 분석해<br />
              나에게 딱 맞는 상품을 추천해드립니다.
            </p>
            <Link to="/login" className={styles.loginPromptBtn}>
              로그인하고 추천 받기
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.aiIcon}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div className={styles.titleGroup}>
              <h2 className={styles.sectionTitle}>
                <span>{user?.name ?? "회원"}님</span>을 위한 AI 추천
              </h2>
              <p className={styles.sectionSub}>
                관심 카테고리와 위시리스트를 분석했습니다
              </p>
            </div>
          </div>
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? styles.spinning : ""} />
            새로고침
          </button>
        </div>

        {!isLoading && data.categories.length > 0 && (
          <div className={styles.analysisTags}>
            <span className={styles.analysisLabel}>분석 기반:</span>
            {data.categories.map((c) => (
              <span key={c} className={`${styles.tag} ${styles.tagBlue}`}>{c}</span>
            ))}
            {data.keywords.map((k) => (
              <span key={k} className={`${styles.tag} ${styles.tagPurple}`}>{k}</span>
            ))}
          </div>
        )}

        {isLoading && (
          <>
            <div className={styles.loadingMsg}>
              <div className={styles.spinner} />
              AI가 맞춤 상품을 분석하고 있습니다...
            </div>
            <div className={styles.loading}>
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {!isLoading && (
          <div className={styles.productGrid}>
            {data.products.length === 0 ? (
              <p className={styles.empty}>추천 상품이 없습니다.</p>
            ) : (
              data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}