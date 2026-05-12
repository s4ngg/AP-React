import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Calendar, Eye } from "lucide-react";
import { getNoticeById } from "../../api/noticeApi.js";
import styles from "./NoticeDetail.module.css";

export default function NoticeDetail({ noticeId, notices, onBack, onSelect }) {
    const currentIndex = notices.findIndex(n => n.noticeId === noticeId);
    const baseNotice = notices[currentIndex];
    const [notice, setNotice] = useState(baseNotice ?? null);
    const prevNotice = currentIndex > 0 ? notices[currentIndex - 1] : null;
    const nextNotice = currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null;
    const fetchedId = useRef(null);

    useEffect(() => {
        if (fetchedId.current === noticeId) return;
        fetchedId.current = noticeId;
        getNoticeById(noticeId)
            .then(setNotice)
            .catch(() => {})
    }, [noticeId]);

    if (!notice) {
        return (
            <div>
                <button className={styles.backBtn} onClick={onBack}>
                    <ChevronLeft size={20} /> 리스트로 돌아가기
                </button>
                <p style={{ color: '#6b7280', padding: '40px 0', textAlign: 'center' }}>공지사항을 찾을 수 없습니다.</p>
            </div>
        );
    }

    const dateStr = notice.createdAt ? notice.createdAt.slice(0, 10) : "";

    return (
        <div className={styles.detailContainer}>
            <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={20} /> 리스트로 돌아가기
            </button>

            <div className={styles.article}>
                <div className={styles.articleHeader}>
                    <h2 className={styles.title}>{notice.title}</h2>
                    <div className={styles.metaInfo}>
                        <span><Calendar size={14} /> {dateStr}</span>
                        <span><Eye size={14} /> 조회수 {notice.viewCount ?? 0}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    {notice.imageUrl && <img src={notice.imageUrl} alt="공지 이미지" className={styles.contentImg} />}
                    <p className={styles.contentText}>{notice.content}</p>
                </div>

                <div className={styles.articleFooter}>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>이전글</span>
                        {prevNotice
                            ? <span className={styles.navTitle} onClick={() => onSelect && onSelect(prevNotice.noticeId)}>{prevNotice.title}</span>
                            : <span className={styles.navEmpty}>이전 글이 없습니다.</span>
                        }
                    </div>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>다음글</span>
                        {nextNotice
                            ? <span className={styles.navTitle} onClick={() => onSelect && onSelect(nextNotice.noticeId)}>{nextNotice.title}</span>
                            : <span className={styles.navEmpty}>다음 글이 없습니다.</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
