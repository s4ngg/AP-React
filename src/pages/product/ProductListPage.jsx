import { useEffect, useMemo, useState } from "react";
import styles from "./ProductListPage.module.css";
import productMockData from "./productMockData";

function ProductListPage() {
    const categoryData = {
        뷰티: ["메이크업", "스킨케어", "향수", "남성화장품"],
        패션: ["여성의류", "남성의류", "잡화·ACC"],
        식품: ["과일·견과", "축산·수산", "디저트"],
        주류: ["와인", "양주", "맥주·기타"],
        리빙: ["캔들디퓨저 인센스", "조명·무드등", "가구·DIY", "침구·패브릭"],
    };

    const sortOptions = ["최신순", "가격낮은순", "가격높은순", "인기순"];

    const [selectedCategory, setSelectedCategory] = useState("뷰티");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedSort, setSelectedSort] = useState("최신순");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    const filteredProducts = useMemo(() => {
        const categoryFiltered = productMockData.filter((product) => {
            const isMainCategoryMatch = product.category === selectedCategory;
            const isSubCategoryMatch = selectedSubCategory
                ? product.subCategory === selectedSubCategory
                : true;

            return isMainCategoryMatch && isSubCategoryMatch;
        });

        const sortedProducts = [...categoryFiltered];

        if (selectedSort === "가격낮은순") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "가격높은순") {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (selectedSort === "인기순") {
            sortedProducts.sort((a, b) => b.discountRate - a.discountRate);
        }

        return sortedProducts;
    }, [selectedCategory, selectedSubCategory, selectedSort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubCategory, selectedSort]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>카테고리</h3>

                    <div className={styles.categoryList}>
                        {Object.keys(categoryData).map((category) => (
                            <div key={category} className={styles.categoryGroup}>
                                <button
                                    type="button"
                                    className={`${styles.categoryButton} ${
                                        selectedCategory === category ? styles.activeCategory : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSelectedSubCategory("");
                                    }}
                                >
                                    {category}
                                </button>

                                {selectedCategory === category && (
                                    <div className={styles.subCategoryList}>
                                        {categoryData[category].map((subCategory) => (
                                            <button
                                                key={subCategory}
                                                type="button"
                                                className={`${styles.subCategoryButton} ${
                                                    selectedSubCategory === subCategory
                                                        ? styles.activeSubCategory
                                                        : ""
                                                }`}
                                                onClick={() => setSelectedSubCategory(subCategory)}
                                            >
                                                {subCategory}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                <section className={styles.content}>
                    <div className={styles.topBar}>
                        <div>
                            <h2 className={styles.title}>
                                {selectedSubCategory || selectedCategory} 추천 상품
                            </h2>
                            {selectedSubCategory && (
                                <p className={styles.subTitle}>
                                    {selectedCategory} &gt; {selectedSubCategory}
                                </p>
                            )}
                        </div>

                        <div className={styles.sortButtons}>
                            {sortOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`${styles.sortButton} ${
                                        selectedSort === option ? styles.activeSort : ""
                                    }`}
                                    onClick={() => setSelectedSort(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.countText}>
                        총 <span>{filteredProducts.length}</span>개의 상품
                    </div>

                    <div className={styles.productGrid}>
                        {paginatedProducts.map((product) => (
                            <div key={product.id} className={styles.card}>
                                <div className={styles.imageWrap}>
                                    {product.badge && (
                                        <span className={styles.badge}>{product.badge}</span>
                                    )}

                                    <button type="button" className={styles.likeButton}>
                                        ♡
                                    </button>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                </div>

                                <div className={styles.cardContent}>
                                    <p className={styles.productSubCategory}>
                                        {product.subCategory}
                                    </p>

                                    <p className={styles.productName}>{product.name}</p>

                                    <div className={styles.priceArea}>
                                        {product.discountRate > 0 && (
                                            <span className={styles.discountRate}>
                                                {product.discountRate}%
                                            </span>
                                        )}
                                        <span className={styles.price}>
                                            {product.price.toLocaleString()}원
                                        </span>
                                    </div>

                                    {product.originalPrice > product.price && (
                                        <p className={styles.originalPrice}>
                                            {product.originalPrice.toLocaleString()}원
                                        </p>
                                    )}

                                    <p className={styles.shipping}>{product.shipping}</p>

                                    <button type="button" className={styles.cartButton}>
                                        장바구니
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.pagination}>
                        <button
                            type="button"
                            className={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                type="button"
                                className={`${styles.pageButton} ${
                                    currentPage === index + 1 ? styles.activePage : ""
                                }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            className={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            &gt;
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProductListPage;