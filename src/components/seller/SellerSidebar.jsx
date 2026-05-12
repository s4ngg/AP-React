import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingBag, RefreshCcw, MessageSquare } from "lucide-react"
import { getSellerApplyStatus } from "../../api/sellerApi"
import styles from "./SellerSidebar.module.css"

const navItems = [
  { to: "/seller", label: "대시보드", icon: <LayoutDashboard size={18} />, end: true },
  { to: "/seller/products", label: "상품 관리", icon: <Package size={18} /> },
  { to: "/seller/orders", label: "주문 현황", icon: <ShoppingBag size={18} /> },
  { to: "/seller/refunds", label: "교환/반품 처리", icon: <RefreshCcw size={18} /> },
  { to: "/seller/inquiries", label: "문의 답변", icon: <MessageSquare size={18} /> },
]

export default function SellerSidebar() {
  const [businessName, setBusinessName] = useState("셀러페이지")

  useEffect(() => {
    getSellerApplyStatus()
      .then((data) => {
        setBusinessName(data?.businessName || "셀러페이지")
      })
      .catch(() => {
        setBusinessName("셀러페이지")
      })
  }, [])

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <p className={styles.businessName}>{businessName}</p>
        <span className={styles.sidebarBadge}>셀러페이지</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
