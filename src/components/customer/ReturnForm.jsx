import React, { useState } from 'react';
import {
    AlertCircle, ChevronRight, ChevronLeft,
    Package, RotateCcw, ArrowLeftRight, MapPin, Truck, X
} from "lucide-react";
import styles from "./ReturnForm.module.css";
import { createClaim } from "../../api/claimApi.js";
import { getMyOrders } from "../../api/orderApi.js";

const RETURN_REASONS = [
    { value: "", label: "사유를 선택해주세요" },
    { value: "CHANGE_MIND", label: "단순 변심" },
    { value: "SIZE_COLOR", label: "사이즈/색상 불만족" },
    { value: "DEFECT", label: "상품 불량/파손" },
    { value: "WRONG_ITEM", label: "오배송 (다른 상품 수령)" },
    { value: "MISSING_ITEM", label: "구성품 누락" },
    { value: "DESCRIPTION_DIFF", label: "상품 설명과 다름" },
    { value: "ETC", label: "기타" },
];

const EXCHANGE_REASONS = [
    { value: "", label: "사유를 선택해주세요" },
    { value: "SIZE_CHANGE", label: "사이즈 변경" },
    { value: "COLOR_CHANGE", label: "색상 변경" },
    { value: "DEFECT", label: "상품 불량/파손" },
    { value: "WRONG_ITEM", label: "오배송 (다른 상품 수령)" },
    { value: "MISSING_ITEM", label: "구성품 누락" },
    { value: "ETC", label: "기타" },
];

const REASON_LABEL = {
    CHANGE_MIND: "단순 변심", SIZE_COLOR: "사이즈/색상 불만족",
    DESCRIPTION_DIFF: "상품 설명과 다름", SIZE_CHANGE: "사이즈 변경",
    COLOR_CHANGE: "색상 변경", DEFECT: "상품 불량/파손",
    WRONG_ITEM: "오배송 (다른 상품 수령)", MISSING_ITEM: "구성품 누락", ETC: "기타",
};

