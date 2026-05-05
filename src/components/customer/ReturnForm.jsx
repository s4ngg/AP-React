import React, { useState } from 'react';
import {
    AlertCircle, Camera, ChevronRight, ChevronLeft,
    Package, RotateCcw, ArrowLeftRight, MapPin, Truck
} from "lucide-react";
import styles from "./ReturnForm.module.css";

const RETURN_REASONS = [
    { value: "", label: "사유를 선택해주세요" },
    { value: "CHANGE_MIND", label: "단순 변심" },
    { value: "SIZE_COLOR", label: "사이즈/색상 불만족" },
    { value: "DEFECT", label: "상품 불량/파손" },
    { value: "WRONG_ITEM", label: "오배송 (다른 상품 수령)" },
    { value: "MISSING_ITEM", label: "구성품 누락" },
    { value: "DESCRIPTION_DIFF", label: "상품 설명과 다름" },
    { value: "OTHER", label: "기타" },
];

const EXCHANGE_REASONS = [
    { value: "", label: "사유를 선택해주세요" },
    { value: "SIZE_CHANGE", label: "사이즈 변경" },
    { value: "COLOR_CHANGE", label: "색상 변경" },
    { value: "DEFECT", label: "상품 불량/파손" },
    { value: "WRONG_ITEM", label: "오배송 (다른 상품 수령)" },
    { value: "MISSING_ITEM", label: "구성품 누락" },
    { value: "OTHER", label: "기타" },
];

// 더미 주문 데이터
const DUMMY_ORDERS = [
    {
        orderId: "ORD-20240415-001",
        date: "2024.04.15",
        products: [
            { id: 1, name: "클래식 화이트 티셔츠", option: "M / 화이트", qty: 1, price: "29,900원", img: null },
            { id: 2, name: "슬림 데님 팬츠", option: "28 / 블루", qty: 1, price: "69,000원", img: null },
        ],
    },
    {
        orderId: "ORD-20240408-003",
        date: "2024.04.08",
        products: [
            { id: 3, name: "캐주얼 후드 집업", option: "L / 그레이", qty: 2, price: "59,000원", img: null },
        ],
    },
];

