import { ShoppingBag, Package, RefreshCcw, TrendingUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerDashboardPage.module.css"

// 임시 통계 데이터 (추후 API 연동 예정)
const mockStats = {
  totalSales: 1560000,
  totalOrders: 24,
  pendingOrders: 3,
  pendingRefunds: 1,
}

// 임시 최근 주문 데이터 (추후 API 연동 예정)
const mockRecentOrders = [
  { id: "AP-00000010", productName: "[뷰티스타일샵] 수분 세럼 30ml", amount: 45000, status: "결제완료", createdAt: "2026-04-16" },
  { id: "AP-00000009", productName: "[뷰티스타일샵] 토너 200ml", amount: 32000, status: "배송중", createdAt: "2026-04-15" },
  { id: "AP-00000008", productName: "[뷰티스타일샵] 선크림 SPF50+", amount: 28000, status: "배송완료", createdAt: "2026-04-14" },
]

const STATUS_CLASS = {
  결제완료: "statusPaid",
  배송중: "statusShipping",
  배송완료: "statusDone",
  취소: "statusCancel",
}

export default function SellerDashboardPage() {
  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>판매자 대시보드</h1>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>이번 달 매출</p>
              <p className={styles.statValue}>{mockStats.totalSales.toLocaleString()}원</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
              <ShoppingBag size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>총 주문 수</p>
              <p className={styles.statValue}>{mockStats.totalOrders}건</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
              <Package size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>처리 대기 주문</p>
              <p className={styles.statValue}>{mockStats.pendingOrders}건</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconRed}`}>
              <RefreshCcw size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>환불/교환 요청</p>
              <p className={styles.statValue}>{mockStats.pendingRefunds}건</p>
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
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>{order.id}</td>
                    <td>{order.productName}</td>
                    <td>{order.amount.toLocaleString()}원</td>
                    <td>{order.createdAt}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
