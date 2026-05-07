import { useState, useEffect } from "react"
import styles from "./MyPage.module.css"
import useAuthStore from "../../store/authStore"
import { getMember, updateMember, changePassword, deleteMember } from "../../api/memberApi"
import { getMemberCoupons } from "../../api/couponApi"
import { getMembershipHistory } from "../../api/membershipApi"
import { getMyOrders, getDeliveryAddresses, deleteDeliveryAddress } from "../../api/orderApi"
import { User, Package, MapPin, AlertTriangle, ChevronRight, Eye, EyeOff, Award, Ticket, Store } from "lucide-react"
import { useNavigate } from "react-router-dom"

// 백엔드 OrderStatus enum → 한글 라벨 매핑
const STATUS_LABEL = {
  PENDING: "주문완료",
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
}

const STATUS_CLASS = {
  PENDING: "statusOrder",
  PAID: "statusOrder",
  SHIPPING: "statusShipping",
  DELIVERED: "statusDone",
  CANCELLED: "statusCancel",
}

const GRADE_CONFIG = {
  NORMAL: { label: "일반", color: "#6b7280", bg: "#f3f4f6", minAmount: 0 },
  SILVER: { label: "실버", color: "#6366f1", bg: "#eef2ff", minAmount: 300000 },
  GOLD: { label: "골드", color: "#d97706", bg: "#fffbeb", minAmount: 1000000 },
  PLATINUM: { label: "플래티넘", color: "#0891b2", bg: "#ecfeff", minAmount: 3000000 },
}

const GRADE_ORDER = ["NORMAL", "SILVER", "GOLD", "PLATINUM"]

const GRADE_LABEL = {
  NORMAL: "일반",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
}

