import { useState, useEffect } from "react"
import { Plus, Trash2, Pin } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminNoticePage.module.css"
import { getNotices, createNotice, deleteNotice} from "../../api/noticeApi.js"


export default function AdminNoticePage() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    getNotices()
        .then((data) => setNotices(data ?? []))
        .catch(() => alert("공지사항을 불러오지 못했습니다."))
  }, [])

  const [newTitle, setNewTitle] = useState("")
  const [newIsPinned, setNewIsPinned] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    createNotice({ title, content: "", fixed: newIsPinned })
        .then((data) => {
          setNotices((prev) => [data, ...prev])
          setNewTitle("")
          setNewIsPinned(false)
        })
        .catch(() => alert("공지사항 등록에 실패했습니다."))
  }

  const handleDelete = (id, title) => {
    if (!window.confirm(`"${title}" 공지를 삭제하시겠습니까?`)) return
    deleteNotice(id)
      .then(() => setNotices((prev) => prev.filter((n) => n.noticeId !== id)))
      .catch(() => alert("삭제에 실패했습니다."))
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
                    <tr key={notice.noticeId}>
                      <td className={styles.idCell}>{notice.noticeId}</td>
                      <td>
                        <span className={styles.titleCell}>
                          {notice.fixed && (
                            <span className={styles.pinnedBadge}>
                              <Pin size={11} />
                              고정
                            </span>
                          )}
                          {notice.title}
                        </span>
                      </td>
                      <td>
                        {notice.fixed && (
                          <span className={styles.pinnedMark}>Y</span>
                        )}
                      </td>
                      <td>{notice.createdAt?.slice(0, 10)}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(notice.noticeId, notice.title)}
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
