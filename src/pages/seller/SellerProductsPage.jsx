import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerProducts, createProduct, updateProduct, deleteProduct, getParentCategories } from "../../api/productApi"
import styles from "./SellerProductsPage.module.css"

const EMPTY_FORM = {
  productName: "",
  brand: "",
  price: "",
  manufacturer: "",
  origin: "",
  precaution: "",
  description: "",
  thumbnailUrl: "",
  categoryId: "",
  optionList: [{ optionName: "", optionValue: "", additionalPrice: 0, stockQuantity: 0 }],
  productImageList: [],
}

const createEmptyForm = (categoryId = "") => ({
  ...EMPTY_FORM,
  categoryId,
  optionList: [{ optionName: "", optionValue: "", additionalPrice: 0, stockQuantity: 0 }],
  productImageList: [],
})

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "처리 중 오류가 발생했습니다."

const toNullableText = (value) => {
  const text = value?.trim()
  return text ? text : null
}

const buildCreatePayload = (formData) => ({
  ...formData,
  price: Number(formData.price),
  categoryId: Number(formData.categoryId),
  description: formData.description || formData.productName,
  productImageList: formData.productImageList.length > 0
    ? formData.productImageList
    : formData.thumbnailUrl
      ? [{ imageUrl: formData.thumbnailUrl, sortOrder: 1 }]
      : [],
})

const buildUpdatePayload = (formData) => ({
  productName: toNullableText(formData.productName),
  brand: toNullableText(formData.brand),
  price: formData.price ? Number(formData.price) : null,
  thumbnailUrl: toNullableText(formData.thumbnailUrl),
  description: toNullableText(formData.description),
  manufacturer: toNullableText(formData.manufacturer),
  origin: toNullableText(formData.origin),
  precaution: toNullableText(formData.precaution),
})

