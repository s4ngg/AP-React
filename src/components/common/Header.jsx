import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Headphones, Store } from "lucide-react"
import useAuthStore from "../../store/authStore"
import styles from "./Header.module.css"

const categoryData = {
  뷰티: ["메이크업", "스킨케어", "남성화장품", "향수"],
  패션: ["여성의류", "남성의류", "잡화·ACC"],
  식품: ["과일·견과", "축산·수산", "디저트"],
  주류: ["와인", "양주", "맥주·기타"],
  리빙: ["캔들디퓨저 인센스", "조명·무드등", "가구·DIY", "침구·패브릭"],
}

const navLinks = [
  { name: "특별할인" },
  { name: "이벤트" },
  { name: "베스트셀러" },
]

export default function Header() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, sellerToken } = useAuthStore()  // ← sellerToken 추가

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState("뷰티")

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate("/")
  }

  const handleNavClick = () => {
    alert("아직 준비중인 기능입니다.")
  }

  const userInitial = user?.name?.charAt(0) || "MY"

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
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className={styles.userBtn}>
                  <div className={styles.userAvatar}>{userInitial}</div>
                  <span>{user?.name || "마이페이지"}</span>
                </Link>

                {/* 판매자 토큰 있을 때만 셀러 버튼 표시 */}
                {sellerToken && (
                  <Link to="/seller" className={styles.iconBtn}>
                    <Store size={20} />
                    <span>셀러</span>
                  </Link>
                )}

                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
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

            <Link to="/cart" className={`${styles.iconBtn} ${styles.cartBtn}`}>
              <ShoppingCart size={20} />
              <span>장바구니</span>
              <span className={styles.cartBadge}>3</span>
            </Link>

            <Link to="/customer" className={styles.iconBtn}>
              <Headphones size={20} />
              <span>고객센터</span>
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

        <div className={styles.mobileSearch}>
          <input type="text" placeholder="찾으시는 상품을 검색해보세요" />
          <button className={styles.searchBtn} aria-label="검색">
            <Search size={18} />
          </button>
        </div>

        <div className={styles.navBottom}>
          <div
            className={styles.categoryWrapper}
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button
              className={styles.categoryTrigger}
              type="button"
              onClick={() => navigate("/products")}
            >
              카테고리 <ChevronDown size={16} />
            </button>

            {categoryOpen && (
              <div className={styles.categoryDropdown}>
                <div className={styles.mainCategoryList}>
                  {Object.keys(categoryData).map((categoryName) => (
                    <button
                      key={categoryName}
                      type="button"
                      className={`${styles.mainCategoryItem} ${hoveredCategory === categoryName ? styles.activeMainCategoryItem : ""}`}
                      onMouseEnter={() => setHoveredCategory(categoryName)}
                      onClick={() => {
                        setCategoryOpen(false)
                        navigate(`/products?category=${encodeURIComponent(categoryName)}`)
                      }}
                    >
                      {categoryName}
                    </button>
                  ))}
                </div>

                <div className={styles.subCategoryList}>
                  {categoryData[hoveredCategory].map((subCategory) => (
                    <button
                      key={subCategory}
                      type="button"
                      className={styles.subCategoryItem}
                      onClick={() => {
                        setCategoryOpen(false)
                        navigate(`/products?category=${encodeURIComponent(hoveredCategory)}&subCategory=${encodeURIComponent(subCategory)}`)
                      }}
                    >
                      {subCategory}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinks.map((item) => (
            <button
              key={item.name}
              className={styles.navLink}
              onClick={handleNavClick}
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <p className={styles.mobileMenuLabel}>카테고리</p>
          {Object.keys(categoryData).map((categoryName) => (
            <div key={categoryName} className={styles.mobileCategoryGroup}>
              <button
                type="button"
                className={styles.mobileMenuItemButton}
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate(`/products?category=${encodeURIComponent(categoryName)}`)
                }}
              >
                {categoryName}
              </button>

              <div className={styles.mobileSubCategoryList}>
                {categoryData[categoryName].map((subCategory) => (
                  <button
                    key={subCategory}
                    type="button"
                    className={styles.mobileSubCategoryItem}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate(`/products?category=${encodeURIComponent(categoryName)}&subCategory=${encodeURIComponent(subCategory)}`)
                    }}
                  >
                    {subCategory}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
            <p className={styles.mobileMenuLabel}>메뉴</p>
            {navLinks.map((item) => (
              <button
                key={item.name}
                className={styles.mobileMenuItem}
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleNavClick()
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          <Link to="/customer" className={styles.mobileMenuItem} onClick={() => setMobileMenuOpen(false)}>
            고객센터
          </Link>

          <div className={styles.mobileBtns}>
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className={styles.mobileLoginBtn} onClick={() => setMobileMenuOpen(false)}>
                  <User size={15} /> {user?.name || "마이페이지"}
                </Link>
                <button className={styles.mobileLogoutBtn} onClick={handleLogout}>
                  <LogOut size={15} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.mobileLoginBtn} onClick={() => setMobileMenuOpen(false)}>
                  로그인
                </Link>
                <Link to="/signup" className={styles.mobileSignupBtn} onClick={() => setMobileMenuOpen(false)}>
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