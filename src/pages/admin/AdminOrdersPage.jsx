import { useMemo, useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminOrdersPage.module.css"

// 임시 주문 데이터 (추후 API 연동 예정)
const initialOrders = [
  { id: "AP-00000001", memberName: "김민수", productName: "[에스티로더] 갈색병 세럼 50ml", amount: 89000, status: "결제완료", createdAt: "2026-04-16" },
  { id: "AP-00000002", memberName: "이영희", productName: "[나이키] 에어맥스 97 화이트", amount: 179000, status: "배송중", createdAt: "2026-04-15" },
  { id: "AP-00000003", memberName: "박지성", productName: "[설화수] 윤조에센스 60ml", amount: 128000, status: "배송완료", createdAt: "2026-04-15" },
  { id: "AP-00000004", memberName: "최수영", productName: "[유니클로] 린넨 블렌드 셔츠", amount: 39900, status: "취소", createdAt: "2026-04-14" },
  { id: "AP-00000005", memberName: "정해인", productName: "[무인양품] 폴리에스터 이불커버", amount: 59000, status: "결제완료", createdAt: "2026-04-14" },
  { id: "AP-00000006", memberName: "손예진", productName: "[헤라] 블랙쿠션 파운데이션", amount: 55000, status: "배송중", createdAt: "2026-04-13" },
  { id: "AP-00000007", memberName: "현빈", productName: "[에스티로더] 갈색병 세럼 50ml", amount: 89000, status: "배송완료", createdAt: "2026-04-13" },
  { id: "AP-00000008", memberName: "유재석", productName: "[나이키] 에어맥스 97 화이트", amount: 179000, status: "결제완료", createdAt: "2026-04-12" },
]

const statusTabs = ["전체", "결제완료", "배송중", "배송완료", "취소"]

const statusBadgeClass = {
  "결제완료": "statusPaid",
  "배송중": "statusShipping",
  "배송완료": "statusDelivered",
  "취소": "statusCancelled",
}

export default function AdminOrdersPage() {
  const [orders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState("전체")

  const filteredOrders = useMemo(() => {
    if (activeTab === "전체") return orders
    return orders.filter((o) => o.status === activeTab)
  }, [orders, activeTab])

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>주문 관리</h1>

        <div className={styles.section}>
          {/* 상태 필터 탭 */}
          <div className={styles.tabs}>
            {statusTabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className={styles.tabCount}>
                  {tab === "전체"
                    ? orders.length
                    : orders.filter((o) => o.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* 테이블 */}
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      해당 상태의 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>{order.memberName}</td>
                      <td className={styles.productName}>{order.productName}</td>
                      <td>{order.amount.toLocaleString()}원</td>
                      <td>{order.createdAt}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[statusBadgeClass[order.status]]}`}>
                          {order.status}
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
