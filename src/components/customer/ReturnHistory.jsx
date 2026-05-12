import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Package, RotateCcw, ArrowLeftRight } from "lucide-react";
import styles from "./ReturnHistory.module.css";
import { useMyClaims } from "../../query/useClaimQuery.js";

const CLAIM_TYPE_LABEL = { RETURN: "반품", EXCHANGE: "교환" };

const REASON_LABEL = {
    CHANGE_MIND: "단순 변심", SIZE_COLOR: "사이즈/색상 불만족",
    DESCRIPTION_DIFF: "상품 설명과 다름", SIZE_CHANGE: "사이즈 변경",
    COLOR_CHANGE: "색상 변경", DEFECT: "상품 불량/파손",
    WRONG_ITEM: "오배송 (다른 상품 수령)", MISSING_ITEM: "구성품 누락", ETC: "기타",
};

const PICKUP_LABEL = { COURIER: "택배 수거", VISIT: "직접 방문 반납" };

const STATUS_CONFIG = {
    SUBMITTED:   { label: "신청완료", bg: "#eff6ff", color: "#2563eb", step: 1 },
    IN_PROGRESS: { label: "처리중",   bg: "#fefce8", color: "#ca8a04", step: 2 },
    COMPLETED:   { label: "처리완료", bg: "#f0fdf4", color: "#16a34a", step: 3 },
    REJECTED:    { label: "반려",     bg: "#fef2f2", color: "#dc2626", step: -1 },
    CANCELLED:   { label: "취소됨",   bg: "#f3f4f6", color: "#6b7280", step: -1 },
};

const PROGRESS_STEPS = ["신청완료", "처리중", "처리완료"];

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

