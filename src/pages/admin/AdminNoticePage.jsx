import { useState } from "react"
import { Plus, Trash2, Pin } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminNoticePage.module.css"

// 임시 공지사항 데이터 (추후 API 연동 예정)
const mockNotices = [
  { id: 1, title: "AllPick 서비스 오픈 안내", isPinned: true, createdAt: "2026-04-01" },
  { id: 2, title: "개인정보처리방침 개정 안내", isPinned: true, createdAt: "2026-04-05" },
  { id: 3, title: "2026년 5월 정기점검 안내", isPinned: false, createdAt: "2026-04-10" },
  { id: 4, title: "배송 지연 안내 (택배사 파업)", isPinned: false, createdAt: "2026-04-14" },
]

export default function AdminNoticePage() {
  const [notices, setNotices] = useState(mockNotices)
  const [newTitle, setNewTitle] = useState("")
  const [newIsPinned, setNewIsPinned] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    const newItem = {
      id: Date.now(),
      title,
      isPinned: newIsPinned,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setNotices((prev) => [newItem, ...prev])
    setNewTitle("")
    setNewIsPinned(false)
  }

  const handleDelete = (id, title) => {
    if (!window.confirm(`"${title}" 공지를 삭제하시겠습니까?`)) return
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>공지사항 관리</h1>

        <div className={styles.section}>
          {/* 등록 폼 */}
          <form className={styles.addForm} onSubmit={handleAdd}>
            <input
              type="text"
              className={styles.addInput}
              placeholder="공지사항 제목 입력"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <label className={styles.pinLabel}>
              <input
                type="checkbox"
                checked={newIsPinned}
                onChange={(e) => setNewIsPinned(e.target.checked)}
              />
              상단 고정
            </label>
            <button type="submit" className={styles.addBtn}>
              <Plus size={15} />
              등록
            </button>
          </form>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>고정</th>
                  <th>등록일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>등록된 공지사항이 없습니다.</td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice.id}>
                      <td className={styles.idCell}>{notice.id}</td>
                      <td>
                        <span className={styles.titleCell}>
                          {notice.isPinned && (
                            <span className={styles.pinnedBadge}>
                              <Pin size={11} />
                              고정
                            </span>
                          )}
                          {notice.title}
                        </span>
                      </td>
                      <td>
                        {notice.isPinned && (
                          <span className={styles.pinnedMark}>Y</span>
                        )}
                      </td>
                      <td>{notice.createdAt}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(notice.id, notice.title)}
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
