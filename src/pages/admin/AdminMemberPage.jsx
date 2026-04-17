import { useState, useMemo } from "react"
import { Search, CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import styles from "./AdminMemberPage.module.css"

const mockBuyers = [
  { id: 1, name: "김민수", email: "minsu@example.com", joinedAt: "2025-01-15", status: "활성" },
  { id: 2, name: "이영희", email: "younghee@example.com", joinedAt: "2025-02-03", status: "활성" },
  { id: 3, name: "박지성", email: "jisung@example.com", joinedAt: "2025-02-20", status: "정지" },
  { id: 4, name: "최수영", email: "suyoung@example.com", joinedAt: "2025-03-11", status: "활성" },
  { id: 5, name: "정해인", email: "haein@example.com", joinedAt: "2025-03-28", status: "활성" },
]

const mockSellers = [
  { id: 1, name: "나이키코리아", email: "nike@seller.com", shopName: "나이키 공식몰", joinedAt: "2025-01-10", status: "활성" },
  { id: 2, name: "설화수", email: "sulwhasoo@seller.com", shopName: "설화수 공식", joinedAt: "2025-02-14", status: "활성" },
  { id: 3, name: "무인양품", email: "muji@seller.com", shopName: "MUJI Korea", joinedAt: "2025-03-01", status: "정지" },
]

const mockPendingSellers = [
  { id: 1, name: "홍길동", email: "hong@apply.com", shopName: "홍길동패션", businessNum: "123-45-67890", appliedAt: "2026-04-15" },
  { id: 2, name: "이순신", email: "lee@apply.com", shopName: "순신뷰티", businessNum: "987-65-43210", appliedAt: "2026-04-16" },
  { id: 3, name: "강감찬", email: "kang@apply.com", shopName: "감찬리빙", businessNum: "456-78-90123", appliedAt: "2026-04-17" },
]

const TABS = ["구매자", "판매자", "판매자 승인"]

export default function AdminMemberPage() {
  const [activeTab, setActiveTab] = useState("구매자")
  const [buyers, setBuyers] = useState(mockBuyers)
  const [sellers, setSellers] = useState(mockSellers)
  const [pendingSellers, setPendingSellers] = useState(mockPendingSellers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredBuyers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return buyers
    return buyers.filter(
      (m) => m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term)
    )
  }, [buyers, searchTerm])

  const filteredSellers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return sellers
    return sellers.filter(
      (m) => m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term)
    )
  }, [sellers, searchTerm])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchTerm("")
  }

  const handleBuyerStatusToggle = (memberId) => {
    setIsLoading(true)
    setTimeout(() => {
      setBuyers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, status: m.status === "활성" ? "정지" : "활성" }
            : m
        )
      )
      setIsLoading(false)
    }, 500)
  }

  const handleSellerStatusToggle = (sellerId) => {
    setIsLoading(true)
    setTimeout(() => {
      setSellers((prev) =>
        prev.map((m) =>
          m.id === sellerId
            ? { ...m, status: m.status === "활성" ? "정지" : "활성" }
            : m
        )
      )
      setIsLoading(false)
    }, 500)
  }

  const handleSellerApprove = (sellerId) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId))
  }

  const handleSellerReject = (sellerId) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId))
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>회원 관리</h1>

        {/* 탭 */}
        <div className={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              {tab === "판매자 승인" && pendingSellers.length > 0 && (
                <span className={styles.badge}>{pendingSellers.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.section}>
          {/* 검색 (판매자 승인 탭에서는 숨김) */}
          {activeTab !== "판매자 승인" && (
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
              <span className={styles.totalCount}>
                총 {activeTab === "구매자" ? filteredBuyers.length : filteredSellers.length}명
              </span>
            </div>
          )}

          {/* 구매자 탭 */}
          {activeTab === "구매자" && (
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
                    <tr><td colSpan={6} className={styles.emptyRow}>검색 결과가 없습니다.</td></tr>
                  ) : (
                    filteredBuyers.map((member) => (
                      <tr key={member.id}>
                        <td className={styles.idCell}>{member.id}</td>
                        <td className={styles.nameCell}>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.joinedAt}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${member.status === "활성" ? styles.statusActive : styles.statusSuspended}`}>
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`${styles.toggleBtn} ${member.status === "활성" ? styles.toggleBtnDanger : styles.toggleBtnSuccess}`}
                            onClick={() => handleBuyerStatusToggle(member.id)}
                            disabled={isLoading}
                          >
                            {member.status === "활성" ? "정지" : "활성화"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 판매자 탭 */}
          {activeTab === "판매자" && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>대표자명</th>
                    <th>샵 이름</th>
                    <th>이메일</th>
                    <th>가입일</th>
                    <th>상태</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length === 0 ? (
                    <tr><td colSpan={7} className={styles.emptyRow}>검색 결과가 없습니다.</td></tr>
                  ) : (
                    filteredSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td className={styles.idCell}>{seller.id}</td>
                        <td className={styles.nameCell}>{seller.name}</td>
                        <td>{seller.shopName}</td>
                        <td>{seller.email}</td>
                        <td>{seller.joinedAt}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${seller.status === "활성" ? styles.statusActive : styles.statusSuspended}`}>
                            {seller.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`${styles.toggleBtn} ${seller.status === "활성" ? styles.toggleBtnDanger : styles.toggleBtnSuccess}`}
                            onClick={() => handleSellerStatusToggle(seller.id)}
                            disabled={isLoading}
                          >
                            {seller.status === "활성" ? "정지" : "활성화"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 판매자 승인 탭 */}
          {activeTab === "판매자 승인" && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>신청자</th>
                    <th>샵 이름</th>
                    <th>사업자번호</th>
                    <th>신청일</th>
                    <th>처리</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSellers.length === 0 ? (
                    <tr><td colSpan={6} className={styles.emptyRow}>대기 중인 신청이 없습니다.</td></tr>
                  ) : (
                    pendingSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td className={styles.idCell}>{seller.id}</td>
                        <td className={styles.nameCell}>{seller.name}</td>
                        <td>{seller.shopName}</td>
                        <td>{seller.businessNum}</td>
                        <td>{seller.appliedAt}</td>
                        <td className={styles.actionCell}>
                          <button
                            className={styles.approveBtn}
                            onClick={() => handleSellerApprove(seller.id)}
                          >
                            <CheckCircle size={14} />
                            승인
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleSellerReject(seller.id)}
                          >
                            <XCircle size={14} />
                            거절
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
