import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle, Search, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import {
  approveAdminProduct,
  getAdminProducts,
  rejectAdminProduct,
} from "../../api/adminApi"
import styles from "./AdminProductsPage.module.css"

const ALL_CATEGORY = "전체"

const statusLabel = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  HIDDEN: "숨김",
  DELETED: "삭제",
}

const approvalStatusLabel = {
  PENDING: "승인대기",
  APPROVED: "승인",
  REJECTED: "거절",
}

const approvalStatusClass = {
  PENDING: "statusPending",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
}

const formatPrice = (price) => Number(price ?? 0).toLocaleString()

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY)
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    getAdminProducts()
      .then((data) => setProducts(data ?? []))
      .catch(() => alert("상품 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 0)
    return () => clearTimeout(timeoutId)
  }, [fetchProducts])

  const filterCategories = useMemo(() => {
    const categories = products
      .map((product) => product.parentCategoryName)
      .filter(Boolean)
    return [ALL_CATEGORY, ...new Set(categories)]
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      const name = product.productName ?? ""
      const brand = product.brand ?? ""
      const category = product.parentCategoryName ?? ""
      const matchesSearch =
        !term ||
        name.toLowerCase().includes(term) ||
        brand.toLowerCase().includes(term)
      const matchesCategory =
        selectedCategory === ALL_CATEGORY || category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleApprove = (productId) => {
    if (!window.confirm("상품을 승인하시겠습니까?")) return
    setProcessingId(productId)
    approveAdminProduct(productId)
      .then(fetchProducts)
      .catch(() => alert("상품 승인에 실패했습니다."))
      .finally(() => setProcessingId(null))
  }

  const handleReject = (productId) => {
    const rejectReason = window.prompt("거절 사유를 입력해주세요.")
    if (rejectReason === null) return
    if (!rejectReason.trim()) {
      alert("거절 사유는 필수입니다.")
      return
    }
    setProcessingId(productId)
    rejectAdminProduct(productId, rejectReason.trim())
      .then(fetchProducts)
      .catch(() => alert("상품 거절에 실패했습니다."))
      .finally(() => setProcessingId(null))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>상품 관리</h1>

        <div className={styles.section}>
          <div className={styles.filterBar}>
            {filterCategories.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${
                  selectedCategory === category ? styles.filterBtnActive : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="상품명 또는 브랜드로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className={styles.totalCount}>총 {filteredProducts.length}개</span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>상품</th>
                  <th>카테고리</th>
                  <th>판매가</th>
                  <th>재고</th>
                  <th>판매상태</th>
                  <th>승인상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      불러오는 중...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <div className={styles.productCell}>
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.productName}
                              className={styles.productThumb}
                            />
                          ) : (
                            <div className={styles.productThumb} />
                          )}
                          <div>
                            <span className={styles.productName}>{product.productName}</span>
                            <span className={styles.brandName}>{product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.parentCategoryName ?? "-"}</td>
                      <td>{formatPrice(product.price)}원</td>
                      <td>{product.stockQuantity ?? 0}개</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            product.status === "ON_SALE"
                              ? styles.statusOnSale
                              : styles.statusSoldOut
                          }`}
                        >
                          {statusLabel[product.status] ?? product.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[approvalStatusClass[product.approvalStatus]] ?? ""
                          }`}
                        >
                          {approvalStatusLabel[product.approvalStatus] ?? product.approvalStatus}
                        </span>
                      </td>
                      <td>
                        {product.approvalStatus === "PENDING" ? (
                          <div className={styles.actionBtns}>
                            <button
                              className={`${styles.actionBtn} ${styles.approveBtn}`}
                              onClick={() => handleApprove(product.productId)}
                              disabled={processingId === product.productId}
                            >
                              <CheckCircle size={14} />
                              승인
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.rejectBtn}`}
                              onClick={() => handleReject(product.productId)}
                              disabled={processingId === product.productId}
                            >
                              <XCircle size={14} />
                              거절
                            </button>
                          </div>
                        ) : (
                          <span className={styles.noAction}>-</span>
                        )}
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
