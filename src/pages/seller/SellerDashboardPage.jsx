import { ShoppingBag, Package, RefreshCcw, TrendingUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerDashboardPage.module.css"

export default function SellerDashboardPage() {
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
              <p className={styles.statValue}>-</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><ShoppingBag size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>총 주문 수</p>
              <p className={styles.statValue}>-</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}><Package size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>처리 대기 주문</p>
              <p className={styles.statValue}>-</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconRed}`}><RefreshCcw size={22} /></div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>환불/교환 요청</p>
              <p className={styles.statValue}>-</p>
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