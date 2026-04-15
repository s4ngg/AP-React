import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Package, CreditCard, CheckCircle } from "lucide-react"
import styles from "./OrderPage.module.css"

// 임시 주문 상품 데이터 (추후 장바구니 상태에서 받아올 예정)
const orderItems = [
  {
    id: 1,
    name: "[에스티로더] 갈색병 세럼 50ml",
    option: "50ml / 1개",
    price: 89000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "[나이키] 에어맥스 97 화이트",
    option: "270mm / 1개",
    price: 179000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
  },
]

const payMethods = [
  { id: "card",   label: "신용카드",   icon: "💳" },
  { id: "kakao",  label: "카카오페이", icon: "💛" },
  { id: "naver",  label: "네이버페이", icon: "🟢" },
  { id: "account",label: "무통장입금", icon: "🏦" },
]

export default function OrderPage() {
  const navigate = useNavigate()
  const [selectedPay, setSelectedPay] = useState("card")
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalProductPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 0
  const totalPrice = totalProductPrice + shippingFee

  const orderNumber = "AP-" + Date.now().toString().slice(-8)

  const handlePay = () => {
    if (!selectedPay) return
    setIsLoading(true)
    // FakeAPI - 실제 결제 없이 2초 후 완료 처리
    setTimeout(() => {
      setIsLoading(false)
      setIsComplete(true)
    }, 2000)
  }

  // 결제 완료 화면
  if (isComplete) {
    return (
      <div className={styles.completePage}>
        <div className={styles.completeIcon}>
          <CheckCircle size={40} color="#2563eb" />
        </div>
        <h2 className={styles.completeTitle}>주문이 완료되었습니다!</h2>
        <p className={styles.completeDesc}>
          주문해 주셔서 감사합니다.<br />
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>
        <div className={styles.completeOrderNum}>
          주문번호: {orderNumber}
        </div>
        <div className={styles.completeBtns}>
          <Link to="/mypage/orders" className={styles.completeBtnPrimary}>
            주문 내역 보기
          </Link>
          <Link to="/" className={styles.completeBtnSecondary}>
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>주문 / 결제</h1>

      <div className={styles.layout}>
        {/* 왼쪽 */}
        <div className={styles.leftArea}>

          {/* 배송지 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              배송지 정보
            </h2>
            <div className={styles.addressInfo}>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>받는 분</span>
                <span className={styles.addressValue}>김상우</span>
              </div>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>연락처</span>
                <span className={styles.addressValue}>010-1234-5678</span>
              </div>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>주소</span>
                <span className={styles.addressValue}>
                  (12345) 인천광역시 미추홀구 OO로 123<br />
                  OO아파트 101동 101호
                </span>
              </div>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>배송 요청</span>
                <span className={styles.addressValue}>문 앞에 놓아주세요</span>
              </div>
            </div>
            <button className={styles.addressChangeBtn}>배송지 변경</button>
          </div>

          {/* 주문 상품 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Package size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              주문 상품 ({orderItems.length}개)
            </h2>
            <div className={styles.productList}>
              {orderItems.map((item) => (
                <div key={item.id} className={styles.productItem}>
                  <img src={item.image} alt={item.name} className={styles.productImg} />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.name}</p>
                    <p className={styles.productMeta}>{item.option}</p>
                    <p className={styles.productPrice}>
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 수단 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <CreditCard size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              결제 수단
            </h2>
            <div className={styles.payMethodList}>
              {payMethods.map((method) => (
                <button
                  key={method.id}
                  className={`${styles.payMethodBtn} ${selectedPay === method.id ? styles.payMethodActive : ""}`}
                  onClick={() => setSelectedPay(method.id)}
                >
                  <span className={styles.payIcon}>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 오른쪽 - 결제 요약 */}
        <div className={styles.rightArea}>
          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>결제 금액</h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryRowLabel}>상품 금액</span>
                <span>{totalProductPrice.toLocaleString()}원</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryRowLabel}>배송비</span>
                <span>{shippingFee === 0 ? "무료" : shippingFee.toLocaleString() + "원"}</span>
              </div>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>최종 결제 금액</span>
              <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
            </div>
            <p className={styles.agreeText}>
              주문 내용을 확인하였으며,<br />
              구매 진행에 동의합니다.
            </p>
            <button
              className={styles.payBtn}
              onClick={handlePay}
              disabled={isLoading}
            >
              {isLoading ? "결제 처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
