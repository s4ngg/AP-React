import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Headphones, Store } from "lucide-react"
import useAuthStore from "../../store/authStore"
import useCartStore from "../../store/cartStore"
import { getChildCategories, getParentCategories } from "../../api/productApi"
import styles from "./Header.module.css"

const navLinks = [
  { name: "특별할인" },
  { name: "이벤트" },
  { name: "베스트셀러" },
]

export default function Header() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, adminToken } = useAuthStore()
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [parentCategories, setParentCategories] = useState([])
  const [childCategoriesByParentId, setChildCategoriesByParentId] = useState({})
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const parentResponse = await getParentCategories()
        const parents = parentResponse.data ?? []

        const childEntries = await Promise.all(
          parents.map(async (parent) => {
            try {
              const childResponse = await getChildCategories(parent.parentCategoryId)
              return [parent.parentCategoryId, childResponse.data ?? []]
            } catch {
              return [parent.parentCategoryId, []]
            }
          })
        )

        if (!isMounted) return

        setParentCategories(parents)
        setChildCategoriesByParentId(Object.fromEntries(childEntries))
        setHoveredCategoryId(parents[0]?.parentCategoryId ?? null)
      } catch {
        if (!isMounted) return

        setParentCategories([])
        setChildCategoriesByParentId({})
        setHoveredCategoryId(null)
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate("/")
  }

  const handleNavClick = () => {
    alert("아직 준비중인 기능입니다.")
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const userInitial = user?.name?.charAt(0) || "MY"
  const hoveredParentCategory = parentCategories.find(
    (category) => category.parentCategoryId === hoveredCategoryId
  )
  const hoveredChildCategories = hoveredCategoryId
    ? childCategoriesByParentId[hoveredCategoryId] ?? []
    : []

  const moveToParentCategory = (category) => {
    setCategoryOpen(false)
    setMobileMenuOpen(false)
    navigate(`/products?category=${encodeURIComponent(category.categoryName)}`)
  }

  const moveToChildCategory = (parentCategory, childCategory) => {
    setCategoryOpen(false)
    setMobileMenuOpen(false)
    navigate(
      `/products?category=${encodeURIComponent(parentCategory.categoryName)}&subCategory=${encodeURIComponent(childCategory.categoryName)}`
    )
  }

  return (
    <header className={styles.header}>
      {!isLoggedIn && !adminToken && (
        <div className={styles.topBar}>
          신규가입 시 <strong>5,000원</strong> 할인쿠폰 즉시 지급!
        </div>
      )}

      <nav className={styles.nav}>
        <div className={styles.navTop}>
          <Link to="/" className={styles.logo}>AllPick</Link>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="찾으시는 상품을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className={styles.searchBtn} aria-label="검색" onClick={handleSearch}>
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

                {user?.isSeller && (
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
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
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
          <input
            type="text"
            placeholder="찾으시는 상품을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className={styles.searchBtn} aria-label="검색" onClick={handleSearch}>
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
                  {parentCategories.map((category) => (
                    <button
                      key={category.parentCategoryId}
                      type="button"
                      className={`${styles.mainCategoryItem} ${hoveredCategoryId === category.parentCategoryId ? styles.activeMainCategoryItem : ""}`}
                      onMouseEnter={() => setHoveredCategoryId(category.parentCategoryId)}
                      onClick={() => moveToParentCategory(category)}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>

                <div className={styles.subCategoryList}>
                  {hoveredParentCategory && hoveredChildCategories.map((subCategory) => (
                    <button
                      key={subCategory.childCategoryId}
                      type="button"
                      className={styles.subCategoryItem}
                      onClick={() => moveToChildCategory(hoveredParentCategory, subCategory)}
                    >
                      {subCategory.categoryName}
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
          {parentCategories.map((category) => (
            <div key={category.parentCategoryId} className={styles.mobileCategoryGroup}>
              <button
                type="button"
                className={styles.mobileMenuItemButton}
                onClick={() => moveToParentCategory(category)}
              >
                {category.categoryName}
              </button>

              <div className={styles.mobileSubCategoryList}>
                {(childCategoriesByParentId[category.parentCategoryId] ?? []).map((subCategory) => (
                  <button
                    key={subCategory.childCategoryId}
                    type="button"
                    className={styles.mobileSubCategoryItem}
                    onClick={() => moveToChildCategory(category, subCategory)}
                  >
                    {subCategory.categoryName}
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