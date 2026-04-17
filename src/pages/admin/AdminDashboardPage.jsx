import { Users, ShoppingBag, Package, TrendingUp } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminDashboardPage.module.css"

// 임시 통계 데이터 (추후 API 연동 예정)
const mockStats = [
  { label: "총 회원 수", value: "1,248명", icon: Users, cardClass: "statCardBlue" },
  { label: "오늘 주문 수", value: "37건", icon: ShoppingBag, cardClass: "statCardGreen" },
  { label: "이번 달 매출", value: "8,420,000원", icon: TrendingUp, cardClass: "statCardPurple" },
  { label: "전체 상품 수", value: "312개", icon: Package, cardClass: "statCardOrange" },
]

// 임시 최근 주문 데이터 (추후 API 연동 예정)
const mockRecentOrders = [
  { id: "AP-00000001", memberName: "김민수", productName: "[에스티로더] 갈색병 세럼 50ml", amount: 89000, status: "결제완료", createdAt: "2026-04-16" },
  { id: "AP-00000002", memberName: "이영희", productName: "[나이키] 에어맥스 97 화이트", amount: 179000, status: "배송중", createdAt: "2026-04-15" },
  { id: "AP-00000003", memberName: "박지성", productName: "[설화수] 윤조에센스 60ml", amount: 128000, status: "배송완료", createdAt: "2026-04-15" },
  { id: "AP-00000004", memberName: "최수영", productName: "[유니클로] 린넨 블렌드 셔츠", amount: 39900, status: "취소", createdAt: "2026-04-14" },
  { id: "AP-00000005", memberName: "정해인", productName: "[무인양품] 폴리에스터 이불커버", amount: 59000, status: "결제완료", createdAt: "2026-04-14" },
]

const statusBadgeClass = {
  "결제완료": "statusPaid",
  "배송중": "statusShipping",
  "배송완료": "statusDelivered",
  "취소": "statusCancelled",
}

export default function AdminDashboardPage() {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>대시보드</h1>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
          {mockStats.map(({ label, value, icon: Icon, cardClass }) => (
            <div key={label} className={`${styles.statCard} ${styles[cardClass]}`}>
              <div className={styles.statIconWrap}>
                <Icon size={22} />
              </div>
              <div>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 최근 주문 */}
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
                {mockRecentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>{order.id}</td>
                    <td>{order.memberName}</td>
                    <td className={styles.ellipsis}>{order.productName}</td>
                    <td>{order.amount.toLocaleString()}원</td>
                    <td>{order.createdAt}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[statusBadgeClass[order.status]]}`}>
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
