import React from 'react';
import { RotateCcw, Truck, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./ReturnGuide.module.css";

export default function ReturnGuide({ onApply, onInquiry }) {
    const steps = [
        { icon: <RotateCcw size={24} />, title: "신청 접수", desc: "마이페이지에서 신청" },
        { icon: <Truck size={24} />, title: "상품 회수", desc: "택배사 방문 수거" },
        { icon: <CheckCircle size={24} />, title: "검수 완료", desc: "상품 상태 확인" },
        { icon: <RotateCcw size={24} />, title: "처리 완료", desc: "환불 또는 재배송" }
    ];

    return (
        <div className={styles.guideContainer}>
            <div className={styles.infoBox}>
                <AlertCircle size={20} />
                <div>
                    <h4>반품/교환 전 꼭 확인해주세요!</h4>
                    <p>단순 변심에 의한 반품은 배송비가 발생할 수 있습니다. (상품 수령 후 7일 이내)</p>
                </div>
            </div>

            <div className={styles.stepWrapper}>
                {steps.map((step, index) => (
                    <div key={index} className={styles.stepItem}>
                        <div className={styles.iconCircle}>{step.icon}</div>
                        <h5>{step.title}</h5>
                        <p>{step.desc}</p>
                        {index < steps.length - 1 && <div className={styles.line} />}
                    </div>
                ))}
            </div>

            <div className={styles.actionArea}>
                <button className={styles.primaryBtn} onClick={onApply}>교환/반품 신청하기</button>
                <button className={styles.secondaryBtn} onClick={onInquiry}>1:1 상담하기</button>
            </div>
        </div>
    );
}