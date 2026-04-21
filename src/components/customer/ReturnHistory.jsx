import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Package, RotateCcw, ArrowLeftRight } from "lucide-react";
import styles from "./ReturnHistory.module.css";

const DUMMY_HISTORY = [
    {
        id: "RET-20260418-001",
        type: "return",
        status: "처리완료",
        appliedAt: "2026.04.18",
        orderId: "AP-20260410002",
        product: {
            name: "[뷰티스타일샵] 수분 세럼 30ml",
            option: "30ml / 1개",
            qty: 1,
            price: 34000,
            image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop",
        },
        reason: "단순 변심",
        detail: "다른 제품으로 구매 예정이라 반품 원합니다.",
        pickup: "택배 수거",
        refundAmount: 34000,
        refundMethod: "신용카드 취소",
        completedAt: "2026.04.20",
    },
    {
        id: "EXC-20260415-003",
        type: "exchange",
        status: "처리중",
        appliedAt: "2026.04.15",
        orderId: "AP-20260405003",
        product: {
            name: "[아넬로] 미니 크로스백",
            option: "블랙 / 1개",
            qty: 1,
            price: 45000,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop",
        },
        reason: "색상 변경",
        detail: "브라운 색상으로 교환 원합니다.",
        pickup: "택배 수거",
        exchangeOption: "브라운 / 1개",
        completedAt: null,
    },
    {
        id: "RET-20260401-002",
        type: "return",
        status: "신청완료",
        appliedAt: "2026.04.01",
        orderId: "AP-20260325005",
        product: {
            name: "[나이키] 에어맥스 270",
            option: "270mm / 화이트",
            qty: 1,
            price: 139000,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
        },
        reason: "상품 불량/파손",
        detail: "박스 개봉 시 밑창 접착 불량 발견했습니다.",
        pickup: "택배 수거",
        refundAmount: 139000,
        refundMethod: "신용카드 취소",
        completedAt: null,
    },
    {
        id: "EXC-20260320-005",
        type: "exchange",
        status: "반려",
        appliedAt: "2026.03.20",
        orderId: "AP-20260310004",
        product: {
            name: "[클래식 화이트 티셔츠]",
            option: "M / 화이트",
            qty: 1,
            price: 29900,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
        },
        reason: "사이즈 변경",
        detail: "",
        pickup: "직접 방문 반납",
        exchangeOption: "L / 화이트",
        rejectReason: "교환 가능 기간(7일)이 초과되었습니다.",
        completedAt: "2026.03.22",
    },
];

const STATUS_CONFIG = {
    신청완료: { bg: "#eff6ff", color: "#2563eb", step: 1 },
    처리중:   { bg: "#fefce8", color: "#ca8a04", step: 2 },
    처리완료: { bg: "#f0fdf4", color: "#16a34a", step: 3 },
    반려:     { bg: "#fef2f2", color: "#dc2626", step: -1 },
};

const PROGRESS_STEPS = ["신청완료", "처리중", "처리완료"];

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

    const FILTERS = ["전체", "반품", "교환"];

    const filtered = DUMMY_HISTORY.filter(item => {
        if (filter === "전체") return true;
        if (filter === "반품") return item.type === "return";
        if (filter === "교환") return item.type === "exchange";
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
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className={styles.empty}>
                    <Package size={40} />
                    <p>신청 내역이 없습니다.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {filtered.map(item => {
                        const st = STATUS_CONFIG[item.status] ?? { bg: "#f3f4f6", color: "#6b7280" };
                        const isOpen = expandedId === item.id;
                        return (
                            <div key={item.id} className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
                                {/* 카드 헤더 */}
                                <button className={styles.cardHeader} onClick={() => toggle(item.id)}>
                                    <div className={styles.cardHeaderLeft}>
                                        <div className={styles.typeIcon}>
                                            {item.type === "return"
                                                ? <RotateCcw size={16} />
                                                : <ArrowLeftRight size={16} />
                                            }
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardId}>{item.id}</span>
                                            <span className={styles.cardDate}>{item.appliedAt} 신청</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardHeaderRight}>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: st.bg, color: st.color }}
                                        >
                                            {item.status}
                                        </span>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </button>

                                {/* 상품 미리보기 (항상 표시) */}
                                <div className={styles.productRow}>
                                    <img src={item.product.image} alt={item.product.name} className={styles.productImg} />
                                    <div className={styles.productInfo}>
                                        <span className={styles.typeBadge} style={{ backgroundColor: st.bg, color: st.color }}>
                                            {item.type === "return" ? "반품" : "교환"}
                                        </span>
                                        <p className={styles.productName}>{item.product.name}</p>
                                        <p className={styles.productOption}>{item.product.option} / {item.product.qty}개</p>
                                        <p className={styles.productPrice}>{item.product.price.toLocaleString()}원</p>
                                    </div>
                                </div>

                                {/* 펼침 상세 */}
                                {isOpen && (
                                    <div className={styles.detail}>
                                        {/* 진행 상태 바 */}
                                        {item.status !== "반려" && <ProgressBar status={item.status} />}

                                        {/* 반려 안내 */}
                                        {item.status === "반려" && (
                                            <div className={styles.rejectBox}>
                                                <p className={styles.rejectLabel}>반려 사유</p>
                                                <p className={styles.rejectText}>{item.rejectReason}</p>
                                            </div>
                                        )}

                                        <div className={styles.infoTable}>
                                            <div className={styles.infoRow}>
                                                <span>주문번호</span>
                                                <strong>{item.orderId}</strong>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span>신청 사유</span>
                                                <strong>{item.reason}</strong>
                                            </div>
                                            {item.detail && (
                                                <div className={styles.infoRow}>
                                                    <span>상세 내용</span>
                                                    <strong>{item.detail}</strong>
                                                </div>
                                            )}
                                            <div className={styles.infoRow}>
                                                <span>수거 방법</span>
                                                <strong>{item.pickup}</strong>
                                            </div>
                                            {item.type === "exchange" && item.exchangeOption && (
                                                <div className={styles.infoRow}>
                                                    <span>교환 옵션</span>
                                                    <strong>{item.exchangeOption}</strong>
                                                </div>
                                            )}
                                            {item.type === "return" && item.refundAmount && (
                                                <>
                                                    <div className={styles.infoRow}>
                                                        <span>환불 금액</span>
                                                        <strong className={styles.refundAmount}>{item.refundAmount.toLocaleString()}원</strong>
                                                    </div>
                                                    <div className={styles.infoRow}>
                                                        <span>환불 수단</span>
                                                        <strong>{item.refundMethod}</strong>
                                                    </div>
                                                </>
                                            )}
                                            {item.completedAt && (
                                                <div className={styles.infoRow}>
                                                    <span>처리 완료일</span>
                                                    <strong>{item.completedAt}</strong>
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
