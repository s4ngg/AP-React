import { useState, useEffect } from "react"
import { RefreshCcw, X, ChevronDown, ChevronUp } from "lucide-react"
import SellerSidebar from "../../components/seller/SellerSidebar"
import { getSellerClaims, approveClaim, rejectClaim } from "../../api/sellerApi"
import styles from "./SellerClaimPage.module.css"

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
const STATUS_LABEL = {
    SUBMITTED: "접수",
    IN_PROGRESS: "처리중",
    COMPLETED: "완료",
    REJECTED: "거부",
    CANCELLED: "취소",
}
const STATUS_CLASS = {
    SUBMITTED: "statusPaid",
    IN_PROGRESS: "statusPreparing",
    COMPLETED: "statusDone",
    REJECTED: "statusCancel",
    CANCELLED: "statusCancel",
}

export default function SellerClaimPage() {
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)
    const [rejectModal, setRejectModal] = useState(null)
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        getSellerClaims()
            .then((data) => setClaims(data ?? []))
            .catch((err) => console.error("클레임 목록 조회 실패", err))
            .finally(() => setLoading(false))
    }, [])

    const handleToggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

    const handleApprove = async (claimId) => {
        if (!window.confirm("클레임을 승인하시겠습니까?")) return
        try {
            await approveClaim(claimId)
            setClaims((prev) =>
                prev.map((c) => (c.claimId === claimId ? { ...c, status: "COMPLETED" } : c))
            )
        } catch {
            alert("승인 처리 중 오류가 발생했습니다.")
        }
    }

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) return
        try {
            await rejectClaim(rejectModal, rejectReason)
            setClaims((prev) =>
                prev.map((c) =>
                    c.claimId === rejectModal ? { ...c, status: "REJECTED", rejectReason } : c
                )
            )
            setRejectModal(null)
            setRejectReason("")
        } catch {
            alert("거부 처리 중 오류가 발생했습니다.")
        }
    }

    const pendingCount = claims.filter((c) => c.status === "SUBMITTED").length

    return (
        <div className={styles.sellerLayout}>
            <SellerSidebar />
            <main className={styles.content}>
                <h1 className={styles.pageTitle}>클레임 관리</h1>

                <div className={styles.section}>
                    <div className={styles.countBar}>
                        <span className={styles.countText}>전체 {claims.length}건</span>
                        {pendingCount > 0 && (
                            <span className={styles.pendingBadge}>처리대기 {pendingCount}건</span>
                        )}
                    </div>

                    {loading ? (
                        <p className={styles.emptyText}>불러오는 중...</p>
                    ) : claims.length === 0 ? (
                        <div className={styles.empty}>
                            <RefreshCcw size={36} color="#d1d5db" />
                            <p>클레임이 없습니다.</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>클레임 ID</th>
                                        <th>유형</th>
                                        <th>사유</th>
                                        <th>수거방법</th>
                                        <th>환불금액</th>
                                        <th>접수일</th>
                                        <th>상태</th>
                                        <th>처리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map((claim) => (
                                        <>
                                            <tr
                                                key={claim.claimId}
                                                className={styles.clickableRow}
                                                onClick={() => handleToggle(claim.claimId)}
                                            >
                                                <td className={styles.claimId}>#{claim.claimId}</td>
                                                <td>{CLAIM_TYPE_LABEL[claim.claimType] ?? claim.claimType}</td>
                                                <td>{REASON_LABEL[claim.reasonCode] ?? claim.reasonCode}</td>
                                                <td>{claim.pickupMethod === "COURIER" ? "택배" : "방문"}</td>
                                                <td>
                                                    {claim.refundAmount
                                                        ? `${Number(claim.refundAmount).toLocaleString()}원`
                                                        : "-"}
                                                </td>
                                                <td>{claim.createdAt?.slice(0, 10)}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[claim.status]]}`}>
                                                        {STATUS_LABEL[claim.status] ?? claim.status}
                                                    </span>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    {claim.status === "SUBMITTED" && (
                                                        <div className={styles.actionButtons}>
                                                            <button
                                                                className={styles.approveBtn}
                                                                onClick={() => handleApprove(claim.claimId)}
                                                            >
                                                                승인
                                                            </button>
                                                            <button
                                                                className={styles.rejectBtn}
                                                                onClick={() => setRejectModal(claim.claimId)}
                                                            >
                                                                거부
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                            {expandedId === claim.claimId && (
                                                <tr key={`detail-${claim.claimId}`}>
                                                    <td colSpan={8} className={styles.expandedRow}>
                                                        <div className={styles.expandedContent}>
                                                            {claim.detail && (
                                                                <div className={styles.detailRow}>
                                                                    <span className={styles.detailLabel}>상세내용</span>
                                                                    <span className={styles.detailValue}>{claim.detail}</span>
                                                                </div>
                                                            )}
                                                            {claim.rejectReason && (
                                                                <div className={styles.detailRow}>
                                                                    <span className={styles.detailLabel}>거부사유</span>
                                                                    <span className={styles.detailValue}>{claim.rejectReason}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {rejectModal && (
                <div className={styles.modalOverlay} onClick={() => setRejectModal(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>클레임 거부 사유</h2>
                            <button
                                className={styles.modalCloseBtn}
                                onClick={() => setRejectModal(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <textarea
                                className={styles.rejectTextarea}
                                placeholder="거부 사유를 입력하세요"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                            />
                            <div className={styles.modalActions}>
                                <button className={styles.cancelBtn} onClick={() => setRejectModal(null)}>
                                    취소
                                </button>
                                <button
                                    className={styles.submitBtn}
                                    onClick={handleRejectSubmit}
                                    disabled={!rejectReason.trim()}
                                >
                                    거부 확정
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}