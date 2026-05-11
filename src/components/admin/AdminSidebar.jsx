import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, Package, ShoppingBag, Tag, RefreshCcw, Bell, HelpCircle, MessageSquare, UserCog, LogOut } from "lucide-react"
import styles from "./AdminSidebar.module.css"
import useAuthStore from "../../store/authStore"

const ALL_NAV_ITEMS = [
  { to: "/admin", label: "대시보드", icon: LayoutDashboard, end: true, roles: ["SUPER_ADMIN"] },
  { to: "/admin/members", label: "회원 관리", icon: Users, roles: ["SUPER_ADMIN"] },
  { to: "/admin/products", label: "상품 관리", icon: Package, roles: ["SUPER_ADMIN"] },
  { to: "/admin/orders", label: "주문 관리", icon: ShoppingBag, roles: ["SUPER_ADMIN"] },
  { to: "/admin/categories", label: "카테고리 관리", icon: Tag, roles: ["SUPER_ADMIN"] },
  { to: "/admin/refunds", label: "환불 승인", icon: RefreshCcw, roles: ["SUPER_ADMIN", "CS_ADMIN"] },
  { to: "/admin/notices", label: "공지사항 관리", icon: Bell, roles: ["SUPER_ADMIN", "CS_ADMIN"] },
  { to: "/admin/faqs", label: "FAQ 관리", icon: HelpCircle, roles: ["SUPER_ADMIN", "CS_ADMIN"] },
  { to: "/admin/inquiries", label: "1:1 문의 관리", icon: MessageSquare, roles: ["SUPER_ADMIN", "CS_ADMIN"] },
  { to: "/admin/accounts", label: "관리자 계정 관리", icon: UserCog, roles: ["SUPER_ADMIN"] },
]

const ROLE_LABEL = {
  SUPER_ADMIN: "최고 관리자",
  CS_ADMIN: "CS 관리자",
}

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { adminRole, adminName, logout } = useAuthStore()
  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(adminRole))

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }


  return (
    <aside className={styles.sidebar} style={{ position: "relative", minHeight: "100vh" }}>
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

      <div className={styles.sidebarFooter}>
        <div className={styles.adminInfo}>
          <div className={styles.adminName}>{adminName ?? "-"}</div>
          <div className={styles.adminRole}>{ROLE_LABEL[adminRole] ?? adminRole}</div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
