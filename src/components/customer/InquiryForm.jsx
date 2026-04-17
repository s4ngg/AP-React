import React from 'react';
import { Camera, ChevronRight, AlertCircle } from "lucide-react";
import styles from "./InquiryForm.module.css";

export default function InquiryForm() {
    return (
        <div className={styles.formContainer}>
            <div className={styles.guideBox}>
                <AlertCircle size={18} />
                <p>문의하신 내용은 담당자 확인 후 최대한 빠르게 답변해 드립니다.</p>
            </div>

            <div className={styles.inputGroup}>
                <label>문의 유형 <span className={styles.required}>*</span></label>
                <select className={styles.select}>
                    <option value="">유형을 선택해주세요</option>
                    <option value="PRODUCT">상품/이벤트</option>
                    <option value="DELIVERY">배송/포장</option>
                    <option value="EXCHANGE">교환</option>
                    <option value="REFUND">환불</option>
                    <option value="ACCOUNT">계정</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>주문 상품 선택</label>
                <div className={styles.orderSelectBox}>
                    <span>문의하실 주문 내역을 선택해주세요</span>
                    <button className={styles.selectBtn}>주문 조회 <ChevronRight size={14} /></button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>제목 <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="제목을 입력해주세요 (최대 50자)" />
            </div>

            <div className={styles.inputGroup}>
                <label>내용 <span className={styles.required}>*</span></label>
                <textarea className={styles.textarea} placeholder="문의 내용을 상세히 작성해주세요 (최대 1000자)"></textarea>
            </div>

            <div className={styles.inputGroup}>
                <label>사진 첨부</label>
                <div className={styles.fileUploadArea}>
                    <div className={styles.uploadBtn}>
                        <Camera size={24} />
                        <span>0/3</span>
                    </div>
                    <p className={styles.fileGuide}>* 5MB 이하의 이미지 파일만 첨부 가능 (최대 3장)</p>
                </div>
            </div>

            <div className={styles.actionArea}>
                <button className={styles.submitBtn}>문의 등록하기</button>
            </div>
        </div>
    );
}