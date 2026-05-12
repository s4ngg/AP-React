import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Search, X, Camera } from "lucide-react";
import styles from "./InquiryForm.module.css";
import { createInquiry, getMyInquiries, cancelInquiry } from "../../api/inquiryApi.js";
import { getMyOrders } from "../../api/orderApi.js";

const INQUIRY_TYPES = [
    { value: "", label: "유형을 선택해주세요" },
    { value: "PRODUCT", label: "상품 문의" },
    { value: "DELIVERY", label: "배송 문의" },
    { value: "PAYMENT", label: "결제 문의" },
    { value: "ETC", label: "기타" },
];

const INQUIRY_TYPE_LABEL = {
    PRODUCT: "상품 문의",
    DELIVERY: "배송 문의",
    PAYMENT: "결제 문의",
    ETC: "기타",
};

const INQUIRY_STATUS_LABEL = {
    PENDING: "접수됨",
    PROCESSING: "처리중",
    COMPLETED: "답변완료",
    CANCELLED: "취소됨",
};

const INQUIRY_STATUS_STYLE = {
    PENDING:    { bg: "#fefce8", color: "#ca8a04" },
    PROCESSING: { bg: "#eff6ff", color: "#2563eb" },
    COMPLETED:  { bg: "#f0fdf4", color: "#16a34a" },
    CANCELLED:  { bg: "#f3f4f6", color: "#6b7280" },
};

const ORDER_STATUS_LABEL = {
    PENDING:   "주문완료",
    PAID:      "결제완료",
    SHIPPING:  "배송중",
    DELIVERED: "배송완료",
    CANCELLED: "취소",
};

const ORDER_STATUS_STYLE = {
    PENDING:   { bg: "#fefce8", color: "#ca8a04" },
    PAID:      { bg: "#f0fdf4", color: "#16a34a" },
    SHIPPING:  { bg: "#eff6ff", color: "#2563eb" },
    DELIVERED: { bg: "#f0fdf4", color: "#16a34a" },
    CANCELLED: { bg: "#fef2f2", color: "#dc2626" },
};

