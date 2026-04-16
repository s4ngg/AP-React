import React from 'react';
import { Truck, Package, CheckCircle, MapPin } from "lucide-react";
import styles from "./DeliveryTracker.module.css";

export default function DeliveryTracker() {
    const steps = [
        { status: "결제완료", date: "04-15 10:30", done: true },
        { status: "상품준비중", date: "04-15 14:20", done: true },
        { status: "배송중", date: "04-16 09:00", done: true, current: true },
        { status: "배송완료", date: "-", done: false },
    ];

    return (
        <div className={styles.deliveryContainer}>
            {/* 1. 현재 배송 요약 정보 */}
            <div className={styles.summaryBox}>
                <div className={styles.orderInfo}>
                    <span className={styles.orderLabel}>주문번호</span>
                    <span className={styles.orderValue}>20260415-0001234</span>
                </div>
                <div className={styles.deliveryStatus}>
                    <Truck size={24} className={styles.truckIcon} />
                    <span className={styles.statusText}>상품이 <strong className={styles.blue}>배송지 근처</strong>에 도착했습니다.</span>
                </div>
            </div>

            {/* 2. 배송 타임라인 (스텝퍼) */}
            <div className={styles.timeline}>
                {steps.map((step, index) => (
                    <div key={index} className={`${styles.stepItem} ${step.done ? styles.active : ""}`}>
                        <div className={styles.iconPoint}>
                            {step.done ? <CheckCircle size={20} /> : <div className={styles.circle} />}
                        </div>
                        <div className={styles.stepContent}>
                            <span className={styles.stepStatus}>{step.status}</span>
                            <span className={styles.stepDate}>{step.date}</span>
                        </div>
                        {index < steps.length - 1 && <div className={styles.line} />}
                    </div>
                ))}
            </div>

            {/* 3. 상세 배송 흐름 (하단 리스트) */}
            <div className={styles.detailList}>
                <h4 className={styles.detailTitle}><MapPin size={18} /> 실시간 배송 경로</h4>
                <div className={styles.detailItem}>
                    <span className={styles.time}>오전 09:15</span>
                    <span className={styles.location}>인천 논현 대리점</span>
                    <span className={styles.desc}>배송 출발 (배송기사: 김철수 010-1234-5678)</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.time}>오전 02:30</span>
                    <span className={styles.location}>옥천 Hub</span>
                    <span className={styles.desc}>간선 하차</span>
                </div>
            </div>
        </div>
    );
}