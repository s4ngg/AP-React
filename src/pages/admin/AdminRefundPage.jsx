import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminRefundPage.module.css"

// 임시 환불 요청 데이터 (추후 API 연동 예정)
const mockRefundRequests = [
  { id: 1, orderId: "AP-00000003", memberName: "박지성", productName: "[설화수] 윤조에센스 60ml", amount: 128000, reason: "상품 불량", requestedAt: "2026-04-15" },
  { id: 2, orderId: "AP-00000006", memberName: "손예진", productName: "[헤라] 블랙쿠션 파운데이션", amount: 55000, reason: "단순 변심", requestedAt: "2026-04-16" },
  { id: 3, orderId: "AP-00000008", memberName: "유재석", productName: "[나이키] 에어맥스 97 화이트", amount: 179000, reason: "사이즈 불일치", requestedAt: "2026-04-16" },
]

export default function AdminRefundPage() {
  const [refundRequests, setRefundRequests] = useState(mockRefundRequests)

  const handleApprove = (id, orderId) => {
    if (!window.confirm(`주문 ${orderId}의 환불을 승인하시겠습니까?`)) return
    setRefundRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleReject = (id, orderId) => {
    if (!window.confirm(`주문 ${orderId}의 환불을 거절하시겠습니까?`)) return
    setRefundRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>환불 승인</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>환불 요청 {refundRequests.length}건</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>주문번호</th>
                  <th>신청자</th>
                  <th>상품명</th>
                  <th>환불금액</th>
                  <th>환불사유</th>
                  <th>신청일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {refundRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>
                      환불 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  refundRequests.map((req) => (
                    <tr key={req.id}>
                      <td className={styles.idCell}>{req.id}</td>
                      <td className={styles.orderId}>{req.orderId}</td>
                      <td>{req.memberName}</td>
                      <td className={styles.productName}>{req.productName}</td>
                      <td>{req.amount.toLocaleString()}원</td>
                      <td>{req.reason}</td>
                      <td>{req.requestedAt}</td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleApprove(req.id, req.orderId)}
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
