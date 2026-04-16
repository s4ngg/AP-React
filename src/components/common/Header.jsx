import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Headphones } from "lucide-react"
import useAuthStore from "../../store/authStore"
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
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuthStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate("/")
  }

  // 유저 이름 첫 글자 (아바타용)
  const userInitial = user?.name?.charAt(0) || "U"

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        신규가입 시 <strong>5,000원</strong> 할인쿠폰 즉시 지급!
      </div>

      <nav className={styles.nav}>
        <div className={styles.navTop}>
          <Link to="/" className={styles.logo}>AllPick</Link>

          {/* 검색바 */}
          <div className={styles.searchBar}>
            <input type="text" placeholder="찾으시는 상품을 검색해보세요" />
            <button className={styles.searchBtn} aria-label="검색">
              <Search size={18} />
            </button>
          </div>

          {/* 오른쪽 아이콘 */}
          <div className={styles.rightIcons}>
            {isLoggedIn ? (
              // ── 로그인 상태 ──
              <>
                <Link to="/mypage" className={styles.userBtn}>
                  <div className={styles.userAvatar}>{userInitial}</div>
                  <span>{user?.name || "마이페이지"}</span>
                </Link>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              // ── 비로그인 상태 ──
              <>
                <Link to="/login" className={styles.iconBtn}>
                  <User size={20} />
                  <span>로그인</span>
                </Link>
                <Link to="/signup" className={styles.iconBtn}>
                  <User size={20} />
                  <span>회원가입</span>
                </Link>
              </>
            )}

            {/* 장바구니 - 공통 */}
            <Link to="/cart" className={`${styles.iconBtn} ${styles.cartBtn}`}>
              <ShoppingCart size={20} />
              <span>장바구니</span>
              <span className={styles.cartBadge}>3</span>
            </Link>

            <Link to="/customer" className={styles.iconBtn}>
              <Headphones size={20} />
              <span>고객센터</span>
            </Link>

            {/* 모바일 메뉴 버튼 */}
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

          <Link
            to="/customer"
            className={styles.mobileMenuItem}
            onClick={() => setMobileMenuOpen(false)}
          >
            고객센터
          </Link>
          <div className={styles.mobileBtns}>
            {isLoggedIn ? (
              <>
                <Link
                  to="/mypage"
                  className={styles.mobileLoginBtn}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={15} /> {user?.name || "마이페이지"}
                </Link>
                <button className={styles.mobileLogoutBtn} onClick={handleLogout}>
                  <LogOut size={15} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={styles.mobileLoginBtn}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={styles.mobileSignupBtn}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
