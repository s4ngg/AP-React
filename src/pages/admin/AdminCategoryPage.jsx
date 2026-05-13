import { useCallback, useEffect, useMemo, useState } from "react"
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import {
  createAdminChildCategory,
  createAdminParentCategory,
  deleteAdminChildCategory,
  deleteAdminParentCategory,
  getAdminChildCategories,
  getAdminParentCategories,
  updateAdminChildCategory,
  updateAdminParentCategory,
} from "../../api/adminApi"
import styles from "./AdminCategoryPage.module.css"

const TABS = ["대분류", "소분류"]

const BASE_FORM = {
  categoryName: "",
  slug: "",
  isActive: "1",
}

const getNextSortOrder = (categories) =>
  String(Math.max(0, ...categories.map((category) => Number(category.sortOrder) || 0)) + 1)

const createEmptyForm = (categories = []) => ({
  ...BASE_FORM,
  sortOrder: getNextSortOrder(categories),
})

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "처리 중 오류가 발생했습니다."

const isInvalidSortOrder = (sortOrder) => {
  const order = Number(sortOrder)
  return !Number.isInteger(order) || order < 1
}

const hasDuplicateSortOrder = (categories, sortOrder, editingId, idKey) =>
  categories.some((category) =>
    Number(category.sortOrder) === Number(sortOrder) &&
    String(category[idKey]) !== String(editingId)
  )

const buildPayload = (form) => ({
  categoryName: form.categoryName.trim(),
  slug: form.slug.trim(),
  sortOrder: Number(form.sortOrder),
  isActive: Number(form.isActive),
})

