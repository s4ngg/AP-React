import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingBag, RefreshCcw, MessageSquare, AlertCircle } from "lucide-react"
import styles from "./SellerSidebar.module.css"

const navItems = [
  { to: "/seller", label: "대시보드", icon: LayoutDashboard, end: true },
  { to: "/seller/products", label: "상품 관리", icon: Package },
  { to: "/seller/orders", label: "주문 현황", icon: ShoppingBag },
  { to: "/seller/refunds", label: "환불/교환 처리", icon: RefreshCcw },
  { to: "/seller/inquiries", label: "문의 답변", icon: MessageSquare },
]

export default function SellerSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <p className={styles.businessName}>뷰티스타일샵</p>
        <span className={styles.sidebarBadge}>셀러페이지</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}