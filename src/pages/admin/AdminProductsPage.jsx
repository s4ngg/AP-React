import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminProductsPage.module.css"

// 임시 상품 데이터 (추후 API 연동 예정)
const initialProducts = [
  { id: 1, name: "[에스티로더] 갈색병 세럼 50ml", category: "뷰티", price: 89000, stock: 99, status: "판매중", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=60&h=60&fit=crop" },
  { id: 2, name: "[나이키] 에어맥스 97 화이트", category: "패션", price: 179000, stock: 30, status: "판매중", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" },
  { id: 3, name: "[설화수] 윤조에센스 60ml", category: "뷰티", price: 128000, stock: 50, status: "판매중", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=60&h=60&fit=crop" },
  { id: 4, name: "[유니클로] 린넨 블렌드 셔츠", category: "패션", price: 39900, stock: 0, status: "품절", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=60&h=60&fit=crop" },
  { id: 5, name: "[무인양품] 폴리에스터 이불커버", category: "리빙", price: 59000, stock: 15, status: "판매중", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=60&h=60&fit=crop" },
  { id: 6, name: "[헤라] 블랙쿠션 파운데이션", category: "뷰티", price: 55000, stock: 80, status: "판매중", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=60&h=60&fit=crop" },
]

const categories = ["뷰티", "패션", "리빙"]
const FILTER_CATEGORIES = ["전체", ...categories]
const EMPTY_FORM = { name: "", category: "뷰티", price: "", stock: "" }

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return products.filter((p) => {
      const matchCategory = selectedCategory === "전체" || p.category === selectedCategory
      const matchSearch = !term || p.name.toLowerCase().includes(term)
      return matchCategory && matchSearch
    })
  }, [products, searchTerm, selectedCategory])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price || !formData.stock) {
      alert("모든 항목을 입력해주세요.")
      return
    }
    setIsSubmitting(true)
    // FakeAPI - 실제 API 연동 전 500ms 시뮬레이션
    setTimeout(() => {
      const price = Number(formData.price)
      const stock = Number(formData.stock)
      const status = stock === 0 ? "품절" : "판매중"

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, name: formData.name, category: formData.category, price, stock, status }
              : p
          )
        )
      } else {
        const newProduct = {
          id: Date.now(),
          name: formData.name,
          category: formData.category,
          price,
          stock,
          status,
          image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=60&h=60&fit=crop",
        }
        setProducts((prev) => [newProduct, ...prev])
      }
      setIsSubmitting(false)
      handleCloseModal()
    }, 500)
  }

  const handleDelete = (productId, productName) => {
    if (!window.confirm(`"${productName}"을(를) 삭제하시겠습니까?`)) return
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>상품 관리</h1>

        <div className={styles.section}>
          {/* 카테고리 필터 */}
          <div className={styles.filterBar}>
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 툴바 */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="상품명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.createBtn} onClick={handleOpenCreate}>
              <Plus size={16} />
              상품 등록
            </button>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>상품</th>
                  <th>카테고리</th>
                  <th>판매가</th>
                  <th>재고</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productCell}>
                          <img src={product.image} alt={product.name} className={styles.productThumb} />
                          <span className={styles.productName}>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.price.toLocaleString()}원</td>
                      <td>{product.stock}개</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            product.status === "판매중" ? styles.statusOnSale : styles.statusSoldOut
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleOpenEdit(product)}
                            aria-label="수정"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(product.id, product.name)}
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
        </div>

        {/* 등록 / 수정 모달 */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingProduct ? "상품 수정" : "상품 등록"}
                </h2>
                <button className={styles.modalCloseBtn} onClick={handleCloseModal} aria-label="닫기">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>상품명</label>
                  <input
                    type="text"
                    name="name"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="상품명을 입력하세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>카테고리</label>
                  <select
                    name="category"
                    className={styles.formInput}
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>판매가 (원)</label>
                  <input
                    type="number"
                    name="price"
                    className={styles.formInput}
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>재고 수량</label>
                  <input
                    type="number"
                    name="stock"
                    className={styles.formInput}
                    value={formData.stock}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={handleCloseModal}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "저장 중..." : editingProduct ? "수정하기" : "등록하기"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
