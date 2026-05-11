import { useState, useEffect } from "react"
import { ShoppingBag, Package, RefreshCcw, TrendingUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerOrders, getSellerClaims } from "../../api/sellerApi"
import styles from "./SellerDashboardPage.module.css"

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
              <p className={styles.statValue}>아직 미구현 기능입니다</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><ShoppingBag size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>총 주문 수</p>
              <p className={styles.statValue}>{loading ? "-" : `${totalOrders}건`}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}><Package size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>처리 대기 주문</p>
              <p className={styles.statValue}>{loading ? "-" : `${pendingOrders}건`}</p>
            </div>
          </div>
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
                <tr>
                  <td colSpan={6} className={styles.emptyRow}>주문 데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
