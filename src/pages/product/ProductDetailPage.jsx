import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck, Star, MessageCircle, FileText, Info, Pencil, X, Check } from "lucide-react"
import useCartStore from "../../store/cartStore"
import useAuthStore from "../../store/authStore"
import { getProductDetail } from "../../api/productApi"
import { getProductReviews, updateReview } from "../../api/reviewApi"
import { addCartItem } from "../../api/cartApi"
import styles from "./ProductDetailPage.module.css"

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
  const { user } = useAuthStore()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewPage, setReviewPage] = useState(0)
  const [reviewTotalPages, setReviewTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editRating, setEditRating] = useState(0)
  const [editContent, setEditContent] = useState("")
  const [editHoverRating, setEditHoverRating] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  const [currentImg, setCurrentImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await getProductDetail(id, 0)
        const data = res.data
        setProduct(data)
        if (data?.reviewList) {
          setReviews(data.reviewList.content || [])
          setReviewTotalPages(data.reviewList.totalPages || 0)
        }
      } catch {
        setError("상품 정보를 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (reviewPage === 0) return
    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(id, reviewPage)
        setReviews(res.data?.content || [])
        setReviewTotalPages(res.data?.totalPages || 0)
      } catch {
      }
    }
    fetchReviews()
  }, [reviewPage, id])

  if (loading) return <div className={styles.notFound}><p>상품 정보를 불러오는 중...</p></div>
  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>{error || "상품을 찾을 수 없습니다"}</h1>
        <button className={styles.notFoundBtn} onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    )
  }

  const images = product.productImagesList?.length > 0
    ? product.productImagesList.map((img) => img.imageUrl)
    : [product.thumbnailUrl].filter(Boolean)

  const options = product.optionList || []

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const handleQty = (delta) => {
    const next = quantity + delta
    const maxStock = selectedOption?.stockQuantity || 999
    if (next >= 1 && next <= maxStock) setQuantity(next)
  }

  const handleAddToCart = async () => {
    if (options.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.")
      return
    }
    try {
      await addCartItem({
        productId: product.productId,
        productOptionId: selectedOption?.optionId || null,
        quantity,
      })
    } catch {
      // 비로그인 시 로컬 store만 업데이트
    }
    addItem(
      {
        id: product.productId,
        name: product.productName,
        price: Number(product.price),
        thumbnailUrl: product.thumbnailUrl,
      },
      quantity,
      selectedOption ? { [selectedOption.optionName]: selectedOption.optionValue } : {}
    )
    alert("장바구니에 추가되었습니다.")
  }

  const handleBuyNow = async () => {
    if (options.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.")
      return
    }
    try {
      await addCartItem({
        productId: product.productId,
        productOptionId: selectedOption?.optionId || null,
        quantity,
      })
    } catch {
      // 비로그인 시 로컬 store만 업데이트
    }
    addItem(
      {
        id: product.productId,
        name: product.productName,
        price: Number(product.price),
        thumbnailUrl: product.thumbnailUrl,
      },
      quantity,
      selectedOption ? { [selectedOption.optionName]: selectedOption.optionValue } : {}
    )
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
              {images[0] && (
                <div className={styles.descImageWrap}>
                  <img src={images[0]} alt={product.productName} className={styles.descImage} />
                </div>
              )}
            </div>
          </div>
        )

      case "detail":
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.tabContentTitle}>상세 정보</h3>
            <table className={styles.detailTable}>
              <tbody>
                {[
                  ["제조사", product.manufacturer],
                  ["원산지", product.origin],
                  ["주의사항", product.precaution],
                  ["브랜드", product.brand],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <tr key={label} className={styles.detailRow}>
                    <td className={styles.detailKey}>{label}</td>
                    <td className={styles.detailVal}>{value}</td>
                  </tr>
                ))}
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
                {/* TODO: 주문 내역에서 orderItemId를 받아 리뷰 작성 페이지로 이동 구현 필요 */}
                <p style={{ fontSize: 13, color: "#9ca3af" }}>구매 후 마이페이지에서 후기를 작성할 수 있습니다.</p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className={styles.emptyReview}>
                <p>아직 작성된 후기가 없습니다.</p>
              </div>
            ) : (
              <>
                <ul className={styles.reviewList}>
                  {reviews.map((review) => (
                    <li key={review.reviewId} className={styles.reviewItem}>
                      {editingReviewId === review.reviewId ? (
                        <div>
                          <div className={styles.reviewHeader}>
                            <div style={{ display: "flex", gap: 4 }}>
                              {[1,2,3,4,5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onMouseEnter={() => setEditHoverRating(s)}
                                  onMouseLeave={() => setEditHoverRating(0)}
                                  onClick={() => setEditRating(s)}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                  <Star
                                    size={18}
                                    fill={(editHoverRating || editRating) >= s ? "#f59e0b" : "none"}
                                    color={(editHoverRating || editRating) >= s ? "#f59e0b" : "#d1d5db"}
                                  />
                                </button>
                              ))}
                            </div>
                            <span className={styles.reviewAuthor}>{review.writerName}</span>
                          </div>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            style={{ width: "100%", marginTop: 8, padding: "8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 14, resize: "none" }}
                          />
                          <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13 }}
                            >
                              <X size={14} /> 취소
                            </button>
                            <button
                              onClick={async () => {
                                if (editContent.trim().length < 10) { alert("10자 이상 입력해주세요."); return }
                                setIsUpdating(true)
                                try {
                                  const res = await updateReview(review.reviewId, { rating: editRating, content: editContent.trim() })
                                  setReviews((prev) => prev.map((r) =>
                                    r.reviewId === review.reviewId
                                      ? { ...r, rating: res.data.rating, content: res.data.content }
                                      : r
                                  ))
                                  setEditingReviewId(null)
                                } catch {
                                  alert("수정에 실패했습니다.")
                                } finally {
                                  setIsUpdating(false)
                                }
                              }}
                              disabled={isUpdating}
                              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontSize: 13 }}
                            >
                              <Check size={14} /> {isUpdating ? "저장 중..." : "저장"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={styles.reviewHeader}>
                            <StarRating rating={review.rating} size={14} />
                            <span className={styles.reviewAuthor}>{review.writerName}</span>
                            <span className={styles.reviewDate}>{review.reviewDate}</span>
                            {user?.name === review.writerName && (
                              <button
                                onClick={() => {
                                  setEditingReviewId(review.reviewId)
                                  setEditRating(review.rating)
                                  setEditContent(review.content)
                                }}
                                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
                              >
                                <Pencil size={14} /> 수정
                              </button>
                            )}
                          </div>
                          {review.selectedOption && (
                            <p className={styles.reviewOption}>옵션: {review.selectedOption}</p>
                          )}
                          <p className={styles.reviewContent}>{review.content}</p>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {reviewTotalPages > 1 && (
                  <div className={styles.pagination}>
                    {Array.from({ length: reviewTotalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${styles.pageBtn} ${reviewPage === i ? styles.pageBtnActive : ""}`}
                        onClick={() => setReviewPage(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
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
              </ul>
            </div>
            <div className={styles.inquiryForm}>
              <textarea className={styles.inquiryTextarea} placeholder="상품에 대해 궁금한 점을 남겨주세요." rows={5} />
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
        <Link to={`/products?category=${product.parentCategoryName || ""}`}>{product.parentCategoryName}</Link>
        <span>/</span>
        <span>{product.productName}</span>
      </nav>

      <div className={styles.layout}>
        {/* 이미지 영역 */}
        <div className={styles.imageArea}>
          <div className={styles.mainImageBox}>
            {images.length > 0 && <img src={images[currentImg]} alt={product.productName} />}
            {images.length > 1 && (
              <>
                <button className={styles.prevBtn} onClick={() => setCurrentImg((c) => (c === 0 ? images.length - 1 : c - 1))} aria-label="이전">
                  <ChevronLeft size={18} />
                </button>
                <button className={styles.nextBtn} onClick={() => setCurrentImg((c) => (c === images.length - 1 ? 0 : c + 1))} aria-label="다음">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button key={i} className={`${styles.thumbBtn} ${i === currentImg ? styles.thumbActive : ""}`} onClick={() => setCurrentImg(i)}>
                  <img src={img} alt={`${product.productName} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className={styles.infoArea}>
          <p className={styles.category}>{product.parentCategoryName}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>{product.brand}</p>
          <h1 className={styles.productName}>{product.productName}</h1>

          <div className={styles.priceRow}>
            <span className={styles.price}>{Number(product.price).toLocaleString()}원</span>
          </div>

          {/* 별점 미리보기 */}
          <div className={styles.ratingPreview}>
            <StarRating rating={Math.round(Number(avgRating))} size={14} />
            <span className={styles.ratingPreviewText}>
              {avgRating} ({reviews.length}개 후기)
            </span>
            <button className={styles.ratingLink} onClick={() => setActiveTab("review")}>후기 보기</button>
          </div>

          <div className={styles.shippingInfo}>
            <Truck size={18} color="#9ca3af" />
            <span>무료배송</span>
          </div>

          {options.length > 0 && (
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>옵션 선택</label>
              <select
                className={styles.optionSelect}
                value={selectedOption?.optionId || ""}
                onChange={(e) => {
                  const opt = options.find((o) => o.optionId === Number(e.target.value))
                  setSelectedOption(opt || null)
                  setQuantity(1)
                }}
              >
                <option value="">옵션을 선택하세요</option>
                {options.map((opt) => (
                  <option key={opt.optionId} value={opt.optionId}>
                    {opt.optionName}: {opt.optionValue}
                    {opt.additionalPrice > 0 ? ` (+${opt.additionalPrice.toLocaleString()}원)` : ""}
                    {opt.stockQuantity === 0 ? " [품절]" : ""}
                  </option>
                ))}
              </select>
              {selectedOption && (
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  재고: {selectedOption.stockQuantity}개
                </p>
              )}
            </div>
          )}

          {/* 수량 */}
          <div className={styles.qtyGroup}>
            <label className={styles.qtyLabel}>수량</label>
            <div className={styles.qtyRow}>
              <div className={styles.qtyBox}>
                <button className={styles.qtyBtn} onClick={() => handleQty(-1)} disabled={quantity <= 1} aria-label="감소">
                  <Minus size={14} />
                </button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button className={styles.qtyBtn} onClick={() => handleQty(1)} disabled={selectedOption && quantity >= selectedOption.stockQuantity} aria-label="증가">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 합계 */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>총 상품금액</span>
            <span className={styles.totalPrice}>
              {((Number(product.price) + (selectedOption?.additionalPrice || 0)) * quantity).toLocaleString()}원
            </span>
          </div>

          {/* 버튼 */}
          <div className={styles.actionBtns}>
            <button className={styles.wishBtn} onClick={() => setIsLiked(!isLiked)} aria-label="위시리스트">
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

      {/* 하단 탭 */}
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
