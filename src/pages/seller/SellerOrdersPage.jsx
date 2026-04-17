import { useState, useMemo } from "react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerOrdersPage.module.css"

// 임시 주문 데이터 (추후 API 연동 예정)
const initialOrders = [
  { id: "AP-00000010", memberName: "홍길동", productName: "[뷰티스타일샵] 수분 세럼 30ml", amount: 45000, status: "결제완료", createdAt: "2026-04-16" },
  { id: "AP-00000009", memberName: "김민수", productName: "[뷰티스타일샵] 토너 200ml", amount: 32000, status: "상품준비중", createdAt: "2026-04-15" },
  { id: "AP-00000008", memberName: "이영희", productName: "[뷰티스타일샵] 선크림 SPF50+", amount: 28000, status: "배송중", createdAt: "2026-04-14" },
  { id: "AP-00000007", memberName: "박지성", productName: "[뷰티스타일샵] 수분 세럼 30ml", amount: 45000, status: "배송완료", createdAt: "2026-04-13" },
  { id: "AP-00000005", memberName: "최수영", productName: "[뷰티스타일샵] 토너 200ml", amount: 32000, status: "취소", createdAt: "2026-04-12" },
]

const STATUS_TABS = ["전체", "결제완료", "상품준비중", "배송중", "배송완료", "취소"]

const STATUS_BADGE_CLASS = {
  결제완료: "statusPaid",
  상품준비중: "statusPreparing",
  배송중: "statusShipping",
  배송완료: "statusDone",
  취소: "statusCancel",
}

// 판매자가 직접 변경 가능한 배송 상태 단계
const NEXT_STATUS_MAP = {
  결제완료: "상품준비중",
  상품준비중: "배송중",
  배송중: "배송완료",
}

const NEXT_STATUS_LABEL = {
  결제완료: "준비 시작",
  상품준비중: "배송 시작",
  배송중: "배송 완료",
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState("전체")

  const filteredOrders = useMemo(() => {
    if (activeTab === "전체") return orders
    return orders.filter((o) => o.status === activeTab)
  }, [orders, activeTab])

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatus = NEXT_STATUS_MAP[currentStatus]
    if (!nextStatus) return
    if (!window.confirm(`상태를 "${nextStatus}"(으)로 변경하시겠습니까?`)) return
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    )
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>주문 현황</h1>

        <div className={styles.section}>
          {/* 상태 필터 탭 */}
          <div className={styles.tabs}>
            {STATUS_TABS.map((tab) => (
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
                  <th>구매자</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
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
                        <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[order.status]]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {NEXT_STATUS_MAP[order.status] && (
                          <button
                            className={styles.statusBtn}
                            onClick={() => handleStatusUpdate(order.id, order.status)}
                          >
                            {NEXT_STATUS_LABEL[order.status]}
                          </button>
                        )}
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
