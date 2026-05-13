import { useMemo, useState } from "react"
import { CheckCircle, X, XCircle } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getClaimAttachments, getClaimDetail } from "../../api/sellerApi"
import {
  useApproveClaimMutation,
  useRejectClaimMutation,
  useSellerClaims,
} from "../../query/useSellerClaimQuery"
import ImagePreviewModal from "../../components/common/ImagePreviewModal"
import styles from "./SellerRefundPage.module.css"

const CLAIM_TYPE_LABEL = { EXCHANGE: "교환", RETURN: "반품" }
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
const PROCESSABLE_STATUS = "SUBMITTED"

const STATUS_TABS = [
  { value: "ALL", label: "전체" },
  { value: "SUBMITTED", label: "접수" },
  { value: "IN_PROGRESS", label: "처리중" },
  { value: "COMPLETED", label: "완료" },
  { value: "REJECTED", label: "반려" },
  { value: "CANCELLED", label: "취소" },
]

const CLAIM_STATUS_LABEL = {
  SUBMITTED: "판매자 확인 대기",
  IN_PROGRESS: "관리자 확인중",
  COMPLETED: "처리완료",
  REJECTED: "반려",
  CANCELLED: "취소됨",
}

const CLAIM_STATUS_CLASS = {
  SUBMITTED: "statusSubmitted",
  IN_PROGRESS: "statusProgress",
  COMPLETED: "statusCompleted",
  REJECTED: "statusRejected",
  CANCELLED: "statusCancelled",
}

const isProcessableClaim = (claim) => claim?.status === PROCESSABLE_STATUS

const formatAmount = (amount) => {
  if (amount == null) return "-"
  const numberAmount = Number(amount)
  if (numberAmount < 0) return `추가 결제 ${Math.abs(numberAmount).toLocaleString()}원`
  return `${numberAmount.toLocaleString()}원`
}

