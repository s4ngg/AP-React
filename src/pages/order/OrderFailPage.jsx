import { Link, useSearchParams } from "react-router-dom"
import styles from "./OrderPage.module.css"

export default function OrderFailPage() {
    const [searchParams] = useSearchParams()
    const message = searchParams.get("message") ?? "결제에 실패했습니다."

    return (
        <div className={styles.completePage}>
            <h2 className={styles.completeTitle}>결제 실패</h2>
            <p className={styles.completeDesc}>{message}</p>
            <div className={styles.completeBtns}>
                <Link to="/order" className={styles.completeBtnPrimary}>다시 시도</Link>
                <Link to="/" className={styles.completeBtnSecondary}>쇼핑 계속하기</Link>
            </div>
        </div>
    )
}