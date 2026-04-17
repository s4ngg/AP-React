import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/common/AuthLayout";
import styles from "./SignupSelectPage.module.css";

export default function SignupSelectPage() {
    const navigate = useNavigate();

    return (
        <AuthLayout title="회원가입" description="가입 유형을 선택해주세요">
            <div className={styles.container}>
                <div className={styles.card} onClick={() => navigate("/signup/user")}>
                    <div className={styles.iconWrap}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                    </div>
                    <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>일반 회원</p>
                        <p className={styles.cardDesc}>상품을 검색하고 구매할 수 있어요</p>
                        <ul className={styles.featureList}>
                            <li>다양한 상품 구매</li>
                            <li>쿠폰 및 할인 혜택</li>
                            <li>구매 내역 관리</li>
                        </ul>
                    </div>
                    <div className={styles.arrow}>→</div>
                </div>

                <div className={styles.card} onClick={() => navigate("/signup/seller")}>
                    <div className={styles.iconWrap}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>판매자</p>
                        <p className={styles.cardDesc}>상품을 등록하고 판매할 수 있어요</p>
                        <ul className={styles.featureList}>
                            <li>상품 등록 및 관리</li>
                            <li>주문 및 배송 관리</li>
                            <li>정산 및 매출 확인</li>
                        </ul>
                    </div>
                    <div className={styles.arrow}>→</div>
                </div>
            </div>
        </AuthLayout>
    );
}