import { useState, useMemo, useEffect } from "react"
import { Plus, Trash2, Pencil, X } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { formatDate } from "../../utils/format"
import styles from "./AdminFAQPage.module.css"
import { getFaqs, createFaq, updateFaq, deleteFaq } from "../../api/faqApi"

const CATEGORIES = ["전체", "주문/결제", "배송", "교환/반품", "회원"]
const FAQ_CATEGORIES = CATEGORIES.slice(1)

const CATEGORY_MAP = {
  "주문/결제": "PAYMENT",
  "배송": "DELIVERY",
  "교환/반품": "CANCEL_REFUND",
  "회원": "MEMBER",
}

const CATEGORY_LABEL = {
  PAYMENT: "주문/결제",
  DELIVERY: "배송",
  CANCEL_REFUND: "교환/반품",
  MEMBER: "회원",
}

const sortFaqs = (list) => [...list].sort((a, b) => b.faqId - a.faqId)

export default function AdminFAQPage() {
  const [faqs, setFAQs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newCategory, setNewCategory] = useState(FAQ_CATEGORIES[0])

  const [editTarget, setEditTarget] = useState(null)
  const [editCategory, setEditCategory] = useState(FAQ_CATEGORIES[0])
  const [editQuestion, setEditQuestion] = useState("")
  const [editAnswer, setEditAnswer] = useState("")

  const openEdit = (faq) => {
    setEditTarget(faq)
    setEditCategory(CATEGORY_LABEL[faq.category] ?? FAQ_CATEGORIES[0])
    setEditQuestion(faq.title)
    setEditAnswer(faq.content)
  }

  const closeEdit = () => setEditTarget(null)

  const handleEdit = (e) => {
    e.preventDefault()
    if (!editQuestion.trim() || !editAnswer.trim()) return
    updateFaq(editTarget.faqId, {
      category: CATEGORY_MAP[editCategory],
      title: editQuestion.trim(),
      content: editAnswer.trim(),
      displayOrder: editTarget.displayOrder ?? 0,
    })
      .then((data) => {
        setFAQs((prev) => sortFaqs(prev.map((f) => f.faqId === data.faqId ? data : f)))
        closeEdit()
      })
      .catch(() => alert("수정에 실패했습니다."))
  }

  useEffect(() => {
    getFaqs()
      .then((data) => setFAQs(sortFaqs(data ?? [])))
      .catch(() => alert("FAQ를 불러오지 못했습니다."))
  }, [])

  const filteredFAQs = useMemo(() => {
    if (selectedCategory === "전체") return faqs
    return faqs.filter((f) => CATEGORY_LABEL[f.category] === selectedCategory)
  }, [faqs, selectedCategory])

  const handleAdd = (e) => {
    e.preventDefault()
    const question = newQuestion.trim()
    const answer = newAnswer.trim()
    if (!question || !answer) return
    createFaq({
      category: CATEGORY_MAP[newCategory],
      title: question,
      content: answer,
      displayOrder: 0,
    })
      .then((data) => {
        setFAQs((prev) => sortFaqs([data, ...prev]))
        setNewQuestion("")
        setNewAnswer("")
      })
      .catch(() => alert("FAQ 등록에 실패했습니다."))
  }

  const handleDelete = (id) => {
    if (!window.confirm("FAQ를 삭제하시겠습니까?")) return
    deleteFaq(id)
      .then(() => setFAQs((prev) => prev.filter((f) => f.faqId !== id)))
      .catch(() => alert("삭제에 실패했습니다."))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>FAQ 관리</h1>

        <div className={styles.section}>
          {/* 등록 폼 */}
          <form className={styles.addForm} onSubmit={handleAdd}>
            <div className={styles.addRow}>
              <select
                className={styles.addSelect}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                className={styles.addInput}
                placeholder="질문 입력"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className={styles.addRow}>
              <input
                type="text"
                className={`${styles.addInput} ${styles.addInputFull}`}
                placeholder="답변 입력"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <button type="submit" className={styles.addBtn}>
                <Plus size={15} />
                등록
              </button>
            </div>
          </form>

          {/* 카테고리 필터 */}
          <div className={styles.filterBar}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>카테고리</th>
                  <th>질문</th>
                  <th>답변</th>
                  <th>등록일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredFAQs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>등록된 FAQ가 없습니다.</td>
                  </tr>
                ) : (
                  filteredFAQs.map((faq) => (
                    <tr key={faq.faqId}>
                      <td className={styles.idCell}>{faq.faqId}</td>
                      <td>
                        <span className={styles.categoryBadge}>
                          {CATEGORY_LABEL[faq.category] ?? faq.category}
                        </span>
                      </td>
                      <td className={styles.questionCell}>{faq.title}</td>
                      <td className={styles.answerCell}>{faq.content}</td>
                      <td>{formatDate(faq.createdAt)}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEdit(faq)}
                          aria-label="수정"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(faq.faqId)}
                          aria-label="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* 수정 모달 */}
        {editTarget && (
          <div className={styles.modalOverlay} onClick={closeEdit}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>FAQ 수정</h2>
                <button className={styles.modalCloseBtn} onClick={closeEdit} aria-label="닫기">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEdit} className={styles.modalForm}>
                <div className={styles.addRow}>
                  <select
                    className={styles.addSelect}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className={styles.addInput}
                    placeholder="질문"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />
                </div>
                <div className={styles.addRow}>
                  <input
                    type="text"
                    className={`${styles.addInput} ${styles.addInputFull}`}
                    placeholder="답변"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                  />
                  <button type="submit" className={styles.addBtn}>저장</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
