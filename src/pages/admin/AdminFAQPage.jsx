import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminFAQPage.module.css"

const mockFAQs = [
  { id: 1, category: "주문/결제", question: "주문 취소는 어떻게 하나요?", createdAt: "2026-03-01" },
  { id: 2, category: "배송", question: "배송 조회는 어디서 하나요?", createdAt: "2026-03-05" },
  { id: 3, category: "교환/반품", question: "교환/반품 신청 기간은 언제까지인가요?", createdAt: "2026-03-10" },
  { id: 4, category: "회원", question: "회원 탈퇴 후 재가입이 가능한가요?", createdAt: "2026-03-15" },
  { id: 5, category: "주문/결제", question: "결제 수단 변경이 가능한가요?", createdAt: "2026-03-20" },
]

const CATEGORIES = ["전체", "주문/결제", "배송", "교환/반품", "회원"]

export default function AdminFAQPage() {
  const [faqs, setFAQs] = useState(mockFAQs)
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const filteredFAQs = selectedCategory === "전체"
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory)

  const handleDelete = (id) => {
    setFAQs((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>FAQ 관리</h1>
          <button className={styles.addBtn}>
            <Plus size={16} />
            FAQ 추가
          </button>
        </div>

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

        <div className={styles.section}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>카테고리</th>
                  <th>질문</th>
                  <th>등록일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredFAQs.length === 0 ? (
                  <tr><td colSpan={5} className={styles.emptyRow}>등록된 FAQ가 없습니다.</td></tr>
                ) : (
                  filteredFAQs.map((faq) => (
                    <tr key={faq.id}>
                      <td className={styles.idCell}>{faq.id}</td>
                      <td>
                        <span className={styles.categoryBadge}>{faq.category}</span>
                      </td>
                      <td className={styles.questionCell}>{faq.question}</td>
                      <td>{faq.createdAt}</td>
                      <td className={styles.actionCell}>
                        <button className={styles.editBtn}>
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(faq.id)}
                        >
                          <Trash2 size={13} />
                          삭제
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
