import { createElement, useEffect, useMemo, useState } from "react"
import { Users, ShoppingBag, Package, TrendingUp } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { getAdminOrders, getAdminProducts, getMembers } from "../../api/adminApi"
import { formatDate } from "../../utils/format"
import styles from "./AdminDashboardPage.module.css"

const SALES_STATUSES = new Set(["PAID", "SHIPPING", "DELIVERED"])

const statusBadgeClass = {
  PENDING: "statusPending",
  PAID: "statusPaid",
  SHIPPING: "statusShipping",
  DELIVERED: "statusDelivered",
  CANCELLED: "statusCancelled",
}

const statusLabel = {
  PENDING: "주문접수",
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const getMonthKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")

  return `${year}-${month}`
}

const formatCount = (value, unit) => `${Number(value ?? 0).toLocaleString()}${unit}`
const formatPrice = (amount) => `${Number(amount ?? 0).toLocaleString()}원`

const getSettledValue = (result) => (result.status === "fulfilled" ? result.value ?? [] : [])

const hasFetchError = (errors) => Object.values(errors).some(Boolean)

const getStatValue = ({ loading, hasError, value, unit }) => {
  if (hasError) return "-"
  if (loading) return "..."
  return formatCount(value, unit)
}

export default function AdminDashboardPage() {
  const [members, setMembers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadErrors, setLoadErrors] = useState({})

  useEffect(() => {
    let ignore = false

    const timeoutId = setTimeout(() => {
      setLoading(true)
      setLoadErrors({})

      Promise.allSettled([getMembers(), getAdminOrders(), getAdminProducts()])
        .then(([memberResult, orderResult, productResult]) => {
          if (ignore) return

          setMembers(getSettledValue(memberResult))
          setOrders(getSettledValue(orderResult))
          setProducts(getSettledValue(productResult))
          setLoadErrors({
            members: memberResult.status === "rejected",
            orders: orderResult.status === "rejected",
            products: productResult.status === "rejected",
          })
        })
        .finally(() => {
          if (!ignore) setLoading(false)
        })
    }, 0)

    return () => {
      ignore = true
      clearTimeout(timeoutId)
    }
  }, [])

  const todayKey = getDateKey()
  const monthKey = getMonthKey()

  const todayOrderCount = useMemo(
    () => orders.filter((order) => order.orderedAt?.slice(0, 10) === todayKey).length,
    [orders, todayKey]
  )

  const monthlySales = useMemo(
    () =>
      orders
        .filter((order) => order.orderedAt?.slice(0, 7) === monthKey)
        .filter((order) => SALES_STATUSES.has(order.status))
        .reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0),
    [orders, monthKey]
  )

  const dashboardStats = useMemo(
    () => [
      {
        label: "총 회원 수",
        value: getStatValue({
          loading,
          hasError: loadErrors.members,
          value: members.length,
          unit: "명",
        }),
        icon: Users,
        cardClass: "statCardBlue",
      },
      {
        label: "오늘 주문 수",
        value: getStatValue({
          loading,
          hasError: loadErrors.orders,
          value: todayOrderCount,
          unit: "건",
        }),
        icon: ShoppingBag,
        cardClass: "statCardGreen",
      },
      {
        label: "이번 달 매출",
        value: loadErrors.orders ? "-" : loading ? "..." : formatPrice(monthlySales),
        icon: TrendingUp,
        cardClass: "statCardPurple",
      },
      {
        label: "전체 상품 수",
        value: getStatValue({
          loading,
          hasError: loadErrors.products,
          value: products.length,
          unit: "개",
        }),
        icon: Package,
        cardClass: "statCardOrange",
      },
    ],
    [loadErrors, loading, members.length, monthlySales, products.length, todayOrderCount]
  )

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>대시보드</h1>
        {hasFetchError(loadErrors) && (
          <p className={styles.errorText}>일부 대시보드 데이터를 불러오지 못했습니다.</p>
        )}

        <div className={styles.statsGrid}>
          {dashboardStats.map(({ label, value, icon, cardClass }) => (
            <div key={label} className={`${styles.statCard} ${styles[cardClass]}`}>
              <div className={styles.statIconWrap}>
                {createElement(icon, { size: 22 })}
              </div>
              <div>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>최근 주문</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문자</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      최근 주문을 불러오는 중...
                    </td>
                  </tr>
                ) : loadErrors.orders ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      최근 주문을 불러오지 못했습니다.
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      최근 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className={styles.orderId}>{order.orderNumber}</td>
                      <td>{order.memberName}</td>
                      <td className={styles.ellipsis}>{order.productName}</td>
                      <td>{formatPrice(order.totalAmount)}</td>
                      <td>{formatDate(order.orderedAt)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[statusBadgeClass[order.status]] ?? ""}`}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
