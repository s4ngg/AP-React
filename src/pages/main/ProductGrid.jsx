import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Truck } from "lucide-react"
import { useState } from "react"
import styles from "./ProductGrid.module.css"
import useCartStore from "../../store/cartStore"

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
    <Link to={`/products/${product.id}`} className={styles.card}>
      {toastVisible && (
        <div className={styles.toast}>
          <ShoppingCart size={13} /> 장바구니에 담겼습니다!
        </div>
      )}
      <div className={styles.imageBox}>
        <img src={product.image} alt={product.name} />
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
        <span className={styles.productName}>{product.name}</span>
        <div className={styles.priceRow}>
          {discount && <span className={styles.discount}>{discount}%</span>}
          <span className={styles.price}>{product.price.toLocaleString()}원</span>
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

  // 추후 API 데이터로 교체
  const displayProducts = []

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
        {displayProducts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
            상품 준비 중입니다.
          </p>
        ) : (
          <div className={styles.grid}>
            {displayProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <button className={styles.moreBtn}>더보기</button>
      </div>
    </section>
  )
}