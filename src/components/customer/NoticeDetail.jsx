import React from 'react';
import { ChevronLeft, Calendar, Eye } from "lucide-react";
import styles from "./NoticeDetail.module.css";

const noticeData = [
    {
        id: 1,
        title: "[공지] AllPick 서비스 점검 안내 (4/20)",
        date: "2026-04-15",
        views: 124,
        isFixed: true,
        content: `안녕하세요. AllPick입니다.

더 나은 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.
점검 시간 동안에는 서비스 이용이 일시 중단되오니 양해 부탁드립니다.

■ 점검 일시: 2026년 4월 20일(월) 02:00 ~ 06:00 (약 4시간)
■ 점검 내용: 데이터베이스 최적화 및 서버 안정화 작업
■ 영향 범위: 전 서비스 이용 불가 (모바일 앱, PC 웹 포함)

◆ 점검 중 유의사항
- 점검 시간 중 진행 중인 주문은 자동 임시 저장됩니다.
- 점검 완료 후 정상적으로 재개되오니 안심하시기 바랍니다.
- 점검 전날 자정까지 결제 완료된 주문은 정상 처리됩니다.

예기치 않은 상황으로 점검이 연장될 경우, 홈페이지 팝업을 통해 별도 안내드리겠습니다.
불편을 드려 대단히 죄송하며, 보다 안정적인 서비스로 보답하겠습니다.

감사합니다.
AllPick 운영팀 드림`,
    },
    {
        id: 2,
        title: "[이벤트] 신규 가입 시 5,000원 할인 쿠폰 즉시 지급!",
        date: "2026-04-10",
        views: 892,
        isFixed: true,
        content: `안녕하세요. AllPick입니다.

새로운 AllPick 가족이 되신 것을 환영합니다! 🎉
신규 회원가입 시 즉시 사용 가능한 5,000원 할인 쿠폰을 드립니다.

◆ 이벤트 기간
2026년 4월 10일(목) ~ 2026년 6월 30일(화) 23:59까지

◆ 쿠폰 지급 대상
AllPick 신규 회원가입 완료자 전원

◆ 쿠폰 혜택 안내
- 쿠폰명: 신규가입 웰컴 쿠폰
- 할인 금액: 5,000원
- 최소 주문 금액: 30,000원 이상
- 유효 기간: 발급일로부터 30일
- 중복 사용: 다른 쿠폰과 중복 사용 불가

◆ 쿠폰 사용 방법
회원가입 완료 → 마이페이지 > 쿠폰함 확인 → 결제 시 쿠폰 선택 적용

◆ 유의사항
- 본 쿠폰은 본인 계정에서만 사용 가능하며 타인에게 양도할 수 없습니다.
- 쿠폰 적용 후 주문 취소 시 쿠폰은 재발급되지 않습니다.
- 일부 기획전·특가 상품은 쿠폰 적용이 제한될 수 있습니다.
- 이벤트 내용은 사정에 따라 변경되거나 조기 종료될 수 있습니다.

궁금하신 사항은 고객센터 1:1 문의를 통해 연락해주세요.

감사합니다.
AllPick 운영팀 드림`,
    },
    {
        id: 3,
        title: "개인정보 처리방침 개정 안내",
        date: "2026-04-05",
        views: 317,
        isFixed: false,
        content: `안녕하세요. AllPick입니다.

「개인정보 보호법」 제30조에 따라 AllPick 개인정보 처리방침이 아래와 같이 개정됩니다.
변경 내용을 꼭 확인하시고 이용에 참고해주시기 바랍니다.

◆ 시행 일자
2026년 5월 1일(금)부터 적용

◆ 주요 변경 사항

[변경 전]
제3조 (개인정보의 처리 및 보유기간)
- 회원 탈퇴 후 개인정보 즉시 파기

[변경 후]
제3조 (개인정보의 처리 및 보유기간)
- 회원 탈퇴 후 전자상거래법에 따라 거래 기록 5년 보관 후 파기
- 부정 이용 방지를 위한 최소한의 식별 정보(이메일 해시값) 1년 보관

[신설]
제8조 (개인정보의 국외 이전)
- 클라우드 인프라 운영을 위해 AWS(미국, 아일랜드 소재 서버) 활용 내용 추가

◆ 전문 확인 방법
홈페이지 하단 「개인정보 처리방침」 링크에서 전문을 확인하실 수 있습니다.

변경된 개인정보 처리방침은 시행 일자 이후 서비스 이용 시 자동으로 동의 처리됩니다.
내용에 동의하지 않으실 경우 회원 탈퇴를 통해 수집 거부 의사를 표시하실 수 있습니다.

이용자 여러분의 소중한 개인정보 보호를 위해 최선을 다하겠습니다.

감사합니다.
AllPick 개인정보 보호 담당자 드림`,
    },
    {
        id: 4,
        title: "배송 업체 변경 안내 (CJ대한통운 → 한진택배)",
        date: "2026-03-28",
        views: 543,
        isFixed: false,
        content: `안녕하세요. AllPick입니다.

물류 서비스 품질 향상을 위해 2026년 4월 7일(화)부터 기본 배송 업체가 변경됩니다.
고객 여러분의 더 빠르고 안전한 배송을 위한 결정이오니 양해 부탁드립니다.

◆ 변경 내용
- 변경 전: CJ대한통운
- 변경 후: 한진택배
- 적용 일자: 2026년 4월 7일(화) 출고분부터 적용

◆ 배송 시간 안내
- 수도권: 출고 후 1~2일 이내
- 지방: 출고 후 2~3일 이내
- 제주·도서산간: 출고 후 3~5일 이내 (추가 배송비 발생)

◆ 운송장 조회 방법
- 한진택배 공식 홈페이지: www.hanjin.com
- AllPick 마이페이지 > 주문배송 조회 (운송장 번호 자동 연동)

◆ 유의사항
- 변경일 이전 출고된 주문은 기존 CJ대한통운으로 배송됩니다.
- 배송 업체 변경으로 인한 배송비 변동은 없습니다.
- 일부 특수 상품(냉장·냉동·대형)은 별도 업체를 통해 배송될 수 있습니다.
- 배송 관련 문의는 고객센터(1:1 문의) 또는 한진택배 고객센터(1588-0011)로 연락해주세요.

더 나은 배송 서비스를 제공하기 위해 최선을 다하겠습니다.

감사합니다.
AllPick 물류팀 드림`,
    },
    {
        id: 5,
        title: "고객센터 운영 시간 변경 안내",
        date: "2026-03-20",
        views: 268,
        isFixed: false,
        content: `안녕하세요. AllPick입니다.

더욱 신속하고 충실한 고객 응대를 위해 고객센터 운영 시간이 아래와 같이 변경됩니다.
2026년 4월 1일(수)부터 적용되오니 참고해주시기 바랍니다.

◆ 변경 전 운영 시간
- 평일: 09:00 ~ 18:00
- 점심 시간: 12:00 ~ 13:00 (상담 중단)
- 토·일·공휴일: 휴무

◆ 변경 후 운영 시간
- 평일: 09:00 ~ 20:00 (야간 상담 2시간 연장)
- 점심 시간: 운영 유지 (점심시간 상담 중단 폐지)
- 토요일: 10:00 ~ 17:00 (신규 운영)
- 일요일·공휴일: 휴무 (유지)

◆ 1:1 온라인 문의 안내
- 운영 시간 외 접수된 문의는 다음 영업일 순서대로 처리됩니다.
- 평균 답변 소요 시간: 접수 후 24시간 이내 (영업일 기준)

◆ 전화 상담 안내
- 대표 전화: 1588-XXXX
- 통화 연결이 어려울 경우 1:1 온라인 문의를 이용해주세요.

운영 시간 확대를 통해 고객 여러분의 불편함을 빠르게 해소하도록 하겠습니다.
앞으로도 AllPick을 많이 이용해주세요.

감사합니다.
AllPick 고객서비스팀 드림`,
    },
    {
        id: 6,
        title: "포인트 적립 정책 변경 안내",
        date: "2026-03-10",
        views: 189,
        isFixed: false,
        content: `안녕하세요. AllPick입니다.

고객 여러분께 더 많은 혜택을 드리기 위해 포인트 적립 정책이 아래와 같이 변경됩니다.
2026년 4월 1일(수)부터 적용되오니 참고해주시기 바랍니다.

◆ 포인트 적립률 변경

[일반 회원]
- 변경 전: 결제 금액의 0.5% 적립
- 변경 후: 결제 금액의 1% 적립

[우수 회원 (최근 6개월 누적 구매 30만 원 이상)]
- 변경 전: 결제 금액의 1% 적립
- 변경 후: 결제 금액의 2% 적립

[VIP 회원 (최근 6개월 누적 구매 100만 원 이상)]
- 변경 전: 결제 금액의 1.5% 적립
- 변경 후: 결제 금액의 3% 적립

◆ 포인트 유효 기간 변경
- 변경 전: 적립일로부터 1년
- 변경 후: 적립일로부터 2년 (유효 기간 연장)

◆ 포인트 사용 조건 변경
- 최소 사용 금액: 기존 5,000P → 1,000P로 하향 조정
- 1회 최대 사용 한도: 결제 금액의 50% → 80%로 상향 조정
- 사용 단위: 1P = 1원 (동일 유지)

◆ 기존 보유 포인트 안내
- 기존에 적립된 포인트는 변경 없이 그대로 유지됩니다.
- 유효 기간이 남은 포인트는 새 정책 기준으로 자동 연장됩니다.

◆ 포인트 조회 방법
마이페이지 > 포인트 내역에서 적립·사용 내역을 확인하실 수 있습니다.

앞으로도 더 많은 혜택으로 보답하는 AllPick이 되겠습니다.

감사합니다.
AllPick 혜택팀 드림`,
    },
];

