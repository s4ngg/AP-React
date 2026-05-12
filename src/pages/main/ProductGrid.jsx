import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Truck } from "lucide-react"
import { useState, useEffect } from "react"
import styles from "./ProductGrid.module.css"
import useCartStore from "../../store/cartStore"
import { getProductList } from "../../api/productApi"

const sortOptions = [
  { label: "최신순",    value: "latest" },
  { label: "가격낮은순", value: "price_asc" },
  { label: "가격높은순", value: "price_desc" },
  { label: "인기순",    value: "popular" },
]

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const { addItem } = useCartStore()

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAddCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }

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
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked) }}
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
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductList(page)
        const content = res.data?.content || res.content || []
        const totalPages = res.data?.totalPages ?? res.totalPages ?? 0
        setDisplayProducts(prev => page === 0 ? content : [...prev, ...content])
        setHasMore(page < totalPages - 1)
      } catch {
        setDisplayProducts([])
      }
    }
    fetchProducts()
  }, [page])

  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (activeSort === "price_asc") return Number(a.price) - Number(b.price)
    if (activeSort === "price_desc") return Number(b.price) - Number(a.price)
    return 0
  })

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>추천 상품</h2>
          <div className={styles.sortBtns}>
            {sortOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => setActiveSort(o.value)}
                className={`${styles.sortBtn} ${activeSort === o.value ? styles.sortBtnActive : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        {sortedProducts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
            상품 준비 중입니다.
          </p>
        ) : (
          <div className={styles.grid}>
            {sortedProducts.map((p) => <ProductCard key={p.productId} product={p} />)}
          </div>
        )}
        {hasMore && (
          <button className={styles.moreBtn} onClick={() => setPage(p => p + 1)}>
            더보기
          </button>
        )}
      </div>
    </section>
  )
}