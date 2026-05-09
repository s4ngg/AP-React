import { useState, useEffect } from "react"
import { ShoppingBag, Package, RefreshCcw, TrendingUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerOrders, getSellerClaims } from "../../api/sellerApi"
import styles from "./SellerDashboardPage.module.css"

const STATUS_LABEL = {
  PENDING: "주문접수",
  PROCESSING: "처리중",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

const STATUS_CLASS = {
  PENDING: styles.statusPending,
  PROCESSING: styles.statusProcessing,
  SHIPPED: styles.statusShipped,
  DELIVERED: styles.statusDelivered,
  CANCELLED: styles.statusCancelled,
}

export default function SellerDashboardPage() {
  const [orders, setOrders] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([getSellerOrders(), getSellerClaims()])
      .then(([ordersResult, claimsResult]) => {
        if (ordersResult.status === "fulfilled") setOrders(ordersResult.value ?? [])
        if (claimsResult.status === "fulfilled") setClaims(claimsResult.value ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length
  const claimCount = claims.length

  // 최근 5건
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>판매자 대시보드</h1>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
          {/* 매출 — 하드코딩 */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}><TrendingUp size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>이번 달 매출</p>
              <p className={styles.statValue}>₩ 1,250,000</p>
            </div>
          </div>

          {/* 총 주문 수 — API */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><ShoppingBag size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>총 주문 수</p>
              <p className={styles.statValue}>{loading ? "-" : `${totalOrders}건`}</p>
            </div>
          </div>

          {/* 처리 대기 주문 — API */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}><Package size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>처리 대기 주문</p>
              <p className={styles.statValue}>{loading ? "-" : `${pendingOrders}건`}</p>
            </div>
          </div>

          {/* 환불/교환 요청 — API */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconRed}`}><RefreshCcw size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>환불/교환 요청</p>
              <p className={styles.statValue}>{loading ? "-" : `${claimCount}건`}</p>
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>불러오는 중...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>주문 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>#{order.orderId}</td>
                      <td>{order.memberName ?? `회원 #${order.memberId}`}</td>
                      <td>{order.productName ?? "-"}</td>
                      <td>{order.totalPrice != null ? `₩ ${order.totalPrice.toLocaleString()}` : "-"}</td>
                      <td>{order.createdAt?.slice(0, 10) ?? "-"}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${STATUS_CLASS[order.status] ?? ""}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
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
