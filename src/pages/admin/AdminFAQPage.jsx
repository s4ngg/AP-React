import { useState, useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminFAQPage.module.css"

const CATEGORIES = ["전체", "주문/결제", "배송", "교환/반품", "회원"]
const FAQ_CATEGORIES = CATEGORIES.slice(1)

// 임시 FAQ 데이터 (추후 API 연동 예정)
const mockFAQs = [
  { id: 1, category: "주문/결제", question: "주문 취소는 어떻게 하나요?", answer: "마이페이지 > 주문 내역에서 취소 신청이 가능합니다.", createdAt: "2026-04-01" },
  { id: 2, category: "주문/결제", question: "결제 수단은 어떤 것이 있나요?", answer: "신용카드, 체크카드, 카카오페이, 네이버페이 등을 지원합니다.", createdAt: "2026-04-01" },
  { id: 3, category: "배송", question: "배송 기간은 얼마나 걸리나요?", answer: "평균 2-3일 소요되며, 도서/산간 지역은 추가 1-2일이 소요됩니다.", createdAt: "2026-04-02" },
  { id: 4, category: "교환/반품", question: "반품 신청 기간은 언제까지인가요?", answer: "상품 수령 후 7일 이내에 반품 신청이 가능합니다.", createdAt: "2026-04-03" },
  { id: 5, category: "회원", question: "비밀번호를 잊어버렸어요.", answer: "로그인 페이지에서 '비밀번호 찾기'를 이용해주세요.", createdAt: "2026-04-05" },
]

export default function AdminFAQPage() {
  const [faqs, setFAQs] = useState(mockFAQs)
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newCategory, setNewCategory] = useState(FAQ_CATEGORIES[0])

  const filteredFAQs = useMemo(() => {
    if (selectedCategory === "전체") return faqs
    return faqs.filter((f) => f.category === selectedCategory)
  }, [faqs, selectedCategory])

  const handleAdd = (e) => {
    e.preventDefault()
    const question = newQuestion.trim()
    const answer = newAnswer.trim()
    if (!question || !answer) return
    const newItem = {
      id: Date.now(),
      category: newCategory,
      question,
      answer,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setFAQs((prev) => [newItem, ...prev])
    setNewQuestion("")
    setNewAnswer("")
  }

  const handleDelete = (id) => {
    if (!window.confirm("FAQ를 삭제하시겠습니까?")) return
    setFAQs((prev) => prev.filter((f) => f.id !== id))
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
                    <tr key={faq.id}>
                      <td className={styles.idCell}>{faq.id}</td>
                      <td>
                        <span className={styles.categoryBadge}>{faq.category}</span>
                      </td>
                      <td className={styles.questionCell}>{faq.question}</td>
                      <td className={styles.answerCell}>{faq.answer}</td>
                      <td>{faq.createdAt}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(faq.id)}
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
      </main>
    </div>
  )
}
