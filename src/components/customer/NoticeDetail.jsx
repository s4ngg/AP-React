import React from 'react';
import { ChevronLeft, Calendar, Eye, FileText } from "lucide-react";
import styles from "./NoticeDetail.module.css";

export default function NoticeDetail({ onBack }) {
    // 나중에 API로 가져올 데이터 구조 (예시)
    const notice = {
        title: "[공지] AllPick 서비스 점검 안내 (4/20)",
        date: "2026-04-15",
        views: 124,
        content: `안녕하세요. AllPick입니다.
    
더 나은 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.
점검 시간 동안에는 서비스 이용이 일시 중단되오니 양해 부탁드립니다.

■ 점검 일시: 2026년 4월 20일(월) 02:00 ~ 06:00 (약 4시간)
■ 점검 내용: 데이터베이스 최적화 및 서버 안정화 작업
■ 영향 범위: 전 서비스 이용 불가

항상 저희 AllPick을 이용해주셔서 감사합니다.`,
        imageUrl: null // 이미지 첨부 시 들어갈 자리
    };

    return (
        <div className={styles.detailContainer}>
            {/* 상단 헤더: 뒤로가기 버튼 */}
            <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={20} /> 리스트로 돌아가기
            </button>

            <div className={styles.article}>
                <div className={styles.articleHeader}>
                    <h2 className={styles.title}>{notice.title}</h2>
                    <div className={styles.metaInfo}>
                        <span><Calendar size={14} /> {notice.date}</span>
                        <span><Eye size={14} /> 조회수 {notice.views}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* 이미지 있으면 출력 */}
                    {notice.imageUrl && <img src={notice.imageUrl} alt="공지 이미지" className={styles.contentImg} />}

                    <p className={styles.contentText}>{notice.content}</p>
                </div>

                {/* 하단 푸터: 이전글/다음글 (선택 사항) */}
                <div className={styles.articleFooter}>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>이전글</span>
                        <span className={styles.navTitle}>개인정보 처리방침 개정 안내</span>
                    </div>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>다음글</span>
                        <span className={styles.navTitle}>다음 글이 없습니다.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}