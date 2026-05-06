import React from 'react';
import { ChevronRight, Megaphone } from "lucide-react";
import styles from "./NoticeList.module.css";

export default function NoticeList({ notices, loading, onSelect }) {
    if (loading) {
        return <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>불러오는 중...</p>;
    }

    if (!notices || notices.length === 0) {
        return <p style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>공지사항이 없습니다.</p>;
    }

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.tableHeader}>
                <span className={styles.colNo}>번호</span>
                <span className={styles.colTitle}>제목</span>
                <span className={styles.colDate}>등록일</span>
            </div>

            <ul className={styles.list}>
                {notices.map((notice, index) => {
                    const dateStr = notice.createdAt ? notice.createdAt.slice(0, 10) : "";
                    return (
                        <li
                            key={notice.noticeId}
                            className={`${styles.listItem} ${notice.fixed ? styles.fixed : ""}`}
                            onClick={() => onSelect && onSelect(notice.noticeId)}
                        >
                            <span className={styles.colNo}>
                                {notice.fixed
                                    ? <Megaphone size={16} className={styles.fixedIcon} />
                                    : index + 1}
                            </span>
                            <span className={styles.colTitle}>
                                {notice.title}
                                {notice.fixed && <span className={styles.fixedBadge}>중요</span>}
                            </span>
                            <span className={styles.colDate}>{dateStr}</span>
                            <ChevronRight size={16} className={styles.arrow} />
                        </li>
                    );
                })}
            </ul>

            <div className={styles.bottomArea}>
                <span className={styles.totalCount}>총 {notices.length}건</span>
                <div className={styles.pagination}>
                    <button className={styles.pageBtnActive}>1</button>
                </div>
            </div>
        </div>
    );
}
