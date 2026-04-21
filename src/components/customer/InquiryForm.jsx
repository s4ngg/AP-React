import React, { useState } from 'react';
import { Camera, ChevronRight, AlertCircle, CheckCircle, Search, X } from "lucide-react";
import styles from "./InquiryForm.module.css";

const INQUIRY_TYPES = [
    { value: "", label: "유형을 선택해주세요" },
    { value: "PRODUCT", label: "상품/이벤트" },
    { value: "DELIVERY", label: "배송/포장" },
    { value: "EXCHANGE", label: "교환" },
    { value: "REFUND", label: "환불" },
    { value: "ACCOUNT", label: "계정" },
    { value: "OTHER", label: "기타" },
];

const DUMMY_ORDERS = [
    {
        id: "AP-20260415001",
        date: "2026.04.15",
        status: "배송완료",
        items: [
            {
                id: 1,
                name: "[에스티로더] 갈색병 세럼 50ml",
                option: "50ml / 1개",
                price: 89000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop",
            },
        ],
        totalPrice: 89000,
    },
    {
        id: "AP-20260410002",
        date: "2026.04.10",
        status: "배송완료",
        items: [
            {
                id: 2,
                name: "[뷰티스타일샵] 수분 세럼 30ml",
                option: "30ml / 1개",
                price: 34000,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop",
            },
            {
                id: 3,
                name: "[라로슈포제] 시카플라스트 밤 B5",
                option: "100ml / 1개",
                price: 22000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=80&h=80&fit=crop",
            },
        ],
        totalPrice: 90000,
    },
    {
        id: "AP-20260405003",
        date: "2026.04.05",
        status: "배송중",
        items: [
            {
                id: 4,
                name: "[아넬로] 미니 크로스백",
                option: "블랙 / 1개",
                price: 45000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop",
            },
        ],
        totalPrice: 45000,
    },
    {
        id: "AP-20260401004",
        date: "2026.04.01",
        status: "주문완료",
        items: [
            {
                id: 5,
                name: "[제주삼다수] 2L 12병",
                option: "2L × 12병",
                price: 18900,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&h=80&fit=crop",
            },
        ],
        totalPrice: 37800,
    },
    {
        id: "AP-20260325005",
        date: "2026.03.25",
        status: "취소",
        items: [
            {
                id: 6,
                name: "[나이키] 에어맥스 270",
                option: "270mm / 화이트",
                price: 139000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
            },
        ],
        totalPrice: 139000,
    },
];

const STATUS_STYLE = {
    배송완료: { bg: "#f0fdf4", color: "#16a34a" },
    배송중:   { bg: "#eff6ff", color: "#2563eb" },
    주문완료: { bg: "#fefce8", color: "#ca8a04" },
    취소:     { bg: "#fef2f2", color: "#dc2626" },
};

