import { useState, useMemo } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck, Star, MessageCircle, FileText, Info } from "lucide-react"
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
    detailInfo: {
      manufacturer: "에스티로더 코리아",
      origin: "미국",
      capacity: "50ml",
      expiryDate: "제조일로부터 36개월",
      ingredients: "나이아신아마이드, 히알루론산, 비타민C 유도체",
      usage: "세안 후 적당량을 덜어 얼굴 전체에 부드럽게 펴 바릅니다.",
      caution: "눈 주위를 피해서 사용하세요. 이상이 있을 경우 사용을 중단하세요.",
    },
    reviewCount: 324,
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
    detailInfo: {
      manufacturer: "나이키 코리아",
      origin: "베트남",
      material: "메쉬, 합성피혁",
      size: "250 ~ 280 (5mm 단위)",
      color: "화이트/그레이",
      laundry: "손세탁 권장, 건조기 사용 금지",
      caution: "직사광선을 피해 보관하세요.",
    },
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    ],
    options: [
      { id: "size", name: "사이즈", values: ["250", "255", "260", "265", "270", "275", "280"] },
    ],
  },
]

// 임시 후기 데이터
const mockReviews = {
  1: [
    { id: 1, author: "김*영", rating: 5, date: "2025-03-15", content: "정말 좋아요! 피부가 촉촉해졌어요. 매일 아침저녁으로 사용하고 있는데 확실히 탄력이 생긴 것 같습니다.", option: "50ml" },
    { id: 2, author: "이*현", rating: 4, date: "2025-03-10", content: "향이 살짝 강하지만 흡수력은 정말 좋습니다. 재구매 의사 있어요.", option: "30ml" },
    { id: 3, author: "박*진", rating: 5, date: "2025-03-05", content: "오래 써온 세럼인데 역시 믿고 쓰는 에스티로더! 선물용으로도 추천합니다.", option: "100ml" },
  ],
  2: [
    { id: 1, author: "최*우", rating: 5, date: "2025-03-20", content: "쿠셔닝이 정말 좋고 오래 걸어도 발이 안 아파요. 디자인도 너무 예뻐서 매일 신게 됩니다.", option: "270" },
    { id: 2, author: "정*아", rating: 4, date: "2025-03-18", content: "화이트 컬러라 관리가 좀 필요하지만 스타일링하기 너무 좋아요!", option: "255" },
  ],
}

const TAB_ICONS = {
  description: <FileText size={16} />,
  detail: <Info size={16} />,
  review: <Star size={16} />,
  inquiry: <MessageCircle size={16} />,
}

const TABS = [
  { key: "description", label: "상품설명" },
  { key: "detail", label: "상세정보" },
  { key: "review", label: "후기" },
  { key: "inquiry", label: "문의" },
]

function StarRating({ rating, size = 16 }) {
  return (
    <div className={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "#f59e0b" : "none"}
          color={s <= rating ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const product = mockProducts.find((p) => p.id === Number(id))

  const [currentImg, setCurrentImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

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
  const reviews = mockReviews[product.id] || []
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className={styles.tabContent}>
            <div className={styles.descriptionBlock}>
              <h3 className={styles.tabContentTitle}>상품 설명</h3>
              <p className={styles.tabContentText}>{product.description}</p>
              <div className={styles.descImageWrap}>
                <img src={images[0]} alt={product.name} className={styles.descImage} />
                <p className={styles.descImageCaption}>{product.name}</p>
              </div>
            </div>
          </div>
        )

      case "detail":
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.tabContentTitle}>상세 정보</h3>
            <table className={styles.detailTable}>
              <tbody>
                {Object.entries(product.detailInfo).map(([key, value]) => {
                  const labelMap = {
                    manufacturer: "제조사", origin: "원산지", capacity: "용량",
                    expiryDate: "유통기한", ingredients: "주요 성분", usage: "사용방법",
                    caution: "주의사항", material: "소재", size: "사이즈", color: "색상",
                    laundry: "세탁방법",
                  }
                  return (
                    <tr key={key} className={styles.detailRow}>
                      <td className={styles.detailKey}>{labelMap[key] || key}</td>
                      <td className={styles.detailVal}>{value}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )

      case "review":
        return (
          <div className={styles.tabContent}>
            <div className={styles.reviewSummary}>
              <div className={styles.reviewSummaryLeft}>
                <p className={styles.avgRatingNum}>{avgRating}</p>
                <StarRating rating={Math.round(Number(avgRating))} size={22} />
                <p className={styles.reviewCountText}>총 {reviews.length}개의 후기</p>
              </div>
              <div className={styles.reviewSummaryRight}>
                <Link
                  to={`/products/${product.id}/review/write`}
                  className={styles.writeReviewBtn}
                >
                  ✏️ 후기 작성하기
                </Link>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className={styles.emptyReview}>
                <p>아직 작성된 후기가 없습니다.</p>
                <Link to={`/products/${product.id}/review/write`} className={styles.writeReviewBtnOutline}>
                  첫 번째 후기를 작성해보세요!
                </Link>
              </div>
            ) : (
              <ul className={styles.reviewList}>
                {reviews.map((review) => (
                  <li key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <StarRating rating={review.rating} size={14} />
                      <span className={styles.reviewAuthor}>{review.author}</span>
                      <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                    {review.option && (
                      <p className={styles.reviewOption}>옵션: {review.option}</p>
                    )}
                    <p className={styles.reviewContent}>{review.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )

      case "inquiry":
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.tabContentTitle}>상품 문의</h3>
            <div className={styles.inquiryNotice}>
              <p className={styles.inquiryNoticeTitle}>📌 문의 전 확인해주세요</p>
              <ul className={styles.inquiryNoticeList}>
                <li>상품 문의는 상품 관련 내용만 남겨주세요.</li>
                <li>배송 관련 문의는 고객센터를 이용해주세요.</li>
                <li>영업일 기준 1~2일 내에 답변 드립니다.</li>
                <li>개인정보(연락처, 주소 등)는 기재하지 마세요.</li>
              </ul>
            </div>
            <div className={styles.inquiryForm}>
              <textarea
                className={styles.inquiryTextarea}
                placeholder="상품에 대해 궁금한 점을 남겨주세요."
                rows={5}
              />
              <div className={styles.inquiryBtnRow}>
                <button className={styles.inquirySubmitBtn}>문의 등록</button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
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

          {/* 별점 미리보기 */}
          <div className={styles.ratingPreview}>
            <StarRating rating={Math.round(Number(avgRating))} size={14} />
            <span className={styles.ratingPreviewText}>
              {avgRating} ({reviews.length}개 후기)
            </span>
            <button className={styles.ratingLink} onClick={() => setActiveTab("review")}>
              후기 보기
            </button>
          </div>

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
        </div>
      </div>

      {/* ===== 하단 탭 섹션 ===== */}
      <div className={styles.tabSection}>
        <div className={styles.tabHeader}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{TAB_ICONS[tab.key]}</span>
              {tab.label}
              {tab.key === "review" && reviews.length > 0 && (
                <span className={styles.tabBadge}>{reviews.length}</span>
              )}
            </button>
          ))}
        </div>
        {renderTabContent()}
      </div>
    </div>
  )
}
