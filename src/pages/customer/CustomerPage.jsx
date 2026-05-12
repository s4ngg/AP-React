import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Headset, Megaphone, HelpCircle, MessageSquare, RotateCcw, ChevronRight, Search, ClipboardList } from "lucide-react";
import useAuthStore from "../../store/authStore.js";
import styles from "./CustomerPage.module.css";
import NoticeList from "../../components/customer/NoticeList.jsx";
import NoticeDetail from "../../components/customer/NoticeDetail.jsx";
import FAQList from "../../components/customer/FAQList.jsx";
import InquiryForm from "../../components/customer/InquiryForm.jsx";
import ReturnGuide from "../../components/customer/ReturnGuide.jsx";
import ReturnForm from "../../components/customer/ReturnForm.jsx";
import ReturnHistory from "../../components/customer/ReturnHistory.jsx";
import { getNotices } from "../../api/noticeApi.js";

const VALID_TABS = ["home", "notice", "faq", "inquiry", "return", "my-inquiries"];

export default function CustomerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");
    const currentTab = VALID_TABS.includes(tabParam) ? tabParam : "home";
    const [selectedNoticeId, setSelectedNoticeId] = useState(null);
    const [returnView, setReturnView] = useState("guide");
    const [notices, setNotices] = useState([]);
    const [noticesLoading, setNoticesLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    useEffect(() => {
        if (currentTab !== "notice" || notices.length > 0) return;
        (async () => {
            setNoticesLoading(true);
            try {
                const data = await getNotices();
                setNotices(data || []);
            } catch {
                setNotices([]);
            } finally {
                setNoticesLoading(false);
            }
        })();
    }, [currentTab, notices.length]);

    const handleTabChange = (tabId) => {
        setSelectedNoticeId(null);
        setReturnView("guide");
        setSearchParams(tabId === "home" ? {} : { tab: tabId });
    };

    const sideMenus = [
        { id: "home", name: "고객센터 홈", icon: <Headset size={18} /> },
        { id: "notice", name: "공지사항", icon: <Megaphone size={18} /> },
        { id: "faq", name: "자주 묻는 질문", icon: <HelpCircle size={18} /> },
        { id: "inquiry", name: "1:1 문의", icon: <MessageSquare size={18} /> },
        ...(isLoggedIn ? [{ id: "my-inquiries", name: "내 문의 내역", icon: <ClipboardList size={18} /> }] : []),
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
                            <div className={styles.quickCard} onClick={() => handleTabChange("inquiry")}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}><MessageSquare size={24} /></div>
                                    <h4>1:1 문의하기</h4>
                                </div>
                                <p>답변 상태: <span>접수됨 / 처리중 / 답변완료</span></p>
                                <button className={styles.cardBtn}>문의 등록 <ChevronRight size={16} /></button>
                            </div>

                            {isLoggedIn && (
                                <div className={styles.quickCard} onClick={() => handleTabChange("my-inquiries")}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconCircle}><ClipboardList size={24} /></div>
                                        <h4>내 문의 내역</h4>
                                    </div>
                                    <p>접수한 문의와 답변을 확인하세요.</p>
                                    <button className={styles.cardBtnSub}>내역 조회 <ChevronRight size={16} /></button>
                                </div>
                            )}

                            {!isLoggedIn && (
                                <div className={styles.quickCard} onClick={() => handleTabChange("faq")}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconCircle}><Search size={24} /></div>
                                        <h4>자주 묻는 질문</h4>
                                    </div>
                                    <p>카테고리별 FAQ를 확인하세요.</p>
                                    <button className={styles.cardBtnSub}>FAQ 조회 <ChevronRight size={16} /></button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. 공지사항 탭 */}
                    {currentTab === "notice" && (
                        selectedNoticeId ? (
                            <NoticeDetail
                                noticeId={selectedNoticeId}
                                notices={notices}
                                onBack={() => setSelectedNoticeId(null)}
                                onSelect={(id) => setSelectedNoticeId(id)}
                            />
                        ) : (
                            <NoticeList
                                notices={notices}
                                loading={noticesLoading}
                                onSelect={(id) => setSelectedNoticeId(id)}
                            />
                        )
                    )}

                    {/* 3. FAQ 탭 */}
                    {currentTab === "faq" && <FAQList />}

                    {/* 4. 1:1 문의 탭 */}
                    {currentTab === "inquiry" && <InquiryForm />}

                    {/* 5. 내 문의 내역 탭 */}
                    {currentTab === "my-inquiries" && (
                        <InquiryForm
                            initialView="history"
                            onBack={() => handleTabChange("home")}
                        />
                    )}

                    {/* 6. 교환/반품 탭 */}
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
