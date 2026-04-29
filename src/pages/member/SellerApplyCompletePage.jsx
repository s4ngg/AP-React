import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/common/AuthLayout"
import styles from "./SellerApplyCompletePage.module.css"

export default function SellerApplyCompletePage() {
  const navigate = useNavigate()

  return (
    <AuthLayout title="신청 완료" description="">
      <div className={styles.container}>
        <div className={styles.iconWrap}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <h2 className={styles.title}>판매자 신청이 접수되었습니다</h2>
        <p className={styles.desc}>
          관리자 검토 후 영업일 기준 1~3일 내에<br />
          결과를 이메일로 안내해 드립니다.
        </p>
        <button
          className={styles.homeBtn}
          onClick={() => navigate("/")}
        >
          홈으로 이동
        </button>
      </div>
    </AuthLayout>
  )
}
