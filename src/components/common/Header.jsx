import { Link } from "react-router-dom"
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import styles from "./Header.module.css"

const categories = [
  { name: "뷰티", href: "/products?category=beauty" },
  { name: "패션", href: "/products?category=fashion" },
  { name: "식품", href: "/products?category=food" },
  { name: "주류", href: "/products?category=alcohol" },
  { name: "리빙", href: "/products?category=living" },
]

const navLinks = [
  { name: "특별할인", href: "#" },
  { name: "이벤트", href: "#" },
  { name: "쿠폰", href: "#" },
  { name: "베스트셀러", href: "#" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        신규가입 시 <strong>5,000원</strong> 할인쿠폰 즉시 지급!
      </div>

      <nav className={styles.nav}>
        <div className={styles.navTop}>
          <Link to="/" className={styles.logo}>AllPick</Link>

          <div className={styles.searchBar}>
            <input type="text" placeholder="찾으시는 상품을 검색해보세요" />
            <button className={styles.searchBtn} aria-label="검색">
              <Search size={18} />
            </button>
          </div>

          <div className={styles.rightIcons}>
            <Link to="/login" className={styles.iconBtn}>
              <User size={20} />
              <span>로그인</span>
            </Link>
            <Link to="/mypage" className={styles.iconBtn}>
              <User size={20} />
              <span>마이페이지</span>
            </Link>
            <Link to="/cart" className={`${styles.iconBtn} ${styles.cartBtn}`}>
              <ShoppingCart size={20} />
              <span>장바구니</span>
              <span className={styles.cartBadge}>3</span>
            </Link>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="메뉴"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 검색 */}
        <div className={styles.mobileSearch}>
          <input type="text" placeholder="찾으시는 상품을 검색해보세요" />
          <button className={styles.searchBtn} aria-label="검색">
            <Search size={18} />
          </button>
        </div>

        {/* 데스크탑 네비게이션 */}
        <div className={styles.navBottom}>
          <div className={styles.categoryWrapper}>
            <button
              className={styles.categoryTrigger}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              카테고리 <ChevronDown size={16} />
            </button>
            {categoryOpen && (
              <div className={styles.categoryDropdown}>
                {categories.map((c) => (
                  <Link key={c.name} to={c.href} onClick={() => setCategoryOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {navLinks.map((item) => (
            <Link key={item.name} to={item.href} className={styles.navLink}>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <p className={styles.mobileMenuLabel}>카테고리</p>
          {categories.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={styles.mobileMenuItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
            <p className={styles.mobileMenuLabel}>메뉴</p>
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={styles.mobileMenuItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link to="/login" className={styles.mobileLoginBtn}>
            <User size={16} /> 로그인
          </Link>
        </div>
      )}
    </header>
  )
}
