import { useEffect, useMemo, useState } from "react";
import styles from "./ProductListPage.module.css";
import productMockData from "./productMockData";

function ProductListPage() {
    const categories = ["뷰티", "패션", "식품", "주류", "리빙"];
    const sortOptions = ["최신순", "가격낮은순", "가격높은순", "인기순"];

    const [selectedCategory, setSelectedCategory] = useState("뷰티");
    const [selectedSort, setSelectedSort] = useState("최신순");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    const filteredProducts = useMemo(() => {
        const categoryFiltered = productMockData.filter(
            (product) => product.category === selectedCategory
        );

        const sortedProducts = [...categoryFiltered];

        if (selectedSort === "가격낮은순") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "가격높은순") {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (selectedSort === "인기순") {
            sortedProducts.sort((a, b) => b.discountRate - a.discountRate);
        }

        return sortedProducts;
    }, [selectedCategory, selectedSort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSort]);

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
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ""
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </aside>

                <section className={styles.content}>
                    <div className={styles.topBar}>
                        <h2 className={styles.title}>{selectedCategory} 추천 상품</h2>

                        <div className={styles.sortButtons}>
                            {sortOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`${styles.sortButton} ${selectedSort === option ? styles.activeSort : ""
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
                                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""
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
                            disabled={currentPage === totalPages}
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