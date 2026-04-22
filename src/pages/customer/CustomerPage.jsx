import React, { useState } from 'react';
import { Headset, Megaphone, HelpCircle, MessageSquare, RotateCcw, ChevronRight, Search } from "lucide-react";
import styles from "./CustomerPage.module.css";
import NoticeList from "../../components/customer/NoticeList.jsx";
import NoticeDetail from "../../components/customer/NoticeDetail.jsx";
import FAQList from "../../components/customer/FAQList.jsx";
import InquiryForm from "../../components/customer/InquiryForm.jsx";
import ReturnGuide from "../../components/customer/ReturnGuide.jsx";
import ReturnForm from "../../components/customer/ReturnForm.jsx";
import ReturnHistory from "../../components/customer/ReturnHistory.jsx";

export default function CustomerPage() {
    const [currentTab, setCurrentTab] = useState("home");
    // 상세보기를 위한 상태 추가 (null이면 리스트, id가 있으면 상세화면)
    const [selectedNoticeId, setSelectedNoticeId] = useState(null);
    // 교환/반품 탭 내 뷰 상태: "guide" | "form"
    const [returnView, setReturnView] = useState("guide");

    // 탭이 바뀌면 상세보기도 초기화
    const handleTabChange = (tabId) => {
        setCurrentTab(tabId);
        setSelectedNoticeId(null);
        setReturnView("guide");
    };

    const sideMenus = [
        { id: "home", name: "고객센터 홈", icon: <Headset size={18} /> },
        { id: "notice", name: "공지사항", icon: <Megaphone size={18} /> },
        { id: "faq", name: "자주 묻는 질문", icon: <HelpCircle size={18} /> },
        { id: "inquiry", name: "1:1 문의", icon: <MessageSquare size={18} /> },
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
                                onClick={() => handleTabChange(menu.id)}
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
                    {currentTab === "notice" && (
                        selectedNoticeId ? (
                            <NoticeDetail
                                noticeId={selectedNoticeId}
                                onBack={() => setSelectedNoticeId(null)}
                                onSelect={(id) => setSelectedNoticeId(id)}
                            />
                        ) : (
                            <NoticeList onSelect={(id) => setSelectedNoticeId(id)} />
                        )
                    )}

                    {/* 3. FAQ 탭 */}
                    {currentTab === "faq" && <FAQList />}

                    {/* 4. 1:1 문의 탭 */}
                    {currentTab === "inquiry" && <InquiryForm />}

                    {/* 5. 교환/반품 탭 */}
                    {currentTab === "return" && (
                        returnView === "form"
                            ? <ReturnForm onBack={() => setReturnView("guide")} />
                            : returnView === "history"
                                ? <ReturnHistory onBack={() => setReturnView("guide")} />
                                : <ReturnGuide
                                    onApply={() => setReturnView("form")}
                                    onInquiry={() => handleTabChange("inquiry")}
                                  />
                    )}

                </div>
            </main>
        </div>
    );
}