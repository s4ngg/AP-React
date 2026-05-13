import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, ChevronDown, ChevronUp, Send } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerInquiries, replyToInquiry } from "../../api/sellerApi"
import ImagePreviewModal from "../../components/common/ImagePreviewModal"
import styles from "./SellerInquiryPage.module.css"

const INQUIRY_TYPE_LABEL = {
  PRODUCT: "상품문의",
  DELIVERY: "배송문의",
  PAYMENT: "결제문의",
  ETC: "기타",
}

const STATUS_LABEL = {
  PENDING: "미답변",
  PROCESSING: "처리중",
  COMPLETED: "답변완료",
  CANCELLED: "취소",
}

const STATUS_DOT_CLASS = {
  PENDING: "statusDotPending",
  PROCESSING: "statusDotProcessing",
  COMPLETED: "statusDotDone",
  CANCELLED: "statusDotCancelled",
}

const ANSWER_BADGE_CLASS = {
  PENDING: "answerBadgePending",
  PROCESSING: "answerBadgeProcessing",
  COMPLETED: "answerBadgeDone",
  CANCELLED: "answerBadgeCancelled",
}

export default function SellerInquiryPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [replyTexts, setReplyTexts] = useState({})
  const [submitting, setSubmitting] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [previewSrc, setPreviewSrc] = useState(null)

  useEffect(() => {
    setErrorMessage("")
    getSellerInquiries()
      .then((data) => setInquiries((data ?? []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {
        setErrorMessage("문의 목록을 불러오지 못했습니다.")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const handleHeaderKeyDown = (event, id) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== "Enter" && event.key !== " ") return

    event.preventDefault()
    handleToggle(id)
  }

  const handleReplyChange = (id, value) => {
    setReplyTexts((prev) => ({ ...prev, [id]: value }))
  }

  const handleReplySubmit = async (inq) => {
    const content = replyTexts[inq.inquiryId]?.trim()
    if (!content) return alert("답변 내용을 입력해주세요.")

    setSubmitting(inq.inquiryId)
    try {
      await replyToInquiry(inq.inquiryId, content)
      // 로컬 상태 업데이트
      setInquiries((prev) =>
        prev.map((i) =>
          i.inquiryId === inq.inquiryId
            ? { ...i, status: "COMPLETED", answerContent: content }
            : i
        )
      )
      setReplyTexts((prev) => ({ ...prev, [inq.inquiryId]: "" }))
    } catch (err) {
      console.error("답변 등록 실패", err)
      alert("답변 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setSubmitting(null)
    }
  }

  const unansweredCount = inquiries.filter((inq) => inq.status === "PENDING").length

  return (
    <div className={styles.sellerLayout}>
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>문의 답변</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>전체 {inquiries.length}건</span>
            {unansweredCount > 0 && (
              <span className={styles.unansweredBadge}>미답변 {unansweredCount}건</span>
            )}
          </div>
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          {loading ? (
            <p className={styles.emptyText}>불러오는 중...</p>
          ) : inquiries.length === 0 ? (
            <div className={styles.empty}>
              <MessageSquare size={36} color="#d1d5db" />
              <p>문의가 없습니다.</p>
            </div>
          ) : (
            <div className={styles.inquiryList}>
              {inquiries.map((inq) => (
                <div key={inq.inquiryId} className={styles.inquiryCard}>
                  {/* 헤더 */}
                  <div
                    className={styles.inquiryHeader}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedId === inq.inquiryId}
                    onClick={() => handleToggle(inq.inquiryId)}
                    onKeyDown={(event) => handleHeaderKeyDown(event, inq.inquiryId)}
                  >
                    <div className={styles.inquiryMeta}>
                      <span
                        className={`${styles.statusDot} ${styles[STATUS_DOT_CLASS[inq.status] ?? "statusDotPending"]}`}
                      />
                      <span className={styles.typeBadge}>
                        {INQUIRY_TYPE_LABEL[inq.inquiryType] ?? inq.inquiryType}
                      </span>
                      <Link
                        className={styles.productLink}
                        to={`/products/${inq.productId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        상품 #{inq.productId}
                      </Link>
                      <span className={styles.memberName}>회원 #{inq.memberId}</span>
                      <span className={styles.createdAt}>{inq.createdAt?.slice(0, 10)}</span>
                    </div>
                    <div className={styles.inquiryRight}>
                      <span
                        className={`${styles.answerBadge} ${styles[ANSWER_BADGE_CLASS[inq.status] ?? "answerBadgePending"]}`}
                      >
                        {STATUS_LABEL[inq.status] ?? inq.status}
                      </span>
                      {expandedId === inq.inquiryId
                        ? <ChevronUp size={16} />
                        : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* 펼침 영역 */}
                  {expandedId === inq.inquiryId && (
                    <div className={styles.inquiryBody}>
                      {/* 질문 */}
                      <div className={styles.questionBox}>
                        <p className={styles.questionLabel}>제목</p>
                        <p className={styles.questionText}>{inq.title}</p>
                      </div>
                      <div className={styles.questionBox}>
                        <p className={styles.questionLabel}>Q.</p>
                        <p className={styles.questionText}>{inq.content}</p>
                      </div>

                      {/* 첨부 이미지 */}
                      {(inq.attachments ?? []).length > 0 && (
                        <div className={styles.questionBox}>
                          <p className={styles.questionLabel}>첨부 이미지</p>
                          <div className={styles.attachmentList}>
                            {inq.attachments.map((att) => (
                              <img
                                key={att.attachmentId}
                                src={att.imageUrl}
                                alt="첨부 이미지"
                                className={styles.attachmentImage}
                                onClick={() => setPreviewSrc(att.imageUrl)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 기존 답변 표시 (완료된 경우) */}
                      {inq.status === "COMPLETED" && inq.answerContent && (
                        <div className={styles.answerBox}>
                          <p className={styles.answerLabel}>A.</p>
                          <p className={styles.answerText}>{inq.answerContent}</p>
                        </div>
                      )}

                      {/* 답변 입력 폼 (미답변 or 처리중인 경우) */}
                      {inq.status !== "COMPLETED" && (
                        <div className={styles.replyForm}>
                          <p className={styles.replyLabel}>답변 작성</p>
                          <textarea
                            className={styles.replyTextarea}
                            placeholder="고객에게 전달할 답변을 입력하세요."
                            rows={4}
                            value={replyTexts[inq.inquiryId] ?? ""}
                            onChange={(e) => handleReplyChange(inq.inquiryId, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className={styles.replyActions}>
                            <span className={styles.replyCount}>
                              {(replyTexts[inq.inquiryId] ?? "").length} / 1000
                            </span>
                            <button
                              className={styles.replyButton}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReplySubmit(inq)
                              }}
                              disabled={submitting === inq.inquiryId}
                            >
                              <Send size={14} />
                              {submitting === inq.inquiryId ? "등록 중..." : "답변 등록"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
