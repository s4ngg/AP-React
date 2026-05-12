import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { formatDate } from "../../utils/format"
import {
  getAdminClaims,
  rejectAdminClaim,
  updateClaimStatus,
} from "../../api/claimApi"
import styles from "./AdminRefundPage.module.css"

const reasonLabel = {
  CHANGE_MIND: "단순 변심",
  SIZE_COLOR: "사이즈/색상 불만족",
  DESCRIPTION_DIFF: "상품 설명과 다름",
  DEFECT: "상품 불량/파손",
  WRONG_ITEM: "오배송",
  MISSING_ITEM: "구성품 누락",
  ETC: "기타",
}

const statusLabel = {
  SUBMITTED: "접수",
  IN_PROGRESS: "처리중",
  COMPLETED: "완료",
  REJECTED: "거절",
  CANCELLED: "취소",
}

const visibleStatuses = ["SUBMITTED", "IN_PROGRESS"]
const ADMIN_PROCESSABLE_STATUS = "IN_PROGRESS"

const formatPrice = (amount) => {
  const num = Number(amount ?? 0)
  if (num < 0) return `추가 결제 ${Math.abs(num).toLocaleString()}`
  return num.toLocaleString()
}


export default function AdminRefundPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const fetchClaims = useCallback(() => {
    setLoading(true)
    getAdminClaims()
      .then((data) => setClaims(data ?? []))
      .catch(() => alert("환불 요청 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(fetchClaims, 0)
    return () => clearTimeout(timeoutId)
  }, [fetchClaims])

  const refundRequests = useMemo(
    () =>
      claims.filter(
        (claim) =>
          claim.claimType === "RETURN" && visibleStatuses.includes(claim.status)
      ),
    [claims]
  )

  const adminProcessableCount = useMemo(
    () => refundRequests.filter((claim) => claim.status === ADMIN_PROCESSABLE_STATUS).length,
    [refundRequests]
  )

  const handleApprove = (claim) => {
    if (claim.status !== ADMIN_PROCESSABLE_STATUS) {
      alert("판매자 확인이 완료된 환불 요청만 관리자 승인할 수 있습니다.")
      return
    }

    if (!window.confirm("환불 요청을 최종 승인하시겠습니까?")) return

    setProcessingId(claim.claimId)
    updateClaimStatus(claim.claimId, "COMPLETED")
      .then(fetchClaims)
      .catch(() => alert("환불 승인 처리에 실패했습니다."))
      .finally(() => setProcessingId(null))
  }

  const handleReject = (claim) => {
    if (claim.status !== ADMIN_PROCESSABLE_STATUS) {
      alert("판매자 확인이 완료된 환불 요청만 관리자 거절할 수 있습니다.")
      return
    }

    const rejectReason = window.prompt("거절 사유를 입력해주세요.")
    if (rejectReason === null) return
    if (!rejectReason.trim()) {
      alert("거절 사유는 필수입니다.")
      return
    }

    setProcessingId(claim.claimId)
    rejectAdminClaim(claim.claimId, rejectReason.trim())
      .then(fetchClaims)
      .catch(() => alert("환불 거절 처리에 실패했습니다."))
      .finally(() => setProcessingId(null))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>환불 승인</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>
              관리자 처리 대기 {adminProcessableCount}건 / 전체 환불 요청 {refundRequests.length}건
            </span>
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
                  <th>상태</th>
                  <th>신청일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      불러오는 중...
                    </td>
                  </tr>
                ) : refundRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      환불 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  refundRequests.map((claim) => (
                    <tr key={claim.claimId}>
                      <td className={styles.idCell}>{claim.claimId}</td>
                      <td className={styles.orderId}>{claim.orderNumber ?? claim.orderItemId}</td>
                      <td>{claim.memberName ?? claim.memberId}</td>
                      <td className={styles.productName}>{claim.productName ?? "-"}</td>
                      <td>{formatPrice(claim.refundAmount)}원</td>
                      <td>{reasonLabel[claim.reasonCode] ?? claim.reasonCode}</td>
                      <td>
                        <span className={styles.statusBadge}>
                          {statusLabel[claim.status] ?? claim.status}
                        </span>
                      </td>
                      <td>{formatDate(claim.createdAt)}</td>
                      <td>
                        {claim.status === ADMIN_PROCESSABLE_STATUS ? (
                          <div className={styles.actionGroup}>
                            <button
                              className={`${styles.actionBtn} ${styles.approveBtn}`}
                              onClick={() => handleApprove(claim)}
                              disabled={processingId === claim.claimId}
                            >
                              <CheckCircle size={14} />
                              승인
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.rejectBtn}`}
                              onClick={() => handleReject(claim)}
                              disabled={processingId === claim.claimId}
                            >
                              <XCircle size={14} />
                              거절
                            </button>
                          </div>
                        ) : (
                          <span className={styles.waitingText}>판매자 확인 대기</span>
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
