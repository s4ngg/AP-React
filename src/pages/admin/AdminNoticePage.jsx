import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminNoticePage.module.css"

const mockNotices = [
  { id: 1, title: "AllPick 서비스 오픈 안내", author: "관리자", createdAt: "2026-04-01", isPinned: true },
  { id: 2, title: "개인정보 처리방침 개정 안내", author: "관리자", createdAt: "2026-04-05", isPinned: true },
  { id: 3, title: "4월 프로모션 이벤트 안내", author: "관리자", createdAt: "2026-04-10", isPinned: false },
  { id: 4, title: "배송 지연 안내 (택배사 파업)", author: "관리자", createdAt: "2026-04-14", isPinned: false },
  { id: 5, title: "시스템 점검 안내 (4/20 새벽 2시)", author: "관리자", createdAt: "2026-04-17", isPinned: false },
]

export default function AdminNoticePage() {
  const [notices, setNotices] = useState(mockNotices)

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>공지사항 관리</h1>
          <button className={styles.addBtn}>
            <Plus size={16} />
            공지 작성
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>고정</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {notices.length === 0 ? (
                  <tr><td colSpan={6} className={styles.emptyRow}>등록된 공지사항이 없습니다.</td></tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice.id}>
                      <td className={styles.idCell}>{notice.id}</td>
                      <td className={styles.titleCell}>
                        {notice.isPinned && <span className={styles.pinnedBadge}>고정</span>}
                        {notice.title}
                      </td>
                      <td>{notice.author}</td>
                      <td>{notice.createdAt}</td>
                      <td>
                        <span className={notice.isPinned ? styles.pinnedOn : styles.pinnedOff}>
                          {notice.isPinned ? "고정" : "-"}
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <button className={styles.editBtn}>
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(notice.id)}
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