export default function AdminCategoryPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [parentCategories, setParentCategories] = useState([])
  const [childCategories, setChildCategories] = useState([])
  const [selectedParentId, setSelectedParentId] = useState("")
  const [parentForm, setParentForm] = useState(() => createEmptyForm())
  const [childForm, setChildForm] = useState(() => createEmptyForm())
  const [editingParentId, setEditingParentId] = useState(null)
  const [editingChildId, setEditingChildId] = useState(null)
  const [isParentLoading, setIsParentLoading] = useState(true)
  const [isChildLoading, setIsChildLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedParent = useMemo(
    () => parentCategories.find((category) => String(category.parentCategoryId) === String(selectedParentId)),
    [parentCategories, selectedParentId]
  )

  const loadParents = useCallback(async () => {
    setIsParentLoading(true)
    try {
      const data = await getAdminParentCategories()
      const parents = data ?? []
      setParentCategories(parents)
      setParentForm(createEmptyForm(parents))
      setSelectedParentId((prev) => {
        if (prev && parents.some((category) => String(category.parentCategoryId) === String(prev))) {
          return prev
        }
        return parents[0]?.parentCategoryId ? String(parents[0].parentCategoryId) : ""
      })
      return parents
    } catch (error) {
      alert(getErrorMessage(error))
      return []
    } finally {
      setIsParentLoading(false)
    }
  }, [])

  const loadChildren = useCallback(async (parentCategoryId) => {
    if (!parentCategoryId) {
      setChildCategories([])
      setChildForm(createEmptyForm())
      return
    }

    setIsChildLoading(true)
    try {
      const data = await getAdminChildCategories(parentCategoryId)
      const children = data ?? []
      setChildCategories(children)
      setChildForm(createEmptyForm(children))
      return children
    } catch (error) {
      alert(getErrorMessage(error))
      return []
    } finally {
      setIsChildLoading(false)
    }
  }, [])

  useEffect(() => {
    loadParents()
  }, [loadParents])

  useEffect(() => {
    if (activeTab === 1) {
      loadChildren(selectedParentId)
    }
  }, [activeTab, selectedParentId, loadChildren])

  const handleParentFormChange = (event) => {
    const { name, value } = event.target
    setParentForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChildFormChange = (event) => {
    const { name, value } = event.target
    setChildForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleParentSubmit = async (event) => {
    event.preventDefault()
    if (!parentForm.categoryName.trim() || !parentForm.slug.trim()) {
      alert("카테고리명과 slug를 입력해주세요.")
      return
    }
    if (isInvalidSortOrder(parentForm.sortOrder)) {
      alert("정렬 번호는 1 이상의 숫자로 입력해주세요.")
      return
    }
    if (hasDuplicateSortOrder(parentCategories, parentForm.sortOrder, editingParentId, "parentCategoryId")) {
      alert("이미 사용 중인 정렬 번호입니다.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingParentId) {
        await updateAdminParentCategory(editingParentId, buildPayload(parentForm))
      } else {
        await createAdminParentCategory(buildPayload(parentForm))
      }
      setEditingParentId(null)
      const parents = await loadParents()
      setParentForm(createEmptyForm(parents))
    } catch (error) {
      alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChildSubmit = async (event) => {
    event.preventDefault()
    if (!selectedParentId) {
      alert("대분류를 먼저 선택해주세요.")
      return
    }
    if (!childForm.categoryName.trim() || !childForm.slug.trim()) {
      alert("카테고리명과 slug를 입력해주세요.")
      return
    }
    if (isInvalidSortOrder(childForm.sortOrder)) {
      alert("정렬 번호는 1 이상의 숫자로 입력해주세요.")
      return
    }
    if (hasDuplicateSortOrder(childCategories, childForm.sortOrder, editingChildId, "childCategoryId")) {
      alert("이미 사용 중인 정렬 번호입니다.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingChildId) {
        await updateAdminChildCategory(editingChildId, buildPayload(childForm))
      } else {
        await createAdminChildCategory(selectedParentId, buildPayload(childForm))
      }
      setEditingChildId(null)
      const children = await loadChildren(selectedParentId)
      setChildForm(createEmptyForm(children))
    } catch (error) {
      alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditParent = (category) => {
    setEditingParentId(category.parentCategoryId)
    setParentForm({
      categoryName: category.categoryName ?? "",
      slug: category.slug ?? "",
      sortOrder: String(category.sortOrder ?? 1),
      isActive: String(category.isActive ?? 1),
    })
  }

  const handleEditChild = (category) => {
    setEditingChildId(category.childCategoryId)
    setChildForm({
      categoryName: category.categoryName ?? "",
      slug: category.slug ?? "",
      sortOrder: String(category.sortOrder ?? 1),
      isActive: String(category.isActive ?? 1),
    })
  }

  const handleResetParentForm = () => {
    setParentForm(createEmptyForm(parentCategories))
    setEditingParentId(null)
  }

  const handleResetChildForm = () => {
    setChildForm(createEmptyForm(childCategories))
    setEditingChildId(null)
  }

  const handleDeleteParent = async (category) => {
    if (!window.confirm(`"${category.categoryName}" 대분류를 삭제하시겠습니까?`)) return

    try {
      await deleteAdminParentCategory(category.parentCategoryId)
      if (String(selectedParentId) === String(category.parentCategoryId)) {
        setChildCategories([])
        setSelectedParentId("")
      }
      await loadParents()
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  const handleDeleteChild = async (category) => {
    if (!window.confirm(`"${category.categoryName}" 소분류를 삭제하시겠습니까?`)) return

    try {
      await deleteAdminChildCategory(category.childCategoryId)
      await loadChildren(selectedParentId)
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>카테고리 관리</h1>

        <div className={styles.tabList}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabBtn} ${activeTab === index ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className={styles.section}>
          {activeTab === 0 && (
            <>
              <form className={styles.addForm} onSubmit={handleParentSubmit}>
                <input
                  type="text"
                  name="categoryName"
                  className={styles.addInput}
                  placeholder="대분류명"
                  value={parentForm.categoryName}
                  onChange={handleParentFormChange}
                />
                <input
                  type="text"
                  name="slug"
                  className={styles.addInput}
                  placeholder="slug"
                  value={parentForm.slug}
                  onChange={handleParentFormChange}
                />
                <input
                  type="number"
                  name="sortOrder"
                  className={styles.sortInput}
                  value={parentForm.sortOrder}
                  onChange={handleParentFormChange}
                  min="1"
                  aria-label="정렬 순서"
                />
                <select
                  name="isActive"
                  className={styles.addSelect}
                  value={parentForm.isActive}
                  onChange={handleParentFormChange}
                >
                  <option value="1">노출</option>
                  <option value="0">숨김</option>
                </select>
                <button type="submit" className={styles.addBtn} disabled={isSubmitting}>
                  <Plus size={15} />
                  {editingParentId ? "수정" : "추가"}
                </button>
                {editingParentId && (
                  <button type="button" className={styles.resetBtn} onClick={handleResetParentForm}>
                    <RotateCcw size={15} />
                    취소
                  </button>
                )}
              </form>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>대분류명</th>
                      <th>slug</th>
                      <th>정렬</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isParentLoading ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyRow}>불러오는 중...</td>
                      </tr>
                    ) : parentCategories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyRow}>등록된 대분류가 없습니다.</td>
                      </tr>
                    ) : (
                      parentCategories.map((category) => (
                        <tr key={category.parentCategoryId}>
                          <td className={styles.idCell}>{category.parentCategoryId}</td>
                          <td className={styles.nameCell}>{category.categoryName}</td>
                          <td>{category.slug}</td>
                          <td>{category.sortOrder}</td>
                          <td>
                            <span className={category.isActive === 1 ? styles.activeBadge : styles.hiddenBadge}>
                              {category.isActive === 1 ? "노출" : "숨김"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => handleEditParent(category)}
                                aria-label="수정"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteParent(category)}
                                aria-label="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div className={styles.parentSelector}>
                <label className={styles.selectorLabel} htmlFor="parentCategoryId">대분류</label>
                <select
                  id="parentCategoryId"
                  className={styles.addSelect}
                  value={selectedParentId}
                  onChange={(event) => {
                    setSelectedParentId(event.target.value)
                    handleResetChildForm()
                  }}
                >
                  {parentCategories.map((category) => (
                    <option key={category.parentCategoryId} value={category.parentCategoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <form className={styles.addForm} onSubmit={handleChildSubmit}>
                <input
                  type="text"
                  name="categoryName"
                  className={styles.addInput}
                  placeholder="소분류명"
                  value={childForm.categoryName}
                  onChange={handleChildFormChange}
                />
                <input
                  type="text"
                  name="slug"
                  className={styles.addInput}
                  placeholder="slug"
                  value={childForm.slug}
                  onChange={handleChildFormChange}
                />
                <input
                  type="number"
                  name="sortOrder"
                  className={styles.sortInput}
                  value={childForm.sortOrder}
                  onChange={handleChildFormChange}
                  min="1"
                  aria-label="정렬 순서"
                />
                <select
                  name="isActive"
                  className={styles.addSelect}
                  value={childForm.isActive}
                  onChange={handleChildFormChange}
                >
                  <option value="1">노출</option>
                  <option value="0">숨김</option>
                </select>
                <button type="submit" className={styles.addBtn} disabled={isSubmitting || !selectedParentId}>
                  <Plus size={15} />
                  {editingChildId ? "수정" : "추가"}
                </button>
                {editingChildId && (
                  <button type="button" className={styles.resetBtn} onClick={handleResetChildForm}>
                    <RotateCcw size={15} />
                    취소
                  </button>
                )}
              </form>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>대분류</th>
                      <th>소분류명</th>
                      <th>slug</th>
                      <th>정렬</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isChildLoading ? (
                      <tr>
                        <td colSpan={7} className={styles.emptyRow}>불러오는 중...</td>
                      </tr>
                    ) : !selectedParentId ? (
                      <tr>
                        <td colSpan={7} className={styles.emptyRow}>대분류를 먼저 등록해주세요.</td>
                      </tr>
                    ) : childCategories.length === 0 ? (
                      <tr>
                        <td colSpan={7} className={styles.emptyRow}>등록된 소분류가 없습니다.</td>
                      </tr>
                    ) : (
                      childCategories.map((category) => (
                        <tr key={category.childCategoryId}>
                          <td className={styles.idCell}>{category.childCategoryId}</td>
                          <td>{selectedParent?.categoryName ?? "-"}</td>
                          <td className={styles.nameCell}>{category.categoryName}</td>
                          <td>{category.slug}</td>
                          <td>{category.sortOrder}</td>
                          <td>
                            <span className={category.isActive === 1 ? styles.activeBadge : styles.hiddenBadge}>
                              {category.isActive === 1 ? "노출" : "숨김"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => handleEditChild(category)}
                                aria-label="수정"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteChild(category)}
                                aria-label="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
