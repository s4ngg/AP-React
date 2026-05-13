import { useState, useMemo, useEffect } from "react"
import { X, Search } from "lucide-react"
import { Link } from "react-router-dom"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerOrdersPage.module.css"
import { getSellerOrders, updateSellerOrderStatus } from "../../api/sellerApi"

const STATUS_TABS = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "결제대기" },
  { value: "PAID", label: "결제완료" },
  { value: "SHIPPING", label: "배송중" },
  { value: "DELIVERED", label: "배송완료" },
  { value: "CANCELLED", label: "취소" },
]

const STATUS_LABEL = {
  PENDING: "결제대기",
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

const STATUS_BADGE_CLASS = {
  PENDING: "statusPreparing",
  PAID: "statusPaid",
  SHIPPING: "statusShipping",
  DELIVERED: "statusDone",
  CANCELLED: "statusCancel",
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

const formatDate = (value) => {
  if (!value) return "-"
  return value.slice(0, 10)
}

const formatPrice = (value) => Number(value ?? 0).toLocaleString()

const getStatusLabel = (order) => order.statusLabel ?? STATUS_LABEL[order.status] ?? order.status ?? "-"

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState("ALL")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchType, setSearchType] = useState("memberName")
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearch, setAppliedSearch] = useState({ type: "memberName", term: "" })
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  useEffect(() => {
    let ignore = false

    getSellerOrders()
      .then((data) => {
        if (ignore) return
        setOrders(data ?? [])
        setErrorMessage("")
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err.response?.data?.message || "주문 목록을 불러오지 못했습니다.")
        setOrders([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const handleSearch = () => {
    setAppliedSearch({ type: searchType, term: searchTerm.trim() })
  }

  const handleUpdateStatus = async (orderId, nextStatus) => {
    const actionLabel = nextStatus === "SHIPPING" ? "배송을 시작" : "배송을 완료"
    if (!window.confirm(`해당 주문의 ${actionLabel}하시겠습니까?`)) return

    setUpdatingOrderId(orderId)
    try {
      await updateSellerOrderStatus(orderId, nextStatus)
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus, statusLabel: STATUS_LABEL[nextStatus] } : o))
      )
    } catch (err) {
      alert(err.response?.data?.message || err.message || "주문 상태 변경에 실패했습니다.")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleSearchClear = () => {
    setSearchTerm("")
    setAppliedSearch({ type: searchType, term: "" })
  }

  const filteredOrders = useMemo(() => {
    let list = activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab)
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

  const selectedDelivery = selectedOrder?.delivery ?? {}

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
                key={tab.value}
                className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                <span className={styles.tabCount}>
                  {tab.value === "ALL" ? orders.length : orders.filter((o) => o.status === tab.value).length}
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
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>불러오는 중...</td></tr>
                ) : errorMessage ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>{errorMessage}</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>해당 조건의 주문이 없습니다.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.orderItemId ?? order.orderId}>
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
                      <td>{formatPrice(order.totalPrice)}원</td>
                      <td>{formatDate(order.orderedAt)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[order.status]]}`}>
                          {getStatusLabel(order)}
                        </span>
                      </td>
                      <td>
                        {order.status === "PAID" && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleUpdateStatus(order.orderId, "SHIPPING")}
                            disabled={updatingOrderId === order.orderId}
                          >
                            배송 시작
                          </button>
                        )}
                        {order.status === "SHIPPING" && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleUpdateStatus(order.orderId, "DELIVERED")}
                            disabled={updatingOrderId === order.orderId}
                          >
                            배송 완료
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
                  <div className={styles.detailRow}><span className={styles.detailLabel}>결제금액</span><span className={styles.detailValue}>{formatPrice(selectedOrder.totalPrice)}원</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>주문일</span><span className={styles.detailValue}>{formatDate(selectedOrder.orderedAt)}</span></div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상태</span>
                    <span className={`${styles.statusBadge} ${styles[STATUS_BADGE_CLASS[selectedOrder.status]]}`}>{getStatusLabel(selectedOrder)}</span>
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
                  <div className={styles.detailRow}><span className={styles.detailLabel}>수령인</span><span className={styles.detailValue}>{selectedDelivery.recipientName ?? "-"}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>연락처</span><span className={styles.detailValue}>{selectedDelivery.phone ?? "-"}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>우편번호</span><span className={styles.detailValue}>{selectedDelivery.zipCode ?? "-"}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>주소</span><span className={styles.detailValue}>{selectedDelivery.address ?? "-"}</span></div>
                  {selectedDelivery.addressDetail && (
                    <div className={styles.detailRow}><span className={styles.detailLabel}>상세주소</span><span className={styles.detailValue}>{selectedDelivery.addressDetail}</span></div>
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
