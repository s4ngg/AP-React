import { useState, useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerClaims, approveClaim, rejectClaim, getClaimDetail, getClaimAttachments } from "../../api/sellerApi"
import styles from "./SellerRefundPage.module.css"

const CLAIM_TYPE_LABEL = { EXCHANGE: "교환", RETURN: "환불" }
const REASON_LABEL = {
  CHANGE_MIND: "단순 변심",
  SIZE_COLOR: "사이즈/색상 불만족",
  DESCRIPTION_DIFF: "상품 설명과 다름",
  SIZE_CHANGE: "사이즈 변경",
  COLOR_CHANGE: "색상 변경",
  DEFECT: "상품 불량/파손",
  WRONG_ITEM: "오배송",
  MISSING_ITEM: "구성품 누락",
  ETC: "기타",
}
const TYPE_CLASS = { EXCHANGE: "typeExchange", RETURN: "typeRefund" }

export default function SellerRefundPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectModalId, setRejectModalId] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    getSellerClaims()
      .then((data) =>
        setRequests(
          (data ?? []).filter((c) => c.status === "SUBMITTED" || c.status === "IN_PROGRESS")
        )
      )
      .catch((err) => console.error("환불/교환 목록 조회 실패", err))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (claimId) => {
    const target = requests.find((r) => r.claimId === claimId)
    const typeLabel = CLAIM_TYPE_LABEL[target?.claimType] ?? "요청"
    if (!window.confirm(`${typeLabel} 요청을 승인하시겠습니까?`)) return
    try {
      await approveClaim(claimId)
      setRequests((prev) => prev.filter((r) => r.claimId !== claimId))
      setSelectedRequest(null)
    } catch {
      alert("승인 처리 중 오류가 발생했습니다.")
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return
    try {
      await rejectClaim(rejectModalId, rejectReason)
      setRequests((prev) => prev.filter((r) => r.claimId !== rejectModalId))
      setSelectedRequest(null)
      setRejectModalId(null)
      setRejectReason("")
    } catch {
      alert("거부 처리 중 오류가 발생했습니다.")
    }
  }

  const handleOpenDetail = async (req) => {
    const [detail, attachments] = await Promise.all([
      getClaimDetail(req.claimId),
      getClaimAttachments(req.claimId),
    ])
    setSelectedRequest({ ...req, ...detail, attachments: attachments ?? [] })
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>환불/교환 처리</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>
              처리 대기 {loading ? "..." : `${requests.length}건`}
            </span>
            <p className={styles.notice}>승인 처리 후 관리자의 최종 승인을 거쳐 완료됩니다.</p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유형</th>
                  <th>사유</th>
                  <th>상세내용</th>
                  <th>환불금액</th>
                  <th>수거방법</th>
                  <th>신청일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>불러오는 중...</td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyRow}>
                      처리할 환불/교환 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.claimId}>
                      <td className={styles.idCell}>#{req.claimId}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[TYPE_CLASS[req.claimType]]}`}>
                          {CLAIM_TYPE_LABEL[req.claimType] ?? req.claimType}
                        </span>
                      </td>
                      <td>{REASON_LABEL[req.reasonCode] ?? req.reasonCode}</td>
                      <td>
                        <button
                          className={styles.buyerBtn}
                          onClick={() => handleOpenDetail(req)}
                        >
                          상세보기
                        </button>
                      </td>
                      <td>
                        {req.refundAmount
                          ? `${Number(req.refundAmount).toLocaleString()}원`
                          : "-"}
                      </td>
                      <td>{req.pickupMethod === "COURIER" ? "택배" : "방문"}</td>
                      <td>{req.createdAt?.slice(0, 10)}</td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleApprove(req.claimId)}
                          >
                            <CheckCircle size={14} />
                            승인
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => setRejectModalId(req.claimId)}
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

      {/* 상세보기 모달 */}
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
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>클레임 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>유형</span>
                    <span className={`${styles.typeBadge} ${styles[TYPE_CLASS[selectedRequest.claimType]]}`}>
                      {CLAIM_TYPE_LABEL[selectedRequest.claimType]}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>사유</span>
                    <span className={styles.detailValue}>
                      {REASON_LABEL[selectedRequest.reasonCode] ?? selectedRequest.reasonCode}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>상세내용</span>
                    <span className={styles.detailValue}>{selectedRequest.detail ?? "-"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>수거방법</span>
                    <span className={styles.detailValue}>
                      {selectedRequest.pickupMethod === "COURIER" ? "택배" : "방문"}
                    </span>
                  </div>
                  {selectedRequest.refundAmount && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>환불금액</span>
                      <span className={styles.detailValue}>
                        {Number(selectedRequest.refundAmount).toLocaleString()}원
                      </span>
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>신청일</span>
                    <span className={styles.detailValue}>
                      {selectedRequest.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                  {selectedRequest.attachments?.length > 0 && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>첨부 이미지</span>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {selectedRequest.attachments.map((att) => (
                          <img
                            key={att.attachmentId}
                            src={att.fileUrl}
                            alt="클레임 첨부"
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.actionBtn} ${styles.rejectBtn}`}
                onClick={() => {
                  setSelectedRequest(null)
                  setRejectModalId(selectedRequest.claimId)
                }}
              >
                <XCircle size={14} />
                거절
              </button>
              <button
                className={`${styles.actionBtn} ${styles.approveBtn}`}
                onClick={() => handleApprove(selectedRequest.claimId)}
              >
                <CheckCircle size={14} />
                승인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 거부 사유 모달 */}
      {rejectModalId && (
        <div className={styles.modalOverlay} onClick={() => setRejectModalId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>거절 사유 입력</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setRejectModalId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <textarea
                className={styles.rejectTextarea}
                placeholder="거절 사유를 입력하세요"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.actionBtn} ${styles.rejectBtn}`}
                  onClick={() => setRejectModalId(null)}
                >
                  취소
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.approveBtn}`}
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim()}
                >
                  거절 확정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
