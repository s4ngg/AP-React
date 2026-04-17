import React, { useState } from 'react';
import { Headset, Megaphone, HelpCircle, MessageSquare, Truck, RotateCcw, ChevronRight, Search } from "lucide-react";
import styles from "./CustomerPage.module.css";

// 1. 우리가 만든 컴포넌트들 임포트
import NoticeList from "../../components/customer/NoticeList.jsx";
import FAQList from "../../components/customer/FAQList.jsx";
import InquiryForm from "../../components/customer/InquiryForm.jsx";
import DeliveryTracker from "../../components/customer/DeliveryTracker.jsx";
import ReturnGuide from "../../components/customer/ReturnGuide.jsx";

export default function CustomerPage() {
    const [currentTab, setCurrentTab] = useState("home");

    const sideMenus = [
        { id: "home", name: "고객센터 홈", icon: <Headset size={18} /> },
        { id: "notice", name: "공지사항", icon: <Megaphone size={18} /> },
        { id: "faq", name: "자주 묻는 질문", icon: <HelpCircle size={18} /> },
        { id: "inquiry", name: "1:1 문의", icon: <MessageSquare size={18} /> },
        { id: "delivery", name: "배송 조회", icon: <Truck size={18} /> },
        { id: "return", name: "교환/반품 신청", icon: <RotateCcw size={18} /> },
    ];

    return (
        <div className={styles.container}>
            {/* 왼쪽 사이드바 */}
            <aside className={styles.sidebar}>
                <h2 className={styles.sideTitle}>고객센터</h2>
                <nav>
                    <ul className={styles.menuList}>
                        {sideMenus.map((menu) => (
                            <li
                                key={menu.id}
                                className={currentTab === menu.id ? styles.menuActive : styles.menuItem}
                                onClick={() => setCurrentTab(menu.id)}
                            >
                                {menu.icon}
                                <span>{menu.name}</span>
                                <ChevronRight size={14} className={styles.arrowIcon} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* 오른쪽 메인 콘텐츠 영역 */}
            <main className={styles.contentArea}>
                <div className={styles.contentHeader}>
                    <h3>{sideMenus.find(m => m.id === currentTab)?.name}</h3>
                </div>

                <div className={styles.contentBody}>
                    {/* 1. 고객센터 홈 */}
                    {currentTab === "home" && (
                        <div className={styles.homeGrid}>
                            <div className={styles.quickCard} onClick={() => setCurrentTab("inquiry")}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}><MessageSquare size={24} /></div>
                                    <h4>1:1 문의하기</h4>
                                </div>
                                <p>답변 상태: <span>접수됨 / 처리중 / 답변완료</span></p>
                                <button className={styles.cardBtn}>문의 등록 <ChevronRight size={16} /></button>
                            </div>

                            <div className={styles.quickCard} onClick={() => setCurrentTab("faq")}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}><Search size={24} /></div>
                                    <h4>자주 묻는 질문</h4>
                                </div>
                                <p>카테고리별 FAQ를 확인하세요.</p>
                                <button className={styles.cardBtnSub}>FAQ 조회 <ChevronRight size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* 2. 공지사항 탭 */}
                    {currentTab === "notice" && <NoticeList />}

                    {/* 3. FAQ 탭 */}
                    {currentTab === "faq" && <FAQList />}

                    {/* 4. 1:1 문의 탭 */}
                    {currentTab === "inquiry" && <InquiryForm />}

                    {/* 5. 배송 조회 탭 */}
                    {currentTab === "delivery" && <DeliveryTracker />}

                    {/* 6. 교환/반품 탭 */}
                    {currentTab === "return" && <ReturnGuide />}

                </div>
            </main>
        </div>
    );
}