export default function NoticeDetail({ noticeId, onBack, onSelect }) {
    const currentIndex = noticeData.findIndex(n => n.id === noticeId);
    const notice = noticeData[currentIndex];
    const prevNotice = currentIndex > 0 ? noticeData[currentIndex - 1] : null;
    const nextNotice = currentIndex < noticeData.length - 1 ? noticeData[currentIndex + 1] : null;

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

    return (
        <div className={styles.detailContainer}>
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
                    {notice.imageUrl && <img src={notice.imageUrl} alt="공지 이미지" className={styles.contentImg} />}
                    <p className={styles.contentText}>{notice.content}</p>
                </div>

                <div className={styles.articleFooter}>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>이전글</span>
                        {prevNotice
                            ? <span className={styles.navTitle} onClick={() => onSelect && onSelect(prevNotice.id)}>{prevNotice.title}</span>
                            : <span className={styles.navEmpty}>이전 글이 없습니다.</span>
                        }
                    </div>
                    <div className={styles.navItem}>
                        <span className={styles.navLabel}>다음글</span>
                        {nextNotice
                            ? <span className={styles.navTitle} onClick={() => onSelect && onSelect(nextNotice.id)}>{nextNotice.title}</span>
                            : <span className={styles.navEmpty}>다음 글이 없습니다.</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