const SIMPLE_REASON_CODES = ["CHANGE_MIND", "SIZE_COLOR", "SIZE_CHANGE", "COLOR_CHANGE"];

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export default function ReturnForm({ onBack }) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState("RETURN");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reason, setReason] = useState("");
    const [detail, setDetail] = useState("");
    const [pickup, setPickup] = useState("COURIER");
    const [exchangeOption, setExchangeOption] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submittedClaim, setSubmittedClaim] = useState(null);

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const reasons = type === "RETURN" ? RETURN_REASONS : EXCHANGE_REASONS;

    const handleOpenOrderModal = async () => {
        setShowOrderModal(true);
        if (orders.length > 0) return;
        setOrdersLoading(true);
        try {
            const data = await getMyOrders();
            setOrders(data || []);
        } catch {
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleItemSelect = (order, item) => {
        setSelectedOrder(order);
        setSelectedItem(item);
        setShowOrderModal(false);
    };

    const handleSubmit = async () => {
        if (!selectedItem) { alert("교환/반품할 상품을 선택해주세요."); return; }
        if (!reason) { alert("신청 사유를 선택해주세요."); return; }

        setSubmitting(true);
        try {
            const payload = {
                orderItemId: selectedItem.orderItemId,
                claimType: type,
                reasonCode: reason,
                pickupMethod: pickup,
                ...(detail && { detail }),
                ...(type === "EXCHANGE" && exchangeOption && { exchangeOption }),
            };
            const res = await createClaim(payload);
            setSubmittedClaim(res.data?.data);
            setStep(3);
        } catch {
            alert("신청에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── STEP 3: 완료 화면 ── */
    if (step === 3 && submittedClaim) {
        return (
            <div className={styles.completeWrap}>
                <div className={styles.completeIcon}><RotateCcw size={36} /></div>
                <h3 className={styles.completeTitle}>신청이 완료되었습니다!</h3>
                <p className={styles.completeDesc}>
                    {type === "RETURN" ? "반품" : "교환"} 신청이 정상적으로 접수되었습니다.<br />
                    담당자 확인 후 순차적으로 처리해 드립니다.
                </p>
                <div className={styles.completeSummary}>
                    <div className={styles.summaryRow}>
                        <span>신청 번호</span>
                        <strong>CLM-{String(submittedClaim.claimId).padStart(6, "0")}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>신청 유형</span>
                        <strong>{type === "RETURN" ? "반품" : "교환"}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>상품명</span>
                        <strong>{selectedItem?.productName}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>신청 사유</span>
                        <strong>{REASON_LABEL[submittedClaim.reasonCode]}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>수거 방법</span>
                        <strong>{pickup === "COURIER" ? "택배 수거" : "직접 방문 반납"}</strong>
                    </div>
                </div>
                <div className={styles.completeActions}>
                    <button className={styles.primaryBtn} onClick={onBack}>고객센터 홈으로</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.guideBox}>
                <AlertCircle size={18} />
                <p>교환/반품은 상품 수령 후 <strong>7일 이내</strong>에만 신청 가능합니다. 단순 변심 시 배송비가 발생할 수 있습니다.</p>
            </div>

            <div className={styles.stepBar}>
                {["상품 선택", "신청 정보 입력", "신청 완료"].map((label, i) => (
                    <React.Fragment key={i}>
                        <div className={`${styles.stepNode} ${step === i + 1 ? styles.stepActive : ""} ${step > i + 1 ? styles.stepDone : ""}`}>
                            <div className={styles.stepCircle}>{step > i + 1 ? "✓" : i + 1}</div>
                            <span>{label}</span>
                        </div>
                        {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.stepLineDone : ""}`} />}
                    </React.Fragment>
                ))}
            </div>

            {/* ── STEP 1: 주문 상품 선택 ── */}
            {step === 1 && (
                <div className={styles.stepContent}>
                    <h4 className={styles.sectionTitle}>교환/반품할 상품을 선택해주세요</h4>

                    <div className={styles.inputGroup}>
                        <label>신청 유형 <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={`${styles.radioCard} ${type === "RETURN" ? styles.radioCardActive : ""}`}>
                                <input type="radio" name="type" value="RETURN" checked={type === "RETURN"} onChange={() => { setType("RETURN"); setReason(""); }} />
                                <RotateCcw size={20} />
                                <div><strong>반품</strong><span>상품을 돌려보내고 환불 받기</span></div>
                            </label>
                            <label className={`${styles.radioCard} ${type === "EXCHANGE" ? styles.radioCardActive : ""}`}>
                                <input type="radio" name="type" value="EXCHANGE" checked={type === "EXCHANGE"} onChange={() => { setType("EXCHANGE"); setReason(""); }} />
                                <ArrowLeftRight size={20} />
                                <div><strong>교환</strong><span>다른 사이즈·색상으로 교환하기</span></div>
                            </label>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>주문 상품 선택 <span className={styles.required}>*</span></label>
                        {selectedItem ? (
                            <div className={styles.selectedProductCard}>
                                <div className={styles.productImgPlaceholder}><Package size={24} /></div>
                                <div className={styles.productInfo}>
                                    <p className={styles.productName}>{selectedItem.productName}</p>
                                    <p className={styles.productMeta}>수량: {selectedItem.quantity}개 · {selectedItem.productPrice?.toLocaleString()}원</p>
                                    <p className={styles.productMeta}>{formatDate(selectedOrder?.orderedAt)} 주문</p>
                                </div>
                                <button className={styles.changeBtn} onClick={handleOpenOrderModal}>변경</button>
                            </div>
                        ) : (
                            <div className={styles.orderSelectBox}>
                                <span>교환/반품할 주문 상품을 선택해주세요</span>
                                <button className={styles.selectBtn} onClick={handleOpenOrderModal}>
                                    주문 조회 <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.stepActions}>
                        <button className={styles.ghostBtn} onClick={onBack}><ChevronLeft size={16} /> 이전으로</button>
                        <button className={styles.primaryBtn} onClick={() => { if (!selectedItem) { alert("상품을 선택해주세요."); return; } setStep(2); }}>
                            다음 단계 <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 2: 신청 정보 입력 ── */}
            {step === 2 && (
                <div className={styles.stepContent}>
                    <div className={styles.selectedSummaryBox}>
                        <div className={styles.summaryBadge}>{type === "RETURN" ? "반품" : "교환"}</div>
                        <div className={styles.summaryProductInfo}>
                            <p className={styles.productName}>{selectedItem.productName}</p>
                            <p className={styles.productOption}>수량: {selectedItem.quantity}개 · {selectedItem.productPrice?.toLocaleString()}원</p>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{type === "RETURN" ? "반품" : "교환"} 사유 <span className={styles.required}>*</span></label>
                        <select className={styles.select} value={reason} onChange={e => setReason(e.target.value)}>
                            {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>

                    {type === "EXCHANGE" && (
                        <div className={styles.inputGroup}>
                            <label>교환 옵션</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="교환 원하는 사이즈·색상을 입력해주세요"
                                maxLength={100}
                                value={exchangeOption}
                                onChange={e => setExchangeOption(e.target.value)}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>상세 내용</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="상세한 사유를 입력해 주시면 빠른 처리에 도움이 됩니다. (최대 500자)"
                            maxLength={500}
                            value={detail}
                            onChange={e => setDetail(e.target.value)}
                        />
                        <p className={styles.charCount}>{detail.length} / 500</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>수거 방법 <span className={styles.required}>*</span></label>
                        <div className={styles.pickupGroup}>
                            <label className={`${styles.pickupCard} ${pickup === "COURIER" ? styles.pickupCardActive : ""}`}>
                                <input type="radio" name="pickup" value="COURIER" checked={pickup === "COURIER"} onChange={() => setPickup("COURIER")} />
                                <Truck size={20} />
                                <div><strong>택배 수거</strong><span>기사님이 방문하여 수거</span></div>
                            </label>
                            <label className={`${styles.pickupCard} ${pickup === "VISIT" ? styles.pickupCardActive : ""}`}>
                                <input type="radio" name="pickup" value="VISIT" checked={pickup === "VISIT"} onChange={() => setPickup("VISIT")} />
                                <MapPin size={20} />
                                <div><strong>직접 방문 반납</strong><span>지정 매장에 직접 반납</span></div>
                            </label>
                        </div>
                    </div>

                    {SIMPLE_REASON_CODES.includes(reason) && (
                        <div className={styles.feeInfoBox}>
                            <AlertCircle size={16} />
                            <p>단순 변심·사이즈 변경 사유의 경우 왕복 배송비 <strong>6,000원</strong>이 부과됩니다.</p>
                        </div>
                    )}

                    <div className={styles.stepActions}>
                        <button className={styles.ghostBtn} onClick={() => setStep(1)}><ChevronLeft size={16} /> 이전 단계</button>
                        <button className={styles.primaryBtn} onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "신청 중..." : "신청 완료하기"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── 주문 조회 모달 ── */}
            {showOrderModal && (
                <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h4>주문 상품 선택</h4>
                            <button className={styles.modalClose} onClick={() => setShowOrderModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            {ordersLoading && (
                                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>
                            )}
                            {!ordersLoading && orders.length === 0 && (
                                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>주문 내역이 없습니다.</p>
                            )}
                            {!ordersLoading && orders.map(order => (
                                <div key={order.orderId} className={styles.orderGroup}>
                                    <div className={styles.orderGroupHeader}>
                                        <span className={styles.orderDate}>{formatDate(order.orderedAt)}</span>
                                        <span className={styles.orderId}>{order.orderNumber}</span>
                                    </div>
                                    {order.orderItems.map(item => (
                                        <div
                                            key={item.orderItemId}
                                            className={`${styles.orderProductRow} ${selectedItem?.orderItemId === item.orderItemId ? styles.orderProductRowSelected : ""}`}
                                            onClick={() => handleItemSelect(order, item)}
                                        >
                                            <div className={styles.productImgPlaceholder}><Package size={20} /></div>
                                            <div className={styles.productInfo}>
                                                <p className={styles.productName}>{item.productName}</p>
                                                <p className={styles.productMeta}>수량: {item.quantity}개 · {item.productPrice?.toLocaleString()}원</p>
                                            </div>
                                            {selectedItem?.orderItemId === item.orderItemId && (
                                                <span className={styles.selectedBadge}>선택됨</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