function ProgressBar({ status }) {
    const currentStep = STATUS_CONFIG[status]?.step ?? 0;
    if (currentStep === -1) return null;
    return (
        <div className={styles.progressWrap}>
            {PROGRESS_STEPS.map((label, i) => {
                const done = i + 1 < currentStep;
                const active = i + 1 === currentStep;
                return (
                    <React.Fragment key={label}>
                        <div className={styles.progressNode}>
                            <div className={`${styles.progressCircle} ${done ? styles.progressDone : ""} ${active ? styles.progressActive : ""}`}>
                                {done ? "✓" : i + 1}
                            </div>
                            <span className={`${styles.progressLabel} ${active ? styles.progressLabelActive : ""}`}>{label}</span>
                        </div>
                        {i < PROGRESS_STEPS.length - 1 && (
                            <div className={`${styles.progressLine} ${done ? styles.progressLineDone : ""}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default function ReturnHistory({ onBack }) {
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState("전체");
    const { data: claims = [], isLoading, isFetching, isError } = useMyClaims();
    const loading = isLoading || isFetching;

    const FILTERS = ["전체", "반품", "교환"];

    const filtered = claims.filter(item => {
        if (filter === "전체") return true;
        if (filter === "반품") return item.claimType === "RETURN";
        if (filter === "교환") return item.claimType === "EXCHANGE";
        return true;
    });

    const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={onBack}>
                    <ChevronLeft size={16} /> 이전으로
                </button>
                <div className={styles.filterGroup}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
                            onClick={() => setFilter(f)}
                        >{f}</button>
                    ))}
                </div>
            </div>

            {loading && (
                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>
            )}

            {!loading && isError && (
                <div className={styles.empty}>
                    <Package size={40} />
                    <p>신청 내역을 불러오지 못했습니다.</p>
                </div>
            )}

            {!loading && !isError && filtered.length === 0 && (
                <div className={styles.empty}>
                    <Package size={40} />
                    <p>신청 내역이 없습니다.</p>
                </div>
            )}

            {!loading && !isError && (
                <div className={styles.list}>
                    {filtered.map(item => {
                        const st = STATUS_CONFIG[item.status] ?? { label: item.status, bg: "#f3f4f6", color: "#6b7280" };
                        const isOpen = expandedId === item.claimId;
                        return (
                            <div key={item.claimId} className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
                                <button className={styles.cardHeader} onClick={() => toggle(item.claimId)}>
                                    <div className={styles.cardHeaderLeft}>
                                        <div className={styles.typeIcon}>
                                            {item.claimType === "RETURN" ? <RotateCcw size={16} /> : <ArrowLeftRight size={16} />}
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardId}>CLM-{String(item.claimId).padStart(6, "0")}</span>
                                            <span className={styles.cardDate}>{formatDate(item.createdAt)} 신청</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardHeaderRight}>
                                        <span className={styles.statusBadge} style={{ backgroundColor: st.bg, color: st.color }}>
                                            {st.label}
                                        </span>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </button>

                                <div className={styles.productRow}>
                                    <div className={styles.productImgPlaceholder}><Package size={24} /></div>
                                    <div className={styles.productInfo}>
                                        <span className={styles.typeBadge} style={{ backgroundColor: st.bg, color: st.color }}>
                                            {CLAIM_TYPE_LABEL[item.claimType]}
                                        </span>
                                        <p className={styles.productName}>주문 상품 #{item.orderItemId}</p>
                                        <p className={styles.productOption}>{REASON_LABEL[item.reasonCode] ?? item.reasonCode}</p>
                                        {item.refundAmount != null && (
                                            <p className={styles.productPrice}>
                                                {Number(item.refundAmount) < 0
                                                    ? `추가 결제 ${Math.abs(Number(item.refundAmount)).toLocaleString()}원`
                                                    : `${Number(item.refundAmount).toLocaleString()}원`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className={styles.detail}>
                                        {item.status !== "REJECTED" && item.status !== "CANCELLED" && (
                                            <ProgressBar status={item.status} />
                                        )}
                                        {item.status === "REJECTED" && (
                                            <div className={styles.rejectBox}>
                                                <p className={styles.rejectLabel}>반려 사유</p>
                                                <p className={styles.rejectText}>{item.rejectReason}</p>
                                            </div>
                                        )}
                                        <div className={styles.infoTable}>
                                            <div className={styles.infoRow}>
                                                <span>신청 사유</span>
                                                <strong>{REASON_LABEL[item.reasonCode] ?? item.reasonCode}</strong>
                                            </div>
                                            {item.detail && (
                                                <div className={styles.infoRow}>
                                                    <span>상세 내용</span>
                                                    <strong>{item.detail}</strong>
                                                </div>
                                            )}
                                            <div className={styles.infoRow}>
                                                <span>수거 방법</span>
                                                <strong>{PICKUP_LABEL[item.pickupMethod] ?? item.pickupMethod}</strong>
                                            </div>
                                            {item.claimType === "EXCHANGE" && item.exchangeOption && (
                                                <div className={styles.infoRow}>
                                                    <span>교환 옵션</span>
                                                    <strong>{item.exchangeOption}</strong>
                                                </div>
                                            )}
                                            {item.claimType === "RETURN" && item.refundAmount != null && (
                                                <div className={styles.infoRow}>
                                                    <span>{Number(item.refundAmount) < 0 ? "추가 결제 금액" : "환불 금액"}</span>
                                                    <strong className={Number(item.refundAmount) < 0 ? styles.additionalCharge : styles.refundAmount}>
                                                        {Math.abs(Number(item.refundAmount)).toLocaleString()}원
                                                    </strong>
                                                </div>
                                            )}
                                            {item.claimType === "RETURN" && Number(item.refundAmount) < 0 && (
                                                <div className={styles.infoRow}>
                                                    <span></span>
                                                    <button
                                                        className={styles.additionalPayBtn}
                                                        onClick={() => alert("추가 결제 기능은 현재 구현 예정입니다.")}
                                                    >
                                                        추가 결제하기
                                                    </button>
                                                </div>
                                            )}
                                            {item.completedAt && (
                                                <div className={styles.infoRow}>
                                                    <span>처리 완료일</span>
                                                    <strong>{formatDate(item.completedAt)}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
