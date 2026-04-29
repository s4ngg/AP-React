import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Package, MapPin, AlertTriangle, ChevronRight, Eye, EyeOff, Store } from "lucide-react"
import styles from "./MyPage.module.css"

// 임시 사용자 데이터 (추후 API 연동)
const mockUser = {
  name: "이소정",
  email: "sojeong@example.com",
  phone: "010-1234-5678",
  address: "(12345) 인천광역시 미추홀구 OO로 123",
  addressDetail: "OO아파트 101동 101호",
}

// 임시 주문 데이터 (추후 API 연동)
const mockOrders = [
  {
    id: "AP-20250415001",
    date: "2025-04-15",
    status: "배송완료",
    items: [
      {
        name: "[에스티로더] 갈색병 세럼 50ml",
        price: 89000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
      },
    ],
    totalPrice: 89000,
  },
  {
    id: "AP-20250412002",
    date: "2025-04-12",
    status: "배송중",
    items: [
      {
        name: "[나이키] 에어맥스 97 화이트",
        price: 179000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      },
      {
        name: "[무신사] 오버핏 코튼 티셔츠",
        price: 29000,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
      },
    ],
    totalPrice: 237000,
  },
  {
    id: "AP-20250408003",
    date: "2025-04-08",
    status: "주문완료",
    items: [
      {
        name: "[이니스프리] 그린티 씨드 세럼",
        price: 35000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
      },
    ],
    totalPrice: 35000,
  },
]

// 임시 배송지 데이터
const mockAddresses = [
  {
    id: 1,
    name: "이소정",
    phone: "010-1234-5678",
    address: "(12345) 인천광역시 미추홀구 OO로 123",
    addressDetail: "OO아파트 101동 101호",
    isDefault: true,
  },
  {
    id: 2,
    name: "이소정",
    phone: "010-9876-5432",
    address: "(06000) 서울특별시 강남구 테헤란로 123",
    addressDetail: "OO빌딩 5층",
    isDefault: false,
  },
]

const STATUS_CLASS = {
  주문완료: "statusOrder",
  배송중: "statusShipping",
  배송완료: "statusDone",
  취소: "statusCancel",
}

const tabs = [
  { id: "info", label: "내 정보 관리", icon: User },
  { id: "orders", label: "주문 내역", icon: Package },
  { id: "address", label: "배송지 관리", icon: MapPin },
  { id: "seller", label: "판매자 신청", icon: Store },
  { id: "withdrawal", label: "회원 탈퇴", icon: AlertTriangle },
]

