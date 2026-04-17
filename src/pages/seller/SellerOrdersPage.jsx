import { useState, useMemo } from "react"
import { X, Search } from "lucide-react"
import { Link } from "react-router-dom"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerOrdersPage.module.css"

// 임시 주문 데이터 — members + delivery_addresses 기준 (추후 API 연동 예정)
const initialOrders = [
  {
    id: "AP-00000010",
    productId: 1,
    memberId: 101,
    memberName: "홍길동",
    memberEmail: "hong@example.com",
    memberPhone: "010-1111-2222",
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    amount: 45000,
    quantity: 1,
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
    productId: 2,
    memberId: 102,
    memberName: "김민수",
    memberEmail: "minsu@example.com",
    memberPhone: "010-3333-4444",
    productName: "[뷰티스타일샵] 토너 200ml",
    amount: 32000,
    quantity: 2,
    status: "상품준비중",
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
    productId: 3,
    memberId: 103,
    memberName: "이영희",
    memberEmail: "younghee@example.com",
    memberPhone: "010-5555-6666",
    productName: "[뷰티스타일샵] 선크림 SPF50+",
    amount: 28000,
    quantity: 1,
    status: "배송중",
    createdAt: "2026-04-14",
    delivery: {
      recipientName: "이영희",
      phone: "010-5555-6666",
      zipCode: "03000",
      address: "서울특별시 종로구 OO길 45",
      addressDetail: "2층",
    },
  },
  {
    id: "AP-00000007",
    productId: 1,
    memberId: 104,
    memberName: "박지성",
    memberEmail: "jisung@example.com",
    memberPhone: "010-7777-8888",
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    amount: 45000,
    quantity: 1,
    status: "배송완료",
    createdAt: "2026-04-13",
    delivery: {
      recipientName: "박지성",
      phone: "010-7777-8888",
      zipCode: "48000",
      address: "부산광역시 해운대구 OO대로 88",
      addressDetail: "OO호텔 로비",
    },
  },
  {
    id: "AP-00000005",
    productId: 2,
    memberId: 105,
    memberName: "최수영",
    memberEmail: "suyoung@example.com",
    memberPhone: "010-9999-0000",
    productName: "[뷰티스타일샵] 토너 200ml",
    amount: 32000,
    quantity: 1,
    status: "취소",
    createdAt: "2026-04-12",
    delivery: {
      recipientName: "최수영",
      phone: "010-9999-0000",
      zipCode: "21500",
      address: "인천광역시 남동구 OO로 200",
      addressDetail: "",
    },
  },
]

const STATUS_TABS = ["전체", "결제완료", "상품준비중", "배송중", "배송완료", "취소"]

const STATUS_BADGE_CLASS = {
  결제완료: "statusPaid",
  상품준비중: "statusPreparing",
  배송중: "statusShipping",
  배송완료: "statusDone",
  취소: "statusCancel",
}

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

// 검색 유형 목록 — 실제 판매자 포털(스마트스토어, 쿠팡 Wing) 기준
const SEARCH_TYPES = [
  { value: "memberName", label: "구매자명" },
  { value: "memberPhone", label: "연락처" },
  { value: "productName", label: "상품명" },
  { value: "orderId", label: "주문번호" },
]

const SEARCH_PLACEHOLDERS = {
  memberName: "구매자 이름을 입력하세요",
  memberPhone: "연락처를 입력하세요 (예: 010-1234)",
  productName: "상품명을 입력하세요",
  orderId: "주문번호를 입력하세요 (예: AP-00000010)",
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState("전체")
  const [selectedOrder, setSelectedOrder] = useState(null)

  // 검색 상태
  const [searchType, setSearchType] = useState("memberName")
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearch, setAppliedSearch] = useState({ type: "memberName", term: "" })

  const handleSearch = () => {
    setAppliedSearch({ type: searchType, term: searchTerm.trim() })
  }

  const handleSearchClear = () => {
    setSearchTerm("")
    setAppliedSearch({ type: searchType, term: "" })
  }

  const filteredOrders = useMemo(() => {
    // 1. 탭 필터
    let list = activeTab === "전체" ? orders : orders.filter((o) => o.status === activeTab)
    // 2. 검색 필터
    const { type, term } = appliedSearch
    if (!term) return list
    const lower = term.toLowerCase()
    return list.filter((o) => {
      if (type === "orderId") return o.id.toLowerCase().includes(lower)
      if (type === "memberName") return o.memberName.includes(term)
      if (type === "memberPhone") return o.memberPhone.includes(term)
      if (type === "productName") return o.productName.toLowerCase().includes(lower)
      return true
    })
  }, [orders, activeTab, appliedSearch])

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatus = NEXT_STATUS_MAP[currentStatus]
    if (!nextStatus) return
    if (!window.confirm(`상태를 "${nextStatus}"(으)로 변경하시겠습니까?`)) return
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    )
    // 모달이 열려 있으면 모달 내 상태도 갱신
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextStatus }))
    }
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>주문 현황</h1>

        <div className={styles.section}>
          {/* 검색 영역 */}
          <div className={styles.searchBar}>
            <select
              className={styles.searchTypeSelect}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              {SEARCH_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <div className={styles.searchInputWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={SEARCH_PLACEHOLDERS[searchType]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
            {appliedSearch.term && (
              <button className={styles.searchResetBtn} onClick={handleSearchClear}>초기화</button>
            )}
          </div>
          {appliedSearch.term && (
            <p className={styles.searchResultInfo}>
              <strong>"{appliedSearch.term}"</strong> 검색 결과 {filteredOrders.length}건
            </p>
          )}

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
                      해당 조건의 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>
                        <button
                          className={styles.buyerBtn}
                          onClick={() => setSelectedOrder(order)}
                        >
                          {order.memberName}
                        </button>
                      </td>
                      <td>
                        <Link
                          className={styles.productLink}
                          to={`/products/${order.productId}`}
                        >
                          {order.productName}
                        </Link>
                      </td>
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
              {/* 주문 정보 */}
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
                    <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[selectedOrder.status]]}`}>
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

            {/* 모달 내 상태 변경 */}
            {NEXT_STATUS_MAP[selectedOrder.status] && (
              <div className={styles.modalFooter}>
                <button
                  className={styles.statusBtn}
                  onClick={() => handleStatusUpdate(selectedOrder.id, selectedOrder.status)}
                >
                  {NEXT_STATUS_LABEL[selectedOrder.status]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
