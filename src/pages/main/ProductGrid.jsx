import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Truck } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import styles from "./ProductGrid.module.css"
import useCartStore from "../../store/cartStore"
import { getProductList } from "../../api/productApi"

const sortOptions = [
  { label: "최신순",    value: "latest",     sort: "createdAt,desc" },
  { label: "가격낮은순", value: "price_asc",  sort: "price,asc" },
  { label: "가격높은순", value: "price_desc", sort: "price,desc" },
  { label: "인기순",    value: "popular",    sort: "createdAt,desc" },
]

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const { addItem } = useCartStore()

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/products/${product.productId}`} className={styles.card}>
      {toastVisible && (
        <div className={styles.toast}>
          <ShoppingCart size={13} /> 장바구니에 담겼습니다!
        </div>
      )}
      <div className={styles.imageBox}>
        <img src={product.thumbnailUrl} alt={product.productName} />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <button
          className={styles.wishBtn}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          aria-label="위시리스트"
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#9ca3af"} />
        </button>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.productName}>{product.productName}</span>
        <div className={styles.priceRow}>
          {discount && <span className={styles.discount}>{discount}%</span>}
          <span className={styles.price}>{Number(product.price).toLocaleString()}원</span>
        </div>
        {product.originalPrice && (
          <div className={styles.originalPrice}>{product.originalPrice.toLocaleString()}원</div>
        )}
        {product.freeShipping && (
          <div className={styles.shipping}>
            <Truck size={11} />무료배송
          </div>
        )}
      </div>
    </Link>
  )
}

export default function ProductGrid() {
  const [activeSort, setActiveSort] = useState("latest")
  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentSortParam = sortOptions.find((o) => o.value === activeSort)?.sort ?? "createdAt,desc"

  const fetchProducts = useCallback(async (targetPage, sortParam) => {
    setLoading(true)
    try {
      const apiResponse = await getProductList(targetPage, 8, sortParam)
      // getProductList → response.data = ApiResponse { data: Page { content, totalPages } }
      const pageData = apiResponse?.data
      const content = Array.isArray(pageData?.content) ? pageData.content : []
      const totalPages = pageData?.totalPages ?? 0
      setDisplayProducts((prev) => targetPage === 0 ? content : [...prev, ...content])
      setHasMore(targetPage < totalPages - 1)
    } catch {
      if (targetPage === 0) setDisplayProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // 정렬 변경 시 → 초기화 후 page 0 재조회
  useEffect(() => {
    setDisplayProducts([])
    setPage(0)
    fetchProducts(0, currentSortParam)
  }, [activeSort])

  // 더보기로 page 증가 시 → 추가 조회 (page > 0일 때만)
  useEffect(() => {
    if (page === 0) return
    fetchProducts(page, currentSortParam)
  }, [page])

  const handleSortChange = (value) => {
    if (value === activeSort) return
    setActiveSort(value)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>추천 상품</h2>
          <div className={styles.sortBtns}>
            {sortOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => handleSortChange(o.value)}
                className={`${styles.sortBtn} ${activeSort === o.value ? styles.sortBtnActive : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        {displayProducts.length === 0 && !loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
            상품 준비 중입니다.
          </p>
        ) : (
          <div className={styles.grid}>
            {displayProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
        {hasMore && (
          <button
            className={styles.moreBtn}
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? "로딩 중..." : "더보기"}
          </button>
        )}
      </div>
    </section>
  )
}