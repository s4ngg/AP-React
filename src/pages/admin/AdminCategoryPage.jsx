import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminCategoryPage.module.css"

const TABS = ["대분류", "소분류"]

const mockParentCategories = [
  { id: 1, name: "뷰티", createdAt: "2025-01-01" },
  { id: 2, name: "패션", createdAt: "2025-01-01" },
  { id: 3, name: "리빙", createdAt: "2025-01-01" },
]

const mockChildCategories = [
  { id: 1, parentName: "뷰티", name: "스킨케어", createdAt: "2025-01-05" },
  { id: 2, parentName: "뷰티", name: "메이크업", createdAt: "2025-01-05" },
  { id: 3, parentName: "뷰티", name: "향수", createdAt: "2025-01-06" },
  { id: 4, parentName: "패션", name: "상의", createdAt: "2025-01-05" },
  { id: 5, parentName: "패션", name: "하의", createdAt: "2025-01-05" },
  { id: 6, parentName: "패션", name: "신발", createdAt: "2025-01-06" },
  { id: 7, parentName: "리빙", name: "침구", createdAt: "2025-01-05" },
  { id: 8, parentName: "리빙", name: "주방", createdAt: "2025-01-06" },
]

export default function AdminCategoryPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [parentCategories, setParentCategories] = useState(mockParentCategories)
  const [childCategories, setChildCategories] = useState(mockChildCategories)
  const [newParentName, setNewParentName] = useState("")
  const [newChildName, setNewChildName] = useState("")
  const [newChildParent, setNewChildParent] = useState(mockParentCategories[0].name)

  const handleParentAdd = (e) => {
    e.preventDefault()
    const name = newParentName.trim()
    if (!name) return
    const newItem = { id: Date.now(), name, createdAt: new Date().toISOString().slice(0, 10) }
    setParentCategories((prev) => [...prev, newItem])
    setNewParentName("")
  }

  const handleParentDelete = (id, name) => {
    if (!window.confirm(`"${name}" 대분류를 삭제하시겠습니까?\n해당 대분류의 소분류도 함께 삭제됩니다.`)) return
    setParentCategories((prev) => prev.filter((c) => c.id !== id))
    setChildCategories((prev) => prev.filter((c) => c.parentName !== name))
  }

  const handleChildAdd = (e) => {
    e.preventDefault()
    const name = newChildName.trim()
    if (!name) return
    const newItem = { id: Date.now(), parentName: newChildParent, name, createdAt: new Date().toISOString().slice(0, 10) }
    setChildCategories((prev) => [...prev, newItem])
    setNewChildName("")
  }

  const handleChildDelete = (id, name) => {
    if (!window.confirm(`"${name}" 소분류를 삭제하시겠습니까?`)) return
    setChildCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>카테고리 관리</h1>

        {/* 탭 */}
        <div className={styles.tabList}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === index ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.section}>

          {/* ── 대분류 탭 ── */}
          {activeTab === 0 && (
            <>
              <form className={styles.addForm} onSubmit={handleParentAdd}>
                <input
                  type="text"
                  className={styles.addInput}
                  placeholder="대분류명 입력"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                />
                <button type="submit" className={styles.addBtn}>
                  <Plus size={15} />
                  추가
                </button>
              </form>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>대분류명</th>
                      <th>등록일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parentCategories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={styles.emptyRow}>등록된 대분류가 없습니다.</td>
                      </tr>
                    ) : (
                      parentCategories.map((cat) => (
                        <tr key={cat.id}>
                          <td className={styles.idCell}>{cat.id}</td>
                          <td className={styles.nameCell}>{cat.name}</td>
                          <td>{cat.createdAt}</td>
                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleParentDelete(cat.id, cat.name)}
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
            </>
          )}

          {/* ── 소분류 탭 ── */}
          {activeTab === 1 && (
            <>
              <form className={styles.addForm} onSubmit={handleChildAdd}>
                <select
                  className={styles.addSelect}
                  value={newChildParent}
                  onChange={(e) => setNewChildParent(e.target.value)}
                >
                  {parentCategories.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className={styles.addInput}
                  placeholder="소분류명 입력"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                />
                <button type="submit" className={styles.addBtn}>
                  <Plus size={15} />
                  추가
                </button>
              </form>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>대분류</th>
                      <th>소분류명</th>
                      <th>등록일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyRow}>등록된 소분류가 없습니다.</td>
                      </tr>
                    ) : (
                      childCategories.map((cat) => (
                        <tr key={cat.id}>
                          <td className={styles.idCell}>{cat.id}</td>
                          <td>{cat.parentName}</td>
                          <td className={styles.nameCell}>{cat.name}</td>
                          <td>{cat.createdAt}</td>
                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleChildDelete(cat.id, cat.name)}
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