export default function SellerRefundPage() {
  const { data: claims = [], isLoading, isError } = useSellerClaims()
  const approveMutation = useApproveClaimMutation()
  const rejectMutation = useRejectClaimMutation()

  const [activeTab, setActiveTab] = useState("ALL")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [detailLoadingId, setDetailLoadingId] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [rejectModalClaimId, setRejectModalClaimId] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  const filteredClaims = useMemo(() => {
    if (activeTab === "ALL") return claims
    return claims.filter((claim) => claim.status === activeTab)
  }, [claims, activeTab])

  const pendingCount = useMemo(
    () => claims.filter((claim) => claim.status === PROCESSABLE_STATUS).length,
    [claims]
  )

  const handleApprove = async (claimId) => {
    const target = claims.find((claim) => claim.claimId === claimId)
    if (!isProcessableClaim(target)) {
      alert("이미 처리된 요청입니다.")
      return
    }

    const typeLabel = CLAIM_TYPE_LABEL[target?.claimType] ?? "요청"
    if (!window.confirm(`${typeLabel} 요청을 승인하시겠습니까?`)) return

    setProcessingId(claimId)
    try {
      await approveMutation.mutateAsync(claimId)
      setSelectedRequest(null)
    } catch {
      alert("승인 처리 중 오류가 발생했습니다.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectOpen = (claimId) => {
    setRejectReason("")
    setRejectModalClaimId(claimId)
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return alert("반려 사유를 입력해주세요.")
    try {
      await rejectMutation.mutateAsync({ claimId: rejectModalClaimId, rejectReason: rejectReason.trim() })
      setRejectModalClaimId(null)
      setSelectedRequest(null)
    } catch {
      alert("반려 처리 중 오류가 발생했습니다.")
    }
  }

  const handleOpenDetail = async (request) => {
    setDetailLoadingId(request.claimId)
    try {
      const [detail, attachments] = await Promise.all([
        getClaimDetail(request.claimId),
        getClaimAttachments(request.claimId),
      ])
      setSelectedRequest({ ...request, ...detail, attachments: attachments ?? [] })
    } catch {
      alert("요청 상세 정보를 불러오지 못했습니다.")
    } finally {
      setDetailLoadingId(null)
    }
  }

  return (
    <div className={styles.sellerLayout}>
      <SellerSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>교환/반품 처리</h1>

        <div className={styles.section}>
          <div className={styles.countBar}>
            <span className={styles.countText}>
              처리 대기 {isLoading ? "..." : `${pendingCount}건`} / 전체 {isLoading ? "..." : `${claims.length}건`}
            </span>
            <p className={styles.notice}>승인 처리 후 관리자의 최종 승인을 거쳐 완료됩니다.</p>
          </div>

          <div className={styles.tabs}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                <span className={styles.tabCount}>
                  {tab.value === "ALL"
                    ? claims.length
                    : claims.filter((claim) => claim.status === tab.value).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유형</th>
                  <th>사유</th>
                  <th>상태</th>
                  <th>상세내용</th>
                  <th>환불금액</th>
                  <th>수거방법</th>
                  <th>신청일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>불러오는 중...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>교환/반품 요청을 불러오지 못했습니다.</td>
                  </tr>
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      해당 조건의 교환/반품 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((request) => (
                    <tr key={request.claimId}>
                      <td className={styles.idCell}>#{request.claimId}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[TYPE_CLASS[request.claimType]]}`}>
                          {CLAIM_TYPE_LABEL[request.claimType] ?? request.claimType}
                        </span>
                      </td>
                      <td>{REASON_LABEL[request.reasonCode] ?? request.reasonCode}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[CLAIM_STATUS_CLASS[request.status]]}`}>
                          {CLAIM_STATUS_LABEL[request.status] ?? request.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.buyerBtn}
                          onClick={() => handleOpenDetail(request)}
                          disabled={detailLoadingId === request.claimId}
                        >
                          {detailLoadingId === request.claimId ? "불러오는 중" : "상세보기"}
                        </button>
                      </td>
                      <td>{formatAmount(request.refundAmount)}</td>
                      <td>{request.pickupMethod === "COURIER" ? "택배" : "방문"}</td>
                      <td>{request.createdAt?.slice(0, 10)}</td>
                      <td>
                        {isProcessableClaim(request) ? (
                          <div className={styles.actionGroup}>
                            <button
                              className={`${styles.actionBtn} ${styles.approveBtn}`}
                              onClick={() => handleApprove(request.claimId)}
                              disabled={processingId === request.claimId}
                            >
                              <CheckCircle size={14} />
                              승인
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.rejectBtn}`}
                              onClick={() => handleRejectOpen(request.claimId)}
                              disabled={processingId === request.claimId}
                            >
                              <XCircle size={14} />
                              반려
                            </button>
                          </div>
                        ) : (
                          <span className={styles.processedText}>처리 완료</span>
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

      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />

      {rejectModalClaimId && (
        <div className={styles.modalOverlay} onClick={() => setRejectModalClaimId(null)}>
          <div className={styles.rejectModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>반려 사유 입력</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setRejectModalClaimId(null)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.rejectModalBody}>
              <textarea
                className={styles.rejectTextarea}
                placeholder="반려 사유를 입력해주세요."
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                onClick={() => setRejectModalClaimId(null)}
              >
                취소
              </button>
              <button
                className={`${styles.actionBtn} ${styles.rejectBtn}`}
                onClick={handleRejectSubmit}
                disabled={rejectMutation.isPending}
              >
                <XCircle size={14} />
                {rejectMutation.isPending ? "처리 중..." : "반려 확인"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <span className={styles.detailLabel}>상태</span>
                    <span className={`${styles.statusBadge} ${styles[CLAIM_STATUS_CLASS[selectedRequest.status]]}`}>
                      {CLAIM_STATUS_LABEL[selectedRequest.status] ?? selectedRequest.status}
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
                  {selectedRequest.refundAmount != null && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        {Number(selectedRequest.refundAmount) < 0 ? "추가 결제 금액" : "환불금액"}
                      </span>
                      <span className={styles.detailValue}>
                        {Math.abs(Number(selectedRequest.refundAmount)).toLocaleString()}원
                      </span>
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>신청일</span>
                    <span className={styles.detailValue}>
                      {selectedRequest.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                  {selectedRequest.rejectReason && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>반려 사유</span>
                      <span className={styles.detailValue}>{selectedRequest.rejectReason}</span>
                    </div>
                  )}
                  {selectedRequest.attachments?.length > 0 && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>첨부 이미지</span>
                      <div className={styles.attachmentList}>
                        {selectedRequest.attachments.map((attachment) => (
                          <img
                            key={attachment.attachmentId}
                            src={attachment.imageUrl}
                            alt="클레임 첨부"
                            className={styles.attachmentImage}
                            onClick={() => setPreviewSrc(attachment.imageUrl)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isProcessableClaim(selectedRequest) && (
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.actionBtn} ${styles.rejectBtn}`}
                  onClick={() => handleRejectOpen(selectedRequest.claimId)}
                  disabled={processingId === selectedRequest.claimId}
                >
                  <XCircle size={14} />
                  반려
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.approveBtn}`}
                  onClick={() => handleApprove(selectedRequest.claimId)}
                  disabled={processingId === selectedRequest.claimId}
                >
                  <CheckCircle size={14} />
                  승인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
