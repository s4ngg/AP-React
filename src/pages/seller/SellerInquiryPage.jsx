import { useState } from "react"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerInquiryPage.module.css"

// 임시 문의 데이터 (추후 API 연동 예정)
const mockInquiries = [
  {
    id: 1,
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    memberName: "홍길동",
    question: "이 제품 민감성 피부에도 사용 가능한가요?",
    answer: null,
    createdAt: "2026-04-15",
  },
  {
    id: 2,
    productName: "[뷰티스타일샵] 토너 200ml",
    memberName: "김민수",
    question: "재입고 예정이 있나요?",
    answer: "안녕하세요! 5월 초 재입고 예정입니다. 관심 가져주셔서 감사합니다.",
    createdAt: "2026-04-14",
  },
  {
    id: 3,
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    memberName: "이영희",
    question: "향이 강한가요?",
    answer: null,
    createdAt: "2026-04-13",
  },
]

export default function SellerInquiryPage() {
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [expandedId, setExpandedId] = useState(null)
  const [answerDraft, setAnswerDraft] = useState({})

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleAnswerChange = (id, value) => {
    setAnswerDraft((prev) => ({ ...prev, [id]: value }))
  }

  const handleAnswerSubmit = (id) => {
    const answer = answerDraft[id]?.trim()
    if (!answer) return
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, answer } : inq))
    )
    setAnswerDraft((prev) => ({ ...prev, [id]: "" }))
    setExpandedId(null)
  }

  const unansweredCount = inquiries.filter((inq) => !inq.answer).length

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

          <div className={styles.inquiryList}>
            {inquiries.length === 0 ? (
              <div className={styles.empty}>
                <MessageSquare size={36} color="#d1d5db" />
                <p>문의가 없습니다.</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className={styles.inquiryCard}>
                  <div
                    className={styles.inquiryHeader}
                    onClick={() => handleToggle(inq.id)}
                  >
                    <div className={styles.inquiryMeta}>
                      <span className={`${styles.statusDot} ${inq.answer ? styles.statusDotDone : styles.statusDotPending}`} />
                      <span className={styles.productName}>{inq.productName}</span>
                      <span className={styles.memberName}>{inq.memberName}</span>
                      <span className={styles.createdAt}>{inq.createdAt}</span>
                    </div>
                    <div className={styles.inquiryRight}>
                      <span className={`${styles.answerBadge} ${inq.answer ? styles.answerBadgeDone : styles.answerBadgePending}`}>
                        {inq.answer ? "답변완료" : "미답변"}
                      </span>
                      {expandedId === inq.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {expandedId === inq.id && (
                    <div className={styles.inquiryBody}>
                      <div className={styles.questionBox}>
                        <p className={styles.questionLabel}>Q.</p>
                        <p className={styles.questionText}>{inq.question}</p>
                      </div>

                      {inq.answer ? (
                        <div className={styles.answerBox}>
                          <p className={styles.answerLabel}>A.</p>
                          <p className={styles.answerText}>{inq.answer}</p>
                        </div>
                      ) : (
                        <div className={styles.answerForm}>
                          <textarea
                            className={styles.answerTextarea}
                            placeholder="답변을 입력하세요"
                            value={answerDraft[inq.id] || ""}
                            onChange={(e) => handleAnswerChange(inq.id, e.target.value)}
                            rows={4}
                          />
                          <div className={styles.answerActions}>
                            <button
                              className={styles.submitBtn}
                              onClick={() => handleAnswerSubmit(inq.id)}
                              disabled={!answerDraft[inq.id]?.trim()}
                            >
                              답변 등록
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
