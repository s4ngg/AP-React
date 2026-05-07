import { useState, useMemo } from "react"
import { Search, CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminMemberPage.module.css"
import { approveSeller, rejectSeller } from "../../api/sellerApi"

const TABS = ["구매자", "판매자", "판매자 승인"]

// 임시 구매자 데이터 (추후 API 연동 예정)
const mockBuyers = [
  { id: 1, name: "김민수", email: "minsu@example.com", joinedAt: "2025-01-15", status: "활성" },
  { id: 2, name: "이영희", email: "younghee@example.com", joinedAt: "2025-02-03", status: "활성" },
  { id: 3, name: "박지성", email: "jisung@example.com", joinedAt: "2025-02-20", status: "정지" },
  { id: 4, name: "최수영", email: "suyoung@example.com", joinedAt: "2025-03-11", status: "활성" },
  { id: 5, name: "정해인", email: "haein@example.com", joinedAt: "2025-03-28", status: "활성" },
]

// 임시 판매자 데이터 — sellers 테이블 기준 (추후 API 연동 예정)
const mockSellers = [
  {
    id: 1,
    memberId: 10,
    businessName: "뷰티스타일샵",
    businessNumber: "123-45-67890",
    representativeName: "홍길동",
    bankName: "국민은행",
    bankAccount: "123-456-789012",
    status: "APPROVED",
    registeredAt: "2025-01-20",
  },
  {
    id: 2,
    memberId: 11,
    businessName: "패션킹",
    businessNumber: "234-56-78901",
    representativeName: "김철수",
    bankName: "신한은행",
    bankAccount: "234-567-890123",
    status: "APPROVED",
    registeredAt: "2025-02-10",
  },
  {
    id: 3,
    memberId: 12,
    businessName: "리빙하우스",
    businessNumber: "345-67-89012",
    representativeName: "이순신",
    bankName: "하나은행",
    bankAccount: "345-678-901234",
    status: "SUSPENDED",
    registeredAt: "2025-03-05",
  },
]

// 임시 승인 대기 판매자 데이터 (추후 API 연동 예정)
const mockPendingSellers = [
  {
    id: 4,
    memberId: 13,
    businessName: "트렌디샵",
    businessNumber: "456-78-90123",
    representativeName: "박영수",
    bankName: "우리은행",
    bankAccount: "456-789-012345",
    status: "PENDING",
    registeredAt: "2025-04-10",
  },
  {
    id: 5,
    memberId: 14,
    businessName: "글로우뷰티",
    businessNumber: "567-89-01234",
    representativeName: "최지연",
    bankName: "카카오뱅크",
    bankAccount: "567-890-123456",
    status: "PENDING",
    registeredAt: "2025-04-14",
  },
]

const sellerStatusLabel = (status) => {
  if (status === "APPROVED") return "승인"
  if (status === "SUSPENDED") return "정지"
  return status
}

export default function AdminMemberPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [buyers, setBuyers] = useState(mockBuyers)
  const [sellers, setSellers] = useState(mockSellers)
  const [pendingSellers, setPendingSellers] = useState(mockPendingSellers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBuyers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return buyers
    return buyers.filter(
      (b) => b.name.toLowerCase().includes(term) || b.email.toLowerCase().includes(term)
    )
  }, [buyers, searchTerm])

  const filteredSellers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return sellers
    return sellers.filter(
      (s) =>
        s.businessName.toLowerCase().includes(term) ||
        s.representativeName.toLowerCase().includes(term)
    )
  }, [sellers, searchTerm])

  const handleTabChange = (index) => {
    setActiveTab(index)
    setSearchTerm("")
  }

  const handleBuyerStatusToggle = (buyerId) => {
    setBuyers((prev) =>
      prev.map((b) =>
        b.id === buyerId ? { ...b, status: b.status === "활성" ? "정지" : "활성" } : b
      )
    )
  }

  const handleSellerStatusToggle = (sellerId) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? { ...s, status: s.status === "APPROVED" ? "SUSPENDED" : "APPROVED" }
          : s
      )
    )
  }

  const handleSellerApprove = (sellerId) => {
    if (!window.confirm("승인하시겠습니까?")) return
    approveSeller(sellerId)
      .then(() => {
        const target = pendingSellers.find((s) => s.id === sellerId)
        if (target) setSellers((prev) => [...prev, { ...target, status: "APPROVED" }])
        setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId))
      })
      .catch(() => alert("승인에 실패했습니다."))
  }

  const handleSellerReject = (sellerId) => {
    const rejectReason = window.prompt("거절 사유를 입력해주세요.")
    if (rejectReason === null) return
    rejectSeller(sellerId, rejectReason)
      .then(() => setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId)))
      .catch(() => alert("거절 처리에 실패했습니다."))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>회원 관리</h1>

        {/* 탭 */}
        <div className={styles.tabList}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === index ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabChange(index)}
            >
              {tab}
              {index === 2 && pendingSellers.length > 0 && (
                <span className={styles.badge}>{pendingSellers.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.section}>

          {/* ── 구매자 탭 ── */}
          {activeTab === 0 && (
            <>
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="이름 또는 이메일로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className={styles.totalCount}>총 {filteredBuyers.length}명</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>가입일</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuyers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyRow}>
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredBuyers.map((buyer) => (
                        <tr key={buyer.id}>
                          <td className={styles.idCell}>{buyer.id}</td>
                          <td className={styles.nameCell}>{buyer.name}</td>
                          <td>{buyer.email}</td>
                          <td>{buyer.joinedAt}</td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                buyer.status === "활성" ? styles.statusActive : styles.statusSuspended
                              }`}
                            >
                              {buyer.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`${styles.toggleBtn} ${
                                buyer.status === "활성" ? styles.toggleBtnDanger : styles.toggleBtnSuccess
                              }`}
                              onClick={() => handleBuyerStatusToggle(buyer.id)}
                            >
                              {buyer.status === "활성" ? "정지" : "활성화"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── 판매자 탭 ── */}
          {activeTab === 1 && (
            <>
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="상호명 또는 대표자명으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className={styles.totalCount}>총 {filteredSellers.length}명</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>상호명</th>
                      <th>사업자등록번호</th>
                      <th>대표자명</th>
                      <th>은행명</th>
                      <th>계좌번호</th>
                      <th>등록일</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSellers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className={styles.emptyRow}>
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredSellers.map((seller) => (
                        <tr key={seller.id}>
                          <td className={styles.idCell}>{seller.id}</td>
                          <td className={styles.nameCell}>{seller.businessName}</td>
                          <td>{seller.businessNumber}</td>
                          <td>{seller.representativeName}</td>
                          <td>{seller.bankName}</td>
                          <td>{seller.bankAccount}</td>
                          <td>{seller.registeredAt}</td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                seller.status === "APPROVED"
                                  ? styles.statusActive
                                  : styles.statusSuspended
                              }`}
                            >
                              {sellerStatusLabel(seller.status)}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`${styles.toggleBtn} ${
                                seller.status === "APPROVED"
                                  ? styles.toggleBtnDanger
                                  : styles.toggleBtnSuccess
                              }`}
                              onClick={() => handleSellerStatusToggle(seller.id)}
                            >
                              {seller.status === "APPROVED" ? "정지" : "활성화"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── 판매자 승인 탭 ── */}
          {activeTab === 2 && (
            <>
              <div className={styles.toolbar}>
                <span className={styles.totalCount}>승인 대기 {pendingSellers.length}건</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>상호명</th>
                      <th>사업자등록번호</th>
                      <th>대표자명</th>
                      <th>은행명</th>
                      <th>계좌번호</th>
                      <th>신청일</th>
                      <th>처리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSellers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyRow}>
                          승인 대기 중인 판매자가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      pendingSellers.map((seller) => (
                        <tr key={seller.id}>
                          <td className={styles.idCell}>{seller.id}</td>
                          <td className={styles.nameCell}>{seller.businessName}</td>
                          <td>{seller.businessNumber}</td>
                          <td>{seller.representativeName}</td>
                          <td>{seller.bankName}</td>
                          <td>{seller.bankAccount}</td>
                          <td>{seller.registeredAt}</td>
                          <td>
                            <div className={styles.actionGroup}>
                              <button
                                className={`${styles.toggleBtn} ${styles.toggleBtnSuccess}`}
                                onClick={() => handleSellerApprove(seller.id)}
                              >
                                <CheckCircle size={14} />
                                승인
                              </button>
                              <button
                                className={`${styles.toggleBtn} ${styles.toggleBtnDanger}`}
                                onClick={() => handleSellerReject(seller.id)}
                              >
                                <XCircle size={14} />
                                거절
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
