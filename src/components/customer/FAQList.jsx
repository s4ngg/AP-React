import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import styles from "./FAQList.module.css";

const faqData = [
    { id: 1, category: "배송", question: "배송은 얼마나 걸리나요?", answer: "주문 결제 완료 후 영업일 기준 2~3일 이내에 배송됩니다. 도서산간 지역은 1~2일 더 소요될 수 있습니다." },
    { id: 2, category: "결제", question: "결제 수단 변경이 가능한가요?", answer: "이미 결제가 완료된 주문의 경우 결제 수단 변경이 불가능합니다. 취소 후 재결제를 진행해 주세요." },
    { id: 3, category: "취소/환불", question: "환불은 언제쯤 처리되나요?", answer: "상품 회수 및 검수가 완료된 후 영업일 기준 3~5일 이내에 결제하셨던 수단으로 환불됩니다." },
    { id: 4, category: "회원", question: "비밀번호를 잊어버렸어요.", answer: "로그인 페이지 하단의 '비밀번호 찾기' 기능을 통해 이메일 인증 후 임시 비밀번호를 발급받으실 수 있습니다." },
];

const categories = ["전체", "배송", "결제", "취소/환불", "회원"];

export default function FAQList() {
    const [activeTab, setActiveTab] = useState("전체");
    const [openId, setOpenId] = useState(null); // 어떤 질문이 열려있는지 상태 관리

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id); // 이미 열린 걸 누르면 닫고, 아니면 열기
    };

    const filteredFaq = activeTab === "전체"
        ? faqData
        : faqData.filter(item => item.category === activeTab);

    return (
        <div className={styles.faqContainer}>
            {/* 카테고리 필터 */}
            <div className={styles.categoryBar}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={activeTab === cat ? styles.catBtnActive : styles.catBtn}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ 리스트 (아코디언) */}
            <div className={styles.accordionList}>
                {filteredFaq.map((item) => (
                    <div key={item.id} className={styles.faqItem}>
                        <div
                            className={`${styles.questionBox} ${openId === item.id ? styles.open : ""}`}
                            onClick={() => toggleAccordion(item.id)}
                        >
                            <span className={styles.categoryTag}>[{item.category}]</span>
                            <span className={styles.questionText}>{item.question}</span>
                            {openId === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        {openId === item.id && (
                            <div className={styles.answerBox}>
                                <div className={styles.answerContent}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}