import { useCallback, useEffect, useMemo, useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { getAdminOrders } from "../../api/adminApi"
import { formatDate } from "../../utils/format"
import styles from "./AdminOrdersPage.module.css"

const statusTabs = [
  { label: "전체", value: "ALL" },
  { label: "주문접수", value: "PENDING" },
  { label: "결제완료", value: "PAID" },
  { label: "배송중", value: "SHIPPING" },
  { label: "배송완료", value: "DELIVERED" },
  { label: "취소", value: "CANCELLED" },
]

const statusLabel = {
  PENDING: "주문접수",
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

const statusBadgeClass = {
  PENDING: "statusPending",
  PAID: "statusPaid",
  SHIPPING: "statusShipping",
  DELIVERED: "statusDelivered",
  CANCELLED: "statusCancelled",
}

const formatPrice = (amount) => Number(amount ?? 0).toLocaleString()


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("ALL")
  const [loading, setLoading] = useState(false)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    getAdminOrders()
      .then((data) => setOrders(data ?? []))
      .catch(() => alert("주문 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(fetchOrders, 0)
    return () => clearTimeout(timeoutId)
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders
    return orders.filter((order) => order.status === activeTab)
  }, [orders, activeTab])

  const getTabCount = (status) => {
    if (status === "ALL") return orders.length
    return orders.filter((order) => order.status === status).length
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>주문 관리</h1>

        <div className={styles.section}>
          <div className={styles.tabs}>
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                <span className={styles.tabCount}>{getTabCount(tab.value)}</span>
              </button>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문자</th>
                  <th>이메일</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      불러오는 중...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      해당 상태의 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className={styles.orderId}>{order.orderNumber}</td>
                      <td>{order.memberName}</td>
                      <td>{order.memberEmail}</td>
                      <td className={styles.productName}>{order.productName}</td>
                      <td>{formatPrice(order.totalAmount)}원</td>
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
