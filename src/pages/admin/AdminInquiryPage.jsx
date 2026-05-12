import { useState, useEffect, Fragment } from "react"
import { ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { formatDate } from "../../utils/format"
import { getAdminInquiries, postAdminAnswer, updateInquiryStatus } from "../../api/inquiryApi"
import styles from "./AdminInquiryPage.module.css"

const TYPE_LABEL = {
  PRODUCT: "상품",
  DELIVERY: "배송",
  PAYMENT: "결제",
  ETC: "기타",
}

const STATUS_LABEL = {
  PENDING: "접수 대기",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
  CANCELLED: "취소",
}

const STATUS_CLASS = {
  PENDING: styles.statusPending,
  PROCESSING: styles.statusProcessing,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
}

export default function AdminInquiryPage() {
  const [inquiries, setInquiries] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [answerText, setAnswerText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [completingId, setCompletingId] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    getAdminInquiries()
      .then((data) => setInquiries((data ?? []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => setLoadError(true))
  }, [])

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
    setAnswerText("")
  }

  const handleComplete = async (inquiryId) => {
    if (!window.confirm("문의를 처리 완료로 변경하시겠습니까?")) return
    setCompletingId(inquiryId)
    try {
      await updateInquiryStatus(inquiryId, "COMPLETED")
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId ? { ...inq, status: "COMPLETED" } : inq
        )
      )
    } catch {
      alert("상태 변경에 실패했습니다.")
    } finally {
      setCompletingId(null)
    }
  }

  const handleAnswer = async (inquiryId) => {
    const content = answerText.trim()
    if (!content) return
    setSubmitting(true)
    try {
      const answer = await postAdminAnswer(inquiryId, content)
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId
            ? { ...inq, answers: [...(inq.answers ?? []), answer] }
            : inq
        )
      )
      setAnswerText("")
    } catch {
      alert("답변 등록에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>1:1 문의 관리</h1>

        <div className={styles.section}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유형</th>
                  <th>제목</th>
                  <th>상태</th>
                  <th>등록일</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {loadError ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>문의 목록을 불러오지 못했습니다.</td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>등록된 문의가 없습니다.</td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <Fragment key={inq.inquiryId}>
                      <tr>
                        <td className={styles.idCell}>{inq.inquiryId}</td>
                        <td>
                          <span className={styles.typeBadge}>
                            {TYPE_LABEL[inq.inquiryType] ?? inq.inquiryType}
                          </span>
                        </td>
                        <td className={styles.titleCell}>{inq.title}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${STATUS_CLASS[inq.status]}`}>
                            {STATUS_LABEL[inq.status] ?? inq.status}
                          </span>
                        </td>
                        <td>{formatDate(inq.createdAt)}</td>
                        <td>
                          <button
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(inq.inquiryId)}
                            aria-label="상세 보기"
                          >
                            {expandedId === inq.inquiryId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {expandedId === inq.inquiryId && (
                        <tr className={styles.detailRow}>
                          <td colSpan={6}>
                            <div className={styles.detailBox}>
                              <p className={styles.detailContent}>{inq.content}</p>

                              {(inq.answers ?? []).length > 0 && (
                                <div className={styles.answerList}>
                                  {inq.answers.map((ans) => (
                                    <div key={ans.inquiryAnswerId} className={styles.answerItem}>
                                      <span className={styles.answerLabel}>
                                        {ans.adminId ? "관리자" : "판매자"}
                                      </span>
                                      <p className={styles.answerContent}>{ans.content}</p>
                                      <span className={styles.answerDate}>{formatDate(ans.createdAt)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {(inq.answers ?? []).length > 0 && inq.status !== "COMPLETED" && (
                                <div className={styles.completeWrap}>
                                  <button
                                    className={styles.completeBtn}
                                    onClick={() => handleComplete(inq.inquiryId)}
                                    disabled={completingId === inq.inquiryId}
                                  >
                                    <CheckCircle size={14} />
                                    처리 완료
                                  </button>
                                </div>
                              )}

                              {(inq.answers ?? []).length === 0 && (
                                <div className={styles.answerForm}>
                                  <textarea
                                    className={styles.answerTextarea}
                                    placeholder="답변을 입력하세요"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    rows={3}
                                  />
                                  <button
                                    className={styles.answerBtn}
                                    onClick={() => handleAnswer(inq.inquiryId)}
                                    disabled={submitting || !answerText.trim()}
                                  >
                                    <Send size={14} />
                                    답변 등록
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
