import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { getFaqs, getFaqsByCategory } from "../../api/faqApi.js";
import styles from "./FAQList.module.css";

const CATEGORY_MAP = {
    DELIVERY: "배송",
    PAYMENT: "주문/결제",
    CANCEL_REFUND: "교환/반품",
    MEMBER: "회원",
};

const CATEGORIES = [
    { label: "전체", value: null },
    { label: "주문/결제", value: "PAYMENT" },
    { label: "배송", value: "DELIVERY" },
    { label: "교환/반품", value: "CANCEL_REFUND" },
    { label: "회원", value: "MEMBER" },
];

export default function FAQList() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [openId, setOpenId] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const request = activeCategory
            ? getFaqsByCategory(activeCategory)
            : getFaqs();
        request
            .then(data => setFaqs((data || []).filter(f => f.isVisible !== false)))
            .catch(() => setFaqs([]))
            .finally(() => setLoading(false));
        setOpenId(null);
    }, [activeCategory]);

    return (
        <div className={styles.faqContainer}>
            <div className={styles.categoryBar}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.label}
                        className={activeCategory === cat.value ? styles.catBtnActive : styles.catBtn}
                        onClick={() => setActiveCategory(cat.value)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading && (
                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>
            )}

            {!loading && faqs.length === 0 && (
                <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>등록된 FAQ가 없습니다.</p>
            )}

            {!loading && (
                <div className={styles.accordionList}>
                    {faqs.map((item) => (
                        <div key={item.faqId} className={styles.faqItem}>
                            <div
                                className={`${styles.questionBox} ${openId === item.faqId ? styles.open : ""}`}
                                onClick={() => setOpenId(openId === item.faqId ? null : item.faqId)}
                            >
                                <span className={styles.categoryTag}>[{CATEGORY_MAP[item.category] ?? item.category}]</span>
                                <span className={styles.questionText}>{item.title}</span>
                                {openId === item.faqId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            {openId === item.faqId && (
                                <div className={styles.answerBox}>
                                    <div className={styles.answerContent}>
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
