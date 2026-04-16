import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Star, ChevronLeft, Upload, X } from "lucide-react"
import styles from "./ReviewWritePage.module.css"

// 임시 상품 데이터 (ProductDetailPage와 동일하게 맞춤)
const mockProducts = {
  1: { name: "[에스티로더] 갈색병 세럼 50ml", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&h=120&fit=crop", category: "뷰티" },
  2: { name: "[나이키] 에어맥스 97 화이트", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop", category: "패션" },
}

const RATING_LABELS = { 1: "별로예요", 2: "그저그래요", 3: "보통이에요", 4: "좋아요", 5: "최고예요!" }

export default function ReviewWritePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = mockProducts[Number(id)]

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])  // { preview, file }
  const [submitted, setSubmitted] = useState(false)

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>상품을 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/")}>홈으로</button>
      </div>
    )
  }

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

  const handleSubmit = () => {
    if (rating === 0) { alert("별점을 선택해주세요."); return }
    if (content.trim().length < 10) { alert("후기를 10자 이상 작성해주세요."); return }
    // 백엔드 연동 시 API 호출 위치
    setSubmitted(true)
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
      {/* 상단 뒤로가기 */}
      <div className={styles.topBar}>
        <Link to={`/products/${id}`} className={styles.backLink}>
          <ChevronLeft size={20} />
          상품으로 돌아가기
        </Link>
      </div>

      <div className={styles.inner}>
        <h1 className={styles.pageTitle}>후기 작성</h1>

        {/* 상품 정보 */}
        <div className={styles.productCard}>
          <img src={product.image} alt={product.name} className={styles.productImg} />
          <div>
            <p className={styles.productCategory}>{product.category}</p>
            <p className={styles.productName}>{product.name}</p>
          </div>
        </div>

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
            {/* 업로드 버튼 */}
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
            {/* 미리보기 */}
            {images.map((img, idx) => (
              <div key={idx} className={styles.previewBox}>
                <img src={img.preview} alt={`첨부 ${idx + 1}`} className={styles.previewImg} />
                <button
                  className={styles.removeBtn}
                  onClick={() => handleImageRemove(idx)}
                  aria-label="삭제"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 안내 사항 */}
        <div className={styles.notice}>
          <p>• 구매한 상품과 관련 없는 내용은 삭제될 수 있습니다.</p>
          <p>• 타인의 개인정보가 포함된 내용은 작성하지 마세요.</p>
          <p>• 욕설, 비방, 광고성 내용은 제재를 받을 수 있습니다.</p>
        </div>

        {/* 제출 버튼 */}
        <div className={styles.btnRow}>
          <Link to={`/products/${id}`} className={styles.cancelBtn}>
            취소
          </Link>
          <button
            className={`${styles.submitBtn} ${rating > 0 && content.length >= 10 ? styles.submitBtnActive : ""}`}
            onClick={handleSubmit}
          >
            후기 등록
          </button>
        </div>
      </div>
    </div>
  )
}
