import { useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import styles from "./OrderPage.module.css"
import axios from "axios"
import useCartStore from "../../store/cartStore"
import useAuthStore from "../../store/authStore"

export default function OrderSuccessPage() {
    const [searchParams] = useSearchParams()
    const orderNumber = searchParams.get("orderNumber")
    const paymentKey = searchParams.get("paymentKey")
    const amount = searchParams.get("amount")
    const { clearCart } = useCartStore()
    const { token } = useAuthStore()

    useEffect(() => {
        if (orderNumber && paymentKey && amount) {
            axios.post(`${import.meta.env.VITE_API_URL}/api/orders/confirm`, null, {
                params: { orderNumber, paymentKey, amount },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                clearCart()
            })
            .catch((e) => console.error("결제 확인 실패", e))
        }
    }, [])

    return (
        <div className={styles.completePage}>
            <div className={styles.completeIcon}>
                <CheckCircle size={40} color="#2563eb" />
            </div>
            <h2 className={styles.completeTitle}>결제가 완료되었습니다!</h2>
            <p className={styles.completeDesc}>
                주문해 주셔서 감사합니다.<br />
                주문 내역은 마이페이지에서 확인하실 수 있습니다.
            </p>
            <div className={styles.completeOrderNum}>
                주문번호: {orderNumber}
            </div>
            <div className={styles.completeBtns}>
                <Link to="/mypage" className={styles.completeBtnPrimary}>주문 내역 보기</Link>
                <Link to="/" className={styles.completeBtnSecondary}>쇼핑 계속하기</Link>
            </div>
        </div>
    )
}