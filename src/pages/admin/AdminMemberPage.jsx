import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminMemberPage.module.css"

// 임시 회원 데이터 (추후 API 연동 예정)
const mockMembers = [
  { id: 1, name: "김민수", email: "minsu@example.com", joinedAt: "2025-01-15", status: "활성" },
  { id: 2, name: "이영희", email: "younghee@example.com", joinedAt: "2025-02-03", status: "활성" },
  { id: 3, name: "박지성", email: "jisung@example.com", joinedAt: "2025-02-20", status: "정지" },
  { id: 4, name: "최수영", email: "suyoung@example.com", joinedAt: "2025-03-11", status: "활성" },
  { id: 5, name: "정해인", email: "haein@example.com", joinedAt: "2025-03-28", status: "활성" },
  { id: 6, name: "손예진", email: "yejin@example.com", joinedAt: "2025-04-02", status: "정지" },
  { id: 7, name: "현빈", email: "hyunbin@example.com", joinedAt: "2025-04-05", status: "활성" },
  { id: 8, name: "유재석", email: "jaesuk@example.com", joinedAt: "2025-04-08", status: "활성" },
]

export default function AdminMemberPage() {
  const [members, setMembers] = useState(mockMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return members
    return members.filter(
      (m) => m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term)
    )
  }, [members, searchTerm])

  const handleStatusToggle = (memberId) => {
    setIsLoading(true)
    // FakeAPI - 실제 API 연동 전 500ms 시뮬레이션
    setTimeout(() => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, status: m.status === "활성" ? "정지" : "활성" }
            : m
        )
      )
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>회원 관리</h1>

        <div className={styles.section}>
          {/* 검색 */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="이름 또는 이메일로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className={styles.totalCount}>총 {filteredMembers.length}명</span>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>가입일</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td className={styles.idCell}>{member.id}</td>
                      <td className={styles.nameCell}>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.joinedAt}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            member.status === "활성" ? styles.statusActive : styles.statusSuspended
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`${styles.toggleBtn} ${
                            member.status === "활성" ? styles.toggleBtnDanger : styles.toggleBtnSuccess
                          }`}
                          onClick={() => handleStatusToggle(member.id)}
                          disabled={isLoading}
                        >
                          {member.status === "활성" ? "정지" : "활성화"}
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