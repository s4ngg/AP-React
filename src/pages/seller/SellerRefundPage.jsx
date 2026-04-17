import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import styles from "./SellerRefundPage.module.css"

// 임시 환불/교환 요청 데이터 (추후 API 연동 예정)
const mockRefundRequests = [
  { id: 1, orderId: "AP-00000007", memberName: "이영희", productName: "[뷰티스타일샵] 선크림 SPF50+", amount: 28000, type: "환불", reason: "상품 불량", requestedAt: "2026-04-15" },
  { id: 2, orderId: "AP-00000005", memberName: "박지성", productName: "[뷰티스타일샵] 수분 세럼 30ml", amount: 45000, type: "교환", reason: "단순 변심", requestedAt: "2026-04-14" },
]

const TYPE_CLASS = {
  환불: "typeRefund",
  교환: "typeExchange",
}

export default function SellerRefundPage() {
  const [requests, setRequests] = useState(mockRefundRequests)

  const handleApprove = (id, orderId, type) => {
    if (!window.confirm(`주문 ${orderId}의 ${type} 요청을 승인하시겠습니까?\n최종 처리는 관리자 승인 후 완료됩니다.`)) return
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleReject = (id, orderId) => {
    if (!window.confirm(`주문 ${orderId}의 요청을 거절하시겠습니까?`)) return
    setRequests((prev) => prev.filter((r) => r.id !== id))
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
                      <td>{req.memberName}</td>
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
    </div>
  )
}
