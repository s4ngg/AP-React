import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Truck } from "lucide-react"
import { useState } from "react"
import styles from "./ProductGrid.module.css"
import { useNavigate } from "react-router-dom"


const sortOptions = [
  { label: "최신순",    value: "latest" },
  { label: "가격낮은순", value: "price_asc" },
  { label: "가격높은순", value: "price_desc" },
  { label: "인기순",    value: "popular" },
]

const products = [
  { id: 1, name: "[에스티로더] 갈색병 세럼 50ml",   price: 89000,  originalPrice: 145000, badge: "베스트",  freeShipping: true,  image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop" },
  { id: 2, name: "[나이키] 에어맥스 97 화이트",      price: 179000, originalPrice: 219000, badge: null,      freeShipping: true,  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: 3, name: "[제주] 황금향 선물세트 3kg",       price: 32900,  originalPrice: null,   badge: "산지직송", freeShipping: true,  image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop" },
  { id: 4, name: "[샤또 마고] 2018 빈티지 750ml",   price: 189000, originalPrice: null,   badge: null,      freeShipping: false, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop" },
  { id: 5, name: "[이케아] 말름 서랍장 6칸",         price: 249000, originalPrice: 299000, badge: "특가",    freeShipping: true,  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" },
  { id: 6, name: "[설화수] 자음생크림 60ml",         price: 112000, originalPrice: 140000, badge: null,      freeShipping: true,  image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop" },
  { id: 7, name: "[한우] 1++ 등심 500g",            price: 54900,  originalPrice: null,   badge: "오늘출발", freeShipping: true,  image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop" },
  { id: 8, name: "[자라] 오버사이즈 울 코트",         price: 159000, originalPrice: null,   badge: null,      freeShipping: true,  image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop" },
]

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img src={product.image} alt={product.name} />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <button className={styles.wishBtn} onClick={() => setLiked(!liked)} aria-label="위시리스트">
          <Heart size={16} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#9ca3af"} />
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
          <div className={styles.originalPrice}>{product.originalPrice.toLocaleString()}원</div>
        )}
        {product.freeShipping && (
          <div className={styles.shipping}>
            <Truck size={11} />무료배송
          </div>
        )}
        <button className={styles.cartBtn}>
          <ShoppingCart size={14} />장바구니
        </button>
      </div>
    </div>
  )
}

export default function ProductGrid() {
  const [activeSort, setActiveSort] = useState("latest")
  const navigate = useNavigate()

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
        <div className={styles.grid}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <button className={styles.moreBtn} onClick={() => navigate("/products")}>
          더보기
        </button>
      </div>
    </section>
  )
}