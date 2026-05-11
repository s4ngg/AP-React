import { useState, useEffect } from "react"
import { Plus, Trash2, Pin, Pencil, X } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { formatDate } from "../../utils/format"
import styles from "./AdminNoticePage.module.css"
import { getNotices, createNotice, updateNotice, deleteNotice } from "../../api/noticeApi.js"


export default function AdminNoticePage() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    getNotices()
        .then((data) => setNotices(data ?? []))
        .catch(() => alert("공지사항을 불러오지 못했습니다."))
  }, [])

  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newIsPinned, setNewIsPinned] = useState(false)

  const [editTarget, setEditTarget] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editIsPinned, setEditIsPinned] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    createNotice({ title, content: newContent.trim(), fixed: newIsPinned })
        .then((data) => {
          setNotices((prev) => [data, ...prev])
          setNewTitle("")
          setNewContent("")
          setNewIsPinned(false)
        })
        .catch(() => alert("공지사항 등록에 실패했습니다."))
  }

  const openEdit = (notice) => {
    setEditTarget(notice)
    setEditTitle(notice.title)
    setEditContent(notice.content ?? "")
    setEditIsPinned(notice.fixed)
  }

  const closeEdit = () => setEditTarget(null)

  const handleEdit = (e) => {
    e.preventDefault()
    const title = editTitle.trim()
    if (!title) return
    updateNotice(editTarget.noticeId, { title, content: editContent.trim(), fixed: editIsPinned })
      .then((data) => {
        setNotices((prev) => prev.map((n) => n.noticeId === data.noticeId ? data : n))
        closeEdit()
      })
      .catch(() => alert("수정에 실패했습니다."))
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
            <div className={styles.addFields}>
              <input
                type="text"
                className={styles.addInput}
                placeholder="공지사항 제목 입력"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                className={styles.addTextarea}
                placeholder="공지사항 본문 입력"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className={styles.addActions}>
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
            </div>
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
                      <td>{formatDate(notice.createdAt)}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEdit(notice)}
                          aria-label="수정"
                        >
                          <Pencil size={14} />
                        </button>
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

        {/* 수정 모달 */}
        {editTarget && (
          <div className={styles.modalOverlay} onClick={closeEdit}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>공지사항 수정</h2>
                <button className={styles.modalCloseBtn} onClick={closeEdit} aria-label="닫기">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEdit} className={styles.modalForm}>
                <div className={styles.addFields}>
                  <input
                    type="text"
                    className={styles.addInput}
                    placeholder="공지사항 제목"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className={styles.addTextarea}
                    placeholder="공지사항 본문 입력"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <div className={styles.addActions}>
                  <label className={styles.pinLabel}>
                    <input
                      type="checkbox"
                      checked={editIsPinned}
                      onChange={(e) => setEditIsPinned(e.target.checked)}
                    />
                    상단 고정
                  </label>
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
