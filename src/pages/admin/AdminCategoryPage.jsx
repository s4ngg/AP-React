import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminCategoryPage.module.css"

const mockParentCategories = [
  { id: 1, name: "뷰티", description: "화장품, 스킨케어 등" },
  { id: 2, name: "패션", description: "의류, 신발, 가방 등" },
  { id: 3, name: "리빙", description: "가구, 인테리어, 주방 등" },
]

const mockChildCategories = [
  { id: 1, parentId: 1, parentName: "뷰티", name: "스킨케어" },
  { id: 2, parentId: 1, parentName: "뷰티", name: "립" },
  { id: 3, parentId: 1, parentName: "뷰티", name: "베이스" },
  { id: 4, parentId: 2, parentName: "패션", name: "상의" },
  { id: 5, parentId: 2, parentName: "패션", name: "하의" },
  { id: 6, parentId: 2, parentName: "패션", name: "신발" },
  { id: 7, parentId: 3, parentName: "리빙", name: "가구" },
  { id: 8, parentId: 3, parentName: "리빙", name: "주방용품" },
]

const TABS = ["대분류", "소분류"]

export default function AdminCategoryPage() {
  const [activeTab, setActiveTab] = useState("대분류")
  const [parentCategories, setParentCategories] = useState(mockParentCategories)
  const [childCategories, setChildCategories] = useState(mockChildCategories)

  const handleParentDelete = (id) => {
    setParentCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const handleChildDelete = (id) => {
    setChildCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>카테고리 관리</h1>
          <button className={styles.addBtn}>
            <Plus size={16} />
            {activeTab === "대분류" ? "대분류 추가" : "소분류 추가"}
          </button>
        </div>

        <div className={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.section}>
          {activeTab === "대분류" && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>카테고리명</th>
                    <th>설명</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {parentCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td className={styles.idCell}>{cat.id}</td>
                      <td className={styles.nameCell}>{cat.name}</td>
                      <td>{cat.description}</td>
                      <td className={styles.actionCell}>
                        <button className={styles.editBtn}>
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleParentDelete(cat.id)}
                        >
                          <Trash2 size={13} />
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "소분류" && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>대분류</th>
                    <th>소분류명</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {childCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td className={styles.idCell}>{cat.id}</td>
                      <td>
                        <span className={styles.parentBadge}>{cat.parentName}</span>
                      </td>
                      <td className={styles.nameCell}>{cat.name}</td>
                      <td className={styles.actionCell}>
                        <button className={styles.editBtn}>
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleChildDelete(cat.id)}
                        >
                          <Trash2 size={13} />
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