const MAX_IMAGES = 5;

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export default function InquiryForm({ initialView = "form", onBack }) {
    const [view, setView] = useState(initialView); // "form" | "complete" | "history"
    const [inquiryType, setInquiryType] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]); // { file: File, url: string }[]
    const [submitting, setSubmitting] = useState(false);
    const [submittedInquiry, setSubmittedInquiry] = useState(null);
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [myInquiries, setMyInquiries] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [openInquiryId, setOpenInquiryId] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialView !== "history") return;
        setHistoryLoading(true);
        getMyInquiries()
            .then((res) => setMyInquiries((res.data?.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
            .catch(() => setMyInquiries([]))
            .finally(() => setHistoryLoading(false));
    }, [initialView]);

    const resetForm = () => {
        setInquiryType("");
        setTitle("");
        setContent("");
        setImages([]);
        setSelectedOrder(null);
        setSubmittedInquiry(null);
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - images.length;
        const toAdd = files.slice(0, remaining).map(file => ({ file, url: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...toAdd]);
        e.target.value = "";
    };

    const handleImageRemove = (index) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleOpenOrderModal = async () => {
        setOrderModalOpen(true);
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

    const handleSubmit = async () => {
        if (!inquiryType) { alert("문의 유형을 선택해주세요."); return; }
        if (!title.trim()) { alert("제목을 입력해주세요."); return; }
        if (!content.trim()) { alert("문의 내용을 입력해주세요."); return; }

        setSubmitting(true);
        try {
            const payload = {
                inquiryType,
                title,
                content,
                ...(selectedOrder && {
                    orderItemId: selectedOrder.orderItems[0]?.orderItemId,
                    productId: selectedOrder.orderItems[0]?.productId,
                }),
            };
            const res = await createInquiry(payload, images);
            const created = res.data?.data;

            setSubmittedInquiry(created);
            setView("complete");
        } catch {
            alert("문의 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelInquiry = async () => {
        setCancelling(true);
        try {
            await cancelInquiry(submittedInquiry.inquiryId);
            resetForm();
            setCancelConfirmOpen(false);
            setView("form");
        } catch {
            alert("문의 취소에 실패했습니다.");
            setCancelConfirmOpen(false);
        } finally {
            setCancelling(false);
        }
    };

    const handleViewHistory = async () => {
        setView("history");
        setHistoryLoading(true);
        try {
            const res = await getMyInquiries();
            setMyInquiries((res.data?.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch {
            setMyInquiries([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    /* ── 내 문의 목록 화면 ── */
    if (view === "history") {
        return (
            <div className={styles.formContainer}>
                <button className={styles.backBtn} onClick={() => onBack ? onBack() : setView("form")}>
                    <ChevronLeft size={16} /> {onBack ? "고객센터 홈으로" : "문의하기로 돌아가기"}
                </button>
                <h4 className={styles.historyTitle}>내 문의 내역</h4>

                {historyLoading && (
                    <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>
                )}
                {!historyLoading && myInquiries.length === 0 && (
                    <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>접수된 문의가 없습니다.</p>
                )}
                {!historyLoading && myInquiries.map((inq) => {
                    const st = INQUIRY_STATUS_STYLE[inq.status] || {};
                    const isOpen = openInquiryId === inq.inquiryId;
                    return (
                        <div key={inq.inquiryId} className={styles.historyItem}>
                            <div
                                className={styles.historyHeader}
                                onClick={() => setOpenInquiryId(isOpen ? null : inq.inquiryId)}
                            >
                                <div className={styles.historyMeta}>
                                    <span className={styles.historyType}>[{INQUIRY_TYPE_LABEL[inq.inquiryType] ?? inq.inquiryType}]</span>
                                    <span className={styles.historyItemTitle}>{inq.title}</span>
                                </div>
                                <div className={styles.historyRight}>
                                    <span className={styles.statusBadge} style={{ backgroundColor: st.bg, color: st.color }}>
                                        {INQUIRY_STATUS_LABEL[inq.status] ?? inq.status}
                                    </span>
                                    <span className={styles.historyDate}>{formatDate(inq.createdAt)}</span>
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>
                            {isOpen && (
                                <div className={styles.historyBody}>
                                    <p className={styles.historyContent}>{inq.content}</p>
                                    {inq.answers?.length > 0 ? (
                                        <div className={styles.answerList}>
                                            {inq.answers.map((ans) => (
                                                <div key={ans.inquiryAnswerId} className={styles.answerItem}>
                                                    <span className={styles.answerLabel}>
                                                        {ans.adminId ? "관리자 답변" : "판매자 답변"}
                                                    </span>
                                                    <p className={styles.answerContent}>{ans.content}</p>
                                                    <span className={styles.answerDate}>{formatDate(ans.createdAt)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.noAnswer}>아직 답변이 등록되지 않았습니다.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    /* ── 등록 완료 화면 ── */
    if (view === "complete" && submittedInquiry) {
        const st = INQUIRY_STATUS_STYLE[submittedInquiry.status] || {};
        return (
            <div className={styles.completeWrap}>
                <div className={styles.completeIcon}><CheckCircle size={36} /></div>
                <h3 className={styles.completeTitle}>등록완료 되었습니다.</h3>
                <p className={styles.completeDesc}>
                    담당자 확인 후 <strong>영업일 기준 1~2일 이내</strong>에 답변 드립니다.
                </p>
                <div className={styles.completeSummary}>
                    <div className={styles.summaryHeader}>접수된 문의 내용</div>
                    <div className={styles.summaryRow}>
                        <span>문의 번호</span>
                        <strong>INQ-{String(submittedInquiry.inquiryId).padStart(6, "0")}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>접수 일시</span>
                        <strong>{formatDate(submittedInquiry.createdAt)}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>문의 유형</span>
                        <strong>{INQUIRY_TYPE_LABEL[submittedInquiry.inquiryType] ?? submittedInquiry.inquiryType}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>제목</span>
                        <strong>{submittedInquiry.title}</strong>
                    </div>
                    <div className={styles.summaryRowContent}>
                        <span>문의 내용</span>
                        <p>{submittedInquiry.content}</p>
                    </div>
                    {images.length > 0 && (
                        <div className={styles.summaryRowContent}>
                            <span>첨부 이미지</span>
                            <div className={styles.summaryImages}>
                                {images.map((img, i) => (
                                    <img key={i} src={img.url} alt={`첨부 ${i + 1}`} className={styles.summaryImg} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={styles.summaryStatus}>
                        <span className={styles.statusBadge} style={{ backgroundColor: st.bg, color: st.color }}>
                            {INQUIRY_STATUS_LABEL[submittedInquiry.status]}
                        </span>
                        <span className={styles.statusDesc}>답변 대기 중</span>
                    </div>
                </div>

                {cancelConfirmOpen && (
                    <div className={styles.modalOverlay} onClick={() => setCancelConfirmOpen(false)}>
                        <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                            <div className={styles.confirmIcon}><AlertCircle size={32} /></div>
                            <h4 className={styles.confirmTitle}>정말 문의를 취소하시겠습니까?</h4>
                            <p className={styles.confirmDesc}>취소 시 접수된 문의 내용이 삭제되며<br />복구할 수 없습니다.</p>
                            <div className={styles.confirmActions}>
                                <button className={styles.confirmNoBtn} onClick={() => setCancelConfirmOpen(false)}>돌아가기</button>
                                <button className={styles.confirmYesBtn} onClick={handleCancelInquiry} disabled={cancelling}>
                                    {cancelling ? "취소 중..." : "취소하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.completeActions}>
                    <button className={styles.cancelBtn} onClick={() => setCancelConfirmOpen(true)}>
                        <X size={15} /> 문의 취소하기
                    </button>
                    <button className={styles.viewBtn} onClick={handleViewHistory}>
                        <Search size={15} /> 문의 조회하기
                    </button>
                </div>
            </div>
        );
    }

    /* ── 문의 폼 ── */
    return (
        <div className={styles.formContainer}>
            <div className={styles.guideBox}>
                <AlertCircle size={18} />
                <p>문의하신 내용은 담당자 확인 후 최대한 빠르게 답변해 드립니다.</p>
            </div>

            <div className={styles.inputGroup}>
                <label>문의 유형 <span className={styles.required}>*</span></label>
                <select className={styles.select} value={inquiryType} onChange={e => setInquiryType(e.target.value)}>
                    {INQUIRY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>주문 상품 선택</label>
                {selectedOrder ? (
                    <div className={styles.selectedOrderBox}>
                        <div className={styles.selectedOrderInfo}>
                            <div className={styles.selectedOrderText}>
                                <span className={styles.selectedOrderId}>{selectedOrder.orderNumber}</span>
                                <span className={styles.selectedOrderName}>
                                    {selectedOrder.orderItems[0]?.productName}
                                    {selectedOrder.orderItems.length > 1 && ` 외 ${selectedOrder.orderItems.length - 1}건`}
                                </span>
                                <span className={styles.selectedOrderDate}>{formatDate(selectedOrder.orderedAt)}</span>
                            </div>
                        </div>
                        <button className={styles.changeOrderBtn} onClick={handleOpenOrderModal}>
                            변경 <ChevronRight size={14} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.orderSelectBox}>
                        <span>문의하실 주문 내역을 선택해주세요</span>
                        <button className={styles.selectBtn} onClick={handleOpenOrderModal}>
                            주문 조회 <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {orderModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setOrderModalOpen(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h4 className={styles.modalTitle}>주문 내역 조회</h4>
                            <button className={styles.modalClose} onClick={() => setOrderModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {ordersLoading && (
                                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>
                            )}
                            {!ordersLoading && orders.length === 0 && (
                                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>주문 내역이 없습니다.</p>
                            )}
                            {!ordersLoading && orders.map(order => {
                                const st = ORDER_STATUS_STYLE[order.status] || { bg: "#f3f4f6", color: "#6b7280" };
                                const isSelected = selectedOrder?.orderId === order.orderId;
                                return (
                                    <button
                                        key={order.orderId}
                                        className={`${styles.orderCard} ${isSelected ? styles.orderCardSelected : ""}`}
                                        onClick={() => { setSelectedOrder(order); setOrderModalOpen(false); }}
                                    >
                                        <div className={styles.orderCardTop}>
                                            <span className={styles.orderCardId}>{order.orderNumber}</span>
                                            <span className={styles.orderCardStatus} style={{ backgroundColor: st.bg, color: st.color }}>
                                                {ORDER_STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        {order.orderItems.map(item => (
                                            <div key={item.orderItemId} className={styles.orderCardItem}>
                                                <div className={styles.orderCardItemInfo}>
                                                    <span className={styles.orderCardItemName}>{item.productName}</span>
                                                    <span className={styles.orderCardItemOption}>{item.quantity}개</span>
                                                    <span className={styles.orderCardItemPrice}>{item.productPrice?.toLocaleString()}원</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={styles.orderCardBottom}>
                                            <span className={styles.orderCardDate}>{formatDate(order.orderedAt)}</span>
                                            <span className={styles.orderCardTotal}>총 {order.totalAmount?.toLocaleString()}원</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.inputGroup}>
                <label>제목 <span className={styles.required}>*</span></label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="제목을 입력해주세요 (최대 100자)"
                    maxLength={100}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label>내용 <span className={styles.required}>*</span></label>
                <textarea
                    className={styles.textarea}
                    placeholder="문의 내용을 상세히 작성해주세요 (최대 1000자)"
                    maxLength={1000}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <p className={styles.charCount}>{content.length} / 1000</p>
            </div>

            <div className={styles.inputGroup}>
                <label>사진 첨부 <span className={styles.labelSub}>(최대 {MAX_IMAGES}장)</span></label>
                <div className={styles.fileUploadArea}>
                    <div className={styles.imagePreviewList}>
                        {images.map((img, i) => (
                            <div key={i} className={styles.imagePreviewItem}>
                                <img src={img.url} alt={`첨부 ${i + 1}`} />
                                <button className={styles.imageRemoveBtn} onClick={() => handleImageRemove(i)}>
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                        {images.length < MAX_IMAGES && (
                            <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                                <Camera size={20} />
                                <span>사진 추가</span>
                            </button>
                        )}
                    </div>
                    <p className={styles.fileGuide}>JPG, PNG, GIF 파일만 가능합니다. (장당 최대 10MB)</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageAdd}
                />
            </div>

            <div className={styles.actionArea}>
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "등록 중..." : "문의 등록하기"}
                </button>
            </div>
        </div>
    );
}