export default function MyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")
  const [isEditing, setIsEditing] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)

  const [form, setForm] = useState({
    phone: mockUser.phone,
    address: mockUser.address,
    addressDetail: mockUser.addressDetail,
  })
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePwChange = (e) => {
    const { name, value } = e.target
    setPwForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleInfoSave = () => {
    // 추후 API 연동
    setIsEditing(false)
  }

  const handlePwSave = () => {
    // 추후 API 연동
    setPwForm({ current: "", next: "", confirm: "" })
    setShowPwForm(false)
  }

  const handleWithdraw = () => {
    // 추후 API 연동
    setShowWithdrawConfirm(false)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>마이페이지</h1>

      <div className={styles.layout}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {mockUser.name.slice(0, 1)}
            </div>
            <p className={styles.userName}>{mockUser.name}</p>
            <p className={styles.userEmail}>{mockUser.email}</p>
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
                  <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                    수정
                  </button>
                )}
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이름</span>
                  <span className={styles.infoValue}>{mockUser.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이메일</span>
                  <span className={styles.infoValue}>{mockUser.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>연락처</span>
                  {isEditing ? (
                    <input
                      className={styles.input}
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="010-0000-0000"
                    />
                  ) : (
                    <span className={styles.infoValue}>{form.phone}</span>
                  )}
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>주소</span>
                  {isEditing ? (
                    <div className={styles.addressInputWrap}>
                      <input
                        className={styles.input}
                        name="address"
                        value={form.address}
                        onChange={handleFormChange}
                        placeholder="기본 주소"
                      />
                      <input
                        className={styles.input}
                        name="addressDetail"
                        value={form.addressDetail}
                        onChange={handleFormChange}
                        placeholder="상세 주소"
                      />
                    </div>
                  ) : (
                    <span className={styles.infoValue}>
                      {form.address}<br />{form.addressDetail}
                    </span>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className={styles.actionRow}>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>취소</button>
                  <button className={styles.saveBtn} onClick={handleInfoSave}>저장</button>
                </div>
              )}

              {/* 비밀번호 변경 */}
              <div className={styles.pwSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.subSectionTitle}>비밀번호 변경</h3>
                  <button
                    className={styles.editBtn}
                    onClick={() => setShowPwForm(!showPwForm)}
                  >
                    {showPwForm ? "취소" : "변경"}
                  </button>
                </div>
                {showPwForm && (
                  <div className={styles.pwForm}>
                    <div className={styles.pwInputWrap}>
                      <input
                        className={styles.input}
                        type={showPw ? "text" : "password"}
                        name="current"
                        value={pwForm.current}
                        onChange={handlePwChange}
                        placeholder="현재 비밀번호"
                      />
                      <button
                        className={styles.eyeBtn}
                        onClick={() => setShowPw(!showPw)}
                        aria-label="비밀번호 표시"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className={styles.pwInputWrap}>
                      <input
                        className={styles.input}
                        type={showNewPw ? "text" : "password"}
                        name="next"
                        value={pwForm.next}
                        onChange={handlePwChange}
                        placeholder="새 비밀번호 (영문+숫자+특수문자 8자 이상)"
                      />
                      <button
                        className={styles.eyeBtn}
                        onClick={() => setShowNewPw(!showNewPw)}
                        aria-label="새 비밀번호 표시"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className={styles.pwInputWrap}>
                      <input
                        className={styles.input}
                        type={showConfirmPw ? "text" : "password"}
                        name="confirm"
                        value={pwForm.confirm}
                        onChange={handlePwChange}
                        placeholder="새 비밀번호 확인"
                      />
                      <button
                        className={styles.eyeBtn}
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        aria-label="비밀번호 확인 표시"
                      >
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
              {mockOrders.length === 0 ? (
                <div className={styles.empty}>
                  <Package size={40} color="#d1d5db" />
                  <p>주문 내역이 없습니다.</p>
                </div>
              ) : (
                <div className={styles.orderList}>
                  {mockOrders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div className={styles.orderMeta}>
                          <span className={styles.orderDate}>{order.date}</span>
                          <span className={styles.orderNum}>주문번호 {order.id}</span>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className={styles.orderItems}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItem}>
                            <img src={item.image} alt={item.name} className={styles.orderItemImg} />
                            <div className={styles.orderItemInfo}>
                              <p className={styles.orderItemName}>{item.name}</p>
                              <p className={styles.orderItemMeta}>{item.quantity}개</p>
                              <p className={styles.orderItemPrice}>{(item.price * item.quantity).toLocaleString()}원</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.orderFooter}>
                        <span className={styles.orderTotal}>
                          총 결제 금액 <strong>{order.totalPrice.toLocaleString()}원</strong>
                        </span>
                        {order.status === "주문완료" && (
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
              <div className={styles.addressList}>
                {mockAddresses.map((addr) => (
                  <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ""}`}>
                    <div className={styles.addressCardHeader}>
                      <div className={styles.addressNameWrap}>
                        <span className={styles.addressName}>{addr.name}</span>
                        {addr.isDefault && (
                          <span className={styles.defaultBadge}>기본 배송지</span>
                        )}
                      </div>
                      <div className={styles.addressActions}>
                        {!addr.isDefault && (
                          <button className={styles.addressActionBtn}>기본 설정</button>
                        )}
                        <button className={styles.addressActionBtn}>수정</button>
                        {!addr.isDefault && (
                          <button className={`${styles.addressActionBtn} ${styles.addressDeleteBtn}`}>삭제</button>
                        )}
                      </div>
                    </div>
                    <p className={styles.addressPhone}>{addr.phone}</p>
                    <p className={styles.addressText}>{addr.address}</p>
                    <p className={styles.addressText}>{addr.addressDetail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 판매자 신청 */}
          {activeTab === "seller" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>판매자 신청</h2>
              <div className={styles.sellerApplyCard}>
                <div className={styles.sellerApplyIcon}>
                  <Store size={36} />
                </div>
                <h3 className={styles.sellerApplyTitle}>AllPick 판매자가 되어보세요</h3>
                <p className={styles.sellerApplyDesc}>
                  사업자 정보를 입력하고 신청하면 관리자 검토 후 판매자 기능이 활성화됩니다.
                </p>
                <ul className={styles.sellerApplyList}>
                  <li>상품 등록 및 재고 관리</li>
                  <li>주문 및 배송 처리</li>
                  <li>정산 및 매출 확인</li>
                </ul>
                <p className={styles.sellerApplyNotice}>
                  · 승인까지 영업일 기준 1~3일이 소요됩니다.<br />
                  · 사업자등록증 및 통장 정보가 필요합니다.
                </p>
                <button
                  className={styles.sellerApplyBtn}
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
                  <button
                    className={styles.withdrawalBtn}
                    onClick={() => setShowWithdrawConfirm(true)}
                  >
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
