import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminRefundPage.module.css"

const mockRefundRequests = [
  { id: 1, orderId: "AP-00000011", memberName: "김민수", productName: "[에스티로더] 갈색병 세럼 50ml", amount: 89000, reason: "단순 변심", requestedAt: "2026-04-15", sellerHandled: true },
  { id: 2, orderId: "AP-00000015", memberName: "이영희", productName: "[나이키] 에어맥스 97", amount: 179000, reason: "상품 불량", requestedAt: "2026-04-16", sellerHandled: true },
  { id: 3, orderId: "AP-00000018", memberName: "박지성", productName: "[설화수] 윤조에센스 60ml", amount: 128000, reason: "오배송", requestedAt: "2026-04-17", sellerHandled: true },
]

export default function AdminRefundPage() {
  const [requests, setRequests] = useState(mockRefundRequests)

  const handleApprove = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>환불 최종 승인</h1>
        <p className={styles.pageDesc}>판매자가 처리한 환불 요청을 최종 승인하는 페이지입니다.</p>

        <div className={styles.section}>
          {requests.length === 0 ? (
            <div className={styles.emptyState}>대기 중인 환불 요청이 없습니다.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>주문번호</th>
                    <th>신청자</th>
                    <th>상품명</th>
                    <th>환불금액</th>
                    <th>사유</th>
                    <th>신청일</th>
                    <th>최종 처리</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className={styles.idCell}>{req.id}</td>
                      <td className={styles.orderIdCell}>{req.orderId}</td>
                      <td className={styles.nameCell}>{req.memberName}</td>
                      <td className={styles.ellipsis}>{req.productName}</td>
                      <td className={styles.amountCell}>{req.amount.toLocaleString()}원</td>
                      <td>{req.reason}</td>
                      <td>{req.requestedAt}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApprove(req.id)}
                        >
                          <CheckCircle size={14} />
                          승인
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => handleReject(req.id)}
                        >
                          <XCircle size={14} />
                          거절
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
