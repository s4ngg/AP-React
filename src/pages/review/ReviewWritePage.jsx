import { useState, useEffect } from "react"
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Star, ChevronLeft, Upload, X } from "lucide-react"
import { getProductDetail } from "../../api/productApi"
import { createReview } from "../../api/reviewApi"
import styles from "./ReviewWritePage.module.css"


const RATING_LABELS = { 1: "별로예요", 2: "그저그래요", 3: "보통이에요", 4: "좋아요", 5: "최고예요!" }

export default function ReviewWritePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderItemId = searchParams.get("orderItemId")
  const selectedOption = searchParams.get("selectedOption") || ""

  const [product, setProduct] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderItemId) {
      alert("주문 내역에서 후기를 작성해주세요.")
      navigate(-1)
    }
  }, [orderItemId, navigate])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductDetail(id)
        setProduct(res.data)
      } catch {
        setProduct(null)
      }
    }
    fetchProduct()
  }, [id])

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      alert("이미지는 최대 5장까지 첨부 가능합니다.")
      return
    }
    const newImgs = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }))
    setImages((prev) => [...prev, ...newImgs])
  }

  const handleImageRemove = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (rating === 0) { setError("별점을 선택해주세요."); return }
    if (content.trim().length < 10) { setError("후기를 10자 이상 작성해주세요."); return }

    setIsSubmitting(true)
    setError("")
    try {
      await createReview({
        orderItemId: Number(orderItemId),
        rating,
        content: content.trim(),
        selectedOption: selectedOption || null,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || "후기 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>후기가 등록되었습니다!</h2>
          <p className={styles.successDesc}>소중한 후기를 남겨주셔서 감사합니다.</p>
          <div className={styles.successBtns}>
            <Link to={`/products/${id}`} className={styles.successBackBtn}>
              상품 페이지로 돌아가기
            </Link>
            <Link to="/" className={styles.successHomeBtn}>
              홈으로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to={`/products/${id}`} className={styles.backLink}>
          <ChevronLeft size={20} />
          상품으로 돌아가기
        </Link>
      </div>

      <div className={styles.inner}>
        <h1 className={styles.pageTitle}>후기 작성</h1>

        {/* 상품 정보 */}
        {product && (
          <div className={styles.productCard}>
            {product.thumbnailUrl && (
              <img src={product.thumbnailUrl} alt={product.productName} className={styles.productImg} />
            )}
            <div>
              <p className={styles.productCategory}>{product.parentCategoryName}</p>
              <p className={styles.productName}>{product.productName}</p>
              {selectedOption && (
                <p className={styles.productOption}>옵션: {selectedOption}</p>
              )}
            </div>
          </div>
        )}

        {/* 별점 선택 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>별점 <span className={styles.required}>*</span></label>
          <div className={styles.starSelector}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                className={styles.starBtn}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                aria-label={`${s}점`}
              >
                <Star
                  size={36}
                  fill={(hoverRating || rating) >= s ? "#f59e0b" : "none"}
                  color={(hoverRating || rating) >= s ? "#f59e0b" : "#d1d5db"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
            {(hoverRating || rating) > 0 && (
              <span className={styles.ratingLabel}>
                {RATING_LABELS[hoverRating || rating]}
              </span>
            )}
          </div>
        </div>

        {/* 후기 내용 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            후기 내용 <span className={styles.required}>*</span>
            <span className={styles.charCount}>{content.length} / 최소 10자</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="상품을 사용해본 솔직한 후기를 남겨주세요. (최소 10자 이상)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        {/* 이미지 첨부 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            사진 첨부 <span className={styles.optional}>(선택, 최대 5장)</span>
          </label>
          <div className={styles.imageUploadRow}>
            {images.length < 5 && (
              <label className={styles.uploadBox}>
                <Upload size={22} color="#9ca3af" />
                <span className={styles.uploadText}>사진 추가</span>
                <span className={styles.uploadCount}>{images.length}/5</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.fileInput}
                  onChange={handleImageAdd}
                />
              </label>
            )}
            {images.map((img, idx) => (
              <div key={idx} className={styles.previewBox}>
                <img src={img.preview} alt={`첨부 ${idx + 1}`} className={styles.previewImg} />
                <button className={styles.removeBtn} onClick={() => handleImageRemove(idx)} aria-label="삭제">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 8 }}>{error}</p>}

        <div className={styles.notice}>
          <p>• 구매한 상품과 관련 없는 내용은 삭제될 수 있습니다.</p>
          <p>• 타인의 개인정보가 포함된 내용은 작성하지 마세요.</p>
          <p>• 욕설, 비방, 광고성 내용은 제재를 받을 수 있습니다.</p>
        </div>

        <div className={styles.btnRow}>
          <Link to={`/products/${id}`} className={styles.cancelBtn}>취소</Link>
          <button
            className={`${styles.submitBtn} ${rating > 0 && content.length >= 10 ? styles.submitBtnActive : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "후기 등록"}
          </button>
        </div>
      </div>
    </div>
  )
}