const tabs = [
  { id: "info", label: "내 정보 관리", icon: User },
  { id: "orders", label: "주문 내역", icon: Package },
  { id: "address", label: "배송지 관리", icon: MapPin },
  { id: "coupon", label: "쿠폰함", icon: Ticket },
  { id: "membership", label: "멤버십", icon: Award },
  { id: "seller", label: "판매자 신청", icon: Store },
  { id: "withdrawal", label: "회원 탈퇴", icon: AlertTriangle },
]
export default function MyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")
  const [couponFilter, setCouponFilter] = useState("available")
  const [isEditing, setIsEditing] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)

  const { logout } = useAuthStore()

  // 회원 정보
  const [memberInfo, setMemberInfo] = useState(null)
  const [memberId, setMemberId] = useState(null)

  // 멤버십
  const [memberGrade, setMemberGrade] = useState("NORMAL")
  const [membershipHistory, setMembershipHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // 쿠폰
  const [coupons, setCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(false)

  // 주문
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // 배송지
  const [addresses, setAddresses] = useState([])
  const [addressLoading, setAddressLoading] = useState(false)

  // 내 정보 수정 폼
  const [form, setForm] = useState({ phone: "", address: "", addressDetail: "" })
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })

  // 마운트 시 회원 정보 로드
  useEffect(() => {
    getMember()
      .then((data) => {
        setMemberId(data.id)
        setMemberInfo(data)
        setMemberGrade(data.grade ?? "NORMAL")
        setForm({ phone: data.phone ?? "", address: data.address ?? "", addressDetail: "" })
      })
      .catch(() => {})
  }, [])

  // 주문 탭 진입 시 API 호출
  useEffect(() => {
    if (activeTab !== "orders") return
    setOrdersLoading(true)
    getMyOrders()
      .then((data) => setOrders(data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false))
  }, [activeTab])

  // 배송지 탭 진입 시 API 호출
  useEffect(() => {
    if (activeTab !== "address") return
    setAddressLoading(true)
    getDeliveryAddresses()
      .then((data) => setAddresses(data ?? []))
      .catch(() => setAddresses([]))
      .finally(() => setAddressLoading(false))
  }, [activeTab])

  // 쿠폰 탭 진입 시 API 호출
  useEffect(() => {
    if (activeTab !== "coupon" || !memberId) return
    setCouponLoading(true)
    getMemberCoupons(memberId)
      .then((data) => setCoupons(data ?? []))
      .catch(() => setCoupons([]))
      .finally(() => setCouponLoading(false))
  }, [activeTab, memberId])

  // 멤버십 탭 진입 시 API 호출
  useEffect(() => {
    if (activeTab !== "membership" || !memberId) return
    setHistoryLoading(true)
    getMembershipHistory(memberId)
      .then((data) => setMembershipHistory(data ?? []))
      .catch(() => setMembershipHistory([]))
      .finally(() => setHistoryLoading(false))
  }, [activeTab, memberId])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePwChange = (e) => {
    const { name, value } = e.target
    setPwForm((prev) => ({ ...prev, [name]: value }))
  }

  // 내 정보 수정 저장
  const handleInfoSave = () => {
    updateMember({ phone: form.phone, address: form.address })
      .then((data) => {
        setMemberInfo(data)
        setIsEditing(false)
      })
      .catch(() => alert("정보 수정에 실패했습니다."))
  }

  // 비밀번호 변경
  const handlePwSave = () => {
    if (pwForm.next !== pwForm.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }
    changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next })
      .then(() => {
        alert("비밀번호가 변경되었습니다.")
        setPwForm({ current: "", next: "", confirm: "" })
        setShowPwForm(false)
      })
      .catch(() => alert("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요."))
  }

  // 회원 탈퇴
  const handleWithdraw = () => {
    deleteMember()
      .then(() => {
        logout()
        window.location.href = "/"
      })
      .catch(() => alert("탈퇴 처리에 실패했습니다."))
  }

  // 배송지 삭제
  const handleDeleteAddress = (addressId) => {
    if (!window.confirm("배송지를 삭제하시겠습니까?")) return
    deleteDeliveryAddress(addressId)
      .then(() => setAddresses((prev) => prev.filter((a) => a.addressId !== addressId)))
      .catch(() => alert("삭제에 실패했습니다."))
  }

  const filteredCoupons = coupons.filter((c) =>
    couponFilter === "available" ? !c.isUsed : c.isUsed
  )

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "PERCENT") return `${coupon.discountValue}% 할인`
    return `${Number(coupon.discountValue).toLocaleString()}원 할인`
  }

  const formatDate = (dateStr) => dateStr?.slice(0, 10) ?? ""
  const isExpired = (dateStr) => new Date(dateStr) < new Date()

  const currentGradeConfig = GRADE_CONFIG[memberGrade] ?? GRADE_CONFIG.NORMAL

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>마이페이지</h1>

      <div className={styles.layout}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{memberInfo?.name?.slice(0, 1) ?? ""}</div>
            <p className={styles.userName}>{memberInfo?.name ?? ""}</p>
            <p className={styles.userEmail}>{memberInfo?.email ?? ""}</p>
            <div
              className={styles.gradeBadge}
              style={{ backgroundColor: currentGradeConfig.bg, color: currentGradeConfig.color }}
            >
              <Award size={12} />
              {currentGradeConfig.label}
            </div>
          </div>
          <nav className={styles.tabNav}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`${styles.tabBtn} ${activeTab === id ? styles.tabBtnActive : ""} ${id === "withdrawal" ? styles.tabBtnDanger : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} />
                {label}
                <ChevronRight size={14} className={styles.tabChevron} />
              </button>
            ))}
          </nav>
        </aside>

        {/* 콘텐츠 영역 */}
        <div className={styles.content}>

          {/* 내 정보 관리 */}
          {activeTab === "info" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>내 정보 관리</h2>
                {!isEditing && (
                  <button className={styles.editBtn} onClick={() => setIsEditing(true)}>수정</button>
                )}
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이름</span>
                  <span className={styles.infoValue}>{memberInfo?.name ?? ""}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이메일</span>
                  <span className={styles.infoValue}>{memberInfo?.email ?? ""}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>연락처</span>
                  {isEditing ? (
                    <input className={styles.input} name="phone" value={form.phone} onChange={handleFormChange} placeholder="010-0000-0000" />
                  ) : (
                    <span className={styles.infoValue}>{form.phone}</span>
                  )}
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>주소</span>
                  {isEditing ? (
                    <div className={styles.addressInputWrap}>
                      <input className={styles.input} name="address" value={form.address} onChange={handleFormChange} placeholder="기본 주소" />
                      <input className={styles.input} name="addressDetail" value={form.addressDetail} onChange={handleFormChange} placeholder="상세 주소" />
                    </div>
                  ) : (
                    <span className={styles.infoValue}>{form.address}<br />{form.addressDetail}</span>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className={styles.actionRow}>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>취소</button>
                  <button className={styles.saveBtn} onClick={handleInfoSave}>저장</button>
                </div>
              )}
              <div className={styles.pwSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.subSectionTitle}>비밀번호 변경</h3>
                  <button className={styles.editBtn} onClick={() => setShowPwForm(!showPwForm)}>
                    {showPwForm ? "취소" : "변경"}
                  </button>
                </div>
                {showPwForm && (
                  <div className={styles.pwForm}>
                    <div className={styles.pwInputWrap}>
                      <input className={styles.input} type={showPw ? "text" : "password"} name="current" value={pwForm.current} onChange={handlePwChange} placeholder="현재 비밀번호" />
                      <button className={styles.eyeBtn} onClick={() => setShowPw(!showPw)} aria-label="비밀번호 표시">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className={styles.pwInputWrap}>
                      <input className={styles.input} type={showNewPw ? "text" : "password"} name="next" value={pwForm.next} onChange={handlePwChange} placeholder="새 비밀번호 (영문+숫자+특수문자 8자 이상)" />
                      <button className={styles.eyeBtn} onClick={() => setShowNewPw(!showNewPw)} aria-label="새 비밀번호 표시">
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className={styles.pwInputWrap}>
                      <input className={styles.input} type={showConfirmPw ? "text" : "password"} name="confirm" value={pwForm.confirm} onChange={handlePwChange} placeholder="새 비밀번호 확인" />
                      <button className={styles.eyeBtn} onClick={() => setShowConfirmPw(!showConfirmPw)} aria-label="비밀번호 확인 표시">
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className={styles.actionRow}>
                      <button className={styles.saveBtn} onClick={handlePwSave}>변경 완료</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 주문 내역 */}
          {activeTab === "orders" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>주문 내역</h2>
              {ordersLoading ? (
                <div className={styles.empty}><p>불러오는 중...</p></div>
              ) : orders.length === 0 ? (
                <div className={styles.empty}>
                  <Package size={40} color="#d1d5db" />
                  <p>주문 내역이 없습니다.</p>
                </div>
              ) : (
                <div className={styles.orderList}>
                  {orders.map((order) => (
                    <div key={order.orderId} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div className={styles.orderMeta}>
                          <span className={styles.orderDate}>{order.orderedAt?.slice(0, 10)}</span>
                          <span className={styles.orderNum}>주문번호 {order.orderNumber}</span>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]]}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>
                      <div className={styles.orderItems}>
                        {order.orderItems?.map((item) => (
                          <div key={item.orderItemId} className={styles.orderItem}>
                            <div className={styles.orderItemInfo}>
                              <p className={styles.orderItemName}>{item.productName}</p>
                              <p className={styles.orderItemMeta}>{item.quantity}개</p>
                              <p className={styles.orderItemPrice}>{Number(item.totalPrice).toLocaleString()}원</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.orderFooter}>
                        <span className={styles.orderTotal}>
                          총 결제 금액 <strong>{Number(order.totalAmount).toLocaleString()}원</strong>
                        </span>
                        {order.status === "PENDING" && (
                          <button className={styles.cancelOrderBtn}>주문 취소</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 배송지 관리 */}
          {activeTab === "address" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>배송지 관리</h2>
                <button className={styles.addBtn}>+ 배송지 추가</button>
              </div>
              {addressLoading ? (
                <div className={styles.empty}><p>불러오는 중...</p></div>
              ) : addresses.length === 0 ? (
                <div className={styles.empty}>
                  <MapPin size={40} color="#d1d5db" />
                  <p>등록된 배송지가 없습니다.</p>
                </div>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((addr) => (
                    <div key={addr.addressId} className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ""}`}>
                      <div className={styles.addressCardHeader}>
                        <div className={styles.addressNameWrap}>
                          <span className={styles.addressName}>{addr.recipientName}</span>
                          {addr.isDefault && <span className={styles.defaultBadge}>기본 배송지</span>}
                        </div>
                        <div className={styles.addressActions}>
                          {!addr.isDefault && <button className={styles.addressActionBtn}>기본 설정</button>}
                          <button className={styles.addressActionBtn}>수정</button>
                          {!addr.isDefault && (
                            <button
                              className={`${styles.addressActionBtn} ${styles.addressDeleteBtn}`}
                              onClick={() => handleDeleteAddress(addr.addressId)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={styles.addressPhone}>{addr.phone}</p>
                      <p className={styles.addressText}>({addr.zipCode}) {addr.address}</p>
                      <p className={styles.addressText}>{addr.addressDetail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 쿠폰함 */}
          {activeTab === "coupon" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>쿠폰함</h2>
                <span className={styles.couponCount}>
                  사용 가능 <strong>{coupons.filter((c) => !c.isUsed).length}</strong>장
                </span>
              </div>
              <div className={styles.couponFilterWrap}>
                <button
                  className={`${styles.couponFilterBtn} ${couponFilter === "available" ? styles.couponFilterActive : ""}`}
                  onClick={() => setCouponFilter("available")}
                >
                  사용 가능
                </button>
                <button
                  className={`${styles.couponFilterBtn} ${couponFilter === "used" ? styles.couponFilterActive : ""}`}
                  onClick={() => setCouponFilter("used")}
                >
                  사용 완료
                </button>
              </div>
              {couponLoading ? (
                <div className={styles.empty}><p>로딩 중...</p></div>
              ) : filteredCoupons.length === 0 ? (
                <div className={styles.empty}>
                  <Ticket size={40} color="#d1d5db" />
                  <p>{couponFilter === "available" ? "사용 가능한 쿠폰이 없습니다." : "사용한 쿠폰이 없습니다."}</p>
                </div>
              ) : (
                <div className={styles.couponList}>
                  {filteredCoupons.map((mc) => (
                    <div
                      key={mc.memberCouponId}
                      className={`${styles.couponCard} ${mc.isUsed || isExpired(mc.coupon.expiredAt) ? styles.couponCardDisabled : ""}`}
                    >
                      <div className={styles.couponLeft}>
                        <p className={styles.couponDiscount}>{formatDiscount(mc.coupon)}</p>
                        <p className={styles.couponCode}>{mc.coupon.couponCode}</p>
                        <p className={styles.couponCondition}>
                          {Number(mc.coupon.minOrderAmount).toLocaleString()}원 이상 구매 시
                          {mc.coupon.maxDiscount && ` / 최대 ${Number(mc.coupon.maxDiscount).toLocaleString()}원`}
                        </p>
                      </div>
                      <div className={styles.couponRight}>
                        {mc.isUsed ? (
                          <span className={styles.couponUsedBadge}>사용완료</span>
                        ) : isExpired(mc.coupon.expiredAt) ? (
                          <span className={styles.couponExpiredBadge}>기간만료</span>
                        ) : (
                          <span className={styles.couponAvailableBadge}>사용가능</span>
                        )}
                        <p className={styles.couponExpire}>
                          {mc.isUsed ? `사용일: ${formatDate(mc.usedAt)}` : `만료일: ${formatDate(mc.coupon.expiredAt)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 멤버십 */}
          {activeTab === "membership" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>멤버십</h2>
              <div
                className={styles.gradeCard}
                style={{ backgroundColor: currentGradeConfig.bg, borderColor: currentGradeConfig.color }}
              >
                <div className={styles.gradeCardLeft}>
                  <Award size={32} color={currentGradeConfig.color} />
                  <div>
                    <p className={styles.gradeLabel}>현재 등급</p>
                    <p className={styles.gradeName} style={{ color: currentGradeConfig.color }}>
                      {currentGradeConfig.label}
                    </p>
                  </div>
                </div>
                <p className={styles.gradeNotice}>매월 1일 전월 구매금액 기준으로 갱신됩니다.</p>
              </div>

              <div className={styles.gradeCriteria}>
                <h3 className={styles.subSectionTitle}>등급 기준</h3>
                <div className={styles.gradeList}>
                  {GRADE_ORDER.map((grade) => (
                    <div
                      key={grade}
                      className={`${styles.gradeItem} ${memberGrade === grade ? styles.gradeItemActive : ""}`}
                      style={memberGrade === grade ? { borderColor: GRADE_CONFIG[grade].color } : {}}
                    >
                      <div className={styles.gradeItemLeft}>
                        <Award size={16} color={GRADE_CONFIG[grade].color} />
                        <span className={styles.gradeItemName} style={{ color: GRADE_CONFIG[grade].color }}>
                          {GRADE_CONFIG[grade].label}
                        </span>
                        {memberGrade === grade && (
                          <span className={styles.currentBadge} style={{ backgroundColor: GRADE_CONFIG[grade].color }}>
                            현재
                          </span>
                        )}
                      </div>
                      <span className={styles.gradeItemAmount}>
                        {grade === "NORMAL" ? "기본 등급" : `전월 ${GRADE_CONFIG[grade].minAmount.toLocaleString()}원 이상`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.gradeHistory}>
                <h3 className={styles.subSectionTitle}>등급 변경 이력</h3>
                {historyLoading ? (
                  <div className={styles.empty}><p>불러오는 중...</p></div>
                ) : membershipHistory.length === 0 ? (
                  <div className={styles.empty}>
                    <Award size={40} color="#d1d5db" />
                    <p>등급 변경 이력이 없습니다.</p>
                  </div>
                ) : (
                  <div className={styles.historyList}>
                    {membershipHistory.map((h) => (
                      <div key={h.historyId} className={styles.historyItem}>
                        <div className={styles.historyGrades}>
                          <span style={{ color: GRADE_CONFIG[h.previousGrade]?.color ?? "#6b7280" }}>
                            {GRADE_LABEL[h.previousGrade] ?? h.previousGrade}
                          </span>
                          <span className={styles.historyArrow}>→</span>
                          <span style={{ color: GRADE_CONFIG[h.newGrade]?.color ?? "#6b7280" }}>
                            {GRADE_LABEL[h.newGrade] ?? h.newGrade}
                          </span>
                        </div>
                        <div className={styles.historyMeta}>
                          <span>{Number(h.monthlyAmount).toLocaleString()}원</span>
                          <span>{h.changedAt?.slice(0, 10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 판매자 신청 */}
          {activeTab === "seller" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>판매자 신청</h2>
              <div className={styles.withdrawalWrap}>
                <div className={styles.withdrawalWarning}>
                  <Store size={20} color="#6366f1" />
                  <p className={styles.withdrawalWarningText}>판매자로 전환하면 상품을 등록하고 판매할 수 있어요.</p>
                </div>
                <ul className={styles.withdrawalList}>
                  <li>상품 등록 및 관리</li>
                  <li>주문 및 배송 관리</li>
                  <li>정산 및 매출 확인</li>
                </ul>
                <button
                  className={styles.saveBtn}
                  onClick={() => navigate("/seller-apply")}
                >
                  판매자 신청하기
                </button>
              </div>
            </div>
          )}
          {/* 회원 탈퇴 */}
          {activeTab === "withdrawal" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>회원 탈퇴</h2>
              <div className={styles.withdrawalWrap}>
                <div className={styles.withdrawalWarning}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <p className={styles.withdrawalWarningText}>탈퇴 시 아래 정보가 모두 삭제됩니다.</p>
                </div>
                <ul className={styles.withdrawalList}>
                  <li>회원 정보 (이름, 이메일, 연락처, 주소)</li>
                  <li>주문 내역 및 배송지 정보</li>
                  <li>위시리스트 및 장바구니</li>
                  <li>작성한 리뷰 및 문의</li>
                </ul>
                <p className={styles.withdrawalNotice}>
                  탈퇴 후에는 동일한 이메일로 재가입이 가능하나, 기존 데이터는 복구되지 않습니다.
                </p>
                {!showWithdrawConfirm ? (
                  <button className={styles.withdrawalBtn} onClick={() => setShowWithdrawConfirm(true)}>
                    회원 탈퇴하기
                  </button>
                ) : (
                  <div className={styles.withdrawalConfirm}>
                    <p className={styles.withdrawalConfirmText}>정말로 탈퇴하시겠습니까?</p>
                    <div className={styles.actionRow}>
                      <button className={styles.cancelBtn} onClick={() => setShowWithdrawConfirm(false)}>취소</button>
                      <button className={styles.withdrawalConfirmBtn} onClick={handleWithdraw}>탈퇴 확인</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
