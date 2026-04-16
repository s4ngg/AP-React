import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Package, ShoppingBag } from "lucide-react"
import styles from "./AdminSidebar.module.css"

const navItems = [
  { to: "/admin", label: "대시보드", icon: LayoutDashboard, end: true },
  { to: "/admin/members", label: "회원 관리", icon: Users },
  { to: "/admin/products", label: "상품 관리", icon: Package },
  { to: "/admin/orders", label: "주문 관리", icon: ShoppingBag },
]

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarBadge}>ADMIN</span>
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