export default function InquiryForm() {
    const [submitted, setSubmitted] = useState(false);
    const [inquiryType, setInquiryType] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [savedData, setSavedData] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            alert("사진은 최대 3장까지 첨부 가능합니다.");
            return;
        }
        setImages(prev => [...prev, ...files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))]);
    };

    const handleImageRemove = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        if (!inquiryType) { alert("문의 유형을 선택해주세요."); return; }
        if (!title.trim()) { alert("제목을 입력해주세요."); return; }
        if (!content.trim()) { alert("문의 내용을 입력해주세요."); return; }

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
        const inquiryNo = `INQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;

        setSavedData({
            inquiryNo,
            date: dateStr,
            type: INQUIRY_TYPES.find(t => t.value === inquiryType)?.label,
            title,
            content,
            images,
        });
        setSubmitted(true);
    };

    const handleCancel = () => {
        setSavedData(null);
        setSubmitted(false);
        setCancelConfirmOpen(false);
        setInquiryType("");
        setTitle("");
        setContent("");
        setImages([]);
    };

    /* ── 등록 완료 화면 ── */
    if (submitted && savedData) {
        return (
            <div className={styles.completeWrap}>
                <div className={styles.completeIcon}>
                    <CheckCircle size={36} />
                </div>
                <h3 className={styles.completeTitle}>등록완료 되었습니다.</h3>
                <p className={styles.completeDesc}>
                    담당자 확인 후 <strong>영업일 기준 1~2일 이내</strong>에 답변 드립니다.
                </p>

                {/* 접수 내용 요약 */}
                <div className={styles.completeSummary}>
                    <div className={styles.summaryHeader}>접수된 문의 내용</div>
                    <div className={styles.summaryRow}>
                        <span>문의 번호</span>
                        <strong>{savedData.inquiryNo}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>접수 일시</span>
                        <strong>{savedData.date}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>문의 유형</span>
                        <strong>{savedData.type}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>제목</span>
                        <strong>{savedData.title}</strong>
                    </div>
                    <div className={styles.summaryRowContent}>
                        <span>문의 내용</span>
                        <p>{savedData.content}</p>
                    </div>
                    {savedData.images.length > 0 && (
                        <div className={styles.summaryRowContent}>
                            <span>첨부 사진</span>
                            <div className={styles.summaryImages}>
                                {savedData.images.map((img, i) => (
                                    <img key={i} src={img.url} alt={img.name} className={styles.summaryImg} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={styles.summaryStatus}>
                        <span className={styles.statusBadge}>접수 완료</span>
                        <span className={styles.statusDesc}>답변 대기 중</span>
                    </div>
                </div>

                {/* 버튼 */}
                {/* 문의 취소 확인 팝업 */}
                {cancelConfirmOpen && (
                    <div className={styles.modalOverlay} onClick={() => setCancelConfirmOpen(false)}>
                        <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                            <div className={styles.confirmIcon}>
                                <AlertCircle size={32} />
                            </div>
                            <h4 className={styles.confirmTitle}>정말 문의를 취소하시겠습니까?</h4>
                            <p className={styles.confirmDesc}>취소 시 접수된 문의 내용이 삭제되며<br />복구할 수 없습니다.</p>
                            <div className={styles.confirmActions}>
                                <button className={styles.confirmNoBtn} onClick={() => setCancelConfirmOpen(false)}>
                                    돌아가기
                                </button>
                                <button className={styles.confirmYesBtn} onClick={handleCancel}>
                                    취소하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.completeActions}>
                    <button className={styles.cancelBtn} onClick={() => setCancelConfirmOpen(true)}>
                        <X size={15} /> 문의 취소하기
                    </button>
                    <button className={styles.viewBtn}>
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
                <select
                    className={styles.select}
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                >
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
                            <img
                                src={selectedOrder.items[0].image}
                                alt={selectedOrder.items[0].name}
                                className={styles.selectedOrderImg}
                            />
                            <div className={styles.selectedOrderText}>
                                <span className={styles.selectedOrderId}>{selectedOrder.id}</span>
                                <span className={styles.selectedOrderName}>
                                    {selectedOrder.items[0].name}
                                    {selectedOrder.items.length > 1 && ` 외 ${selectedOrder.items.length - 1}건`}
                                </span>
                                <span className={styles.selectedOrderDate}>{selectedOrder.date}</span>
                            </div>
                        </div>
                        <button className={styles.changeOrderBtn} onClick={() => setOrderModalOpen(true)}>
                            변경 <ChevronRight size={14} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.orderSelectBox}>
                        <span>문의하실 주문 내역을 선택해주세요</span>
                        <button className={styles.selectBtn} onClick={() => setOrderModalOpen(true)}>
                            주문 조회 <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* 주문 조회 모달 */}
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
                            {DUMMY_ORDERS.map(order => {
                                const st = STATUS_STYLE[order.status] || { bg: "#f3f4f6", color: "#6b7280" };
                                const isSelected = selectedOrder?.id === order.id;
                                return (
                                    <button
                                        key={order.id}
                                        className={`${styles.orderCard} ${isSelected ? styles.orderCardSelected : ""}`}
                                        onClick={() => { setSelectedOrder(order); setOrderModalOpen(false); }}
                                    >
                                        <div className={styles.orderCardTop}>
                                            <span className={styles.orderCardId}>{order.id}</span>
                                            <span
                                                className={styles.orderCardStatus}
                                                style={{ backgroundColor: st.bg, color: st.color }}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        {order.items.map(item => (
                                            <div key={item.id} className={styles.orderCardItem}>
                                                <img src={item.image} alt={item.name} className={styles.orderCardImg} />
                                                <div className={styles.orderCardItemInfo}>
                                                    <span className={styles.orderCardItemName}>{item.name}</span>
                                                    <span className={styles.orderCardItemOption}>{item.option} / {item.quantity}개</span>
                                                    <span className={styles.orderCardItemPrice}>{item.price.toLocaleString()}원</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={styles.orderCardBottom}>
                                            <span className={styles.orderCardDate}>{order.date}</span>
                                            <span className={styles.orderCardTotal}>
                                                총 {order.totalPrice.toLocaleString()}원
                                            </span>
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
                    placeholder="제목을 입력해주세요 (최대 50자)"
                    maxLength={50}
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
                <label>사진 첨부</label>
                <div className={styles.fileUploadArea}>
                    <div className={styles.imagePreviewList}>
                        {images.map((img, i) => (
                            <div key={i} className={styles.imagePreviewItem}>
                                <img src={img.url} alt={img.name} />
                                <button className={styles.imageRemoveBtn} onClick={() => handleImageRemove(i)}>×</button>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <label className={styles.uploadBtn}>
                                <input type="file" accept="image/*" multiple hidden onChange={handleImageAdd} />
                                <Camera size={24} />
                                <span>{images.length}/3</span>
                            </label>
                        )}
                    </div>
                    <p className={styles.fileGuide}>* 5MB 이하의 이미지 파일만 첨부 가능 (최대 3장)</p>
                </div>
            </div>

            <div className={styles.actionArea}>
                <button className={styles.submitBtn} onClick={handleSubmit}>문의 등록하기</button>
            </div>
        </div>
    );
}
