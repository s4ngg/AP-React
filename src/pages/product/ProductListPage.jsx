import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProductListPage.module.css";
import { getAllProductsForFilter, getParentCategories, getChildCategories } from "../../api/productApi";

function ProductListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const sortOptions = ["최신순", "가격낮은순", "가격높은순"];

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentName, setSelectedParentName] = useState("");
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChildName, setSelectedChildName] = useState("");

  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 8;

  // 전체 상품 한 번에 로드
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await getAllProductsForFilter();
        setAllProducts(res.data?.content || []);
      } catch {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 카테고리 목록 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getParentCategories();
        const cats = res.data || [];
        setParentCategories(cats);
        if (cats.length > 0) {
          setSelectedParentId(cats[0].parentCategoryId);
          setSelectedParentName(cats[0].categoryName);
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  // 하위 카테고리 로드
  useEffect(() => {
    if (!selectedParentId) return;
    const fetchChildCategories = async () => {
      try {
        const res = await getChildCategories(selectedParentId);
        setChildCategories(res.data || []);
        setSelectedChildId(null);
        setSelectedChildName("");
      } catch {
        setChildCategories([]);
      }
    };
    fetchChildCategories();
  }, [selectedParentId]);

  // URL 쿼리 카테고리 파라미터 반영
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCategory = params.get("category");
    if (queryCategory && parentCategories.length > 0) {
      const found = parentCategories.find((c) => c.categoryName === queryCategory);
      if (found) {
        setSelectedParentId(found.parentCategoryId);
        setSelectedParentName(found.categoryName);
      }
    }
  }, [location.search, parentCategories]);

  // 카테고리/정렬 바뀌면 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedParentId, selectedChildId, selectedSort]);

  // 프론트 필터링 + 정렬
  const filteredSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // 카테고리 필터
    if (selectedParentName) {
      result = result.filter((p) => p.parentCategoryName === selectedParentName);
    }

    // 정렬
    if (selectedSort === "가격낮은순") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (selectedSort === "가격높은순") result.sort((a, b) => Number(b.price) - Number(a.price));

    return result;
  }, [allProducts, selectedParentName, selectedSort]);

  // 페이지네이션
  const totalElements = filteredSortedProducts.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const pagedProducts = filteredSortedProducts.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>카테고리</h3>
          <div className={styles.categoryList}>
            {parentCategories.map((cat) => (
              <div key={cat.parentCategoryId} className={styles.categoryGroup}>
                <button
                  type="button"
                  className={`${styles.categoryButton} ${selectedParentId === cat.parentCategoryId ? styles.activeCategory : ""}`}
                  onClick={() => {
                    setSelectedParentId(cat.parentCategoryId);
                    setSelectedParentName(cat.categoryName);
                  }}
                >
                  {cat.categoryName}
                </button>

                {selectedParentId === cat.parentCategoryId && childCategories.length > 0 && (
                  <div className={styles.subCategoryList}>
                    {childCategories.map((child) => (
                      <button
                        key={child.childCategoryId}
                        type="button"
                        className={`${styles.subCategoryButton} ${selectedChildId === child.childCategoryId ? styles.activeSubCategory : ""}`}
                        onClick={() => {
                          setSelectedChildId(child.childCategoryId);
                          setSelectedChildName(child.categoryName);
                        }}
                      >
                        {child.categoryName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* 상품 목록 */}
        <section className={styles.content}>
          <div className={styles.topBar}>
            <div>
              <h2 className={styles.title}>
                {selectedChildName || selectedParentName || "전체"} 추천 상품
              </h2>
              {selectedChildName && (
                <p className={styles.subTitle}>{selectedParentName} &gt; {selectedChildName}</p>
              )}
            </div>
            <div className={styles.sortButtons}>
              {sortOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.sortButton} ${selectedSort === option ? styles.activeSort : ""}`}
                  onClick={() => setSelectedSort(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.countText}>총 <span>{totalElements}</span>개의 상품</div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>불러오는 중...</div>
          ) : pagedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>상품이 없습니다.</div>
          ) : (
            <div className={styles.productGrid}>
              {pagedProducts.map((product) => (
                <div
                  key={product.productId}
                  className={styles.card}
                  onClick={() => navigate(`/products/${product.productId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.imageWrap}>
                    <img
                      src={product.thumbnailUrl}
                      alt={product.productName}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.productSubCategory}>{product.parentCategoryName}</p>
                    {product.brand && (
                      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>{product.brand}</p>
                    )}
                    <p className={styles.productName}>{product.productName}</p>
                    <div className={styles.priceArea}>
                      <span className={styles.price}>{Number(product.price).toLocaleString()}원</span>
                    </div>
                    <button
                      type="button"
                      className={styles.cartButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.productId}`);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button type="button" className={styles.pageButton} onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0}>&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ""}`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button type="button" className={styles.pageButton} onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages - 1}>&gt;</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductListPage;
