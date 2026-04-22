import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerProductsPage.module.css"

const CATEGORIES = ["뷰티", "패션", "리빙"]
const FILTER_CATEGORIES = ["전체", ...CATEGORIES]
const EMPTY_FORM = { name: "", category: "뷰티", price: "", stock: "", description: "" }

// 임시 내 상품 데이터 (추후 API 연동 예정)
// thumbnail → products.thumbnail_url
// additionalImages → product_images 테이블
// descriptionImages → 상품 상세 설명 이미지 (긴 스크롤형, 한국 쇼핑몰 표준)
const initialProducts = [
  {
    id: 1,
    name: "[뷰티스타일샵] 수분 세럼 30ml",
    category: "뷰티",
    price: 45000,
    stock: 120,
    status: "판매중",
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    ],
    descriptionImages: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4ee0ac6?w=600&h=400&fit=crop",
    ],
    description: "촉촉하고 건강한 피부를 위한 수분 세럼입니다. 히알루론산이 풍부하여 피부 깊숙이 수분을 공급합니다.",
  },
  {
    id: 2,
    name: "[뷰티스타일샵] 토너 200ml",
    category: "뷰티",
    price: 32000,
    stock: 85,
    status: "판매중",
    thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    ],
    descriptionImages: [],
    description: "상쾌하고 보습력 있는 토너입니다. 피부 결을 정돈하고 다음 스킨케어 흡수를 도와줍니다.",
  },
  {
    id: 3,
    name: "[뷰티스타일샵] 선크림 SPF50+",
    category: "뷰티",
    price: 28000,
    stock: 0,
    status: "품절",
    thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    additionalImages: [],
    descriptionImages: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4ee0ac6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=400&fit=crop",
    ],
    description: "강력한 자외선 차단 선크림입니다. SPF50+ PA++++ 등급으로 오래 지속됩니다.",
  },
]

