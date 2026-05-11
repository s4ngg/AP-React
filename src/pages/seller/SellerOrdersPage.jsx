import { useState, useMemo, useEffect, useCallback } from "react"
import { X, Search } from "lucide-react"
import { Link } from "react-router-dom"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerOrdersPage.module.css"
import { getSellerOrders, updateSellerOrderStatus } from "../../api/sellerApi"

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

const STATUS_TO_BACKEND = {
  결제완료: "PENDING",
  상품준비중: "PAID",
  배송중: "SHIPPING",
  배송완료: "DELIVERED",
}
const PREV_STATUS_MAP = {
  상품준비중: "결제완료",
  배송중: "상품준비중",
  배송완료: "배송중",
}

const PREV_STATUS_LABEL = {
  상품준비중: "결제완료로 되돌리기",
  배송중: "준비중으로 되돌리기",
  배송완료: "배송중으로 되돌리기",
}

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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("전체")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchType, setSearchType] = useState("memberName")
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearch, setAppliedSearch] = useState({ type: "memberName", term: "" })

  const fetchOrders = useCallback(() => {
    setLoading(true)
    getSellerOrders()
      .then((data) => setOrders(data ?? []))
      .catch((err) => console.error("주문 목록 조회 실패", err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = () => {
    setAppliedSearch({ type: searchType, term: searchTerm.trim() })
  }

  const handleSearchClear = () => {
    setSearchTerm("")
    setAppliedSearch({ type: searchType, term: "" })
  }

  const filteredOrders = useMemo(() => {
    let list = activeTab === "전체" ? orders : orders.filter((o) => o.status === activeTab)
    const { type, term } = appliedSearch
    if (!term) return list
    const lower = term.toLowerCase()
    return list.filter((o) => {
      if (type === "orderId") return o.orderNumber?.toLowerCase().includes(lower)
      if (type === "memberName") return o.memberName?.includes(term)
      if (type === "memberPhone") return o.memberPhone?.includes(term)
      if (type === "productName") return o.productName?.toLowerCase().includes(lower)
      return true
    })
  }, [orders, activeTab, appliedSearch])

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const nextStatus = NEXT_STATUS_MAP[currentStatus]
    if (!nextStatus) return
    if (!window.confirm(`상태를 "${nextStatus}"(으)로 변경하시겠습니까?`)) return
    const backendStatus = STATUS_TO_BACKEND[nextStatus]
    try {
      await updateSellerOrderStatus(orderId, backendStatus)
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
      )
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: nextStatus }))
      }
    } catch {
      alert("상태 변경에 실패했습니다.")
    }
  }
  const handleStatusRevert = async (orderId, currentStatus) => {
    const prevStatus = PREV_STATUS_MAP[currentStatus]
    if (!prevStatus) return
    if (!window.confirm(`상태를 "${prevStatus}"(으)로 되돌리시겠습니까?`)) return
    const backendStatus = STATUS_TO_BACKEND[prevStatus]
    try {
      await updateSellerOrderStatus(orderId, backendStatus)
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: prevStatus } : o))
      )
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: prevStatus }))
      }
    } catch {
      alert("상태 되돌리기에 실패했습니다.")
    }
  }
  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>주문 현황</h1>

        <div className={styles.section}>
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

          <div className={styles.tabs}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className={styles.tabCount}>
                  {tab === "전체" ? orders.length : orders.filter((o) => o.status === tab).length}
                </span>
              </button>
            ))}
          </div>

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
                {loading ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>불러오는 중...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>해당 조건의 주문이 없습니다.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className={styles.orderId}>{order.orderNumber}</td>
                      <td>
                        <button className={styles.buyerBtn} onClick={() => setSelectedOrder(order)}>
                          {order.memberName}
                        </button>
                      </td>
                      <td>
                        <Link className={styles.productLink} to={`/products/${order.productId}`}>
                          {order.productName}
                        </Link>
                      </td>
                      <td>{Number(order.amount).toLocaleString()}원</td>
                      <td>{order.orderedAt}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[order.status]]}`}>
                          {order.status}
                        </span>
                      </td>
                        <td className={styles.actionBtns}>
                          {NEXT_STATUS_MAP[order.status] && (
                            <button
                              className={styles.statusBtn}
                              onClick={() => handleStatusUpdate(order.orderId, order.status)}
                            >
                              {NEXT_STATUS_LABEL[order.status]}
                            </button>
                          )}
                          {PREV_STATUS_MAP[order.status] && (
                            <button
                              className={styles.statusRevertBtn}
                              onClick={() => handleStatusRevert(order.orderId, order.status)}
                            >
                              되돌리기
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

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>주문 상세</h2>
              <button className={styles.modalCloseBtn} onClick={() => setSelectedOrder(null)} aria-label="닫기">
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>주문 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>주문번호</span><span className={styles.detailValue}>{selectedOrder.orderNumber}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>상품명</span><span className={styles.detailValue}>{selectedOrder.productName}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>수량</span><span className={styles.detailValue}>{selectedOrder.quantity}개</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>결제금액</span><span className={styles.detailValue}>{Number(selectedOrder.amount).toLocaleString()}원</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>주문일</span><span className={styles.detailValue}>{selectedOrder.orderedAt}</span></div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상태</span>
                    <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[selectedOrder.status]]}`}>{selectedOrder.status}</span>
                  </div>
                </div>
              </div>
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>구매자 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>이름</span><span className={styles.detailValue}>{selectedOrder.memberName}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>이메일</span><span className={styles.detailValue}>{selectedOrder.memberEmail}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>연락처</span><span className={styles.detailValue}>{selectedOrder.memberPhone}</span></div>
                </div>
              </div>
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>배송지 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>수령인</span><span className={styles.detailValue}>{selectedOrder.delivery.recipientName}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>연락처</span><span className={styles.detailValue}>{selectedOrder.delivery.phone}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>우편번호</span><span className={styles.detailValue}>{selectedOrder.delivery.zipCode}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>주소</span><span className={styles.detailValue}>{selectedOrder.delivery.address}</span></div>
                  {selectedOrder.delivery.addressDetail && (
                    <div className={styles.detailRow}><span className={styles.detailLabel}>상세주소</span><span className={styles.detailValue}>{selectedOrder.delivery.addressDetail}</span></div>
                  )}
                </div>
              </div>
            </div>
            {NEXT_STATUS_MAP[selectedOrder.status] && (
              <div className={styles.modalFooter}>
                {NEXT_STATUS_MAP[selectedOrder.status] && (
                  <button className={styles.statusBtn} onClick={() => handleStatusUpdate(selectedOrder.orderId, selectedOrder.status)}>
                    {NEXT_STATUS_LABEL[selectedOrder.status]}
                  </button>
                )}
                {PREV_STATUS_MAP[selectedOrder.status] && (
                  <button className={styles.statusRevertBtn} onClick={() => handleStatusRevert(selectedOrder.orderId, selectedOrder.status)}>
                    {PREV_STATUS_LABEL[selectedOrder.status]}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}