import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProductListPage.module.css";
import { getProductList, getParentCategories, getChildCategories } from "../../api/productApi";
import { addCartItem } from "../../api/cartApi";
import useCartStore from "../../store/cartStore";

function ProductListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const sortOptions = ["최신순", "가격낮은순", "가격높은순"];

  // 카테고리 상태
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentName, setSelectedParentName] = useState("");
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChildName, setSelectedChildName] = useState("");

  // 상품 상태
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Spring은 0-based
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [loading, setLoading] = useState(false);

  // 부모 카테고리 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // GET /api/categories
        const res = await getParentCategories();
        const cats = res.data || [];
        setParentCategories(cats);
        if (cats.length > 0) {
          setSelectedParentId(cats[0].id);
          setSelectedParentName(cats[0].name);
        }
      } catch {
        // 카테고리 로드 실패 시 무시
      }
    };
    fetchCategories();
  }, []);

  // 자식 카테고리 로드 (부모 선택 시)
  useEffect(() => {
    if (!selectedParentId) return;
    const fetchChildCategories = async () => {
      try {
        // GET /api/categories/{parentCategoryId}/child-categories
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

  // URL 쿼리 파라미터로 카테고리 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCategory = params.get("category");
    if (queryCategory && parentCategories.length > 0) {
      const found = parentCategories.find((c) => c.name === queryCategory);
      if (found) {
        setSelectedParentId(found.id);
        setSelectedParentName(found.name);
      }
    }
  }, [location.search, parentCategories]);

  // 상품 목록 로드
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // GET /api/products?page=0&size=8&sort=createdAt,desc
        const res = await getProductList(currentPage);
        const pageData = res.data;
        setProducts(pageData?.content || []);
        setTotalElements(pageData?.totalElements || 0);
        setTotalPages(pageData?.totalPages || 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  // 페이지/카테고리 변경 시 맨 위로
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedParentId, selectedChildId, selectedSort]);

  // 장바구니 담기
  const handleAddToCart = async (product) => {
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
    } catch {
      // 비로그인 시 로컬 store에만 추가
    }
    addItem(product, 1, {});
    alert("장바구니에 추가되었습니다.");
  };

  // 클라이언트 사이드 정렬 (Spring API에 sort 파라미터 추가 전 임시)
  const sortedProducts = [...products].sort((a, b) => {
    if (selectedSort === "가격낮은순") return a.price - b.price;
    if (selectedSort === "가격높은순") return b.price - a.price;
    return 0; // 최신순은 API가 이미 정렬해서 줌
  });

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* 사이드바 - 카테고리 */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>카테고리</h3>
          <div className={styles.categoryList}>
            {parentCategories.map((cat) => (
              <div key={cat.id} className={styles.categoryGroup}>
                <button
                  type="button"
                  className={`${styles.categoryButton} ${selectedParentId === cat.id ? styles.activeCategory : ""}`}
                  onClick={() => {
                    setSelectedParentId(cat.id);
                    setSelectedParentName(cat.name);
                  }}
                >
                  {cat.name}
                </button>

                {selectedParentId === cat.id && childCategories.length > 0 && (
                  <div className={styles.subCategoryList}>
                    {childCategories.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className={`${styles.subCategoryButton} ${selectedChildId === child.id ? styles.activeSubCategory : ""}`}
                        onClick={() => {
                          setSelectedChildId(child.id);
                          setSelectedChildName(child.name);
                        }}
                      >
                        {child.name}
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
                <p className={styles.subTitle}>
                  {selectedParentName} &gt; {selectedChildName}
                </p>
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

          <div className={styles.countText}>
            총 <span>{totalElements}</span>개의 상품
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>불러오는 중...</div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
              상품이 없습니다.
            </div>
          ) : (
            <div className={styles.productGrid}>
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={styles.card}
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.imageWrap}>
                    {product.badge && (
                      <span className={styles.badge}>{product.badge}</span>
                    )}
                    <button type="button" className={styles.likeButton} onClick={(e) => e.stopPropagation()}>
                      ♡
                    </button>
                    <img
                      src={product.thumbnailUrl || product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <p className={styles.productSubCategory}>
                      {product.childCategoryName || product.categoryName}
                    </p>
                    <p className={styles.productName}>{product.name}</p>

                    <div className={styles.priceArea}>
                      {product.discountRate > 0 && (
                        <span className={styles.discountRate}>{product.discountRate}%</span>
                      )}
                      <span className={styles.price}>
                        {product.price?.toLocaleString()}원
                      </span>
                    </div>

                    {product.originalPrice > product.price && (
                      <p className={styles.originalPrice}>
                        {product.originalPrice.toLocaleString()}원
                      </p>
                    )}

                    <p className={styles.shipping}>
                      {product.freeShipping ? "무료배송" : "배송비 3,000원"}
                    </p>

                    <button
                      type="button"
                      className={styles.cartButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      장바구니
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                &lt;
              </button>

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

              <button
                type="button"
                className={styles.pageButton}
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages - 1}
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductListPage;
