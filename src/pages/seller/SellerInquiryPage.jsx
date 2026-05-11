import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { answerSellerInquiry, getSellerInquiries } from "../../api/sellerApi"
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
  const [answerValues, setAnswerValues] = useState({})
  const [submittingId, setSubmittingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    getSellerInquiries()
      .then((data) => setInquiries(data ?? []))
      .catch(() => {
        setErrorMessage("문의 목록을 불러오지 못했습니다.")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const handleHeaderKeyDown = (event, inquiryId) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    handleToggle(inquiryId)
  }

  const handleAnswerChange = (inquiryId, value) => {
    setAnswerValues((prev) => ({ ...prev, [inquiryId]: value }))
  }

  const handleAnswerSubmit = async (inquiryId) => {
    const content = answerValues[inquiryId]?.trim()

    if (!content) {
      setErrorMessage("답변 내용을 입력해주세요.")
      return
    }

    setSubmittingId(inquiryId)
    setErrorMessage("")

    try {
      const answer = await answerSellerInquiry(inquiryId, content)

      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId
            ? {
                ...inq,
                status: "PROCESSING",
                answers: [...(inq.answers ?? []), answer],
              }
            : inq
        )
      )
      setAnswerValues((prev) => ({ ...prev, [inquiryId]: "" }))
    } catch {
      setErrorMessage("답변 등록에 실패했습니다.")
    } finally {
      setSubmittingId(null)
    }
  }

  const unansweredCount = inquiries.filter((inq) => inq.status === "PENDING").length

  return (
    <div className={styles.sellerLayout}>
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

                  {expandedId === inq.inquiryId && (
                    <div className={styles.inquiryBody}>
                      <div className={styles.questionBox}>
                        <p className={styles.questionLabel}>제목</p>
                        <p className={styles.questionText}>{inq.title}</p>
                      </div>
                      <div className={styles.questionBox}>
                        <p className={styles.questionLabel}>Q.</p>
                        <p className={styles.questionText}>{inq.content}</p>
                      </div>
                      {(inq.answers ?? []).length > 0 && (
                        <div className={styles.answerBox}>
                          <p className={styles.answerLabel}>A.</p>
                          <div>
                            {(inq.answers ?? []).map((answer) => (
                              <p key={answer.inquiryAnswerId} className={styles.answerText}>
                                {answer.content}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {inq.status === "PENDING" && (
                        <div className={styles.answerForm}>
                          <textarea
                            className={styles.answerTextarea}
                            value={answerValues[inq.inquiryId] ?? ""}
                            onChange={(event) => handleAnswerChange(inq.inquiryId, event.target.value)}
                            placeholder="답변 내용을 입력해주세요."
                            rows={4}
                          />
                          <div className={styles.answerActions}>
                            <button
                              type="button"
                              className={styles.submitBtn}
                              onClick={() => handleAnswerSubmit(inq.inquiryId)}
                              disabled={submittingId === inq.inquiryId}
                            >
                              {submittingId === inq.inquiryId ? "등록 중..." : "답변 등록"}
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
