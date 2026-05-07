import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/common/AuthLayout"
import { applyForSeller } from "../../api/sellerApi"
import styles from "./SellerApplyPage.module.css"

const INITIAL_FORM = {
  businessName: "",
  businessNumber: "",
  representativeName: "",
  bankName: "",
  bankAccount: "",
}

const BANK_OPTIONS = [
  "국민은행", "신한은행", "하나은행", "우리은행", "농협은행",
  "기업은행", "카카오뱅크", "토스뱅크", "케이뱅크", "SC제일은행",
]

export default function SellerApplyPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.businessName.trim()) {
      newErrors.businessName = "상호명을 입력해주세요."
    }
    if (!form.businessNumber.trim()) {
      newErrors.businessNumber = "사업자등록번호를 입력해주세요."
    } else if (!/^\d{3}-\d{2}-\d{5}$/.test(form.businessNumber)) {
      newErrors.businessNumber = "형식에 맞게 입력해주세요. (예: 123-45-67890)"
    }
    if (!form.representativeName.trim()) {
      newErrors.representativeName = "대표자명을 입력해주세요."
    }
    if (!form.bankName) {
      newErrors.bankName = "은행을 선택해주세요."
    }
    if (!form.bankAccount.trim()) {
      newErrors.bankAccount = "계좌번호를 입력해주세요."
    } else if (!/^\d{10,16}$/.test(form.bankAccount.replace(/-/g, ""))) {
      newErrors.bankAccount = "유효한 계좌번호를 입력해주세요."
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      // 백엔드 SellerApplyRequestDto: businessNumber는 10자리 숫자만 (하이픈 제거)
      await applyForSeller({
        businessName: form.businessName,
        businessNumber: form.businessNumber.replace(/-/g, ""), // 하이픈 제거
        representativeName: form.representativeName,
        bankName: form.bankName,
        bankAccount: form.bankAccount.replace(/-/g, ""),
      })
      navigate("/seller-apply/complete")
    } catch (err) {
      setSubmitError(err.response?.data?.message || "판매자 신청 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="판매자 신청"
      description="사업자 정보를 입력하면 관리자 검토 후 승인됩니다"
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* 상호명 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="businessName">
            상호명 <span className={styles.required}>*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            className={`${styles.input} ${errors.businessName ? styles.inputError : ""}`}
            placeholder="상호명을 입력해주세요"
            value={form.businessName}
            onChange={handleChange}
          />
          {errors.businessName && (
            <p className={styles.errorMsg}>{errors.businessName}</p>
          )}
        </div>

        {/* 사업자등록번호 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="businessNumber">
            사업자등록번호 <span className={styles.required}>*</span>
          </label>
          <input
            id="businessNumber"
            name="businessNumber"
            type="text"
            className={`${styles.input} ${errors.businessNumber ? styles.inputError : ""}`}
            placeholder="000-00-00000"
            value={form.businessNumber}
            onChange={handleChange}
            maxLength={12}
          />
          {errors.businessNumber && (
            <p className={styles.errorMsg}>{errors.businessNumber}</p>
          )}
        </div>

        {/* 대표자명 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="representativeName">
            대표자명 <span className={styles.required}>*</span>
          </label>
          <input
            id="representativeName"
            name="representativeName"
            type="text"
            className={`${styles.input} ${errors.representativeName ? styles.inputError : ""}`}
            placeholder="대표자명을 입력해주세요"
            value={form.representativeName}
            onChange={handleChange}
          />
          {errors.representativeName && (
            <p className={styles.errorMsg}>{errors.representativeName}</p>
          )}
        </div>

        {/* 은행 선택 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bankName">
            은행 <span className={styles.required}>*</span>
          </label>
          <select
            id="bankName"
            name="bankName"
            className={`${styles.select} ${errors.bankName ? styles.inputError : ""}`}
            value={form.bankName}
            onChange={handleChange}
          >
            <option value="">은행을 선택해주세요</option>
            {BANK_OPTIONS.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
          {errors.bankName && (
            <p className={styles.errorMsg}>{errors.bankName}</p>
          )}
        </div>

        {/* 계좌번호 */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bankAccount">
            계좌번호 <span className={styles.required}>*</span>
          </label>
          <input
            id="bankAccount"
            name="bankAccount"
            type="text"
            className={`${styles.input} ${errors.bankAccount ? styles.inputError : ""}`}
            placeholder="계좌번호를 입력해주세요 (숫자만)"
            value={form.bankAccount}
            onChange={handleChange}
          />
          {errors.bankAccount && (
            <p className={styles.errorMsg}>{errors.bankAccount}</p>
          )}
        </div>

        {submitError && (
          <p className={styles.submitError}>{submitError}</p>
        )}

        <div className={styles.notice}>
          <p>· 신청 후 관리자 검토까지 영업일 기준 1~3일이 소요됩니다.</p>
          <p>· 승인 완료 시 판매자 기능이 활성화됩니다.</p>
        </div>

        <div className={styles.btnGroup}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "신청 중..." : "판매자 신청"}
          </button>
        </div>

      </form>
    </AuthLayout>
  )
}
