import { useState, useMemo, useEffect, useCallback } from "react"
import { Search, CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { formatDate } from "../../utils/format"
import styles from "./AdminMemberPage.module.css"
import { approveSeller, rejectSeller } from "../../api/sellerApi"
import {
  getMembers,
  toggleMemberStatus,
  getSellers,
  getPendingSellers,
  toggleSellerStatus,
} from "../../api/adminApi"

const TABS = ["구매자", "판매자", "판매자 승인"]

const sellerStatusLabel = (status) => {
  if (status === "APPROVED") return "승인"
  if (status === "SUSPENDED") return "정지"
  return status
}

export default function AdminMemberPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [buyers, setBuyers] = useState([])
  const [sellers, setSellers] = useState([])
  const [pendingSellers, setPendingSellers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchBuyers = useCallback(() => {
    setLoading(true)
    getMembers()
      .then((data) => setBuyers(data))
      .catch(() => alert("구매자 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  const fetchSellers = useCallback(() => {
    setLoading(true)
    getSellers()
      .then((data) => setSellers(data))
      .catch(() => alert("판매자 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  const fetchPendingSellers = useCallback(() => {
    setLoading(true)
    getPendingSellers()
      .then((data) => setPendingSellers(data))
      .catch(() => alert("승인 대기 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const fetchData =
      activeTab === 0
        ? fetchBuyers
        : activeTab === 1
          ? fetchSellers
          : fetchPendingSellers

    const timeoutId = setTimeout(fetchData, 0)
    return () => clearTimeout(timeoutId)
  }, [activeTab, fetchBuyers, fetchSellers, fetchPendingSellers])

  const filteredBuyers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return buyers
    return buyers.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term)
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

  const handleBuyerStatusToggle = (memberId) => {
    toggleMemberStatus(memberId)
      .then(() =>
        setBuyers((prev) =>
          prev.map((b) =>
            b.id === memberId ? { ...b, status: b.status === 1 ? 0 : 1 } : b
          )
        )
      )
      .catch(() => alert("상태 변경에 실패했습니다."))
  }

  const handleSellerStatusToggle = (sellerId) => {
    toggleSellerStatus(sellerId)
      .then(() =>
        setSellers((prev) =>
          prev.map((s) =>
            s.sellerId === sellerId
              ? { ...s, status: s.status === "APPROVED" ? "SUSPENDED" : "APPROVED" }
              : s
          )
        )
      )
      .catch(() => alert("상태 변경에 실패했습니다."))
  }

  const handleSellerApprove = (sellerId) => {
    if (!window.confirm("승인하시겠습니까?")) return
    approveSeller(sellerId)
      .then(() => {
        const target = pendingSellers.find((s) => s.sellerId === sellerId)
        if (target) setSellers((prev) => [...prev, { ...target, status: "APPROVED" }])
        setPendingSellers((prev) => prev.filter((s) => s.sellerId !== sellerId))
      })
      .catch(() => alert("승인에 실패했습니다."))
  }

  const handleSellerReject = (sellerId) => {
    const rejectReason = window.prompt("거절 사유를 입력해주세요.")
    if (rejectReason === null) return
    rejectSeller(sellerId, rejectReason)
      .then(() => setPendingSellers((prev) => prev.filter((s) => s.sellerId !== sellerId)))
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
                    {loading ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyRow}>불러오는 중...</td>
                      </tr>
                    ) : filteredBuyers.length === 0 ? (
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
                          <td>{formatDate(buyer.createdAt)}</td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                buyer.status === 1 ? styles.statusActive : styles.statusSuspended
                              }`}
                            >
                              {buyer.status === 1 ? "활성" : "정지"}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`${styles.toggleBtn} ${
                                buyer.status === 1 ? styles.toggleBtnDanger : styles.toggleBtnSuccess
                              }`}
                              onClick={() => handleBuyerStatusToggle(buyer.id)}
                            >
                              {buyer.status === 1 ? "정지" : "활성화"}
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
                    {loading ? (
                      <tr>
                        <td colSpan={9} className={styles.emptyRow}>불러오는 중...</td>
                      </tr>
                    ) : filteredSellers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className={styles.emptyRow}>
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredSellers.map((seller) => (
                        <tr key={seller.sellerId}>
                          <td className={styles.idCell}>{seller.sellerId}</td>
                          <td className={styles.nameCell}>{seller.businessName}</td>
                          <td>{seller.businessNumber}</td>
                          <td>{seller.representativeName}</td>
                          <td>{seller.bankName}</td>
                          <td>{seller.bankAccount}</td>
                          <td>{formatDate(seller.createdAt)}</td>
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
                              onClick={() => handleSellerStatusToggle(seller.sellerId)}
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
                    {loading ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyRow}>불러오는 중...</td>
                      </tr>
                    ) : pendingSellers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyRow}>
                          승인 대기 중인 판매자가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      pendingSellers.map((seller) => (
                        <tr key={seller.sellerId}>
                          <td className={styles.idCell}>{seller.sellerId}</td>
                          <td className={styles.nameCell}>{seller.businessName}</td>
                          <td>{seller.businessNumber}</td>
                          <td>{seller.representativeName}</td>
                          <td>{seller.bankName}</td>
                          <td>{seller.bankAccount}</td>
                          <td>{formatDate(seller.createdAt)}</td>
                          <td>
                            <div className={styles.actionGroup}>
                              <button
                                className={`${styles.toggleBtn} ${styles.toggleBtnSuccess}`}
                                onClick={() => handleSellerApprove(seller.sellerId)}
                              >
                                <CheckCircle size={14} />
                                승인
                              </button>
                              <button
                                className={`${styles.toggleBtn} ${styles.toggleBtnDanger}`}
                                onClick={() => handleSellerReject(seller.sellerId)}
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
