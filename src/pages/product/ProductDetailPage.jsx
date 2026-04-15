import { useState, useMemo } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck } from "lucide-react"
import useCartStore from "../../store/cartStore"
import styles from "./ProductDetailPage.module.css"

// 임시 상품 데이터 (추후 API 연동 예정)
const mockProducts = [
  {
    id: 1,
    name: "[에스티로더] 갈색병 세럼 50ml",
    category: "뷰티",
    price: 89000,
    originalPrice: 145000,
    badge: "베스트",
    freeShipping: true,
    stock: 99,
    description: "에스티로더의 베스트셀러 세럼입니다. 피부 탄력 개선 및 보습에 탁월한 효과를 보여줍니다. 매일 아침 세안 후 사용하면 더욱 좋은 효과를 느끼실 수 있습니다.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
    ],
    options: [
      { id: "size", name: "용량", values: ["30ml", "50ml", "100ml"] },
    ],
  },
  {
    id: 2,
    name: "[나이키] 에어맥스 97 화이트",
    category: "패션",
    price: 179000,
    originalPrice: 219000,
    badge: null,
    freeShipping: true,
    stock: 30,
    description: "나이키 에어맥스 97의 클래식 화이트 컬러입니다. 편안한 착용감과 스타일리시한 디자인으로 데일리 스니커즈로 제격입니다.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    ],
    options: [
      { id: "size", name: "사이즈", values: ["250", "255", "260", "265", "270", "275", "280"] },
    ],
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const product = mockProducts.find((p) => p.id === Number(id))

  const [currentImg, setCurrentImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [isLiked, setIsLiked] = useState(false)

  const discountPercent = useMemo(() => {
    if (!product?.originalPrice) return null
    return Math.round((1 - product.price / product.originalPrice) * 100)
  }, [product])

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>상품을 찾을 수 없습니다</h1>
        <button className={styles.notFoundBtn} onClick={() => navigate("/")}>
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  const images = product.images || [product.image]

  const handleQty = (delta) => {
    const next = quantity + delta
    if (next >= 1 && next <= product.stock) setQuantity(next)
  }

  const allOptionsSelected = product.options.every((opt) => selectedOptions[opt.id])

  const handleAddToCart = () => {
    if (product.options.length > 0 && !allOptionsSelected) {
      alert("옵션을 모두 선택해주세요.")
      return
    }
    addItem(product, quantity, selectedOptions)
    alert("장바구니에 추가되었습니다.")
  }

  const handleBuyNow = () => {
    if (product.options.length > 0 && !allOptionsSelected) {
      alert("옵션을 모두 선택해주세요.")
      return
    }
    addItem(product, quantity, selectedOptions)
    navigate("/cart")
  }

  return (
    <div className={styles.page}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb}>
        <Link to="/">홈</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* 이미지 영역 */}
        <div className={styles.imageArea}>
          <div className={styles.mainImageBox}>
            <img src={images[currentImg]} alt={product.name} />
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            {images.length > 1 && (
              <>
                <button
                  className={styles.prevBtn}
                  onClick={() => setCurrentImg((c) => (c === 0 ? images.length - 1 : c - 1))}
                  aria-label="이전"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className={styles.nextBtn}
                  onClick={() => setCurrentImg((c) => (c === images.length - 1 ? 0 : c + 1))}
                  aria-label="다음"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumbBtn} ${i === currentImg ? styles.thumbActive : ""}`}
                  onClick={() => setCurrentImg(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className={styles.infoArea}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.productName}>{product.name}</h1>

          <div className={styles.priceRow}>
            {discountPercent && <span className={styles.discount}>{discountPercent}%</span>}
            <span className={styles.price}>{product.price.toLocaleString()}원</span>
          </div>
          {product.originalPrice && (
            <p className={styles.originalPrice}>{product.originalPrice.toLocaleString()}원</p>
          )}

          <div className={styles.shippingInfo}>
            <Truck size={18} color="#9ca3af" />
            <span>{product.freeShipping ? "무료배송" : "배송비 3,000원"}</span>
          </div>

          {/* 옵션 */}
          {product.options.map((opt) => (
            <div key={opt.id} className={styles.optionGroup}>
              <label className={styles.optionLabel}>{opt.name}</label>
              <select
                className={styles.optionSelect}
                value={selectedOptions[opt.id] || ""}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({ ...prev, [opt.id]: e.target.value }))
                }
              >
                <option value="">{opt.name}을(를) 선택하세요</option>
                {opt.values.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          ))}

          {/* 수량 */}
          <div className={styles.qtyGroup}>
            <label className={styles.qtyLabel}>수량</label>
            <div className={styles.qtyRow}>
              <div className={styles.qtyBox}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQty(-1)}
                  disabled={quantity <= 1}
                  aria-label="감소"
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQty(1)}
                  disabled={quantity >= product.stock}
                  aria-label="증가"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className={styles.stockInfo}>(재고: {product.stock}개)</span>
            </div>
          </div>

          {/* 합계 */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>총 상품금액</span>
            <span className={styles.totalPrice}>
              {(product.price * quantity).toLocaleString()}원
            </span>
          </div>

          {/* 버튼 */}
          <div className={styles.actionBtns}>
            <button
              className={styles.wishBtn}
              onClick={() => setIsLiked(!isLiked)}
              aria-label="위시리스트"
            >
              <Heart size={20} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#9ca3af"} />
            </button>
            <button className={styles.cartBtn} onClick={handleAddToCart}>
              <ShoppingCart size={18} /> 장바구니
            </button>
            <button className={styles.buyBtn} onClick={handleBuyNow}>
              바로구매
            </button>
          </div>

          {/* 설명 */}
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>상품 설명</h2>
            <p className={styles.desc}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
