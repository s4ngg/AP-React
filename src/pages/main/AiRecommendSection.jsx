import { useState } from "react"
import { Link } from "react-router-dom"
import { Sparkles, RefreshCw, Heart, ShoppingCart } from "lucide-react"
import styles from "./AiRecommendSection.module.css"

// 임시 Mock 데이터 (추후 OpenAI API + FakeStore API 연동 예정)
const mockRecommendations = {
  user: "김상우",
  categories: ["뷰티", "리빙"],
  keywords: ["스킨케어", "인테리어소품", "보습"],
  products: [
    {
      id: 101,
      name: "[에스티로더] 갈색병 세럼 50ml",
      price: 89000,
      originalPrice: 145000,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      freeShipping: true,
    },
    {
      id: 102,
      name: "[설화수] 자음생크림 60ml",
      price: 112000,
      originalPrice: 140000,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
      freeShipping: true,
    },
    {
      id: 103,
      name: "[이케아] 말름 서랍장 6칸",
      price: 249000,
      originalPrice: 299000,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      freeShipping: true,
    },
    {
      id: 104,
      name: "[무인양품] 아크릴 수납함 세트",
      price: 35000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop",
      freeShipping: false,
    },
  ],
}

// 임시 로그인 상태 (추후 authStore 연동 예정)
const MOCK_IS_LOGGED_IN = true

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
        <button className={styles.cartBtn} onClick={() => alert(`${product.name} 장바구니 추가! (추후 API 연동)`)}>
          <ShoppingCart size={13} /> 장바구니
        </button>
      </div>
    </div>
  )
}

export default function AiRecommendSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(mockRecommendations)
  const isLoggedIn = MOCK_IS_LOGGED_IN

  // 추천 새로고침 (추후 OpenAI API 호출로 교체)
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // TODO: OpenAI API 호출 → 추천 상품 업데이트
    }, 2000)
  }

  // 비로그인 상태
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
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.aiIcon}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div className={styles.titleGroup}>
              <h2 className={styles.sectionTitle}>
                <span>{data.user}님</span>을 위한 AI 추천
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

        {/* AI 분석 태그 */}
        {!isLoading && (
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

        {/* 로딩 상태 */}
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

        {/* 상품 그리드 */}
        {!isLoading && (
          <div className={styles.productGrid}>
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