export default function ReturnForm({ onBack }) {
    const [step, setStep] = useState(1); // 1: 주문선택, 2: 신청정보, 3: 완료
    const [type, setType] = useState("return"); // 'return' | 'exchange'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reason, setReason] = useState("");
    const [detail, setDetail] = useState("");
    const [pickup, setPickup] = useState("courier"); // 'courier' | 'visit'
    const [exchangeAddr, setExchangeAddr] = useState("existing"); // 'existing' | 'new'
    const [images, setImages] = useState([]);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const reasons = type === "return" ? RETURN_REASONS : EXCHANGE_REASONS;

    const handleOrderSelect = (order, product) => {
        setSelectedOrder(order);
        setSelectedProduct(product);
        setShowOrderModal(false);
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            alert("사진은 최대 3장까지 첨부 가능합니다.");
            return;
        }
        const newImages = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleImageRemove = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        if (!selectedProduct) { alert("교환/반품할 상품을 선택해주세요."); return; }
        if (!reason) { alert("신청 사유를 선택해주세요."); return; }
        setStep(3);
    };

    // Step 3: 완료 화면
    if (step === 3) {
        return (
            <div className={styles.completeWrap}>
                <div className={styles.completeIcon}>
                    <RotateCcw size={36} />
                </div>
                <h3 className={styles.completeTitle}>신청이 완료되었습니다!</h3>
                <p className={styles.completeDesc}>
                    {type === "return" ? "반품" : "교환"} 신청이 정상적으로 접수되었습니다.<br />
                    담당자 확인 후 순차적으로 처리해 드립니다.
                </p>
                <div className={styles.completeSummary}>
                    <div className={styles.summaryRow}>
                        <span>신청 유형</span>
                        <strong>{type === "return" ? "반품" : "교환"}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>상품명</span>
                        <strong>{selectedProduct?.name}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>신청 사유</span>
                        <strong>{reasons.find(r => r.value === reason)?.label}</strong>
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
            {/* 상단 안내 박스 */}
            <div className={styles.guideBox}>
                <AlertCircle size={18} />
                <p>교환/반품은 상품 수령 후 <strong>7일 이내</strong>에만 신청 가능합니다. 단순 변심 시 배송비가 발생할 수 있습니다.</p>
            </div>

            {/* 스텝 인디케이터 */}
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

            {/* ──────── STEP 1: 주문 상품 선택 ──────── */}
            {step === 1 && (
                <div className={styles.stepContent}>
                    <h4 className={styles.sectionTitle}>교환/반품할 상품을 선택해주세요</h4>

                    {/* 신청 유형 */}
                    <div className={styles.inputGroup}>
                        <label>신청 유형 <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={`${styles.radioCard} ${type === "return" ? styles.radioCardActive : ""}`}>
                                <input type="radio" name="type" value="return" checked={type === "return"} onChange={() => { setType("return"); setReason(""); }} />
                                <RotateCcw size={20} />
                                <div>
                                    <strong>반품</strong>
                                    <span>상품을 돌려보내고 환불 받기</span>
                                </div>
                            </label>
                            <label className={`${styles.radioCard} ${type === "exchange" ? styles.radioCardActive : ""}`}>
                                <input type="radio" name="type" value="exchange" checked={type === "exchange"} onChange={() => { setType("exchange"); setReason(""); }} />
                                <ArrowLeftRight size={20} />
                                <div>
                                    <strong>교환</strong>
                                    <span>다른 사이즈·색상으로 교환하기</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 주문 상품 선택 */}
                    <div className={styles.inputGroup}>
                        <label>주문 상품 선택 <span className={styles.required}>*</span></label>
                        {selectedProduct ? (
                            <div className={styles.selectedProductCard}>
                                <div className={styles.productImgPlaceholder}>
                                    <Package size={24} />
                                </div>
                                <div className={styles.productInfo}>
                                    <p className={styles.productName}>{selectedProduct.name}</p>
                                    <p className={styles.productOption}>옵션: {selectedProduct.option}</p>
                                    <p className={styles.productMeta}>수량: {selectedProduct.qty}개 · {selectedProduct.price}</p>
                                </div>
                                <button className={styles.changeBtn} onClick={() => setShowOrderModal(true)}>
                                    변경
                                </button>
                            </div>
                        ) : (
                            <div className={styles.orderSelectBox}>
                                <span>교환/반품할 주문 상품을 선택해주세요</span>
                                <button className={styles.selectBtn} onClick={() => setShowOrderModal(true)}>
                                    주문 조회 <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.stepActions}>
                        <button className={styles.ghostBtn} onClick={onBack}>
                            <ChevronLeft size={16} /> 이전으로
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => { if (!selectedProduct) { alert("상품을 선택해주세요."); return; } setStep(2); }}
                        >
                            다음 단계 <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ──────── STEP 2: 신청 정보 입력 ──────── */}
            {step === 2 && (
                <div className={styles.stepContent}>
                    {/* 선택 상품 요약 */}
                    <div className={styles.selectedSummaryBox}>
                        <div className={styles.summaryBadge}>{type === "return" ? "반품" : "교환"}</div>
                        <div className={styles.summaryProductInfo}>
                            <p className={styles.productName}>{selectedProduct.name}</p>
                            <p className={styles.productOption}>옵션: {selectedProduct.option} · 수량: {selectedProduct.qty}개</p>
                        </div>
                    </div>

                    {/* 신청 사유 */}
                    <div className={styles.inputGroup}>
                        <label>{type === "return" ? "반품" : "교환"} 사유 <span className={styles.required}>*</span></label>
                        <select
                            className={styles.select}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        >
                            {reasons.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 상세 내용 */}
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

                    {/* 사진 첨부 */}
                    <div className={styles.inputGroup}>
                        <label>사진 첨부 <span className={styles.labelSub}>(불량·오배송 시 필수)</span></label>
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
                                        <Camera size={22} />
                                        <span>{images.length}/3</span>
                                    </label>
                                )}
                            </div>
                            <p className={styles.fileGuide}>* 5MB 이하의 이미지 파일만 첨부 가능 (최대 3장)</p>
                        </div>
                    </div>

                    {/* 수거 방법 */}
                    <div className={styles.inputGroup}>
                        <label>수거 방법 <span className={styles.required}>*</span></label>
                        <div className={styles.pickupGroup}>
                            <label className={`${styles.pickupCard} ${pickup === "courier" ? styles.pickupCardActive : ""}`}>
                                <input type="radio" name="pickup" value="courier" checked={pickup === "courier"} onChange={() => setPickup("courier")} />
                                <Truck size={20} />
                                <div>
                                    <strong>택배 수거</strong>
                                    <span>기사님이 방문하여 수거</span>
                                </div>
                            </label>
                            <label className={`${styles.pickupCard} ${pickup === "visit" ? styles.pickupCardActive : ""}`}>
                                <input type="radio" name="pickup" value="visit" checked={pickup === "visit"} onChange={() => setPickup("visit")} />
                                <MapPin size={20} />
                                <div>
                                    <strong>직접 방문 반납</strong>
                                    <span>지정 매장에 직접 반납</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 교환 배송지 (교환일 때만) */}
                    {type === "exchange" && (
                        <div className={styles.inputGroup}>
                            <label>교환 배송지 <span className={styles.required}>*</span></label>
                            <div className={styles.addrRadioGroup}>
                                <label className={styles.addrRadio}>
                                    <input type="radio" name="addr" value="existing" checked={exchangeAddr === "existing"} onChange={() => setExchangeAddr("existing")} />
                                    기존 배송지 사용
                                </label>
                                <label className={styles.addrRadio}>
                                    <input type="radio" name="addr" value="new" checked={exchangeAddr === "new"} onChange={() => setExchangeAddr("new")} />
                                    새 배송지 입력
                                </label>
                            </div>
                            {exchangeAddr === "existing" && (
                                <div className={styles.addrInfoBox}>
                                    <p className={styles.addrName}>홍길동 <span>010-1234-5678</span></p>
                                    <p className={styles.addrText}>[12345] 서울특별시 강남구 테헤란로 123, 101동 456호</p>
                                </div>
                            )}
                            {exchangeAddr === "new" && (
                                <div className={styles.newAddrForm}>
                                    <div className={styles.addrSearchRow}>
                                        <input type="text" className={styles.input} placeholder="우편번호" readOnly />
                                        <button className={styles.addrSearchBtn}>주소 검색</button>
                                    </div>
                                    <input type="text" className={styles.input} placeholder="기본 주소" readOnly style={{ marginTop: 8 }} />
                                    <input type="text" className={styles.input} placeholder="상세 주소를 입력해주세요" style={{ marginTop: 8 }} />
                                    <input type="text" className={styles.input} placeholder="수령인 이름" style={{ marginTop: 8 }} />
                                    <input type="text" className={styles.input} placeholder="연락처 (- 없이 입력)" style={{ marginTop: 8 }} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 단순 변심 배송비 안내 */}
                    {(reason === "CHANGE_MIND" || reason === "SIZE_CHANGE" || reason === "COLOR_CHANGE" || reason === "SIZE_COLOR") && (
                        <div className={styles.feeInfoBox}>
                            <AlertCircle size={16} />
                            <p>단순 변심·사이즈 변경 사유의 경우 왕복 배송비 <strong>6,000원</strong>이 부과됩니다.</p>
                        </div>
                    )}

                    <div className={styles.stepActions}>
                        <button className={styles.ghostBtn} onClick={() => setStep(1)}>
                            <ChevronLeft size={16} /> 이전 단계
                        </button>
                        <button className={styles.primaryBtn} onClick={handleSubmit}>
                            신청 완료하기
                        </button>
                    </div>
                </div>
            )}

            {/* ──────── 주문 조회 모달 ──────── */}
            {showOrderModal && (
                <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h4>주문 상품 선택</h4>
                            <button className={styles.modalClose} onClick={() => setShowOrderModal(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            {DUMMY_ORDERS.map(order => (
                                <div key={order.orderId} className={styles.orderGroup}>
                                    <div className={styles.orderGroupHeader}>
                                        <span className={styles.orderDate}>{order.date}</span>
                                        <span className={styles.orderId}>{order.orderId}</span>
                                    </div>
                                    {order.products.map(product => (
                                        <div
                                            key={product.id}
                                            className={`${styles.orderProductRow} ${selectedProduct?.id === product.id ? styles.orderProductRowSelected : ""}`}
                                            onClick={() => handleOrderSelect(order, product)}
                                        >
                                            <div className={styles.productImgPlaceholder}>
                                                <Package size={20} />
                                            </div>
                                            <div className={styles.productInfo}>
                                                <p className={styles.productName}>{product.name}</p>
                                                <p className={styles.productOption}>옵션: {product.option} · 수량: {product.qty}개</p>
                                                <p className={styles.productMeta}>{product.price}</p>
                                            </div>
                                            {selectedProduct?.id === product.id && (
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
