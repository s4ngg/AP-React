import { useState, useEffect } from "react"
import { ShoppingBag, Package, RefreshCcw, TrendingUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerClaims, getSellerOrders } from "../../api/sellerApi"
import styles from "./SellerDashboardPage.module.css"

const HARDCODED_MONTHLY_SALES = 1250000

const STATUS_KO = {
  PENDING: "결제완료",
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

export default function SellerDashboardPage() {
  const [claimCount, setClaimCount] = useState(0)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getSellerClaims()
      .then((data) => {
        const active = (data ?? []).filter(
          (c) => c.status === "SUBMITTED" || c.status === "IN_PROGRESS"
        )
        setClaimCount(active.length)
      })
      .catch(() => setClaimCount(0))

    getSellerOrders()
      .then((data) => setOrders(data ?? []))
      .catch(() => setOrders([]))
  }, [])

  const pendingCount = orders.filter(
    (o) => o.status === "PAID" || o.status === "PENDING"
  ).length

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt))
    .slice(0, 5)

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>판매자 대시보드</h1>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><TrendingUp size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>이번 달 매출</p>
              <p className={styles.statValue}>{HARDCODED_MONTHLY_SALES.toLocaleString()}원</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><ShoppingBag size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>총 주문 수</p>
              <p className={styles.statValue}>{orders.length}건</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}><Package size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>처리 대기 주문</p>
              <p className={styles.statValue}>{pendingCount}건</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconRed}`}><RefreshCcw size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>환불/교환 요청</p>
              <p className={styles.statValue}>{claimCount}건</p>
            </div>
          </div>
        </div>

        {/* 최근 주문 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>최근 주문</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>구매자</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>주문 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderNumber}</td>
                      <td>{order.memberName}</td>
                      <td>{order.orderItems?.[0]?.productName ?? "-"}</td>
                      <td>{Number(order.totalAmount).toLocaleString()}원</td>
                      <td>{order.orderedAt?.slice(0, 10)}</td>
                      <td>{STATUS_KO[order.status] ?? order.status}</td>
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