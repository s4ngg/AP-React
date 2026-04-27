import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Package, CreditCard, CheckCircle, Tag } from "lucide-react"
import styles from "./OrderPage.module.css"
import useCartStore from "../../store/cartStore"
import useAuthStore from "../../store/authStore"
import { getDeliveryAddresses, createOrder } from "../../api/orderApi"
import { getUnusedCoupons } from "../../api/couponApi"

const payMethods = [
  { id: "CARD",          label: "신용카드",   icon: "💳" },
  { id: "KAKAO_PAY",     label: "카카오페이", icon: "💛" },
  { id: "NAVER_PAY",     label: "네이버페이", icon: "🟢" },
  { id: "BANK_TRANSFER", label: "무통장입금", icon: "🏦" },
]

export default function OrderPage() {
  const navigate = useNavigate()
  const { items = [], clearCart } = useCartStore()
  const { user: authUser } = useAuthStore()
  const user = authUser ?? { id: 1, name: "테스트", email: "test@test.com" }

  const [selectedPay, setSelectedPay] = useState("CARD")
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [completedOrderNumber, setCompletedOrderNumber] = useState("")

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  const [coupons, setCoupons] = useState([])
  const [selectedCouponId, setSelectedCouponId] = useState(null)
  const [showCouponList, setShowCouponList] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    getDeliveryAddresses(user.id)
      .then((data) => {
        setAddresses(data ?? [])
        const defaultAddr = (data ?? []).find((a) => a.isDefault) || (data ?? [])[0]
        if (defaultAddr) setSelectedAddressId(defaultAddr.addressId)
      })
      .catch(() => {})

    getUnusedCoupons(user.id)
      .then((data) => setCoupons(data ?? []))
      .catch(() => {})
  }, [user.id])

  const orderItems = items.filter((item) => item.isSelected)

  const totalProductPrice = orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )
  const shippingFee = 0

  const selectedAddress = addresses.find((a) => a.addressId === selectedAddressId) ?? null
  const selectedCoupon = coupons.find((c) => c.memberCouponId === selectedCouponId) ?? null

  const discountAmount = selectedCoupon
    ? selectedCoupon.coupon.discountType === "PERCENT"
      ? Math.min(
          Math.round(totalProductPrice * selectedCoupon.coupon.discountValue / 100),
          selectedCoupon.coupon.maxDiscount ?? Infinity
        )
      : Number(selectedCoupon.coupon.discountValue)
    : 0

  const totalPrice = totalProductPrice + shippingFee - discountAmount

  const handlePay = async () => {
    if (!selectedPay || !selectedAddressId || orderItems.length === 0) return

    setIsLoading(true)
    try {
      const requestBody = {
        addressId: selectedAddressId,
        memberCouponId: selectedCouponId ?? null,
        paymentMethod: selectedPay,
        orderItems: orderItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
        })),
      }

      const result = await createOrder(user.id, requestBody)
      clearCart()
      setCompletedOrderNumber(result.orderNumber)
      setIsComplete(true)
    } catch (e) {
      alert("주문 처리 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

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
          주문번호: {completedOrderNumber}
        </div>
        <div className={styles.completeBtns}>
          <Link to="/my-page" className={styles.completeBtnPrimary}>주문 내역 보기</Link>
          <Link to="/" className={styles.completeBtnSecondary}>쇼핑 계속하기</Link>
        </div>
      </div>
    )
  }

if (orderItems.length === 0) {
  return (
    <div className={styles.emptyPage}>
      <p>주문할 상품이 없습니다.</p>
      <Link to="/" className={styles.completeBtnPrimary}>쇼핑하러 가기</Link>
    </div>
  )
}

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>주문 / 결제</h1>

      <div className={styles.layout}>
        <div className={styles.leftArea}>

          {/* 배송지 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              배송지 정보
            </h2>
            {selectedAddress ? (
              <div className={styles.addressInfo}>
                <div className={styles.addressRow}>
                  <span className={styles.addressLabel}>받는 분</span>
                  <span className={styles.addressValue}>{selectedAddress.recipientName}</span>
                </div>
                <div className={styles.addressRow}>
                  <span className={styles.addressLabel}>연락처</span>
                  <span className={styles.addressValue}>{selectedAddress.phone}</span>
                </div>
                <div className={styles.addressRow}>
                  <span className={styles.addressLabel}>주소</span>
                  <span className={styles.addressValue}>
                    ({selectedAddress.zipCode}) {selectedAddress.address}<br />
                    {selectedAddress.addressDetail}
                  </span>
                </div>
              </div>
            ) : (
              <p className={styles.emptyText}>등록된 배송지가 없습니다.</p>
            )}
            {addresses.length > 1 && (
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <button
                    key={addr.addressId}
                    className={`${styles.addressSelectBtn} ${selectedAddressId === addr.addressId ? styles.addressSelectActive : ""}`}
                    onClick={() => setSelectedAddressId(addr.addressId)}
                  >
                    {addr.recipientName} · {addr.address}
                    {addr.isDefault && <span className={styles.defaultBadge}>기본</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 주문 상품 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Package size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              주문 상품 ({orderItems.length}개)
            </h2>
            <div className={styles.productList}>
              {orderItems.map((item) => (
                <div key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`} className={styles.productItem}>
                  <img src={item.product.image} alt={item.product.name} className={styles.productImg} />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.product.name}</p>
                    <p className={styles.productMeta}>{item.quantity}개</p>
                    <p className={styles.productPrice}>
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 쿠폰 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Tag size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              쿠폰 적용
            </h2>
            {coupons.length === 0 ? (
              <p className={styles.emptyText}>사용 가능한 쿠폰이 없습니다.</p>
            ) : (
              <>
                <button
                  className={styles.couponToggleBtn}
                  onClick={() => setShowCouponList(!showCouponList)}
                >
                  {selectedCoupon
                    ? `${selectedCoupon.coupon.couponCode} 적용중`
                    : `쿠폰 선택 (${coupons.length}장 보유)`}
                </button>
                {showCouponList && (
                  <div className={styles.couponList}>
                    <button
                      className={`${styles.couponItem} ${selectedCouponId === null ? styles.couponItemActive : ""}`}
                      onClick={() => { setSelectedCouponId(null); setShowCouponList(false) }}
                    >
                      쿠폰 사용 안함
                    </button>
                    {coupons.map((mc) => (
                      <button
                        key={mc.memberCouponId}
                        className={`${styles.couponItem} ${selectedCouponId === mc.memberCouponId ? styles.couponItemActive : ""}`}
                        onClick={() => { setSelectedCouponId(mc.memberCouponId); setShowCouponList(false) }}
                      >
                        <span className={styles.couponCode}>{mc.coupon.couponCode}</span>
                        <span className={styles.couponDiscount}>
                          {mc.coupon.discountType === "PERCENT"
                            ? `${mc.coupon.discountValue}% 할인`
                            : `${Number(mc.coupon.discountValue).toLocaleString()}원 할인`}
                        </span>
                        <span className={styles.couponCondition}>
                          {Number(mc.coupon.minOrderAmount).toLocaleString()}원 이상 구매 시
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
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

        {/* 오른쪽 */}
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
              {discountAmount > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>쿠폰 할인</span>
                  <span className={styles.discountText}>-{discountAmount.toLocaleString()}원</span>
                </div>
              )}
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
              disabled={isLoading || !selectedAddressId}
            >
              {isLoading ? "결제 처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}