export default function SellerProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [parentCategories, setParentCategories] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(true)

  useEffect(() => {

    getSellerProducts()
      .then((data) => setProducts(data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getParentCategories()
      .then((res) => {
        const categories = res.data ?? []
        setParentCategories(categories)
        setFormData((prev) => {
          if (prev.categoryId || categories.length === 0) return prev
          return { ...prev, categoryId: String(categories[0].parentCategoryId) }
        })
      })
      .catch(() => setParentCategories([]))
      .finally(() => setCategoryLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return products
    return products.filter((p) =>
      p.productName?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term)
    )
  }, [products, searchTerm])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(createEmptyForm(parentCategories[0]?.parentCategoryId ? String(parentCategories[0].parentCategoryId) : ""))
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    const matchedCategory = parentCategories.find((category) => category.categoryName === product.parentCategoryName)
    setFormData({
      productName: product.productName ?? "",
      brand: product.brand ?? "",
      price: String(product.price ?? ""),
      manufacturer: "",
      origin: "",
      precaution: "",
      description: "",
      thumbnailUrl: product.thumbnailUrl ?? "",
      categoryId: matchedCategory?.parentCategoryId ? String(matchedCategory.parentCategoryId) : "",
      optionList: [{ optionName: "", optionValue: "", additionalPrice: 0, stockQuantity: 0 }],
      productImageList: [],
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(createEmptyForm(parentCategories[0]?.parentCategoryId ? String(parentCategories[0].parentCategoryId) : ""))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (idx, field, value) => {
    setFormData((prev) => {
      const optionList = [...prev.optionList]
      optionList[idx] = { ...optionList[idx], [field]: value }
      return { ...prev, optionList }
    })
  }

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      optionList: [
        ...prev.optionList,
        { optionName: "", optionValue: "", additionalPrice: 0, stockQuantity: 0 },
      ],
    }))
  }

  const handleRemoveOption = (idx) => {
    setFormData((prev) => ({
      ...prev,
      optionList: prev.optionList.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.productName.trim() || !formData.price || !formData.thumbnailUrl.trim()) {
      alert("상품명, 판매가, 대표 이미지 URL은 필수입니다.")
      return
    }
    if (!editingProduct && (!formData.categoryId || !formData.manufacturer.trim() || !formData.origin.trim() || !formData.precaution.trim())) {
      alert("카테고리, 제조사, 원산지, 주의사항은 필수입니다.")
      return
    }
    setIsSubmitting(true)
    try {
      const payload = editingProduct ? buildUpdatePayload(formData) : buildCreatePayload(formData)
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.productId, payload)
        setProducts((prev) =>
          prev.map((p) => (p.productId === editingProduct.productId ? { ...p, ...updated } : p))
        )
      } else {
        await createProduct(payload)
        // 목록 새로고침
        const fresh = await getSellerProducts()
        setProducts(fresh ?? [])
      }
      handleCloseModal()
    } catch (error) {
      alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`"${productName}"을(를) 삭제하시겠습니까?`)) return
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.productId !== productId))
      if (viewingProduct?.productId === productId) setViewingProduct(null)
    } catch {
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>상품 관리</h1>
        <div className={styles.section}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="상품명 또는 브랜드 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.createBtn} onClick={handleOpenCreate}>
              <Plus size={16} />
              상품 등록
            </button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>상품</th>
                  <th>브랜드</th>
                  <th>카테고리</th>
                  <th>판매가</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className={styles.emptyRow}>불러오는 중...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className={styles.emptyRow}>등록된 상품이 없습니다.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.productId}
                      className={styles.clickableRow}
                      onClick={() => setViewingProduct(product)}
                    >
                      <td>
                        <div className={styles.productCell}>
                          <img src={product.thumbnailUrl} alt={product.productName} className={styles.productThumb} />
                          <span className={styles.productName}>{product.productName}</span>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.parentCategoryName ?? "-"}</td>
                      <td>{Number(product.price).toLocaleString()}원</td>
                      <td>
                        <div className={styles.actionBtns} onClick={(e) => e.stopPropagation()}>
                          <button className={styles.editBtn} onClick={() => handleOpenEdit(product)} aria-label="수정">
                            <Pencil size={14} />
                          </button>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(product.productId, product.productName)} aria-label="삭제">
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
      </main>

      {/* 상세 모달 */}
      {viewingProduct && (
        <div className={styles.modalOverlay} onClick={() => setViewingProduct(null)}>
          <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailModalHeader}>
              <h2 className={styles.modalTitle}>{viewingProduct.productName}</h2>
              <div className={styles.detailModalActions}>
                <button className={styles.editInDetailBtn} onClick={() => { setViewingProduct(null); handleOpenEdit(viewingProduct) }}>
                  <Pencil size={14} /> 수정하기
                </button>
                <button className={styles.modalCloseBtn} onClick={() => setViewingProduct(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.detailModalBody}>
              {viewingProduct.thumbnailUrl && (
                <div className={styles.gallery}>
                  <div className={styles.galleryMain}>
                    <img src={viewingProduct.thumbnailUrl} alt={viewingProduct.productName} className={styles.galleryMainImg} />
                  </div>
                </div>
              )}
              <div className={styles.productInfoGrid}>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>브랜드</span>
                  <span className={styles.productInfoValue}>{viewingProduct.brand}</span>
                </div>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>카테고리</span>
                  <span className={styles.productInfoValue}>{viewingProduct.parentCategoryName ?? "-"}</span>
                </div>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>판매가</span>
                  <span className={styles.productInfoValue}>{Number(viewingProduct.price).toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 등록/수정 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? "상품 수정" : "상품 등록"}</h2>
              <button className={styles.modalCloseBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
              <div className={styles.formBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>상품명 *</label>
                  <input name="productName" className={styles.formInput} value={formData.productName} onChange={handleFormChange} placeholder="상품명을 입력하세요" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>브랜드 *</label>
                  <input name="brand" className={styles.formInput} value={formData.brand} onChange={handleFormChange} placeholder="브랜드명을 입력하세요" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>판매가 (원) *</label>
                    <input type="number" name="price" className={styles.formInput} value={formData.price} onChange={handleFormChange} placeholder="0" min="0" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>카테고리 *</label>
                    <select
                      name="categoryId"
                      className={styles.formInput}
                      value={formData.categoryId}
                      onChange={handleFormChange}
                      disabled={categoryLoading || Boolean(editingProduct)}
                    >
                      <option value="">카테고리 선택</option>
                      {parentCategories.map((category) => (
                        <option key={category.parentCategoryId} value={category.parentCategoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>제조사 *</label>
                    <input name="manufacturer" className={styles.formInput} value={formData.manufacturer} onChange={handleFormChange} placeholder="제조사명" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>원산지 *</label>
                    <input name="origin" className={styles.formInput} value={formData.origin} onChange={handleFormChange} placeholder="원산지" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>주의사항 *</label>
                  <input name="precaution" className={styles.formInput} value={formData.precaution} onChange={handleFormChange} placeholder="주의사항을 입력하세요" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>대표 이미지 URL *</label>
                  <input name="thumbnailUrl" className={styles.formInput} value={formData.thumbnailUrl} onChange={handleFormChange} placeholder="https://..." />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>상품 설명 *</label>
                  <textarea name="description" className={styles.formTextarea} value={formData.description} onChange={handleFormChange} placeholder="상품 설명을 입력하세요" rows={3} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>상품 옵션 *</label>
                  {formData.optionList.map((opt, idx) => (
                    <div key={idx} className={styles.optionRow}>
                      <input className={styles.formInput} placeholder="옵션명 (예: 사이즈)" value={opt.optionName} onChange={(e) => handleOptionChange(idx, "optionName", e.target.value)} />
                      <input className={styles.formInput} placeholder="옵션값 (예: L)" value={opt.optionValue} onChange={(e) => handleOptionChange(idx, "optionValue", e.target.value)} />
                      <input type="number" className={styles.formInput} placeholder="재고" value={opt.stockQuantity} onChange={(e) => handleOptionChange(idx, "stockQuantity", Number(e.target.value))} min="0" />
                      {formData.optionList.length > 1 && (
                        <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveOption(idx)}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className={styles.addOptionBtn} onClick={handleAddOption}>+ 옵션 추가</button>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>취소</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : editingProduct ? "수정하기" : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
