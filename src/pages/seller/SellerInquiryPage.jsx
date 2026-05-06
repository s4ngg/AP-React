import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerInquiries } from "../../api/sellerApi"
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

export default function SellerInquiryPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    getSellerInquiries()
      .then((data) => setInquiries(data ?? []))
      .catch((err) => console.error("문의 목록 조회 실패", err))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

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
                    onClick={() => handleToggle(inq.inquiryId)}
                  >
                    <div className={styles.inquiryMeta}>
                      <span
                        className={`${styles.statusDot} ${
                          inq.status === "COMPLETED"
                            ? styles.statusDotDone
                            : styles.statusDotPending
                        }`}
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
                        className={`${styles.answerBadge} ${
                          inq.status === "COMPLETED"
                            ? styles.answerBadgeDone
                            : styles.answerBadgePending
                        }`}
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