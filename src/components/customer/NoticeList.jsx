import React from 'react';
import { ChevronRight, Megaphone } from "lucide-react";
import styles from "./NoticeList.module.css";

const noticeData = [
    { id: 1, title: "[공지] AllPick 서비스 점검 안내 (4/20)", date: "2026-04-15", isFixed: true },
    { id: 2, title: "[이벤트] 신규 가입 시 5,000원 할인 쿠폰 즉시 지급!", date: "2026-04-10", isFixed: true },
    { id: 3, title: "개인정보 처리방침 개정 안내", date: "2026-04-05", isFixed: false },
    { id: 4, title: "배송 업체 변경 안내 (CJ대한통운 -> 한진택배)", date: "2026-03-28", isFixed: false },
    { id: 5, title: "고객센터 운영 시간 변경 안내", date: "2026-03-20", isFixed: false },
];

// onSelect 프롭스를 받도록 수정
export default function NoticeList({ onSelect }) {
    return (
        <div className={styles.noticeContainer}>
            <div className={styles.tableHeader}>
                <span className={styles.colNo}>번호</span>
                <span className={styles.colTitle}>제목</span>
                <span className={styles.colDate}>등록일</span>
            </div>

            <ul className={styles.list}>
                {noticeData.map((notice) => (
                    <li
                        key={notice.id}
                        className={`${styles.listItem} ${notice.isFixed ? styles.fixed : ""}`}
                        // 클릭 시 부모(CustomerPage)에게 ID를 전달
                        onClick={() => onSelect && onSelect(notice.id)}
                    >
                        <span className={styles.colNo}>
                          {notice.isFixed ? <Megaphone size={16} className={styles.fixedIcon} /> : notice.id}
                        </span>
                        <span className={styles.colTitle}>
                            {notice.title}
                            {notice.isFixed && <span className={styles.fixedBadge}>중요</span>}
                        </span>
                        <span className={styles.colDate}>{notice.date}</span>
                        <ChevronRight size={16} className={styles.arrow} />
                    </li>
                ))}
            </ul>

            <div className={styles.pagination}>
                <button className={styles.pageBtnActive}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
            </div>
        </div>
    );
}