export default function SellerProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  // 등록/수정 모달
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 이미지 업로드 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [additionalPreviews, setAdditionalPreviews] = useState([])
  const [descriptionPreviews, setDescriptionPreviews] = useState([])

  // 상품 상세 모달
  const [viewingProduct, setViewingProduct] = useState(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch = !term || p.name.toLowerCase().includes(term)
      const matchesCategory = selectedCategory === "전체" || p.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  // 상세 모달 열기
  const handleOpenDetail = (product) => {
    setViewingProduct(product)
    setActiveImageIdx(0)
  }

  // 등록 모달 열기
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
    setThumbnailPreview("")
    setAdditionalPreviews([])
    setDescriptionPreviews([])
    setIsModalOpen(true)
  }

  // 수정 모달 열기
  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || "",
    })
    setThumbnailPreview(product.thumbnail || "")
    setAdditionalPreviews([...(product.additionalImages || [])])
    setDescriptionPreviews([...(product.descriptionImages || [])])
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
    setThumbnailPreview("")
    setAdditionalPreviews([])
    setDescriptionPreviews([])
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 대표 이미지 선택
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnailPreview(URL.createObjectURL(file))
  }

  // 추가 이미지 선택 (multiple)
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map((f) => URL.createObjectURL(f))
    setAdditionalPreviews((prev) => [...prev, ...urls])
    e.target.value = ""
  }

  const handleRemoveAdditionalPreview = (idx) => {
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  // 상품 상세 설명 이미지 선택 (multiple)
  const handleDescriptionImagesChange = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map((f) => URL.createObjectURL(f))
    setDescriptionPreviews((prev) => [...prev, ...urls])
    e.target.value = ""
  }

  const handleRemoveDescriptionPreview = (idx) => {
    setDescriptionPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price || !formData.stock) {
      alert("상품명, 판매가, 재고 수량은 필수입니다.")
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      const price = Number(formData.price)
      const stock = Number(formData.stock)
      const status = stock === 0 ? "품절" : "판매중"
      const thumbnail =
        thumbnailPreview ||
        "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop"

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: formData.name,
                  category: formData.category,
                  price,
                  stock,
                  status,
                  thumbnail,
                  additionalImages: additionalPreviews,
                  descriptionImages: descriptionPreviews,
                  description: formData.description,
                }
              : p
          )
        )
      } else {
        setProducts((prev) => [
          {
            id: Date.now(),
            name: formData.name,
            category: formData.category,
            price,
            stock,
            status,
            thumbnail,
            additionalImages: additionalPreviews,
            descriptionImages: descriptionPreviews,
            description: formData.description,
          },
          ...prev,
        ])
      }
      setIsSubmitting(false)
      handleCloseModal()
    }, 500)
  }

  const handleDelete = (productId, productName) => {
    if (!window.confirm(`"${productName}"을(를) 삭제하시겠습니까?`)) return
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    if (viewingProduct?.id === productId) setViewingProduct(null)
  }

  // 갤러리: 대표이미지 + 추가이미지 배열
  const galleryImages = viewingProduct
    ? [viewingProduct.thumbnail, ...(viewingProduct.additionalImages || [])].filter(Boolean)
    : []

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
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
                      등록된 상품이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={styles.clickableRow}
                      onClick={() => handleOpenDetail(product)}
                    >
                      <td>
                        <div className={styles.productCell}>
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className={styles.productThumb}
                          />
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
                        {/* stopPropagation으로 행 클릭(상세 모달)과 분리 */}
                        <div
                          className={styles.actionBtns}
                          onClick={(e) => e.stopPropagation()}
                        >
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
      </main>

      {/* ── 상품 상세 모달 ── */}
      {viewingProduct && (
        <div className={styles.modalOverlay} onClick={() => setViewingProduct(null)}>
          <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailModalHeader}>
              <h2 className={styles.modalTitle}>{viewingProduct.name}</h2>
              <div className={styles.detailModalActions}>
                <button
                  className={styles.editInDetailBtn}
                  onClick={() => {
                    setViewingProduct(null)
                    handleOpenEdit(viewingProduct)
                  }}
                >
                  <Pencil size={14} />
                  수정하기
                </button>
                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setViewingProduct(null)}
                  aria-label="닫기"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className={styles.detailModalBody}>
              {/* 이미지 갤러리 */}
              {galleryImages.length > 0 && (
                <div className={styles.gallery}>
                  <div className={styles.galleryMain}>
                    <img
                      src={galleryImages[activeImageIdx]}
                      alt={viewingProduct.name}
                      className={styles.galleryMainImg}
                    />
                  </div>
                  {galleryImages.length > 1 && (
                    <div className={styles.galleryThumbs}>
                      {galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`${styles.galleryThumb} ${
                            idx === activeImageIdx ? styles.galleryThumbActive : ""
                          }`}
                          onClick={() => setActiveImageIdx(idx)}
                        >
                          <img src={img} alt={`이미지 ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 상품 정보 */}
              <div className={styles.productInfoGrid}>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>카테고리</span>
                  <span className={styles.productInfoValue}>{viewingProduct.category}</span>
                </div>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>판매가</span>
                  <span className={styles.productInfoValue}>
                    {viewingProduct.price.toLocaleString()}원
                  </span>
                </div>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>재고</span>
                  <span className={styles.productInfoValue}>{viewingProduct.stock}개</span>
                </div>
                <div className={styles.productInfoRow}>
                  <span className={styles.productInfoLabel}>상태</span>
                  <span
                    className={`${styles.statusBadge} ${
                      viewingProduct.status === "판매중"
                        ? styles.statusOnSale
                        : styles.statusSoldOut
                    }`}
                  >
                    {viewingProduct.status}
                  </span>
                </div>
                {viewingProduct.description && (
                  <div className={styles.productInfoRow}>
                    <span className={styles.productInfoLabel}>상품 설명</span>
                    <span className={styles.productInfoValue}>{viewingProduct.description}</span>
                  </div>
                )}
              </div>

              {/* 상품 상세 설명 이미지 */}
              {viewingProduct.descriptionImages?.length > 0 && (
                <div className={styles.descImagesSection}>
                  <p className={styles.descImagesTitle}>상품 상세 설명</p>
                  <div className={styles.descImagesList}>
                    {viewingProduct.descriptionImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`상세설명 ${idx + 1}`}
                        className={styles.descFullImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 등록/수정 모달 ── */}
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

            <form className={styles.formWrapper} onSubmit={handleSubmit}>
              <div className={styles.formBody}>
              {/* 상품명 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>상품명 *</label>
                <input
                  type="text"
                  name="name"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="상품명을 입력하세요"
                />
              </div>

              {/* 카테고리 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>카테고리</label>
                <select
                  name="category"
                  className={styles.formInput}
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 판매가 / 재고 */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>판매가 (원) *</label>
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
                  <label className={styles.formLabel}>재고 수량 *</label>
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
              </div>

              {/* 대표 이미지 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>대표 이미지</label>
                {thumbnailPreview && (
                  <div className={styles.thumbPreviewWrap}>
                    <img
                      src={thumbnailPreview}
                      alt="대표이미지 미리보기"
                      className={styles.thumbPreview}
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => setThumbnailPreview("")}
                      aria-label="대표이미지 삭제"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className={styles.fileInputLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleThumbnailChange}
                  />
                  이미지 선택
                </label>
              </div>

              {/* 추가 이미지 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>추가 이미지</label>
                <p className={styles.formHint}>상품 갤러리에 표시됩니다. 여러 장 선택 가능합니다.</p>
                {additionalPreviews.length > 0 && (
                  <div className={styles.imagePreviewList}>
                    {additionalPreviews.map((url, idx) => (
                      <div key={idx} className={styles.imagePreviewItem}>
                        <img
                          src={url}
                          alt={`추가이미지 ${idx + 1}`}
                          className={styles.imagePreviewThumb}
                        />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => handleRemoveAdditionalPreview(idx)}
                          aria-label="이미지 삭제"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={styles.fileInputLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={handleAdditionalImagesChange}
                  />
                  이미지 추가
                </label>
              </div>

              {/* 상품 상세 설명 이미지 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>상품 상세 설명 이미지</label>
                <p className={styles.formHint}>
                  상품 상세 페이지에 표시되는 세로형 이미지입니다. 순서대로 노출됩니다.
                </p>
                {descriptionPreviews.length > 0 && (
                  <div className={styles.descImagePreviewList}>
                    {descriptionPreviews.map((url, idx) => (
                      <div key={idx} className={styles.descImagePreviewItem}>
                        <img
                          src={url}
                          alt={`상세이미지 ${idx + 1}`}
                          className={styles.descImagePreviewImg}
                        />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => handleRemoveDescriptionPreview(idx)}
                          aria-label="이미지 삭제"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={styles.fileInputLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={handleDescriptionImagesChange}
                  />
                  이미지 추가
                </label>
              </div>

              {/* 상품 간략 설명 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>상품 간략 설명</label>
                <textarea
                  name="description"
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="상품에 대한 간략한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              </div>{/* end formBody */}
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                  취소
                </button>
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
