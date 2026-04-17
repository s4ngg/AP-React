import { useState } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerRefundPage.module.css"

// 임시 환불/교환 요청 데이터 — members + delivery_addresses 기준 (추후 API 연동 예정)
const mockRefundRequests = [
  {
    id: 1,
    orderId: "AP-00000007",
    memberName: "이영희",
    memberEmail: "younghee@example.com",
    memberPhone: "010-5555-6666",
    productName: "[뷰티스타일샵] 선크림 SPF50+",
    amount: 28000,
    type: "환불",
    reason: "상품 불량",
    requestedAt: "2026-04-15",
    delivery: {
      recipientName: "이영희",
      phone: "010-5555-6666",
      zipCode: "03000",
      address: "서울특별시 종로구 OO길 45",
      addressDetail: "2층",
    },
  },
  {
    id: 2,
    orderId: "AP-00000005",
    memberName: "박지성",
    memberEmail: "jisung@example.com",
    memberPhone: "010-7777-8888",
    productName: "[뷰티스타일샵] 수분 세럼 30ml",
    amount: 45000,
    type: "교환",
    reason: "단순 변심",
    requestedAt: "2026-04-14",
    delivery: {
      recipientName: "박지성",
      phone: "010-7777-8888",
      zipCode: "48000",
      address: "부산광역시 해운대구 OO대로 88",
      addressDetail: "OO호텔 로비",
    },
  },
]

const TYPE_CLASS = {
  환불: "typeRefund",
  교환: "typeExchange",
}

export default function SellerRefundPage() {
  const [requests, setRequests] = useState(mockRefundRequests)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleApprove = (id, orderId, type) => {
    if (!window.confirm(`주문 ${orderId}의 ${type} 요청을 승인하시겠습니까?\n최종 처리는 관리자 승인 후 완료됩니다.`)) return
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setSelectedRequest(null)
  }

  const handleReject = (id, orderId) => {
    if (!window.confirm(`주문 ${orderId}의 요청을 거절하시겠습니까?`)) return
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setSelectedRequest(null)
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>환불/교환 처리</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>처리 대기 {requests.length}건</span>
            <p className={styles.notice}>승인 처리 후 관리자의 최종 승인을 거쳐 완료됩니다.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>주문번호</th>
                  <th>구매자</th>
                  <th>상품명</th>
                  <th>금액</th>
                  <th>유형</th>
                  <th>사유</th>
                  <th>신청일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      처리할 환불/교환 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td className={styles.idCell}>{req.id}</td>
                      <td className={styles.orderId}>{req.orderId}</td>
                      <td>
                        <button
                          className={styles.buyerBtn}
                          onClick={() => setSelectedRequest(req)}
                        >
                          {req.memberName}
                        </button>
                      </td>
                      <td className={styles.productName}>{req.productName}</td>
                      <td>{req.amount.toLocaleString()}원</td>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[TYPE_CLASS[req.type]]}`}>
                          {req.type}
                        </span>
                      </td>
                      <td>{req.reason}</td>
                      <td>{req.requestedAt}</td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleApprove(req.id, req.orderId, req.type)}
                          >
                            <CheckCircle size={14} />
                            승인
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => handleReject(req.id, req.orderId)}
                          >
                            <XCircle size={14} />
                            거절
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 구매자 정보 모달 */}
      {selectedRequest && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRequest(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>요청 상세</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedRequest(null)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* 요청 정보 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>요청 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>주문번호</span>
                    <span className={styles.detailValue}>{selectedRequest.orderId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상품명</span>
                    <span className={styles.detailValue}>{selectedRequest.productName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>금액</span>
                    <span className={styles.detailValue}>{selectedRequest.amount.toLocaleString()}원</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>유형</span>
                    <span className={`${styles.typeBadge} ${styles[TYPE_CLASS[selectedRequest.type]]}`}>
                      {selectedRequest.type}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>사유</span>
                    <span className={styles.detailValue}>{selectedRequest.reason}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>신청일</span>
                    <span className={styles.detailValue}>{selectedRequest.requestedAt}</span>
                  </div>
                </div>
              </div>

              {/* 구매자 정보 — members 테이블 기준 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>구매자 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>이름</span>
                    <span className={styles.detailValue}>{selectedRequest.memberName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>이메일</span>
                    <span className={styles.detailValue}>{selectedRequest.memberEmail}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>연락처</span>
                    <span className={styles.detailValue}>{selectedRequest.memberPhone}</span>
                  </div>
                </div>
              </div>

              {/* 배송지 정보 — delivery_addresses 테이블 기준 */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>배송지 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>수령인</span>
                    <span className={styles.detailValue}>{selectedRequest.delivery.recipientName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>연락처</span>
                    <span className={styles.detailValue}>{selectedRequest.delivery.phone}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>우편번호</span>
                    <span className={styles.detailValue}>{selectedRequest.delivery.zipCode}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>주소</span>
                    <span className={styles.detailValue}>{selectedRequest.delivery.address}</span>
                  </div>
                  {selectedRequest.delivery.addressDetail && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>상세주소</span>
                      <span className={styles.detailValue}>{selectedRequest.delivery.addressDetail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 모달 내 처리 버튼 */}
            <div className={styles.modalFooter}>
              <button
                className={`${styles.actionBtn} ${styles.rejectBtn}`}
                onClick={() => handleReject(selectedRequest.id, selectedRequest.orderId)}
              >
                <XCircle size={14} />
                거절
              </button>
              <button
                className={`${styles.actionBtn} ${styles.approveBtn}`}
                onClick={() => handleApprove(selectedRequest.id, selectedRequest.orderId, selectedRequest.type)}
              >
                <CheckCircle size={14} />
                승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
