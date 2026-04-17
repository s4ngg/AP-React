import { useState } from "react"
import { ShoppingBag, Package, RefreshCcw, TrendingUp, X } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerDashboardPage.module.css"

// 임시 통계 데이터 (추후 API 연동 예정)
const mockStats = {
  totalSales: 1560000,
  totalOrders: 24,
  pendingOrders: 3,
  pendingRefunds: 1,
}

// 임시 최근 주문 데이터 — members + delivery_addresses 기준 (추후 API 연동 예정)
const mockRecentOrders = [
  {
    id: "AP-00000010",
    memberName: "홍길동",
    memberEmail: "hong@example.com",
    memberPhone: "010-1111-2222",
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    quantity: 1,
    amount: 45000,
    status: "결제완료",
    createdAt: "2026-04-16",
    delivery: {
      recipientName: "홍길동",
      phone: "010-1111-2222",
      zipCode: "06000",
      address: "서울특별시 강남구 테헤란로 123",
      addressDetail: "OO빌딩 5층",
    },
  },
  {
    id: "AP-00000009",
    memberName: "김민수",
    memberEmail: "minsu@example.com",
    memberPhone: "010-3333-4444",
    productName: "[뷰티스타일샵] 토너 200ml",
    quantity: 2,
    amount: 32000,
    status: "배송중",
    createdAt: "2026-04-15",
    delivery: {
      recipientName: "김민수",
      phone: "010-3333-4444",
      zipCode: "12345",
      address: "인천광역시 미추홀구 OO로 123",
      addressDetail: "OO아파트 101동 101호",
    },
  },
  {
    id: "AP-00000008",
    memberName: "이영희",
    memberEmail: "younghee@example.com",
    memberPhone: "010-5555-6666",
    productName: "[뷰티스타일샵] 선크림 SPF50+",
    quantity: 1,
    amount: 28000,
    status: "배송완료",
    createdAt: "2026-04-14",
    delivery: {
      recipientName: "이영희",
      phone: "010-5555-6666",
      zipCode: "03000",
      address: "서울특별시 종로구 OO길 45",
      addressDetail: "2층",
    },
  },
]

const STATUS_CLASS = {
  결제완료: "statusPaid",
  상품준비중: "statusPreparing",
  배송중: "statusShipping",
  배송완료: "statusDone",
  취소: "statusCancel",
}

export default function SellerDashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)

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
                  <th>구매자</th>
                  <th>상품명</th>
                  <th>결제금액</th>
                  <th>주문일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={styles.clickableRow}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className={styles.orderId}>{order.id}</td>
                    <td>{order.memberName}</td>
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

      {/* 주문 상세 모달 */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>주문 상세</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedOrder(null)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* 주문/상품 정보 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>주문 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>주문번호</span>
                    <span className={styles.detailValue}>{selectedOrder.id}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상품명</span>
                    <span className={styles.detailValue}>{selectedOrder.productName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>수량</span>
                    <span className={styles.detailValue}>{selectedOrder.quantity}개</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>결제금액</span>
                    <span className={styles.detailValue}>{selectedOrder.amount.toLocaleString()}원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>주문일</span>
                    <span className={styles.detailValue}>{selectedOrder.createdAt}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상태</span>
                    <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[selectedOrder.status]]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* 구매자 정보 — members 테이블 기준 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>구매자 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>이름</span>
                    <span className={styles.detailValue}>{selectedOrder.memberName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>이메일</span>
                    <span className={styles.detailValue}>{selectedOrder.memberEmail}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>연락처</span>
                    <span className={styles.detailValue}>{selectedOrder.memberPhone}</span>
                  </div>
                </div>
              </div>

              {/* 배송지 정보 — delivery_addresses 테이블 기준 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>배송지 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>수령인</span>
                    <span className={styles.detailValue}>{selectedOrder.delivery.recipientName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>연락처</span>
                    <span className={styles.detailValue}>{selectedOrder.delivery.phone}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>우편번호</span>
                    <span className={styles.detailValue}>{selectedOrder.delivery.zipCode}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>주소</span>
                    <span className={styles.detailValue}>{selectedOrder.delivery.address}</span>
                  </div>
                  {selectedOrder.delivery.addressDetail && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>상세주소</span>
                      <span className={styles.detailValue}>{selectedOrder.delivery.addressDetail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
